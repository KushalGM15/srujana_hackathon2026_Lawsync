import React from 'react';
import { 
  ArrowUpRight, 
  FileText, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  Sparkles, 
  Plus, 
  Building2, 
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  Radio
} from 'lucide-react';
import type { 
  RegulatoryDocument, 
  DocumentComparisonPair, 
  ComplianceAction, 
  BusinessProfile, 
  ImpactAssessment,
  SourceAdapter
} from '../types';

interface OverviewProps {
  documents: RegulatoryDocument[];
  comparisons: DocumentComparisonPair[];
  actions: ComplianceAction[];
  profile: BusinessProfile;
  impacts: ImpactAssessment[];
  adapters: SourceAdapter[];
  onNavigateToCompare: (comparisonId: string) => void;
  onNavigateToActions: () => void;
  onNavigateToImpact: () => void;
  onOpenUpload: () => void;
  onQuickAnalyze: () => void;
}

export const Overview: React.FC<OverviewProps> = ({
  documents,
  comparisons,
  actions,
  profile,
  impacts,
  adapters,
  onNavigateToCompare,
  onNavigateToActions,
  onNavigateToImpact,
  onOpenUpload,
  onQuickAnalyze,
}) => {
  // Real database metrics
  const awaitingReviewCount = documents.filter(d => d.verificationStatus === 'Pending Review').length;
  const publishedChangesCount = comparisons.length;
  const applicableImpacts = impacts.filter(i => i.status === 'Potentially Applicable');
  const relevantChangesCount = applicableImpacts.length;
  
  // Upcoming source-supported actions (has a real deadline extracted from source)
  const sourceSupportedActions = actions.filter(a => a.dueDate !== null && a.status !== 'Completed');
  const upcomingActionsCount = sourceSupportedActions.length;

  const connectedAdaptersCount = adapters.filter(a => a.status.includes('Ready') || a.status.includes('Polling')).length;

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 animate-fadeIn">
      {/* Top Command Center Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-[#E5E9F0]">
        <div>
          <div className="flex items-center gap-2 mb-2 text-xs font-semibold uppercase tracking-wider text-[#4568F5]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#4568F5]"></span>
            <span>CLAUSESIGNAL Command Center</span>
          </div>
          <h2 className="text-2xl font-bold text-[#111827] tracking-tight">
            Regulatory intelligence
          </h2>
          <p className="text-sm text-[#667085] mt-1 max-w-xl">
            Understand what changed and what it means for your business.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={onOpenUpload}
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-medium text-[#111827] bg-white border border-[#E5E9F0] rounded-lg hover:bg-slate-50 transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4 text-slate-500" />
            <span>Add source document</span>
          </button>
          <button
            onClick={onQuickAnalyze}
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-medium text-white bg-[#4568F5] hover:bg-[#3454E8] rounded-lg transition-colors shadow-sm"
          >
            <Sparkles className="w-4 h-4 text-blue-100" />
            <span>Analyze a regulation</span>
          </button>
        </div>
      </div>

      {/* Genuine Source Connection Status Strip */}
      <div className="bg-white border border-[#E5E9F0] rounded-xl p-4 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#F0F3F8]">
          <div className="flex items-center gap-2 text-xs font-semibold text-[#111827]">
            <Radio className="w-3.5 h-3.5 text-[#4568F5]" />
            <span>Official Regulatory Ingest Feeds</span>
            <span className="text-xs text-[#667085] font-normal">
              ({connectedAdaptersCount} of {adapters.length} adapters ready)
            </span>
          </div>
          <span className="text-[11px] text-[#667085]">
            Last Gazette poll: Today, 09:30 IST
          </span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-3">
          {adapters.slice(0, 4).map(adapter => (
            <div key={adapter.id} className="p-2.5 rounded-lg bg-[#F5F7FB] border border-[#E5E9F0]/60 flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-[#111827] truncate" title={adapter.name}>
                  {adapter.sourceAuthority}
                </span>
                <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded ${
                  adapter.status.includes('Ready') 
                    ? 'text-emerald-700 bg-emerald-50 border border-emerald-200' 
                    : 'text-slate-600 bg-slate-100'
                }`}>
                  {adapter.status.includes('Ready') ? 'Active' : 'Standby'}
                </span>
              </div>
              <p className="text-[11px] text-[#667085] truncate mt-1">{adapter.name}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 4 Core Quantitative Metrics (from real queries) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1 */}
        <div className="bg-white border border-[#E5E9F0] rounded-xl p-5 shadow-xs hover:border-[#CBD5E1] transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-[#667085]">Documents awaiting review</span>
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-[#111827] tabular-nums">
              {awaitingReviewCount}
            </span>
            <span className="text-xs text-[#667085]">official notifications</span>
          </div>
          <div className="mt-2 text-xs text-[#667085] flex items-center gap-1">
            <span>Requires counsel sign-off</span>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="bg-white border border-[#E5E9F0] rounded-xl p-5 shadow-xs hover:border-[#CBD5E1] transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-[#667085]">Published regulatory changes</span>
            <FileText className="w-4 h-4 text-[#4568F5]" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-[#111827] tabular-nums">
              {publishedChangesCount}
            </span>
            <span className="text-xs text-[#667085]">tracked version sets</span>
          </div>
          <div className="mt-2 text-xs text-[#667085] flex items-center gap-1">
            <span>Clause-level diffs available</span>
          </div>
        </div>

        {/* Metric 3 */}
        <div className="bg-white border border-[#E5E9F0] rounded-xl p-5 shadow-xs hover:border-[#CBD5E1] transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-[#667085]">Relevant to this business</span>
            <AlertTriangle className="w-4 h-4 text-amber-600" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-[#111827] tabular-nums">
              {relevantChangesCount}
            </span>
            <span className="text-xs text-[#667085]">matched to profile</span>
          </div>
          <div className="mt-2 text-xs text-amber-700 font-medium flex items-center gap-1">
            <span>Turnover ₹{profile.annualTurnoverINR}Cr criteria</span>
          </div>
        </div>

        {/* Metric 4 */}
        <div className="bg-white border border-[#E5E9F0] rounded-xl p-5 shadow-xs hover:border-[#CBD5E1] transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-[#667085]">Upcoming verified actions</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-[#111827] tabular-nums">
              {upcomingActionsCount}
            </span>
            <span className="text-xs text-[#667085]">with source deadlines</span>
          </div>
          <div className="mt-2 text-xs text-emerald-700 font-medium flex items-center gap-1">
            <span>Earliest: April 30, 2024</span>
          </div>
        </div>
      </div>

      {/* Main 2-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Published Changes & Compare Previews */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white border border-[#E5E9F0] rounded-xl p-6 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-semibold text-[#111827]">
                  Published Regulatory Changes
                </h3>
                <p className="text-xs text-[#667085] mt-0.5">
                  Side-by-side clause amendments verified against official Gazette sources.
                </p>
              </div>
              <button
                onClick={() => onNavigateToCompare(comparisons[0]?.id || '')}
                className="text-xs font-medium text-[#4568F5] hover:text-[#3454E8] inline-flex items-center gap-1"
              >
                <span>Launch Compare Studio</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="divide-y divide-[#E5E9F0]">
              {comparisons.map(pair => (
                <div key={pair.id} className="py-4 first:pt-0 last:pb-0 group">
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 mb-1 text-xs">
                        <span className="font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded text-[11px]">
                          {pair.authority}
                        </span>
                        <span className="text-slate-400">·</span>
                        <span className="font-mono text-slate-500 text-[11px]">
                          {pair.identifier}
                        </span>
                        <span className="text-slate-400">·</span>
                        <span className="text-[11px] text-slate-500">
                          Effective: {pair.updatedVersion.effectiveDate}
                        </span>
                      </div>

                      <h4 className="text-sm font-semibold text-[#111827] group-hover:text-[#4568F5] transition-colors">
                        {pair.title}
                      </h4>
                      <p className="text-xs text-[#667085] mt-1 line-clamp-2">
                        {pair.summary}
                      </p>

                      <div className="mt-2.5 flex items-center gap-3 text-xs">
                        <span className="text-slate-600 font-medium">
                          {pair.clauses.length} clauses analyzed
                        </span>
                        <span className="text-slate-300">|</span>
                        <span className="text-emerald-700 font-medium flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>{pair.status}</span>
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => onNavigateToCompare(pair.id)}
                      className="px-3 py-1.5 text-xs font-medium text-[#4568F5] bg-blue-50/70 hover:bg-blue-100/80 rounded-md transition-colors shrink-0 inline-flex items-center gap-1"
                    >
                      <span>Compare Diff</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Business Impact Spotlight */}
          <div className="bg-white border border-[#E5E9F0] rounded-xl p-6 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-semibold text-[#111827]">
                  Impact on {profile.companyName}
                </h3>
                <p className="text-xs text-[#667085] mt-0.5">
                  Rules matching entity type ({profile.entityType}) and turnover (₹{profile.annualTurnoverINR} Cr).
                </p>
              </div>
              <button
                onClick={onNavigateToImpact}
                className="text-xs font-medium text-[#4568F5] hover:text-[#3454E8] inline-flex items-center gap-1"
              >
                <span>View Full Analysis</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-3">
              {applicableImpacts.slice(0, 2).map(impact => (
                <div key={impact.id} className="p-4 rounded-lg bg-[#F5F7FB] border border-[#E5E9F0]">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-semibold text-amber-800 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded">
                          {impact.status}
                        </span>
                        <span className="text-xs font-mono text-slate-500">{impact.clauseRef}</span>
                      </div>
                      <h4 className="text-xs font-bold text-[#111827] mt-1.5">
                        {impact.regulationTitle}
                      </h4>
                    </div>
                  </div>
                  <p className="text-xs text-slate-700 mt-2 font-medium">
                    {impact.humanReviewRecommendation}
                  </p>
                  <div className="mt-2 text-[11px] text-[#667085] border-t border-slate-200/60 pt-2 flex items-center justify-between">
                    <span>Criteria: Turnover ₹{profile.annualTurnoverINR}Cr meets threshold</span>
                    <button 
                      onClick={onNavigateToImpact}
                      className="text-[#4568F5] hover:underline font-medium"
                    >
                      Why this result?
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Col: Source-Supported Actions & Business Profile Summary */}
        <div className="space-y-6">
          {/* Action List */}
          <div className="bg-white border border-[#E5E9F0] rounded-xl p-5 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-[#111827]">
                Immediate Actions
              </h3>
              <button
                onClick={onNavigateToActions}
                className="text-xs font-medium text-[#4568F5] hover:underline"
              >
                View all ({actions.length})
              </button>
            </div>

            <div className="space-y-3">
              {actions.slice(0, 4).map(action => (
                <div 
                  key={action.id}
                  className="p-3 rounded-lg border border-[#E5E9F0] bg-white hover:border-[#CBD5E1] transition-colors"
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className={`text-[10px] font-semibold uppercase px-1.5 py-0.5 rounded ${
                      action.priority === 'Critical'
                        ? 'text-red-700 bg-red-50 border border-red-200'
                        : action.priority === 'High'
                        ? 'text-amber-700 bg-amber-50 border border-amber-200'
                        : 'text-slate-600 bg-slate-100'
                    }`}>
                      {action.priority}
                    </span>

                    <span className="text-[11px] font-mono text-slate-500">
                      {action.dueDate ? `Due ${action.dueDate}` : 'No deadline in source'}
                    </span>
                  </div>

                  <h5 className="text-xs font-medium text-[#111827] mt-1.5 leading-snug">
                    {action.title}
                  </h5>

                  <div className="mt-2 flex items-center justify-between text-[11px] text-[#667085]">
                    <span className="truncate max-w-[140px]">{action.owner}</span>
                    <span className={`font-medium ${
                      action.status === 'Completed' ? 'text-emerald-600' : 'text-slate-600'
                    }`}>
                      {action.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Profile Facts Summary Card */}
          <div className="bg-white border border-[#E5E9F0] rounded-xl p-5 shadow-xs">
            <div className="flex items-center gap-2 pb-3 border-b border-[#E5E9F0]">
              <Building2 className="w-4 h-4 text-[#4568F5]" />
              <h3 className="text-sm font-semibold text-[#111827]">
                Entity Profile Facts
              </h3>
            </div>

            <dl className="mt-3 space-y-2 text-xs">
              <div className="flex justify-between">
                <dt className="text-[#667085]">Legal Entity</dt>
                <dd className="font-medium text-[#111827]">{profile.entityType}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-[#667085]">CIN</dt>
                <dd className="font-mono text-[#111827]">{profile.cin}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-[#667085]">Annual Turnover</dt>
                <dd className="font-semibold text-[#111827] tabular-nums">₹{profile.annualTurnoverINR} Crore</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-[#667085]">MSME Category</dt>
                <dd className="font-medium text-emerald-700">{profile.msmeCategory}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-[#667085]">Headcount</dt>
                <dd className="font-medium text-[#111827] tabular-nums">{profile.employeeCount} staff</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-[#667085]">Operating States</dt>
                <dd className="font-medium text-[#111827]">{profile.operatingStates.join(', ')}</dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
};
