import React, { useState, useEffect } from 'react';
import { Navigation, ActiveTab } from './components/Navigation.js';
import { FeeCreator } from './components/FeeCreator.js';
import { ParentQuickPayPortal } from './components/ParentQuickPayPortal.js';
import { StudentLedgerView } from './components/StudentLedgerView.js';
import { BrandingSettingsModal } from './components/BrandingSettingsModal.js';
import { UserGuideView } from './components/UserGuideView.js';
import { api } from './services/api.js';
import { 
  BlackbaudContext, 
  BlackbaudFeeType, 
  UniversalFeeDefinition, 
  StudentAccount, 
  StudentCharge,
  SchoolBranding,
  DEFAULT_FEE_TYPES,
  DEFAULT_STUDENTS,
  DEFAULT_FEES
} from './types/index.js';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ActiveTab>('fees');
  const [context, setContext] = useState<BlackbaudContext | null>(null);
  const [feeTypes, setFeeTypes] = useState<BlackbaudFeeType[]>(DEFAULT_FEE_TYPES);
  const [fees, setFees] = useState<UniversalFeeDefinition[]>(DEFAULT_FEES);
  const [students, setStudents] = useState<StudentAccount[]>(DEFAULT_STUDENTS);
  const [charges, setCharges] = useState<StudentCharge[]>([]);
  const [batches, setBatches] = useState<import('./types/index.js').IngestionJobRecord[]>([]);
  const [isBrandingModalOpen, setIsBrandingModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isStandaloneParentView, setIsStandaloneParentView] = useState(false);
  const [parentInitialQuery, setParentInitialQuery] = useState<string | undefined>(undefined);

  // Helper to determine if a color is light
  const isColorLight = (hexColor: string) => {
    const hex = hexColor.replace('#', '');
    if (hex.length < 6) return true;
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    return luminance > 0.5;
  };

  // Apply CSS variables dynamically based on client branding
  const applyTheme = (branding: SchoolBranding) => {
    const root = document.documentElement;
    const isLightMode = isColorLight(branding.backgroundColor || '#f8fafc');

    if (isLightMode) {
      document.body.classList.remove('dark-theme');
    } else {
      document.body.classList.add('dark-theme');
    }

    if (branding.primaryColor) {
      root.style.setProperty('--accent-primary', branding.primaryColor);
      root.style.setProperty('--accent-secondary', branding.secondaryColor || '#7c3aed');
      root.style.setProperty('--accent-gradient', `linear-gradient(135deg, ${branding.primaryColor} 0%, ${branding.secondaryColor || '#7c3aed'} 100%)`);
      root.style.setProperty('--accent-light', `${branding.primaryColor}15`);
      root.style.setProperty('--border-accent', `${branding.primaryColor}50`);
      root.style.setProperty('--accent-gradient-card', isLightMode ? `linear-gradient(135deg, ${branding.backgroundColor || '#f8fafc'} 0%, ${branding.primaryColor}12 100%)` : `linear-gradient(135deg, ${branding.surfaceColor || '#111827'} 0%, ${branding.primaryColor}20 100%)`);
    }

    if (branding.backgroundColor) {
      root.style.setProperty('--bg-page', branding.backgroundColor);
    }

    if (branding.surfaceColor) {
      root.style.setProperty('--bg-card', branding.surfaceColor);
      root.style.setProperty('--bg-surface-elevated', isLightMode ? '#f1f5f9' : '#1e293b');
      root.style.setProperty('--bg-surface-hover', isLightMode ? '#e2e8f0' : '#334155');
      root.style.setProperty('--bg-nav', isLightMode ? `${branding.surfaceColor}f2` : 'rgba(11, 15, 25, 0.92)');
    }

    if (branding.textColor) {
      root.style.setProperty('--text-heading', branding.textColor);
      root.style.setProperty('--text-body', isLightMode ? '#334155' : '#cbd5e1');
      root.style.setProperty('--text-muted', isLightMode ? '#64748b' : '#94a3b8');
      root.style.setProperty('--border-subtle', isLightMode ? '#e2e8f0' : '#1e293b');
      root.style.setProperty('--border-strong', isLightMode ? '#cbd5e1' : '#334155');
    }
  };

  const loadData = async () => {
    try {
      const [ctx, ft, fList, sList, cList, bList] = await Promise.all([
        api.getContext().catch(() => null),
        api.getFeeTypes().catch(() => DEFAULT_FEE_TYPES),
        api.getFees().catch(() => []),
        api.getStudents().catch(() => []),
        api.getCharges().catch(() => []),
        api.getBatches().catch(() => [])
      ]);

      if (ctx) setContext(ctx);
      if (ft && ft.length > 0) setFeeTypes(ft);
      if (fList) setFees(fList);
      if (sList) setStudents(sList);
      if (cList) setCharges(cList);
      if (bList) setBatches(bList);

      if (ctx?.environment?.branding) {
        applyTheme(ctx.environment.branding);
      }

      // Check URL query parameters for parent app / website embed
      const urlParams = new URLSearchParams(window.location.search);
      const viewParam = urlParams.get('view');
      const directChargeId = urlParams.get('chargeId') || urlParams.get('pay');

      if (viewParam === 'quickpay' || viewParam === 'embed' || directChargeId) {
        setIsStandaloneParentView(true);
        if (directChargeId) {
          const matchCharge = cList.find(c => c.id === directChargeId);
          if (matchCharge) {
            setParentInitialQuery(matchCharge.studentId);
          }
        }
      }
    } catch (err) {
      console.error('Failed to load initial application state:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleOpenCheckout = (chargeId: string) => {
    const matchCharge = charges.find(c => c.id === chargeId);
    if (matchCharge) {
      setParentInitialQuery(matchCharge.studentId);
    }
    // Open in a new parent window or toggle view
    window.open(`${window.location.origin}/?chargeId=${chargeId}`, '_blank');
  };

  const handleTabChange = (tab: ActiveTab) => {
    setActiveTab(tab);
    window.history.replaceState({}, '', window.location.pathname);
  };

  const handleBrandingUpdated = (newBranding: SchoolBranding) => {
    if (context) {
      setContext({
        ...context,
        environment: {
          ...context.environment,
          schoolName: newBranding.schoolName,
          branding: newBranding
        }
      });
    }
    applyTheme(newBranding);
  };

  // If in standalone Parent Quick-Pay View (accessed via school app / embed / payment link)
  if (isStandaloneParentView) {
    return (
      <div style={{ minHeight: '100vh', background: 'var(--bg-page)', padding: '2rem 1rem' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <ParentQuickPayPortal
            branding={context?.environment.branding}
            onPaymentCompleted={() => loadData()}
            initialQuery={parentInitialQuery}
          />
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navigation
        activeTab={activeTab}
        onTabChange={handleTabChange}
        context={context}
        onOpenBrandingModal={() => setIsBrandingModalOpen(true)}
      />

      <main className="container" style={{ flex: 1, padding: '2rem' }}>
        {loading ? (
          <div className="card-panel" style={{ padding: '3rem', textAlign: 'center' }}>
            <div style={{ color: 'var(--accent-primary)', fontWeight: 700 }}>
              Connecting to Blackbaud SKY API & CredResolve Ledger...
            </div>
          </div>
        ) : (
          <>
            {activeTab === 'fees' && (
              <FeeCreator
                feeTypes={feeTypes}
                existingFees={fees}
                students={students}
                batches={batches}
                onRefreshBatches={async () => {
                  const bList = await api.getBatches();
                  setBatches(bList);
                }}
                onFeeTypeCreated={(newFt) => {
                  setFeeTypes(prev => [newFt, ...prev.filter(f => f.feeTypeId !== newFt.feeTypeId)]);
                }}
                onRefreshFeeTypes={async () => {
                  const ftList = await api.getFeeTypes();
                  setFeeTypes(ftList);
                }}
                onFeeCreated={(newFee?: UniversalFeeDefinition) => {
                  if (newFee) {
                    setFees(prev => [newFee, ...prev.filter(f => f.id !== newFee.id)]);
                  }
                  loadData();
                }}
              />
            )}

            {activeTab === 'ledger' && (
              <StudentLedgerView
                charges={charges}
                fees={fees}
                onOpenCheckout={handleOpenCheckout}
              />
            )}

            {activeTab === 'guide' && (
              <UserGuideView
                onNavigateTab={(tab) => {
                  if (tab === 'fees' || tab === 'ledger') handleTabChange(tab);
                }}
                onOpenBranding={() => setIsBrandingModalOpen(true)}
                branding={context?.environment.branding}
              />
            )}
          </>
        )}
      </main>

      {/* Branding Settings Modal */}
      {context?.environment.branding && (
        <BrandingSettingsModal
          currentBranding={context.environment.branding}
          isOpen={isBrandingModalOpen}
          onClose={() => setIsBrandingModalOpen(false)}
          onBrandingUpdated={handleBrandingUpdated}
        />
      )}
    </div>
  );
};
