import { BlackbaudFeeType, TransactionBatchImportSummary, BlackbaudEnvironmentContext, SchoolBranding } from '../types/blackbaud.js';
import { UniversalFeeDefinition, StudentAccount, StudentCharge, PaymentTransaction } from '../types/fee.js';
import { v4 as uuidv4 } from 'uuid';

export class MockDataStore {
  public environmentContext: BlackbaudEnvironmentContext = {
    environmentId: process.env.BLACKBAUD_ENVIRONMENT_ID || 'bb-env-oakridge-2026',
    schoolName: 'Oakridge International Prep',
    subscriptionKey: process.env.BLACKBAUD_SUBSCRIPTION_KEY || 'ef89fdba1bd149ee8296bcda7add3e2a',
    accessToken: process.env.BLACKBAUD_OAUTH_TOKEN || 'bb_oauth2_tok_991204891283',
    tokenExpiresAt: new Date(Date.now() + 3600 * 1000).toISOString(),
    paymentConfigurationId: process.env.BLACKBAUD_PAYMENT_CONFIGURATION_ID || 'bbms_cfg_2026_live',
    branding: {
      schoolName: 'Oakridge International Prep',
      logoUrl: 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=150&auto=format&fit=crop&q=80',
      primaryColor: '#007ea8', // Blackbaud SKY UX Sky Blue
      secondaryColor: '#00b4e5', // Light Sky Accent
      backgroundColor: '#f4f5f7', // SKY UX Page Canvas
      surfaceColor: '#ffffff', // Clean White Card
      textColor: '#282b30' // SKY UX Charcoal Text
    }
  };

  public feeTypes: BlackbaudFeeType[] = [
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
      feeTypeId: 'FT-ATHL-02',
      name: 'Athletic Fee & Varsity Uniforms',
      category: 'ATHLETIC',
      glAccountCode: 'GL-2020-15',
      isActive: true,
      defaultAmount: 175.00,
      allowPartialPayment: false
    },
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

  public students: StudentAccount[] = [
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

  public fees: Map<string, UniversalFeeDefinition> = new Map();
  public batches: Map<string, TransactionBatchImportSummary> = new Map();
  public studentCharges: Map<string, StudentCharge> = new Map();

  constructor() {
    this.seedInitialData();
  }

  public updateBranding(brandingUpdate: Partial<SchoolBranding>) {
    this.environmentContext.branding = {
      ...this.environmentContext.branding,
      ...brandingUpdate
    };
    if (brandingUpdate.schoolName) {
      this.environmentContext.schoolName = brandingUpdate.schoolName;
    }
  }

  public addFeeType(feeType: Partial<BlackbaudFeeType>): BlackbaudFeeType {
    const customId = feeType.feeTypeId || `FT-CAT-${Date.now().toString().slice(-4)}`;
    const newFeeType: BlackbaudFeeType = {
      feeTypeId: customId,
      name: feeType.name || 'Untitled Fee Category',
      category: feeType.category || 'ACTIVITY',
      glAccountCode: feeType.glAccountCode || `GL-${Math.floor(1000 + Math.random() * 8999)}-${Math.floor(10 + Math.random() * 89)}`,
      isActive: true,
      defaultAmount: Number(feeType.defaultAmount) || 100.00,
      allowPartialPayment: feeType.allowPartialPayment ?? true
    };
    this.feeTypes.unshift(newFeeType);
    return newFeeType;
  }

  public lookupStudent(query: string) {
    const cleanQuery = query.trim().toLowerCase();
    const digitsOnly = cleanQuery.replace(/\D/g, '');

    const student = this.students.find(s => {
      if (s.studentId.toLowerCase() === cleanQuery) return true;
      if (s.studentName.toLowerCase().includes(cleanQuery)) return true;
      if (s.parentEmail.toLowerCase() === cleanQuery) return true;
      if (s.studentEmail?.toLowerCase() === cleanQuery) return true;
      
      const phoneDigits = (s.parentPhone || '').replace(/\D/g, '');
      if (digitsOnly.length >= 4 && phoneDigits.endsWith(digitsOnly)) return true;
      if (s.parentPhone?.toLowerCase() === cleanQuery) return true;

      const studentPhoneDigits = (s.studentMobile || '').replace(/\D/g, '');
      if (digitsOnly.length >= 4 && studentPhoneDigits.endsWith(digitsOnly)) return true;

      return false;
    });

    if (!student) return null;

    // Find siblings under same familyId or matching parentEmail
    const siblings = this.students.filter(s => 
      (s.familyId === student.familyId || (student.parentEmail && s.parentEmail.toLowerCase() === student.parentEmail.toLowerCase())) &&
      s.studentId !== student.studentId
    );
    
    // Get charges for primary student and siblings
    const allFamilyStudentIds = [student.studentId, ...siblings.map(s => s.studentId)];
    const charges = Array.from(this.studentCharges.values()).filter(c => allFamilyStudentIds.includes(c.studentId));
    
    const studentCharges = charges.filter(c => c.studentId === student.studentId);
    const totalDue = studentCharges.reduce((acc, c) => acc + Math.max(0, c.amount - c.amountPaid), 0);
    const totalFamilyBalance = charges.reduce((acc, c) => acc + Math.max(0, c.amount - c.amountPaid), 0);

    return {
      student,
      siblings,
      charges,
      totalDue,
      totalFamilyBalance
    };
  }

  public importStudentsCsv(rows: Array<import('../types/blackbaud.js').StudentCsvRow>) {
    let importedCount = 0;
    let updatedCount = 0;

    for (const row of rows) {
      if (!row.student_id || !row.student_name || !row.grade) continue;

      const existingIndex = this.students.findIndex(s => s.studentId.toLowerCase() === row.student_id.toLowerCase());
      const studentObj: StudentAccount = {
        studentId: row.student_id.trim(),
        familyId: row.family_id?.trim() || `BB-FAM-${Math.floor(500 + Math.random() * 499)}`,
        studentName: row.student_name.trim(),
        studentEmail: row.student_email?.trim() || `${row.student_name.toLowerCase().replace(/\s+/g, '.')}@oakridge.edu`,
        studentMobile: row.student_mobile?.trim() || '+1-555-0199',
        gender: row.gender || 'Prefer not to say',
        grade: row.grade.trim(),
        school: row.school?.trim() || 'Oakridge International Prep',
        homeroom: row.homeroom?.trim() || 'General',
        parentName: row.parent_name?.trim() || 'Parent / Guardian',
        parentEmail: row.parent_email?.trim() || 'parent@oakridge.edu',
        parentPhone: row.parent_mobile?.trim() || '+1-555-0100',
        parentMobile: row.parent_mobile?.trim() || '+1-555-0100',
        currentBalance: 0,
        status: 'ACTIVE'
      };

      if (existingIndex >= 0) {
        this.students[existingIndex] = { ...this.students[existingIndex], ...studentObj };
        updatedCount++;
      } else {
        this.students.push(studentObj);
        importedCount++;
      }
    }

    return { importedCount, updatedCount, totalStudents: this.students.length };
  }

  public getCandidateStudents() {
    return this.students.map(s => {
      const names = s.studentName.split(' ');
      const parentNames = s.parentName.split(' ');
      return {
        candidate_id: s.studentId,
        first_name: names[0] || s.studentName,
        last_name: names.slice(1).join(' ') || 'Student',
        email: s.studentEmail || `${s.studentId.toLowerCase()}@oakridge.edu`,
        phone: s.studentMobile || s.parentPhone,
        gender: s.gender || 'Not specified',
        grade_level: s.grade,
        school_name: s.school || 'Oakridge International Prep',
        parents: [
          {
            parent_id: `PAR-${s.studentId}`,
            first_name: parentNames[0] || s.parentName,
            last_name: parentNames.slice(1).join(' ') || 'Parent',
            email: s.parentEmail,
            phone: s.parentPhone,
            relationship: 'Parent / Guardian'
          }
        ]
      };
    });
  }

  private seedInitialData() {
    const sampleFeeId = 'fee-dc-trip-2026';
    const sampleFee: UniversalFeeDefinition = {
      id: sampleFeeId,
      schoolId: this.environmentContext.environmentId,
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
        },
        {
          id: 'dietary_restrictions',
          label: 'Dietary Restrictions or Allergies',
          type: 'text',
          required: false,
          placeholder: 'e.g. Peanut allergy, Vegetarian, Gluten-free'
        },
        {
          id: 'liability_waiver',
          label: 'Parent / Guardian Excursion Consent & Medical Waiver',
          type: 'waiver_signature',
          required: true,
          waiverText: 'I hereby give permission for my student to participate in the school excursion. In case of emergency, I authorize the school chaperone to secure required medical treatment.'
        }
      ],
      status: 'DEPLOYED',
      createdAt: new Date(Date.now() - 86400 * 3000).toISOString(),
      updatedAt: new Date(Date.now() - 86400 * 3000).toISOString()
    };

    this.fees.set(sampleFeeId, sampleFee);

    const helperAddCharge = (chg: {
      id: string;
      feeId: string;
      feeTitle: string;
      studentId: string;
      studentName: string;
      parentEmail: string;
      parentPhone: string;
      bbFeeTypeId: string;
      amount: number;
      amountPaid: number;
      dueDate: string;
      paymentStatus: 'UNPAID' | 'PARTIALLY_PAID' | 'PAID';
    }) => {
      this.studentCharges.set(chg.id, {
        ...chg,
        schoolId: this.environmentContext.environmentId,
        bbSyncStatus: 'SYNCED',
        bbClientChargeReferenceId: `REF-${chg.id}`,
        paymentReceipts: chg.amountPaid > 0 ? [{
          transactionId: `TXN-${uuidv4().substring(0, 8)}`,
          chargeId: chg.id,
          amount: chg.amountPaid,
          paymentMethod: 'Blackbaud Merchant Services (BBMS)',
          paidAt: new Date(Date.now() - 86400 * 1000).toISOString(),
          receiptNumber: `REC-2026-${Math.floor(10000 + Math.random() * 89999)}`,
          status: 'SUCCESS',
          bbLedgerSyncStatus: 'SYNCED'
        }] : [],
        createdAt: new Date(Date.now() - 86400 * 5000).toISOString(),
        updatedAt: new Date(Date.now() - 86400 * 1000).toISOString()
      });
    };

    // ==========================================
    // FAMILY 1: Michael Hayes (Alexander & Maya)
    // ==========================================
    helperAddCharge({
      id: 'CHG-DC-TRIP-BB-STU-101',
      feeId: sampleFeeId,
      feeTitle: '8th Grade Washington D.C. Educational Tour',
      studentId: 'BB-STU-101',
      studentName: 'Alexander Hayes',
      parentEmail: 'michael.hayes@example.com',
      parentPhone: '+1-555-0101',
      bbFeeTypeId: 'FT-TRIP-03',
      amount: 350.00,
      amountPaid: 150.00,
      dueDate: '2026-09-30',
      paymentStatus: 'PARTIALLY_PAID'
    });
    helperAddCharge({
      id: 'CHG-ATHL-BB-STU-101',
      feeId: 'fee-athl-2026',
      feeTitle: 'Middle School Varsity Basketball & Athletic Kit',
      studentId: 'BB-STU-101',
      studentName: 'Alexander Hayes',
      parentEmail: 'michael.hayes@example.com',
      parentPhone: '+1-555-0101',
      bbFeeTypeId: 'FT-ATHL-02',
      amount: 175.00,
      amountPaid: 0.00,
      dueDate: '2026-10-10',
      paymentStatus: 'UNPAID'
    });
    helperAddCharge({
      id: 'CHG-STEM-BB-STU-111',
      feeId: 'fee-stem-lab-2026',
      feeTitle: '5th Grade Junior Robotics & STEM Lab Kit',
      studentId: 'BB-STU-111',
      studentName: 'Maya Hayes',
      parentEmail: 'michael.hayes@example.com',
      parentPhone: '+1-555-0101',
      bbFeeTypeId: 'FT-TECH-04',
      amount: 125.00,
      amountPaid: 0.00,
      dueDate: '2026-10-15',
      paymentStatus: 'UNPAID'
    });
    helperAddCharge({
      id: 'CHG-MUSIC-BB-STU-111',
      feeId: 'fee-music-2026',
      feeTitle: 'Lower School Music Conservatory & Recorder',
      studentId: 'BB-STU-111',
      studentName: 'Maya Hayes',
      parentEmail: 'michael.hayes@example.com',
      parentPhone: '+1-555-0101',
      bbFeeTypeId: 'FT-ACT-05',
      amount: 65.00,
      amountPaid: 0.00,
      dueDate: '2026-10-25',
      paymentStatus: 'UNPAID'
    });

    // ==========================================
    // FAMILY 2: Priya Patel (Sophia & Aarav)
    // ==========================================
    helperAddCharge({
      id: 'CHG-MUN-BB-STU-102',
      feeId: 'fee-mun-2026',
      feeTitle: 'Model UN National Summit Registration',
      studentId: 'BB-STU-102',
      studentName: 'Sophia Patel',
      parentEmail: 'priya.patel@example.com',
      parentPhone: '+1-555-0102',
      bbFeeTypeId: 'FT-ACT-05',
      amount: 180.00,
      amountPaid: 0.00,
      dueDate: '2026-10-05',
      paymentStatus: 'UNPAID'
    });
    helperAddCharge({
      id: 'CHG-ORCH-BB-STU-102',
      feeId: 'fee-orch-2026',
      feeTitle: 'Middle School Symphony Orchestra Fee',
      studentId: 'BB-STU-102',
      studentName: 'Sophia Patel',
      parentEmail: 'priya.patel@example.com',
      parentPhone: '+1-555-0102',
      bbFeeTypeId: 'FT-ACT-05',
      amount: 120.00,
      amountPaid: 50.00,
      dueDate: '2026-10-20',
      paymentStatus: 'PARTIALLY_PAID'
    });
    helperAddCharge({
      id: 'CHG-SCI-BB-STU-112',
      feeId: 'fee-sci-2026',
      feeTitle: '3rd Grade Discovery Science Fair & Planetarium',
      studentId: 'BB-STU-112',
      studentName: 'Aarav Patel',
      parentEmail: 'priya.patel@example.com',
      parentPhone: '+1-555-0102',
      bbFeeTypeId: 'FT-TRIP-03',
      amount: 75.00,
      amountPaid: 0.00,
      dueDate: '2026-10-22',
      paymentStatus: 'UNPAID'
    });
    helperAddCharge({
      id: 'CHG-ART-BB-STU-112',
      feeId: 'fee-art-2026',
      feeTitle: 'Lower School Art & Ceramics Studio Fee',
      studentId: 'BB-STU-112',
      studentName: 'Aarav Patel',
      parentEmail: 'priya.patel@example.com',
      parentPhone: '+1-555-0102',
      bbFeeTypeId: 'FT-ACT-05',
      amount: 55.00,
      amountPaid: 0.00,
      dueDate: '2026-10-30',
      paymentStatus: 'UNPAID'
    });

    // ==========================================
    // FAMILY 3: David Vance (Lucas & Chloe)
    // ==========================================
    helperAddCharge({
      id: 'CHG-DC-BB-STU-103',
      feeId: sampleFeeId,
      feeTitle: '8th Grade Washington D.C. Educational Tour',
      studentId: 'BB-STU-103',
      studentName: 'Lucas Vance',
      parentEmail: 'david.vance@example.com',
      parentPhone: '+1-555-0103',
      bbFeeTypeId: 'FT-TRIP-03',
      amount: 350.00,
      amountPaid: 0.00,
      dueDate: '2026-09-30',
      paymentStatus: 'UNPAID'
    });
    helperAddCharge({
      id: 'CHG-CODE-BB-STU-103',
      feeId: 'fee-code-2026',
      feeTitle: 'Python & AI Software Lab License',
      studentId: 'BB-STU-103',
      studentName: 'Lucas Vance',
      parentEmail: 'david.vance@example.com',
      parentPhone: '+1-555-0103',
      bbFeeTypeId: 'FT-TECH-04',
      amount: 140.00,
      amountPaid: 0.00,
      dueDate: '2026-10-15',
      paymentStatus: 'UNPAID'
    });
    helperAddCharge({
      id: 'CHG-CAMP-BB-STU-126',
      feeId: 'fee-camp-2026',
      feeTitle: '6th Grade Outdoor Wilderness Leadership Camp',
      studentId: 'BB-STU-126',
      studentName: 'Chloe Vance',
      parentEmail: 'david.vance@example.com',
      parentPhone: '+1-555-0103',
      bbFeeTypeId: 'FT-CAMP-06',
      amount: 225.00,
      amountPaid: 100.00,
      dueDate: '2026-10-18',
      paymentStatus: 'PARTIALLY_PAID'
    });
    helperAddCharge({
      id: 'CHG-FR-BB-STU-126',
      feeId: 'fee-fr-2026',
      feeTitle: 'French Cultural Immersion Workshop',
      studentId: 'BB-STU-126',
      studentName: 'Chloe Vance',
      parentEmail: 'david.vance@example.com',
      parentPhone: '+1-555-0103',
      bbFeeTypeId: 'FT-ACT-05',
      amount: 95.00,
      amountPaid: 0.00,
      dueDate: '2026-11-01',
      paymentStatus: 'UNPAID'
    });

    // ==========================================
    // FAMILY 4: Carlos Martinez (Olivia & Mateo)
    // ==========================================
    helperAddCharge({
      id: 'CHG-STEM-BB-STU-106',
      feeId: 'fee-stem-7-2026',
      feeTitle: '7th Grade STEM Robotics & 1-to-1 Device Fee',
      studentId: 'BB-STU-106',
      studentName: 'Olivia Martinez',
      parentEmail: 'carlos.m@example.com',
      parentPhone: '+1-555-0106',
      bbFeeTypeId: 'FT-TECH-04',
      amount: 250.00,
      amountPaid: 0.00,
      dueDate: '2026-10-12',
      paymentStatus: 'UNPAID'
    });
    helperAddCharge({
      id: 'CHG-TENNIS-BB-STU-106',
      feeId: 'fee-tennis-2026',
      feeTitle: 'Middle School Tennis Team & Uniform Package',
      studentId: 'BB-STU-106',
      studentName: 'Olivia Martinez',
      parentEmail: 'carlos.m@example.com',
      parentPhone: '+1-555-0106',
      bbFeeTypeId: 'FT-ATHL-02',
      amount: 160.00,
      amountPaid: 60.00,
      dueDate: '2026-10-25',
      paymentStatus: 'PARTIALLY_PAID'
    });
    helperAddCharge({
      id: 'CHG-HIST-BB-STU-127',
      feeId: 'fee-hist-2026',
      feeTitle: '4th Grade State History Excursion',
      studentId: 'BB-STU-127',
      studentName: 'Mateo Martinez',
      parentEmail: 'carlos.m@example.com',
      parentPhone: '+1-555-0106',
      bbFeeTypeId: 'FT-TRIP-03',
      amount: 110.00,
      amountPaid: 0.00,
      dueDate: '2026-10-28',
      paymentStatus: 'UNPAID'
    });
    helperAddCharge({
      id: 'CHG-MATH-BB-STU-127',
      feeId: 'fee-math-2026',
      feeTitle: 'Junior Math Olympiad Enrollment',
      studentId: 'BB-STU-127',
      studentName: 'Mateo Martinez',
      parentEmail: 'carlos.m@example.com',
      parentPhone: '+1-555-0106',
      bbFeeTypeId: 'FT-ACT-05',
      amount: 85.00,
      amountPaid: 0.00,
      dueDate: '2026-11-05',
      paymentStatus: 'UNPAID'
    });

    // ==========================================
    // FAMILY 5: Jessica Bennett (Noah, Liam, Emma)
    // ==========================================
    helperAddCharge({
      id: 'CHG-BIO-BB-STU-109',
      feeId: 'fee-bio-2026',
      feeTitle: 'AP Biology Lab Equipment & Microscopy Kit',
      studentId: 'BB-STU-109',
      studentName: 'Noah Bennett',
      parentEmail: 'jessica.b@example.com',
      parentPhone: '+1-555-0109',
      bbFeeTypeId: 'FT-TECH-04',
      amount: 210.00,
      amountPaid: 0.00,
      dueDate: '2026-10-15',
      paymentStatus: 'UNPAID'
    });
    helperAddCharge({
      id: 'CHG-TRACK-BB-STU-109',
      feeId: 'fee-track-2026',
      feeTitle: 'Upper School Varsity Track & Field Package',
      studentId: 'BB-STU-109',
      studentName: 'Noah Bennett',
      parentEmail: 'jessica.b@example.com',
      parentPhone: '+1-555-0109',
      bbFeeTypeId: 'FT-ATHL-02',
      amount: 145.00,
      amountPaid: 0.00,
      dueDate: '2026-10-22',
      paymentStatus: 'UNPAID'
    });
    helperAddCharge({
      id: 'CHG-MBIO-BB-STU-128',
      feeId: 'fee-mbio-2026',
      feeTitle: '7th Grade Marine Biology Coastal Field Study',
      studentId: 'BB-STU-128',
      studentName: 'Liam Bennett',
      parentEmail: 'jessica.b@example.com',
      parentPhone: '+1-555-0109',
      bbFeeTypeId: 'FT-TRIP-03',
      amount: 185.00,
      amountPaid: 0.00,
      dueDate: '2026-10-26',
      paymentStatus: 'UNPAID'
    });
    helperAddCharge({
      id: 'CHG-CHESS-BB-STU-128',
      feeId: 'fee-chess-2026',
      feeTitle: 'Middle School Chess Club & Tournament',
      studentId: 'BB-STU-128',
      studentName: 'Liam Bennett',
      parentEmail: 'jessica.b@example.com',
      parentPhone: '+1-555-0109',
      bbFeeTypeId: 'FT-ACT-05',
      amount: 70.00,
      amountPaid: 0.00,
      dueDate: '2026-11-02',
      paymentStatus: 'UNPAID'
    });
    helperAddCharge({
      id: 'CHG-ZOO-BB-STU-129',
      feeId: 'fee-zoo-2026',
      feeTitle: '3rd Grade Spring Safari Zoo Workshop',
      studentId: 'BB-STU-129',
      studentName: 'Emma Bennett',
      parentEmail: 'jessica.b@example.com',
      parentPhone: '+1-555-0109',
      bbFeeTypeId: 'FT-TRIP-03',
      amount: 80.00,
      amountPaid: 0.00,
      dueDate: '2026-11-10',
      paymentStatus: 'UNPAID'
    });

    // ==========================================
    // FAMILY 6: Marcus Brooks (Jackson & Harper)
    // ==========================================
    helperAddCharge({
      id: 'CHG-DC-BB-STU-115',
      feeId: sampleFeeId,
      feeTitle: '8th Grade Washington D.C. Educational Tour',
      studentId: 'BB-STU-115',
      studentName: 'Jackson Brooks',
      parentEmail: 'marcus.b@example.com',
      parentPhone: '+1-555-0115',
      bbFeeTypeId: 'FT-TRIP-03',
      amount: 350.00,
      amountPaid: 150.00,
      dueDate: '2026-09-30',
      paymentStatus: 'PARTIALLY_PAID'
    });
    helperAddCharge({
      id: 'CHG-WIND-BB-STU-115',
      feeId: 'fee-wind-2026',
      feeTitle: 'Advanced Wind Ensemble & Trumpet Rental',
      studentId: 'BB-STU-115',
      studentName: 'Jackson Brooks',
      parentEmail: 'marcus.b@example.com',
      parentPhone: '+1-555-0115',
      bbFeeTypeId: 'FT-ACT-05',
      amount: 130.00,
      amountPaid: 0.00,
      dueDate: '2026-10-18',
      paymentStatus: 'UNPAID'
    });
    helperAddCharge({
      id: 'CHG-SCI-BB-STU-130',
      feeId: 'fee-sci-6-2026',
      feeTitle: '6th Grade Science Exploration Lab Kit',
      studentId: 'BB-STU-130',
      studentName: 'Harper Brooks',
      parentEmail: 'marcus.b@example.com',
      parentPhone: '+1-555-0115',
      bbFeeTypeId: 'FT-TECH-04',
      amount: 115.00,
      amountPaid: 0.00,
      dueDate: '2026-10-25',
      paymentStatus: 'UNPAID'
    });
    helperAddCharge({
      id: 'CHG-DRAMA-BB-STU-130',
      feeId: 'fee-drama-2026',
      feeTitle: 'Drama Club Musical Production Fee',
      studentId: 'BB-STU-130',
      studentName: 'Harper Brooks',
      parentEmail: 'marcus.b@example.com',
      parentPhone: '+1-555-0115',
      bbFeeTypeId: 'FT-ACT-05',
      amount: 90.00,
      amountPaid: 0.00,
      dueDate: '2026-11-05',
      paymentStatus: 'UNPAID'
    });
  }
}

export const dataStore = new MockDataStore();
