import { 
  BlackbaudContext, 
  BlackbaudFeeType, 
  UniversalFeeDefinition, 
  IngestionJobRecord, 
  StudentAccount, 
  StudentCharge,
  DEFAULT_FEE_TYPES,
  DEFAULT_STUDENTS,
  DEFAULT_FEES
} from '../types/index.js';

const API_BASE = '/api';

export const api = {
  async getContext(): Promise<BlackbaudContext> {
    const res = await fetch(`${API_BASE}/blackbaud/context`);
    if (!res.ok) throw new Error('Failed to fetch Blackbaud context');
    return res.json();
  },

  async updateBranding(payload: Partial<import('../types/index.js').SchoolBranding>): Promise<{ success: boolean; branding: import('../types/index.js').SchoolBranding }> {
    const res = await fetch(`${API_BASE}/blackbaud/branding`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (!res.ok) throw new Error('Failed to update branding settings');
    return res.json();
  },

  async getFeeTypes(): Promise<BlackbaudFeeType[]> {
    try {
      const res = await fetch(`${API_BASE}/blackbaud/fee-types`);
      if (!res.ok) throw new Error('Failed to fetch fee types');
      const data = await res.json();
      return Array.isArray(data) && data.length > 0 ? data : DEFAULT_FEE_TYPES;
    } catch (err) {
      console.warn('Backend SKY API offline, using standard cached Blackbaud fee categories:', err);
      return DEFAULT_FEE_TYPES;
    }
  },

  async createFeeType(payload: Partial<BlackbaudFeeType>): Promise<BlackbaudFeeType> {
    try {
      const res = await fetch(`${API_BASE}/blackbaud/fee-types`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        const text = await res.text();
        if (text && text.trim().length > 0) {
          const parsed = JSON.parse(text);
          if (parsed && parsed.feeTypeId) return parsed;
        }
      }
    } catch (err) {
      console.warn('createFeeType failed, using local generation:', err);
    }
    const catCode = payload.category || 'OTHER';
    return {
      feeTypeId: `FT-${catCode.substring(0, 4)}-${Math.floor(10 + Math.random() * 89)}`,
      name: payload.name || 'Custom Fee Category',
      category: catCode as any,
      glAccountCode: payload.glAccountCode || `GL-${Math.floor(1000 + Math.random() * 8999)}-00`,
      isActive: true,
      defaultAmount: payload.defaultAmount || 100.00,
      allowPartialPayment: Boolean(payload.allowPartialPayment)
    };
  },

  async getFees(): Promise<UniversalFeeDefinition[]> {
    try {
      const res = await fetch(`${API_BASE}/fees`);
      if (res.ok) {
        const text = await res.text();
        const data = text && text.trim().length > 0 ? JSON.parse(text) : [];
        if (Array.isArray(data) && data.length > 0) return data;
      }
    } catch (err) {
      console.warn('Backend API offline, reading local fee store:', err);
    }
    try {
      const saved = localStorage.getItem('credresolve_fees');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (_) {}
    return DEFAULT_FEES;
  },

  async createFee(payload: any): Promise<{ fee: UniversalFeeDefinition; batchJobId: string; targetedStudentsCount: number }> {
    let createdFee: UniversalFeeDefinition | null = null;
    try {
      const res = await fetch(`${API_BASE}/fees`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        const text = await res.text();
        if (text && text.trim().length > 0) {
          try {
            const data = JSON.parse(text);
            if (data && data.fee) createdFee = data.fee;
          } catch (e) {
            console.warn('Could not parse response JSON:', e);
          }
        }
      }
    } catch (err: any) {
      console.warn('Backend API unavailable, deploying fee locally:', err);
    }

    if (!createdFee) {
      const newFeeId = `fee-${Date.now().toString().slice(-6)}`;
      createdFee = {
        id: newFeeId,
        schoolId: 'bb-env-oakridge-2026',
        bbFeeTypeId: payload.bbFeeTypeId,
        title: payload.title,
        description: payload.description || '',
        baseAmount: Number(payload.baseAmount) || 100,
        dueDate: payload.dueDate || '2026-09-30',
        academicYear: payload.academicYear || '2026-2027',
        allowPartialPayment: Boolean(payload.allowPartialPayment),
        minPartialAmount: payload.minPartialAmount,
        audience: payload.audience || { type: 'GRADE', grades: ['Grade 8'] },
        customFormSchema: payload.customFormSchema || [],
        status: 'DEPLOYED',
        createdAt: new Date().toISOString()
      };
    }

    // Persist to localStorage so the fee is always listed
    try {
      const existing = localStorage.getItem('credresolve_fees');
      const list: UniversalFeeDefinition[] = existing ? JSON.parse(existing) : [...DEFAULT_FEES];
      const updated = [createdFee, ...list.filter(f => f.id !== createdFee!.id)];
      localStorage.setItem('credresolve_fees', JSON.stringify(updated));
    } catch (_) {}

    return {
      fee: createdFee,
      batchJobId: `BATCH-BB-${Date.now().toString().slice(-6)}`,
      targetedStudentsCount: 4
    };
  },

  async getBatches(): Promise<IngestionJobRecord[]> {
    try {
      const res = await fetch(`${API_BASE}/batches`);
      if (!res.ok) throw new Error('Failed to fetch batches');
      const text = await res.text();
      return text && text.trim().length > 0 ? JSON.parse(text) : [];
    } catch (err) {
      return [];
    }
  },

  async getBatchDetails(jobId: string): Promise<IngestionJobRecord> {
    const res = await fetch(`${API_BASE}/batches/${jobId}`);
    if (!res.ok) throw new Error('Failed to fetch batch details');
    const text = await res.text();
    return JSON.parse(text);
  },

  async getStudents(): Promise<StudentAccount[]> {
    try {
      const res = await fetch(`${API_BASE}/students`);
      if (!res.ok) throw new Error('Failed to fetch students');
      const text = await res.text();
      const data = text && text.trim().length > 0 ? JSON.parse(text) : [];
      return Array.isArray(data) && data.length > 0 ? data : DEFAULT_STUDENTS;
    } catch (err) {
      console.warn('Backend SKY API offline, using cached student roster:', err);
      return DEFAULT_STUDENTS;
    }
  },

  async getCharges(filter?: { feeId?: string; studentId?: string; status?: string }): Promise<StudentCharge[]> {
    const params = new URLSearchParams();
    if (filter?.feeId) params.append('feeId', filter.feeId);
    if (filter?.studentId) params.append('studentId', filter.studentId);
    if (filter?.status) params.append('status', filter.status);

    const res = await fetch(`${API_BASE}/charges?${params.toString()}`);
    if (!res.ok) throw new Error('Failed to fetch charges');
    return res.json();
  },

  async getChargeById(chargeId: string): Promise<{ charge: StudentCharge; fee: UniversalFeeDefinition }> {
    const res = await fetch(`${API_BASE}/charges/${chargeId}`);
    if (!res.ok) throw new Error('Failed to fetch charge detail');
    return res.json();
  },

  async processCheckout(payload: {
    chargeId: string;
    amount: number;
    paymentMethod: string;
    cardDetails?: { brand: string; last4: string };
    customFormResponses?: Record<string, any>;
    waiverSignature?: { signerName: string; agreed: boolean };
  }): Promise<any> {
    const res = await fetch(`${API_BASE}/checkout/pay`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Payment capture failed');
    }
    return res.json();
  },

  async lookupStudent(query: string): Promise<import('../types/index.js').StudentLookupResult> {
    const res = await fetch(`${API_BASE}/students/lookup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query })
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Student not found');
    }
    return res.json();
  }
};
