import React, { useState } from 'react';
import { 
  Palette, 
  Save,
  CheckCircle2,
  Sparkles
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
    name: 'Blackbaud SKY UX Classic',
    primary: '#007ea8',
    secondary: '#00b4e5',
    bg: '#f4f5f7',
    surface: '#ffffff',
    text: '#282b30'
  },
  {
    name: 'Blackbaud Deep Navy & Sky',
    primary: '#007ea8',
    secondary: '#0d364f',
    bg: '#f8f9fa',
    surface: '#ffffff',
    text: '#002238'
  },
  {
    name: 'Blackbaud SKY Modern Dark',
    primary: '#0284c7',
    secondary: '#38bdf8',
    bg: '#12161a',
    surface: '#1c2228',
    text: '#f4f5f7'
  },
  {
    name: 'Academic Indigo Minimalist',
    primary: '#4f46e5',
    secondary: '#7c3aed',
    bg: '#f8fafc',
    surface: '#ffffff',
    text: '#0f172a'
  },
  {
    name: 'Emerald Slate Collegiate',
    primary: '#059669',
    secondary: '#10b981',
    bg: '#f8fafc',
    surface: '#ffffff',
    text: '#064e3b'
  },
  {
    name: 'Crimson Cardinal Heritage',
    primary: '#b30000',
    secondary: '#f4811f',
    bg: '#ffffff',
    surface: '#f9f9f9',
    text: '#282b30'
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
  const [primaryColor, setPrimaryColor] = useState(currentBranding.primaryColor || '#007ea8');
  const [secondaryColor, setSecondaryColor] = useState(currentBranding.secondaryColor || '#00b4e5');
  const [backgroundColor, setBackgroundColor] = useState(currentBranding.backgroundColor || '#f4f5f7');
  const [surfaceColor, setSurfaceColor] = useState(currentBranding.surfaceColor || '#ffffff');
  const [textColor, setTextColor] = useState(currentBranding.textColor || '#282b30');
  const [isSaving, setIsSaving] = useState(false);

  if (!isOpen) return null;

  const applyPreset = (preset: typeof PRESET_PALETTES[0]) => {
    setPrimaryColor(preset.primary);
    setSecondaryColor(preset.secondary);
    setBackgroundColor(preset.bg);
    setSurfaceColor(preset.surface);
    setTextColor(preset.text);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const updated: SchoolBranding = {
        schoolName,
        logoUrl: logoUrl.trim() || undefined,
        primaryColor,
        secondaryColor,
        backgroundColor,
        surfaceColor,
        textColor
      };

      const result = await api.updateBranding(updated);
      onBrandingUpdated(result.branding || updated);
      onClose();
    } catch (err) {
      console.error('Failed to update branding:', err);
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
        maxWidth: '680px',
        maxHeight: '92vh',
        overflowY: 'auto',
        padding: 0,
        boxShadow: 'var(--shadow-modal)'
      }}>
        {/* Modal Header */}
        <div className="sky-card-header" style={{ padding: '1.15rem 1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <Palette size={18} color="var(--sky-color-primary)" />
            <div>
              <h3 className="sky-heading-2">Brand & SKY UX Theme Settings</h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.15rem' }}>
                Configure school logo, color palette, and SKY UX typography styling.
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

        <form onSubmit={handleSave} style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* Preset Palettes */}
          <div>
            <label>
              SKY UX Theme Presets
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '0.5rem', marginTop: '0.35rem' }}>
              {PRESET_PALETTES.map(p => (
                <button
                  type="button"
                  key={p.name}
                  onClick={() => applyPreset(p)}
                  style={{
                    padding: '0.55rem 0.75rem',
                    borderRadius: 'var(--radius-sm)',
                    border: primaryColor === p.primary && backgroundColor === p.bg ? '2px solid var(--sky-color-primary)' : '1px solid var(--border-strong)',
                    background: p.bg,
                    color: p.text,
                    textAlign: 'left',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.35rem'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: p.primary, display: 'inline-block' }} />
                    <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: p.secondary, display: 'inline-block' }} />
                  </div>
                  <span>{p.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* School Name & Logo */}
          <div className="grid-cols-2">
            <div>
              <label>
                Institution Name *
              </label>
              <input
                type="text"
                required
                value={schoolName}
                onChange={e => setSchoolName(e.target.value)}
                placeholder="e.g. St. Jude International Academy"
              />
            </div>

            <div>
              <label>
                Logo Image URL
              </label>
              <input
                type="url"
                value={logoUrl}
                onChange={e => setLogoUrl(e.target.value)}
                placeholder="https://.../logo.png"
              />
            </div>
          </div>

          {/* Custom Color Pickers */}
          <div className="grid-cols-3">
            <div>
              <label>Primary Accent</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <input
                  type="color"
                  value={primaryColor}
                  onChange={e => setPrimaryColor(e.target.value)}
                  style={{ width: '38px', height: '38px', padding: 0, border: 'none', cursor: 'pointer' }}
                />
                <input
                  type="text"
                  value={primaryColor}
                  onChange={e => setPrimaryColor(e.target.value)}
                  style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem' }}
                />
              </div>
            </div>

            <div>
              <label>Secondary Accent</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <input
                  type="color"
                  value={secondaryColor}
                  onChange={e => setSecondaryColor(e.target.value)}
                  style={{ width: '38px', height: '38px', padding: 0, border: 'none', cursor: 'pointer' }}
                />
                <input
                  type="text"
                  value={secondaryColor}
                  onChange={e => setSecondaryColor(e.target.value)}
                  style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem' }}
                />
              </div>
            </div>

            <div>
              <label>Background Canvas</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <input
                  type="color"
                  value={backgroundColor}
                  onChange={e => setBackgroundColor(e.target.value)}
                  style={{ width: '38px', height: '38px', padding: 0, border: 'none', cursor: 'pointer' }}
                />
                <input
                  type="text"
                  value={backgroundColor}
                  onChange={e => setBackgroundColor(e.target.value)}
                  style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem' }}
                />
              </div>
            </div>
          </div>

          {/* Footer Controls */}
          <div style={{
            marginTop: '1rem',
            paddingTop: '1rem',
            borderTop: '1px solid var(--border-subtle)',
            display: 'flex',
            justifyContent: 'flex-end',
            gap: '0.65rem'
          }}>
            <button type="button" className="sky-btn-default" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="sky-btn-primary" disabled={isSaving}>
              <Save size={14} />
              {isSaving ? 'Applying Theme...' : 'Apply & Save Theme'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
