import { 
  BlackbaudContext, 
  BlackbaudFeeType, 
  UniversalFeeDefinition, 
  IngestionJobRecord, 
  StudentAccount, 
  StudentCharge 
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
    const res = await fetch(`${API_BASE}/blackbaud/fee-types`);
    if (!res.ok) throw new Error('Failed to fetch fee types');
    return res.json();
  },

  async getFees(): Promise<UniversalFeeDefinition[]> {
    const res = await fetch(`${API_BASE}/fees`);
    if (!res.ok) throw new Error('Failed to fetch fees');
    return res.json();
  },

  async createFee(payload: any): Promise<{ fee: UniversalFeeDefinition; batchJobId: string; targetedStudentsCount: number }> {
    const res = await fetch(`${API_BASE}/fees`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to create fee');
    }
    return res.json();
  },

  async getBatches(): Promise<IngestionJobRecord[]> {
    const res = await fetch(`${API_BASE}/batches`);
    if (!res.ok) throw new Error('Failed to fetch batches');
    return res.json();
  },

  async getBatchDetails(jobId: string): Promise<IngestionJobRecord> {
    const res = await fetch(`${API_BASE}/batches/${jobId}`);
    if (!res.ok) throw new Error('Failed to fetch batch details');
    return res.json();
  },

  async getStudents(): Promise<StudentAccount[]> {
    const res = await fetch(`${API_BASE}/students`);
    if (!res.ok) throw new Error('Failed to fetch students');
    return res.json();
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
