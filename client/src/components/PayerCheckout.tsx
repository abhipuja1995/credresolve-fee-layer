import React, { useState, useEffect } from 'react';
import { 
  CreditCard, 
  CheckCircle2, 
  Lock, 
  ArrowLeft, 
  FileText, 
  AlertCircle,
  Check,
  Share2
} from 'lucide-react';
import { StudentCharge, UniversalFeeDefinition, SchoolBranding } from '../types/index.js';
import { api } from '../services/api.js';

interface PayerCheckoutProps {
  chargeId: string;
  onBackToLedger: () => void;
  onPaymentCompleted: () => void;
  branding?: SchoolBranding;
}

export const PayerCheckout: React.FC<PayerCheckoutProps> = ({
  chargeId,
  onBackToLedger,
  onPaymentCompleted,
  branding
}) => {
  const [data, setData] = useState<{ charge: StudentCharge; fee: UniversalFeeDefinition } | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successReceipt, setSuccessReceipt] = useState<any | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isLinkCopied, setIsLinkCopied] = useState(false);

  // Form State
  const [paymentMethod, setPaymentMethod] = useState<'APPLE_PAY' | 'GOOGLE_PAY' | 'CREDIT_CARD' | 'ACH_DIRECT_DEBIT'>('APPLE_PAY');
  const [customAmount, setCustomAmount] = useState<number>(0);
  const [formResponses, setFormResponses] = useState<Record<string, any>>({});
  const [signerName, setSignerName] = useState('');
  const [waiverAgreed, setWaiverAgreed] = useState(false);

  // Branding tokens
  const primaryColor = branding?.primaryColor || '#4f46e5';
  const secondaryColor = branding?.secondaryColor || '#7c3aed';
  const schoolName = branding?.schoolName || 'St. Jude International Academy';
  const logoUrl = branding?.logoUrl;

  useEffect(() => {
    async function loadCharge() {
      setLoading(true);
      try {
        const result = await api.getChargeById(chargeId);
        setData(result);
        const remaining = result.charge.amount - result.charge.amountPaid;
        setCustomAmount(remaining);
        
        if (result.charge.customFormResponses) {
          setFormResponses(result.charge.customFormResponses);
        }
        if (result.charge.waiverSignerName) {
          setSignerName(result.charge.waiverSignerName);
          setWaiverAgreed(true);
        }
      } catch (err: any) {
        setErrorMsg(err.message || 'Failed to load charge information.');
      } finally {
        setLoading(false);
      }
    }
    if (chargeId) {
      loadCharge();
    }
  }, [chargeId]);

  const handleCopyPaymentLink = () => {
    const url = `${window.location.origin}/?chargeId=${chargeId}`;
    navigator.clipboard.writeText(url);
    setIsLinkCopied(true);
    setTimeout(() => {
      setIsLinkCopied(false);
    }, 2000);
  };

  if (loading) {
    return (
      <div className="card-panel" style={{ padding: '3rem', textAlign: 'center' }}>
        <div style={{ color: primaryColor, fontWeight: 700 }}>Loading secure payment portal...</div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="card-panel" style={{ padding: '2rem', textAlign: 'center' }}>
        <p style={{ color: 'var(--danger-text)', fontWeight: 600 }}>Charge record not found.</p>
        <button className="btn-secondary" onClick={onBackToLedger} style={{ marginTop: '1rem' }}>
          Back to Subledger
        </button>
      </div>
    );
  }

  const { charge, fee } = data;
  const remainingBalance = charge.amount - charge.amountPaid;

  const handlePay = async () => {
    setErrorMsg(null);
    setIsProcessing(true);

    try {
      const res = await api.processCheckout({
        chargeId: charge.id,
        amount: Number(customAmount),
        paymentMethod,
        cardDetails: paymentMethod === 'CREDIT_CARD' ? { brand: 'Visa', last4: '4242' } : undefined,
        customFormResponses: formResponses,
        waiverSignature: {
          signerName,
          agreed: waiverAgreed
        }
      });

      setSuccessReceipt(res.transaction);
      onPaymentCompleted();
    } catch (err: any) {
      setErrorMsg(err.message || 'Payment processing failed');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div style={{ maxWidth: '640px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* Top Header & Copy Link Bar */}
      <div className="flex-between" style={{ alignItems: 'center' }}>
        <button 
          className="btn-secondary" 
          onClick={onBackToLedger}
          style={{ padding: '0.45rem 0.9rem', fontSize: '0.825rem' }}
        >
          <ArrowLeft size={14} /> Back to Ledger
        </button>

        {/* Copy Payment Link CTA */}
        <button
          className="btn-secondary"
          onClick={handleCopyPaymentLink}
          style={{
            padding: '0.45rem 0.9rem',
            fontSize: '0.825rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.45rem',
            borderColor: isLinkCopied ? 'var(--success)' : 'var(--border-subtle)',
            color: isLinkCopied ? 'var(--success)' : 'var(--text-heading)'
          }}
        >
          {isLinkCopied ? <Check size={14} color="var(--success)" /> : <Share2 size={14} color={primaryColor} />}
          <span style={{ fontWeight: 600 }}>{isLinkCopied ? 'Link Copied!' : 'Copy Payment Link'}</span>
        </button>
      </div>

      {/* Main Checkout Card */}
      <div className="card-panel" style={{
        padding: '2.25rem',
        border: '1px solid var(--border-subtle)',
        boxShadow: 'var(--shadow-lg)'
      }}>
        {/* Receipt View after Success */}
        {successReceipt ? (
          <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.25rem' }}>
            <div style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              background: 'var(--success-bg)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '2px solid var(--success)'
            }}>
              <Check size={32} color="var(--success)" />
            </div>

            <div>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-heading)' }}>
                Payment Successful!
              </h2>
              <p style={{ color: 'var(--text-body)', fontSize: '0.9rem', marginTop: '0.25rem' }}>
                Your payment has been captured and reconciled with {schoolName}'s Blackbaud subledger.
              </p>
            </div>

            {/* Receipt Summary Card */}
            <div style={{
              width: '100%',
              background: 'var(--bg-surface-elevated)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-subtle)',
              padding: '1.25rem',
              textAlign: 'left',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.75rem',
              fontSize: '0.875rem'
            }}>
              <div className="flex-between">
                <span style={{ color: 'var(--text-muted)' }}>Receipt Number:</span>
                <strong style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-heading)' }}>{successReceipt.receiptNumber}</strong>
              </div>

              <div className="flex-between">
                <span style={{ color: 'var(--text-muted)' }}>Student:</span>
                <strong style={{ color: 'var(--text-heading)' }}>{charge.studentName} ({charge.studentId})</strong>
              </div>

              <div className="flex-between">
                <span style={{ color: 'var(--text-muted)' }}>Fee Description:</span>
                <strong style={{ color: 'var(--text-heading)' }}>{charge.feeTitle}</strong>
              </div>

              <div className="flex-between">
                <span style={{ color: 'var(--text-muted)' }}>Payment Method:</span>
                <strong style={{ color: 'var(--text-heading)' }}>{successReceipt.paymentMethod}</strong>
              </div>

              <div className="flex-between" style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '0.75rem' }}>
                <span style={{ color: 'var(--text-muted)' }}>Amount Paid:</span>
                <span style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--success)' }}>
                  ${successReceipt.amount.toFixed(2)}
                </span>
              </div>

              <div className="flex-between">
                <span style={{ color: 'var(--text-muted)' }}>Blackbaud Subledger Sync:</span>
                <span className="badge badge-success">
                  <CheckCircle2 size={12} /> {successReceipt.bbLedgerSyncStatus}
                </span>
              </div>
            </div>

            <button className="btn-primary" onClick={onBackToLedger} style={{ width: '100%', padding: '0.75rem' }}>
              Return to Subledger
            </button>
          </div>
        ) : (
          /* Checkout Form */
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {/* Header / Branded School Summary */}
            <div style={{ borderBottom: '1px solid var(--border-subtle)', paddingBottom: '1.25rem' }}>
              <div className="flex-between" style={{ alignItems: 'flex-start' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  {logoUrl ? (
                    <img
                      src={logoUrl}
                      alt={schoolName}
                      style={{
                        width: '42px',
                        height: '42px',
                        borderRadius: '8px',
                        objectFit: 'cover',
                        border: '1px solid var(--border-subtle)'
                      }}
                    />
                  ) : (
                    <div style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '8px',
                      background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#ffffff',
                      fontWeight: 800,
                      boxShadow: 'var(--shadow-sm)'
                    }}>
                      {schoolName.charAt(0)}
                    </div>
                  )}
                  <div>
                    <span style={{ fontSize: '0.825rem', color: primaryColor, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.025em' }}>
                      {schoolName}
                    </span>
                    <h3 style={{ fontSize: '1.3rem', fontWeight: 800, marginTop: '0.1rem', color: 'var(--text-heading)' }}>
                      {charge.feeTitle}
                    </h3>
                  </div>
                </div>

                <span className="badge badge-info">
                  Blackbaud Checkout
                </span>
              </div>

              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.65rem' }}>
                Student: <strong style={{ color: 'var(--text-heading)' }}>{charge.studentName}</strong> • Due by {charge.dueDate}
              </p>
            </div>

            {errorMsg && (
              <div style={{
                background: 'var(--danger-bg)',
                border: '1px solid var(--danger-border)',
                padding: '0.75rem 1rem',
                borderRadius: 'var(--radius-md)',
                color: 'var(--danger-text)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                fontSize: '0.85rem'
              }}>
                <AlertCircle size={16} />
                {errorMsg}
              </div>
            )}

            {/* Custom Form Fields Section */}
            {fee.customFormSchema && fee.customFormSchema.length > 0 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--text-heading)', display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                  <FileText size={16} color={primaryColor} />
                  Required Information & Details
                </h4>

                {fee.customFormSchema.map(field => {
                  if (field.type === 'waiver_signature') return null;

                  return (
                    <div key={field.id}>
                      <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 700, color: 'var(--text-heading)', marginBottom: '0.35rem' }}>
                        {field.label} {field.required && <span style={{ color: 'var(--danger)' }}>*</span>}
                      </label>

                      {field.type === 'select' ? (
                        <select
                          value={formResponses[field.id] || ''}
                          onChange={e => setFormResponses({ ...formResponses, [field.id]: e.target.value })}
                        >
                          <option value="">Select option...</option>
                          {field.options?.map(opt => (
                            <option key={opt} value={opt}>{opt}</option>
                          ))}
                        </select>
                      ) : (
                        <input
                          type={field.type === 'number' ? 'number' : 'text'}
                          placeholder={field.placeholder || ''}
                          value={formResponses[field.id] || ''}
                          onChange={e => setFormResponses({ ...formResponses, [field.id]: e.target.value })}
                        />
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            {/* Legal Waiver & Electronic Signature */}
            {fee.customFormSchema?.some(f => f.type === 'waiver_signature') && (
              <div style={{
                padding: '1.25rem',
                background: 'var(--bg-surface-elevated)',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-subtle)',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.85rem'
              }}>
                <h4 style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--text-heading)' }}>
                  Electronic Consent & Liability Waiver *
                </h4>

                <div style={{
                  padding: '0.85rem 1rem',
                  background: 'var(--bg-card)',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--border-subtle)',
                  fontSize: '0.825rem',
                  color: 'var(--text-body)',
                  lineHeight: '1.5'
                }}>
                  {fee.customFormSchema.find(f => f.type === 'waiver_signature')?.waiverText}
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                  <input
                    type="checkbox"
                    id="consent_check"
                    checked={waiverAgreed}
                    onChange={e => setWaiverAgreed(e.target.checked)}
                    style={{ width: 'auto' }}
                  />
                  <label htmlFor="consent_check" style={{ fontSize: '0.825rem', fontWeight: 600, color: 'var(--text-heading)', cursor: 'pointer' }}>
                    I acknowledge and electronically sign this agreement
                  </label>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.775rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.25rem' }}>
                    Parent / Guardian Legal Name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Jessica Bennett"
                    value={signerName}
                    onChange={e => setSignerName(e.target.value)}
                  />
                </div>
              </div>
            )}

            {/* Amount Selection */}
            <div>
              <div className="flex-between" style={{ marginBottom: '0.5rem' }}>
                <label style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-heading)' }}>Payment Amount</label>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  Outstanding Balance: <strong style={{ color: 'var(--text-heading)' }}>${remainingBalance.toFixed(2)}</strong>
                </span>
              </div>

              <input
                type="number"
                step="0.01"
                max={remainingBalance}
                value={customAmount}
                onChange={e => setCustomAmount(parseFloat(e.target.value) || 0)}
                disabled={!fee.allowPartialPayment}
              />
            </div>

            {/* Payment Method Selector */}
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-heading)', marginBottom: '0.5rem' }}>
                Select Payment Method
              </label>

              <div className="grid-cols-2" style={{ gap: '0.65rem' }}>
                <button
                  onClick={() => setPaymentMethod('APPLE_PAY')}
                  style={{
                    padding: '0.75rem',
                    borderRadius: 'var(--radius-md)',
                    background: paymentMethod === 'APPLE_PAY' ? '#000000' : 'var(--bg-surface-elevated)',
                    border: paymentMethod === 'APPLE_PAY' ? '2px solid #000000' : '1px solid var(--border-subtle)',
                    color: paymentMethod === 'APPLE_PAY' ? '#ffffff' : 'var(--text-heading)',
                    fontWeight: 700,
                    fontSize: '0.9rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.4rem'
                  }}
                >
                   Apple Pay
                </button>

                <button
                  onClick={() => setPaymentMethod('GOOGLE_PAY')}
                  style={{
                    padding: '0.75rem',
                    borderRadius: 'var(--radius-md)',
                    background: paymentMethod === 'GOOGLE_PAY' ? '#000000' : 'var(--bg-surface-elevated)',
                    border: paymentMethod === 'GOOGLE_PAY' ? '2px solid #000000' : '1px solid var(--border-subtle)',
                    color: paymentMethod === 'GOOGLE_PAY' ? '#ffffff' : 'var(--text-heading)',
                    fontWeight: 700,
                    fontSize: '0.9rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.4rem'
                  }}
                >
                  Google Pay
                </button>

                <button
                  onClick={() => setPaymentMethod('CREDIT_CARD')}
                  style={{
                    padding: '0.75rem',
                    borderRadius: 'var(--radius-md)',
                    background: paymentMethod === 'CREDIT_CARD' ? 'var(--accent-light)' : 'var(--bg-surface-elevated)',
                    border: paymentMethod === 'CREDIT_CARD' ? `2px solid ${primaryColor}` : '1px solid var(--border-subtle)',
                    color: paymentMethod === 'CREDIT_CARD' ? primaryColor : 'var(--text-heading)',
                    fontWeight: 700,
                    fontSize: '0.85rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.4rem'
                  }}
                >
                  <CreditCard size={16} /> Credit / Debit
                </button>

                <button
                  onClick={() => setPaymentMethod('ACH_DIRECT_DEBIT')}
                  style={{
                    padding: '0.75rem',
                    borderRadius: 'var(--radius-md)',
                    background: paymentMethod === 'ACH_DIRECT_DEBIT' ? 'var(--accent-light)' : 'var(--bg-surface-elevated)',
                    border: paymentMethod === 'ACH_DIRECT_DEBIT' ? `2px solid ${primaryColor}` : '1px solid var(--border-subtle)',
                    color: paymentMethod === 'ACH_DIRECT_DEBIT' ? primaryColor : 'var(--text-heading)',
                    fontWeight: 700,
                    fontSize: '0.85rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.4rem'
                  }}
                >
                  ACH Direct Debit
                </button>
              </div>
            </div>

            {/* Pay Button */}
            <button
              className="btn-primary"
              onClick={handlePay}
              disabled={isProcessing || customAmount <= 0}
              style={{
                width: '100%',
                padding: '0.9rem',
                fontSize: '1rem',
                marginTop: '0.5rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem'
              }}
            >
              <Lock size={16} />
              {isProcessing ? 'Capturing & Reconciling...' : `Authorize & Pay $${Number(customAmount).toFixed(2)}`}
            </button>

            <div style={{ textAlign: 'center', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              🔒 256-Bit Encrypted • Directly reconciles to {schoolName}'s Billing Management
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
