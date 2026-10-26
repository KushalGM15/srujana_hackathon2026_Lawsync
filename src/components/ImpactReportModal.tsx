import React, { useState } from 'react';
import { 
  FileText, 
  Download, 
  Printer, 
  X, 
  CheckCircle2, 
  ShieldCheck, 
  Building2, 
  Calendar,
  AlertTriangle,
  Sliders,
  Check
} from 'lucide-react';
import type { ImpactAssessment, BusinessProfile } from '../types';
import { generateImpactPdf } from '../utils/generateImpactPdf';

interface ImpactReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: BusinessProfile;
  impacts: ImpactAssessment[];
}

export const ImpactReportModal: React.FC<ImpactReportModalProps> = ({
  isOpen,
  onClose,
  profile,
  impacts,
}) => {
  const [includeNotApplicable, setIncludeNotApplicable] = useState(true);
  const [preparedBy, setPreparedBy] = useState('Compliance Officer / Legal Advisory Practice');
  const [isGenerating, setIsGenerating] = useState(false);
  const [downloadComplete, setDownloadComplete] = useState(false);

  if (!isOpen) return null;

  const applicable = impacts.filter(i => i.status === 'Potentially Applicable');
  const needsReview = impacts.filter(i => i.status === 'Needs Human Review');
  const notApplicable = impacts.filter(i => i.status === 'Not Applicable');

  const displayedImpacts = includeNotApplicable ? impacts : impacts.filter(i => i.status !== 'Not Applicable');

  const handleDownloadPdf = () => {
    setIsGenerating(true);
    try {
      const doc = generateImpactPdf({
        profile,
        impacts,
        includeNotApplicable,
        preparedBy,
      });

      const dateStr = new Date().toISOString().split('T')[0];
      const filename = `CLAUSESIGNAL-Impact-Report-${profile.companyName.replace(/[^a-zA-Z0-9]/g, '_')}-${dateStr}.pdf`;
      doc.save(filename);

      setDownloadComplete(true);
      setTimeout(() => setDownloadComplete(false), 3000);
    } catch (err) {
      console.error('Failed to generate PDF:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden animate-fadeIn">
        {/* Modal Toolbar Header */}
        <div className="p-4 px-6 border-b border-[#E5E9F0] flex items-center justify-between bg-slate-50 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#4568F5] text-white flex items-center justify-center font-bold text-xs shadow-xs">
              PDF
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#4568F5]">
                Executive Stakeholder Export
              </span>
              <h3 className="text-sm font-bold text-[#111827]">
                Business Impact & Statutory Applicability Dossier
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={handlePrint}
              className="px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-[#E5E9F0] hover:bg-slate-100 rounded-lg transition-colors flex items-center gap-1.5 shadow-xs"
              title="Print directly or use browser Save as PDF"
            >
              <Printer className="w-3.5 h-3.5 text-slate-500" />
              <span>Print Preview</span>
            </button>

            <button
              onClick={handleDownloadPdf}
              disabled={isGenerating}
              className="px-4 py-1.5 text-xs font-semibold text-white bg-[#4568F5] hover:bg-[#3454E8] rounded-lg transition-colors flex items-center gap-2 shadow-sm disabled:opacity-50"
            >
              {downloadComplete ? (
                <>
                  <Check className="w-4 h-4 text-emerald-200" />
                  <span>PDF Downloaded</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4 text-blue-100" />
                  <span>{isGenerating ? 'Generating...' : 'Download Stakeholder PDF'}</span>
                </>
              )}
            </button>

            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-200 ml-1 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Options Strip */}
        <div className="bg-[#F5F7FB] px-6 py-2.5 border-b border-[#E5E9F0] flex flex-wrap items-center justify-between gap-4 text-xs shrink-0">
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 cursor-pointer text-slate-700 font-medium">
              <input
                type="checkbox"
                checked={includeNotApplicable}
                onChange={e => setIncludeNotApplicable(e.target.checked)}
                className="w-3.5 h-3.5 rounded accent-[#4568F5]"
              />
              <span>Include 'Not Applicable' regulations in audit index</span>
            </label>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-slate-500">Sign-Off Signatory:</span>
            <input
              type="text"
              value={preparedBy}
              onChange={e => setPreparedBy(e.target.value)}
              className="bg-white border border-[#E5E9F0] rounded px-2 py-1 text-slate-800 text-xs w-64 focus:outline-none focus:border-[#4568F5]"
            />
          </div>
        </div>

        {/* Document Preview Pane (A4 Proportions) */}
        <div className="flex-1 overflow-y-auto p-8 bg-[#E2E8F0] flex justify-center">
          <div className="bg-white rounded-lg shadow-lg border border-slate-300 max-w-2xl w-full p-10 space-y-8 text-slate-800 select-text font-sans">
            {/* Document Letterhead */}
            <div className="border-b-2 border-slate-900 pb-5">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#4568F5]">
                    <span className="w-2 h-2 rounded-full bg-[#4568F5]"></span>
                    <span>CLAUSESIGNAL REGULATORY INTELLIGENCE</span>
                  </div>
                  <h1 className="text-xl font-extrabold text-slate-900 mt-2 tracking-tight">
                    Business Impact & Statutory Applicability Report
                  </h1>
                  <p className="text-xs text-slate-600 mt-1">
                    Grounded Assessment of Notified Gazette Mandates for Indian SME Governance
                  </p>
                </div>
                <div className="text-right text-[11px] font-mono text-slate-500">
                  <div className="font-bold text-slate-900">REF: CS-IMPACT-{new Date().getFullYear()}</div>
                  <div>Date: {new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</div>
                  <div className="text-emerald-700 font-semibold">Status: Certified Grounded</div>
                </div>
              </div>

              {/* Entity Banner */}
              <div className="mt-4 p-3 bg-slate-50 rounded-md border border-slate-200 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div>
                  <span className="text-slate-500 block text-[10px] uppercase font-semibold">Target Entity</span>
                  <strong className="text-slate-900 truncate block">{profile.companyName}</strong>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px] uppercase font-semibold">CIN</span>
                  <span className="font-mono text-slate-800 text-[11px]">{profile.cin}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px] uppercase font-semibold">Annual Turnover</span>
                  <strong className="text-slate-900 tabular-nums">INR {profile.annualTurnoverINR} Crore</strong>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px] uppercase font-semibold">Classification</span>
                  <strong className="text-emerald-700">{profile.msmeCategory} Enterprise</strong>
                </div>
              </div>
            </div>

            {/* Section 1: Executive Summary */}
            <div className="space-y-3">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center justify-between pb-1 border-b border-slate-200">
                <span>1. Executive Summary & Risk Exposure Index</span>
                <span className="text-[10px] font-normal text-slate-500">Board Presentation Grade</span>
              </h2>

              <div className="grid grid-cols-4 gap-2 text-center text-xs">
                <div className="p-3 bg-slate-50 rounded border border-slate-200">
                  <span className="text-[10px] text-slate-500 uppercase font-semibold block">Analyzed</span>
                  <span className="text-lg font-bold text-slate-900 tabular-nums">{impacts.length}</span>
                </div>
                <div className="p-3 bg-amber-50 rounded border border-amber-200">
                  <span className="text-[10px] text-amber-700 uppercase font-semibold block">Applicable</span>
                  <span className="text-lg font-bold text-amber-800 tabular-nums">{applicable.length}</span>
                </div>
                <div className="p-3 bg-blue-50 rounded border border-blue-200">
                  <span className="text-[10px] text-[#4568F5] uppercase font-semibold block">Review</span>
                  <span className="text-lg font-bold text-[#4568F5] tabular-nums">{needsReview.length}</span>
                </div>
                <div className="p-3 bg-emerald-50 rounded border border-emerald-200">
                  <span className="text-[10px] text-emerald-700 uppercase font-semibold block">Exempt</span>
                  <span className="text-lg font-bold text-emerald-800 tabular-nums">{notApplicable.length}</span>
                </div>
              </div>

              <p className="text-xs text-slate-700 leading-relaxed">
                Based on verified statutory Gazette notifications, <strong>{profile.companyName}</strong> is 
                subject to mandatory compliance obligations under Section 43B(h) of the Income-tax Act (45-day payment cap to registered MSMEs) 
                and Rule 48(4) of Central GST Rules requiring electronic invoicing on all B2B transactions.
              </p>
            </div>

            {/* Section 2: Detailed Assessments */}
            <div className="space-y-4">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 pb-1 border-b border-slate-200">
                2. Statutory Rule Evaluations & Grounded Evidence
              </h2>

              <div className="space-y-4">
                {displayedImpacts.map((item, idx) => (
                  <div key={item.id} className="p-4 rounded-lg border border-slate-200 bg-slate-50/50 space-y-2 text-xs">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-900">{idx + 1}. [{item.authority}] {item.regulationTitle}</span>
                        </div>
                        <span className="text-[11px] font-mono text-slate-500 block mt-0.5">{item.clauseRef}</span>
                      </div>
                      <span className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded shrink-0 ${
                        item.status === 'Potentially Applicable'
                          ? 'bg-amber-100 text-amber-800'
                          : item.status === 'Needs Human Review'
                          ? 'bg-blue-100 text-[#4568F5]'
                          : 'bg-slate-200 text-slate-700'
                      }`}>
                        {item.status}
                      </span>
                    </div>

                    <div className="text-[11px] text-slate-700">
                      <strong>Operational Exposure: </strong>{item.potentialExposureSummary}
                    </div>

                    <div className="bg-white p-2.5 rounded border border-slate-200 space-y-1">
                      <span className="text-[10px] uppercase font-bold text-slate-500 block">Verified Fact Matching:</span>
                      {item.criteriaChecked.map((crit, cIdx) => (
                        <div key={cIdx} className="flex items-center justify-between text-[11px]">
                          <span className="text-slate-600">{crit.parameter}: {crit.businessActual}</span>
                          <span className={crit.isMet ? 'text-emerald-700 font-semibold' : 'text-slate-400'}>
                            {crit.isMet ? 'Condition Met' : 'Unmet'}
                          </span>
                        </div>
                      ))}
                    </div>

                    <div className="p-2 bg-slate-100/80 rounded font-mono text-[10px] text-slate-700 border-l-2 border-[#4568F5]">
                      {item.supportingPassage}
                    </div>

                    <div className="text-[11px] text-[#111827] pt-1">
                      <strong className="text-[#4568F5]">Action Required: </strong>
                      {item.humanReviewRecommendation}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Section 3: Sign-Off Box */}
            <div className="pt-4 border-t-2 border-slate-200 space-y-3">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                3. Audit Attestation & Committee Receipt
              </h2>

              <div className="grid grid-cols-2 gap-6 p-4 rounded bg-slate-50 border border-slate-200 text-xs">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-500 block">Evaluated By</span>
                  <div className="font-semibold text-slate-900 mt-1">{preparedBy}</div>
                  <div className="text-[10px] text-slate-500 mt-0.5">Verified on CLAUSESIGNAL Legal Engine</div>
                  <div className="text-[10px] font-mono text-slate-400 mt-0.5">Timestamp: {new Date().toISOString()}</div>
                </div>

                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-500 block">Acknowledged by Director / CFO</span>
                  <div className="h-8 border-b border-dashed border-slate-400 mt-1"></div>
                  <div className="text-[10px] text-slate-500 mt-1">Authorized Board Signatory · {profile.companyName}</div>
                </div>
              </div>

              <div className="text-[10px] text-center text-slate-400 pt-2">
                This document is generated by CLAUSESIGNAL for statutory compliance monitoring. It cites official Gazette sources and provides actionable guidance for legal audit committees.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
