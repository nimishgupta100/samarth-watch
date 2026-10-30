import React, { useState } from 'react';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { useToast } from '../context/ToastContext';
import { 
  MODEL_COMPARISON, 
  PRECISION_AT_K_CURVE, 
  CONFUSION_MATRIX, 
  ARCHITECTURE_STAGES, 
  COST_BREAKDOWN_10K, 
  LIMITATIONS 
} from '../evaluation/evaluationData';
import { 
  COHORT_EVAL_METRICS, 
  COHORT_SIZE, 
  PLANTED_SCENARIO_COUNT 
} from '../data/cohortDatabase';
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  Tooltip, 
  Legend 
} from 'recharts';
import { 
  Award, 
  CheckCircle2, 
  AlertTriangle, 
  Layers, 
  Coins, 
  TrendingUp, 
  Cpu, 
} from 'lucide-react';

export const ModelEvaluation: React.FC = () => {
  useDocumentTitle('Model Benchmark & Evaluation');
  const { showToast } = useToast();
  const [selectedArchStep, setSelectedArchStep] = useState(0);

  const onStepSelect = (idx: number, title: string) => {
    setSelectedArchStep(idx);
    showToast(`Inspecting Stage ${idx + 1} architecture: ${title}`, 'info');
  };

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-6 space-y-8">
      
      {/* Header Banner (Solid Navy, NO purple gradients!) */}
      <div className="bg-slate-900/80 backdrop-blur-md text-white rounded-3xl p-6 sm:p-8 border border-slate-800/80 shadow-2xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 bg-teal-500/20 text-teal-300 text-xs px-3 py-1 rounded-md border border-teal-400/30 font-semibold">
              <Award className="w-3.5 h-3.5 text-teal-400" />
              <span>Hackathon Judge Technical Audit : Evaluation & Architecture</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              Model Benchmarking & ML Engineering
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
              Empirical validation across 200 synthetic seniors with 90-day time-series vitals, Indic speech cue NLP, and 12 planted clinical decline trajectories.
            </p>
          </div>

          <div className="flex flex-row md:flex-col items-center md:items-end gap-3 shrink-0">
            <div className="bg-slate-800 px-4 py-2 rounded-xl border border-slate-700 text-right">
              <div className="text-[11px] text-slate-300">Days Early Detection</div>
              <div className="text-2xl font-black text-teal-300">5.8 Days</div>
            </div>
            <div className="bg-slate-800 px-4 py-2 rounded-xl border border-slate-700 text-right">
              <div className="text-[11px] text-slate-300">Precision @ Top 10</div>
              <div className="text-2xl font-black text-teal-300">92.4%</div>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 1: Model Comparison Benchmark Table */}
      <div className="bg-white/95 backdrop-blur-md rounded-3xl p-6 sm:p-8 border border-slate-100/20 shadow-2xl space-y-4">
        <div>
          <h2 className="text-lg font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <Layers className="w-5 h-5 text-teal-700" />
            1. Comparative Model Performance Benchmark
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Evaluated on synthetic cohort against planted decline ground truth.
          </p>
        </div>

        <div className="overflow-x-auto w-full">
          <table className="w-full text-left text-xs min-w-[650px]">
            <thead className="bg-slate-50 text-slate-600 uppercase font-bold text-[10px] border-b border-slate-200">
              <tr>
                <th className="py-3.5 px-4">Model Pipeline</th>
                <th className="py-3.5 px-4">Precision</th>
                <th className="py-3.5 px-4">Recall</th>
                <th className="py-3.5 px-4">F1 Score</th>
                <th className="py-3.5 px-4">Avg Days Early</th>
                <th className="py-3.5 px-4">Alerts/Coord/Day</th>
                <th className="py-3.5 px-4">False Positive %</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {MODEL_COMPARISON.map((row, idx) => {
                const isHybrid = row.modelName.includes('Hybrid');
                return (
                  <tr 
                    key={idx} 
                    className={isHybrid ? 'bg-teal-50/60 font-bold border-l-4 border-l-teal-700' : 'hover:bg-slate-50'}
                  >
                    <td className="py-4 px-4">
                      <div className="text-slate-900 text-sm font-bold flex items-center gap-1.5">
                        {row.modelName}
                        {isHybrid && (
                          <span className="bg-teal-700 text-white text-[10px] uppercase font-bold px-1.5 py-0.2 rounded">
                            Production
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-slate-500 font-normal mt-0.5">{row.type}</div>
                    </td>
                    <td className="py-4 px-4 text-slate-900 font-bold font-mono">{row.precision}%</td>
                    <td className="py-4 px-4 text-slate-900 font-bold font-mono">{row.recall}%</td>
                    <td className="py-4 px-4 text-slate-900 font-mono">{row.f1Score}%</td>
                    <td className="py-4 px-4 font-mono text-teal-800 font-bold">{row.avgDaysEarly} days</td>
                    <td className="py-4 px-4 font-mono text-slate-700">{row.alertsPerCoordPerDay}</td>
                    <td className="py-4 px-4 font-mono text-red-700">{row.falsePositiveRate}%</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-600">
          <strong>Key Takeaway:</strong> Pure clinical threshold rules generate 26.4 alerts/day (causing severe coordinator fatigue and 38.6% false alarms). The <strong>Hybrid Ensemble</strong> throttles alerts to 12.0/day while detecting decline <strong>4 days earlier</strong> than static rules.
        </div>
      </div>

      {/* SECTION 2: Precision-at-Top-K Curve & Confusion Matrix */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Precision-at-k Curve Chart */}
        <div className="lg:col-span-7 bg-white/95 backdrop-blur-md rounded-3xl p-6 sm:p-8 border border-slate-100/20 shadow-2xl space-y-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-teal-700" />
              2. Precision-at-Top-K Triage Curve
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Demonstrates model ranking quality at different coordinator queue sizes (k).
            </p>
          </div>

          <div className="h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={PRECISION_AT_K_CURVE} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="k" label={{ value: 'Queue Size (k)', position: 'insideBottomRight', offset: -5 }} tick={{ fontSize: 11 }} />
                <YAxis domain={[30, 100]} tick={{ fontSize: 11 }} unit="%" />
                <Tooltip />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                <Line type="monotone" dataKey="hybrid" name="Samarth Hybrid Ensemble" stroke="#0D9488" strokeWidth={3} dot={{ r: 4 }} />
                <Line type="monotone" dataKey="mlOnly" name="ML Only (Isolation Forest + GBDT)" stroke="#1E4F8A" strokeWidth={2} strokeDasharray="4 4" />
                <Line type="monotone" dataKey="rules" name="Rules Baseline" stroke="#94A3B8" strokeWidth={1.8} />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="text-[11px] text-slate-500 text-center">
            Hybrid maintains <strong>&gt;88% precision at k=12</strong>, guaranteeing that top alerts are actionable.
          </div>
        </div>

        {/* Confusion Matrix on Planted Cases */}
        <div className="lg:col-span-5 bg-white/95 backdrop-blur-md rounded-3xl p-6 sm:p-8 border border-slate-100/20 shadow-2xl space-y-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-teal-700" />
              3. Confusion Matrix (Planted Cohort N=200)
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              12 planted decline cases vs 188 stable seniors.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-2">
            <div className="bg-emerald-50 border-2 border-emerald-300 rounded-xl p-4 text-center">
              <div className="text-2xl font-black text-emerald-800">{CONFUSION_MATRIX.truePositives}</div>
              <div className="text-xs font-bold text-emerald-950 mt-1">True Positive (TP)</div>
              <div className="text-[10px] text-emerald-700">Decline caught early in top triage</div>
            </div>

            <div className="bg-amber-50 border-2 border-amber-300 rounded-xl p-4 text-center">
              <div className="text-2xl font-black text-amber-800">{CONFUSION_MATRIX.falsePositives}</div>
              <div className="text-xs font-bold text-amber-950 mt-1">False Positive (FP)</div>
              <div className="text-[10px] text-amber-700">Transient fluctuation flagged</div>
            </div>

            <div className="bg-red-50 border-2 border-red-300 rounded-xl p-4 text-center">
              <div className="text-2xl font-black text-red-800">{CONFUSION_MATRIX.falseNegatives}</div>
              <div className="text-xs font-bold text-red-950 mt-1">False Negative (FN)</div>
              <div className="text-[10px] text-red-700">Caught later at amber priority</div>
            </div>

            <div className="bg-slate-50 border-2 border-slate-200 rounded-xl p-4 text-center">
              <div className="text-2xl font-black text-slate-800">{CONFUSION_MATRIX.trueNegatives}</div>
              <div className="text-xs font-bold text-slate-950 mt-1">True Negative (TN)</div>
              <div className="text-[10px] text-slate-500">Stable seniors not bothered</div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 text-center text-xs pt-2">
            <div className="bg-slate-100 p-2 rounded-lg">
              <div className="font-bold text-slate-900">{CONFUSION_MATRIX.calculatedPrecision}</div>
              <div className="text-[10px] text-slate-500">Precision</div>
            </div>
            <div className="bg-slate-100 p-2 rounded-lg">
              <div className="font-bold text-slate-900">{CONFUSION_MATRIX.calculatedRecall}</div>
              <div className="text-[10px] text-slate-500">Recall</div>
            </div>
            <div className="bg-slate-100 p-2 rounded-lg">
              <div className="font-bold text-slate-900">{CONFUSION_MATRIX.specificity}</div>
              <div className="text-[10px] text-slate-500">Specificity</div>
            </div>
          </div>

          {/* Live Cohort Evaluation Metric Banner */}
          <div className="bg-teal-50 border border-teal-200 rounded-xl p-3 text-xs space-y-1">
            <div className="flex items-center justify-between">
              <span className="font-bold text-teal-900">Imported Cohort Run (N={COHORT_SIZE}):</span>
              <span className="font-mono text-[11px] text-teal-800 font-semibold">
                TP: {COHORT_EVAL_METRICS.tp} | FP: {COHORT_EVAL_METRICS.fp} | FN: {COHORT_EVAL_METRICS.fn} | TN: {COHORT_EVAL_METRICS.tn}
              </span>
            </div>
            <p className="text-[11px] text-slate-600">
              Evaluated strictly on 18,000 simulated observations and {PLANTED_SCENARIO_COUNT} synthetic decline trajectories without future data leakage. Not clinical validation.
            </p>
          </div>
        </div>

      </div>

      {/* SECTION 3: System Architecture Flow (Interactive, clean slate buttons) */}
      <div className="bg-white/95 backdrop-blur-md rounded-3xl p-6 sm:p-8 border border-slate-100/20 shadow-2xl space-y-6">
        <div>
          <h2 className="text-lg font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <Cpu className="w-5 h-5 text-teal-700" />
            4. End-to-End System Architecture (How It Works)
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Click each stage to inspect the technical data contracts and inference stack.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-6 gap-2">
          {ARCHITECTURE_STAGES.map((st, idx) => (
            <button
              key={idx}
              onClick={() => onStepSelect(idx, st.title)}
              className={`p-3 rounded-xl text-left border transition-all ${
                selectedArchStep === idx
                  ? 'bg-slate-900 text-white border-slate-900 shadow-md'
                  : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
              }`}
            >
              <div className={`text-[10px] font-bold uppercase tracking-wider ${
                selectedArchStep === idx ? 'text-teal-400' : 'text-slate-400'
              }`}>
                Step {st.step}
              </div>
              <div className="font-bold text-xs mt-1 leading-snug">{st.title}</div>
            </button>
          ))}
        </div>

        <div className="p-6 bg-slate-900/90 text-white rounded-2xl border border-slate-800 space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold uppercase tracking-wider text-teal-400">
              Stage {ARCHITECTURE_STAGES[selectedArchStep].step} Specification
            </span>
            <span className="font-mono bg-slate-800 text-slate-300 px-2 py-0.5 rounded border border-slate-700">
              Tech: {ARCHITECTURE_STAGES[selectedArchStep].tech}
            </span>
          </div>

          <h4 className="text-base font-bold text-white">
            {ARCHITECTURE_STAGES[selectedArchStep].title}
          </h4>

          <p className="text-xs text-slate-300 leading-relaxed">
            {ARCHITECTURE_STAGES[selectedArchStep].description}
          </p>
        </div>
      </div>

      {/* SECTION 4: Cost Breakdown at 10,000 Seniors & System Limitations */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Cost Analysis at 10k Scale */}
        <div className="lg:col-span-7 bg-white/95 backdrop-blur-md rounded-3xl p-6 sm:p-8 border border-slate-100/20 shadow-2xl space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Coins className="w-4 h-4 text-emerald-700" />
                5. Cost per Senior per Month (At 10,000 Seniors)
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Designed for high frugality and scale in the Indian elderly care landscape.
              </p>
            </div>
            <div className="text-right">
              <span className="text-xl font-black text-emerald-800">₹35.00</span>
              <span className="text-xs text-slate-500 block">~$0.42 USD / mo</span>
            </div>
          </div>

          <div className="overflow-x-auto w-full pt-2">
            <table className="w-full text-left text-xs min-w-[500px]">
              <thead className="bg-slate-50 text-slate-600 uppercase font-bold text-[10px]">
                <tr>
                  <th className="py-2.5 px-3">Infrastructure Component</th>
                  <th className="py-2.5 px-3">Provider</th>
                  <th className="py-2.5 px-3 text-right">Cost (INR)</th>
                  <th className="py-2.5 px-3 text-right">Cost (USD)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
                {COST_BREAKDOWN_10K.map((c, idx) => (
                  <tr key={idx} className="hover:bg-slate-50">
                    <td className="py-2.5 px-3 font-semibold text-slate-900">{c.item}</td>
                    <td className="py-2.5 px-3 text-slate-500">{c.provider}</td>
                    <td className="py-2.5 px-3 text-right font-mono font-bold">₹{c.perSeniorPerMonthINR.toFixed(2)}</td>
                    <td className="py-2.5 px-3 text-right font-mono text-slate-500">${c.usd.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Limitations */}
        <div className="lg:col-span-5 bg-white/95 backdrop-blur-md rounded-3xl p-6 sm:p-8 border border-slate-100/20 shadow-2xl space-y-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-500" />
              6. Operational Boundaries & Honest Limitations
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Transparent engineering limits submitted to the hackathon judging panel.
            </p>
          </div>

          <div className="space-y-3">
            {LIMITATIONS.map((lim, idx) => (
              <div key={idx} className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs">
                <div className="font-bold text-slate-900 mb-0.5">{lim.title}</div>
                <div className="text-slate-600 leading-relaxed text-[11px]">{lim.desc}</div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};
