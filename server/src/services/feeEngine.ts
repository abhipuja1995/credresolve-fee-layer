import { 
  UniversalFeeDefinition, 
  AudienceConfig, 
  StudentAccount, 
  StudentCharge,
  FormFieldSchema 
} from '../types/fee.js';
import { BlackbaudChargeItem } from '../types/blackbaud.js';
import { dataStore } from './mockDataStore.js';
import { batchQueueWorker } from './batchQueueWorker.js';
import { v4 as uuidv4 } from 'uuid';

export interface CreateFeeInput {
  title: string;
  description: string;
  bbFeeTypeId: string;
  baseAmount: number;
  dueDate: string;
  academicYear?: string;
  allowPartialPayment?: boolean;
  minPartialAmount?: number;
  audience: AudienceConfig;
  customFormSchema?: FormFieldSchema[];
  glAccountOverride?: string;
}

export class FeeEngine {
  /**
   * Resolves target students based on audience configuration
   */
  resolveTargetStudents(audience: AudienceConfig): StudentAccount[] {
    const allStudents = dataStore.students.filter(s => s.status === 'ACTIVE');

    switch (audience.type) {
      case 'ALL_STUDENTS':
        return allStudents;

      case 'GRADE':
        if (!audience.grades || audience.grades.length === 0) return [];
        return allStudents.filter(s => audience.grades!.includes(s.grade));

      case 'CUSTOM_STUDENT_IDS':
        if (!audience.studentIds || audience.studentIds.length === 0) return [];
        return allStudents.filter(s => audience.studentIds!.includes(s.studentId));

      case 'ATHLETIC_ROSTER':
      case 'CLASS':
        // For rosters, filter grades or return targeted subset
        if (audience.grades && audience.grades.length > 0) {
          return allStudents.filter(s => audience.grades!.includes(s.grade));
        }
        return allStudents.slice(0, 10);

      case 'PUBLIC_LINK':
        return []; // Created on-demand by guest payers

      default:
        return allStudents;
    }
  }

  /**
   * Creates, validates, and deploys a Universal Fee
   */
  async createAndDeployFee(input: CreateFeeInput): Promise<{
    fee: UniversalFeeDefinition;
    batchJobId: string;
    targetedStudentsCount: number;
  }> {
    // 1. Validate Fee Type existence in Blackbaud catalog
    const feeType = dataStore.feeTypes.find(ft => ft.feeTypeId === input.bbFeeTypeId);
    if (!feeType) {
      throw new Error(`Invalid Blackbaud Fee Type ID: "${input.bbFeeTypeId}". Fee type must exist in Blackbaud catalog.`);
    }

    if (input.baseAmount <= 0) {
      throw new Error('Base amount must be greater than $0.00');
    }

    const feeId = `fee-${uuidv4().substring(0, 8)}`;
    const now = new Date().toISOString();

    const fee: UniversalFeeDefinition = {
      id: feeId,
      schoolId: dataStore.environmentContext.environmentId,
      bbFeeTypeId: input.bbFeeTypeId,
      title: input.title.trim(),
      description: input.description.trim(),
      baseAmount: input.baseAmount,
      dueDate: input.dueDate,
      academicYear: input.academicYear || '2026-2027',
      allowPartialPayment: input.allowPartialPayment ?? feeType.allowPartialPayment,
      minPartialAmount: input.minPartialAmount,
      audience: input.audience,
      customFormSchema: input.customFormSchema || [],
      glAccountOverride: input.glAccountOverride,
      status: 'DEPLOYED',
      createdAt: now,
      updatedAt: now
    };

    // Save Fee Definition
    dataStore.fees.set(feeId, fee);

    // 2. Resolve audience
    const targetStudents = this.resolveTargetStudents(input.audience);

    // 3. Generate Blackbaud charge items and student charges
    const blackbaudCharges: BlackbaudChargeItem[] = [];

    targetStudents.forEach(student => {
      const chargeId = `CHG-${feeId}-${student.studentId}`;
      const clientChargeRef = `REF-${chargeId}`;

      // BB charge payload
      blackbaudCharges.push({
        clientChargeReferenceId: clientChargeRef,
        studentId: student.studentId,
        familyId: student.familyId,
        feeTypeId: fee.bbFeeTypeId,
        amount: fee.baseAmount,
        dueDate: fee.dueDate,
        description: fee.title,
        glAccountOverride: fee.glAccountOverride,
        academicYear: fee.academicYear
      });

      // Internal student subledger charge record
      const studentCharge: StudentCharge = {
        id: chargeId,
        feeId: fee.id,
        feeTitle: fee.title,
        schoolId: fee.schoolId,
        studentId: student.studentId,
        studentName: student.studentName,
        parentEmail: student.parentEmail,
        parentPhone: student.parentPhone,
        bbFeeTypeId: fee.bbFeeTypeId,
        amount: fee.baseAmount,
        amountPaid: 0.00,
        dueDate: fee.dueDate,
        paymentStatus: 'UNPAID',
        bbSyncStatus: 'QUEUED',
        bbClientChargeReferenceId: clientChargeRef,
        paymentReceipts: [],
        createdAt: now,
        updatedAt: now
      };

      dataStore.studentCharges.set(chargeId, studentCharge);
    });

    // 4. Enqueue Batch Ingestion Job for Blackbaud SKY API
    const batchJobId = await batchQueueWorker.enqueueBatch({
      feeId: fee.id,
      feeTitle: fee.title,
      charges: blackbaudCharges
    });

    return {
      fee,
      batchJobId,
      targetedStudentsCount: targetStudents.length
    };
  }

  /**
   * Retrieves all fees
   */
  getFees(): UniversalFeeDefinition[] {
    return Array.from(dataStore.fees.values()).sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  /**
   * Retrieves fee by ID
   */
  getFeeById(feeId: string): UniversalFeeDefinition | undefined {
    return dataStore.fees.get(feeId);
  }
}

export const feeEngine = new FeeEngine();
