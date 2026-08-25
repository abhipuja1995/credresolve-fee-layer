import { StudentCharge, PaymentTransaction } from '../types/fee.js';
import { dataStore } from './mockDataStore.js';
import { blackbaudClient } from './blackbaudSkyClient.js';
import { v4 as uuidv4 } from 'uuid';

export interface ProcessPaymentInput {
  chargeId: string;
  amount: number;
  paymentMethod: string;
  checkoutToken?: string;
  paymentConfigurationId?: string;
  cardDetails?: {
    brand: string;
    last4: string;
  };
  customFormResponses?: Record<string, any>;
  waiverSignature?: {
    signerName: string;
    agreed: boolean;
  };
  feeCoverAmount?: number;
}

export class ReconciliationService {
  /**
   * Processes a payer payment via Blackbaud Merchant Services (BBMS) New Checkout,
   * validates forms/waivers, updates student ledger, and records transaction
   */
  async processPayment(input: ProcessPaymentInput): Promise<{
    charge: StudentCharge;
    transaction: PaymentTransaction;
  }> {
    const charge = dataStore.studentCharges.get(input.chargeId);
    if (!charge) {
      throw new Error(`Student charge ID "${input.chargeId}" not found.`);
    }

    const fee = dataStore.fees.get(charge.feeId);
    if (!fee) {
      throw new Error(`Associated Fee definition not found for charge ID "${input.chargeId}".`);
    }

    if (input.amount <= 0) {
      throw new Error('Payment amount must be greater than $0.00');
    }

    const remainingBalance = charge.amount - charge.amountPaid;
    if (input.amount > remainingBalance) {
      throw new Error(`Payment amount ($${input.amount}) exceeds outstanding balance of $${remainingBalance}.`);
    }

    if (!fee.allowPartialPayment && input.amount < charge.amount) {
      throw new Error(`Partial payments are not permitted for "${fee.title}". Full balance of $${charge.amount} is required.`);
    }

    // Validate Required Custom Form Fields
    if (fee.customFormSchema && fee.customFormSchema.length > 0) {
      for (const field of fee.customFormSchema) {
        if (field.type === 'waiver_signature') {
          if (field.required && (!input.waiverSignature || !input.waiverSignature.agreed || !input.waiverSignature.signerName.trim())) {
            throw new Error(`Required Waiver Consent & Signature missing: Please sign "${field.label}" to proceed.`);
          }
        } else if (field.required) {
          const val = input.customFormResponses?.[field.id];
          if (val === undefined || val === null || val === '') {
            throw new Error(`Required field missing: "${field.label}" must be provided.`);
          }
        }
      }
    }

    // Execute Blackbaud Merchant Services (BBMS) New Checkout Transaction Finalize
    const checkoutToken = input.checkoutToken || `chk_tok_${uuidv4().substring(0, 12)}`;
    const student = dataStore.students.find(s => s.studentId === charge.studentId);
    
    const bbmsResult = await blackbaudClient.createCheckoutTransaction({
      checkoutToken,
      chargeId: charge.id,
      amount: input.amount,
      paymentConfigurationId: input.paymentConfigurationId || dataStore.environmentContext.paymentConfigurationId,
      donorEmail: charge.parentEmail,
      cardholderName: input.waiverSignature?.signerName || student?.parentName,
      customFields: {
        studentId: charge.studentId,
        studentName: charge.studentName,
        feeTitle: charge.feeTitle,
        bbFeeTypeId: charge.bbFeeTypeId
      },
      waiverSignature: input.waiverSignature,
      feeCoverAmount: input.feeCoverAmount
    });

    const now = bbmsResult.paidAt || new Date().toISOString();

    // Create payment transaction
    const transaction: PaymentTransaction = {
      transactionId: bbmsResult.transactionId,
      chargeId: charge.id,
      amount: input.amount,
      paymentMethod: input.paymentMethod || bbmsResult.paymentMethod,
      cardBrand: input.cardDetails?.brand || bbmsResult.cardBrand || 'Visa',
      last4: input.cardDetails?.last4 || bbmsResult.last4 || '4242',
      status: 'SUCCESS',
      paidAt: now,
      receiptNumber: bbmsResult.receiptNumber,
      bbLedgerSyncStatus: 'POSTED_TO_BLACKBAUD',
      bbmsAuthorizationCode: bbmsResult.authorizationCode,
      subledgerJournalEntryId: bbmsResult.subledgerJournalEntryId,
      checkoutToken
    };

    // Update Charge subledger
    charge.amountPaid += input.amount;
    charge.paymentStatus = charge.amountPaid >= charge.amount ? 'PAID' : 'PARTIALLY_PAID';
    
    if (input.customFormResponses) {
      charge.customFormResponses = {
        ...(charge.customFormResponses || {}),
        ...input.customFormResponses
      };
    }

    if (input.waiverSignature && input.waiverSignature.agreed) {
      charge.waiverSignedAt = now;
      charge.waiverSignerName = input.waiverSignature.signerName.trim();
    }

    charge.paymentReceipts.push(transaction);
    charge.updatedAt = now;

    // Update Student Account balance
    if (student) {
      student.currentBalance = Math.max(0, student.currentBalance - input.amount);
    }

    return {
      charge,
      transaction
    };
  }

  /**
   * Retrieves all student charges with optional filters
   */
  getStudentCharges(filter?: { feeId?: string; studentId?: string; status?: string }): StudentCharge[] {
    let list = Array.from(dataStore.studentCharges.values());
    if (filter?.feeId) list = list.filter(c => c.feeId === filter.feeId);
    if (filter?.studentId) list = list.filter(c => c.studentId === filter.studentId);
    if (filter?.status) list = list.filter(c => c.paymentStatus === filter.status);
    return list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  /**
   * Retrieves a single charge by ID
   */
  getChargeById(chargeId: string): StudentCharge | undefined {
    return dataStore.studentCharges.get(chargeId);
  }
}

export const reconciliationService = new ReconciliationService();
