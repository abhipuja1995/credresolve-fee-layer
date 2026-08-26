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
  Share2
} from 'lucide-react';
import { SchoolBranding, StudentLookupResult } from '../types/index.js';
import { api } from '../services/api.js';

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
  
  // Parent Login Portal State
  const [isParentLoginModalOpen, setIsParentLoginModalOpen] = useState(false);
  const [parentLoginQuery, setParentLoginQuery] = useState('');
  const [isParentLoading, setIsParentLoading] = useState(false);
  const [parentLoginError, setParentLoginError] = useState<string | null>(null);
  const [loggedInParentResult, setLoggedInParentResult] = useState<StudentLookupResult | null>(null);

  const schoolName = branding?.schoolName || 'Oakridge International Prep';
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
    } catch (err: any) {
      setLoggedInParentResult(null);
      setParentLoginError(err.message || 'No parent or student account found matching this email.');
    } finally {
      setIsParentLoading(false);
    }
  };

  const handleParentLogout = () => {
    setLoggedInParentResult(null);
    setParentLoginQuery('');
  };

  return (
    <div style={{ background: '#f8fafc', color: '#1e293b', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      
      {/* Top Admin / Simulation Banner */}
      <div style={{
        background: '#002238',
        color: '#ffffff',
        padding: '0.5rem 1.5rem',
        fontSize: '0.8rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '0.5rem',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <span className="badge badge-info" style={{ fontSize: '0.65rem' }}>SIMULATION ENVIRONMENT</span>
          <span>You are viewing the simulated <strong>{schoolName}</strong> public web portal.</span>
        </div>

        <button
          onClick={onNavigateToAdmin}
          style={{
            background: 'var(--sky-color-primary)',
            color: '#ffffff',
            border: 'none',
            borderRadius: '4px',
            padding: '0.3rem 0.75rem',
            fontSize: '0.75rem',
            fontWeight: 700,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.35rem'
          }}
        >
          <ArrowLeft size={13} /> Return to CredResolve Fee Studio
        </button>
      </div>

      {/* School Website Header */}
      <header style={{
        background: '#ffffff',
        boxShadow: '0 2px 4px rgba(0,0,0,0.06)',
        position: 'sticky',
        top: 0,
        zIndex: 40
      }}>
        <div style={{
          maxWidth: '1280px',
          margin: '0 auto',
          padding: '0.9rem 1.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem'
        }}>
          {/* Logo & School Title */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
            {logoUrl ? (
              <img
                src={logoUrl}
                alt={schoolName}
                style={{ width: '48px', height: '48px', borderRadius: '6px', objectFit: 'cover' }}
              />
            ) : (
              <div style={{
                width: '46px',
                height: '46px',
                borderRadius: '6px',
                background: 'var(--sky-color-primary)',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 800,
                fontSize: '1.2rem'
              }}>
                {schoolName.charAt(0)}
              </div>
            )}

            <div>
              <h1 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#002238', margin: 0, letterSpacing: '-0.01em' }}>
                {schoolName}
              </h1>
              <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>
                Excellence in Academics, Leadership & Discovery • Founded 1984
              </span>
            </div>
          </div>

          {/* Nav Links & Action CTA */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <nav style={{ display: 'flex', gap: '1rem', fontSize: '0.875rem', fontWeight: 600, color: '#475569' }}>
              <span style={{ cursor: 'pointer', color: '#002238' }}>Academics</span>
              <span style={{ cursor: 'pointer' }}>Admissions</span>
              <span style={{ cursor: 'pointer' }}>Athletics</span>
              <span style={{ cursor: 'pointer' }}>Student Life</span>
            </nav>

            {/* Parent Login Button / Status */}
            {loggedInParentResult ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', background: 'var(--bg-surface-subtle)', padding: '0.4rem 0.75rem', borderRadius: '6px', border: '1px solid var(--border-strong)', fontSize: '0.8rem' }}>
                  <User size={14} color="var(--sky-color-primary)" />
                  <span style={{ fontWeight: 700, color: 'var(--text-heading)' }}>{loggedInParentResult.student.parentName}</span>
                </div>
                <button
                  onClick={handleParentLogout}
                  title="Sign out of parent session"
                  style={{ background: 'transparent', border: '1px solid #cbd5e1', borderRadius: '6px', padding: '0.4rem 0.6rem', color: '#64748b', cursor: 'pointer', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}
                >
                  <LogOut size={13} />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <button
                onClick={() => setIsParentLoginModalOpen(true)}
                className="sky-btn-default"
                style={{ fontSize: '0.85rem', padding: '0.55rem 0.95rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}
              >
                <User size={15} color="var(--sky-color-primary)" />
                <span>Parent Login</span>
              </button>
            )}

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
                boxShadow: '0 2px 6px rgba(0, 126, 168, 0.3)'
              }}
            >
              <CreditCard size={15} />
              <span>Pay Fees & Activities</span>
            </button>
          </div>
        </div>
      </header>

      {/* LOGGED IN PARENT FAMILY FEE OVERVIEW BANNER */}
      {loggedInParentResult && (
        <section style={{
          background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)',
          borderBottom: '1px solid #bae6fd',
          padding: '2rem 1.5rem'
        }}>
          <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
            <div className="flex-between" style={{ flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#0369a1', fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  <ShieldCheck size={16} />
                  <span>Authenticated Parent Portal Session</span>
                </div>
                <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0c4a6e', marginTop: '0.2rem' }}>
                  Welcome back, {loggedInParentResult.student.parentName}
                </h2>
                <p style={{ fontSize: '0.875rem', color: '#0369a1', marginTop: '0.15rem' }}>
                  Viewing registered children, fee schedules, and outstanding balances from Blackbaud Education Management.
                </p>
              </div>

              <div style={{ textAlign: 'right', background: '#ffffff', padding: '0.85rem 1.25rem', borderRadius: '8px', border: '1px solid #bae6fd', boxShadow: '0 2px 8px rgba(3, 105, 161, 0.08)' }}>
                <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>
                  Total Family Balance
                </span>
                <div style={{ fontSize: '1.85rem', fontWeight: 800, color: loggedInParentResult.totalFamilyBalance > 0 ? '#b45309' : '#16a34a' }}>
                  ${loggedInParentResult.totalFamilyBalance.toFixed(2)}
                </div>
              </div>
            </div>

            {/* Children Cards Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '1.25rem' }}>
              {[loggedInParentResult.student, ...loggedInParentResult.siblings].map(child => {
                const childCharges = loggedInParentResult.charges.filter(c => c.studentId === child.studentId);
                const childDue = childCharges.reduce((acc, c) => acc + (c.amount - c.amountPaid), 0);

                return (
                  <div key={child.studentId} style={{ background: '#ffffff', borderRadius: '10px', border: '1px solid #cbd5e1', padding: '1.25rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
                    <div>
                      <div className="flex-between" style={{ alignItems: 'flex-start' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                          <div style={{ width: '38px', height: '38px', borderRadius: '50%', background: '#e0f2fe', border: '2px solid #0284c7', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0284c7', fontWeight: 800 }}>
                            {child.studentName.charAt(0)}
                          </div>
                          <div>
                            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#002238', margin: 0 }}>
                              {child.studentName}
                            </h3>
                            <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
                              Roll: <strong>{child.studentId}</strong> • {child.grade} ({child.school || 'Oakridge Prep'})
                            </span>
                          </div>
                        </div>

                        <span className={`badge ${childDue > 0 ? 'badge-warning' : 'badge-success'}`} style={{ fontSize: '0.7rem' }}>
                          {childDue > 0 ? `$${childDue.toFixed(2)} Due` : 'Paid in Full'}
                        </span>
                      </div>

                      {/* Fee Obligations list for this child */}
                      <div style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        {childCharges.map(charge => (
                          <div key={charge.id} style={{ padding: '0.5rem 0.75rem', background: '#f8fafc', borderRadius: '6px', border: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.8rem' }}>
                            <div>
                              <strong style={{ color: '#1e293b' }}>{charge.feeTitle}</strong>
                              <div style={{ fontSize: '0.7rem', color: '#64748b' }}>Due: {charge.dueDate}</div>
                            </div>
                            <div style={{ fontWeight: 700, color: charge.paymentStatus === 'PAID' ? '#16a34a' : '#002238' }}>
                              ${charge.amount.toFixed(2)}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div style={{ marginTop: '1.25rem', paddingTop: '0.75rem', borderTop: '1px solid #f1f5f9', display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                      <button
                        onClick={() => onNavigateToQuickPay(child.studentId)}
                        style={{
                          background: 'var(--sky-color-primary)',
                          color: '#ffffff',
                          border: 'none',
                          borderRadius: '6px',
                          padding: '0.5rem 1rem',
                          fontSize: '0.8rem',
                          fontWeight: 700,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.35rem'
                        }}
                      >
                        <CreditCard size={14} />
                        <span>Pay {child.studentName.split(' ')[0]}'s Fees</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Hero Banner Section */}
      <section style={{
        background: 'linear-gradient(135deg, #002238 0%, #00426d 60%, #007ea8 100%)',
        color: '#ffffff',
        padding: '4rem 1.5rem',
        position: 'relative'
      }}>
        <div style={{
          maxWidth: '1280px',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: '1.2fr 0.8fr',
          gap: '2.5rem',
          alignItems: 'center'
        }}>
          <div>
            <span style={{
              background: 'rgba(255, 255, 255, 0.15)',
              color: '#7dd3fc',
              padding: '0.25rem 0.75rem',
              borderRadius: '20px',
              fontSize: '0.75rem',
              fontWeight: 700,
              letterSpacing: '0.04em',
              textTransform: 'uppercase'
            }}>
              2026-2027 Academic Year
            </span>

            <h2 style={{ fontSize: '2.5rem', fontWeight: 800, margin: '0.75rem 0', lineHeight: 1.2 }}>
              Empowering Tomorrow's Leaders with World-Class Education
            </h2>

            <p style={{ fontSize: '1rem', color: '#cbd5e1', lineHeight: 1.6, maxWidth: '560px', marginBottom: '1.75rem' }}>
              Welcome to the official portal of {schoolName}. Access student fee schedules, athletic excursion registrations, and digital legal consent waivers powered by the integrated CredResolve fee layer.
            </p>

            <div style={{ display: 'flex', gap: '0.85rem', flexWrap: 'wrap' }}>
              <button
                onClick={() => setIsParentLoginModalOpen(true)}
                style={{
                  background: '#ffffff',
                  color: '#002238',
                  border: 'none',
                  borderRadius: '6px',
                  padding: '0.8rem 1.5rem',
                  fontSize: '0.95rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                }}
              >
                <User size={17} color="var(--sky-color-primary)" />
                <span>Parent Login (View All Kids)</span>
                <ArrowRight size={15} />
              </button>

              <button
                onClick={() => onNavigateToQuickPay()}
                style={{
                  background: 'rgba(255, 255, 255, 0.15)',
                  color: '#ffffff',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  borderRadius: '6px',
                  padding: '0.8rem 1.25rem',
                  fontSize: '0.95rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.45rem'
                }}
              >
                <CreditCard size={16} />
                <span>Guest Quick-Pay</span>
              </button>
            </div>
          </div>

          {/* Quick Pay Box on Hero */}
          <div style={{
            background: '#ffffff',
            borderRadius: '12px',
            padding: '2rem',
            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.25)',
            color: '#1e293b'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--sky-color-primary)', fontWeight: 700, fontSize: '0.85rem' }}>
              <Sparkles size={16} />
              <span>Instant Student Fee Lookup</span>
            </div>

            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, margin: '0.35rem 0 0.5rem 0', color: '#002238' }}>
              Pay School Fees in 1-Click
            </h3>
            <p style={{ fontSize: '0.8rem', color: '#64748b', marginBottom: '1.25rem' }}>
              Parents, students, or sponsors can check and settle tuition, field trips, or lab supplies instantly.
            </p>

            <form onSubmit={handleQuickPaySubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              <div>
                <label style={{ fontSize: '0.775rem', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '0.3rem' }}>
                  Student Roll Number / Mobile / Email
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    type="text"
                    placeholder="e.g. BB-STU-101 or 555-0101"
                    value={quickStudentLookup}
                    onChange={e => setQuickStudentLookup(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.65rem 0.75rem 0.65rem 2.2rem',
                      border: '1px solid #cbd5e1',
                      borderRadius: '6px',
                      fontSize: '0.875rem'
                    }}
                  />
                  <Search size={15} color="#94a3b8" style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)' }} />
                </div>
              </div>

              <button
                type="submit"
                style={{
                  background: 'var(--sky-color-primary)',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '6px',
                  padding: '0.75rem',
                  fontWeight: 700,
                  fontSize: '0.9rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.45rem'
                }}
              >
                <span>Find & Pay Dues</span>
                <ArrowRight size={15} />
              </button>

              <div style={{ fontSize: '0.725rem', color: '#64748b', textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.35rem' }}>
                <ShieldCheck size={13} color="#16a34a" />
                <span>PCI-DSS v4.0 Level 1 Encrypted via Blackbaud BBMS</span>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* Featured School Activities & Upcoming Fees Section */}
      <section style={{ maxWidth: '1280px', margin: '0 auto', padding: '3.5rem 1.5rem', width: '100%' }}>
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--sky-color-primary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Current Campus Initiatives
          </span>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#002238', marginTop: '0.25rem' }}>
            Upcoming Excursions & Activity Fees
          </h2>
          <p style={{ color: '#64748b', fontSize: '0.9rem', maxWidth: '600px', margin: '0.35rem auto 0 auto' }}>
            Register your student and sign mandatory digital waivers online.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem' }}>
          {/* Card 1 */}
          <div style={{ background: '#ffffff', borderRadius: '8px', border: '1px solid #e2e8f0', padding: '1.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', boxShadow: '0 2px 4px rgba(0,0,0,0.04)' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#0284c7', fontSize: '0.75rem', fontWeight: 700, marginBottom: '0.4rem' }}>
                <Calendar size={13} />
                <span>Due Sept 30, 2026</span>
              </div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#002238', marginBottom: '0.5rem' }}>
                8th Grade Washington D.C. Tour
              </h3>
              <p style={{ fontSize: '0.825rem', color: '#64748b', lineHeight: 1.5, marginBottom: '1rem' }}>
                4-day historical excursion including museum passes, charter transit, hotel accommodations, and meals.
              </p>
            </div>
            <div className="flex-between" style={{ alignItems: 'center', paddingTop: '1rem', borderTop: '1px solid #f1f5f9' }}>
              <div>
                <span style={{ fontSize: '0.7rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 700 }}>Fee</span>
                <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#002238' }}>$350.00</div>
              </div>
              <button
                onClick={() => onNavigateToQuickPay('BB-STU-101')}
                style={{ background: 'var(--sky-color-primary)', color: '#ffffff', border: 'none', borderRadius: '4px', padding: '0.45rem 0.85rem', fontSize: '0.8rem', fontWeight: 700, cursor: 'pointer' }}
              >
                Register & Pay
              </button>
            </div>
          </div>

          {/* Card 2 */}
          <div style={{ background: '#ffffff', borderRadius: '8px', border: '1px solid #e2e8f0', padding: '1.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', boxShadow: '0 2px 4px rgba(0,0,0,0.04)' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#0284c7', fontSize: '0.75rem', fontWeight: 700, marginBottom: '0.4rem' }}>
                <Calendar size={13} />
                <span>Due Oct 15, 2026</span>
              </div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#002238', marginBottom: '0.5rem' }}>
                Junior Robotics & STEM Lab Kit
              </h3>
              <p style={{ fontSize: '0.825rem', color: '#64748b', lineHeight: 1.5, marginBottom: '1rem' }}>
                5th Grade micro-controller boards, sensors, curriculum licenses, and project consumables.
              </p>
            </div>
            <div className="flex-between" style={{ alignItems: 'center', paddingTop: '1rem', borderTop: '1px solid #f1f5f9' }}>
              <div>
                <span style={{ fontSize: '0.7rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 700 }}>Fee</span>
                <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#002238' }}>$125.00</div>
              </div>
              <button
                onClick={() => onNavigateToQuickPay('BB-STU-111')}
                style={{ background: 'var(--sky-color-primary)', color: '#ffffff', border: 'none', borderRadius: '4px', padding: '0.45rem 0.85rem', fontSize: '0.8rem', fontWeight: 700, cursor: 'pointer' }}
              >
                Register & Pay
              </button>
            </div>
          </div>

          {/* Card 3 */}
          <div style={{ background: '#ffffff', borderRadius: '8px', border: '1px solid #e2e8f0', padding: '1.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', boxShadow: '0 2px 4px rgba(0,0,0,0.04)' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#0284c7', fontSize: '0.75rem', fontWeight: 700, marginBottom: '0.4rem' }}>
                <Calendar size={13} />
                <span>Due Oct 20, 2026</span>
              </div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#002238', marginBottom: '0.5rem' }}>
                3rd Grade Creative Arts Supplies
              </h3>
              <p style={{ fontSize: '0.825rem', color: '#64748b', lineHeight: 1.5, marginBottom: '1rem' }}>
                Ceramics, sculpting clay, water colors, and sketchpads for Lower School visual arts studio.
              </p>
            </div>
            <div className="flex-between" style={{ alignItems: 'center', paddingTop: '1rem', borderTop: '1px solid #f1f5f9' }}>
              <div>
                <span style={{ fontSize: '0.7rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 700 }}>Fee</span>
                <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#002238' }}>$75.00</div>
              </div>
              <button
                onClick={() => onNavigateToQuickPay('BB-STU-112')}
                style={{ background: 'var(--sky-color-primary)', color: '#ffffff', border: 'none', borderRadius: '4px', padding: '0.45rem 0.85rem', fontSize: '0.8rem', fontWeight: 700, cursor: 'pointer' }}
              >
                Register & Pay
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* PARENT LOGIN MODAL */}
      {isParentLoginModalOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 34, 56, 0.75)',
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
            maxWidth: '520px',
            padding: '2rem',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
          }}>
            <div className="flex-between" style={{ marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <User size={20} color="var(--sky-color-primary)" />
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#002238', margin: 0 }}>
                  Parent Portal Sign In
                </h3>
              </div>
              <button
                onClick={() => setIsParentLoginModalOpen(false)}
                style={{ background: 'none', border: 'none', fontSize: '1.25rem', cursor: 'pointer', color: '#64748b' }}
              >
                ✕
              </button>
            </div>

            <p style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '1.25rem', lineHeight: 1.5 }}>
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
                      padding: '0.7rem 0.75rem 0.7rem 2.2rem',
                      border: '1px solid #cbd5e1',
                      borderRadius: '6px',
                      fontSize: '0.9rem'
                    }}
                  />
                  <Mail size={16} color="#94a3b8" style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)' }} />
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
                  borderRadius: '6px',
                  padding: '0.75rem',
                  fontWeight: 700,
                  fontSize: '0.9rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.45rem'
                }}
              >
                <span>{isParentLoading ? 'Verifying...' : 'Sign In & Fetch Children'}</span>
                <ArrowRight size={15} />
              </button>

              {/* Demo 1-Click Parent Profiles */}
              <div style={{ marginTop: '0.5rem', paddingTop: '1rem', borderTop: '1px solid #f1f5f9' }}>
                <span style={{ fontSize: '0.725rem', color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase' }}>
                  Quick Demo Parent Profiles:
                </span>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', marginTop: '0.4rem' }}>
                  <button
                    type="button"
                    onClick={() => {
                      setParentLoginQuery('michael.hayes@example.com');
                      handleParentLogin('michael.hayes@example.com');
                    }}
                    style={{
                      background: '#f8fafc',
                      border: '1px solid #e2e8f0',
                      borderRadius: '6px',
                      padding: '0.5rem 0.75rem',
                      textAlign: 'left',
                      fontSize: '0.775rem',
                      color: '#334155',
                      cursor: 'pointer',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}
                  >
                    <span><strong>Michael Hayes</strong> (Alexander &amp; Maya)</span>
                    <span style={{ color: 'var(--sky-color-primary)', fontWeight: 600 }}>Login →</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setParentLoginQuery('priya.patel@example.com');
                      handleParentLogin('priya.patel@example.com');
                    }}
                    style={{
                      background: '#f8fafc',
                      border: '1px solid #e2e8f0',
                      borderRadius: '6px',
                      padding: '0.5rem 0.75rem',
                      textAlign: 'left',
                      fontSize: '0.775rem',
                      color: '#334155',
                      cursor: 'pointer',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}
                  >
                    <span><strong>Priya Patel</strong> (Sophia &amp; Aarav)</span>
                    <span style={{ color: 'var(--sky-color-primary)', fontWeight: 600 }}>Login →</span>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* School Footer */}
      <footer style={{ marginTop: 'auto', background: '#002238', color: '#ffffff', padding: '3rem 1.5rem 1.5rem 1.5rem' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '2.5rem', marginBottom: '2.5rem' }}>
          <div>
            <h4 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '0.5rem' }}>{schoolName}</h4>
            <p style={{ fontSize: '0.825rem', color: '#94a3b8', lineHeight: 1.6, maxWidth: '420px' }}>
              Committed to nurturing intellectual curiosity and moral character. Accredited by the Independent Schools Association.
            </p>
            <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem', fontSize: '0.8rem', color: '#cbd5e1' }}>
              <span>📞 +1 (555) 019-2831</span>
              <span>✉️ billing@oakridge.edu</span>
            </div>
          </div>

          <div>
            <h5 style={{ fontSize: '0.85rem', fontWeight: 700, color: '#7dd3fc', textTransform: 'uppercase', marginBottom: '0.75rem' }}>
              Online Services
            </h5>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, fontSize: '0.825rem', color: '#cbd5e1', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              <li style={{ cursor: 'pointer' }} onClick={() => setIsParentLoginModalOpen(true)}>Parent Portal Sign In</li>
              <li style={{ cursor: 'pointer' }} onClick={() => onNavigateToQuickPay()}>Guest Quick-Pay Portal</li>
              <li style={{ cursor: 'pointer' }}>Excursion Waivers</li>
              <li style={{ cursor: 'pointer' }}>Student Accounts Office</li>
            </ul>
          </div>

          <div>
            <h5 style={{ fontSize: '0.85rem', fontWeight: 700, color: '#7dd3fc', textTransform: 'uppercase', marginBottom: '0.75rem' }}>
              Powered By
            </h5>
            <div style={{ fontSize: '0.8rem', color: '#94a3b8', lineHeight: 1.5 }}>
              Blackbaud SKY API Education Management &amp; CredResolve Universal Fee Wrapper.
            </div>
          </div>
        </div>

        <div style={{ maxWidth: '1280px', margin: '0 auto', paddingTop: '1.5rem', borderTop: '1px solid rgba(255,255,255,0.1)', textAlign: 'center', fontSize: '0.75rem', color: '#64748b' }}>
          © 2026 {schoolName}. All rights reserved. • Privacy Policy • Terms of Service
        </div>
      </footer>
    </div>
  );
};
