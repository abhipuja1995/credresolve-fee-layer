import React, { useState } from 'react';
import { 
  Palette, 
  Save
} from 'lucide-react';
import { SchoolBranding } from '../types/index.js';
import { api } from '../services/api.js';

interface BrandingSettingsModalProps {
  currentBranding: SchoolBranding;
  isOpen: boolean;
  onClose: () => void;
  onBrandingUpdated: (newBranding: SchoolBranding) => void;
}

const PRESET_PALETTES = [
  {
    name: 'Crisp Minimalist White',
    primary: '#4f46e5',
    secondary: '#7c3aed',
    bg: '#f8fafc',
    surface: '#ffffff',
    text: '#0f172a'
  },
  {
    name: 'Classic Academic White',
    primary: '#1d4ed8',
    secondary: '#0284c7',
    bg: '#ffffff',
    surface: '#f1f5f9',
    text: '#0f172a'
  },
  {
    name: 'Emerald Slate White',
    primary: '#059669',
    secondary: '#10b981',
    bg: '#f8fafc',
    surface: '#ffffff',
    text: '#064e3b'
  },
  {
    name: 'Electric Indigo (Dark)',
    primary: '#6366f1',
    secondary: '#a855f7',
    bg: '#0b0f19',
    surface: '#111827',
    text: '#f8fafc'
  },
  {
    name: 'Royal Sapphire (Dark)',
    primary: '#2563eb',
    secondary: '#06b6d4',
    bg: '#0a1128',
    surface: '#101f42',
    text: '#f8fafc'
  },
  {
    name: 'Crimson Cardinal (Dark)',
    primary: '#dc2626',
    secondary: '#f97316',
    bg: '#180a0a',
    surface: '#2c1212',
    text: '#f8fafc'
  }
];

const PRESET_LOGOS = [
  {
    label: 'Academic Crest',
    url: 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=150&auto=format&fit=crop&q=80'
  },
  {
    label: 'Modern Shield',
    url: 'https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=150&auto=format&fit=crop&q=80'
  },
  {
    label: 'Science & Tech Emblem',
    url: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=150&auto=format&fit=crop&q=80'
  }
];

export const BrandingSettingsModal: React.FC<BrandingSettingsModalProps> = ({
  currentBranding,
  isOpen,
  onClose,
  onBrandingUpdated
}) => {
  const [schoolName, setSchoolName] = useState(currentBranding.schoolName || 'St. Jude International Academy');
  const [logoUrl, setLogoUrl] = useState(currentBranding.logoUrl || '');
  const [primaryColor, setPrimaryColor] = useState(currentBranding.primaryColor || '#4f46e5');
  const [secondaryColor, setSecondaryColor] = useState(currentBranding.secondaryColor || '#7c3aed');
  const [backgroundColor, setBackgroundColor] = useState(currentBranding.backgroundColor || '#f8fafc');
  const [surfaceColor, setSurfaceColor] = useState(currentBranding.surfaceColor || '#ffffff');
  const [textColor, setTextColor] = useState(currentBranding.textColor || '#0f172a');
  const [isSaving, setIsSaving] = useState(false);

  if (!isOpen) return null;

  const applyPreset = (preset: typeof PRESET_PALETTES[0]) => {
    setPrimaryColor(preset.primary);
    setSecondaryColor(preset.secondary);
    setBackgroundColor(preset.bg);
    setSurfaceColor(preset.surface);
    setTextColor(preset.text);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const updated: SchoolBranding = {
        schoolName,
        logoUrl,
        primaryColor,
        secondaryColor,
        backgroundColor,
        surfaceColor,
        textColor
      };
      await api.updateBranding(updated);
      onBrandingUpdated(updated);
      onClose();
    } catch (err) {
      console.error('Failed to save branding:', err);
    } finally {
      setIsSaving(false);
    }
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
      zIndex: 110,
      padding: '1.5rem'
    }}>
      <div className="card-panel" style={{
        width: '100%',
        maxWidth: '840px',
        maxHeight: '92vh',
        overflowY: 'auto',
        padding: '2rem',
        background: 'var(--bg-card)',
        border: '1px solid var(--border-strong)',
        boxShadow: 'var(--shadow-lg)'
      }}>
        {/* Header */}
        <div className="flex-between" style={{ marginBottom: '1.5rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <div style={{
              width: '38px',
              height: '38px',
              borderRadius: 'var(--radius-md)',
              background: 'var(--accent-gradient)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Palette size={20} color="#ffffff" />
            </div>
            <div>
              <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--text-heading)' }}>
                School Brand & Theme Customization
              </h3>
              <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)' }}>
                Customize the school logo, primary/secondary colors, background tone, and text theme for parents and admin views.
              </p>
            </div>
          </div>
          <button onClick={onClose} style={{ fontSize: '1.25rem', color: 'var(--text-muted)', fontWeight: 700 }}>✕</button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
          {/* Preset Palettes */}
          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-heading)', marginBottom: '0.5rem' }}>
              Quick Preset Color Palettes
            </label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.65rem' }}>
              {PRESET_PALETTES.map(p => (
                <button
                  key={p.name}
                  onClick={() => applyPreset(p)}
                  style={{
                    padding: '0.5rem 0.85rem',
                    borderRadius: 'var(--radius-md)',
                    background: 'var(--bg-surface-elevated)',
                    border: primaryColor === p.primary && backgroundColor === p.bg ? '2px solid var(--accent-primary)' : '1px solid var(--border-subtle)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    fontSize: '0.825rem',
                    color: 'var(--text-heading)',
                    fontWeight: 600
                  }}
                >
                  <span style={{
                    width: '14px',
                    height: '14px',
                    borderRadius: '50%',
                    background: `linear-gradient(135deg, ${p.primary}, ${p.secondary})`,
                    display: 'inline-block',
                    border: '1px solid rgba(0,0,0,0.1)'
                  }} />
                  {p.name}
                </button>
              ))}
            </div>
          </div>

          {/* School Name & Logo Section */}
          <div className="grid-cols-2">
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-heading)', marginBottom: '0.35rem' }}>
                School Display Name
              </label>
              <input
                type="text"
                value={schoolName}
                onChange={e => setSchoolName(e.target.value)}
                placeholder="e.g. St. Jude International Academy"
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-heading)', marginBottom: '0.35rem' }}>
                School Logo Image URL
              </label>
              <input
                type="text"
                value={logoUrl}
                onChange={e => setLogoUrl(e.target.value)}
                placeholder="https://.../logo.png"
              />
              <div style={{ display: 'flex', gap: '0.4rem', marginTop: '0.4rem' }}>
                {PRESET_LOGOS.map((pl, i) => (
                  <button
                    key={i}
                    onClick={() => setLogoUrl(pl.url)}
                    className="btn-secondary"
                    style={{ fontSize: '0.725rem', padding: '0.25rem 0.55rem' }}
                  >
                    Sample {i + 1}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Color Customizers */}
          <div>
            <h4 style={{ fontSize: '0.9rem', fontWeight: 800, marginBottom: '0.75rem', color: 'var(--text-heading)' }}>
              Color Token Customization
            </h4>

            <div className="grid-cols-4">
              {/* Primary Color */}
              <div style={{ padding: '0.85rem', background: 'var(--bg-surface-elevated)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
                <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 700, display: 'block', marginBottom: '0.4rem', textTransform: 'uppercase' }}>
                  Primary Brand Color
                </label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <input
                    type="color"
                    value={primaryColor}
                    onChange={e => setPrimaryColor(e.target.value)}
                    style={{ width: '36px', height: '36px', padding: 0, border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                  />
                  <input
                    type="text"
                    value={primaryColor}
                    onChange={e => setPrimaryColor(e.target.value)}
                    style={{ fontSize: '0.8rem', padding: '0.35rem 0.5rem' }}
                  />
                </div>
              </div>

              {/* Secondary Color */}
              <div style={{ padding: '0.85rem', background: 'var(--bg-surface-elevated)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
                <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 700, display: 'block', marginBottom: '0.4rem', textTransform: 'uppercase' }}>
                  Secondary Accent Color
                </label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <input
                    type="color"
                    value={secondaryColor}
                    onChange={e => setSecondaryColor(e.target.value)}
                    style={{ width: '36px', height: '36px', padding: 0, border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                  />
                  <input
                    type="text"
                    value={secondaryColor}
                    onChange={e => setSecondaryColor(e.target.value)}
                    style={{ fontSize: '0.8rem', padding: '0.35rem 0.5rem' }}
                  />
                </div>
              </div>

              {/* Background Color */}
              <div style={{ padding: '0.85rem', background: 'var(--bg-surface-elevated)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
                <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 700, display: 'block', marginBottom: '0.4rem', textTransform: 'uppercase' }}>
                  Background Canvas
                </label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <input
                    type="color"
                    value={backgroundColor}
                    onChange={e => setBackgroundColor(e.target.value)}
                    style={{ width: '36px', height: '36px', padding: 0, border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                  />
                  <input
                    type="text"
                    value={backgroundColor}
                    onChange={e => setBackgroundColor(e.target.value)}
                    style={{ fontSize: '0.8rem', padding: '0.35rem 0.5rem' }}
                  />
                </div>
              </div>

              {/* Text Color */}
              <div style={{ padding: '0.85rem', background: 'var(--bg-surface-elevated)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
                <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 700, display: 'block', marginBottom: '0.4rem', textTransform: 'uppercase' }}>
                  Text & Typography
                </label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <input
                    type="color"
                    value={textColor}
                    onChange={e => setTextColor(e.target.value)}
                    style={{ width: '36px', height: '36px', padding: 0, border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                  />
                  <input
                    type="text"
                    value={textColor}
                    onChange={e => setTextColor(e.target.value)}
                    style={{ fontSize: '0.8rem', padding: '0.35rem 0.5rem' }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Live Preview Card */}
          <div style={{
            padding: '1.5rem',
            borderRadius: 'var(--radius-lg)',
            background: backgroundColor,
            color: textColor,
            border: `2px dashed ${primaryColor}60`,
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
            boxShadow: 'var(--shadow-sm)'
          }}>
            <div className="flex-between">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                {logoUrl ? (
                  <img
                    src={logoUrl}
                    alt="Logo preview"
                    style={{ width: '38px', height: '38px', borderRadius: '8px', objectFit: 'cover' }}
                  />
                ) : (
                  <div style={{ width: '38px', height: '38px', borderRadius: '8px', background: primaryColor, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 800 }}>
                    {schoolName.charAt(0)}
                  </div>
                )}
                <div>
                  <h4 style={{ fontSize: '1.05rem', fontWeight: 800, color: textColor }}>{schoolName}</h4>
                  <span style={{ fontSize: '0.75rem', color: primaryColor, fontWeight: 700 }}>
                    Live Client Branding Preview
                  </span>
                </div>
              </div>

              <span style={{
                background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})`,
                color: '#ffffff',
                padding: '0.3rem 0.75rem',
                borderRadius: '999px',
                fontSize: '0.75rem',
                fontWeight: 700
              }}>
                Checkout Active
              </span>
            </div>

            <div style={{
              background: surfaceColor,
              padding: '1.25rem',
              borderRadius: 'var(--radius-md)',
              border: `1px solid rgba(0, 0, 0, 0.1)`,
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <div>
                <strong style={{ display: 'block', fontSize: '0.95rem', color: textColor, fontWeight: 800 }}>
                  8th Grade Washington D.C. Tour
                </strong>
                <span style={{ fontSize: '0.8rem', opacity: 0.75 }}>Student: Alexander Hayes</span>
              </div>
              <button
                style={{
                  background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})`,
                  color: '#ffffff',
                  fontWeight: 700,
                  fontSize: '0.85rem',
                  padding: '0.5rem 1.15rem',
                  borderRadius: 'var(--radius-md)',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.15)'
                }}
              >
                Pay $350.00
              </button>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex-between" style={{ marginTop: '2rem', paddingTop: '1.25rem', borderTop: '1px solid var(--border-subtle)' }}>
          <button className="btn-secondary" onClick={onClose}>
            Cancel
          </button>

          <button
            className="btn-primary"
            onClick={handleSave}
            disabled={isSaving}
          >
            <Save size={16} />
            {isSaving ? 'Applying Branding...' : 'Save & Apply Brand Theme'}
          </button>
        </div>
      </div>
    </div>
  );
};
