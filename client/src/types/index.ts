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

export const DEFAULT_FEE_TYPES: BlackbaudFeeType[] = [
  {
    feeTypeId: 'FT-TRIP-03',
    name: 'Field Trip & Educational Excursion',
    category: 'ACTIVITY',
    glAccountCode: 'GL-3030-40',
    isActive: true,
    defaultAmount: 125.00,
    allowPartialPayment: true
  },
  {
    feeTypeId: 'FT-ATHL-02',
    name: 'Athletic Fee & Varsity Uniforms',
    category: 'ATHLETIC',
    glAccountCode: 'GL-2020-15',
    isActive: true,
    defaultAmount: 175.00,
    allowPartialPayment: false
  },
  {
    feeTypeId: 'FT-TUIT-01',
    name: 'Tuition - Standard Academic Term',
    category: 'TUITION',
    glAccountCode: 'GL-1010-00',
    isActive: true,
    defaultAmount: 4500.00,
    allowPartialPayment: true
  },
  {
    feeTypeId: 'FT-TECH-04',
    name: 'STEM Lab & 1-to-1 Device Fee',
    category: 'MANDATORY_FEE',
    glAccountCode: 'GL-4040-02',
    isActive: true,
    defaultAmount: 250.00,
    allowPartialPayment: false
  },
  {
    feeTypeId: 'FT-GRAD-05',
    name: 'Senior Graduation & Yearbook Package',
    category: 'OPTIONAL_FEE',
    glAccountCode: 'GL-5050-80',
    isActive: true,
    defaultAmount: 195.00,
    allowPartialPayment: true
  },
  {
    feeTypeId: 'FT-CAMP-06',
    name: 'Robotics Summer Camp & Materials',
    category: 'ACTIVITY',
    glAccountCode: 'GL-3030-55',
    isActive: true,
    defaultAmount: 320.00,
    allowPartialPayment: true
  }
];

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

export const DEFAULT_STUDENTS: StudentAccount[] = [
  { studentId: 'BB-STU-101', familyId: 'BB-FAM-501', studentName: 'Alexander Hayes', parentName: 'Michael Hayes', parentEmail: 'michael.hayes@example.com', parentPhone: '+1-555-0101', grade: 'Grade 8', homeroom: '8-A', currentBalance: 450.00, status: 'ACTIVE' },
  { studentId: 'BB-STU-102', familyId: 'BB-FAM-502', studentName: 'Sophia Patel', parentName: 'Priya Patel', parentEmail: 'priya.patel@example.com', parentPhone: '+1-555-0102', grade: 'Grade 8', homeroom: '8-A', currentBalance: 0.00, status: 'ACTIVE' },
  { studentId: 'BB-STU-103', familyId: 'BB-FAM-503', studentName: 'Lucas Vance', parentName: 'David Vance', parentEmail: 'david.vance@example.com', parentPhone: '+1-555-0103', grade: 'Grade 8', homeroom: '8-B', currentBalance: 125.00, status: 'ACTIVE' },
  { studentId: 'BB-STU-104', familyId: 'BB-FAM-504', studentName: 'Emma Richardson', parentName: 'Sarah Richardson', parentEmail: 'sarah.r@example.com', parentPhone: '+1-555-0104', grade: 'Grade 8', homeroom: '8-B', currentBalance: 80.00, status: 'ACTIVE' },
  { studentId: 'BB-STU-105', familyId: 'BB-FAM-505', studentName: 'Benjamin Walker', parentName: 'James Walker', parentEmail: 'james.walker@example.com', parentPhone: '+1-555-0105', grade: 'Grade 7', homeroom: '7-A', currentBalance: 0.00, status: 'ACTIVE' },
  { studentId: 'BB-STU-106', familyId: 'BB-FAM-506', studentName: 'Olivia Martinez', parentName: 'Carlos Martinez', parentEmail: 'carlos.m@example.com', parentPhone: '+1-555-0106', grade: 'Grade 7', homeroom: '7-A', currentBalance: 250.00, status: 'ACTIVE' },
  { studentId: 'BB-STU-107', familyId: 'BB-FAM-507', studentName: 'Ethan Wright', parentName: 'Laura Wright', parentEmail: 'laura.wright@example.com', parentPhone: '+1-555-0107', grade: 'Grade 7', homeroom: '7-B', currentBalance: 0.00, status: 'ACTIVE' },
  { studentId: 'BB-STU-108', familyId: 'BB-FAM-508', studentName: 'Mia Kim', parentName: 'Daniel Kim', parentEmail: 'daniel.kim@example.com', parentPhone: '+1-555-0108', grade: 'Grade 9', homeroom: '9-A', currentBalance: 175.00, status: 'ACTIVE' },
  { studentId: 'BB-STU-109', familyId: 'BB-FAM-509', studentName: 'Noah Bennett', parentName: 'Jessica Bennett', parentEmail: 'jessica.b@example.com', parentPhone: '+1-555-0109', grade: 'Grade 9', homeroom: '9-A', currentBalance: 320.00, status: 'ACTIVE' },
  { studentId: 'BB-STU-110', familyId: 'BB-FAM-510', studentName: 'Ava Jenkins', parentName: 'Robert Jenkins', parentEmail: 'robert.j@example.com', parentPhone: '+1-555-0110', grade: 'Grade 9', homeroom: '9-B', currentBalance: 0.00, status: 'ACTIVE' }
];

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
