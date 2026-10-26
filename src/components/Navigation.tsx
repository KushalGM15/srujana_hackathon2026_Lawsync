import React from 'react';
import { 
  LayoutDashboard, 
  BookOpen, 
  GitCompare, 
  ShieldAlert, 
  CheckSquare, 
  Building2, 
  Settings, 
  ShieldCheck,
  FileCheck2,
  ChevronRight
} from 'lucide-react';

export type NavTab = 
  | 'overview' 
  | 'library' 
  | 'compare' 
  | 'impact' 
  | 'actions' 
  | 'profile' 
  | 'settings' 
  | 'admin-review';

interface NavigationProps {
  activeTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  isAdmin: boolean;
  onToggleAdmin: () => void;
  pendingReviewCount: number;
  criticalActionsCount: number;
  companyName: string;
}

export const Navigation: React.FC<NavigationProps> = ({
  activeTab,
  onSelectTab,
  isAdmin,
  onToggleAdmin,
  pendingReviewCount,
  criticalActionsCount,
  companyName,
}) => {
  const mainNavItems = [
    { id: 'overview' as NavTab, label: 'Overview', icon: LayoutDashboard },
    { id: 'library' as NavTab, label: 'Regulatory Library', icon: BookOpen },
    { 
      id: 'compare' as NavTab, 
      label: 'Compare Documents', 
      icon: GitCompare,
      badge: 'Core Studio'
    },
    { id: 'impact' as NavTab, label: 'Impact Analysis', icon: ShieldAlert },
    { 
      id: 'actions' as NavTab, 
      label: 'Action Tracker', 
      icon: CheckSquare,
      count: criticalActionsCount > 0 ? criticalActionsCount : undefined
    },
    { id: 'profile' as NavTab, label: 'Business Profile', icon: Building2 },
    { id: 'settings' as NavTab, label: 'Settings & Adapters', icon: Settings },
  ];

  return (
    <aside className="w-64 bg-[#0B1020] text-slate-300 flex flex-col shrink-0 border-r border-[#171F35] select-none h-screen sticky top-0">
      {/* Brand Header */}
      <div className="p-5 border-b border-[#171F35] flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[#4568F5] flex items-center justify-center text-white font-bold tracking-wider text-sm shadow-sm shadow-[#4568F5]/30">
            CS
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-semibold text-white tracking-tight text-sm">CLAUSESIGNAL</span>
            </div>
            <p className="text-[10px] text-slate-400 font-normal tracking-tight">Regulatory Intelligence</p>
          </div>
        </div>
      </div>

      {/* SME Profile Badge */}
      <div className="px-4 py-3 border-b border-[#171F35] bg-[#0E1528]">
        <div className="text-[11px] uppercase tracking-wider text-slate-400 font-medium mb-1">Active Entity</div>
        <div className="text-xs font-medium text-white truncate" title={companyName}>
          {companyName}
        </div>
        <div className="flex items-center gap-2 mt-1 text-[11px] text-slate-400">
          <span>Small MSME</span>
          <span aria-hidden="true">·</span>
          <span>MH, KA, GJ</span>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        <div className="px-2 pb-1.5 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
          Workspace
        </div>

        {mainNavItems.map(item => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-md text-xs font-medium transition-colors ${
                isActive
                  ? 'bg-[#4568F5] text-white shadow-sm'
                  : 'text-slate-300 hover:bg-[#171F35] hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span className="truncate">{item.label}</span>
              </div>
              {item.badge && (
                <span className="text-[9px] uppercase font-semibold tracking-wider px-1.5 py-0.5 rounded bg-white/20 text-white shrink-0">
                  {item.badge}
                </span>
              )}
              {item.count && (
                <span className="text-[10px] font-semibold tabular-nums px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 shrink-0">
                  {item.count}
                </span>
              )}
            </button>
          );
        })}

        {/* Admin Navigation Section */}
        {isAdmin && (
          <div className="pt-4">
            <div className="px-2 pb-1.5 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
              Authority Review
            </div>
            <button
              onClick={() => onSelectTab('admin-review')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-md text-xs font-medium transition-colors ${
                activeTab === 'admin-review'
                  ? 'bg-[#4568F5] text-white shadow-sm'
                  : 'text-slate-300 hover:bg-[#171F35] hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <FileCheck2 className={`w-4 h-4 shrink-0 ${activeTab === 'admin-review' ? 'text-white' : 'text-amber-400'}`} />
                <span className="truncate">Source Review</span>
              </div>
              {pendingReviewCount > 0 && (
                <span className="text-[10px] font-semibold tabular-nums px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 shrink-0">
                  {pendingReviewCount} pending
                </span>
              )}
            </button>
          </div>
        )}
      </nav>

      {/* Role Switcher & Bottom Bar */}
      <div className="p-3 border-t border-[#171F35] bg-[#0B1020]">
        <div className="p-2.5 rounded-lg bg-[#171F35] border border-[#232F4C]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-3.5 h-3.5 text-[#4568F5]" />
              <span className="text-[11px] font-medium text-slate-200">
                {isAdmin ? 'Counsel Reviewer' : 'SME Compliance'}
              </span>
            </div>
            <button
              onClick={onToggleAdmin}
              className="text-[10px] text-[#4568F5] hover:text-white font-medium underline underline-offset-2"
              title="Toggle between SME business user view and Statutory Counsel reviewer view"
            >
              {isAdmin ? 'Switch to SME' : 'Switch to Counsel'}
            </button>
          </div>
          <div className="mt-1 text-[10px] text-slate-400 leading-tight">
            {isAdmin ? 'Official gazette verification mode active' : 'Business impact and actions active'}
          </div>
        </div>

        <div className="mt-3 px-1 flex items-center justify-between text-[10px] text-slate-400">
          <span>v2026.4 · Gazette Grounded</span>
          <span className="text-emerald-400 font-medium">Synced</span>
        </div>
      </div>
    </aside>
  );
};
