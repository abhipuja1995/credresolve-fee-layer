import React, { useState, useEffect } from 'react';
import { 
  RefreshCw, 
  CheckCircle, 
  AlertTriangle, 
  Clock, 
  XCircle, 
  ChevronDown, 
  ChevronUp, 
  FileCode, 
  ShieldAlert
} from 'lucide-react';
import { IngestionJobRecord } from '../types/index.js';

interface BatchMonitorProps {
  batches: IngestionJobRecord[];
  onRefresh: () => void;
}

export const BatchMonitor: React.FC<BatchMonitorProps> = ({ batches, onRefresh }) => {
  const [expandedJobId, setExpandedJobId] = useState<string | null>(null);
  const [autoPoll, setAutoPoll] = useState(true);

  useEffect(() => {
    if (!autoPoll) return;
    const interval = setInterval(() => {
      onRefresh();
    }, 2500);
    return () => clearInterval(interval);
  }, [autoPoll, onRefresh]);

  const toggleExpand = (jobId: string) => {
    setExpandedJobId(expandedJobId === jobId ? null : jobId);
  };

  const getStatusBadge = (status: IngestionJobRecord['status']) => {
    switch (status) {
      case 'COMPLETED':
        return <span className="badge badge-success"><CheckCircle size={11} /> Completed</span>;
      case 'PROCESSING':
        return <span className="badge badge-info"><Clock size={11} /> Processing</span>;
      case 'QUEUED':
        return <span className="badge badge-warning"><Clock size={11} /> Queued</span>;
      case 'COMPLETED_WITH_ERRORS':
        return <span className="badge badge-warning"><AlertTriangle size={11} /> Partial Errors</span>;
      case 'FAILED':
        return <span className="badge badge-danger"><XCircle size={11} /> Failed</span>;
      default:
        return <span className="badge badge-neutral">{status}</span>;
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* Header Bar */}
      <div className="sky-card" style={{ padding: '1.25rem 1.5rem' }}>
        <div className="flex-between" style={{ flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <h2 className="sky-heading-2">
                Blackbaud SKY API Batch Ingestion Monitor
              </h2>
              <span className="badge badge-info">Async Job Pipeline</span>
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '0.25rem' }}>
              Live polling on <code>GetTransactionBatchImportSummary</code> with automatic exponential backoff, payload chunking, and row error diagnostics.
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem', color: 'var(--text-body)', cursor: 'pointer', fontWeight: 600, margin: 0 }}>
              <input
                type="checkbox"
                checked={autoPoll}
                onChange={e => setAutoPoll(e.target.checked)}
                style={{ width: 'auto' }}
              />
              Auto-poll (2.5s)
            </label>

            <button className="sky-btn-default" onClick={onRefresh} style={{ padding: '0.4rem 0.75rem', fontSize: '0.8rem' }}>
              <RefreshCw size={13} /> Refresh
            </button>
          </div>
        </div>
      </div>

      {/* Batches List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
        {batches.length === 0 ? (
          <div className="sky-card" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
            No batch jobs recorded yet. Create a Universal Fee to trigger Blackbaud batch ingestion.
          </div>
        ) : (
          batches.map(batch => {
            const isExpanded = expandedJobId === batch.jobId;
            const hasErrors = batch.errors && batch.errors.length > 0;
            const total = batch.totalRecordsCount || 0;
            const processed = batch.successfulRecordsCount || 0;

            return (
              <div key={batch.jobId} className="sky-card" style={{ padding: 0, overflow: 'hidden' }}>
                <div 
                  onClick={() => toggleExpand(batch.jobId)}
                  style={{
                    padding: '1rem 1.25rem',
                    background: 'var(--bg-card)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    cursor: 'pointer',
                    gap: '1rem',
                    flexWrap: 'wrap'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: 'var(--radius-sm)',
                      background: 'var(--bg-surface-subtle)',
                      border: '1px solid var(--border-strong)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'var(--sky-color-primary)'
                    }}>
                      <FileCode size={16} />
                    </div>

                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <strong style={{ color: 'var(--text-heading)', fontFamily: 'var(--font-mono)', fontSize: '0.875rem' }}>
                          {batch.jobId}
                        </strong>
                        {getStatusBadge(batch.status)}
                      </div>
                      <div style={{ fontSize: '0.775rem', color: 'var(--text-muted)', marginTop: '0.15rem' }}>
                        Fee: <strong>{batch.feeTitle}</strong> • Submitted: {batch.submittedAt ? new Date(batch.submittedAt).toLocaleTimeString() : 'Recent'}
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                    <div style={{ textAlign: 'right' }}>
                      <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>Ingested</span>
                      <div style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-heading)' }}>
                        {processed} / {total}
                      </div>
                    </div>

                    <div style={{
                      width: '80px',
                      height: '6px',
                      background: 'var(--bg-surface-subtle)',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: '3px',
                      overflow: 'hidden'
                    }}>
                      <div style={{
                        width: `${total > 0 ? (processed / total) * 100 : 0}%`,
                        height: '100%',
                        background: 'var(--sky-color-primary)',
                        transition: 'width 0.3s ease'
                      }} />
                    </div>

                    {isExpanded ? <ChevronUp size={16} color="var(--text-muted)" /> : <ChevronDown size={16} color="var(--text-muted)" />}
                  </div>
                </div>

                {isExpanded && (
                  <div style={{
                    padding: '1.25rem',
                    background: 'var(--bg-surface-subtle)',
                    borderTop: '1px solid var(--border-subtle)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '1rem'
                  }}>
                    <div className="grid-cols-4">
                      <div>
                        <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>Total Records</span>
                        <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-heading)' }}>{batch.totalRecordsCount}</div>
                      </div>
                      <div>
                        <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>Succeeded</span>
                        <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--success)' }}>{batch.successfulRecordsCount}</div>
                      </div>
                      <div>
                        <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>Failed</span>
                        <div style={{ fontSize: '1.1rem', fontWeight: 700, color: batch.failedRecordsCount > 0 ? 'var(--danger)' : 'var(--text-heading)' }}>
                          {batch.failedRecordsCount}
                        </div>
                      </div>
                      <div>
                        <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>Blackbaud Batch ID</span>
                        <div style={{ fontSize: '0.85rem', fontFamily: 'var(--font-mono)', fontWeight: 600, color: 'var(--text-heading)' }}>
                          {batch.bbBatchId || 'Pending'}
                        </div>
                      </div>
                    </div>

                    {hasErrors && (
                      <div style={{
                        padding: '0.85rem 1rem',
                        background: 'var(--danger-bg)',
                        border: '1px solid var(--danger-border)',
                        borderRadius: 'var(--radius-sm)'
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--danger-text)', fontWeight: 700, fontSize: '0.85rem', marginBottom: '0.4rem' }}>
                          <ShieldAlert size={15} />
                          Row Diagnostic Errors:
                        </div>
                        <ul style={{ paddingLeft: '1.25rem', fontSize: '0.8rem', color: 'var(--danger-text)' }}>
                          {batch.errors.map((err, i) => (
                            <li key={i}>{err.studentId ? `Student ${err.studentId}: ` : ''}{err.errorMessage}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
