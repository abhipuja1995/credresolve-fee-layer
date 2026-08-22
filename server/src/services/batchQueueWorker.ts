import { BlackbaudChargeItem, TransactionBatchImportSummary, BlackbaudBatchStatus } from '../types/blackbaud.js';
import { blackbaudClient } from './blackbaudSkyClient.js';
import { dataStore } from './mockDataStore.js';
import { v4 as uuidv4 } from 'uuid';

export interface EnqueueBatchParams {
  feeId: string;
  feeTitle: string;
  charges: BlackbaudChargeItem[];
}

export interface IngestionJobRecord {
  jobId: string;
  feeId: string;
  feeTitle: string;
  clientBatchReferenceId: string;
  bbBatchId?: string;
  status: BlackbaudBatchStatus;
  totalRecordsCount: number;
  successfulRecordsCount: number;
  failedRecordsCount: number;
  chunksCount: number;
  submittedAt: string;
  completedAt?: string;
  summary?: TransactionBatchImportSummary;
  errors: Array<{
    studentId: string;
    errorCode: string;
    errorMessage: string;
  }>;
}

export class BatchQueueWorker {
  private jobs: Map<string, IngestionJobRecord> = new Map();
  private isProcessing = false;
  private queue: Array<{
    jobId: string;
    params: EnqueueBatchParams;
  }> = [];

  /**
   * Enqueues a fee batch ingestion request
   */
  async enqueueBatch(params: EnqueueBatchParams): Promise<string> {
    const jobId = `JOB-${uuidv4().substring(0, 8).toUpperCase()}`;
    const clientBatchRef = `BATCH-REF-${params.feeId.toUpperCase()}-${Date.now().toString().slice(-4)}`;

    const jobRecord: IngestionJobRecord = {
      jobId,
      feeId: params.feeId,
      feeTitle: params.feeTitle,
      clientBatchReferenceId: clientBatchRef,
      status: 'QUEUED',
      totalRecordsCount: params.charges.length,
      successfulRecordsCount: 0,
      failedRecordsCount: 0,
      chunksCount: Math.ceil(params.charges.length / 500) || 1,
      submittedAt: new Date().toISOString(),
      errors: []
    };

    this.jobs.set(jobId, jobRecord);
    this.queue.push({ jobId, params });

    // Trigger async queue execution
    setTimeout(() => this.processNext(), 50);

    return jobId;
  }

  /**
   * Processes queue items asynchronously
   */
  private async processNext() {
    if (this.isProcessing || this.queue.length === 0) return;

    this.isProcessing = true;
    const current = this.queue.shift();

    if (!current) {
      this.isProcessing = false;
      return;
    }

    const { jobId, params } = current;
    const jobRecord = this.jobs.get(jobId);

    if (!jobRecord) {
      this.isProcessing = false;
      return;
    }

    try {
      jobRecord.status = 'PROCESSING';

      // 1. Chunk charges (Max 500 per Blackbaud spec)
      const chunkSize = 500;
      const chunks: BlackbaudChargeItem[][] = [];
      for (let i = 0; i < params.charges.length; i += chunkSize) {
        chunks.push(params.charges.slice(i, i + chunkSize));
      }

      // If charges array is empty (e.g. public open fee), mark completed
      if (chunks.length === 0) {
        jobRecord.status = 'COMPLETED';
        jobRecord.completedAt = new Date().toISOString();
        this.isProcessing = false;
        this.processNext();
        return;
      }

      for (let cIdx = 0; cIdx < chunks.length; cIdx++) {
        const chunk = chunks[cIdx];
        const chunkBatchRef = `${jobRecord.clientBatchReferenceId}-C${cIdx + 1}`;

        // 2. Submit charge batch to Blackbaud SKY API
        const bbResponse = await blackbaudClient.createChargeImportBatch(
          dataStore.environmentContext.environmentId,
          {
            clientBatchReferenceId: chunkBatchRef,
            batchName: `CredResolve Import: ${params.feeTitle} (Chunk ${cIdx + 1}/${chunks.length})`,
            charges: chunk
          }
        );

        jobRecord.bbBatchId = bbResponse.batchId;

        // 3. Poll GetTransactionBatchImportSummary with Exponential Backoff
        const summary = await this.pollBatchSummaryWithBackoff(
          dataStore.environmentContext.environmentId,
          bbResponse.batchId
        );

        jobRecord.summary = summary;
        jobRecord.successfulRecordsCount += summary.successfulRecordsCount;
        jobRecord.failedRecordsCount += summary.failedRecordsCount;

        if (summary.errors && summary.errors.length > 0) {
          summary.errors.forEach(err => {
            jobRecord.errors.push({
              studentId: err.studentId,
              errorCode: err.errorCode,
              errorMessage: err.errorMessage
            });
          });
        }

        // 4. Update individual StudentCharge statuses
        chunk.forEach(chg => {
          const chargeId = `CHG-${params.feeId}-${chg.studentId}`;
          const studentCharge = dataStore.studentCharges.get(chargeId);
          if (studentCharge) {
            const hasRowError = summary.errors.some(e => e.studentId === chg.studentId);
            studentCharge.bbSyncStatus = hasRowError ? 'FAILED' : 'SYNCED';
            studentCharge.bbBatchId = bbResponse.batchId;
            studentCharge.updatedAt = new Date().toISOString();
          }
        });
      }

      // Finalize Job Status
      if (jobRecord.failedRecordsCount > 0) {
        jobRecord.status = jobRecord.successfulRecordsCount > 0 ? 'COMPLETED_WITH_ERRORS' : 'FAILED';
      } else {
        jobRecord.status = 'COMPLETED';
      }
      jobRecord.completedAt = new Date().toISOString();

    } catch (err: any) {
      console.error(`[BatchQueueWorker] Job ${jobId} failed:`, err);
      jobRecord.status = 'FAILED';
      jobRecord.errors.push({
        studentId: 'BATCH_LEVEL',
        errorCode: 'BATCH_SUBMISSION_EXCEPTION',
        errorMessage: err.message || 'Unknown batch ingestion error'
      });
      jobRecord.completedAt = new Date().toISOString();
    } finally {
      this.isProcessing = false;
      this.processNext();
    }
  }

  /**
   * Polls GetTransactionBatchImportSummary with backoff until completed
   */
  private async pollBatchSummaryWithBackoff(
    environmentId: string, 
    batchId: string, 
    maxAttempts = 10
  ): Promise<TransactionBatchImportSummary> {
    let delayMs = 300; // initial delay

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      await new Promise(resolve => setTimeout(resolve, delayMs));

      const summary = await blackbaudClient.getTransactionBatchImportSummary(environmentId, batchId);
      
      if (summary.status === 'COMPLETED' || summary.status === 'COMPLETED_WITH_ERRORS' || summary.status === 'FAILED') {
        return summary;
      }

      delayMs = Math.min(delayMs * 1.5, 3000); // Exponential backoff up to 3s
    }

    // Return current summary if reached max attempts
    return await blackbaudClient.getTransactionBatchImportSummary(environmentId, batchId);
  }

  getJob(jobId: string): IngestionJobRecord | undefined {
    return this.jobs.get(jobId);
  }

  getAllJobs(): IngestionJobRecord[] {
    return Array.from(this.jobs.values()).sort(
      (a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime()
    );
  }
}

export const batchQueueWorker = new BatchQueueWorker();
