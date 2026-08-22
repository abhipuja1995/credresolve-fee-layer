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
  category: string;
  glAccountCode: string;
  isActive: boolean;
  defaultAmount?: number;
  allowPartialPayment: boolean;
}

export interface FormFieldSchema {
  id: string;
  label: string;
  type: 'text' | 'number' | 'select' | 'multiselect' | 'waiver_signature' | 'checkbox' | 'emergency_contact';
  required: boolean;
  placeholder?: string;
  options?: string[];
  waiverText?: string;
  helpText?: string;
}

export interface UniversalFeeDefinition {
  id: string;
  schoolId: string;
  bbFeeTypeId: string;
  title: string;
  description: string;
  baseAmount: number;
  dueDate: string;
  academicYear: string;
  allowPartialPayment: boolean;
  minPartialAmount?: number;
  audience: {
    type: string;
    grades?: string[];
    classIds?: string[];
    rosterName?: string;
    studentIds?: string[];
  };
  customFormSchema: FormFieldSchema[];
  glAccountOverride?: string;
  status: string;
  createdAt: string;
}

export interface IngestionJobRecord {
  jobId: string;
  feeId: string;
  feeTitle: string;
  clientBatchReferenceId: string;
  bbBatchId?: string;
  status: 'QUEUED' | 'PROCESSING' | 'COMPLETED' | 'COMPLETED_WITH_ERRORS' | 'FAILED';
  totalRecordsCount: number;
  successfulRecordsCount: number;
  failedRecordsCount: number;
  chunksCount: number;
  submittedAt: string;
  completedAt?: string;
  errors: Array<{
    studentId: string;
    errorCode: string;
    errorMessage: string;
  }>;
}

export interface StudentAccount {
  studentId: string;
  familyId: string;
  studentName: string;
  parentName: string;
  parentEmail: string;
  parentPhone: string;
  grade: string;
  homeroom: string;
  currentBalance: number;
  status: string;
}

export interface StudentCharge {
  id: string;
  feeId: string;
  feeTitle: string;
  schoolId: string;
  studentId: string;
  studentName: string;
  parentEmail: string;
  parentPhone: string;
  bbFeeTypeId: string;
  amount: number;
  amountPaid: number;
  dueDate: string;
  paymentStatus: 'UNPAID' | 'PARTIALLY_PAID' | 'PAID' | 'REFUNDED';
  customFormResponses?: Record<string, any>;
  waiverSignedAt?: string;
  waiverSignerName?: string;
  bbSyncStatus: 'QUEUED' | 'SYNCED' | 'FAILED';
  bbBatchId?: string;
  paymentReceipts: Array<{
    transactionId: string;
    amount: number;
    paymentMethod: string;
    paidAt: string;
    receiptNumber: string;
    bbLedgerSyncStatus: string;
  }>;
  createdAt: string;
}

export interface StudentLookupResult {
  student: StudentAccount;
  charges: StudentCharge[];
  totalDue: number;
}

export interface BlackbaudContext {
  environment: {
    environmentId: string;
    schoolName: string;
    subscriptionKey: string;
    accessToken?: string;
    branding: SchoolBranding;
  };
  stats: {
    totalActiveStudents: number;
    totalFeeTypes: number;
    totalDeployedFees: number;
    totalBatchesSubmitted: number;
  };
}
