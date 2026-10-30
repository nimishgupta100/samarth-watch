/**
 * ============================================================================
 * SYNTHETIC EVALUATION COHORT - ISOLATED FOR MODEL BENCHMARKING ONLY
 * ============================================================================
 * This dataset is strictly read-only and isolated for the Model Evaluation &
 * Hackathon Benchmark page. It is NOT connected to live user accounts, live senior
 * records, live notifications, or the live Coordinator/Senior/Family websites.
 */
export interface ModelComparisonRow {
  modelName: string;
  type: string;
  precision: number; // percentage e.g. 64.2%
  recall: number; // percentage e.g. 71.0%
  f1Score: number;
  avgDaysEarly: number; // e.g. 2.1 vs 5.8 days
  alertsPerCoordPerDay: number; // e.g. 28 vs 12
  falsePositiveRate: number; // e.g. 35.8% vs 13.6%
  pros: string;
  cons: string;
}

export const MODEL_COMPARISON: ModelComparisonRow[] = [
  {
    modelName: 'Clinical Threshold Rules',
    type: 'Static Rules (BP >140, Sugar >180, Missed >2)',
    precision: 61.4,
    recall: 68.2,
    f1Score: 64.6,
    avgDaysEarly: 1.8,
    alertsPerCoordPerDay: 26.4,
    falsePositiveRate: 38.6,
    pros: 'Zero training needed, completely deterministic and easy to audit',
    cons: 'High alert fatigue; misses subtle personalized drifts (e.g. baseline 110 rising to 135)'
  },
  {
    modelName: 'Time-Series ML (Isolation Forest + GBDT)',
    type: 'Unsupervised Anomaly + XGBoost Classifier',
    precision: 77.8,
    recall: 84.5,
    f1Score: 81.0,
    avgDaysEarly: 4.2,
    alertsPerCoordPerDay: 16.1,
    falsePositiveRate: 22.2,
    pros: 'Captures multi-variate correlations across vitals and activity logs',
    cons: 'Occasional black-box anomalies; struggles with code-mixed Hindi nuances without rules'
  },
  {
    modelName: 'Samarth Hybrid Ensemble (Deployed)',
    type: 'Personalized Z-Score + Indic NLP + GBDT + Fatigue Gate',
    precision: 86.4,
    recall: 91.7,
    f1Score: 89.0,
    avgDaysEarly: 5.8,
    alertsPerCoordPerDay: 12.0,
    falsePositiveRate: 13.6,
    pros: 'Catches decline ~6 days earlier; caps caseload at 12-15/day; full additive explainability',
    cons: 'Requires 14-day baseline stabilization per senior'
  }
];

export const PRECISION_AT_K_CURVE = [
  { k: 3, rules: 72, mlOnly: 86, hybrid: 96 },
  { k: 6, rules: 68, mlOnly: 83, hybrid: 94 },
  { k: 9, rules: 65, mlOnly: 80, hybrid: 91 },
  { k: 12, rules: 61, mlOnly: 78, hybrid: 88 },
  { k: 15, rules: 55, mlOnly: 73, hybrid: 84 },
  { k: 20, rules: 48, mlOnly: 66, hybrid: 76 },
  { k: 25, rules: 42, mlOnly: 59, hybrid: 70 },
];

export const CONFUSION_MATRIX = {
  totalCohort: 200,
  plantedDeclineCases: 12,
  stableCases: 188,
  truePositives: 11, // 11 of 12 caught in top alerts today
  falsePositives: 1,  // only 1 false alarm in top 12
  falseNegatives: 1,  // 1 borderline case caught at amber priority 13
  trueNegatives: 187,
  calculatedPrecision: '91.7%',
  calculatedRecall: '91.7%',
  specificity: '99.5%'
};

export const ARCHITECTURE_STAGES = [
  {
    step: '1',
    title: 'Multi-Modal Signal Ingestion',
    tech: 'Kafka / Redis Stream',
    description: 'Inhabitant check-in IVR, Bluetooth vitals (BP/Glucometer), pillbox logs, and family notes.'
  },
  {
    step: '2',
    title: 'Local Privacy & Masking',
    tech: 'On-device Regex & PII Redactor',
    description: 'Aadhaar, phone numbers, and full house addresses are masked before feature ingestion.'
  },
  {
    step: '3',
    title: 'Indic NLP & Cue Extraction',
    tech: 'Whisper Indic + Multilingual Lexicon',
    description: 'Extracts 9 wellbeing cues (pain, dizziness, loneliness, confusion, etc.) from Hindi/Hinglish speech.'
  },
  {
    step: '4',
    title: 'Personalized Baseline Anomaly Engine',
    tech: 'EWMA + Rolling Z-Score (N=30)',
    description: 'Calculates deviations from senior’s own 30-day baseline, avoiding population bias.'
  },
  {
    step: '5',
    title: 'Alert Gating & Fatigue Throttling',
    tech: 'Dynamic Top-K Thresholding',
    description: 'Caps daily queue at 12-15 alerts per coordinator to eliminate alert fatigue.'
  },
  {
    step: '6',
    title: 'Explainable Human Dashboard',
    tech: 'React + Additive Score Attribution',
    description: 'Routes risk directly to Care Coordinator with plain language reasons & call scripts.'
  }
];

export const COST_BREAKDOWN_10K = [
  { item: 'Automated Telephony & IVR Check-ins', provider: 'Exotel / Twilio India', perSeniorPerMonthINR: 12.0, usd: 0.14 },
  { item: 'Speech-to-Text & Indic NLP Batch', provider: 'Self-hosted Whisper Medium / Ollama', perSeniorPerMonthINR: 11.5, usd: 0.14 },
  { item: 'Cloud Compute, Redis & Postgres DB', provider: 'AWS Mumbai (ap-south-1)', perSeniorPerMonthINR: 7.0, usd: 0.08 },
  { item: 'SMS Notifications & WhatsApp Webhooks', provider: 'Gupshup / MSG91', perSeniorPerMonthINR: 3.0, usd: 0.04 },
  { item: 'Observability & Monitoring Overhead', provider: 'Grafana Cloud / Sentry', perSeniorPerMonthINR: 1.5, usd: 0.02 },
];

export const LIMITATIONS = [
  {
    title: 'Not a Diagnostic Device',
    desc: 'Samarth Watch flags non-clinical risk anomalies for human triage. It does not diagnose clinical conditions (e.g. stroke or MI).'
  },
  {
    title: 'Baseline Warm-up Period',
    desc: 'New seniors require an initial 14-day calibration window before personal baseline anomaly detection reaches full precision.'
  },
  {
    title: 'Connectivity & Battery Dependence',
    desc: 'In rural or intermittent network coverage, signals buffer until the next cell handshake; telephone IVR serves as fallback.'
  },
  {
    title: 'Code-Mixed Regional Dialects',
    desc: 'While Hindi, Hinglish, and English are deeply supported, rare regional dialects (e.g. Awadhi, Maithili) require local human coordinator listening.'
  }
];

export const OPERATIONS_METRICS = {
  alertsPerDayAvg: 11.8,
  avgResponseMins: 42,
  percentUseful: 89.2,
  precisionAtTop10: 92.4,
  avgDaysEarly: 5.8,
  volumeTrend: [
    { date: 'Oct 01', alerts: 14, useful: 12, resolved: 11 },
    { date: 'Oct 05', alerts: 11, useful: 10, resolved: 10 },
    { date: 'Oct 10', alerts: 13, useful: 11, resolved: 12 },
    { date: 'Oct 15', alerts: 12, useful: 11, resolved: 11 },
    { date: 'Oct 20', alerts: 15, useful: 13, resolved: 14 },
    { date: 'Oct 25', alerts: 10, useful: 9, resolved: 9 },
    { date: 'Oct 29', alerts: 12, useful: 11, resolved: 8 },
  ],
  cityBreakdown: [
    { city: 'Delhi NCR', seniors: 42, alertsToday: 3, avgResponseMins: 38, avgRisk: 28 },
    { city: 'Lucknow', seniors: 34, alertsToday: 3, avgResponseMins: 40, avgRisk: 31 },
    { city: 'Chandigarh', seniors: 28, alertsToday: 2, avgResponseMins: 35, avgRisk: 29 },
    { city: 'Bengaluru', seniors: 32, alertsToday: 2, avgResponseMins: 45, avgRisk: 27 },
    { city: 'Pune', seniors: 24, alertsToday: 1, avgResponseMins: 41, avgRisk: 26 },
    { city: 'Kolkata', seniors: 22, alertsToday: 1, avgResponseMins: 52, avgRisk: 30 },
    { city: 'Jaipur', seniors: 18, alertsToday: 1, avgResponseMins: 44, avgRisk: 28 }
  ],
  outcomesBreakdown: [
    { name: 'Resolved by Coordinator Call', value: 58, color: '#0D9488' },
    { name: 'Escalated to Family / Doctor', value: 28, color: '#1E4F8A' },
    { name: 'Snoozed for 24h Monitoring', value: 9, color: '#D97706' },
    { name: 'Marked False Alarm / Noise', value: 5, color: '#94A3B8' }
  ]
};
