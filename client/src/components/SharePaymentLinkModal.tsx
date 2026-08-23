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
  QrCode,
  Sparkles
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
  schoolName = 'Oakridge International Prep'
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
  const embedCode = `<iframe src="${shareUrl}" width="100%" height="700px" style="border:none; border-radius:12px; box-shadow: 0 4px 20px rgba(0,0,0,0.08);" title="${title}"></iframe>`;

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
      background: 'rgba(0, 0, 0, 0.65)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 120,
      padding: '1.5rem'
    }}>
      <div className="card-panel" style={{
        width: '100%',
        maxWidth: '560px',
        padding: '2rem',
        background: 'var(--bg-card)',
        border: '1px solid var(--border-strong)',
        boxShadow: 'var(--shadow-lg)'
      }}>
        <div className="flex-between" style={{ marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '8px',
              background: 'var(--accent-gradient)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Share2 size={18} color="#ffffff" />
            </div>
            <div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-heading)' }}>
                Share Digital Payment Link
              </h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Send directly to parents via digital channels or embed on school portals
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            style={{ color: 'var(--text-muted)', fontSize: '1.25rem', fontWeight: 700 }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Share Tabs */}
        <div style={{
          display: 'flex',
          gap: '0.5rem',
          marginBottom: '1.5rem',
          borderBottom: '1px solid var(--border-subtle)',
          paddingBottom: '0.75rem'
        }}>
          <button
            onClick={() => setActiveShareTab('link')}
            className={activeShareTab === 'link' ? 'btn-primary' : 'btn-secondary'}
            style={{ fontSize: '0.8rem', padding: '0.4rem 0.85rem' }}
          >
            Direct Link
          </button>
          <button
            onClick={() => setActiveShareTab('social')}
            className={activeShareTab === 'social' ? 'btn-primary' : 'btn-secondary'}
            style={{ fontSize: '0.8rem', padding: '0.4rem 0.85rem' }}
          >
            WhatsApp / SMS / Email
          </button>
          <button
            onClick={() => setActiveShareTab('embed')}
            className={activeShareTab === 'embed' ? 'btn-primary' : 'btn-secondary'}
            style={{ fontSize: '0.8rem', padding: '0.4rem 0.85rem' }}
          >
            Portal Embed Code
          </button>
          <button
            onClick={() => setActiveShareTab('qr')}
            className={activeShareTab === 'qr' ? 'btn-primary' : 'btn-secondary'}
            style={{ fontSize: '0.8rem', padding: '0.4rem 0.85rem' }}
          >
            QR Code
          </button>
        </div>

        {/* Tab 1: Direct Link */}
        {activeShareTab === 'link' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-heading)', marginBottom: '0.4rem' }}>
                Secure Payment Link
              </label>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <input
                  type="text"
                  readOnly
                  value={shareUrl}
                  style={{ flex: 1, fontSize: '0.85rem', fontFamily: 'var(--font-mono)' }}
                />
                <button
                  className={copiedLink ? 'btn-primary' : 'btn-secondary'}
                  onClick={handleCopyLink}
                  style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', padding: '0.65rem 1rem' }}
                >
                  {copiedLink ? <Check size={16} /> : <Copy size={16} />}
                  {copiedLink ? 'Copied!' : 'Copy'}
                </button>
              </div>
            </div>

            <div style={{
              padding: '1rem',
              background: 'var(--bg-surface-elevated)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-subtle)',
              fontSize: '0.85rem',
              color: 'var(--text-body)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <div>
                <strong style={{ color: 'var(--text-heading)' }}>Live Parent Preview:</strong>
                <p style={{ margin: '0.2rem 0 0 0', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  Test how the checkout and waiver appear to parents in a live window.
                </p>
              </div>
              <a
                href={shareUrl}
                target="_blank"
                rel="noreferrer"
                className="btn-primary"
                style={{ fontSize: '0.8rem', padding: '0.4rem 0.75rem', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.3rem', whiteSpace: 'nowrap' }}
              >
                Open Live <ExternalLink size={13} />
              </a>
            </div>
          </div>
        )}

        {/* Tab 2: Social / Instant Messaging */}
        {activeShareTab === 'social' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-body)' }}>
              Broadcast this secure payment link to parents instantly across their preferred channels:
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.75rem' }}>
              <button
                onClick={handleWhatsApp}
                className="btn-secondary"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '1rem 0.5rem',
                  background: 'rgba(37, 211, 102, 0.08)',
                  borderColor: 'rgba(37, 211, 102, 0.3)'
                }}
              >
                <MessageSquare size={22} color="#25D366" />
                <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-heading)' }}>WhatsApp</span>
              </button>

              <button
                onClick={handleEmail}
                className="btn-secondary"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '1rem 0.5rem',
                  background: 'rgba(79, 70, 229, 0.08)',
                  borderColor: 'rgba(79, 70, 229, 0.3)'
                }}
              >
                <Mail size={22} color="var(--accent-primary)" />
                <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-heading)' }}>Email</span>
              </button>

              <button
                onClick={handleSMS}
                className="btn-secondary"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '1rem 0.5rem',
                  background: 'rgba(234, 88, 12, 0.08)',
                  borderColor: 'rgba(234, 88, 12, 0.3)'
                }}
              >
                <Smartphone size={22} color="#ea580c" />
                <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-heading)' }}>SMS Text</span>
              </button>
            </div>
          </div>
        )}

        {/* Tab 3: Website / Portal Embed */}
        {activeShareTab === 'embed' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-body)' }}>
              Embed this responsive checkout widget directly into your school website or LMS portal:
            </p>
            <div style={{ position: 'relative' }}>
              <textarea
                readOnly
                rows={4}
                value={embedCode}
                style={{
                  width: '100%',
                  fontSize: '0.8rem',
                  fontFamily: 'var(--font-mono)',
                  background: 'var(--bg-surface-elevated)',
                  padding: '0.75rem'
                }}
              />
            </div>
            <button
              className={copiedEmbed ? 'btn-primary' : 'btn-secondary'}
              onClick={handleCopyEmbed}
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', padding: '0.65rem' }}
            >
              {copiedEmbed ? <Check size={16} /> : <Code2 size={16} />}
              {copiedEmbed ? 'Embed Code Copied!' : 'Copy Embed Code'}
            </button>
          </div>
        )}

        {/* Tab 4: QR Code */}
        {activeShareTab === 'qr' && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', textAlign: 'center' }}>
            <div style={{
              padding: '1.25rem',
              background: '#ffffff',
              borderRadius: 'var(--radius-md)',
              border: '2px solid var(--border-accent)',
              display: 'inline-block'
            }}>
              <QrCode size={160} color="#0f172a" />
            </div>
            <div>
              <div style={{ fontWeight: 700, color: 'var(--text-heading)', fontSize: '0.95rem' }}>
                Scan to Pay on Mobile
              </div>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                Print or attach to paper fee notices for instant mobile camera payment
              </p>
            </div>
          </div>
        )}

        <div style={{ marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid var(--border-subtle)', textAlign: 'right' }}>
          <button className="btn-secondary" onClick={onClose} style={{ fontSize: '0.85rem', padding: '0.5rem 1.25rem' }}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
