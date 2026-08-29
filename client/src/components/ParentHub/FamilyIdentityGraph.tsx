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
      <div className="flex-between" style={{ flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem', paddingBottom: '1rem', borderBottom: '1px solid var(--border-subtle)' }}>
        <div>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-heading)', margin: 0 }}>
            Family Identity Graph
          </h3>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <div style={{ background: 'var(--bg-surface-subtle)', border: '1px solid var(--border-subtle)', padding: '0.5rem 0.85rem', borderRadius: '8px', textAlign: 'center' }}>
            <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontWeight: 700 }}>CHILDREN</div>
            <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--sky-color-primary)' }}>{profile.children.length}</div>
          </div>
          <div style={{ background: 'var(--bg-surface-subtle)', border: '1px solid var(--border-subtle)', padding: '0.5rem 0.85rem', borderRadius: '8px', textAlign: 'center' }}>
            <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontWeight: 700 }}>PARTICIPATING SCHOOLS</div>
            <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--success)' }}>
              {new Set(profile.children.map(c => c.schoolId)).size}
            </div>
          </div>
          <div style={{ background: 'var(--bg-surface-subtle)', border: '1px solid var(--border-subtle)', padding: '0.5rem 0.85rem', borderRadius: '8px', textAlign: 'center' }}>
            <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontWeight: 700 }}>ERP CONNECTORS</div>
            <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#7c3aed' }}>
              {profile.children.length} Live
            </div>
          </div>
        </div>
      </div>

      {/* Graph Visualizer Map */}
      <div style={{ background: 'linear-gradient(180deg, #f8fafc 0%, #f1f5f9 100%)', borderRadius: '14px', border: '1px solid #e2e8f0', padding: '2rem 1.25rem', position: 'relative', overflow: 'hidden' }}>
        
        {/* Layer 1: Parent Node */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '2rem', position: 'relative' }}>
          <div
            onClick={() => setSelectedNode('PARENT')}
            style={{
              background: '#002238',
              color: '#ffffff',
              padding: '1.15rem 1.5rem',
              borderRadius: '14px',
              border: selectedNode === 'PARENT' ? '3px solid #38bdf8' : '1px solid #003354',
              boxShadow: '0 8px 20px -4px rgba(0, 34, 56, 0.3)',
              cursor: 'pointer',
              maxWidth: '380px',
              width: '100%',
              textAlign: 'center',
              position: 'relative',
              zIndex: 2,
              transition: 'all 0.2s ease'
            }}
          >
            <div style={{ fontSize: '1.1rem', fontWeight: 800 }}>{profile.parentName}</div>
            <div style={{ fontSize: '0.775rem', color: '#94a3b8', marginTop: '0.15rem' }}>
              {profile.parentPhone} • {profile.parentEmail}
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
    </div>
  );
};
