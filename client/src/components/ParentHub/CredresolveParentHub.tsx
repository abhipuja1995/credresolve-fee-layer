import React, { useState } from 'react';
import {
  DEFAULT_PARENT_HUB_PROFILES,
  MultiSchoolParentProfile,
  MultiSchoolFeeItem,
  MultiSchoolPaymentRecord
} from '../../types';
import { NoticeCentre } from './NoticeCentre';
import { FamilyIdentityGraph } from './FamilyIdentityGraph';
import { MultiSchoolCheckoutModal } from './MultiSchoolCheckoutModal';
import {
  Users,
  Building,
  GraduationCap,
  CreditCard,
  Bell,
  CheckCircle2,
  AlertTriangle,
  Receipt,
  Download,
  Filter,
  ShieldCheck,
  Zap,
  ArrowRight,
  Sparkles,
  Smartphone,
  Mail,
  LogOut,
  Calendar,
  Lock,
  ChevronRight,
  TrendingUp,
  Search,
  ExternalLink
} from 'lucide-react';

interface CredresolveParentHubProps {
  onNavigateToFeeStudio?: () => void;
  onNavigateToSchoolWebsite?: () => void;
}

export const CredresolveParentHub: React.FC<CredresolveParentHubProps> = ({
  onNavigateToFeeStudio,
  onNavigateToSchoolWebsite
}) => {
  const [profiles, setProfiles] = useState<MultiSchoolParentProfile[]>(DEFAULT_PARENT_HUB_PROFILES);
  const [activeProfileId, setActiveProfileId] = useState<string>(DEFAULT_PARENT_HUB_PROFILES[0].id);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(true);
  const [loginInput, setLoginInput] = useState<string>('alex.morgan@example.com');
  const [isAuthenticating, setIsAuthenticating] = useState<boolean>(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'FEES' | 'NOTICES' | 'HISTORY' | 'GRAPH'>('FEES');
  
  // Custom selection for fee payments
  const [selectedFeeIds, setSelectedFeeIds] = useState<string[]>([]);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [feeFilterSchool, setFeeFilterSchool] = useState<string>('ALL');
  const [feeFilterChild, setFeeFilterChild] = useState<string>('ALL');

  const currentProfile = profiles.find(p => p.id === activeProfileId) || profiles[0];

  const handleLogin = (targetEmailOrPhone?: string) => {
    const query = (targetEmailOrPhone || loginInput).trim().toLowerCase();
    if (!query) {
      setLoginError('Please enter your registered mobile number or email.');
      return;
    }

    setIsAuthenticating(true);
    setLoginError(null);

    setTimeout(() => {
      const matched = profiles.find(
        p => p.parentEmail.toLowerCase() === query || 
             p.parentPhone.replace(/[^0-9]/g, '').includes(query.replace(/[^0-9]/g, '')) ||
             p.parentName.toLowerCase().includes(query)
      );

      if (matched) {
        setActiveProfileId(matched.id);
        setIsLoggedIn(true);
        setSelectedFeeIds([]);
        setIsAuthenticating(false);
      } else {
        // Fallback match first profile or report error
        setLoginError(`No active parent account found matching "${query}". Please check your registered email or phone.`);
        setIsAuthenticating(false);
      }
    }, 450);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setSelectedFeeIds([]);
    setLoginError(null);
  };

  // Calculate Family Aggregates
  const allFees: MultiSchoolFeeItem[] = currentProfile.children.flatMap(c => c.fees);
  const unpaidFees = allFees.filter(f => f.paymentStatus !== 'PAID');
  const totalFamilyDue = unpaidFees.reduce((acc, f) => acc + (f.amount - f.amountPaid), 0);
  const totalNoticesCount = currentProfile.children.reduce((acc, c) => acc + c.notices.length, 0);
  const distinctSchoolsCount = new Set(currentProfile.children.map(c => c.schoolId)).size;

  // Toggle selection
  const toggleFeeSelection = (feeId: string) => {
    setSelectedFeeIds(prev =>
      prev.includes(feeId) ? prev.filter(id => id !== feeId) : [...prev, feeId]
    );
  };

  const handleSelectAll = () => {
    if (selectedFeeIds.length === unpaidFees.length) {
      setSelectedFeeIds([]);
    } else {
      setSelectedFeeIds(unpaidFees.map(f => f.id));
    }
  };

  const handle1ClickPayAll = () => {
    setSelectedFeeIds(unpaidFees.map(f => f.id));
    setIsCheckoutOpen(true);
  };

  const handlePaySelected = () => {
    if (selectedFeeIds.length > 0) {
      setIsCheckoutOpen(true);
    }
  };

  const handlePaymentSuccess = (newRecords: MultiSchoolPaymentRecord[], updatedFeeIds: string[]) => {
    setProfiles(prevProfiles =>
      prevProfiles.map(prof => {
        if (prof.id !== currentProfile.id) return prof;

        const updatedChildren = prof.children.map(child => {
          const updatedFees = child.fees.map(f => {
            if (updatedFeeIds.includes(f.id)) {
              return {
                ...f,
                amountPaid: f.amount,
                paymentStatus: 'PAID' as const,
                isOverdue: false
              };
            }
            return f;
          });

          const newTotalDue = updatedFees
            .filter(f => f.paymentStatus !== 'PAID')
            .reduce((acc, f) => acc + (f.amount - f.amountPaid), 0);

          return {
            ...child,
            fees: updatedFees,
            totalDue: newTotalDue,
            activeFeesCount: updatedFees.filter(f => f.paymentStatus !== 'PAID').length
          };
        });

        return {
          ...prof,
          children: updatedChildren,
          paymentHistory: [...newRecords, ...prof.paymentHistory]
        };
      })
    );
    setSelectedFeeIds([]);
  };

  // Fees filtered for the Inbox tab
  const filteredFees = unpaidFees.filter(f => {
    if (feeFilterSchool !== 'ALL' && f.schoolId !== feeFilterSchool) return false;
    if (feeFilterChild !== 'ALL' && f.studentId !== feeFilterChild) return false;
    return true;
  });

  const selectedFeesForCheckout = allFees.filter(f => selectedFeeIds.includes(f.id));

  // =========================================================================
  // IF NOT LOGGED IN: RENDER UNIVERSAL PARENT LOGIN SCREEN
  // =========================================================================
  if (!isLoggedIn) {
    return (
      <div style={{ background: '#f8fafc', color: '#0f172a', minHeight: '100vh', display: 'flex', flexDirection: 'column', fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif" }}>
        {/* Top Platform Banner */}
        <div style={{
          background: 'linear-gradient(135deg, #001b2e 0%, #002b49 100%)',
          color: '#ffffff',
          padding: '0.65rem 1.5rem',
          fontSize: '0.8rem',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '0.75rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <span style={{
              background: 'var(--sky-color-primary)',
              color: '#ffffff',
              padding: '0.2rem 0.6rem',
              borderRadius: '4px',
              fontSize: '0.675rem',
              fontWeight: 800,
              letterSpacing: '0.04em'
            }}>
              FAMILY OS
            </span>
            <span style={{ color: '#e2e8f0', fontWeight: 600 }}>
              CredResolve Parent Hub — <em>"Every school. Every child. One parent account."</em>
            </span>
          </div>

          {onNavigateToFeeStudio && (
            <button
              onClick={onNavigateToFeeStudio}
              style={{
                background: 'rgba(255, 255, 255, 0.15)',
                color: '#ffffff',
                border: '1px solid rgba(255, 255, 255, 0.25)',
                borderRadius: '4px',
                padding: '0.25rem 0.65rem',
                fontSize: '0.725rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem'
              }}
            >
              <span>Back to Fee Studio</span>
              <ExternalLink size={12} />
            </button>
          )}
        </div>

        {/* Login Container */}
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2.5rem 1.5rem' }}>
          <div className="sky-card" style={{
            maxWidth: '520px',
            width: '100%',
            padding: '2.5rem 2rem',
            boxShadow: '0 8px 30px rgba(0, 0, 0, 0.06)',
            borderRadius: '12px',
            border: '1px solid var(--border-subtle)'
          }}>
            {/* Login Header */}
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
              <div style={{
                width: '64px',
                height: '64px',
                borderRadius: '16px',
                background: 'linear-gradient(135deg, #007ea8 0%, #002238 100%)',
                color: '#ffffff',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1rem',
                boxShadow: '0 4px 14px rgba(0, 126, 168, 0.25)'
              }}>
                <Users size={32} />
              </div>
              <h2 className="sky-heading-1" style={{ fontSize: '1.65rem', marginBottom: '0.35rem' }}>
                Universal Parent Login
              </h2>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', lineHeight: '1.5' }}>
                One parent. Multiple children. Multiple schools. One secure portal.
              </p>
            </div>

            {/* Error Message */}
            {loginError && (
              <div style={{
                padding: '0.75rem 1rem',
                background: '#fef2f2',
                border: '1px solid #fecaca',
                borderRadius: 'var(--radius-sm)',
                color: '#b91c1c',
                fontSize: '0.8rem',
                marginBottom: '1.25rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                <AlertTriangle size={15} />
                <span>{loginError}</span>
              </div>
            )}

            {/* Input Form */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-heading)', marginBottom: '0.45rem' }}>
                  Registered Mobile Number or Email
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    type="text"
                    value={loginInput}
                    onChange={e => setLoginInput(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleLogin()}
                    placeholder="e.g. alex.morgan@example.com or +1 (555) 018-4921"
                    style={{
                      paddingLeft: '2.5rem',
                      fontSize: '0.9rem',
                      height: '44px',
                      borderRadius: '6px'
                    }}
                  />
                  <Mail size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)' }} />
                </div>
              </div>

              <button
                className="sky-btn-primary"
                onClick={() => handleLogin()}
                disabled={isAuthenticating}
                style={{
                  height: '44px',
                  fontSize: '0.925rem',
                  fontWeight: 700,
                  justifyContent: 'center',
                  gap: '0.5rem',
                  boxShadow: '0 2px 6px rgba(0, 126, 168, 0.25)'
                }}
              >
                {isAuthenticating ? (
                  <>
                    <span>Matching Enrolled Children...</span>
                  </>
                ) : (
                  <>
                    <span>Authenticate &amp; Open Parent Hub</span>
                    <ArrowRight size={16} />
                  </>
                )}
              </button>
            </div>

            {/* Quick Demo Identities */}
            <div style={{ marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border-subtle)' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '0.75rem', textAlign: 'center' }}>
                Or select demo parent identity:
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {profiles.map(p => (
                  <button
                    key={p.id}
                    onClick={() => handleLogin(p.parentEmail)}
                    style={{
                      background: 'var(--bg-surface-subtle)',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: '6px',
                      padding: '0.65rem 0.85rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      cursor: 'pointer',
                      textAlign: 'left',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: 700, color: 'var(--text-heading)', fontSize: '0.85rem' }}>
                        {p.parentName}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        {p.parentEmail} • {p.children.length} Children ({p.children.map(c => c.studentName.split(' ')[0]).join(', ')})
                      </div>
                    </div>
                    <span className="badge badge-info" style={{ fontSize: '0.7rem' }}>
                      {p.currencySymbol}{p.children.reduce((acc, c) => acc + c.totalDue, 0).toLocaleString()} Due
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* SSO Trust Note */}
            <div style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.45rem' }}>
              <ShieldCheck size={14} color="var(--success)" />
              <span>Protected by Blackbaud Universal SSO Identity Layer</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // LOGGED IN DASHBOARD VIEW
  // =========================================================================
  return (
    <div style={{ background: '#f8fafc', color: '#0f172a', minHeight: '100vh', display: 'flex', flexDirection: 'column', fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif" }}>
      
      {/* 1. TOP PLATFORM BANNER */}
      <div style={{
        background: 'linear-gradient(135deg, #001b2e 0%, #002b49 100%)',
        color: '#ffffff',
        padding: '0.65rem 1.5rem',
        fontSize: '0.8rem',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '0.75rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <span style={{
            background: 'var(--sky-color-primary)',
            color: '#ffffff',
            padding: '0.2rem 0.6rem',
            borderRadius: '4px',
            fontSize: '0.675rem',
            fontWeight: 800,
            letterSpacing: '0.04em'
          }}>
            FAMILY OS
          </span>
          <span style={{ color: '#e2e8f0', fontWeight: 600 }}>
            CredResolve Parent Hub — <em>"Every school. Every child. One parent account."</em>
          </span>
        </div>

        {/* Admin Return */}
        {onNavigateToFeeStudio && (
          <button
            onClick={onNavigateToFeeStudio}
            style={{
              background: 'rgba(255, 255, 255, 0.15)',
              color: '#ffffff',
              border: '1px solid rgba(255, 255, 255, 0.25)',
              borderRadius: '4px',
              padding: '0.25rem 0.65rem',
              fontSize: '0.725rem',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem'
            }}
          >
            <span>Back to Fee Studio</span>
            <ExternalLink size={12} />
          </button>
        )}
      </div>

      {/* 2. UNIVERSAL PARENT IDENTITY HEADER */}
      <header style={{
        background: '#ffffff',
        borderBottom: '1px solid #e2e8f0',
        padding: '1.25rem 2rem',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.02)'
      }}>
        <div style={{ maxWidth: '1360px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.25rem' }}>
          
          {/* Parent Profile Badge */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{
              width: '52px',
              height: '52px',
              borderRadius: '14px',
              background: 'linear-gradient(135deg, #007ea8 0%, #002238 100%)',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 800,
              fontSize: '1.35rem',
              boxShadow: '0 4px 12px rgba(0, 126, 168, 0.25)'
            }}>
              {currentProfile.parentName.charAt(0)}
            </div>

            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--sky-color-primary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Universal Parent Identity
                </span>
                <span style={{ background: '#ecfdf5', color: '#059669', border: '1px solid #a7f3d0', padding: '0.1rem 0.4rem', borderRadius: '4px', fontSize: '0.65rem', fontWeight: 700 }}>
                  Active SSO
                </span>
              </div>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a', margin: '0.1rem 0' }}>
                Parent: {currentProfile.parentName}
              </h2>
              <div style={{ fontSize: '0.775rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <span><Smartphone size={12} style={{ display: 'inline', marginRight: '3px' }} /> {currentProfile.parentPhone}</span>
                <span>•</span>
                <span><Mail size={12} style={{ display: 'inline', marginRight: '3px' }} /> {currentProfile.parentEmail}</span>
              </div>
            </div>
          </div>

          {/* Quick Metrics & Logout */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 700 }}>
                {currentProfile.children.length} CHILDREN • {distinctSchoolsCount} SCHOOLS
              </div>
              <div style={{ fontSize: '1.75rem', fontWeight: 800, color: totalFamilyDue > 0 ? '#b45309' : '#16a34a', marginTop: '0.1rem' }}>
                {currentProfile.currencySymbol}{totalFamilyDue.toLocaleString()} Total Due
              </div>
            </div>

            {totalFamilyDue > 0 && (
              <button
                onClick={handle1ClickPayAll}
                style={{
                  background: 'linear-gradient(135deg, #007ea8 0%, #002238 100%)',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '6px',
                  padding: '0.75rem 1.4rem',
                  fontSize: '0.925rem',
                  fontWeight: 800,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  boxShadow: '0 4px 14px rgba(0, 126, 168, 0.3)',
                  transition: 'all 0.15s ease'
                }}
              >
                <Zap size={16} />
                <span>1-Click Pay All ({currentProfile.currencySymbol}{totalFamilyDue.toLocaleString()})</span>
              </button>
            )}

            <button
              onClick={handleLogout}
              className="sky-btn-default"
              title="Log out from this parent identity"
              style={{
                fontSize: '0.8rem',
                padding: '0.65rem 0.95rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.45rem'
              }}
            >
              <LogOut size={14} />
              <span>Log Out</span>
            </button>
          </div>

        </div>
      </header>

      {/* 3. MAIN CONTENT CONTAINER */}
      <main style={{ maxWidth: '1360px', margin: '1.75rem auto', padding: '0 1.5rem', width: '100%', flex: 1, display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
        
        {/* SMART REMINDER NOTIFICATION BANNER */}
        {totalFamilyDue > 0 && (
          <div style={{
            background: 'linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%)',
            border: '1.5px solid #fcd34d',
            borderRadius: '14px',
            padding: '1.15rem 1.5rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '1rem',
            boxShadow: '0 2px 10px rgba(217, 119, 6, 0.08)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#fbbf24', color: '#78350f', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Bell size={20} />
              </div>
              <div>
                <div style={{ fontSize: '0.725rem', fontWeight: 800, color: '#92400e', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Smart Cross-School Reminder
                </div>
                <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#78350f', marginTop: '0.1rem' }}>
                  🔔 {currentProfile.currencySymbol}{totalFamilyDue.toLocaleString()} due across {distinctSchoolsCount} schools
                </div>
                <div style={{ fontSize: '0.8rem', color: '#92400e', marginTop: '0.15rem' }}>
                  {currentProfile.children.map(c => `${c.studentName} (${currentProfile.currencySymbol}${c.totalDue.toLocaleString()} • ${c.schoolShortCode})`).join(' • ')}
                </div>
              </div>
            </div>

            <button
              onClick={handle1ClickPayAll}
              style={{
                background: '#b45309',
                color: '#ffffff',
                border: 'none',
                borderRadius: '8px',
                padding: '0.55rem 1.15rem',
                fontSize: '0.85rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                boxShadow: '0 2px 6px rgba(180, 83, 9, 0.25)'
              }}
            >
              <span>Pay All Together</span>
              <ArrowRight size={14} />
            </button>
          </div>
        )}

        {/* 4. WHAT THE PARENT SEES: SIDE-BY-SIDE MULTI-CHILD CARDS */}
        <section>
          <div className="flex-between" style={{ marginBottom: '1rem', alignItems: 'flex-end', flexWrap: 'wrap', gap: '0.5rem' }}>
            <div>
              <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--sky-color-primary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Cross-School Multi-Child Roster
              </span>
              <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-heading)', margin: '0.15rem 0 0 0' }}>
                Enrolled Children &amp; Participating Schools
              </h3>
            </div>
          </div>

          {/* Matrix Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 320px), 1fr))',
            gap: '1.25rem'
          }}>
            {currentProfile.children.map((child, idx) => {
              const earliestDue = child.fees.filter(f => f.paymentStatus !== 'PAID')[0]?.dueDate || 'Settled';
              const hasOverdue = child.fees.some(f => f.isOverdue && f.paymentStatus !== 'PAID');

              return (
                <div
                  key={child.studentId}
                  style={{
                    background: '#ffffff',
                    borderRadius: '16px',
                    border: hasOverdue ? '1.5px solid #fca5a5' : '1px solid var(--border-strong)',
                    padding: '1.25rem',
                    boxShadow: 'var(--shadow-card)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    gap: '1.25rem',
                    position: 'relative'
                  }}
                >
                  <div>
                    {/* Child Header */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem', gap: '0.5rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div style={{
                          width: '44px',
                          height: '44px',
                          borderRadius: '50%',
                          background: `${child.schoolBadgeColor}15`,
                          color: child.schoolBadgeColor,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontWeight: 800,
                          fontSize: '1.1rem',
                          border: `2px solid ${child.schoolBadgeColor}`,
                          flexShrink: 0
                        }}>
                          {child.studentName.charAt(0)}
                        </div>
                        <div>
                          <div style={{ fontSize: '0.7rem', fontWeight: 800, color: child.schoolBadgeColor, textTransform: 'uppercase' }}>
                            CHILD #{idx + 1}
                          </div>
                          <h4 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-heading)', margin: 0 }}>
                            {child.studentName}
                          </h4>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.1rem' }}>
                            {child.grade} • Roll: <strong style={{ color: 'var(--text-heading)' }}>{child.studentId}</strong>
                          </div>
                        </div>
                      </div>

                      <span style={{
                        background: child.totalDue > 0 ? (hasOverdue ? '#fee2e2' : '#fef3c7') : '#ecfdf5',
                        color: child.totalDue > 0 ? (hasOverdue ? '#991b1b' : '#b45309') : '#047857',
                        padding: '0.25rem 0.6rem',
                        borderRadius: '20px',
                        fontSize: '0.7rem',
                        fontWeight: 800,
                        whiteSpace: 'nowrap',
                        flexShrink: 0
                      }}>
                        {child.totalDue > 0 ? `${currentProfile.currencySymbol}${child.totalDue.toLocaleString()} Due` : 'Settled'}
                      </span>
                    </div>

                    {/* School Identity Badge */}
                    <div style={{
                      background: 'var(--bg-surface-subtle)',
                      borderRadius: '10px',
                      padding: '0.7rem 0.9rem',
                      border: '1px solid var(--border-subtle)',
                      marginBottom: '1rem'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Building size={16} color={child.schoolBadgeColor} />
                        <strong style={{ fontSize: '0.85rem', color: 'var(--text-heading)' }}>{child.schoolName}</strong>
                      </div>
                      <div style={{ fontSize: '0.725rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                        ERP: {child.schoolErpSystem}
                      </div>
                    </div>

                    {/* Matrix Comparison Metrics */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.65rem', fontSize: '0.775rem' }}>
                      <div style={{ background: '#ffffff', border: '1px solid var(--border-subtle)', padding: '0.6rem 0.75rem', borderRadius: '8px' }}>
                        <div style={{ color: 'var(--text-muted)', fontSize: '0.7rem', fontWeight: 600 }}>FEES DUE</div>
                        <strong style={{ fontSize: '1rem', color: child.totalDue > 0 ? 'var(--text-heading)' : 'var(--success)' }}>
                          {currentProfile.currencySymbol}{child.totalDue.toLocaleString()}
                        </strong>
                      </div>

                      <div style={{ background: '#ffffff', border: '1px solid var(--border-subtle)', padding: '0.6rem 0.75rem', borderRadius: '8px' }}>
                        <div style={{ color: 'var(--text-muted)', fontSize: '0.7rem', fontWeight: 600 }}>NEXT DUE DATE</div>
                        <strong style={{ fontSize: '0.85rem', color: hasOverdue ? 'var(--danger)' : 'var(--text-heading)' }}>
                          {hasOverdue ? '⚠️ Overdue' : earliestDue}
                        </strong>
                      </div>

                      <div style={{ background: '#ffffff', border: '1px solid var(--border-subtle)', padding: '0.6rem 0.75rem', borderRadius: '8px' }}>
                        <div style={{ color: 'var(--text-muted)', fontSize: '0.7rem', fontWeight: 600 }}>SCHOOL NOTICES</div>
                        <strong style={{ fontSize: '0.85rem', color: 'var(--sky-color-primary)' }}>
                          {child.notices.length} New Circular{child.notices.length !== 1 ? 's' : ''}
                        </strong>
                      </div>

                      <div style={{ background: '#ffffff', border: '1px solid var(--border-subtle)', padding: '0.6rem 0.75rem', borderRadius: '8px' }}>
                        <div style={{ color: 'var(--text-muted)', fontSize: '0.7rem', fontWeight: 600 }}>OBLIGATIONS</div>
                        <strong style={{ fontSize: '0.85rem', color: 'var(--text-heading)' }}>
                          {child.fees.filter(f => f.paymentStatus !== 'PAID').length} Active Items
                        </strong>
                      </div>
                    </div>
                  </div>

                  {/* Direct Child Action */}
                  <div>
                    {child.totalDue > 0 ? (
                      <button
                        onClick={() => {
                          const childFeeIds = child.fees.filter(f => f.paymentStatus !== 'PAID').map(f => f.id);
                          setSelectedFeeIds(childFeeIds);
                          setIsCheckoutOpen(true);
                        }}
                        className="sky-btn-primary"
                        style={{
                          width: '100%',
                          padding: '0.7rem 1rem',
                          fontSize: '0.85rem',
                          fontWeight: 700,
                          borderRadius: '8px',
                          minHeight: '42px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '0.45rem',
                          boxShadow: '0 2px 6px rgba(0, 126, 168, 0.25)'
                        }}
                      >
                        <CreditCard size={15} />
                        <span>Pay {child.studentName.split(' ')[0]}'s Dues ({currentProfile.currencySymbol}{child.totalDue.toLocaleString()})</span>
                      </button>
                    ) : (
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.35rem', padding: '0.65rem', background: '#f0fdf4', color: '#16a34a', borderRadius: '8px', fontSize: '0.8rem', fontWeight: 700, border: '1px solid #bbf7d0' }}>
                        <CheckCircle2 size={15} />
                        <span>All Fees Settled</span>
                      </div>
                    )}
                  </div>

                </div>
              );
            })}
          </div>
        </section>

        {/* 5. TABBED INTERFACE (Unified Fee Inbox, Notice Centre, History, Graph) */}
        <section style={{ marginTop: '0.5rem' }}>
          
          {/* Tab Navigation */}
          <div style={{
            display: 'flex',
            overflowX: 'auto',
            WebkitOverflowScrolling: 'touch',
            scrollbarWidth: 'none',
            borderBottom: '2px solid var(--border-subtle)',
            gap: '0.5rem',
            marginBottom: '1.25rem',
            whiteSpace: 'nowrap',
            paddingBottom: '2px'
          }}>
            <button
              onClick={() => setActiveTab('FEES')}
              style={{
                background: 'none',
                border: 'none',
                borderBottom: activeTab === 'FEES' ? '3px solid var(--sky-color-primary)' : '3px solid transparent',
                padding: '0.75rem 1rem',
                fontSize: '0.875rem',
                fontWeight: activeTab === 'FEES' ? 800 : 600,
                color: activeTab === 'FEES' ? 'var(--sky-color-primary)' : 'var(--text-muted)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.45rem',
                whiteSpace: 'nowrap',
                flexShrink: 0,
                marginBottom: '-2px'
              }}
            >
              <CreditCard size={16} />
              <span>Unified Fee Inbox ({unpaidFees.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('NOTICES')}
              style={{
                background: 'none',
                border: 'none',
                borderBottom: activeTab === 'NOTICES' ? '3px solid var(--sky-color-primary)' : '3px solid transparent',
                padding: '0.75rem 1rem',
                fontSize: '0.875rem',
                fontWeight: activeTab === 'NOTICES' ? 800 : 600,
                color: activeTab === 'NOTICES' ? 'var(--sky-color-primary)' : 'var(--text-muted)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.45rem',
                whiteSpace: 'nowrap',
                flexShrink: 0,
                marginBottom: '-2px'
              }}
            >
              <Bell size={16} />
              <span>Unified Notice Centre ({totalNoticesCount})</span>
            </button>

            <button
              onClick={() => setActiveTab('HISTORY')}
              style={{
                background: 'none',
                border: 'none',
                borderBottom: activeTab === 'HISTORY' ? '3px solid var(--sky-color-primary)' : '3px solid transparent',
                padding: '0.75rem 1rem',
                fontSize: '0.875rem',
                fontWeight: activeTab === 'HISTORY' ? 800 : 600,
                color: activeTab === 'HISTORY' ? 'var(--sky-color-primary)' : 'var(--text-muted)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.45rem',
                whiteSpace: 'nowrap',
                flexShrink: 0,
                marginBottom: '-2px'
              }}
            >
              <Receipt size={16} />
              <span>Payment History &amp; Receipts ({currentProfile.paymentHistory.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('GRAPH')}
              style={{
                background: 'none',
                border: 'none',
                borderBottom: activeTab === 'GRAPH' ? '3px solid var(--sky-color-primary)' : '3px solid transparent',
                padding: '0.75rem 1rem',
                fontSize: '0.875rem',
                fontWeight: activeTab === 'GRAPH' ? 800 : 600,
                color: activeTab === 'GRAPH' ? 'var(--sky-color-primary)' : 'var(--text-muted)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.45rem',
                whiteSpace: 'nowrap',
                flexShrink: 0,
                marginBottom: '-2px'
              }}
            >
              <Sparkles size={16} />
              <span>Family Identity Graph</span>
            </button>
          </div>

          {/* TAB 1: UNIFIED FEE INBOX */}
          {activeTab === 'FEES' && (
            <div style={{ background: '#ffffff', borderRadius: '16px', border: '1px solid var(--border-strong)', padding: '1.25rem', boxShadow: 'var(--shadow-card)' }}>
              
              {/* Fee Filter Controls & Actions */}
              <div className="flex-between" style={{ flexWrap: 'wrap', gap: '0.85rem', marginBottom: '1.25rem', paddingBottom: '1rem', borderBottom: '1px solid var(--border-subtle)' }}>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.65rem', alignItems: 'center', width: '100%' }}>
                  <button
                    onClick={handleSelectAll}
                    className="sky-btn-default"
                    style={{
                      fontSize: '0.8rem',
                      fontWeight: 700,
                      padding: '0.5rem 0.95rem',
                      minHeight: '38px',
                      borderRadius: '8px',
                      background: selectedFeeIds.length === unpaidFees.length && unpaidFees.length > 0 ? 'var(--sky-color-primary-light)' : 'var(--bg-surface-subtle)',
                      borderColor: selectedFeeIds.length === unpaidFees.length && unpaidFees.length > 0 ? 'var(--sky-color-primary)' : 'var(--border-strong)',
                      color: selectedFeeIds.length === unpaidFees.length && unpaidFees.length > 0 ? 'var(--sky-color-primary)' : 'var(--text-heading)'
                    }}
                  >
                    {selectedFeeIds.length === unpaidFees.length && unpaidFees.length > 0 ? 'Deselect All' : 'Select All Dues'}
                  </button>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', flex: '1 1 auto', minWidth: '150px' }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>School:</span>
                    <select
                      value={feeFilterSchool}
                      onChange={e => setFeeFilterSchool(e.target.value)}
                      style={{ padding: '0.45rem 0.65rem', borderRadius: '8px', border: '1px solid var(--border-strong)', fontSize: '0.8rem', background: '#ffffff', color: 'var(--text-heading)', fontWeight: 600, width: '100%' }}
                    >
                      <option value="ALL">All Schools ({distinctSchoolsCount})</option>
                      {Array.from(new Set(currentProfile.children.map(c => JSON.stringify({ id: c.schoolId, name: c.schoolName })))).map(s => {
                        const sch = JSON.parse(s);
                        return <option key={sch.id} value={sch.id}>{sch.name}</option>;
                      })}
                    </select>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', flex: '1 1 auto', minWidth: '150px' }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>Child:</span>
                    <select
                      value={feeFilterChild}
                      onChange={e => setFeeFilterChild(e.target.value)}
                      style={{ padding: '0.45rem 0.65rem', borderRadius: '8px', border: '1px solid var(--border-strong)', fontSize: '0.8rem', background: '#ffffff', color: 'var(--text-heading)', fontWeight: 600, width: '100%' }}
                    >
                      <option value="ALL">All Children ({currentProfile.children.length})</option>
                      {currentProfile.children.map(c => (
                        <option key={c.studentId} value={c.studentId}>{c.studentName}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Bulk Pay Action */}
                {selectedFeeIds.length > 0 && (
                  <div style={{ width: '100%', display: 'flex', justifyContent: 'flex-end', marginTop: '0.35rem' }}>
                    <button
                      onClick={handlePaySelected}
                      className="sky-btn-primary"
                      style={{
                        width: '100%',
                        padding: '0.65rem 1.25rem',
                        fontSize: '0.85rem',
                        fontWeight: 800,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.45rem',
                        borderRadius: '8px',
                        minHeight: '42px',
                        boxShadow: '0 2px 8px rgba(0, 126, 168, 0.25)'
                      }}
                    >
                      <CreditCard size={15} />
                      <span>Pay Selected ({selectedFeeIds.length}) • {currentProfile.currencySymbol}{selectedFeesForCheckout.reduce((acc, f) => acc + (f.amount - f.amountPaid), 0).toLocaleString()}</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Fee Table */}
              {filteredFees.length === 0 ? (
                <div style={{ padding: '3rem', textAlign: 'center', color: '#64748b' }}>
                  <CheckCircle2 size={40} color="#16a34a" style={{ margin: '0 auto 0.75rem auto' }} />
                  <div style={{ fontSize: '1rem', fontWeight: 700, color: '#0f172a' }}>All filtered fees are settled!</div>
                  <div style={{ fontSize: '0.825rem', marginTop: '0.25rem' }}>No outstanding dues match your current filter.</div>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {filteredFees.map(fee => {
                    const isChecked = selectedFeeIds.includes(fee.id);
                    const remaining = fee.amount - fee.amountPaid;

                    return (
                      <div
                        key={fee.id}
                        style={{
                          background: isChecked ? '#f0f9ff' : (fee.isOverdue ? '#fff5f5' : '#ffffff'),
                          borderRadius: '12px',
                          border: isChecked ? '1.5px solid #0284c7' : (fee.isOverdue ? '1.5px solid #fca5a5' : '1px solid #e2e8f0'),
                          padding: '1.15rem 1.25rem',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          flexWrap: 'wrap',
                          gap: '1rem',
                          transition: 'all 0.15s ease'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => toggleFeeSelection(fee.id)}
                            style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                          />

                          <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                              <strong style={{ fontSize: '0.95rem', color: '#0f172a' }}>
                                {fee.feeTitle}
                              </strong>
                              {fee.isOverdue && (
                                <span style={{ background: '#fee2e2', color: '#991b1b', border: '1px solid #f87171', padding: '0.1rem 0.45rem', borderRadius: '4px', fontSize: '0.65rem', fontWeight: 800 }}>
                                  ⚠️ OVERDUE
                                </span>
                              )}
                            </div>

                            <div style={{ fontSize: '0.775rem', color: '#64748b', marginTop: '0.2rem', display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
                              <span style={{ fontWeight: 700, color: '#0f172a' }}>{fee.studentName} ({fee.grade})</span>
                              <span>•</span>
                              <span style={{ color: fee.schoolBadgeColor, fontWeight: 700 }}>{fee.schoolName}</span>
                              <span>•</span>
                              <span>Due: {fee.dueDate}</span>
                            </div>
                          </div>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                          <div style={{ textAlign: 'right' }}>
                            <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f172a' }}>
                              {currentProfile.currencySymbol}{remaining.toLocaleString()}
                            </div>
                            <span style={{ fontSize: '0.7rem', color: '#64748b' }}>
                              Category: {fee.category}
                            </span>
                          </div>

                          <button
                            onClick={() => {
                              setSelectedFeeIds([fee.id]);
                              setIsCheckoutOpen(true);
                            }}
                            style={{
                              background: '#ffffff',
                              border: '1px solid #cbd5e1',
                              color: '#0284c7',
                              borderRadius: '6px',
                              padding: '0.45rem 0.85rem',
                              fontSize: '0.775rem',
                              fontWeight: 700,
                              cursor: 'pointer'
                            }}
                          >
                            Pay Item
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: UNIFIED NOTICE CENTRE */}
          {activeTab === 'NOTICES' && (
            <NoticeCentre profile={currentProfile} />
          )}

          {/* TAB 3: PAYMENT HISTORY & UNIFIED RECEIPTS */}
          {activeTab === 'HISTORY' && (
            <div style={{ background: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '2rem', boxShadow: '0 4px 20px -4px rgba(0, 0, 0, 0.05)' }}>
              <div className="flex-between" style={{ marginBottom: '1.5rem', paddingBottom: '1rem', borderBottom: '1px solid #f1f5f9' }}>
                <div>
                  <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                    Cross-School Payment History &amp; Subledger Audit
                  </h3>
                  <p style={{ fontSize: '0.85rem', color: '#64748b', margin: '0.2rem 0 0 0' }}>
                    Itemized receipt log with individual school General Ledger journal reference numbers.
                  </p>
                </div>
                <button
                  onClick={() => alert('Exporting all tax receipts across participating schools as PDF...')}
                  style={{
                    background: '#f8fafc',
                    border: '1px solid #cbd5e1',
                    color: '#334155',
                    padding: '0.5rem 0.9rem',
                    borderRadius: '8px',
                    fontSize: '0.775rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.35rem'
                  }}
                >
                  <Download size={14} />
                  <span>Export Consolidated Annual Statement</span>
                </button>
              </div>

              {currentProfile.paymentHistory.length === 0 ? (
                <div style={{ padding: '3rem', textAlign: 'center', color: '#64748b' }}>
                  <Receipt size={40} color="#cbd5e1" style={{ margin: '0 auto 0.75rem auto' }} />
                  <div style={{ fontSize: '1rem', fontWeight: 700, color: '#0f172a' }}>No transactions recorded yet</div>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {currentProfile.paymentHistory.map(rec => (
                    <div
                      key={rec.transactionId}
                      style={{
                        background: '#ffffff',
                        border: '1px solid #e2e8f0',
                        borderRadius: '12px',
                        padding: '1.25rem',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        flexWrap: 'wrap',
                        gap: '1rem',
                        boxShadow: '0 2px 6px rgba(0,0,0,0.02)'
                      }}
                    >
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <strong style={{ fontSize: '0.95rem', color: '#0f172a' }}>
                            {rec.studentName} — {rec.feeTitle}
                          </strong>
                          <span style={{ background: '#ecfdf5', color: '#059669', border: '1px solid #a7f3d0', padding: '0.1rem 0.4rem', borderRadius: '4px', fontSize: '0.65rem', fontWeight: 800 }}>
                            {rec.status}
                          </span>
                        </div>

                        <div style={{ fontSize: '0.775rem', color: '#64748b', marginTop: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
                          <span>School: <strong>{rec.schoolName}</strong></span>
                          <span>•</span>
                          <span>Receipt: <strong style={{ color: '#0284c7' }}>{rec.receiptNumber}</strong></span>
                          <span>•</span>
                          <span>GL Ref: {rec.subledgerJournalEntryId}</span>
                          <span>•</span>
                          <span>Date: {new Date(rec.paidAt).toLocaleDateString()}</span>
                        </div>
                      </div>

                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#16a34a' }}>
                          {currentProfile.currencySymbol}{rec.amount.toLocaleString()}
                        </div>
                        <div style={{ fontSize: '0.725rem', color: '#64748b', marginTop: '0.1rem' }}>
                          {rec.paymentMethod}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 4: FAMILY IDENTITY GRAPH */}
          {activeTab === 'GRAPH' && (
            <FamilyIdentityGraph profile={currentProfile} />
          )}

        </section>

      </main>

      {/* 6. CONSOLIDATED MULTI-SCHOOL CHECKOUT MODAL */}
      <MultiSchoolCheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        profile={currentProfile}
        selectedFees={selectedFeesForCheckout}
        onPaymentSuccess={handlePaymentSuccess}
      />

    </div>
  );
};
