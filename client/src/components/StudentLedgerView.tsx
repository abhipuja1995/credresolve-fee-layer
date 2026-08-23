import React, { useState } from 'react';
import { 
  Search, 
  CheckCircle, 
  Clock, 
  CreditCard, 
  FileCheck, 
  Copy, 
  Check,
  X
} from 'lucide-react';
import { StudentCharge, UniversalFeeDefinition, SchoolBranding } from '../types/index.js';
import { PayerCheckout } from './PayerCheckout.js';

interface StudentLedgerViewProps {
  charges: StudentCharge[];
  fees: UniversalFeeDefinition[];
  onOpenCheckout?: (chargeId: string) => void;
  branding?: SchoolBranding;
  onPaymentCompleted?: () => void;
}

export const StudentLedgerView: React.FC<StudentLedgerViewProps> = ({
  charges,
  fees,
  onOpenCheckout,
  branding,
  onPaymentCompleted
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFeeFilter, setSelectedFeeFilter] = useState<string>('ALL');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>('ALL');
  const [copiedChargeId, setCopiedChargeId] = useState<string | null>(null);
  const [activeModalChargeId, setActiveModalChargeId] = useState<string | null>(null);

  const filteredCharges = charges.filter(charge => {
    const matchesSearch = 
      charge.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      charge.studentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      charge.parentEmail.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFee = selectedFeeFilter === 'ALL' || charge.feeId === selectedFeeFilter;
    const matchesStatus = selectedStatusFilter === 'ALL' || charge.paymentStatus === selectedStatusFilter;

    return matchesSearch && matchesFee && matchesStatus;
  });

  const totalOutstanding = filteredCharges.reduce((acc, c) => acc + (c.amount - c.amountPaid), 0);
  const totalCollected = filteredCharges.reduce((acc, c) => acc + c.amountPaid, 0);

  const handleCopyLink = (chargeId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const url = `${window.location.origin}/?chargeId=${chargeId}`;
    navigator.clipboard.writeText(url);
    setCopiedChargeId(chargeId);
    setTimeout(() => {
      setCopiedChargeId(null);
    }, 2000);
  };

  const handleOpenReceiptOrCheckout = (chargeId: string) => {
    setActiveModalChargeId(chargeId);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Metrics Banner */}
      <div className="grid-cols-3">
        <div className="card-panel" style={{ padding: '1.5rem' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>
            Total Subledger Obligations
          </span>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, marginTop: '0.35rem', color: 'var(--text-heading)' }}>
            {filteredCharges.length} Charges
          </div>
        </div>

        <div className="card-panel" style={{ padding: '1.5rem' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>
            Total Reconciled Collections
          </span>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--success)', marginTop: '0.35rem' }}>
            ${totalCollected.toFixed(2)}
          </div>
        </div>

        <div className="card-panel" style={{ padding: '1.5rem' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>
            Outstanding Receivables
          </span>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--warning)', marginTop: '0.35rem' }}>
            ${totalOutstanding.toFixed(2)}
          </div>
        </div>
      </div>

      {/* Filters & Search Controls */}
      <div className="card-panel" style={{ padding: '1.25rem 1.5rem' }}>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
          <div style={{ position: 'relative', flex: 1, minWidth: '260px' }}>
            <input
              type="text"
              placeholder="Search by student name, roll number, or parent email..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              style={{ paddingLeft: '2.5rem', width: '100%' }}
            />
            <Search size={18} color="var(--text-muted)" style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)' }} />
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <select
              value={selectedFeeFilter}
              onChange={e => setSelectedFeeFilter(e.target.value)}
              style={{ padding: '0.65rem 1rem', fontSize: '0.875rem' }}
            >
              <option value="ALL">All Fee Programs</option>
              {fees.map(f => (
                <option key={f.id} value={f.id}>{f.title}</option>
              ))}
            </select>

            <select
              value={selectedStatusFilter}
              onChange={e => setSelectedStatusFilter(e.target.value)}
              style={{ padding: '0.65rem 1rem', fontSize: '0.875rem' }}
            >
              <option value="ALL">All Payment Statuses</option>
              <option value="PAID">Paid in Full</option>
              <option value="PARTIALLY_PAID">Partially Paid</option>
              <option value="UNPAID">Unpaid</option>
            </select>
          </div>
        </div>
      </div>

      {/* Charges Subledger Table */}
      <div className="card-panel" style={{ padding: '0', overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
          <thead>
            <tr style={{ background: 'var(--bg-surface-elevated)', borderBottom: '1px solid var(--border-subtle)' }}>
              <th style={{ padding: '1rem 1.25rem', fontWeight: 700, color: 'var(--text-muted)' }}>Student / Payer</th>
              <th style={{ padding: '1rem 1rem', fontWeight: 700, color: 'var(--text-muted)' }}>Fee Program</th>
              <th style={{ padding: '1rem 1rem', fontWeight: 700, color: 'var(--text-muted)' }}>Due Date</th>
              <th style={{ padding: '1rem 1rem', fontWeight: 700, color: 'var(--text-muted)' }}>Amount / Balance</th>
              <th style={{ padding: '1rem 1rem', fontWeight: 700, color: 'var(--text-muted)' }}>Payment Status</th>
              <th style={{ padding: '1rem 1rem', fontWeight: 700, color: 'var(--text-muted)' }}>Blackbaud Sync</th>
              <th style={{ padding: '1rem 1.25rem', fontWeight: 700, color: 'var(--text-muted)', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredCharges.length === 0 ? (
              <tr>
                <td colSpan={7} style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                  No student charges match the applied search and filter criteria.
                </td>
              </tr>
            ) : (
              filteredCharges.map(c => {
                const remaining = c.amount - c.amountPaid;
                const isCopied = copiedChargeId === c.id;

                return (
                  <tr key={c.id} style={{ borderBottom: '1px solid var(--border-subtle)', transition: 'background 0.15s' }}>
                    <td style={{ padding: '1rem 1.25rem' }}>
                      <div style={{ fontWeight: 700, color: 'var(--text-heading)' }}>{c.studentName}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                        {c.studentId} • {c.parentEmail}
                      </div>
                    </td>

                    <td style={{ padding: '1rem 1rem' }}>
                      <div style={{ fontWeight: 600, color: 'var(--text-heading)' }}>{c.feeTitle}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>GL: {c.bbFeeTypeId}</div>
                    </td>

                    <td style={{ padding: '1rem 1rem', whiteSpace: 'nowrap', color: 'var(--text-muted)' }}>
                      {c.dueDate}
                    </td>

                    <td style={{ padding: '1rem 1rem', whiteSpace: 'nowrap' }}>
                      <div style={{ fontWeight: 700, color: 'var(--text-heading)' }}>${c.amount.toFixed(2)}</div>
                      {remaining > 0 ? (
                        <div style={{ fontSize: '0.75rem', color: 'var(--warning)', fontWeight: 600 }}>
                          ${remaining.toFixed(2)} due
                        </div>
                      ) : (
                        <div style={{ fontSize: '0.75rem', color: 'var(--success)', fontWeight: 600 }}>
                          Paid (${c.amountPaid.toFixed(2)})
                        </div>
                      )}
                    </td>

                    <td style={{ padding: '1rem 1rem', whiteSpace: 'nowrap' }}>
                      {c.paymentStatus === 'PAID' && <span className="badge badge-success">Paid</span>}
                      {c.paymentStatus === 'PARTIALLY_PAID' && <span className="badge badge-warning">Partial</span>}
                      {c.paymentStatus === 'UNPAID' && <span className="badge badge-neutral">Unpaid</span>}
                    </td>

                    <td style={{ padding: '1rem 1rem', whiteSpace: 'nowrap' }}>
                      {c.bbSyncStatus === 'SYNCED' ? (
                        <span className="badge badge-success" style={{ fontSize: '0.75rem', padding: '0.3rem 0.65rem' }}>
                          <CheckCircle size={12} /> Synced
                        </span>
                      ) : (
                        <span className="badge badge-warning" style={{ fontSize: '0.75rem', padding: '0.3rem 0.65rem' }}>
                          <Clock size={12} /> {c.bbSyncStatus}
                        </span>
                      )}
                    </td>

                    <td style={{ padding: '1rem 1.25rem', textAlign: 'right', whiteSpace: 'nowrap' }}>
                      <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'flex-end', gap: '0.5rem' }}>
                        <button
                          className="btn-secondary"
                          onClick={(e) => handleCopyLink(c.id, e)}
                          title="Copy direct payment link"
                          style={{
                            padding: '0.45rem 0.75rem',
                            fontSize: '0.8rem',
                            color: isCopied ? 'var(--success)' : 'var(--text-heading)',
                            borderColor: isCopied ? 'var(--success)' : 'var(--border-subtle)'
                          }}
                        >
                          {isCopied ? <Check size={14} color="var(--success)" /> : <Copy size={14} />}
                          <span>{isCopied ? 'Copied!' : 'Copy Link'}</span>
                        </button>

                        {c.paymentStatus !== 'PAID' ? (
                          <button
                            className="btn-primary"
                            onClick={() => handleOpenReceiptOrCheckout(c.id)}
                            style={{ padding: '0.45rem 0.95rem', fontSize: '0.8rem' }}
                          >
                            <CreditCard size={14} /> Pay Now
                          </button>
                        ) : (
                          <button
                            className="btn-secondary"
                            onClick={() => handleOpenReceiptOrCheckout(c.id)}
                            style={{ padding: '0.45rem 0.95rem', fontSize: '0.8rem', borderColor: 'var(--success)', color: 'var(--success)' }}
                          >
                            <FileCheck size={14} color="var(--success)" /> View Receipt
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Direct In-Place Receipt & Checkout Modal */}
      {activeModalChargeId && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.75)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 110,
          padding: '1.5rem',
          overflowY: 'auto'
        }}>
          <div style={{ width: '100%', maxWidth: '720px', maxHeight: '90vh', overflowY: 'auto' }}>
            <PayerCheckout
              chargeId={activeModalChargeId}
              onBackToLedger={() => setActiveModalChargeId(null)}
              onPaymentCompleted={() => {
                if (onPaymentCompleted) onPaymentCompleted();
              }}
              branding={branding}
            />
          </div>
        </div>
      )}
    </div>
  );
};
