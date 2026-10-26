import React, { useState, useMemo } from 'react';
import { 
  CheckSquare, 
  Search, 
  Plus, 
  Filter, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  ExternalLink,
  ChevronRight,
  User,
  Calendar,
  X
} from 'lucide-react';
import type { ComplianceAction, ActionPriority, ActionStatus } from '../types';

interface ActionTrackerProps {
  actions: ComplianceAction[];
  onUpdateActionStatus: (id: string, status: ActionStatus) => void;
  onAddAction: (action: Partial<ComplianceAction>) => void;
  onNavigateToCompare: (regulationId: string) => void;
}

export const ActionTracker: React.FC<ActionTrackerProps> = ({
  actions,
  onUpdateActionStatus,
  onAddAction,
  onNavigateToCompare,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [priorityFilter, setPriorityFilter] = useState<string>('All');
  const [showAddModal, setShowAddModal] = useState(false);

  // New action form state
  const [newTitle, setNewTitle] = useState('');
  const [newReg, setNewReg] = useState('Companies (Accounts) Rules');
  const [newClause, setNewClause] = useState('Clause 3(1)');
  const [newOwner, setNewOwner] = useState('Finance & Accounts Lead');
  const [newPriority, setNewPriority] = useState<ActionPriority>('High');
  const [newDueDate, setNewDueDate] = useState('');
  const [newNotes, setNewNotes] = useState('');

  const filteredActions = useMemo(() => {
    return actions.filter(a => {
      if (statusFilter !== 'All' && a.status !== statusFilter) return false;
      if (priorityFilter !== 'All' && a.priority !== priorityFilter) return false;
      if (!searchTerm) return true;
      const term = searchTerm.toLowerCase();
      return (
        a.title.toLowerCase().includes(term) ||
        a.sourceRegulation.toLowerCase().includes(term) ||
        a.supportingClause.toLowerCase().includes(term) ||
        a.owner.toLowerCase().includes(term)
      );
    });
  }, [actions, statusFilter, priorityFilter, searchTerm]);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    onAddAction({
      title: newTitle.trim(),
      sourceRegulation: newReg,
      supportingClause: newClause,
      owner: newOwner,
      priority: newPriority,
      dueDate: newDueDate ? newDueDate : null,
      status: 'Not Started',
      notes: newNotes,
    });

    setNewTitle('');
    setNewDueDate('');
    setNewNotes('');
    setShowAddModal(false);
  };

  const completedCount = actions.filter(a => a.status === 'Completed').length;

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-[#E5E9F0]">
        <div>
          <div className="flex items-center gap-2 mb-2 text-xs font-semibold uppercase tracking-wider text-[#4568F5]">
            <CheckSquare className="w-4 h-4 text-[#4568F5]" />
            <span>Operational Compliance Management</span>
          </div>
          <h2 className="text-2xl font-bold text-[#111827] tracking-tight">
            Action Tracker
          </h2>
          <p className="text-sm text-[#667085] mt-1 max-w-2xl">
            Track statutory obligations derived strictly from regulatory notifications. Deadlines are verified against source texts or flagged when unspecified.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-xs text-[#667085] px-3 py-1.5 bg-white border border-[#E5E9F0] rounded-lg">
            <span className="font-bold text-[#111827] tabular-nums">{completedCount}</span> of{' '}
            <span className="font-bold text-[#111827] tabular-nums">{actions.length}</span> actions completed
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-medium text-white bg-[#4568F5] hover:bg-[#3454E8] rounded-lg transition-colors shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>Create Action</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white border border-[#E5E9F0] rounded-xl p-4 flex flex-wrap items-center justify-between gap-4 shadow-xs">
        <div className="flex items-center gap-3 flex-1 min-w-[260px]">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="Search actions, regulations, owners, clauses..."
              className="w-full text-xs bg-[#F5F7FB] border border-[#E5E9F0] rounded-lg pl-9 pr-4 py-2 text-[#111827] focus:outline-none focus:border-[#4568F5] placeholder:text-slate-400"
            />
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0 text-xs">
          {/* Status Filter */}
          <div className="flex items-center gap-1.5">
            <span className="text-[#667085]">Status:</span>
            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              className="bg-[#F5F7FB] border border-[#E5E9F0] rounded-md px-2.5 py-1.5 font-medium text-[#111827] focus:outline-none focus:border-[#4568F5]"
            >
              <option value="All">All Statuses</option>
              <option value="Not Started">Not Started</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
            </select>
          </div>

          {/* Priority Filter */}
          <div className="flex items-center gap-1.5">
            <span className="text-[#667085]">Priority:</span>
            <select
              value={priorityFilter}
              onChange={e => setPriorityFilter(e.target.value)}
              className="bg-[#F5F7FB] border border-[#E5E9F0] rounded-md px-2.5 py-1.5 font-medium text-[#111827] focus:outline-none focus:border-[#4568F5]"
            >
              <option value="All">All Priorities</option>
              <option value="Critical">Critical</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>
        </div>
      </div>

      {/* Actions Table / List */}
      <div className="bg-white border border-[#E5E9F0] rounded-xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F5F7FB] border-b border-[#E5E9F0] text-slate-500 font-semibold">
              <tr>
                <th className="py-3 px-4 w-12 text-center">Done</th>
                <th className="py-3 px-4">Action Item & Source Regulation</th>
                <th className="py-3 px-4">Supporting Clause</th>
                <th className="py-3 px-4">Source-Supported Due Date</th>
                <th className="py-3 px-4">Priority</th>
                <th className="py-3 px-4">Owner</th>
                <th className="py-3 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E9F0]">
              {filteredActions.length > 0 ? (
                filteredActions.map(action => {
                  const isDone = action.status === 'Completed';

                  return (
                    <tr 
                      key={action.id} 
                      className={`hover:bg-slate-50/70 transition-colors ${
                        isDone ? 'bg-slate-50/40 text-slate-400' : ''
                      }`}
                    >
                      {/* Checkbox */}
                      <td className="py-3.5 px-4 text-center">
                        <input
                          type="checkbox"
                          checked={isDone}
                          onChange={e => {
                            onUpdateActionStatus(
                              action.id,
                              e.target.checked ? 'Completed' : 'In Progress'
                            );
                          }}
                          className="w-4 h-4 rounded accent-[#4568F5] cursor-pointer"
                        />
                      </td>

                      {/* Action Title & Regulation */}
                      <td className="py-3.5 px-4 max-w-sm">
                        <div className={`font-semibold text-sm ${isDone ? 'line-through text-slate-400' : 'text-[#111827]'}`}>
                          {action.title}
                        </div>
                        <div className="flex items-center gap-1.5 text-[11px] text-[#667085] mt-1">
                          <span>{action.sourceRegulation}</span>
                          {action.regulationId && (
                            <button
                              onClick={() => onNavigateToCompare(action.regulationId)}
                              className="text-[#4568F5] hover:underline inline-flex items-center gap-0.5 ml-1"
                              title="Inspect clause comparison"
                            >
                              <span>Inspect diff</span>
                              <ChevronRight className="w-3 h-3" />
                            </button>
                          )}
                        </div>
                        {action.notes && (
                          <p className="text-[11px] text-slate-500 mt-1 italic">
                            "{action.notes}"
                          </p>
                        )}
                      </td>

                      {/* Supporting Clause */}
                      <td className="py-3.5 px-4 font-mono text-[11px] text-slate-600">
                        {action.supportingClause}
                      </td>

                      {/* Due Date (strictly enforced rule) */}
                      <td className="py-3.5 px-4">
                        {action.dueDate ? (
                          <div className="flex items-center gap-1.5 font-medium text-slate-800">
                            <Calendar className="w-3.5 h-3.5 text-slate-400" />
                            <span className="font-mono tabular-nums">{action.dueDate}</span>
                          </div>
                        ) : (
                          <div className="text-[11px] text-slate-400 italic">
                            No deadline identified in the source.
                          </div>
                        )}
                      </td>

                      {/* Priority */}
                      <td className="py-3.5 px-4">
                        <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                          action.priority === 'Critical'
                            ? 'text-red-700 bg-red-50 border border-red-200'
                            : action.priority === 'High'
                            ? 'text-amber-700 bg-amber-50 border border-amber-200'
                            : action.priority === 'Medium'
                            ? 'text-blue-700 bg-blue-50 border border-blue-200'
                            : 'text-slate-600 bg-slate-100'
                        }`}>
                          {action.priority}
                        </span>
                      </td>

                      {/* Owner */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-1.5 text-slate-700">
                          <User className="w-3.5 h-3.5 text-slate-400" />
                          <span>{action.owner}</span>
                        </div>
                      </td>

                      {/* Status Selector */}
                      <td className="py-3.5 px-4">
                        <select
                          value={action.status}
                          onChange={e => onUpdateActionStatus(action.id, e.target.value as ActionStatus)}
                          className={`text-xs font-semibold px-2 py-1 rounded border focus:outline-none ${
                            action.status === 'Completed'
                              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                              : action.status === 'In Progress'
                              ? 'bg-blue-50 text-blue-800 border-blue-200'
                              : 'bg-slate-50 text-slate-700 border-slate-200'
                          }`}
                        >
                          <option value="Not Started">Not Started</option>
                          <option value="In Progress">In Progress</option>
                          <option value="Completed">Completed</option>
                        </select>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400 text-xs">
                    No matching compliance actions found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Action Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-lg w-full border border-slate-200 shadow-xl overflow-hidden animate-fadeIn">
            <div className="p-4 border-b border-[#E5E9F0] flex items-center justify-between bg-slate-50">
              <h3 className="text-sm font-bold text-[#111827]">
                Create Statutory Compliance Action
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="p-5 space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-[#111827] mb-1">
                  Action Title *
                </label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={e => setNewTitle(e.target.value)}
                  placeholder="e.g. Audit supplier aging report for 45-day MSMED cap"
                  className="w-full bg-[#F5F7FB] border border-[#E5E9F0] rounded-lg p-2 text-[#111827] focus:outline-none focus:border-[#4568F5]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-[#111827] mb-1">
                    Source Regulation
                  </label>
                  <input
                    type="text"
                    value={newReg}
                    onChange={e => setNewReg(e.target.value)}
                    className="w-full bg-[#F5F7FB] border border-[#E5E9F0] rounded-lg p-2 text-[#111827] focus:outline-none focus:border-[#4568F5]"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-[#111827] mb-1">
                    Supporting Clause
                  </label>
                  <input
                    type="text"
                    value={newClause}
                    onChange={e => setNewClause(e.target.value)}
                    className="w-full bg-[#F5F7FB] border border-[#E5E9F0] rounded-lg p-2 text-[#111827] focus:outline-none focus:border-[#4568F5]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-[#111827] mb-1">
                    Owner
                  </label>
                  <input
                    type="text"
                    value={newOwner}
                    onChange={e => setNewOwner(e.target.value)}
                    className="w-full bg-[#F5F7FB] border border-[#E5E9F0] rounded-lg p-2 text-[#111827] focus:outline-none focus:border-[#4568F5]"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-[#111827] mb-1">
                    Priority
                  </label>
                  <select
                    value={newPriority}
                    onChange={e => setNewPriority(e.target.value as ActionPriority)}
                    className="w-full bg-[#F5F7FB] border border-[#E5E9F0] rounded-lg p-2 text-[#111827] focus:outline-none focus:border-[#4568F5]"
                  >
                    <option value="Critical">Critical</option>
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-[#111827] mb-1">
                  Source-Supported Due Date (Leave blank if not in source text)
                </label>
                <input
                  type="date"
                  value={newDueDate}
                  onChange={e => setNewDueDate(e.target.value)}
                  className="w-full bg-[#F5F7FB] border border-[#E5E9F0] rounded-lg p-2 text-[#111827] focus:outline-none focus:border-[#4568F5]"
                />
                <span className="text-[10px] text-slate-400 mt-1 block">
                  Per CLAUSESIGNAL guidelines, only specify deadlines substantiated by official Gazette text.
                </span>
              </div>

              <div>
                <label className="block font-semibold text-[#111827] mb-1">
                  Compliance Notes
                </label>
                <textarea
                  rows={2}
                  value={newNotes}
                  onChange={e => setNewNotes(e.target.value)}
                  placeholder="Operational details, audit coordination instructions..."
                  className="w-full bg-[#F5F7FB] border border-[#E5E9F0] rounded-lg p-2 text-[#111827] focus:outline-none focus:border-[#4568F5]"
                />
              </div>

              <div className="pt-3 border-t border-[#E5E9F0] flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-3 py-1.5 text-slate-600 hover:text-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-[#4568F5] hover:bg-[#3454E8] text-white font-medium rounded-lg shadow-xs"
                >
                  Add Action
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
