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
  Check,
  Users,
  HeartHandshake,
  Sparkles
} from 'lucide-react';
import { StudentLookupResult, StudentCharge, UniversalFeeDefinition, SchoolBranding, StudentAccount } from '../types/index.js';
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
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);
  const [isThirdPartyPayer, setIsThirdPartyPayer] = useState(false);
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
      setSelectedStudentId(result.student.studentId);
    } catch (err: any) {
      setLookupResult(null);
      setSelectedStudentId(null);
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
    { label: 'Michael Hayes (Parent Multi-Child: Alex & Maya)', val: 'michael.hayes@example.com' },
    { label: 'Priya Patel (Parent Multi-Child: Sophia & Aarav)', val: 'priya.patel@example.com' },
    { label: 'Lucas Vance (Roll: BB-STU-103)', val: 'BB-STU-103' },
    { label: 'Noah Bennett (Roll: BB-STU-109)', val: 'BB-STU-109' }
  ];

  // Active student in view (either primary student or selected sibling)
  const currentStudent: StudentAccount | undefined = lookupResult ? (
    lookupResult.student.studentId === selectedStudentId 
      ? lookupResult.student 
      : (lookupResult.siblings.find(s => s.studentId === selectedStudentId) || lookupResult.student)
  ) : undefined;

  // Charges for active student
  const activeStudentCharges: StudentCharge[] = lookupResult && currentStudent ? (
    lookupResult.charges.filter(c => c.studentId === currentStudent.studentId)
  ) : [];

  const activeStudentDue = activeStudentCharges.reduce((acc, c) => acc + (c.amount - c.amountPaid), 0);

  return (
    <div style={{ maxWidth: isEmbedded ? '100%' : '860px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* Checkout Screen Overlay if paying a fee */}
      {activePayingChargeId ? (
        <div>
          <PayerCheckout
            chargeId={activePayingChargeId}
            onBackToLedger={() => {
              setActivePayingChargeId(null);
              if (currentStudent) handleLookup(currentStudent.studentId);
            }}
            onPaymentCompleted={() => {
              if (onPaymentCompleted) onPaymentCompleted();
              if (currentStudent) handleLookup(currentStudent.studentId);
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
                      Parent & Student Payment Portal
                    </h2>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', background: 'var(--bg-surface-subtle)', padding: '0.35rem 0.75rem', borderRadius: 'var(--radius-full)', border: '1px solid var(--border-strong)', fontSize: '0.75rem' }}>
                    <ShieldCheck size={14} color="var(--success)" />
                    <span style={{ fontWeight: 600, color: 'var(--text-heading)' }}>Blackbaud SKY API Synced</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Lookup Input Card */}
          <div className="sky-card" style={{ padding: '1.5rem 2rem' }}>
            <div className="flex-between" style={{ alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <div>
                <label style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-heading)' }}>
                  Find Fees (Parent, Student or Sponsor)
                </label>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                  Enter your <strong>Parent Email / Mobile Phone</strong> (to see all children) or <strong>Student Roll Number / ID</strong> (e.g. <code>BB-STU-101</code>).
                </p>
              </div>

              {/* Sponsor Mode Toggle */}
              <button
                type="button"
                onClick={() => setIsThirdPartyPayer(!isThirdPartyPayer)}
                style={{
                  fontSize: '0.75rem',
                  padding: '0.3rem 0.65rem',
                  borderRadius: 'var(--radius-sm)',
                  border: isThirdPartyPayer ? '1px solid var(--sky-color-primary)' : '1px solid var(--border-subtle)',
                  background: isThirdPartyPayer ? 'var(--sky-color-primary-light)' : 'transparent',
                  color: isThirdPartyPayer ? 'var(--sky-color-primary)' : 'var(--text-muted)',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  cursor: 'pointer'
                }}
              >
                <HeartHandshake size={13} />
                <span>{isThirdPartyPayer ? 'Third-Party / Sponsor Mode ON' : 'Paying as Sponsor / Relative?'}</span>
              </button>
            </div>

            {isThirdPartyPayer && (
              <div style={{ padding: '0.65rem 0.85rem', background: 'var(--sky-color-primary-light)', border: '1px solid var(--sky-color-primary)', borderRadius: 'var(--radius-sm)', fontSize: '0.775rem', color: 'var(--sky-color-primary)', marginBottom: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                <Sparkles size={14} />
                <span><strong>Third-Party Sponsor Mode:</strong> You can pay directly on behalf of any student without logging into a parent account. Payment will be credited directly to their student subledger.</span>
              </div>
            )}

            <div style={{ display: 'flex', gap: '0.65rem' }}>
              <div style={{ position: 'relative', flex: 1 }}>
                <input
                  type="text"
                  placeholder="Enter Student ID / Roll No, Parent Email, or Mobile Phone..."
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
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>Try quick sample:</span>
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
          {lookupResult && currentStudent && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              
              {/* USE CASE 1: Multi-Child Family Hub Bar */}
              {lookupResult.siblings.length > 0 && (
                <div className="sky-card" style={{ padding: '1rem 1.5rem', background: 'var(--bg-surface-subtle)', border: '1px solid var(--sky-color-primary)' }}>
                  <div className="flex-between" style={{ flexWrap: 'wrap', gap: '0.75rem', marginBottom: '0.75rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <Users size={18} color="var(--sky-color-primary)" />
                      <strong style={{ fontSize: '0.9rem', color: 'var(--text-heading)' }}>
                        Family Account: {lookupResult.student.parentName}
                      </strong>
                      <span className="badge badge-info">{lookupResult.siblings.length + 1} Children Enrolled</span>
                    </div>

                    <div style={{ fontSize: '0.85rem' }}>
                      Total Family Balance: <strong style={{ color: lookupResult.totalFamilyBalance > 0 ? 'var(--warning)' : 'var(--success)', fontSize: '1rem' }}>${lookupResult.totalFamilyBalance.toFixed(2)}</strong>
                    </div>
                  </div>

                  {/* Sibling Switcher Tabs */}
                  <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                    {[lookupResult.student, ...lookupResult.siblings].map(child => {
                      const isSelected = child.studentId === selectedStudentId;
                      const childCharges = lookupResult.charges.filter(c => c.studentId === child.studentId);
                      const childDue = childCharges.reduce((acc, c) => acc + (c.amount - c.amountPaid), 0);

                      return (
                        <button
                          key={child.studentId}
                          type="button"
                          onClick={() => setSelectedStudentId(child.studentId)}
                          style={{
                            padding: '0.5rem 0.85rem',
                            borderRadius: 'var(--radius-sm)',
                            border: isSelected ? '2px solid var(--sky-color-primary)' : '1px solid var(--border-strong)',
                            background: isSelected ? '#ffffff' : 'transparent',
                            color: isSelected ? 'var(--sky-color-primary)' : 'var(--text-body)',
                            fontWeight: isSelected ? 700 : 500,
                            fontSize: '0.8rem',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            cursor: 'pointer',
                            boxShadow: isSelected ? 'var(--shadow-sm)' : 'none'
                          }}
                        >
                          <User size={13} />
                          <span>{child.studentName} ({child.grade})</span>
                          <span className={`badge ${childDue > 0 ? 'badge-warning' : 'badge-success'}`} style={{ fontSize: '0.65rem' }}>
                            ${childDue.toFixed(2)}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

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
                      {currentStudent.studentName.charAt(0)}
                    </div>

                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                        <h3 className="sky-heading-2">
                          {currentStudent.studentName}
                        </h3>
                        {currentStudent.gender && (
                          <span className="badge badge-neutral" style={{ fontSize: '0.65rem' }}>
                            {currentStudent.gender}
                          </span>
                        )}
                      </div>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', marginTop: '0.2rem', fontSize: '0.775rem', color: 'var(--text-muted)' }}>
                        <span>Roll: <strong style={{ color: 'var(--text-heading)' }}>{currentStudent.studentId}</strong></span>
                        <span>Grade: <strong style={{ color: 'var(--text-heading)' }}>{currentStudent.grade}</strong> ({currentStudent.school || 'Oakridge Prep'})</span>
                        <span>Parent: <strong style={{ color: 'var(--text-heading)' }}>{currentStudent.parentName}</strong></span>
                        <span>Email: <strong>{currentStudent.studentEmail || currentStudent.parentEmail}</strong></span>
                      </div>
                    </div>
                  </div>

                  {/* Total Due Amount */}
                  <div style={{ textAlign: 'right', background: 'var(--bg-surface-subtle)', padding: '0.65rem 1rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-strong)' }}>
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>
                      Outstanding for {currentStudent.studentName.split(' ')[0]}
                    </span>
                    <div style={{ fontSize: '1.5rem', fontWeight: 700, color: activeStudentDue > 0 ? 'var(--warning)' : 'var(--success)' }}>
                      ${activeStudentDue.toFixed(2)}
                    </div>
                  </div>
                </div>
              </div>

              {/* Fee Charges List */}
              <div className="sky-card" style={{ padding: 0, overflow: 'hidden' }}>
                <div className="sky-card-header">
                  <h4 className="sky-heading-3">
                    Assigned Fee Obligations ({activeStudentCharges.length})
                  </h4>
                </div>

                <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                  {activeStudentCharges.length === 0 ? (
                    <div style={{ padding: '2.5rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                      No active fee charges assigned to {currentStudent.studentName}. All accounts are up to date!
                    </div>
                  ) : (
                    activeStudentCharges.map(charge => {
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
