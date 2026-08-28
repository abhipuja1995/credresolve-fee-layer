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
  Sparkles,
  CheckSquare,
  Square
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
  const [selectedChargeIds, setSelectedChargeIds] = useState<string[]>([]);
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

      // Default select all unpaid or partially paid charges across family
      const unpaidChargeIds = result.charges
        .filter(c => c.paymentStatus !== 'PAID')
        .map(c => c.id);
      setSelectedChargeIds(unpaidChargeIds);
    } catch (err: any) {
      setLookupResult(null);
      setSelectedStudentId(null);
      setSelectedChargeIds([]);
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
    { label: 'Robert Sterling (3 Kids • ⚠️ 8 Overdue Fees • $1,725 Due)', val: 'robert.sterling@example.com' },
    { label: 'Michael Hayes (Alex & Maya • $565 Due)', val: 'michael.hayes@example.com' },
    { label: 'Priya Patel (Sophia & Aarav • $380 Due)', val: 'priya.patel@example.com' },
    { label: 'David Vance (Lucas & Chloe • $710 Due)', val: 'david.vance@example.com' },
    { label: 'Carlos Martinez (Olivia & Mateo • $545 Due)', val: 'carlos.m@example.com' },
    { label: 'Jessica Bennett (Noah, Liam & Emma • $690 Due)', val: 'jessica.b@example.com' },
    { label: 'Marcus Brooks (Jackson & Harper • $535 Due)', val: 'marcus.b@example.com' }
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

  const activeStudentDue = activeStudentCharges.reduce((acc, c) => acc + Math.max(0, c.amount - c.amountPaid), 0);

  // All unpaid/partially paid charges across all children in the family
  const allFamilyDueCharges = lookupResult ? lookupResult.charges.filter(c => c.paymentStatus !== 'PAID') : [];

  const selectedChargesDueAmount = (lookupResult?.charges || [])
    .filter(c => selectedChargeIds.includes(c.id))
    .reduce((acc, c) => acc + Math.max(0, c.amount - c.amountPaid), 0);

  const toggleChargeSelection = (cId: string) => {
    if (selectedChargeIds.includes(cId)) {
      setSelectedChargeIds(selectedChargeIds.filter(id => id !== cId));
    } else {
      setSelectedChargeIds([...selectedChargeIds, cId]);
    }
  };

  const toggleSelectAllFamilyDue = () => {
    if (selectedChargeIds.length === allFamilyDueCharges.length) {
      setSelectedChargeIds([]);
    } else {
      setSelectedChargeIds(allFamilyDueCharges.map(c => c.id));
    }
  };

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
                      Parent &amp; Student Payment Portal
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

          {/* Search Card */}
          {!lookupResult ? (
            <div className="sky-card" style={{ padding: '2rem' }}>
              <h3 className="sky-heading-2" style={{ marginBottom: '0.5rem' }}>
                Find Your Student Fee Account
              </h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
                Enter your student's Roll Number (e.g. <code>BB-STU-101</code>), Name, or Parent Registered Email / Phone.
              </p>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleLookup();
                }}
                style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}
              >
                <div style={{ flex: 1, minWidth: '240px', position: 'relative' }}>
                  <Search size={16} style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                  <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search by student ID, roll number, or parent contact..."
                    style={{ paddingLeft: '2.4rem' }}
                  />
                </div>
                <button
                  type="submit"
                  className="sky-btn-primary"
                  disabled={isLoading}
                  style={{ minWidth: '140px' }}
                >
                  {isLoading ? 'Searching...' : 'Find Account'}
                </button>
              </form>

              {/* Sample Quick Buttons */}
              <div style={{ marginTop: '1.25rem', paddingTop: '1.25rem', borderTop: '1px solid var(--border-subtle)' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                  Demo Family Quick Links:
                </span>
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginTop: '0.5rem' }}>
                  {sampleLookups.map((s, idx) => (
                    <button
                      key={idx}
                      type="button"
                      className="sky-btn-default"
                      onClick={() => {
                        setQuery(s.val);
                        handleLookup(s.val);
                      }}
                      style={{ fontSize: '0.75rem', padding: '0.35rem 0.65rem' }}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>

              {errorMessage && (
                <div style={{
                  marginTop: '1rem',
                  padding: '0.75rem 1rem',
                  background: 'var(--danger-bg)',
                  border: '1px solid var(--danger-border)',
                  borderRadius: 'var(--radius-sm)',
                  color: 'var(--danger-text)',
                  fontSize: '0.85rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}>
                  <AlertCircle size={16} />
                  <span>{errorMessage}</span>
                </div>
              )}
            </div>
          ) : (
            <div style={{ display: 'flex', justifyContent: 'flex-start', marginBottom: '-0.25rem' }}>
              <button
                className="sky-btn-default"
                onClick={() => {
                  setLookupResult(null);
                  setQuery('');
                  setSelectedChargeIds([]);
                }}
                style={{ fontSize: '0.8rem', padding: '0.35rem 0.75rem' }}
              >
                <ArrowLeft size={14} />
                <span>Search Another Student / Family</span>
              </button>
            </div>
          )}

          {/* Lookup Results */}
          {lookupResult && currentStudent && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              
              {/* Multi-Child Family Hub Bar with Pay Together Checkbox */}
              {lookupResult.siblings.length > 0 && (
                <div className="sky-card" style={{ padding: '1.25rem 1.5rem', background: 'var(--bg-surface-subtle)', border: '1px solid var(--sky-color-primary)' }}>
                  <div className="flex-between" style={{ flexWrap: 'wrap', gap: '0.75rem', marginBottom: '0.85rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <Users size={18} color="var(--sky-color-primary)" />
                      <strong style={{ fontSize: '0.95rem', color: 'var(--text-heading)' }}>
                        Family Account: {lookupResult.student.parentName}
                      </strong>
                      <span className="badge badge-info">{lookupResult.siblings.length + 1} Children Enrolled</span>
                    </div>

                    <div style={{ fontSize: '0.85rem' }}>
                      Total Family Balance: <strong style={{ color: lookupResult.totalFamilyBalance > 0 ? 'var(--warning)' : 'var(--success)', fontSize: '1.1rem' }}>${lookupResult.totalFamilyBalance.toFixed(2)}</strong>
                    </div>
                  </div>

                  {/* Sibling Switcher Tabs */}
                  <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
                    {[lookupResult.student, ...lookupResult.siblings].map(child => {
                      const isSelected = child.studentId === selectedStudentId;
                      const childCharges = lookupResult.charges.filter(c => c.studentId === child.studentId);
                      const childDue = childCharges.reduce((acc, c) => acc + Math.max(0, c.amount - c.amountPaid), 0);

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

                  {/* Pay Together Action Bar */}
                  {allFamilyDueCharges.length > 1 && (
                    <div style={{
                      padding: '0.75rem 1rem',
                      background: '#ffffff',
                      borderRadius: 'var(--radius-sm)',
                      border: '1px solid var(--border-strong)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      flexWrap: 'wrap',
                      gap: '0.75rem'
                    }}>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.825rem', color: 'var(--text-heading)', margin: 0 }}>
                        <input
                          type="checkbox"
                          checked={selectedChargeIds.length === allFamilyDueCharges.length && allFamilyDueCharges.length > 0}
                          onChange={toggleSelectAllFamilyDue}
                          style={{ width: 'auto' }}
                        />
                        <span>
                          <strong>Pay All Family Dues Together</strong> ({selectedChargeIds.length} of {allFamilyDueCharges.length} fees selected)
                        </span>
                      </label>

                      <button
                        className="sky-btn-primary"
                        disabled={selectedChargeIds.length === 0}
                        onClick={() => setActivePayingChargeId(selectedChargeIds.join(','))}
                        style={{
                          padding: '0.45rem 1rem',
                          fontSize: '0.825rem',
                          fontWeight: 700,
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.45rem'
                        }}
                      >
                        <CreditCard size={14} />
                        <span>Pay Together (${selectedChargesDueAmount.toFixed(2)})</span>
                      </button>
                    </div>
                  )}
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

              {/* Fee Charges List with Individual Checkboxes */}
              <div className="sky-card" style={{ padding: 0, overflow: 'hidden' }}>
                <div className="sky-card-header flex-between" style={{ alignItems: 'center' }}>
                  <h4 className="sky-heading-3">
                    Assigned Fee Obligations ({activeStudentCharges.length})
                  </h4>
                  {activeStudentCharges.some(c => c.paymentStatus !== 'PAID') && (
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      Select items to pay together or individually
                    </span>
                  )}
                </div>

                <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                  {activeStudentCharges.length === 0 ? (
                    <div style={{ padding: '2.5rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                      No active fee charges assigned to {currentStudent.studentName}. All accounts are up to date!
                    </div>
                  ) : (
                    activeStudentCharges.map(charge => {
                      const remaining = Math.max(0, Math.round((charge.amount - charge.amountPaid) * 100) / 100);
                      const isPaid = charge.paymentStatus === 'PAID';
                      const isSelected = selectedChargeIds.includes(charge.id);
                      const isOverdue = !isPaid && new Date(charge.dueDate) < new Date();

                      return (
                        <div
                          key={charge.id}
                          style={{
                            padding: '1rem 1.25rem',
                            borderRadius: 'var(--radius-sm)',
                            border: isSelected ? '2px solid var(--sky-color-primary)' : (isPaid ? '1px solid var(--success-border)' : (isOverdue ? '1.5px solid #fca5a5' : '1px solid var(--border-strong)')),
                            background: isSelected ? '#f0fdf4' : (isPaid ? 'var(--success-bg)' : (isOverdue ? '#fff5f5' : 'var(--bg-card)')),
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            flexWrap: 'wrap',
                            gap: '0.85rem'
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            {!isPaid && (
                              <input
                                type="checkbox"
                                checked={isSelected}
                                onChange={() => toggleChargeSelection(charge.id)}
                                style={{ width: 'auto', cursor: 'pointer' }}
                              />
                            )}
                            <div>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                                <h5 className="sky-heading-4">
                                  {charge.feeTitle}
                                </h5>
                                {isPaid ? (
                                  <span className="badge badge-success">Paid in Full</span>
                                ) : isOverdue ? (
                                  <span className="badge" style={{ background: '#fee2e2', color: '#991b1b', border: '1px solid #f87171', fontWeight: 800 }}>
                                    ⚠️ Overdue
                                  </span>
                                ) : charge.paymentStatus === 'PARTIALLY_PAID' ? (
                                  <span className="badge badge-warning">Partial Payment</span>
                                ) : (
                                  <span className="badge badge-neutral">Unpaid</span>
                                )}
                              </div>

                              <div style={{ display: 'flex', gap: '0.85rem', marginTop: '0.25rem', fontSize: '0.775rem', color: isOverdue ? '#dc2626' : 'var(--text-muted)' }}>
                                <span>Due Date: <strong style={{ color: isOverdue ? '#b91c1c' : 'var(--text-heading)' }}>{charge.dueDate} {isOverdue && '(Past Due)'}</strong></span>
                                <span>Total: <strong>${charge.amount.toFixed(2)}</strong></span>
                                {charge.amountPaid > 0 && (
                                  <span style={{ color: 'var(--success)' }}>Paid: <strong>${charge.amountPaid.toFixed(2)}</strong></span>
                                )}
                              </div>
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
                                <CreditCard size={14} /> Pay Balance
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
