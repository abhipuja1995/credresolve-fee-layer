import React, { useState } from 'react';
import { 
  Code2, 
  Copy, 
  Check, 
  Globe, 
  Layout, 
  Smartphone, 
  ExternalLink, 
  Sparkles, 
  ShieldCheck,
  CheckCircle2,
  Sliders
} from 'lucide-react';
import { SchoolBranding } from '../types/index.js';
import { ParentQuickPayPortal } from './ParentQuickPayPortal.js';

interface WebsiteWidgetBuilderProps {
  branding?: SchoolBranding;
  onNavigateQuickPay: () => void;
}

export const WebsiteWidgetBuilder: React.FC<WebsiteWidgetBuilderProps> = ({
  branding,
  onNavigateQuickPay
}) => {
  const [embedType, setEmbedType] = useState<'INLINE' | 'FLOATING' | 'HOSTED'>('INLINE');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [isFloatingModalOpen, setIsFloatingModalOpen] = useState(false);

  const schoolName = branding?.schoolName || 'Oakridge International Prep';
  const primaryColor = branding?.primaryColor || '#4f46e5';
  const logoUrl = branding?.logoUrl;
  const baseUrl = window.location.origin;

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  // Embed Code Snippets
  const inlineScriptCode = `<!-- CredResolve Zero-Code Fee Widget for ${schoolName} -->
<div id="credresolve-fee-widget" data-school-id="bb-env-stjude-2026"></div>
<script 
  src="${baseUrl}/widget/credresolve-embed.js" 
  data-primary-color="${primaryColor}" 
  data-school="${encodeURIComponent(schoolName)}"
  async>
</script>`;

  const inlineIframeCode = `<!-- Responsive Embedded Payment Frame for ${schoolName} -->
<iframe 
  src="${baseUrl}/?view=embed" 
  style="width: 100%; min-height: 620px; border: 1px solid #e2e8f0; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.05);" 
  frameborder="0"
  allow="payment">
</iframe>`;

  const floatingButtonCode = `<!-- Floating 'Pay Fees Online' Button & Modal -->
<script 
  src="${baseUrl}/widget/floating-pay-button.js" 
  data-button-text="Pay School Fees" 
  data-primary-color="${primaryColor}">
</script>`;

  const hostedPortalUrl = `${baseUrl}/?view=quickpay`;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Top Banner */}
      <div className="card-panel" style={{ padding: '2rem', background: 'var(--accent-gradient-card)' }}>
        <div className="flex-between" style={{ flexWrap: 'wrap', gap: '1.5rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <div style={{ width: '38px', height: '38px', borderRadius: '8px', background: 'var(--accent-gradient)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Code2 size={22} color="#ffffff" />
              </div>
              <div>
                <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-heading)' }}>
                  Website Payment Widget Builder (Zero-Code)
                </h2>
              </div>
              <span className="badge badge-success">Zero-Code Enablement</span>
            </div>
            <p style={{ color: 'var(--text-body)', marginTop: '0.4rem', maxWidth: '750px', fontSize: '0.925rem', lineHeight: '1.5' }}>
              Enable parents to pay tuition and non-tuition fees directly on your existing school website (WordPress, Wix, Squarespace, Webflow, custom CMS) by simply entering their Roll Number or Mobile Number.
            </p>
          </div>

          <button
            className="btn-primary"
            onClick={onNavigateQuickPay}
            style={{ fontSize: '0.9rem' }}
          >
            <Globe size={16} /> Open Parent Quick-Pay Portal
          </button>
        </div>
      </div>

      {/* Embed Mode Selection & Live Sandbox Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '360px 1fr', gap: '1.5rem', alignItems: 'flex-start' }}>
        
        {/* Left Config Panel */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div className="card-panel" style={{ padding: '1.5rem' }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-heading)', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
              <Sliders size={18} color={primaryColor} />
              Widget Embed Mode
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
              {[
                {
                  id: 'INLINE',
                  title: 'Inline Card Embed',
                  desc: 'Embedded directly on your fee page or admissions portal.'
                },
                {
                  id: 'FLOATING',
                  title: 'Floating Pay Button',
                  desc: 'Bottom-right floating button with popover checkout modal.'
                },
                {
                  id: 'HOSTED',
                  title: 'Hosted Dedicated Portal',
                  desc: 'Standalone branded URL link for SMS, WhatsApp, and email.'
                }
              ].map(opt => {
                const isSelected = embedType === opt.id;
                return (
                  <button
                    key={opt.id}
                    onClick={() => setEmbedType(opt.id as any)}
                    style={{
                      padding: '1rem',
                      borderRadius: 'var(--radius-md)',
                      border: isSelected ? '2px solid var(--accent-primary)' : '1px solid var(--border-subtle)',
                      background: isSelected ? 'var(--accent-light)' : 'var(--bg-card)',
                      textAlign: 'left',
                      cursor: 'pointer'
                    }}
                  >
                    <strong style={{ display: 'block', fontSize: '0.9rem', color: isSelected ? 'var(--accent-primary)' : 'var(--text-heading)' }}>
                      {opt.title}
                    </strong>
                    <span style={{ fontSize: '0.775rem', color: 'var(--text-muted)', marginTop: '0.2rem', display: 'block' }}>
                      {opt.desc}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Copy-Paste Code Box */}
          <div className="card-panel" style={{ padding: '1.5rem' }}>
            <div className="flex-between" style={{ marginBottom: '0.65rem' }}>
              <h4 style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--text-heading)' }}>
                {embedType === 'INLINE' ? 'HTML / IFrame Snippet' : (embedType === 'FLOATING' ? 'Floating Button Script' : 'Direct Link')}
              </h4>
              <button
                className="btn-secondary"
                onClick={() => {
                  const code = embedType === 'INLINE' ? inlineIframeCode : (embedType === 'FLOATING' ? floatingButtonCode : hostedPortalUrl);
                  handleCopy(code, 'embed_code');
                }}
                style={{ fontSize: '0.75rem', padding: '0.25rem 0.55rem' }}
              >
                {copiedKey === 'embed_code' ? <Check size={13} color="var(--success)" /> : <Copy size={13} />}
                {copiedKey === 'embed_code' ? 'Copied!' : 'Copy Code'}
              </button>
            </div>

            <pre style={{
              background: 'var(--bg-surface-elevated)',
              padding: '0.85rem',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.75rem',
              fontFamily: 'var(--font-mono)',
              color: 'var(--text-heading)',
              overflowX: 'auto',
              border: '1px solid var(--border-subtle)'
            }}>
              {embedType === 'INLINE' ? inlineIframeCode : (embedType === 'FLOATING' ? floatingButtonCode : hostedPortalUrl)}
            </pre>

            <div style={{ marginTop: '0.85rem', fontSize: '0.75rem', color: 'var(--text-muted)', lineHeight: '1.4' }}>
              💡 <strong>How to install:</strong> Paste this snippet into WordPress (Custom HTML block), Wix, Squarespace (Embed element), or your website template.
            </div>
          </div>
        </div>

        {/* Right Panel: Simulated Live School Website Sandbox */}
        <div className="card-panel" style={{ padding: '0', overflow: 'hidden', border: '1px solid var(--border-strong)' }}>
          {/* Simulated Browser Address Bar */}
          <div style={{
            background: 'var(--bg-surface-elevated)',
            padding: '0.65rem 1rem',
            borderBottom: '1px solid var(--border-subtle)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem'
          }}>
            <div style={{ display: 'flex', gap: '0.35rem' }}>
              <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#ef4444', display: 'inline-block' }} />
              <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#f59e0b', display: 'inline-block' }} />
              <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#10b981', display: 'inline-block' }} />
            </div>

            <div style={{
              flex: 1,
              background: 'var(--bg-card)',
              padding: '0.3rem 0.85rem',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.775rem',
              color: 'var(--text-muted)',
              border: '1px solid var(--border-subtle)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <span>🔒 https://www.{schoolName.toLowerCase().replace(/[^a-z0-9]/g, '')}.edu/pay-fees</span>
              <span style={{ color: 'var(--success)', fontWeight: 600 }}>● Live Sandbox</span>
            </div>
          </div>

          {/* Simulated School Website Content */}
          <div style={{ padding: '1.75rem', background: '#fdfefe', minHeight: '640px', position: 'relative' }}>
            {/* School Web Header */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              borderBottom: '2px solid #e2e8f0',
              paddingBottom: '1rem',
              marginBottom: '1.5rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                {logoUrl ? (
                  <img src={logoUrl} alt="Logo" style={{ width: '36px', height: '36px', borderRadius: '6px', objectFit: 'cover' }} />
                ) : (
                  <div style={{ width: '34px', height: '34px', background: primaryColor, borderRadius: '6px', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800 }}>
                    {schoolName.charAt(0)}
                  </div>
                )}
                <div>
                  <h4 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a' }}>{schoolName}</h4>
                  <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Official School Portal</span>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '1rem', fontSize: '0.825rem', color: '#475569', fontWeight: 600 }}>
                <span>Academics</span>
                <span>Admissions</span>
                <span style={{ color: primaryColor, textDecoration: 'underline' }}>Online Payments</span>
                <span>Contact</span>
              </div>
            </div>

            {/* If INLINE Embed Mode */}
            {embedType === 'INLINE' && (
              <div>
                <div style={{ marginBottom: '1.25rem' }}>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a' }}>
                    Student Fee Payment & Quick Checkout
                  </h3>
                  <p style={{ fontSize: '0.85rem', color: '#475569', marginTop: '0.2rem' }}>
                    Parents can settle term fees, excursion trips, uniforms, and student dues securely online.
                  </p>
                </div>

                {/* The Embedded Widget Instance */}
                <div style={{
                  background: '#ffffff',
                  border: '1px solid #cbd5e1',
                  borderRadius: '12px',
                  padding: '1rem',
                  boxShadow: '0 4px 16px rgba(0,0,0,0.06)'
                }}>
                  <ParentQuickPayPortal branding={branding} isEmbedded={true} initialQuery="BB-STU-101" />
                </div>
              </div>
            )}

            {/* If FLOATING Button Embed Mode */}
            {embedType === 'FLOATING' && (
              <div style={{ minHeight: '480px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a' }}>
                    Welcome to {schoolName}
                  </h3>
                  <p style={{ fontSize: '0.9rem', color: '#475569', marginTop: '0.5rem', lineHeight: '1.6' }}>
                    Explore our vibrant academic curriculum, state-of-the-art STEM facilities, and extracurricular programs.
                  </p>
                  
                  <div style={{ padding: '2rem', background: '#f1f5f9', borderRadius: '10px', marginTop: '1.5rem', textAlign: 'center', color: '#64748b' }}>
                    [School Website Page Content: News, Events, Calendar, Athletics]
                  </div>
                </div>

                {/* Floating Action Button */}
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '2rem' }}>
                  <button
                    onClick={() => setIsFloatingModalOpen(!isFloatingModalOpen)}
                    style={{
                      background: `linear-gradient(135deg, ${primaryColor}, #7c3aed)`,
                      color: '#ffffff',
                      padding: '0.85rem 1.35rem',
                      borderRadius: '999px',
                      fontWeight: 700,
                      fontSize: '0.95rem',
                      boxShadow: '0 8px 20px rgba(79, 70, 229, 0.35)',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      cursor: 'pointer'
                    }}
                  >
                    💳 Pay Fees Online
                  </button>
                </div>

                {/* Floating Popover Modal */}
                {isFloatingModalOpen && (
                  <div style={{
                    position: 'absolute',
                    bottom: '80px',
                    right: '25px',
                    width: '440px',
                    maxHeight: '520px',
                    overflowY: 'auto',
                    background: '#ffffff',
                    borderRadius: '14px',
                    border: '1px solid #cbd5e1',
                    boxShadow: '0 12px 32px rgba(0,0,0,0.2)',
                    padding: '1.25rem',
                    zIndex: 20
                  }}>
                    <div className="flex-between" style={{ marginBottom: '0.75rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.5rem' }}>
                      <strong style={{ color: '#0f172a', fontSize: '0.95rem' }}>Quick Student Payment</strong>
                      <button onClick={() => setIsFloatingModalOpen(false)} style={{ color: '#64748b', fontWeight: 700 }}>✕</button>
                    </div>
                    <ParentQuickPayPortal branding={branding} isEmbedded={true} initialQuery="BB-STU-101" />
                  </div>
                )}
              </div>
            )}

            {/* If HOSTED Dedicated Portal Mode */}
            {embedType === 'HOSTED' && (
              <div style={{ textAlign: 'center', padding: '3rem 1.5rem' }}>
                <div style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '16px',
                  background: 'var(--accent-gradient)',
                  margin: '0 auto 1.5rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Globe size={32} color="#ffffff" />
                </div>

                <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0f172a' }}>
                  Dedicated Hosted Parent Portal
                </h3>
                <p style={{ color: '#475569', maxWidth: '480px', margin: '0.5rem auto 1.5rem', fontSize: '0.9rem' }}>
                  Share this standalone, high-converting payment URL directly with families via WhatsApp broadcasts, SMS campaigns, or billing reminder emails.
                </p>

                <div style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  background: '#f1f5f9',
                  padding: '0.65rem 1.25rem',
                  borderRadius: '8px',
                  border: '1px solid #cbd5e1',
                  fontSize: '0.875rem',
                  fontFamily: 'var(--font-mono)'
                }}>
                  <span>{hostedPortalUrl}</span>
                  <button
                    onClick={() => handleCopy(hostedPortalUrl, 'hosted_url')}
                    className="btn-secondary"
                    style={{ padding: '0.25rem 0.55rem', fontSize: '0.75rem' }}
                  >
                    {copiedKey === 'hosted_url' ? <Check size={12} color="var(--success)" /> : <Copy size={12} />}
                    {copiedKey === 'hosted_url' ? 'Copied' : 'Copy'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
