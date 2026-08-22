/**
 * Blackbaud SKY API (tms-bmapi) Type Definitions
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
  branding: SchoolBranding;
}
