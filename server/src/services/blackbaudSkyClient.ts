import { 
  BlackbaudFeeType, 
  CreateChargeImportBatchRequest, 
  CreateChargeImportBatchResponse, 
  TransactionBatchImportSummary,
  BlackbaudBatchRowError 
} from '../types/blackbaud.js';
import { dataStore } from './mockDataStore.js';
import { v4 as uuidv4 } from 'uuid';

export interface BlackbaudClientConfig {
  baseUrl?: string;
  subscriptionKey: string;
  environmentId: string;
  isSandbox?: boolean;
}

export class BlackbaudSkyApiClient {
  private config: BlackbaudClientConfig;
  private pendingBatchSimulations: Map<string, {
    summary: TransactionBatchImportSummary;
    completionTimestamp: number;
  }> = new Map();

  constructor(config?: Partial<BlackbaudClientConfig>) {
    this.config = {
      baseUrl: process.env.BLACKBAUD_API_BASE_URL || 'https://api.sky.blackbaud.com/tms-bmapi/v1',
      subscriptionKey: config?.subscriptionKey || dataStore.environmentContext.subscriptionKey,
      environmentId: config?.environmentId || dataStore.environmentContext.environmentId,
      isSandbox: config?.isSandbox ?? true
    };
  }

  /**
   * GET /fee-types
   * Fetches active fee categories and general ledger distribution accounts
   */
  async getFeeTypes(environmentId?: string): Promise<BlackbaudFeeType[]> {
    const env = environmentId || this.config.environmentId;

    if (!this.config.isSandbox && process.env.BLACKBAUD_OAUTH_TOKEN) {
      try {
        const res = await fetch(`${this.config.baseUrl}/fee-types?environment_id=${env}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${process.env.BLACKBAUD_OAUTH_TOKEN}`,
            'Bb-Api-Subscription-Key': this.config.subscriptionKey,
            'Content-Type': 'application/json'
          }
        });

        if (!res.ok) {
          throw new Error(`Blackbaud SKY API error (${res.status}): ${await res.text()}`);
        }

        const data = await res.json() as { value: BlackbaudFeeType[] };
        return data.value;
      } catch (err) {
        console.warn('[BlackbaudSkyApiClient] Live API call failed, falling back to local cached fee types:', err);
      }
    }

    // Sandbox / Cached fee types
    return dataStore.feeTypes.filter(ft => ft.isActive);
  }

  /**
   * POST /batches/charges
   * Asynchronously submits a batch of student/family charges to Blackbaud subledger
   */
  async createChargeImportBatch(
    environmentId: string, 
    request: CreateChargeImportBatchRequest
  ): Promise<CreateChargeImportBatchResponse> {
    if (!request.charges || request.charges.length === 0) {
      throw new Error('Cannot create charge import batch: No charge records provided.');
    }

    if (request.charges.length > 500) {
      throw new Error(`Batch size exceeds Blackbaud single-batch maximum of 500 records (Received: ${request.charges.length}). Split payload before calling.`);
    }

    if (!this.config.isSandbox && process.env.BLACKBAUD_OAUTH_TOKEN) {
      try {
        const res = await fetch(`${this.config.baseUrl}/batches/charges?environment_id=${environmentId}`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${process.env.BLACKBAUD_OAUTH_TOKEN}`,
            'Bb-Api-Subscription-Key': this.config.subscriptionKey,
            'Content-Type': 'application/json',
            'Idempotency-Key': request.clientBatchReferenceId
          },
          body: JSON.stringify(request)
        });

        if (!res.ok) {
          throw new Error(`Blackbaud SKY API error (${res.status}): ${await res.text()}`);
        }

        return await res.json() as CreateChargeImportBatchResponse;
      } catch (err) {
        console.warn('[BlackbaudSkyApiClient] Live batch submission failed, using simulator:', err);
      }
    }

    // High-Fidelity Simulator
    const generatedBatchId = `BATCH-BB-${Date.now().toString().slice(-6)}`;
    const submittedAt = new Date().toISOString();

    // Check for row-level simulation edge cases (e.g. inactive student ID or invalid amount)
    const simulatedErrors: BlackbaudBatchRowError[] = [];
    let successfulCount = 0;

    request.charges.forEach((charge, idx) => {
      // Simulate known student verification against store
      const studentExists = dataStore.students.some(s => s.studentId === charge.studentId);
      if (!studentExists && !charge.studentId.startsWith('BB-STU-')) {
        simulatedErrors.push({
          clientChargeReferenceId: charge.clientChargeReferenceId,
          studentId: charge.studentId,
          errorCode: 'STUDENT_NOT_FOUND',
          errorMessage: `Student ID ${charge.studentId} was not found in active Blackbaud enrollment roster.`,
          rowIndex: idx + 1
        });
      } else if (charge.amount <= 0) {
        simulatedErrors.push({
          clientChargeReferenceId: charge.clientChargeReferenceId,
          studentId: charge.studentId,
          errorCode: 'INVALID_CHARGE_AMOUNT',
          errorMessage: `Charge amount must be greater than zero. Received: $${charge.amount}.`,
          rowIndex: idx + 1
        });
      } else {
        successfulCount++;
      }
    });

    const hasErrors = simulatedErrors.length > 0;
    const finalStatus = hasErrors ? (successfulCount > 0 ? 'COMPLETED_WITH_ERRORS' : 'FAILED') : 'COMPLETED';

    // Simulate async processing time (completes in 2.5 seconds)
    const completionDelayMs = 2500;
    const summary: TransactionBatchImportSummary = {
      batchId: generatedBatchId,
      clientBatchReferenceId: request.clientBatchReferenceId,
      status: 'PROCESSING',
      totalRecordsCount: request.charges.length,
      successfulRecordsCount: 0,
      failedRecordsCount: 0,
      submittedAt,
      errors: []
    };

    // Save initial batch
    dataStore.batches.set(generatedBatchId, summary);

    // Schedule simulation completion
    this.pendingBatchSimulations.set(generatedBatchId, {
      summary: {
        ...summary,
        status: finalStatus,
        successfulRecordsCount: successfulCount,
        failedRecordsCount: simulatedErrors.length,
        completedAt: new Date(Date.now() + completionDelayMs).toISOString(),
        processingTimeMs: completionDelayMs,
        errors: simulatedErrors
      },
      completionTimestamp: Date.now() + completionDelayMs
    });

    return {
      batchId: generatedBatchId,
      clientBatchReferenceId: request.clientBatchReferenceId,
      status: 'PROCESSING',
      submittedAt,
      totalRecordsCount: request.charges.length
    };
  }

  /**
   * GET /batches/charges/summary/{batch_id}
   * Checks the progress and retrieves row-level results of an import batch
   */
  async getTransactionBatchImportSummary(
    environmentId: string, 
    batchId: string
  ): Promise<TransactionBatchImportSummary> {
    if (!this.config.isSandbox && process.env.BLACKBAUD_OAUTH_TOKEN) {
      try {
        const res = await fetch(`${this.config.baseUrl}/batches/charges/summary/${batchId}?environment_id=${environmentId}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${process.env.BLACKBAUD_OAUTH_TOKEN}`,
            'Bb-Api-Subscription-Key': this.config.subscriptionKey,
            'Content-Type': 'application/json'
          }
        });

        if (!res.ok) {
          throw new Error(`Blackbaud SKY API error (${res.status}): ${await res.text()}`);
        }

        return await res.json() as TransactionBatchImportSummary;
      } catch (err) {
        console.warn('[BlackbaudSkyApiClient] Live summary check failed, querying local store:', err);
      }
    }

    // Check pending simulation
    const pending = this.pendingBatchSimulations.get(batchId);
    if (pending) {
      if (Date.now() >= pending.completionTimestamp) {
        // Complete the batch in dataStore
        dataStore.batches.set(batchId, pending.summary);
        this.pendingBatchSimulations.delete(batchId);
        return pending.summary;
      } else {
        // Still processing
        return {
          batchId,
          clientBatchReferenceId: pending.summary.clientBatchReferenceId,
          status: 'PROCESSING',
          totalRecordsCount: pending.summary.totalRecordsCount,
          successfulRecordsCount: 0,
          failedRecordsCount: 0,
          submittedAt: pending.summary.submittedAt,
          errors: []
        };
      }
    }

    const existing = dataStore.batches.get(batchId);
    if (!existing) {
      throw new Error(`Blackbaud Batch ID "${batchId}" not found in system.`);
    }

    return existing;
  }
}

export const blackbaudClient = new BlackbaudSkyApiClient();
