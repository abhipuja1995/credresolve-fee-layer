import React, { useState } from 'react';
import { 
  Search, 
  CheckCircle, 
  Clock, 
  CreditCard, 
  FileCheck, 
  Copy, 
  Check,
  X,
  Filter,
  DollarSign,
  Receipt,
  Users
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
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* SKY UX Page Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Accounts Receivable & Subledgers
          </div>
          <h2 className="sky-heading-1" style={{ marginTop: '0.15rem' }}>
            Student Account Subledgers
          </h2>
          <p className="sky-font-deemphasized" style={{ marginTop: '0.25rem' }}>
            Reconcile parent payments, review active receivables, and inspect synchronous SKY API subledger entries.
          </p>
        </div>
      </div>

      {/* SKY UX Summary Tiles Row */}
      <div className="grid-cols-3">
        <div className="sky-summary-tile">
          <span className="sky-summary-tile-label">
            Active Obligations
          </span>
          <div className="sky-summary-tile-value">
            {filteredCharges.length} <span style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-muted)' }}>charges</span>
          </div>
        </div>

        <div className="sky-summary-tile">
          <span className="sky-summary-tile-label">
            Reconciled Collections
          </span>
          <div className="sky-summary-tile-value" style={{ color: 'var(--success)' }}>
            ${totalCollected.toFixed(2)}
          </div>
        </div>

        <div className="sky-summary-tile">
          <span className="sky-summary-tile-label">
            Outstanding Receivables
          </span>
          <div className="sky-summary-tile-value" style={{ color: 'var(--warning)' }}>
            ${totalOutstanding.toFixed(2)}
          </div>
        </div>
      </div>

      {/* SKY UX Filter Toolbar */}
      <div className="sky-card" style={{ padding: '1rem 1.25rem' }}>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
          <div style={{ position: 'relative', flex: 1, minWidth: '280px' }}>
            <input
              type="text"
              placeholder="Search by student name, roll number, or parent email..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              style={{ paddingLeft: '2.4rem' }}
            />
            <Search size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)' }} />
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <select
              value={selectedFeeFilter}
              onChange={e => setSelectedFeeFilter(e.target.value)}
              style={{ width: 'auto', minWidth: '180px' }}
            >
              <option value="ALL">All Fee Programs</option>
              {fees.map(f => (
                <option key={f.id} value={f.id}>{f.title}</option>
              ))}
            </select>

            <select
              value={selectedStatusFilter}
              onChange={e => setSelectedStatusFilter(e.target.value)}
              style={{ width: 'auto', minWidth: '180px' }}
            >
              <option value="ALL">All Payment Statuses</option>
              <option value="PAID">Paid in Full</option>
              <option value="PARTIALLY_PAID">Partially Paid</option>
              <option value="UNPAID">Unpaid</option>
            </select>
          </div>
        </div>
      </div>

      {/* SKY UX Charges Data Grid */}
      <div className="sky-card" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table className="sky-table">
            <thead>
              <tr>
                <th>Student / Payer</th>
                <th>Fee Program</th>
                <th>Due Date</th>
                <th style={{ textAlign: 'right' }}>Amount / Balance</th>
                <th>Payment Status</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCharges.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ padding: '3.5rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                    No student charges match the applied search and filter criteria.
                  </td>
                </tr>
              ) : (
                filteredCharges.map(c => {
                  const remaining = c.amount - c.amountPaid;
                  const isCopied = copiedChargeId === c.id;

                  return (
                    <tr key={c.id}>
                      <td>
                        <div style={{ fontWeight: 700, color: 'var(--text-heading)' }}>{c.studentName}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', marginTop: '0.1rem' }}>
                          {c.studentId} • {c.parentEmail}
                        </div>
                      </td>

                      <td>
                        <div style={{ fontWeight: 600, color: 'var(--text-heading)' }}>{c.feeTitle}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>GL: {c.bbFeeTypeId}</div>
                      </td>

                      <td style={{ whiteSpace: 'nowrap', color: 'var(--text-muted)' }}>
                        {c.dueDate}
                      </td>

                      <td style={{ whiteSpace: 'nowrap', textAlign: 'right' }}>
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

                      <td style={{ whiteSpace: 'nowrap' }}>
                        {c.paymentStatus === 'PAID' && <span className="badge badge-success">Paid</span>}
                        {c.paymentStatus === 'PARTIALLY_PAID' && <span className="badge badge-warning">Partial</span>}
                        {c.paymentStatus === 'UNPAID' && <span className="badge badge-neutral">Unpaid</span>}
                      </td>

                      <td style={{ textAlign: 'right', whiteSpace: 'nowrap' }}>
                        <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'flex-end', gap: '0.45rem' }}>
                          <button
                            className="sky-btn-default"
                            onClick={(e) => handleCopyLink(c.id, e)}
                            title="Copy direct payment link"
                            style={{
                              padding: '0.4rem 0.65rem',
                              fontSize: '0.75rem'
                            }}
                          >
                            {isCopied ? <Check size={13} color="var(--success)" /> : <Copy size={13} />}
                            <span>{isCopied ? 'Copied!' : 'Copy Link'}</span>
                          </button>

                          {c.paymentStatus !== 'PAID' ? (
                            <button
                              className="sky-btn-primary"
                              onClick={() => handleOpenReceiptOrCheckout(c.id)}
                              style={{ padding: '0.4rem 0.75rem', fontSize: '0.75rem' }}
                            >
                              <CreditCard size={13} /> Pay Now
                            </button>
                          ) : (
                            <button
                              className="sky-btn-default"
                              onClick={() => handleOpenReceiptOrCheckout(c.id)}
                              style={{ padding: '0.4rem 0.75rem', fontSize: '0.75rem', color: 'var(--success)' }}
                            >
                              <FileCheck size={13} color="var(--success)" /> View Receipt
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

      {/* Direct In-Place Receipt & Checkout Modal */}
      {activeModalChargeId && (
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
          padding: '1.5rem',
          overflowY: 'auto'
        }}>
          <div style={{ width: '100%', maxWidth: '720px', maxHeight: '92vh', overflowY: 'auto', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-modal)' }}>
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
