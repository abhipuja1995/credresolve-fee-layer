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
  Sparkles,
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

  const primaryColor = branding?.primaryColor || '#4f46e5';
  const schoolName = branding?.schoolName || 'Oakridge International Prep';
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
    <div style={{ maxWidth: isEmbedded ? '100%' : '860px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
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
            <div className="card-panel" style={{ padding: '2rem', background: 'var(--accent-gradient-card)' }}>
              <div className="flex-between" style={{ flexWrap: 'wrap', gap: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  {logoUrl ? (
                    <img
                      src={logoUrl}
                      alt={schoolName}
                      style={{ width: '48px', height: '48px', borderRadius: '10px', objectFit: 'cover', border: '1px solid var(--border-subtle)' }}
                    />
                  ) : (
                    <div style={{ width: '48px', height: '48px', borderRadius: '10px', background: 'var(--accent-gradient)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Sparkles size={24} color="#ffffff" />
                    </div>
                  )}

                  <div>
                    <span style={{ fontSize: '0.8rem', color: primaryColor, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.025em' }}>
                      {schoolName} • Self-Service Payments
                    </span>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-heading)', marginTop: '0.1rem' }}>
                      Parent Quick-Pay Portal
                    </h2>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', background: 'var(--bg-card)', padding: '0.45rem 0.85rem', borderRadius: 'var(--radius-full)', border: '1px solid var(--border-subtle)', fontSize: '0.8rem' }}>
                  <ShieldCheck size={16} color="var(--success)" />
                  <span style={{ fontWeight: 600, color: 'var(--text-heading)' }}>Direct Blackbaud Subledger Sync</span>
                </div>
              </div>
            </div>
          )}

          {/* Lookup Input Card */}
          <div className="card-panel" style={{ padding: '1.75rem 2rem' }}>
            <label style={{ display: 'block', fontSize: '0.95rem', fontWeight: 800, color: 'var(--text-heading)', marginBottom: '0.5rem' }}>
              Find Your Student's Fees
            </label>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
              Enter your student's <strong>Roll Number / Student ID</strong> (e.g. <code>BB-STU-101</code>) or registered <strong>Parent Mobile Phone Number</strong> to fetch outstanding dues. No password required.
            </p>

            <div style={{ display: 'flex', gap: '0.75rem' }}>
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
                    paddingLeft: '2.5rem',
                    fontSize: '1rem',
                    paddingTop: '0.75rem',
                    paddingBottom: '0.75rem'
                  }}
                />
                <Search size={18} color="var(--text-muted)" style={{ position: 'absolute', left: '0.9rem', top: '50%', transform: 'translateY(-50%)' }} />
              </div>

              <button
                className="btn-primary"
                onClick={() => handleLookup()}
                disabled={isLoading || !query.trim()}
                style={{ padding: '0.75rem 1.5rem', fontSize: '0.95rem' }}
              >
                {isLoading ? 'Searching...' : 'Find Dues'}
                <ChevronRight size={16} />
              </button>
            </div>

            {/* Quick Helper Sample Buttons */}
            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '0.5rem', marginTop: '1rem' }}>
              <span style={{ fontSize: '0.775rem', color: 'var(--text-muted)', fontWeight: 600 }}>Try sample student:</span>
              {sampleLookups.map(s => (
                <button
                  key={s.val}
                  onClick={() => {
                    setQuery(s.val);
                    handleLookup(s.val);
                  }}
                  className="btn-secondary"
                  style={{ fontSize: '0.75rem', padding: '0.25rem 0.6rem' }}
                >
                  {s.label}
                </button>
              ))}
            </div>

            {errorMessage && (
              <div style={{
                background: 'var(--danger-bg)',
                border: '1px solid var(--danger-border)',
                borderRadius: 'var(--radius-md)',
                padding: '0.85rem 1rem',
                color: 'var(--danger-text)',
                marginTop: '1.25rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                fontSize: '0.875rem'
              }}>
                <AlertCircle size={18} />
                {errorMessage}
              </div>
            )}
          </div>

          {/* Lookup Results */}
          {lookupResult && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {/* Student Profile Card */}
              <div className="card-panel" style={{ padding: '1.5rem 2rem', background: 'var(--bg-card)' }}>
                <div className="flex-between" style={{ flexWrap: 'wrap', gap: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: '50%',
                      background: 'var(--accent-light)',
                      border: '2px solid var(--accent-primary)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'var(--accent-primary)',
                      fontWeight: 800,
                      fontSize: '1.2rem'
                    }}>
                      {lookupResult.student.studentName.charAt(0)}
                    </div>

                    <div>
                      <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-heading)' }}>
                        {lookupResult.student.studentName}
                      </h3>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.85rem', marginTop: '0.25rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                        <span>Roll / ID: <strong style={{ color: 'var(--text-heading)' }}>{lookupResult.student.studentId}</strong></span>
                        <span>Grade: <strong style={{ color: 'var(--text-heading)' }}>{lookupResult.student.grade}</strong> ({lookupResult.student.homeroom})</span>
                        <span>Parent: <strong style={{ color: 'var(--text-heading)' }}>{lookupResult.student.parentName}</strong></span>
                      </div>
                    </div>
                  </div>

                  {/* Total Due Amount */}
                  <div style={{ textAlign: 'right', background: 'var(--bg-surface-elevated)', padding: '0.75rem 1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>
                      Total Outstanding Balance
                    </span>
                    <div style={{ fontSize: '1.6rem', fontWeight: 800, color: lookupResult.totalDue > 0 ? 'var(--warning)' : 'var(--success)' }}>
                      ${lookupResult.totalDue.toFixed(2)}
                    </div>
                  </div>
                </div>
              </div>

              {/* Fee Charges List */}
              <div className="card-panel" style={{ padding: '1.75rem 2rem' }}>
                <h4 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-heading)', marginBottom: '1rem' }}>
                  Fee Obligations ({lookupResult.charges.length})
                </h4>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {lookupResult.charges.length === 0 ? (
                    <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
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
                            padding: '1.25rem 1.5rem',
                            borderRadius: 'var(--radius-md)',
                            border: isPaid ? '1px solid var(--success-border)' : '1px solid var(--border-strong)',
                            background: isPaid ? 'var(--success-bg)' : 'var(--bg-card)',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            flexWrap: 'wrap',
                            gap: '1rem'
                          }}
                        >
                          <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                              <h5 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-heading)' }}>
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

                            <div style={{ display: 'flex', gap: '1rem', marginTop: '0.35rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                              <span>Due Date: <strong style={{ color: 'var(--text-heading)' }}>{charge.dueDate}</strong></span>
                              <span>Total: <strong>${charge.amount.toFixed(2)}</strong></span>
                              {charge.amountPaid > 0 && (
                                <span style={{ color: 'var(--success)' }}>Paid: <strong>${charge.amountPaid.toFixed(2)}</strong></span>
                              )}
                            </div>
                          </div>

                          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                            <div style={{ textAlign: 'right' }}>
                              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>Amount Due</span>
                              <div style={{ fontSize: '1.35rem', fontWeight: 800, color: isPaid ? 'var(--success)' : 'var(--text-heading)' }}>
                                ${remaining.toFixed(2)}
                              </div>
                            </div>

                            {!isPaid ? (
                              <button
                                className="btn-primary"
                                onClick={() => setActivePayingChargeId(charge.id)}
                                style={{ padding: '0.55rem 1.15rem', fontSize: '0.875rem' }}
                              >
                                <CreditCard size={15} /> Pay Now
                              </button>
                            ) : (
                              <button
                                className="btn-secondary"
                                onClick={() => setActivePayingChargeId(charge.id)}
                                style={{ padding: '0.55rem 1.15rem', fontSize: '0.875rem' }}
                              >
                                <FileCheck size={15} /> View Receipt
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
