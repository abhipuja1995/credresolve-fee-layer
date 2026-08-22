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
  Check, 
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
        return <span className="badge badge-success"><CheckCircle size={12} /> Completed</span>;
      case 'PROCESSING':
        return <span className="badge badge-info"><Clock size={12} /> Processing</span>;
      case 'QUEUED':
        return <span className="badge badge-warning"><Clock size={12} /> Queued</span>;
      case 'COMPLETED_WITH_ERRORS':
        return <span className="badge badge-warning"><AlertTriangle size={12} /> Partial Errors</span>;
      case 'FAILED':
        return <span className="badge badge-danger"><XCircle size={12} /> Failed</span>;
      default:
        return <span className="badge badge-neutral">{status}</span>;
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Header Bar */}
      <div className="card-panel" style={{ padding: '1.5rem 2rem' }}>
        <div className="flex-between" style={{ flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-heading)' }}>
                Blackbaud SKY API Batch Ingestion Monitor
              </h2>
              <span className="badge badge-info">Async Job Pipeline</span>
            </div>
            <p style={{ color: 'var(--text-body)', fontSize: '0.875rem', marginTop: '0.3rem' }}>
              Live polling on <code>GetTransactionBatchImportSummary</code> with automatic exponential backoff, payload chunking, and row error diagnostics.
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', fontSize: '0.825rem', color: 'var(--text-body)', cursor: 'pointer', fontWeight: 600 }}>
              <input
                type="checkbox"
                checked={autoPoll}
                onChange={e => setAutoPoll(e.target.checked)}
                style={{ width: 'auto' }}
              />
              Auto-poll (2.5s)
            </label>

            <button className="btn-secondary" onClick={onRefresh} style={{ padding: '0.5rem 0.85rem', fontSize: '0.85rem' }}>
              <RefreshCw size={14} /> Refresh
            </button>
          </div>
        </div>
      </div>

      {/* Batches List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {batches.length === 0 ? (
          <div className="card-panel" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
            No batch jobs recorded yet. Create a Universal Fee to trigger Blackbaud batch ingestion.
          </div>
        ) : (
          batches.map(batch => {
            const isExpanded = expandedJobId === batch.jobId;
            const hasErrors = batch.errors && batch.errors.length > 0;

            return (
              <div key={batch.jobId} className="card-panel" style={{ padding: '1.5rem', overflow: 'hidden' }}>
                <div className="flex-between" style={{ flexWrap: 'wrap', gap: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{
                      width: '44px',
                      height: '44px',
                      borderRadius: 'var(--radius-md)',
                      background: batch.status === 'COMPLETED' ? 'var(--success-bg)' : (batch.status === 'PROCESSING' ? 'var(--info-bg)' : 'var(--warning-bg)'),
                      border: `1px solid ${batch.status === 'COMPLETED' ? 'var(--success-border)' : 'var(--border-subtle)'}`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <FileCode size={22} color={batch.status === 'COMPLETED' ? 'var(--success)' : 'var(--accent-primary)'} />
                    </div>

                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                        <h4 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-heading)' }}>
                          {batch.feeTitle}
                        </h4>
                        {getStatusBadge(batch.status)}
                      </div>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', marginTop: '0.35rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                        <span>Job ID: <strong style={{ color: 'var(--text-heading)' }}>{batch.jobId}</strong></span>
                        <span>Blackbaud Batch ID: <strong style={{ color: 'var(--text-heading)' }}>{batch.bbBatchId || 'Pending Assignment'}</strong></span>
                        <span>Client Ref: <code style={{ color: 'var(--text-body)', fontWeight: 600 }}>{batch.clientBatchReferenceId}</code></span>
                      </div>
                    </div>
                  </div>

                  {/* Summary Metrics */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1.75rem' }}>
                    <div style={{ textAlign: 'center' }}>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, display: 'block', textTransform: 'uppercase' }}>Records</span>
                      <strong style={{ fontSize: '1.15rem', color: 'var(--text-heading)' }}>{batch.totalRecordsCount}</strong>
                    </div>

                    <div style={{ textAlign: 'center' }}>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, display: 'block', textTransform: 'uppercase' }}>Success</span>
                      <strong style={{ fontSize: '1.15rem', color: 'var(--success)' }}>{batch.successfulRecordsCount}</strong>
                    </div>

                    <div style={{ textAlign: 'center' }}>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, display: 'block', textTransform: 'uppercase' }}>Errors</span>
                      <strong style={{ fontSize: '1.15rem', color: hasErrors ? 'var(--danger)' : 'var(--text-muted)' }}>
                        {batch.failedRecordsCount}
                      </strong>
                    </div>

                    <button 
                      className="btn-secondary" 
                      onClick={() => toggleExpand(batch.jobId)}
                      style={{ padding: '0.45rem 0.85rem', fontSize: '0.825rem' }}
                    >
                      {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                      {isExpanded ? 'Hide Details' : 'View Diagnostics'}
                    </button>
                  </div>
                </div>

                {/* Expanded Row Diagnostics & Error Inspector */}
                {isExpanded && (
                  <div style={{
                    marginTop: '1.25rem',
                    paddingTop: '1.25rem',
                    borderTop: '1px solid var(--border-subtle)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '1rem'
                  }}>
                    <div className="grid-cols-3" style={{ fontSize: '0.85rem' }}>
                      <div style={{ padding: '0.75rem 1rem', background: 'var(--bg-surface-elevated)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
                        <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase' }}>Submitted Timestamp</span>
                        <div style={{ fontWeight: 700, marginTop: '0.2rem', color: 'var(--text-heading)' }}>
                          {new Date(batch.submittedAt).toLocaleString()}
                        </div>
                      </div>
                      <div style={{ padding: '0.75rem 1rem', background: 'var(--bg-surface-elevated)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
                        <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase' }}>Completed Timestamp</span>
                        <div style={{ fontWeight: 700, marginTop: '0.2rem', color: 'var(--text-heading)' }}>
                          {batch.completedAt ? new Date(batch.completedAt).toLocaleString() : 'In Progress...'}
                        </div>
                      </div>
                      <div style={{ padding: '0.75rem 1rem', background: 'var(--bg-surface-elevated)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
                        <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase' }}>Batch Chunking</span>
                        <div style={{ fontWeight: 700, marginTop: '0.2rem', color: 'var(--text-heading)' }}>
                          {batch.chunksCount} Chunk(s) (≤ 500 records/chunk)
                        </div>
                      </div>
                    </div>

                    {hasErrors ? (
                      <div style={{
                        padding: '1rem',
                        background: 'var(--danger-bg)',
                        border: '1px solid var(--danger-border)',
                        borderRadius: 'var(--radius-md)'
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700, color: 'var(--danger-text)', marginBottom: '0.5rem', fontSize: '0.85rem' }}>
                          <ShieldAlert size={16} />
                          Blackbaud Row-Level Validation Rejections ({batch.errors.length}):
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
                          {batch.errors.map((err, idx) => (
                            <div key={idx} style={{
                              padding: '0.5rem 0.75rem',
                              background: 'var(--bg-card)',
                              border: '1px solid var(--border-subtle)',
                              borderRadius: 'var(--radius-sm)',
                              fontSize: '0.825rem',
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'center'
                            }}>
                              <div>
                                <span style={{ color: 'var(--text-heading)', fontWeight: 700 }}>Student ID: {err.studentId}</span>
                                <span style={{ color: 'var(--text-muted)', marginLeft: '0.75rem', fontFamily: 'var(--font-mono)' }}>[{err.errorCode}]</span>
                                <p style={{ color: 'var(--text-body)', marginTop: '0.15rem' }}>{err.errorMessage}</p>
                              </div>
                              <span className="badge badge-danger">Action Required</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div style={{
                        padding: '0.85rem 1rem',
                        background: 'var(--success-bg)',
                        border: '1px solid var(--success-border)',
                        borderRadius: 'var(--radius-md)',
                        fontSize: '0.85rem',
                        color: 'var(--success-text)',
                        fontWeight: 600,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem'
                      }}>
                        <Check size={16} />
                        All {batch.successfulRecordsCount} student charges successfully posted to Blackbaud student accounts without discrepancies.
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
