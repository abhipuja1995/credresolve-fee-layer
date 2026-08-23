import React from 'react';
import { 
  Sparkles, 
  Layers, 
  Users, 
  ShieldCheck,
  Palette,
  BookOpen,
  Globe,
  Share2
} from 'lucide-react';
import { BlackbaudContext } from '../types/index.js';

export type ActiveTab = 'fees' | 'ledger' | 'guide';

interface NavigationProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  context: BlackbaudContext | null;
  onOpenBrandingModal: () => void;
  onOpenShareModal?: () => void;
}

export const Navigation: React.FC<NavigationProps> = ({
  activeTab,
  onTabChange,
  context,
  onOpenBrandingModal,
  onOpenShareModal
}) => {
  const branding = context?.environment.branding;

  return (
    <header style={{
      borderBottom: '1px solid var(--border-subtle)',
      background: 'var(--bg-nav)',
      backdropFilter: 'blur(16px)',
      position: 'sticky',
      top: 0,
      zIndex: 50,
      boxShadow: 'var(--shadow-sm)'
    }}>
      <div className="container" style={{ padding: '0.85rem 2rem' }}>
        <div className="flex-between" style={{ flexWrap: 'wrap', gap: '1rem' }}>
          {/* Logo & Platform Info */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
            {branding?.logoUrl ? (
              <img
                src={branding.logoUrl}
                alt="School Logo"
                style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: 'var(--radius-md)',
                  objectFit: 'cover',
                  border: '1px solid var(--border-subtle)',
                  boxShadow: 'var(--shadow-sm)'
                }}
              />
            ) : (
              <div style={{
                background: 'var(--accent-gradient)',
                width: '40px',
                height: '40px',
                borderRadius: 'var(--radius-md)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 2px 8px rgba(79, 70, 229, 0.25)'
              }}>
                <Sparkles size={20} color="#ffffff" />
              </div>
            )}

            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <h1 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-heading)' }}>
                  {branding?.schoolName || 'CredResolve'}
                </h1>
                <span style={{
                  fontSize: '0.7rem',
                  fontWeight: 700,
                  background: 'var(--accent-light)',
                  color: 'var(--accent-primary)',
                  padding: '0.15rem 0.5rem',
                  borderRadius: 'var(--radius-full)',
                  border: '1px solid var(--border-accent)'
                }}>
                  Universal Fee Layer
                </span>
              </div>
            </div>
          </div>

          {/* Connection State, Share Link, & Branding Button */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', flexWrap: 'wrap' }}>
            {onOpenShareModal && (
              <button
                onClick={onOpenShareModal}
                className="btn-primary"
                style={{
                  fontSize: '0.825rem',
                  padding: '0.45rem 0.85rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem'
                }}
              >
                <Share2 size={15} />
                <span>Share Payment Link</span>
              </button>
            )}

            <button
              onClick={onOpenBrandingModal}
              className="btn-secondary"
              style={{
                fontSize: '0.825rem',
                padding: '0.45rem 0.85rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.45rem'
              }}
            >
              <Palette size={15} color="var(--accent-primary)" />
              <span style={{ fontWeight: 600 }}>Brand & Theme</span>
            </button>

            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.45rem',
              padding: '0.45rem 0.85rem',
              background: 'var(--bg-surface-elevated)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-full)',
              fontSize: '0.8rem'
            }}>
              <ShieldCheck size={16} color="var(--success)" />
              <span style={{ color: 'var(--text-muted)' }}>Environment:</span>
              <span style={{ fontWeight: 600, color: 'var(--text-heading)' }}>
                {context?.environment.environmentId || 'Connecting...'}
              </span>
              <span className="badge badge-success" style={{ fontSize: '0.65rem', padding: '0.15rem 0.45rem' }}>
                SKY API Ready
              </span>
            </div>
          </div>
        </div>

        {/* Navigation Tabs (Admin Views) */}
        <nav style={{
          display: 'flex',
          gap: '0.5rem',
          marginTop: '1rem',
          borderTop: '1px solid var(--border-subtle)',
          paddingTop: '0.65rem',
          overflowX: 'auto'
        }}>
          <button
            onClick={() => onTabChange('fees')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.45rem',
              padding: '0.5rem 1rem',
              borderRadius: 'var(--radius-md)',
              fontWeight: 600,
              fontSize: '0.875rem',
              background: activeTab === 'fees' ? 'var(--accent-gradient)' : 'transparent',
              color: activeTab === 'fees' ? '#ffffff' : 'var(--text-body)',
              boxShadow: activeTab === 'fees' ? 'var(--shadow-sm)' : 'none',
              whiteSpace: 'nowrap'
            }}
          >
            <Layers size={16} />
            Universal Fee Studio
          </button>

          <button
            onClick={() => onTabChange('ledger')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.45rem',
              padding: '0.5rem 1rem',
              borderRadius: 'var(--radius-md)',
              fontWeight: 600,
              fontSize: '0.875rem',
              background: activeTab === 'ledger' ? 'var(--accent-gradient)' : 'transparent',
              color: activeTab === 'ledger' ? '#ffffff' : 'var(--text-body)',
              boxShadow: activeTab === 'ledger' ? 'var(--shadow-sm)' : 'none',
              whiteSpace: 'nowrap'
            }}
          >
            <Users size={16} />
            Student Account Subledgers
          </button>

          <button
            onClick={() => onTabChange('guide')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.45rem',
              padding: '0.5rem 1rem',
              borderRadius: 'var(--radius-md)',
              fontWeight: 600,
              fontSize: '0.875rem',
              background: activeTab === 'guide' ? 'var(--accent-gradient)' : 'transparent',
              color: activeTab === 'guide' ? '#ffffff' : 'var(--text-body)',
              boxShadow: activeTab === 'guide' ? 'var(--shadow-sm)' : 'none',
              whiteSpace: 'nowrap',
              marginLeft: 'auto'
            }}
          >
            <BookOpen size={16} />
            User Guide & Docs
          </button>
        </nav>
      </div>
    </header>
  );
};
