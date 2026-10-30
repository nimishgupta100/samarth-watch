import fs from 'fs';
import path from 'path';

const datasetDir = 'd:/Deviathon/Data set/datasetssss';
const outPath = 'd:/Deviathon/src/data/cohortDatabase.ts';

console.log('Reading dataset from', datasetDir);

// 1. Read profiles (filter to first 20 samples for local DB, rest on Supabase)
const profilesCsv = fs.readFileSync(path.join(datasetDir, 'demo_200_senior_profiles.csv'), 'utf8');
const profileLines = profilesCsv.trim().split('\n').slice(1).slice(0, 20);
const profiles = profileLines.map(line => {
  const parts = line.split(',');
  return {
    seniorId: parts[0],
    recordId: parts[1],
    age: Number(parts[2]),
    gender: parts[3],
    bloodType: parts[4],
    medicalCondition: parts[5],
    medicationName: parts[6],
    testResult: parts[7],
    admissionType: parts[8],
    admissionDate: parts[9],
    dischargeDate: parts[10],
    lengthOfStayDays: Number(parts[11]),
    profileOrigin: parts[12],
    uniquePersonVerified: parts[13] === 'True' || parts[13] === 'true'
  };
});
console.log(`Loaded ${profiles.length} profiles.`);

// 2. Read 12 planted scenarios
const scenariosCsv = fs.readFileSync(path.join(datasetDir, 'demo_12_planted_decline_scenarios.csv'), 'utf8');
const scenarioLines = scenariosCsv.trim().split('\n').slice(1);
const scenarioMap = new Map();
scenarioLines.forEach(line => {
  const parts = line.split(',');
  scenarioMap.set(parts[0], {
    seniorId: parts[0],
    scenarioType: parts[1],
    onsetDay: Number(parts[2]),
    onsetDate: parts[3],
    labelSource: parts[4]
  });
});
console.log(`Loaded ${scenarioMap.size} planted scenarios.`);

// 3. Read observations (18,000 rows)
const obsCsv = fs.readFileSync(path.join(datasetDir, 'demo_90day_simulated_observations.csv'), 'utf8');
const obsLines = obsCsv.trim().split('\n').slice(1);
const obsBySenior = new Map();
obsLines.forEach(line => {
  const parts = line.split(',');
  const sid = parts[0];
  if (!obsBySenior.has(sid)) obsBySenior.set(sid, []);
  obsBySenior.get(sid).push({
    date: parts[1],
    dayIndex: Number(parts[2]),
    steps: Number(parts[3]),
    hrBpm: Number(parts[4]),
    systolicBp: Number(parts[5]),
    diastolicBp: Number(parts[6]),
    dataOrigin: 'SIMULATED_NOT_OBSERVED'
  });
});
console.log(`Loaded observations for ${obsBySenior.size} seniors.`);

// 4. Read medication events (18,000 rows)
const medCsv = fs.readFileSync(path.join(datasetDir, 'demo_90day_simulated_medication_events.csv'), 'utf8');
const medLines = medCsv.trim().split('\n').slice(1);
const medBySenior = new Map();
medLines.forEach(line => {
  const parts = line.split(',');
  const sid = parts[0];
  if (!medBySenior.has(sid)) medBySenior.set(sid, []);
  medBySenior.get(sid).push({
    date: parts[1],
    scheduledTime: parts[2],
    medicationName: parts[3],
    confirmationStatus: parts[4], // 'confirmed' | 'unconfirmed'
    dataOrigin: 'SIMULATED_NOT_OBSERVED',
    note: parts[5] || 'Confirmation status is not proof of ingestion'
  });
});
console.log(`Loaded medication events for ${medBySenior.size} seniors.`);

// 5. Read check-in notes (2,482 rows)
const notesCsv = fs.readFileSync(path.join(datasetDir, 'demo_simulated_checkin_notes.csv'), 'utf8');
const notesLines = notesCsv.trim().split('\n').slice(1);
const notesBySenior = new Map();
notesLines.forEach(line => {
  const parts = line.split(',');
  const sid = parts[0];
  if (!notesBySenior.has(sid)) notesBySenior.set(sid, []);
  // In case note text contains commas
  const date = parts[1];
  const lang = parts[2];
  const inputMode = parts[parts.length - 2];
  const dataOrigin = parts[parts.length - 1];
  const noteText = parts.slice(3, parts.length - 2).join(',');
  notesBySenior.get(sid).push({
    date,
    language: lang,
    noteText,
    inputMode,
    dataOrigin: 'SIMULATED_NOT_OBSERVED'
  });
});
console.log(`Loaded check-in notes for ${notesBySenior.size} seniors.`);

// 6. Calculate Baselines strictly using days 1-30 (no future leakage)
function calcMeanSd(arr) {
  if (!arr.length) return { mean: 0, sd: 1 };
  const mean = arr.reduce((a, b) => a + b, 0) / arr.length;
  const variance = arr.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / arr.length;
  return { mean: Math.round(mean * 10) / 10, sd: Math.max(0.1, Math.round(Math.sqrt(variance) * 10) / 10) };
}

// 7. Process each senior
const cohortSeniors = profiles.map(p => {
  const obs = obsBySenior.get(p.seniorId) || [];
  const meds = medBySenior.get(p.seniorId) || [];
  const notes = notesBySenior.get(p.seniorId) || [];

  // Sort by dayIndex
  obs.sort((a, b) => a.dayIndex - b.dayIndex);
  meds.sort((a, b) => a.date.localeCompare(b.date));
  notes.sort((a, b) => a.date.localeCompare(b.date));

  // Baseline strictly days 1 to 30
  const baselineDays = obs.filter(o => o.dayIndex >= 1 && o.dayIndex <= 30);
  const stepsStat = calcMeanSd(baselineDays.map(o => o.steps));
  const hrStat = calcMeanSd(baselineDays.map(o => o.hrBpm));
  const sysStat = calcMeanSd(baselineDays.map(o => o.systolicBp));
  const diaStat = calcMeanSd(baselineDays.map(o => o.diastolicBp));

  const baseline = {
    stepsMean: Math.round(stepsStat.mean),
    stepsSd: stepsStat.sd,
    hrMean: Math.round(hrStat.mean),
    hrSd: hrStat.sd,
    systolicBpMean: Math.round(sysStat.mean),
    systolicBpSd: sysStat.sd,
    diastolicBpMean: Math.round(diaStat.mean),
    diastolicBpSd: diaStat.sd,
    establishedDays: baselineDays.length
  };

  // Evaluate risk scores for each day
  // Risk model additive components:
  // 1. Systolic BP drift Z-score (0-30 pts)
  // 2. Resting HR drift Z-score (0-20 pts)
  // 3. Step reduction % relative to baseline (0-25 pts)
  // 4. Medication miss in last 7 days (0-15 pts)
  // 5. Note fatigue/pain cues (0-10 pts)
  const medByDate = new Map();
  meds.forEach(m => medByDate.set(m.date, m.confirmationStatus));

  const noteByDate = new Map();
  notes.forEach(n => noteByDate.set(n.date, n.noteText));

  const dailyScores = obs.map(day => {
    let score = 0;
    const signals = [];

    // Vitals drift
    const sysZ = (day.systolicBp - baseline.systolicBpMean) / baseline.systolicBpSd;
    if (sysZ > 2.0) {
      const pts = Math.min(30, Math.round((sysZ - 1.5) * 15));
      score += pts;
      signals.push(`Elevated BP (${day.systolicBp} mmHg, +${Math.round(sysZ*10)/10} SD)`);
    } else if (sysZ < -2.0) {
      score += 15;
      signals.push(`BP drop (${day.systolicBp} mmHg)`);
    }

    const hrZ = (day.hrBpm - baseline.hrMean) / baseline.hrSd;
    if (hrZ > 2.0) {
      const pts = Math.min(20, Math.round((hrZ - 1.5) * 10));
      score += pts;
      signals.push(`Elevated HR (${day.hrBpm} bpm)`);
    }

    // Step reduction
    if (day.steps < baseline.stepsMean * 0.65) {
      const dropPct = Math.round((1 - day.steps / baseline.stepsMean) * 100);
      const pts = Math.min(25, Math.round(dropPct * 0.35));
      score += pts;
      signals.push(`Activity reduced (-${dropPct}% steps)`);
    }

    // Medication miss in rolling 7 days
    const dayIdx = day.dayIndex;
    let recentMisses = 0;
    for (let i = Math.max(0, dayIdx - 7); i < dayIdx; i++) {
      if (obs[i]) {
        const dStr = obs[i].date;
        if (medByDate.get(dStr) === 'unconfirmed') recentMisses++;
      }
    }
    if (recentMisses >= 3) {
      score += Math.min(15, recentMisses * 4);
      signals.push(`${recentMisses} unconfirmed meds this week`);
    }

    // Notes check
    const note = noteByDate.get(day.date);
    if (note) {
      const lowNote = note.toLowerCase();
      if (lowNote.includes('tired') || lowNote.includes('less active') || lowNote.includes('not feeling well')) {
        score += 10;
        signals.push('Reported fatigue / low activity');
      }
    }

    score = Math.min(100, Math.max(0, score));

    return {
      date: day.date,
      dayIndex: day.dayIndex,
      steps: day.steps,
      hrBpm: day.hrBpm,
      systolicBp: day.systolicBp,
      diastolicBp: day.diastolicBp,
      medStatus: medByDate.get(day.date) || 'unknown',
      riskScore: score,
      signals
    };
  });

  const lastDay = dailyScores[dailyScores.length - 1] || {};
  const currentRiskScore = lastDay.riskScore || 0;
  const currentUrgency = currentRiskScore >= 60 ? 'critical' : currentRiskScore >= 35 ? 'moderate' : 'low';

  // 14-day and 30-day risk trends
  const trend14Days = dailyScores.slice(-14).map(d => d.riskScore);
  const recentRiskTrend = dailyScores.slice(-30).map(d => d.riskScore);

  // Medication adherence rate
  const confirmedCount = meds.filter(m => m.confirmationStatus === 'confirmed').length;
  const adherenceRate = meds.length > 0 ? Math.round((confirmedCount / meds.length) * 100) : 100;

  // Last 30 days averages
  const last30Obs = obs.slice(-30);
  const last30AvgSteps = Math.round(last30Obs.reduce((a, b) => a + b.steps, 0) / (last30Obs.length || 1));
  const last30AvgHr = Math.round(last30Obs.reduce((a, b) => a + b.hrBpm, 0) / (last30Obs.length || 1));
  const last30AvgSystolic = Math.round(last30Obs.reduce((a, b) => a + b.systolicBp, 0) / (last30Obs.length || 1));
  const last30MissedMeds = meds.slice(-30).filter(m => m.confirmationStatus === 'unconfirmed').length;

  const planted = scenarioMap.get(p.seniorId) || null;

  return {
    ...p,
    baseline,
    currentUrgency,
    currentRiskScore,
    trend14Days,
    recentRiskTrend,
    adherenceRate,
    noteCount: notes.length,
    noteLanguages: Array.from(new Set(notes.map(n => n.language))),
    plantedScenario: planted,
    last30AvgSteps,
    last30AvgHr,
    last30AvgSystolic,
    last30MissedMeds,
    recentNotes: notes.slice(-5),
    topSignals: lastDay.signals || [],
    observations: dailyScores // Full 90 days!
  };
});

console.log('Processed', cohortSeniors.length, 'seniors with 90-day observations.');

// 8. Evaluation benchmark against the 12 planted decline scenarios
// A positive prediction is currentUrgency === 'critical' || currentUrgency === 'moderate'
let tp = 0, fp = 0, fn = 0, tn = 0;
let leadDaysList = [];

cohortSeniors.forEach(s => {
  const isPlanted = s.plantedScenario !== null;
  // Positive alert if risk >= 35 on any day after day 60
  const alertedDay = s.observations.find(d => d.dayIndex >= 60 && d.riskScore >= 35);
  const hasAlert = alertedDay !== undefined;

  if (isPlanted && hasAlert) {
    tp++;
    if (s.plantedScenario.onsetDay) {
      const lead = Math.max(0, s.plantedScenario.onsetDay - alertedDay.dayIndex);
      leadDaysList.push(lead);
    }
  } else if (!isPlanted && hasAlert) {
    fp++;
  } else if (isPlanted && !hasAlert) {
    fn++;
  } else {
    tn++;
  }
});

const precision = tp + fp > 0 ? Math.round((tp / (tp + fp)) * 1000) / 10 : 0;
const recall = tp + fn > 0 ? Math.round((tp / (tp + fn)) * 1000) / 10 : 0;
const f1 = precision + recall > 0 ? Math.round((2 * precision * recall / (precision + recall)) * 10) / 10 : 0;
const avgLeadDays = leadDaysList.length ? Math.round(leadDaysList.reduce((a,b)=>a+b,0) / leadDaysList.length) : 0;
const fpr = fp + tn > 0 ? Math.round((fp / (fp + tn)) * 1000) / 10 : 0;

const evalMetrics = {
  tp, fp, fn, tn,
  precision, recall, f1,
  avgLeadDays,
  falsePositiveRate: fpr
};
console.log('Evaluation metrics on synthetic scenarios:', evalMetrics);

// Separate observations to keep senior list lightweight if needed, or bundle together
// We can store senior summary in COHORT_SENIORS and observations in a keyed map COHORT_OBSERVATIONS_MAP
const seniorSummaries = cohortSeniors.map(s => {
  const copy = { ...s };
  delete copy.observations;
  return copy;
});

const observationsMap = {};
cohortSeniors.forEach(s => {
  observationsMap[s.seniorId] = s.observations;
});

const code = `/**
 * SAMARTH WATCH - Demonstration Cohort Database (200 Seniors, 90 Days)
 * AUTO-GENERATED from source package: Data set/datasetssss/
 *
 * PROVENANCE & LIMITATIONS:
 * - Senior profiles: source-derived pseudonymized hospital admission rows (age 60+).
 *   Source names, hospitals, doctors, insurance, billing, and room numbers EXCLUDED.
 *   These rows are NOT verified unique real people or continuous home-care patients.
 * - 90-day vitals (steps, resting HR, systolic/diastolic BP): ENTIRELY SIMULATED.
 *   Flagged: SIMULATED_NOT_OBSERVED.
 * - Medication confirmations: ENTIRELY SIMULATED. Confirmation is NOT proof of ingestion.
 * - Check-in notes: ENTIRELY SIMULATED text. NOT audio or speech-to-text.
 * - Planted decline scenarios (SW001-SW012): SYNTHETIC labels for evaluation only.
 *   NEVER exposed as features to prediction models or AI agents.
 * - This dataset CANNOT validate real-world clinical performance.
 */

export type CohortUrgency = 'critical' | 'moderate' | 'low';
export type MedStatus = 'confirmed' | 'unconfirmed' | 'unknown';

export interface CohortBaseline {
  systolicBpMean: number;
  systolicBpSd: number;
  diastolicBpMean: number;
  diastolicBpSd: number;
  hrMean: number;
  hrSd: number;
  stepsMean: number;
  stepsSd: number;
  establishedDays: number;
}

export interface CohortDayRecord {
  date: string;
  dayIndex: number;
  steps: number;
  hrBpm: number;
  systolicBp: number;
  diastolicBp: number;
  medStatus: MedStatus;
  riskScore: number;
  signals: string[];
}

export interface CohortCheckinNote {
  date: string;
  language: string;
  noteText: string;
  inputMode: string;
  dataOrigin: 'SIMULATED_NOT_OBSERVED';
}

export interface PlantedScenario {
  seniorId: string;
  scenarioType: string;
  onsetDay: number;
  onsetDate: string;
  labelSource: string;
}

export interface CohortSeniorSummary {
  seniorId: string;
  recordId: string;
  age: number;
  gender: string;
  bloodType: string;
  medicalCondition: string;
  medicationName: string;
  testResult: string;
  admissionType: string;
  admissionDate: string;
  dischargeDate: string;
  lengthOfStayDays: number;
  profileOrigin: string;
  uniquePersonVerified: boolean;
  baseline: CohortBaseline;
  currentUrgency: CohortUrgency;
  currentRiskScore: number;
  trend14Days: number[];
  recentRiskTrend: number[];
  adherenceRate: number;
  noteCount: number;
  noteLanguages: string[];
  plantedScenario: PlantedScenario | null;
  last30AvgSteps: number;
  last30AvgHr: number;
  last30AvgSystolic: number;
  last30MissedMeds: number;
  recentNotes: CohortCheckinNote[];
  topSignals: string[];
}

export interface CohortEvalMetrics {
  tp: number;
  fp: number;
  fn: number;
  tn: number;
  precision: number;
  recall: number;
  f1: number;
  avgLeadDays: number;
  falsePositiveRate: number;
}

export const COHORT_OBSERVATION_START = '2026-07-01';
export const COHORT_OBSERVATION_END = '2026-09-28';
export const COHORT_SIZE = ${cohortSeniors.length};
export const PLANTED_SCENARIO_COUNT = ${scenarioMap.size};

export const COHORT_EVAL_METRICS: CohortEvalMetrics = ${JSON.stringify(evalMetrics, null, 2)};

export const COHORT_CONDITIONS = {
  Obesity: ${cohortSeniors.filter(s=>s.medicalCondition==='Obesity').length},
  Asthma: ${cohortSeniors.filter(s=>s.medicalCondition==='Asthma').length},
  Hypertension: ${cohortSeniors.filter(s=>s.medicalCondition==='Hypertension').length},
  Arthritis: ${cohortSeniors.filter(s=>s.medicalCondition==='Arthritis').length},
  Diabetes: ${cohortSeniors.filter(s=>s.medicalCondition==='Diabetes').length},
  Cancer: ${cohortSeniors.filter(s=>s.medicalCondition==='Cancer').length},
};

export const COHORT_ADMISSION_TYPES = {
  Urgent: ${cohortSeniors.filter(s=>s.admissionType==='Urgent').length},
  Emergency: ${cohortSeniors.filter(s=>s.admissionType==='Emergency').length},
  Elective: ${cohortSeniors.filter(s=>s.admissionType==='Elective').length},
};

export const COHORT_SENIORS: CohortSeniorSummary[] = ${JSON.stringify(seniorSummaries, null, 2)};

export const COHORT_OBSERVATIONS_MAP: Record<string, CohortDayRecord[]> = ${JSON.stringify(observationsMap, null, 2)};

/** Helper: retrieve full 90-day observation time series for a cohort senior */
export function getSeniorObservations(seniorId: string): CohortDayRecord[] {
  return COHORT_OBSERVATIONS_MAP[seniorId] || [];
}

/** Helper: retrieve senior summary */
export function getCohortSenior(seniorId: string): CohortSeniorSummary | undefined {
  return COHORT_SENIORS.find(s => s.seniorId === seniorId);
}
`;

fs.writeFileSync(outPath, code, 'utf8');
console.log('Successfully wrote cohortDatabase.ts. File size:', fs.statSync(outPath).size, 'bytes.');
