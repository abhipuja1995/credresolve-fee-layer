/**
 * Blackbaud SKY API (tms-bmapi & BBMS Payments New Checkout) Type Definitions
 */

export interface SchoolBranding {
  schoolName: string;
  logoUrl?: string;
  primaryColor: string;
  secondaryColor: string;
  backgroundColor: string;
  textColor: string;
  surfaceColor: string;
}

export interface BlackbaudFeeType {
  feeTypeId: string;
  name: string;
  description?: string;
  category: 'TUITION' | 'MANDATORY_FEE' | 'OPTIONAL_FEE' | 'ATHLETIC' | 'ACTIVITY' | 'LATE_FEE' | 'OTHER';
  glAccountCode: string;
  isActive: boolean;
  defaultAmount?: number;
  allowPartialPayment: boolean;
}

export interface BlackbaudChargeItem {
  clientChargeReferenceId: string;
  studentId: string;
  familyId?: string;
  feeTypeId: string;
  amount: number;
  dueDate: string; // ISO string YYYY-MM-DD
  description: string;
  glAccountOverride?: string;
  academicYear?: string;
}

export interface CreateChargeImportBatchRequest {
  clientBatchReferenceId: string;
  batchName: string;
  charges: BlackbaudChargeItem[];
}

export interface CreateChargeImportBatchResponse {
  batchId: string;
  clientBatchReferenceId: string;
  status: 'QUEUED' | 'PROCESSING' | 'COMPLETED' | 'FAILED';
  submittedAt: string;
  totalRecordsCount: number;
}

export type BlackbaudBatchStatus = 'QUEUED' | 'PROCESSING' | 'COMPLETED' | 'COMPLETED_WITH_ERRORS' | 'FAILED';

export interface BlackbaudBatchRowError {
  clientChargeReferenceId: string;
  studentId: string;
  errorCode: string;
  errorMessage: string;
  rowIndex: number;
}

export interface TransactionBatchImportSummary {
  batchId: string;
  clientBatchReferenceId: string;
  status: BlackbaudBatchStatus;
  totalRecordsCount: number;
  successfulRecordsCount: number;
  failedRecordsCount: number;
  submittedAt: string;
  completedAt?: string;
  processingTimeMs?: number;
  errors: BlackbaudBatchRowError[];
}

export interface BlackbaudEnvironmentContext {
  environmentId: string;
  schoolName: string;
  subscriptionKey: string;
  accessToken?: string;
  tokenExpiresAt?: string;
  paymentConfigurationId: string;
  branding: SchoolBranding;
}

/**
 * Blackbaud Merchant Services (BBMS) - SKY Payments New Checkout
 * Integration Reference: https://developer.blackbaud.com/skyapi/products/bbms/payments/integrations/new-checkout
 */
export interface BlackbaudPaymentConfiguration {
  paymentConfigurationId: string;
  name: string;
  currency: string;
  merchantAccountId: string;
  supportsApplePay: boolean;
  supportsGooglePay: boolean;
  supportsAch: boolean;
  supportsPayPalVenmo: boolean;
  useCompleteCover: boolean;
}

export interface BlackbaudCheckoutTransactionRequest {
  checkoutToken: string;
  chargeId: string;
  amount: number;
  paymentConfigurationId?: string;
  donorEmail?: string;
  cardholderName?: string;
  billingAddress?: {
    street?: string;
    city?: string;
    state?: string;
    postcode?: string;
    country?: string;
  };
  customFields?: Record<string, any>;
  waiverSignature?: {
    signerName: string;
    agreed: boolean;
  };
  feeCoverAmount?: number;
}

export interface BlackbaudCheckoutTransactionResponse {
  success: boolean;
  transactionId: string;
  authorizationCode: string;
  receiptNumber: string;
  amount: number;
  feeCoverAmount?: number;
  paymentMethod: string;
  cardBrand?: string;
  last4?: string;
  status: 'SUCCESS' | 'SETTLED';
  bbLedgerSyncStatus: 'POSTED_TO_BLACKBAUD';
  subledgerJournalEntryId: string;
  paidAt: string;
}
