import React, { useState, useEffect } from 'react';
import { 
  Search, 
  User, 
  CreditCard, 
  Phone, 
  Mail, 
  CheckCircle, 
  Clock, 
  FileCheck, 
  AlertCircle, 
  ShieldCheck, 
  ChevronRight, 
  ArrowLeft, 
  Lock, 
  Check 
} from 'lucide-react';
import { StudentLookupResult, StudentCharge, UniversalFeeDefinition, SchoolBranding } from '../types/index.js';
import { api } from '../services/api.js';
import { PayerCheckout } from './PayerCheckout.js';

interface ParentQuickPayPortalProps {
  branding?: SchoolBranding;
  onPaymentCompleted?: () => void;
  initialQuery?: string;
  isEmbedded?: boolean;
}

export const ParentQuickPayPortal: React.FC<ParentQuickPayPortalProps> = ({
  branding,
  onPaymentCompleted,
  initialQuery = '',
  isEmbedded = false
}) => {
  const [query, setQuery] = useState(initialQuery);
  const [isLoading, setIsLoading] = useState(false);
  const [lookupResult, setLookupResult] = useState<StudentLookupResult | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [activePayingChargeId, setActivePayingChargeId] = useState<string | null>(null);

  const schoolName = branding?.schoolName || 'CredResolve Partner Academy';
  const logoUrl = branding?.logoUrl;

  const handleLookup = async (searchStr?: string) => {
    const q = (searchStr !== undefined ? searchStr : query).trim();
    if (!q) {
      setErrorMessage('Please enter a Student Roll Number, ID, or Parent Mobile Phone.');
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);
    setActivePayingChargeId(null);

    try {
      const result = await api.lookupStudent(q);
      setLookupResult(result);
    } catch (err: any) {
      setLookupResult(null);
      setErrorMessage(err.message || 'No student found matching this query.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (initialQuery) {
      handleLookup(initialQuery);
    }
  }, [initialQuery]);

  const sampleLookups = [
    { label: 'Alexander Hayes (Roll: BB-STU-101)', val: 'BB-STU-101' },
    { label: 'Sophia Patel (Phone: 555-0102)', val: '555-0102' },
    { label: 'Noah Bennett (Roll: BB-STU-109)', val: 'BB-STU-109' }
  ];

  return (
    <div style={{ maxWidth: isEmbedded ? '100%' : '860px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* Checkout Screen Overlay if paying a fee */}
      {activePayingChargeId ? (
        <div>
          <PayerCheckout
            chargeId={activePayingChargeId}
            onBackToLedger={() => {
              setActivePayingChargeId(null);
              if (lookupResult) handleLookup(lookupResult.student.studentId);
            }}
            onPaymentCompleted={() => {
              if (onPaymentCompleted) onPaymentCompleted();
              if (lookupResult) handleLookup(lookupResult.student.studentId);
            }}
            branding={branding}
          />
        </div>
      ) : (
        <>
          {/* Header Banner */}
          {!isEmbedded && (
            <div className="sky-card" style={{ padding: '1.5rem 2rem' }}>
              <div className="flex-between" style={{ flexWrap: 'wrap', gap: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  {logoUrl ? (
                    <img
                      src={logoUrl}
                      alt={schoolName}
                      style={{ width: '44px', height: '44px', borderRadius: 'var(--radius-sm)', objectFit: 'cover', border: '1px solid var(--border-subtle)' }}
                    />
                  ) : (
                    <div style={{ width: '42px', height: '42px', borderRadius: 'var(--radius-sm)', background: 'var(--sky-color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ffffff', fontWeight: 800 }}>
                      CR
                    </div>
                  )}

                  <div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--sky-color-primary)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                      {schoolName} • Self-Service Payments
                    </span>
                    <h2 className="sky-heading-1" style={{ marginTop: '0.1rem' }}>
                      Parent Quick-Pay Portal
                    </h2>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', background: 'var(--bg-surface-subtle)', padding: '0.35rem 0.75rem', borderRadius: 'var(--radius-full)', border: '1px solid var(--border-strong)', fontSize: '0.75rem' }}>
                  <ShieldCheck size={14} color="var(--success)" />
                  <span style={{ fontWeight: 600, color: 'var(--text-heading)' }}>Direct SKY API Sync</span>
                </div>
              </div>
            </div>
          )}

          {/* Lookup Input Card */}
          <div className="sky-card" style={{ padding: '1.5rem 2rem' }}>
            <label style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-heading)', marginBottom: '0.35rem' }}>
              Find Your Student's Fees
            </label>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
              Enter your student's <strong>Roll Number / Student ID</strong> (e.g. <code>BB-STU-101</code>) or registered <strong>Parent Mobile Phone Number</strong> to fetch outstanding dues. No password required.
            </p>

            <div style={{ display: 'flex', gap: '0.65rem' }}>
              <div style={{ position: 'relative', flex: 1 }}>
                <input
                  type="text"
                  placeholder="Enter Student ID / Roll No (e.g. BB-STU-101) or Mobile (e.g. 555-0101)..."
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === 'Enter') handleLookup();
                  }}
                  style={{
                    paddingLeft: '2.4rem'
                  }}
                />
                <Search size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)' }} />
              </div>

              <button
                className="sky-btn-primary"
                onClick={() => handleLookup()}
                disabled={isLoading || !query.trim()}
              >
                {isLoading ? 'Searching...' : 'Find Dues'}
                <ChevronRight size={15} />
              </button>
            </div>

            {/* Quick Helper Sample Buttons */}
            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '0.45rem', marginTop: '0.85rem' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>Try sample student:</span>
              {sampleLookups.map(s => (
                <button
                  key={s.val}
                  onClick={() => {
                    setQuery(s.val);
                    handleLookup(s.val);
                  }}
                  className="sky-btn-default"
                  style={{ fontSize: '0.75rem', padding: '0.25rem 0.55rem' }}
                >
                  {s.label}
                </button>
              ))}
            </div>

            {errorMessage && (
              <div className="sky-alert sky-alert-danger" style={{ marginTop: '1rem' }}>
                <AlertCircle size={16} />
                <div>{errorMessage}</div>
              </div>
            )}
          </div>

          {/* Lookup Results */}
          {lookupResult && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {/* Student Profile Card */}
              <div className="sky-card" style={{ padding: '1.25rem 1.5rem' }}>
                <div className="flex-between" style={{ flexWrap: 'wrap', gap: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                    <div style={{
                      width: '42px',
                      height: '42px',
                      borderRadius: '50%',
                      background: 'var(--sky-color-primary-light)',
                      border: '2px solid var(--sky-color-primary)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'var(--sky-color-primary)',
                      fontWeight: 700,
                      fontSize: '1.1rem'
                    }}>
                      {lookupResult.student.studentName.charAt(0)}
                    </div>

                    <div>
                      <h3 className="sky-heading-2">
                        {lookupResult.student.studentName}
                      </h3>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', marginTop: '0.2rem', fontSize: '0.775rem', color: 'var(--text-muted)' }}>
                        <span>Roll / ID: <strong style={{ color: 'var(--text-heading)' }}>{lookupResult.student.studentId}</strong></span>
                        <span>Grade: <strong style={{ color: 'var(--text-heading)' }}>{lookupResult.student.grade}</strong> ({lookupResult.student.homeroom})</span>
                        <span>Parent: <strong style={{ color: 'var(--text-heading)' }}>{lookupResult.student.parentName}</strong></span>
                      </div>
                    </div>
                  </div>

                  {/* Total Due Amount */}
                  <div style={{ textAlign: 'right', background: 'var(--bg-surface-subtle)', padding: '0.65rem 1rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-strong)' }}>
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>
                      Total Balance
                    </span>
                    <div style={{ fontSize: '1.5rem', fontWeight: 700, color: lookupResult.totalDue > 0 ? 'var(--warning)' : 'var(--success)' }}>
                      ${lookupResult.totalDue.toFixed(2)}
                    </div>
                  </div>
                </div>
              </div>

              {/* Fee Charges List */}
              <div className="sky-card" style={{ padding: 0, overflow: 'hidden' }}>
                <div className="sky-card-header">
                  <h4 className="sky-heading-3">
                    Fee Obligations ({lookupResult.charges.length})
                  </h4>
                </div>

                <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                  {lookupResult.charges.length === 0 ? (
                    <div style={{ padding: '2.5rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                      No active fee charges assigned to this student account.
                    </div>
                  ) : (
                    lookupResult.charges.map(charge => {
                      const remaining = charge.amount - charge.amountPaid;
                      const isPaid = charge.paymentStatus === 'PAID';

                      return (
                        <div
                          key={charge.id}
                          style={{
                            padding: '1rem 1.25rem',
                            borderRadius: 'var(--radius-sm)',
                            border: isPaid ? '1px solid var(--success-border)' : '1px solid var(--border-strong)',
                            background: isPaid ? 'var(--success-bg)' : 'var(--bg-card)',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            flexWrap: 'wrap',
                            gap: '0.85rem'
                          }}
                        >
                          <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                              <h5 className="sky-heading-4">
                                {charge.feeTitle}
                              </h5>
                              {isPaid ? (
                                <span className="badge badge-success">Paid in Full</span>
                              ) : charge.paymentStatus === 'PARTIALLY_PAID' ? (
                                <span className="badge badge-warning">Partial Payment</span>
                              ) : (
                                <span className="badge badge-neutral">Unpaid</span>
                              )}
                            </div>

                            <div style={{ display: 'flex', gap: '0.85rem', marginTop: '0.25rem', fontSize: '0.775rem', color: 'var(--text-muted)' }}>
                              <span>Due Date: <strong style={{ color: 'var(--text-heading)' }}>{charge.dueDate}</strong></span>
                              <span>Total: <strong>${charge.amount.toFixed(2)}</strong></span>
                              {charge.amountPaid > 0 && (
                                <span style={{ color: 'var(--success)' }}>Paid: <strong>${charge.amountPaid.toFixed(2)}</strong></span>
                              )}
                            </div>
                          </div>

                          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <div style={{ textAlign: 'right' }}>
                              <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>Amount Due</span>
                              <div style={{ fontSize: '1.25rem', fontWeight: 700, color: isPaid ? 'var(--success)' : 'var(--text-heading)' }}>
                                ${remaining.toFixed(2)}
                              </div>
                            </div>

                            {!isPaid ? (
                              <button
                                className="sky-btn-primary"
                                onClick={() => setActivePayingChargeId(charge.id)}
                                style={{ padding: '0.45rem 0.95rem', fontSize: '0.8rem' }}
                              >
                                <CreditCard size={14} /> Pay Now
                              </button>
                            ) : (
                              <button
                                className="sky-btn-default"
                                onClick={() => setActivePayingChargeId(charge.id)}
                                style={{ padding: '0.45rem 0.95rem', fontSize: '0.8rem', color: 'var(--success)' }}
                              >
                                <FileCheck size={14} color="var(--success)" /> View Receipt
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};
