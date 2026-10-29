import React from 'react';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { 
  OPERATIONS_METRICS, 
} from '../data/evaluationData';
import { COORDINATORS } from '../data/mockDataGenerator';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  PieChart, 
  Pie, 
  Cell 
} from 'recharts';
import { 
  BarChart3, 
  Calendar, 
  Users, 
  TrendingUp, 
  MapPin, 
  CheckCircle2, 
} from 'lucide-react';

export const OperationsDashboard: React.FC = () => {
  useDocumentTitle('Operations Dashboard');
  const metrics = OPERATIONS_METRICS;

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-6 space-y-6">
      
      {/* Header */}
      <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-2xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-blue-700 mb-1">
              <BarChart3 className="w-3.5 h-3.5" />
              <span>Operations Management & Quality Assurance</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Operational Health & Triage Analytics
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl leading-relaxed">
              Cross-city oversight across 200 seniors, 4 Care Coordinators, and 350+ cities network capacity.
            </p>
          </div>

          <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl text-xs text-slate-600">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            <span>Reporting Cycle: <strong>October 2026</strong></span>
          </div>
        </div>
      </div>

      {/* KPI Cards Row (Zero purple, crisp clinical badges) */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3.5">
        
        {/* KPI 1 */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Alerts / Day</div>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-2xl sm:text-3xl font-black text-slate-900">{metrics.alertsPerDayAvg}</span>
            <span className="text-xs font-bold text-teal-700">Within Cap</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Guards against fatigue (Cap: 15)</p>
        </div>

        {/* KPI 2 */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Avg Response Time</div>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-2xl sm:text-3xl font-black text-slate-900">{metrics.avgResponseMins}</span>
            <span className="text-xs font-semibold text-slate-500">mins</span>
          </div>
          <p className="text-[11px] text-teal-700 font-medium mt-1">14m faster than baseline</p>
        </div>

        {/* KPI 3 */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">% Alerts Useful</div>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-2xl sm:text-3xl font-black text-teal-800">{metrics.percentUseful}%</span>
            <span className="text-xs font-bold text-teal-700">High</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Coordinator thumbs feedback</p>
        </div>

        {/* KPI 4 */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Precision @ Top-10</div>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-2xl sm:text-3xl font-black text-blue-800">{metrics.precisionAtTop10}%</span>
            <span className="text-xs font-bold text-blue-700">P@10</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Top flagged truly need care</p>
        </div>

        {/* KPI 5 (Clean blue/slate, NO purple) */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-2xs col-span-2 lg:col-span-1">
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Avg Early Detection</div>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-2xl sm:text-3xl font-black text-slate-900">{metrics.avgDaysEarly}</span>
            <span className="text-xs font-semibold text-slate-700">days early</span>
          </div>
          <p className="text-[11px] text-teal-700 font-medium mt-1">Pre-empts hospitalization</p>
        </div>

      </div>

      {/* Main Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Chart 1: Volume */}
        <div className="lg:col-span-8 bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-teal-700" />
                Alert Ingestion & Coordinator Resolution (October 2026)
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Shows daily volume stayed within the 12-15 cap with high human resolution rate.
              </p>
            </div>
            <div className="flex items-center gap-3 text-xs">
              <span className="flex items-center gap-1.5 text-slate-600 font-semibold">
                <span className="w-3 h-3 rounded-sm bg-blue-700 inline-block" /> Alerts Fired
              </span>
              <span className="flex items-center gap-1.5 text-slate-600 font-semibold">
                <span className="w-3 h-3 rounded-sm bg-teal-600 inline-block" /> Handled
              </span>
            </div>
          </div>

          <div className="h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={metrics.volumeTrend}>
                <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                <YAxis domain={[0, 20]} tick={{ fontSize: 11 }} />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const d = payload[0].payload;
                      return (
                        <div className="bg-slate-900 text-white p-3 rounded-xl shadow-md text-xs space-y-1">
                          <div className="font-bold border-b border-slate-700 pb-1">{d.date}</div>
                          <div className="text-blue-300">Total Alerts Fired: {d.alerts}</div>
                          <div className="text-teal-300">Resolved by Coordinator: {d.resolved}</div>
                          <div className="text-emerald-300">Marked Useful: {d.useful}</div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Area type="monotone" dataKey="alerts" stroke="#1E4F8A" fill="#1E4F8A" fillOpacity={0.15} strokeWidth={2} />
                <Area type="monotone" dataKey="resolved" stroke="#0D9488" fill="#0D9488" fillOpacity={0.25} strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Outcomes */}
        <div className="lg:col-span-4 bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-2xs flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900 mb-1">
              Alert Outcomes Breakdown
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Real disposition of generated early warning alerts.
            </p>

            <div className="h-44 w-full flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={metrics.outcomesBreakdown}
                    innerRadius={45}
                    outerRadius={68}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {metrics.outcomesBreakdown.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="space-y-1.5 pt-3 border-t border-slate-100 text-xs">
            {metrics.outcomesBreakdown.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-slate-600">
                  <span className="w-2.5 h-2.5 rounded-sm inline-block" style={{ backgroundColor: item.color }} />
                  {item.name}
                </span>
                <span className="font-bold text-slate-900">{item.value}%</span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* City Comparison */}
      <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-2xs space-y-4">
        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
          <MapPin className="w-4 h-4 text-slate-600" />
          City-Level Regional Cohort Comparison
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
          {metrics.cityBreakdown.map((city, cIdx) => (
            <div key={cIdx} className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-xs space-y-1">
              <div className="font-bold text-slate-900">{city.city}</div>
              <div className="text-slate-500">{city.seniors} seniors</div>
              <div className="text-red-700 font-semibold">{city.alertsToday} active alerts</div>
              <div className="text-[11px] text-teal-700">{city.avgResponseMins}m avg response</div>
            </div>
          ))}
        </div>
      </div>

      {/* Coordinator Table */}
      <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-2xs space-y-4">
        <div>
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Users className="w-4 h-4 text-teal-700" />
            Care Coordinator Caseload & Alert Queue Performance
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Live coordinator capacity balance. Target cap is 50-55 seniors per coordinator.
          </p>
        </div>

        <div className="overflow-x-auto w-full">
          <table className="w-full text-left text-xs min-w-[600px]">
            <thead className="bg-slate-50 text-slate-600 uppercase tracking-wider font-bold text-[10px] border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Coordinator</th>
                <th className="py-3 px-4">Primary Hub</th>
                <th className="py-3 px-4">Total Caseload</th>
                <th className="py-3 px-4">Alerts Today</th>
                <th className="py-3 px-4">Avg Response</th>
                <th className="py-3 px-4">Precision Rate</th>
                <th className="py-3 px-4">Workload Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
              {COORDINATORS.map((coord) => (
                <tr key={coord.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-slate-900">
                    <div>{coord.name}</div>
                    <div className="text-[11px] text-slate-400 font-normal">{coord.phone}</div>
                  </td>
                  <td className="py-3.5 px-4">{coord.city}</td>
                  <td className="py-3.5 px-4 font-bold">{coord.totalCaseload} seniors</td>
                  <td className="py-3.5 px-4">
                    <span className="bg-red-100 text-red-800 px-2 py-0.5 rounded-md font-bold text-[11px]">
                      {coord.alertsToday} active
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-mono">{coord.avgResponseMins} mins</td>
                  <td className="py-3.5 px-4">
                    <span className="font-bold text-teal-700">{coord.precisionRate}%</span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Optimal Flow
                    </span>
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
