import React, { useState } from 'react';
import { MultiSchoolParentProfile, MultiSchoolFeeItem, MultiSchoolPaymentRecord } from '../../types';
import {
  X,
  CreditCard,
  Building,
  User,
  ShieldCheck,
  CheckCircle2,
  Lock,
  Download,
  Receipt,
  Layers,
  ArrowRight,
  Sparkles,
  Smartphone,
  Check
} from 'lucide-react';

interface MultiSchoolCheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: MultiSchoolParentProfile;
  selectedFees: MultiSchoolFeeItem[];
  onPaymentSuccess: (newRecords: MultiSchoolPaymentRecord[], updatedFeeIds: string[]) => void;
}

export const MultiSchoolCheckoutModal: React.FC<MultiSchoolCheckoutModalProps> = ({
  isOpen,
  onClose,
  profile,
  selectedFees,
  onPaymentSuccess
}) => {
  const [paymentMethod, setPaymentMethod] = useState<'UPI' | 'CARD' | 'NETBANKING' | 'APPLE_PAY'>('UPI');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [generatedReceipts, setGeneratedReceipts] = useState<MultiSchoolPaymentRecord[]>([]);

  if (!isOpen) return null;

  const totalAmount = selectedFees.reduce((acc, f) => acc + (f.amount - f.amountPaid), 0);
  const distinctSchools = Array.from(new Set(selectedFees.map(f => f.schoolName)));

  const handlePayNow = () => {
    setIsProcessing(true);

    setTimeout(() => {
      const now = new Date().toISOString();
      const newReceipts: MultiSchoolPaymentRecord[] = selectedFees.map((fee, idx) => ({
        transactionId: `TXN-HUB-${Date.now().toString().slice(-6)}-${idx + 1}`,
        receiptNumber: `REC-${fee.schoolShortCode.replace(/\s+/g, '')}-${Date.now().toString().slice(-5)}`,
        paidAt: now,
        studentId: fee.studentId,
        studentName: fee.studentName,
        schoolId: fee.schoolId,
        schoolName: fee.schoolName,
        feeTitle: fee.feeTitle,
        amount: fee.amount - fee.amountPaid,
        currency: profile.currency,
        paymentMethod: paymentMethod === 'UPI' ? 'UPI Instant Pay' : (paymentMethod === 'CARD' ? 'Credit Card' : 'Apple Pay / Digital Wallet'),
        status: 'POSTED_TO_SCHOOL_ERP',
        authorizationCode: `AUTH-GL-${Math.floor(100000 + Math.random() * 899999)}`,
        subledgerJournalEntryId: `JE-${fee.schoolShortCode.replace(/\s+/g, '')}-${Math.floor(1000 + Math.random() * 8999)}`
      }));

      setGeneratedReceipts(newReceipts);
      setIsProcessing(false);
      setIsCompleted(true);
      onPaymentSuccess(newReceipts, selectedFees.map(f => f.id));
    }, 1200);
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(15, 23, 42, 0.75)',
      backdropFilter: 'blur(6px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '1.5rem'
    }}>
      <div style={{
        background: '#ffffff',
        borderRadius: '20px',
        maxWidth: '680px',
        width: '100%',
        maxHeight: '90vh',
        overflowY: 'auto',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        border: '1px solid #cbd5e1',
        display: 'flex',
        flexDirection: 'column'
      }}>
        
        {/* Header */}
        <div style={{
          background: 'linear-gradient(135deg, #002238 0%, #00385c 100%)',
          color: '#ffffff',
          padding: '1.5rem 1.75rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderTopLeftRadius: '20px',
          borderTopRightRadius: '20px'
        }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', background: 'rgba(56, 189, 248, 0.2)', color: '#7dd3fc', padding: '0.2rem 0.65rem', borderRadius: '20px', fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase', marginBottom: '0.35rem' }}>
              <ShieldCheck size={13} />
              <span>Universal Multi-School Payment Routing</span>
            </div>
            <h3 style={{ fontSize: '1.35rem', fontWeight: 800, margin: 0 }}>
              {isCompleted ? 'Consolidated Payment Complete' : '1-Click Multi-School Checkout'}
            </h3>
          </div>

          <button
            onClick={onClose}
            style={{ background: 'rgba(255, 255, 255, 0.1)', border: 'none', color: '#ffffff', width: '32px', height: '32px', borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Body */}
        <div style={{ padding: '1.75rem' }}>
          
          {!isCompleted ? (
            <div>
              {/* Order Summary Hero */}
              <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '12px', padding: '1.25rem', marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#166534', textTransform: 'uppercase' }}>
                    Total Family Dues ({selectedFees.length} Fee{selectedFees.length !== 1 ? 's' : ''})
                  </span>
                  <div style={{ fontSize: '2rem', fontWeight: 800, color: '#15803d', marginTop: '0.1rem' }}>
                    {profile.currencySymbol}{totalAmount.toLocaleString()}
                  </div>
                  <div style={{ fontSize: '0.775rem', color: '#166534', marginTop: '0.2rem' }}>
                    Spans {distinctSchools.length} participating school{distinctSchools.length !== 1 ? 's' : ''} in a single transaction
                  </div>
                </div>

                <div style={{ background: '#ffffff', padding: '0.6rem 0.9rem', borderRadius: '8px', border: '1px solid #86efac', textAlign: 'right' }}>
                  <div style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 700 }}>ACCOUNT HOLDER</div>
                  <div style={{ fontSize: '0.9rem', fontWeight: 800, color: '#0f172a' }}>{profile.parentName}</div>
                </div>
              </div>

              {/* Itemized Cross-School Breakdown */}
              <div style={{ marginBottom: '1.5rem' }}>
                <div style={{ fontSize: '0.775rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', marginBottom: '0.6rem', letterSpacing: '0.04em' }}>
                  Automated Gateway Subledger Distribution
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                  {selectedFees.map(fee => (
                    <div
                      key={fee.id}
                      style={{
                        background: '#f8fafc',
                        border: '1px solid #e2e8f0',
                        borderRadius: '10px',
                        padding: '0.75rem 1rem',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div style={{ width: '8px', height: '36px', borderRadius: '4px', background: fee.schoolBadgeColor }} />
                        <div>
                          <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#0f172a' }}>
                            {fee.studentName} — <span style={{ color: '#475569', fontWeight: 600 }}>{fee.feeTitle}</span>
                          </div>
                          <div style={{ fontSize: '0.725rem', color: '#64748b', marginTop: '0.15rem' }}>
                            {fee.schoolName} • <em>{fee.schoolErpSystem}</em>
                          </div>
                        </div>
                      </div>

                      <div style={{ textAlign: 'right' }}>
                        <strong style={{ fontSize: '0.95rem', color: '#0f172a' }}>
                          {profile.currencySymbol}{(fee.amount - fee.amountPaid).toLocaleString()}
                        </strong>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Payment Method Selector */}
              <div style={{ marginBottom: '1.75rem' }}>
                <div style={{ fontSize: '0.775rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', marginBottom: '0.6rem', letterSpacing: '0.04em' }}>
                  Select Universal Payment Mode
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem' }}>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('UPI')}
                    style={{
                      background: paymentMethod === 'UPI' ? '#eff6ff' : '#ffffff',
                      border: paymentMethod === 'UPI' ? '2px solid #0284c7' : '1px solid #cbd5e1',
                      borderRadius: '10px',
                      padding: '0.85rem',
                      cursor: 'pointer',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '0.35rem',
                      fontSize: '0.8rem',
                      fontWeight: 700,
                      color: paymentMethod === 'UPI' ? '#0369a1' : '#475569'
                    }}
                  >
                    <Smartphone size={20} color={paymentMethod === 'UPI' ? '#0284c7' : '#64748b'} />
                    <span>UPI / QR / Instant</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('CARD')}
                    style={{
                      background: paymentMethod === 'CARD' ? '#eff6ff' : '#ffffff',
                      border: paymentMethod === 'CARD' ? '2px solid #0284c7' : '1px solid #cbd5e1',
                      borderRadius: '10px',
                      padding: '0.85rem',
                      cursor: 'pointer',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '0.35rem',
                      fontSize: '0.8rem',
                      fontWeight: 700,
                      color: paymentMethod === 'CARD' ? '#0369a1' : '#475569'
                    }}
                  >
                    <CreditCard size={20} color={paymentMethod === 'CARD' ? '#0284c7' : '#64748b'} />
                    <span>Credit / Debit Card</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('APPLE_PAY')}
                    style={{
                      background: paymentMethod === 'APPLE_PAY' ? '#eff6ff' : '#ffffff',
                      border: paymentMethod === 'APPLE_PAY' ? '2px solid #0284c7' : '1px solid #cbd5e1',
                      borderRadius: '10px',
                      padding: '0.85rem',
                      cursor: 'pointer',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '0.35rem',
                      fontSize: '0.8rem',
                      fontWeight: 700,
                      color: paymentMethod === 'APPLE_PAY' ? '#0369a1' : '#475569'
                    }}
                  >
                    <Layers size={20} color={paymentMethod === 'APPLE_PAY' ? '#0284c7' : '#64748b'} />
                    <span>NetBanking / Wallet</span>
                  </button>
                </div>
              </div>

              {/* Pay Button */}
              <button
                onClick={handlePayNow}
                disabled={isProcessing || selectedFees.length === 0}
                style={{
                  width: '100%',
                  background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '12px',
                  padding: '1rem',
                  fontSize: '1rem',
                  fontWeight: 800,
                  cursor: isProcessing ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.6rem',
                  boxShadow: '0 4px 15px rgba(2, 132, 199, 0.35)',
                  opacity: isProcessing ? 0.7 : 1
                }}
              >
                {isProcessing ? (
                  <span>Capturing &amp; Routing Transactions...</span>
                ) : (
                  <>
                    <Lock size={16} />
                    <span>Pay {profile.currencySymbol}{totalAmount.toLocaleString()} Across {distinctSchools.length} Schools</span>
                  </>
                )}
              </button>
            </div>
          ) : (
            <div>
              {/* Success Screen */}
              <div style={{ textAlign: 'center', padding: '1rem 0 1.5rem 0' }}>
                <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: '#dcfce7', color: '#16a34a', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem auto' }}>
                  <CheckCircle2 size={36} />
                </div>
                <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                  Family Payment Captured!
                </h3>
                <p style={{ fontSize: '0.875rem', color: '#64748b', marginTop: '0.35rem' }}>
                  Total of <strong>{profile.currencySymbol}{totalAmount.toLocaleString()}</strong> captured and automatically posted to the respective school general ledgers.
                </p>
              </div>

              {/* Generated Subledger Receipts */}
              <div style={{ background: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '1.25rem', marginBottom: '1.5rem' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#475569', textTransform: 'uppercase', marginBottom: '0.75rem' }}>
                  Generated School ERP Subledger Receipts ({generatedReceipts.length})
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {generatedReceipts.map(rec => (
                    <div
                      key={rec.transactionId}
                      style={{
                        background: '#ffffff',
                        border: '1px solid #cbd5e1',
                        borderRadius: '8px',
                        padding: '0.75rem 1rem',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        fontSize: '0.8rem'
                      }}
                    >
                      <div>
                        <div style={{ fontWeight: 800, color: '#0f172a' }}>
                          {rec.studentName} — {rec.schoolName}
                        </div>
                        <div style={{ fontSize: '0.725rem', color: '#64748b', marginTop: '0.15rem' }}>
                          Receipt: <strong style={{ color: '#0284c7' }}>{rec.receiptNumber}</strong> • GL Ref: {rec.subledgerJournalEntryId}
                        </div>
                      </div>

                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontWeight: 800, color: '#16a34a' }}>
                          {profile.currencySymbol}{rec.amount.toLocaleString()}
                        </div>
                        <span style={{ fontSize: '0.65rem', background: '#dcfce7', color: '#15803d', padding: '0.1rem 0.4rem', borderRadius: '4px', fontWeight: 700 }}>
                          POSTED TO ERP
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <button
                  onClick={() => alert(`Consolidated Family Tax Receipt (${generatedReceipts.length} items) downloaded.`)}
                  style={{
                    flex: 1,
                    background: '#0284c7',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '10px',
                    padding: '0.75rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.45rem',
                    fontSize: '0.875rem'
                  }}
                >
                  <Download size={15} />
                  <span>Download Family Receipt</span>
                </button>

                <button
                  onClick={onClose}
                  style={{
                    background: '#f1f5f9',
                    color: '#334155',
                    border: '1px solid #cbd5e1',
                    borderRadius: '10px',
                    padding: '0.75rem 1.5rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    fontSize: '0.875rem'
                  }}
                >
                  Done
                </button>
              </div>

            </div>
          )}

        </div>

      </div>
    </div>
  );
};
