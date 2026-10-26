import React from 'react';
import { Search, Plus, Sparkles, Shield, ChevronRight } from 'lucide-react';

interface TopBarProps {
  currentTabName: string;
  onOpenUpload: () => void;
  onQuickAnalyze: () => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  isAdmin: boolean;
}

export const TopBar: React.FC<TopBarProps> = ({
  currentTabName,
  onOpenUpload,
  onQuickAnalyze,
  searchQuery,
  onSearchChange,
  isAdmin,
}) => {
  return (
    <header className="h-14 border-b border-[#E5E9F0] bg-white px-6 flex items-center justify-between gap-6 shrink-0 sticky top-0 z-20">
      {/* Zone 1: Breadcrumb Trail */}
      <div className="flex items-center gap-2 min-w-0">
        <span className="text-xs font-semibold text-slate-400 tracking-wider uppercase shrink-0">
          CLAUSESIGNAL
        </span>
        <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
        <h1 className="text-sm font-semibold text-[#111827] truncate">
          {currentTabName}
        </h1>
        {isAdmin && (
          <span className="ml-2 text-[10px] font-medium text-amber-700 bg-amber-50 border border-amber-200/80 px-2 py-0.5 rounded shrink-0">
            Counsel Review Mode
          </span>
        )}
      </div>

      {/* Zone 2: Global Search Input */}
      <div className="flex-1 max-w-md relative hidden md:block">
        <div className="relative">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => onSearchChange(e.target.value)}
            placeholder="Search regulations, clauses, Gazette notifications (e.g. 43B(h), KFS, E-invoice)..."
            className="w-full bg-[#F5F7FB] border border-[#E5E9F0] text-xs text-[#111827] pl-8 pr-12 py-1.5 rounded-md focus:outline-none focus:border-[#4568F5] focus:bg-white transition-colors placeholder:text-slate-400"
          />
          <kbd className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] font-mono text-slate-400 bg-white border border-[#E5E9F0] px-1.5 py-0.2 rounded pointer-events-none">
            /
          </kbd>
        </div>
      </div>

      {/* Zone 3: Primary Actions */}
      <div className="flex items-center gap-2.5 shrink-0">
        <button
          onClick={onOpenUpload}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[#111827] bg-[#F5F7FB] border border-[#E5E9F0] rounded-md hover:bg-slate-100 transition-colors whitespace-nowrap shrink-0"
        >
          <Plus className="w-3.5 h-3.5 text-slate-600" />
          <span>Add Source Document</span>
        </button>

        <button
          onClick={onQuickAnalyze}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium text-white bg-[#4568F5] hover:bg-[#3454E8] rounded-md shadow-sm transition-colors whitespace-nowrap shrink-0"
        >
          <Sparkles className="w-3.5 h-3.5 text-blue-100" />
          <span>Analyze a Regulation</span>
        </button>
      </div>
    </header>
  );
};
