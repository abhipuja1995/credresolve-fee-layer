import React, { useState } from 'react';
import { MultiSchoolParentProfile } from '../../types';
import {
  Users,
  Building,
  GraduationCap,
  CreditCard,
  Layers,
  Database,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Lock,
  Zap,
  Sparkles,
  Info
} from 'lucide-react';

interface FamilyIdentityGraphProps {
  profile: MultiSchoolParentProfile;
}

export const FamilyIdentityGraph: React.FC<FamilyIdentityGraphProps> = ({ profile }) => {
  const [selectedNode, setSelectedNode] = useState<'PARENT' | string>('PARENT');

  return (
    <div style={{ background: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '2rem', boxShadow: '0 4px 20px -4px rgba(0, 0, 0, 0.05)' }}>
      {/* Header Info */}
      <div className="flex-between" style={{ flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem', paddingBottom: '1.25rem', borderBottom: '1px solid #f1f5f9' }}>
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.45rem', background: '#eff6ff', color: '#0284c7', padding: '0.3rem 0.75rem', borderRadius: '30px', fontSize: '0.75rem', fontWeight: 800, letterSpacing: '0.04em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
            <Sparkles size={13} />
            <span>Strategic Moat &amp; Identity Architecture</span>
          </div>
          <h3 style={{ fontSize: '1.45rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
            Universal Family Identity Graph
          </h3>
          <p style={{ fontSize: '0.875rem', color: '#64748b', margin: '0.25rem 0 0 0' }}>
            The school ERP remains the <em>system of record</em>; CredResolve becomes the parent's unified <em>system of engagement</em>.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', padding: '0.6rem 1rem', borderRadius: '10px', textAlign: 'center' }}>
            <div style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 700 }}>CHILDREN</div>
            <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0284c7' }}>{profile.children.length}</div>
          </div>
          <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', padding: '0.6rem 1rem', borderRadius: '10px', textAlign: 'center' }}>
            <div style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 700 }}>PARTICIPATING SCHOOLS</div>
            <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#059669' }}>
              {new Set(profile.children.map(c => c.schoolId)).size}
            </div>
          </div>
          <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', padding: '0.6rem 1rem', borderRadius: '10px', textAlign: 'center' }}>
            <div style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 700 }}>ERP CONNECTORS</div>
            <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#7c3aed' }}>
              {profile.children.length} Live
            </div>
          </div>
        </div>
      </div>

      {/* Graph Visualizer Map */}
      <div style={{ background: 'linear-gradient(180deg, #f8fafc 0%, #f1f5f9 100%)', borderRadius: '14px', border: '1px solid #e2e8f0', padding: '2.5rem 1.5rem', position: 'relative', overflow: 'hidden' }}>
        
        {/* Layer 1: Universal Parent Node */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '2.5rem', position: 'relative' }}>
          <div
            onClick={() => setSelectedNode('PARENT')}
            style={{
              background: '#002238',
              color: '#ffffff',
              padding: '1.25rem 2rem',
              borderRadius: '16px',
              border: selectedNode === 'PARENT' ? '3px solid #38bdf8' : '1px solid #003354',
              boxShadow: '0 10px 25px -5px rgba(0, 34, 56, 0.3)',
              cursor: 'pointer',
              maxWidth: '420px',
              width: '100%',
              textAlign: 'center',
              position: 'relative',
              zIndex: 2,
              transition: 'all 0.2s ease'
            }}
          >
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', background: 'rgba(56, 189, 248, 0.15)', color: '#38bdf8', padding: '0.2rem 0.65rem', borderRadius: '20px', fontSize: '0.7rem', fontWeight: 800, marginBottom: '0.5rem' }}>
              <ShieldCheck size={12} />
              <span>UNIVERSAL DIGITAL IDENTITY (ANCHOR)</span>
            </div>
            <div style={{ fontSize: '1.2rem', fontWeight: 800 }}>{profile.parentName}</div>
            <div style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: '0.2rem' }}>
              {profile.parentPhone} • {profile.parentEmail}
            </div>
            <div style={{ marginTop: '0.75rem', paddingTop: '0.75rem', borderTop: '1px solid rgba(255, 255, 255, 0.1)', display: 'flex', justifyContent: 'space-around', fontSize: '0.725rem', color: '#cbd5e1' }}>
              <span>Single Sign-On (SSO)</span>
              <span>•</span>
              <span>Cross-School Ledger</span>
              <span>•</span>
              <span>1-Click Pay All</span>
            </div>
          </div>
        </div>

        {/* Downward Graph Connector Lines */}
        <div style={{ display: 'grid', gridTemplateColumns: `repeat(${profile.children.length}, 1fr)`, gap: '2rem', position: 'relative', zIndex: 2 }}>
          {profile.children.map((child, idx) => {
            const isSelected = selectedNode === child.studentId;
            return (
              <div key={child.studentId} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                
                {/* Child Node */}
                <div
                  onClick={() => setSelectedNode(child.studentId)}
                  style={{
                    background: '#ffffff',
                    borderRadius: '14px',
                    border: isSelected ? `2px solid ${child.schoolBadgeColor}` : '1px solid #cbd5e1',
                    padding: '1.25rem',
                    boxShadow: isSelected ? `0 8px 24px -4px ${child.schoolBadgeColor}40` : '0 4px 12px rgba(0,0,0,0.04)',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    position: 'relative'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: `${child.schoolBadgeColor}18`, color: child.schoolBadgeColor, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '1.1rem' }}>
                      {child.studentName.charAt(0)}
                    </div>
                    <div>
                      <div style={{ fontSize: '0.7rem', fontWeight: 800, color: child.schoolBadgeColor, textTransform: 'uppercase' }}>
                        CHILD #{idx + 1}
                      </div>
                      <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0f172a' }}>
                        {child.studentName}
                      </div>
                    </div>
                  </div>

                  <div style={{ fontSize: '0.775rem', color: '#64748b', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                    <div>Grade: <strong style={{ color: '#0f172a' }}>{child.grade}</strong> ({child.section || 'General'})</div>
                    <div>Student ID: <code style={{ background: '#f1f5f9', padding: '0.1rem 0.35rem', borderRadius: '4px', color: '#0284c7' }}>{child.studentId}</code></div>
                  </div>
                </div>

                {/* Arrow Connector */}
                <div style={{ textAlign: 'center', color: '#94a3b8' }}>
                  <ArrowRight size={18} style={{ transform: 'rotate(90deg)', margin: '0 auto' }} />
                </div>

                {/* School ERP Node */}
                <div style={{
                  background: '#ffffff',
                  borderRadius: '14px',
                  border: '1px solid #e2e8f0',
                  padding: '1.25rem',
                  borderLeft: `5px solid ${child.schoolBadgeColor}`,
                  boxShadow: '0 4px 12px rgba(0,0,0,0.03)'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
                    <Building size={16} color={child.schoolBadgeColor} />
                    <strong style={{ fontSize: '0.875rem', color: '#0f172a' }}>{child.schoolName}</strong>
                  </div>
                  <div style={{ fontSize: '0.725rem', color: '#64748b', marginBottom: '0.75rem' }}>
                    {child.schoolCity}
                  </div>

                  <div style={{ background: '#f8fafc', padding: '0.65rem 0.75rem', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '0.725rem' }}>
                    <div style={{ color: '#475569', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                      <Database size={12} color="#0284c7" />
                      <span>System of Record (ERP):</span>
                    </div>
                    <div style={{ color: '#0f172a', fontWeight: 600, marginTop: '0.2rem' }}>
                      {child.schoolErpSystem}
                    </div>
                  </div>

                  <div style={{ marginTop: '0.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.75rem', paddingTop: '0.6rem', borderTop: '1px solid #f1f5f9' }}>
                    <span style={{ color: '#64748b' }}>Outstanding Dues:</span>
                    <strong style={{ color: child.totalDue > 0 ? '#b45309' : '#16a34a' }}>
                      {profile.currencySymbol}{child.totalDue.toLocaleString()}
                    </strong>
                  </div>
                </div>

                {/* Arrow Connector */}
                <div style={{ textAlign: 'center', color: '#94a3b8' }}>
                  <ArrowRight size={18} style={{ transform: 'rotate(90deg)', margin: '0 auto' }} />
                </div>

                {/* Subledger & Gateway Node */}
                <div style={{
                  background: '#f8fafc',
                  borderRadius: '12px',
                  border: '1px dashed #cbd5e1',
                  padding: '1rem',
                  fontSize: '0.75rem'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#334155', fontWeight: 700, marginBottom: '0.35rem' }}>
                    <CreditCard size={13} color="#059669" />
                    <span>Cross-School Gateway Routing</span>
                  </div>
                  <div style={{ color: '#64748b' }}>
                    {child.fees[0]?.schoolGateway || 'Integrated Payment Routing'}
                  </div>
                  <div style={{ marginTop: '0.4rem', color: '#059669', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    <CheckCircle2 size={12} />
                    <span>Direct GL Auto-Reconciliation</span>
                  </div>
                </div>

              </div>
            );
          })}
        </div>

      </div>

      {/* Value Comparison Cards */}
      <div style={{ marginTop: '2rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.25rem' }}>
        <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', padding: '1.25rem', borderRadius: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#166534', fontWeight: 800, fontSize: '0.9rem', marginBottom: '0.35rem' }}>
            <Zap size={16} />
            <span>For the Parent</span>
          </div>
          <p style={{ fontSize: '0.8rem', color: '#14532d', margin: 0, lineHeight: 1.5 }}>
            No more switching between 2 or 3 separate portals, forgotten school passwords, or checking multiple WhatsApp groups. 1 unified login, 1 notification feed, and 1-click payment for the entire family.
          </p>
        </div>

        <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', padding: '1.25rem', borderRadius: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#1e40af', fontWeight: 800, fontSize: '0.9rem', marginBottom: '0.35rem' }}>
            <Layers size={16} />
            <span>For the Participating Schools</span>
          </div>
          <p style={{ fontSize: '0.8rem', color: '#1e3a8a', margin: 0, lineHeight: 1.5 }}>
            Schools keep their existing ERP, general ledger, and payment accounts untouched. CredResolve injects payment posting and digital compliance updates directly into each school's subledger in real time.
          </p>
        </div>
      </div>
    </div>
  );
};
