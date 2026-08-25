import React, { useState } from 'react';
import { 
  BookOpen, 
  Search, 
  Layers, 
  Code2, 
  Users, 
  Palette, 
  ShieldCheck, 
  Check, 
  Copy, 
  ChevronRight, 
  ArrowRight,
  Globe,
  AlertTriangle,
  FileCode,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Terminal,
  Cpu,
  RefreshCw
} from 'lucide-react';
import { SchoolBranding } from '../types/index.js';

interface UserGuideViewProps {
  onNavigateTab: (tab: 'fees' | 'ledger') => void;
  onOpenBranding: () => void;
  branding?: SchoolBranding;
}

export const UserGuideView: React.FC<UserGuideViewProps> = ({
  onNavigateTab,
  onOpenBranding,
  branding
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeSection, setActiveSection] = useState<string>('architecture');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [embedType, setEmbedType] = useState<'INLINE' | 'FLOATING' | 'HOSTED'>('INLINE');

  const schoolName = branding?.schoolName || 'CredResolve Partner Academy';
  const primaryColor = branding?.primaryColor || '#007ea8';
  const baseUrl = window.location.origin;

  const handleCopyCode = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(id);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const sections = [
    { id: 'architecture', title: '1. Architecture & System Overview', icon: Cpu },
    { id: 'errors', title: '2. Error Catalog & Diagnostic Matrix', icon: AlertTriangle },
    { id: 'widget', title: '3. Zero-Code Website Widget (Embed)', icon: Code2 },
    { id: 'quickpay', title: '4. Parent Quick-Pay & Waiver Portal', icon: Globe },
    { id: 'fees', title: '5. Universal Fee Studio & GL Rules', icon: Layers },
    { id: 'ledger', title: '6. Subledgers, Receipts & Audit', icon: Users },
    { id: 'api_ref', title: '7. Blackbaud SKY API Reference', icon: Terminal },
    { id: 'bbms_checkout', title: '8. BBMS New Checkout Payments API', icon: ShieldCheck }
  ];

  // Embed Code Snippets
  const inlineIframeCode = `<!-- CredResolve Zero-Code Fee Widget for ${schoolName} -->
<iframe 
  src="${baseUrl}/?view=quickpay" 
  style="width: 100%; min-height: 640px; border: 1px solid #cdcfd2; border-radius: 6px; box-shadow: 0 1px 3px rgba(0,0,0,0.08);" 
  frameborder="0"
  allow="payment">
</iframe>`;

  const inlineScriptCode = `<!-- CredResolve Embeddable JavaScript SDK -->
<div id="credresolve-fee-widget" data-school-id="bb-env-2026"></div>
<script 
  src="${baseUrl}/widget/credresolve-embed.js" 
  data-primary-color="${primaryColor}" 
  data-school="${encodeURIComponent(schoolName)}"
  async>
</script>`;

  const floatingButtonCode = `<!-- Floating 'Pay School Fees' Button -->
<script 
  src="${baseUrl}/widget/floating-pay-button.js" 
  data-button-text="Pay School Fees" 
  data-primary-color="${primaryColor}">
</script>`;

  const hostedPortalUrl = `${baseUrl}/?view=quickpay`;

  return (
    <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'flex-start' }}>
      {/* Left Sidebar Table of Contents */}
      <div style={{ width: '290px', flexShrink: 0, position: 'sticky', top: '90px' }}>
        <div className="sky-card" style={{ padding: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', marginBottom: '0.85rem', color: 'var(--text-heading)' }}>
            <BookOpen size={16} color="var(--sky-color-primary)" />
            <h3 className="sky-heading-4">Technical Documentation</h3>
          </div>

          <div style={{ position: 'relative', marginBottom: '0.85rem' }}>
            <input
              type="text"
              placeholder="Search guide & errors..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              style={{ paddingLeft: '2rem' }}
            />
            <Search size={14} color="var(--text-muted)" style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)' }} />
          </div>

          <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
            {sections
              .filter(s => s.title.toLowerCase().includes(searchQuery.toLowerCase()))
              .map(sec => {
                const Icon = sec.icon;
                const isActive = activeSection === sec.id;
                return (
                  <button
                    key={sec.id}
                    onClick={() => setActiveSection(sec.id)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      padding: '0.5rem 0.65rem',
                      borderRadius: 'var(--radius-sm)',
                      background: isActive ? 'var(--sky-color-primary-light)' : 'transparent',
                      color: isActive ? 'var(--sky-color-primary)' : 'var(--text-body)',
                      fontWeight: isActive ? 700 : 500,
                      fontSize: '0.8rem',
                      textAlign: 'left',
                      width: '100%',
                      cursor: 'pointer'
                    }}
                  >
                    <Icon size={14} />
                    <span style={{ flex: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{sec.title}</span>
                    {isActive && <ChevronRight size={13} />}
                  </button>
                );
              })}
          </nav>
        </div>
      </div>

      {/* Main Documentation Body */}
      <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        
        {/* SECTION 1: Architecture & Overview */}
        {activeSection === 'architecture' && (
          <div className="sky-card" style={{ padding: '1.75rem 2rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Cpu size={20} color="var(--sky-color-primary)" />
                <h2 className="sky-heading-2">1. Architecture & System Overview</h2>
              </div>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginTop: '0.35rem', lineHeight: '1.6' }}>
                The <strong>CredResolve Universal Fee Wrapper</strong> provides an enterprise-grade abstraction layer over Blackbaud Education Management and Billing Management (SKY API <code>tms-bmapi/v1</code>). It bridges bespoke student fee generation, digital waiver collection, zero-code parent checkouts, and synchronous General Ledger subledger reconciliation.
              </p>
            </div>

            <div style={{
              background: 'var(--bg-surface-subtle)',
              border: '1px solid var(--border-strong)',
              borderRadius: 'var(--radius-sm)',
              padding: '1.25rem',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.75rem',
              lineHeight: '1.5',
              overflowX: 'auto',
              color: 'var(--text-heading)'
            }}>
{`+-----------------------------------------------------------------------------------+
|                           PARENT & PAYER TOUCHPOINTS                              |
|  [ School Website Widget ]     [ Parent Quick-Pay Link ]     [ Direct Charge URL ] |
+------------------------------------------+----------------------------------------+
                                           | HTTPS / 256-Bit Encrypted
                                           v
+-----------------------------------------------------------------------------------+
|                   CREDRESOLVE UNIVERSAL FEE WRAPPER ENGINE                        |
|                                                                                   |
|  1. Fee & Waiver Studio       2. Student Subledger Ledger   3. Multi-Channel Pay  |
|     - Custom Form Schemas        - Real-Time Balance           - Apple/Google Pay |
|     - Grade / Roster Audience    - Partial Installments        - Cards & ACH      |
|     - GL Account Mapping         - Receipt Generation          - Legal Signatures |
+------------------------------------------+----------------------------------------+
                                           | Synchronous Settlement / Async Batches
                                           v
+-----------------------------------------------------------------------------------+
|                        BLACKBAUD SKY API (tms-bmapi/v1)                           |
|                                                                                   |
|  [ GET /fee-types ]        [ POST /transaction-batches/import ]    [ Ledger Sync ]|
|  - Fee Type Catalog        - Asynchronous Payload Ingestion        - GL Journal   |
|  - GL Account Mapping      - Auto Backoff & Diagnostics            - Cash Posting |
+-----------------------------------------------------------------------------------+`}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div style={{ padding: '1rem', background: 'var(--bg-surface-subtle)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
                <h4 className="sky-heading-4" style={{ color: 'var(--sky-color-primary)', marginBottom: '0.35rem' }}>
                  Dual Ingestion Pipeline
                </h4>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-body)', lineHeight: '1.5' }}>
                  Large student charge rosters are decomposed into chunked batches (up to 250 records per chunk) and dispatched via Blackbaud's async batch import pipeline with live status polling.
                </p>
              </div>

              <div style={{ padding: '1rem', background: 'var(--bg-surface-subtle)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
                <h4 className="sky-heading-4" style={{ color: 'var(--sky-color-primary)', marginBottom: '0.35rem' }}>
                  Real-Time GL Subledger Settle
                </h4>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-body)', lineHeight: '1.5' }}>
                  When a parent completes payment, a synchronous journal entry is posted to the designated Blackbaud General Ledger chart of account with idempotency verification.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* SECTION 2: Comprehensive Error Catalog & Diagnostic Matrix */}
        {activeSection === 'errors' && (
          <div className="sky-card" style={{ padding: '1.75rem 2rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <AlertTriangle size={20} color="var(--warning)" />
                <h2 className="sky-heading-2">2. Error Catalog & Diagnostic Matrix</h2>
              </div>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginTop: '0.35rem', lineHeight: '1.6' }}>
                This diagnostic matrix outlines all standard HTTP status codes, Blackbaud SKY API error responses, and subledger operational failure modes encountered during fee creation, batch ingestion, and payer settlement.
              </p>
            </div>

            {/* HTTP Status Code Reference Table */}
            <div>
              <h3 className="sky-heading-3" style={{ marginBottom: '0.75rem' }}>
                HTTP Status Codes & Protocol Errors
              </h3>
              <div style={{ overflowX: 'auto' }}>
                <table className="sky-table">
                  <thead>
                    <tr>
                      <th style={{ width: '100px' }}>Status</th>
                      <th>Error Identifier</th>
                      <th>Root Cause Description</th>
                      <th>Automated Handling / Remediation</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td><span className="badge badge-danger">400</span></td>
                      <td><code>BAD_REQUEST</code></td>
                      <td>Malformed JSON payload, missing mandatory field (e.g. <code>title</code>, <code>bbFeeTypeId</code>), or invalid UUID.</td>
                      <td>Client displays inline form validation error. Check payload schema against Zod validator.</td>
                    </tr>
                    <tr>
                      <td><span className="badge badge-warning">401</span></td>
                      <td><code>UNAUTHORIZED</code></td>
                      <td>Missing or expired Blackbaud OAuth2 JWT bearer token, or invalid <code>bb-api-subscription-key</code>.</td>
                      <td>The server triggers token refresh cycle against Blackbaud OAuth auth server. If persistent, verify API credentials in environment.</td>
                    </tr>
                    <tr>
                      <td><span className="badge badge-warning">403</span></td>
                      <td><code>FORBIDDEN</code></td>
                      <td>API principal lacks <code>Billing Management - Administrator</code> permissions to post journal entries.</td>
                      <td>Audit Blackbaud SKY Developer Console application scopes and institutional environment role grants.</td>
                    </tr>
                    <tr>
                      <td><span className="badge badge-danger">404</span></td>
                      <td><code>NOT_FOUND</code></td>
                      <td>Target student record (<code>studentId</code>) or GL Account code does not exist in the active academic year database.</td>
                      <td>Verify student enrollment status and ensure General Ledger account code is active in <code>GetFeeTypes</code> catalog.</td>
                    </tr>
                    <tr>
                      <td><span className="badge badge-warning">409</span></td>
                      <td><code>CONFLICT_DUPLICATE</code></td>
                      <td>A charge with the same <code>clientReferenceId</code> or transaction idempotency key has already been posted.</td>
                      <td>Idempotency gate returns existing receipt without double-charging the parent account.</td>
                    </tr>
                    <tr>
                      <td><span className="badge badge-danger">422</span></td>
                      <td><code>UNPROCESSABLE_ENTITY</code></td>
                      <td>Business rule violation: payment amount is less than <code>minPartialAmount</code> or digital legal waiver unsigned.</td>
                      <td>Prompt payer to sign required waiver or adjust payment amount to meet minimum threshold.</td>
                    </tr>
                    <tr>
                      <td><span className="badge badge-warning">429</span></td>
                      <td><code>RATE_LIMIT_EXCEEDED</code></td>
                      <td>Exceeded Blackbaud SKY API quota threshold (10 requests/second burst, 25,000 requests/day).</td>
                      <td>Batch ingestion pipeline engages exponential backoff with jitter and retries up to 5 attempts.</td>
                    </tr>
                    <tr>
                      <td><span className="badge badge-danger">500 / 503</span></td>
                      <td><code>UPSTREAM_OUTAGE</code></td>
                      <td>Blackbaud SKY API service degradation or database maintenance window.</td>
                      <td>Queues charge locally in optimistic ledger and flags batch as <code>QUEUED</code> for automatic re-dispatch.</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Subledger Operational Failure Scenarios */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '0.5rem' }}>
              <h3 className="sky-heading-3">
                Subledger Diagnostic Scenarios & Runbook
              </h3>

              {/* Scenario 1 */}
              <div style={{ padding: '1rem 1.25rem', background: 'var(--bg-surface-subtle)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-strong)' }}>
                <div className="flex-between">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                    <XCircle size={16} color="var(--danger)" />
                    <strong style={{ color: 'var(--text-heading)', fontSize: '0.9rem' }}>
                      Diagnostic Scenario A: Invalid or Inactive GL Account Code
                    </strong>
                  </div>
                  <span className="badge badge-danger">Error: GL_ACCOUNT_INACTIVE</span>
                </div>
                <div style={{ marginTop: '0.5rem', fontSize: '0.8rem', color: 'var(--text-body)', lineHeight: '1.5' }}>
                  <strong>Symptom:</strong> Batch status shows <code>COMPLETED_WITH_ERRORS</code> with diagnostic message <code>"GL Account GL-3030-99 is not open for posting in FY26"</code>.<br />
                  <strong>Remediation:</strong> Navigate to <strong>Universal Fee Studio &gt; Fee Categories</strong>, select the category, and update the GL distribution account code to an active ledger code.
                </div>
              </div>

              {/* Scenario 2 */}
              <div style={{ padding: '1rem 1.25rem', background: 'var(--bg-surface-subtle)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-strong)' }}>
                <div className="flex-between">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                    <XCircle size={16} color="var(--warning)" />
                    <strong style={{ color: 'var(--text-heading)', fontSize: '0.9rem' }}>
                      Diagnostic Scenario B: Student Roll / Roster Unmapped
                    </strong>
                  </div>
                  <span className="badge badge-warning">Error: STUDENT_UNRESOLVED</span>
                </div>
                <div style={{ marginTop: '0.5rem', fontSize: '0.8rem', color: 'var(--text-body)', lineHeight: '1.5' }}>
                  <strong>Symptom:</strong> Parent search returns <code>"No student found matching query"</code>.<br />
                  <strong>Remediation:</strong> Confirm the student status is set to <code>ACTIVE</code> in the Education Management roster and that the student ID matches the Blackbaud core record ID.
                </div>
              </div>

              {/* Scenario 3 */}
              <div style={{ padding: '1rem 1.25rem', background: 'var(--bg-surface-subtle)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-strong)' }}>
                <div className="flex-between">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                    <XCircle size={16} color="var(--danger)" />
                    <strong style={{ color: 'var(--text-heading)', fontSize: '0.9rem' }}>
                      Diagnostic Scenario C: Electronic Signature Missing on Mandatory Waiver
                    </strong>
                  </div>
                  <span className="badge badge-danger">Error: WAIVER_SIGNATURE_REQUIRED</span>
                </div>
                <div style={{ marginTop: '0.5rem', fontSize: '0.8rem', color: 'var(--text-body)', lineHeight: '1.5' }}>
                  <strong>Symptom:</strong> Checkout button is disabled or returns 422 validation failure.<br />
                  <strong>Remediation:</strong> Payer must check the legal acknowledgement checkbox and input the parent/guardian full legal name prior to authorization.
                </div>
              </div>
            </div>

            {/* Standard RFC 7807 Error Response Sample */}
            <div>
              <h4 className="sky-heading-4" style={{ marginBottom: '0.35rem' }}>
                Standard JSON Error Payload Format (RFC 7807)
              </h4>
              <div style={{
                background: 'var(--bg-surface-subtle)',
                border: '1px solid var(--border-strong)',
                borderRadius: 'var(--radius-sm)',
                padding: '1rem',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.75rem',
                color: 'var(--text-heading)',
                overflowX: 'auto'
              }}>
{`{
  "type": "https://api.blackbaud.com/errors/invalid-gl-distribution",
  "title": "Invalid General Ledger Distribution Account",
  "status": 400,
  "detail": "The GL Account 'GL-3030-99' is not active for the 2026-2027 fiscal year.",
  "instance": "/api/blackbaud/transaction-batches/job-4821",
  "errorCode": "GL_ACCOUNT_INACTIVE",
  "timestamp": "2026-08-26T00:15:30.000Z",
  "invalidFields": [
    {
      "field": "glAccountCode",
      "rejectedValue": "GL-3030-99",
      "message": "Must match an active General Ledger chart of account code"
    }
  ]
}`}
              </div>
            </div>
          </div>
        )}

        {/* SECTION 3: Zero-Code Website Widget (Embed) */}
        {activeSection === 'widget' && (
          <div className="sky-card" style={{ padding: '1.75rem 2rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Code2 size={20} color="var(--sky-color-primary)" />
                <h2 className="sky-heading-2">3. Zero-Code Website Widget (Embed)</h2>
              </div>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginTop: '0.35rem', lineHeight: '1.6' }}>
                Embed parent payment capabilities directly onto existing school web properties (WordPress, Wix, Squarespace, Webflow, custom CMS) with zero backend code.
              </p>
            </div>

            {/* Embed Selector */}
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              {[
                { id: 'INLINE', label: 'Option A: Responsive Iframe Embed' },
                { id: 'FLOATING', label: 'Option B: Floating Action Button' },
                { id: 'HOSTED', label: 'Option C: Hosted Dedicated URL' }
              ].map(opt => (
                <button
                  key={opt.id}
                  onClick={() => setEmbedType(opt.id as any)}
                  className={embedType === opt.id ? 'sky-btn-primary' : 'sky-btn-default'}
                  style={{ fontSize: '0.8rem' }}
                >
                  {opt.label}
                </button>
              ))}
            </div>

            {embedType === 'INLINE' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <label>HTML Iframe Snippet</label>
                <div style={{ position: 'relative' }}>
                  <textarea
                    readOnly
                    rows={5}
                    value={inlineIframeCode}
                    style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', background: 'var(--bg-surface-subtle)' }}
                  />
                  <button
                    className="sky-btn-primary"
                    onClick={() => handleCopyCode(inlineIframeCode, 'iframe')}
                    style={{ position: 'absolute', right: '0.75rem', top: '0.75rem', padding: '0.35rem 0.75rem', fontSize: '0.75rem' }}
                  >
                    {copiedCode === 'iframe' ? <Check size={13} /> : <Copy size={13} />}
                    <span>{copiedCode === 'iframe' ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
              </div>
            )}

            {embedType === 'FLOATING' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <label>JavaScript Floating Button Script</label>
                <div style={{ position: 'relative' }}>
                  <textarea
                    readOnly
                    rows={4}
                    value={floatingButtonCode}
                    style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', background: 'var(--bg-surface-subtle)' }}
                  />
                  <button
                    className="sky-btn-primary"
                    onClick={() => handleCopyCode(floatingButtonCode, 'floating')}
                    style={{ position: 'absolute', right: '0.75rem', top: '0.75rem', padding: '0.35rem 0.75rem', fontSize: '0.75rem' }}
                  >
                    {copiedCode === 'floating' ? <Check size={13} /> : <Copy size={13} />}
                    <span>{copiedCode === 'floating' ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
              </div>
            )}

            {embedType === 'HOSTED' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <label>Dedicated Parent Portal URL</label>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <input
                    type="text"
                    readOnly
                    value={hostedPortalUrl}
                    style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem' }}
                  />
                  <button
                    className="sky-btn-primary"
                    onClick={() => handleCopyCode(hostedPortalUrl, 'hosted')}
                  >
                    {copiedCode === 'hosted' ? <Check size={14} /> : <Copy size={14} />}
                    <span>{copiedCode === 'hosted' ? 'Copied' : 'Copy Link'}</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* SECTION 4: Parent Quick-Pay & Waiver Portal */}
        {activeSection === 'quickpay' && (
          <div className="sky-card" style={{ padding: '1.75rem 2rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Globe size={20} color="var(--sky-color-primary)" />
                <h2 className="sky-heading-2">4. Parent Quick-Pay & Waiver Portal</h2>
              </div>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginTop: '0.35rem', lineHeight: '1.6' }}>
                Parents do not need to memorize passwords or login credentials. They perform an authenticated lookup using their student's <strong>Roll Number / ID</strong> (e.g. <code>BB-STU-101</code>) or their registered <strong>Mobile Phone</strong>.
              </p>
            </div>

            <div className="grid-cols-3">
              <div style={{ padding: '1rem', background: 'var(--bg-surface-subtle)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
                <strong style={{ color: 'var(--text-heading)', fontSize: '0.85rem', display: 'block', marginBottom: '0.25rem' }}>
                  1. Lookup & Obligation View
                </strong>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  Fetches active student accounts, balances, and due dates directly from the subledger.
                </p>
              </div>

              <div style={{ padding: '1rem', background: 'var(--bg-surface-subtle)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
                <strong style={{ color: 'var(--text-heading)', fontSize: '0.85rem', display: 'block', marginBottom: '0.25rem' }}>
                  2. Digital Legal Waiver
                </strong>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  Captures electronic consent, signer name, timestamps, and custom form details.
                </p>
              </div>

              <div style={{ padding: '1rem', background: 'var(--bg-surface-subtle)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
                <strong style={{ color: 'var(--text-heading)', fontSize: '0.85rem', display: 'block', marginBottom: '0.25rem' }}>
                  3. Multi-Method Checkout
                </strong>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  Supports Apple Pay, Google Pay, Credit Cards, and ACH with printable receipt generation.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* SECTION 5: Universal Fee Studio & GL Rules */}
        {activeSection === 'fees' && (
          <div className="sky-card" style={{ padding: '1.75rem 2rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Layers size={20} color="var(--sky-color-primary)" />
                <h2 className="sky-heading-2">5. Universal Fee Studio & GL Rules</h2>
              </div>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginTop: '0.35rem', lineHeight: '1.6' }}>
                Configure bespoke fees with dynamic form fields, grade-level roster targeting, and automated General Ledger account mapping.
              </p>
            </div>

            <div style={{ display: 'flex', gap: '0.65rem' }}>
              <button className="sky-btn-primary" onClick={() => onNavigateTab('fees')}>
                Launch Universal Fee Studio <ArrowRight size={14} />
              </button>
            </div>
          </div>
        )}

        {/* SECTION 6: Subledgers, Receipts & Audit */}
        {activeSection === 'ledger' && (
          <div className="sky-card" style={{ padding: '1.75rem 2rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Users size={20} color="var(--sky-color-primary)" />
                <h2 className="sky-heading-2">6. Subledgers, Receipts & Audit</h2>
              </div>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginTop: '0.35rem', lineHeight: '1.6' }}>
                Inspect student subledger balances, verify Blackbaud GL sync status, and generate official payment receipts with print and PDF support.
              </p>
            </div>

            <div style={{ display: 'flex', gap: '0.65rem' }}>
              <button className="sky-btn-primary" onClick={() => onNavigateTab('ledger')}>
                View Student Account Subledgers <ArrowRight size={14} />
              </button>
            </div>
          </div>
        )}

        {/* SECTION 7: Blackbaud SKY API Reference */}
        {activeSection === 'api_ref' && (
          <div className="sky-card" style={{ padding: '1.75rem 2rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Terminal size={20} color="var(--sky-color-primary)" />
                <h2 className="sky-heading-2">7. Blackbaud SKY API Reference (tms-bmapi/v1)</h2>
              </div>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginTop: '0.35rem', lineHeight: '1.6' }}>
                Specifications for endpoints used by the wrapper for catalog synchronization, batch ingestion, and payment settlement.
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {/* Endpoint 1 */}
              <div style={{ padding: '1rem', background: 'var(--bg-surface-subtle)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-strong)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span className="badge badge-info" style={{ fontWeight: 800 }}>GET</span>
                  <code style={{ fontWeight: 700, color: 'var(--text-heading)' }}>/api/blackbaud/fee-types</code>
                </div>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.35rem' }}>
                  Synchronizes Blackbaud Fee Types catalog, GL Account distribution codes, and default rates.
                </p>
              </div>

              {/* Endpoint 2 */}
              <div style={{ padding: '1rem', background: 'var(--bg-surface-subtle)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-strong)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span className="badge badge-success" style={{ fontWeight: 800 }}>POST</span>
                  <code style={{ fontWeight: 700, color: 'var(--text-heading)' }}>/api/blackbaud/transaction-batches/import</code>
                </div>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.35rem' }}>
                  Dispatches asynchronous roster charge batches to Blackbaud SKY API with exponential backoff and error tracking.
                </p>
              </div>

              {/* Endpoint 3 */}
              <div style={{ padding: '1rem', background: 'var(--bg-surface-subtle)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-strong)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span className="badge badge-success" style={{ fontWeight: 800 }}>POST</span>
                  <code style={{ fontWeight: 700, color: 'var(--text-heading)' }}>/api/student-charges/settle</code>
                </div>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.35rem' }}>
                  Captures parent payment, records digital waiver signature, and posts real-time subledger journal entry to Blackbaud GL.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* SECTION 8: BBMS Payments New Checkout Integration */}
        {activeSection === 'bbms_checkout' && (
          <div className="sky-card" style={{ padding: '1.75rem 2rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <ShieldCheck size={20} color="var(--sky-color-primary)" />
                <h2 className="sky-heading-2">8. Blackbaud Merchant Services (BBMS) - New Checkout Integration</h2>
              </div>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginTop: '0.35rem', lineHeight: '1.6' }}>
                Official integration guide for <strong>Blackbaud Merchant Services (BBMS) New Checkout</strong> via the SKY Payments API.
                Official Documentation: <a href="https://developer.blackbaud.com/skyapi/products/bbms/payments/integrations/new-checkout" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--sky-color-primary)', textDecoration: 'underline', fontWeight: 600 }}>developer.blackbaud.com/skyapi/products/bbms/payments/integrations/new-checkout</a>.
              </p>
            </div>

            {/* Architecture Card */}
            <div style={{
              background: 'var(--bg-surface-subtle)',
              border: '1px solid var(--border-strong)',
              borderRadius: 'var(--radius-sm)',
              padding: '1.25rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.75rem'
            }}>
              <h3 className="sky-heading-4" style={{ color: 'var(--sky-color-primary)' }}>
                New Checkout Security & PCI-DSS v4.0 Level 1 Tokenization Flow
              </h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-body)', lineHeight: '1.5' }}>
                1. The parent enters payment credentials (Apple Pay, Google Pay, Cards, ACH, PayPal/Venmo) into the secure Blackbaud New Checkout component.<br />
                2. Blackbaud tokenizes the payment instrument directly into a one-time <code>checkout_token</code>.<br />
                3. The frontend captures the <code>checkout_token</code> and dispatches it to the backend endpoint <code>POST /api/blackbaud/payments/checkout/transaction</code>.<br />
                4. The backend securely finalizes the payment against Blackbaud SKY Payments API with OAuth 2.0 credentials and immediately posts a synchronized General Ledger journal entry to the student's subledger.
              </p>
            </div>

            {/* Parameters Reference */}
            <div>
              <h3 className="sky-heading-3" style={{ marginBottom: '0.75rem' }}>
                Client-Side SDK Initialization Parameters
              </h3>
              <div style={{ overflowX: 'auto' }}>
                <table className="sky-table">
                  <thead>
                    <tr>
                      <th>Parameter</th>
                      <th>Type</th>
                      <th>Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td><code>key</code></td>
                      <td>String</td>
                      <td>Your Blackbaud SKY API Subscription Key.</td>
                    </tr>
                    <tr>
                      <td><code>payment_configuration_id</code></td>
                      <td>String</td>
                      <td>Identifier for the active Blackbaud Merchant Services (BBMS) gateway account.</td>
                    </tr>
                    <tr>
                      <td><code>amount</code></td>
                      <td>Number / String</td>
                      <td>Total transaction amount to process in USD/CAD/GBP/AUD.</td>
                    </tr>
                    <tr>
                      <td><code>use_complete_cover</code></td>
                      <td>Boolean</td>
                      <td>Enables Blackbaud Complete Cover™ fee coverage option for payers.</td>
                    </tr>
                    <tr>
                      <td><code>payment_methods</code></td>
                      <td>Array&lt;String&gt;</td>
                      <td><code>['card', 'apple_pay', 'google_pay', 'ach', 'paypal', 'venmo']</code></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Backend Settlement Endpoint Spec */}
            <div>
              <h3 className="sky-heading-3" style={{ marginBottom: '0.5rem' }}>
                Backend Settlement Contract (POST /payments/v1/checkout/transaction)
              </h3>
              <div style={{
                background: 'var(--bg-surface-subtle)',
                border: '1px solid var(--border-strong)',
                borderRadius: 'var(--radius-sm)',
                padding: '1rem',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.75rem',
                color: 'var(--text-heading)',
                overflowX: 'auto'
              }}>
{`// POST https://api.sky.blackbaud.com/payments/v1/checkout/transaction
// Headers: Authorization: Bearer {token}, Bb-Api-Subscription-Key: {key}
{
  "checkout_token": "chk_tok_991823a8fd_2026",
  "payment_configuration_id": "bbms_cfg_2026_live",
  "amount": 12500, // Cents
  "donor_email": "michael.hayes@example.com",
  "cardholder_name": "Michael Hayes",
  "custom_fields": {
    "student_id": "BB-STU-101",
    "fee_title": "8th Grade Washington D.C. Educational Tour",
    "gl_account_code": "GL-3030-40"
  }
}`}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
