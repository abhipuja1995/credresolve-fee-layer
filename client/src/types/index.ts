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
  requireWaiver?: boolean;
  requireSignature?: boolean;
  waiverText?: string;
  waiverCheckboxLabel?: string;
  signatureLabel?: string;
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
  updatedAt?: string;
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
  // ==========================================
  // FAMILY 1: Michael Hayes (Alexander & Maya)
  // ==========================================
  {
    id: 'CHG-DC-TRIP-BB-STU-101',
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
    customFormResponses: { tshirt_size: 'Adult L', emergency_contact_phone: '+1-555-0101' },
    bbSyncStatus: 'SYNCED',
    bbBatchId: 'BATCH-BB-89101',
    paymentReceipts: [{
      transactionId: 'TXN-9021',
      amount: 150.00,
      paymentMethod: 'APPLE_PAY',
      paidAt: '2026-08-15T14:30:00.000Z',
      receiptNumber: 'REC-2026-0891',
      bbLedgerSyncStatus: 'POSTED_TO_BLACKBAUD'
    }],
    createdAt: '2026-08-01T10:00:00.000Z'
  },
  {
    id: 'CHG-ATHL-BB-STU-101',
    feeId: 'fee-athl-2026',
    feeTitle: 'Middle School Varsity Basketball & Athletic Kit',
    schoolId: 'bb-env-oakridge-2026',
    studentId: 'BB-STU-101',
    studentName: 'Alexander Hayes',
    parentEmail: 'michael.hayes@example.com',
    parentPhone: '+1-555-0101',
    bbFeeTypeId: 'FT-ATHL-02',
    amount: 175.00,
    amountPaid: 0.00,
    dueDate: '2026-10-10',
    paymentStatus: 'UNPAID',
    bbSyncStatus: 'SYNCED',
    paymentReceipts: [],
    createdAt: '2026-08-01T10:00:00.000Z'
  },
  {
    id: 'CHG-STEM-BB-STU-111',
    feeId: 'fee-stem-lab-2026',
    feeTitle: '5th Grade Junior Robotics & STEM Lab Kit',
    schoolId: 'bb-env-oakridge-2026',
    studentId: 'BB-STU-111',
    studentName: 'Maya Hayes',
    parentEmail: 'michael.hayes@example.com',
    parentPhone: '+1-555-0101',
    bbFeeTypeId: 'FT-TECH-04',
    amount: 125.00,
    amountPaid: 0.00,
    dueDate: '2026-10-15',
    paymentStatus: 'UNPAID',
    bbSyncStatus: 'SYNCED',
    paymentReceipts: [],
    createdAt: '2026-08-01T10:00:00.000Z'
  },
  {
    id: 'CHG-MUSIC-BB-STU-111',
    feeId: 'fee-music-2026',
    feeTitle: 'Lower School Music Conservatory & Recorder',
    schoolId: 'bb-env-oakridge-2026',
    studentId: 'BB-STU-111',
    studentName: 'Maya Hayes',
    parentEmail: 'michael.hayes@example.com',
    parentPhone: '+1-555-0101',
    bbFeeTypeId: 'FT-ACT-05',
    amount: 65.00,
    amountPaid: 0.00,
    dueDate: '2026-10-25',
    paymentStatus: 'UNPAID',
    bbSyncStatus: 'SYNCED',
    paymentReceipts: [],
    createdAt: '2026-08-01T10:00:00.000Z'
  },

  // ==========================================
  // FAMILY 2: Priya Patel (Sophia & Aarav)
  // ==========================================
  {
    id: 'CHG-MUN-BB-STU-102',
    feeId: 'fee-mun-2026',
    feeTitle: 'Model UN National Summit Registration',
    schoolId: 'bb-env-oakridge-2026',
    studentId: 'BB-STU-102',
    studentName: 'Sophia Patel',
    parentEmail: 'priya.patel@example.com',
    parentPhone: '+1-555-0102',
    bbFeeTypeId: 'FT-ACT-05',
    amount: 180.00,
    amountPaid: 0.00,
    dueDate: '2026-10-05',
    paymentStatus: 'UNPAID',
    bbSyncStatus: 'SYNCED',
    paymentReceipts: [],
    createdAt: '2026-08-01T10:00:00.000Z'
  },
  {
    id: 'CHG-ORCH-BB-STU-102',
    feeId: 'fee-orch-2026',
    feeTitle: 'Middle School Symphony Orchestra Fee',
    schoolId: 'bb-env-oakridge-2026',
    studentId: 'BB-STU-102',
    studentName: 'Sophia Patel',
    parentEmail: 'priya.patel@example.com',
    parentPhone: '+1-555-0102',
    bbFeeTypeId: 'FT-ACT-05',
    amount: 120.00,
    amountPaid: 50.00,
    dueDate: '2026-10-20',
    paymentStatus: 'PARTIALLY_PAID',
    bbSyncStatus: 'SYNCED',
    paymentReceipts: [{
      transactionId: 'TXN-8841',
      amount: 50.00,
      paymentMethod: 'CREDIT_CARD',
      paidAt: '2026-08-12T09:15:00.000Z',
      receiptNumber: 'REC-2026-0744',
      bbLedgerSyncStatus: 'POSTED_TO_BLACKBAUD'
    }],
    createdAt: '2026-08-01T10:00:00.000Z'
  },
  {
    id: 'CHG-SCI-BB-STU-112',
    feeId: 'fee-sci-2026',
    feeTitle: '3rd Grade Discovery Science Fair & Planetarium',
    schoolId: 'bb-env-oakridge-2026',
    studentId: 'BB-STU-112',
    studentName: 'Aarav Patel',
    parentEmail: 'priya.patel@example.com',
    parentPhone: '+1-555-0102',
    bbFeeTypeId: 'FT-TRIP-03',
    amount: 75.00,
    amountPaid: 0.00,
    dueDate: '2026-10-22',
    paymentStatus: 'UNPAID',
    bbSyncStatus: 'SYNCED',
    paymentReceipts: [],
    createdAt: '2026-08-01T10:00:00.000Z'
  },
  {
    id: 'CHG-ART-BB-STU-112',
    feeId: 'fee-art-2026',
    feeTitle: 'Lower School Art & Ceramics Studio Fee',
    schoolId: 'bb-env-oakridge-2026',
    studentId: 'BB-STU-112',
    studentName: 'Aarav Patel',
    parentEmail: 'priya.patel@example.com',
    parentPhone: '+1-555-0102',
    bbFeeTypeId: 'FT-ACT-05',
    amount: 55.00,
    amountPaid: 0.00,
    dueDate: '2026-10-30',
    paymentStatus: 'UNPAID',
    bbSyncStatus: 'SYNCED',
    paymentReceipts: [],
    createdAt: '2026-08-01T10:00:00.000Z'
  },

  // ==========================================
  // FAMILY 3: David Vance (Lucas & Chloe)
  // ==========================================
  {
    id: 'CHG-DC-BB-STU-103',
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
    bbSyncStatus: 'SYNCED',
    paymentReceipts: [],
    createdAt: '2026-08-01T10:00:00.000Z'
  },
  {
    id: 'CHG-CODE-BB-STU-103',
    feeId: 'fee-code-2026',
    feeTitle: 'Python & AI Software Lab License',
    schoolId: 'bb-env-oakridge-2026',
    studentId: 'BB-STU-103',
    studentName: 'Lucas Vance',
    parentEmail: 'david.vance@example.com',
    parentPhone: '+1-555-0103',
    bbFeeTypeId: 'FT-TECH-04',
    amount: 140.00,
    amountPaid: 0.00,
    dueDate: '2026-10-15',
    paymentStatus: 'UNPAID',
    bbSyncStatus: 'SYNCED',
    paymentReceipts: [],
    createdAt: '2026-08-01T10:00:00.000Z'
  },
  {
    id: 'CHG-CAMP-BB-STU-126',
    feeId: 'fee-camp-2026',
    feeTitle: '6th Grade Outdoor Wilderness Leadership Camp',
    schoolId: 'bb-env-oakridge-2026',
    studentId: 'BB-STU-126',
    studentName: 'Chloe Vance',
    parentEmail: 'david.vance@example.com',
    parentPhone: '+1-555-0103',
    bbFeeTypeId: 'FT-CAMP-06',
    amount: 225.00,
    amountPaid: 100.00,
    dueDate: '2026-10-18',
    paymentStatus: 'PARTIALLY_PAID',
    bbSyncStatus: 'SYNCED',
    paymentReceipts: [],
    createdAt: '2026-08-01T10:00:00.000Z'
  },
  {
    id: 'CHG-FR-BB-STU-126',
    feeId: 'fee-fr-2026',
    feeTitle: 'French Cultural Immersion Workshop',
    schoolId: 'bb-env-oakridge-2026',
    studentId: 'BB-STU-126',
    studentName: 'Chloe Vance',
    parentEmail: 'david.vance@example.com',
    parentPhone: '+1-555-0103',
    bbFeeTypeId: 'FT-ACT-05',
    amount: 95.00,
    amountPaid: 0.00,
    dueDate: '2026-11-01',
    paymentStatus: 'UNPAID',
    bbSyncStatus: 'SYNCED',
    paymentReceipts: [],
    createdAt: '2026-08-01T10:00:00.000Z'
  },

  // ==========================================
  // FAMILY 4: Carlos Martinez (Olivia & Mateo)
  // ==========================================
  {
    id: 'CHG-STEM-BB-STU-106',
    feeId: 'fee-stem-7-2026',
    feeTitle: '7th Grade STEM Robotics & 1-to-1 Device Fee',
    schoolId: 'bb-env-oakridge-2026',
    studentId: 'BB-STU-106',
    studentName: 'Olivia Martinez',
    parentEmail: 'carlos.m@example.com',
    parentPhone: '+1-555-0106',
    bbFeeTypeId: 'FT-TECH-04',
    amount: 250.00,
    amountPaid: 0.00,
    dueDate: '2026-10-12',
    paymentStatus: 'UNPAID',
    bbSyncStatus: 'SYNCED',
    paymentReceipts: [],
    createdAt: '2026-08-01T10:00:00.000Z'
  },
  {
    id: 'CHG-TENNIS-BB-STU-106',
    feeId: 'fee-tennis-2026',
    feeTitle: 'Middle School Tennis Team & Uniform Package',
    schoolId: 'bb-env-oakridge-2026',
    studentId: 'BB-STU-106',
    studentName: 'Olivia Martinez',
    parentEmail: 'carlos.m@example.com',
    parentPhone: '+1-555-0106',
    bbFeeTypeId: 'FT-ATHL-02',
    amount: 160.00,
    amountPaid: 60.00,
    dueDate: '2026-10-25',
    paymentStatus: 'PARTIALLY_PAID',
    bbSyncStatus: 'SYNCED',
    paymentReceipts: [],
    createdAt: '2026-08-01T10:00:00.000Z'
  },
  {
    id: 'CHG-HIST-BB-STU-127',
    feeId: 'fee-hist-2026',
    feeTitle: '4th Grade State History Excursion',
    schoolId: 'bb-env-oakridge-2026',
    studentId: 'BB-STU-127',
    studentName: 'Mateo Martinez',
    parentEmail: 'carlos.m@example.com',
    parentPhone: '+1-555-0106',
    bbFeeTypeId: 'FT-TRIP-03',
    amount: 110.00,
    amountPaid: 0.00,
    dueDate: '2026-10-28',
    paymentStatus: 'UNPAID',
    bbSyncStatus: 'SYNCED',
    paymentReceipts: [],
    createdAt: '2026-08-01T10:00:00.000Z'
  },
  {
    id: 'CHG-MATH-BB-STU-127',
    feeId: 'fee-math-2026',
    feeTitle: 'Junior Math Olympiad Enrollment',
    schoolId: 'bb-env-oakridge-2026',
    studentId: 'BB-STU-127',
    studentName: 'Mateo Martinez',
    parentEmail: 'carlos.m@example.com',
    parentPhone: '+1-555-0106',
    bbFeeTypeId: 'FT-ACT-05',
    amount: 85.00,
    amountPaid: 0.00,
    dueDate: '2026-11-05',
    paymentStatus: 'UNPAID',
    bbSyncStatus: 'SYNCED',
    paymentReceipts: [],
    createdAt: '2026-08-01T10:00:00.000Z'
  },

  // ==========================================
  // FAMILY 5: Jessica Bennett (Noah, Liam & Emma)
  // ==========================================
  {
    id: 'CHG-BIO-BB-STU-109',
    feeId: 'fee-bio-2026',
    feeTitle: 'AP Biology Lab Equipment & Microscopy Kit',
    schoolId: 'bb-env-oakridge-2026',
    studentId: 'BB-STU-109',
    studentName: 'Noah Bennett',
    parentEmail: 'jessica.b@example.com',
    parentPhone: '+1-555-0109',
    bbFeeTypeId: 'FT-TECH-04',
    amount: 210.00,
    amountPaid: 0.00,
    dueDate: '2026-10-15',
    paymentStatus: 'UNPAID',
    bbSyncStatus: 'SYNCED',
    paymentReceipts: [],
    createdAt: '2026-08-01T10:00:00.000Z'
  },
  {
    id: 'CHG-TRACK-BB-STU-109',
    feeId: 'fee-track-2026',
    feeTitle: 'Upper School Varsity Track & Field Package',
    schoolId: 'bb-env-oakridge-2026',
    studentId: 'BB-STU-109',
    studentName: 'Noah Bennett',
    parentEmail: 'jessica.b@example.com',
    parentPhone: '+1-555-0109',
    bbFeeTypeId: 'FT-ATHL-02',
    amount: 145.00,
    amountPaid: 0.00,
    dueDate: '2026-10-22',
    paymentStatus: 'UNPAID',
    bbSyncStatus: 'SYNCED',
    paymentReceipts: [],
    createdAt: '2026-08-01T10:00:00.000Z'
  },
  {
    id: 'CHG-MBIO-BB-STU-128',
    feeId: 'fee-mbio-2026',
    feeTitle: '7th Grade Marine Biology Coastal Field Study',
    schoolId: 'bb-env-oakridge-2026',
    studentId: 'BB-STU-128',
    studentName: 'Liam Bennett',
    parentEmail: 'jessica.b@example.com',
    parentPhone: '+1-555-0109',
    bbFeeTypeId: 'FT-TRIP-03',
    amount: 185.00,
    amountPaid: 0.00,
    dueDate: '2026-10-26',
    paymentStatus: 'UNPAID',
    bbSyncStatus: 'SYNCED',
    paymentReceipts: [],
    createdAt: '2026-08-01T10:00:00.000Z'
  },
  {
    id: 'CHG-CHESS-BB-STU-128',
    feeId: 'fee-chess-2026',
    feeTitle: 'Middle School Chess Club & Tournament',
    schoolId: 'bb-env-oakridge-2026',
    studentId: 'BB-STU-128',
    studentName: 'Liam Bennett',
    parentEmail: 'jessica.b@example.com',
    parentPhone: '+1-555-0109',
    bbFeeTypeId: 'FT-ACT-05',
    amount: 70.00,
    amountPaid: 0.00,
    dueDate: '2026-11-02',
    paymentStatus: 'UNPAID',
    bbSyncStatus: 'SYNCED',
    paymentReceipts: [],
    createdAt: '2026-08-01T10:00:00.000Z'
  },
  {
    id: 'CHG-ZOO-BB-STU-129',
    feeId: 'fee-zoo-2026',
    feeTitle: '3rd Grade Spring Safari Zoo Workshop',
    schoolId: 'bb-env-oakridge-2026',
    studentId: 'BB-STU-129',
    studentName: 'Emma Bennett',
    parentEmail: 'jessica.b@example.com',
    parentPhone: '+1-555-0109',
    bbFeeTypeId: 'FT-TRIP-03',
    amount: 80.00,
    amountPaid: 0.00,
    dueDate: '2026-11-10',
    paymentStatus: 'UNPAID',
    bbSyncStatus: 'SYNCED',
    paymentReceipts: [],
    createdAt: '2026-08-01T10:00:00.000Z'
  },

  // ==========================================
  // FAMILY 6: Marcus Brooks (Jackson & Harper)
  // ==========================================
  {
    id: 'CHG-DC-BB-STU-115',
    feeId: 'fee-dc-trip-2026',
    feeTitle: '8th Grade Washington D.C. Educational Tour',
    schoolId: 'bb-env-oakridge-2026',
    studentId: 'BB-STU-115',
    studentName: 'Jackson Brooks',
    parentEmail: 'marcus.b@example.com',
    parentPhone: '+1-555-0115',
    bbFeeTypeId: 'FT-TRIP-03',
    amount: 350.00,
    amountPaid: 150.00,
    dueDate: '2026-09-30',
    paymentStatus: 'PARTIALLY_PAID',
    bbSyncStatus: 'SYNCED',
    paymentReceipts: [],
    createdAt: '2026-08-01T10:00:00.000Z'
  },
  {
    id: 'CHG-WIND-BB-STU-115',
    feeId: 'fee-wind-2026',
    feeTitle: 'Advanced Wind Ensemble & Trumpet Rental',
    schoolId: 'bb-env-oakridge-2026',
    studentId: 'BB-STU-115',
    studentName: 'Jackson Brooks',
    parentEmail: 'marcus.b@example.com',
    parentPhone: '+1-555-0115',
    bbFeeTypeId: 'FT-ACT-05',
    amount: 130.00,
    amountPaid: 0.00,
    dueDate: '2026-10-18',
    paymentStatus: 'UNPAID',
    bbSyncStatus: 'SYNCED',
    paymentReceipts: [],
    createdAt: '2026-08-01T10:00:00.000Z'
  },
  {
    id: 'CHG-SCI-BB-STU-130',
    feeId: 'fee-sci-6-2026',
    feeTitle: '6th Grade Science Exploration Lab Kit',
    schoolId: 'bb-env-oakridge-2026',
    studentId: 'BB-STU-130',
    studentName: 'Harper Brooks',
    parentEmail: 'marcus.b@example.com',
    parentPhone: '+1-555-0115',
    bbFeeTypeId: 'FT-TECH-04',
    amount: 115.00,
    amountPaid: 0.00,
    dueDate: '2026-10-25',
    paymentStatus: 'UNPAID',
    bbSyncStatus: 'SYNCED',
    paymentReceipts: [],
    createdAt: '2026-08-01T10:00:00.000Z'
  },
  {
    id: 'CHG-DRAMA-BB-STU-130',
    feeId: 'fee-drama-2026',
    feeTitle: 'Drama Club Musical Production Fee',
    schoolId: 'bb-env-oakridge-2026',
    studentId: 'BB-STU-130',
    studentName: 'Harper Brooks',
    parentEmail: 'marcus.b@example.com',
    parentPhone: '+1-555-0115',
    bbFeeTypeId: 'FT-ACT-05',
    amount: 90.00,
    amountPaid: 0.00,
    dueDate: '2026-11-05',
    paymentStatus: 'UNPAID',
    bbSyncStatus: 'SYNCED',
    paymentReceipts: [],
    createdAt: '2026-08-01T10:00:00.000Z'
  },

  // =========================================================================
  // FAMILY 7: Robert Sterling (William, Charlotte & Benjamin - 8 OVERDUE FEES)
  // =========================================================================
  {
    id: 'CHG-PHYS-BB-STU-131',
    feeId: 'fee-phys-2026',
    feeTitle: 'AP Physics C & Advanced Robotics Lab Kit',
    schoolId: 'bb-env-oakridge-2026',
    studentId: 'BB-STU-131',
    studentName: 'William Sterling',
    parentEmail: 'robert.sterling@example.com',
    parentPhone: '+1-555-0190',
    bbFeeTypeId: 'FT-TECH-04',
    amount: 280.00,
    amountPaid: 0.00,
    dueDate: '2026-07-15',
    paymentStatus: 'UNPAID',
    bbSyncStatus: 'SYNCED',
    paymentReceipts: [],
    createdAt: '2026-08-01T10:00:00.000Z'
  },
  {
    id: 'CHG-ROW-BB-STU-131',
    feeId: 'fee-row-2026',
    feeTitle: 'Varsity Crew & Head of Charles Regatta Travel Package',
    schoolId: 'bb-env-oakridge-2026',
    studentId: 'BB-STU-131',
    studentName: 'William Sterling',
    parentEmail: 'robert.sterling@example.com',
    parentPhone: '+1-555-0190',
    bbFeeTypeId: 'FT-ATHL-02',
    amount: 340.00,
    amountPaid: 0.00,
    dueDate: '2026-08-01',
    paymentStatus: 'UNPAID',
    bbSyncStatus: 'SYNCED',
    paymentReceipts: [],
    createdAt: '2026-08-01T10:00:00.000Z'
  },
  {
    id: 'CHG-MUNH-BB-STU-131',
    feeId: 'fee-munh-2026',
    feeTitle: 'National Model UN Harvard Delegation Delegate Fee',
    schoolId: 'bb-env-oakridge-2026',
    studentId: 'BB-STU-131',
    studentName: 'William Sterling',
    parentEmail: 'robert.sterling@example.com',
    parentPhone: '+1-555-0190',
    bbFeeTypeId: 'FT-ACT-05',
    amount: 210.00,
    amountPaid: 0.00,
    dueDate: '2026-08-15',
    paymentStatus: 'UNPAID',
    bbSyncStatus: 'SYNCED',
    paymentReceipts: [],
    createdAt: '2026-08-01T10:00:00.000Z'
  },
  {
    id: 'CHG-ADIR-BB-STU-132',
    feeId: 'fee-adir-2026',
    feeTitle: '7th Grade Adirondack Outdoor Leadership Expedition',
    schoolId: 'bb-env-oakridge-2026',
    studentId: 'BB-STU-132',
    studentName: 'Charlotte Sterling',
    parentEmail: 'robert.sterling@example.com',
    parentPhone: '+1-555-0190',
    bbFeeTypeId: 'FT-CAMP-06',
    amount: 325.00,
    amountPaid: 0.00,
    dueDate: '2026-07-20',
    paymentStatus: 'UNPAID',
    bbSyncStatus: 'SYNCED',
    paymentReceipts: [],
    createdAt: '2026-08-01T10:00:00.000Z'
  },
  {
    id: 'CHG-CELLO-BB-STU-132',
    feeId: 'fee-cello-2026',
    feeTitle: 'Middle School Symphonic Orchestra Cello Rental & Maintenance',
    schoolId: 'bb-env-oakridge-2026',
    studentId: 'BB-STU-132',
    studentName: 'Charlotte Sterling',
    parentEmail: 'robert.sterling@example.com',
    parentPhone: '+1-555-0190',
    bbFeeTypeId: 'FT-ACT-05',
    amount: 160.00,
    amountPaid: 0.00,
    dueDate: '2026-08-10',
    paymentStatus: 'UNPAID',
    bbSyncStatus: 'SYNCED',
    paymentReceipts: [],
    createdAt: '2026-08-01T10:00:00.000Z'
  },
  {
    id: 'CHG-FRRET-BB-STU-132',
    feeId: 'fee-frret-2026',
    feeTitle: 'French Language Immersion Weekend Retreat',
    schoolId: 'bb-env-oakridge-2026',
    studentId: 'BB-STU-132',
    studentName: 'Charlotte Sterling',
    parentEmail: 'robert.sterling@example.com',
    parentPhone: '+1-555-0190',
    bbFeeTypeId: 'FT-TRIP-03',
    amount: 195.00,
    amountPaid: 0.00,
    dueDate: '2026-08-20',
    paymentStatus: 'UNPAID',
    bbSyncStatus: 'SYNCED',
    paymentReceipts: [],
    createdAt: '2026-08-01T10:00:00.000Z'
  },
  {
    id: 'CHG-HIST-BB-STU-133',
    feeId: 'fee-hist-4-2026',
    feeTitle: '4th Grade Living History Museum & Transportation',
    schoolId: 'bb-env-oakridge-2026',
    studentId: 'BB-STU-133',
    studentName: 'Benjamin Sterling',
    parentEmail: 'robert.sterling@example.com',
    parentPhone: '+1-555-0190',
    bbFeeTypeId: 'FT-TRIP-03',
    amount: 120.00,
    amountPaid: 0.00,
    dueDate: '2026-07-30',
    paymentStatus: 'UNPAID',
    bbSyncStatus: 'SYNCED',
    paymentReceipts: [],
    createdAt: '2026-08-01T10:00:00.000Z'
  },
  {
    id: 'CHG-STEAM-BB-STU-133',
    feeId: 'fee-steam-4-2026',
    feeTitle: 'Lower School STEAM Discovery & Coding Module Kit',
    schoolId: 'bb-env-oakridge-2026',
    studentId: 'BB-STU-133',
    studentName: 'Benjamin Sterling',
    parentEmail: 'robert.sterling@example.com',
    parentPhone: '+1-555-0190',
    bbFeeTypeId: 'FT-TECH-04',
    amount: 95.00,
    amountPaid: 0.00,
    dueDate: '2026-08-05',
    paymentStatus: 'UNPAID',
    bbSyncStatus: 'SYNCED',
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

// ============================================================================
// CREDRESOLVE PARENT HUB: MULTI-CHILD & MULTI-SCHOOL FAMILY PLATFORM TYPES
// ============================================================================

export interface SchoolNotice {
  id: string;
  schoolId: string;
  schoolName: string;
  studentId: string;
  studentName: string;
  title: string;
  summary: string;
  fullContent?: string;
  category: 'PTM' | 'EXAM' | 'EVENT' | 'HOLIDAY' | 'LOGISTICS' | 'URGENT' | 'CIRCULAR';
  publishedDate: string;
  eventDate?: string;
  isRead?: boolean;
  actionRequired?: boolean;
  actionLabel?: string;
}

export interface MultiSchoolFeeItem {
  id: string;
  schoolId: string;
  schoolName: string;
  schoolShortCode: string;
  schoolBadgeColor: string;
  schoolErpSystem: string;
  schoolGateway: string;
  studentId: string;
  studentName: string;
  grade: string;
  feeTitle: string;
  category: 'TUITION' | 'TRANSPORT' | 'ACTIVITY' | 'TECH' | 'ATHLETIC' | 'EXPEDITION' | 'OTHER';
  amount: number;
  amountPaid: number;
  dueDate: string;
  isOverdue: boolean;
  paymentStatus: 'UNPAID' | 'PARTIALLY_PAID' | 'PAID';
}

export interface MultiSchoolChild {
  studentId: string;
  studentName: string;
  gender?: string;
  grade: string;
  section?: string;
  schoolId: string;
  schoolName: string;
  schoolShortCode: string;
  schoolBadgeColor: string;
  schoolCity: string;
  schoolErpSystem: string; // e.g. Blackbaud SKY, PowerSchool, Edunext
  schoolLogoUrl?: string;
  totalDue: number;
  activeFeesCount: number;
  noticesCount: number;
  fees: MultiSchoolFeeItem[];
  notices: SchoolNotice[];
}

export interface MultiSchoolPaymentRecord {
  transactionId: string;
  receiptNumber: string;
  paidAt: string;
  studentId: string;
  studentName: string;
  schoolId: string;
  schoolName: string;
  feeTitle: string;
  amount: number;
  currency: string;
  paymentMethod: string;
  status: 'PAID' | 'POSTED_TO_SCHOOL_ERP';
  authorizationCode: string;
  subledgerJournalEntryId: string;
}

export interface MultiSchoolParentProfile {
  id: string;
  parentName: string;
  parentEmail: string;
  parentPhone: string;
  currency: 'INR' | 'USD';
  currencySymbol: '₹' | '$';
  children: MultiSchoolChild[];
  paymentHistory: MultiSchoolPaymentRecord[];
}

export const DEFAULT_PARENT_HUB_PROFILES: MultiSchoolParentProfile[] = [
  // =========================================================================
  // PROFILE 1: Alexander Morgan (2 Children • 2 Different Schools • $4,930 Total)
  // =========================================================================
  {
    id: 'HUB-PAR-001',
    parentName: 'Alexander Morgan',
    parentEmail: 'alex.morgan@example.com',
    parentPhone: '+1 (555) 018-4921',
    currency: 'USD',
    currencySymbol: '$',
    children: [
      {
        studentId: 'OAK-2026-881',
        studentName: 'Liam Morgan',
        gender: 'Male',
        grade: 'Grade 5',
        section: '5-B',
        schoolId: 'SCH-OAKRIDGE-INT',
        schoolName: 'Oakridge International Academy',
        schoolShortCode: 'Oakridge Academy',
        schoolBadgeColor: '#0284c7', // Sky Blue
        schoolCity: 'Boston / Central Campus',
        schoolErpSystem: 'Blackbaud SKY API Education',
        schoolLogoUrl: 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=128&auto=format&fit=crop&q=80',
        totalDue: 2850,
        activeFeesCount: 2,
        noticesCount: 3,
        fees: [
          {
            id: 'FEE-LIAM-TUIT',
            schoolId: 'SCH-OAKRIDGE-INT',
            schoolName: 'Oakridge International Academy',
            schoolShortCode: 'Oakridge Academy',
            schoolBadgeColor: '#0284c7',
            schoolErpSystem: 'Blackbaud General Ledger (GL-1010-00)',
            schoolGateway: 'Blackbaud Merchant Services (BBMS)',
            studentId: 'OAK-2026-881',
            studentName: 'Liam Morgan',
            grade: 'Grade 5',
            feeTitle: 'Term 2 Academic Tuition Fee',
            category: 'TUITION',
            amount: 2500,
            amountPaid: 0,
            dueDate: '2026-09-10',
            isOverdue: false,
            paymentStatus: 'UNPAID'
          },
          {
            id: 'FEE-LIAM-TECH',
            schoolId: 'SCH-OAKRIDGE-INT',
            schoolName: 'Oakridge International Academy',
            schoolShortCode: 'Oakridge Academy',
            schoolBadgeColor: '#0284c7',
            schoolErpSystem: 'Blackbaud General Ledger (GL-2020-04)',
            schoolGateway: 'Blackbaud Merchant Services (BBMS)',
            studentId: 'OAK-2026-881',
            studentName: 'Liam Morgan',
            grade: 'Grade 5',
            feeTitle: '5th Grade STEM & Robotics Lab Kit',
            category: 'TECH',
            amount: 350,
            amountPaid: 0,
            dueDate: '2026-09-10',
            isOverdue: false,
            paymentStatus: 'UNPAID'
          }
        ],
        notices: [
          {
            id: 'NOT-LIAM-1',
            schoolId: 'SCH-OAKRIDGE-INT',
            schoolName: 'Oakridge International Academy',
            studentId: 'OAK-2026-881',
            studentName: 'Liam Morgan',
            title: 'Parent-Teacher Conference (PTC) — Sept 12',
            summary: 'One-on-one progress review with Class Advisor & STEM Mentor in Room 302.',
            fullContent: 'Dear Parents, PTC for Term 1 progress analysis is scheduled for Friday, September 12th between 9:00 AM and 1:30 PM. Please book your 15-minute slot via the Parent Hub.',
            category: 'PTM',
            publishedDate: '2026-08-26',
            eventDate: '2026-09-12',
            actionRequired: true,
            actionLabel: 'Confirm PTC Slot'
          },
          {
            id: 'NOT-LIAM-2',
            schoolId: 'SCH-OAKRIDGE-INT',
            schoolName: 'Oakridge International Academy',
            studentId: 'OAK-2026-881',
            studentName: 'Liam Morgan',
            title: 'Term 1 Examination Schedule & Syllabus Blueprint',
            summary: 'Comprehensive date sheet released for Mathematics, Science, English & Computer Science.',
            category: 'EXAM',
            publishedDate: '2026-08-24',
            eventDate: '2026-09-18'
          },
          {
            id: 'NOT-LIAM-3',
            schoolId: 'SCH-OAKRIDGE-INT',
            schoolName: 'Oakridge International Academy',
            studentId: 'OAK-2026-881',
            studentName: 'Liam Morgan',
            title: 'Varsity Soccer & Track Tryouts Schedule',
            summary: 'Tryouts open for 5th grade students this Thursday after classes on South Field.',
            category: 'EVENT',
            publishedDate: '2026-08-22',
            eventDate: '2026-09-05'
          }
        ]
      },
      {
        studentId: 'STA-2026-442',
        studentName: 'Sophia Morgan',
        gender: 'Female',
        grade: 'Grade 2',
        section: '2-A',
        schoolId: 'SCH-STANDREWS-DAY',
        schoolName: 'St. Andrews Country Day School',
        schoolShortCode: 'St. Andrews',
        schoolBadgeColor: '#059669', // Emerald Green
        schoolCity: 'Newton / West Campus',
        schoolErpSystem: 'Powerschool Campus ERP v14',
        schoolLogoUrl: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=128&auto=format&fit=crop&q=80',
        totalDue: 2080,
        activeFeesCount: 2,
        noticesCount: 2,
        fees: [
          {
            id: 'FEE-SOPHIA-TUIT',
            schoolId: 'SCH-STANDREWS-DAY',
            schoolName: 'St. Andrews Country Day School',
            schoolShortCode: 'St. Andrews',
            schoolBadgeColor: '#059669',
            schoolErpSystem: 'Powerschool Finance Subledger (PS-901)',
            schoolGateway: 'Stripe Connect / SchoolPay Direct',
            studentId: 'STA-2026-442',
            studentName: 'Sophia Morgan',
            grade: 'Grade 2',
            feeTitle: 'Primary Tuition & Montessori Learning Materials',
            category: 'TUITION',
            amount: 1800,
            amountPaid: 0,
            dueDate: '2026-09-15',
            isOverdue: false,
            paymentStatus: 'UNPAID'
          },
          {
            id: 'FEE-SOPHIA-ACT',
            schoolId: 'SCH-STANDREWS-DAY',
            schoolName: 'St. Andrews Country Day School',
            schoolShortCode: 'St. Andrews',
            schoolBadgeColor: '#059669',
            schoolErpSystem: 'Powerschool Finance Subledger (PS-904)',
            schoolGateway: 'Stripe Connect / SchoolPay Direct',
            studentId: 'STA-2026-442',
            studentName: 'Sophia Morgan',
            grade: 'Grade 2',
            feeTitle: 'Creative Arts, Pottery & Annual Drama Activity Fee',
            category: 'ACTIVITY',
            amount: 280,
            amountPaid: 0,
            dueDate: '2026-09-15',
            isOverdue: false,
            paymentStatus: 'UNPAID'
          }
        ],
        notices: [
          {
            id: 'NOT-SOPHIA-1',
            schoolId: 'SCH-STANDREWS-DAY',
            schoolName: 'St. Andrews Country Day School',
            studentId: 'STA-2026-442',
            studentName: 'Sophia Morgan',
            title: 'Fall Mid-Term Recess & Campus Holiday Notice',
            summary: 'Campus closed on Friday September 18th for Faculty In-Service Day.',
            category: 'HOLIDAY',
            publishedDate: '2026-08-27',
            eventDate: '2026-09-18'
          },
          {
            id: 'NOT-SOPHIA-2',
            schoolId: 'SCH-STANDREWS-DAY',
            schoolName: 'St. Andrews Country Day School',
            studentId: 'STA-2026-442',
            studentName: 'Sophia Morgan',
            title: 'Annual Theater Production Costume Sizing & Registration',
            summary: 'Please submit costume measurements before September 20th.',
            category: 'EVENT',
            publishedDate: '2026-08-25',
            eventDate: '2026-09-20',
            actionRequired: true,
            actionLabel: 'Submit Costume Size'
          }
        ]
      }
    ],
    paymentHistory: [
      {
        transactionId: 'TXN-USA-88102',
        receiptNumber: 'REC-OAK-2026-041',
        paidAt: '2026-08-10T11:20:00.000Z',
        studentId: 'OAK-2026-881',
        studentName: 'Liam Morgan',
        schoolId: 'SCH-OAKRIDGE-INT',
        schoolName: 'Oakridge International Academy',
        feeTitle: 'Term 1 Tuition & Lab Fee',
        amount: 2500,
        currency: 'USD',
        paymentMethod: 'Credit Card (Apple Pay)',
        status: 'POSTED_TO_SCHOOL_ERP',
        authorizationCode: 'AUTH-BBMS-99120',
        subledgerJournalEntryId: 'GL-JE-USA-77821'
      },
      {
        transactionId: 'TXN-USA-88103',
        receiptNumber: 'REC-STA-2026-089',
        paidAt: '2026-08-15T15:45:00.000Z',
        studentId: 'STA-2026-442',
        studentName: 'Sophia Morgan',
        schoolId: 'SCH-STANDREWS-DAY',
        schoolName: 'St. Andrews Country Day School',
        feeTitle: 'Term 1 Admission & Classroom Materials',
        amount: 1800,
        currency: 'USD',
        paymentMethod: 'Credit Card (Visa)',
        status: 'POSTED_TO_SCHOOL_ERP',
        authorizationCode: 'AUTH-STRIPE-33419',
        subledgerJournalEntryId: 'PS-JE-88912'
      }
    ]
  },

  // =========================================================================
  // PROFILE 2: Robert Sterling (3 Children • 3 Schools • 8 Overdue Fees • $1,725)
  // =========================================================================
  {
    id: 'HUB-PAR-002',
    parentName: 'Robert Sterling',
    parentEmail: 'robert.sterling@example.com',
    parentPhone: '+1 (555) 019-0291',
    currency: 'USD',
    currencySymbol: '$',
    children: [
      {
        studentId: 'BB-STU-131',
        studentName: 'William Sterling',
        gender: 'Male',
        grade: 'Grade 10',
        section: '10-A',
        schoolId: 'SCH-OAK-UPPER',
        schoolName: 'Oakridge Upper Academy',
        schoolShortCode: 'Oakridge Academy',
        schoolBadgeColor: '#0369a1',
        schoolCity: 'Boston Campus',
        schoolErpSystem: 'Blackbaud SKY API Financial Edge NXT',
        totalDue: 830,
        activeFeesCount: 3,
        noticesCount: 2,
        fees: [
          {
            id: 'CHG-PHYS-131',
            schoolId: 'SCH-OAK-UPPER',
            schoolName: 'Oakridge Upper Academy',
            schoolShortCode: 'Oakridge Academy',
            schoolBadgeColor: '#0369a1',
            schoolErpSystem: 'Blackbaud General Ledger (GL-4040-02)',
            schoolGateway: 'Blackbaud Merchant Services (BBMS)',
            studentId: 'BB-STU-131',
            studentName: 'William Sterling',
            grade: 'Grade 10',
            feeTitle: 'AP Physics C & Advanced Robotics Lab Kit',
            category: 'TECH',
            amount: 280,
            amountPaid: 0,
            dueDate: '2026-07-15',
            isOverdue: true,
            paymentStatus: 'UNPAID'
          },
          {
            id: 'CHG-ROW-131',
            schoolId: 'SCH-OAK-UPPER',
            schoolName: 'Oakridge Upper Academy',
            schoolShortCode: 'Oakridge Academy',
            schoolBadgeColor: '#0369a1',
            schoolErpSystem: 'Blackbaud General Ledger (GL-2020-15)',
            schoolGateway: 'Blackbaud Merchant Services (BBMS)',
            studentId: 'BB-STU-131',
            studentName: 'William Sterling',
            grade: 'Grade 10',
            feeTitle: 'Varsity Crew & Head of Charles Regatta Travel',
            category: 'ATHLETIC',
            amount: 340,
            amountPaid: 0,
            dueDate: '2026-08-01',
            isOverdue: true,
            paymentStatus: 'UNPAID'
          },
          {
            id: 'CHG-MUNH-131',
            schoolId: 'SCH-OAK-UPPER',
            schoolName: 'Oakridge Upper Academy',
            schoolShortCode: 'Oakridge Academy',
            schoolBadgeColor: '#0369a1',
            schoolErpSystem: 'Blackbaud General Ledger (GL-3030-40)',
            schoolGateway: 'Blackbaud Merchant Services (BBMS)',
            studentId: 'BB-STU-131',
            studentName: 'William Sterling',
            grade: 'Grade 10',
            feeTitle: 'National Model UN Harvard Delegation Delegate Fee',
            category: 'ACTIVITY',
            amount: 210,
            amountPaid: 0,
            dueDate: '2026-08-15',
            isOverdue: true,
            paymentStatus: 'UNPAID'
          }
        ],
        notices: [
          {
            id: 'NOT-WILL-1',
            schoolId: 'SCH-OAK-UPPER',
            schoolName: 'Oakridge Upper Academy',
            studentId: 'BB-STU-131',
            studentName: 'William Sterling',
            title: 'College Board AP Exam Registration Window',
            summary: 'Final registration deadline for May 2027 AP Physics and AP Calc exams.',
            category: 'EXAM',
            publishedDate: '2026-08-20',
            eventDate: '2026-09-15'
          },
          {
            id: 'NOT-WILL-2',
            schoolId: 'SCH-OAK-UPPER',
            schoolName: 'Oakridge Upper Academy',
            studentId: 'BB-STU-131',
            studentName: 'William Sterling',
            title: 'Head of the Charles Regatta Itinerary & Medical Waiver',
            summary: 'Bus departure schedule and hotel lodging assignment confirmed.',
            category: 'LOGISTICS',
            publishedDate: '2026-08-25',
            eventDate: '2026-10-18',
            actionRequired: true,
            actionLabel: 'Sign Travel Waiver'
          }
        ]
      },
      {
        studentId: 'STJ-2026-904',
        studentName: 'Charlotte Sterling',
        gender: 'Female',
        grade: 'Grade 7',
        section: '7-A',
        schoolId: 'SCH-STJUDE-PREP',
        schoolName: "St. Jude's Jesuit Middle Prep",
        schoolShortCode: "St. Jude's Prep",
        schoolBadgeColor: '#7c3aed', // Purple
        schoolCity: 'Cambridge Campus',
        schoolErpSystem: 'Blackbaud Education Management Core',
        totalDue: 680,
        activeFeesCount: 3,
        noticesCount: 2,
        fees: [
          {
            id: 'CHG-ADIR-132',
            schoolId: 'SCH-STJUDE-PREP',
            schoolName: "St. Jude's Jesuit Middle Prep",
            schoolShortCode: "St. Jude's Prep",
            schoolBadgeColor: '#7c3aed',
            schoolErpSystem: 'Blackbaud General Ledger (GL-3030-55)',
            schoolGateway: 'Blackbaud Merchant Services (BBMS)',
            studentId: 'STJ-2026-904',
            studentName: 'Charlotte Sterling',
            grade: 'Grade 7',
            feeTitle: '7th Grade Adirondack Outdoor Leadership Expedition',
            category: 'EXPEDITION',
            amount: 325,
            amountPaid: 0,
            dueDate: '2026-07-20',
            isOverdue: true,
            paymentStatus: 'UNPAID'
          },
          {
            id: 'CHG-CELLO-132',
            schoolId: 'SCH-STJUDE-PREP',
            schoolName: "St. Jude's Jesuit Middle Prep",
            schoolShortCode: "St. Jude's Prep",
            schoolBadgeColor: '#7c3aed',
            schoolErpSystem: 'Blackbaud General Ledger (GL-2020-80)',
            schoolGateway: 'Blackbaud Merchant Services (BBMS)',
            studentId: 'STJ-2026-904',
            studentName: 'Charlotte Sterling',
            grade: 'Grade 7',
            feeTitle: 'MS Symphonic Orchestra Cello Rental & Maintenance',
            category: 'ACTIVITY',
            amount: 160,
            amountPaid: 0,
            dueDate: '2026-08-10',
            isOverdue: true,
            paymentStatus: 'UNPAID'
          },
          {
            id: 'CHG-FRRET-132',
            schoolId: 'SCH-STJUDE-PREP',
            schoolName: "St. Jude's Jesuit Middle Prep",
            schoolShortCode: "St. Jude's Prep",
            schoolBadgeColor: '#7c3aed',
            schoolErpSystem: 'Blackbaud General Ledger (GL-3030-40)',
            schoolGateway: 'Blackbaud Merchant Services (BBMS)',
            studentId: 'STJ-2026-904',
            studentName: 'Charlotte Sterling',
            grade: 'Grade 7',
            feeTitle: 'French Language Immersion Weekend Retreat',
            category: 'EXPEDITION',
            amount: 195,
            amountPaid: 0,
            dueDate: '2026-08-20',
            isOverdue: true,
            paymentStatus: 'UNPAID'
          }
        ],
        notices: [
          {
            id: 'NOT-CHAR-1',
            schoolId: 'SCH-STJUDE-PREP',
            schoolName: "St. Jude's Jesuit Middle Prep",
            studentId: 'STJ-2026-904',
            studentName: 'Charlotte Sterling',
            title: 'Middle School Fall Concert Auditions',
            summary: 'Audition slots for Symphony Orchestra and Jazz Ensemble open next week.',
            category: 'EVENT',
            publishedDate: '2026-08-24',
            eventDate: '2026-09-08'
          },
          {
            id: 'NOT-CHAR-2',
            schoolId: 'SCH-STJUDE-PREP',
            schoolName: "St. Jude's Jesuit Middle Prep",
            studentId: 'STJ-2026-904',
            studentName: 'Charlotte Sterling',
            title: 'Parent Council Meeting & Curriculum Night',
            summary: 'Meet Middle School Dean and Department Heads on September 12.',
            category: 'PTM',
            publishedDate: '2026-08-27',
            eventDate: '2026-09-12'
          }
        ]
      },
      {
        studentId: 'BHA-2026-310',
        studentName: 'Benjamin Sterling',
        gender: 'Male',
        grade: 'Grade 4',
        section: '4-A',
        schoolId: 'SCH-BEACON-HILL',
        schoolName: 'Beacon Hill Academy Elementary',
        schoolShortCode: 'Beacon Hill Prep',
        schoolBadgeColor: '#059669', // Emerald Green
        schoolCity: 'Beacon Hill Campus',
        schoolErpSystem: 'Veracross Elementary Student System',
        totalDue: 215,
        activeFeesCount: 2,
        noticesCount: 1,
        fees: [
          {
            id: 'CHG-HIST-133',
            schoolId: 'SCH-BEACON-HILL',
            schoolName: 'Beacon Hill Academy Elementary',
            schoolShortCode: 'Beacon Hill Prep',
            schoolBadgeColor: '#059669',
            schoolErpSystem: 'Veracross Billing Ledger',
            schoolGateway: 'Stripe Connect / Veracross Pay',
            studentId: 'BHA-2026-310',
            studentName: 'Benjamin Sterling',
            grade: 'Grade 4',
            feeTitle: '4th Grade Living History Museum & Transportation',
            category: 'ACTIVITY',
            amount: 120,
            amountPaid: 0,
            dueDate: '2026-07-30',
            isOverdue: true,
            paymentStatus: 'UNPAID'
          },
          {
            id: 'CHG-STEAM-133',
            schoolId: 'SCH-BEACON-HILL',
            schoolName: 'Beacon Hill Academy Elementary',
            schoolShortCode: 'Beacon Hill Prep',
            schoolBadgeColor: '#059669',
            schoolErpSystem: 'Veracross Billing Ledger',
            schoolGateway: 'Stripe Connect / Veracross Pay',
            studentId: 'BHA-2026-310',
            studentName: 'Benjamin Sterling',
            grade: 'Grade 4',
            feeTitle: 'Lower School STEAM Discovery & Coding Module Kit',
            category: 'TECH',
            amount: 95,
            amountPaid: 0,
            dueDate: '2026-08-05',
            isOverdue: true,
            paymentStatus: 'UNPAID'
          }
        ],
        notices: [
          {
            id: 'NOT-BEN-1',
            schoolId: 'SCH-BEACON-HILL',
            schoolName: 'Beacon Hill Academy Elementary',
            studentId: 'BHA-2026-310',
            studentName: 'Benjamin Sterling',
            title: 'Elementary Science Fair Volunteer Mentors Needed',
            summary: 'Parents invited to judge 4th grade invention displays on Friday.',
            category: 'EVENT',
            publishedDate: '2026-08-26',
            eventDate: '2026-09-15'
          }
        ]
      }
    ],
    paymentHistory: [
      {
        transactionId: 'TXN-BB-29182',
        receiptNumber: 'REC-OAK-2026-0091',
        paidAt: '2026-08-02T10:15:00.000Z',
        studentId: 'BB-STU-131',
        studentName: 'William Sterling',
        schoolId: 'SCH-OAK-UPPER',
        schoolName: 'Oakridge Upper Academy',
        feeTitle: 'Term 1 Technology & Digital Licensing',
        amount: 195,
        currency: 'USD',
        paymentMethod: 'Credit Card (Apple Pay)',
        status: 'POSTED_TO_SCHOOL_ERP',
        authorizationCode: 'AUTH-BBMS-77192',
        subledgerJournalEntryId: 'GL-JE-99012'
      }
    ]
  }
];

