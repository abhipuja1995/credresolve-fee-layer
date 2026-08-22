import React, { useState } from 'react';
import { 
  Search, 
  CheckCircle, 
  Clock, 
  CreditCard,
  FileCheck,
  Copy,
  Check
} from 'lucide-react';
import { StudentCharge, UniversalFeeDefinition } from '../types/index.js';

interface StudentLedgerViewProps {
  charges: StudentCharge[];
  fees: UniversalFeeDefinition[];
  onOpenCheckout: (chargeId: string) => void;
}

export const StudentLedgerView: React.FC<StudentLedgerViewProps> = ({
  charges,
  fees,
  onOpenCheckout
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFeeFilter, setSelectedFeeFilter] = useState<string>('ALL');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>('ALL');
  const [copiedChargeId, setCopiedChargeId] = useState<string | null>(null);

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

      {/* Filter Bar */}
      <div className="card-panel" style={{ padding: '1.25rem 1.5rem' }}>
        <div className="grid-cols-3" style={{ alignItems: 'center' }}>
          {/* Search Box */}
          <div style={{ position: 'relative' }}>
            <input
              type="text"
              placeholder="Search student, ID, parent email..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              style={{ paddingLeft: '2.25rem' }}
            />
            <Search size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)' }} />
          </div>

          {/* Fee Filter */}
          <div>
            <select value={selectedFeeFilter} onChange={e => setSelectedFeeFilter(e.target.value)}>
              <option value="ALL">All Fees / Categories</option>
              {fees.map(f => (
                <option key={f.id} value={f.id}>{f.title}</option>
              ))}
            </select>
          </div>

          {/* Payment Status Filter */}
          <div>
            <select value={selectedStatusFilter} onChange={e => setSelectedStatusFilter(e.target.value)}>
              <option value="ALL">All Payment Statuses</option>
              <option value="UNPAID">Unpaid Only</option>
              <option value="PARTIALLY_PAID">Partially Paid</option>
              <option value="PAID">Fully Paid</option>
            </select>
          </div>
        </div>
      </div>

      {/* Charges Table */}
      <div className="card-panel" style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', minWidth: '1080px', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border-subtle)', background: 'var(--bg-surface-elevated)', color: 'var(--text-muted)' }}>
              <th style={{ padding: '0.9rem 1.25rem', fontWeight: 700, textTransform: 'uppercase', fontSize: '0.75rem', whiteSpace: 'nowrap' }}>Student & Family</th>
              <th style={{ padding: '0.9rem 1rem', fontWeight: 700, textTransform: 'uppercase', fontSize: '0.75rem', whiteSpace: 'nowrap' }}>Fee Item</th>
              <th style={{ padding: '0.9rem 1rem', fontWeight: 700, textTransform: 'uppercase', fontSize: '0.75rem', whiteSpace: 'nowrap' }}>Total Obligation</th>
              <th style={{ padding: '0.9rem 1rem', fontWeight: 700, textTransform: 'uppercase', fontSize: '0.75rem', whiteSpace: 'nowrap' }}>Paid Balance</th>
              <th style={{ padding: '0.9rem 1rem', fontWeight: 700, textTransform: 'uppercase', fontSize: '0.75rem', whiteSpace: 'nowrap' }}>Status</th>
              <th style={{ padding: '0.9rem 1rem', fontWeight: 700, textTransform: 'uppercase', fontSize: '0.75rem', whiteSpace: 'nowrap' }}>Blackbaud Sync</th>
              <th style={{ padding: '0.9rem 1.25rem', fontWeight: 700, textTransform: 'uppercase', fontSize: '0.75rem', textAlign: 'right', whiteSpace: 'nowrap' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredCharges.length === 0 ? (
              <tr>
                <td colSpan={7} style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                  No student charges match the selected filter criteria.
                </td>
              </tr>
            ) : (
              filteredCharges.map(c => {
                const remaining = c.amount - c.amountPaid;
                const isCopied = copiedChargeId === c.id;

                return (
                  <tr key={c.id} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                    <td style={{ padding: '1rem 1.25rem', whiteSpace: 'nowrap' }}>
                      <strong style={{ color: 'var(--text-heading)', display: 'block', fontSize: '0.95rem' }}>{c.studentName}</strong>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                        {c.studentId} • {c.parentEmail}
                      </span>
                    </td>

                    <td style={{ padding: '1rem 1rem', whiteSpace: 'nowrap' }}>
                      <div style={{ color: 'var(--text-heading)', fontWeight: 700 }}>{c.feeTitle}</div>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Due: {c.dueDate}</span>
                    </td>

                    <td style={{ padding: '1rem 1rem', fontWeight: 800, color: 'var(--text-heading)', whiteSpace: 'nowrap' }}>
                      ${c.amount.toFixed(2)}
                    </td>

                    <td style={{ padding: '1rem 1rem', whiteSpace: 'nowrap' }}>
                      <div style={{ display: 'inline-flex', alignItems: 'baseline', gap: '0.45rem' }}>
                        <span style={{ color: c.amountPaid > 0 ? 'var(--success)' : 'var(--text-muted)', fontWeight: 800 }}>
                          ${c.amountPaid.toFixed(2)}
                        </span>
                        {remaining > 0 && c.amountPaid > 0 && (
                          <span style={{ fontSize: '0.775rem', color: 'var(--warning)', fontWeight: 600 }}>
                            (${remaining.toFixed(2)} left)
                          </span>
                        )}
                      </div>
                    </td>

                    <td style={{ padding: '1rem 1rem', whiteSpace: 'nowrap' }}>
                      {c.paymentStatus === 'PAID' && <span className="badge badge-success">Paid</span>}
                      {c.paymentStatus === 'PARTIALLY_PAID' && <span className="badge badge-warning">Partial</span>}
                      {c.paymentStatus === 'UNPAID' && <span className="badge badge-neutral">Unpaid</span>}
                    </td>

                    <td style={{ padding: '1rem 1rem', whiteSpace: 'nowrap' }}>
                      {c.bbSyncStatus === 'SYNCED' ? (
                        <span className="badge badge-success" style={{ fontSize: '0.75rem', padding: '0.3rem 0.65rem' }}>
                          <CheckCircle size={12} /> Synced (BB Ledger)
                        </span>
                      ) : (
                        <span className="badge badge-warning" style={{ fontSize: '0.75rem', padding: '0.3rem 0.65rem' }}>
                          <Clock size={12} /> {c.bbSyncStatus}
                        </span>
                      )}
                    </td>

                    <td style={{ padding: '1rem 1.25rem', textAlign: 'right', whiteSpace: 'nowrap' }}>
                      <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'flex-end', gap: '0.5rem' }}>
                        {/* Copy Payment Link Button */}
                        <button
                          className="btn-secondary"
                          onClick={(e) => handleCopyLink(c.id, e)}
                          title="Copy direct 1-click payment link"
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
                            onClick={() => onOpenCheckout(c.id)}
                            style={{ padding: '0.45rem 0.95rem', fontSize: '0.8rem' }}
                          >
                            <CreditCard size={14} /> Pay Now
                          </button>
                        ) : (
                          <button
                            className="btn-secondary"
                            onClick={() => onOpenCheckout(c.id)}
                            style={{ padding: '0.45rem 0.95rem', fontSize: '0.8rem' }}
                          >
                            <FileCheck size={14} /> Receipt
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
    </div>
  );
};
