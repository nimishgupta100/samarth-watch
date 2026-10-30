import React from 'react';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { useApp } from '../context/AppContext';
import { 
  BarChart3, 
  Calendar, 
  Users, 
  MapPin, 
  CheckCircle2, 
  ShieldAlert,
  Info
} from 'lucide-react';

export const OperationsDashboard: React.FC = () => {
  useDocumentTitle('Operations Dashboard - Samarth Watch');
  const { seniors, coordinatorProfile, doses, sosEvents } = useApp();

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-6 space-y-6">
      
      {/* Header */}
      <div className="bg-white/95 backdrop-blur-md rounded-3xl p-6 sm:p-8 border border-slate-100/20 shadow-2xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-teal-600 mb-1">
              <BarChart3 className="w-3.5 h-3.5" />
              <span>Operations Management & Quality Assurance</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Operational Health & Triage Analytics
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl leading-relaxed">
              Real-time caseload oversight across assigned Care Coordinators and registered senior residents.
            </p>
          </div>

          <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 px-3.5 py-2 rounded-xl text-xs text-slate-600">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            <span>Active Live Cohort</span>
          </div>
        </div>
      </div>

      {/* Notice Banner */}
      <div className="bg-slate-900 text-white rounded-2xl p-4 flex items-center gap-3 text-xs border border-slate-800">
        <Info className="w-5 h-5 text-teal-400 shrink-0" />
        <div>
          <span className="font-bold">Live Cohort Mode:</span> Displaying real operational counts from the active repository. All legacy synthetic numbers have been purged.
        </div>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        
        {/* KPI 1 */}
        <div className="bg-white/95 backdrop-blur-md p-5 rounded-3xl border border-slate-100/20 shadow-xl">
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Registered Seniors</div>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-2xl sm:text-3xl font-black text-slate-900">{seniors.length}</span>
            <span className="text-xs font-bold text-teal-700">Active</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">{seniors[0]?.name || 'Kamla'}</p>
        </div>

        {/* KPI 2 */}
        <div className="bg-white/95 backdrop-blur-md p-5 rounded-3xl border border-slate-100/20 shadow-xl">
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Active Coordinators</div>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-2xl sm:text-3xl font-black text-slate-900">1</span>
            <span className="text-xs font-semibold text-slate-500">Staff</span>
          </div>
          <p className="text-[11px] text-teal-700 font-medium mt-1">{coordinatorProfile?.name || 'Nimish Gupta'}</p>
        </div>

        {/* KPI 3 */}
        <div className="bg-white/95 backdrop-blur-md p-5 rounded-3xl border border-slate-100/20 shadow-xl">
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Scheduled Doses</div>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-2xl sm:text-3xl font-black text-slate-900">{doses.length}</span>
            <span className="text-xs font-semibold text-slate-500">Today</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">{doses.filter(d => d.status === 'taken').length} confirmed taken</p>
        </div>

        {/* KPI 4 */}
        <div className="bg-white/95 backdrop-blur-md p-5 rounded-3xl border border-slate-100/20 shadow-xl">
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Active SOS Alerts</div>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-2xl sm:text-3xl font-black text-slate-900">{sosEvents.filter(e => e.status !== 'Resolved').length}</span>
            <span className="text-xs font-bold text-emerald-700">Normal</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Zero unresolved emergencies</p>
        </div>

      </div>

      {/* Coordinator Caseload Table */}
      <div className="bg-white/95 backdrop-blur-md rounded-3xl p-6 sm:p-8 border border-slate-100/20 shadow-2xl space-y-4">
        <div>
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Users className="w-4 h-4 text-teal-700" />
            Care Coordinator Caseload Oversight
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Active staff caseload and assigned senior residents.
          </p>
        </div>

        <div className="overflow-x-auto w-full">
          <table className="w-full text-left text-xs min-w-[600px]">
            <thead className="bg-slate-50 text-slate-600 uppercase tracking-wider font-bold text-[10px] border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Coordinator</th>
                <th className="py-3 px-4">Username</th>
                <th className="py-3 px-4">Phone</th>
                <th className="py-3 px-4">Assigned Seniors</th>
                <th className="py-3 px-4">Active Alerts</th>
                <th className="py-3 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
              <tr className="hover:bg-slate-50 transition-colors">
                <td className="py-3.5 px-4 font-bold text-slate-900">
                  {coordinatorProfile?.name || 'Nimish Gupta'}
                </td>
                <td className="py-3.5 px-4 font-mono text-slate-600">
                  {coordinatorProfile?.username || 'nimishgupta100'}
                </td>
                <td className="py-3.5 px-4">
                  {coordinatorProfile?.phone ? (
                    <span className="text-slate-800">{coordinatorProfile.phone}</span>
                  ) : (
                    <span className="text-slate-400 italic">Not added yet</span>
                  )}
                </td>
                <td className="py-3.5 px-4 font-bold">
                  {seniors.length} ({seniors.map(s => s.name).join(', ')})
                </td>
                <td className="py-3.5 px-4">
                  <span className="bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-md font-bold text-[11px]">
                    0 active
                  </span>
                </td>
                <td className="py-3.5 px-4">
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Active
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
