import React, { useState } from 'react';
import { 
  Code2, 
  Copy, 
  Check, 
  Globe, 
  Layout, 
  Smartphone, 
  ExternalLink, 
  ShieldCheck,
  CheckCircle2
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

  const schoolName = branding?.schoolName || 'CredResolve Partner Academy';
  const primaryColor = branding?.primaryColor || '#007ea8';
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
  style="width: 100%; min-height: 620px; border: 1px solid #cdcfd2; border-radius: 6px; box-shadow: 0 1px 3px rgba(0,0,0,0.08);" 
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
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* Top Banner */}
      <div className="sky-card" style={{ padding: '1.5rem 2rem' }}>
        <div className="flex-between" style={{ flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: 'var(--radius-sm)', background: 'var(--sky-color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ffffff' }}>
                <Code2 size={20} />
              </div>
              <div>
                <h2 className="sky-heading-2">
                  Website Payment Widget Builder (Zero-Code)
                </h2>
              </div>
              <span className="badge badge-success">Zero-Code Enablement</span>
            </div>
            <p style={{ color: 'var(--text-muted)', marginTop: '0.35rem', maxWidth: '750px', fontSize: '0.875rem', lineHeight: '1.5' }}>
              Enable parents to pay tuition and non-tuition fees directly on your existing school website (WordPress, Wix, Squarespace, Webflow, custom CMS) by simply entering their Roll Number or Mobile Number.
            </p>
          </div>

          <button
            className="sky-btn-primary"
            onClick={onNavigateQuickPay}
          >
            <Globe size={15} /> Open Parent Quick-Pay Portal
          </button>
        </div>
      </div>

      {/* Selector Row */}
      <div className="grid-cols-3">
        {[
          {
            id: 'INLINE',
            title: 'Inline Web Page Widget',
            desc: 'Embed directly into a school web page or portal via JavaScript or standard iframe.',
            badge: 'Most Popular'
          },
          {
            id: 'FLOATING',
            title: 'Floating Payment Button',
            desc: 'Floating bottom-right button that launches a sleek modal checkout window.',
            badge: 'Instant Setup'
          },
          {
            id: 'HOSTED',
            title: 'Hosted Dedicated Portal',
            desc: 'Dedicated school-branded URL for direct email, SMS, and portal linking.',
            badge: 'Direct Link'
          }
        ].map(card => {
          const isSelected = embedType === card.id;
          return (
            <div
              key={card.id}
              onClick={() => setEmbedType(card.id as any)}
              className="sky-card"
              style={{
                padding: '1.25rem',
                border: isSelected ? '2px solid var(--sky-color-primary)' : '1px solid var(--border-strong)',
                background: isSelected ? 'var(--sky-color-primary-light)' : 'var(--bg-card)',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}
            >
              <div>
                <div className="flex-between" style={{ marginBottom: '0.5rem' }}>
                  <span className="badge badge-info" style={{ fontSize: '0.65rem' }}>{card.badge}</span>
                  {isSelected && <span style={{ color: 'var(--sky-color-primary)', fontWeight: 700, fontSize: '0.8rem' }}>Active</span>}
                </div>
                <h4 className="sky-heading-4">
                  {card.title}
                </h4>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                  {card.desc}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Code Generator & Preview */}
      <div className="sky-card" style={{ padding: '1.5rem 2rem' }}>
        {embedType === 'INLINE' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div>
              <h3 className="sky-heading-3">
                Option A: Responsive Iframe Embed (Recommended)
              </h3>
              <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)', marginTop: '0.15rem' }}>
                Copy and paste this HTML snippet anywhere on your website page or CMS template.
              </p>
              <div style={{ position: 'relative', marginTop: '0.5rem' }}>
                <textarea
                  readOnly
                  rows={4}
                  value={inlineIframeCode}
                  style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', background: 'var(--bg-surface-subtle)' }}
                />
                <button
                  className="sky-btn-primary"
                  onClick={() => handleCopy(inlineIframeCode, 'iframe')}
                  style={{ position: 'absolute', right: '0.75rem', top: '0.75rem', padding: '0.35rem 0.75rem', fontSize: '0.75rem' }}
                >
                  {copiedKey === 'iframe' ? <Check size={13} /> : <Copy size={13} />}
                  <span>{copiedKey === 'iframe' ? 'Copied' : 'Copy Code'}</span>
                </button>
              </div>
            </div>

            <div>
              <h3 className="sky-heading-3">
                Option B: JavaScript Widget Script
              </h3>
              <div style={{ position: 'relative', marginTop: '0.5rem' }}>
                <textarea
                  readOnly
                  rows={4}
                  value={inlineScriptCode}
                  style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', background: 'var(--bg-surface-subtle)' }}
                />
                <button
                  className="sky-btn-primary"
                  onClick={() => handleCopy(inlineScriptCode, 'script')}
                  style={{ position: 'absolute', right: '0.75rem', top: '0.75rem', padding: '0.35rem 0.75rem', fontSize: '0.75rem' }}
                >
                  {copiedKey === 'script' ? <Check size={13} /> : <Copy size={13} />}
                  <span>{copiedKey === 'script' ? 'Copied' : 'Copy Code'}</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {embedType === 'FLOATING' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <h3 className="sky-heading-3">
              Floating 'Pay School Fees' Button Snippet
            </h3>
            <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)' }}>
              Add this script before the closing <code>&lt;/body&gt;</code> tag on any website page.
            </p>
            <div style={{ position: 'relative' }}>
              <textarea
                readOnly
                rows={3}
                value={floatingButtonCode}
                style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', background: 'var(--bg-surface-subtle)' }}
              />
              <button
                className="sky-btn-primary"
                onClick={() => handleCopy(floatingButtonCode, 'floating')}
                style={{ position: 'absolute', right: '0.75rem', top: '0.75rem', padding: '0.35rem 0.75rem', fontSize: '0.75rem' }}
              >
                {copiedKey === 'floating' ? <Check size={13} /> : <Copy size={13} />}
                <span>{copiedKey === 'floating' ? 'Copied' : 'Copy Snippet'}</span>
              </button>
            </div>
          </div>
        )}

        {embedType === 'HOSTED' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <h3 className="sky-heading-3">
              Direct School Portal URL
            </h3>
            <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)' }}>
              Share this dedicated payment link directly with parents in bills, emails, newsletters, or student portal navigations.
            </p>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <input
                type="text"
                readOnly
                value={hostedPortalUrl}
                style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem' }}
              />
              <button
                className="sky-btn-primary"
                onClick={() => handleCopy(hostedPortalUrl, 'hosted')}
              >
                {copiedKey === 'hosted' ? <Check size={14} /> : <Copy size={14} />}
                <span>{copiedKey === 'hosted' ? 'Copied' : 'Copy Link'}</span>
              </button>
              <button
                className="sky-btn-default"
                onClick={() => window.open(hostedPortalUrl, '_blank')}
              >
                <ExternalLink size={14} /> Open
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Live Interactive Preview */}
      <div className="sky-card" style={{ padding: 0, overflow: 'hidden' }}>
        <div className="sky-card-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Globe size={16} color="var(--sky-color-primary)" />
            <h4 className="sky-heading-3">Live Interactive Preview</h4>
          </div>
          <span className="badge badge-success">Simulated View</span>
        </div>

        <div style={{ padding: '1.5rem', background: 'var(--bg-surface-subtle)' }}>
          <ParentQuickPayPortal
            branding={branding}
            isEmbedded={true}
          />
        </div>
      </div>
    </div>
  );
};
