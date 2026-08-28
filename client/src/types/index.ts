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

export const DEFAULT_FEES: UniversalFeeDefinition[] = [
  {
    id: 'fee-dc-trip-2026',
    schoolId: 'bb-env-oakridge-2026',
    bbFeeTypeId: 'FT-TRIP-03',
    title: '8th Grade Washington D.C. Educational Tour',
    description: 'Comprehensive 4-day educational trip including bus transport, hotel, museum admissions, meals, and commemorative t-shirt.',
    baseAmount: 350.00,
    dueDate: '2026-09-30',
    academicYear: '2026-2027',
    allowPartialPayment: true,
    minPartialAmount: 100.00,
    audience: {
      type: 'GRADE',
      grades: ['Grade 8']
    },
    customFormSchema: [
      {
        id: 'tshirt_size',
        label: 'Student T-Shirt Size',
        type: 'select',
        required: true,
        options: ['Youth L', 'Adult S', 'Adult M', 'Adult L', 'Adult XL']
      },
      {
        id: 'emergency_contact_phone',
        label: 'Emergency Contact Phone Number',
        type: 'emergency_contact',
        required: true,
        placeholder: '+1 (555) 000-0000'
      }
    ],
    status: 'DEPLOYED',
    createdAt: '2026-08-01T10:00:00.000Z'
  },
  {
    id: 'fee-stem-robotics-2026',
    schoolId: 'bb-env-oakridge-2026',
    bbFeeTypeId: 'FT-TECH-04',
    title: '9th Grade STEM Robotics & Lab Kit',
    description: 'Consumables kit and hardware access for Term 1 STEM Robotics curriculum.',
    baseAmount: 125.00,
    dueDate: '2026-10-15',
    academicYear: '2026-2027',
    allowPartialPayment: false,
    audience: {
      type: 'GRADE',
      grades: ['Grade 9']
    },
    customFormSchema: [],
    status: 'DEPLOYED',
    createdAt: '2026-08-10T12:00:00.000Z'
  }
];

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
  studentEmail?: string;
  studentMobile?: string;
  gender?: 'Male' | 'Female' | 'Non-Binary' | 'Prefer not to say' | string;
  grade: string;
  school?: string;
  homeroom: string;
  parentName: string;
  parentEmail: string;
  parentPhone: string;
  parentMobile?: string;
  currentBalance: number;
  status: string;
}

export interface StudentLookupResult {
  student: StudentAccount;
  siblings: StudentAccount[];
  charges: StudentCharge[];
  totalFamilyBalance: number;
}

export interface BlackbaudCandidateStudent {
  candidate_id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  gender: string;
  grade_level: string;
  school_name: string;
  parents: Array<{
    parent_id: string;
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    relationship: string;
  }>;
}

export interface StudentCsvRow {
  student_id: string;
  student_name: string;
  student_email?: string;
  student_mobile?: string;
  gender?: string;
  grade: string;
  school?: string;
  parent_name: string;
  parent_email: string;
  parent_mobile?: string;
  family_id?: string;
  homeroom?: string;
}

export const DEFAULT_STUDENTS: StudentAccount[] = [
  // Family 1: Michael Hayes (2 kids: Alexander & Maya)
  { studentId: 'BB-STU-101', familyId: 'BB-FAM-501', studentName: 'Alexander Hayes', studentEmail: 'alex.h@oakridge.edu', studentMobile: '+1-555-0101', gender: 'Male', grade: 'Grade 8', school: 'Oakridge Middle School', homeroom: '8-A', parentName: 'Michael Hayes', parentEmail: 'michael.hayes@example.com', parentPhone: '+1-555-0101', parentMobile: '+1-555-0101', currentBalance: 375.00, status: 'ACTIVE' },
  { studentId: 'BB-STU-111', familyId: 'BB-FAM-501', studentName: 'Maya Hayes', studentEmail: 'maya.h@oakridge.edu', studentMobile: '+1-555-0101', gender: 'Female', grade: 'Grade 5', school: 'Oakridge Lower School', homeroom: '5-B', parentName: 'Michael Hayes', parentEmail: 'michael.hayes@example.com', parentPhone: '+1-555-0101', parentMobile: '+1-555-0101', currentBalance: 190.00, status: 'ACTIVE' },

  // Family 2: Priya Patel (2 kids: Sophia & Aarav)
  { studentId: 'BB-STU-102', familyId: 'BB-FAM-502', studentName: 'Sophia Patel', studentEmail: 'sophia.p@oakridge.edu', studentMobile: '+1-555-0102', gender: 'Female', grade: 'Grade 8', school: 'Oakridge Middle School', homeroom: '8-A', parentName: 'Priya Patel', parentEmail: 'priya.patel@example.com', parentPhone: '+1-555-0102', parentMobile: '+1-555-0102', currentBalance: 250.00, status: 'ACTIVE' },
  { studentId: 'BB-STU-112', familyId: 'BB-FAM-502', studentName: 'Aarav Patel', studentEmail: 'aarav.p@oakridge.edu', studentMobile: '+1-555-0102', gender: 'Male', grade: 'Grade 3', school: 'Oakridge Lower School', homeroom: '3-A', parentName: 'Priya Patel', parentEmail: 'priya.patel@example.com', parentPhone: '+1-555-0102', parentMobile: '+1-555-0102', currentBalance: 130.00, status: 'ACTIVE' },

  // Family 3: David & Sarah Vance (2 kids: Lucas & Chloe)
  { studentId: 'BB-STU-103', familyId: 'BB-FAM-503', studentName: 'Lucas Vance', studentEmail: 'lucas.v@oakridge.edu', studentMobile: '+1-555-0103', gender: 'Male', grade: 'Grade 8', school: 'Oakridge Middle School', homeroom: '8-B', parentName: 'David Vance', parentEmail: 'david.vance@example.com', parentPhone: '+1-555-0103', parentMobile: '+1-555-0103', currentBalance: 490.00, status: 'ACTIVE' },
  { studentId: 'BB-STU-126', familyId: 'BB-FAM-503', studentName: 'Chloe Vance', studentEmail: 'chloe.v@oakridge.edu', studentMobile: '+1-555-0103', gender: 'Female', grade: 'Grade 6', school: 'Oakridge Middle School', homeroom: '6-A', parentName: 'David Vance', parentEmail: 'david.vance@example.com', parentPhone: '+1-555-0103', parentMobile: '+1-555-0103', currentBalance: 220.00, status: 'ACTIVE' },

  // Family 4: Carlos Martinez (2 kids: Olivia & Mateo)
  { studentId: 'BB-STU-106', familyId: 'BB-FAM-506', studentName: 'Olivia Martinez', studentEmail: 'olivia.m@oakridge.edu', studentMobile: '+1-555-0106', gender: 'Female', grade: 'Grade 7', school: 'Oakridge Middle School', homeroom: '7-A', parentName: 'Carlos Martinez', parentEmail: 'carlos.m@example.com', parentPhone: '+1-555-0106', parentMobile: '+1-555-0106', currentBalance: 350.00, status: 'ACTIVE' },
  { studentId: 'BB-STU-127', familyId: 'BB-FAM-506', studentName: 'Mateo Martinez', studentEmail: 'mateo.m@oakridge.edu', studentMobile: '+1-555-0106', gender: 'Male', grade: 'Grade 4', school: 'Oakridge Lower School', homeroom: '4-B', parentName: 'Carlos Martinez', parentEmail: 'carlos.m@example.com', parentPhone: '+1-555-0106', parentMobile: '+1-555-0106', currentBalance: 195.00, status: 'ACTIVE' },

  // Family 5: Jessica Bennett (3 kids: Noah, Liam & Emma)
  { studentId: 'BB-STU-109', familyId: 'BB-FAM-509', studentName: 'Noah Bennett', studentEmail: 'noah.b@oakridge.edu', studentMobile: '+1-555-0109', gender: 'Male', grade: 'Grade 9', school: 'Oakridge Upper Academy', homeroom: '9-A', parentName: 'Jessica Bennett', parentEmail: 'jessica.b@example.com', parentPhone: '+1-555-0109', parentMobile: '+1-555-0109', currentBalance: 355.00, status: 'ACTIVE' },
  { studentId: 'BB-STU-128', familyId: 'BB-FAM-509', studentName: 'Liam Bennett', studentEmail: 'liam.b@oakridge.edu', studentMobile: '+1-555-0109', gender: 'Male', grade: 'Grade 7', school: 'Oakridge Middle School', homeroom: '7-B', parentName: 'Jessica Bennett', parentEmail: 'jessica.b@example.com', parentPhone: '+1-555-0109', parentMobile: '+1-555-0109', currentBalance: 255.00, status: 'ACTIVE' },
  { studentId: 'BB-STU-129', familyId: 'BB-FAM-509', studentName: 'Emma Bennett', studentEmail: 'emma.b@oakridge.edu', studentMobile: '+1-555-0109', gender: 'Female', grade: 'Grade 3', school: 'Oakridge Lower School', homeroom: '3-B', parentName: 'Jessica Bennett', parentEmail: 'jessica.b@example.com', parentPhone: '+1-555-0109', parentMobile: '+1-555-0109', currentBalance: 80.00, status: 'ACTIVE' },

  // Family 6: Marcus Brooks (2 kids: Jackson & Harper)
  { studentId: 'BB-STU-115', familyId: 'BB-FAM-513', studentName: 'Jackson Brooks', studentEmail: 'jackson.b@oakridge.edu', studentMobile: '+1-555-0115', gender: 'Male', grade: 'Grade 8', school: 'Oakridge Middle School', homeroom: '8-B', parentName: 'Marcus Brooks', parentEmail: 'marcus.b@example.com', parentPhone: '+1-555-0115', parentMobile: '+1-555-0115', currentBalance: 330.00, status: 'ACTIVE' },
  { studentId: 'BB-STU-130', familyId: 'BB-FAM-513', studentName: 'Harper Brooks', studentEmail: 'harper.b@oakridge.edu', studentMobile: '+1-555-0115', gender: 'Female', grade: 'Grade 6', school: 'Oakridge Middle School', homeroom: '6-B', parentName: 'Marcus Brooks', parentEmail: 'marcus.b@example.com', parentPhone: '+1-555-0115', parentMobile: '+1-555-0115', currentBalance: 205.00, status: 'ACTIVE' },

  // Family 7: Robert Sterling (3 kids with 8 OVERDUE fees: William, Charlotte & Benjamin)
  { studentId: 'BB-STU-131', familyId: 'BB-FAM-530', studentName: 'William Sterling', studentEmail: 'william.s@oakridge.edu', studentMobile: '+1-555-0190', gender: 'Male', grade: 'Grade 10', school: 'Oakridge Upper Academy', homeroom: '10-A', parentName: 'Robert Sterling', parentEmail: 'robert.sterling@example.com', parentPhone: '+1-555-0190', parentMobile: '+1-555-0190', currentBalance: 830.00, status: 'ACTIVE' },
  { studentId: 'BB-STU-132', familyId: 'BB-FAM-530', studentName: 'Charlotte Sterling', studentEmail: 'charlotte.s@oakridge.edu', studentMobile: '+1-555-0190', gender: 'Female', grade: 'Grade 7', school: 'Oakridge Middle School', homeroom: '7-A', parentName: 'Robert Sterling', parentEmail: 'robert.sterling@example.com', parentPhone: '+1-555-0190', parentMobile: '+1-555-0190', currentBalance: 680.00, status: 'ACTIVE' },
  { studentId: 'BB-STU-133', familyId: 'BB-FAM-530', studentName: 'Benjamin Sterling', studentEmail: 'benjamin.s@oakridge.edu', studentMobile: '+1-555-0190', gender: 'Male', grade: 'Grade 4', school: 'Oakridge Lower School', homeroom: '4-A', parentName: 'Robert Sterling', parentEmail: 'robert.sterling@example.com', parentPhone: '+1-555-0190', parentMobile: '+1-555-0190', currentBalance: 215.00, status: 'ACTIVE' },

  // Additional Roster Students
  { studentId: 'BB-STU-104', familyId: 'BB-FAM-504', studentName: 'Emma Richardson', studentEmail: 'emma.r@oakridge.edu', studentMobile: '+1-555-0104', gender: 'Female', grade: 'Grade 8', school: 'Oakridge Middle School', homeroom: '8-B', parentName: 'Sarah Richardson', parentEmail: 'sarah.r@example.com', parentPhone: '+1-555-0104', parentMobile: '+1-555-0104', currentBalance: 80.00, status: 'ACTIVE' },
  { studentId: 'BB-STU-105', familyId: 'BB-FAM-505', studentName: 'Benjamin Walker', studentEmail: 'ben.w@oakridge.edu', studentMobile: '+1-555-0105', gender: 'Male', grade: 'Grade 7', school: 'Oakridge Middle School', homeroom: '7-A', parentName: 'James Walker', parentEmail: 'james.walker@example.com', parentPhone: '+1-555-0105', parentMobile: '+1-555-0105', currentBalance: 0.00, status: 'ACTIVE' },
  { studentId: 'BB-STU-107', familyId: 'BB-FAM-507', studentName: 'Ethan Wright', studentEmail: 'ethan.w@oakridge.edu', studentMobile: '+1-555-0107', gender: 'Male', grade: 'Grade 7', school: 'Oakridge Middle School', homeroom: '7-B', parentName: 'Laura Wright', parentEmail: 'laura.wright@example.com', parentPhone: '+1-555-0107', parentMobile: '+1-555-0107', currentBalance: 0.00, status: 'ACTIVE' },
  { studentId: 'BB-STU-108', familyId: 'BB-FAM-508', studentName: 'Mia Kim', studentEmail: 'mia.k@oakridge.edu', studentMobile: '+1-555-0108', gender: 'Female', grade: 'Grade 9', school: 'Oakridge Upper Academy', homeroom: '9-A', parentName: 'Daniel Kim', parentEmail: 'daniel.kim@example.com', parentPhone: '+1-555-0108', parentMobile: '+1-555-0108', currentBalance: 175.00, status: 'ACTIVE' },
  { studentId: 'BB-STU-110', familyId: 'BB-FAM-510', studentName: 'Ava Jenkins', studentEmail: 'ava.j@oakridge.edu', studentMobile: '+1-555-0110', gender: 'Female', grade: 'Grade 9', school: 'Oakridge Upper Academy', homeroom: '9-B', parentName: 'Robert Jenkins', parentEmail: 'robert.j@example.com', parentPhone: '+1-555-0110', parentMobile: '+1-555-0110', currentBalance: 0.00, status: 'ACTIVE' },
  { studentId: 'BB-STU-113', familyId: 'BB-FAM-511', studentName: 'Liam O\'Connor', studentEmail: 'liam.o@oakridge.edu', studentMobile: '+1-555-0113', gender: 'Male', grade: 'Grade 8', school: 'Oakridge Middle School', homeroom: '8-A', parentName: 'Sean O\'Connor', parentEmail: 'sean.oconnor@example.com', parentPhone: '+1-555-0113', parentMobile: '+1-555-0113', currentBalance: 350.00, status: 'ACTIVE' },
  { studentId: 'BB-STU-114', familyId: 'BB-FAM-512', studentName: 'Isabella Chen', studentEmail: 'isabella.c@oakridge.edu', studentMobile: '+1-555-0114', gender: 'Female', grade: 'Grade 8', school: 'Oakridge Middle School', homeroom: '8-A', parentName: 'Mei Chen', parentEmail: 'mei.chen@example.com', parentPhone: '+1-555-0114', parentMobile: '+1-555-0114', currentBalance: 350.00, status: 'ACTIVE' },
  { studentId: 'BB-STU-116', familyId: 'BB-FAM-514', studentName: 'Charlotte Davis', studentEmail: 'charlotte.d@oakridge.edu', studentMobile: '+1-555-0116', gender: 'Female', grade: 'Grade 8', school: 'Oakridge Middle School', homeroom: '8-B', parentName: 'Emily Davis', parentEmail: 'emily.davis@example.com', parentPhone: '+1-555-0116', parentMobile: '+1-555-0116', currentBalance: 350.00, status: 'ACTIVE' },
  { studentId: 'BB-STU-117', familyId: 'BB-FAM-515', studentName: 'Aiden Garcia', studentEmail: 'aiden.g@oakridge.edu', studentMobile: '+1-555-0117', gender: 'Male', grade: 'Grade 8', school: 'Oakridge Middle School', homeroom: '8-C', parentName: 'Sofia Garcia', parentEmail: 'sofia.garcia@example.com', parentPhone: '+1-555-0117', parentMobile: '+1-555-0117', currentBalance: 350.00, status: 'ACTIVE' },
  { studentId: 'BB-STU-118', familyId: 'BB-FAM-516', studentName: 'Harper Nguyen', studentEmail: 'harper.n@oakridge.edu', studentMobile: '+1-555-0118', gender: 'Female', grade: 'Grade 8', school: 'Oakridge Middle School', homeroom: '8-C', parentName: 'Thuy Nguyen', parentEmail: 'thuy.nguyen@example.com', parentPhone: '+1-555-0118', parentMobile: '+1-555-0118', currentBalance: 350.00, status: 'ACTIVE' },
  { studentId: 'BB-STU-119', familyId: 'BB-FAM-517', studentName: 'Mason Taylor', studentEmail: 'mason.t@oakridge.edu', studentMobile: '+1-555-0119', gender: 'Male', grade: 'Grade 8', school: 'Oakridge Middle School', homeroom: '8-C', parentName: 'Gregory Taylor', parentEmail: 'gregory.t@example.com', parentPhone: '+1-555-0119', parentMobile: '+1-555-0119', currentBalance: 350.00, status: 'ACTIVE' },
  { studentId: 'BB-STU-120', familyId: 'BB-FAM-518', studentName: 'Evelyn Foster', studentEmail: 'evelyn.f@oakridge.edu', studentMobile: '+1-555-0120', gender: 'Female', grade: 'Grade 8', school: 'Oakridge Middle School', homeroom: '8-A', parentName: 'Amanda Foster', parentEmail: 'amanda.f@example.com', parentPhone: '+1-555-0120', parentMobile: '+1-555-0120', currentBalance: 350.00, status: 'ACTIVE' },
  { studentId: 'BB-STU-121', familyId: 'BB-FAM-519', studentName: 'Elijah Scott', studentEmail: 'elijah.s@oakridge.edu', studentMobile: '+1-555-0121', gender: 'Male', grade: 'Grade 8', school: 'Oakridge Middle School', homeroom: '8-B', parentName: 'Brandon Scott', parentEmail: 'brandon.s@example.com', parentPhone: '+1-555-0121', parentMobile: '+1-555-0121', currentBalance: 350.00, status: 'ACTIVE' },
  { studentId: 'BB-STU-122', familyId: 'BB-FAM-520', studentName: 'Abigail Morales', studentEmail: 'abigail.m@oakridge.edu', studentMobile: '+1-555-0122', gender: 'Female', grade: 'Grade 9', school: 'Oakridge Upper Academy', homeroom: '9-A', parentName: 'Elena Morales', parentEmail: 'elena.m@example.com', parentPhone: '+1-555-0122', parentMobile: '+1-555-0122', currentBalance: 125.00, status: 'ACTIVE' },
  { studentId: 'BB-STU-123', familyId: 'BB-FAM-521', studentName: 'Henry Cooper', studentEmail: 'henry.c@oakridge.edu', studentMobile: '+1-555-0123', gender: 'Male', grade: 'Grade 9', school: 'Oakridge Upper Academy', homeroom: '9-B', parentName: 'Thomas Cooper', parentEmail: 'thomas.c@example.com', parentPhone: '+1-555-0123', parentMobile: '+1-555-0123', currentBalance: 125.00, status: 'ACTIVE' },
  { studentId: 'BB-STU-124', familyId: 'BB-FAM-522', studentName: 'Scarlett Hughes', studentEmail: 'scarlett.h@oakridge.edu', studentMobile: '+1-555-0124', gender: 'Female', grade: 'Grade 7', school: 'Oakridge Middle School', homeroom: '7-A', parentName: 'Rebecca Hughes', parentEmail: 'rebecca.h@example.com', parentPhone: '+1-555-0124', parentMobile: '+1-555-0124', currentBalance: 0.00, status: 'ACTIVE' },
  { studentId: 'BB-STU-125', familyId: 'BB-FAM-523', studentName: 'Samuel Rivera', studentEmail: 'samuel.r@oakridge.edu', studentMobile: '+1-555-0125', gender: 'Male', grade: 'Grade 7', school: 'Oakridge Middle School', homeroom: '7-B', parentName: 'Jose Rivera', parentEmail: 'jose.rivera@example.com', parentPhone: '+1-555-0125', parentMobile: '+1-555-0125', currentBalance: 175.00, status: 'ACTIVE' }
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
    cardBrand?: string;
    last4?: string;
    paidAt: string;
    receiptNumber: string;
    bbLedgerSyncStatus: string;
    bbmsAuthorizationCode?: string;
    subledgerJournalEntryId?: string;
    checkoutToken?: string;
  }>;
  createdAt: string;
}

/**
 * Blackbaud Merchant Services (BBMS) - SKY Payments New Checkout
 * Ref: https://developer.blackbaud.com/skyapi/products/bbms/payments/integrations/new-checkout
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

export const DEFAULT_CHARGES: StudentCharge[] = [
  {
    id: 'CHG-fee-dc-trip-2026-BB-STU-101',
    feeId: 'fee-dc-trip-2026',
    feeTitle: '8th Grade Washington D.C. Educational Tour',
    schoolId: 'bb-env-oakridge-2026',
    studentId: 'BB-STU-101',
    studentName: 'Alexander Hayes',
    parentEmail: 'michael.hayes@example.com',
    parentPhone: '+1-555-0101',
    bbFeeTypeId: 'FT-TRIP-03',
    amount: 350.00,
    amountPaid: 150.00,
    dueDate: '2026-09-30',
    paymentStatus: 'PARTIALLY_PAID',
    customFormResponses: {
      tshirt_size: 'Adult L',
      emergency_contact_phone: '+1-555-0101'
    },
    bbSyncStatus: 'SYNCED',
    bbBatchId: 'BATCH-BB-89101',
    paymentReceipts: [
      {
        transactionId: 'TXN-9021',
        amount: 150.00,
        paymentMethod: 'APPLE_PAY',
        paidAt: '2026-08-15T14:30:00.000Z',
        receiptNumber: 'REC-2026-0891',
        bbLedgerSyncStatus: 'POSTED_TO_BLACKBAUD'
      }
    ],
    createdAt: '2026-08-01T10:00:00.000Z'
  },
  {
    id: 'CHG-fee-dc-trip-2026-BB-STU-102',
    feeId: 'fee-dc-trip-2026',
    feeTitle: '8th Grade Washington D.C. Educational Tour',
    schoolId: 'bb-env-oakridge-2026',
    studentId: 'BB-STU-102',
    studentName: 'Sophia Patel',
    parentEmail: 'priya.patel@example.com',
    parentPhone: '+1-555-0102',
    bbFeeTypeId: 'FT-TRIP-03',
    amount: 350.00,
    amountPaid: 350.00,
    dueDate: '2026-09-30',
    paymentStatus: 'PAID',
    customFormResponses: {
      tshirt_size: 'Adult M',
      emergency_contact_phone: '+1-555-0102'
    },
    bbSyncStatus: 'SYNCED',
    bbBatchId: 'BATCH-BB-89101',
    paymentReceipts: [
      {
        transactionId: 'TXN-8841',
        amount: 350.00,
        paymentMethod: 'CREDIT_CARD',
        paidAt: '2026-08-12T09:15:00.000Z',
        receiptNumber: 'REC-2026-0744',
        bbLedgerSyncStatus: 'POSTED_TO_BLACKBAUD'
      }
    ],
    createdAt: '2026-08-01T10:00:00.000Z'
  },
  {
    id: 'CHG-fee-dc-trip-2026-BB-STU-103',
    feeId: 'fee-dc-trip-2026',
    feeTitle: '8th Grade Washington D.C. Educational Tour',
    schoolId: 'bb-env-oakridge-2026',
    studentId: 'BB-STU-103',
    studentName: 'Lucas Vance',
    parentEmail: 'david.vance@example.com',
    parentPhone: '+1-555-0103',
    bbFeeTypeId: 'FT-TRIP-03',
    amount: 350.00,
    amountPaid: 0.00,
    dueDate: '2026-09-30',
    paymentStatus: 'UNPAID',
    bbSyncStatus: 'QUEUED',
    paymentReceipts: [],
    createdAt: '2026-08-01T10:00:00.000Z'
  },
  {
    id: 'CHG-fee-dc-trip-2026-BB-STU-104',
    feeId: 'fee-dc-trip-2026',
    feeTitle: '8th Grade Washington D.C. Educational Tour',
    schoolId: 'bb-env-oakridge-2026',
    studentId: 'BB-STU-104',
    studentName: 'Emma Richardson',
    parentEmail: 'sarah.r@example.com',
    parentPhone: '+1-555-0104',
    bbFeeTypeId: 'FT-TRIP-03',
    amount: 350.00,
    amountPaid: 0.00,
    dueDate: '2026-09-30',
    paymentStatus: 'UNPAID',
    bbSyncStatus: 'QUEUED',
    paymentReceipts: [],
    createdAt: '2026-08-01T10:00:00.000Z'
  }
];

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

export const DEFAULT_CONTEXT: BlackbaudContext = {
  environment: {
    environmentId: 'bb-env-oakridge-2026',
    schoolName: 'Oakridge International Prep',
    subscriptionKey: 'bb-sky-sub-key-2026-live',
    branding: {
      schoolName: 'Oakridge International Prep',
      primaryColor: '#4f46e5',
      secondaryColor: '#7c3aed',
      backgroundColor: '#f8fafc',
      surfaceColor: '#ffffff',
      textColor: '#0f172a',
      logoUrl: 'https://images.unsplash.com/photo-1594608661623-aa0bd3a69d98?w=128&auto=format&fit=crop&q=80'
    }
  },
  stats: {
    totalActiveStudents: 10,
    totalFeeTypes: 5,
    totalDeployedFees: 3,
    totalBatchesSubmitted: 1
  }
};
