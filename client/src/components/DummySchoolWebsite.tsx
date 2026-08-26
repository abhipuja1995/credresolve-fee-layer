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
  Globe
} from 'lucide-react';
import { SchoolBranding } from '../types/index.js';

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

  const schoolName = branding?.schoolName || 'Oakridge International Prep';
  const primaryColor = branding?.primaryColor || '#007ea8';
  const logoUrl = branding?.logoUrl;

  const handleQuickPaySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNavigateToQuickPay(quickStudentLookup.trim() || undefined);
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
          padding: '1rem 1.5rem',
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
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', flexWrap: 'wrap' }}>
            <nav style={{ display: 'flex', gap: '1rem', fontSize: '0.875rem', fontWeight: 600, color: '#475569' }}>
              <span style={{ cursor: 'pointer', color: '#002238' }}>Academics</span>
              <span style={{ cursor: 'pointer' }}>Admissions</span>
              <span style={{ cursor: 'pointer' }}>Athletics</span>
              <span style={{ cursor: 'pointer' }}>Student Life</span>
            </nav>

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
                onClick={() => onNavigateToQuickPay()}
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
                <CreditCard size={17} color="var(--sky-color-primary)" />
                <span>Parent Quick-Pay Portal</span>
                <ArrowRight size={15} />
              </button>

              <button
                onClick={() => setActiveModalWidget('INLINE')}
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
                <Globe size={16} />
                <span>Launch Embedded Widget Preview</span>
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

      {/* Embedded Widget Simulator Modal */}
      {activeModalWidget && (
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
            borderRadius: '10px',
            width: '100%',
            maxWidth: '840px',
            maxHeight: '90vh',
            overflowY: 'auto',
            padding: '1.5rem',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
          }}>
            <div className="flex-between" style={{ marginBottom: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Globe size={18} color="var(--sky-color-primary)" />
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#002238', margin: 0 }}>
                  Embedded CredResolve Fee Widget Simulation
                </h3>
              </div>
              <button
                onClick={() => setActiveModalWidget(null)}
                style={{ background: 'none', border: 'none', fontSize: '1.25rem', cursor: 'pointer', color: '#64748b' }}
              >
                ✕
              </button>
            </div>

            <p style={{ fontSize: '0.825rem', color: '#64748b', marginBottom: '1.25rem' }}>
              This simulates the parent experience when the CredResolve widget is embedded directly within WordPress, Squarespace, Wix, or the school's LMS.
            </p>

            <div style={{ border: '1px solid #cbd5e1', borderRadius: '8px', padding: '1rem', background: '#f8fafc' }}>
              <iframe
                src={`${window.location.origin}/?view=quickpay`}
                style={{ width: '100%', height: '520px', border: 'none', borderRadius: '6px' }}
                title="School Payment Widget"
              />
            </div>
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
              <li style={{ cursor: 'pointer' }} onClick={() => onNavigateToQuickPay()}>Parent Quick-Pay Portal</li>
              <li style={{ cursor: 'pointer' }} onClick={() => onNavigateToQuickPay()}>Sponsor / Relative Payments</li>
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
