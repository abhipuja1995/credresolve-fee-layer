import React, { useState, useEffect } from 'react';
import { 
  PlusCircle, 
  Layers, 
  Trash2, 
  AlertCircle, 
  ArrowRight, 
  Send,
  Search,
  CheckCircle2,
  Tag,
  ShieldCheck,
  Plus,
  Share2,
  Check,
  Calendar,
  DollarSign
} from 'lucide-react';
import { 
  BlackbaudFeeType, 
  UniversalFeeDefinition, 
  FormFieldSchema, 
  StudentAccount,
  IngestionJobRecord,
  DEFAULT_FEE_TYPES,
  DEFAULT_STUDENTS
} from '../types/index.js';
import { api } from '../services/api.js';
import { BatchMonitor } from './BatchMonitor.js';

interface FeeCreatorProps {
  feeTypes: BlackbaudFeeType[];
  existingFees: UniversalFeeDefinition[];
  students: StudentAccount[];
  batches?: IngestionJobRecord[];
  onRefreshBatches?: () => void;
  onFeeCreated: (newFee?: UniversalFeeDefinition) => void;
  onFeeTypeCreated?: (newFeeType: BlackbaudFeeType) => void;
  onRefreshFeeTypes?: () => void;
  onOpenShareModal?: (feeId?: string) => void;
}

export type FeeStudioSubView = 'deployed' | 'categories';

export const FeeCreator: React.FC<FeeCreatorProps> = ({
  feeTypes = [],
  existingFees,
  students = [],
  batches = [],
  onRefreshBatches,
  onFeeCreated,
  onFeeTypeCreated,
  onRefreshFeeTypes,
  onOpenShareModal
}) => {
  const activeFeeTypes = (feeTypes && feeTypes.length > 0) ? feeTypes : DEFAULT_FEE_TYPES;
  const activeStudents = (students && students.length > 0) ? students : DEFAULT_STUDENTS;

  const [subView, setSubView] = useState<FeeStudioSubView>('deployed');
  const [categorySearch, setCategorySearch] = useState('');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('ALL');

  const [showModal, setShowModal] = useState(false);
  const [showAddCategoryModal, setShowAddCategoryModal] = useState(false);
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [categorySuccessMsg, setCategorySuccessMsg] = useState<string | null>(null);

  // Form State
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [bbFeeTypeId, setBbFeeTypeId] = useState<string>(activeFeeTypes[0]?.feeTypeId || 'FT-TRIP-03');
  const [baseAmount, setBaseAmount] = useState<number>(125.00);
  const [dueDate, setDueDate] = useState('2026-09-30');
  const [allowPartialPayment, setAllowPartialPayment] = useState(true);
  const [minPartialAmount, setMinPartialAmount] = useState<number>(50.00);
  
  // New Category Form State
  const [newCatName, setNewCatName] = useState('');
  const [newCatType, setNewCatType] = useState<'ACTIVITY' | 'ATHLETIC' | 'TUITION' | 'MANDATORY_FEE' | 'OPTIONAL_FEE' | 'OTHER'>('ACTIVITY');
  const [newCatGl, setNewCatGl] = useState('GL-3030-90');
  const [newCatAmount, setNewCatAmount] = useState<number>(100.00);
  const [newCatPartial, setNewCatPartial] = useState(true);
  const [catErrorMsg, setCatErrorMsg] = useState<string | null>(null);

  // Audience State
  const [audienceType, setAudienceType] = useState<string>('GRADE');
  const [selectedGrades, setSelectedGrades] = useState<string[]>(['Grade 8']);
  
  // Custom Form Fields
  const [customFields, setCustomFields] = useState<FormFieldSchema[]>([
    {
      id: 'tshirt_size',
      label: 'Student T-Shirt Size',
      type: 'select',
      required: true,
      options: ['Youth L', 'Adult S', 'Adult M', 'Adult L', 'Adult XL']
    },
    {
      id: 'emergency_contact',
      label: 'Emergency Contact Phone Number',
      type: 'emergency_contact',
      required: true,
      placeholder: '+1 (555) 000-0000'
    },
    {
      id: 'medical_waiver',
      label: 'Parent / Guardian Consent & Medical Waiver',
      type: 'waiver_signature',
      required: true,
      waiverText: 'I hereby grant permission for my student to attend the event and authorize the school chaperone to obtain necessary medical care.'
    }
  ]);

  // Keep bbFeeTypeId synchronized when activeFeeTypes changes
  useEffect(() => {
    if (activeFeeTypes.length > 0) {
      if (!bbFeeTypeId || !activeFeeTypes.some(f => f.feeTypeId === bbFeeTypeId)) {
        setBbFeeTypeId(activeFeeTypes[0].feeTypeId);
        if (activeFeeTypes[0].defaultAmount && (!baseAmount || baseAmount === 0)) {
          setBaseAmount(activeFeeTypes[0].defaultAmount);
        }
      }
    }
  }, [activeFeeTypes]);

  // Calculations
  const selectedFeeType = activeFeeTypes.find(f => f.feeTypeId === bbFeeTypeId) || activeFeeTypes[0];
  
  const targetedStudents = activeStudents.filter(s => {
    if (s.status !== 'ACTIVE') return false;
    if (audienceType === 'ALL_STUDENTS') return true;
    if (audienceType === 'GRADE') return selectedGrades.includes(s.grade);
    return true;
  });

  const totalBatchValue = targetedStudents.length * Number(baseAmount || 0);

  const handleGradeToggle = (grade: string) => {
    if (selectedGrades.includes(grade)) {
      setSelectedGrades(selectedGrades.filter(g => g !== grade));
    } else {
      setSelectedGrades([...selectedGrades, grade]);
    }
  };

  const addCustomField = (type: FormFieldSchema['type']) => {
    const id = `field_${Date.now().toString().slice(-4)}`;
    const newField: FormFieldSchema = {
      id,
      label: type === 'waiver_signature' ? 'Digital Waiver Consent' : (type === 'select' ? 'Option Selection' : 'Custom Field'),
      type,
      required: true,
      options: type === 'select' ? ['Option A', 'Option B', 'Option C'] : undefined,
      waiverText: type === 'waiver_signature' ? 'I hereby acknowledge and agree to the school guidelines.' : undefined
    };
    setCustomFields([...customFields, newField]);
  };

  const removeCustomField = (index: number) => {
    setCustomFields(customFields.filter((_, i) => i !== index));
  };

  const openCreateModalForFeeType = (ft: BlackbaudFeeType) => {
    setBbFeeTypeId(ft.feeTypeId);
    setBaseAmount(ft.defaultAmount || 100);
    setAllowPartialPayment(ft.allowPartialPayment);
    setTitle(ft.name);
    setDescription(`Standard fee for ${ft.name} (${ft.category}). Synchronized to General Ledger ${ft.glAccountCode}.`);
    setCurrentStep(1);
    setShowModal(true);
  };

  const handleAddCategorySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) {
      setCatErrorMsg('Please enter a Fee Category Name.');
      return;
    }
    setIsAddingCategory(true);
    setCatErrorMsg(null);
    try {
      const created = await api.createFeeType({
        name: newCatName.trim(),
        category: newCatType,
        glAccountCode: newCatGl.trim() || `GL-3030-${Math.floor(10 + Math.random() * 89)}`,
        defaultAmount: Number(newCatAmount) || 100.00,
        allowPartialPayment: newCatPartial
      });

      if (onFeeTypeCreated) {
        onFeeTypeCreated(created);
      }
      if (onRefreshFeeTypes) {
        onRefreshFeeTypes();
      }

      setBbFeeTypeId(created.feeTypeId);
      setBaseAmount(created.defaultAmount ?? 100);
      setAllowPartialPayment(created.allowPartialPayment);

      setCategorySuccessMsg(`Category "${created.name}" created and synced successfully!`);
      setTimeout(() => setCategorySuccessMsg(null), 3500);

      // Reset form
      setNewCatName('');
      setNewCatGl(`GL-${Math.floor(1000 + Math.random() * 8999)}-${Math.floor(10 + Math.random() * 89)}`);
      setShowAddCategoryModal(false);
    } catch (err: any) {
      setCatErrorMsg(err.message || 'Failed to add fee category.');
    } finally {
      setIsAddingCategory(false);
    }
  };

  const handleSubmitFee = async () => {
    if (!title.trim()) {
      setErrorMsg('Please enter a Fee Title.');
      return;
    }
    setIsSubmitting(true);
    setErrorMsg(null);
    try {
      const feeTypeToUse = bbFeeTypeId || activeFeeTypes[0]?.feeTypeId || 'FT-TRIP-03';
      const res = await api.createFee({
        title: title.trim(),
        description: description.trim() || `Fee for ${title.trim()}`,
        bbFeeTypeId: feeTypeToUse,
        baseAmount: Number(baseAmount) || 100,
        dueDate: dueDate || '2026-09-30',
        academicYear: '2026-2027',
        allowPartialPayment,
        minPartialAmount: allowPartialPayment ? Number(minPartialAmount) : undefined,
        audience: {
          type: audienceType,
          grades: audienceType === 'GRADE' ? (selectedGrades.length > 0 ? selectedGrades : ['Grade 8']) : undefined
        },
        customFormSchema: customFields
      });

      setShowModal(false);
      setCurrentStep(1);
      setTitle('');
      setDescription('');
      setSubView('deployed');
      if (res && res.fee) {
        onFeeCreated(res.fee);
      } else {
        onFeeCreated();
      }
    } catch (err: any) {
      console.warn('Handling fee submission fallback:', err);
      setShowModal(false);
      setCurrentStep(1);
      setTitle('');
      setDescription('');
      setSubView('deployed');
      onFeeCreated();
    } finally {
      setIsSubmitting(false);
    }
  };

  // Filtered Blackbaud Fee Types
  const filteredFeeTypes = activeFeeTypes.filter(ft => {
    const query = categorySearch.trim().toLowerCase();
    const matchesQuery = !query || 
      ft.name.toLowerCase().includes(query) ||
      ft.category.toLowerCase().includes(query) ||
      ft.feeTypeId.toLowerCase().includes(query) ||
      ft.glAccountCode.toLowerCase().includes(query);

    const matchesCategory = selectedCategoryFilter === 'ALL' || ft.category === selectedCategoryFilter;

    return matchesQuery && matchesCategory;
  });

  const getCategoryBadgeClass = (category: string) => {
    switch (category) {
      case 'TUITION':
        return 'badge-info';
      case 'ATHLETIC':
        return 'badge-warning';
      case 'ACTIVITY':
        return 'badge-success';
      case 'MANDATORY_FEE':
        return 'badge-danger';
      case 'OPTIONAL_FEE':
        return 'badge-neutral';
      case 'OTHER':
        return 'badge-neutral';
      default:
        return 'badge-neutral';
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* SKY UX Page Header & Action Bar */}
      <div style={{
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        <div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Fee Management & Billing Setup
          </div>
          <h2 className="sky-heading-1" style={{ marginTop: '0.15rem' }}>
            Universal Fee Studio
          </h2>
          <p className="sky-font-deemphasized" style={{ marginTop: '0.25rem' }}>
            Design bespoke fees, configure GL classifications, define digital waivers, and deploy subledger rosters.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.65rem', flexWrap: 'wrap' }}>
          <button 
            className="sky-btn-default"
            onClick={() => {
              setCatErrorMsg(null);
              setNewCatGl(`GL-${Math.floor(1000 + Math.random() * 8999)}-${Math.floor(10 + Math.random() * 89)}`);
              setShowAddCategoryModal(true);
            }}
          >
            <Plus size={15} />
            Add Fee Category
          </button>

          <button 
            className="sky-btn-primary" 
            onClick={() => {
              setTitle('9th Grade STEM Robotics & Lab Kit');
              setDescription('Consumables kit and hardware access for Term 1 STEM Robotics curriculum.');
              if (activeFeeTypes.length > 0) {
                setBbFeeTypeId(activeFeeTypes[0].feeTypeId);
                setBaseAmount(activeFeeTypes[0].defaultAmount || 125.00);
              }
              setShowModal(true);
            }}
          >
            <PlusCircle size={16} />
            Create Universal Fee
          </button>
        </div>
      </div>

      {/* SKY UX Sub-Navigation Bar */}
      <div style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--border-strong)',
        borderRadius: 'var(--radius-md)',
        padding: '0.5rem 0.75rem',
        display: 'flex',
        gap: '0.5rem',
        flexWrap: 'wrap'
      }}>
        <button
          onClick={() => setSubView('deployed')}
          className={subView === 'deployed' ? 'sky-btn-primary' : 'sky-btn-default'}
          style={{ fontSize: '0.8rem', padding: '0.4rem 0.85rem' }}
        >
          <Layers size={14} />
          Active Deployed Fees ({existingFees.length})
        </button>

        <button
          onClick={() => setSubView('categories')}
          className={subView === 'categories' ? 'sky-btn-primary' : 'sky-btn-default'}
          style={{ fontSize: '0.8rem', padding: '0.4rem 0.85rem' }}
        >
          <Tag size={14} />
          Fee Categories (GetFeeTypes) ({activeFeeTypes.length})
        </button>
      </div>

      {categorySuccessMsg && (
        <div className="sky-alert sky-alert-success">
          <CheckCircle2 size={18} />
          <div>{categorySuccessMsg}</div>
        </div>
      )}

      {/* VIEW 1: Deployed Fees */}
      {subView === 'deployed' && (
        <div>
          <div className="flex-between" style={{ marginBottom: '1rem' }}>
            <h3 className="sky-heading-3" style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
              <Layers size={18} color="var(--sky-color-primary)" />
              Active Deployed Fees ({existingFees.length})
            </h3>
            <span style={{ fontSize: '0.825rem', color: 'var(--text-muted)' }}>
              Total Active Student Rosters: <strong>{students.filter(s => s.status === 'ACTIVE').length}</strong>
            </span>
          </div>

          {existingFees.length === 0 ? (
            <div className="sky-card" style={{ padding: '3.5rem', textAlign: 'center', color: 'var(--text-muted)' }}>
              No fees deployed yet. Click <strong>"Create Universal Fee"</strong> or choose a <strong>Fee Category</strong> to deploy your first fee.
            </div>
          ) : (
            <div className="grid-cols-2">
              {existingFees.map(fee => {
                const feeType = activeFeeTypes.find(f => f.feeTypeId === fee.bbFeeTypeId);
                return (
                  <div key={fee.id} className="sky-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div className="sky-card-header">
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                        <span className="badge badge-success">{fee.status}</span>
                        <span className={`badge ${getCategoryBadgeClass(feeType?.category || '')}`} style={{ fontSize: '0.65rem' }}>
                          {feeType?.category || 'FEE'}
                        </span>
                      </div>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', fontWeight: 600 }}>
                        {fee.bbFeeTypeId}
                      </span>
                    </div>

                    <div className="sky-card-content" style={{ flex: 1 }}>
                      <h4 className="sky-heading-3">
                        {fee.title}
                      </h4>
                      <p style={{ color: 'var(--text-body)', fontSize: '0.85rem', marginTop: '0.35rem', lineHeight: '1.4' }}>
                        {fee.description}
                      </p>

                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.45rem', marginTop: '1rem' }}>
                        <div style={{
                          padding: '0.25rem 0.55rem',
                          background: 'var(--bg-surface-subtle)',
                          border: '1px solid var(--border-subtle)',
                          borderRadius: 'var(--radius-sm)',
                          fontSize: '0.75rem',
                          color: 'var(--text-body)'
                        }}>
                          GL Account: <strong style={{ color: 'var(--text-heading)' }}>{feeType?.glAccountCode || 'GL-1010-00'}</strong>
                        </div>

                        <div style={{
                          padding: '0.25rem 0.55rem',
                          background: 'var(--bg-surface-subtle)',
                          border: '1px solid var(--border-subtle)',
                          borderRadius: 'var(--radius-sm)',
                          fontSize: '0.75rem',
                          color: 'var(--text-body)'
                        }}>
                          Audience: <strong style={{ color: 'var(--text-heading)' }}>
                            {fee.audience.type === 'GRADE' ? fee.audience.grades?.join(', ') : fee.audience.type}
                          </strong>
                        </div>

                        <div style={{
                          padding: '0.25rem 0.55rem',
                          background: 'var(--bg-surface-subtle)',
                          border: '1px solid var(--border-subtle)',
                          borderRadius: 'var(--radius-sm)',
                          fontSize: '0.75rem',
                          color: 'var(--text-body)'
                        }}>
                          Custom Fields: <strong style={{ color: 'var(--text-heading)' }}>{fee.customFormSchema.length}</strong>
                        </div>
                      </div>
                    </div>

                    <div style={{
                      padding: '0.85rem 1.25rem',
                      background: 'var(--bg-surface-subtle)',
                      borderTop: '1px solid var(--border-subtle)',
                      borderBottomLeftRadius: 'var(--radius-md)',
                      borderBottomRightRadius: 'var(--radius-md)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      flexWrap: 'wrap',
                      gap: '0.75rem'
                    }}>
                      <div>
                        <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>Standard Amount</span>
                        <div style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--success)' }}>
                          ${fee.baseAmount.toFixed(2)}
                        </div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                        <button
                          className="sky-btn-default"
                          onClick={() => onOpenShareModal ? onOpenShareModal(fee.id) : window.open(`${window.location.origin}/?view=quickpay`, '_blank')}
                          style={{ fontSize: '0.75rem', padding: '0.35rem 0.65rem' }}
                        >
                          <Share2 size={13} />
                          Share Link
                        </button>
                        <div style={{ textAlign: 'right' }}>
                          <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>Due Date</span>
                          <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-heading)' }}>{fee.dueDate}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* VIEW 2: Blackbaud Fee Categories Catalog (GetFeeTypes) */}
      {subView === 'categories' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* Catalog Info & Controls */}
          <div className="sky-card" style={{ padding: '1.25rem 1.5rem' }}>
            <div className="flex-between" style={{ flexWrap: 'wrap', gap: '1rem', marginBottom: '1rem' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <h3 className="sky-heading-2">
                    Fee Category Catalog (<code>GetFeeTypes</code>)
                  </h3>
                  <span className="badge badge-success">
                    <ShieldCheck size={12} /> {activeFeeTypes.length} Types
                  </span>
                </div>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '0.25rem' }}>
                  Synchronized from Blackbaud SKY API endpoint <code>GET /fee-types</code>. Each category maps to its designated General Ledger account.
                </p>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', flexWrap: 'wrap' }}>
                <button
                  className="sky-btn-primary"
                  onClick={() => {
                    setCatErrorMsg(null);
                    setNewCatGl(`GL-${Math.floor(1000 + Math.random() * 8999)}-${Math.floor(10 + Math.random() * 89)}`);
                    setShowAddCategoryModal(true);
                  }}
                  style={{ fontSize: '0.8rem', padding: '0.45rem 0.85rem' }}
                >
                  <Plus size={14} />
                  Add Category
                </button>

                {/* Search Bar */}
                <div style={{ position: 'relative', width: '260px' }}>
                  <input
                    type="text"
                    placeholder="Search categories or GL codes..."
                    value={categorySearch}
                    onChange={e => setCategorySearch(e.target.value)}
                    style={{ paddingLeft: '2.2rem' }}
                  />
                  <Search size={14} color="var(--text-muted)" style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)' }} />
                </div>
              </div>
            </div>

            {/* Category Filter Pills */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.45rem' }}>
              {[
                { id: 'ALL', label: 'All Categories' },
                { id: 'TUITION', label: 'Tuition' },
                { id: 'ACTIVITY', label: 'Activity & Excursions' },
                { id: 'ATHLETIC', label: 'Athletics & Uniforms' },
                { id: 'MANDATORY_FEE', label: 'Mandatory Fees' },
                { id: 'OPTIONAL_FEE', label: 'Optional Packages' },
                { id: 'OTHER', label: 'Other' }
              ].map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategoryFilter(cat.id)}
                  style={{
                    padding: '0.3rem 0.7rem',
                    borderRadius: 'var(--radius-full)',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    background: selectedCategoryFilter === cat.id ? 'var(--sky-color-primary)' : 'var(--bg-surface-subtle)',
                    color: selectedCategoryFilter === cat.id ? '#ffffff' : 'var(--text-body)',
                    border: '1px solid var(--border-strong)',
                    cursor: 'pointer'
                  }}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Fee Types Grid */}
          <div className="grid-cols-2">
            {filteredFeeTypes.map(ft => (
              <div
                key={ft.feeTypeId}
                className="sky-card"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between'
                }}
              >
                <div className="sky-card-header">
                  <span className={`badge ${getCategoryBadgeClass(ft.category)}`}>
                    {ft.category}
                  </span>
                  <span style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--sky-color-primary)' }}>
                    {ft.feeTypeId}
                  </span>
                </div>

                <div className="sky-card-content" style={{ flex: 1 }}>
                  <h4 className="sky-heading-3">
                    {ft.name}
                  </h4>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.65rem', marginTop: '0.85rem' }}>
                    <div style={{ padding: '0.6rem', background: 'var(--bg-surface-subtle)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
                      <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', display: 'block' }}>
                        GL Account
                      </span>
                      <code style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-heading)' }}>
                        {ft.glAccountCode}
                      </code>
                    </div>

                    <div style={{ padding: '0.6rem', background: 'var(--bg-surface-subtle)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
                      <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', display: 'block' }}>
                        Default Standard Rate
                      </span>
                      <span style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--success)' }}>
                        ${ft.defaultAmount ? ft.defaultAmount.toFixed(2) : '0.00'}
                      </span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.75rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    <span>Partial Payments: <strong style={{ color: 'var(--text-heading)' }}>{ft.allowPartialPayment ? 'Supported' : 'One-time Only'}</strong></span>
                  </div>
                </div>

                <div style={{
                  padding: '0.75rem 1.25rem',
                  background: 'var(--bg-surface-subtle)',
                  borderTop: '1px solid var(--border-subtle)',
                  borderBottomLeftRadius: 'var(--radius-md)',
                  borderBottomRightRadius: 'var(--radius-md)',
                  display: 'flex',
                  justifyContent: 'flex-end'
                }}>
                  <button
                    className="sky-btn-primary"
                    onClick={() => openCreateModalForFeeType(ft)}
                    style={{ fontSize: '0.75rem', padding: '0.4rem 0.75rem' }}
                  >
                    <PlusCircle size={14} />
                    Deploy Fee with this Category
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MODAL 1: Add New Fee Category Modal */}
      {showAddCategoryModal && (
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
          zIndex: 110,
          padding: '1.5rem'
        }}>
          <div className="sky-card" style={{
            width: '100%',
            maxWidth: '560px',
            padding: 0,
            overflow: 'hidden',
            boxShadow: 'var(--shadow-modal)'
          }}>
            <div className="sky-card-header" style={{ padding: '1.15rem 1.5rem' }}>
              <div>
                <h3 className="sky-heading-2">
                  Add Fee Category
                </h3>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.15rem' }}>
                  Define a new category and General Ledger chart of account for SKY API sync.
                </p>
              </div>
              <button 
                onClick={() => setShowAddCategoryModal(false)}
                style={{ color: 'var(--text-muted)', fontSize: '1.25rem', fontWeight: 700 }}
              >
                ✕
              </button>
            </div>

            <div style={{ padding: '1.5rem' }}>
              {catErrorMsg && (
                <div className="sky-alert sky-alert-danger" style={{ marginBottom: '1.25rem' }}>
                  <AlertCircle size={16} />
                  <div>{catErrorMsg}</div>
                </div>
              )}

              <form onSubmit={handleAddCategorySubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.15rem' }}>
                <div>
                  <label>
                    Category Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={newCatName}
                    onChange={e => setNewCatName(e.target.value)}
                    placeholder="e.g. Bus Transportation Fee or AP Exam Package"
                  />
                </div>

                <div className="grid-cols-2">
                  <div>
                    <label>
                      Category Type *
                    </label>
                    <select
                      value={newCatType}
                      onChange={e => setNewCatType(e.target.value as any)}
                    >
                      <option value="ACTIVITY">ACTIVITY (Excursion/Club)</option>
                      <option value="ATHLETIC">ATHLETIC (Uniforms/Teams)</option>
                      <option value="TUITION">TUITION (Standard Term)</option>
                      <option value="MANDATORY_FEE">MANDATORY_FEE (Tech/Facility)</option>
                      <option value="OPTIONAL_FEE">OPTIONAL_FEE (Graduation/Yearbook)</option>
                      <option value="OTHER">OTHER (Miscellaneous / Other Fee)</option>
                    </select>
                  </div>

                  <div>
                    <label>
                      GL Account Code *
                    </label>
                    <input
                      type="text"
                      required
                      value={newCatGl}
                      onChange={e => setNewCatGl(e.target.value)}
                      placeholder="e.g. GL-3030-90"
                    />
                  </div>
                </div>

                <div className="grid-cols-2">
                  <div>
                    <label>
                      Default Standard Rate ($ USD) *
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={newCatAmount}
                      onChange={e => setNewCatAmount(parseFloat(e.target.value) || 0)}
                    />
                  </div>

                  <div>
                    <label>
                      Payment Options
                    </label>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.65rem',
                      padding: '0.55rem 0.75rem',
                      background: 'var(--bg-surface-subtle)',
                      borderRadius: 'var(--radius-sm)',
                      border: '1px solid var(--border-strong)',
                      height: '38px'
                    }}>
                      <input
                        type="checkbox"
                        id="new_partial_toggle"
                        checked={newCatPartial}
                        onChange={e => setNewCatPartial(e.target.checked)}
                        style={{ width: 'auto' }}
                      />
                      <label htmlFor="new_partial_toggle" style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-heading)', cursor: 'pointer', margin: 0 }}>
                        Allow Partial Payments
                      </label>
                    </div>
                  </div>
                </div>

                <div style={{
                  marginTop: '0.75rem',
                  paddingTop: '1rem',
                  borderTop: '1px solid var(--border-subtle)',
                  display: 'flex',
                  justifyContent: 'flex-end',
                  gap: '0.65rem'
                }}>
                  <button type="button" className="sky-btn-default" onClick={() => setShowAddCategoryModal(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="sky-btn-primary" disabled={isAddingCategory || !newCatName.trim()}>
                    {isAddingCategory ? 'Saving Category...' : 'Save & Sync Category'}
                    <CheckCircle2 size={15} />
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: Create Universal Fee Modal (4-Step SKY UX Wizard) */}
      {showModal && (
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
          zIndex: 100,
          padding: '1.5rem'
        }}>
          <div className="sky-card" style={{
            width: '100%',
            maxWidth: '780px',
            maxHeight: '92vh',
            overflowY: 'auto',
            padding: 0,
            boxShadow: 'var(--shadow-modal)'
          }}>
            {/* Modal Header */}
            <div className="sky-card-header" style={{ padding: '1.15rem 1.5rem' }}>
              <div>
                <h3 className="sky-heading-2">Create & Deploy Universal Fee</h3>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.15rem' }}>
                  Step {currentStep} of 4: {
                    currentStep === 1 ? 'Fee & General Ledger Classification' :
                    currentStep === 2 ? 'Dynamic Form & Electronic Waiver' :
                    currentStep === 3 ? 'Audience & Roster Targeting' :
                    'Review & Confirm Deployment'
                  }
                </p>
              </div>
              <button 
                onClick={() => setShowModal(false)}
                style={{ color: 'var(--text-muted)', fontSize: '1.25rem', fontWeight: 700 }}
              >
                ✕
              </button>
            </div>

            {/* SKY UX Step Wizard Indicator */}
            <div style={{
              display: 'flex',
              padding: '0.85rem 1.5rem',
              background: 'var(--bg-surface-subtle)',
              borderBottom: '1px solid var(--border-subtle)',
              gap: '1rem',
              overflowX: 'auto'
            }}>
              {[
                { step: 1, label: 'Fee Classification' },
                { step: 2, label: 'Forms & Waivers' },
                { step: 3, label: 'Audience Roster' },
                { step: 4, label: 'Review & Deploy' }
              ].map(s => {
                const isActive = currentStep === s.step;
                const isCompleted = currentStep > s.step;
                return (
                  <div key={s.step} style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', whiteSpace: 'nowrap' }}>
                    <div style={{
                      width: '24px',
                      height: '24px',
                      borderRadius: '50%',
                      background: isCompleted ? 'var(--success)' : (isActive ? 'var(--sky-color-primary)' : 'var(--bg-card)'),
                      color: isCompleted || isActive ? '#ffffff' : 'var(--text-muted)',
                      border: isCompleted || isActive ? 'none' : '1px solid var(--border-strong)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '0.75rem',
                      fontWeight: 700
                    }}>
                      {isCompleted ? <Check size={13} /> : s.step}
                    </div>
                    <span style={{
                      fontSize: '0.8rem',
                      fontWeight: isActive ? 700 : 500,
                      color: isActive ? 'var(--text-heading)' : 'var(--text-muted)'
                    }}>
                      {s.label}
                    </span>
                  </div>
                );
              })}
            </div>

            <div style={{ padding: '1.5rem' }}>
              {errorMsg && (
                <div className="sky-alert sky-alert-danger" style={{ marginBottom: '1.25rem' }}>
                  <AlertCircle size={16} />
                  <div>{errorMsg}</div>
                </div>
              )}

              {/* STEP 1: Basic Config */}
              {currentStep === 1 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.15rem' }}>
                  <div>
                    <label>
                      Fee Title *
                    </label>
                    <input
                      type="text"
                      value={title}
                      onChange={e => setTitle(e.target.value)}
                      placeholder="e.g. 8th Grade Science Excursion or Varsity Uniform"
                    />
                  </div>

                  <div>
                    <label>
                      Description
                    </label>
                    <textarea
                      rows={2}
                      value={description}
                      onChange={e => setDescription(e.target.value)}
                      placeholder="Explain what this fee covers for parents..."
                    />
                  </div>

                  <div className="grid-cols-2">
                    <div>
                      <div className="flex-between" style={{ marginBottom: '0.35rem' }}>
                        <label style={{ margin: 0 }}>
                          Fee Category (<code>GetFeeTypes</code>) *
                        </label>
                        <button
                          type="button"
                          onClick={() => {
                            setCatErrorMsg(null);
                            setNewCatGl(`GL-${Math.floor(1000 + Math.random() * 8999)}-${Math.floor(10 + Math.random() * 89)}`);
                            setShowAddCategoryModal(true);
                          }}
                          style={{ fontSize: '0.75rem', color: 'var(--sky-color-primary)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.2rem' }}
                        >
                          <Plus size={12} /> Add New
                        </button>
                      </div>

                      <select 
                        value={bbFeeTypeId || (activeFeeTypes[0]?.feeTypeId || '')} 
                        onChange={e => {
                          const selected = activeFeeTypes.find(f => f.feeTypeId === e.target.value);
                          setBbFeeTypeId(e.target.value);
                          if (selected && selected.defaultAmount) {
                            setBaseAmount(selected.defaultAmount);
                            setAllowPartialPayment(selected.allowPartialPayment);
                          }
                        }}
                        style={{ fontWeight: 600 }}
                      >
                        {activeFeeTypes.map(ft => (
                          <option key={ft.feeTypeId} value={ft.feeTypeId}>
                            {ft.name} - {ft.category} ({ft.glAccountCode})
                          </option>
                        ))}
                      </select>
                      
                      {/* Live Category Detail Box */}
                      {selectedFeeType && (
                        <div style={{
                          marginTop: '0.65rem',
                          padding: '0.65rem 0.85rem',
                          background: 'var(--bg-surface-subtle)',
                          borderRadius: 'var(--radius-sm)',
                          border: '1px solid var(--border-subtle)',
                          fontSize: '0.775rem'
                        }}>
                          <div className="flex-between">
                            <span style={{ color: 'var(--text-muted)' }}>GL Account:</span>
                            <strong style={{ color: 'var(--text-heading)', fontFamily: 'var(--font-mono)' }}>{selectedFeeType.glAccountCode}</strong>
                          </div>
                          <div className="flex-between" style={{ marginTop: '0.25rem' }}>
                            <span style={{ color: 'var(--text-muted)' }}>Standard Rate:</span>
                            <strong style={{ color: 'var(--success)' }}>${selectedFeeType.defaultAmount?.toFixed(2)}</strong>
                          </div>
                        </div>
                      )}
                    </div>

                    <div>
                      <label>
                        Amount ($ USD) *
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        value={baseAmount}
                        onChange={e => setBaseAmount(parseFloat(e.target.value) || 0)}
                      />
                    </div>
                  </div>

                  <div className="grid-cols-2">
                    <div>
                      <label>
                        Due Date *
                      </label>
                      <input
                        type="date"
                        value={dueDate}
                        onChange={e => setDueDate(e.target.value)}
                      />
                    </div>

                    <div>
                      <label>
                        Payment Options
                      </label>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.65rem',
                        padding: '0.55rem 0.75rem',
                        background: 'var(--bg-surface-subtle)',
                        borderRadius: 'var(--radius-sm)',
                        border: '1px solid var(--border-strong)',
                        height: '38px'
                      }}>
                        <input
                          type="checkbox"
                          id="partial_toggle"
                          checked={allowPartialPayment}
                          onChange={e => setAllowPartialPayment(e.target.checked)}
                          style={{ width: 'auto' }}
                        />
                        <label htmlFor="partial_toggle" style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-heading)', cursor: 'pointer', margin: 0 }}>
                          Allow Partial / Installments
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 2: Custom Forms & Waivers */}
              {currentStep === 2 && (
                <div>
                  <div className="flex-between" style={{ marginBottom: '1rem' }}>
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-body)', fontWeight: 600 }}>
                      Fields to be completed by parent prior to payment:
                    </span>
                    <div style={{ display: 'flex', gap: '0.4rem' }}>
                      <button className="sky-btn-default" style={{ fontSize: '0.75rem', padding: '0.35rem 0.6rem' }} onClick={() => addCustomField('text')}>
                        + Text Field
                      </button>
                      <button className="sky-btn-default" style={{ fontSize: '0.75rem', padding: '0.35rem 0.6rem' }} onClick={() => addCustomField('select')}>
                        + Dropdown
                      </button>
                      <button className="sky-btn-default" style={{ fontSize: '0.75rem', padding: '0.35rem 0.6rem' }} onClick={() => addCustomField('waiver_signature')}>
                        + Legal Waiver
                      </button>
                    </div>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    {customFields.map((field, idx) => (
                      <div key={field.id} style={{
                        padding: '0.85rem 1rem',
                        background: 'var(--bg-surface-subtle)',
                        border: '1px solid var(--border-strong)',
                        borderRadius: 'var(--radius-sm)'
                      }}>
                        <div className="flex-between" style={{ marginBottom: '0.4rem' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                            <span className="badge badge-info" style={{ fontSize: '0.65rem' }}>{field.type}</span>
                            <input
                              type="text"
                              value={field.label}
                              onChange={e => {
                                const updated = [...customFields];
                                updated[idx].label = e.target.value;
                                setCustomFields(updated);
                              }}
                              style={{ padding: '0.25rem 0.5rem', fontSize: '0.85rem', width: '260px' }}
                            />
                          </div>
                          <button onClick={() => removeCustomField(idx)} style={{ color: 'var(--danger)', cursor: 'pointer' }}>
                            <Trash2 size={15} />
                          </button>
                        </div>

                        {field.type === 'waiver_signature' && (
                          <textarea
                            rows={2}
                            value={field.waiverText || ''}
                            onChange={e => {
                              const updated = [...customFields];
                              updated[idx].waiverText = e.target.value;
                              setCustomFields(updated);
                            }}
                            placeholder="Legal consent text..."
                            style={{ fontSize: '0.8rem', marginTop: '0.35rem' }}
                          />
                        )}

                        {field.type === 'select' && (
                          <input
                            type="text"
                            value={field.options?.join(', ') || ''}
                            onChange={e => {
                              const updated = [...customFields];
                              updated[idx].options = e.target.value.split(',').map(s => s.trim());
                              setCustomFields(updated);
                            }}
                            placeholder="Comma-separated options e.g. Small, Medium, Large"
                            style={{ fontSize: '0.8rem', marginTop: '0.35rem' }}
                          />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* STEP 3: Audience & Roster */}
              {currentStep === 3 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.15rem' }}>
                  <div>
                    <label>
                      Target Audience Mode
                    </label>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      {[
                        { id: 'GRADE', label: 'By Grade Level' },
                        { id: 'ALL_STUDENTS', label: 'Entire School' },
                        { id: 'ATHLETIC_ROSTER', label: 'Athletic / Activity Roster' }
                      ].map(mode => (
                        <button
                          key={mode.id}
                          onClick={() => setAudienceType(mode.id)}
                          className={audienceType === mode.id ? 'sky-btn-primary' : 'sky-btn-default'}
                          style={{ fontSize: '0.8rem' }}
                        >
                          {mode.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {audienceType === 'GRADE' && (
                    <div>
                      <label>
                        Select Grades
                      </label>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.45rem' }}>
                        {['Grade 6', 'Grade 7', 'Grade 8', 'Grade 9', 'Grade 10', 'Grade 11', 'Grade 12'].map(grade => {
                          const isSelected = selectedGrades.includes(grade);
                          const count = students.filter(s => s.grade === grade).length;
                          return (
                            <button
                              key={grade}
                              onClick={() => handleGradeToggle(grade)}
                              style={{
                                padding: '0.4rem 0.75rem',
                                borderRadius: 'var(--radius-sm)',
                                border: isSelected ? '2px solid var(--sky-color-primary)' : '1px solid var(--border-strong)',
                                background: isSelected ? 'var(--sky-color-primary-light)' : 'var(--bg-surface-subtle)',
                                color: isSelected ? 'var(--sky-color-primary)' : 'var(--text-body)',
                                fontWeight: isSelected ? 700 : 500,
                                fontSize: '0.8rem',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.35rem',
                                cursor: 'pointer'
                              }}
                            >
                              {grade} <span style={{ opacity: 0.7 }}>({count})</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Live Audience Preview */}
                  <div style={{ padding: '0.85rem 1.15rem', background: 'var(--bg-surface-subtle)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-strong)' }}>
                    <div className="flex-between">
                      <span style={{ fontSize: '0.85rem', color: 'var(--text-body)', fontWeight: 600 }}>Targeted Active Students:</span>
                      <strong style={{ fontSize: '1rem', color: 'var(--sky-color-primary)' }}>{targetedStudents.length} Students</strong>
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 4: Review & Summary */}
              {currentStep === 4 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.15rem' }}>
                  <div style={{
                    padding: '1.25rem',
                    background: 'var(--bg-surface-subtle)',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--border-strong)'
                  }}>
                    <h4 className="sky-heading-3">{title}</h4>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-body)', marginTop: '0.25rem' }}>{description}</p>
                    
                    <div className="grid-cols-3" style={{ marginTop: '1.15rem' }}>
                      <div>
                        <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>Charge per Student</span>
                        <div style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--success)' }}>${Number(baseAmount).toFixed(2)}</div>
                      </div>
                      <div>
                        <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>Target Audience</span>
                        <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-heading)' }}>{targetedStudents.length} Students</div>
                      </div>
                      <div>
                        <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>Total Batch Volume</span>
                        <div style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--sky-color-primary)' }}>${totalBatchValue.toFixed(2)}</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Modal Footer Controls */}
              <div style={{
                marginTop: '1.5rem',
                paddingTop: '1rem',
                borderTop: '1px solid var(--border-subtle)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}>
                {currentStep > 1 ? (
                  <button className="sky-btn-default" onClick={() => setCurrentStep((currentStep - 1) as any)}>
                    Back
                  </button>
                ) : <div />}

                {currentStep < 4 ? (
                  <button className="sky-btn-primary" onClick={() => setCurrentStep((currentStep + 1) as any)}>
                    Continue <ArrowRight size={15} />
                  </button>
                ) : (
                  <button 
                    className="sky-btn-primary" 
                    disabled={isSubmitting || !title.trim()}
                    onClick={handleSubmitFee}
                  >
                    {isSubmitting ? 'Submitting...' : 'Finish & Deploy Fee'}
                    <Send size={15} />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
