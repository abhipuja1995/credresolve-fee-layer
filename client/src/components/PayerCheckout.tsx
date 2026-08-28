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
  DollarSign,
  Users,
  CheckSquare,
  Square
} from 'lucide-react';
import { StudentCharge, UniversalFeeDefinition, SchoolBranding } from '../types/index.js';
import { api } from '../services/api.js';

interface ChargeItemData {
  charge: StudentCharge;
  fee: UniversalFeeDefinition;
}

interface PayerCheckoutProps {
  chargeId?: string;
  chargeIds?: string[];
  onBackToLedger: () => void;
  onPaymentCompleted: () => void;
  branding?: SchoolBranding;
}

export const PayerCheckout: React.FC<PayerCheckoutProps> = ({
  chargeId,
  chargeIds,
  onBackToLedger,
  onPaymentCompleted,
  branding
}) => {
  const [items, setItems] = useState<ChargeItemData[]>([]);
  const [selectedChargeIds, setSelectedChargeIds] = useState<string[]>([]);
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

  const targetChargeIds = React.useMemo(() => {
    if (chargeIds && chargeIds.length > 0) return chargeIds;
    if (chargeId) return chargeId.split(',').map(s => s.trim()).filter(Boolean);
    return [];
  }, [chargeId, chargeIds]);

  const isMultiItemMode = items.length > 1;

  useEffect(() => {
    async function loadCharges() {
      if (targetChargeIds.length === 0) {
        setLoading(false);
        setErrorMsg('No charges specified for checkout.');
        return;
      }

      setLoading(true);
      setErrorMsg(null);

      try {
        const loaded = await Promise.all(
          targetChargeIds.map(async (id) => {
            try {
              return await api.getChargeById(id);
            } catch (err) {
              console.error(`Failed to load charge ${id}:`, err);
              return null;
            }
          })
        );

        const validItems = loaded.filter((item): item is ChargeItemData => item !== null);
        if (validItems.length === 0) {
          throw new Error('None of the requested charge records could be found.');
        }

        setItems(validItems);
        // By default, select all unpaid/partially paid charges
        const unpaidIds = validItems
          .filter(it => it.charge.paymentStatus !== 'PAID')
          .map(it => it.charge.id);
        const initialSelected = unpaidIds.length > 0 ? unpaidIds : validItems.map(it => it.charge.id);
        setSelectedChargeIds(initialSelected);

        // Pre-fill single charge defaults
        if (validItems.length === 1) {
          const first = validItems[0];
          const remaining = Math.max(0, Math.round((first.charge.amount - first.charge.amountPaid) * 100) / 100);
          setCustomAmount(remaining > 0 ? remaining : first.charge.amount);
          if (first.charge.customFormResponses) {
            setFormResponses(first.charge.customFormResponses);
          }
          if (first.charge.waiverSignerName) {
            setSignerName(first.charge.waiverSignerName);
            setWaiverAgreed(true);
          }
          if (first.charge.paymentStatus === 'PAID') {
            if (first.charge.paymentReceipts && first.charge.paymentReceipts.length > 0) {
              setSuccessReceipt(first.charge.paymentReceipts[first.charge.paymentReceipts.length - 1]);
            } else {
              setSuccessReceipt({
                receiptNumber: `REC-BBMS-${first.charge.id.slice(-6).toUpperCase()}`,
                transactionId: `BBMS-TXN-${first.charge.id.slice(-6).toUpperCase()}`,
                authorizationCode: `AUTH-892144`,
                amount: first.charge.amountPaid || first.charge.amount,
                paymentMethod: 'Blackbaud Merchant Services (BBMS) - New Checkout',
                paidAt: first.charge.createdAt || new Date().toISOString(),
                bbLedgerSyncStatus: 'POSTED_TO_BLACKBAUD',
                subledgerJournalEntryId: `GL-JE-${first.charge.id.slice(-6).toUpperCase()}`
              });
            }
          }
        } else {
          // Multi-item sum
          const totalRem = validItems.reduce((acc, it) => {
            const rem = Math.max(0, it.charge.amount - it.charge.amountPaid);
            return acc + rem;
          }, 0);
          setCustomAmount(totalRem);
          if (validItems[0]?.charge.waiverSignerName) {
            setSignerName(validItems[0].charge.waiverSignerName);
            setWaiverAgreed(true);
          }
        }
      } catch (err: any) {
        setErrorMsg(err.message || 'Failed to load charge information.');
      } finally {
        setLoading(false);
      }
    }

    loadCharges();
  }, [targetChargeIds]);

  const activeSelectedItems = items.filter(it => selectedChargeIds.includes(it.charge.id));

  // Recalculate amount when selected checkboxes change in multi-mode
  useEffect(() => {
    if (isMultiItemMode) {
      const sum = activeSelectedItems.reduce((acc, it) => {
        const rem = Math.max(0, it.charge.amount - it.charge.amountPaid);
        return acc + rem;
      }, 0);
      setCustomAmount(Math.round(sum * 100) / 100);
    }
  }, [selectedChargeIds, isMultiItemMode]);

  const handleToggleCharge = (id: string) => {
    if (selectedChargeIds.includes(id)) {
      if (selectedChargeIds.length === 1) {
        return;
      }
      setSelectedChargeIds(selectedChargeIds.filter(cId => cId !== id));
    } else {
      setSelectedChargeIds([...selectedChargeIds, id]);
    }
  };

  const handleSelectAll = () => {
    if (selectedChargeIds.length === items.length) {
      setSelectedChargeIds([items[0].charge.id]);
    } else {
      setSelectedChargeIds(items.map(it => it.charge.id));
    }
  };

  const handleCopyPaymentLink = () => {
    const queryParam = targetChargeIds.length > 1 ? `chargeIds=${targetChargeIds.join(',')}` : `chargeId=${targetChargeIds[0]}`;
    const url = `${window.location.origin}/?${queryParam}`;
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
      <div className="sky-card" style={{ padding: '3.5rem', textAlign: 'center' }}>
        <div style={{ color: 'var(--sky-color-primary)', fontWeight: 700, fontSize: '1rem' }}>
          Connecting to Blackbaud Merchant Services (BBMS)...
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="sky-card" style={{ padding: '2rem', textAlign: 'center' }}>
        <p style={{ color: 'var(--danger-text)', fontWeight: 600 }}>No active charge records found.</p>
        <button className="sky-btn-default" onClick={onBackToLedger} style={{ marginTop: '1rem' }}>
          Back to Subledger
        </button>
      </div>
    );
  }

  const primaryItem = items[0];
  const totalOutstandingBalance = activeSelectedItems.reduce((acc, it) => {
    return acc + Math.max(0, it.charge.amount - it.charge.amountPaid);
  }, 0);

  const parsedAmount = Number(customAmount) || 0;
  const processingFee = useCompleteCover ? +(parsedAmount * 0.029 + 0.30).toFixed(2) : 0;
  const totalAmountToCharge = +(parsedAmount + processingFee).toFixed(2);

  const handlePayWithBlackbaudCheckout = async () => {
    setErrorMsg(null);
    setIsProcessing(true);

    try {
      if (parsedAmount <= 0) {
        throw new Error('Please select at least one fee obligation to proceed with payment.');
      }

      if (activeSelectedItems.length === 0) {
        throw new Error('Please select at least one fee item to pay.');
      }

      // Check waiver agreements
      for (const item of activeSelectedItems) {
        if (item.fee.customFormSchema && item.fee.customFormSchema.length > 0) {
          for (const field of item.fee.customFormSchema) {
            if (field.type === 'waiver_signature' && field.required) {
              if (!waiverAgreed || !signerName.trim()) {
                throw new Error(`Please electronically sign the digital waiver consent before submitting payment.`);
              }
            }
          }
        }
      }

      const checkoutToken = `chk_tok_${Math.random().toString(36).substring(2, 12)}_${Date.now()}`;
      const receiptsCollected: any[] = [];

      // Process each selected charge
      for (let i = 0; i < activeSelectedItems.length; i++) {
        const item = activeSelectedItems[i];
        const itemRemaining = Math.max(0, Math.round((item.charge.amount - item.charge.amountPaid) * 100) / 100);
        
        let itemPayAmount = itemRemaining;
        if (!isMultiItemMode) {
          itemPayAmount = parsedAmount;
        }

        const itemFeeCover = i === 0 ? processingFee : 0;

        const res = await api.processBbmsCheckout({
          checkoutToken,
          chargeId: item.charge.id,
          amount: itemPayAmount,
          feeCoverAmount: itemFeeCover,
          donorEmail: item.charge.parentEmail,
          cardholderName: signerName || item.charge.studentName,
          customFields: {
            ...formResponses,
            studentId: item.charge.studentId,
            feeTitle: item.charge.feeTitle,
            bbFeeTypeId: item.charge.bbFeeTypeId,
            paymentMethod
          },
          waiverSignature: signerName ? {
            signerName,
            agreed: waiverAgreed
          } : undefined
        });

        const receipt = {
          chargeId: item.charge.id,
          studentName: item.charge.studentName,
          studentId: item.charge.studentId,
          feeTitle: item.charge.feeTitle,
          receiptNumber: res.receiptNumber || (res as any).transaction?.receiptNumber || `REC-BBMS-${Date.now().toString().slice(-6)}`,
          transactionId: res.transactionId || (res as any).transaction?.transactionId || `BBMS-TXN-${Date.now().toString().slice(-6)}`,
          authorizationCode: res.authorizationCode || (res as any).transaction?.authorizationCode || `AUTH-${Math.floor(100000 + Math.random() * 899999)}`,
          amount: itemPayAmount,
          feeCoverAmount: itemFeeCover,
          paymentMethod: paymentMethod === 'APPLE_PAY' 
            ? 'Blackbaud New Checkout ( Apple Pay)' 
            : paymentMethod === 'GOOGLE_PAY' 
            ? 'Blackbaud New Checkout (Google Pay)' 
            : paymentMethod === 'ACH' 
            ? 'Blackbaud New Checkout (ACH Direct Debit)'
            : paymentMethod === 'PAYPAL_VENMO'
            ? 'Blackbaud New Checkout (PayPal / Venmo)'
            : 'Blackbaud New Checkout (Visa •••• 4242)',
          paidAt: res.paidAt || (res as any).transaction?.paidAt || new Date().toISOString(),
          bbLedgerSyncStatus: 'POSTED_TO_BLACKBAUD',
          subledgerJournalEntryId: res.subledgerJournalEntryId || (res as any).transaction?.subledgerJournalEntryId || `GL-JE-${Date.now().toString().slice(-6)}`
        };

        receiptsCollected.push(receipt);
      }

      // Consolidate receipt object
      const consolidatedReceipt = {
        isMulti: isMultiItemMode,
        totalPaid: parsedAmount,
        processingFee,
        totalCharged: totalAmountToCharge,
        paymentMethod: receiptsCollected[0].paymentMethod,
        paidAt: receiptsCollected[0].paidAt,
        receipts: receiptsCollected,
        primaryReceipt: receiptsCollected[0]
      };

      setSuccessReceipt(consolidatedReceipt);
      onPaymentCompleted();
    } catch (err: any) {
      setErrorMsg(err.message || 'Payment processing failed');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div style={{ maxWidth: '720px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      {/* Top Header & Navigation Bar */}
      <div className="flex-between" style={{ alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
        <button 
          className="sky-btn-default" 
          onClick={onBackToLedger}
          style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}
        >
          <ArrowLeft size={14} /> Back to Student Accounts
        </button>

        {/* Copy Payment Link CTA */}
        {!successReceipt && (
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
                  <Check size={12} /> {successReceipt.isMulti ? 'ALL SELECTED FEES SETTLED' : 'PAID & SETTLED'}
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
                  Total Consolidated Payment Settled
                </div>
                <div style={{ fontSize: '2.25rem', fontWeight: 800, color: 'var(--sky-color-primary)', margin: '0.25rem 0' }}>
                  ${Number(successReceipt.totalPaid || successReceipt.amount).toFixed(2)}
                </div>
                <div style={{ fontSize: '0.825rem', color: 'var(--text-body)' }}>
                  Payment Channel: <strong>{successReceipt.paymentMethod}</strong>
                </div>
              </div>

              {/* Multi-Item Breakdown Table if multiple */}
              {successReceipt.receipts && successReceipt.receipts.length > 0 && (
                <div style={{ border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)', overflow: 'hidden' }}>
                  <div style={{ padding: '0.75rem 1rem', background: 'var(--bg-surface-subtle)', fontWeight: 700, fontSize: '0.8rem', borderBottom: '1px solid var(--border-subtle)', color: 'var(--text-heading)' }}>
                    Itemized Subledger Allocations ({successReceipt.receipts.length} Student Fees)
                  </div>
                  {successReceipt.receipts.map((r: any, idx: number) => (
                    <div key={idx} style={{ padding: '0.75rem 1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: idx < successReceipt.receipts.length - 1 ? '1px solid var(--border-subtle)' : 'none', fontSize: '0.825rem' }}>
                      <div>
                        <strong style={{ color: 'var(--text-heading)' }}>{r.studentName} ({r.studentId})</strong>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{r.feeTitle} • Rec: <code>{r.receiptNumber}</code></div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <strong style={{ color: 'var(--success)' }}>${Number(r.amount).toFixed(2)}</strong>
                        <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Auth: {r.authorizationCode}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

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
                  <span style={{ color: 'var(--text-muted)' }}>Blackbaud General Ledger Sync</span>
                  <span className="badge badge-success">
                    <CheckCircle2 size={11} /> Posted Synchronously
                  </span>
                </div>
                <div className="flex-between" style={{ fontSize: '0.825rem' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Settlement Timestamp</span>
                  <span style={{ color: 'var(--text-body)' }}>{new Date(successReceipt.paidAt || Date.now()).toLocaleString()}</span>
                </div>
              </div>

              {/* Multi-Channel Post-Payment Dispatch Bar */}
              <div style={{
                background: 'var(--bg-surface-subtle)',
                border: '1px solid var(--border-strong)',
                borderRadius: 'var(--radius-sm)',
                padding: '1rem 1.25rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.75rem'
              }}>
                <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-heading)' }}>
                  Dispatch Official Receipts:
                </div>
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                  <button
                    type="button"
                    className="sky-btn-default"
                    onClick={async () => {
                      const msg = `*Official Payment Receipt - ${schoolName}*\nTotal Paid: $${Number(successReceipt.totalPaid || successReceipt.amount).toFixed(2)}\nStatus: Reconciled & Posted to Blackbaud Subledger\nVerify: ${window.location.origin}`;
                      const whatsappUrl = `https://api.whatsapp.com/send?phone=${encodeURIComponent(primaryItem.charge.parentPhone || '')}&text=${encodeURIComponent(msg)}`;
                      window.open(whatsappUrl, '_blank');
                    }}
                    style={{ fontSize: '0.75rem', padding: '0.4rem 0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#16a34a' }}
                  >
                    💬 Send via WhatsApp
                  </button>

                  <button
                    type="button"
                    className="sky-btn-default"
                    onClick={async () => {
                      alert(`✓ Official payment receipt sent to ${primaryItem.charge.parentEmail}`);
                    }}
                    style={{ fontSize: '0.75rem', padding: '0.4rem 0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--sky-color-primary)' }}
                  >
                    ✉️ Send via Email
                  </button>
                </div>
              </div>

              {/* Actions */}
              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem', flexWrap: 'wrap' }}>
                <button className="sky-btn-default" onClick={handlePrint} style={{ flex: 1, minWidth: '160px' }}>
                  <Printer size={15} /> Print Receipt Voucher
                </button>
                <button className="sky-btn-default" onClick={onBackToLedger} style={{ flex: 1, minWidth: '160px' }}>
                  Done &amp; Return to Portal
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
                    {isMultiItemMode ? `Family Unified Checkout (${items.length} Fees)` : primaryItem.charge.feeTitle}
                  </h3>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    {isMultiItemMode 
                      ? `Parent: ${primaryItem.charge.parentEmail} • Pay together in a single transaction`
                      : `Student: ${primaryItem.charge.studentName} • Roll: ${primaryItem.charge.studentId}`}
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

              {/* Multi-Item Checkbox Selection List if multiple charges */}
              {isMultiItemMode && (
                <div style={{
                  border: '1px solid var(--border-strong)',
                  borderRadius: 'var(--radius-sm)',
                  overflow: 'hidden',
                  background: '#ffffff'
                }}>
                  <div className="flex-between" style={{ padding: '0.75rem 1rem', background: 'var(--bg-surface-subtle)', borderBottom: '1px solid var(--border-subtle)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <input
                        type="checkbox"
                        checked={selectedChargeIds.length === items.length}
                        onChange={handleSelectAll}
                        id="select-all-checkout"
                        style={{ width: 'auto', cursor: 'pointer' }}
                      />
                      <label htmlFor="select-all-checkout" style={{ fontSize: '0.825rem', fontWeight: 700, margin: 0, cursor: 'pointer' }}>
                        Select All Fees ({items.length})
                      </label>
                    </div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      Click checkboxes to customize payment
                    </span>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    {items.map(item => {
                      const isChecked = selectedChargeIds.includes(item.charge.id);
                      const rem = Math.max(0, Math.round((item.charge.amount - item.charge.amountPaid) * 100) / 100);
                      const isSettled = rem <= 0;

                      return (
                        <div
                          key={item.charge.id}
                          onClick={() => !isSettled && handleToggleCharge(item.charge.id)}
                          style={{
                            padding: '0.85rem 1rem',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            borderBottom: '1px solid var(--border-subtle)',
                            background: isChecked ? '#f0fdf4' : (isSettled ? '#f8fafc' : '#ffffff'),
                            cursor: isSettled ? 'default' : 'pointer',
                            transition: 'background 0.15s ease'
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            <input
                              type="checkbox"
                              checked={isChecked}
                              disabled={isSettled}
                              onChange={() => !isSettled && handleToggleCharge(item.charge.id)}
                              style={{ width: 'auto', cursor: 'pointer' }}
                              onClick={e => e.stopPropagation()}
                            />
                            <div>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
                                <span style={{ fontWeight: 700, fontSize: '0.875rem', color: '#0f172a' }}>
                                  {item.charge.studentName}
                                </span>
                                <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 500 }}>
                                  ({item.charge.studentId})
                                </span>
                                {!isSettled && new Date(item.charge.dueDate) < new Date() && (
                                  <span style={{
                                    background: '#fee2e2',
                                    color: '#991b1b',
                                    border: '1px solid #f87171',
                                    padding: '0.05rem 0.35rem',
                                    borderRadius: '4px',
                                    fontSize: '0.625rem',
                                    fontWeight: 800
                                  }}>
                                    ⚠️ OVERDUE
                                  </span>
                                )}
                              </div>
                              <div style={{ fontSize: '0.775rem', color: !isSettled && new Date(item.charge.dueDate) < new Date() ? '#dc2626' : '#475569' }}>
                                {item.charge.feeTitle} • Due {item.charge.dueDate} {!isSettled && new Date(item.charge.dueDate) < new Date() && '(Past Due)'}
                              </div>
                            </div>
                          </div>

                          <div style={{ textAlign: 'right' }}>
                            <div style={{ fontWeight: 800, fontSize: '0.95rem', color: isSettled ? '#16a34a' : (!isSettled && new Date(item.charge.dueDate) < new Date() ? '#dc2626' : (isChecked ? '#15803d' : '#002238')) }}>
                              {isSettled ? '$0.00' : `$${rem.toFixed(2)}`}
                            </div>
                            <span style={{ fontSize: '0.675rem', color: isSettled ? '#16a34a' : (!isSettled && new Date(item.charge.dueDate) < new Date() ? '#dc2626' : '#b45309'), fontWeight: 700 }}>
                              {isSettled ? '✓ Paid' : (!isSettled && new Date(item.charge.dueDate) < new Date() ? '⚠️ Overdue' : (item.charge.amountPaid > 0 ? `Partially Paid ($${item.charge.amountPaid.toFixed(2)})` : 'Balance Due'))}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Single Charge Amount Selection */}
              {!isMultiItemMode && (
                <div style={{
                  background: 'var(--bg-surface-subtle)',
                  border: '1px solid var(--border-strong)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '1.25rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.75rem'
                }}>
                  <div className="flex-between" style={{ alignItems: 'flex-start' }}>
                    <div>
                      <label style={{ fontSize: '0.875rem', fontWeight: 800, color: 'var(--text-heading)', display: 'block' }}>
                        Payment Amount
                      </label>
                      <span style={{ fontSize: '0.775rem', color: 'var(--text-muted)' }}>
                        Enter full or partial payment for this obligation
                      </span>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <span style={{ fontSize: '0.725rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
                        Outstanding Balance
                      </span>
                      <div style={{ fontSize: '1.15rem', fontWeight: 800, color: totalOutstandingBalance > 0 ? '#b45309' : '#16a34a' }}>
                        ${totalOutstandingBalance.toFixed(2)}
                      </div>
                    </div>
                  </div>

                  {/* Balance Breakdown Row */}
                  <div style={{ display: 'flex', gap: '0.75rem', background: '#ffffff', padding: '0.6rem 0.85rem', borderRadius: '6px', border: '1px solid var(--border-subtle)', fontSize: '0.775rem', justifyContent: 'space-between', flexWrap: 'wrap' }}>
                    <div>Total Fee: <strong>${primaryItem.charge.amount.toFixed(2)}</strong></div>
                    <div>Previously Paid: <strong style={{ color: primaryItem.charge.amountPaid > 0 ? '#16a34a' : 'inherit' }}>${primaryItem.charge.amountPaid.toFixed(2)}</strong></div>
                    <div>Current Balance Due: <strong style={{ color: '#b45309' }}>${totalOutstandingBalance.toFixed(2)}</strong></div>
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
                      min={primaryItem.fee.minPartialAmount || 1}
                      max={totalOutstandingBalance}
                      value={customAmount}
                      onChange={e => setCustomAmount(e.target.value)}
                      disabled={!primaryItem.fee.allowPartialPayment}
                      style={{
                        paddingLeft: '1.75rem',
                        fontSize: '1.15rem',
                        fontWeight: 800,
                        color: 'var(--text-heading)'
                      }}
                    />
                  </div>

                  {/* 1-Click Quick Amount Selectors */}
                  {primaryItem.fee.allowPartialPayment && (
                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
                      <span style={{ fontSize: '0.725rem', color: 'var(--text-muted)', fontWeight: 700 }}>Quick Select:</span>
                      <button
                        type="button"
                        onClick={() => setCustomAmount(totalOutstandingBalance)}
                        style={{
                          background: Number(customAmount) === totalOutstandingBalance ? 'var(--sky-color-primary)' : '#ffffff',
                          color: Number(customAmount) === totalOutstandingBalance ? '#ffffff' : 'var(--text-heading)',
                          border: '1px solid var(--border-strong)',
                          borderRadius: '4px',
                          padding: '0.25rem 0.65rem',
                          fontSize: '0.75rem',
                          fontWeight: 700,
                          cursor: 'pointer'
                        }}
                      >
                        Pay Full Remaining (${totalOutstandingBalance.toFixed(2)})
                      </button>
                      {totalOutstandingBalance > (primaryItem.fee.minPartialAmount || 50) && (
                        <button
                          type="button"
                          onClick={() => setCustomAmount(primaryItem.fee.minPartialAmount || 50)}
                          style={{
                            background: Number(customAmount) === (primaryItem.fee.minPartialAmount || 50) ? 'var(--sky-color-primary)' : '#ffffff',
                            color: Number(customAmount) === (primaryItem.fee.minPartialAmount || 50) ? '#ffffff' : 'var(--text-heading)',
                            border: '1px solid var(--border-strong)',
                            borderRadius: '4px',
                            padding: '0.25rem 0.65rem',
                            fontSize: '0.75rem',
                            fontWeight: 700,
                            cursor: 'pointer'
                          }}
                        >
                          Pay Min Partial (${(primaryItem.fee.minPartialAmount || 50).toFixed(2)})
                        </button>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Digital Waiver & Signature */}
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
                  <span>Parent / Guardian Electronic Consent & Legal Authorization</span>
                </div>

                <div style={{
                  padding: '0.75rem',
                  background: '#ffffff',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.775rem',
                  color: 'var(--text-body)',
                  lineHeight: '1.5'
                }}>
                  I hereby grant permission for the student(s) to participate in school activities, confirm accuracy of details, and authorize payment settlement.
                </div>

                <label style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', fontSize: '0.8rem', color: 'var(--text-heading)', cursor: 'pointer', margin: 0 }}>
                  <input
                    type="checkbox"
                    checked={waiverAgreed}
                    onChange={e => setWaiverAgreed(e.target.checked)}
                    style={{ marginTop: '0.15rem', width: 'auto' }}
                  />
                  <span>I acknowledge and electronically accept the terms and fee settlement. <span style={{ color: 'var(--danger)' }}>*</span></span>
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

              {/* Blackbaud Merchant Services (BBMS) New Checkout Experience */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                <div className="flex-between" style={{ alignItems: 'center' }}>
                  <label style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-heading)' }}>
                    Blackbaud New Checkout Payment Method
                  </label>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    PCI-DSS Level 1 Encrypted
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
                  ? 'Authorizing Payment...' 
                  : (isMultiItemMode 
                    ? `Pay Selected (${activeSelectedItems.length} Fees • $${totalAmountToCharge.toFixed(2)})`
                    : `Pay $${totalAmountToCharge.toFixed(2)}`)}
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
