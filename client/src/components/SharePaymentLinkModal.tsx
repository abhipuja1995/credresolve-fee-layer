import React, { useState } from 'react';
import { 
  X, 
  Copy, 
  Check, 
  Share2, 
  MessageSquare, 
  Mail, 
  Smartphone, 
  Code2, 
  ExternalLink,
  QrCode
} from 'lucide-react';

interface SharePaymentLinkModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  studentId?: string;
  chargeId?: string;
  schoolName?: string;
}

export const SharePaymentLinkModal: React.FC<SharePaymentLinkModalProps> = ({
  isOpen,
  onClose,
  title = 'Parent Quick-Pay Portal',
  studentId,
  chargeId,
  schoolName = 'CredResolve Partner Academy'
}) => {
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedEmbed, setCopiedEmbed] = useState(false);
  const [activeShareTab, setActiveShareTab] = useState<'link' | 'social' | 'embed' | 'qr'>('link');

  if (!isOpen) return null;

  const baseUrl = window.location.origin;
  let shareUrl = `${baseUrl}/?view=quickpay`;
  if (chargeId) {
    shareUrl = `${baseUrl}/?chargeId=${chargeId}`;
  } else if (studentId) {
    shareUrl = `${baseUrl}/?view=quickpay&studentId=${studentId}`;
  }

  const shareText = `Pay school fees, sign digital waivers, and view dues for ${schoolName} securely online: ${shareUrl}`;
  const embedCode = `<iframe src="${shareUrl}" width="100%" height="700px" style="border:1px solid #cdcfd2; border-radius:6px; box-shadow: 0 1px 3px rgba(0,0,0,0.08);" title="${title}"></iframe>`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handleCopyEmbed = () => {
    navigator.clipboard.writeText(embedCode);
    setCopiedEmbed(true);
    setTimeout(() => setCopiedEmbed(false), 2500);
  };

  const handleWhatsApp = () => {
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`, '_blank');
  };

  const handleEmail = () => {
    const subject = encodeURIComponent(`${schoolName} - School Fee Payment & Waiver Link`);
    const body = encodeURIComponent(`Dear Parent,\n\nPlease use the following link to review student dues, sign required excursion/activity waivers, and make fee payments securely:\n\n${shareUrl}\n\nThank you,\n${schoolName}`);
    window.open(`mailto:?subject=${subject}&body=${body}`, '_blank');
  };

  const handleSMS = () => {
    window.open(`sms:?body=${encodeURIComponent(shareText)}`, '_blank');
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0, 34, 56, 0.65)',
      backdropFilter: 'blur(4px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 120,
      padding: '1.5rem'
    }}>
      <div className="sky-card" style={{
        width: '100%',
        maxWidth: '560px',
        padding: 0,
        overflow: 'hidden',
        boxShadow: 'var(--shadow-modal)'
      }}>
        {/* Header */}
        <div className="sky-card-header" style={{ padding: '1.15rem 1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <Share2 size={18} color="var(--sky-color-primary)" />
            <div>
              <h3 className="sky-heading-2">Share Payment Link</h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.15rem' }}>
                Distribute payment & waiver links to parents via email, SMS, or embeds.
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            style={{ color: 'var(--text-muted)', fontSize: '1.25rem', fontWeight: 700 }}
          >
            ✕
          </button>
        </div>

        {/* Tab Navigation */}
        <div style={{
          display: 'flex',
          borderBottom: '1px solid var(--border-subtle)',
          background: 'var(--bg-surface-subtle)',
          padding: '0 1rem'
        }}>
          {[
            { id: 'link', label: 'Direct Link', icon: Share2 },
            { id: 'social', label: 'SMS & Email', icon: MessageSquare },
            { id: 'embed', label: 'HTML Embed', icon: Code2 },
            { id: 'qr', label: 'QR Code', icon: QrCode }
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeShareTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveShareTab(tab.id as any)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  padding: '0.75rem 0.85rem',
                  fontSize: '0.8rem',
                  fontWeight: isActive ? 700 : 500,
                  color: isActive ? 'var(--sky-color-primary)' : 'var(--text-muted)',
                  borderBottom: isActive ? '3px solid var(--sky-color-primary)' : '3px solid transparent',
                  background: 'transparent',
                  cursor: 'pointer'
                }}
              >
                <Icon size={14} />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Body Content */}
        <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {activeShareTab === 'link' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              <label>
                Payment Link URL
              </label>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <input
                  type="text"
                  readOnly
                  value={shareUrl}
                  style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem' }}
                />
                <button
                  className="sky-btn-primary"
                  onClick={handleCopyLink}
                  style={{ padding: '0.5rem 0.95rem' }}
                >
                  {copiedLink ? <Check size={14} /> : <Copy size={14} />}
                  <span>{copiedLink ? 'Copied' : 'Copy'}</span>
                </button>
              </div>

              <div style={{ padding: '0.75rem 1rem', background: 'var(--bg-surface-subtle)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-strong)', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Parents can open this link directly to sign digital waivers and pay through Apple Pay, Google Pay, credit cards, or ACH.
              </div>
            </div>
          )}

          {activeShareTab === 'social' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <button
                className="sky-btn-default"
                onClick={handleWhatsApp}
                style={{ padding: '0.75rem 1rem', justifyContent: 'flex-start', gap: '0.75rem', width: '100%' }}
              >
                <MessageSquare size={16} color="#25D366" />
                <div style={{ textAlign: 'left' }}>
                  <div style={{ fontWeight: 700, color: 'var(--text-heading)' }}>Share via WhatsApp</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Send payment notification directly via WhatsApp</div>
                </div>
              </button>

              <button
                className="sky-btn-default"
                onClick={handleEmail}
                style={{ padding: '0.75rem 1rem', justifyContent: 'flex-start', gap: '0.75rem', width: '100%' }}
              >
                <Mail size={16} color="var(--sky-color-primary)" />
                <div style={{ textAlign: 'left' }}>
                  <div style={{ fontWeight: 700, color: 'var(--text-heading)' }}>Share via Email Client</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Draft pre-filled email to send to student guardians</div>
                </div>
              </button>

              <button
                className="sky-btn-default"
                onClick={handleSMS}
                style={{ padding: '0.75rem 1rem', justifyContent: 'flex-start', gap: '0.75rem', width: '100%' }}
              >
                <Smartphone size={16} color="var(--warning)" />
                <div style={{ textAlign: 'left' }}>
                  <div style={{ fontWeight: 700, color: 'var(--text-heading)' }}>Share via SMS</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Open SMS composer on mobile devices</div>
                </div>
              </button>
            </div>
          )}

          {activeShareTab === 'embed' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <label>
                HTML iframe Embed Code
              </label>
              <textarea
                readOnly
                rows={3}
                value={embedCode}
                style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', background: 'var(--bg-surface-subtle)' }}
              />
              <button
                className="sky-btn-primary"
                onClick={handleCopyEmbed}
                style={{ alignSelf: 'flex-start' }}
              >
                {copiedEmbed ? <Check size={14} /> : <Copy size={14} />}
                <span>{copiedEmbed ? 'Embed Code Copied!' : 'Copy Embed Code'}</span>
              </button>
            </div>
          )}

          {activeShareTab === 'qr' && (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', padding: '1rem 0' }}>
              <div style={{
                background: '#ffffff',
                padding: '1.25rem',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--border-strong)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(shareUrl)}`}
                  alt="Payment QR Code"
                  style={{ width: '180px', height: '180px' }}
                />
              </div>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textAlign: 'center' }}>
                Scan to open the Quick-Pay & Waiver Checkout Portal on mobile
              </span>
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{
          padding: '0.85rem 1.5rem',
          background: 'var(--bg-surface-subtle)',
          borderTop: '1px solid var(--border-subtle)',
          display: 'flex',
          justifyContent: 'flex-end'
        }}>
          <button className="sky-btn-default" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
