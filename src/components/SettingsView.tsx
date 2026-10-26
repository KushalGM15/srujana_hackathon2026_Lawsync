import React, { useState } from 'react';
import { 
  Settings, 
  Radio, 
  Download, 
  ShieldCheck, 
  FileText, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  ExternalLink,
  RefreshCw
} from 'lucide-react';
import type { SourceAdapter, AuditLogEntry, ComplianceAction, BusinessProfile, ImpactAssessment } from '../types';
import { generateImpactPdf } from '../utils/generateImpactPdf';

interface SettingsViewProps {
  adapters: SourceAdapter[];
  auditLogs: AuditLogEntry[];
  actions: ComplianceAction[];
  profile?: BusinessProfile;
  impacts?: ImpactAssessment[];
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  adapters,
  auditLogs,
  actions,
  profile,
  impacts,
}) => {
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  const handleExportJson = () => {
    const data = {
      exportTimestamp: new Date().toISOString(),
      platform: 'CLAUSESIGNAL',
      totalActions: actions.length,
      actions,
      sourceAdapters: adapters,
      auditLogs,
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `clausesignal-compliance-pack-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 3000);
  };

  const handleExportCsv = () => {
    const headers = ['Action Title', 'Source Regulation', 'Supporting Clause', 'Due Date', 'Owner', 'Priority', 'Status'];
    const rows = actions.map(a => [
      `"${a.title.replace(/"/g, '""')}"`,
      `"${a.sourceRegulation.replace(/"/g, '""')}"`,
      `"${a.supportingClause.replace(/"/g, '""')}"`,
      `"${a.dueDate || 'No deadline in source'}"`,
      `"${a.owner}"`,
      `"${a.priority}"`,
      `"${a.status}"`,
    ]);
    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `clausesignal-actions-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 3000);
  };

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-[#E5E9F0]">
        <div>
          <div className="flex items-center gap-2 mb-2 text-xs font-semibold uppercase tracking-wider text-[#4568F5]">
            <Settings className="w-4 h-4 text-[#4568F5]" />
            <span>Integrations & Governance</span>
          </div>
          <h2 className="text-2xl font-bold text-[#111827] tracking-tight">
            Settings & Official Source Adapters
          </h2>
          <p className="text-sm text-[#667085] mt-1 max-w-xl">
            Manage ingest gateways, observe adapter sync health, and export certified compliance packages for external auditors.
          </p>
        </div>

        {downloadSuccess && (
          <div className="text-xs text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-lg flex items-center gap-1.5 font-medium animate-fadeIn">
            <CheckCircle2 className="w-4 h-4" />
            <span>Export generated successfully!</span>
          </div>
        )}
      </div>

      {/* Official Source Adapters Section */}
      <div className="bg-white border border-[#E5E9F0] rounded-xl p-6 shadow-xs space-y-4">
        <div>
          <h3 className="text-sm font-bold text-[#111827] flex items-center gap-2">
            <Radio className="w-4 h-4 text-[#4568F5]" />
            <span>Official Regulatory Source Adapters</span>
          </h3>
          <p className="text-xs text-[#667085] mt-1">
            Adapters interface directly with government gazette release portals. Unconnected adapters are clearly labeled until active endpoints are provisioned.
          </p>
        </div>

        <div className="divide-y divide-[#E5E9F0] border-t border-[#E5E9F0] pt-2">
          {adapters.map(adapter => (
            <div key={adapter.id} className="py-4 first:pt-2 last:pb-0 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="min-w-0">
                <div className="flex items-center gap-2.5">
                  <span className="text-xs font-bold text-[#111827]">{adapter.name}</span>
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                    adapter.status.includes('Ready')
                      ? 'text-emerald-800 bg-emerald-50 border border-emerald-200'
                      : 'text-slate-500 bg-slate-100'
                  }`}>
                    {adapter.status}
                  </span>
                </div>
                <div className="text-[11px] font-mono text-slate-500 mt-1 truncate max-w-md">
                  {adapter.endpointUrl}
                </div>
                <div className="flex items-center gap-3 mt-1.5 text-[11px] text-slate-500">
                  <span>Authority: <strong className="text-slate-700">{adapter.sourceAuthority}</strong></span>
                  <span>·</span>
                  <span>Cadence: {adapter.cadence}</span>
                  <span>·</span>
                  <span>Ingested: {adapter.totalDocumentsIngested} notices</span>
                </div>
              </div>

              <div className="text-right shrink-0 text-xs">
                <span className="text-slate-400 block text-[11px]">Last Sync</span>
                <span className="font-mono text-slate-700 font-medium">{adapter.lastPolled}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Compliance Data Export */}
      <div className="bg-white border border-[#E5E9F0] rounded-xl p-6 shadow-xs space-y-4">
        <div>
          <h3 className="text-sm font-bold text-[#111827] flex items-center gap-2">
            <Download className="w-4 h-4 text-[#4568F5]" />
            <span>Auditor Compliance Pack Export</span>
          </h3>
          <p className="text-xs text-[#667085] mt-1">
            Generate offline audit documentation including statutory citations, due date verifications, and signed counsel logs.
          </p>
        </div>

        <div className="flex flex-wrap gap-3 pt-2">
          {profile && impacts && (
            <button
              onClick={() => {
                const doc = generateImpactPdf({ profile, impacts });
                doc.save(`CLAUSESIGNAL-Impact-Report-${profile.companyName.replace(/[^a-zA-Z0-9]/g, '_')}.pdf`);
                setDownloadSuccess(true);
                setTimeout(() => setDownloadSuccess(false), 3000);
              }}
              className="px-4 py-2 bg-[#4568F5] hover:bg-[#3454E8] text-white text-xs font-semibold rounded-lg shadow-xs flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              <span>Export Stakeholder Impact Report (PDF)</span>
            </button>
          )}

          <button
            onClick={handleExportCsv}
            className="px-4 py-2 bg-white border border-[#E5E9F0] text-slate-800 hover:bg-slate-50 text-xs font-semibold rounded-lg shadow-xs flex items-center gap-2"
          >
            <FileText className="w-4 h-4 text-slate-600" />
            <span>Export Action Tracker (CSV)</span>
          </button>

          <button
            onClick={handleExportJson}
            className="px-4 py-2 bg-white border border-[#E5E9F0] text-slate-800 hover:bg-slate-50 text-xs font-semibold rounded-lg shadow-xs flex items-center gap-2"
          >
            <Download className="w-4 h-4 text-slate-600" />
            <span>Export Compliance Dossier (JSON)</span>
          </button>
        </div>
      </div>

      {/* Audit Log Viewer */}
      <div className="bg-white border border-[#E5E9F0] rounded-xl p-6 shadow-xs space-y-4">
        <div>
          <h3 className="text-sm font-bold text-[#111827] flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Platform Audit Log (Tamper-Evident History)</span>
          </h3>
          <p className="text-xs text-[#667085] mt-1">
            Immutable log of profile fact modifications, counsel document approvals, and statutory status shifts.
          </p>
        </div>

        <div className="overflow-x-auto rounded-lg border border-[#E5E9F0]">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F5F7FB] border-b border-[#E5E9F0] text-slate-500 font-semibold">
              <tr>
                <th className="py-2.5 px-4">Timestamp</th>
                <th className="py-2.5 px-4">Actor & Role</th>
                <th className="py-2.5 px-4">Action</th>
                <th className="py-2.5 px-4">Details & Notes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E9F0]">
              {auditLogs.map(log => (
                <tr key={log.id} className="hover:bg-slate-50/50">
                  <td className="py-2.5 px-4 font-mono text-slate-500 whitespace-nowrap">
                    {log.timestamp}
                  </td>
                  <td className="py-2.5 px-4">
                    <span className="font-semibold text-slate-900">{log.actor}</span>
                    <span className="text-slate-400 block text-[11px]">{log.role}</span>
                  </td>
                  <td className="py-2.5 px-4 font-medium text-slate-800">
                    {log.action}
                  </td>
                  <td className="py-2.5 px-4 text-slate-600 max-w-sm">
                    {log.notes}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
