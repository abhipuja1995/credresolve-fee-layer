import React, { useState } from 'react';
import { 
  BookOpen, 
  Search, 
  Layers, 
  Code2, 
  Users, 
  Smartphone, 
  Palette, 
  ShieldCheck, 
  Check, 
  Copy, 
  ChevronRight, 
  Sparkles, 
  ArrowRight,
  Globe,
  Sliders
} from 'lucide-react';
import { SchoolBranding } from '../types/index.js';
import { ParentQuickPayPortal } from './ParentQuickPayPortal.js';

interface UserGuideViewProps {
  onNavigateTab: (tab: 'fees' | 'quickpay' | 'ledger') => void;
  onOpenBranding: () => void;
  branding?: SchoolBranding;
}

export const UserGuideView: React.FC<UserGuideViewProps> = ({
  onNavigateTab,
  onOpenBranding,
  branding
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeSection, setActiveSection] = useState<string>('widget');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [embedType, setEmbedType] = useState<'INLINE' | 'FLOATING' | 'HOSTED'>('INLINE');
  const [isFloatingModalOpen, setIsFloatingModalOpen] = useState(false);

  const schoolName = branding?.schoolName || 'Oakridge International Prep';
  const primaryColor = branding?.primaryColor || '#4f46e5';
  const baseUrl = window.location.origin;

  const handleCopyCode = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(id);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const sections = [
    { id: 'widget', title: '1. Zero-Code Website Widget (Embed)', icon: Code2 },
    { id: 'quickpay', title: '2. Parent Quick-Pay Lookup', icon: Globe },
    { id: 'fees', title: '3. Creating Universal Fees & Waivers', icon: Layers },
    { id: 'ledger', title: '4. Student Subledgers & Receipts', icon: Users },
    { id: 'branding', title: '5. Brand & Theme Customization', icon: Palette },
    { id: 'errors', title: '6. Troubleshooting & API Reference', icon: ShieldCheck }
  ];

  // Embed Code Snippets
  const inlineIframeCode = `<!-- CredResolve Zero-Code Fee Widget for ${schoolName} -->
<iframe 
  src="${baseUrl}/?view=quickpay" 
  style="width: 100%; min-height: 620px; border: 1px solid #e2e8f0; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.05);" 
  frameborder="0"
  allow="payment">
</iframe>`;

  const inlineScriptCode = `<!-- CredResolve Embedded Script Tag -->
<div id="credresolve-pay-container" data-school-id="bb-env-stjude-2026"></div>
<script 
  src="${baseUrl}/widget/credresolve-embed.js" 
  data-primary-color="${primaryColor}" 
  async>
</script>`;

  const floatingButtonCode = `<!-- Floating 'Pay Fees Online' Action Button -->
<script 
  src="${baseUrl}/widget/floating-pay-button.js" 
  data-button-text="Pay School Fees" 
  data-primary-color="${primaryColor}">
</script>`;

  const hostedPortalUrl = `${baseUrl}/?view=quickpay`;

  return (
    <div style={{ display: 'flex', gap: '2rem', alignItems: 'flex-start' }}>
      {/* Left Sidebar Table of Contents */}
      <div style={{ width: '290px', flexShrink: 0, position: 'sticky', top: '90px' }}>
        <div className="card-panel" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', color: 'var(--text-heading)' }}>
            <BookOpen size={18} color="var(--accent-primary)" />
            <h3 style={{ fontSize: '1rem', fontWeight: 800 }}>Integration & Guide</h3>
          </div>

          <div style={{ position: 'relative', marginBottom: '1rem' }}>
            <input
              type="text"
              placeholder="Search guides..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              style={{ padding: '0.45rem 0.65rem 0.45rem 2rem', fontSize: '0.8rem' }}
            />
            <Search size={14} color="var(--text-muted)" style={{ position: 'absolute', left: '0.65rem', top: '50%', transform: 'translateY(-50%)' }} />
          </div>

          <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
            {sections.map(sec => {
              const Icon = sec.icon;
              const isSelected = activeSection === sec.id;
              return (
                <button
                  key={sec.id}
                  onClick={() => setActiveSection(sec.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.6rem 0.75rem',
                    borderRadius: 'var(--radius-md)',
                    background: isSelected ? 'var(--accent-light)' : 'transparent',
                    color: isSelected ? 'var(--accent-primary)' : 'var(--text-body)',
                    fontWeight: isSelected ? 700 : 500,
                    fontSize: '0.825rem',
                    textAlign: 'left'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Icon size={15} color={isSelected ? 'var(--accent-primary)' : 'var(--text-muted)'} />
                    <span>{sec.title}</span>
                  </div>
                  {isSelected && <ChevronRight size={14} />}
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Main Content Area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
        
        {/* Section 1: Zero-Code Website Payment Widget Integration */}
        {(activeSection === 'widget' || searchQuery) && (
          <div className="card-panel" style={{ padding: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.75rem' }}>
              <div style={{ width: '38px', height: '38px', borderRadius: '8px', background: 'var(--accent-gradient)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Code2 size={22} color="#ffffff" />
              </div>
              <div>
                <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-heading)' }}>
                  1. Zero-Code Website Payment Widget Integration
                </h2>
              </div>
              <span className="badge badge-success">Zero-Code Embed</span>
            </div>

            <p style={{ color: 'var(--text-body)', lineHeight: '1.6', fontSize: '0.925rem', marginBottom: '1.5rem' }}>
              Schools can enable parents to look up and pay tuition and non-tuition fees directly on their existing website (WordPress, Wix, Squarespace, Webflow, custom HTML) with <strong>zero programming</strong>.
            </p>

            {/* Embed Mode Configurator */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '1.5rem' }}>
              {[
                { id: 'INLINE', title: 'Inline Card Embed', desc: 'Embeds inside your fee page' },
                { id: 'FLOATING', title: 'Floating Pay Button', desc: 'Bottom-right button with popover' },
                { id: 'HOSTED', title: 'Dedicated Hosted Link', desc: 'Standalone link for SMS/WhatsApp' }
              ].map(opt => {
                const isSel = embedType === opt.id;
                return (
                  <button
                    key={opt.id}
                    onClick={() => setEmbedType(opt.id as any)}
                    style={{
                      padding: '0.85rem 1rem',
                      borderRadius: 'var(--radius-md)',
                      border: isSel ? '2px solid var(--accent-primary)' : '1px solid var(--border-subtle)',
                      background: isSel ? 'var(--accent-light)' : 'var(--bg-surface-elevated)',
                      textAlign: 'left'
                    }}
                  >
                    <strong style={{ display: 'block', fontSize: '0.85rem', color: isSel ? 'var(--accent-primary)' : 'var(--text-heading)' }}>
                      {opt.title}
                    </strong>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{opt.desc}</span>
                  </button>
                );
              })}
            </div>

            {/* Copy-Paste Snippet Box */}
            <div style={{
              background: 'var(--bg-surface-elevated)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-md)',
              padding: '1.25rem',
              marginBottom: '1.75rem'
            }}>
              <div className="flex-between" style={{ marginBottom: '0.65rem' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-heading)' }}>
                  {embedType === 'INLINE' ? 'HTML / IFrame Snippet (For WordPress, Wix, Webflow)' : (embedType === 'FLOATING' ? 'Floating Button Script Tag' : 'Direct Shareable Payment URL')}
                </span>
                <button
                  className="btn-secondary"
                  onClick={() => {
                    const code = embedType === 'INLINE' ? inlineIframeCode : (embedType === 'FLOATING' ? floatingButtonCode : hostedPortalUrl);
                    handleCopyCode(code, 'embed_code');
                  }}
                  style={{ fontSize: '0.75rem', padding: '0.3rem 0.65rem' }}
                >
                  {copiedCode === 'embed_code' ? <Check size={12} color="var(--success)" /> : <Copy size={12} />}
                  {copiedCode === 'embed_code' ? 'Copied!' : 'Copy Code'}
                </button>
              </div>

              <pre style={{
                background: 'var(--bg-card)',
                padding: '0.85rem 1rem',
                borderRadius: 'var(--radius-sm)',
                fontSize: '0.775rem',
                fontFamily: 'var(--font-mono)',
                color: 'var(--text-heading)',
                overflowX: 'auto',
                border: '1px solid var(--border-subtle)'
              }}>
                {embedType === 'INLINE' ? inlineIframeCode : (embedType === 'FLOATING' ? floatingButtonCode : hostedPortalUrl)}
              </pre>

              <div style={{ display: 'flex', gap: '1rem', marginTop: '0.85rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                <span>✓ Works on WordPress (Custom HTML block)</span>
                <span>✓ Works on Wix (Embed HTML)</span>
                <span>✓ Works on Squarespace & Webflow</span>
              </div>
            </div>

            {/* Interactive Live Sandbox Preview */}
            <div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-heading)', marginBottom: '0.75rem' }}>
                Interactive Live School Website Sandbox
              </h3>
              <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
                Test how the widget functions on a simulated school website before embedding:
              </p>

              <div style={{
                borderRadius: 'var(--radius-lg)',
                border: '1px solid var(--border-strong)',
                overflow: 'hidden',
                boxShadow: 'var(--shadow-md)'
              }}>
                {/* Simulated Address Bar */}
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
                  <div style={{ flex: 1, background: 'var(--bg-card)', padding: '0.25rem 0.75rem', borderRadius: '4px', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    🔒 https://www.oakridge.edu/pay-fees
                  </div>
                </div>

                {/* Simulated Webpage Body */}
                <div style={{ padding: '1.5rem', background: 'var(--bg-page)', minHeight: '520px' }}>
                  {embedType === 'INLINE' && (
                    <ParentQuickPayPortal branding={branding} isEmbedded={true} initialQuery="BB-STU-101" />
                  )}

                  {embedType === 'FLOATING' && (
                    <div style={{ minHeight: '440px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                      <div style={{ padding: '1.5rem', background: 'var(--bg-card)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
                        <h4 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-heading)' }}>{schoolName} Homepage</h4>
                        <p style={{ color: 'var(--text-body)', marginTop: '0.5rem', fontSize: '0.875rem' }}>
                          Welcome to our academic portal. Parents can click the floating button at the bottom right to quickly settle school fees.
                        </p>
                      </div>

                      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '2rem' }}>
                        <button
                          onClick={() => setIsFloatingModalOpen(!isFloatingModalOpen)}
                          className="btn-primary"
                          style={{ borderRadius: '999px', padding: '0.75rem 1.25rem', fontSize: '0.9rem' }}
                        >
                          💳 Pay Fees Online
                        </button>
                      </div>

                      {isFloatingModalOpen && (
                        <div style={{
                          marginTop: '1rem',
                          background: 'var(--bg-card)',
                          borderRadius: '12px',
                          border: '1px solid var(--border-strong)',
                          padding: '1.25rem',
                          boxShadow: 'var(--shadow-lg)'
                        }}>
                          <div className="flex-between" style={{ marginBottom: '0.75rem' }}>
                            <strong>Quick Student Payment</strong>
                            <button onClick={() => setIsFloatingModalOpen(false)}>✕</button>
                          </div>
                          <ParentQuickPayPortal branding={branding} isEmbedded={true} initialQuery="BB-STU-101" />
                        </div>
                      )}
                    </div>
                  )}

                  {embedType === 'HOSTED' && (
                    <div style={{ textAlign: 'center', padding: '2.5rem' }}>
                      <Globe size={36} color="var(--accent-primary)" style={{ margin: '0 auto 1rem' }} />
                      <h4 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-heading)' }}>Dedicated Hosted Parent Portal</h4>
                      <p style={{ color: 'var(--text-body)', fontSize: '0.85rem', marginTop: '0.3rem' }}>{hostedPortalUrl}</p>
                      <button className="btn-primary" onClick={() => onNavigateTab('quickpay')} style={{ marginTop: '1rem' }}>
                        Open Live Portal
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Section 2: Parent Quick-Pay Lookup */}
        {(activeSection === 'quickpay' || searchQuery) && (
          <div className="card-panel" style={{ padding: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.75rem' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: 'var(--accent-gradient)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Globe size={20} color="#ffffff" />
              </div>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-heading)' }}>
                2. Parent Quick-Pay Self-Service Workflow
              </h2>
            </div>

            <p style={{ color: 'var(--text-body)', lineHeight: '1.6', fontSize: '0.925rem', marginBottom: '1.25rem' }}>
              Parents do not need usernames, passwords, or complex ERP registrations:
            </p>

            <ul style={{ paddingLeft: '1.25rem', color: 'var(--text-body)', lineHeight: '1.8', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
              <li><strong>Self-Service Identifier</strong>: Enter <strong>Student Roll Number / ID</strong> (e.g. <code>BB-STU-101</code>) or registered <strong>Mobile Phone Number</strong>.</li>
              <li><strong>Subledger Dues Calculation</strong>: Instantly fetches all assigned fee obligations with paid/unpaid balances.</li>
              <li><strong>Digital Waivers & Forms</strong>: Complete required fields (e.g. T-Shirt sizes, emergency contact numbers) and legal consent signatures before payment.</li>
              <li><strong>1-Click Payment</strong>: Settle with  Apple Pay, Google Pay, Credit/Debit Cards, or ACH Direct Debit with instant receipt issuance.</li>
            </ul>

            <button 
              className="btn-primary" 
              onClick={() => onNavigateTab('quickpay')}
              style={{ fontSize: '0.85rem' }}
            >
              Open Live Parent Quick-Pay View <ArrowRight size={15} />
            </button>
          </div>
        )}

        {/* Section 3: Creating Universal Fees & Waivers */}
        {(activeSection === 'fees' || searchQuery) && (
          <div className="card-panel" style={{ padding: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.75rem' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: 'var(--accent-gradient)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Layers size={20} color="#ffffff" />
              </div>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-heading)' }}>
                3. Creating Universal Fees & Dynamic Waivers
              </h2>
            </div>

            <p style={{ color: 'var(--text-body)', lineHeight: '1.6', fontSize: '0.925rem', marginBottom: '1.25rem' }}>
              Configure tuition and non-tuition fees mapped directly to Blackbaud General Ledger distribution accounts:
            </p>

            <div style={{ overflowX: 'auto', marginBottom: '1.5rem' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                <thead>
                  <tr style={{ background: 'var(--bg-surface-elevated)', borderBottom: '1px solid var(--border-subtle)' }}>
                    <th style={{ padding: '0.75rem 1rem', textAlign: 'left', fontWeight: 700 }}>Step</th>
                    <th style={{ padding: '0.75rem 1rem', textAlign: 'left', fontWeight: 700 }}>Field</th>
                    <th style={{ padding: '0.75rem 1rem', textAlign: 'left', fontWeight: 700 }}>Details</th>
                  </tr>
                </thead>
                <tbody>
                  <tr style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                    <td style={{ padding: '0.75rem 1rem', fontWeight: 700, color: 'var(--accent-primary)' }}>Step 1</td>
                    <td style={{ padding: '0.75rem 1rem', fontWeight: 600, color: 'var(--text-heading)' }}>Classification</td>
                    <td style={{ padding: '0.75rem 1rem', color: 'var(--text-body)' }}>Title, Amount, Due Date, and GL category from <code>GetFeeTypes</code>.</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                    <td style={{ padding: '0.75rem 1rem', fontWeight: 700, color: 'var(--accent-primary)' }}>Step 2</td>
                    <td style={{ padding: '0.75rem 1rem', fontWeight: 600, color: 'var(--text-heading)' }}>Dynamic Forms</td>
                    <td style={{ padding: '0.75rem 1rem', color: 'var(--text-body)' }}>Custom dropdowns, emergency contact inputs, and legal electronic waivers.</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                    <td style={{ padding: '0.75rem 1rem', fontWeight: 700, color: 'var(--accent-primary)' }}>Step 3</td>
                    <td style={{ padding: '0.75rem 1rem', fontWeight: 600, color: 'var(--text-heading)' }}>Audience</td>
                    <td style={{ padding: '0.75rem 1rem', color: 'var(--text-body)' }}>Target by Grade Level, Athletic Roster, or Whole School.</td>
                  </tr>
                  <tr>
                    <td style={{ padding: '0.75rem 1rem', fontWeight: 700, color: 'var(--accent-primary)' }}>Step 4</td>
                    <td style={{ padding: '0.75rem 1rem', fontWeight: 600, color: 'var(--text-heading)' }}>Auto-Inject</td>
                    <td style={{ padding: '0.75rem 1rem', color: 'var(--text-body)' }}>Posts chunked batches (≤ 500 records) to Blackbaud subledgers.</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <button 
              className="btn-primary" 
              onClick={() => onNavigateTab('fees')}
              style={{ fontSize: '0.85rem' }}
            >
              Go to Universal Fee Studio <ArrowRight size={15} />
            </button>
          </div>
        )}

        {/* Section 4: Student Subledgers & Receipts */}
        {(activeSection === 'ledger' || searchQuery) && (
          <div className="card-panel" style={{ padding: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.75rem' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: 'var(--accent-gradient)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Users size={20} color="#ffffff" />
              </div>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-heading)' }}>
                4. Student Subledgers & Reconciled Receipts
              </h2>
            </div>

            <p style={{ color: 'var(--text-body)', lineHeight: '1.6', fontSize: '0.925rem', marginBottom: '1.25rem' }}>
              Manage obligations, filter student rosters, and generate 1-click shareable payment links:
            </p>

            <ul style={{ paddingLeft: '1.25rem', color: 'var(--text-body)', lineHeight: '1.8', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
              <li><strong>1-Click Copy Link</strong>: Copy direct links (<code>/?chargeId=CHG-...</code>) to clipboard with single-row formatting.</li>
              <li><strong>Blackbaud Sync Stamp</strong>: Verifies settlement status against Blackbaud Billing Management.</li>
              <li><strong>Audit Receipts</strong>: Access official receipt numbers (<code>REC-XXXXXX</code>) and settlement audit logs.</li>
            </ul>

            <button 
              className="btn-secondary" 
              onClick={() => onNavigateTab('ledger')}
              style={{ fontSize: '0.85rem' }}
            >
              View Student Subledger Table
            </button>
          </div>
        )}

        {/* Section 5: Brand & Theme Customization */}
        {(activeSection === 'branding' || searchQuery) && (
          <div className="card-panel" style={{ padding: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.75rem' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: 'var(--accent-gradient)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Palette size={20} color="#ffffff" />
              </div>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-heading)' }}>
                5. Brand & Theme Customization
              </h2>
            </div>

            <p style={{ color: 'var(--text-body)', lineHeight: '1.6', fontSize: '0.925rem', marginBottom: '1.25rem' }}>
              Customize school logo crests, preset palettes (**Crisp Minimalist White**, **Classic Academic White**), and custom color tokens with live interactive previews.
            </p>

            <button 
              className="btn-primary" 
              onClick={onOpenBranding}
              style={{ fontSize: '0.85rem' }}
            >
              <Palette size={15} /> Customize School Branding
            </button>
          </div>
        )}

        {/* Section 6: Troubleshooting & Error Reference */}
        {(activeSection === 'errors' || searchQuery) && (
          <div className="card-panel" style={{ padding: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.75rem' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: 'var(--accent-gradient)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <ShieldCheck size={20} color="#ffffff" />
              </div>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-heading)' }}>
                6. Troubleshooting & API Reference
              </h2>
            </div>

            <div style={{ overflowX: 'auto', marginTop: '1rem' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                <thead>
                  <tr style={{ background: 'var(--bg-surface-elevated)', borderBottom: '1px solid var(--border-subtle)' }}>
                    <th style={{ padding: '0.75rem 1rem', textAlign: 'left', fontWeight: 700 }}>Code</th>
                    <th style={{ padding: '0.75rem 1rem', textAlign: 'left', fontWeight: 700 }}>Reason</th>
                    <th style={{ padding: '0.75rem 1rem', textAlign: 'left', fontWeight: 700 }}>Resolution</th>
                  </tr>
                </thead>
                <tbody>
                  <tr style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                    <td style={{ padding: '0.75rem 1rem', fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--danger-text)' }}>STUDENT_NOT_FOUND</td>
                    <td style={{ padding: '0.75rem 1rem', color: 'var(--text-body)' }}>Student ID not in Blackbaud SIS.</td>
                    <td style={{ padding: '0.75rem 1rem', color: 'var(--text-body)' }}>Verify student ID format or refresh roster.</td>
                  </tr>
                  <tr>
                    <td style={{ padding: '0.75rem 1rem', fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--danger-text)' }}>GL_ACCOUNT_INACTIVE</td>
                    <td style={{ padding: '0.75rem 1rem', color: 'var(--text-body)' }}>Distribution account closed.</td>
                    <td style={{ padding: '0.75rem 1rem', color: 'var(--text-body)' }}>Re-map fee category via <code>GetFeeTypes</code>.</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
