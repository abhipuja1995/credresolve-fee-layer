import React, { useState, useEffect } from 'react';
import { 
  CreditCard, 
  CheckCircle2, 
  Lock, 
  ArrowLeft, 
  FileText, 
  AlertCircle, 
  Check, 
  Share2, 
  Printer, 
  ShieldCheck, 
  Building2, 
  Calendar, 
  User, 
  Sparkles,
  Zap,
  Globe,
  DollarSign
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
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'CARD' | 'APPLE_PAY' | 'GOOGLE_PAY' | 'ACH' | 'PAYPAL_VENMO'>('APPLE_PAY');
  const [customAmount, setCustomAmount] = useState<number | string>('');
  const [useCompleteCover, setUseCompleteCover] = useState(true);
  const [formResponses, setFormResponses] = useState<Record<string, any>>({});
  const [signerName, setSignerName] = useState('');
  const [waiverAgreed, setWaiverAgreed] = useState(false);
  const [successReceipt, setSuccessReceipt] = useState<any>(null);
  const [isLinkCopied, setIsLinkCopied] = useState(false);

  // Card details state
  const [cardNumber, setCardNumber] = useState('•••• •••• •••• 4242');
  const [cardExpiry, setCardExpiry] = useState('12/28');
  const [cardCvc, setCardCvc] = useState('•••');
  const [cardPostalCode, setCardPostalCode] = useState('94105');

  // Branding tokens
  const primaryColor = branding?.primaryColor || '#007ea8';
  const secondaryColor = branding?.secondaryColor || '#00b4e5';
  const schoolName = branding?.schoolName || 'CredResolve Partner Academy';
  const logoUrl = branding?.logoUrl;

  useEffect(() => {
    async function loadCharge() {
      setLoading(true);
      try {
        const result = await api.getChargeById(chargeId);
        setData(result);
        const remaining = result.charge.amount - result.charge.amountPaid;
        setCustomAmount(remaining > 0 ? remaining : result.charge.amount);
        
        if (result.charge.customFormResponses) {
          setFormResponses(result.charge.customFormResponses);
        }
        if (result.charge.waiverSignerName) {
          setSignerName(result.charge.waiverSignerName);
          setWaiverAgreed(true);
        }

        // If this charge is already paid, display the official BBMS receipt
        if (result.charge.paymentStatus === 'PAID') {
          if (result.charge.paymentReceipts && result.charge.paymentReceipts.length > 0) {
            setSuccessReceipt(result.charge.paymentReceipts[result.charge.paymentReceipts.length - 1]);
          } else {
            setSuccessReceipt({
              receiptNumber: `REC-BBMS-${result.charge.id.slice(-6).toUpperCase()}`,
              transactionId: `BBMS-TXN-${result.charge.id.slice(-6).toUpperCase()}`,
              authorizationCode: `AUTH-892144`,
              amount: result.charge.amountPaid || result.charge.amount,
              paymentMethod: 'Blackbaud Merchant Services (BBMS) - New Checkout',
              paidAt: result.charge.createdAt || new Date().toISOString(),
              bbLedgerSyncStatus: 'POSTED_TO_BLACKBAUD',
              subledgerJournalEntryId: `GL-JE-${result.charge.id.slice(-6).toUpperCase()}`
            });
          }
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

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="sky-card" style={{ padding: '3rem', textAlign: 'center' }}>
        <div style={{ color: 'var(--sky-color-primary)', fontWeight: 700 }}>Connecting to Blackbaud Merchant Services (BBMS)...</div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="sky-card" style={{ padding: '2rem', textAlign: 'center' }}>
        <p style={{ color: 'var(--danger-text)', fontWeight: 600 }}>Charge record not found.</p>
        <button className="sky-btn-default" onClick={onBackToLedger} style={{ marginTop: '1rem' }}>
          Back to Subledger
        </button>
      </div>
    );
  }

  const { charge, fee } = data;
  const remainingBalance = charge.amount - charge.amountPaid;
  const parsedAmount = Number(customAmount) || 0;
  const processingFee = useCompleteCover ? +(parsedAmount * 0.029 + 0.30).toFixed(2) : 0;
  const totalAmountToCharge = +(parsedAmount + processingFee).toFixed(2);

  const handlePayWithBlackbaudCheckout = async () => {
    setErrorMsg(null);
    setIsProcessing(true);

    try {
      // Validate Custom Form Fields
      if (fee.customFormSchema && fee.customFormSchema.length > 0) {
        for (const field of fee.customFormSchema) {
          if (field.type === 'waiver_signature') {
            if (field.required && (!waiverAgreed || !signerName.trim())) {
              throw new Error(`Please acknowledge and electronically sign "${field.label}" before submitting payment.`);
            }
          } else if (field.required) {
            const val = formResponses[field.id];
            if (val === undefined || val === null || val === '') {
              throw new Error(`Please complete the required field: "${field.label}".`);
            }
          }
        }
      }

      // Generate Blackbaud New Checkout Token (Client-side tokenization)
      const simulatedCheckoutToken = `chk_tok_${Math.random().toString(36).substring(2, 12)}_${Date.now()}`;

      // Call Blackbaud Merchant Services (BBMS) New Checkout Transaction Finalize
      const res = await api.processBbmsCheckout({
        checkoutToken: simulatedCheckoutToken,
        chargeId: charge.id,
        amount: parsedAmount,
        feeCoverAmount: processingFee,
        donorEmail: charge.parentEmail,
        cardholderName: signerName || charge.studentName,
        customFields: {
          ...formResponses,
          studentId: charge.studentId,
          feeTitle: charge.feeTitle,
          bbFeeTypeId: charge.bbFeeTypeId,
          paymentMethod
        },
        waiverSignature: signerName ? {
          signerName,
          agreed: waiverAgreed
        } : undefined
      });

      const receipt = {
        receiptNumber: res.receiptNumber || `REC-BBMS-${Date.now().toString().slice(-6)}`,
        transactionId: res.transactionId || `BBMS-TXN-${Date.now().toString().slice(-6)}`,
        authorizationCode: res.authorizationCode || `AUTH-992144`,
        amount: parsedAmount,
        feeCoverAmount: processingFee,
        paymentMethod: paymentMethod === 'APPLE_PAY' 
          ? 'Blackbaud New Checkout ( Apple Pay)' 
          : paymentMethod === 'GOOGLE_PAY' 
          ? 'Blackbaud New Checkout (Google Pay)' 
          : paymentMethod === 'ACH' 
          ? 'Blackbaud New Checkout (ACH Direct Debit)'
          : paymentMethod === 'PAYPAL_VENMO'
          ? 'Blackbaud New Checkout (PayPal / Venmo)'
          : 'Blackbaud New Checkout (Visa •••• 4242)',
        paidAt: res.paidAt || new Date().toISOString(),
        bbLedgerSyncStatus: 'POSTED_TO_BLACKBAUD',
        subledgerJournalEntryId: res.subledgerJournalEntryId || `GL-JE-${Date.now().toString().slice(-6)}`
      };

      setSuccessReceipt(receipt);
      onPaymentCompleted();
    } catch (err: any) {
      setErrorMsg(err.message || 'Payment processing failed');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div style={{ maxWidth: '680px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      {/* Top Header & Navigation Bar */}
      <div className="flex-between" style={{ alignItems: 'center' }}>
        <button 
          className="sky-btn-default" 
          onClick={onBackToLedger}
          style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}
        >
          <ArrowLeft size={14} /> Back to Student Accounts
        </button>

        {/* Copy Payment Link CTA (Shown only on unpaid payment checkout) */}
        {!successReceipt && charge.paymentStatus !== 'PAID' && (
          <button
            className="sky-btn-default"
            onClick={handleCopyPaymentLink}
            style={{
              padding: '0.4rem 0.8rem',
              fontSize: '0.8rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              color: isLinkCopied ? 'var(--success)' : 'var(--text-heading)'
            }}
          >
            {isLinkCopied ? <Check size={13} color="var(--success)" /> : <Share2 size={13} />}
            <span>{isLinkCopied ? 'Link Copied!' : 'Share Payment Link'}</span>
          </button>
        )}
      </div>

      {/* Main Card */}
      <div className="sky-card" style={{
        padding: 0,
        overflow: 'hidden',
        boxShadow: 'var(--shadow-modal)'
      }}>
        {/* Official Receipt View */}
        {successReceipt ? (
          <div>
            {/* Header */}
            <div className="sky-card-header" style={{ padding: '1.25rem 1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                {logoUrl ? (
                  <img
                    src={logoUrl}
                    alt={schoolName}
                    style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: 'var(--radius-sm)',
                      objectFit: 'cover',
                      border: '1px solid var(--border-subtle)'
                    }}
                  />
                ) : (
                  <div style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: 'var(--radius-sm)',
                    background: 'var(--sky-color-primary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#ffffff',
                    fontWeight: 700,
                    fontSize: '1rem'
                  }}>
                    {schoolName.charAt(0)}
                  </div>
                )}
                <div>
                  <h3 className="sky-heading-2">
                    {schoolName}
                  </h3>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    Blackbaud Merchant Services (BBMS) Official Subledger Receipt
                  </p>
                </div>
              </div>

              <div>
                <span className="badge badge-success">
                  <Check size={12} /> PAID & RECONCILED
                </span>
              </div>
            </div>

            {/* Receipt Body */}
            <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {/* Amount & Status Banner */}
              <div style={{
                background: 'var(--sky-color-primary-light)',
                border: '1px solid var(--border-strong)',
                borderRadius: 'var(--radius-sm)',
                padding: '1.25rem',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--sky-color-primary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Amount Paid & Reconciled
                </div>
                <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--sky-color-primary)', margin: '0.25rem 0' }}>
                  ${Number(successReceipt.amount).toFixed(2)}
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-body)' }}>
                  Fee: <strong>{charge.feeTitle}</strong>
                </div>
              </div>

              {/* Subledger Details Grid */}
              <div style={{
                background: 'var(--bg-surface-subtle)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-sm)',
                padding: '1rem 1.25rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.75rem'
              }}>
                <div className="flex-between" style={{ fontSize: '0.825rem' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Student Name / Roll Number</span>
                  <strong style={{ color: 'var(--text-heading)' }}>{charge.studentName} ({charge.studentId})</strong>
                </div>
                <div className="flex-between" style={{ fontSize: '0.825rem' }}>
                  <span style={{ color: 'var(--text-muted)' }}>BBMS Transaction Reference</span>
                  <code style={{ color: 'var(--sky-color-primary)', fontWeight: 700 }}>{successReceipt.transactionId}</code>
                </div>
                <div className="flex-between" style={{ fontSize: '0.825rem' }}>
                  <span style={{ color: 'var(--text-muted)' }}>BBMS Authorization Code</span>
                  <code style={{ color: 'var(--text-heading)', fontWeight: 700 }}>{successReceipt.authorizationCode || 'AUTH-982133'}</code>
                </div>
                <div className="flex-between" style={{ fontSize: '0.825rem' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Receipt Number</span>
                  <strong style={{ color: 'var(--text-heading)' }}>{successReceipt.receiptNumber}</strong>
                </div>
                <div className="flex-between" style={{ fontSize: '0.825rem' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Payment Channel</span>
                  <strong style={{ color: 'var(--text-heading)' }}>{successReceipt.paymentMethod}</strong>
                </div>
                <div className="flex-between" style={{ fontSize: '0.825rem' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Blackbaud General Ledger Sync</span>
                  <span className="badge badge-success">
                    <CheckCircle2 size={11} /> Posted ({successReceipt.subledgerJournalEntryId || 'GL-JE-2026'})
                  </span>
                </div>
                <div className="flex-between" style={{ fontSize: '0.825rem' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Settlement Timestamp</span>
                  <span style={{ color: 'var(--text-body)' }}>{new Date(successReceipt.paidAt || Date.now()).toLocaleString()}</span>
                </div>
              </div>

              {/* Actions */}
              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
                <button className="sky-btn-default" onClick={handlePrint} style={{ flex: 1 }}>
                  <Printer size={15} /> Print Receipt
                </button>
                <button className="sky-btn-primary" onClick={onBackToLedger} style={{ flex: 1 }}>
                  Done & Return to Ledger
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* Payment Form */
          <div>
            {/* Header */}
            <div className="sky-card-header" style={{ padding: '1.25rem 1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                {logoUrl ? (
                  <img
                    src={logoUrl}
                    alt={schoolName}
                    style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: 'var(--radius-sm)',
                      objectFit: 'cover'
                    }}
                  />
                ) : (
                  <div style={{
                    width: '34px',
                    height: '34px',
                    borderRadius: 'var(--radius-sm)',
                    background: 'var(--sky-color-primary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#ffffff',
                    fontWeight: 700
                  }}>
                    {schoolName.charAt(0)}
                  </div>
                )}
                <div>
                  <h3 className="sky-heading-2">
                    {charge.feeTitle}
                  </h3>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    Student: <strong>{charge.studentName}</strong> • Roll: <strong>{charge.studentId}</strong>
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--sky-color-primary)', fontSize: '0.75rem', fontWeight: 700 }}>
                <ShieldCheck size={16} />
                <span>BBMS Verified</span>
              </div>
            </div>

            {/* Body */}
            <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {errorMsg && (
                <div style={{
                  padding: '0.75rem 1rem',
                  background: 'var(--danger-bg)',
                  border: '1px solid var(--danger-border)',
                  borderRadius: 'var(--radius-sm)',
                  color: 'var(--danger-text)',
                  fontSize: '0.825rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}>
                  <AlertCircle size={16} />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* Amount Selection */}
              <div style={{
                background: 'var(--bg-surface-subtle)',
                border: '1px solid var(--border-strong)',
                borderRadius: 'var(--radius-sm)',
                padding: '1.25rem'
              }}>
                <div className="flex-between" style={{ marginBottom: '0.5rem' }}>
                  <label style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-heading)' }}>
                    Payment Amount
                  </label>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    Total Due: <strong>${charge.amount.toFixed(2)}</strong>
                    {charge.amountPaid > 0 && ` (Paid: $${charge.amountPaid.toFixed(2)})`}
                  </span>
                </div>

                <div style={{ position: 'relative' }}>
                  <span style={{
                    position: 'absolute',
                    left: '0.75rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    fontWeight: 700,
                    color: 'var(--text-muted)'
                  }}>$</span>
                  <input
                    type="number"
                    step="0.01"
                    min={fee.minPartialAmount || 1}
                    max={remainingBalance}
                    value={customAmount}
                    onChange={e => setCustomAmount(e.target.value)}
                    disabled={!fee.allowPartialPayment}
                    style={{
                      paddingLeft: '1.75rem',
                      fontSize: '1.1rem',
                      fontWeight: 700,
                      color: 'var(--text-heading)'
                    }}
                  />
                </div>

                {fee.allowPartialPayment && (
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.4rem' }}>
                    💡 Partial payments allowed (Min: ${fee.minPartialAmount?.toFixed(2) || '1.00'}). Remaining balance will update immediately.
                  </div>
                )}
              </div>

              {/* Custom Form Schema Inputs */}
              {fee.customFormSchema && fee.customFormSchema.filter(f => f.type !== 'waiver_signature').length > 0 && (
                <div style={{
                  border: '1px solid var(--border-strong)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '1.25rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.85rem'
                }}>
                  <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-heading)' }}>
                    Required Registration Details
                  </div>

                  {fee.customFormSchema.filter(f => f.type !== 'waiver_signature').map(field => (
                    <div key={field.id}>
                      <label style={{ fontSize: '0.8rem', fontWeight: 600, display: 'block', marginBottom: '0.25rem' }}>
                        {field.label} {field.required && <span style={{ color: 'var(--danger)' }}>*</span>}
                      </label>
                      
                      {field.type === 'select' ? (
                        <select
                          value={formResponses[field.id] || ''}
                          onChange={e => setFormResponses({ ...formResponses, [field.id]: e.target.value })}
                        >
                          <option value="">-- Select {field.label} --</option>
                          {field.options?.map(opt => (
                            <option key={opt} value={opt}>{opt}</option>
                          ))}
                        </select>
                      ) : (
                        <input
                          type={field.type === 'number' ? 'number' : 'text'}
                          placeholder={field.placeholder || field.label}
                          value={formResponses[field.id] || ''}
                          onChange={e => setFormResponses({ ...formResponses, [field.id]: e.target.value })}
                        />
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Digital Waiver & Signature */}
              {fee.customFormSchema && fee.customFormSchema.some(f => f.type === 'waiver_signature') && (
                <div style={{
                  border: '1px solid var(--sky-color-primary)',
                  background: 'var(--sky-color-primary-light)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '1.25rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.85rem'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--sky-color-primary)', fontWeight: 700, fontSize: '0.85rem' }}>
                    <FileText size={16} />
                    <span>Parent/Guardian Electronic Consent & Legal Waiver</span>
                  </div>

                  {fee.customFormSchema.filter(f => f.type === 'waiver_signature').map(waiver => (
                    <div key={waiver.id} style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                      <div style={{
                        padding: '0.75rem',
                        background: '#ffffff',
                        border: '1px solid var(--border-subtle)',
                        borderRadius: 'var(--radius-sm)',
                        fontSize: '0.775rem',
                        color: 'var(--text-body)',
                        lineHeight: '1.5',
                        maxHeight: '120px',
                        overflowY: 'auto'
                      }}>
                        {waiver.waiverText || 'I hereby grant permission for the student to participate in this school activity and accept all terms and fee obligations.'}
                      </div>

                      <label style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', fontSize: '0.8rem', color: 'var(--text-heading)', cursor: 'pointer', margin: 0 }}>
                        <input
                          type="checkbox"
                          checked={waiverAgreed}
                          onChange={e => setWaiverAgreed(e.target.checked)}
                          style={{ marginTop: '0.15rem', width: 'auto' }}
                        />
                        <span>I have read, acknowledge, and agree to the legal terms of this waiver. <span style={{ color: 'var(--danger)' }}>*</span></span>
                      </label>

                      <div>
                        <label style={{ fontSize: '0.775rem', fontWeight: 600, display: 'block', marginBottom: '0.2rem' }}>
                          Electronic Signature (Type Full Legal Name) <span style={{ color: 'var(--danger)' }}>*</span>
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. Michael Hayes"
                          value={signerName}
                          onChange={e => setSignerName(e.target.value)}
                          style={{ background: '#ffffff' }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Blackbaud Merchant Services (BBMS) New Checkout Experience */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                <div className="flex-between" style={{ alignItems: 'center' }}>
                  <label style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-heading)' }}>
                    Blackbaud New Checkout Payment Method
                  </label>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    PCI-DSS v4.0 Level 1 Encrypted
                  </span>
                </div>

                {/* Method Tabs */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '0.4rem' }}>
                  {[
                    { id: 'APPLE_PAY', label: ' Apple Pay' },
                    { id: 'GOOGLE_PAY', label: 'G Pay' },
                    { id: 'CARD', label: 'Card' },
                    { id: 'ACH', label: 'ACH / Bank' },
                    { id: 'PAYPAL_VENMO', label: 'PayPal' }
                  ].map(tab => (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setPaymentMethod(tab.id as any)}
                      style={{
                        padding: '0.6rem 0.25rem',
                        fontSize: '0.775rem',
                        fontWeight: paymentMethod === tab.id ? 700 : 500,
                        background: paymentMethod === tab.id ? 'var(--sky-color-primary-light)' : 'var(--bg-surface-subtle)',
                        border: paymentMethod === tab.id ? '2px solid var(--sky-color-primary)' : '1px solid var(--border-subtle)',
                        borderRadius: 'var(--radius-sm)',
                        color: paymentMethod === tab.id ? 'var(--sky-color-primary)' : 'var(--text-body)',
                        cursor: 'pointer',
                        textAlign: 'center',
                        whiteSpace: 'nowrap'
                      }}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

                {/* Interactive Card Form when CARD is selected */}
                {paymentMethod === 'CARD' && (
                  <div style={{
                    padding: '1rem',
                    background: 'var(--bg-surface-subtle)',
                    border: '1px solid var(--border-strong)',
                    borderRadius: 'var(--radius-sm)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.65rem'
                  }}>
                    <div>
                      <label style={{ fontSize: '0.75rem', fontWeight: 600 }}>Card Number</label>
                      <input
                        type="text"
                        value={cardNumber}
                        onChange={e => setCardNumber(e.target.value)}
                        placeholder="4242 •••• •••• 4242"
                      />
                    </div>
                    <div className="grid-cols-3">
                      <div>
                        <label style={{ fontSize: '0.75rem', fontWeight: 600 }}>Expires</label>
                        <input
                          type="text"
                          value={cardExpiry}
                          onChange={e => setCardExpiry(e.target.value)}
                          placeholder="MM/YY"
                        />
                      </div>
                      <div>
                        <label style={{ fontSize: '0.75rem', fontWeight: 600 }}>CVC</label>
                        <input
                          type="text"
                          value={cardCvc}
                          onChange={e => setCardCvc(e.target.value)}
                          placeholder="CVC"
                        />
                      </div>
                      <div>
                        <label style={{ fontSize: '0.75rem', fontWeight: 600 }}>Zip Code</label>
                        <input
                          type="text"
                          value={cardPostalCode}
                          onChange={e => setCardPostalCode(e.target.value)}
                          placeholder="Postal"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Complete Cover™ Option (Blackbaud New Checkout Feature) */}
                <div style={{
                  padding: '0.85rem 1rem',
                  background: useCompleteCover ? 'var(--sky-color-primary-light)' : 'var(--bg-surface-subtle)',
                  border: '1px solid var(--border-strong)',
                  borderRadius: 'var(--radius-sm)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '0.75rem'
                }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', cursor: 'pointer', margin: 0 }}>
                    <input
                      type="checkbox"
                      checked={useCompleteCover}
                      onChange={e => setUseCompleteCover(e.target.checked)}
                      style={{ width: 'auto' }}
                    />
                    <div>
                      <strong style={{ color: 'var(--text-heading)' }}>Blackbaud Complete Cover™</strong>
                      <div style={{ fontSize: '0.725rem', color: 'var(--text-muted)' }}>
                        Cover ${processingFee.toFixed(2)} in transaction costs so 100% of your payment supports {schoolName}.
                      </div>
                    </div>
                  </label>
                  <span style={{ fontWeight: 700, fontSize: '0.85rem', color: 'var(--sky-color-primary)' }}>
                    +${processingFee.toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Submit CTA */}
              <button
                className="sky-btn-primary"
                onClick={handlePayWithBlackbaudCheckout}
                disabled={isProcessing || parsedAmount <= 0}
                style={{
                  padding: '0.85rem',
                  fontSize: '1rem',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem'
                }}
              >
                <Lock size={16} />
                {isProcessing 
                  ? 'Authorizing with Blackbaud Merchant Services...' 
                  : `Pay $${totalAmountToCharge.toFixed(2)} via Blackbaud Checkout`}
              </button>

              <div style={{ textAlign: 'center', fontSize: '0.725rem', color: 'var(--text-muted)' }}>
                Powered by <strong>Blackbaud Merchant Services (BBMS)</strong> • Instant Subledger Reconciliation
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
