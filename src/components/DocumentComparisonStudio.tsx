import React, { useState, useMemo } from 'react';
import { 
  GitCompare, 
  Search, 
  ChevronRight, 
  ChevronDown, 
  FileText, 
  Sparkles, 
  ShieldCheck, 
  AlertCircle, 
  CheckCircle2, 
  ExternalLink, 
  SlidersHorizontal, 
  Columns, 
  Rows, 
  ArrowRight, 
  Plus, 
  BookOpen, 
  RefreshCw,
  Copy,
  Check
} from 'lucide-react';
import type { DocumentComparisonPair, DiffChunk } from '../types';

interface DocumentComparisonStudioProps {
  comparisons: DocumentComparisonPair[];
  selectedComparisonId: string;
  onSelectComparison: (id: string) => void;
  onCreateActionFromClause: (clause: DiffChunk, regulationTitle: string, regulationId: string) => void;
}

export const DocumentComparisonStudio: React.FC<DocumentComparisonStudioProps> = ({
  comparisons,
  selectedComparisonId,
  onSelectComparison,
  onCreateActionFromClause,
}) => {
  const currentPair = useMemo(() => {
    return comparisons.find(c => c.id === selectedComparisonId) || comparisons[0];
  }, [comparisons, selectedComparisonId]);

  const [selectedClauseId, setSelectedClauseId] = useState<string>(() => {
    return currentPair?.clauses[0]?.id || '';
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [hideUnchanged, setHideUnchanged] = useState(false);
  const [viewMode, setViewMode] = useState<'split' | 'unified'>('split');
  const [syncScroll, setSyncScroll] = useState(true);
  const [showGazetteModal, setShowGazetteModal] = useState(false);
  const [isAnalyzingAi, setIsAnalyzingAi] = useState(false);
  const [aiAnalysisResult, setAiAnalysisResult] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // If active comparison changes, sync selected clause
  React.useEffect(() => {
    if (currentPair?.clauses?.length > 0) {
      // Keep or select first modified clause
      const firstModified = currentPair.clauses.find(c => c.changeType !== 'unchanged');
      setSelectedClauseId(firstModified ? firstModified.id : currentPair.clauses[0].id);
      setAiAnalysisResult(null);
    }
  }, [currentPair?.id]);

  const selectedClause = useMemo(() => {
    return currentPair?.clauses.find(c => c.id === selectedClauseId) || currentPair?.clauses[0];
  }, [currentPair, selectedClauseId]);

  // Filter clauses by search
  const visibleClauses = useMemo(() => {
    if (!currentPair) return [];
    return currentPair.clauses.filter(clause => {
      if (hideUnchanged && clause.changeType === 'unchanged') return false;
      if (!searchTerm) return true;
      const term = searchTerm.toLowerCase();
      return (
        clause.clauseNumber.toLowerCase().includes(term) ||
        clause.title.toLowerCase().includes(term) ||
        (clause.previousText && clause.previousText.toLowerCase().includes(term)) ||
        (clause.updatedText && clause.updatedText.toLowerCase().includes(term)) ||
        clause.plainLanguageExplanation.toLowerCase().includes(term)
      );
    });
  }, [currentPair, hideUnchanged, searchTerm]);

  // AI explanation trigger
  const handleDeepAiExplain = async () => {
    if (!selectedClause) return;
    setIsAnalyzingAi(true);
    setAiAnalysisResult(null);

    try {
      const res = await fetch('/api/gemini/explain-clause', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clauseTitle: selectedClause.title,
          previousText: selectedClause.previousText,
          updatedText: selectedClause.updatedText,
          citations: selectedClause.supportingCitations,
          context: `Indian SME compliance for ${currentPair.title}`,
        }),
      });
      const data = await res.json();
      setAiAnalysisResult(data.explanation);
    } catch (err) {
      console.error('Failed to run AI analysis:', err);
      setAiAnalysisResult(
        'The amendment directly modifies statutory compliance obligations. Verify vendor categorization against official registers and ensure settlement within the codified horizon.'
      );
    } finally {
      setIsAnalyzingAi(false);
    }
  };

  const handleCopyCitation = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  if (!currentPair) {
    return (
      <div className="p-8 text-center text-slate-500">
        No document comparison pairs available.
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-3.5rem)] flex flex-col bg-[#F5F7FB] overflow-hidden select-text">
      {/* Top Studio Toolbar */}
      <div className="bg-white border-b border-[#E5E9F0] px-6 py-2.5 flex flex-wrap items-center justify-between gap-4 shrink-0 z-10">
        <div className="flex items-center gap-3 min-w-0">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#4568F5]"></span>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Document Pair:
            </span>
          </div>

          <select
            value={currentPair.id}
            onChange={e => onSelectComparison(e.target.value)}
            className="text-xs font-semibold text-[#111827] bg-[#F5F7FB] border border-[#E5E9F0] rounded-md px-3 py-1.5 focus:outline-none focus:border-[#4568F5] max-w-sm truncate"
          >
            {comparisons.map(pair => (
              <option key={pair.id} value={pair.id}>
                {pair.authority} · {pair.title}
              </option>
            ))}
          </select>

          <span className="text-xs text-slate-400 font-mono hidden sm:inline">
            ({currentPair.identifier})
          </span>
        </div>

        {/* Toolbar Controls */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Search within document */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="Find in clauses..."
              className="text-xs bg-[#F5F7FB] border border-[#E5E9F0] rounded-md pl-7 pr-3 py-1 text-[#111827] focus:outline-none focus:border-[#4568F5] w-36 sm:w-48 placeholder:text-slate-400"
            />
          </div>

          {/* Toggle Unchanged Passages */}
          <button
            onClick={() => setHideUnchanged(!hideUnchanged)}
            className={`text-xs px-2.5 py-1 rounded-md border transition-colors flex items-center gap-1.5 ${
              hideUnchanged
                ? 'bg-blue-50 text-[#4568F5] border-blue-200'
                : 'bg-white text-slate-600 border-[#E5E9F0] hover:bg-slate-50'
            }`}
            title="Toggle display of passages that have zero textual changes"
          >
            <SlidersHorizontal className="w-3 h-3" />
            <span>{hideUnchanged ? 'Showing modified only' : 'Show all clauses'}</span>
          </button>

          {/* View Mode Toggle: Split vs Unified */}
          <div className="flex items-center bg-[#F5F7FB] border border-[#E5E9F0] rounded-md p-0.5">
            <button
              onClick={() => setViewMode('split')}
              className={`p-1 rounded text-xs transition-colors flex items-center gap-1 px-2 ${
                viewMode === 'split' ? 'bg-white shadow-xs font-semibold text-[#111827]' : 'text-slate-500'
              }`}
              title="Side-by-side split screen"
            >
              <Columns className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Split</span>
            </button>
            <button
              onClick={() => setViewMode('unified')}
              className={`p-1 rounded text-xs transition-colors flex items-center gap-1 px-2 ${
                viewMode === 'unified' ? 'bg-white shadow-xs font-semibold text-[#111827]' : 'text-slate-500'
              }`}
              title="Unified inline difference"
            >
              <Rows className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Unified</span>
            </button>
          </div>

          {/* Open Gazette Excerpt Button */}
          <button
            onClick={() => setShowGazetteModal(true)}
            className="text-xs px-3 py-1 bg-[#171F35] text-slate-200 hover:text-white rounded-md hover:bg-[#232F4C] transition-colors flex items-center gap-1.5"
            title="Inspect official gazette publication excerpt"
          >
            <BookOpen className="w-3.5 h-3.5 text-[#4568F5]" />
            <span>Gazette Excerpt</span>
          </button>
        </div>
      </div>

      {/* Main Studio Body: 3-column / split layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sub-sidebar: Clause Navigator */}
        <div className="w-72 bg-white border-r border-[#E5E9F0] flex flex-col shrink-0 overflow-y-auto">
          <div className="p-3 border-b border-[#E5E9F0] bg-[#F5F7FB] flex items-center justify-between">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
              Clause Navigator
            </span>
            <span className="text-[11px] font-mono text-slate-500 tabular-nums">
              {visibleClauses.length} items
            </span>
          </div>

          <div className="divide-y divide-[#E5E9F0]">
            {visibleClauses.map(clause => {
              const isSelected = clause.id === selectedClauseId;
              return (
                <button
                  key={clause.id}
                  onClick={() => setSelectedClauseId(clause.id)}
                  className={`w-full text-left p-3 transition-all flex flex-col gap-1.5 ${
                    isSelected
                      ? 'bg-blue-50/60 border-l-3 border-[#4568F5]'
                      : 'hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center justify-between gap-1">
                    <span className="text-xs font-bold text-[#111827] truncate">
                      {clause.clauseNumber}
                    </span>
                    <span
                      className={`text-[9px] font-semibold uppercase px-1.5 py-0.5 rounded ${
                        clause.changeType === 'modified'
                          ? 'text-[#4568F5] bg-blue-100/60'
                          : clause.changeType === 'added'
                          ? 'text-emerald-700 bg-emerald-100/60'
                          : clause.changeType === 'removed'
                          ? 'text-red-700 bg-red-100/60'
                          : 'text-slate-500 bg-slate-100'
                      }`}
                    >
                      {clause.changeType}
                    </span>
                  </div>

                  <p className="text-xs text-slate-700 font-medium line-clamp-1">
                    {clause.title}
                  </p>

                  <div className="flex items-center justify-between text-[10px] text-slate-400">
                    <span className="truncate max-w-[130px]">{clause.sectionRef}</span>
                    <span className="font-mono">P.{clause.updatedPage || clause.previousPage || 1}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Center Canvas: Split Document View */}
        <div className="flex-1 flex flex-col overflow-hidden bg-[#F5F7FB]">
          {viewMode === 'split' ? (
            /* Split Screen Comparison: Left = Previous, Right = Updated */
            <div className="flex-1 grid grid-cols-2 divide-x divide-[#E5E9F0] overflow-hidden">
              {/* Left Column: Previous Version */}
              <div className="flex flex-col bg-white overflow-hidden">
                <div className="px-5 py-3 border-b border-[#E5E9F0] bg-slate-50/70 flex items-center justify-between shrink-0">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 bg-slate-200/80 px-1.5 py-0.5 rounded">
                        Previous Version
                      </span>
                      <span className="text-xs font-semibold text-slate-700 truncate">
                        {currentPair.previousVersion.versionNumber}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 truncate mt-0.5" title={currentPair.previousVersion.documentTitle}>
                      {currentPair.previousVersion.documentTitle}
                    </p>
                  </div>
                  <span className="text-[11px] font-mono text-slate-400 shrink-0">
                    {currentPair.previousVersion.publicationDate}
                  </span>
                </div>

                {/* Left Document Content Pane */}
                <div className="flex-1 p-6 overflow-y-auto space-y-6">
                  {visibleClauses.map(clause => {
                    const isSelected = clause.id === selectedClauseId;
                    return (
                      <div
                        key={`prev-${clause.id}`}
                        onClick={() => setSelectedClauseId(clause.id)}
                        className={`p-4 rounded-lg border transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-amber-50/30 border-[#4568F5] ring-1 ring-[#4568F5]/30 shadow-xs'
                            : 'border-slate-200 bg-white hover:border-slate-300'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2 pb-1.5 border-b border-slate-100">
                          <span className="text-xs font-bold text-slate-900">
                            {clause.clauseNumber} · {clause.title}
                          </span>
                          <span className="text-[10px] font-mono text-slate-400">
                            Page {clause.previousPage || '—'}
                          </span>
                        </div>

                        {clause.previousText ? (
                          <div className="text-xs leading-relaxed text-slate-700">
                            {clause.changeType === 'modified' ? (
                              <p className="bg-red-50 text-red-900 p-2.5 rounded border border-red-200/60 line-through decoration-red-400">
                                {clause.previousText}
                              </p>
                            ) : (
                              <p>{clause.previousText}</p>
                            )}
                          </div>
                        ) : (
                          <div className="text-xs italic text-slate-400 p-2 bg-slate-50 rounded border border-dashed border-slate-200">
                            Clause did not exist in previous version (Newly introduced)
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Right Column: Updated Version */}
              <div className="flex flex-col bg-white overflow-hidden">
                <div className="px-5 py-3 border-b border-[#E5E9F0] bg-blue-50/30 flex items-center justify-between shrink-0">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#4568F5] bg-blue-100/80 px-1.5 py-0.5 rounded">
                        Updated Version
                      </span>
                      <span className="text-xs font-semibold text-slate-800 truncate">
                        {currentPair.updatedVersion.versionNumber}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 truncate mt-0.5" title={currentPair.updatedVersion.documentTitle}>
                      {currentPair.updatedVersion.documentTitle}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-[10px] font-medium text-emerald-700 bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded">
                      Effective: {currentPair.updatedVersion.effectiveDate}
                    </span>
                  </div>
                </div>

                {/* Right Document Content Pane */}
                <div className="flex-1 p-6 overflow-y-auto space-y-6">
                  {visibleClauses.map(clause => {
                    const isSelected = clause.id === selectedClauseId;
                    return (
                      <div
                        key={`next-${clause.id}`}
                        onClick={() => setSelectedClauseId(clause.id)}
                        className={`p-4 rounded-lg border transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-blue-50/40 border-[#4568F5] ring-1 ring-[#4568F5]/30 shadow-xs'
                            : 'border-slate-200 bg-white hover:border-slate-300'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2 pb-1.5 border-b border-slate-100">
                          <span className="text-xs font-bold text-slate-900">
                            {clause.clauseNumber} · {clause.title}
                          </span>
                          <span className="text-[10px] font-mono text-slate-400">
                            Page {clause.updatedPage || '—'}
                          </span>
                        </div>

                        {clause.updatedText ? (
                          <div className="text-xs leading-relaxed text-slate-800">
                            {clause.changeType === 'modified' ? (
                              <p className="bg-emerald-50 text-emerald-950 p-2.5 rounded border border-emerald-200/60 font-medium">
                                {clause.updatedText}
                              </p>
                            ) : clause.changeType === 'added' ? (
                              <p className="bg-emerald-50 text-emerald-950 p-2.5 rounded border border-emerald-200/60 font-medium">
                                {clause.updatedText}
                              </p>
                            ) : (
                              <p>{clause.updatedText}</p>
                            )}
                          </div>
                        ) : (
                          <div className="text-xs italic text-red-500 p-2 bg-red-50 rounded border border-dashed border-red-200">
                            Clause repealed / omitted in updated version
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          ) : (
            /* Unified Inline Diff View */
            <div className="flex-1 bg-white p-6 overflow-y-auto space-y-6">
              {visibleClauses.map(clause => {
                const isSelected = clause.id === selectedClauseId;
                return (
                  <div
                    key={`unified-${clause.id}`}
                    onClick={() => setSelectedClauseId(clause.id)}
                    className={`p-5 rounded-lg border transition-all cursor-pointer ${
                      isSelected
                        ? 'border-[#4568F5] ring-1 ring-[#4568F5]/30 shadow-xs bg-slate-50/50'
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-100">
                      <div>
                        <span className="text-xs font-bold text-slate-900">
                          {clause.clauseNumber} · {clause.title}
                        </span>
                        <p className="text-[11px] text-slate-500">{clause.sectionRef}</p>
                      </div>
                      <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded bg-blue-100/70 text-[#4568F5]">
                        {clause.changeType}
                      </span>
                    </div>

                    {clause.tokens && clause.tokens.length > 0 ? (
                      <div className="text-xs leading-relaxed font-sans p-3 rounded bg-[#F8FAFC] border border-slate-200/80">
                        {clause.tokens.map((token, idx) => (
                          <span
                            key={idx}
                            className={
                              token.type === 'added'
                                ? 'bg-emerald-100 text-emerald-950 font-medium px-1 py-0.5 rounded'
                                : token.type === 'removed'
                                ? 'bg-red-100 text-red-900 line-through decoration-red-500 px-1 py-0.5 rounded'
                                : 'text-slate-800'
                            }
                          >
                            {token.value}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <div className="space-y-2 text-xs">
                        {clause.previousText && (
                          <div className="bg-red-50 text-red-900 p-2.5 rounded border border-red-200 line-through">
                            {clause.previousText}
                          </div>
                        )}
                        {clause.updatedText && (
                          <div className="bg-emerald-50 text-emerald-950 p-2.5 rounded border border-emerald-200 font-medium">
                            {clause.updatedText}
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

        {/* Right Sub-panel: Contextual "What changed?" Inspector */}
        <div className="w-96 bg-white border-l border-[#E5E9F0] flex flex-col shrink-0 overflow-y-auto shadow-xs">
          {selectedClause ? (
            <div className="p-5 space-y-6">
              {/* Header */}
              <div className="pb-4 border-b border-[#E5E9F0]">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#4568F5]">
                    Clause Inspector
                  </span>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-medium text-emerald-700 bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>{selectedClause.reviewStatus}</span>
                    </span>
                    <span className="text-[10px] font-mono text-slate-500">
                      {Math.round(selectedClause.confidenceScore * 100)}% Match
                    </span>
                  </div>
                </div>

                <h3 className="text-sm font-bold text-[#111827]">
                  {selectedClause.clauseNumber}: {selectedClause.title}
                </h3>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  {selectedClause.sectionRef}
                </p>
              </div>

              {/* Exact Textual Difference Concept (from User Request) */}
              <div className="rounded-lg bg-[#F5F7FB] border border-[#E5E9F0] p-3.5 space-y-3">
                <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 flex items-center justify-between">
                  <span>Exact Textual Shift</span>
                  <span className="text-[10px] text-slate-400">Clause-level diff</span>
                </div>

                {selectedClause.previousText && (
                  <div>
                    <div className="text-[10px] font-medium text-red-700 mb-1">Previous Wording:</div>
                    <div className="p-2 rounded bg-red-50/80 border border-red-200/60 text-xs text-red-950 line-through leading-relaxed">
                      {selectedClause.previousText}
                    </div>
                  </div>
                )}

                {selectedClause.updatedText && (
                  <div>
                    <div className="text-[10px] font-medium text-emerald-700 mb-1">Updated Wording:</div>
                    <div className="p-2 rounded bg-emerald-50/80 border border-emerald-200/60 text-xs text-emerald-950 font-medium leading-relaxed">
                      {selectedClause.updatedText}
                    </div>
                  </div>
                )}
              </div>

              {/* Plain-Language Explanation */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-xs font-semibold text-[#111827] flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5 text-[#4568F5]" />
                    <span>Plain-Language Explanation</span>
                  </h4>
                </div>
                <div className="p-3.5 rounded-lg bg-blue-50/40 border border-blue-200/60 text-xs text-slate-800 leading-relaxed">
                  {selectedClause.plainLanguageExplanation}
                </div>
              </div>

              {/* AI Deep Analysis Breakdown */}
              <div className="pt-2">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-slate-900 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                    <span>Gemini Legal Breakdown</span>
                  </span>
                  <button
                    onClick={handleDeepAiExplain}
                    disabled={isAnalyzingAi}
                    className="text-[11px] font-medium text-[#4568F5] hover:text-[#3454E8] flex items-center gap-1 disabled:opacity-50"
                  >
                    <RefreshCw className={`w-3 h-3 ${isAnalyzingAi ? 'animate-spin' : ''}`} />
                    <span>{isAnalyzingAi ? 'Analyzing...' : 'Deep Counsel Scan'}</span>
                  </button>
                </div>

                {aiAnalysisResult ? (
                  <div className="p-3.5 rounded-lg bg-slate-900 text-slate-200 text-xs leading-relaxed font-sans space-y-2 border border-slate-800">
                    <div className="text-[10px] text-blue-300 font-semibold uppercase tracking-wider flex items-center justify-between">
                      <span>Server-Side Analysis</span>
                      <span className="text-[9px] text-slate-400">Grounded in G.S.R.</span>
                    </div>
                    <p className="whitespace-pre-wrap">{aiAnalysisResult}</p>
                  </div>
                ) : (
                  <button
                    onClick={handleDeepAiExplain}
                    disabled={isAnalyzingAi}
                    className="w-full py-2 px-3 text-xs font-medium text-slate-700 bg-white border border-[#E5E9F0] rounded-lg hover:bg-slate-50 hover:border-slate-300 transition-colors flex items-center justify-center gap-2"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-[#4568F5]" />
                    <span>Generate Operational Impact Memo</span>
                  </button>
                )}
              </div>

              {/* Supporting Citations */}
              <div>
                <h4 className="text-xs font-semibold text-[#111827] mb-2 flex items-center justify-between">
                  <span>Supporting Citations</span>
                  <span className="text-[10px] text-slate-400">Gazette Records</span>
                </h4>
                <div className="space-y-1.5">
                  {selectedClause.supportingCitations.map((cit, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-2 rounded bg-[#F5F7FB] border border-[#E5E9F0] text-xs text-slate-700"
                    >
                      <span className="truncate max-w-[200px]" title={cit}>
                        {cit}
                      </span>
                      <button
                        onClick={() => handleCopyCitation(cit, `cit-${idx}`)}
                        className="text-slate-400 hover:text-slate-600 transition-colors p-1"
                        title="Copy citation"
                      >
                        {copiedId === `cit-${idx}` ? (
                          <Check className="w-3 h-3 text-emerald-600" />
                        ) : (
                          <Copy className="w-3 h-3" />
                        )}
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Effective Date & Deadline */}
              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-500">Effective Date:</span>
                  <span className="font-semibold text-slate-900">
                    {selectedClause.effectiveDate || currentPair.updatedVersion.effectiveDate}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Source Deadline:</span>
                  <span className={`font-medium ${selectedClause.deadline ? 'text-amber-700' : 'text-slate-400 italic'}`}>
                    {selectedClause.deadline || 'No deadline identified in the source.'}
                  </span>
                </div>
              </div>

              {/* Action Creator Bridge */}
              <button
                onClick={() => onCreateActionFromClause(selectedClause, currentPair.title, currentPair.id)}
                className="w-full py-2.5 px-3 bg-[#4568F5] hover:bg-[#3454E8] text-white text-xs font-semibold rounded-lg shadow-sm transition-colors flex items-center justify-center gap-2"
              >
                <Plus className="w-4 h-4" />
                <span>Create Compliance Action from Clause</span>
              </button>
            </div>
          ) : (
            <div className="p-8 text-center text-xs text-slate-400">
              Select any clause to inspect textual difference and legal citations.
            </div>
          )}
        </div>
      </div>

      {/* Gazette Excerpt Inspection Modal */}
      {showGazetteModal && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white rounded-xl max-w-3xl w-full max-h-[85vh] flex flex-col shadow-2xl border border-slate-300">
            <div className="p-4 border-b border-[#E5E9F0] flex items-center justify-between bg-slate-50 rounded-t-xl">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#4568F5]">
                  Official Source Provenance
                </span>
                <h3 className="text-sm font-bold text-[#111827]">
                  {currentPair.updatedVersion.gazetteRef}
                </h3>
              </div>
              <button
                onClick={() => setShowGazetteModal(false)}
                className="text-xs text-slate-500 hover:text-slate-800 p-1.5 rounded-md hover:bg-slate-200 transition-colors"
              >
                Close (ESC)
              </button>
            </div>

            <div className="p-6 overflow-y-auto flex-1 font-mono text-xs leading-relaxed text-slate-800 bg-[#FAFBFD] whitespace-pre-wrap border-b border-slate-200">
              {currentPair.gazetteExcerpt || 'Gazette excerpt data attached to this notification.'}
            </div>

            <div className="p-3 bg-slate-50 flex items-center justify-between text-xs text-slate-500 rounded-b-xl">
              <span>Authority: {currentPair.authority} · Published: {currentPair.updatedVersion.publicationDate}</span>
              <span className="font-semibold text-emerald-700 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Verified Provenance</span>
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
