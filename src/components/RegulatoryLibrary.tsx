import React, { useState, useMemo } from 'react';
import { 
  BookOpen, 
  Search, 
  Filter, 
  CheckCircle2, 
  Clock, 
  ExternalLink, 
  ChevronRight, 
  FileText, 
  Sparkles,
  ShieldCheck,
  X
} from 'lucide-react';
import type { RegulatoryDocument, IssuingAuthority } from '../types';

interface RegulatoryLibraryProps {
  documents: RegulatoryDocument[];
  onSelectDocumentForCompare: (docId: string) => void;
  onOpenUpload: () => void;
}

export const RegulatoryLibrary: React.FC<RegulatoryLibraryProps> = ({
  documents,
  onSelectDocumentForCompare,
  onOpenUpload,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [authorityFilter, setAuthorityFilter] = useState<string>('All');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [selectedDocDetails, setSelectedDocDetails] = useState<RegulatoryDocument | null>(null);

  const filteredDocs = useMemo(() => {
    return documents.filter(doc => {
      if (authorityFilter !== 'All' && doc.authority !== authorityFilter) return false;
      if (statusFilter !== 'All' && doc.verificationStatus !== statusFilter) return false;
      if (!searchTerm) return true;
      const term = searchTerm.toLowerCase();
      return (
        doc.title.toLowerCase().includes(term) ||
        doc.documentIdentifier.toLowerCase().includes(term) ||
        doc.summary.toLowerCase().includes(term) ||
        doc.tags.some(t => t.toLowerCase().includes(term))
      );
    });
  }, [documents, authorityFilter, statusFilter, searchTerm]);

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-[#E5E9F0]">
        <div>
          <div className="flex items-center gap-2 mb-2 text-xs font-semibold uppercase tracking-wider text-[#4568F5]">
            <BookOpen className="w-4 h-4 text-[#4568F5]" />
            <span>Official Gazette & Regulatory Repository</span>
          </div>
          <h2 className="text-2xl font-bold text-[#111827] tracking-tight">
            Regulatory Library
          </h2>
          <p className="text-sm text-[#667085] mt-1 max-w-2xl">
            Central repository of verified Indian statutory notifications from MCA, RBI, CBIC, and MeitY with clause-level provenance.
          </p>
        </div>

        <button
          onClick={onOpenUpload}
          className="inline-flex items-center gap-2 px-4 py-2 text-xs font-medium text-white bg-[#4568F5] hover:bg-[#3454E8] rounded-lg transition-colors shadow-xs shrink-0"
        >
          <span>Upload New Regulation</span>
        </button>
      </div>

      {/* High-density Filter Bar */}
      <div className="bg-white border border-[#E5E9F0] rounded-xl p-4 flex flex-wrap items-center justify-between gap-4 shadow-xs">
        <div className="flex items-center gap-3 flex-1 min-w-[280px]">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="Search by title, Gazette notification number, tag (e.g., 43B(h), KFS, DPDP)..."
              className="w-full text-xs bg-[#F5F7FB] border border-[#E5E9F0] rounded-lg pl-9 pr-4 py-2 text-[#111827] focus:outline-none focus:border-[#4568F5] placeholder:text-slate-400"
            />
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0 text-xs">
          <div className="flex items-center gap-1.5">
            <span className="text-[#667085]">Issuing Authority:</span>
            <select
              value={authorityFilter}
              onChange={e => setAuthorityFilter(e.target.value)}
              className="bg-[#F5F7FB] border border-[#E5E9F0] rounded-md px-2.5 py-1.5 font-medium text-[#111827] focus:outline-none focus:border-[#4568F5]"
            >
              <option value="All">All Authorities</option>
              <option value="MCA">MCA (Corporate Affairs)</option>
              <option value="CBIC">CBIC (GST & Indirect Tax)</option>
              <option value="RBI">RBI (Banking & Credit)</option>
              <option value="MeitY">MeitY (Data & Tech)</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-[#667085]">Status:</span>
            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              className="bg-[#F5F7FB] border border-[#E5E9F0] rounded-md px-2.5 py-1.5 font-medium text-[#111827] focus:outline-none focus:border-[#4568F5]"
            >
              <option value="All">All Statuses</option>
              <option value="Verified">Verified</option>
              <option value="Pending Review">Pending Review</option>
            </select>
          </div>
        </div>
      </div>

      {/* High-Density Clean Table */}
      <div className="bg-white border border-[#E5E9F0] rounded-xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F5F7FB] border-b border-[#E5E9F0] text-slate-500 font-semibold">
              <tr>
                <th className="py-3 px-4">Issuing Authority</th>
                <th className="py-3 px-4">Regulation Title & Subject</th>
                <th className="py-3 px-4">Document Identifier</th>
                <th className="py-3 px-4">Publication Date</th>
                <th className="py-3 px-4">Effective Date</th>
                <th className="py-3 px-4">Version</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E9F0]">
              {filteredDocs.length > 0 ? (
                filteredDocs.map(doc => (
                  <tr key={doc.id} className="hover:bg-slate-50/70 transition-colors group">
                    {/* Authority */}
                    <td className="py-3.5 px-4">
                      <span className="font-semibold text-slate-800 bg-slate-100 px-2 py-0.5 rounded text-[11px]">
                        {doc.authority}
                      </span>
                    </td>

                    {/* Title */}
                    <td className="py-3.5 px-4 max-w-sm">
                      <div 
                        onClick={() => setSelectedDocDetails(doc)}
                        className="font-semibold text-[#111827] group-hover:text-[#4568F5] transition-colors cursor-pointer"
                      >
                        {doc.title}
                      </div>
                      <p className="text-[11px] text-[#667085] line-clamp-1 mt-0.5">
                        {doc.summary}
                      </p>
                    </td>

                    {/* Document Identifier */}
                    <td className="py-3.5 px-4 font-mono text-[11px] text-slate-700">
                      {doc.documentIdentifier}
                    </td>

                    {/* Publication Date */}
                    <td className="py-3.5 px-4 font-mono text-slate-600 tabular-nums">
                      {doc.publicationDate}
                    </td>

                    {/* Effective Date */}
                    <td className="py-3.5 px-4 font-mono text-slate-900 font-medium tabular-nums">
                      {doc.effectiveDate}
                    </td>

                    {/* Version */}
                    <td className="py-3.5 px-4 font-mono text-slate-500">
                      v{doc.version}
                    </td>

                    {/* Verification Status */}
                    <td className="py-3.5 px-4">
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded flex items-center gap-1 w-fit ${
                        doc.verificationStatus === 'Verified'
                          ? 'text-emerald-800 bg-emerald-50 border border-emerald-200'
                          : 'text-amber-800 bg-amber-50 border border-amber-200'
                      }`}>
                        {doc.verificationStatus === 'Verified' ? (
                          <CheckCircle2 className="w-3 h-3" />
                        ) : (
                          <Clock className="w-3 h-3" />
                        )}
                        <span>{doc.verificationStatus}</span>
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setSelectedDocDetails(doc)}
                          className="text-slate-600 hover:text-slate-900 p-1"
                          title="View metadata and overview"
                        >
                          Details
                        </button>
                        <button
                          onClick={() => onSelectDocumentForCompare(doc.id)}
                          className="px-2.5 py-1 text-[#4568F5] bg-blue-50/70 hover:bg-blue-100 rounded font-medium transition-colors inline-flex items-center gap-1"
                        >
                          <span>Compare Diff</span>
                          <ChevronRight className="w-3 h-3" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-400 text-xs">
                    No regulatory documents match your filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Document Detail Inspector Modal */}
      {selectedDocDetails && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full border border-slate-200 shadow-xl overflow-hidden animate-fadeIn">
            <div className="p-5 border-b border-[#E5E9F0] flex items-center justify-between bg-slate-50">
              <div className="min-w-0">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#4568F5]">
                  Official Document Dossier
                </span>
                <h3 className="text-base font-bold text-[#111827] truncate">
                  {selectedDocDetails.title}
                </h3>
              </div>
              <button
                onClick={() => setSelectedDocDetails(null)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs">
              <dl className="grid grid-cols-2 gap-4 bg-[#F5F7FB] p-4 rounded-lg border border-[#E5E9F0]">
                <div>
                  <dt className="text-slate-500">Issuing Authority</dt>
                  <dd className="font-semibold text-slate-900">{selectedDocDetails.authority} ({selectedDocDetails.jurisdiction})</dd>
                </div>
                <div>
                  <dt className="text-slate-500">Gazette Identifier</dt>
                  <dd className="font-mono text-slate-900">{selectedDocDetails.documentIdentifier}</dd>
                </div>
                <div>
                  <dt className="text-slate-500">Publication Date</dt>
                  <dd className="font-mono text-slate-900">{selectedDocDetails.publicationDate}</dd>
                </div>
                <div>
                  <dt className="text-slate-500">Effective Date</dt>
                  <dd className="font-mono text-emerald-800 font-semibold">{selectedDocDetails.effectiveDate}</dd>
                </div>
                <div>
                  <dt className="text-slate-500">Extracted Clauses Count</dt>
                  <dd className="font-medium text-slate-900">{selectedDocDetails.extractedClausesCount} clauses</dd>
                </div>
                <div>
                  <dt className="text-slate-500">Verification</dt>
                  <dd className="font-semibold text-emerald-700">{selectedDocDetails.verificationStatus}</dd>
                </div>
              </dl>

              <div>
                <h4 className="font-semibold text-slate-900 mb-1">Official Summary</h4>
                <p className="text-slate-700 leading-relaxed bg-white p-3 rounded border border-slate-200">
                  {selectedDocDetails.summary}
                </p>
              </div>

              {selectedDocDetails.reviewer && (
                <div className="p-3 bg-emerald-50/70 border border-emerald-200/60 rounded flex items-center justify-between">
                  <span className="text-emerald-900 font-medium">
                    Verified by: {selectedDocDetails.reviewer.name}
                  </span>
                  <span className="text-emerald-700 font-mono text-[11px]">
                    {new Date(selectedDocDetails.reviewer.reviewedAt).toLocaleDateString()}
                  </span>
                </div>
              )}

              <div className="flex flex-wrap gap-1.5 pt-2">
                {selectedDocDetails.tags.map((tag, idx) => (
                  <span key={idx} className="text-[11px] font-medium bg-slate-100 text-slate-700 px-2.5 py-0.5 rounded">
                    {tag}
                  </span>
                ))}
              </div>

              <div className="pt-4 border-t border-[#E5E9F0] flex items-center justify-between">
                <a
                  href={selectedDocDetails.sourceUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-[#4568F5] hover:underline inline-flex items-center gap-1 font-medium"
                >
                  <span>Official Gazette Link</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setSelectedDocDetails(null)}
                    className="px-3 py-1.5 text-slate-600 hover:text-slate-800"
                  >
                    Close
                  </button>
                  <button
                    onClick={() => {
                      setSelectedDocDetails(null);
                      onSelectDocumentForCompare(selectedDocDetails.id);
                    }}
                    className="px-4 py-1.5 bg-[#4568F5] hover:bg-[#3454E8] text-white font-medium rounded-lg shadow-xs"
                  >
                    Open in Compare Studio
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
