/**
 * CredResolve Universal Fee Layer Type Definitions
 */

export type FormFieldType = 
  | 'text' 
  | 'number' 
  | 'select' 
  | 'multiselect' 
  | 'waiver_signature' 
  | 'checkbox' 
  | 'emergency_contact';

export interface FormFieldSchema {
  id: string;
  label: string;
  type: FormFieldType;
  required: boolean;
  placeholder?: string;
  options?: string[]; // for select/multiselect
  waiverText?: string; // for waiver_signature
  helpText?: string;
}

export type AudienceType = 
  | 'ALL_STUDENTS' 
  | 'GRADE' 
  | 'CLASS' 
  | 'ATHLETIC_ROSTER' 
  | 'CUSTOM_STUDENT_IDS' 
  | 'PUBLIC_LINK';

export interface AudienceConfig {
  type: AudienceType;
  grades?: string[];
  classIds?: string[];
  rosterName?: string;
  studentIds?: string[];
}

export interface UniversalFeeDefinition {
  id: string;
  schoolId: string;
  bbFeeTypeId: string;
  title: string;
  description: string;
  baseAmount: number;
  dueDate: string; // ISO date YYYY-MM-DD
  academicYear: string;
  allowPartialPayment: boolean;
  minPartialAmount?: number;
  audience: AudienceConfig;
  customFormSchema: FormFieldSchema[];
  glAccountOverride?: string;
  status: 'DRAFT' | 'DEPLOYED' | 'ARCHIVED';
  createdAt: string;
  updatedAt: string;
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
  status: 'ACTIVE' | 'INACTIVE' | 'GRADUATED';
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
  bbClientChargeReferenceId: string;
  paymentReceipts: PaymentTransaction[];
  createdAt: string;
  updatedAt: string;
}

export interface PaymentTransaction {
  transactionId: string;
  chargeId: string;
  amount: number;
  paymentMethod: 'APPLE_PAY' | 'GOOGLE_PAY' | 'CREDIT_CARD' | 'ACH_DIRECT_DEBIT' | 'UPI';
  cardBrand?: string;
  last4?: string;
  status: 'SUCCESS' | 'FAILED' | 'PENDING';
  paidAt: string;
  receiptNumber: string;
  bbLedgerSyncStatus: 'SYNCED' | 'PENDING';
}
