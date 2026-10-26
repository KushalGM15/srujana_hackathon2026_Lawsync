import React, { useState } from 'react';
import { 
  Building2, 
  Save, 
  CheckCircle2, 
  ShieldCheck, 
  HelpCircle,
  FileText
} from 'lucide-react';
import type { BusinessProfile } from '../types';

interface BusinessProfileViewProps {
  profile: BusinessProfile;
  onSaveProfile: (updated: Partial<BusinessProfile>) => void;
}

export const BusinessProfileView: React.FC<BusinessProfileViewProps> = ({
  profile,
  onSaveProfile,
}) => {
  const [formData, setFormData] = useState<BusinessProfile>({ ...profile });
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveProfile(formData);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const statesList = [
    'Maharashtra', 'Karnataka', 'Gujarat', 'Tamil Nadu', 
    'Delhi NCR', 'Telangana', 'Uttar Pradesh', 'Rajasthan'
  ];

  const handleStateToggle = (st: string) => {
    if (formData.operatingStates.includes(st)) {
      setFormData(prev => ({
        ...prev,
        operatingStates: prev.operatingStates.filter(s => s !== st)
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        operatingStates: [...prev.operatingStates, st]
      }));
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-[#E5E9F0]">
        <div>
          <div className="flex items-center gap-2 mb-2 text-xs font-semibold uppercase tracking-wider text-[#4568F5]">
            <Building2 className="w-4 h-4 text-[#4568F5]" />
            <span>SME Compliance Grounding</span>
          </div>
          <h2 className="text-2xl font-bold text-[#111827] tracking-tight">
            Business Profile & Statutory Facts
          </h2>
          <p className="text-sm text-[#667085] mt-1 max-w-xl">
            Verified corporate parameters used by CLAUSESIGNAL to assess applicability against Gazette thresholds (Turnover, Headcount, Sector, Entity Type).
          </p>
        </div>

        {saveSuccess && (
          <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-lg animate-fadeIn">
            <CheckCircle2 className="w-4 h-4" />
            <span>Profile facts updated & impact recalculated!</span>
          </div>
        )}
      </div>

      {/* Main Profile Form */}
      <form onSubmit={handleSubmit} className="bg-white border border-[#E5E9F0] rounded-xl p-8 shadow-xs space-y-6 text-xs">
        {/* Section 1: Entity Identity */}
        <div>
          <h3 className="text-sm font-bold text-[#111827] pb-3 border-b border-[#E5E9F0]">
            Corporate Identification
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
            <div>
              <label className="block font-semibold text-[#111827] mb-1">Company Legal Name</label>
              <input
                type="text"
                required
                value={formData.companyName}
                onChange={e => setFormData({ ...formData, companyName: e.target.value })}
                className="w-full bg-[#F5F7FB] border border-[#E5E9F0] rounded-lg p-2.5 text-slate-900 font-medium focus:outline-none focus:border-[#4568F5]"
              />
            </div>

            <div>
              <label className="block font-semibold text-[#111827] mb-1">CIN / LLPIN</label>
              <input
                type="text"
                required
                value={formData.cin}
                onChange={e => setFormData({ ...formData, cin: e.target.value })}
                className="w-full bg-[#F5F7FB] border border-[#E5E9F0] rounded-lg p-2.5 font-mono text-slate-900 focus:outline-none focus:border-[#4568F5]"
              />
            </div>

            <div>
              <label className="block font-semibold text-[#111827] mb-1">Entity Structure</label>
              <select
                value={formData.entityType}
                onChange={e => setFormData({ ...formData, entityType: e.target.value as any })}
                className="w-full bg-[#F5F7FB] border border-[#E5E9F0] rounded-lg p-2.5 text-slate-900 focus:outline-none focus:border-[#4568F5]"
              >
                <option value="Private Limited">Private Limited Company</option>
                <option value="Public Limited">Public Limited Company</option>
                <option value="LLP">Limited Liability Partnership (LLP)</option>
                <option value="Partnership">Partnership Firm</option>
                <option value="Sole Proprietorship">Sole Proprietorship</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-[#111827] mb-1">Udyam Registration Number</label>
              <input
                type="text"
                value={formData.udyamRegistration}
                onChange={e => setFormData({ ...formData, udyamRegistration: e.target.value })}
                className="w-full bg-[#F5F7FB] border border-[#E5E9F0] rounded-lg p-2.5 font-mono text-slate-900 focus:outline-none focus:border-[#4568F5]"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Scale & Thresholds */}
        <div className="pt-4 border-t border-[#E5E9F0]">
          <h3 className="text-sm font-bold text-[#111827] pb-3 border-b border-[#E5E9F0]">
            Financial & Operational Scale (Threshold Drivers)
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
            <div>
              <label className="block font-semibold text-[#111827] mb-1">
                Annual Turnover (INR Crores)
              </label>
              <input
                type="number"
                step="0.1"
                min="0.1"
                required
                value={formData.annualTurnoverINR}
                onChange={e => setFormData({ ...formData, annualTurnoverINR: parseFloat(e.target.value) || 0 })}
                className="w-full bg-[#F5F7FB] border border-[#E5E9F0] rounded-lg p-2.5 font-mono font-bold text-slate-900 focus:outline-none focus:border-[#4568F5]"
              />
              <span className="text-[10px] text-slate-400 mt-1 block">
                {formData.annualTurnoverINR > 5 
                  ? 'Exceeds ₹5 Cr: Mandatory GST E-Invoicing applies' 
                  : 'Below ₹5 Cr: E-Invoicing optional'}
              </span>
            </div>

            <div>
              <label className="block font-semibold text-[#111827] mb-1">
                Full-Time Headcount
              </label>
              <input
                type="number"
                min="1"
                required
                value={formData.employeeCount}
                onChange={e => setFormData({ ...formData, employeeCount: parseInt(e.target.value) || 1 })}
                className="w-full bg-[#F5F7FB] border border-[#E5E9F0] rounded-lg p-2.5 font-mono text-slate-900 focus:outline-none focus:border-[#4568F5]"
              />
            </div>

            <div>
              <label className="block font-semibold text-[#111827] mb-1">
                MSME Classification
              </label>
              <select
                value={formData.msmeCategory}
                onChange={e => setFormData({ ...formData, msmeCategory: e.target.value as any })}
                className="w-full bg-[#F5F7FB] border border-[#E5E9F0] rounded-lg p-2.5 text-slate-900 font-semibold focus:outline-none focus:border-[#4568F5]"
              >
                <option value="Micro">Micro (&lt; ₹5 Cr turnover, &lt; ₹1 Cr inv)</option>
                <option value="Small">Small (&lt; ₹50 Cr turnover, &lt; ₹10 Cr inv)</option>
                <option value="Medium">Medium (&lt; ₹250 Cr turnover)</option>
                <option value="Non-MSME">Non-MSME Large Enterprise</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
            <div>
              <label className="block font-semibold text-[#111827] mb-1">Sector / Industry</label>
              <select
                value={formData.sector}
                onChange={e => setFormData({ ...formData, sector: e.target.value as any })}
                className="w-full bg-[#F5F7FB] border border-[#E5E9F0] rounded-lg p-2.5 text-slate-900 focus:outline-none focus:border-[#4568F5]"
              >
                <option value="Precision Manufacturing">Precision Manufacturing</option>
                <option value="IT & Software Services">IT & Software Services</option>
                <option value="Retail & E-Commerce">Retail & E-Commerce</option>
                <option value="Healthcare & Pharma">Healthcare & Pharma</option>
                <option value="Logistics & Supply Chain">Logistics & Supply Chain</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-[#111827] mb-1">Primary GSTIN</label>
              <input
                type="text"
                value={formData.gstin}
                onChange={e => setFormData({ ...formData, gstin: e.target.value })}
                className="w-full bg-[#F5F7FB] border border-[#E5E9F0] rounded-lg p-2.5 font-mono text-slate-900 focus:outline-none focus:border-[#4568F5]"
              />
            </div>
          </div>
        </div>

        {/* Section 3: Regulatory Triggers */}
        <div className="pt-4 border-t border-[#E5E9F0]">
          <h3 className="text-sm font-bold text-[#111827] pb-3 border-b border-[#E5E9F0]">
            Regulatory Triggers & Operating Jurisdictions
          </h3>

          <div className="space-y-3 mt-4">
            <label className="flex items-center gap-3 p-3 rounded-lg bg-[#F5F7FB] border border-[#E5E9F0] cursor-pointer hover:bg-slate-100/70">
              <input
                type="checkbox"
                checked={formData.hasExternalBorrowings}
                onChange={e => setFormData({ ...formData, hasExternalBorrowings: e.target.checked })}
                className="w-4 h-4 rounded accent-[#4568F5]"
              />
              <div>
                <span className="font-semibold text-slate-900 block">Has Active Bank / NBFC Credit Facilities</span>
                <span className="text-[11px] text-slate-500">
                  Activates RBI Key Facts Statement (KFS) and APR transparency review.
                </span>
              </div>
            </label>

            <label className="flex items-center gap-3 p-3 rounded-lg bg-[#F5F7FB] border border-[#E5E9F0] cursor-pointer hover:bg-slate-100/70">
              <input
                type="checkbox"
                checked={formData.collectsCustomerPersonalData}
                onChange={e => setFormData({ ...formData, collectsCustomerPersonalData: e.target.checked })}
                className="w-4 h-4 rounded accent-[#4568F5]"
              />
              <div>
                <span className="font-semibold text-slate-900 block">Collects or Processes Digital Personal Data</span>
                <span className="text-[11px] text-slate-500">
                  Activates DPDP Act 2023 Data Fiduciary obligations (multilingual consent and breach notice).
                </span>
              </div>
            </label>
          </div>

          <div className="mt-4">
            <label className="block font-semibold text-[#111827] mb-2">
              Operating States in India
            </label>
            <div className="flex flex-wrap gap-2">
              {statesList.map(st => {
                const isSelected = formData.operatingStates.includes(st);
                return (
                  <button
                    key={st}
                    type="button"
                    onClick={() => handleStateToggle(st)}
                    className={`px-3 py-1.5 rounded-md font-medium text-xs transition-colors ${
                      isSelected
                        ? 'bg-[#4568F5] text-white'
                        : 'bg-[#F5F7FB] text-slate-700 border border-[#E5E9F0] hover:bg-slate-100'
                    }`}
                  >
                    {st}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="pt-4 border-t border-[#E5E9F0] flex items-center justify-end gap-3">
          <button
            type="submit"
            className="px-6 py-2.5 bg-[#4568F5] hover:bg-[#3454E8] text-white font-semibold rounded-lg shadow-sm transition-colors flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            <span>Save & Recalculate Compliance Engine</span>
          </button>
        </div>
      </form>
    </div>
  );
};
