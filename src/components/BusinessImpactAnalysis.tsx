import React, { useState } from 'react';
import { 
  ShieldAlert, 
  HelpCircle, 
  ChevronDown, 
  ChevronUp, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  Sparkles, 
  Building2, 
  Sliders, 
  RefreshCw, 
  ExternalLink,
  Info,
  FileText,
  Download
} from 'lucide-react';
import type { 
  ImpactAssessment, 
  BusinessProfile, 
  ApplicabilityStatus 
} from '../types';
import { ImpactReportModal } from './ImpactReportModal';

interface BusinessImpactAnalysisProps {
  impacts: ImpactAssessment[];
  profile: BusinessProfile;
  onUpdateProfile: (updated: Partial<BusinessProfile>) => void;
  onNavigateToCompare: (regulationId: string) => void;
}

export const BusinessImpactAnalysis: React.FC<BusinessImpactAnalysisProps> = ({
  impacts,
  profile,
  onUpdateProfile,
  onNavigateToCompare,
}) => {
  const [filterStatus, setFilterStatus] = useState<string>('All');
  const [expandedAssessmentId, setExpandedAssessmentId] = useState<string | null>(() => {
    return impacts[0]?.id || null;
  });

  // Interactive Scenario Simulator State (allows testing applicability shifts)
  const [simTurnover, setSimTurnover] = useState(profile.annualTurnoverINR);
  const [simSector, setSimSector] = useState(profile.sector);
  const [simBorrowings, setSimBorrowings] = useState(profile.hasExternalBorrowings);
  const [simDataCollect, setSimDataCollect] = useState(profile.collectsCustomerPersonalData);
  const [isAiEvaluating, setIsAiEvaluating] = useState<string | null>(null);
  const [customAiAdvice, setCustomAiAdvice] = useState<Record<string, any>>({});
  const [showReportModal, setShowReportModal] = useState(false);

  const filteredImpacts = impacts.filter(item => {
    if (filterStatus === 'All') return true;
    return item.status === filterStatus;
  });

  const handleApplyScenario = () => {
    onUpdateProfile({
      annualTurnoverINR: simTurnover,
      sector: simSector,
      hasExternalBorrowings: simBorrowings,
      collectsCustomerPersonalData: simDataCollect,
    });
  };

  const handleResetScenario = () => {
    setSimTurnover(profile.annualTurnoverINR);
    setSimSector(profile.sector);
    setSimBorrowings(profile.hasExternalBorrowings);
    setSimDataCollect(profile.collectsCustomerPersonalData);
  };

  const handleRunAiEvaluation = async (assessment: ImpactAssessment) => {
    setIsAiEvaluating(assessment.id);
    try {
      const res = await fetch('/api/gemini/assess-applicability', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          profile,
          clauseText: assessment.supportingPassage,
          ruleTitle: assessment.regulationTitle,
        }),
      });
      const data = await res.json();
      setCustomAiAdvice(prev => ({
        ...prev,
        [assessment.id]: data,
      }));
    } catch (err) {
      console.error('Failed to run AI assessment:', err);
    } finally {
      setIsAiEvaluating(null);
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 animate-fadeIn">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-[#E5E9F0]">
        <div>
          <div className="flex items-center gap-2 mb-2 text-xs font-semibold uppercase tracking-wider text-[#4568F5]">
            <ShieldAlert className="w-4 h-4 text-[#4568F5]" />
            <span>Statutory Applicability Engine</span>
          </div>
          <h2 className="text-2xl font-bold text-[#111827] tracking-tight">
            Business Impact Analysis
          </h2>
          <p className="text-sm text-[#667085] mt-1 max-w-2xl">
            Objective, evidence-backed evaluation linking SME facts to statutory notification thresholds. Every result is transparent and never presented as definitive without human review.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 shrink-0">
          {/* Status Counts Filter */}
          <div className="flex items-center bg-white border border-[#E5E9F0] rounded-lg p-1 text-xs">
            {['All', 'Potentially Applicable', 'Needs Human Review', 'Not Applicable'].map(st => (
              <button
                key={st}
                onClick={() => setFilterStatus(st)}
                className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
                  filterStatus === st
                    ? 'bg-[#4568F5] text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {st}
              </button>
            ))}
          </div>

          {/* Export Stakeholder PDF Button */}
          <button
            onClick={() => setShowReportModal(true)}
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-[#4568F5] hover:bg-[#3454E8] rounded-lg shadow-sm transition-colors"
            title="Export high-resolution executive PDF document for board and legal committee"
          >
            <Download className="w-4 h-4 text-blue-100" />
            <span>Export Stakeholder PDF</span>
          </button>
        </div>
      </div>

      {/* Interactive Scenario Simulator Bar */}
      <div className="bg-white border border-[#E5E9F0] rounded-xl p-5 shadow-xs">
        <div className="flex items-center justify-between pb-3 border-b border-[#F0F3F8]">
          <div className="flex items-center gap-2">
            <Sliders className="w-4 h-4 text-[#4568F5]" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#111827]">
              SME Profile Scenario Simulator
            </h3>
            <span className="text-[11px] text-[#667085]">
              (Simulate threshold changes to test compliance exposure)
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleResetScenario}
              className="text-xs text-slate-500 hover:text-slate-800 px-2 py-1"
            >
              Reset
            </button>
            <button
              onClick={handleApplyScenario}
              className="text-xs font-medium text-white bg-[#4568F5] hover:bg-[#3454E8] px-3 py-1.5 rounded-md transition-colors shadow-xs"
            >
              Recalculate Applicability
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-4 text-xs">
          <div>
            <label className="block text-[#667085] font-medium mb-1">
              Annual Turnover: <span className="font-bold text-[#111827]">₹{simTurnover} Crore</span>
            </label>
            <input
              type="range"
              min="1"
              max="60"
              step="0.5"
              value={simTurnover}
              onChange={e => setSimTurnover(parseFloat(e.target.value))}
              className="w-full accent-[#4568F5]"
            />
            <div className="flex justify-between text-[10px] text-slate-400 mt-1">
              <span>₹1 Cr (Micro)</span>
              <span>₹5 Cr (E-Invoice trigger)</span>
              <span>₹50 Cr (Small Cap)</span>
            </div>
          </div>

          <div>
            <label className="block text-[#667085] font-medium mb-1">
              Sector / Industry
            </label>
            <select
              value={simSector}
              onChange={e => setSimSector(e.target.value as any)}
              className="w-full bg-[#F5F7FB] border border-[#E5E9F0] rounded-md px-2.5 py-1.5 text-xs text-[#111827] focus:outline-none focus:border-[#4568F5]"
            >
              <option value="Precision Manufacturing">Precision Manufacturing</option>
              <option value="IT & Software Services">IT & Software Services</option>
              <option value="Retail & E-Commerce">Retail & E-Commerce</option>
              <option value="Healthcare & Pharma">Healthcare & Pharma</option>
              <option value="Logistics & Supply Chain">Logistics & Supply Chain</option>
            </select>
          </div>

          <div className="flex flex-col justify-center">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={simBorrowings}
                onChange={e => setSimBorrowings(e.target.checked)}
                className="rounded accent-[#4568F5]"
              />
              <span className="text-[#111827] font-medium">Has Bank / NBFC Borrowings</span>
            </label>
            <span className="text-[10px] text-slate-400 ml-5">Triggers RBI Key Fact Statement rules</span>
          </div>

          <div className="flex flex-col justify-center">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={simDataCollect}
                onChange={e => setSimDataCollect(e.target.checked)}
                className="rounded accent-[#4568F5]"
              />
              <span className="text-[#111827] font-medium">Processes Customer Personal Data</span>
            </label>
            <span className="text-[10px] text-slate-400 ml-5">Triggers DPDP Act Fiduciary rules</span>
          </div>
        </div>
      </div>

      {/* Assessments List */}
      <div className="space-y-4">
        {filteredImpacts.map(assessment => {
          const isExpanded = expandedAssessmentId === assessment.id;
          const aiAdvice = customAiAdvice[assessment.id];

          return (
            <div
              key={assessment.id}
              className="bg-white border border-[#E5E9F0] rounded-xl overflow-hidden shadow-xs transition-colors hover:border-[#CBD5E1]"
            >
              {/* Card Header Row */}
              <div 
                onClick={() => setExpandedAssessmentId(isExpanded ? null : assessment.id)}
                className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 cursor-pointer select-none bg-white hover:bg-slate-50/50"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2.5 mb-1.5">
                    <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-800">
                      {assessment.authority}
                    </span>
                    <span className="text-slate-300">·</span>
                    <span className="text-xs font-mono text-slate-500">
                      {assessment.clauseRef}
                    </span>
                    <span className="text-slate-300">·</span>
                    <span
                      className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                        assessment.status === 'Potentially Applicable'
                          ? 'text-amber-800 bg-amber-50 border border-amber-200'
                          : assessment.status === 'Needs Human Review'
                          ? 'text-indigo-800 bg-indigo-50 border border-indigo-200'
                          : 'text-slate-600 bg-slate-100'
                      }`}
                    >
                      {assessment.status}
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-[#111827]">
                    {assessment.regulationTitle}
                  </h3>
                  <p className="text-xs text-[#667085] mt-1 line-clamp-1">
                    {assessment.potentialExposureSummary}
                  </p>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onNavigateToCompare(assessment.regulationId);
                    }}
                    className="text-xs font-medium text-[#4568F5] hover:text-[#3454E8] px-2.5 py-1.5 rounded bg-blue-50/60 hover:bg-blue-100/70 transition-colors"
                  >
                    View Diff in Studio
                  </button>
                  <button className="text-slate-400 p-1">
                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Expandable "Why this result?" breakdown */}
              {isExpanded && (
                <div className="p-6 border-t border-[#E5E9F0] bg-[#FAFBFD] space-y-6 animate-fadeIn">
                  {/* Criteria Checked Table */}
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-[#111827] mb-3 flex items-center gap-1.5">
                      <span>Exact Rule Criteria & Profile Facts Matched</span>
                    </h4>
                    
                    <div className="overflow-x-auto rounded-lg border border-[#E5E9F0] bg-white">
                      <table className="w-full text-xs text-left">
                        <thead className="bg-[#F5F7FB] border-b border-[#E5E9F0] text-slate-500 font-semibold">
                          <tr>
                            <th className="py-2.5 px-4">Statutory Criterion</th>
                            <th className="py-2.5 px-4">Required Regulatory Condition</th>
                            <th className="py-2.5 px-4">Business Profile Fact</th>
                            <th className="py-2.5 px-4 text-center">Status</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[#E5E9F0]">
                          {assessment.criteriaChecked.map((crit, idx) => (
                            <tr key={idx} className="hover:bg-slate-50/50">
                              <td className="py-2.5 px-4 font-medium text-[#111827]">
                                {crit.parameter}
                              </td>
                              <td className="py-2.5 px-4 text-slate-700">
                                {crit.requiredCondition}
                              </td>
                              <td className="py-2.5 px-4 font-mono text-slate-900">
                                {crit.businessActual}
                              </td>
                              <td className="py-2.5 px-4 text-center">
                                {crit.isMet ? (
                                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                                    <CheckCircle2 className="w-3 h-3" /> Met
                                  </span>
                                ) : (
                                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                                    <XCircle className="w-3 h-3" /> Unmet
                                  </span>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Supporting Source Passage */}
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-[#111827] mb-1.5">
                      Supporting Source Passage
                    </h4>
                    <div className="p-3.5 rounded-lg bg-white border border-[#E5E9F0] text-xs font-mono text-slate-800 leading-relaxed">
                      {assessment.supportingPassage}
                    </div>
                  </div>

                  {/* Unresolved Conditions & Human-Review Recommendation */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 rounded-lg bg-amber-50/50 border border-amber-200/80">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-amber-900 mb-2">
                        <AlertTriangle className="w-4 h-4 text-amber-600" />
                        <span>Unresolved Conditions Requiring Verification</span>
                      </div>
                      <ul className="space-y-1.5 text-xs text-amber-950 list-disc list-inside">
                        {assessment.unresolvedConditions.map((cond, idx) => (
                          <li key={idx} className="leading-relaxed">{cond}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="p-4 rounded-lg bg-blue-50/40 border border-blue-200/70">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900 mb-2">
                        <Info className="w-4 h-4 text-[#4568F5]" />
                        <span>Human-Review Recommendation</span>
                      </div>
                      <p className="text-xs text-slate-800 leading-relaxed font-medium">
                        {assessment.humanReviewRecommendation}
                      </p>
                    </div>
                  </div>

                  {/* AI Deep Evaluation Option */}
                  <div className="pt-2 border-t border-slate-200">
                    {aiAdvice ? (
                      <div className="p-4 rounded-lg bg-slate-900 text-slate-200 text-xs space-y-2">
                        <div className="text-[10px] text-blue-300 font-semibold uppercase tracking-wider flex items-center justify-between">
                          <span>Gemini Legal Advisor Evaluation</span>
                          <span>Evaluated at {new Date().toLocaleTimeString()}</span>
                        </div>
                        <p className="text-slate-100 font-medium">{aiAdvice.rationale}</p>
                        {aiAdvice.immediateSteps && (
                          <div className="mt-2 text-[11px] text-slate-300 space-y-1">
                            <span className="font-semibold text-slate-100">Recommended Steps:</span>
                            <ul className="list-disc list-inside">
                              {aiAdvice.immediateSteps.map((step: string, i: number) => (
                                <li key={i}>{step}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    ) : (
                      <button
                        onClick={() => handleRunAiEvaluation(assessment)}
                        disabled={isAiEvaluating === assessment.id}
                        className="inline-flex items-center gap-2 text-xs font-medium text-slate-700 bg-white border border-[#E5E9F0] hover:bg-slate-50 px-3 py-1.5 rounded-lg transition-colors shadow-xs"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-[#4568F5]" />
                        <span>
                          {isAiEvaluating === assessment.id 
                            ? 'Evaluating fact conditions...' 
                            : 'Run Deep AI Fact Matching'}
                        </span>
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Stakeholder Executive PDF Export Modal */}
      <ImpactReportModal
        isOpen={showReportModal}
        onClose={() => setShowReportModal(false)}
        profile={profile}
        impacts={impacts}
      />
    </div>
  );
};
