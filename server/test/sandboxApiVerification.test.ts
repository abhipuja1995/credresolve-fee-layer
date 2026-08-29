import { describe, it, expect, beforeEach } from 'vitest';
import { BlackbaudSkyApiClient } from '../src/services/blackbaudSkyClient.js';
import { feeEngine } from '../src/services/feeEngine.js';
import { reconciliationService } from '../src/services/reconciliationService.js';
import { dataStore } from '../src/services/mockDataStore.js';

describe('Blackbaud SKY API (tms-bmapi) Sandbox & Engine Verification', () => {
  let client: BlackbaudSkyApiClient;

  beforeEach(() => {
    client = new BlackbaudSkyApiClient({
      environmentId: 'bb-env-stjude-2026',
      subscriptionKey: 'sk_test_mock_12345',
      isSandbox: true
    });
  });

  it('1. GET /fee-types - Successfully retrieves fee categories and GL account mappings', async () => {
    const feeTypes = await client.getFeeTypes('bb-env-stjude-2026');
    expect(feeTypes).toBeDefined();
    expect(Array.isArray(feeTypes)).toBe(true);
    expect(feeTypes.length).toBeGreaterThan(0);

    const tripFee = feeTypes.find(f => f.feeTypeId === 'FT-TRIP-03');
    expect(tripFee).toBeDefined();
    expect(tripFee?.name).toBe('Field Trip & Educational Excursion');
    expect(tripFee?.glAccountCode).toBe('GL-3030-40');
    expect(tripFee?.category).toBe('ACTIVITY');
  });

  it('2. POST /batches/charges - Submits async charge batch and receives BATCH ID with PROCESSING status', async () => {
    const batchReq = {
      clientBatchReferenceId: `BATCH-VERIFY-${Date.now()}`,
      academicYear: '2026-2027',
      feeTypeId: 'FT-TECH-04',
      charges: [
        {
          clientChargeReferenceId: `CHG-TEST-001`,
          studentId: 'BB-STU-105',
          amount: 250.00,
          dueDate: '2026-09-30',
          description: 'STEM Lab & 1-to-1 Device Fee'
        },
        {
          clientChargeReferenceId: `CHG-TEST-002`,
          studentId: 'BB-STU-106',
          amount: 250.00,
          dueDate: '2026-09-30',
          description: 'STEM Lab & 1-to-1 Device Fee'
        }
      ]
    };

    const res = await client.createChargeImportBatch('bb-env-stjude-2026', batchReq);
    expect(res).toBeDefined();
    expect(res.batchId).toMatch(/^BATCH-BB-/);
    expect(res.status).toBe('PROCESSING');
    expect(res.totalRecordsCount).toBe(2);
  });

  it('3. GET /batches/charges/summary/{batch_id} - Polls async batch until COMPLETED', async () => {
    const batchReq = {
      clientBatchReferenceId: `BATCH-POLL-${Date.now()}`,
      academicYear: '2026-2027',
      feeTypeId: 'FT-ATHL-02',
      charges: [
        {
          clientChargeReferenceId: `CHG-POLL-001`,
          studentId: 'BB-STU-101',
          amount: 175.00,
          dueDate: '2026-10-15',
          description: 'Athletic Fee & Varsity Uniforms'
        }
      ]
    };

    const created = await client.createChargeImportBatch('bb-env-stjude-2026', batchReq);
    expect(created.status).toBe('PROCESSING');

    // Poll until complete
    let summary = await client.getTransactionBatchImportSummary('bb-env-stjude-2026', created.batchId);
    let attempts = 0;
    while (summary.status === 'PROCESSING' && attempts < 10) {
      await new Promise(r => setTimeout(r, 600));
      summary = await client.getTransactionBatchImportSummary('bb-env-stjude-2026', created.batchId);
      attempts++;
    }

    expect(summary.status).toBe('COMPLETED');
    expect(summary.successfulRecordsCount).toBe(1);
    expect(summary.failedRecordsCount).toBe(0);
    expect(summary.errors.length).toBe(0);
  });

  it('4. Row-Level Error Diagnostics - Isolates invalid student IDs with STUDENT_NOT_FOUND', async () => {
    const batchReq = {
      clientBatchReferenceId: `BATCH-ERR-TEST-${Date.now()}`,
      academicYear: '2026-2027',
      feeTypeId: 'FT-TRIP-03',
      charges: [
        {
          clientChargeReferenceId: `CHG-VALID-01`,
          studentId: 'BB-STU-101',
          amount: 125.00,
          dueDate: '2026-10-15',
          description: 'Valid student charge'
        },
        {
          clientChargeReferenceId: `CHG-INVALID-02`,
          studentId: 'UNKNOWN-STUDENT-999',
          amount: 125.00,
          dueDate: '2026-10-15',
          description: 'Invalid student ID'
        }
      ]
    };

    const created = await client.createChargeImportBatch('bb-env-stjude-2026', batchReq);
    
    // Wait for simulation completion
    await new Promise(r => setTimeout(r, 2600));
    const summary = await client.getTransactionBatchImportSummary('bb-env-stjude-2026', created.batchId);

    expect(summary.status).toBe('COMPLETED_WITH_ERRORS');
    expect(summary.successfulRecordsCount).toBe(1);
    expect(summary.failedRecordsCount).toBe(1);
    expect(summary.errors.length).toBe(1);
    expect(summary.errors[0].errorCode).toBe('STUDENT_NOT_FOUND');
    expect(summary.errors[0].studentId).toBe('UNKNOWN-STUDENT-999');
  });

  it('5. End-to-End Subledger Reconciliation - Captures payment, signs waiver, updates balance, and issues official receipt', async () => {
    // 1. Create a fee
    const feeResult = await feeEngine.createAndDeployFee({
      title: 'Robotics Summer Camp 2026',
      description: 'Term workshop access and robotics materials kit.',
      bbFeeTypeId: 'FT-CAMP-06',
      baseAmount: 320.00,
      dueDate: '2026-08-30',
      academicYear: '2026-2027',
      allowPartialPayment: true,
      minPartialAmount: 100.00,
      audience: {
        type: 'GRADE',
        grades: ['Grade 8']
      },
      customFormSchema: [
        {
          id: 'camp_waiver',
          label: 'Camp Liability Waiver',
          type: 'waiver_signature',
          required: true,
          waiverText: 'I agree to the summer camp safety guidelines.'
        }
      ]
    });

    expect(feeResult.fee.id).toBeDefined();
    expect(feeResult.targetedStudentsCount).toBeGreaterThan(0);

    // 2. Fetch created student charge
    const charges = reconciliationService.getStudentCharges({ feeId: feeResult.fee.id });
    expect(charges.length).toBeGreaterThan(0);
    const targetCharge = charges[0];

    // 3. Process checkout payment
    const checkoutResult = await reconciliationService.processPayment({
      chargeId: targetCharge.id,
      amount: 320.00,
      paymentMethod: 'APPLE_PAY',
      customFormResponses: {},
      waiverSignature: {
        signerName: 'Michael Hayes',
        agreed: true
      }
    });

    expect(checkoutResult.transaction).toBeDefined();
    expect(checkoutResult.transaction.status).toBe('SUCCESS');
    expect(checkoutResult.transaction.receiptNumber).toMatch(/^REC-/);
    expect(['SYNCED', 'POSTED_TO_BLACKBAUD']).toContain(checkoutResult.transaction.bbLedgerSyncStatus);

    // 4. Verify updated subledger charge
    const updatedCharge = reconciliationService.getChargeById(targetCharge.id);
    expect(updatedCharge?.paymentStatus).toBe('PAID');
    expect(updatedCharge?.amountPaid).toBe(320.00);
    expect(updatedCharge?.waiverSignerName).toBe('Michael Hayes');
    expect(updatedCharge?.paymentReceipts.length).toBe(1);
  });
});
