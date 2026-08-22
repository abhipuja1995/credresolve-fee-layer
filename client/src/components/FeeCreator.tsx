import React, { useState } from 'react';
import { 
  PlusCircle, 
  Layers, 
  Trash2, 
  AlertCircle, 
  ArrowRight, 
  Send
} from 'lucide-react';
import { 
  BlackbaudFeeType, 
  UniversalFeeDefinition, 
  FormFieldSchema, 
  StudentAccount 
} from '../types/index.js';
import { api } from '../services/api.js';

interface FeeCreatorProps {
  feeTypes: BlackbaudFeeType[];
  existingFees: UniversalFeeDefinition[];
  students: StudentAccount[];
  onFeeCreated: () => void;
}

export const FeeCreator: React.FC<FeeCreatorProps> = ({
  feeTypes,
  existingFees,
  students,
  onFeeCreated
}) => {
  const [showModal, setShowModal] = useState(false);
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Form State
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [bbFeeTypeId, setBbFeeTypeId] = useState(feeTypes[0]?.feeTypeId || 'FT-TRIP-03');
  const [baseAmount, setBaseAmount] = useState<number>(125.00);
  const [dueDate, setDueDate] = useState('2026-09-30');
  const [allowPartialPayment, setAllowPartialPayment] = useState(true);
  const [minPartialAmount, setMinPartialAmount] = useState<number>(50.00);
  
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

  // Calculations
  const selectedFeeType = feeTypes.find(f => f.feeTypeId === bbFeeTypeId) || feeTypes[0];
  
  const targetedStudents = students.filter(s => {
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

  const handleSubmitFee = async () => {
    setIsSubmitting(true);
    setErrorMsg(null);
    try {
      await api.createFee({
        title,
        description,
        bbFeeTypeId,
        baseAmount: Number(baseAmount),
        dueDate,
        academicYear: '2026-2027',
        allowPartialPayment,
        minPartialAmount: allowPartialPayment ? Number(minPartialAmount) : undefined,
        audience: {
          type: audienceType,
          grades: audienceType === 'GRADE' ? selectedGrades : undefined
        },
        customFormSchema: customFields
      });

      setShowModal(false);
      setCurrentStep(1);
      setTitle('');
      setDescription('');
      onFeeCreated();
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to deploy fee and post batch.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Top Banner / Action Bar */}
      <div className="card-panel" style={{
        padding: '1.75rem 2rem',
        background: 'var(--accent-gradient-card)',
        border: '1px solid var(--border-accent)'
      }}>
        <div className="flex-between" style={{ flexWrap: 'wrap', gap: '1.5rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-heading)' }}>
                Universal Fee Studio
              </h2>
              <span className="badge badge-info">Blackbaud Synchronized</span>
            </div>
            <p style={{ color: 'var(--text-body)', marginTop: '0.4rem', maxWidth: '650px', fontSize: '0.925rem', lineHeight: '1.5' }}>
              Create, configure, and post non-tuition fees directly into Blackbaud Billing Management subledgers using automated batch ingestion with dynamic custom forms and waivers.
            </p>
          </div>
          <button 
            className="btn-primary" 
            onClick={() => {
              setTitle('9th Grade STEM Robotics & Lab Kit');
              setDescription('Consumables kit and hardware access for Term 1 STEM Robotics curriculum.');
              setShowModal(true);
            }}
            style={{ padding: '0.75rem 1.5rem', fontSize: '0.95rem' }}
          >
            <PlusCircle size={18} />
            Create Universal Fee
          </button>
        </div>
      </div>

      {/* Existing Deployed Fees List */}
      <div>
        <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-heading)', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Layers size={20} color="var(--accent-primary)" />
          Active Deployed Fees ({existingFees.length})
        </h3>

        <div className="grid-cols-2">
          {existingFees.map(fee => {
            const feeType = feeTypes.find(f => f.feeTypeId === fee.bbFeeTypeId);
            return (
              <div key={fee.id} className="card-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <div className="flex-between" style={{ marginBottom: '0.75rem' }}>
                    <span className="badge badge-success">{fee.status}</span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', fontWeight: 600 }}>
                      {fee.bbFeeTypeId}
                    </span>
                  </div>

                  <h4 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-heading)' }}>
                    {fee.title}
                  </h4>
                  <p style={{ color: 'var(--text-body)', fontSize: '0.875rem', marginTop: '0.4rem', lineHeight: '1.4' }}>
                    {fee.description}
                  </p>

                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '1.25rem' }}>
                    <div style={{
                      padding: '0.35rem 0.65rem',
                      background: 'var(--bg-surface-elevated)',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: 'var(--radius-sm)',
                      fontSize: '0.8rem',
                      color: 'var(--text-body)'
                    }}>
                      GL: <strong style={{ color: 'var(--text-heading)' }}>{feeType?.glAccountCode || 'GL-1010-00'}</strong>
                    </div>

                    <div style={{
                      padding: '0.35rem 0.65rem',
                      background: 'var(--bg-surface-elevated)',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: 'var(--radius-sm)',
                      fontSize: '0.8rem',
                      color: 'var(--text-body)'
                    }}>
                      Audience: <strong style={{ color: 'var(--text-heading)' }}>
                        {fee.audience.type === 'GRADE' ? fee.audience.grades?.join(', ') : fee.audience.type}
                      </strong>
                    </div>

                    <div style={{
                      padding: '0.35rem 0.65rem',
                      background: 'var(--bg-surface-elevated)',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: 'var(--radius-sm)',
                      fontSize: '0.8rem',
                      color: 'var(--text-body)'
                    }}>
                      Custom Fields: <strong style={{ color: 'var(--text-heading)' }}>{fee.customFormSchema.length}</strong>
                    </div>
                  </div>
                </div>

                <div className="flex-between" style={{ marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid var(--border-subtle)' }}>
                  <div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>Amount</span>
                    <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--success)' }}>
                      ${fee.baseAmount.toFixed(2)}
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>Due Date</span>
                    <div style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-heading)' }}>{fee.dueDate}</div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Creation Modal */}
      {showModal && (
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
          zIndex: 100,
          padding: '1.5rem'
        }}>
          <div className="card-panel" style={{
            width: '100%',
            maxWidth: '780px',
            maxHeight: '90vh',
            overflowY: 'auto',
            padding: '2rem',
            background: 'var(--bg-card)',
            border: '1px solid var(--border-strong)',
            boxShadow: 'var(--shadow-lg)'
          }}>
            {/* Modal Header & Step Indicator */}
            <div className="flex-between" style={{ marginBottom: '1.5rem' }}>
              <div>
                <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-heading)' }}>Create & Deploy Universal Fee</h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  Step {currentStep} of 4: {
                    currentStep === 1 ? 'Fee & General Ledger Classification' :
                    currentStep === 2 ? 'Dynamic Form & Electronic Waiver' :
                    currentStep === 3 ? 'Audience & Roster Targeting' :
                    'Review & Auto-Inject Batch to Blackbaud'
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

            {/* Steps Progress Bar */}
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '2rem' }}>
              {[1, 2, 3, 4].map(s => (
                <div 
                  key={s} 
                  style={{ 
                    flex: 1, 
                    height: '4px', 
                    borderRadius: '2px', 
                    background: currentStep >= s ? 'var(--accent-primary)' : 'var(--border-subtle)' 
                  }} 
                />
              ))}
            </div>

            {errorMsg && (
              <div style={{
                background: 'var(--danger-bg)',
                border: '1px solid var(--danger-border)',
                padding: '0.85rem 1rem',
                borderRadius: 'var(--radius-md)',
                color: 'var(--danger-text)',
                marginBottom: '1.5rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                fontSize: '0.875rem'
              }}>
                <AlertCircle size={18} />
                {errorMsg}
              </div>
            )}

            {/* STEP 1: Basic Config */}
            {currentStep === 1 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-heading)', marginBottom: '0.4rem' }}>
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
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-heading)', marginBottom: '0.4rem' }}>
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
                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-heading)', marginBottom: '0.4rem' }}>
                      Blackbaud Fee Category (<code>GetFeeTypes</code>) *
                    </label>
                    <select value={bbFeeTypeId} onChange={e => setBbFeeTypeId(e.target.value)}>
                      {feeTypes.map(ft => (
                        <option key={ft.feeTypeId} value={ft.feeTypeId}>
                          {ft.name} ({ft.category})
                        </option>
                      ))}
                    </select>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.3rem', display: 'block' }}>
                      Mapped GL Account: <strong>{selectedFeeType?.glAccountCode}</strong>
                    </span>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-heading)', marginBottom: '0.4rem' }}>
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
                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-heading)', marginBottom: '0.4rem' }}>
                      Due Date *
                    </label>
                    <input
                      type="date"
                      value={dueDate}
                      onChange={e => setDueDate(e.target.value)}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-heading)', marginBottom: '0.4rem' }}>
                      Payment Options
                    </label>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.75rem',
                      padding: '0.65rem 0.9rem',
                      background: 'var(--bg-surface-elevated)',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--border-strong)'
                    }}>
                      <input
                        type="checkbox"
                        id="partial_toggle"
                        checked={allowPartialPayment}
                        onChange={e => setAllowPartialPayment(e.target.checked)}
                        style={{ width: 'auto' }}
                      />
                      <label htmlFor="partial_toggle" style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-heading)', cursor: 'pointer' }}>
                        Allow Partial / Installment Payments
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
                  <span style={{ fontSize: '0.9rem', color: 'var(--text-body)', fontWeight: 600 }}>
                    Fields to be completed by parent prior to payment:
                  </span>
                  <div style={{ display: 'flex', gap: '0.4rem' }}>
                    <button className="btn-secondary" style={{ fontSize: '0.75rem', padding: '0.4rem 0.65rem' }} onClick={() => addCustomField('text')}>
                      + Text Field
                    </button>
                    <button className="btn-secondary" style={{ fontSize: '0.75rem', padding: '0.4rem 0.65rem' }} onClick={() => addCustomField('select')}>
                      + Dropdown
                    </button>
                    <button className="btn-secondary" style={{ fontSize: '0.75rem', padding: '0.4rem 0.65rem' }} onClick={() => addCustomField('waiver_signature')}>
                      + Legal Waiver
                    </button>
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                  {customFields.map((field, idx) => (
                    <div key={field.id} style={{
                      padding: '1rem',
                      background: 'var(--bg-surface-elevated)',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: 'var(--radius-md)'
                    }}>
                      <div className="flex-between" style={{ marginBottom: '0.5rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <span className="badge badge-info" style={{ fontSize: '0.65rem' }}>{field.type}</span>
                          <input
                            type="text"
                            value={field.label}
                            onChange={e => {
                              const updated = [...customFields];
                              updated[idx].label = e.target.value;
                              setCustomFields(updated);
                            }}
                            style={{ padding: '0.3rem 0.6rem', fontSize: '0.85rem', width: '280px' }}
                          />
                        </div>
                        <button onClick={() => removeCustomField(idx)} style={{ color: 'var(--danger)' }}>
                          <Trash2 size={16} />
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
                          style={{ fontSize: '0.8rem', marginTop: '0.4rem' }}
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
                          style={{ fontSize: '0.8rem', marginTop: '0.4rem' }}
                        />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* STEP 3: Audience & Roster */}
            {currentStep === 3 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-heading)', marginBottom: '0.5rem' }}>
                    Target Audience Mode
                  </label>
                  <div style={{ display: 'flex', gap: '0.75rem' }}>
                    {[
                      { id: 'GRADE', label: 'By Grade Level' },
                      { id: 'ALL_STUDENTS', label: 'Entire School' },
                      { id: 'ATHLETIC_ROSTER', label: 'Athletic / Activity Roster' }
                    ].map(mode => (
                      <button
                        key={mode.id}
                        onClick={() => setAudienceType(mode.id)}
                        className={audienceType === mode.id ? 'btn-primary' : 'btn-secondary'}
                        style={{ fontSize: '0.85rem' }}
                      >
                        {mode.label}
                      </button>
                    ))}
                  </div>
                </div>

                {audienceType === 'GRADE' && (
                  <div>
                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-heading)', marginBottom: '0.5rem' }}>
                      Select Grades
                    </label>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                      {['Grade 6', 'Grade 7', 'Grade 8', 'Grade 9', 'Grade 10', 'Grade 11', 'Grade 12'].map(grade => {
                        const isSelected = selectedGrades.includes(grade);
                        const count = students.filter(s => s.grade === grade).length;
                        return (
                          <button
                            key={grade}
                            onClick={() => handleGradeToggle(grade)}
                            style={{
                              padding: '0.5rem 0.85rem',
                              borderRadius: 'var(--radius-md)',
                              border: isSelected ? '2px solid var(--accent-primary)' : '1px solid var(--border-subtle)',
                              background: isSelected ? 'var(--accent-light)' : 'var(--bg-surface-elevated)',
                              color: isSelected ? 'var(--accent-primary)' : 'var(--text-body)',
                              fontWeight: isSelected ? 700 : 500,
                              fontSize: '0.85rem',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '0.45rem'
                            }}
                          >
                            {grade} <span style={{ opacity: 0.7 }}>({count} students)</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Live Audience Preview */}
                <div style={{ padding: '1rem', background: 'var(--bg-surface-elevated)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
                  <div className="flex-between">
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-body)', fontWeight: 600 }}>Targeted Active Students:</span>
                    <strong style={{ fontSize: '1.1rem', color: 'var(--accent-primary)' }}>{targetedStudents.length} Students</strong>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 4: Review & Ingestion Pipeline Summary */}
            {currentStep === 4 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div style={{
                  padding: '1.25rem',
                  background: 'var(--accent-gradient-card)',
                  borderRadius: 'var(--radius-lg)',
                  border: '1px solid var(--border-accent)'
                }}>
                  <h4 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-heading)', marginBottom: '0.5rem' }}>{title}</h4>
                  <p style={{ fontSize: '0.875rem', color: 'var(--text-body)' }}>{description}</p>
                  
                  <div className="grid-cols-3" style={{ marginTop: '1.25rem' }}>
                    <div>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>Charge per Student</span>
                      <div style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--success)' }}>${Number(baseAmount).toFixed(2)}</div>
                    </div>
                    <div>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>Target Audience</span>
                      <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-heading)' }}>{targetedStudents.length} Students</div>
                    </div>
                    <div>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>Total Batch Volume</span>
                      <div style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--accent-primary)' }}>${totalBatchValue.toFixed(2)}</div>
                    </div>
                  </div>
                </div>

                {/* Blackbaud Ingestion Pipeline Specifications */}
                <div style={{
                  padding: '1rem 1.25rem',
                  background: 'var(--bg-surface-elevated)',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-subtle)',
                  fontSize: '0.85rem'
                }}>
                  <div style={{ fontWeight: 700, marginBottom: '0.4rem', color: 'var(--text-heading)' }}>
                    ⚡ Blackbaud SKY API Auto-Injection Pipeline:
                  </div>
                  <ul style={{ paddingLeft: '1.2rem', color: 'var(--text-body)', lineHeight: '1.6' }}>
                    <li>Fee Category: <strong>{selectedFeeType?.name}</strong> (GL: <code>{selectedFeeType?.glAccountCode}</code>)</li>
                    <li>Asynchronous Batch: Calls <code>CreateChargeImportBatch</code> with chunking (≤ 500 records/batch).</li>
                    <li>Status Polling: Enqueues job with real-time polling on <code>GetTransactionBatchImportSummary</code>.</li>
                  </ul>
                </div>
              </div>
            )}

            {/* Modal Footer Controls */}
            <div className="flex-between" style={{ marginTop: '2rem', paddingTop: '1.25rem', borderTop: '1px solid var(--border-subtle)' }}>
              {currentStep > 1 ? (
                <button className="btn-secondary" onClick={() => setCurrentStep((currentStep - 1) as any)}>
                  Back
                </button>
              ) : <div />}

              {currentStep < 4 ? (
                <button className="btn-primary" onClick={() => setCurrentStep((currentStep + 1) as any)}>
                  Continue <ArrowRight size={16} />
                </button>
              ) : (
                <button 
                  className="btn-primary" 
                  disabled={isSubmitting || !title || targetedStudents.length === 0}
                  onClick={handleSubmitFee}
                >
                  {isSubmitting ? 'Posting Batch to Blackbaud...' : 'Deploy & Post Batch to Blackbaud'}
                  <Send size={16} />
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
