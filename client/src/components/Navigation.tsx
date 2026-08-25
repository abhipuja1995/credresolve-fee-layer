import React, { useState, useRef, useEffect } from 'react';
import { 
  Layers, 
  Users, 
  Settings,
  Palette,
  BookOpen,
  Grid,
  ChevronDown
} from 'lucide-react';
import { BlackbaudContext } from '../types/index.js';

export type ActiveTab = 'fees' | 'ledger' | 'guide';

interface NavigationProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  context: BlackbaudContext | null;
  onOpenBrandingModal: () => void;
}

export const Navigation: React.FC<NavigationProps> = ({
  activeTab,
  onTabChange,
  context,
  onOpenBrandingModal
}) => {
  const branding = context?.environment.branding;
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const settingsRef = useRef<HTMLDivElement>(null);

  // Close settings dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (settingsRef.current && !settingsRef.current.contains(event.target as Node)) {
        setIsSettingsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <header style={{
      position: 'sticky',
      top: 0,
      zIndex: 50,
      boxShadow: 'var(--shadow-md)',
      background: '#ffffff'
    }}>
      {/* Blackbaud SKY UX Omnibar (Top Bar) */}
      <div style={{
        background: 'var(--sky-color-navy)',
        color: '#ffffff',
        padding: '0.5rem 1.5rem',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
      }}>
        <div style={{
          maxWidth: '1440px',
          margin: '0 auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '0.75rem'
        }}>
          {/* Solution & Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
            <button
              title="Blackbaud Solution Switcher"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '32px',
                height: '32px',
                borderRadius: 'var(--radius-sm)',
                color: '#ffffff',
                background: 'rgba(255, 255, 255, 0.1)',
                border: 'none',
                cursor: 'pointer'
              }}
            >
              <Grid size={18} />
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              {branding?.logoUrl ? (
                <img
                  src={branding.logoUrl}
                  alt="School Logo"
                  style={{
                    width: '28px',
                    height: '28px',
                    borderRadius: 'var(--radius-sm)',
                    objectFit: 'cover',
                    border: '1px solid rgba(255, 255, 255, 0.2)'
                  }}
                />
              ) : (
                <div style={{
                  background: 'var(--sky-color-primary)',
                  width: '28px',
                  height: '28px',
                  borderRadius: 'var(--radius-sm)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 800,
                  fontSize: '0.9rem',
                  color: '#ffffff'
                }}>
                  CR
                </div>
              )}

              <div>
                <span style={{ fontSize: '1rem', fontWeight: 700, color: '#ffffff', letterSpacing: '-0.01em' }}>
                  {branding?.schoolName || 'CredResolve'}
                </span>
              </div>
            </div>
          </div>

          {/* Omnibar Right Actions & Settings Menu */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', flexWrap: 'wrap' }}>
            {/* Environment Badge */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              padding: '0.3rem 0.65rem',
              background: 'rgba(0, 0, 0, 0.35)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.75rem'
            }}>
              <span style={{
                display: 'inline-block',
                width: '7px',
                height: '7px',
                borderRadius: '50%',
                backgroundColor: '#22c55e'
              }} />
              <span style={{ color: 'rgba(255, 255, 255, 0.7)' }}>Env:</span>
              <span style={{ fontWeight: 600, color: '#ffffff' }}>
                {context?.environment.environmentId || 'Production'}
              </span>
            </div>

            {/* Settings Dropdown Button */}
            <div style={{ position: 'relative' }} ref={settingsRef}>
              <button
                onClick={() => setIsSettingsOpen(!isSettingsOpen)}
                style={{
                  fontSize: '0.8rem',
                  padding: '0.35rem 0.75rem',
                  background: isSettingsOpen ? 'rgba(255, 255, 255, 0.22)' : 'rgba(255, 255, 255, 0.12)',
                  color: '#ffffff',
                  borderRadius: 'var(--radius-sm)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  fontWeight: 600,
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  cursor: 'pointer'
                }}
              >
                <Settings size={14} color="#7dd3fc" />
                <span>Settings</span>
                <ChevronDown size={12} style={{ transform: isSettingsOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.15s ease' }} />
              </button>

              {/* Dropdown Menu */}
              {isSettingsOpen && (
                <div style={{
                  position: 'absolute',
                  right: 0,
                  top: '100%',
                  marginTop: '0.4rem',
                  width: '240px',
                  background: 'var(--bg-card)',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-strong)',
                  boxShadow: 'var(--shadow-modal)',
                  zIndex: 100,
                  overflow: 'hidden',
                  padding: '0.35rem 0'
                }}>
                  <div style={{
                    padding: '0.5rem 0.85rem',
                    borderBottom: '1px solid var(--border-subtle)',
                    fontSize: '0.7rem',
                    fontWeight: 700,
                    color: 'var(--text-muted)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.04em'
                  }}>
                    Configuration & Tools
                  </div>

                  <button
                    onClick={() => {
                      setIsSettingsOpen(false);
                      onOpenBrandingModal();
                    }}
                    style={{
                      width: '100%',
                      padding: '0.65rem 0.85rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.65rem',
                      fontSize: '0.825rem',
                      fontWeight: 600,
                      color: 'var(--text-heading)',
                      background: 'transparent',
                      textAlign: 'left',
                      cursor: 'pointer'
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-surface-subtle)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                  >
                    <Palette size={15} color="var(--sky-color-primary)" />
                    <div>
                      <div>Theme & Brand</div>
                      <div style={{ fontSize: '0.725rem', color: 'var(--text-muted)', fontWeight: 400 }}>
                        Customize colors, logos & typography
                      </div>
                    </div>
                  </button>

                  <button
                    onClick={() => {
                      setIsSettingsOpen(false);
                      onTabChange('guide');
                    }}
                    style={{
                      width: '100%',
                      padding: '0.65rem 0.85rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.65rem',
                      fontSize: '0.825rem',
                      fontWeight: 600,
                      color: 'var(--text-heading)',
                      background: 'transparent',
                      textAlign: 'left',
                      cursor: 'pointer'
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-surface-subtle)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                  >
                    <BookOpen size={15} color="var(--sky-color-primary)" />
                    <div>
                      <div>Document & Guide</div>
                      <div style={{ fontSize: '0.725rem', color: 'var(--text-muted)', fontWeight: 400 }}>
                        API reference, error codes & integration
                      </div>
                    </div>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Blackbaud SKY UX Tabset Bar */}
      <div style={{
        background: 'var(--bg-card)',
        borderBottom: '1px solid var(--border-strong)',
        padding: '0 1.5rem'
      }}>
        <div style={{
          maxWidth: '1440px',
          margin: '0 auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          overflowX: 'auto'
        }}>
          <nav style={{
            display: 'flex',
            gap: '1.5rem',
            marginBottom: '-1px'
          }}>
            <button
              onClick={() => onTabChange('fees')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.45rem',
                padding: '0.85rem 0.25rem',
                fontWeight: activeTab === 'fees' ? 700 : 500,
                fontSize: '0.9rem',
                background: 'transparent',
                color: activeTab === 'fees' ? 'var(--sky-color-primary)' : 'var(--text-body)',
                borderBottom: activeTab === 'fees' ? '3px solid var(--sky-color-primary)' : '3px solid transparent',
                borderRadius: 0,
                whiteSpace: 'nowrap',
                cursor: 'pointer'
              }}
            >
              <Layers size={16} color={activeTab === 'fees' ? 'var(--sky-color-primary)' : 'var(--text-muted)'} />
              Universal Fee Studio
            </button>

            <button
              onClick={() => onTabChange('ledger')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.45rem',
                padding: '0.85rem 0.25rem',
                fontWeight: activeTab === 'ledger' ? 700 : 500,
                fontSize: '0.9rem',
                background: 'transparent',
                color: activeTab === 'ledger' ? 'var(--sky-color-primary)' : 'var(--text-body)',
                borderBottom: activeTab === 'ledger' ? '3px solid var(--sky-color-primary)' : '3px solid transparent',
                borderRadius: 0,
                whiteSpace: 'nowrap',
                cursor: 'pointer'
              }}
            >
              <Users size={16} color={activeTab === 'ledger' ? 'var(--sky-color-primary)' : 'var(--text-muted)'} />
              Student Account Subledgers
            </button>

            {activeTab === 'guide' && (
              <button
                onClick={() => onTabChange('guide')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.45rem',
                  padding: '0.85rem 0.25rem',
                  fontWeight: 700,
                  fontSize: '0.9rem',
                  background: 'transparent',
                  color: 'var(--sky-color-primary)',
                  borderBottom: '3px solid var(--sky-color-primary)',
                  borderRadius: 0,
                  whiteSpace: 'nowrap',
                  cursor: 'pointer'
                }}
              >
                <BookOpen size={16} color="var(--sky-color-primary)" />
                Document & Guide
              </button>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
};
