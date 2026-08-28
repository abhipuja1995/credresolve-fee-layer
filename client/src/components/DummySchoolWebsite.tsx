import React, { useState } from 'react';
import { 
  Building2, 
  CreditCard, 
  ExternalLink, 
  ArrowRight, 
  ShieldCheck, 
  Calendar, 
  GraduationCap, 
  Users, 
  BookOpen, 
  Award, 
  CheckCircle, 
  Phone, 
  Mail, 
  MapPin, 
  Sparkles,
  ArrowLeft,
  Search,
  Globe,
  User,
  LogOut,
  ChevronRight,
  AlertCircle,
  FileCheck,
  Share2,
  Lock,
  Layers,
  HeartHandshake,
  Clock,
  Compass,
  Check,
  Receipt,
  Printer,
  Download,
  FileText
} from 'lucide-react';
import { SchoolBranding, StudentLookupResult } from '../types/index.js';
import { api } from '../services/api.js';
import { PayerCheckout } from './PayerCheckout.js';

interface DummySchoolWebsiteProps {
  branding?: SchoolBranding;
  onNavigateToQuickPay: (query?: string) => void;
  onNavigateToAdmin: () => void;
}

export const DummySchoolWebsite: React.FC<DummySchoolWebsiteProps> = ({
  branding,
  onNavigateToQuickPay,
  onNavigateToAdmin
}) => {
  const [activeModalWidget, setActiveModalWidget] = useState<string | null>(null);
  const [quickStudentLookup, setQuickStudentLookup] = useState('');
  const [selectedDivisionFilter, setSelectedDivisionFilter] = useState<'ALL' | 'LOWER' | 'MIDDLE' | 'UPPER'>('ALL');
  
  // Parent Login Portal State
  const [isParentLoginModalOpen, setIsParentLoginModalOpen] = useState(false);
  const [parentLoginQuery, setParentLoginQuery] = useState('');
  const [isParentLoading, setIsParentLoading] = useState(false);
  const [parentLoginError, setParentLoginError] = useState<string | null>(null);
  const [loggedInParentResult, setLoggedInParentResult] = useState<StudentLookupResult | null>(null);
  const [selectedParentFeeIds, setSelectedParentFeeIds] = useState<string[]>([]);
  const [activePayingChargeId, setActivePayingChargeId] = useState<string | null>(null);
  const [viewingReceiptForChild, setViewingReceiptForChild] = useState<any | null>(null);

  const schoolName = branding?.schoolName || 'Oakridge International Preparatory Academy';
  const logoUrl = branding?.logoUrl;

  const handleQuickPaySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNavigateToQuickPay(quickStudentLookup.trim() || undefined);
  };

  const handleParentLogin = async (searchQuery?: string) => {
    const q = (searchQuery !== undefined ? searchQuery : parentLoginQuery).trim();
    if (!q) {
      setParentLoginError('Please enter your registered Parent Email ID or Mobile Phone Number.');
      return;
    }

    setIsParentLoading(true);
    setParentLoginError(null);

    try {
      const result = await api.lookupStudent(q);
      setLoggedInParentResult(result);
      setIsParentLoginModalOpen(false);

      // Default select all unpaid/partially paid charges across family
      const unpaid = result.charges.filter(c => c.paymentStatus !== 'PAID').map(c => c.id);
      setSelectedParentFeeIds(unpaid);
    } catch (err: any) {
      setLoggedInParentResult(null);
      setSelectedParentFeeIds([]);
      setParentLoginError(err.message || 'No parent account found matching this email.');
    } finally {
      setIsParentLoading(false);
    }
  };

  const handleParentLogout = () => {
    setLoggedInParentResult(null);
    setParentLoginQuery('');
    setSelectedParentFeeIds([]);
    setActivePayingChargeId(null);
  };

  const toggleParentFeeSelection = (cId: string) => {
    if (selectedParentFeeIds.includes(cId)) {
      setSelectedParentFeeIds(selectedParentFeeIds.filter(id => id !== cId));
    } else {
      setSelectedParentFeeIds([...selectedParentFeeIds, cId]);
    }
  };

  const allDueParentCharges = loggedInParentResult ? loggedInParentResult.charges.filter(c => c.paymentStatus !== 'PAID') : [];
  const selectedParentFeesDueAmount = (loggedInParentResult?.charges || [])
    .filter(c => selectedParentFeeIds.includes(c.id))
    .reduce((acc, c) => acc + Math.max(0, c.amount - c.amountPaid), 0);

  const toggleSelectAllParentFees = () => {
    if (selectedParentFeeIds.length === allDueParentCharges.length && allDueParentCharges.length > 0) {
      setSelectedParentFeeIds([]);
    } else {
      setSelectedParentFeeIds(allDueParentCharges.map(c => c.id));
    }
  };

  const campusFeePrograms = [
    {
      id: 'dc-tour',
      division: 'MIDDLE',
      grade: 'Grade 8',
      studentId: 'BB-STU-101',
      title: '8th Grade Washington D.C. Educational Tour',
      tag: 'Mandatory Excursion',
      category: 'Experiential Learning',
      dueDate: 'Sept 30, 2026',
      amount: 350.00,
      description: '4-day historical and civic immersion tour including Smithsonian museum passes, charter motorcoach transit, hotel accommodations, meals, and commemorative apparel.',
      features: ['Bus & Hotel Included', 'Dietary Form Required', 'Medical Waiver Signature']
    },
    {
      id: 'stem-lab',
      division: 'LOWER',
      grade: 'Grade 5',
      studentId: 'BB-STU-111',
      title: 'Junior Robotics & STEM Lab Hardware Kit',
      tag: 'Academic Lab Consumable',
      category: 'STEM & Robotics',
      dueDate: 'Oct 15, 2026',
      amount: 125.00,
      description: 'Arduino micro-controller development boards, sensor arrays, project consumables, and annual software licensing for Term 1 engineering curriculum.',
      features: ['Personal Microcontroller Kit', 'Software License', 'Take-Home Project']
    },
    {
      id: 'arts-studio',
      division: 'LOWER',
      grade: 'Grade 3',
      studentId: 'BB-STU-112',
      title: 'Lower School Visual Arts & Ceramic Studio Supplies',
      tag: 'Fine Arts Consumable',
      category: 'Creative Arts',
      dueDate: 'Oct 20, 2026',
      amount: 75.00,
      description: 'Sculpting clay, non-toxic acrylics, specialty watercolor papers, studio brushes, and kiln firing fees for the autumn visual arts showcase.',
      features: ['Studio Glazes & Clay', 'Kiln Firing Access', 'Showcase Exhibition']
    },
    {
      id: 'varsity-athletics',
      division: 'UPPER',
      grade: 'Grade 10',
      studentId: 'BB-STU-109',
      title: 'Upper School Varsity Athletic Pass & Equipment Fee',
      tag: 'Athletics & Training',
      category: 'Athletics Department',
      dueDate: 'Oct 25, 2026',
      amount: 150.00,
      description: 'Uniform jersey provisioning, inter-scholastic referee dues, state tournament travel logistics, and dedicated athletic training room conditioning access.',
      features: ['Game Uniforms', 'Championship Bus Transit', 'Trainer Access']
    }
  ];

  const filteredPrograms = campusFeePrograms.filter(p => {
    if (selectedDivisionFilter === 'ALL') return true;
    return p.division === selectedDivisionFilter;
  });

  return (
    <div style={{ background: '#f8fafc', color: '#0f172a', minHeight: '100vh', display: 'flex', flexDirection: 'column', fontFamily: "'Open Sans', -apple-system, BlinkMacSystemFont, sans-serif" }}>
      


      {/* 2. ACADEMIC UTILITY & ANNOUNCEMENT TICKER */}
      <div style={{
        background: '#002845',
        color: '#e2e8f0',
        padding: '0.4rem 1.5rem',
        fontSize: '0.75rem',
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)'
      }}>
        <div style={{ maxWidth: '1320px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ color: '#38bdf8', fontWeight: 700 }}>TERM NOTICE:</span>
            <span>Fall 2026 Excursion Registrations &amp; Digital Legal Waivers are now open online.</span>
          </div>
          <div style={{ display: 'flex', gap: '1.25rem', color: '#94a3b8' }}>
            <span>Campus: <strong>Boston Metro &amp; Virtual</strong></span>
            <span>CEEB Code: <strong>094122</strong></span>
            <span>Blackbaud ID: <strong>BB-ENV-OAKRIDGE</strong></span>
          </div>
        </div>
      </div>

      {/* 3. PRIMARY SCHOOL HEADER */}
      <header style={{
        background: '#ffffff',
        boxShadow: '0 4px 12px -2px rgba(0, 34, 56, 0.06)',
        position: 'sticky',
        top: 0,
        zIndex: 40,
        borderBottom: '1px solid #e2e8f0'
      }}>
        <div style={{
          maxWidth: '1320px',
          margin: '0 auto',
          padding: '0.9rem 1.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1.25rem'
        }}>
          {/* Logo & Emblem */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            {logoUrl ? (
              <img
                src={logoUrl}
                alt={schoolName}
                style={{ width: '52px', height: '52px', borderRadius: '8px', objectFit: 'cover', border: '1px solid #e2e8f0' }}
              />
            ) : (
              <div style={{
                width: '50px',
                height: '50px',
                borderRadius: '8px',
                background: 'linear-gradient(135deg, #002238 0%, #007ea8 100%)',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 800,
                fontSize: '1.35rem',
                boxShadow: '0 2px 8px rgba(0, 34, 56, 0.2)'
              }}>
                OP
              </div>
            )}

            <div>
              <div style={{ fontSize: '0.7rem', color: '#0284c7', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                Independent Co-Educational Academy • Grades K–12
              </div>
              <h1 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#002238', margin: 0, letterSpacing: '-0.02em' }}>
                {schoolName}
              </h1>
            </div>
          </div>

          {/* Navigation Links & Action Suite */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', flexWrap: 'wrap' }}>
            <nav style={{ display: 'flex', gap: '1.25rem', fontSize: '0.875rem', fontWeight: 600, color: '#334155' }}>
              <span style={{ cursor: 'pointer', color: '#002238' }}>Academics</span>
              <span style={{ cursor: 'pointer' }}>Admissions</span>
              <span style={{ cursor: 'pointer' }}>Arts &amp; Athletics</span>
              <span style={{ cursor: 'pointer' }}>Student Life</span>
            </nav>

            <div style={{ height: '24px', width: '1px', background: '#cbd5e1' }} />

            {/* Parent Login Button / Active Profile Pill */}
            {loggedInParentResult ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.45rem',
                  background: '#f0f9ff',
                  padding: '0.45rem 0.85rem',
                  borderRadius: '6px',
                  border: '1px solid #bae6fd',
                  fontSize: '0.8rem'
                }}>
                  <User size={14} color="#0284c7" />
                  <span style={{ fontWeight: 700, color: '#0369a1' }}>
                    {loggedInParentResult.student.parentName} ({loggedInParentResult.siblings.length + 1} Kids)
                  </span>
                </div>
                <button
                  onClick={handleParentLogout}
                  title="Sign out of parent session"
                  style={{
                    background: '#ffffff',
                    border: '1px solid #cbd5e1',
                    borderRadius: '6px',
                    padding: '0.45rem 0.65rem',
                    color: '#64748b',
                    cursor: 'pointer',
                    fontSize: '0.75rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.25rem'
                  }}
                >
                  <LogOut size={13} />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <button
                onClick={() => setIsParentLoginModalOpen(true)}
                style={{
                  background: '#ffffff',
                  color: '#002238',
                  border: '1px solid #cbd5e1',
                  borderRadius: '6px',
                  padding: '0.55rem 0.95rem',
                  fontSize: '0.825rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.45rem',
                  transition: 'all 0.15s ease'
                }}
              >
                <User size={15} color="var(--sky-color-primary)" />
                <span>Parent Portal Login</span>
              </button>
            )}

            {!loggedInParentResult && (
              <button
                onClick={() => onNavigateToQuickPay()}
                style={{
                  background: 'var(--sky-color-primary)',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '6px',
                  padding: '0.6rem 1.15rem',
                  fontSize: '0.875rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.45rem',
                  boxShadow: '0 2px 6px rgba(0, 126, 168, 0.25)'
                }}
              >
                <CreditCard size={15} />
                <span>Pay Fees &amp; Activities</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* 4. AUTHENTICATED PARENT FAMILY DASHBOARD (Shown when Parent is Logged In) */}
      {loggedInParentResult && (
        <section style={{
          background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)',
          borderBottom: '1px solid #bae6fd',
          padding: '2.5rem 1.5rem'
        }}>
          <div style={{ maxWidth: '1320px', margin: '0 auto' }}>
            <div className="flex-between" style={{ flexWrap: 'wrap', gap: '1.25rem', marginBottom: '1.5rem' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', color: '#0369a1', fontSize: '0.775rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  <ShieldCheck size={16} />
                  <span>Authenticated Parent Portal</span>
                </div>
                <h2 style={{ fontSize: '1.85rem', fontWeight: 800, color: '#0c4a6e', marginTop: '0.25rem' }}>
                  Account Name : {loggedInParentResult.student.parentName}
                </h2>
              </div>

              <div style={{ textAlign: 'right', background: '#ffffff', padding: '1rem 1.5rem', borderRadius: '10px', border: '1px solid #bae6fd', boxShadow: '0 4px 12px rgba(3, 105, 161, 0.08)' }}>
                <span style={{ fontSize: '0.725rem', color: '#64748b', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Total Family Balance
                </span>
                <div style={{ fontSize: '2rem', fontWeight: 800, color: loggedInParentResult.totalFamilyBalance > 0 ? '#b45309' : '#16a34a', marginTop: '0.1rem' }}>
                  ${loggedInParentResult.totalFamilyBalance.toFixed(2)}
                </div>
              </div>
            </div>

            {/* Pay Together Consolidated Bar */}
            {allDueParentCharges.length > 1 && (
              <div style={{
                background: '#ffffff',
                borderRadius: '10px',
                border: '2px solid #0284c7',
                padding: '1rem 1.5rem',
                marginBottom: '1.5rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '1rem',
                boxShadow: '0 4px 14px rgba(2, 132, 199, 0.12)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                  <input
                    type="checkbox"
                    checked={selectedParentFeeIds.length === allDueParentCharges.length && allDueParentCharges.length > 0}
                    onChange={toggleSelectAllParentFees}
                    id="parent-select-all"
                    style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                  />
                  <div>
                    <label htmlFor="parent-select-all" style={{ fontSize: '0.95rem', fontWeight: 800, color: '#0f172a', margin: 0, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                      Pay Together ({selectedParentFeeIds.length} of {allDueParentCharges.length} fees selected)
                    </label>
                    <div style={{ fontSize: '0.775rem', color: '#64748b', marginTop: '0.1rem' }}>
                      Select fees across your children to pay together in a single consolidated transaction.
                    </div>
                  </div>
                </div>

                <button
                  disabled={selectedParentFeeIds.length === 0}
                  onClick={() => setActivePayingChargeId(selectedParentFeeIds.join(','))}
                  style={{
                    background: selectedParentFeeIds.length > 0 ? 'var(--sky-color-primary)' : '#94a3b8',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '0.65rem 1.35rem',
                    fontSize: '0.9rem',
                    fontWeight: 800,
                    cursor: selectedParentFeeIds.length > 0 ? 'pointer' : 'not-allowed',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    boxShadow: selectedParentFeeIds.length > 0 ? '0 4px 10px rgba(0, 126, 168, 0.3)' : 'none'
                  }}
                >
                  <CreditCard size={16} />
                  <span>Pay Selected (${selectedParentFeesDueAmount.toFixed(2)})</span>
                </button>
              </div>
            )}

            {/* Sibling Student Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '1.5rem' }}>
              {[loggedInParentResult.student, ...loggedInParentResult.siblings].map(child => {
                const childCharges = loggedInParentResult.charges.filter(c => c.studentId === child.studentId);
                const childDue = childCharges.reduce((acc, c) => acc + Math.max(0, c.amount - c.amountPaid), 0);

                return (
                  <div key={child.studentId} style={{ background: '#ffffff', borderRadius: '12px', border: '1px solid #cbd5e1', padding: '1.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', boxShadow: '0 4px 12px -2px rgba(0, 0, 0, 0.05)' }}>
                    <div>
                      <div className="flex-between" style={{ alignItems: 'flex-start' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                          <div style={{ width: '44px', height: '44px', borderRadius: '50%', background: '#e0f2fe', border: '2px solid #0284c7', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0284c7', fontWeight: 800, fontSize: '1.1rem' }}>
                            {child.studentName.charAt(0)}
                          </div>
                          <div>
                            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#002238', margin: 0 }}>
                              {child.studentName}
                            </h3>
                            <div style={{ fontSize: '0.775rem', color: '#64748b', marginTop: '0.15rem' }}>
                              Roll: <strong style={{ color: '#0f172a' }}>{child.studentId}</strong> • {child.grade} ({child.school || 'Oakridge Prep'})
                            </div>
                          </div>
                        </div>

                        <span className={`badge ${childDue > 0 ? 'badge-warning' : 'badge-success'}`} style={{ fontSize: '0.75rem', padding: '0.35rem 0.65rem' }}>
                          {childDue > 0 ? `$${childDue.toFixed(2)} Due` : 'Account Settled'}
                        </span>
                      </div>

                      {/* Itemized Fee Breakdown with Checkboxes */}
                      <div style={{ marginTop: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                        <div className="flex-between" style={{ alignItems: 'center' }}>
                          <span style={{ fontSize: '0.725rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                            Fee Obligations ({childCharges.length})
                          </span>
                          <span style={{ fontSize: '0.7rem', color: '#64748b' }}>
                            Select checkbox to pay together
                          </span>
                        </div>

                        {childCharges.map(charge => {
                          const remaining = Math.max(0, Math.round((charge.amount - charge.amountPaid) * 100) / 100);
                          const isPaid = charge.paymentStatus === 'PAID';
                          const isChecked = selectedParentFeeIds.includes(charge.id);
                          const isOverdue = !isPaid && new Date(charge.dueDate) < new Date();

                          return (
                            <div
                              key={charge.id}
                              style={{
                                padding: '0.75rem 1rem',
                                background: isChecked ? '#f0f9ff' : (isOverdue ? '#fff5f5' : '#ffffff'),
                                borderRadius: '8px',
                                border: isChecked ? '1.5px solid #0284c7' : (isOverdue ? '1.5px solid #fca5a5' : '1px solid #e2e8f0'),
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                fontSize: '0.825rem',
                                transition: 'all 0.15s ease'
                              }}
                            >
                              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                                {!isPaid ? (
                                  <input
                                    type="checkbox"
                                    checked={isChecked}
                                    onChange={() => toggleParentFeeSelection(charge.id)}
                                    style={{ width: '16px', height: '16px', cursor: 'pointer' }}
                                  />
                                ) : (
                                  <CheckCircle size={16} color="#16a34a" />
                                )}
                                <div>
                                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
                                    <strong style={{ color: '#0f172a' }}>{charge.feeTitle}</strong>
                                    {isOverdue && (
                                      <span style={{
                                        background: '#fee2e2',
                                        color: '#991b1b',
                                        border: '1px solid #f87171',
                                        padding: '0.1rem 0.4rem',
                                        borderRadius: '4px',
                                        fontSize: '0.65rem',
                                        fontWeight: 800,
                                        letterSpacing: '0.03em'
                                      }}>
                                        ⚠️ OVERDUE
                                      </span>
                                    )}
                                  </div>
                                  <div style={{ fontSize: '0.725rem', color: isOverdue ? '#dc2626' : '#64748b', marginTop: '0.1rem', fontWeight: isOverdue ? 600 : 400 }}>
                                    Due Date: {charge.dueDate} {isOverdue && '(Past Due)'}
                                  </div>
                                </div>
                              </div>

                              <div style={{ textAlign: 'right' }}>
                                <div style={{ fontWeight: 800, color: isPaid ? '#16a34a' : (isOverdue ? '#dc2626' : (charge.paymentStatus === 'PARTIALLY_PAID' ? '#b45309' : '#002238')) }}>
                                  {isPaid 
                                    ? `$${charge.amount.toFixed(2)}` 
                                    : (charge.paymentStatus === 'PARTIALLY_PAID' 
                                      ? `$${remaining.toFixed(2)} due` 
                                      : `$${charge.amount.toFixed(2)}`)}
                                </div>
                                <span style={{ fontSize: '0.65rem', color: isPaid ? '#16a34a' : (isOverdue ? '#dc2626' : (charge.paymentStatus === 'PARTIALLY_PAID' ? '#b45309' : '#64748b')), fontWeight: 700 }}>
                                  {isPaid 
                                    ? '✓ Fully Paid' 
                                    : (isOverdue
                                      ? '⚠️ Overdue'
                                      : (charge.paymentStatus === 'PARTIALLY_PAID' 
                                        ? `Partially Paid ($${charge.amountPaid.toFixed(2)} paid)` 
                                        : 'Pending Payment'))}
                                </span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    <div style={{ marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid #f1f5f9', display: 'flex', justifyContent: 'flex-end', gap: '0.65rem' }}>
                      {childDue > 0 ? (
                        <button
                          onClick={() => {
                            const childUnpaidIds = childCharges.filter(c => c.paymentStatus !== 'PAID').map(c => c.id);
                            setActivePayingChargeId(childUnpaidIds.join(','));
                          }}
                          style={{
                            background: 'var(--sky-color-primary)',
                            color: '#ffffff',
                            border: 'none',
                            borderRadius: '6px',
                            padding: '0.6rem 1.15rem',
                            fontSize: '0.825rem',
                            fontWeight: 700,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.45rem'
                          }}
                        >
                          <CreditCard size={14} />
                          <span>Pay {child.studentName.split(' ')[0]}'s Balance (${childDue.toFixed(2)})</span>
                          <ChevronRight size={14} />
                        </button>
                      ) : (
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', flexWrap: 'wrap', gap: '0.5rem' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', fontSize: '0.775rem', color: '#16a34a', fontWeight: 700 }}>
                            <CheckCircle size={15} />
                            <span>Account Settled • Ref: CONF-REC-{child.studentId.replace('BB-STU-', '')}</span>
                          </div>
                          <button
                            onClick={() => setViewingReceiptForChild(child)}
                            style={{
                              background: '#ffffff',
                              border: '1px solid #cbd5e1',
                              borderRadius: '6px',
                              padding: '0.45rem 0.85rem',
                              fontSize: '0.775rem',
                              fontWeight: 700,
                              color: '#0f172a',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '0.35rem'
                            }}
                          >
                            <Receipt size={14} color="#0284c7" />
                            <span>Download Receipt</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Embedded Payer Checkout Modal if activePayingChargeId is set */}
      {activePayingChargeId && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0, 0, 0, 0.65)',
          backdropFilter: 'blur(4px)',
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1.5rem',
          overflowY: 'auto'
        }}>
          <div style={{ width: '100%', maxWidth: '720px', maxHeight: '92vh', overflowY: 'auto', borderRadius: '12px', background: 'transparent' }}>
            <PayerCheckout
              chargeId={activePayingChargeId}
              onBackToLedger={() => {
                setActivePayingChargeId(null);
                if (loggedInParentResult) {
                  handleParentLogin(loggedInParentResult.student.studentId);
                }
              }}
              onPaymentCompleted={() => {
                if (loggedInParentResult) {
                  handleParentLogin(loggedInParentResult.student.studentId);
                }
              }}
              branding={branding}
            />
          </div>
        </div>
      )}

      {/* PUBLIC ACADEMY HOMEPAGE SECTIONS - Hidden when Parent is Logged In */}
      {!loggedInParentResult && (
        <>
          {/* 5. HERO SECTION: ACADEMIC EXCELLENCE & FRICTIONLESS COMMERCE */}
          <section style={{
            background: 'linear-gradient(135deg, #001f33 0%, #00385c 50%, #006699 100%)',
            color: '#ffffff',
            padding: '4.5rem 1.5rem',
            position: 'relative',
            overflow: 'hidden'
          }}>
            <div style={{
              maxWidth: '1320px',
              margin: '0 auto',
              display: 'grid',
              gridTemplateColumns: '1.2fr 0.8fr',
              gap: '3rem',
              alignItems: 'center'
            }}>
              {/* Left Narrative */}
              <div>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(255, 255, 255, 0.12)', border: '1px solid rgba(255, 255, 255, 0.2)', padding: '0.35rem 0.85rem', borderRadius: '30px', fontSize: '0.775rem', fontWeight: 700, letterSpacing: '0.04em', color: '#7dd3fc', marginBottom: '1.25rem' }}>
                  <Sparkles size={14} />
                  <span>ACADEMIC YEAR 2026–2027 ENROLLMENT &amp; ACTIVITIES</span>
                </div>

                <h2 style={{ fontSize: '2.75rem', fontWeight: 800, lineHeight: 1.15, margin: '0 0 1.25rem 0', letterSpacing: '-0.02em', color: '#ffffff' }}>
                  Where Curiosity Meets Character.
                </h2>

                <p style={{ fontSize: '1.05rem', color: '#cbd5e1', lineHeight: 1.65, maxWidth: '600px', margin: '0 0 2rem 0' }}>
                  Welcome to the official digital portal of {schoolName}. We cultivate critical inquiry, athletic dedication, and creative artistry while providing parents with a modern, transparent fee and excursion management experience.
                </p>

                {/* Campus Impact Metrics */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1.25rem', marginTop: '2rem', paddingTop: '1.75rem', borderTop: '1px solid rgba(255, 255, 255, 0.15)', maxWidth: '400px' }}>
                  <div>
                    <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#38bdf8' }}>100%</div>
                    <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '0.1rem' }}>University Placement</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#38bdf8' }}>14+</div>
                    <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '0.1rem' }}>AP &amp; IB STEM Courses</div>
                  </div>
                </div>
              </div>

              {/* Right Action Station: Instant Fee Lookup & Guest Pay */}
              <div style={{
                background: '#ffffff',
                borderRadius: '16px',
                padding: '2.25rem',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.35)',
                color: '#0f172a'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--sky-color-primary)', fontWeight: 800, fontSize: '0.825rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  <Sparkles size={16} />
                  <span>Self-Service Payment Station</span>
                </div>

                <h3 style={{ fontSize: '1.45rem', fontWeight: 800, margin: '0.4rem 0 0.5rem 0', color: '#002238' }}>
                  Pay School Fees in 1-Click
                </h3>
                <p style={{ fontSize: '0.85rem', color: '#64748b', lineHeight: 1.5, marginBottom: '1.5rem' }}>
                  Lookup student obligations, sign excursion waivers, and settle dues without logging in.
                </p>

                <form onSubmit={handleQuickPaySubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div>
                    <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '0.35rem' }}>
                      Student Roll Number, Parent Email, or Mobile
                    </label>
                    <div style={{ position: 'relative' }}>
                      <input
                        type="text"
                        placeholder="e.g. BB-STU-101 or 555-0101"
                        value={quickStudentLookup}
                        onChange={e => setQuickStudentLookup(e.target.value)}
                        style={{
                          width: '100%',
                          padding: '0.75rem 0.85rem 0.75rem 2.4rem',
                          border: '1px solid #cbd5e1',
                          borderRadius: '8px',
                          fontSize: '0.9rem',
                          background: '#ffffff'
                        }}
                      />
                      <Search size={16} color="#94a3b8" style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)' }} />
                    </div>
                  </div>

                  <button
                    type="submit"
                    style={{
                      background: 'var(--sky-color-primary)',
                      color: '#ffffff',
                      border: 'none',
                      borderRadius: '8px',
                      padding: '0.85rem',
                      fontWeight: 800,
                      fontSize: '0.95rem',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.5rem',
                      boxShadow: '0 2px 8px rgba(0, 126, 168, 0.3)'
                    }}
                  >
                    <span>Find &amp; Pay Dues</span>
                    <ArrowRight size={16} />
                  </button>

                  {/* Quick Persona Suggestions */}
                  <div style={{ paddingTop: '0.75rem', borderTop: '1px solid #f1f5f9' }}>
                    <span style={{ fontSize: '0.7rem', color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase' }}>
                      Sample Student IDs:
                    </span>
                    <div style={{ display: 'flex', gap: '0.45rem', marginTop: '0.35rem', flexWrap: 'wrap' }}>
                      {['BB-STU-101', 'BB-STU-111', 'BB-STU-112', '555-0101'].map(val => (
                        <button
                          key={val}
                          type="button"
                          onClick={() => {
                            setQuickStudentLookup(val);
                            onNavigateToQuickPay(val);
                          }}
                          style={{
                            background: '#f1f5f9',
                            border: '1px solid #e2e8f0',
                            borderRadius: '4px',
                            padding: '0.2rem 0.5rem',
                            fontSize: '0.725rem',
                            color: '#475569',
                            cursor: 'pointer'
                          }}
                        >
                          {val}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div style={{ fontSize: '0.725rem', color: '#64748b', textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.35rem', marginTop: '0.25rem' }}>
                    <ShieldCheck size={14} color="#16a34a" />
                    <span>PCI-DSS v4.0 Level 1 Encrypted Payment Flow</span>
                  </div>
                </form>
              </div>
            </div>
          </section>

          {/* 6. BENTO GRID: PARENT SERVICES & COMMERCE ADVANTAGES */}
          <section style={{ maxWidth: '1320px', margin: '0 auto', padding: '4.5rem 1.5rem', width: '100%' }}>
            <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--sky-color-primary)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                Unified Campus Payment Experience
              </div>
              <h2 style={{ fontSize: '2.25rem', fontWeight: 800, color: '#002238', margin: '0.35rem 0' }}>
                Designed for Modern Families &amp; EdTech Leaders
              </h2>
              <p style={{ color: '#64748b', fontSize: '0.95rem', maxWidth: '640px', margin: '0 auto' }}>
                Delivering a unified portal for tuition, activities, athletic gear, and field trips.
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
              {/* Bento Card 1 */}
              <div style={{ background: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '1.75rem', display: 'flex', flexDirection: 'column', gap: '1rem', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.04)' }}>
                <div style={{ width: '42px', height: '42px', borderRadius: '8px', background: '#e0f2fe', color: '#0284c7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Users size={22} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#002238', margin: '0 0 0.4rem 0' }}>
                    Multi-Child Family Hub
                  </h3>
                  <p style={{ fontSize: '0.85rem', color: '#64748b', lineHeight: 1.5, margin: 0 }}>
                    Manage all your children across Lower, Middle, and Upper School from a single parent view with combined family balance checkout.
                  </p>
                </div>
              </div>

              {/* Bento Card 2 */}
              <div style={{ background: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '1.75rem', display: 'flex', flexDirection: 'column', gap: '1rem', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.04)' }}>
                <div style={{ width: '42px', height: '42px', borderRadius: '8px', background: '#dcfce7', color: '#16a34a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <FileCheck size={22} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#002238', margin: '0 0 0.4rem 0' }}>
                    Digital Legal Waivers
                  </h3>
                  <p style={{ fontSize: '0.85rem', color: '#64748b', lineHeight: 1.5, margin: 0 }}>
                    Sign excursion liability consents, enter emergency phone numbers, and specify dietary requirements in one flow prior to payment.
                  </p>
                </div>
              </div>

              {/* Bento Card 3 */}
              <div style={{ background: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '1.75rem', display: 'flex', flexDirection: 'column', gap: '1rem', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.04)' }}>
                <div style={{ width: '42px', height: '42px', borderRadius: '8px', background: '#fef3c7', color: '#d97706', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <HeartHandshake size={22} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#002238', margin: '0 0 0.4rem 0' }}>
                    Third-Party Sponsor Mode
                  </h3>
                  <p style={{ fontSize: '0.85rem', color: '#64748b', lineHeight: 1.5, margin: 0 }}>
                    Allow grandparents, booster clubs, or scholarship sponsors to pay directly towards a student’s account without requiring parent logins.
                  </p>
                </div>
              </div>

              {/* Bento Card 4 */}
              <div style={{ background: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '1.75rem', display: 'flex', flexDirection: 'column', gap: '1rem', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.04)' }}>
                <div style={{ width: '42px', height: '42px', borderRadius: '8px', background: '#f3e8ff', color: '#9333ea', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Share2 size={22} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#002238', margin: '0 0 0.4rem 0' }}>
                    WhatsApp &amp; Email Receipts
                  </h3>
                  <p style={{ fontSize: '0.85rem', color: '#64748b', lineHeight: 1.5, margin: 0 }}>
                    Automatic multi-channel notification dispatch with formatted WhatsApp receipts and official PDF confirmation vouchers.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* 7. CURRENT CAMPUS INITIATIVES & EXCURSION BILLING SCHEDULE */}
          <section style={{ background: '#ffffff', borderTop: '1px solid #e2e8f0', borderBottom: '1px solid #e2e8f0', padding: '4.5rem 1.5rem' }}>
            <div style={{ maxWidth: '1320px', margin: '0 auto' }}>
              <div className="flex-between" style={{ alignItems: 'flex-end', flexWrap: 'wrap', gap: '1.5rem', marginBottom: '2.5rem' }}>
                <div>
                  <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--sky-color-primary)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                    Active Registration Schedules
                  </div>
                  <h2 style={{ fontSize: '2rem', fontWeight: 800, color: '#002238', margin: '0.25rem 0 0 0' }}>
                    Upcoming Campus Excursions &amp; Lab Fees
                  </h2>
                </div>

                {/* Division Filter Pills */}
                <div style={{ display: 'flex', gap: '0.4rem', background: '#f1f5f9', padding: '0.35rem', borderRadius: '8px' }}>
                  {[
                    { id: 'ALL', label: 'All Divisions' },
                    { id: 'LOWER', label: 'Lower School (K-5)' },
                    { id: 'MIDDLE', label: 'Middle School (6-8)' },
                    { id: 'UPPER', label: 'Upper School (9-12)' }
                  ].map(tab => (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setSelectedDivisionFilter(tab.id as any)}
                      style={{
                        background: selectedDivisionFilter === tab.id ? '#ffffff' : 'transparent',
                        color: selectedDivisionFilter === tab.id ? '#002238' : '#64748b',
                        border: 'none',
                        borderRadius: '6px',
                        padding: '0.4rem 0.85rem',
                        fontSize: '0.8rem',
                        fontWeight: selectedDivisionFilter === tab.id ? 700 : 500,
                        cursor: 'pointer',
                        boxShadow: selectedDivisionFilter === tab.id ? '0 1px 3px rgba(0,0,0,0.1)' : 'none'
                      }}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
                {filteredPrograms.map(program => (
                  <div
                    key={program.id}
                    style={{
                      background: '#ffffff',
                      borderRadius: '12px',
                      border: '1px solid #e2e8f0',
                      padding: '1.75rem',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                      transition: 'transform 0.15s ease, box-shadow 0.15s ease'
                    }}
                  >
                    <div>
                      <div className="flex-between" style={{ marginBottom: '0.65rem' }}>
                        <span className="badge badge-info" style={{ fontSize: '0.7rem' }}>{program.category}</span>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#0284c7', fontSize: '0.75rem', fontWeight: 700 }}>
                          <Calendar size={13} />
                          <span>Due {program.dueDate}</span>
                        </div>
                      </div>

                      <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#002238', margin: '0 0 0.5rem 0' }}>
                        {program.title}
                      </h3>

                      <p style={{ fontSize: '0.85rem', color: '#64748b', lineHeight: 1.5, marginBottom: '1.25rem' }}>
                        {program.description}
                      </p>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', marginBottom: '1.25rem' }}>
                        {program.features.map((feat, i) => (
                          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', fontSize: '0.775rem', color: '#334155' }}>
                            <Check size={13} color="#16a34a" />
                            <span>{feat}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex-between" style={{ alignItems: 'center', paddingTop: '1.25rem', borderTop: '1px solid #f1f5f9' }}>
                      <div>
                        <span style={{ fontSize: '0.7rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 800 }}>Standard Amount</span>
                        <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#002238' }}>${program.amount.toFixed(2)}</div>
                      </div>

                      <button
                        onClick={() => onNavigateToQuickPay(program.studentId)}
                        style={{
                          background: 'var(--sky-color-primary)',
                          color: '#ffffff',
                          border: 'none',
                          borderRadius: '6px',
                          padding: '0.55rem 1.15rem',
                          fontSize: '0.85rem',
                          fontWeight: 700,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.35rem'
                        }}
                      >
                        <span>Register &amp; Pay</span>
                        <ArrowRight size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </>
      )}

      {/* 8. EMBEDDED WIDGET SIMULATION MODAL */}
      {activeModalWidget && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 34, 56, 0.8)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 100,
          padding: '1.5rem'
        }}>
          <div style={{
            background: '#ffffff',
            borderRadius: '12px',
            width: '100%',
            maxWidth: '860px',
            maxHeight: '92vh',
            overflowY: 'auto',
            padding: '1.75rem',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.35)'
          }}>
            <div className="flex-between" style={{ marginBottom: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <Globe size={20} color="var(--sky-color-primary)" />
                <div>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#002238', margin: 0 }}>
                    Embedded CredResolve Fee Widget Simulation
                  </h3>
                  <p style={{ fontSize: '0.775rem', color: '#64748b', margin: '0.15rem 0 0 0' }}>
                    Previewing direct drop-in integration inside a School Management System, LMS, or custom website.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setActiveModalWidget(null)}
                style={{ background: 'none', border: 'none', fontSize: '1.35rem', cursor: 'pointer', color: '#64748b' }}
              >
                ✕
              </button>
            </div>

            <div style={{ border: '1px solid #cbd5e1', borderRadius: '8px', padding: '1rem', background: '#f8fafc' }}>
              <iframe
                src={`${window.location.origin}/?view=quickpay`}
                style={{ width: '100%', height: '540px', border: 'none', borderRadius: '6px' }}
                title="School Payment Widget"
              />
            </div>
          </div>
        </div>
      )}

      {/* 9. PARENT LOGIN MODAL */}
      {isParentLoginModalOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 34, 56, 0.8)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 100,
          padding: '1.5rem'
        }}>
          <div style={{
            background: '#ffffff',
            borderRadius: '16px',
            width: '100%',
            maxWidth: '520px',
            padding: '2.25rem',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.35)'
          }}>
            <div className="flex-between" style={{ marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                <div style={{ width: '38px', height: '38px', borderRadius: '8px', background: '#e0f2fe', color: '#0284c7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <User size={20} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#002238', margin: 0 }}>
                    Parent Portal Sign In
                  </h3>
                  <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
                    Access student subledgers &amp; combined family billing
                  </span>
                </div>
              </div>
              <button
                onClick={() => setIsParentLoginModalOpen(false)}
                style={{ background: 'none', border: 'none', fontSize: '1.35rem', cursor: 'pointer', color: '#64748b' }}
              >
                ✕
              </button>
            </div>

            <p style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '1.5rem', lineHeight: 1.5 }}>
              Enter your registered parent email address or mobile phone to fetch and view fees for all your enrolled children.
            </p>

            <form onSubmit={(e) => { e.preventDefault(); handleParentLogin(); }} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '0.35rem' }}>
                  Parent Email ID or Phone Number
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    type="text"
                    placeholder="e.g. michael.hayes@example.com or 555-0101"
                    value={parentLoginQuery}
                    onChange={e => setParentLoginQuery(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.75rem 0.85rem 0.75rem 2.4rem',
                      border: '1px solid #cbd5e1',
                      borderRadius: '8px',
                      fontSize: '0.9rem'
                    }}
                  />
                  <Mail size={16} color="#94a3b8" style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)' }} />
                </div>
              </div>

              {parentLoginError && (
                <div className="sky-alert sky-alert-danger" style={{ fontSize: '0.8rem', padding: '0.65rem 0.85rem' }}>
                  <AlertCircle size={15} />
                  <div>{parentLoginError}</div>
                </div>
              )}

              <button
                type="submit"
                disabled={isParentLoading || !parentLoginQuery.trim()}
                style={{
                  background: 'var(--sky-color-primary)',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '0.85rem',
                  fontWeight: 800,
                  fontSize: '0.95rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem'
                }}
              >
                <span>{isParentLoading ? 'Authenticating...' : 'Sign In & Fetch Children'}</span>
                <ArrowRight size={16} />
              </button>

              {/* Demo 1-Click Parent Profiles */}
              <div style={{ marginTop: '0.75rem', paddingTop: '1.25rem', borderTop: '1px solid #f1f5f9' }}>
                <span style={{ fontSize: '0.725rem', color: '#94a3b8', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Quick Demo Parent Profiles (Multi-Child &amp; Multiple Fees):
                </span>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem', marginTop: '0.5rem', maxHeight: '240px', overflowY: 'auto' }}>
                  {[
                    { name: 'Robert Sterling', email: 'robert.sterling@example.com', kids: 'William (Gr 10), Charlotte (Gr 7) & Benjamin (Gr 4)', due: '$1,725.00', isOverdue: true, feeCount: '8 Overdue Fees' },
                    { name: 'Michael Hayes', email: 'michael.hayes@example.com', kids: 'Alexander (Gr 8) & Maya (Gr 5)', due: '$565.00', isOverdue: false, feeCount: '4 Fees' },
                    { name: 'Priya Patel', email: 'priya.patel@example.com', kids: 'Sophia (Gr 8) & Aarav (Gr 3)', due: '$380.00', isOverdue: false, feeCount: '4 Fees' },
                    { name: 'David Vance', email: 'david.vance@example.com', kids: 'Lucas (Gr 8) & Chloe (Gr 6)', due: '$710.00', isOverdue: false, feeCount: '4 Fees' },
                    { name: 'Carlos Martinez', email: 'carlos.m@example.com', kids: 'Olivia (Gr 7) & Mateo (Gr 4)', due: '$545.00', isOverdue: false, feeCount: '4 Fees' },
                    { name: 'Jessica Bennett', email: 'jessica.b@example.com', kids: 'Noah (Gr 9), Liam (Gr 7) & Emma (Gr 3)', due: '$690.00', isOverdue: false, feeCount: '5 Fees' },
                    { name: 'Marcus Brooks', email: 'marcus.b@example.com', kids: 'Jackson (Gr 8) & Harper (Gr 6)', due: '$535.00', isOverdue: false, feeCount: '4 Fees' }
                  ].map((parent, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        setParentLoginQuery(parent.email);
                        handleParentLogin(parent.email);
                      }}
                      style={{
                        background: parent.isOverdue ? '#fff5f5' : '#f8fafc',
                        border: parent.isOverdue ? '1.5px solid #fca5a5' : '1px solid #e2e8f0',
                        borderRadius: '8px',
                        padding: '0.55rem 0.75rem',
                        textAlign: 'left',
                        fontSize: '0.775rem',
                        color: '#334155',
                        cursor: 'pointer',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                      }}
                    >
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
                          <strong style={{ color: parent.isOverdue ? '#991b1b' : '#002238' }}>{parent.name}</strong>
                          {parent.isOverdue ? (
                            <span style={{ fontSize: '0.675rem', color: '#b91c1c', fontWeight: 800, background: '#fee2e2', padding: '0.05rem 0.35rem', borderRadius: '4px' }}>
                              ⚠️ 8 OVERDUE FEES ({parent.due})
                            </span>
                          ) : (
                            <span style={{ fontSize: '0.7rem', color: '#b45309', fontWeight: 700 }}>({parent.due} due)</span>
                          )}
                        </div>
                        <div style={{ fontSize: '0.7rem', color: '#64748b' }}>{parent.kids}</div>
                      </div>
                      <span style={{ color: parent.isOverdue ? '#dc2626' : 'var(--sky-color-primary)', fontWeight: 700, fontSize: '0.75rem' }}>Login →</span>
                    </button>
                  ))}
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* OFFICIAL RECEIPT MODAL FOR SETTLED STUDENT ACCOUNTS */}
      {viewingReceiptForChild && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 34, 56, 0.8)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 110,
          padding: '1.5rem'
        }}>
          <div style={{
            background: '#ffffff',
            borderRadius: '16px',
            width: '100%',
            maxWidth: '580px',
            padding: '2rem',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.35)',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.25rem'
          }}>
            {/* Modal Header */}
            <div className="flex-between" style={{ alignItems: 'flex-start' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{ width: '42px', height: '42px', borderRadius: '8px', background: '#dcfce7', color: '#16a34a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Receipt size={22} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#002238', margin: 0 }}>
                    Official Payment Voucher &amp; Receipt
                  </h3>
                  <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
                    {schoolName} • Bursar Office Reconciled
                  </span>
                </div>
              </div>
              <button
                onClick={() => setViewingReceiptForChild(null)}
                style={{ background: 'none', border: 'none', fontSize: '1.35rem', cursor: 'pointer', color: '#64748b' }}
              >
                ✕
              </button>
            </div>

            {/* Receipt Summary Card */}
            <div style={{
              background: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: '10px',
              padding: '1.25rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.75rem'
            }}>
              <div className="flex-between" style={{ fontSize: '0.825rem' }}>
                <span style={{ color: '#64748b' }}>Student Name</span>
                <strong style={{ color: '#0f172a' }}>{viewingReceiptForChild.studentName} ({viewingReceiptForChild.studentId})</strong>
              </div>
              <div className="flex-between" style={{ fontSize: '0.825rem' }}>
                <span style={{ color: '#64748b' }}>Grade &amp; Division</span>
                <strong style={{ color: '#0f172a' }}>{viewingReceiptForChild.grade} • {viewingReceiptForChild.school || 'Oakridge Prep'}</strong>
              </div>
              <div className="flex-between" style={{ fontSize: '0.825rem' }}>
                <span style={{ color: '#64748b' }}>Confirmation Reference</span>
                <code style={{ color: '#0284c7', fontWeight: 700 }}>CONF-REC-{viewingReceiptForChild.studentId.replace('BB-STU-', '')}894</code>
              </div>
              <div className="flex-between" style={{ fontSize: '0.825rem' }}>
                <span style={{ color: '#64748b' }}>Payment Status</span>
                <span className="badge badge-success">
                  <Check size={11} /> PAID &amp; ACCOUNT SETTLED
                </span>
              </div>
              <div className="flex-between" style={{ fontSize: '0.825rem' }}>
                <span style={{ color: '#64748b' }}>Payment Channel</span>
                <span style={{ color: '#0f172a', fontWeight: 600 }}>Apple Pay / Online BBMS</span>
              </div>
              <div className="flex-between" style={{ fontSize: '0.825rem' }}>
                <span style={{ color: '#64748b' }}>General Ledger Entry</span>
                <code style={{ color: '#16a34a', fontWeight: 700 }}>GL-JE-2026-REC</code>
              </div>
              <div className="flex-between" style={{ fontSize: '0.825rem' }}>
                <span style={{ color: '#64748b' }}>Settlement Date</span>
                <span style={{ color: '#0f172a' }}>{new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
              </div>
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
              <button
                onClick={() => window.print()}
                className="sky-btn-default"
                style={{ flex: 1, padding: '0.65rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.45rem', fontSize: '0.875rem' }}
              >
                <Printer size={15} />
                <span>Print / Save PDF</span>
              </button>

              <button
                onClick={() => setViewingReceiptForChild(null)}
                style={{
                  flex: 1,
                  background: 'var(--sky-color-primary)',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '6px',
                  padding: '0.65rem',
                  fontWeight: 700,
                  fontSize: '0.875rem',
                  cursor: 'pointer'
                }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 10. COMPREHENSIVE ACADEMIC FOOTER */}
      <footer style={{ marginTop: 'auto', background: '#001b2e', color: '#ffffff', padding: '3.5rem 1.5rem 1.5rem 1.5rem', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
        <div style={{ maxWidth: '1320px', margin: '0 auto', display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: '3rem', marginBottom: '3rem' }}>
          <div>
            <h4 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '0.75rem', color: '#ffffff' }}>{schoolName}</h4>
            <p style={{ fontSize: '0.825rem', color: '#94a3b8', lineHeight: 1.6, maxWidth: '440px', margin: '0 0 1rem 0' }}>
              Accredited by the New England Association of Schools and Colleges (NEASC) and the Council of International Schools (CIS).
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', fontSize: '0.8rem', color: '#cbd5e1' }}>
              <span>📍 400 Oakridge Parkway, Academic Quad, MA 02138</span>
              <span>📞 +1 (555) 019-2831 (Bursar &amp; Student Accounts)</span>
              <span>✉️ bursar.office@oakridge.edu</span>
            </div>
          </div>

          <div>
            <h5 style={{ fontSize: '0.85rem', fontWeight: 700, color: '#7dd3fc', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '0.85rem' }}>
              Divisions
            </h5>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, fontSize: '0.825rem', color: '#cbd5e1', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <li>Lower School (Early Years–Gr 5)</li>
              <li>Middle School (Gr 6–8)</li>
              <li>Upper School (Gr 9–12)</li>
              <li>Global Scholars Program</li>
            </ul>
          </div>

          <div>
            <h5 style={{ fontSize: '0.85rem', fontWeight: 700, color: '#7dd3fc', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '0.85rem' }}>
              Parent Services
            </h5>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, fontSize: '0.825rem', color: '#cbd5e1', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <li style={{ cursor: 'pointer' }} onClick={() => setIsParentLoginModalOpen(true)}>Parent Portal Sign In</li>
              <li style={{ cursor: 'pointer' }} onClick={() => onNavigateToQuickPay()}>Guest Quick-Pay Station</li>
              <li style={{ cursor: 'pointer' }}>Excursion Liability Waivers</li>
              <li style={{ cursor: 'pointer' }}>Bursar Office Schedules</li>
            </ul>
          </div>

          <div>
            <h5 style={{ fontSize: '0.85rem', fontWeight: 700, color: '#7dd3fc', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '0.85rem' }}>
              Integration
            </h5>
            <div style={{ fontSize: '0.8rem', color: '#94a3b8', lineHeight: 1.6 }}>
              Powered by Blackbaud SKY API Education Management &amp; CredResolve Universal Fee Layer with BBMS Checkout.
            </div>
          </div>
        </div>

        <div style={{ maxWidth: '1320px', margin: '0 auto', paddingTop: '1.75rem', borderTop: '1px solid rgba(255,255,255,0.08)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', fontSize: '0.75rem', color: '#64748b' }}>
          <div>© 2026 {schoolName}. All rights reserved.</div>
          <div style={{ display: 'flex', gap: '1.25rem' }}>
            <span>Privacy Policy</span>
            <span>Terms of Service</span>
            <span>PCI Compliance</span>
            <span>Accessibility</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
