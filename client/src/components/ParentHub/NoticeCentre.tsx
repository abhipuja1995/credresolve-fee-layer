import React, { useState } from 'react';
import { MultiSchoolParentProfile, SchoolNotice } from '../../types';
import {
  Bell,
  Calendar,
  Filter,
  CheckCircle,
  AlertCircle,
  FileText,
  Clock,
  Sparkles,
  Search,
  Building,
  User,
  ArrowRight,
  ShieldCheck,
  Check
} from 'lucide-react';

interface NoticeCentreProps {
  profile: MultiSchoolParentProfile;
}

export const NoticeCentre: React.FC<NoticeCentreProps> = ({ profile }) => {
  const [selectedChildId, setSelectedChildId] = useState<string>('ALL');
  const [selectedSchoolId, setSelectedSchoolId] = useState<string>('ALL');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [completedActions, setCompletedActions] = useState<Record<string, boolean>>({});

  // Flatten notices across all children
  const allNotices: SchoolNotice[] = profile.children.flatMap(child => child.notices);

  const filteredNotices = allNotices.filter(notice => {
    if (selectedChildId !== 'ALL' && notice.studentId !== selectedChildId) return false;
    if (selectedSchoolId !== 'ALL' && notice.schoolId !== selectedSchoolId) return false;
    if (selectedCategory !== 'ALL' && notice.category !== selectedCategory) return false;
    if (searchQuery.trim().length > 0) {
      const q = searchQuery.toLowerCase();
      const match =
        notice.title.toLowerCase().includes(q) ||
        notice.summary.toLowerCase().includes(q) ||
        notice.schoolName.toLowerCase().includes(q) ||
        notice.studentName.toLowerCase().includes(q);
      if (!match) return false;
    }
    return true;
  });

  const handleActionClick = (noticeId: string) => {
    setCompletedActions(prev => ({
      ...prev,
      [noticeId]: true
    }));
  };

  const getCategoryBadge = (cat: SchoolNotice['category']) => {
    switch (cat) {
      case 'PTM':
        return { bg: '#eff6ff', color: '#1d4ed8', border: '#bfdbfe', label: 'Parent-Teacher Meeting' };
      case 'EXAM':
        return { bg: '#fef2f2', color: '#b91c1c', border: '#fecaca', label: 'Examinations & Syllabus' };
      case 'EVENT':
        return { bg: '#faf5ff', color: '#7e22ce', border: '#e9d5ff', label: 'School Event / Sports' };
      case 'HOLIDAY':
        return { bg: '#ecfdf5', color: '#047857', border: '#a7f3d0', label: 'Holiday & Campus Notice' };
      case 'URGENT':
        return { bg: '#fff1f2', color: '#be123c', border: '#fecdd3', label: 'Priority Alert' };
      case 'LOGISTICS':
        return { bg: '#fffbeb', color: '#b45309', border: '#fde68a', label: 'Logistics & Forms' };
      default:
        return { bg: '#f1f5f9', color: '#334155', border: '#cbd5e1', label: 'Circular' };
    }
  };

  return (
    <div style={{ background: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '2rem', boxShadow: '0 4px 20px -4px rgba(0, 0, 0, 0.05)' }}>
      
      {/* Header Narrative */}
      <div className="flex-between" style={{ flexWrap: 'wrap', gap: '1rem', marginBottom: '1.75rem', paddingBottom: '1.25rem', borderBottom: '1px solid #f1f5f9' }}>
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.45rem', background: '#fdf4ff', color: '#a21caf', padding: '0.3rem 0.75rem', borderRadius: '30px', fontSize: '0.75rem', fontWeight: 800, letterSpacing: '0.04em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
            <Bell size={13} />
            <span>Unified Communication Hub</span>
          </div>
          <h3 style={{ fontSize: '1.45rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
            Parent Notice &amp; Circular Center
          </h3>
          <p style={{ fontSize: '0.875rem', color: '#64748b', margin: '0.25rem 0 0 0' }}>
            Never miss an announcement again. All circulars, exam dates, and PTM invites from all schools in one clean stream.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b' }}>
            {filteredNotices.length} Active Notice{filteredNotices.length !== 1 ? 's' : ''}
          </span>
        </div>
      </div>

      {/* Filter Bar */}
      <div style={{ background: '#f8fafc', borderRadius: '12px', padding: '1rem', border: '1px solid #e2e8f0', marginBottom: '1.75rem', display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center' }}>
          
          {/* Search Box */}
          <div style={{ flex: '1 1 240px', position: 'relative' }}>
            <Search size={16} color="#94a3b8" style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              placeholder="Search circulars, PTMs, exams..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '0.55rem 0.75rem 0.55rem 2.25rem',
                borderRadius: '8px',
                border: '1px solid #cbd5e1',
                fontSize: '0.825rem',
                outline: 'none'
              }}
            />
          </div>

          {/* Child Filter */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#475569' }}>Child:</span>
            <select
              value={selectedChildId}
              onChange={e => setSelectedChildId(e.target.value)}
              style={{ padding: '0.5rem 0.75rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.8rem', background: '#ffffff', color: '#0f172a', fontWeight: 600 }}
            >
              <option value="ALL">All Children ({profile.children.length})</option>
              {profile.children.map(c => (
                <option key={c.studentId} value={c.studentId}>{c.studentName} ({c.grade})</option>
              ))}
            </select>
          </div>

          {/* School Filter */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#475569' }}>School:</span>
            <select
              value={selectedSchoolId}
              onChange={e => setSelectedSchoolId(e.target.value)}
              style={{ padding: '0.5rem 0.75rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.8rem', background: '#ffffff', color: '#0f172a', fontWeight: 600 }}
            >
              <option value="ALL">All Schools</option>
              {Array.from(new Set(profile.children.map(c => JSON.stringify({ id: c.schoolId, name: c.schoolName })))).map(s => {
                const school = JSON.parse(s);
                return <option key={school.id} value={school.id}>{school.name}</option>;
              })}
            </select>
          </div>

          {/* Category Filter */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#475569' }}>Category:</span>
            <select
              value={selectedCategory}
              onChange={e => setSelectedCategory(e.target.value)}
              style={{ padding: '0.5rem 0.75rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.8rem', background: '#ffffff', color: '#0f172a', fontWeight: 600 }}
            >
              <option value="ALL">All Categories</option>
              <option value="PTM">PTM Meetings</option>
              <option value="EXAM">Exams &amp; Tests</option>
              <option value="EVENT">Events &amp; Sports</option>
              <option value="HOLIDAY">Holidays</option>
              <option value="LOGISTICS">Logistics &amp; Waivers</option>
            </select>
          </div>

        </div>
      </div>

      {/* Notices Stream */}
      {filteredNotices.length === 0 ? (
        <div style={{ padding: '3rem', textAlign: 'center', color: '#64748b' }}>
          <FileText size={40} color="#cbd5e1" style={{ margin: '0 auto 0.75rem auto' }} />
          <div style={{ fontSize: '1rem', fontWeight: 700, color: '#0f172a' }}>No circulars found</div>
          <div style={{ fontSize: '0.825rem', marginTop: '0.25rem' }}>Try adjusting your search or filters above.</div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {filteredNotices.map(notice => {
            const badge = getCategoryBadge(notice.category);
            const isCompleted = completedActions[notice.id];
            const child = profile.children.find(c => c.studentId === notice.studentId);
            const childColor = child?.schoolBadgeColor || '#0284c7';

            return (
              <div
                key={notice.id}
                style={{
                  background: '#ffffff',
                  borderRadius: '12px',
                  border: '1px solid #e2e8f0',
                  padding: '1.25rem 1.5rem',
                  borderLeft: `4px solid ${childColor}`,
                  boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.75rem',
                  transition: 'all 0.15s ease'
                }}
              >
                {/* Meta Header */}
                <div className="flex-between" style={{ flexWrap: 'wrap', gap: '0.5rem', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', flexWrap: 'wrap' }}>
                    <span style={{
                      background: badge.bg,
                      color: badge.color,
                      border: `1px solid ${badge.border}`,
                      padding: '0.15rem 0.55rem',
                      borderRadius: '4px',
                      fontSize: '0.7rem',
                      fontWeight: 800,
                      letterSpacing: '0.03em'
                    }}>
                      {badge.label}
                    </span>

                    <span style={{ fontSize: '0.775rem', fontWeight: 700, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                      <User size={13} color={childColor} />
                      <span>{notice.studentName}</span>
                    </span>

                    <span style={{ fontSize: '0.725rem', color: '#64748b' }}>•</span>

                    <span style={{ fontSize: '0.775rem', color: '#475569', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                      <Building size={13} color="#64748b" />
                      <span>{notice.schoolName}</span>
                    </span>
                  </div>

                  <div style={{ fontSize: '0.725rem', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <Clock size={12} />
                    <span>Posted {notice.publishedDate}</span>
                  </div>
                </div>

                {/* Content */}
                <div>
                  <h4 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0f172a', margin: '0 0 0.35rem 0' }}>
                    {notice.title}
                  </h4>
                  <p style={{ fontSize: '0.85rem', color: '#475569', margin: 0, lineHeight: 1.55 }}>
                    {notice.fullContent || notice.summary}
                  </p>
                </div>

                {/* Footer Action Strip */}
                {(notice.eventDate || notice.actionRequired) && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '0.75rem', borderTop: '1px solid #f1f5f9', flexWrap: 'wrap', gap: '0.75rem' }}>
                    {notice.eventDate ? (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.775rem', color: '#0284c7', fontWeight: 700 }}>
                        <Calendar size={14} />
                        <span>Key Event Date: {notice.eventDate}</span>
                      </div>
                    ) : <div />}

                    {notice.actionRequired && (
                      <div>
                        {isCompleted ? (
                          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', background: '#ecfdf5', color: '#059669', border: '1px solid #a7f3d0', padding: '0.35rem 0.75rem', borderRadius: '6px', fontSize: '0.775rem', fontWeight: 700 }}>
                            <Check size={14} />
                            <span>Action Completed &amp; Synced to School</span>
                          </div>
                        ) : (
                          <button
                            onClick={() => handleActionClick(notice.id)}
                            style={{
                              background: childColor,
                              color: '#ffffff',
                              border: 'none',
                              borderRadius: '6px',
                              padding: '0.4rem 0.85rem',
                              fontSize: '0.775rem',
                              fontWeight: 700,
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '0.35rem',
                              boxShadow: '0 2px 6px rgba(0,0,0,0.1)'
                            }}
                          >
                            <span>{notice.actionLabel || 'Acknowledge & Confirm'}</span>
                            <ArrowRight size={13} />
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                )}

              </div>
            );
          })}
        </div>
      )}

    </div>
  );
};
