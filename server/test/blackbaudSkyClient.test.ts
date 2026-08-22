import { describe, it, expect } from 'vitest';
import { blackbaudClient } from '../src/services/blackbaudSkyClient.js';
import { dataStore } from '../src/services/mockDataStore.js';

describe('Blackbaud SKY API Client (tms-bmapi)', () => {
  it('should fetch active fee types with GL account mapping', async () => {
    const feeTypes = await blackbaudClient.getFeeTypes();
    expect(feeTypes.length).toBeGreaterThan(0);
    
    const tripFee = feeTypes.find(f => f.feeTypeId === 'FT-TRIP-03');
    expect(tripFee).toBeDefined();
    expect(tripFee?.category).toBe('ACTIVITY');
    expect(tripFee?.glAccountCode).toBe('GL-3030-40');
  });

  it('should create an asynchronous charge import batch', async () => {
    const response = await blackbaudClient.createChargeImportBatch(
      dataStore.environmentContext.environmentId,
      {
        clientBatchReferenceId: `TEST-BATCH-${Date.now()}`,
        batchName: 'Test Field Trip Charge Batch',
        charges: [
          {
            clientChargeReferenceId: 'TEST-CHG-001',
            studentId: 'BB-STU-101',
            familyId: 'BB-FAM-501',
            feeTypeId: 'FT-TRIP-03',
            amount: 125.00,
            dueDate: '2026-09-30',
            description: 'Test Excursion'
          }
        ]
      }
    );

    expect(response.batchId).toBeDefined();
    expect(response.totalRecordsCount).toBe(1);
    expect(response.status).toBe('PROCESSING');
  });

  it('should poll and retrieve batch summary with exponential backoff', async () => {
    const response = await blackbaudClient.createChargeImportBatch(
      dataStore.environmentContext.environmentId,
      {
        clientBatchReferenceId: `TEST-BATCH-SUMMARY-${Date.now()}`,
        batchName: 'Summary Test Batch',
        charges: [
          {
            clientChargeReferenceId: 'TEST-CHG-002',
            studentId: 'BB-STU-102',
            feeTypeId: 'FT-ATHL-02',
            amount: 75.00,
            dueDate: '2026-09-30',
            description: 'Track & Field Uniform'
          }
        ]
      }
    );

    // Wait for simulation delay to complete
    await new Promise(r => setTimeout(r, 2600));

    const summary = await blackbaudClient.getTransactionBatchImportSummary(
      dataStore.environmentContext.environmentId,
      response.batchId
    );

    expect(summary.status).toBe('COMPLETED');
    expect(summary.successfulRecordsCount).toBe(1);
    expect(summary.failedRecordsCount).toBe(0);
  });
});
