import React, { useState } from 'react';
import { 
  FileCheck2, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  Archive, 
  Clock, 
  ShieldCheck, 
  Edit3, 
  Save, 
  ExternalLink,
  UserCheck
} from 'lucide-react';
import type { RegulatoryDocument, AuditLogEntry, VerificationStatus } from '../types';

interface AdminReviewProps {
  documents: RegulatoryDocument[];
  auditLogs: AuditLogEntry[];
  onUpdateDocumentStatus: (docId: string, status: VerificationStatus, reviewerNotes: string) => void;
  onNavigateToCompare: (docId: string) => void;
}

export const AdminReview: React.FC<AdminReviewProps> = ({
  documents,
  auditLogs,
  onUpdateDocumentStatus,
  onNavigateToCompare,
}) => {
  const [selectedDocId, setSelectedDocId] = useState<string>(() => {
    const pending = documents.find(d => d.verificationStatus === 'Pending Review');
    return pending ? pending.id : documents[0]?.id || '';
  });

  const [reviewerName, setReviewerName] = useState('Senior Statutory Counsel (Bar ID: D/2184/2012)');
  const [reviewNotes, setReviewNotes] = useState('');
  const [isEditingSummary, setIsEditingSummary] = useState(false);
  const [editedSummary, setEditedSummary] = useState('');

  const selectedDoc = documents.find(d => d.id === selectedDocId) || documents[0];

  const handleAction = (status: VerificationStatus) => {
    if (!selectedDoc) return;
    onUpdateDocumentStatus(
      selectedDoc.id,
      status,
      reviewNotes || `Counsel review concluded. Document status set to ${status}.`
    );
    setReviewNotes('');
  };

  const pendingDocs = documents.filter(d => d.verificationStatus === 'Pending Review');

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-[#E5E9F0]">
        <div>
          <div className="flex items-center gap-2 mb-2 text-xs font-semibold uppercase tracking-wider text-amber-700">
            <FileCheck2 className="w-4 h-4 text-amber-600" />
            <span>Restricted Counsel Certification Workspace</span>
          </div>
          <h2 className="text-2xl font-bold text-[#111827] tracking-tight">
            Official Source Review & Provenance Audit
          </h2>
          <p className="text-sm text-[#667085] mt-1 max-w-2xl">
            Audit extracted passages against official Gazette records, correct legal wording discrepancies, and certify provenance before publication.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 text-amber-900 px-3 py-1.5 rounded-lg text-xs font-medium">
          <Clock className="w-4 h-4 text-amber-600" />
          <span>{pendingDocs.length} documents awaiting legal certification</span>
        </div>
      </div>

      {/* Main Review Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Col: Queue of Documents */}
        <div className="bg-white border border-[#E5E9F0] rounded-xl overflow-hidden shadow-xs">
          <div className="p-4 border-b border-[#E5E9F0] bg-[#F5F7FB] flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Review Queue
            </span>
            <span className="text-xs font-mono text-slate-500">{documents.length} Total</span>
          </div>

          <div className="divide-y divide-[#E5E9F0] max-h-[600px] overflow-y-auto">
            {documents.map(doc => {
              const isSelected = doc.id === selectedDocId;
              return (
                <div
                  key={doc.id}
                  onClick={() => {
                    setSelectedDocId(doc.id);
                    setEditedSummary(doc.summary);
                    setIsEditingSummary(false);
                  }}
                  className={`p-4 cursor-pointer transition-colors ${
                    isSelected ? 'bg-amber-50/50 border-l-4 border-amber-500' : 'hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="text-[11px] font-semibold text-slate-700 bg-slate-100 px-1.5 py-0.5 rounded">
                      {doc.authority}
                    </span>
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                        doc.verificationStatus === 'Verified'
                          ? 'text-emerald-800 bg-emerald-50 border border-emerald-200'
                          : 'text-amber-800 bg-amber-50 border border-amber-200'
                      }`}
                    >
                      {doc.verificationStatus}
                    </span>
                  </div>

                  <h4 className="text-xs font-bold text-[#111827] line-clamp-1">
                    {doc.title}
                  </h4>
                  <p className="text-[11px] font-mono text-slate-500 mt-1">
                    {doc.documentIdentifier}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Center & Right Col: Certification Dossier */}
        <div className="lg:col-span-2 space-y-6">
          {selectedDoc ? (
            <div className="bg-white border border-[#E5E9F0] rounded-xl p-6 shadow-xs space-y-6">
              <div className="flex items-start justify-between gap-4 pb-4 border-b border-[#E5E9F0]">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-bold text-[#4568F5]">
                      {selectedDoc.authority} ({selectedDoc.jurisdiction})
                    </span>
                    <span className="text-slate-300">·</span>
                    <span className="text-xs font-mono text-slate-500">{selectedDoc.documentIdentifier}</span>
                  </div>
                  <h3 className="text-base font-bold text-[#111827]">
                    {selectedDoc.title}
                  </h3>
                </div>

                <button
                  onClick={() => onNavigateToCompare(selectedDoc.id)}
                  className="text-xs px-3 py-1.5 bg-blue-50 text-[#4568F5] hover:bg-blue-100 font-semibold rounded-md transition-colors shrink-0"
                >
                  Open in Diff Studio
                </button>
              </div>

              {/* Gazette Metadata Review Table */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-[#F5F7FB] p-4 rounded-lg border border-[#E5E9F0] text-xs">
                <div>
                  <span className="text-slate-500 block">Publication Date</span>
                  <span className="font-mono font-semibold text-slate-900">{selectedDoc.publicationDate}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Statutory Effective Date</span>
                  <span className="font-mono font-semibold text-emerald-800">{selectedDoc.effectiveDate}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Version Number</span>
                  <span className="font-mono font-semibold text-slate-900">v{selectedDoc.version}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Current Status</span>
                  <span className="font-semibold text-amber-700">{selectedDoc.verificationStatus}</span>
                </div>
              </div>

              {/* Extracted Passage & Summary Correction */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#111827]">
                    Official Summary & Extracted Scope
                  </h4>
                  <button
                    onClick={() => {
                      if (!isEditingSummary) setEditedSummary(selectedDoc.summary);
                      setIsEditingSummary(!isEditingSummary);
                    }}
                    className="text-xs text-[#4568F5] hover:underline flex items-center gap-1 font-medium"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>{isEditingSummary ? 'Cancel Edit' : 'Edit Text'}</span>
                  </button>
                </div>

                {isEditingSummary ? (
                  <div className="space-y-2">
                    <textarea
                      rows={4}
                      value={editedSummary}
                      onChange={e => setEditedSummary(e.target.value)}
                      className="w-full text-xs p-3 bg-[#F5F7FB] border border-[#E5E9F0] rounded-lg text-slate-800 focus:outline-none focus:border-[#4568F5]"
                    />
                    <button
                      onClick={() => {
                        selectedDoc.summary = editedSummary;
                        setIsEditingSummary(false);
                      }}
                      className="px-3 py-1 bg-slate-800 text-white text-xs font-medium rounded-md hover:bg-slate-700"
                    >
                      Save Summary
                    </button>
                  </div>
                ) : (
                  <p className="text-xs text-slate-800 bg-white p-3.5 rounded-lg border border-slate-200 leading-relaxed">
                    {selectedDoc.summary}
                  </p>
                )}
              </div>

              {/* Reviewer Sign-Off Box */}
              <div className="p-5 rounded-xl bg-slate-50 border border-slate-200 space-y-4">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-900">
                  <UserCheck className="w-4 h-4 text-[#4568F5]" />
                  <span>Statutory Reviewer Sign-Off</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="block text-slate-500 font-medium mb-1">Certifying Reviewer</label>
                    <input
                      type="text"
                      value={reviewerName}
                      onChange={e => setReviewerName(e.target.value)}
                      className="w-full bg-white border border-slate-300 rounded-md p-2 text-slate-900 font-medium"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-500 font-medium mb-1">Review Timestamp</label>
                    <input
                      type="text"
                      disabled
                      value={`${new Date().toISOString().split('T')[0]} (Recorded on submit)`}
                      className="w-full bg-slate-100 border border-slate-200 rounded-md p-2 text-slate-500 font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-500 font-medium mb-1 text-xs">
                    Counsel Verification Findings & Audit Notes
                  </label>
                  <textarea
                    rows={2}
                    value={reviewNotes}
                    onChange={e => setReviewNotes(e.target.value)}
                    placeholder="e.g. Cross-referenced with Ministry Notification G.S.R. 208(E). Diff chunks accurately reflect statutory changes to Section 43B(h)."
                    className="w-full bg-white border border-slate-300 rounded-md p-2 text-xs text-slate-900 focus:outline-none focus:border-[#4568F5]"
                  />
                </div>

                {/* Reviewer Action Buttons */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-200">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleAction('Archived')}
                      className="px-3 py-1.5 text-xs text-slate-600 hover:text-slate-800 bg-white border border-slate-300 rounded-md hover:bg-slate-100 inline-flex items-center gap-1.5"
                    >
                      <Archive className="w-3.5 h-3.5 text-slate-500" />
                      <span>Archive Outdated</span>
                    </button>
                    <button
                      onClick={() => handleAction('Flagged')}
                      className="px-3 py-1.5 text-xs text-amber-700 bg-amber-50 border border-amber-300 rounded-md hover:bg-amber-100 inline-flex items-center gap-1.5"
                    >
                      <AlertTriangle className="w-3.5 h-3.5" />
                      <span>Flag for Correction</span>
                    </button>
                  </div>

                  <button
                    onClick={() => handleAction('Verified')}
                    className="px-4 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-sm transition-colors inline-flex items-center gap-2"
                  >
                    <ShieldCheck className="w-4 h-4 text-emerald-100" />
                    <span>Approve & Publish Verified Document</span>
                  </button>
                </div>
              </div>

              {/* Review Audit Trail for this Document */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                  Recent Audit Actions
                </h4>
                <div className="space-y-2">
                  {auditLogs.slice(0, 3).map(log => (
                    <div key={log.id} className="p-3 bg-white border border-[#E5E9F0] rounded-lg text-xs flex items-center justify-between">
                      <div>
                        <span className="font-semibold text-slate-900">{log.actor}</span>
                        <span className="text-slate-400"> ({log.role}) </span>
                        <span className="text-slate-600">— {log.action}</span>
                        <p className="text-[11px] text-slate-500 mt-0.5">{log.notes}</p>
                      </div>
                      <span className="text-[11px] font-mono text-slate-400 shrink-0">
                        {log.timestamp}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white border border-[#E5E9F0] rounded-xl p-8 text-center text-xs text-slate-400">
              Select a document to inspect and verify.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
