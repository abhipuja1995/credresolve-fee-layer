import { describe, it, expect } from 'vitest';
import { feeEngine } from '../src/services/feeEngine.js';
import { reconciliationService } from '../src/services/reconciliationService.js';

describe('CredResolve Universal Fee Engine & Reconciliation', () => {
  it('should target grade 7 students and create fee with batch queue job', async () => {
    const result = await feeEngine.createAndDeployFee({
      title: '7th Grade Science Lab & Microscope Kit',
      description: 'Science lab consumables and field kit.',
      bbFeeTypeId: 'FT-TECH-04',
      baseAmount: 65.00,
      dueDate: '2026-10-15',
      allowPartialPayment: false,
      audience: {
        type: 'GRADE',
        grades: ['Grade 7']
      },
      customFormSchema: [
        {
          id: 'lab_safety_ack',
          label: 'Lab Safety Protocol Acknowledgement',
          type: 'checkbox',
          required: true
        }
      ]
    });

    expect(result.fee.id).toBeDefined();
    expect(result.batchJobId).toBeDefined();
    expect(result.targetedStudentsCount).toBeGreaterThan(0);
  });

  it('should process payment and reconcile subledger balance', async () => {
    // Pick an unpaid charge from the Grade 8 DC trip fee
    const charges = reconciliationService.getStudentCharges({ feeId: 'fee-dc-trip-2026' });
    const unpaidCharge = charges.find(c => c.paymentStatus === 'UNPAID');
    expect(unpaidCharge).toBeDefined();

    const paymentResult = await reconciliationService.processPayment({
      chargeId: unpaidCharge!.id,
      amount: unpaidCharge!.amount,
      paymentMethod: 'APPLE_PAY',
      customFormResponses: {
        tshirt_size: 'Adult L',
        emergency_contact_phone: '+1-555-9988'
      },
      waiverSignature: {
        signerName: 'David Vance',
        agreed: true
      }
    });

    expect(paymentResult.charge.paymentStatus).toBe('PAID');
    expect(paymentResult.transaction.status).toBe('SUCCESS');
    expect(paymentResult.transaction.receiptNumber).toBeDefined();
    expect(['SYNCED', 'POSTED_TO_BLACKBAUD']).toContain(paymentResult.transaction.bbLedgerSyncStatus);
  });
});
