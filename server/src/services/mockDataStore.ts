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
    { studentId: 'BB-STU-101', familyId: 'BB-FAM-501', studentName: 'Alexander Hayes', studentEmail: 'alex.h@oakridge.edu', studentMobile: '+1-555-0101', gender: 'Male', grade: 'Grade 8', school: 'Oakridge Middle School', homeroom: '8-A', parentName: 'Michael Hayes', parentEmail: 'michael.hayes@example.com', parentPhone: '+1-555-0101', parentMobile: '+1-555-0101', currentBalance: 450.00, status: 'ACTIVE' },
    { studentId: 'BB-STU-111', familyId: 'BB-FAM-501', studentName: 'Maya Hayes', studentEmail: 'maya.h@oakridge.edu', studentMobile: '+1-555-0101', gender: 'Female', grade: 'Grade 5', school: 'Oakridge Lower School', homeroom: '5-B', parentName: 'Michael Hayes', parentEmail: 'michael.hayes@example.com', parentPhone: '+1-555-0101', parentMobile: '+1-555-0101', currentBalance: 125.00, status: 'ACTIVE' },
    { studentId: 'BB-STU-102', familyId: 'BB-FAM-502', studentName: 'Sophia Patel', studentEmail: 'sophia.p@oakridge.edu', studentMobile: '+1-555-0102', gender: 'Female', grade: 'Grade 8', school: 'Oakridge Middle School', homeroom: '8-A', parentName: 'Priya Patel', parentEmail: 'priya.patel@example.com', parentPhone: '+1-555-0102', parentMobile: '+1-555-0102', currentBalance: 0.00, status: 'ACTIVE' },
    { studentId: 'BB-STU-112', familyId: 'BB-FAM-502', studentName: 'Aarav Patel', studentEmail: 'aarav.p@oakridge.edu', studentMobile: '+1-555-0102', gender: 'Male', grade: 'Grade 3', school: 'Oakridge Lower School', homeroom: '3-A', parentName: 'Priya Patel', parentEmail: 'priya.patel@example.com', parentPhone: '+1-555-0102', parentMobile: '+1-555-0102', currentBalance: 75.00, status: 'ACTIVE' },
    { studentId: 'BB-STU-103', familyId: 'BB-FAM-503', studentName: 'Lucas Vance', studentEmail: 'lucas.v@oakridge.edu', studentMobile: '+1-555-0103', gender: 'Male', grade: 'Grade 8', school: 'Oakridge Middle School', homeroom: '8-B', parentName: 'David Vance', parentEmail: 'david.vance@example.com', parentPhone: '+1-555-0103', parentMobile: '+1-555-0103', currentBalance: 125.00, status: 'ACTIVE' },
    { studentId: 'BB-STU-104', familyId: 'BB-FAM-504', studentName: 'Emma Richardson', studentEmail: 'emma.r@oakridge.edu', studentMobile: '+1-555-0104', gender: 'Female', grade: 'Grade 8', school: 'Oakridge Middle School', homeroom: '8-B', parentName: 'Sarah Richardson', parentEmail: 'sarah.r@example.com', parentPhone: '+1-555-0104', parentMobile: '+1-555-0104', currentBalance: 80.00, status: 'ACTIVE' },
    { studentId: 'BB-STU-105', familyId: 'BB-FAM-505', studentName: 'Benjamin Walker', studentEmail: 'ben.w@oakridge.edu', studentMobile: '+1-555-0105', gender: 'Male', grade: 'Grade 7', school: 'Oakridge Middle School', homeroom: '7-A', parentName: 'James Walker', parentEmail: 'james.walker@example.com', parentPhone: '+1-555-0105', parentMobile: '+1-555-0105', currentBalance: 0.00, status: 'ACTIVE' },
    { studentId: 'BB-STU-106', familyId: 'BB-FAM-506', studentName: 'Olivia Martinez', studentEmail: 'olivia.m@oakridge.edu', studentMobile: '+1-555-0106', gender: 'Female', grade: 'Grade 7', school: 'Oakridge Middle School', homeroom: '7-A', parentName: 'Carlos Martinez', parentEmail: 'carlos.m@example.com', parentPhone: '+1-555-0106', parentMobile: '+1-555-0106', currentBalance: 250.00, status: 'ACTIVE' },
    { studentId: 'BB-STU-107', familyId: 'BB-FAM-507', studentName: 'Ethan Wright', studentEmail: 'ethan.w@oakridge.edu', studentMobile: '+1-555-0107', gender: 'Male', grade: 'Grade 7', school: 'Oakridge Middle School', homeroom: '7-B', parentName: 'Laura Wright', parentEmail: 'laura.wright@example.com', parentPhone: '+1-555-0107', parentMobile: '+1-555-0107', currentBalance: 0.00, status: 'ACTIVE' },
    { studentId: 'BB-STU-108', familyId: 'BB-FAM-508', studentName: 'Mia Kim', studentEmail: 'mia.k@oakridge.edu', studentMobile: '+1-555-0108', gender: 'Female', grade: 'Grade 9', school: 'Oakridge Upper Academy', homeroom: '9-A', parentName: 'Daniel Kim', parentEmail: 'daniel.kim@example.com', parentPhone: '+1-555-0108', parentMobile: '+1-555-0108', currentBalance: 175.00, status: 'ACTIVE' },
    { studentId: 'BB-STU-109', familyId: 'BB-FAM-509', studentName: 'Noah Bennett', studentEmail: 'noah.b@oakridge.edu', studentMobile: '+1-555-0109', gender: 'Male', grade: 'Grade 9', school: 'Oakridge Upper Academy', homeroom: '9-A', parentName: 'Jessica Bennett', parentEmail: 'jessica.b@example.com', parentPhone: '+1-555-0109', parentMobile: '+1-555-0109', currentBalance: 320.00, status: 'ACTIVE' },
    { studentId: 'BB-STU-110', familyId: 'BB-FAM-510', studentName: 'Ava Jenkins', studentEmail: 'ava.j@oakridge.edu', studentMobile: '+1-555-0110', gender: 'Female', grade: 'Grade 9', school: 'Oakridge Upper Academy', homeroom: '9-B', parentName: 'Robert Jenkins', parentEmail: 'robert.j@example.com', parentPhone: '+1-555-0110', parentMobile: '+1-555-0110', currentBalance: 0.00, status: 'ACTIVE' }
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

    // Find siblings under same familyId
    const siblings = this.students.filter(s => s.familyId === student.familyId && s.studentId !== student.studentId);
    
    // Get charges for primary student and siblings
    const allFamilyStudentIds = [student.studentId, ...siblings.map(s => s.studentId)];
    const charges = Array.from(this.studentCharges.values()).filter(c => allFamilyStudentIds.includes(c.studentId));
    
    const studentCharges = charges.filter(c => c.studentId === student.studentId);
    const totalDue = studentCharges.reduce((acc, c) => acc + (c.amount - c.amountPaid), 0);
    const totalFamilyBalance = charges.reduce((acc, c) => acc + (c.amount - c.amountPaid), 0);

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
        homeroom: row.homeroom?.trim() || `${row.grade.slice(-1)}-A`,
        parentName: row.parent_name?.trim() || 'Parent / Guardian',
        parentEmail: row.parent_email?.trim() || 'parent@example.com',
        parentPhone: row.parent_mobile?.trim() || '+1-555-0100',
        parentMobile: row.parent_mobile?.trim() || '+1-555-0100',
        currentBalance: 0.00,
        status: 'ACTIVE'
      };

      if (existingIndex >= 0) {
        this.students[existingIndex] = {
          ...this.students[existingIndex],
          ...studentObj,
          currentBalance: this.students[existingIndex].currentBalance
        };
        updatedCount++;
      } else {
        this.students.push(studentObj);
        importedCount++;
      }
    }

    return {
      importedCount,
      updatedCount,
      totalStudents: this.students.length
    };
  }

  public getCandidateStudents(): Array<import('../types/blackbaud.js').BlackbaudCandidateStudent> {
    return this.students.map(s => {
      const nameParts = s.studentName.split(' ');
      const parentParts = s.parentName.split(' ');
      return {
        candidate_id: s.studentId,
        first_name: nameParts[0] || s.studentName,
        last_name: nameParts.slice(1).join(' ') || '',
        email: s.studentEmail || `${s.studentId.toLowerCase()}@oakridge.edu`,
        phone: s.studentMobile || s.parentPhone,
        gender: s.gender as string || 'Unspecified',
        grade_level: s.grade,
        school_name: s.school || 'Oakridge International Prep',
        parents: [
          {
            parent_id: `PAR-${s.studentId}`,
            first_name: parentParts[0] || s.parentName,
            last_name: parentParts.slice(1).join(' ') || '',
            email: s.parentEmail,
            phone: s.parentMobile || s.parentPhone,
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

    const sampleBatchId = 'BATCH-BB-89101';
    const batchSummary: TransactionBatchImportSummary = {
      batchId: sampleBatchId,
      clientBatchReferenceId: 'BATCH-REF-DC-TRIP-2026-001',
      status: 'COMPLETED',
      totalRecordsCount: 4,
      successfulRecordsCount: 4,
      failedRecordsCount: 0,
      submittedAt: new Date(Date.now() - 86400 * 3000).toISOString(),
      completedAt: new Date(Date.now() - 86400 * 3000 + 4200).toISOString(),
      processingTimeMs: 4200,
      errors: []
    };
    this.batches.set(sampleBatchId, batchSummary);

    const grade8Students = this.students.filter(s => s.grade === 'Grade 8');
    grade8Students.forEach((student, idx) => {
      const chargeId = `CHG-${sampleFeeId}-${student.studentId}`;
      const isPaid = idx === 1;
      const isPartial = idx === 0;
      
      const charge: StudentCharge = {
        id: chargeId,
        feeId: sampleFeeId,
        feeTitle: sampleFee.title,
        schoolId: this.environmentContext.environmentId,
        studentId: student.studentId,
        studentName: student.studentName,
        parentEmail: student.parentEmail,
        parentPhone: student.parentPhone,
        bbFeeTypeId: sampleFee.bbFeeTypeId,
        amount: sampleFee.baseAmount,
        amountPaid: isPaid ? 350.00 : (isPartial ? 150.00 : 0.00),
        dueDate: sampleFee.dueDate,
        paymentStatus: isPaid ? 'PAID' : (isPartial ? 'PARTIALLY_PAID' : 'UNPAID'),
        customFormResponses: isPaid ? {
          tshirt_size: 'Adult M',
          emergency_contact_phone: '+1-555-0102',
          dietary_restrictions: 'None'
        } : (isPartial ? {
          tshirt_size: 'Adult L',
          emergency_contact_phone: '+1-555-0101',
          dietary_restrictions: 'Nut allergy'
        } : undefined),
        waiverSignedAt: (isPaid || isPartial) ? new Date(Date.now() - 86400 * 2000).toISOString() : undefined,
        waiverSignerName: isPaid ? student.parentName : (isPartial ? student.parentName : undefined),
        bbSyncStatus: 'SYNCED',
        bbBatchId: sampleBatchId,
        bbClientChargeReferenceId: `REF-${chargeId}`,
        paymentReceipts: isPaid ? [{
          transactionId: `TXN-${uuidv4().substring(0, 8)}`,
          chargeId,
          amount: 350.00,
          paymentMethod: 'APPLE_PAY',
          paidAt: new Date(Date.now() - 86400 * 2000).toISOString(),
          receiptNumber: 'REC-2026-88912',
          status: 'SUCCESS',
          bbLedgerSyncStatus: 'SYNCED'
        }] : (isPartial ? [{
          transactionId: `TXN-${uuidv4().substring(0, 8)}`,
          chargeId,
          amount: 150.00,
          paymentMethod: 'CREDIT_CARD',
          cardBrand: 'Visa',
          last4: '4242',
          paidAt: new Date(Date.now() - 86400 * 1000).toISOString(),
          receiptNumber: 'REC-2026-88913',
          status: 'SUCCESS',
          bbLedgerSyncStatus: 'SYNCED'
        }] : []),
        createdAt: sampleFee.createdAt,
        updatedAt: sampleFee.updatedAt
      };

      this.studentCharges.set(chargeId, charge);
    });

    // Seed sibling charges for multi-child testing
    const mayaChargeId = `CHG-fee-stem-lab-BB-STU-111`;
    this.studentCharges.set(mayaChargeId, {
      id: mayaChargeId,
      feeId: 'fee-stem-lab-2026',
      feeTitle: '5th Grade Junior Robotics & STEM Lab Kit',
      schoolId: this.environmentContext.environmentId,
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
      bbClientChargeReferenceId: `REF-${mayaChargeId}`,
      paymentReceipts: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });

    const aaravChargeId = `CHG-fee-art-supplies-BB-STU-112`;
    this.studentCharges.set(aaravChargeId, {
      id: aaravChargeId,
      feeId: 'fee-art-2026',
      feeTitle: '3rd Grade Creative Arts & Ceramic Supplies',
      schoolId: this.environmentContext.environmentId,
      studentId: 'BB-STU-112',
      studentName: 'Aarav Patel',
      parentEmail: 'priya.patel@example.com',
      parentPhone: '+1-555-0102',
      bbFeeTypeId: 'FT-ACT-05',
      amount: 75.00,
      amountPaid: 0.00,
      dueDate: '2026-10-20',
      paymentStatus: 'UNPAID',
      bbSyncStatus: 'SYNCED',
      bbClientChargeReferenceId: `REF-${aaravChargeId}`,
      paymentReceipts: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
  }
}

export const dataStore = new MockDataStore();
