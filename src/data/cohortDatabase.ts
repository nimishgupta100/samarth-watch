/**
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
export const COHORT_SIZE = 20;
export const PLANTED_SCENARIO_COUNT = 12;

export const COHORT_EVAL_METRICS: CohortEvalMetrics = {
  "tp": 8,
  "fp": 0,
  "fn": 4,
  "tn": 8,
  "precision": 100,
  "recall": 66.7,
  "f1": 80,
  "avgLeadDays": 1,
  "falsePositiveRate": 0
};

export const COHORT_CONDITIONS = {
  Obesity: 2,
  Asthma: 3,
  Hypertension: 6,
  Arthritis: 3,
  Diabetes: 2,
  Cancer: 4,
};

export const COHORT_ADMISSION_TYPES = {
  Urgent: 7,
  Emergency: 9,
  Elective: 4,
};

export const COHORT_SENIORS: CohortSeniorSummary[] = [
  {
    "seniorId": "SW001",
    "recordId": "SR18251",
    "age": 81,
    "gender": "Male",
    "bloodType": "AB+",
    "medicalCondition": "Hypertension",
    "medicationName": "Aspirin",
    "testResult": "Normal",
    "admissionType": "Elective",
    "admissionDate": "2022-11-23",
    "dischargeDate": "2022-12-09",
    "lengthOfStayDays": 16,
    "profileOrigin": "source_record_pseudonymized",
    "uniquePersonVerified": false,
    "baseline": {
      "stepsMean": 5503,
      "stepsSd": 339.2,
      "hrMean": 73,
      "hrSd": 2.5,
      "systolicBpMean": 114,
      "systolicBpSd": 6.2,
      "diastolicBpMean": 78,
      "diastolicBpSd": 3.7,
      "establishedDays": 30
    },
    "currentUrgency": "moderate",
    "currentRiskScore": 36,
    "trend14Days": [
      30,
      22,
      25,
      45,
      43,
      12,
      9,
      31,
      14,
      32,
      38,
      42,
      12,
      36
    ],
    "recentRiskTrend": [
      15,
      0,
      0,
      0,
      0,
      10,
      0,
      11,
      10,
      22,
      12,
      22,
      13,
      0,
      10,
      12,
      30,
      22,
      25,
      45,
      43,
      12,
      9,
      31,
      14,
      32,
      38,
      42,
      12,
      36
    ],
    "adherenceRate": 76,
    "noteCount": 20,
    "noteLanguages": [
      "en"
    ],
    "plantedScenario": {
      "seniorId": "SW001",
      "scenarioType": "SIMULATED_GRADUAL_ACTIVITY_DECLINE_WITH_CHECKIN_CHANGES",
      "onsetDay": 66,
      "onsetDate": "2026-09-04",
      "labelSource": "synthetic_scenario_not_clinical_ground_truth"
    },
    "last30AvgSteps": 4399,
    "last30AvgHr": 77,
    "last30AvgSystolic": 116,
    "last30MissedMeds": 10,
    "recentNotes": [
      {
        "date": "2026-09-16",
        "language": "en",
        "noteText": "I feel more tired than usual and have been less active.",
        "inputMode": "simulated_text_not_voice",
        "dataOrigin": "SIMULATED_NOT_OBSERVED"
      },
      {
        "date": "2026-09-19",
        "language": "en",
        "noteText": "I feel more tired than usual and have been less active.",
        "inputMode": "simulated_text_not_voice",
        "dataOrigin": "SIMULATED_NOT_OBSERVED"
      },
      {
        "date": "2026-09-22",
        "language": "en",
        "noteText": "I feel more tired than usual and have been less active.",
        "inputMode": "simulated_text_not_voice",
        "dataOrigin": "SIMULATED_NOT_OBSERVED"
      },
      {
        "date": "2026-09-25",
        "language": "en",
        "noteText": "I feel more tired than usual and have been less active.",
        "inputMode": "simulated_text_not_voice",
        "dataOrigin": "SIMULATED_NOT_OBSERVED"
      },
      {
        "date": "2026-09-28",
        "language": "en",
        "noteText": "I feel more tired than usual and have been less active.",
        "inputMode": "simulated_text_not_voice",
        "dataOrigin": "SIMULATED_NOT_OBSERVED"
      }
    ],
    "topSignals": [
      "Activity reduced (-39% steps)",
      "3 unconfirmed meds this week",
      "Reported fatigue / low activity"
    ]
  },
  {
    "seniorId": "SW002",
    "recordId": "SR19041",
    "age": 84,
    "gender": "Female",
    "bloodType": "O+",
    "medicalCondition": "Obesity",
    "medicationName": "Aspirin",
    "testResult": "Normal",
    "admissionType": "Emergency",
    "admissionDate": "2023-12-05",
    "dischargeDate": "2023-12-09",
    "lengthOfStayDays": 4,
    "profileOrigin": "source_record_pseudonymized",
    "uniquePersonVerified": false,
    "baseline": {
      "stepsMean": 5538,
      "stepsSd": 437.3,
      "hrMean": 85,
      "hrSd": 3,
      "systolicBpMean": 116,
      "systolicBpSd": 6.4,
      "diastolicBpMean": 84,
      "diastolicBpSd": 3.7,
      "establishedDays": 30
    },
    "currentUrgency": "low",
    "currentRiskScore": 25,
    "trend14Days": [
      10,
      10,
      0,
      0,
      10,
      0,
      0,
      10,
      12,
      16,
      38,
      12,
      35,
      25
    ],
    "recentRiskTrend": [
      15,
      0,
      0,
      0,
      0,
      0,
      12,
      15,
      25,
      25,
      15,
      25,
      25,
      0,
      10,
      0,
      10,
      10,
      0,
      0,
      10,
      0,
      0,
      10,
      12,
      16,
      38,
      12,
      35,
      25
    ],
    "adherenceRate": 84,
    "noteCount": 19,
    "noteLanguages": [
      "en"
    ],
    "plantedScenario": {
      "seniorId": "SW002",
      "scenarioType": "SIMULATED_GRADUAL_ACTIVITY_DECLINE_WITH_CHECKIN_CHANGES",
      "onsetDay": 67,
      "onsetDate": "2026-09-05",
      "labelSource": "synthetic_scenario_not_clinical_ground_truth"
    },
    "last30AvgSteps": 4664,
    "last30AvgHr": 86,
    "last30AvgSystolic": 119,
    "last30MissedMeds": 10,
    "recentNotes": [
      {
        "date": "2026-09-16",
        "language": "en",
        "noteText": "I feel more tired than usual and have been less active.",
        "inputMode": "simulated_text_not_voice",
        "dataOrigin": "SIMULATED_NOT_OBSERVED"
      },
      {
        "date": "2026-09-19",
        "language": "en",
        "noteText": "I feel more tired than usual and have been less active.",
        "inputMode": "simulated_text_not_voice",
        "dataOrigin": "SIMULATED_NOT_OBSERVED"
      },
      {
        "date": "2026-09-22",
        "language": "en",
        "noteText": "I feel more tired than usual and have been less active.",
        "inputMode": "simulated_text_not_voice",
        "dataOrigin": "SIMULATED_NOT_OBSERVED"
      },
      {
        "date": "2026-09-25",
        "language": "en",
        "noteText": "I feel more tired than usual and have been less active.",
        "inputMode": "simulated_text_not_voice",
        "dataOrigin": "SIMULATED_NOT_OBSERVED"
      },
      {
        "date": "2026-09-28",
        "language": "en",
        "noteText": "I feel more tired than usual and have been less active.",
        "inputMode": "simulated_text_not_voice",
        "dataOrigin": "SIMULATED_NOT_OBSERVED"
      }
    ],
    "topSignals": [
      "Activity reduced (-42% steps)",
      "Reported fatigue / low activity"
    ]
  },
  {
    "seniorId": "SW003",
    "recordId": "SR20526",
    "age": 84,
    "gender": "Male",
    "bloodType": "B+",
    "medicalCondition": "Arthritis",
    "medicationName": "Paracetamol",
    "testResult": "Inconclusive",
    "admissionType": "Emergency",
    "admissionDate": "2021-06-13",
    "dischargeDate": "2021-06-21",
    "lengthOfStayDays": 8,
    "profileOrigin": "source_record_pseudonymized",
    "uniquePersonVerified": false,
    "baseline": {
      "stepsMean": 4671,
      "stepsSd": 404.6,
      "hrMean": 81,
      "hrSd": 3.5,
      "systolicBpMean": 126,
      "systolicBpSd": 5.5,
      "diastolicBpMean": 87,
      "diastolicBpSd": 3.1,
      "establishedDays": 30
    },
    "currentUrgency": "low",
    "currentRiskScore": 30,
    "trend14Days": [
      22,
      22,
      0,
      12,
      10,
      13,
      0,
      10,
      15,
      14,
      29,
      13,
      20,
      30
    ],
    "recentRiskTrend": [
      16,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      22,
      22,
      0,
      22,
      12,
      15,
      22,
      12,
      22,
      22,
      0,
      12,
      10,
      13,
      0,
      10,
      15,
      14,
      29,
      13,
      20,
      30
    ],
    "adherenceRate": 86,
    "noteCount": 19,
    "noteLanguages": [
      "en"
    ],
    "plantedScenario": {
      "seniorId": "SW003",
      "scenarioType": "SIMULATED_GRADUAL_ACTIVITY_DECLINE_WITH_CHECKIN_CHANGES",
      "onsetDay": 68,
      "onsetDate": "2026-09-06",
      "labelSource": "synthetic_scenario_not_clinical_ground_truth"
    },
    "last30AvgSteps": 3707,
    "last30AvgHr": 82,
    "last30AvgSystolic": 128,
    "last30MissedMeds": 9,
    "recentNotes": [
      {
        "date": "2026-09-16",
        "language": "en",
        "noteText": "I feel more tired than usual and have been less active.",
        "inputMode": "simulated_text_not_voice",
        "dataOrigin": "SIMULATED_NOT_OBSERVED"
      },
      {
        "date": "2026-09-19",
        "language": "en",
        "noteText": "I feel more tired than usual and have been less active.",
        "inputMode": "simulated_text_not_voice",
        "dataOrigin": "SIMULATED_NOT_OBSERVED"
      },
      {
        "date": "2026-09-22",
        "language": "en",
        "noteText": "I feel more tired than usual and have been less active.",
        "inputMode": "simulated_text_not_voice",
        "dataOrigin": "SIMULATED_NOT_OBSERVED"
      },
      {
        "date": "2026-09-25",
        "language": "en",
        "noteText": "I feel more tired than usual and have been less active.",
        "inputMode": "simulated_text_not_voice",
        "dataOrigin": "SIMULATED_NOT_OBSERVED"
      },
      {
        "date": "2026-09-28",
        "language": "en",
        "noteText": "I feel more tired than usual and have been less active.",
        "inputMode": "simulated_text_not_voice",
        "dataOrigin": "SIMULATED_NOT_OBSERVED"
      }
    ],
    "topSignals": [
      "Activity reduced (-56% steps)",
      "Reported fatigue / low activity"
    ]
  },
  {
    "seniorId": "SW004",
    "recordId": "SR08170",
    "age": 64,
    "gender": "Female",
    "bloodType": "A-",
    "medicalCondition": "Hypertension",
    "medicationName": "Penicillin",
    "testResult": "Inconclusive",
    "admissionType": "Urgent",
    "admissionDate": "2019-10-23",
    "dischargeDate": "2019-11-11",
    "lengthOfStayDays": 19,
    "profileOrigin": "source_record_pseudonymized",
    "uniquePersonVerified": false,
    "baseline": {
      "stepsMean": 4244,
      "stepsSd": 431.4,
      "hrMean": 65,
      "hrSd": 3.6,
      "systolicBpMean": 130,
      "systolicBpSd": 4.8,
      "diastolicBpMean": 85,
      "diastolicBpSd": 3.8,
      "establishedDays": 30
    },
    "currentUrgency": "moderate",
    "currentRiskScore": 56,
    "trend14Days": [
      22,
      22,
      12,
      0,
      10,
      0,
      13,
      44,
      18,
      0,
      10,
      21,
      14,
      56
    ],
    "recentRiskTrend": [
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      10,
      10,
      18,
      10,
      0,
      12,
      22,
      0,
      22,
      22,
      12,
      0,
      10,
      0,
      13,
      44,
      18,
      0,
      10,
      21,
      14,
      56
    ],
    "adherenceRate": 83,
    "noteCount": 19,
    "noteLanguages": [
      "en"
    ],
    "plantedScenario": {
      "seniorId": "SW004",
      "scenarioType": "SIMULATED_GRADUAL_ACTIVITY_DECLINE_WITH_CHECKIN_CHANGES",
      "onsetDay": 69,
      "onsetDate": "2026-09-07",
      "labelSource": "synthetic_scenario_not_clinical_ground_truth"
    },
    "last30AvgSteps": 3515,
    "last30AvgHr": 65,
    "last30AvgSystolic": 130,
    "last30MissedMeds": 8,
    "recentNotes": [
      {
        "date": "2026-09-16",
        "language": "en",
        "noteText": "I feel more tired than usual and have been less active.",
        "inputMode": "simulated_text_not_voice",
        "dataOrigin": "SIMULATED_NOT_OBSERVED"
      },
      {
        "date": "2026-09-19",
        "language": "en",
        "noteText": "I feel more tired than usual and have been less active.",
        "inputMode": "simulated_text_not_voice",
        "dataOrigin": "SIMULATED_NOT_OBSERVED"
      },
      {
        "date": "2026-09-22",
        "language": "en",
        "noteText": "I feel more tired than usual and have been less active.",
        "inputMode": "simulated_text_not_voice",
        "dataOrigin": "SIMULATED_NOT_OBSERVED"
      },
      {
        "date": "2026-09-25",
        "language": "en",
        "noteText": "I feel more tired than usual and have been less active.",
        "inputMode": "simulated_text_not_voice",
        "dataOrigin": "SIMULATED_NOT_OBSERVED"
      },
      {
        "date": "2026-09-28",
        "language": "en",
        "noteText": "I feel more tired than usual and have been less active.",
        "inputMode": "simulated_text_not_voice",
        "dataOrigin": "SIMULATED_NOT_OBSERVED"
      }
    ],
    "topSignals": [
      "Elevated BP (146 mmHg, +3.3 SD)",
      "Activity reduced (-52% steps)",
      "Reported fatigue / low activity"
    ]
  },
  {
    "seniorId": "SW005",
    "recordId": "SR16764",
    "age": 85,
    "gender": "Female",
    "bloodType": "B-",
    "medicalCondition": "Asthma",
    "medicationName": "Paracetamol",
    "testResult": "Normal",
    "admissionType": "Urgent",
    "admissionDate": "2021-02-13",
    "dischargeDate": "2021-03-07",
    "lengthOfStayDays": 22,
    "profileOrigin": "source_record_pseudonymized",
    "uniquePersonVerified": false,
    "baseline": {
      "stepsMean": 5817,
      "stepsSd": 408.6,
      "hrMean": 81,
      "hrSd": 2.8,
      "systolicBpMean": 136,
      "systolicBpSd": 5.6,
      "diastolicBpMean": 66,
      "diastolicBpSd": 3.2,
      "establishedDays": 30
    },
    "currentUrgency": "low",
    "currentRiskScore": 10,
    "trend14Days": [
      10,
      10,
      0,
      0,
      10,
      12,
      0,
      10,
      0,
      0,
      23,
      14,
      10,
      10
    ],
    "recentRiskTrend": [
      0,
      0,
      0,
      15,
      0,
      0,
      0,
      0,
      0,
      10,
      0,
      10,
      0,
      0,
      10,
      15,
      10,
      10,
      0,
      0,
      10,
      12,
      0,
      10,
      0,
      0,
      23,
      14,
      10,
      10
    ],
    "adherenceRate": 83,
    "noteCount": 18,
    "noteLanguages": [
      "en"
    ],
    "plantedScenario": {
      "seniorId": "SW005",
      "scenarioType": "SIMULATED_GRADUAL_ACTIVITY_DECLINE_WITH_CHECKIN_CHANGES",
      "onsetDay": 70,
      "onsetDate": "2026-09-08",
      "labelSource": "synthetic_scenario_not_clinical_ground_truth"
    },
    "last30AvgSteps": 5100,
    "last30AvgHr": 82,
    "last30AvgSystolic": 136,
    "last30MissedMeds": 6,
    "recentNotes": [
      {
        "date": "2026-09-16",
        "language": "en",
        "noteText": "I feel more tired than usual and have been less active.",
        "inputMode": "simulated_text_not_voice",
        "dataOrigin": "SIMULATED_NOT_OBSERVED"
      },
      {
        "date": "2026-09-19",
        "language": "en",
        "noteText": "I feel more tired than usual and have been less active.",
        "inputMode": "simulated_text_not_voice",
        "dataOrigin": "SIMULATED_NOT_OBSERVED"
      },
      {
        "date": "2026-09-22",
        "language": "en",
        "noteText": "I feel more tired than usual and have been less active.",
        "inputMode": "simulated_text_not_voice",
        "dataOrigin": "SIMULATED_NOT_OBSERVED"
      },
      {
        "date": "2026-09-25",
        "language": "en",
        "noteText": "I feel more tired than usual and have been less active.",
        "inputMode": "simulated_text_not_voice",
        "dataOrigin": "SIMULATED_NOT_OBSERVED"
      },
      {
        "date": "2026-09-28",
        "language": "en",
        "noteText": "I feel more tired than usual and have been less active.",
        "inputMode": "simulated_text_not_voice",
        "dataOrigin": "SIMULATED_NOT_OBSERVED"
      }
    ],
    "topSignals": [
      "Reported fatigue / low activity"
    ]
  },
  {
    "seniorId": "SW006",
    "recordId": "SR16776",
    "age": 69,
    "gender": "Female",
    "bloodType": "AB+",
    "medicalCondition": "Cancer",
    "medicationName": "Ibuprofen",
    "testResult": "Inconclusive",
    "admissionType": "Emergency",
    "admissionDate": "2021-01-08",
    "dischargeDate": "2021-01-09",
    "lengthOfStayDays": 1,
    "profileOrigin": "source_record_pseudonymized",
    "uniquePersonVerified": false,
    "baseline": {
      "stepsMean": 3198,
      "stepsSd": 434.6,
      "hrMean": 70,
      "hrSd": 2.6,
      "systolicBpMean": 123,
      "systolicBpSd": 5.1,
      "diastolicBpMean": 86,
      "diastolicBpSd": 2.8,
      "establishedDays": 30
    },
    "currentUrgency": "moderate",
    "currentRiskScore": 55,
    "trend14Days": [
      25,
      25,
      15,
      29,
      23,
      17,
      35,
      27,
      42,
      14,
      60,
      18,
      33,
      55
    ],
    "recentRiskTrend": [
      12,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      22,
      12,
      15,
      25,
      15,
      25,
      25,
      15,
      29,
      23,
      17,
      35,
      27,
      42,
      14,
      60,
      18,
      33,
      55
    ],
    "adherenceRate": 84,
    "noteCount": 18,
    "noteLanguages": [
      "en"
    ],
    "plantedScenario": {
      "seniorId": "SW006",
      "scenarioType": "SIMULATED_GRADUAL_ACTIVITY_DECLINE_WITH_CHECKIN_CHANGES",
      "onsetDay": 71,
      "onsetDate": "2026-09-09",
      "labelSource": "synthetic_scenario_not_clinical_ground_truth"
    },
    "last30AvgSteps": 2406,
    "last30AvgHr": 72,
    "last30AvgSystolic": 125,
    "last30MissedMeds": 9,
    "recentNotes": [
      {
        "date": "2026-09-16",
        "language": "en",
        "noteText": "I feel more tired than usual and have been less active.",
        "inputMode": "simulated_text_not_voice",
        "dataOrigin": "SIMULATED_NOT_OBSERVED"
      },
      {
        "date": "2026-09-19",
        "language": "en",
        "noteText": "I feel more tired than usual and have been less active.",
        "inputMode": "simulated_text_not_voice",
        "dataOrigin": "SIMULATED_NOT_OBSERVED"
      },
      {
        "date": "2026-09-22",
        "language": "en",
        "noteText": "I feel more tired than usual and have been less active.",
        "inputMode": "simulated_text_not_voice",
        "dataOrigin": "SIMULATED_NOT_OBSERVED"
      },
      {
        "date": "2026-09-25",
        "language": "en",
        "noteText": "I feel more tired than usual and have been less active.",
        "inputMode": "simulated_text_not_voice",
        "dataOrigin": "SIMULATED_NOT_OBSERVED"
      },
      {
        "date": "2026-09-28",
        "language": "en",
        "noteText": "I feel more tired than usual and have been less active.",
        "inputMode": "simulated_text_not_voice",
        "dataOrigin": "SIMULATED_NOT_OBSERVED"
      }
    ],
    "topSignals": [
      "Elevated HR (81 bpm)",
      "Activity reduced (-75% steps)",
      "Reported fatigue / low activity"
    ]
  },
  {
    "seniorId": "SW007",
    "recordId": "SR10822",
    "age": 71,
    "gender": "Male",
    "bloodType": "A+",
    "medicalCondition": "Cancer",
    "medicationName": "Penicillin",
    "testResult": "Abnormal",
    "admissionType": "Urgent",
    "admissionDate": "2024-03-05",
    "dischargeDate": "2024-03-12",
    "lengthOfStayDays": 7,
    "profileOrigin": "source_record_pseudonymized",
    "uniquePersonVerified": false,
    "baseline": {
      "stepsMean": 6457,
      "stepsSd": 435.7,
      "hrMean": 68,
      "hrSd": 2.6,
      "systolicBpMean": 114,
      "systolicBpSd": 4.7,
      "diastolicBpMean": 87,
      "diastolicBpSd": 5,
      "establishedDays": 30
    },
    "currentUrgency": "low",
    "currentRiskScore": 25,
    "trend14Days": [
      10,
      10,
      8,
      12,
      22,
      12,
      9,
      22,
      12,
      25,
      10,
      12,
      24,
      25
    ],
    "recentRiskTrend": [
      0,
      0,
      0,
      12,
      39,
      12,
      13,
      0,
      0,
      0,
      0,
      10,
      0,
      0,
      10,
      25,
      10,
      10,
      8,
      12,
      22,
      12,
      9,
      22,
      12,
      25,
      10,
      12,
      24,
      25
    ],
    "adherenceRate": 80,
    "noteCount": 18,
    "noteLanguages": [
      "en"
    ],
    "plantedScenario": {
      "seniorId": "SW007",
      "scenarioType": "SIMULATED_GRADUAL_ACTIVITY_DECLINE_WITH_CHECKIN_CHANGES",
      "onsetDay": 72,
      "onsetDate": "2026-09-10",
      "labelSource": "synthetic_scenario_not_clinical_ground_truth"
    },
    "last30AvgSteps": 5792,
    "last30AvgHr": 69,
    "last30AvgSystolic": 118,
    "last30MissedMeds": 11,
    "recentNotes": [
      {
        "date": "2026-09-16",
        "language": "en",
        "noteText": "I feel more tired than usual and have been less active.",
        "inputMode": "simulated_text_not_voice",
        "dataOrigin": "SIMULATED_NOT_OBSERVED"
      },
      {
        "date": "2026-09-19",
        "language": "en",
        "noteText": "I feel more tired than usual and have been less active.",
        "inputMode": "simulated_text_not_voice",
        "dataOrigin": "SIMULATED_NOT_OBSERVED"
      },
      {
        "date": "2026-09-22",
        "language": "en",
        "noteText": "I feel more tired than usual and have been less active.",
        "inputMode": "simulated_text_not_voice",
        "dataOrigin": "SIMULATED_NOT_OBSERVED"
      },
      {
        "date": "2026-09-25",
        "language": "en",
        "noteText": "I feel more tired than usual and have been less active.",
        "inputMode": "simulated_text_not_voice",
        "dataOrigin": "SIMULATED_NOT_OBSERVED"
      },
      {
        "date": "2026-09-28",
        "language": "en",
        "noteText": "I feel more tired than usual and have been less active.",
        "inputMode": "simulated_text_not_voice",
        "dataOrigin": "SIMULATED_NOT_OBSERVED"
      }
    ],
    "topSignals": [
      "4 unconfirmed meds this week",
      "Reported fatigue / low activity"
    ]
  },
  {
    "seniorId": "SW008",
    "recordId": "SR17039",
    "age": 79,
    "gender": "Female",
    "bloodType": "B+",
    "medicalCondition": "Obesity",
    "medicationName": "Ibuprofen",
    "testResult": "Inconclusive",
    "admissionType": "Urgent",
    "admissionDate": "2024-01-08",
    "dischargeDate": "2024-01-31",
    "lengthOfStayDays": 23,
    "profileOrigin": "source_record_pseudonymized",
    "uniquePersonVerified": false,
    "baseline": {
      "stepsMean": 6036,
      "stepsSd": 433.5,
      "hrMean": 69,
      "hrSd": 2.6,
      "systolicBpMean": 119,
      "systolicBpSd": 7,
      "diastolicBpMean": 68,
      "diastolicBpSd": 3.4,
      "establishedDays": 30
    },
    "currentUrgency": "low",
    "currentRiskScore": 10,
    "trend14Days": [
      18,
      10,
      0,
      16,
      10,
      0,
      0,
      10,
      0,
      0,
      10,
      0,
      0,
      10
    ],
    "recentRiskTrend": [
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      10,
      0,
      18,
      10,
      0,
      16,
      10,
      0,
      0,
      10,
      0,
      0,
      10,
      0,
      0,
      10
    ],
    "adherenceRate": 87,
    "noteCount": 17,
    "noteLanguages": [
      "en"
    ],
    "plantedScenario": {
      "seniorId": "SW008",
      "scenarioType": "SIMULATED_GRADUAL_ACTIVITY_DECLINE_WITH_CHECKIN_CHANGES",
      "onsetDay": 73,
      "onsetDate": "2026-09-11",
      "labelSource": "synthetic_scenario_not_clinical_ground_truth"
    },
    "last30AvgSteps": 5578,
    "last30AvgHr": 69,
    "last30AvgSystolic": 120,
    "last30MissedMeds": 6,
    "recentNotes": [
      {
        "date": "2026-09-16",
        "language": "en",
        "noteText": "I feel more tired than usual and have been less active.",
        "inputMode": "simulated_text_not_voice",
        "dataOrigin": "SIMULATED_NOT_OBSERVED"
      },
      {
        "date": "2026-09-19",
        "language": "en",
        "noteText": "I feel more tired than usual and have been less active.",
        "inputMode": "simulated_text_not_voice",
        "dataOrigin": "SIMULATED_NOT_OBSERVED"
      },
      {
        "date": "2026-09-22",
        "language": "en",
        "noteText": "I feel more tired than usual and have been less active.",
        "inputMode": "simulated_text_not_voice",
        "dataOrigin": "SIMULATED_NOT_OBSERVED"
      },
      {
        "date": "2026-09-25",
        "language": "en",
        "noteText": "I feel more tired than usual and have been less active.",
        "inputMode": "simulated_text_not_voice",
        "dataOrigin": "SIMULATED_NOT_OBSERVED"
      },
      {
        "date": "2026-09-28",
        "language": "en",
        "noteText": "I feel more tired than usual and have been less active.",
        "inputMode": "simulated_text_not_voice",
        "dataOrigin": "SIMULATED_NOT_OBSERVED"
      }
    ],
    "topSignals": [
      "Reported fatigue / low activity"
    ]
  },
  {
    "seniorId": "SW009",
    "recordId": "SR07935",
    "age": 70,
    "gender": "Male",
    "bloodType": "AB+",
    "medicalCondition": "Hypertension",
    "medicationName": "Lipitor",
    "testResult": "Inconclusive",
    "admissionType": "Urgent",
    "admissionDate": "2020-10-15",
    "dischargeDate": "2020-10-23",
    "lengthOfStayDays": 8,
    "profileOrigin": "source_record_pseudonymized",
    "uniquePersonVerified": false,
    "baseline": {
      "stepsMean": 2672,
      "stepsSd": 458.1,
      "hrMean": 65,
      "hrSd": 2.4,
      "systolicBpMean": 138,
      "systolicBpSd": 5.2,
      "diastolicBpMean": 85,
      "diastolicBpSd": 2.9,
      "establishedDays": 30
    },
    "currentUrgency": "critical",
    "currentRiskScore": 70,
    "trend14Days": [
      48,
      25,
      14,
      17,
      32,
      20,
      25,
      35,
      38,
      37,
      67,
      47,
      40,
      70
    ],
    "recentRiskTrend": [
      0,
      0,
      6,
      35,
      12,
      32,
      26,
      12,
      41,
      10,
      12,
      10,
      24,
      28,
      38,
      34,
      48,
      25,
      14,
      17,
      32,
      20,
      25,
      35,
      38,
      37,
      67,
      47,
      40,
      70
    ],
    "adherenceRate": 83,
    "noteCount": 20,
    "noteLanguages": [
      "en"
    ],
    "plantedScenario": {
      "seniorId": "SW009",
      "scenarioType": "SIMULATED_GRADUAL_ACTIVITY_DECLINE_WITH_CHECKIN_CHANGES",
      "onsetDay": 65,
      "onsetDate": "2026-09-03",
      "labelSource": "synthetic_scenario_not_clinical_ground_truth"
    },
    "last30AvgSteps": 1617,
    "last30AvgHr": 68,
    "last30AvgSystolic": 138,
    "last30MissedMeds": 12,
    "recentNotes": [
      {
        "date": "2026-09-16",
        "language": "en",
        "noteText": "I feel more tired than usual and have been less active.",
        "inputMode": "simulated_text_not_voice",
        "dataOrigin": "SIMULATED_NOT_OBSERVED"
      },
      {
        "date": "2026-09-19",
        "language": "en",
        "noteText": "I feel more tired than usual and have been less active.",
        "inputMode": "simulated_text_not_voice",
        "dataOrigin": "SIMULATED_NOT_OBSERVED"
      },
      {
        "date": "2026-09-22",
        "language": "en",
        "noteText": "I feel more tired than usual and have been less active.",
        "inputMode": "simulated_text_not_voice",
        "dataOrigin": "SIMULATED_NOT_OBSERVED"
      },
      {
        "date": "2026-09-25",
        "language": "en",
        "noteText": "I feel more tired than usual and have been less active.",
        "inputMode": "simulated_text_not_voice",
        "dataOrigin": "SIMULATED_NOT_OBSERVED"
      },
      {
        "date": "2026-09-28",
        "language": "en",
        "noteText": "I feel more tired than usual and have been less active.",
        "inputMode": "simulated_text_not_voice",
        "dataOrigin": "SIMULATED_NOT_OBSERVED"
      }
    ],
    "topSignals": [
      "Elevated HR (74 bpm)",
      "Activity reduced (-94% steps)",
      "4 unconfirmed meds this week",
      "Reported fatigue / low activity"
    ]
  },
  {
    "seniorId": "SW010",
    "recordId": "SR04511",
    "age": 65,
    "gender": "Male",
    "bloodType": "A-",
    "medicalCondition": "Hypertension",
    "medicationName": "Paracetamol",
    "testResult": "Abnormal",
    "admissionType": "Elective",
    "admissionDate": "2022-12-27",
    "dischargeDate": "2023-01-11",
    "lengthOfStayDays": 15,
    "profileOrigin": "source_record_pseudonymized",
    "uniquePersonVerified": false,
    "baseline": {
      "stepsMean": 2645,
      "stepsSd": 426.4,
      "hrMean": 77,
      "hrSd": 2.9,
      "systolicBpMean": 133,
      "systolicBpSd": 5,
      "diastolicBpMean": 73,
      "diastolicBpSd": 4.7,
      "establishedDays": 30
    },
    "currentUrgency": "moderate",
    "currentRiskScore": 47,
    "trend14Days": [
      26,
      10,
      13,
      0,
      26,
      48,
      25,
      56,
      48,
      25,
      47,
      50,
      25,
      47
    ],
    "recentRiskTrend": [
      0,
      0,
      0,
      0,
      0,
      27,
      0,
      0,
      29,
      10,
      0,
      10,
      0,
      13,
      10,
      13,
      26,
      10,
      13,
      0,
      26,
      48,
      25,
      56,
      48,
      25,
      47,
      50,
      25,
      47
    ],
    "adherenceRate": 87,
    "noteCount": 20,
    "noteLanguages": [
      "en"
    ],
    "plantedScenario": {
      "seniorId": "SW010",
      "scenarioType": "SIMULATED_GRADUAL_ACTIVITY_DECLINE_WITH_CHECKIN_CHANGES",
      "onsetDay": 66,
      "onsetDate": "2026-09-04",
      "labelSource": "synthetic_scenario_not_clinical_ground_truth"
    },
    "last30AvgSteps": 1697,
    "last30AvgHr": 78,
    "last30AvgSystolic": 137,
    "last30MissedMeds": 8,
    "recentNotes": [
      {
        "date": "2026-09-16",
        "language": "en",
        "noteText": "I feel more tired than usual and have been less active.",
        "inputMode": "simulated_text_not_voice",
        "dataOrigin": "SIMULATED_NOT_OBSERVED"
      },
      {
        "date": "2026-09-19",
        "language": "en",
        "noteText": "I feel more tired than usual and have been less active.",
        "inputMode": "simulated_text_not_voice",
        "dataOrigin": "SIMULATED_NOT_OBSERVED"
      },
      {
        "date": "2026-09-22",
        "language": "en",
        "noteText": "I feel more tired than usual and have been less active.",
        "inputMode": "simulated_text_not_voice",
        "dataOrigin": "SIMULATED_NOT_OBSERVED"
      },
      {
        "date": "2026-09-25",
        "language": "en",
        "noteText": "I feel more tired than usual and have been less active.",
        "inputMode": "simulated_text_not_voice",
        "dataOrigin": "SIMULATED_NOT_OBSERVED"
      },
      {
        "date": "2026-09-28",
        "language": "en",
        "noteText": "I feel more tired than usual and have been less active.",
        "inputMode": "simulated_text_not_voice",
        "dataOrigin": "SIMULATED_NOT_OBSERVED"
      }
    ],
    "topSignals": [
      "Activity reduced (-92% steps)",
      "3 unconfirmed meds this week",
      "Reported fatigue / low activity"
    ]
  },
  {
    "seniorId": "SW011",
    "recordId": "SR20557",
    "age": 71,
    "gender": "Female",
    "bloodType": "A-",
    "medicalCondition": "Hypertension",
    "medicationName": "Penicillin",
    "testResult": "Abnormal",
    "admissionType": "Elective",
    "admissionDate": "2019-10-07",
    "dischargeDate": "2019-10-26",
    "lengthOfStayDays": 19,
    "profileOrigin": "source_record_pseudonymized",
    "uniquePersonVerified": false,
    "baseline": {
      "stepsMean": 2170,
      "stepsSd": 482.2,
      "hrMean": 67,
      "hrSd": 3.7,
      "systolicBpMean": 112,
      "systolicBpSd": 5.6,
      "diastolicBpMean": 72,
      "diastolicBpSd": 5.1,
      "establishedDays": 30
    },
    "currentUrgency": "moderate",
    "currentRiskScore": 35,
    "trend14Days": [
      47,
      10,
      28,
      18,
      10,
      16,
      22,
      35,
      0,
      20,
      35,
      36,
      25,
      35
    ],
    "recentRiskTrend": [
      12,
      12,
      0,
      0,
      0,
      0,
      0,
      0,
      23,
      10,
      16,
      28,
      12,
      0,
      22,
      12,
      47,
      10,
      28,
      18,
      10,
      16,
      22,
      35,
      0,
      20,
      35,
      36,
      25,
      35
    ],
    "adherenceRate": 82,
    "noteCount": 19,
    "noteLanguages": [
      "en"
    ],
    "plantedScenario": {
      "seniorId": "SW011",
      "scenarioType": "SIMULATED_GRADUAL_ACTIVITY_DECLINE_WITH_CHECKIN_CHANGES",
      "onsetDay": 67,
      "onsetDate": "2026-09-05",
      "labelSource": "synthetic_scenario_not_clinical_ground_truth"
    },
    "last30AvgSteps": 1492,
    "last30AvgHr": 68,
    "last30AvgSystolic": 114,
    "last30MissedMeds": 7,
    "recentNotes": [
      {
        "date": "2026-09-16",
        "language": "en",
        "noteText": "I feel more tired than usual and have been less active.",
        "inputMode": "simulated_text_not_voice",
        "dataOrigin": "SIMULATED_NOT_OBSERVED"
      },
      {
        "date": "2026-09-19",
        "language": "en",
        "noteText": "I feel more tired than usual and have been less active.",
        "inputMode": "simulated_text_not_voice",
        "dataOrigin": "SIMULATED_NOT_OBSERVED"
      },
      {
        "date": "2026-09-22",
        "language": "en",
        "noteText": "I feel more tired than usual and have been less active.",
        "inputMode": "simulated_text_not_voice",
        "dataOrigin": "SIMULATED_NOT_OBSERVED"
      },
      {
        "date": "2026-09-25",
        "language": "en",
        "noteText": "I feel more tired than usual and have been less active.",
        "inputMode": "simulated_text_not_voice",
        "dataOrigin": "SIMULATED_NOT_OBSERVED"
      },
      {
        "date": "2026-09-28",
        "language": "en",
        "noteText": "I feel more tired than usual and have been less active.",
        "inputMode": "simulated_text_not_voice",
        "dataOrigin": "SIMULATED_NOT_OBSERVED"
      }
    ],
    "topSignals": [
      "Activity reduced (-93% steps)",
      "Reported fatigue / low activity"
    ]
  },
  {
    "seniorId": "SW012",
    "recordId": "SR13783",
    "age": 74,
    "gender": "Female",
    "bloodType": "A+",
    "medicalCondition": "Diabetes",
    "medicationName": "Aspirin",
    "testResult": "Normal",
    "admissionType": "Emergency",
    "admissionDate": "2023-12-09",
    "dischargeDate": "2023-12-20",
    "lengthOfStayDays": 11,
    "profileOrigin": "source_record_pseudonymized",
    "uniquePersonVerified": false,
    "baseline": {
      "stepsMean": 6202,
      "stepsSd": 440.4,
      "hrMean": 74,
      "hrSd": 3.2,
      "systolicBpMean": 137,
      "systolicBpSd": 7,
      "diastolicBpMean": 78,
      "diastolicBpSd": 2.9,
      "establishedDays": 30
    },
    "currentUrgency": "low",
    "currentRiskScore": 10,
    "trend14Days": [
      22,
      22,
      0,
      12,
      30,
      0,
      0,
      10,
      0,
      0,
      31,
      13,
      0,
      10
    ],
    "recentRiskTrend": [
      0,
      0,
      7,
      0,
      0,
      0,
      0,
      0,
      10,
      10,
      0,
      10,
      0,
      12,
      10,
      12,
      22,
      22,
      0,
      12,
      30,
      0,
      0,
      10,
      0,
      0,
      31,
      13,
      0,
      10
    ],
    "adherenceRate": 84,
    "noteCount": 19,
    "noteLanguages": [
      "en"
    ],
    "plantedScenario": {
      "seniorId": "SW012",
      "scenarioType": "SIMULATED_GRADUAL_ACTIVITY_DECLINE_WITH_CHECKIN_CHANGES",
      "onsetDay": 68,
      "onsetDate": "2026-09-06",
      "labelSource": "synthetic_scenario_not_clinical_ground_truth"
    },
    "last30AvgSteps": 5250,
    "last30AvgHr": 76,
    "last30AvgSystolic": 139,
    "last30MissedMeds": 7,
    "recentNotes": [
      {
        "date": "2026-09-16",
        "language": "en",
        "noteText": "I feel more tired than usual and have been less active.",
        "inputMode": "simulated_text_not_voice",
        "dataOrigin": "SIMULATED_NOT_OBSERVED"
      },
      {
        "date": "2026-09-19",
        "language": "en",
        "noteText": "I feel more tired than usual and have been less active.",
        "inputMode": "simulated_text_not_voice",
        "dataOrigin": "SIMULATED_NOT_OBSERVED"
      },
      {
        "date": "2026-09-22",
        "language": "en",
        "noteText": "I feel more tired than usual and have been less active.",
        "inputMode": "simulated_text_not_voice",
        "dataOrigin": "SIMULATED_NOT_OBSERVED"
      },
      {
        "date": "2026-09-25",
        "language": "en",
        "noteText": "I feel more tired than usual and have been less active.",
        "inputMode": "simulated_text_not_voice",
        "dataOrigin": "SIMULATED_NOT_OBSERVED"
      },
      {
        "date": "2026-09-28",
        "language": "en",
        "noteText": "I feel more tired than usual and have been less active.",
        "inputMode": "simulated_text_not_voice",
        "dataOrigin": "SIMULATED_NOT_OBSERVED"
      }
    ],
    "topSignals": [
      "Reported fatigue / low activity"
    ]
  },
  {
    "seniorId": "SW013",
    "recordId": "SR15484",
    "age": 82,
    "gender": "Female",
    "bloodType": "B+",
    "medicalCondition": "Cancer",
    "medicationName": "Paracetamol",
    "testResult": "Inconclusive",
    "admissionType": "Emergency",
    "admissionDate": "2021-07-10",
    "dischargeDate": "2021-07-12",
    "lengthOfStayDays": 2,
    "profileOrigin": "source_record_pseudonymized",
    "uniquePersonVerified": false,
    "baseline": {
      "stepsMean": 4533,
      "stepsSd": 445.2,
      "hrMean": 79,
      "hrSd": 3.2,
      "systolicBpMean": 139,
      "systolicBpSd": 5.9,
      "diastolicBpMean": 80,
      "diastolicBpSd": 3.7,
      "establishedDays": 30
    },
    "currentUrgency": "low",
    "currentRiskScore": 0,
    "trend14Days": [
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0
    ],
    "recentRiskTrend": [
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      13,
      0,
      0,
      0,
      0,
      21,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0
    ],
    "adherenceRate": 92,
    "noteCount": 12,
    "noteLanguages": [
      "en"
    ],
    "plantedScenario": null,
    "last30AvgSteps": 4561,
    "last30AvgHr": 79,
    "last30AvgSystolic": 139,
    "last30MissedMeds": 3,
    "recentNotes": [
      {
        "date": "2026-08-25",
        "language": "en",
        "noteText": "I am doing okay today.",
        "inputMode": "simulated_text_not_voice",
        "dataOrigin": "SIMULATED_NOT_OBSERVED"
      },
      {
        "date": "2026-09-01",
        "language": "en",
        "noteText": "I am doing okay today.",
        "inputMode": "simulated_text_not_voice",
        "dataOrigin": "SIMULATED_NOT_OBSERVED"
      },
      {
        "date": "2026-09-08",
        "language": "en",
        "noteText": "I am doing okay today.",
        "inputMode": "simulated_text_not_voice",
        "dataOrigin": "SIMULATED_NOT_OBSERVED"
      },
      {
        "date": "2026-09-15",
        "language": "en",
        "noteText": "I am doing okay today.",
        "inputMode": "simulated_text_not_voice",
        "dataOrigin": "SIMULATED_NOT_OBSERVED"
      },
      {
        "date": "2026-09-22",
        "language": "en",
        "noteText": "I am doing okay today.",
        "inputMode": "simulated_text_not_voice",
        "dataOrigin": "SIMULATED_NOT_OBSERVED"
      }
    ],
    "topSignals": []
  },
  {
    "seniorId": "SW014",
    "recordId": "SR08260",
    "age": 73,
    "gender": "Male",
    "bloodType": "B-",
    "medicalCondition": "Asthma",
    "medicationName": "Penicillin",
    "testResult": "Normal",
    "admissionType": "Urgent",
    "admissionDate": "2019-06-11",
    "dischargeDate": "2019-06-17",
    "lengthOfStayDays": 6,
    "profileOrigin": "source_record_pseudonymized",
    "uniquePersonVerified": false,
    "baseline": {
      "stepsMean": 6158,
      "stepsSd": 410.7,
      "hrMean": 68,
      "hrSd": 2.3,
      "systolicBpMean": 135,
      "systolicBpSd": 4.3,
      "diastolicBpMean": 83,
      "diastolicBpSd": 3.9,
      "establishedDays": 30
    },
    "currentUrgency": "low",
    "currentRiskScore": 0,
    "trend14Days": [
      0,
      0,
      20,
      0,
      0,
      0,
      20,
      15,
      0,
      0,
      16,
      0,
      15,
      0
    ],
    "recentRiskTrend": [
      0,
      7,
      0,
      7,
      19,
      0,
      7,
      0,
      0,
      0,
      0,
      11,
      0,
      0,
      0,
      0,
      0,
      0,
      20,
      0,
      0,
      0,
      20,
      15,
      0,
      0,
      16,
      0,
      15,
      0
    ],
    "adherenceRate": 90,
    "noteCount": 12,
    "noteLanguages": [
      "en"
    ],
    "plantedScenario": null,
    "last30AvgSteps": 6044,
    "last30AvgHr": 70,
    "last30AvgSystolic": 136,
    "last30MissedMeds": 2,
    "recentNotes": [
      {
        "date": "2026-08-25",
        "language": "en",
        "noteText": "I am doing okay today.",
        "inputMode": "simulated_text_not_voice",
        "dataOrigin": "SIMULATED_NOT_OBSERVED"
      },
      {
        "date": "2026-09-01",
        "language": "en",
        "noteText": "I am doing okay today.",
        "inputMode": "simulated_text_not_voice",
        "dataOrigin": "SIMULATED_NOT_OBSERVED"
      },
      {
        "date": "2026-09-08",
        "language": "en",
        "noteText": "I am doing okay today.",
        "inputMode": "simulated_text_not_voice",
        "dataOrigin": "SIMULATED_NOT_OBSERVED"
      },
      {
        "date": "2026-09-15",
        "language": "en",
        "noteText": "I am doing okay today.",
        "inputMode": "simulated_text_not_voice",
        "dataOrigin": "SIMULATED_NOT_OBSERVED"
      },
      {
        "date": "2026-09-22",
        "language": "en",
        "noteText": "I am doing okay today.",
        "inputMode": "simulated_text_not_voice",
        "dataOrigin": "SIMULATED_NOT_OBSERVED"
      }
    ],
    "topSignals": []
  },
  {
    "seniorId": "SW015",
    "recordId": "SR01492",
    "age": 65,
    "gender": "Female",
    "bloodType": "B-",
    "medicalCondition": "Arthritis",
    "medicationName": "Aspirin",
    "testResult": "Inconclusive",
    "admissionType": "Emergency",
    "admissionDate": "2022-01-06",
    "dischargeDate": "2022-01-22",
    "lengthOfStayDays": 16,
    "profileOrigin": "source_record_pseudonymized",
    "uniquePersonVerified": false,
    "baseline": {
      "stepsMean": 2864,
      "stepsSd": 402.1,
      "hrMean": 64,
      "hrSd": 2.7,
      "systolicBpMean": 136,
      "systolicBpSd": 6.5,
      "diastolicBpMean": 76,
      "diastolicBpSd": 4.6,
      "establishedDays": 30
    },
    "currentUrgency": "low",
    "currentRiskScore": 15,
    "trend14Days": [
      0,
      0,
      7,
      0,
      19,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      15
    ],
    "recentRiskTrend": [
      12,
      0,
      19,
      7,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      7,
      0,
      19,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      15
    ],
    "adherenceRate": 92,
    "noteCount": 12,
    "noteLanguages": [
      "en"
    ],
    "plantedScenario": null,
    "last30AvgSteps": 2835,
    "last30AvgHr": 65,
    "last30AvgSystolic": 137,
    "last30MissedMeds": 1,
    "recentNotes": [
      {
        "date": "2026-08-25",
        "language": "en",
        "noteText": "I am doing okay today.",
        "inputMode": "simulated_text_not_voice",
        "dataOrigin": "SIMULATED_NOT_OBSERVED"
      },
      {
        "date": "2026-09-01",
        "language": "en",
        "noteText": "I am doing okay today.",
        "inputMode": "simulated_text_not_voice",
        "dataOrigin": "SIMULATED_NOT_OBSERVED"
      },
      {
        "date": "2026-09-08",
        "language": "en",
        "noteText": "I am doing okay today.",
        "inputMode": "simulated_text_not_voice",
        "dataOrigin": "SIMULATED_NOT_OBSERVED"
      },
      {
        "date": "2026-09-15",
        "language": "en",
        "noteText": "I am doing okay today.",
        "inputMode": "simulated_text_not_voice",
        "dataOrigin": "SIMULATED_NOT_OBSERVED"
      },
      {
        "date": "2026-09-22",
        "language": "en",
        "noteText": "I am doing okay today.",
        "inputMode": "simulated_text_not_voice",
        "dataOrigin": "SIMULATED_NOT_OBSERVED"
      }
    ],
    "topSignals": [
      "Elevated HR (72 bpm)"
    ]
  },
  {
    "seniorId": "SW016",
    "recordId": "SR06109",
    "age": 73,
    "gender": "Male",
    "bloodType": "O-",
    "medicalCondition": "Asthma",
    "medicationName": "Lipitor",
    "testResult": "Normal",
    "admissionType": "Elective",
    "admissionDate": "2021-11-19",
    "dischargeDate": "2021-11-23",
    "lengthOfStayDays": 4,
    "profileOrigin": "source_record_pseudonymized",
    "uniquePersonVerified": false,
    "baseline": {
      "stepsMean": 3284,
      "stepsSd": 417.3,
      "hrMean": 80,
      "hrSd": 2.9,
      "systolicBpMean": 132,
      "systolicBpSd": 6,
      "diastolicBpMean": 83,
      "diastolicBpSd": 3.6,
      "establishedDays": 30
    },
    "currentUrgency": "low",
    "currentRiskScore": 0,
    "trend14Days": [
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0
    ],
    "recentRiskTrend": [
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0
    ],
    "adherenceRate": 88,
    "noteCount": 12,
    "noteLanguages": [
      "en"
    ],
    "plantedScenario": null,
    "last30AvgSteps": 3399,
    "last30AvgHr": 80,
    "last30AvgSystolic": 128,
    "last30MissedMeds": 5,
    "recentNotes": [
      {
        "date": "2026-08-25",
        "language": "en",
        "noteText": "I am doing okay today.",
        "inputMode": "simulated_text_not_voice",
        "dataOrigin": "SIMULATED_NOT_OBSERVED"
      },
      {
        "date": "2026-09-01",
        "language": "en",
        "noteText": "I am doing okay today.",
        "inputMode": "simulated_text_not_voice",
        "dataOrigin": "SIMULATED_NOT_OBSERVED"
      },
      {
        "date": "2026-09-08",
        "language": "en",
        "noteText": "I am doing okay today.",
        "inputMode": "simulated_text_not_voice",
        "dataOrigin": "SIMULATED_NOT_OBSERVED"
      },
      {
        "date": "2026-09-15",
        "language": "en",
        "noteText": "I am doing okay today.",
        "inputMode": "simulated_text_not_voice",
        "dataOrigin": "SIMULATED_NOT_OBSERVED"
      },
      {
        "date": "2026-09-22",
        "language": "en",
        "noteText": "I am doing okay today.",
        "inputMode": "simulated_text_not_voice",
        "dataOrigin": "SIMULATED_NOT_OBSERVED"
      }
    ],
    "topSignals": []
  },
  {
    "seniorId": "SW017",
    "recordId": "SR14481",
    "age": 63,
    "gender": "Male",
    "bloodType": "AB+",
    "medicalCondition": "Cancer",
    "medicationName": "Penicillin",
    "testResult": "Abnormal",
    "admissionType": "Emergency",
    "admissionDate": "2020-01-28",
    "dischargeDate": "2020-02-14",
    "lengthOfStayDays": 17,
    "profileOrigin": "source_record_pseudonymized",
    "uniquePersonVerified": false,
    "baseline": {
      "stepsMean": 5753,
      "stepsSd": 375.7,
      "hrMean": 75,
      "hrSd": 3.7,
      "systolicBpMean": 136,
      "systolicBpSd": 5.2,
      "diastolicBpMean": 77,
      "diastolicBpSd": 4.6,
      "establishedDays": 30
    },
    "currentUrgency": "low",
    "currentRiskScore": 0,
    "trend14Days": [
      12,
      12,
      21,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0
    ],
    "recentRiskTrend": [
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      24,
      0,
      0,
      0,
      12,
      12,
      21,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0
    ],
    "adherenceRate": 91,
    "noteCount": 12,
    "noteLanguages": [
      "en"
    ],
    "plantedScenario": null,
    "last30AvgSteps": 5590,
    "last30AvgHr": 75,
    "last30AvgSystolic": 138,
    "last30MissedMeds": 5,
    "recentNotes": [
      {
        "date": "2026-08-25",
        "language": "en",
        "noteText": "I am doing okay today.",
        "inputMode": "simulated_text_not_voice",
        "dataOrigin": "SIMULATED_NOT_OBSERVED"
      },
      {
        "date": "2026-09-01",
        "language": "en",
        "noteText": "I am doing okay today.",
        "inputMode": "simulated_text_not_voice",
        "dataOrigin": "SIMULATED_NOT_OBSERVED"
      },
      {
        "date": "2026-09-08",
        "language": "en",
        "noteText": "I am doing okay today.",
        "inputMode": "simulated_text_not_voice",
        "dataOrigin": "SIMULATED_NOT_OBSERVED"
      },
      {
        "date": "2026-09-15",
        "language": "en",
        "noteText": "I am doing okay today.",
        "inputMode": "simulated_text_not_voice",
        "dataOrigin": "SIMULATED_NOT_OBSERVED"
      },
      {
        "date": "2026-09-22",
        "language": "en",
        "noteText": "I am doing okay today.",
        "inputMode": "simulated_text_not_voice",
        "dataOrigin": "SIMULATED_NOT_OBSERVED"
      }
    ],
    "topSignals": []
  },
  {
    "seniorId": "SW018",
    "recordId": "SR11818",
    "age": 73,
    "gender": "Female",
    "bloodType": "O+",
    "medicalCondition": "Hypertension",
    "medicationName": "Penicillin",
    "testResult": "Inconclusive",
    "admissionType": "Urgent",
    "admissionDate": "2022-04-06",
    "dischargeDate": "2022-04-08",
    "lengthOfStayDays": 2,
    "profileOrigin": "source_record_pseudonymized",
    "uniquePersonVerified": false,
    "baseline": {
      "stepsMean": 2792,
      "stepsSd": 497.4,
      "hrMean": 79,
      "hrSd": 2.8,
      "systolicBpMean": 133,
      "systolicBpSd": 5.6,
      "diastolicBpMean": 80,
      "diastolicBpSd": 4.7,
      "establishedDays": 30
    },
    "currentUrgency": "low",
    "currentRiskScore": 0,
    "trend14Days": [
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0
    ],
    "recentRiskTrend": [
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0
    ],
    "adherenceRate": 91,
    "noteCount": 12,
    "noteLanguages": [
      "en"
    ],
    "plantedScenario": null,
    "last30AvgSteps": 2804,
    "last30AvgHr": 79,
    "last30AvgSystolic": 135,
    "last30MissedMeds": 2,
    "recentNotes": [
      {
        "date": "2026-08-25",
        "language": "en",
        "noteText": "I am doing okay today.",
        "inputMode": "simulated_text_not_voice",
        "dataOrigin": "SIMULATED_NOT_OBSERVED"
      },
      {
        "date": "2026-09-01",
        "language": "en",
        "noteText": "I am doing okay today.",
        "inputMode": "simulated_text_not_voice",
        "dataOrigin": "SIMULATED_NOT_OBSERVED"
      },
      {
        "date": "2026-09-08",
        "language": "en",
        "noteText": "I am doing okay today.",
        "inputMode": "simulated_text_not_voice",
        "dataOrigin": "SIMULATED_NOT_OBSERVED"
      },
      {
        "date": "2026-09-15",
        "language": "en",
        "noteText": "I am doing okay today.",
        "inputMode": "simulated_text_not_voice",
        "dataOrigin": "SIMULATED_NOT_OBSERVED"
      },
      {
        "date": "2026-09-22",
        "language": "en",
        "noteText": "I am doing okay today.",
        "inputMode": "simulated_text_not_voice",
        "dataOrigin": "SIMULATED_NOT_OBSERVED"
      }
    ],
    "topSignals": []
  },
  {
    "seniorId": "SW019",
    "recordId": "SR15173",
    "age": 75,
    "gender": "Female",
    "bloodType": "B-",
    "medicalCondition": "Arthritis",
    "medicationName": "Penicillin",
    "testResult": "Inconclusive",
    "admissionType": "Emergency",
    "admissionDate": "2023-04-27",
    "dischargeDate": "2023-05-13",
    "lengthOfStayDays": 16,
    "profileOrigin": "source_record_pseudonymized",
    "uniquePersonVerified": false,
    "baseline": {
      "stepsMean": 3673,
      "stepsSd": 459.8,
      "hrMean": 67,
      "hrSd": 3,
      "systolicBpMean": 131,
      "systolicBpSd": 6.5,
      "diastolicBpMean": 64,
      "diastolicBpSd": 3.6,
      "establishedDays": 30
    },
    "currentUrgency": "low",
    "currentRiskScore": 0,
    "trend14Days": [
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0
    ],
    "recentRiskTrend": [
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      15,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0
    ],
    "adherenceRate": 90,
    "noteCount": 12,
    "noteLanguages": [
      "en"
    ],
    "plantedScenario": null,
    "last30AvgSteps": 3779,
    "last30AvgHr": 66,
    "last30AvgSystolic": 132,
    "last30MissedMeds": 5,
    "recentNotes": [
      {
        "date": "2026-08-25",
        "language": "en",
        "noteText": "I am doing okay today.",
        "inputMode": "simulated_text_not_voice",
        "dataOrigin": "SIMULATED_NOT_OBSERVED"
      },
      {
        "date": "2026-09-01",
        "language": "en",
        "noteText": "I am doing okay today.",
        "inputMode": "simulated_text_not_voice",
        "dataOrigin": "SIMULATED_NOT_OBSERVED"
      },
      {
        "date": "2026-09-08",
        "language": "en",
        "noteText": "I am doing okay today.",
        "inputMode": "simulated_text_not_voice",
        "dataOrigin": "SIMULATED_NOT_OBSERVED"
      },
      {
        "date": "2026-09-15",
        "language": "en",
        "noteText": "I am doing okay today.",
        "inputMode": "simulated_text_not_voice",
        "dataOrigin": "SIMULATED_NOT_OBSERVED"
      },
      {
        "date": "2026-09-22",
        "language": "en",
        "noteText": "I am doing okay today.",
        "inputMode": "simulated_text_not_voice",
        "dataOrigin": "SIMULATED_NOT_OBSERVED"
      }
    ],
    "topSignals": []
  },
  {
    "seniorId": "SW020",
    "recordId": "SR06334",
    "age": 64,
    "gender": "Female",
    "bloodType": "O+",
    "medicalCondition": "Diabetes",
    "medicationName": "Lipitor",
    "testResult": "Abnormal",
    "admissionType": "Emergency",
    "admissionDate": "2020-01-04",
    "dischargeDate": "2020-02-02",
    "lengthOfStayDays": 29,
    "profileOrigin": "source_record_pseudonymized",
    "uniquePersonVerified": false,
    "baseline": {
      "stepsMean": 3710,
      "stepsSd": 481.2,
      "hrMean": 79,
      "hrSd": 3.3,
      "systolicBpMean": 123,
      "systolicBpSd": 5.8,
      "diastolicBpMean": 82,
      "diastolicBpSd": 4.5,
      "establishedDays": 30
    },
    "currentUrgency": "low",
    "currentRiskScore": 9,
    "trend14Days": [
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      9
    ],
    "recentRiskTrend": [
      0,
      0,
      0,
      0,
      0,
      12,
      12,
      31,
      12,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      9
    ],
    "adherenceRate": 89,
    "noteCount": 12,
    "noteLanguages": [
      "en"
    ],
    "plantedScenario": null,
    "last30AvgSteps": 3816,
    "last30AvgHr": 80,
    "last30AvgSystolic": 123,
    "last30MissedMeds": 6,
    "recentNotes": [
      {
        "date": "2026-08-25",
        "language": "en",
        "noteText": "I am doing okay today.",
        "inputMode": "simulated_text_not_voice",
        "dataOrigin": "SIMULATED_NOT_OBSERVED"
      },
      {
        "date": "2026-09-01",
        "language": "en",
        "noteText": "I am doing okay today.",
        "inputMode": "simulated_text_not_voice",
        "dataOrigin": "SIMULATED_NOT_OBSERVED"
      },
      {
        "date": "2026-09-08",
        "language": "en",
        "noteText": "I am doing okay today.",
        "inputMode": "simulated_text_not_voice",
        "dataOrigin": "SIMULATED_NOT_OBSERVED"
      },
      {
        "date": "2026-09-15",
        "language": "en",
        "noteText": "I am doing okay today.",
        "inputMode": "simulated_text_not_voice",
        "dataOrigin": "SIMULATED_NOT_OBSERVED"
      },
      {
        "date": "2026-09-22",
        "language": "en",
        "noteText": "I am doing okay today.",
        "inputMode": "simulated_text_not_voice",
        "dataOrigin": "SIMULATED_NOT_OBSERVED"
      }
    ],
    "topSignals": [
      "Elevated HR (87 bpm)"
    ]
  }
];

export const COHORT_OBSERVATIONS_MAP: Record<string, CohortDayRecord[]> = {
  "SW001": [
    {
      "date": "2026-07-01",
      "dayIndex": 1,
      "steps": 5060,
      "hrBpm": 76,
      "systolicBp": 120,
      "diastolicBp": 79,
      "medStatus": "unconfirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-07-02",
      "dayIndex": 2,
      "steps": 5641,
      "hrBpm": 75,
      "systolicBp": 118,
      "diastolicBp": 75,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-07-03",
      "dayIndex": 3,
      "steps": 5257,
      "hrBpm": 73,
      "systolicBp": 122,
      "diastolicBp": 80,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-07-04",
      "dayIndex": 4,
      "steps": 6318,
      "hrBpm": 72,
      "systolicBp": 121,
      "diastolicBp": 80,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-07-05",
      "dayIndex": 5,
      "steps": 5405,
      "hrBpm": 70,
      "systolicBp": 116,
      "diastolicBp": 81,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-07-06",
      "dayIndex": 6,
      "steps": 5262,
      "hrBpm": 74,
      "systolicBp": 111,
      "diastolicBp": 79,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-07-07",
      "dayIndex": 7,
      "steps": 5472,
      "hrBpm": 72,
      "systolicBp": 115,
      "diastolicBp": 76,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-07-08",
      "dayIndex": 8,
      "steps": 5247,
      "hrBpm": 75,
      "systolicBp": 105,
      "diastolicBp": 78,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-07-09",
      "dayIndex": 9,
      "steps": 4828,
      "hrBpm": 70,
      "systolicBp": 114,
      "diastolicBp": 82,
      "medStatus": "unconfirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-07-10",
      "dayIndex": 10,
      "steps": 5406,
      "hrBpm": 74,
      "systolicBp": 110,
      "diastolicBp": 75,
      "medStatus": "unconfirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-07-11",
      "dayIndex": 11,
      "steps": 5438,
      "hrBpm": 71,
      "systolicBp": 120,
      "diastolicBp": 77,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-07-12",
      "dayIndex": 12,
      "steps": 5713,
      "hrBpm": 72,
      "systolicBp": 107,
      "diastolicBp": 82,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-07-13",
      "dayIndex": 13,
      "steps": 5416,
      "hrBpm": 76,
      "systolicBp": 111,
      "diastolicBp": 69,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-07-14",
      "dayIndex": 14,
      "steps": 5446,
      "hrBpm": 73,
      "systolicBp": 116,
      "diastolicBp": 82,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-07-15",
      "dayIndex": 15,
      "steps": 5483,
      "hrBpm": 74,
      "systolicBp": 112,
      "diastolicBp": 77,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-07-16",
      "dayIndex": 16,
      "steps": 5516,
      "hrBpm": 70,
      "systolicBp": 103,
      "diastolicBp": 73,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-07-17",
      "dayIndex": 17,
      "steps": 5648,
      "hrBpm": 73,
      "systolicBp": 122,
      "diastolicBp": 79,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-07-18",
      "dayIndex": 18,
      "steps": 5580,
      "hrBpm": 73,
      "systolicBp": 97,
      "diastolicBp": 75,
      "medStatus": "unconfirmed",
      "riskScore": 15,
      "signals": [
        "BP drop (97 mmHg)"
      ]
    },
    {
      "date": "2026-07-19",
      "dayIndex": 19,
      "steps": 5493,
      "hrBpm": 72,
      "systolicBp": 122,
      "diastolicBp": 79,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-07-20",
      "dayIndex": 20,
      "steps": 5528,
      "hrBpm": 77,
      "systolicBp": 120,
      "diastolicBp": 82,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-07-21",
      "dayIndex": 21,
      "steps": 5545,
      "hrBpm": 72,
      "systolicBp": 116,
      "diastolicBp": 73,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-07-22",
      "dayIndex": 22,
      "steps": 6383,
      "hrBpm": 75,
      "systolicBp": 120,
      "diastolicBp": 78,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-07-23",
      "dayIndex": 23,
      "steps": 5030,
      "hrBpm": 72,
      "systolicBp": 113,
      "diastolicBp": 79,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-07-24",
      "dayIndex": 24,
      "steps": 4996,
      "hrBpm": 74,
      "systolicBp": 113,
      "diastolicBp": 71,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-07-25",
      "dayIndex": 25,
      "steps": 5596,
      "hrBpm": 76,
      "systolicBp": 112,
      "diastolicBp": 73,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-07-26",
      "dayIndex": 26,
      "steps": 5645,
      "hrBpm": 76,
      "systolicBp": 106,
      "diastolicBp": 85,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-07-27",
      "dayIndex": 27,
      "steps": 5919,
      "hrBpm": 64,
      "systolicBp": 110,
      "diastolicBp": 82,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-07-28",
      "dayIndex": 28,
      "steps": 6074,
      "hrBpm": 73,
      "systolicBp": 109,
      "diastolicBp": 80,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-07-29",
      "dayIndex": 29,
      "steps": 5313,
      "hrBpm": 73,
      "systolicBp": 112,
      "diastolicBp": 77,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-07-30",
      "dayIndex": 30,
      "steps": 5433,
      "hrBpm": 76,
      "systolicBp": 121,
      "diastolicBp": 82,
      "medStatus": "unconfirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-07-31",
      "dayIndex": 31,
      "steps": 6073,
      "hrBpm": 74,
      "systolicBp": 119,
      "diastolicBp": 80,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-08-01",
      "dayIndex": 32,
      "steps": 5630,
      "hrBpm": 74,
      "systolicBp": 116,
      "diastolicBp": 81,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-08-02",
      "dayIndex": 33,
      "steps": 5560,
      "hrBpm": 72,
      "systolicBp": 110,
      "diastolicBp": 80,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-08-03",
      "dayIndex": 34,
      "steps": 5181,
      "hrBpm": 81,
      "systolicBp": 109,
      "diastolicBp": 82,
      "medStatus": "unconfirmed",
      "riskScore": 17,
      "signals": [
        "Elevated HR (81 bpm)"
      ]
    },
    {
      "date": "2026-08-04",
      "dayIndex": 35,
      "steps": 5110,
      "hrBpm": 73,
      "systolicBp": 117,
      "diastolicBp": 88,
      "medStatus": "unconfirmed",
      "riskScore": 12,
      "signals": [
        "3 unconfirmed meds this week"
      ]
    },
    {
      "date": "2026-08-05",
      "dayIndex": 36,
      "steps": 5318,
      "hrBpm": 76,
      "systolicBp": 110,
      "diastolicBp": 79,
      "medStatus": "confirmed",
      "riskScore": 12,
      "signals": [
        "3 unconfirmed meds this week"
      ]
    },
    {
      "date": "2026-08-06",
      "dayIndex": 37,
      "steps": 5187,
      "hrBpm": 75,
      "systolicBp": 114,
      "diastolicBp": 76,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-08-07",
      "dayIndex": 38,
      "steps": 5031,
      "hrBpm": 73,
      "systolicBp": 114,
      "diastolicBp": 74,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-08-08",
      "dayIndex": 39,
      "steps": 5804,
      "hrBpm": 77,
      "systolicBp": 109,
      "diastolicBp": 80,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-08-09",
      "dayIndex": 40,
      "steps": 5394,
      "hrBpm": 77,
      "systolicBp": 118,
      "diastolicBp": 80,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-08-10",
      "dayIndex": 41,
      "steps": 5563,
      "hrBpm": 75,
      "systolicBp": 119,
      "diastolicBp": 80,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-08-11",
      "dayIndex": 42,
      "steps": 5244,
      "hrBpm": 73,
      "systolicBp": 120,
      "diastolicBp": 76,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-08-12",
      "dayIndex": 43,
      "steps": 4966,
      "hrBpm": 71,
      "systolicBp": 118,
      "diastolicBp": 74,
      "medStatus": "unconfirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-08-13",
      "dayIndex": 44,
      "steps": 5287,
      "hrBpm": 75,
      "systolicBp": 105,
      "diastolicBp": 77,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-08-14",
      "dayIndex": 45,
      "steps": 5733,
      "hrBpm": 75,
      "systolicBp": 113,
      "diastolicBp": 83,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-08-15",
      "dayIndex": 46,
      "steps": 4113,
      "hrBpm": 72,
      "systolicBp": 114,
      "diastolicBp": 83,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-08-16",
      "dayIndex": 47,
      "steps": 5541,
      "hrBpm": 77,
      "systolicBp": 119,
      "diastolicBp": 85,
      "medStatus": "unconfirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-08-17",
      "dayIndex": 48,
      "steps": 5789,
      "hrBpm": 72,
      "systolicBp": 119,
      "diastolicBp": 83,
      "medStatus": "unconfirmed",
      "riskScore": 12,
      "signals": [
        "3 unconfirmed meds this week"
      ]
    },
    {
      "date": "2026-08-18",
      "dayIndex": 49,
      "steps": 6145,
      "hrBpm": 76,
      "systolicBp": 109,
      "diastolicBp": 85,
      "medStatus": "confirmed",
      "riskScore": 12,
      "signals": [
        "3 unconfirmed meds this week"
      ]
    },
    {
      "date": "2026-08-19",
      "dayIndex": 50,
      "steps": 5763,
      "hrBpm": 70,
      "systolicBp": 111,
      "diastolicBp": 79,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-08-20",
      "dayIndex": 51,
      "steps": 6025,
      "hrBpm": 71,
      "systolicBp": 114,
      "diastolicBp": 78,
      "medStatus": "unconfirmed",
      "riskScore": 12,
      "signals": [
        "3 unconfirmed meds this week"
      ]
    },
    {
      "date": "2026-08-21",
      "dayIndex": 52,
      "steps": 5607,
      "hrBpm": 74,
      "systolicBp": 118,
      "diastolicBp": 79,
      "medStatus": "confirmed",
      "riskScore": 12,
      "signals": [
        "3 unconfirmed meds this week"
      ]
    },
    {
      "date": "2026-08-22",
      "dayIndex": 53,
      "steps": 5115,
      "hrBpm": 68,
      "systolicBp": 118,
      "diastolicBp": 79,
      "medStatus": "confirmed",
      "riskScore": 12,
      "signals": [
        "3 unconfirmed meds this week"
      ]
    },
    {
      "date": "2026-08-23",
      "dayIndex": 54,
      "steps": 6252,
      "hrBpm": 75,
      "systolicBp": 120,
      "diastolicBp": 82,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-08-24",
      "dayIndex": 55,
      "steps": 5486,
      "hrBpm": 73,
      "systolicBp": 116,
      "diastolicBp": 82,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-08-25",
      "dayIndex": 56,
      "steps": 5169,
      "hrBpm": 74,
      "systolicBp": 107,
      "diastolicBp": 75,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-08-26",
      "dayIndex": 57,
      "steps": 4850,
      "hrBpm": 79,
      "systolicBp": 114,
      "diastolicBp": 82,
      "medStatus": "confirmed",
      "riskScore": 9,
      "signals": [
        "Elevated HR (79 bpm)"
      ]
    },
    {
      "date": "2026-08-27",
      "dayIndex": 58,
      "steps": 5497,
      "hrBpm": 69,
      "systolicBp": 104,
      "diastolicBp": 80,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-08-28",
      "dayIndex": 59,
      "steps": 4890,
      "hrBpm": 73,
      "systolicBp": 107,
      "diastolicBp": 83,
      "medStatus": "unconfirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-08-29",
      "dayIndex": 60,
      "steps": 5406,
      "hrBpm": 74,
      "systolicBp": 109,
      "diastolicBp": 77,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-08-30",
      "dayIndex": 61,
      "steps": 5781,
      "hrBpm": 76,
      "systolicBp": 98,
      "diastolicBp": 77,
      "medStatus": "confirmed",
      "riskScore": 15,
      "signals": [
        "BP drop (98 mmHg)"
      ]
    },
    {
      "date": "2026-08-31",
      "dayIndex": 62,
      "steps": 6084,
      "hrBpm": 71,
      "systolicBp": 114,
      "diastolicBp": 82,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-09-01",
      "dayIndex": 63,
      "steps": 4949,
      "hrBpm": 77,
      "systolicBp": 122,
      "diastolicBp": 84,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-09-02",
      "dayIndex": 64,
      "steps": 5653,
      "hrBpm": 78,
      "systolicBp": 117,
      "diastolicBp": 87,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-09-03",
      "dayIndex": 65,
      "steps": 5250,
      "hrBpm": 73,
      "systolicBp": 107,
      "diastolicBp": 76,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-09-04",
      "dayIndex": 66,
      "steps": 5891,
      "hrBpm": 73,
      "systolicBp": 113,
      "diastolicBp": 78,
      "medStatus": "unconfirmed",
      "riskScore": 10,
      "signals": [
        "Reported fatigue / low activity"
      ]
    },
    {
      "date": "2026-09-05",
      "dayIndex": 67,
      "steps": 4667,
      "hrBpm": 75,
      "systolicBp": 110,
      "diastolicBp": 85,
      "medStatus": "unconfirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-09-06",
      "dayIndex": 68,
      "steps": 4565,
      "hrBpm": 76,
      "systolicBp": 128,
      "diastolicBp": 85,
      "medStatus": "confirmed",
      "riskScore": 11,
      "signals": [
        "Elevated BP (128 mmHg, +2.3 SD)"
      ]
    },
    {
      "date": "2026-09-07",
      "dayIndex": 69,
      "steps": 4365,
      "hrBpm": 71,
      "systolicBp": 115,
      "diastolicBp": 74,
      "medStatus": "confirmed",
      "riskScore": 10,
      "signals": [
        "Reported fatigue / low activity"
      ]
    },
    {
      "date": "2026-09-08",
      "dayIndex": 70,
      "steps": 4728,
      "hrBpm": 78,
      "systolicBp": 118,
      "diastolicBp": 80,
      "medStatus": "unconfirmed",
      "riskScore": 22,
      "signals": [
        "3 unconfirmed meds this week",
        "Reported fatigue / low activity"
      ]
    },
    {
      "date": "2026-09-09",
      "dayIndex": 71,
      "steps": 4932,
      "hrBpm": 77,
      "systolicBp": 109,
      "diastolicBp": 72,
      "medStatus": "confirmed",
      "riskScore": 12,
      "signals": [
        "3 unconfirmed meds this week"
      ]
    },
    {
      "date": "2026-09-10",
      "dayIndex": 72,
      "steps": 4098,
      "hrBpm": 74,
      "systolicBp": 112,
      "diastolicBp": 88,
      "medStatus": "confirmed",
      "riskScore": 22,
      "signals": [
        "3 unconfirmed meds this week",
        "Reported fatigue / low activity"
      ]
    },
    {
      "date": "2026-09-11",
      "dayIndex": 73,
      "steps": 5201,
      "hrBpm": 80,
      "systolicBp": 116,
      "diastolicBp": 83,
      "medStatus": "confirmed",
      "riskScore": 13,
      "signals": [
        "Elevated HR (80 bpm)"
      ]
    },
    {
      "date": "2026-09-12",
      "dayIndex": 74,
      "steps": 4916,
      "hrBpm": 71,
      "systolicBp": 118,
      "diastolicBp": 79,
      "medStatus": "unconfirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-09-13",
      "dayIndex": 75,
      "steps": 5068,
      "hrBpm": 77,
      "systolicBp": 114,
      "diastolicBp": 83,
      "medStatus": "confirmed",
      "riskScore": 10,
      "signals": [
        "Reported fatigue / low activity"
      ]
    },
    {
      "date": "2026-09-14",
      "dayIndex": 76,
      "steps": 4245,
      "hrBpm": 77,
      "systolicBp": 117,
      "diastolicBp": 76,
      "medStatus": "unconfirmed",
      "riskScore": 12,
      "signals": [
        "3 unconfirmed meds this week"
      ]
    },
    {
      "date": "2026-09-15",
      "dayIndex": 77,
      "steps": 3849,
      "hrBpm": 85,
      "systolicBp": 120,
      "diastolicBp": 82,
      "medStatus": "confirmed",
      "riskScore": 30,
      "signals": [
        "Elevated HR (85 bpm)",
        "Reported fatigue / low activity"
      ]
    },
    {
      "date": "2026-09-16",
      "dayIndex": 78,
      "steps": 3662,
      "hrBpm": 77,
      "systolicBp": 120,
      "diastolicBp": 83,
      "medStatus": "unconfirmed",
      "riskScore": 22,
      "signals": [
        "3 unconfirmed meds this week",
        "Reported fatigue / low activity"
      ]
    },
    {
      "date": "2026-09-17",
      "dayIndex": 79,
      "steps": 5037,
      "hrBpm": 80,
      "systolicBp": 122,
      "diastolicBp": 74,
      "medStatus": "confirmed",
      "riskScore": 25,
      "signals": [
        "Elevated HR (80 bpm)",
        "3 unconfirmed meds this week"
      ]
    },
    {
      "date": "2026-09-18",
      "dayIndex": 80,
      "steps": 3484,
      "hrBpm": 84,
      "systolicBp": 112,
      "diastolicBp": 82,
      "medStatus": "confirmed",
      "riskScore": 45,
      "signals": [
        "Elevated HR (84 bpm)",
        "Activity reduced (-37% steps)",
        "3 unconfirmed meds this week"
      ]
    },
    {
      "date": "2026-09-19",
      "dayIndex": 81,
      "steps": 3454,
      "hrBpm": 82,
      "systolicBp": 125,
      "diastolicBp": 75,
      "medStatus": "confirmed",
      "riskScore": 43,
      "signals": [
        "Elevated HR (82 bpm)",
        "Activity reduced (-37% steps)",
        "Reported fatigue / low activity"
      ]
    },
    {
      "date": "2026-09-20",
      "dayIndex": 82,
      "steps": 4519,
      "hrBpm": 76,
      "systolicBp": 115,
      "diastolicBp": 76,
      "medStatus": "unconfirmed",
      "riskScore": 12,
      "signals": [
        "3 unconfirmed meds this week"
      ]
    },
    {
      "date": "2026-09-21",
      "dayIndex": 83,
      "steps": 3833,
      "hrBpm": 79,
      "systolicBp": 111,
      "diastolicBp": 70,
      "medStatus": "confirmed",
      "riskScore": 9,
      "signals": [
        "Elevated HR (79 bpm)"
      ]
    },
    {
      "date": "2026-09-22",
      "dayIndex": 84,
      "steps": 3694,
      "hrBpm": 79,
      "systolicBp": 120,
      "diastolicBp": 75,
      "medStatus": "unconfirmed",
      "riskScore": 31,
      "signals": [
        "Elevated HR (79 bpm)",
        "3 unconfirmed meds this week",
        "Reported fatigue / low activity"
      ]
    },
    {
      "date": "2026-09-23",
      "dayIndex": 85,
      "steps": 3325,
      "hrBpm": 77,
      "systolicBp": 108,
      "diastolicBp": 81,
      "medStatus": "confirmed",
      "riskScore": 14,
      "signals": [
        "Activity reduced (-40% steps)"
      ]
    },
    {
      "date": "2026-09-24",
      "dayIndex": 86,
      "steps": 4282,
      "hrBpm": 82,
      "systolicBp": 114,
      "diastolicBp": 83,
      "medStatus": "unconfirmed",
      "riskScore": 32,
      "signals": [
        "Elevated HR (82 bpm)",
        "3 unconfirmed meds this week"
      ]
    },
    {
      "date": "2026-09-25",
      "dayIndex": 87,
      "steps": 2951,
      "hrBpm": 76,
      "systolicBp": 116,
      "diastolicBp": 78,
      "medStatus": "confirmed",
      "riskScore": 38,
      "signals": [
        "Activity reduced (-46% steps)",
        "3 unconfirmed meds this week",
        "Reported fatigue / low activity"
      ]
    },
    {
      "date": "2026-09-26",
      "dayIndex": 88,
      "steps": 2561,
      "hrBpm": 76,
      "systolicBp": 128,
      "diastolicBp": 72,
      "medStatus": "confirmed",
      "riskScore": 42,
      "signals": [
        "Elevated BP (128 mmHg, +2.3 SD)",
        "Activity reduced (-53% steps)",
        "3 unconfirmed meds this week"
      ]
    },
    {
      "date": "2026-09-27",
      "dayIndex": 89,
      "steps": 3574,
      "hrBpm": 74,
      "systolicBp": 117,
      "diastolicBp": 74,
      "medStatus": "confirmed",
      "riskScore": 12,
      "signals": [
        "Activity reduced (-35% steps)"
      ]
    },
    {
      "date": "2026-09-28",
      "dayIndex": 90,
      "steps": 3365,
      "hrBpm": 77,
      "systolicBp": 115,
      "diastolicBp": 87,
      "medStatus": "unconfirmed",
      "riskScore": 36,
      "signals": [
        "Activity reduced (-39% steps)",
        "3 unconfirmed meds this week",
        "Reported fatigue / low activity"
      ]
    }
  ],
  "SW002": [
    {
      "date": "2026-07-01",
      "dayIndex": 1,
      "steps": 5031,
      "hrBpm": 90,
      "systolicBp": 118,
      "diastolicBp": 79,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-07-02",
      "dayIndex": 2,
      "steps": 5335,
      "hrBpm": 85,
      "systolicBp": 124,
      "diastolicBp": 84,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-07-03",
      "dayIndex": 3,
      "steps": 6106,
      "hrBpm": 83,
      "systolicBp": 116,
      "diastolicBp": 78,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-07-04",
      "dayIndex": 4,
      "steps": 4814,
      "hrBpm": 89,
      "systolicBp": 115,
      "diastolicBp": 84,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-07-05",
      "dayIndex": 5,
      "steps": 5654,
      "hrBpm": 90,
      "systolicBp": 103,
      "diastolicBp": 86,
      "medStatus": "confirmed",
      "riskScore": 15,
      "signals": [
        "BP drop (103 mmHg)"
      ]
    },
    {
      "date": "2026-07-06",
      "dayIndex": 6,
      "steps": 5881,
      "hrBpm": 80,
      "systolicBp": 117,
      "diastolicBp": 82,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-07-07",
      "dayIndex": 7,
      "steps": 5429,
      "hrBpm": 85,
      "systolicBp": 120,
      "diastolicBp": 87,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-07-08",
      "dayIndex": 8,
      "steps": 5040,
      "hrBpm": 83,
      "systolicBp": 115,
      "diastolicBp": 91,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-07-09",
      "dayIndex": 9,
      "steps": 5542,
      "hrBpm": 87,
      "systolicBp": 99,
      "diastolicBp": 84,
      "medStatus": "unconfirmed",
      "riskScore": 15,
      "signals": [
        "BP drop (99 mmHg)"
      ]
    },
    {
      "date": "2026-07-10",
      "dayIndex": 10,
      "steps": 6004,
      "hrBpm": 91,
      "systolicBp": 111,
      "diastolicBp": 85,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-07-11",
      "dayIndex": 11,
      "steps": 5886,
      "hrBpm": 82,
      "systolicBp": 110,
      "diastolicBp": 87,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-07-12",
      "dayIndex": 12,
      "steps": 4509,
      "hrBpm": 85,
      "systolicBp": 117,
      "diastolicBp": 80,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-07-13",
      "dayIndex": 13,
      "steps": 5917,
      "hrBpm": 80,
      "systolicBp": 109,
      "diastolicBp": 80,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-07-14",
      "dayIndex": 14,
      "steps": 5208,
      "hrBpm": 86,
      "systolicBp": 122,
      "diastolicBp": 78,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-07-15",
      "dayIndex": 15,
      "steps": 5471,
      "hrBpm": 86,
      "systolicBp": 126,
      "diastolicBp": 83,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-07-16",
      "dayIndex": 16,
      "steps": 5620,
      "hrBpm": 89,
      "systolicBp": 121,
      "diastolicBp": 83,
      "medStatus": "unconfirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-07-17",
      "dayIndex": 17,
      "steps": 5549,
      "hrBpm": 82,
      "systolicBp": 117,
      "diastolicBp": 78,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-07-18",
      "dayIndex": 18,
      "steps": 5721,
      "hrBpm": 84,
      "systolicBp": 113,
      "diastolicBp": 87,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-07-19",
      "dayIndex": 19,
      "steps": 6009,
      "hrBpm": 84,
      "systolicBp": 125,
      "diastolicBp": 90,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-07-20",
      "dayIndex": 20,
      "steps": 5387,
      "hrBpm": 81,
      "systolicBp": 116,
      "diastolicBp": 89,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-07-21",
      "dayIndex": 21,
      "steps": 6175,
      "hrBpm": 83,
      "systolicBp": 110,
      "diastolicBp": 84,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-07-22",
      "dayIndex": 22,
      "steps": 5821,
      "hrBpm": 81,
      "systolicBp": 123,
      "diastolicBp": 89,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-07-23",
      "dayIndex": 23,
      "steps": 6250,
      "hrBpm": 82,
      "systolicBp": 120,
      "diastolicBp": 78,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-07-24",
      "dayIndex": 24,
      "steps": 5490,
      "hrBpm": 86,
      "systolicBp": 112,
      "diastolicBp": 85,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-07-25",
      "dayIndex": 25,
      "steps": 5166,
      "hrBpm": 87,
      "systolicBp": 112,
      "diastolicBp": 88,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-07-26",
      "dayIndex": 26,
      "steps": 4910,
      "hrBpm": 85,
      "systolicBp": 111,
      "diastolicBp": 82,
      "medStatus": "unconfirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-07-27",
      "dayIndex": 27,
      "steps": 5230,
      "hrBpm": 88,
      "systolicBp": 112,
      "diastolicBp": 86,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-07-28",
      "dayIndex": 28,
      "steps": 6264,
      "hrBpm": 84,
      "systolicBp": 128,
      "diastolicBp": 85,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-07-29",
      "dayIndex": 29,
      "steps": 5205,
      "hrBpm": 82,
      "systolicBp": 117,
      "diastolicBp": 83,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-07-30",
      "dayIndex": 30,
      "steps": 5509,
      "hrBpm": 84,
      "systolicBp": 116,
      "diastolicBp": 87,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-07-31",
      "dayIndex": 31,
      "steps": 6125,
      "hrBpm": 81,
      "systolicBp": 115,
      "diastolicBp": 77,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-08-01",
      "dayIndex": 32,
      "steps": 5966,
      "hrBpm": 82,
      "systolicBp": 116,
      "diastolicBp": 84,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-08-02",
      "dayIndex": 33,
      "steps": 5577,
      "hrBpm": 80,
      "systolicBp": 120,
      "diastolicBp": 82,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-08-03",
      "dayIndex": 34,
      "steps": 6038,
      "hrBpm": 86,
      "systolicBp": 118,
      "diastolicBp": 78,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-08-04",
      "dayIndex": 35,
      "steps": 5673,
      "hrBpm": 82,
      "systolicBp": 124,
      "diastolicBp": 81,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-08-05",
      "dayIndex": 36,
      "steps": 5484,
      "hrBpm": 83,
      "systolicBp": 121,
      "diastolicBp": 84,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-08-06",
      "dayIndex": 37,
      "steps": 5457,
      "hrBpm": 84,
      "systolicBp": 111,
      "diastolicBp": 81,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-08-07",
      "dayIndex": 38,
      "steps": 5624,
      "hrBpm": 83,
      "systolicBp": 110,
      "diastolicBp": 82,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-08-08",
      "dayIndex": 39,
      "steps": 5819,
      "hrBpm": 85,
      "systolicBp": 107,
      "diastolicBp": 86,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-08-09",
      "dayIndex": 40,
      "steps": 6011,
      "hrBpm": 83,
      "systolicBp": 124,
      "diastolicBp": 84,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-08-10",
      "dayIndex": 41,
      "steps": 5131,
      "hrBpm": 84,
      "systolicBp": 109,
      "diastolicBp": 77,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-08-11",
      "dayIndex": 42,
      "steps": 5304,
      "hrBpm": 88,
      "systolicBp": 116,
      "diastolicBp": 87,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-08-12",
      "dayIndex": 43,
      "steps": 5451,
      "hrBpm": 82,
      "systolicBp": 120,
      "diastolicBp": 89,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-08-13",
      "dayIndex": 44,
      "steps": 5806,
      "hrBpm": 86,
      "systolicBp": 105,
      "diastolicBp": 88,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-08-14",
      "dayIndex": 45,
      "steps": 6094,
      "hrBpm": 84,
      "systolicBp": 114,
      "diastolicBp": 85,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-08-15",
      "dayIndex": 46,
      "steps": 5885,
      "hrBpm": 88,
      "systolicBp": 117,
      "diastolicBp": 87,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-08-16",
      "dayIndex": 47,
      "steps": 5214,
      "hrBpm": 82,
      "systolicBp": 119,
      "diastolicBp": 88,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-08-17",
      "dayIndex": 48,
      "steps": 5258,
      "hrBpm": 80,
      "systolicBp": 110,
      "diastolicBp": 84,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-08-18",
      "dayIndex": 49,
      "steps": 5502,
      "hrBpm": 86,
      "systolicBp": 113,
      "diastolicBp": 82,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-08-19",
      "dayIndex": 50,
      "steps": 5886,
      "hrBpm": 80,
      "systolicBp": 108,
      "diastolicBp": 87,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-08-20",
      "dayIndex": 51,
      "steps": 5120,
      "hrBpm": 80,
      "systolicBp": 108,
      "diastolicBp": 85,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-08-21",
      "dayIndex": 52,
      "steps": 5272,
      "hrBpm": 84,
      "systolicBp": 107,
      "diastolicBp": 86,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-08-22",
      "dayIndex": 53,
      "steps": 5688,
      "hrBpm": 87,
      "systolicBp": 114,
      "diastolicBp": 79,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-08-23",
      "dayIndex": 54,
      "steps": 5029,
      "hrBpm": 86,
      "systolicBp": 113,
      "diastolicBp": 77,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-08-24",
      "dayIndex": 55,
      "steps": 5467,
      "hrBpm": 93,
      "systolicBp": 109,
      "diastolicBp": 86,
      "medStatus": "confirmed",
      "riskScore": 12,
      "signals": [
        "Elevated HR (93 bpm)"
      ]
    },
    {
      "date": "2026-08-25",
      "dayIndex": 56,
      "steps": 5832,
      "hrBpm": 86,
      "systolicBp": 117,
      "diastolicBp": 83,
      "medStatus": "unconfirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-08-26",
      "dayIndex": 57,
      "steps": 5463,
      "hrBpm": 91,
      "systolicBp": 117,
      "diastolicBp": 93,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-08-27",
      "dayIndex": 58,
      "steps": 5723,
      "hrBpm": 85,
      "systolicBp": 128,
      "diastolicBp": 82,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-08-28",
      "dayIndex": 59,
      "steps": 5168,
      "hrBpm": 83,
      "systolicBp": 118,
      "diastolicBp": 83,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-08-29",
      "dayIndex": 60,
      "steps": 5698,
      "hrBpm": 86,
      "systolicBp": 108,
      "diastolicBp": 83,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-08-30",
      "dayIndex": 61,
      "steps": 5905,
      "hrBpm": 87,
      "systolicBp": 103,
      "diastolicBp": 85,
      "medStatus": "confirmed",
      "riskScore": 15,
      "signals": [
        "BP drop (103 mmHg)"
      ]
    },
    {
      "date": "2026-08-31",
      "dayIndex": 62,
      "steps": 4997,
      "hrBpm": 83,
      "systolicBp": 113,
      "diastolicBp": 83,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-09-01",
      "dayIndex": 63,
      "steps": 6329,
      "hrBpm": 87,
      "systolicBp": 122,
      "diastolicBp": 82,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-09-02",
      "dayIndex": 64,
      "steps": 5891,
      "hrBpm": 81,
      "systolicBp": 105,
      "diastolicBp": 85,
      "medStatus": "unconfirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-09-03",
      "dayIndex": 65,
      "steps": 5433,
      "hrBpm": 81,
      "systolicBp": 113,
      "diastolicBp": 89,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-09-04",
      "dayIndex": 66,
      "steps": 5686,
      "hrBpm": 83,
      "systolicBp": 119,
      "diastolicBp": 87,
      "medStatus": "unconfirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-09-05",
      "dayIndex": 67,
      "steps": 4990,
      "hrBpm": 84,
      "systolicBp": 120,
      "diastolicBp": 86,
      "medStatus": "unconfirmed",
      "riskScore": 12,
      "signals": [
        "3 unconfirmed meds this week"
      ]
    },
    {
      "date": "2026-09-06",
      "dayIndex": 68,
      "steps": 5666,
      "hrBpm": 84,
      "systolicBp": 120,
      "diastolicBp": 94,
      "medStatus": "unconfirmed",
      "riskScore": 15,
      "signals": [
        "4 unconfirmed meds this week"
      ]
    },
    {
      "date": "2026-09-07",
      "dayIndex": 69,
      "steps": 4882,
      "hrBpm": 83,
      "systolicBp": 114,
      "diastolicBp": 87,
      "medStatus": "confirmed",
      "riskScore": 25,
      "signals": [
        "4 unconfirmed meds this week",
        "Reported fatigue / low activity"
      ]
    },
    {
      "date": "2026-09-08",
      "dayIndex": 70,
      "steps": 5663,
      "hrBpm": 81,
      "systolicBp": 123,
      "diastolicBp": 91,
      "medStatus": "confirmed",
      "riskScore": 25,
      "signals": [
        "4 unconfirmed meds this week",
        "Reported fatigue / low activity"
      ]
    },
    {
      "date": "2026-09-09",
      "dayIndex": 71,
      "steps": 5155,
      "hrBpm": 84,
      "systolicBp": 119,
      "diastolicBp": 83,
      "medStatus": "unconfirmed",
      "riskScore": 15,
      "signals": [
        "4 unconfirmed meds this week"
      ]
    },
    {
      "date": "2026-09-10",
      "dayIndex": 72,
      "steps": 5251,
      "hrBpm": 86,
      "systolicBp": 121,
      "diastolicBp": 88,
      "medStatus": "confirmed",
      "riskScore": 25,
      "signals": [
        "4 unconfirmed meds this week",
        "Reported fatigue / low activity"
      ]
    },
    {
      "date": "2026-09-11",
      "dayIndex": 73,
      "steps": 5374,
      "hrBpm": 88,
      "systolicBp": 131,
      "diastolicBp": 83,
      "medStatus": "confirmed",
      "riskScore": 25,
      "signals": [
        "Elevated BP (131 mmHg, +2.3 SD)",
        "3 unconfirmed meds this week"
      ]
    },
    {
      "date": "2026-09-12",
      "dayIndex": 74,
      "steps": 4364,
      "hrBpm": 90,
      "systolicBp": 127,
      "diastolicBp": 84,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-09-13",
      "dayIndex": 75,
      "steps": 5077,
      "hrBpm": 91,
      "systolicBp": 126,
      "diastolicBp": 87,
      "medStatus": "unconfirmed",
      "riskScore": 10,
      "signals": [
        "Reported fatigue / low activity"
      ]
    },
    {
      "date": "2026-09-14",
      "dayIndex": 76,
      "steps": 3877,
      "hrBpm": 89,
      "systolicBp": 121,
      "diastolicBp": 89,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-09-15",
      "dayIndex": 77,
      "steps": 4924,
      "hrBpm": 85,
      "systolicBp": 124,
      "diastolicBp": 80,
      "medStatus": "confirmed",
      "riskScore": 10,
      "signals": [
        "Reported fatigue / low activity"
      ]
    },
    {
      "date": "2026-09-16",
      "dayIndex": 78,
      "steps": 4306,
      "hrBpm": 85,
      "systolicBp": 113,
      "diastolicBp": 78,
      "medStatus": "confirmed",
      "riskScore": 10,
      "signals": [
        "Reported fatigue / low activity"
      ]
    },
    {
      "date": "2026-09-17",
      "dayIndex": 79,
      "steps": 4645,
      "hrBpm": 88,
      "systolicBp": 125,
      "diastolicBp": 88,
      "medStatus": "unconfirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-09-18",
      "dayIndex": 80,
      "steps": 4476,
      "hrBpm": 90,
      "systolicBp": 127,
      "diastolicBp": 88,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-09-19",
      "dayIndex": 81,
      "steps": 3632,
      "hrBpm": 87,
      "systolicBp": 119,
      "diastolicBp": 85,
      "medStatus": "confirmed",
      "riskScore": 10,
      "signals": [
        "Reported fatigue / low activity"
      ]
    },
    {
      "date": "2026-09-20",
      "dayIndex": 82,
      "steps": 4841,
      "hrBpm": 89,
      "systolicBp": 116,
      "diastolicBp": 80,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-09-21",
      "dayIndex": 83,
      "steps": 4008,
      "hrBpm": 87,
      "systolicBp": 121,
      "diastolicBp": 82,
      "medStatus": "unconfirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-09-22",
      "dayIndex": 84,
      "steps": 3919,
      "hrBpm": 87,
      "systolicBp": 113,
      "diastolicBp": 92,
      "medStatus": "confirmed",
      "riskScore": 10,
      "signals": [
        "Reported fatigue / low activity"
      ]
    },
    {
      "date": "2026-09-23",
      "dayIndex": 85,
      "steps": 4155,
      "hrBpm": 87,
      "systolicBp": 120,
      "diastolicBp": 84,
      "medStatus": "unconfirmed",
      "riskScore": 12,
      "signals": [
        "3 unconfirmed meds this week"
      ]
    },
    {
      "date": "2026-09-24",
      "dayIndex": 86,
      "steps": 2998,
      "hrBpm": 91,
      "systolicBp": 118,
      "diastolicBp": 84,
      "medStatus": "confirmed",
      "riskScore": 16,
      "signals": [
        "Activity reduced (-46% steps)"
      ]
    },
    {
      "date": "2026-09-25",
      "dayIndex": 87,
      "steps": 2925,
      "hrBpm": 85,
      "systolicBp": 122,
      "diastolicBp": 84,
      "medStatus": "unconfirmed",
      "riskScore": 38,
      "signals": [
        "Activity reduced (-47% steps)",
        "3 unconfirmed meds this week",
        "Reported fatigue / low activity"
      ]
    },
    {
      "date": "2026-09-26",
      "dayIndex": 88,
      "steps": 4112,
      "hrBpm": 89,
      "systolicBp": 117,
      "diastolicBp": 86,
      "medStatus": "confirmed",
      "riskScore": 12,
      "signals": [
        "3 unconfirmed meds this week"
      ]
    },
    {
      "date": "2026-09-27",
      "dayIndex": 89,
      "steps": 3231,
      "hrBpm": 92,
      "systolicBp": 115,
      "diastolicBp": 87,
      "medStatus": "confirmed",
      "riskScore": 35,
      "signals": [
        "Elevated HR (92 bpm)",
        "Activity reduced (-42% steps)",
        "3 unconfirmed meds this week"
      ]
    },
    {
      "date": "2026-09-28",
      "dayIndex": 90,
      "steps": 3211,
      "hrBpm": 88,
      "systolicBp": 124,
      "diastolicBp": 85,
      "medStatus": "confirmed",
      "riskScore": 25,
      "signals": [
        "Activity reduced (-42% steps)",
        "Reported fatigue / low activity"
      ]
    }
  ],
  "SW003": [
    {
      "date": "2026-07-01",
      "dayIndex": 1,
      "steps": 5055,
      "hrBpm": 74,
      "systolicBp": 124,
      "diastolicBp": 86,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-07-02",
      "dayIndex": 2,
      "steps": 4859,
      "hrBpm": 81,
      "systolicBp": 128,
      "diastolicBp": 82,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-07-03",
      "dayIndex": 3,
      "steps": 4322,
      "hrBpm": 82,
      "systolicBp": 134,
      "diastolicBp": 85,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-07-04",
      "dayIndex": 4,
      "steps": 5362,
      "hrBpm": 83,
      "systolicBp": 120,
      "diastolicBp": 88,
      "medStatus": "unconfirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-07-05",
      "dayIndex": 5,
      "steps": 4873,
      "hrBpm": 78,
      "systolicBp": 134,
      "diastolicBp": 91,
      "medStatus": "unconfirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-07-06",
      "dayIndex": 6,
      "steps": 4460,
      "hrBpm": 78,
      "systolicBp": 120,
      "diastolicBp": 86,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-07-07",
      "dayIndex": 7,
      "steps": 5024,
      "hrBpm": 85,
      "systolicBp": 129,
      "diastolicBp": 84,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-07-08",
      "dayIndex": 8,
      "steps": 4861,
      "hrBpm": 80,
      "systolicBp": 117,
      "diastolicBp": 92,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-07-09",
      "dayIndex": 9,
      "steps": 4528,
      "hrBpm": 79,
      "systolicBp": 114,
      "diastolicBp": 85,
      "medStatus": "confirmed",
      "riskScore": 15,
      "signals": [
        "BP drop (114 mmHg)"
      ]
    },
    {
      "date": "2026-07-10",
      "dayIndex": 10,
      "steps": 4810,
      "hrBpm": 82,
      "systolicBp": 131,
      "diastolicBp": 88,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-07-11",
      "dayIndex": 11,
      "steps": 5557,
      "hrBpm": 80,
      "systolicBp": 119,
      "diastolicBp": 91,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-07-12",
      "dayIndex": 12,
      "steps": 4522,
      "hrBpm": 89,
      "systolicBp": 128,
      "diastolicBp": 85,
      "medStatus": "confirmed",
      "riskScore": 8,
      "signals": [
        "Elevated HR (89 bpm)"
      ]
    },
    {
      "date": "2026-07-13",
      "dayIndex": 13,
      "steps": 4724,
      "hrBpm": 79,
      "systolicBp": 129,
      "diastolicBp": 87,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-07-14",
      "dayIndex": 14,
      "steps": 4618,
      "hrBpm": 79,
      "systolicBp": 125,
      "diastolicBp": 85,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-07-15",
      "dayIndex": 15,
      "steps": 4108,
      "hrBpm": 81,
      "systolicBp": 125,
      "diastolicBp": 86,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-07-16",
      "dayIndex": 16,
      "steps": 5076,
      "hrBpm": 79,
      "systolicBp": 128,
      "diastolicBp": 90,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-07-17",
      "dayIndex": 17,
      "steps": 4130,
      "hrBpm": 83,
      "systolicBp": 125,
      "diastolicBp": 89,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-07-18",
      "dayIndex": 18,
      "steps": 3867,
      "hrBpm": 78,
      "systolicBp": 119,
      "diastolicBp": 89,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-07-19",
      "dayIndex": 19,
      "steps": 4358,
      "hrBpm": 83,
      "systolicBp": 127,
      "diastolicBp": 85,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-07-20",
      "dayIndex": 20,
      "steps": 4759,
      "hrBpm": 80,
      "systolicBp": 124,
      "diastolicBp": 89,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-07-21",
      "dayIndex": 21,
      "steps": 4243,
      "hrBpm": 85,
      "systolicBp": 132,
      "diastolicBp": 88,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-07-22",
      "dayIndex": 22,
      "steps": 4819,
      "hrBpm": 85,
      "systolicBp": 125,
      "diastolicBp": 88,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-07-23",
      "dayIndex": 23,
      "steps": 3664,
      "hrBpm": 85,
      "systolicBp": 133,
      "diastolicBp": 80,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-07-24",
      "dayIndex": 24,
      "steps": 5102,
      "hrBpm": 78,
      "systolicBp": 121,
      "diastolicBp": 82,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-07-25",
      "dayIndex": 25,
      "steps": 4745,
      "hrBpm": 80,
      "systolicBp": 135,
      "diastolicBp": 89,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-07-26",
      "dayIndex": 26,
      "steps": 4815,
      "hrBpm": 77,
      "systolicBp": 128,
      "diastolicBp": 91,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-07-27",
      "dayIndex": 27,
      "steps": 4755,
      "hrBpm": 87,
      "systolicBp": 133,
      "diastolicBp": 93,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-07-28",
      "dayIndex": 28,
      "steps": 4848,
      "hrBpm": 78,
      "systolicBp": 126,
      "diastolicBp": 85,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-07-29",
      "dayIndex": 29,
      "steps": 4766,
      "hrBpm": 76,
      "systolicBp": 132,
      "diastolicBp": 91,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-07-30",
      "dayIndex": 30,
      "steps": 4508,
      "hrBpm": 86,
      "systolicBp": 121,
      "diastolicBp": 85,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-07-31",
      "dayIndex": 31,
      "steps": 4543,
      "hrBpm": 78,
      "systolicBp": 128,
      "diastolicBp": 75,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-08-01",
      "dayIndex": 32,
      "steps": 4366,
      "hrBpm": 79,
      "systolicBp": 127,
      "diastolicBp": 81,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-08-02",
      "dayIndex": 33,
      "steps": 5554,
      "hrBpm": 77,
      "systolicBp": 119,
      "diastolicBp": 90,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-08-03",
      "dayIndex": 34,
      "steps": 4740,
      "hrBpm": 81,
      "systolicBp": 136,
      "diastolicBp": 90,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-08-04",
      "dayIndex": 35,
      "steps": 4138,
      "hrBpm": 82,
      "systolicBp": 122,
      "diastolicBp": 93,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-08-05",
      "dayIndex": 36,
      "steps": 4158,
      "hrBpm": 88,
      "systolicBp": 115,
      "diastolicBp": 88,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-08-06",
      "dayIndex": 37,
      "steps": 4509,
      "hrBpm": 79,
      "systolicBp": 124,
      "diastolicBp": 85,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-08-07",
      "dayIndex": 38,
      "steps": 3510,
      "hrBpm": 84,
      "systolicBp": 134,
      "diastolicBp": 91,
      "medStatus": "unconfirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-08-08",
      "dayIndex": 39,
      "steps": 4384,
      "hrBpm": 80,
      "systolicBp": 122,
      "diastolicBp": 90,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-08-09",
      "dayIndex": 40,
      "steps": 4102,
      "hrBpm": 79,
      "systolicBp": 131,
      "diastolicBp": 82,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-08-10",
      "dayIndex": 41,
      "steps": 3807,
      "hrBpm": 81,
      "systolicBp": 126,
      "diastolicBp": 87,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-08-11",
      "dayIndex": 42,
      "steps": 4586,
      "hrBpm": 82,
      "systolicBp": 126,
      "diastolicBp": 93,
      "medStatus": "unconfirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-08-12",
      "dayIndex": 43,
      "steps": 4686,
      "hrBpm": 81,
      "systolicBp": 136,
      "diastolicBp": 87,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-08-13",
      "dayIndex": 44,
      "steps": 4503,
      "hrBpm": 82,
      "systolicBp": 126,
      "diastolicBp": 93,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-08-14",
      "dayIndex": 45,
      "steps": 4406,
      "hrBpm": 82,
      "systolicBp": 122,
      "diastolicBp": 86,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-08-15",
      "dayIndex": 46,
      "steps": 4614,
      "hrBpm": 82,
      "systolicBp": 125,
      "diastolicBp": 84,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-08-16",
      "dayIndex": 47,
      "steps": 4764,
      "hrBpm": 80,
      "systolicBp": 128,
      "diastolicBp": 82,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-08-17",
      "dayIndex": 48,
      "steps": 4305,
      "hrBpm": 82,
      "systolicBp": 128,
      "diastolicBp": 86,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-08-18",
      "dayIndex": 49,
      "steps": 4332,
      "hrBpm": 84,
      "systolicBp": 133,
      "diastolicBp": 91,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-08-19",
      "dayIndex": 50,
      "steps": 5144,
      "hrBpm": 84,
      "systolicBp": 121,
      "diastolicBp": 85,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-08-20",
      "dayIndex": 51,
      "steps": 5131,
      "hrBpm": 82,
      "systolicBp": 139,
      "diastolicBp": 91,
      "medStatus": "confirmed",
      "riskScore": 13,
      "signals": [
        "Elevated BP (139 mmHg, +2.4 SD)"
      ]
    },
    {
      "date": "2026-08-21",
      "dayIndex": 52,
      "steps": 5201,
      "hrBpm": 80,
      "systolicBp": 124,
      "diastolicBp": 86,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-08-22",
      "dayIndex": 53,
      "steps": 4386,
      "hrBpm": 82,
      "systolicBp": 138,
      "diastolicBp": 89,
      "medStatus": "confirmed",
      "riskScore": 10,
      "signals": [
        "Elevated BP (138 mmHg, +2.2 SD)"
      ]
    },
    {
      "date": "2026-08-23",
      "dayIndex": 54,
      "steps": 4802,
      "hrBpm": 84,
      "systolicBp": 124,
      "diastolicBp": 82,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-08-24",
      "dayIndex": 55,
      "steps": 5049,
      "hrBpm": 80,
      "systolicBp": 119,
      "diastolicBp": 87,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-08-25",
      "dayIndex": 56,
      "steps": 4722,
      "hrBpm": 78,
      "systolicBp": 119,
      "diastolicBp": 89,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-08-26",
      "dayIndex": 57,
      "steps": 4569,
      "hrBpm": 81,
      "systolicBp": 123,
      "diastolicBp": 93,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-08-27",
      "dayIndex": 58,
      "steps": 3962,
      "hrBpm": 82,
      "systolicBp": 127,
      "diastolicBp": 91,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-08-28",
      "dayIndex": 59,
      "steps": 3696,
      "hrBpm": 81,
      "systolicBp": 131,
      "diastolicBp": 96,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-08-29",
      "dayIndex": 60,
      "steps": 4161,
      "hrBpm": 77,
      "systolicBp": 119,
      "diastolicBp": 93,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-08-30",
      "dayIndex": 61,
      "steps": 3998,
      "hrBpm": 79,
      "systolicBp": 140,
      "diastolicBp": 91,
      "medStatus": "confirmed",
      "riskScore": 16,
      "signals": [
        "Elevated BP (140 mmHg, +2.5 SD)"
      ]
    },
    {
      "date": "2026-08-31",
      "dayIndex": 62,
      "steps": 5043,
      "hrBpm": 81,
      "systolicBp": 134,
      "diastolicBp": 92,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-09-01",
      "dayIndex": 63,
      "steps": 4875,
      "hrBpm": 79,
      "systolicBp": 127,
      "diastolicBp": 88,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-09-02",
      "dayIndex": 64,
      "steps": 5363,
      "hrBpm": 88,
      "systolicBp": 134,
      "diastolicBp": 87,
      "medStatus": "unconfirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-09-03",
      "dayIndex": 65,
      "steps": 3977,
      "hrBpm": 88,
      "systolicBp": 133,
      "diastolicBp": 89,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-09-04",
      "dayIndex": 66,
      "steps": 5030,
      "hrBpm": 80,
      "systolicBp": 124,
      "diastolicBp": 94,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-09-05",
      "dayIndex": 67,
      "steps": 4569,
      "hrBpm": 80,
      "systolicBp": 127,
      "diastolicBp": 90,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-09-06",
      "dayIndex": 68,
      "steps": 4260,
      "hrBpm": 74,
      "systolicBp": 126,
      "diastolicBp": 89,
      "medStatus": "unconfirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-09-07",
      "dayIndex": 69,
      "steps": 4547,
      "hrBpm": 82,
      "systolicBp": 130,
      "diastolicBp": 86,
      "medStatus": "unconfirmed",
      "riskScore": 22,
      "signals": [
        "3 unconfirmed meds this week",
        "Reported fatigue / low activity"
      ]
    },
    {
      "date": "2026-09-08",
      "dayIndex": 70,
      "steps": 4274,
      "hrBpm": 79,
      "systolicBp": 123,
      "diastolicBp": 78,
      "medStatus": "confirmed",
      "riskScore": 22,
      "signals": [
        "3 unconfirmed meds this week",
        "Reported fatigue / low activity"
      ]
    },
    {
      "date": "2026-09-09",
      "dayIndex": 71,
      "steps": 4050,
      "hrBpm": 78,
      "systolicBp": 126,
      "diastolicBp": 94,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-09-10",
      "dayIndex": 72,
      "steps": 3793,
      "hrBpm": 79,
      "systolicBp": 128,
      "diastolicBp": 80,
      "medStatus": "unconfirmed",
      "riskScore": 22,
      "signals": [
        "3 unconfirmed meds this week",
        "Reported fatigue / low activity"
      ]
    },
    {
      "date": "2026-09-11",
      "dayIndex": 73,
      "steps": 4347,
      "hrBpm": 80,
      "systolicBp": 126,
      "diastolicBp": 86,
      "medStatus": "confirmed",
      "riskScore": 12,
      "signals": [
        "3 unconfirmed meds this week"
      ]
    },
    {
      "date": "2026-09-12",
      "dayIndex": 74,
      "steps": 3783,
      "hrBpm": 81,
      "systolicBp": 124,
      "diastolicBp": 87,
      "medStatus": "unconfirmed",
      "riskScore": 15,
      "signals": [
        "4 unconfirmed meds this week"
      ]
    },
    {
      "date": "2026-09-13",
      "dayIndex": 75,
      "steps": 5004,
      "hrBpm": 85,
      "systolicBp": 130,
      "diastolicBp": 85,
      "medStatus": "confirmed",
      "riskScore": 22,
      "signals": [
        "3 unconfirmed meds this week",
        "Reported fatigue / low activity"
      ]
    },
    {
      "date": "2026-09-14",
      "dayIndex": 76,
      "steps": 3467,
      "hrBpm": 84,
      "systolicBp": 126,
      "diastolicBp": 88,
      "medStatus": "unconfirmed",
      "riskScore": 12,
      "signals": [
        "3 unconfirmed meds this week"
      ]
    },
    {
      "date": "2026-09-15",
      "dayIndex": 77,
      "steps": 3543,
      "hrBpm": 86,
      "systolicBp": 127,
      "diastolicBp": 85,
      "medStatus": "confirmed",
      "riskScore": 22,
      "signals": [
        "3 unconfirmed meds this week",
        "Reported fatigue / low activity"
      ]
    },
    {
      "date": "2026-09-16",
      "dayIndex": 78,
      "steps": 3269,
      "hrBpm": 85,
      "systolicBp": 129,
      "diastolicBp": 90,
      "medStatus": "confirmed",
      "riskScore": 22,
      "signals": [
        "3 unconfirmed meds this week",
        "Reported fatigue / low activity"
      ]
    },
    {
      "date": "2026-09-17",
      "dayIndex": 79,
      "steps": 3070,
      "hrBpm": 84,
      "systolicBp": 133,
      "diastolicBp": 87,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-09-18",
      "dayIndex": 80,
      "steps": 3102,
      "hrBpm": 80,
      "systolicBp": 128,
      "diastolicBp": 81,
      "medStatus": "unconfirmed",
      "riskScore": 12,
      "signals": [
        "3 unconfirmed meds this week"
      ]
    },
    {
      "date": "2026-09-19",
      "dayIndex": 81,
      "steps": 3677,
      "hrBpm": 78,
      "systolicBp": 132,
      "diastolicBp": 94,
      "medStatus": "confirmed",
      "riskScore": 10,
      "signals": [
        "Reported fatigue / low activity"
      ]
    },
    {
      "date": "2026-09-20",
      "dayIndex": 82,
      "steps": 2913,
      "hrBpm": 83,
      "systolicBp": 124,
      "diastolicBp": 81,
      "medStatus": "confirmed",
      "riskScore": 13,
      "signals": [
        "Activity reduced (-38% steps)"
      ]
    },
    {
      "date": "2026-09-21",
      "dayIndex": 83,
      "steps": 3302,
      "hrBpm": 83,
      "systolicBp": 119,
      "diastolicBp": 84,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-09-22",
      "dayIndex": 84,
      "steps": 3259,
      "hrBpm": 83,
      "systolicBp": 136,
      "diastolicBp": 84,
      "medStatus": "unconfirmed",
      "riskScore": 10,
      "signals": [
        "Reported fatigue / low activity"
      ]
    },
    {
      "date": "2026-09-23",
      "dayIndex": 85,
      "steps": 2715,
      "hrBpm": 79,
      "systolicBp": 131,
      "diastolicBp": 91,
      "medStatus": "confirmed",
      "riskScore": 15,
      "signals": [
        "Activity reduced (-42% steps)"
      ]
    },
    {
      "date": "2026-09-24",
      "dayIndex": 86,
      "steps": 2777,
      "hrBpm": 82,
      "systolicBp": 121,
      "diastolicBp": 85,
      "medStatus": "confirmed",
      "riskScore": 14,
      "signals": [
        "Activity reduced (-41% steps)"
      ]
    },
    {
      "date": "2026-09-25",
      "dayIndex": 87,
      "steps": 2179,
      "hrBpm": 81,
      "systolicBp": 128,
      "diastolicBp": 91,
      "medStatus": "confirmed",
      "riskScore": 29,
      "signals": [
        "Activity reduced (-53% steps)",
        "Reported fatigue / low activity"
      ]
    },
    {
      "date": "2026-09-26",
      "dayIndex": 88,
      "steps": 2975,
      "hrBpm": 85,
      "systolicBp": 127,
      "diastolicBp": 90,
      "medStatus": "unconfirmed",
      "riskScore": 13,
      "signals": [
        "Activity reduced (-36% steps)"
      ]
    },
    {
      "date": "2026-09-27",
      "dayIndex": 89,
      "steps": 1998,
      "hrBpm": 84,
      "systolicBp": 134,
      "diastolicBp": 87,
      "medStatus": "confirmed",
      "riskScore": 20,
      "signals": [
        "Activity reduced (-57% steps)"
      ]
    },
    {
      "date": "2026-09-28",
      "dayIndex": 90,
      "steps": 2054,
      "hrBpm": 87,
      "systolicBp": 116,
      "diastolicBp": 85,
      "medStatus": "confirmed",
      "riskScore": 30,
      "signals": [
        "Activity reduced (-56% steps)",
        "Reported fatigue / low activity"
      ]
    }
  ],
  "SW004": [
    {
      "date": "2026-07-01",
      "dayIndex": 1,
      "steps": 4360,
      "hrBpm": 66,
      "systolicBp": 133,
      "diastolicBp": 86,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-07-02",
      "dayIndex": 2,
      "steps": 3730,
      "hrBpm": 69,
      "systolicBp": 132,
      "diastolicBp": 85,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-07-03",
      "dayIndex": 3,
      "steps": 4610,
      "hrBpm": 62,
      "systolicBp": 132,
      "diastolicBp": 82,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-07-04",
      "dayIndex": 4,
      "steps": 4462,
      "hrBpm": 69,
      "systolicBp": 134,
      "diastolicBp": 88,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-07-05",
      "dayIndex": 5,
      "steps": 4772,
      "hrBpm": 72,
      "systolicBp": 127,
      "diastolicBp": 83,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-07-06",
      "dayIndex": 6,
      "steps": 4363,
      "hrBpm": 66,
      "systolicBp": 127,
      "diastolicBp": 88,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-07-07",
      "dayIndex": 7,
      "steps": 4428,
      "hrBpm": 61,
      "systolicBp": 124,
      "diastolicBp": 81,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-07-08",
      "dayIndex": 8,
      "steps": 3023,
      "hrBpm": 65,
      "systolicBp": 124,
      "diastolicBp": 90,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-07-09",
      "dayIndex": 9,
      "steps": 4294,
      "hrBpm": 61,
      "systolicBp": 130,
      "diastolicBp": 83,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-07-10",
      "dayIndex": 10,
      "steps": 4563,
      "hrBpm": 67,
      "systolicBp": 136,
      "diastolicBp": 84,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-07-11",
      "dayIndex": 11,
      "steps": 3697,
      "hrBpm": 66,
      "systolicBp": 122,
      "diastolicBp": 85,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-07-12",
      "dayIndex": 12,
      "steps": 4792,
      "hrBpm": 61,
      "systolicBp": 139,
      "diastolicBp": 85,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-07-13",
      "dayIndex": 13,
      "steps": 4608,
      "hrBpm": 67,
      "systolicBp": 129,
      "diastolicBp": 81,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-07-14",
      "dayIndex": 14,
      "steps": 4735,
      "hrBpm": 68,
      "systolicBp": 132,
      "diastolicBp": 84,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-07-15",
      "dayIndex": 15,
      "steps": 4671,
      "hrBpm": 61,
      "systolicBp": 128,
      "diastolicBp": 75,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-07-16",
      "dayIndex": 16,
      "steps": 4278,
      "hrBpm": 68,
      "systolicBp": 131,
      "diastolicBp": 88,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-07-17",
      "dayIndex": 17,
      "steps": 4068,
      "hrBpm": 63,
      "systolicBp": 141,
      "diastolicBp": 91,
      "medStatus": "unconfirmed",
      "riskScore": 12,
      "signals": [
        "Elevated BP (141 mmHg, +2.3 SD)"
      ]
    },
    {
      "date": "2026-07-18",
      "dayIndex": 18,
      "steps": 4226,
      "hrBpm": 64,
      "systolicBp": 134,
      "diastolicBp": 89,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-07-19",
      "dayIndex": 19,
      "steps": 4192,
      "hrBpm": 64,
      "systolicBp": 135,
      "diastolicBp": 87,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-07-20",
      "dayIndex": 20,
      "steps": 4915,
      "hrBpm": 68,
      "systolicBp": 128,
      "diastolicBp": 79,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-07-21",
      "dayIndex": 21,
      "steps": 3928,
      "hrBpm": 66,
      "systolicBp": 135,
      "diastolicBp": 84,
      "medStatus": "unconfirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-07-22",
      "dayIndex": 22,
      "steps": 4631,
      "hrBpm": 59,
      "systolicBp": 134,
      "diastolicBp": 77,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-07-23",
      "dayIndex": 23,
      "steps": 3589,
      "hrBpm": 64,
      "systolicBp": 130,
      "diastolicBp": 85,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-07-24",
      "dayIndex": 24,
      "steps": 3888,
      "hrBpm": 69,
      "systolicBp": 125,
      "diastolicBp": 86,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-07-25",
      "dayIndex": 25,
      "steps": 3579,
      "hrBpm": 56,
      "systolicBp": 133,
      "diastolicBp": 85,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-07-26",
      "dayIndex": 26,
      "steps": 3874,
      "hrBpm": 69,
      "systolicBp": 131,
      "diastolicBp": 88,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-07-27",
      "dayIndex": 27,
      "steps": 4586,
      "hrBpm": 66,
      "systolicBp": 131,
      "diastolicBp": 90,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-07-28",
      "dayIndex": 28,
      "steps": 4002,
      "hrBpm": 68,
      "systolicBp": 130,
      "diastolicBp": 84,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-07-29",
      "dayIndex": 29,
      "steps": 4220,
      "hrBpm": 60,
      "systolicBp": 124,
      "diastolicBp": 90,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-07-30",
      "dayIndex": 30,
      "steps": 4246,
      "hrBpm": 61,
      "systolicBp": 120,
      "diastolicBp": 86,
      "medStatus": "confirmed",
      "riskScore": 15,
      "signals": [
        "BP drop (120 mmHg)"
      ]
    },
    {
      "date": "2026-07-31",
      "dayIndex": 31,
      "steps": 3138,
      "hrBpm": 64,
      "systolicBp": 133,
      "diastolicBp": 73,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-08-01",
      "dayIndex": 32,
      "steps": 3769,
      "hrBpm": 62,
      "systolicBp": 124,
      "diastolicBp": 84,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-08-02",
      "dayIndex": 33,
      "steps": 3739,
      "hrBpm": 63,
      "systolicBp": 126,
      "diastolicBp": 76,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-08-03",
      "dayIndex": 34,
      "steps": 3988,
      "hrBpm": 65,
      "systolicBp": 129,
      "diastolicBp": 84,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-08-04",
      "dayIndex": 35,
      "steps": 4534,
      "hrBpm": 57,
      "systolicBp": 137,
      "diastolicBp": 84,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-08-05",
      "dayIndex": 36,
      "steps": 4594,
      "hrBpm": 62,
      "systolicBp": 135,
      "diastolicBp": 81,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-08-06",
      "dayIndex": 37,
      "steps": 3750,
      "hrBpm": 59,
      "systolicBp": 123,
      "diastolicBp": 89,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-08-07",
      "dayIndex": 38,
      "steps": 3834,
      "hrBpm": 66,
      "systolicBp": 122,
      "diastolicBp": 81,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-08-08",
      "dayIndex": 39,
      "steps": 3556,
      "hrBpm": 63,
      "systolicBp": 130,
      "diastolicBp": 75,
      "medStatus": "unconfirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-08-09",
      "dayIndex": 40,
      "steps": 4097,
      "hrBpm": 68,
      "systolicBp": 140,
      "diastolicBp": 87,
      "medStatus": "confirmed",
      "riskScore": 9,
      "signals": [
        "Elevated BP (140 mmHg, +2.1 SD)"
      ]
    },
    {
      "date": "2026-08-10",
      "dayIndex": 41,
      "steps": 3572,
      "hrBpm": 62,
      "systolicBp": 136,
      "diastolicBp": 82,
      "medStatus": "unconfirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-08-11",
      "dayIndex": 42,
      "steps": 5172,
      "hrBpm": 62,
      "systolicBp": 153,
      "diastolicBp": 86,
      "medStatus": "confirmed",
      "riskScore": 30,
      "signals": [
        "Elevated BP (153 mmHg, +4.8 SD)"
      ]
    },
    {
      "date": "2026-08-12",
      "dayIndex": 43,
      "steps": 4068,
      "hrBpm": 68,
      "systolicBp": 123,
      "diastolicBp": 84,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-08-13",
      "dayIndex": 44,
      "steps": 4039,
      "hrBpm": 62,
      "systolicBp": 128,
      "diastolicBp": 86,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-08-14",
      "dayIndex": 45,
      "steps": 4650,
      "hrBpm": 63,
      "systolicBp": 127,
      "diastolicBp": 89,
      "medStatus": "unconfirmed",
      "riskScore": 12,
      "signals": [
        "3 unconfirmed meds this week"
      ]
    },
    {
      "date": "2026-08-15",
      "dayIndex": 46,
      "steps": 4791,
      "hrBpm": 59,
      "systolicBp": 129,
      "diastolicBp": 83,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-08-16",
      "dayIndex": 47,
      "steps": 4304,
      "hrBpm": 66,
      "systolicBp": 128,
      "diastolicBp": 82,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-08-17",
      "dayIndex": 48,
      "steps": 3726,
      "hrBpm": 63,
      "systolicBp": 130,
      "diastolicBp": 87,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-08-18",
      "dayIndex": 49,
      "steps": 3262,
      "hrBpm": 60,
      "systolicBp": 123,
      "diastolicBp": 85,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-08-19",
      "dayIndex": 50,
      "steps": 4531,
      "hrBpm": 65,
      "systolicBp": 128,
      "diastolicBp": 90,
      "medStatus": "unconfirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-08-20",
      "dayIndex": 51,
      "steps": 3906,
      "hrBpm": 61,
      "systolicBp": 140,
      "diastolicBp": 82,
      "medStatus": "confirmed",
      "riskScore": 9,
      "signals": [
        "Elevated BP (140 mmHg, +2.1 SD)"
      ]
    },
    {
      "date": "2026-08-21",
      "dayIndex": 52,
      "steps": 3915,
      "hrBpm": 65,
      "systolicBp": 132,
      "diastolicBp": 92,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-08-22",
      "dayIndex": 53,
      "steps": 4726,
      "hrBpm": 61,
      "systolicBp": 127,
      "diastolicBp": 80,
      "medStatus": "unconfirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-08-23",
      "dayIndex": 54,
      "steps": 4659,
      "hrBpm": 62,
      "systolicBp": 131,
      "diastolicBp": 82,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-08-24",
      "dayIndex": 55,
      "steps": 3542,
      "hrBpm": 63,
      "systolicBp": 123,
      "diastolicBp": 83,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-08-25",
      "dayIndex": 56,
      "steps": 4647,
      "hrBpm": 68,
      "systolicBp": 135,
      "diastolicBp": 86,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-08-26",
      "dayIndex": 57,
      "steps": 4420,
      "hrBpm": 63,
      "systolicBp": 123,
      "diastolicBp": 81,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-08-27",
      "dayIndex": 58,
      "steps": 4443,
      "hrBpm": 63,
      "systolicBp": 127,
      "diastolicBp": 83,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-08-28",
      "dayIndex": 59,
      "steps": 4931,
      "hrBpm": 67,
      "systolicBp": 130,
      "diastolicBp": 92,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-08-29",
      "dayIndex": 60,
      "steps": 4114,
      "hrBpm": 64,
      "systolicBp": 133,
      "diastolicBp": 74,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-08-30",
      "dayIndex": 61,
      "steps": 4691,
      "hrBpm": 68,
      "systolicBp": 122,
      "diastolicBp": 80,
      "medStatus": "unconfirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-08-31",
      "dayIndex": 62,
      "steps": 4480,
      "hrBpm": 65,
      "systolicBp": 132,
      "diastolicBp": 86,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-09-01",
      "dayIndex": 63,
      "steps": 4096,
      "hrBpm": 65,
      "systolicBp": 125,
      "diastolicBp": 86,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-09-02",
      "dayIndex": 64,
      "steps": 4325,
      "hrBpm": 65,
      "systolicBp": 130,
      "diastolicBp": 84,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-09-03",
      "dayIndex": 65,
      "steps": 4893,
      "hrBpm": 62,
      "systolicBp": 129,
      "diastolicBp": 87,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-09-04",
      "dayIndex": 66,
      "steps": 3620,
      "hrBpm": 65,
      "systolicBp": 138,
      "diastolicBp": 84,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-09-05",
      "dayIndex": 67,
      "steps": 4604,
      "hrBpm": 65,
      "systolicBp": 127,
      "diastolicBp": 87,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-09-06",
      "dayIndex": 68,
      "steps": 4010,
      "hrBpm": 58,
      "systolicBp": 130,
      "diastolicBp": 86,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-09-07",
      "dayIndex": 69,
      "steps": 4172,
      "hrBpm": 62,
      "systolicBp": 127,
      "diastolicBp": 88,
      "medStatus": "unconfirmed",
      "riskScore": 10,
      "signals": [
        "Reported fatigue / low activity"
      ]
    },
    {
      "date": "2026-09-08",
      "dayIndex": 70,
      "steps": 4417,
      "hrBpm": 62,
      "systolicBp": 131,
      "diastolicBp": 93,
      "medStatus": "confirmed",
      "riskScore": 10,
      "signals": [
        "Reported fatigue / low activity"
      ]
    },
    {
      "date": "2026-09-09",
      "dayIndex": 71,
      "steps": 3643,
      "hrBpm": 65,
      "systolicBp": 143,
      "diastolicBp": 80,
      "medStatus": "confirmed",
      "riskScore": 18,
      "signals": [
        "Elevated BP (143 mmHg, +2.7 SD)"
      ]
    },
    {
      "date": "2026-09-10",
      "dayIndex": 72,
      "steps": 3642,
      "hrBpm": 62,
      "systolicBp": 122,
      "diastolicBp": 82,
      "medStatus": "confirmed",
      "riskScore": 10,
      "signals": [
        "Reported fatigue / low activity"
      ]
    },
    {
      "date": "2026-09-11",
      "dayIndex": 73,
      "steps": 3556,
      "hrBpm": 68,
      "systolicBp": 126,
      "diastolicBp": 87,
      "medStatus": "unconfirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-09-12",
      "dayIndex": 74,
      "steps": 4750,
      "hrBpm": 69,
      "systolicBp": 134,
      "diastolicBp": 80,
      "medStatus": "unconfirmed",
      "riskScore": 12,
      "signals": [
        "3 unconfirmed meds this week"
      ]
    },
    {
      "date": "2026-09-13",
      "dayIndex": 75,
      "steps": 3870,
      "hrBpm": 66,
      "systolicBp": 137,
      "diastolicBp": 89,
      "medStatus": "confirmed",
      "riskScore": 22,
      "signals": [
        "3 unconfirmed meds this week",
        "Reported fatigue / low activity"
      ]
    },
    {
      "date": "2026-09-14",
      "dayIndex": 76,
      "steps": 3396,
      "hrBpm": 67,
      "systolicBp": 131,
      "diastolicBp": 88,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-09-15",
      "dayIndex": 77,
      "steps": 2797,
      "hrBpm": 65,
      "systolicBp": 139,
      "diastolicBp": 83,
      "medStatus": "unconfirmed",
      "riskScore": 22,
      "signals": [
        "3 unconfirmed meds this week",
        "Reported fatigue / low activity"
      ]
    },
    {
      "date": "2026-09-16",
      "dayIndex": 78,
      "steps": 3656,
      "hrBpm": 66,
      "systolicBp": 122,
      "diastolicBp": 79,
      "medStatus": "confirmed",
      "riskScore": 22,
      "signals": [
        "3 unconfirmed meds this week",
        "Reported fatigue / low activity"
      ]
    },
    {
      "date": "2026-09-17",
      "dayIndex": 79,
      "steps": 4155,
      "hrBpm": 65,
      "systolicBp": 132,
      "diastolicBp": 90,
      "medStatus": "confirmed",
      "riskScore": 12,
      "signals": [
        "3 unconfirmed meds this week"
      ]
    },
    {
      "date": "2026-09-18",
      "dayIndex": 80,
      "steps": 3182,
      "hrBpm": 63,
      "systolicBp": 124,
      "diastolicBp": 92,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-09-19",
      "dayIndex": 81,
      "steps": 3366,
      "hrBpm": 66,
      "systolicBp": 123,
      "diastolicBp": 84,
      "medStatus": "unconfirmed",
      "riskScore": 10,
      "signals": [
        "Reported fatigue / low activity"
      ]
    },
    {
      "date": "2026-09-20",
      "dayIndex": 82,
      "steps": 2995,
      "hrBpm": 64,
      "systolicBp": 133,
      "diastolicBp": 84,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-09-21",
      "dayIndex": 83,
      "steps": 2679,
      "hrBpm": 65,
      "systolicBp": 133,
      "diastolicBp": 83,
      "medStatus": "confirmed",
      "riskScore": 13,
      "signals": [
        "Activity reduced (-37% steps)"
      ]
    },
    {
      "date": "2026-09-22",
      "dayIndex": 84,
      "steps": 1943,
      "hrBpm": 68,
      "systolicBp": 119,
      "diastolicBp": 84,
      "medStatus": "confirmed",
      "riskScore": 44,
      "signals": [
        "BP drop (119 mmHg)",
        "Activity reduced (-54% steps)",
        "Reported fatigue / low activity"
      ]
    },
    {
      "date": "2026-09-23",
      "dayIndex": 85,
      "steps": 2104,
      "hrBpm": 67,
      "systolicBp": 129,
      "diastolicBp": 88,
      "medStatus": "unconfirmed",
      "riskScore": 18,
      "signals": [
        "Activity reduced (-50% steps)"
      ]
    },
    {
      "date": "2026-09-24",
      "dayIndex": 86,
      "steps": 2837,
      "hrBpm": 65,
      "systolicBp": 134,
      "diastolicBp": 84,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-09-25",
      "dayIndex": 87,
      "steps": 3361,
      "hrBpm": 68,
      "systolicBp": 133,
      "diastolicBp": 87,
      "medStatus": "confirmed",
      "riskScore": 10,
      "signals": [
        "Reported fatigue / low activity"
      ]
    },
    {
      "date": "2026-09-26",
      "dayIndex": 88,
      "steps": 1671,
      "hrBpm": 70,
      "systolicBp": 133,
      "diastolicBp": 90,
      "medStatus": "confirmed",
      "riskScore": 21,
      "signals": [
        "Activity reduced (-61% steps)"
      ]
    },
    {
      "date": "2026-09-27",
      "dayIndex": 89,
      "steps": 2506,
      "hrBpm": 63,
      "systolicBp": 123,
      "diastolicBp": 78,
      "medStatus": "unconfirmed",
      "riskScore": 14,
      "signals": [
        "Activity reduced (-41% steps)"
      ]
    },
    {
      "date": "2026-09-28",
      "dayIndex": 90,
      "steps": 2025,
      "hrBpm": 70,
      "systolicBp": 146,
      "diastolicBp": 79,
      "medStatus": "confirmed",
      "riskScore": 56,
      "signals": [
        "Elevated BP (146 mmHg, +3.3 SD)",
        "Activity reduced (-52% steps)",
        "Reported fatigue / low activity"
      ]
    }
  ],
  "SW005": [
    {
      "date": "2026-07-01",
      "dayIndex": 1,
      "steps": 5120,
      "hrBpm": 77,
      "systolicBp": 137,
      "diastolicBp": 65,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-07-02",
      "dayIndex": 2,
      "steps": 5931,
      "hrBpm": 84,
      "systolicBp": 144,
      "diastolicBp": 65,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-07-03",
      "dayIndex": 3,
      "steps": 5290,
      "hrBpm": 80,
      "systolicBp": 137,
      "diastolicBp": 65,
      "medStatus": "unconfirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-07-04",
      "dayIndex": 4,
      "steps": 5322,
      "hrBpm": 84,
      "systolicBp": 135,
      "diastolicBp": 68,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-07-05",
      "dayIndex": 5,
      "steps": 5249,
      "hrBpm": 76,
      "systolicBp": 133,
      "diastolicBp": 65,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-07-06",
      "dayIndex": 6,
      "steps": 5342,
      "hrBpm": 81,
      "systolicBp": 134,
      "diastolicBp": 62,
      "medStatus": "unconfirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-07-07",
      "dayIndex": 7,
      "steps": 5687,
      "hrBpm": 85,
      "systolicBp": 130,
      "diastolicBp": 61,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-07-08",
      "dayIndex": 8,
      "steps": 6202,
      "hrBpm": 84,
      "systolicBp": 136,
      "diastolicBp": 66,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-07-09",
      "dayIndex": 9,
      "steps": 6243,
      "hrBpm": 81,
      "systolicBp": 136,
      "diastolicBp": 67,
      "medStatus": "unconfirmed",
      "riskScore": 12,
      "signals": [
        "3 unconfirmed meds this week"
      ]
    },
    {
      "date": "2026-07-10",
      "dayIndex": 10,
      "steps": 6316,
      "hrBpm": 81,
      "systolicBp": 142,
      "diastolicBp": 64,
      "medStatus": "unconfirmed",
      "riskScore": 12,
      "signals": [
        "3 unconfirmed meds this week"
      ]
    },
    {
      "date": "2026-07-11",
      "dayIndex": 11,
      "steps": 5628,
      "hrBpm": 83,
      "systolicBp": 129,
      "diastolicBp": 67,
      "medStatus": "confirmed",
      "riskScore": 12,
      "signals": [
        "3 unconfirmed meds this week"
      ]
    },
    {
      "date": "2026-07-12",
      "dayIndex": 12,
      "steps": 5880,
      "hrBpm": 87,
      "systolicBp": 140,
      "diastolicBp": 67,
      "medStatus": "confirmed",
      "riskScore": 18,
      "signals": [
        "Elevated HR (87 bpm)",
        "3 unconfirmed meds this week"
      ]
    },
    {
      "date": "2026-07-13",
      "dayIndex": 13,
      "steps": 6445,
      "hrBpm": 84,
      "systolicBp": 133,
      "diastolicBp": 65,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-07-14",
      "dayIndex": 14,
      "steps": 5554,
      "hrBpm": 80,
      "systolicBp": 133,
      "diastolicBp": 61,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-07-15",
      "dayIndex": 15,
      "steps": 5589,
      "hrBpm": 82,
      "systolicBp": 151,
      "diastolicBp": 68,
      "medStatus": "confirmed",
      "riskScore": 18,
      "signals": [
        "Elevated BP (151 mmHg, +2.7 SD)"
      ]
    },
    {
      "date": "2026-07-16",
      "dayIndex": 16,
      "steps": 6242,
      "hrBpm": 80,
      "systolicBp": 143,
      "diastolicBp": 65,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-07-17",
      "dayIndex": 17,
      "steps": 5913,
      "hrBpm": 77,
      "systolicBp": 131,
      "diastolicBp": 69,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-07-18",
      "dayIndex": 18,
      "steps": 6227,
      "hrBpm": 76,
      "systolicBp": 143,
      "diastolicBp": 69,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-07-19",
      "dayIndex": 19,
      "steps": 6290,
      "hrBpm": 80,
      "systolicBp": 125,
      "diastolicBp": 62,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-07-20",
      "dayIndex": 20,
      "steps": 5585,
      "hrBpm": 79,
      "systolicBp": 141,
      "diastolicBp": 67,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-07-21",
      "dayIndex": 21,
      "steps": 5163,
      "hrBpm": 84,
      "systolicBp": 138,
      "diastolicBp": 60,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-07-22",
      "dayIndex": 22,
      "steps": 5850,
      "hrBpm": 81,
      "systolicBp": 125,
      "diastolicBp": 69,
      "medStatus": "unconfirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-07-23",
      "dayIndex": 23,
      "steps": 5362,
      "hrBpm": 82,
      "systolicBp": 136,
      "diastolicBp": 68,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-07-24",
      "dayIndex": 24,
      "steps": 5580,
      "hrBpm": 84,
      "systolicBp": 143,
      "diastolicBp": 66,
      "medStatus": "unconfirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-07-25",
      "dayIndex": 25,
      "steps": 6517,
      "hrBpm": 81,
      "systolicBp": 137,
      "diastolicBp": 64,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-07-26",
      "dayIndex": 26,
      "steps": 5901,
      "hrBpm": 81,
      "systolicBp": 133,
      "diastolicBp": 61,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-07-27",
      "dayIndex": 27,
      "steps": 6218,
      "hrBpm": 86,
      "systolicBp": 139,
      "diastolicBp": 62,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-07-28",
      "dayIndex": 28,
      "steps": 6264,
      "hrBpm": 81,
      "systolicBp": 135,
      "diastolicBp": 74,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-07-29",
      "dayIndex": 29,
      "steps": 6020,
      "hrBpm": 81,
      "systolicBp": 140,
      "diastolicBp": 71,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-07-30",
      "dayIndex": 30,
      "steps": 5567,
      "hrBpm": 79,
      "systolicBp": 133,
      "diastolicBp": 67,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-07-31",
      "dayIndex": 31,
      "steps": 5768,
      "hrBpm": 80,
      "systolicBp": 139,
      "diastolicBp": 66,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-08-01",
      "dayIndex": 32,
      "steps": 5303,
      "hrBpm": 79,
      "systolicBp": 136,
      "diastolicBp": 68,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-08-02",
      "dayIndex": 33,
      "steps": 6451,
      "hrBpm": 81,
      "systolicBp": 139,
      "diastolicBp": 65,
      "medStatus": "unconfirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-08-03",
      "dayIndex": 34,
      "steps": 6093,
      "hrBpm": 84,
      "systolicBp": 133,
      "diastolicBp": 72,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-08-04",
      "dayIndex": 35,
      "steps": 5162,
      "hrBpm": 84,
      "systolicBp": 146,
      "diastolicBp": 65,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-08-05",
      "dayIndex": 36,
      "steps": 6218,
      "hrBpm": 79,
      "systolicBp": 126,
      "diastolicBp": 68,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-08-06",
      "dayIndex": 37,
      "steps": 5857,
      "hrBpm": 83,
      "systolicBp": 122,
      "diastolicBp": 70,
      "medStatus": "confirmed",
      "riskScore": 15,
      "signals": [
        "BP drop (122 mmHg)"
      ]
    },
    {
      "date": "2026-08-07",
      "dayIndex": 38,
      "steps": 5737,
      "hrBpm": 82,
      "systolicBp": 129,
      "diastolicBp": 70,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-08-08",
      "dayIndex": 39,
      "steps": 5272,
      "hrBpm": 87,
      "systolicBp": 140,
      "diastolicBp": 70,
      "medStatus": "confirmed",
      "riskScore": 6,
      "signals": [
        "Elevated HR (87 bpm)"
      ]
    },
    {
      "date": "2026-08-09",
      "dayIndex": 40,
      "steps": 6234,
      "hrBpm": 82,
      "systolicBp": 139,
      "diastolicBp": 64,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-08-10",
      "dayIndex": 41,
      "steps": 5592,
      "hrBpm": 78,
      "systolicBp": 126,
      "diastolicBp": 62,
      "medStatus": "unconfirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-08-11",
      "dayIndex": 42,
      "steps": 6031,
      "hrBpm": 83,
      "systolicBp": 138,
      "diastolicBp": 71,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-08-12",
      "dayIndex": 43,
      "steps": 6855,
      "hrBpm": 86,
      "systolicBp": 132,
      "diastolicBp": 64,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-08-13",
      "dayIndex": 44,
      "steps": 5256,
      "hrBpm": 87,
      "systolicBp": 136,
      "diastolicBp": 73,
      "medStatus": "confirmed",
      "riskScore": 6,
      "signals": [
        "Elevated HR (87 bpm)"
      ]
    },
    {
      "date": "2026-08-14",
      "dayIndex": 45,
      "steps": 5573,
      "hrBpm": 81,
      "systolicBp": 131,
      "diastolicBp": 60,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-08-15",
      "dayIndex": 46,
      "steps": 6268,
      "hrBpm": 82,
      "systolicBp": 134,
      "diastolicBp": 69,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-08-16",
      "dayIndex": 47,
      "steps": 6105,
      "hrBpm": 80,
      "systolicBp": 144,
      "diastolicBp": 60,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-08-17",
      "dayIndex": 48,
      "steps": 6014,
      "hrBpm": 83,
      "systolicBp": 134,
      "diastolicBp": 67,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-08-18",
      "dayIndex": 49,
      "steps": 6011,
      "hrBpm": 76,
      "systolicBp": 146,
      "diastolicBp": 69,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-08-19",
      "dayIndex": 50,
      "steps": 5650,
      "hrBpm": 82,
      "systolicBp": 129,
      "diastolicBp": 71,
      "medStatus": "unconfirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-08-20",
      "dayIndex": 51,
      "steps": 5897,
      "hrBpm": 84,
      "systolicBp": 140,
      "diastolicBp": 66,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-08-21",
      "dayIndex": 52,
      "steps": 5114,
      "hrBpm": 79,
      "systolicBp": 142,
      "diastolicBp": 67,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-08-22",
      "dayIndex": 53,
      "steps": 5881,
      "hrBpm": 82,
      "systolicBp": 138,
      "diastolicBp": 72,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-08-23",
      "dayIndex": 54,
      "steps": 6054,
      "hrBpm": 74,
      "systolicBp": 133,
      "diastolicBp": 63,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-08-24",
      "dayIndex": 55,
      "steps": 5258,
      "hrBpm": 83,
      "systolicBp": 130,
      "diastolicBp": 73,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-08-25",
      "dayIndex": 56,
      "steps": 5521,
      "hrBpm": 81,
      "systolicBp": 134,
      "diastolicBp": 70,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-08-26",
      "dayIndex": 57,
      "steps": 6294,
      "hrBpm": 88,
      "systolicBp": 132,
      "diastolicBp": 63,
      "medStatus": "confirmed",
      "riskScore": 10,
      "signals": [
        "Elevated HR (88 bpm)"
      ]
    },
    {
      "date": "2026-08-27",
      "dayIndex": 58,
      "steps": 6639,
      "hrBpm": 81,
      "systolicBp": 133,
      "diastolicBp": 63,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-08-28",
      "dayIndex": 59,
      "steps": 5877,
      "hrBpm": 78,
      "systolicBp": 144,
      "diastolicBp": 58,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-08-29",
      "dayIndex": 60,
      "steps": 5969,
      "hrBpm": 75,
      "systolicBp": 145,
      "diastolicBp": 64,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-08-30",
      "dayIndex": 61,
      "steps": 6093,
      "hrBpm": 82,
      "systolicBp": 134,
      "diastolicBp": 62,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-08-31",
      "dayIndex": 62,
      "steps": 5730,
      "hrBpm": 81,
      "systolicBp": 129,
      "diastolicBp": 70,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-09-01",
      "dayIndex": 63,
      "steps": 6150,
      "hrBpm": 83,
      "systolicBp": 138,
      "diastolicBp": 68,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-09-02",
      "dayIndex": 64,
      "steps": 5149,
      "hrBpm": 82,
      "systolicBp": 121,
      "diastolicBp": 74,
      "medStatus": "confirmed",
      "riskScore": 15,
      "signals": [
        "BP drop (121 mmHg)"
      ]
    },
    {
      "date": "2026-09-03",
      "dayIndex": 65,
      "steps": 5390,
      "hrBpm": 83,
      "systolicBp": 137,
      "diastolicBp": 71,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-09-04",
      "dayIndex": 66,
      "steps": 5779,
      "hrBpm": 86,
      "systolicBp": 131,
      "diastolicBp": 67,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-09-05",
      "dayIndex": 67,
      "steps": 6130,
      "hrBpm": 73,
      "systolicBp": 126,
      "diastolicBp": 67,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-09-06",
      "dayIndex": 68,
      "steps": 5902,
      "hrBpm": 80,
      "systolicBp": 137,
      "diastolicBp": 71,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-09-07",
      "dayIndex": 69,
      "steps": 5088,
      "hrBpm": 82,
      "systolicBp": 133,
      "diastolicBp": 64,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-09-08",
      "dayIndex": 70,
      "steps": 6772,
      "hrBpm": 82,
      "systolicBp": 143,
      "diastolicBp": 65,
      "medStatus": "unconfirmed",
      "riskScore": 10,
      "signals": [
        "Reported fatigue / low activity"
      ]
    },
    {
      "date": "2026-09-09",
      "dayIndex": 71,
      "steps": 5476,
      "hrBpm": 82,
      "systolicBp": 137,
      "diastolicBp": 63,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-09-10",
      "dayIndex": 72,
      "steps": 5108,
      "hrBpm": 74,
      "systolicBp": 134,
      "diastolicBp": 70,
      "medStatus": "confirmed",
      "riskScore": 10,
      "signals": [
        "Reported fatigue / low activity"
      ]
    },
    {
      "date": "2026-09-11",
      "dayIndex": 73,
      "steps": 4921,
      "hrBpm": 84,
      "systolicBp": 129,
      "diastolicBp": 62,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-09-12",
      "dayIndex": 74,
      "steps": 6036,
      "hrBpm": 86,
      "systolicBp": 146,
      "diastolicBp": 63,
      "medStatus": "unconfirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-09-13",
      "dayIndex": 75,
      "steps": 4883,
      "hrBpm": 80,
      "systolicBp": 137,
      "diastolicBp": 66,
      "medStatus": "confirmed",
      "riskScore": 10,
      "signals": [
        "Reported fatigue / low activity"
      ]
    },
    {
      "date": "2026-09-14",
      "dayIndex": 76,
      "steps": 5435,
      "hrBpm": 81,
      "systolicBp": 123,
      "diastolicBp": 65,
      "medStatus": "confirmed",
      "riskScore": 15,
      "signals": [
        "BP drop (123 mmHg)"
      ]
    },
    {
      "date": "2026-09-15",
      "dayIndex": 77,
      "steps": 4648,
      "hrBpm": 83,
      "systolicBp": 144,
      "diastolicBp": 68,
      "medStatus": "confirmed",
      "riskScore": 10,
      "signals": [
        "Reported fatigue / low activity"
      ]
    },
    {
      "date": "2026-09-16",
      "dayIndex": 78,
      "steps": 4936,
      "hrBpm": 83,
      "systolicBp": 139,
      "diastolicBp": 63,
      "medStatus": "unconfirmed",
      "riskScore": 10,
      "signals": [
        "Reported fatigue / low activity"
      ]
    },
    {
      "date": "2026-09-17",
      "dayIndex": 79,
      "steps": 5413,
      "hrBpm": 81,
      "systolicBp": 137,
      "diastolicBp": 68,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-09-18",
      "dayIndex": 80,
      "steps": 5341,
      "hrBpm": 80,
      "systolicBp": 128,
      "diastolicBp": 75,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-09-19",
      "dayIndex": 81,
      "steps": 4206,
      "hrBpm": 83,
      "systolicBp": 141,
      "diastolicBp": 64,
      "medStatus": "confirmed",
      "riskScore": 10,
      "signals": [
        "Reported fatigue / low activity"
      ]
    },
    {
      "date": "2026-09-20",
      "dayIndex": 82,
      "steps": 4603,
      "hrBpm": 82,
      "systolicBp": 149,
      "diastolicBp": 68,
      "medStatus": "unconfirmed",
      "riskScore": 12,
      "signals": [
        "Elevated BP (149 mmHg, +2.3 SD)"
      ]
    },
    {
      "date": "2026-09-21",
      "dayIndex": 83,
      "steps": 4992,
      "hrBpm": 81,
      "systolicBp": 137,
      "diastolicBp": 65,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-09-22",
      "dayIndex": 84,
      "steps": 4059,
      "hrBpm": 86,
      "systolicBp": 140,
      "diastolicBp": 72,
      "medStatus": "confirmed",
      "riskScore": 10,
      "signals": [
        "Reported fatigue / low activity"
      ]
    },
    {
      "date": "2026-09-23",
      "dayIndex": 85,
      "steps": 4275,
      "hrBpm": 84,
      "systolicBp": 140,
      "diastolicBp": 64,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-09-24",
      "dayIndex": 86,
      "steps": 4382,
      "hrBpm": 85,
      "systolicBp": 136,
      "diastolicBp": 71,
      "medStatus": "unconfirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-09-25",
      "dayIndex": 87,
      "steps": 3626,
      "hrBpm": 84,
      "systolicBp": 141,
      "diastolicBp": 74,
      "medStatus": "confirmed",
      "riskScore": 23,
      "signals": [
        "Activity reduced (-38% steps)",
        "Reported fatigue / low activity"
      ]
    },
    {
      "date": "2026-09-26",
      "dayIndex": 88,
      "steps": 4441,
      "hrBpm": 89,
      "systolicBp": 137,
      "diastolicBp": 66,
      "medStatus": "confirmed",
      "riskScore": 14,
      "signals": [
        "Elevated HR (89 bpm)"
      ]
    },
    {
      "date": "2026-09-27",
      "dayIndex": 89,
      "steps": 3853,
      "hrBpm": 88,
      "systolicBp": 132,
      "diastolicBp": 66,
      "medStatus": "confirmed",
      "riskScore": 10,
      "signals": [
        "Elevated HR (88 bpm)"
      ]
    },
    {
      "date": "2026-09-28",
      "dayIndex": 90,
      "steps": 4176,
      "hrBpm": 83,
      "systolicBp": 137,
      "diastolicBp": 60,
      "medStatus": "unconfirmed",
      "riskScore": 10,
      "signals": [
        "Reported fatigue / low activity"
      ]
    }
  ],
  "SW006": [
    {
      "date": "2026-07-01",
      "dayIndex": 1,
      "steps": 3406,
      "hrBpm": 72,
      "systolicBp": 127,
      "diastolicBp": 82,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-07-02",
      "dayIndex": 2,
      "steps": 3285,
      "hrBpm": 69,
      "systolicBp": 121,
      "diastolicBp": 87,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-07-03",
      "dayIndex": 3,
      "steps": 3418,
      "hrBpm": 65,
      "systolicBp": 119,
      "diastolicBp": 85,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-07-04",
      "dayIndex": 4,
      "steps": 2156,
      "hrBpm": 73,
      "systolicBp": 130,
      "diastolicBp": 81,
      "medStatus": "unconfirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-07-05",
      "dayIndex": 5,
      "steps": 2295,
      "hrBpm": 72,
      "systolicBp": 119,
      "diastolicBp": 86,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-07-06",
      "dayIndex": 6,
      "steps": 3539,
      "hrBpm": 70,
      "systolicBp": 129,
      "diastolicBp": 86,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-07-07",
      "dayIndex": 7,
      "steps": 3504,
      "hrBpm": 69,
      "systolicBp": 123,
      "diastolicBp": 86,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-07-08",
      "dayIndex": 8,
      "steps": 3204,
      "hrBpm": 70,
      "systolicBp": 123,
      "diastolicBp": 88,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-07-09",
      "dayIndex": 9,
      "steps": 3446,
      "hrBpm": 74,
      "systolicBp": 126,
      "diastolicBp": 85,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-07-10",
      "dayIndex": 10,
      "steps": 3478,
      "hrBpm": 70,
      "systolicBp": 127,
      "diastolicBp": 86,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-07-11",
      "dayIndex": 11,
      "steps": 2785,
      "hrBpm": 74,
      "systolicBp": 111,
      "diastolicBp": 83,
      "medStatus": "confirmed",
      "riskScore": 15,
      "signals": [
        "BP drop (111 mmHg)"
      ]
    },
    {
      "date": "2026-07-12",
      "dayIndex": 12,
      "steps": 3054,
      "hrBpm": 70,
      "systolicBp": 122,
      "diastolicBp": 82,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-07-13",
      "dayIndex": 13,
      "steps": 2967,
      "hrBpm": 68,
      "systolicBp": 123,
      "diastolicBp": 91,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-07-14",
      "dayIndex": 14,
      "steps": 3410,
      "hrBpm": 63,
      "systolicBp": 124,
      "diastolicBp": 88,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-07-15",
      "dayIndex": 15,
      "steps": 3562,
      "hrBpm": 68,
      "systolicBp": 125,
      "diastolicBp": 85,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-07-16",
      "dayIndex": 16,
      "steps": 2922,
      "hrBpm": 67,
      "systolicBp": 120,
      "diastolicBp": 89,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-07-17",
      "dayIndex": 17,
      "steps": 3140,
      "hrBpm": 75,
      "systolicBp": 124,
      "diastolicBp": 89,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-07-18",
      "dayIndex": 18,
      "steps": 3168,
      "hrBpm": 70,
      "systolicBp": 125,
      "diastolicBp": 86,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-07-19",
      "dayIndex": 19,
      "steps": 4528,
      "hrBpm": 68,
      "systolicBp": 124,
      "diastolicBp": 86,
      "medStatus": "unconfirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-07-20",
      "dayIndex": 20,
      "steps": 3290,
      "hrBpm": 70,
      "systolicBp": 123,
      "diastolicBp": 86,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-07-21",
      "dayIndex": 21,
      "steps": 3234,
      "hrBpm": 68,
      "systolicBp": 120,
      "diastolicBp": 83,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-07-22",
      "dayIndex": 22,
      "steps": 2811,
      "hrBpm": 71,
      "systolicBp": 126,
      "diastolicBp": 91,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-07-23",
      "dayIndex": 23,
      "steps": 3229,
      "hrBpm": 68,
      "systolicBp": 115,
      "diastolicBp": 91,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-07-24",
      "dayIndex": 24,
      "steps": 2576,
      "hrBpm": 71,
      "systolicBp": 121,
      "diastolicBp": 82,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-07-25",
      "dayIndex": 25,
      "steps": 2775,
      "hrBpm": 69,
      "systolicBp": 122,
      "diastolicBp": 85,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-07-26",
      "dayIndex": 26,
      "steps": 3156,
      "hrBpm": 71,
      "systolicBp": 125,
      "diastolicBp": 84,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-07-27",
      "dayIndex": 27,
      "steps": 3407,
      "hrBpm": 74,
      "systolicBp": 135,
      "diastolicBp": 85,
      "medStatus": "confirmed",
      "riskScore": 13,
      "signals": [
        "Elevated BP (135 mmHg, +2.4 SD)"
      ]
    },
    {
      "date": "2026-07-28",
      "dayIndex": 28,
      "steps": 3109,
      "hrBpm": 70,
      "systolicBp": 111,
      "diastolicBp": 91,
      "medStatus": "confirmed",
      "riskScore": 15,
      "signals": [
        "BP drop (111 mmHg)"
      ]
    },
    {
      "date": "2026-07-29",
      "dayIndex": 29,
      "steps": 3668,
      "hrBpm": 68,
      "systolicBp": 131,
      "diastolicBp": 86,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-07-30",
      "dayIndex": 30,
      "steps": 3407,
      "hrBpm": 71,
      "systolicBp": 126,
      "diastolicBp": 86,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-07-31",
      "dayIndex": 31,
      "steps": 3055,
      "hrBpm": 74,
      "systolicBp": 126,
      "diastolicBp": 84,
      "medStatus": "unconfirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-08-01",
      "dayIndex": 32,
      "steps": 2985,
      "hrBpm": 71,
      "systolicBp": 128,
      "diastolicBp": 84,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-08-02",
      "dayIndex": 33,
      "steps": 2837,
      "hrBpm": 70,
      "systolicBp": 119,
      "diastolicBp": 86,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-08-03",
      "dayIndex": 34,
      "steps": 3194,
      "hrBpm": 66,
      "systolicBp": 131,
      "diastolicBp": 87,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-08-04",
      "dayIndex": 35,
      "steps": 3346,
      "hrBpm": 66,
      "systolicBp": 138,
      "diastolicBp": 80,
      "medStatus": "confirmed",
      "riskScore": 22,
      "signals": [
        "Elevated BP (138 mmHg, +2.9 SD)"
      ]
    },
    {
      "date": "2026-08-05",
      "dayIndex": 36,
      "steps": 2259,
      "hrBpm": 70,
      "systolicBp": 124,
      "diastolicBp": 88,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-08-06",
      "dayIndex": 37,
      "steps": 3350,
      "hrBpm": 73,
      "systolicBp": 127,
      "diastolicBp": 87,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-08-07",
      "dayIndex": 38,
      "steps": 3511,
      "hrBpm": 72,
      "systolicBp": 121,
      "diastolicBp": 81,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-08-08",
      "dayIndex": 39,
      "steps": 2729,
      "hrBpm": 72,
      "systolicBp": 123,
      "diastolicBp": 83,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-08-09",
      "dayIndex": 40,
      "steps": 3154,
      "hrBpm": 67,
      "systolicBp": 117,
      "diastolicBp": 82,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-08-10",
      "dayIndex": 41,
      "steps": 3425,
      "hrBpm": 70,
      "systolicBp": 116,
      "diastolicBp": 82,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-08-11",
      "dayIndex": 42,
      "steps": 3444,
      "hrBpm": 73,
      "systolicBp": 146,
      "diastolicBp": 75,
      "medStatus": "confirmed",
      "riskScore": 30,
      "signals": [
        "Elevated BP (146 mmHg, +4.5 SD)"
      ]
    },
    {
      "date": "2026-08-12",
      "dayIndex": 43,
      "steps": 2476,
      "hrBpm": 74,
      "systolicBp": 122,
      "diastolicBp": 87,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-08-13",
      "dayIndex": 44,
      "steps": 3265,
      "hrBpm": 69,
      "systolicBp": 123,
      "diastolicBp": 83,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-08-14",
      "dayIndex": 45,
      "steps": 3496,
      "hrBpm": 66,
      "systolicBp": 127,
      "diastolicBp": 90,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-08-15",
      "dayIndex": 46,
      "steps": 3483,
      "hrBpm": 72,
      "systolicBp": 123,
      "diastolicBp": 87,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-08-16",
      "dayIndex": 47,
      "steps": 3065,
      "hrBpm": 66,
      "systolicBp": 136,
      "diastolicBp": 91,
      "medStatus": "confirmed",
      "riskScore": 16,
      "signals": [
        "Elevated BP (136 mmHg, +2.5 SD)"
      ]
    },
    {
      "date": "2026-08-17",
      "dayIndex": 48,
      "steps": 3188,
      "hrBpm": 68,
      "systolicBp": 130,
      "diastolicBp": 85,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-08-18",
      "dayIndex": 49,
      "steps": 2533,
      "hrBpm": 70,
      "systolicBp": 122,
      "diastolicBp": 86,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-08-19",
      "dayIndex": 50,
      "steps": 2968,
      "hrBpm": 65,
      "systolicBp": 130,
      "diastolicBp": 85,
      "medStatus": "unconfirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-08-20",
      "dayIndex": 51,
      "steps": 3173,
      "hrBpm": 72,
      "systolicBp": 125,
      "diastolicBp": 85,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-08-21",
      "dayIndex": 52,
      "steps": 3266,
      "hrBpm": 70,
      "systolicBp": 124,
      "diastolicBp": 87,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-08-22",
      "dayIndex": 53,
      "steps": 3744,
      "hrBpm": 70,
      "systolicBp": 132,
      "diastolicBp": 92,
      "medStatus": "unconfirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-08-23",
      "dayIndex": 54,
      "steps": 3457,
      "hrBpm": 66,
      "systolicBp": 132,
      "diastolicBp": 87,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-08-24",
      "dayIndex": 55,
      "steps": 3297,
      "hrBpm": 76,
      "systolicBp": 139,
      "diastolicBp": 83,
      "medStatus": "confirmed",
      "riskScore": 33,
      "signals": [
        "Elevated BP (139 mmHg, +3.1 SD)",
        "Elevated HR (76 bpm)"
      ]
    },
    {
      "date": "2026-08-25",
      "dayIndex": 56,
      "steps": 2913,
      "hrBpm": 69,
      "systolicBp": 133,
      "diastolicBp": 89,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-08-26",
      "dayIndex": 57,
      "steps": 3235,
      "hrBpm": 68,
      "systolicBp": 127,
      "diastolicBp": 86,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-08-27",
      "dayIndex": 58,
      "steps": 3099,
      "hrBpm": 66,
      "systolicBp": 125,
      "diastolicBp": 82,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-08-28",
      "dayIndex": 59,
      "steps": 2892,
      "hrBpm": 67,
      "systolicBp": 120,
      "diastolicBp": 83,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-08-29",
      "dayIndex": 60,
      "steps": 3383,
      "hrBpm": 65,
      "systolicBp": 122,
      "diastolicBp": 74,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-08-30",
      "dayIndex": 61,
      "steps": 2522,
      "hrBpm": 77,
      "systolicBp": 125,
      "diastolicBp": 88,
      "medStatus": "unconfirmed",
      "riskScore": 12,
      "signals": [
        "Elevated HR (77 bpm)"
      ]
    },
    {
      "date": "2026-08-31",
      "dayIndex": 62,
      "steps": 2871,
      "hrBpm": 75,
      "systolicBp": 118,
      "diastolicBp": 82,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-09-01",
      "dayIndex": 63,
      "steps": 3481,
      "hrBpm": 69,
      "systolicBp": 119,
      "diastolicBp": 89,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-09-02",
      "dayIndex": 64,
      "steps": 3703,
      "hrBpm": 70,
      "systolicBp": 125,
      "diastolicBp": 86,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-09-03",
      "dayIndex": 65,
      "steps": 2897,
      "hrBpm": 73,
      "systolicBp": 130,
      "diastolicBp": 90,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-09-04",
      "dayIndex": 66,
      "steps": 3176,
      "hrBpm": 69,
      "systolicBp": 117,
      "diastolicBp": 87,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-09-05",
      "dayIndex": 67,
      "steps": 3365,
      "hrBpm": 71,
      "systolicBp": 118,
      "diastolicBp": 89,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-09-06",
      "dayIndex": 68,
      "steps": 3258,
      "hrBpm": 72,
      "systolicBp": 117,
      "diastolicBp": 84,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-09-07",
      "dayIndex": 69,
      "steps": 3350,
      "hrBpm": 75,
      "systolicBp": 131,
      "diastolicBp": 87,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-09-08",
      "dayIndex": 70,
      "steps": 3602,
      "hrBpm": 69,
      "systolicBp": 120,
      "diastolicBp": 88,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-09-09",
      "dayIndex": 71,
      "steps": 2759,
      "hrBpm": 69,
      "systolicBp": 127,
      "diastolicBp": 78,
      "medStatus": "unconfirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-09-10",
      "dayIndex": 72,
      "steps": 3060,
      "hrBpm": 77,
      "systolicBp": 127,
      "diastolicBp": 87,
      "medStatus": "unconfirmed",
      "riskScore": 22,
      "signals": [
        "Elevated HR (77 bpm)",
        "Reported fatigue / low activity"
      ]
    },
    {
      "date": "2026-09-11",
      "dayIndex": 73,
      "steps": 2730,
      "hrBpm": 72,
      "systolicBp": 126,
      "diastolicBp": 90,
      "medStatus": "unconfirmed",
      "riskScore": 12,
      "signals": [
        "3 unconfirmed meds this week"
      ]
    },
    {
      "date": "2026-09-12",
      "dayIndex": 74,
      "steps": 2233,
      "hrBpm": 69,
      "systolicBp": 120,
      "diastolicBp": 88,
      "medStatus": "unconfirmed",
      "riskScore": 15,
      "signals": [
        "4 unconfirmed meds this week"
      ]
    },
    {
      "date": "2026-09-13",
      "dayIndex": 75,
      "steps": 2197,
      "hrBpm": 70,
      "systolicBp": 128,
      "diastolicBp": 91,
      "medStatus": "unconfirmed",
      "riskScore": 25,
      "signals": [
        "5 unconfirmed meds this week",
        "Reported fatigue / low activity"
      ]
    },
    {
      "date": "2026-09-14",
      "dayIndex": 76,
      "steps": 2407,
      "hrBpm": 71,
      "systolicBp": 122,
      "diastolicBp": 84,
      "medStatus": "confirmed",
      "riskScore": 15,
      "signals": [
        "5 unconfirmed meds this week"
      ]
    },
    {
      "date": "2026-09-15",
      "dayIndex": 77,
      "steps": 2751,
      "hrBpm": 75,
      "systolicBp": 122,
      "diastolicBp": 82,
      "medStatus": "confirmed",
      "riskScore": 25,
      "signals": [
        "5 unconfirmed meds this week",
        "Reported fatigue / low activity"
      ]
    },
    {
      "date": "2026-09-16",
      "dayIndex": 78,
      "steps": 2841,
      "hrBpm": 66,
      "systolicBp": 131,
      "diastolicBp": 87,
      "medStatus": "confirmed",
      "riskScore": 25,
      "signals": [
        "4 unconfirmed meds this week",
        "Reported fatigue / low activity"
      ]
    },
    {
      "date": "2026-09-17",
      "dayIndex": 79,
      "steps": 2870,
      "hrBpm": 70,
      "systolicBp": 118,
      "diastolicBp": 96,
      "medStatus": "unconfirmed",
      "riskScore": 15,
      "signals": [
        "4 unconfirmed meds this week"
      ]
    },
    {
      "date": "2026-09-18",
      "dayIndex": 80,
      "steps": 1648,
      "hrBpm": 75,
      "systolicBp": 115,
      "diastolicBp": 80,
      "medStatus": "confirmed",
      "riskScore": 29,
      "signals": [
        "Activity reduced (-48% steps)",
        "3 unconfirmed meds this week"
      ]
    },
    {
      "date": "2026-09-19",
      "dayIndex": 81,
      "steps": 2051,
      "hrBpm": 70,
      "systolicBp": 126,
      "diastolicBp": 87,
      "medStatus": "confirmed",
      "riskScore": 23,
      "signals": [
        "Activity reduced (-36% steps)",
        "Reported fatigue / low activity"
      ]
    },
    {
      "date": "2026-09-20",
      "dayIndex": 82,
      "steps": 1673,
      "hrBpm": 71,
      "systolicBp": 127,
      "diastolicBp": 90,
      "medStatus": "confirmed",
      "riskScore": 17,
      "signals": [
        "Activity reduced (-48% steps)"
      ]
    },
    {
      "date": "2026-09-21",
      "dayIndex": 83,
      "steps": 1194,
      "hrBpm": 75,
      "systolicBp": 135,
      "diastolicBp": 89,
      "medStatus": "unconfirmed",
      "riskScore": 35,
      "signals": [
        "Elevated BP (135 mmHg, +2.4 SD)",
        "Activity reduced (-63% steps)"
      ]
    },
    {
      "date": "2026-09-22",
      "dayIndex": 84,
      "steps": 1631,
      "hrBpm": 75,
      "systolicBp": 126,
      "diastolicBp": 87,
      "medStatus": "confirmed",
      "riskScore": 27,
      "signals": [
        "Activity reduced (-49% steps)",
        "Reported fatigue / low activity"
      ]
    },
    {
      "date": "2026-09-23",
      "dayIndex": 85,
      "steps": 1217,
      "hrBpm": 79,
      "systolicBp": 132,
      "diastolicBp": 85,
      "medStatus": "confirmed",
      "riskScore": 42,
      "signals": [
        "Elevated HR (79 bpm)",
        "Activity reduced (-62% steps)"
      ]
    },
    {
      "date": "2026-09-24",
      "dayIndex": 86,
      "steps": 1918,
      "hrBpm": 73,
      "systolicBp": 113,
      "diastolicBp": 83,
      "medStatus": "confirmed",
      "riskScore": 14,
      "signals": [
        "Activity reduced (-40% steps)"
      ]
    },
    {
      "date": "2026-09-25",
      "dayIndex": 87,
      "steps": 1338,
      "hrBpm": 73,
      "systolicBp": 143,
      "diastolicBp": 80,
      "medStatus": "unconfirmed",
      "riskScore": 60,
      "signals": [
        "Elevated BP (143 mmHg, +3.9 SD)",
        "Activity reduced (-58% steps)",
        "Reported fatigue / low activity"
      ]
    },
    {
      "date": "2026-09-26",
      "dayIndex": 88,
      "steps": 1549,
      "hrBpm": 72,
      "systolicBp": 124,
      "diastolicBp": 76,
      "medStatus": "confirmed",
      "riskScore": 18,
      "signals": [
        "Activity reduced (-52% steps)"
      ]
    },
    {
      "date": "2026-09-27",
      "dayIndex": 89,
      "steps": 1080,
      "hrBpm": 71,
      "systolicBp": 134,
      "diastolicBp": 86,
      "medStatus": "confirmed",
      "riskScore": 33,
      "signals": [
        "Elevated BP (134 mmHg, +2.2 SD)",
        "Activity reduced (-66% steps)"
      ]
    },
    {
      "date": "2026-09-28",
      "dayIndex": 90,
      "steps": 799,
      "hrBpm": 81,
      "systolicBp": 126,
      "diastolicBp": 90,
      "medStatus": "confirmed",
      "riskScore": 55,
      "signals": [
        "Elevated HR (81 bpm)",
        "Activity reduced (-75% steps)",
        "Reported fatigue / low activity"
      ]
    }
  ],
  "SW007": [
    {
      "date": "2026-07-01",
      "dayIndex": 1,
      "steps": 6537,
      "hrBpm": 71,
      "systolicBp": 117,
      "diastolicBp": 88,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-07-02",
      "dayIndex": 2,
      "steps": 6910,
      "hrBpm": 66,
      "systolicBp": 121,
      "diastolicBp": 94,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-07-03",
      "dayIndex": 3,
      "steps": 6433,
      "hrBpm": 68,
      "systolicBp": 119,
      "diastolicBp": 99,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-07-04",
      "dayIndex": 4,
      "steps": 6807,
      "hrBpm": 68,
      "systolicBp": 118,
      "diastolicBp": 86,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-07-05",
      "dayIndex": 5,
      "steps": 6346,
      "hrBpm": 68,
      "systolicBp": 112,
      "diastolicBp": 81,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-07-06",
      "dayIndex": 6,
      "steps": 6170,
      "hrBpm": 69,
      "systolicBp": 117,
      "diastolicBp": 85,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-07-07",
      "dayIndex": 7,
      "steps": 6671,
      "hrBpm": 68,
      "systolicBp": 119,
      "diastolicBp": 88,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-07-08",
      "dayIndex": 8,
      "steps": 6661,
      "hrBpm": 71,
      "systolicBp": 115,
      "diastolicBp": 89,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-07-09",
      "dayIndex": 9,
      "steps": 7829,
      "hrBpm": 72,
      "systolicBp": 112,
      "diastolicBp": 95,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-07-10",
      "dayIndex": 10,
      "steps": 7112,
      "hrBpm": 65,
      "systolicBp": 108,
      "diastolicBp": 85,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-07-11",
      "dayIndex": 11,
      "steps": 6491,
      "hrBpm": 70,
      "systolicBp": 117,
      "diastolicBp": 88,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-07-12",
      "dayIndex": 12,
      "steps": 6826,
      "hrBpm": 62,
      "systolicBp": 110,
      "diastolicBp": 79,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-07-13",
      "dayIndex": 13,
      "steps": 6150,
      "hrBpm": 68,
      "systolicBp": 107,
      "diastolicBp": 83,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-07-14",
      "dayIndex": 14,
      "steps": 6187,
      "hrBpm": 70,
      "systolicBp": 107,
      "diastolicBp": 88,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-07-15",
      "dayIndex": 15,
      "steps": 6660,
      "hrBpm": 70,
      "systolicBp": 117,
      "diastolicBp": 87,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-07-16",
      "dayIndex": 16,
      "steps": 6602,
      "hrBpm": 67,
      "systolicBp": 109,
      "diastolicBp": 92,
      "medStatus": "unconfirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-07-17",
      "dayIndex": 17,
      "steps": 6389,
      "hrBpm": 67,
      "systolicBp": 110,
      "diastolicBp": 82,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-07-18",
      "dayIndex": 18,
      "steps": 5976,
      "hrBpm": 72,
      "systolicBp": 116,
      "diastolicBp": 91,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-07-19",
      "dayIndex": 19,
      "steps": 6439,
      "hrBpm": 66,
      "systolicBp": 111,
      "diastolicBp": 85,
      "medStatus": "unconfirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-07-20",
      "dayIndex": 20,
      "steps": 6124,
      "hrBpm": 66,
      "systolicBp": 120,
      "diastolicBp": 91,
      "medStatus": "unconfirmed",
      "riskScore": 12,
      "signals": [
        "3 unconfirmed meds this week"
      ]
    },
    {
      "date": "2026-07-21",
      "dayIndex": 21,
      "steps": 6158,
      "hrBpm": 68,
      "systolicBp": 110,
      "diastolicBp": 92,
      "medStatus": "confirmed",
      "riskScore": 12,
      "signals": [
        "3 unconfirmed meds this week"
      ]
    },
    {
      "date": "2026-07-22",
      "dayIndex": 22,
      "steps": 6641,
      "hrBpm": 66,
      "systolicBp": 115,
      "diastolicBp": 90,
      "medStatus": "confirmed",
      "riskScore": 12,
      "signals": [
        "3 unconfirmed meds this week"
      ]
    },
    {
      "date": "2026-07-23",
      "dayIndex": 23,
      "steps": 6100,
      "hrBpm": 68,
      "systolicBp": 110,
      "diastolicBp": 82,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-07-24",
      "dayIndex": 24,
      "steps": 5536,
      "hrBpm": 66,
      "systolicBp": 109,
      "diastolicBp": 85,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-07-25",
      "dayIndex": 25,
      "steps": 6619,
      "hrBpm": 66,
      "systolicBp": 113,
      "diastolicBp": 80,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-07-26",
      "dayIndex": 26,
      "steps": 5824,
      "hrBpm": 76,
      "systolicBp": 120,
      "diastolicBp": 94,
      "medStatus": "confirmed",
      "riskScore": 16,
      "signals": [
        "Elevated HR (76 bpm)"
      ]
    },
    {
      "date": "2026-07-27",
      "dayIndex": 27,
      "steps": 6977,
      "hrBpm": 65,
      "systolicBp": 119,
      "diastolicBp": 83,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-07-28",
      "dayIndex": 28,
      "steps": 5896,
      "hrBpm": 68,
      "systolicBp": 103,
      "diastolicBp": 88,
      "medStatus": "confirmed",
      "riskScore": 15,
      "signals": [
        "BP drop (103 mmHg)"
      ]
    },
    {
      "date": "2026-07-29",
      "dayIndex": 29,
      "steps": 6275,
      "hrBpm": 69,
      "systolicBp": 117,
      "diastolicBp": 79,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-07-30",
      "dayIndex": 30,
      "steps": 6370,
      "hrBpm": 67,
      "systolicBp": 111,
      "diastolicBp": 81,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-07-31",
      "dayIndex": 31,
      "steps": 6649,
      "hrBpm": 66,
      "systolicBp": 110,
      "diastolicBp": 88,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-08-01",
      "dayIndex": 32,
      "steps": 6978,
      "hrBpm": 66,
      "systolicBp": 110,
      "diastolicBp": 84,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-08-02",
      "dayIndex": 33,
      "steps": 5869,
      "hrBpm": 66,
      "systolicBp": 116,
      "diastolicBp": 83,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-08-03",
      "dayIndex": 34,
      "steps": 6241,
      "hrBpm": 66,
      "systolicBp": 124,
      "diastolicBp": 95,
      "medStatus": "confirmed",
      "riskScore": 9,
      "signals": [
        "Elevated BP (124 mmHg, +2.1 SD)"
      ]
    },
    {
      "date": "2026-08-04",
      "dayIndex": 35,
      "steps": 6759,
      "hrBpm": 68,
      "systolicBp": 122,
      "diastolicBp": 92,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-08-05",
      "dayIndex": 36,
      "steps": 5917,
      "hrBpm": 71,
      "systolicBp": 108,
      "diastolicBp": 90,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-08-06",
      "dayIndex": 37,
      "steps": 7328,
      "hrBpm": 68,
      "systolicBp": 115,
      "diastolicBp": 90,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-08-07",
      "dayIndex": 38,
      "steps": 6184,
      "hrBpm": 71,
      "systolicBp": 113,
      "diastolicBp": 91,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-08-08",
      "dayIndex": 39,
      "steps": 7076,
      "hrBpm": 62,
      "systolicBp": 117,
      "diastolicBp": 89,
      "medStatus": "unconfirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-08-09",
      "dayIndex": 40,
      "steps": 6579,
      "hrBpm": 64,
      "systolicBp": 120,
      "diastolicBp": 89,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-08-10",
      "dayIndex": 41,
      "steps": 6744,
      "hrBpm": 70,
      "systolicBp": 116,
      "diastolicBp": 93,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-08-11",
      "dayIndex": 42,
      "steps": 6263,
      "hrBpm": 70,
      "systolicBp": 116,
      "diastolicBp": 92,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-08-12",
      "dayIndex": 43,
      "steps": 6154,
      "hrBpm": 68,
      "systolicBp": 122,
      "diastolicBp": 88,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-08-13",
      "dayIndex": 44,
      "steps": 6502,
      "hrBpm": 65,
      "systolicBp": 117,
      "diastolicBp": 80,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-08-14",
      "dayIndex": 45,
      "steps": 6295,
      "hrBpm": 63,
      "systolicBp": 115,
      "diastolicBp": 91,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-08-15",
      "dayIndex": 46,
      "steps": 6970,
      "hrBpm": 71,
      "systolicBp": 121,
      "diastolicBp": 86,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-08-16",
      "dayIndex": 47,
      "steps": 6671,
      "hrBpm": 67,
      "systolicBp": 108,
      "diastolicBp": 84,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-08-17",
      "dayIndex": 48,
      "steps": 6717,
      "hrBpm": 65,
      "systolicBp": 114,
      "diastolicBp": 86,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-08-18",
      "dayIndex": 49,
      "steps": 6912,
      "hrBpm": 68,
      "systolicBp": 114,
      "diastolicBp": 90,
      "medStatus": "unconfirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-08-19",
      "dayIndex": 50,
      "steps": 6832,
      "hrBpm": 71,
      "systolicBp": 114,
      "diastolicBp": 91,
      "medStatus": "unconfirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-08-20",
      "dayIndex": 51,
      "steps": 6050,
      "hrBpm": 72,
      "systolicBp": 125,
      "diastolicBp": 97,
      "medStatus": "confirmed",
      "riskScore": 13,
      "signals": [
        "Elevated BP (125 mmHg, +2.3 SD)"
      ]
    },
    {
      "date": "2026-08-21",
      "dayIndex": 52,
      "steps": 6852,
      "hrBpm": 71,
      "systolicBp": 122,
      "diastolicBp": 84,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-08-22",
      "dayIndex": 53,
      "steps": 6315,
      "hrBpm": 66,
      "systolicBp": 111,
      "diastolicBp": 89,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-08-23",
      "dayIndex": 54,
      "steps": 6352,
      "hrBpm": 76,
      "systolicBp": 110,
      "diastolicBp": 85,
      "medStatus": "confirmed",
      "riskScore": 16,
      "signals": [
        "Elevated HR (76 bpm)"
      ]
    },
    {
      "date": "2026-08-24",
      "dayIndex": 55,
      "steps": 6551,
      "hrBpm": 69,
      "systolicBp": 119,
      "diastolicBp": 90,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-08-25",
      "dayIndex": 56,
      "steps": 7542,
      "hrBpm": 72,
      "systolicBp": 117,
      "diastolicBp": 83,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-08-26",
      "dayIndex": 57,
      "steps": 6202,
      "hrBpm": 67,
      "systolicBp": 116,
      "diastolicBp": 83,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-08-27",
      "dayIndex": 58,
      "steps": 6694,
      "hrBpm": 65,
      "systolicBp": 124,
      "diastolicBp": 89,
      "medStatus": "confirmed",
      "riskScore": 9,
      "signals": [
        "Elevated BP (124 mmHg, +2.1 SD)"
      ]
    },
    {
      "date": "2026-08-28",
      "dayIndex": 59,
      "steps": 7143,
      "hrBpm": 66,
      "systolicBp": 128,
      "diastolicBp": 85,
      "medStatus": "confirmed",
      "riskScore": 22,
      "signals": [
        "Elevated BP (128 mmHg, +3 SD)"
      ]
    },
    {
      "date": "2026-08-29",
      "dayIndex": 60,
      "steps": 7469,
      "hrBpm": 66,
      "systolicBp": 127,
      "diastolicBp": 95,
      "medStatus": "unconfirmed",
      "riskScore": 19,
      "signals": [
        "Elevated BP (127 mmHg, +2.8 SD)"
      ]
    },
    {
      "date": "2026-08-30",
      "dayIndex": 61,
      "steps": 6809,
      "hrBpm": 65,
      "systolicBp": 113,
      "diastolicBp": 82,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-08-31",
      "dayIndex": 62,
      "steps": 6506,
      "hrBpm": 72,
      "systolicBp": 110,
      "diastolicBp": 84,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-09-01",
      "dayIndex": 63,
      "steps": 5540,
      "hrBpm": 68,
      "systolicBp": 115,
      "diastolicBp": 87,
      "medStatus": "unconfirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-09-02",
      "dayIndex": 64,
      "steps": 6244,
      "hrBpm": 64,
      "systolicBp": 116,
      "diastolicBp": 87,
      "medStatus": "unconfirmed",
      "riskScore": 12,
      "signals": [
        "3 unconfirmed meds this week"
      ]
    },
    {
      "date": "2026-09-03",
      "dayIndex": 65,
      "steps": 6641,
      "hrBpm": 74,
      "systolicBp": 127,
      "diastolicBp": 88,
      "medStatus": "confirmed",
      "riskScore": 39,
      "signals": [
        "Elevated BP (127 mmHg, +2.8 SD)",
        "Elevated HR (74 bpm)",
        "3 unconfirmed meds this week"
      ]
    },
    {
      "date": "2026-09-04",
      "dayIndex": 66,
      "steps": 6719,
      "hrBpm": 66,
      "systolicBp": 112,
      "diastolicBp": 85,
      "medStatus": "confirmed",
      "riskScore": 12,
      "signals": [
        "3 unconfirmed meds this week"
      ]
    },
    {
      "date": "2026-09-05",
      "dayIndex": 67,
      "steps": 5845,
      "hrBpm": 73,
      "systolicBp": 125,
      "diastolicBp": 80,
      "medStatus": "confirmed",
      "riskScore": 13,
      "signals": [
        "Elevated BP (125 mmHg, +2.3 SD)"
      ]
    },
    {
      "date": "2026-09-06",
      "dayIndex": 68,
      "steps": 6261,
      "hrBpm": 65,
      "systolicBp": 119,
      "diastolicBp": 83,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-09-07",
      "dayIndex": 69,
      "steps": 7551,
      "hrBpm": 66,
      "systolicBp": 121,
      "diastolicBp": 87,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-09-08",
      "dayIndex": 70,
      "steps": 5688,
      "hrBpm": 68,
      "systolicBp": 115,
      "diastolicBp": 84,
      "medStatus": "unconfirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-09-09",
      "dayIndex": 71,
      "steps": 6011,
      "hrBpm": 65,
      "systolicBp": 111,
      "diastolicBp": 88,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-09-10",
      "dayIndex": 72,
      "steps": 5990,
      "hrBpm": 71,
      "systolicBp": 111,
      "diastolicBp": 81,
      "medStatus": "unconfirmed",
      "riskScore": 10,
      "signals": [
        "Reported fatigue / low activity"
      ]
    },
    {
      "date": "2026-09-11",
      "dayIndex": 73,
      "steps": 5865,
      "hrBpm": 68,
      "systolicBp": 117,
      "diastolicBp": 87,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-09-12",
      "dayIndex": 74,
      "steps": 5892,
      "hrBpm": 71,
      "systolicBp": 116,
      "diastolicBp": 83,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-09-13",
      "dayIndex": 75,
      "steps": 5736,
      "hrBpm": 67,
      "systolicBp": 117,
      "diastolicBp": 83,
      "medStatus": "confirmed",
      "riskScore": 10,
      "signals": [
        "Reported fatigue / low activity"
      ]
    },
    {
      "date": "2026-09-14",
      "dayIndex": 76,
      "steps": 5741,
      "hrBpm": 71,
      "systolicBp": 125,
      "diastolicBp": 84,
      "medStatus": "unconfirmed",
      "riskScore": 25,
      "signals": [
        "Elevated BP (125 mmHg, +2.3 SD)",
        "3 unconfirmed meds this week"
      ]
    },
    {
      "date": "2026-09-15",
      "dayIndex": 77,
      "steps": 5944,
      "hrBpm": 68,
      "systolicBp": 107,
      "diastolicBp": 88,
      "medStatus": "confirmed",
      "riskScore": 10,
      "signals": [
        "Reported fatigue / low activity"
      ]
    },
    {
      "date": "2026-09-16",
      "dayIndex": 78,
      "steps": 5309,
      "hrBpm": 66,
      "systolicBp": 122,
      "diastolicBp": 96,
      "medStatus": "confirmed",
      "riskScore": 10,
      "signals": [
        "Reported fatigue / low activity"
      ]
    },
    {
      "date": "2026-09-17",
      "dayIndex": 79,
      "steps": 6110,
      "hrBpm": 74,
      "systolicBp": 112,
      "diastolicBp": 84,
      "medStatus": "unconfirmed",
      "riskScore": 8,
      "signals": [
        "Elevated HR (74 bpm)"
      ]
    },
    {
      "date": "2026-09-18",
      "dayIndex": 80,
      "steps": 5531,
      "hrBpm": 66,
      "systolicBp": 118,
      "diastolicBp": 83,
      "medStatus": "unconfirmed",
      "riskScore": 12,
      "signals": [
        "3 unconfirmed meds this week"
      ]
    },
    {
      "date": "2026-09-19",
      "dayIndex": 81,
      "steps": 5635,
      "hrBpm": 65,
      "systolicBp": 119,
      "diastolicBp": 86,
      "medStatus": "confirmed",
      "riskScore": 22,
      "signals": [
        "3 unconfirmed meds this week",
        "Reported fatigue / low activity"
      ]
    },
    {
      "date": "2026-09-20",
      "dayIndex": 82,
      "steps": 4626,
      "hrBpm": 68,
      "systolicBp": 113,
      "diastolicBp": 85,
      "medStatus": "confirmed",
      "riskScore": 12,
      "signals": [
        "3 unconfirmed meds this week"
      ]
    },
    {
      "date": "2026-09-21",
      "dayIndex": 83,
      "steps": 5285,
      "hrBpm": 68,
      "systolicBp": 124,
      "diastolicBp": 83,
      "medStatus": "confirmed",
      "riskScore": 9,
      "signals": [
        "Elevated BP (124 mmHg, +2.1 SD)"
      ]
    },
    {
      "date": "2026-09-22",
      "dayIndex": 84,
      "steps": 5043,
      "hrBpm": 72,
      "systolicBp": 114,
      "diastolicBp": 90,
      "medStatus": "unconfirmed",
      "riskScore": 22,
      "signals": [
        "3 unconfirmed meds this week",
        "Reported fatigue / low activity"
      ]
    },
    {
      "date": "2026-09-23",
      "dayIndex": 85,
      "steps": 5256,
      "hrBpm": 65,
      "systolicBp": 120,
      "diastolicBp": 88,
      "medStatus": "confirmed",
      "riskScore": 12,
      "signals": [
        "3 unconfirmed meds this week"
      ]
    },
    {
      "date": "2026-09-24",
      "dayIndex": 86,
      "steps": 4244,
      "hrBpm": 68,
      "systolicBp": 125,
      "diastolicBp": 84,
      "medStatus": "unconfirmed",
      "riskScore": 25,
      "signals": [
        "Elevated BP (125 mmHg, +2.3 SD)",
        "3 unconfirmed meds this week"
      ]
    },
    {
      "date": "2026-09-25",
      "dayIndex": 87,
      "steps": 5652,
      "hrBpm": 72,
      "systolicBp": 120,
      "diastolicBp": 90,
      "medStatus": "confirmed",
      "riskScore": 10,
      "signals": [
        "Reported fatigue / low activity"
      ]
    },
    {
      "date": "2026-09-26",
      "dayIndex": 88,
      "steps": 5061,
      "hrBpm": 69,
      "systolicBp": 121,
      "diastolicBp": 90,
      "medStatus": "unconfirmed",
      "riskScore": 12,
      "signals": [
        "3 unconfirmed meds this week"
      ]
    },
    {
      "date": "2026-09-27",
      "dayIndex": 89,
      "steps": 5472,
      "hrBpm": 72,
      "systolicBp": 124,
      "diastolicBp": 78,
      "medStatus": "unconfirmed",
      "riskScore": 24,
      "signals": [
        "Elevated BP (124 mmHg, +2.1 SD)",
        "4 unconfirmed meds this week"
      ]
    },
    {
      "date": "2026-09-28",
      "dayIndex": 90,
      "steps": 5560,
      "hrBpm": 71,
      "systolicBp": 118,
      "diastolicBp": 91,
      "medStatus": "confirmed",
      "riskScore": 25,
      "signals": [
        "4 unconfirmed meds this week",
        "Reported fatigue / low activity"
      ]
    }
  ],
  "SW008": [
    {
      "date": "2026-07-01",
      "dayIndex": 1,
      "steps": 6240,
      "hrBpm": 73,
      "systolicBp": 127,
      "diastolicBp": 66,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-07-02",
      "dayIndex": 2,
      "steps": 6092,
      "hrBpm": 70,
      "systolicBp": 118,
      "diastolicBp": 68,
      "medStatus": "unconfirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-07-03",
      "dayIndex": 3,
      "steps": 6127,
      "hrBpm": 72,
      "systolicBp": 122,
      "diastolicBp": 70,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-07-04",
      "dayIndex": 4,
      "steps": 5895,
      "hrBpm": 65,
      "systolicBp": 129,
      "diastolicBp": 73,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-07-05",
      "dayIndex": 5,
      "steps": 6029,
      "hrBpm": 69,
      "systolicBp": 120,
      "diastolicBp": 71,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-07-06",
      "dayIndex": 6,
      "steps": 5236,
      "hrBpm": 69,
      "systolicBp": 121,
      "diastolicBp": 64,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-07-07",
      "dayIndex": 7,
      "steps": 6847,
      "hrBpm": 70,
      "systolicBp": 113,
      "diastolicBp": 68,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-07-08",
      "dayIndex": 8,
      "steps": 6399,
      "hrBpm": 68,
      "systolicBp": 115,
      "diastolicBp": 67,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-07-09",
      "dayIndex": 9,
      "steps": 5192,
      "hrBpm": 66,
      "systolicBp": 120,
      "diastolicBp": 76,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-07-10",
      "dayIndex": 10,
      "steps": 5935,
      "hrBpm": 71,
      "systolicBp": 107,
      "diastolicBp": 69,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-07-11",
      "dayIndex": 11,
      "steps": 6081,
      "hrBpm": 73,
      "systolicBp": 123,
      "diastolicBp": 69,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-07-12",
      "dayIndex": 12,
      "steps": 5870,
      "hrBpm": 69,
      "systolicBp": 104,
      "diastolicBp": 63,
      "medStatus": "confirmed",
      "riskScore": 15,
      "signals": [
        "BP drop (104 mmHg)"
      ]
    },
    {
      "date": "2026-07-13",
      "dayIndex": 13,
      "steps": 5085,
      "hrBpm": 66,
      "systolicBp": 122,
      "diastolicBp": 70,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-07-14",
      "dayIndex": 14,
      "steps": 6187,
      "hrBpm": 74,
      "systolicBp": 117,
      "diastolicBp": 68,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-07-15",
      "dayIndex": 15,
      "steps": 6000,
      "hrBpm": 72,
      "systolicBp": 111,
      "diastolicBp": 65,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-07-16",
      "dayIndex": 16,
      "steps": 6013,
      "hrBpm": 68,
      "systolicBp": 123,
      "diastolicBp": 63,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-07-17",
      "dayIndex": 17,
      "steps": 6773,
      "hrBpm": 69,
      "systolicBp": 121,
      "diastolicBp": 65,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-07-18",
      "dayIndex": 18,
      "steps": 6886,
      "hrBpm": 68,
      "systolicBp": 113,
      "diastolicBp": 73,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-07-19",
      "dayIndex": 19,
      "steps": 5711,
      "hrBpm": 75,
      "systolicBp": 114,
      "diastolicBp": 66,
      "medStatus": "confirmed",
      "riskScore": 8,
      "signals": [
        "Elevated HR (75 bpm)"
      ]
    },
    {
      "date": "2026-07-20",
      "dayIndex": 20,
      "steps": 6177,
      "hrBpm": 73,
      "systolicBp": 132,
      "diastolicBp": 66,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-07-21",
      "dayIndex": 21,
      "steps": 6143,
      "hrBpm": 66,
      "systolicBp": 110,
      "diastolicBp": 67,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-07-22",
      "dayIndex": 22,
      "steps": 6080,
      "hrBpm": 66,
      "systolicBp": 124,
      "diastolicBp": 71,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-07-23",
      "dayIndex": 23,
      "steps": 5450,
      "hrBpm": 69,
      "systolicBp": 118,
      "diastolicBp": 68,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-07-24",
      "dayIndex": 24,
      "steps": 6230,
      "hrBpm": 68,
      "systolicBp": 131,
      "diastolicBp": 72,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-07-25",
      "dayIndex": 25,
      "steps": 6268,
      "hrBpm": 68,
      "systolicBp": 134,
      "diastolicBp": 70,
      "medStatus": "confirmed",
      "riskScore": 10,
      "signals": [
        "Elevated BP (134 mmHg, +2.1 SD)"
      ]
    },
    {
      "date": "2026-07-26",
      "dayIndex": 26,
      "steps": 6046,
      "hrBpm": 67,
      "systolicBp": 117,
      "diastolicBp": 72,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-07-27",
      "dayIndex": 27,
      "steps": 6110,
      "hrBpm": 66,
      "systolicBp": 116,
      "diastolicBp": 70,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-07-28",
      "dayIndex": 28,
      "steps": 6620,
      "hrBpm": 70,
      "systolicBp": 120,
      "diastolicBp": 69,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-07-29",
      "dayIndex": 29,
      "steps": 5775,
      "hrBpm": 68,
      "systolicBp": 123,
      "diastolicBp": 70,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-07-30",
      "dayIndex": 30,
      "steps": 5588,
      "hrBpm": 71,
      "systolicBp": 114,
      "diastolicBp": 60,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-07-31",
      "dayIndex": 31,
      "steps": 5940,
      "hrBpm": 68,
      "systolicBp": 115,
      "diastolicBp": 70,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-08-01",
      "dayIndex": 32,
      "steps": 6034,
      "hrBpm": 67,
      "systolicBp": 118,
      "diastolicBp": 67,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-08-02",
      "dayIndex": 33,
      "steps": 7075,
      "hrBpm": 65,
      "systolicBp": 118,
      "diastolicBp": 73,
      "medStatus": "unconfirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-08-03",
      "dayIndex": 34,
      "steps": 6488,
      "hrBpm": 68,
      "systolicBp": 119,
      "diastolicBp": 64,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-08-04",
      "dayIndex": 35,
      "steps": 6600,
      "hrBpm": 68,
      "systolicBp": 115,
      "diastolicBp": 66,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-08-05",
      "dayIndex": 36,
      "steps": 6587,
      "hrBpm": 73,
      "systolicBp": 114,
      "diastolicBp": 73,
      "medStatus": "unconfirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-08-06",
      "dayIndex": 37,
      "steps": 5939,
      "hrBpm": 69,
      "systolicBp": 116,
      "diastolicBp": 76,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-08-07",
      "dayIndex": 38,
      "steps": 5807,
      "hrBpm": 68,
      "systolicBp": 114,
      "diastolicBp": 71,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-08-08",
      "dayIndex": 39,
      "steps": 5930,
      "hrBpm": 72,
      "systolicBp": 125,
      "diastolicBp": 70,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-08-09",
      "dayIndex": 40,
      "steps": 5356,
      "hrBpm": 70,
      "systolicBp": 108,
      "diastolicBp": 73,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-08-10",
      "dayIndex": 41,
      "steps": 6074,
      "hrBpm": 70,
      "systolicBp": 119,
      "diastolicBp": 64,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-08-11",
      "dayIndex": 42,
      "steps": 6251,
      "hrBpm": 71,
      "systolicBp": 115,
      "diastolicBp": 60,
      "medStatus": "unconfirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-08-12",
      "dayIndex": 43,
      "steps": 6188,
      "hrBpm": 70,
      "systolicBp": 110,
      "diastolicBp": 69,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-08-13",
      "dayIndex": 44,
      "steps": 6129,
      "hrBpm": 70,
      "systolicBp": 111,
      "diastolicBp": 66,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-08-14",
      "dayIndex": 45,
      "steps": 6410,
      "hrBpm": 72,
      "systolicBp": 114,
      "diastolicBp": 68,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-08-15",
      "dayIndex": 46,
      "steps": 5956,
      "hrBpm": 73,
      "systolicBp": 109,
      "diastolicBp": 65,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-08-16",
      "dayIndex": 47,
      "steps": 5946,
      "hrBpm": 74,
      "systolicBp": 125,
      "diastolicBp": 64,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-08-17",
      "dayIndex": 48,
      "steps": 6694,
      "hrBpm": 70,
      "systolicBp": 112,
      "diastolicBp": 66,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-08-18",
      "dayIndex": 49,
      "steps": 6460,
      "hrBpm": 70,
      "systolicBp": 118,
      "diastolicBp": 65,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-08-19",
      "dayIndex": 50,
      "steps": 6681,
      "hrBpm": 70,
      "systolicBp": 113,
      "diastolicBp": 61,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-08-20",
      "dayIndex": 51,
      "steps": 6191,
      "hrBpm": 69,
      "systolicBp": 119,
      "diastolicBp": 62,
      "medStatus": "unconfirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-08-21",
      "dayIndex": 52,
      "steps": 5810,
      "hrBpm": 70,
      "systolicBp": 115,
      "diastolicBp": 76,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-08-22",
      "dayIndex": 53,
      "steps": 5991,
      "hrBpm": 70,
      "systolicBp": 116,
      "diastolicBp": 66,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-08-23",
      "dayIndex": 54,
      "steps": 6390,
      "hrBpm": 71,
      "systolicBp": 122,
      "diastolicBp": 76,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-08-24",
      "dayIndex": 55,
      "steps": 6441,
      "hrBpm": 69,
      "systolicBp": 124,
      "diastolicBp": 66,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-08-25",
      "dayIndex": 56,
      "steps": 6347,
      "hrBpm": 69,
      "systolicBp": 121,
      "diastolicBp": 69,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-08-26",
      "dayIndex": 57,
      "steps": 6007,
      "hrBpm": 68,
      "systolicBp": 118,
      "diastolicBp": 69,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-08-27",
      "dayIndex": 58,
      "steps": 6332,
      "hrBpm": 68,
      "systolicBp": 121,
      "diastolicBp": 70,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-08-28",
      "dayIndex": 59,
      "steps": 6548,
      "hrBpm": 72,
      "systolicBp": 122,
      "diastolicBp": 66,
      "medStatus": "unconfirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-08-29",
      "dayIndex": 60,
      "steps": 5547,
      "hrBpm": 70,
      "systolicBp": 132,
      "diastolicBp": 64,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-08-30",
      "dayIndex": 61,
      "steps": 6388,
      "hrBpm": 69,
      "systolicBp": 105,
      "diastolicBp": 67,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-08-31",
      "dayIndex": 62,
      "steps": 5811,
      "hrBpm": 64,
      "systolicBp": 131,
      "diastolicBp": 69,
      "medStatus": "unconfirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-09-01",
      "dayIndex": 63,
      "steps": 5729,
      "hrBpm": 65,
      "systolicBp": 114,
      "diastolicBp": 66,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-09-02",
      "dayIndex": 64,
      "steps": 6411,
      "hrBpm": 66,
      "systolicBp": 129,
      "diastolicBp": 69,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-09-03",
      "dayIndex": 65,
      "steps": 5648,
      "hrBpm": 67,
      "systolicBp": 121,
      "diastolicBp": 63,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-09-04",
      "dayIndex": 66,
      "steps": 6338,
      "hrBpm": 67,
      "systolicBp": 119,
      "diastolicBp": 66,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-09-05",
      "dayIndex": 67,
      "steps": 5842,
      "hrBpm": 73,
      "systolicBp": 124,
      "diastolicBp": 68,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-09-06",
      "dayIndex": 68,
      "steps": 5177,
      "hrBpm": 70,
      "systolicBp": 109,
      "diastolicBp": 69,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-09-07",
      "dayIndex": 69,
      "steps": 6545,
      "hrBpm": 71,
      "systolicBp": 126,
      "diastolicBp": 68,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-09-08",
      "dayIndex": 70,
      "steps": 5755,
      "hrBpm": 71,
      "systolicBp": 126,
      "diastolicBp": 69,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-09-09",
      "dayIndex": 71,
      "steps": 6451,
      "hrBpm": 67,
      "systolicBp": 120,
      "diastolicBp": 67,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-09-10",
      "dayIndex": 72,
      "steps": 5806,
      "hrBpm": 64,
      "systolicBp": 117,
      "diastolicBp": 75,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-09-11",
      "dayIndex": 73,
      "steps": 6090,
      "hrBpm": 73,
      "systolicBp": 124,
      "diastolicBp": 73,
      "medStatus": "unconfirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-09-12",
      "dayIndex": 74,
      "steps": 5466,
      "hrBpm": 68,
      "systolicBp": 125,
      "diastolicBp": 67,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-09-13",
      "dayIndex": 75,
      "steps": 5527,
      "hrBpm": 73,
      "systolicBp": 112,
      "diastolicBp": 63,
      "medStatus": "confirmed",
      "riskScore": 10,
      "signals": [
        "Reported fatigue / low activity"
      ]
    },
    {
      "date": "2026-09-14",
      "dayIndex": 76,
      "steps": 5496,
      "hrBpm": 67,
      "systolicBp": 111,
      "diastolicBp": 67,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-09-15",
      "dayIndex": 77,
      "steps": 6100,
      "hrBpm": 75,
      "systolicBp": 116,
      "diastolicBp": 61,
      "medStatus": "unconfirmed",
      "riskScore": 18,
      "signals": [
        "Elevated HR (75 bpm)",
        "Reported fatigue / low activity"
      ]
    },
    {
      "date": "2026-09-16",
      "dayIndex": 78,
      "steps": 5695,
      "hrBpm": 72,
      "systolicBp": 116,
      "diastolicBp": 72,
      "medStatus": "confirmed",
      "riskScore": 10,
      "signals": [
        "Reported fatigue / low activity"
      ]
    },
    {
      "date": "2026-09-17",
      "dayIndex": 79,
      "steps": 5979,
      "hrBpm": 64,
      "systolicBp": 123,
      "diastolicBp": 62,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-09-18",
      "dayIndex": 80,
      "steps": 4967,
      "hrBpm": 77,
      "systolicBp": 125,
      "diastolicBp": 67,
      "medStatus": "confirmed",
      "riskScore": 16,
      "signals": [
        "Elevated HR (77 bpm)"
      ]
    },
    {
      "date": "2026-09-19",
      "dayIndex": 81,
      "steps": 6494,
      "hrBpm": 70,
      "systolicBp": 118,
      "diastolicBp": 71,
      "medStatus": "unconfirmed",
      "riskScore": 10,
      "signals": [
        "Reported fatigue / low activity"
      ]
    },
    {
      "date": "2026-09-20",
      "dayIndex": 82,
      "steps": 5467,
      "hrBpm": 67,
      "systolicBp": 119,
      "diastolicBp": 71,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-09-21",
      "dayIndex": 83,
      "steps": 4443,
      "hrBpm": 73,
      "systolicBp": 125,
      "diastolicBp": 66,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-09-22",
      "dayIndex": 84,
      "steps": 4182,
      "hrBpm": 67,
      "systolicBp": 119,
      "diastolicBp": 62,
      "medStatus": "confirmed",
      "riskScore": 10,
      "signals": [
        "Reported fatigue / low activity"
      ]
    },
    {
      "date": "2026-09-23",
      "dayIndex": 85,
      "steps": 5566,
      "hrBpm": 73,
      "systolicBp": 115,
      "diastolicBp": 63,
      "medStatus": "unconfirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-09-24",
      "dayIndex": 86,
      "steps": 4771,
      "hrBpm": 67,
      "systolicBp": 117,
      "diastolicBp": 66,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-09-25",
      "dayIndex": 87,
      "steps": 5095,
      "hrBpm": 72,
      "systolicBp": 129,
      "diastolicBp": 71,
      "medStatus": "confirmed",
      "riskScore": 10,
      "signals": [
        "Reported fatigue / low activity"
      ]
    },
    {
      "date": "2026-09-26",
      "dayIndex": 88,
      "steps": 5196,
      "hrBpm": 72,
      "systolicBp": 124,
      "diastolicBp": 71,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-09-27",
      "dayIndex": 89,
      "steps": 4082,
      "hrBpm": 72,
      "systolicBp": 112,
      "diastolicBp": 64,
      "medStatus": "unconfirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-09-28",
      "dayIndex": 90,
      "steps": 4811,
      "hrBpm": 68,
      "systolicBp": 123,
      "diastolicBp": 69,
      "medStatus": "confirmed",
      "riskScore": 10,
      "signals": [
        "Reported fatigue / low activity"
      ]
    }
  ],
  "SW009": [
    {
      "date": "2026-07-01",
      "dayIndex": 1,
      "steps": 2237,
      "hrBpm": 64,
      "systolicBp": 136,
      "diastolicBp": 81,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-07-02",
      "dayIndex": 2,
      "steps": 1465,
      "hrBpm": 65,
      "systolicBp": 146,
      "diastolicBp": 89,
      "medStatus": "unconfirmed",
      "riskScore": 16,
      "signals": [
        "Activity reduced (-45% steps)"
      ]
    },
    {
      "date": "2026-07-03",
      "dayIndex": 3,
      "steps": 2611,
      "hrBpm": 66,
      "systolicBp": 140,
      "diastolicBp": 90,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-07-04",
      "dayIndex": 4,
      "steps": 2424,
      "hrBpm": 67,
      "systolicBp": 137,
      "diastolicBp": 83,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-07-05",
      "dayIndex": 5,
      "steps": 3220,
      "hrBpm": 62,
      "systolicBp": 137,
      "diastolicBp": 88,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-07-06",
      "dayIndex": 6,
      "steps": 2583,
      "hrBpm": 63,
      "systolicBp": 147,
      "diastolicBp": 86,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-07-07",
      "dayIndex": 7,
      "steps": 2464,
      "hrBpm": 64,
      "systolicBp": 143,
      "diastolicBp": 88,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-07-08",
      "dayIndex": 8,
      "steps": 2623,
      "hrBpm": 65,
      "systolicBp": 134,
      "diastolicBp": 83,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-07-09",
      "dayIndex": 9,
      "steps": 2367,
      "hrBpm": 66,
      "systolicBp": 132,
      "diastolicBp": 86,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-07-10",
      "dayIndex": 10,
      "steps": 3133,
      "hrBpm": 69,
      "systolicBp": 135,
      "diastolicBp": 86,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-07-11",
      "dayIndex": 11,
      "steps": 2431,
      "hrBpm": 67,
      "systolicBp": 144,
      "diastolicBp": 92,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-07-12",
      "dayIndex": 12,
      "steps": 1925,
      "hrBpm": 69,
      "systolicBp": 135,
      "diastolicBp": 85,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-07-13",
      "dayIndex": 13,
      "steps": 2862,
      "hrBpm": 64,
      "systolicBp": 133,
      "diastolicBp": 88,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-07-14",
      "dayIndex": 14,
      "steps": 2509,
      "hrBpm": 63,
      "systolicBp": 129,
      "diastolicBp": 87,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-07-15",
      "dayIndex": 15,
      "steps": 2537,
      "hrBpm": 60,
      "systolicBp": 138,
      "diastolicBp": 87,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-07-16",
      "dayIndex": 16,
      "steps": 3381,
      "hrBpm": 65,
      "systolicBp": 144,
      "diastolicBp": 84,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-07-17",
      "dayIndex": 17,
      "steps": 1910,
      "hrBpm": 63,
      "systolicBp": 143,
      "diastolicBp": 82,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-07-18",
      "dayIndex": 18,
      "steps": 3301,
      "hrBpm": 64,
      "systolicBp": 138,
      "diastolicBp": 84,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-07-19",
      "dayIndex": 19,
      "steps": 2733,
      "hrBpm": 69,
      "systolicBp": 126,
      "diastolicBp": 82,
      "medStatus": "confirmed",
      "riskScore": 15,
      "signals": [
        "BP drop (126 mmHg)"
      ]
    },
    {
      "date": "2026-07-20",
      "dayIndex": 20,
      "steps": 3470,
      "hrBpm": 63,
      "systolicBp": 137,
      "diastolicBp": 85,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-07-21",
      "dayIndex": 21,
      "steps": 2458,
      "hrBpm": 70,
      "systolicBp": 146,
      "diastolicBp": 83,
      "medStatus": "confirmed",
      "riskScore": 6,
      "signals": [
        "Elevated HR (70 bpm)"
      ]
    },
    {
      "date": "2026-07-22",
      "dayIndex": 22,
      "steps": 2440,
      "hrBpm": 62,
      "systolicBp": 134,
      "diastolicBp": 83,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-07-23",
      "dayIndex": 23,
      "steps": 2364,
      "hrBpm": 65,
      "systolicBp": 139,
      "diastolicBp": 83,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-07-24",
      "dayIndex": 24,
      "steps": 2825,
      "hrBpm": 65,
      "systolicBp": 133,
      "diastolicBp": 87,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-07-25",
      "dayIndex": 25,
      "steps": 3293,
      "hrBpm": 64,
      "systolicBp": 131,
      "diastolicBp": 84,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-07-26",
      "dayIndex": 26,
      "steps": 3036,
      "hrBpm": 60,
      "systolicBp": 134,
      "diastolicBp": 80,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-07-27",
      "dayIndex": 27,
      "steps": 2959,
      "hrBpm": 64,
      "systolicBp": 139,
      "diastolicBp": 82,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-07-28",
      "dayIndex": 28,
      "steps": 2537,
      "hrBpm": 66,
      "systolicBp": 138,
      "diastolicBp": 83,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-07-29",
      "dayIndex": 29,
      "steps": 3093,
      "hrBpm": 66,
      "systolicBp": 139,
      "diastolicBp": 89,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-07-30",
      "dayIndex": 30,
      "steps": 2980,
      "hrBpm": 67,
      "systolicBp": 144,
      "diastolicBp": 89,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-07-31",
      "dayIndex": 31,
      "steps": 1756,
      "hrBpm": 64,
      "systolicBp": 134,
      "diastolicBp": 87,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-08-01",
      "dayIndex": 32,
      "steps": 3301,
      "hrBpm": 63,
      "systolicBp": 139,
      "diastolicBp": 90,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-08-02",
      "dayIndex": 33,
      "steps": 1933,
      "hrBpm": 67,
      "systolicBp": 130,
      "diastolicBp": 78,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-08-03",
      "dayIndex": 34,
      "steps": 2641,
      "hrBpm": 63,
      "systolicBp": 135,
      "diastolicBp": 77,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-08-04",
      "dayIndex": 35,
      "steps": 2467,
      "hrBpm": 67,
      "systolicBp": 139,
      "diastolicBp": 87,
      "medStatus": "unconfirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-08-05",
      "dayIndex": 36,
      "steps": 2632,
      "hrBpm": 68,
      "systolicBp": 141,
      "diastolicBp": 79,
      "medStatus": "unconfirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-08-06",
      "dayIndex": 37,
      "steps": 2997,
      "hrBpm": 65,
      "systolicBp": 138,
      "diastolicBp": 88,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-08-07",
      "dayIndex": 38,
      "steps": 2740,
      "hrBpm": 66,
      "systolicBp": 135,
      "diastolicBp": 89,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-08-08",
      "dayIndex": 39,
      "steps": 2412,
      "hrBpm": 65,
      "systolicBp": 117,
      "diastolicBp": 82,
      "medStatus": "confirmed",
      "riskScore": 15,
      "signals": [
        "BP drop (117 mmHg)"
      ]
    },
    {
      "date": "2026-08-09",
      "dayIndex": 40,
      "steps": 2884,
      "hrBpm": 69,
      "systolicBp": 131,
      "diastolicBp": 84,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-08-10",
      "dayIndex": 41,
      "steps": 2670,
      "hrBpm": 67,
      "systolicBp": 135,
      "diastolicBp": 83,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-08-11",
      "dayIndex": 42,
      "steps": 2460,
      "hrBpm": 63,
      "systolicBp": 135,
      "diastolicBp": 82,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-08-12",
      "dayIndex": 43,
      "steps": 2315,
      "hrBpm": 62,
      "systolicBp": 131,
      "diastolicBp": 87,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-08-13",
      "dayIndex": 44,
      "steps": 2871,
      "hrBpm": 68,
      "systolicBp": 133,
      "diastolicBp": 87,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-08-14",
      "dayIndex": 45,
      "steps": 2234,
      "hrBpm": 61,
      "systolicBp": 143,
      "diastolicBp": 84,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-08-15",
      "dayIndex": 46,
      "steps": 2746,
      "hrBpm": 68,
      "systolicBp": 141,
      "diastolicBp": 86,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-08-16",
      "dayIndex": 47,
      "steps": 2069,
      "hrBpm": 62,
      "systolicBp": 135,
      "diastolicBp": 93,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-08-17",
      "dayIndex": 48,
      "steps": 2460,
      "hrBpm": 67,
      "systolicBp": 127,
      "diastolicBp": 79,
      "medStatus": "confirmed",
      "riskScore": 15,
      "signals": [
        "BP drop (127 mmHg)"
      ]
    },
    {
      "date": "2026-08-18",
      "dayIndex": 49,
      "steps": 1984,
      "hrBpm": 61,
      "systolicBp": 132,
      "diastolicBp": 82,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-08-19",
      "dayIndex": 50,
      "steps": 2689,
      "hrBpm": 59,
      "systolicBp": 136,
      "diastolicBp": 91,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-08-20",
      "dayIndex": 51,
      "steps": 2573,
      "hrBpm": 64,
      "systolicBp": 133,
      "diastolicBp": 82,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-08-21",
      "dayIndex": 52,
      "steps": 2756,
      "hrBpm": 63,
      "systolicBp": 133,
      "diastolicBp": 84,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-08-22",
      "dayIndex": 53,
      "steps": 2127,
      "hrBpm": 64,
      "systolicBp": 135,
      "diastolicBp": 83,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-08-23",
      "dayIndex": 54,
      "steps": 3235,
      "hrBpm": 68,
      "systolicBp": 134,
      "diastolicBp": 82,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-08-24",
      "dayIndex": 55,
      "steps": 3013,
      "hrBpm": 61,
      "systolicBp": 146,
      "diastolicBp": 79,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-08-25",
      "dayIndex": 56,
      "steps": 3181,
      "hrBpm": 64,
      "systolicBp": 137,
      "diastolicBp": 89,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-08-26",
      "dayIndex": 57,
      "steps": 2367,
      "hrBpm": 61,
      "systolicBp": 135,
      "diastolicBp": 85,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-08-27",
      "dayIndex": 58,
      "steps": 2098,
      "hrBpm": 67,
      "systolicBp": 141,
      "diastolicBp": 79,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-08-28",
      "dayIndex": 59,
      "steps": 1769,
      "hrBpm": 63,
      "systolicBp": 140,
      "diastolicBp": 85,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-08-29",
      "dayIndex": 60,
      "steps": 3012,
      "hrBpm": 65,
      "systolicBp": 143,
      "diastolicBp": 80,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-08-30",
      "dayIndex": 61,
      "steps": 2214,
      "hrBpm": 65,
      "systolicBp": 135,
      "diastolicBp": 86,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-08-31",
      "dayIndex": 62,
      "steps": 2559,
      "hrBpm": 65,
      "systolicBp": 143,
      "diastolicBp": 84,
      "medStatus": "unconfirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-09-01",
      "dayIndex": 63,
      "steps": 3155,
      "hrBpm": 70,
      "systolicBp": 131,
      "diastolicBp": 85,
      "medStatus": "unconfirmed",
      "riskScore": 6,
      "signals": [
        "Elevated HR (70 bpm)"
      ]
    },
    {
      "date": "2026-09-02",
      "dayIndex": 64,
      "steps": 2941,
      "hrBpm": 70,
      "systolicBp": 156,
      "diastolicBp": 82,
      "medStatus": "confirmed",
      "riskScore": 35,
      "signals": [
        "Elevated BP (156 mmHg, +3.5 SD)",
        "Elevated HR (70 bpm)"
      ]
    },
    {
      "date": "2026-09-03",
      "dayIndex": 65,
      "steps": 2775,
      "hrBpm": 62,
      "systolicBp": 136,
      "diastolicBp": 86,
      "medStatus": "unconfirmed",
      "riskScore": 12,
      "signals": [
        "3 unconfirmed meds this week"
      ]
    },
    {
      "date": "2026-09-04",
      "dayIndex": 66,
      "steps": 2879,
      "hrBpm": 71,
      "systolicBp": 142,
      "diastolicBp": 84,
      "medStatus": "confirmed",
      "riskScore": 32,
      "signals": [
        "Elevated HR (71 bpm)",
        "3 unconfirmed meds this week",
        "Reported fatigue / low activity"
      ]
    },
    {
      "date": "2026-09-05",
      "dayIndex": 67,
      "steps": 2230,
      "hrBpm": 72,
      "systolicBp": 139,
      "diastolicBp": 80,
      "medStatus": "confirmed",
      "riskScore": 26,
      "signals": [
        "Elevated HR (72 bpm)",
        "3 unconfirmed meds this week"
      ]
    },
    {
      "date": "2026-09-06",
      "dayIndex": 68,
      "steps": 2105,
      "hrBpm": 68,
      "systolicBp": 144,
      "diastolicBp": 80,
      "medStatus": "confirmed",
      "riskScore": 12,
      "signals": [
        "3 unconfirmed meds this week"
      ]
    },
    {
      "date": "2026-09-07",
      "dayIndex": 69,
      "steps": 1665,
      "hrBpm": 70,
      "systolicBp": 134,
      "diastolicBp": 89,
      "medStatus": "unconfirmed",
      "riskScore": 41,
      "signals": [
        "Elevated HR (70 bpm)",
        "Activity reduced (-38% steps)",
        "3 unconfirmed meds this week",
        "Reported fatigue / low activity"
      ]
    },
    {
      "date": "2026-09-08",
      "dayIndex": 70,
      "steps": 2025,
      "hrBpm": 69,
      "systolicBp": 136,
      "diastolicBp": 83,
      "medStatus": "confirmed",
      "riskScore": 10,
      "signals": [
        "Reported fatigue / low activity"
      ]
    },
    {
      "date": "2026-09-09",
      "dayIndex": 71,
      "steps": 2177,
      "hrBpm": 64,
      "systolicBp": 142,
      "diastolicBp": 80,
      "medStatus": "unconfirmed",
      "riskScore": 12,
      "signals": [
        "3 unconfirmed meds this week"
      ]
    },
    {
      "date": "2026-09-10",
      "dayIndex": 72,
      "steps": 2492,
      "hrBpm": 66,
      "systolicBp": 138,
      "diastolicBp": 84,
      "medStatus": "confirmed",
      "riskScore": 10,
      "signals": [
        "Reported fatigue / low activity"
      ]
    },
    {
      "date": "2026-09-11",
      "dayIndex": 73,
      "steps": 1726,
      "hrBpm": 68,
      "systolicBp": 145,
      "diastolicBp": 88,
      "medStatus": "unconfirmed",
      "riskScore": 24,
      "signals": [
        "Activity reduced (-35% steps)",
        "3 unconfirmed meds this week"
      ]
    },
    {
      "date": "2026-09-12",
      "dayIndex": 74,
      "steps": 1428,
      "hrBpm": 66,
      "systolicBp": 132,
      "diastolicBp": 86,
      "medStatus": "confirmed",
      "riskScore": 28,
      "signals": [
        "Activity reduced (-47% steps)",
        "3 unconfirmed meds this week"
      ]
    },
    {
      "date": "2026-09-13",
      "dayIndex": 75,
      "steps": 1452,
      "hrBpm": 68,
      "systolicBp": 144,
      "diastolicBp": 80,
      "medStatus": "confirmed",
      "riskScore": 38,
      "signals": [
        "Activity reduced (-46% steps)",
        "3 unconfirmed meds this week",
        "Reported fatigue / low activity"
      ]
    },
    {
      "date": "2026-09-14",
      "dayIndex": 76,
      "steps": 1678,
      "hrBpm": 70,
      "systolicBp": 125,
      "diastolicBp": 88,
      "medStatus": "confirmed",
      "riskScore": 34,
      "signals": [
        "BP drop (125 mmHg)",
        "Elevated HR (70 bpm)",
        "Activity reduced (-37% steps)"
      ]
    },
    {
      "date": "2026-09-15",
      "dayIndex": 77,
      "steps": 1145,
      "hrBpm": 70,
      "systolicBp": 132,
      "diastolicBp": 85,
      "medStatus": "unconfirmed",
      "riskScore": 48,
      "signals": [
        "Elevated HR (70 bpm)",
        "Activity reduced (-57% steps)",
        "3 unconfirmed meds this week",
        "Reported fatigue / low activity"
      ]
    },
    {
      "date": "2026-09-16",
      "dayIndex": 78,
      "steps": 1865,
      "hrBpm": 63,
      "systolicBp": 124,
      "diastolicBp": 83,
      "medStatus": "confirmed",
      "riskScore": 25,
      "signals": [
        "BP drop (124 mmHg)",
        "Reported fatigue / low activity"
      ]
    },
    {
      "date": "2026-09-17",
      "dayIndex": 79,
      "steps": 1587,
      "hrBpm": 66,
      "systolicBp": 141,
      "diastolicBp": 83,
      "medStatus": "confirmed",
      "riskScore": 14,
      "signals": [
        "Activity reduced (-41% steps)"
      ]
    },
    {
      "date": "2026-09-18",
      "dayIndex": 80,
      "steps": 1383,
      "hrBpm": 65,
      "systolicBp": 139,
      "diastolicBp": 87,
      "medStatus": "confirmed",
      "riskScore": 17,
      "signals": [
        "Activity reduced (-48% steps)"
      ]
    },
    {
      "date": "2026-09-19",
      "dayIndex": 81,
      "steps": 1735,
      "hrBpm": 71,
      "systolicBp": 141,
      "diastolicBp": 73,
      "medStatus": "unconfirmed",
      "riskScore": 32,
      "signals": [
        "Elevated HR (71 bpm)",
        "Activity reduced (-35% steps)",
        "Reported fatigue / low activity"
      ]
    },
    {
      "date": "2026-09-20",
      "dayIndex": 82,
      "steps": 1133,
      "hrBpm": 68,
      "systolicBp": 136,
      "diastolicBp": 90,
      "medStatus": "confirmed",
      "riskScore": 20,
      "signals": [
        "Activity reduced (-58% steps)"
      ]
    },
    {
      "date": "2026-09-21",
      "dayIndex": 83,
      "steps": 583,
      "hrBpm": 66,
      "systolicBp": 134,
      "diastolicBp": 86,
      "medStatus": "confirmed",
      "riskScore": 25,
      "signals": [
        "Activity reduced (-78% steps)"
      ]
    },
    {
      "date": "2026-09-22",
      "dayIndex": 84,
      "steps": 316,
      "hrBpm": 69,
      "systolicBp": 143,
      "diastolicBp": 92,
      "medStatus": "unconfirmed",
      "riskScore": 35,
      "signals": [
        "Activity reduced (-88% steps)",
        "Reported fatigue / low activity"
      ]
    },
    {
      "date": "2026-09-23",
      "dayIndex": 85,
      "steps": 1149,
      "hrBpm": 70,
      "systolicBp": 147,
      "diastolicBp": 85,
      "medStatus": "unconfirmed",
      "riskScore": 38,
      "signals": [
        "Elevated HR (70 bpm)",
        "Activity reduced (-57% steps)",
        "3 unconfirmed meds this week"
      ]
    },
    {
      "date": "2026-09-24",
      "dayIndex": 86,
      "steps": 262,
      "hrBpm": 67,
      "systolicBp": 142,
      "diastolicBp": 87,
      "medStatus": "confirmed",
      "riskScore": 37,
      "signals": [
        "Activity reduced (-90% steps)",
        "3 unconfirmed meds this week"
      ]
    },
    {
      "date": "2026-09-25",
      "dayIndex": 87,
      "steps": 1012,
      "hrBpm": 74,
      "systolicBp": 141,
      "diastolicBp": 81,
      "medStatus": "unconfirmed",
      "riskScore": 67,
      "signals": [
        "Elevated HR (74 bpm)",
        "Activity reduced (-62% steps)",
        "4 unconfirmed meds this week",
        "Reported fatigue / low activity"
      ]
    },
    {
      "date": "2026-09-26",
      "dayIndex": 88,
      "steps": 446,
      "hrBpm": 71,
      "systolicBp": 134,
      "diastolicBp": 89,
      "medStatus": "confirmed",
      "riskScore": 47,
      "signals": [
        "Elevated HR (71 bpm)",
        "Activity reduced (-83% steps)",
        "3 unconfirmed meds this week"
      ]
    },
    {
      "date": "2026-09-27",
      "dayIndex": 89,
      "steps": 246,
      "hrBpm": 69,
      "systolicBp": 140,
      "diastolicBp": 83,
      "medStatus": "unconfirmed",
      "riskScore": 40,
      "signals": [
        "Activity reduced (-91% steps)",
        "4 unconfirmed meds this week"
      ]
    },
    {
      "date": "2026-09-28",
      "dayIndex": 90,
      "steps": 150,
      "hrBpm": 74,
      "systolicBp": 134,
      "diastolicBp": 84,
      "medStatus": "confirmed",
      "riskScore": 70,
      "signals": [
        "Elevated HR (74 bpm)",
        "Activity reduced (-94% steps)",
        "4 unconfirmed meds this week",
        "Reported fatigue / low activity"
      ]
    }
  ],
  "SW010": [
    {
      "date": "2026-07-01",
      "dayIndex": 1,
      "steps": 2764,
      "hrBpm": 72,
      "systolicBp": 138,
      "diastolicBp": 79,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-07-02",
      "dayIndex": 2,
      "steps": 2452,
      "hrBpm": 78,
      "systolicBp": 130,
      "diastolicBp": 68,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-07-03",
      "dayIndex": 3,
      "steps": 3076,
      "hrBpm": 78,
      "systolicBp": 132,
      "diastolicBp": 74,
      "medStatus": "unconfirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-07-04",
      "dayIndex": 4,
      "steps": 2540,
      "hrBpm": 76,
      "systolicBp": 136,
      "diastolicBp": 69,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-07-05",
      "dayIndex": 5,
      "steps": 2722,
      "hrBpm": 78,
      "systolicBp": 129,
      "diastolicBp": 68,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-07-06",
      "dayIndex": 6,
      "steps": 2366,
      "hrBpm": 77,
      "systolicBp": 136,
      "diastolicBp": 69,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-07-07",
      "dayIndex": 7,
      "steps": 3273,
      "hrBpm": 75,
      "systolicBp": 131,
      "diastolicBp": 74,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-07-08",
      "dayIndex": 8,
      "steps": 2202,
      "hrBpm": 79,
      "systolicBp": 126,
      "diastolicBp": 67,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-07-09",
      "dayIndex": 9,
      "steps": 2416,
      "hrBpm": 81,
      "systolicBp": 123,
      "diastolicBp": 79,
      "medStatus": "unconfirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-07-10",
      "dayIndex": 10,
      "steps": 3393,
      "hrBpm": 81,
      "systolicBp": 137,
      "diastolicBp": 76,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-07-11",
      "dayIndex": 11,
      "steps": 2212,
      "hrBpm": 77,
      "systolicBp": 135,
      "diastolicBp": 75,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-07-12",
      "dayIndex": 12,
      "steps": 2727,
      "hrBpm": 77,
      "systolicBp": 139,
      "diastolicBp": 76,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-07-13",
      "dayIndex": 13,
      "steps": 2784,
      "hrBpm": 80,
      "systolicBp": 138,
      "diastolicBp": 77,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-07-14",
      "dayIndex": 14,
      "steps": 2276,
      "hrBpm": 77,
      "systolicBp": 128,
      "diastolicBp": 78,
      "medStatus": "unconfirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-07-15",
      "dayIndex": 15,
      "steps": 3248,
      "hrBpm": 76,
      "systolicBp": 140,
      "diastolicBp": 62,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-07-16",
      "dayIndex": 16,
      "steps": 2868,
      "hrBpm": 74,
      "systolicBp": 127,
      "diastolicBp": 76,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-07-17",
      "dayIndex": 17,
      "steps": 2547,
      "hrBpm": 74,
      "systolicBp": 138,
      "diastolicBp": 69,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-07-18",
      "dayIndex": 18,
      "steps": 2052,
      "hrBpm": 85,
      "systolicBp": 130,
      "diastolicBp": 78,
      "medStatus": "confirmed",
      "riskScore": 13,
      "signals": [
        "Elevated HR (85 bpm)"
      ]
    },
    {
      "date": "2026-07-19",
      "dayIndex": 19,
      "steps": 1964,
      "hrBpm": 73,
      "systolicBp": 133,
      "diastolicBp": 67,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-07-20",
      "dayIndex": 20,
      "steps": 2433,
      "hrBpm": 79,
      "systolicBp": 135,
      "diastolicBp": 76,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-07-21",
      "dayIndex": 21,
      "steps": 3048,
      "hrBpm": 79,
      "systolicBp": 124,
      "diastolicBp": 80,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-07-22",
      "dayIndex": 22,
      "steps": 1857,
      "hrBpm": 73,
      "systolicBp": 138,
      "diastolicBp": 68,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-07-23",
      "dayIndex": 23,
      "steps": 2664,
      "hrBpm": 78,
      "systolicBp": 133,
      "diastolicBp": 74,
      "medStatus": "unconfirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-07-24",
      "dayIndex": 24,
      "steps": 2689,
      "hrBpm": 71,
      "systolicBp": 140,
      "diastolicBp": 76,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-07-25",
      "dayIndex": 25,
      "steps": 2775,
      "hrBpm": 78,
      "systolicBp": 127,
      "diastolicBp": 79,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-07-26",
      "dayIndex": 26,
      "steps": 3681,
      "hrBpm": 74,
      "systolicBp": 138,
      "diastolicBp": 71,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-07-27",
      "dayIndex": 27,
      "steps": 2658,
      "hrBpm": 75,
      "systolicBp": 127,
      "diastolicBp": 76,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-07-28",
      "dayIndex": 28,
      "steps": 2586,
      "hrBpm": 78,
      "systolicBp": 131,
      "diastolicBp": 72,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-07-29",
      "dayIndex": 29,
      "steps": 2967,
      "hrBpm": 77,
      "systolicBp": 128,
      "diastolicBp": 67,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-07-30",
      "dayIndex": 30,
      "steps": 2094,
      "hrBpm": 77,
      "systolicBp": 127,
      "diastolicBp": 77,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-07-31",
      "dayIndex": 31,
      "steps": 3712,
      "hrBpm": 83,
      "systolicBp": 134,
      "diastolicBp": 75,
      "medStatus": "confirmed",
      "riskScore": 6,
      "signals": [
        "Elevated HR (83 bpm)"
      ]
    },
    {
      "date": "2026-08-01",
      "dayIndex": 32,
      "steps": 3544,
      "hrBpm": 75,
      "systolicBp": 132,
      "diastolicBp": 81,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-08-02",
      "dayIndex": 33,
      "steps": 2047,
      "hrBpm": 77,
      "systolicBp": 136,
      "diastolicBp": 73,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-08-03",
      "dayIndex": 34,
      "steps": 2787,
      "hrBpm": 75,
      "systolicBp": 132,
      "diastolicBp": 73,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-08-04",
      "dayIndex": 35,
      "steps": 1716,
      "hrBpm": 75,
      "systolicBp": 124,
      "diastolicBp": 74,
      "medStatus": "confirmed",
      "riskScore": 12,
      "signals": [
        "Activity reduced (-35% steps)"
      ]
    },
    {
      "date": "2026-08-05",
      "dayIndex": 36,
      "steps": 3131,
      "hrBpm": 77,
      "systolicBp": 133,
      "diastolicBp": 69,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-08-06",
      "dayIndex": 37,
      "steps": 2695,
      "hrBpm": 80,
      "systolicBp": 135,
      "diastolicBp": 75,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-08-07",
      "dayIndex": 38,
      "steps": 2365,
      "hrBpm": 72,
      "systolicBp": 143,
      "diastolicBp": 75,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-08-08",
      "dayIndex": 39,
      "steps": 2264,
      "hrBpm": 79,
      "systolicBp": 137,
      "diastolicBp": 68,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-08-09",
      "dayIndex": 40,
      "steps": 2050,
      "hrBpm": 76,
      "systolicBp": 141,
      "diastolicBp": 72,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-08-10",
      "dayIndex": 41,
      "steps": 2295,
      "hrBpm": 77,
      "systolicBp": 133,
      "diastolicBp": 67,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-08-11",
      "dayIndex": 42,
      "steps": 3239,
      "hrBpm": 79,
      "systolicBp": 126,
      "diastolicBp": 70,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-08-12",
      "dayIndex": 43,
      "steps": 2456,
      "hrBpm": 82,
      "systolicBp": 141,
      "diastolicBp": 76,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-08-13",
      "dayIndex": 44,
      "steps": 3050,
      "hrBpm": 81,
      "systolicBp": 146,
      "diastolicBp": 72,
      "medStatus": "confirmed",
      "riskScore": 17,
      "signals": [
        "Elevated BP (146 mmHg, +2.6 SD)"
      ]
    },
    {
      "date": "2026-08-14",
      "dayIndex": 45,
      "steps": 2949,
      "hrBpm": 75,
      "systolicBp": 138,
      "diastolicBp": 75,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-08-15",
      "dayIndex": 46,
      "steps": 1641,
      "hrBpm": 74,
      "systolicBp": 139,
      "diastolicBp": 71,
      "medStatus": "confirmed",
      "riskScore": 13,
      "signals": [
        "Activity reduced (-38% steps)"
      ]
    },
    {
      "date": "2026-08-16",
      "dayIndex": 47,
      "steps": 3144,
      "hrBpm": 73,
      "systolicBp": 137,
      "diastolicBp": 76,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-08-17",
      "dayIndex": 48,
      "steps": 2244,
      "hrBpm": 81,
      "systolicBp": 139,
      "diastolicBp": 75,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-08-18",
      "dayIndex": 49,
      "steps": 3139,
      "hrBpm": 79,
      "systolicBp": 129,
      "diastolicBp": 78,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-08-19",
      "dayIndex": 50,
      "steps": 2662,
      "hrBpm": 79,
      "systolicBp": 130,
      "diastolicBp": 68,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-08-20",
      "dayIndex": 51,
      "steps": 2785,
      "hrBpm": 75,
      "systolicBp": 144,
      "diastolicBp": 72,
      "medStatus": "confirmed",
      "riskScore": 11,
      "signals": [
        "Elevated BP (144 mmHg, +2.2 SD)"
      ]
    },
    {
      "date": "2026-08-21",
      "dayIndex": 52,
      "steps": 2622,
      "hrBpm": 80,
      "systolicBp": 135,
      "diastolicBp": 76,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-08-22",
      "dayIndex": 53,
      "steps": 3103,
      "hrBpm": 73,
      "systolicBp": 142,
      "diastolicBp": 75,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-08-23",
      "dayIndex": 54,
      "steps": 2925,
      "hrBpm": 76,
      "systolicBp": 133,
      "diastolicBp": 73,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-08-24",
      "dayIndex": 55,
      "steps": 2308,
      "hrBpm": 77,
      "systolicBp": 120,
      "diastolicBp": 78,
      "medStatus": "confirmed",
      "riskScore": 15,
      "signals": [
        "BP drop (120 mmHg)"
      ]
    },
    {
      "date": "2026-08-25",
      "dayIndex": 56,
      "steps": 2538,
      "hrBpm": 78,
      "systolicBp": 137,
      "diastolicBp": 76,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-08-26",
      "dayIndex": 57,
      "steps": 3321,
      "hrBpm": 78,
      "systolicBp": 133,
      "diastolicBp": 69,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-08-27",
      "dayIndex": 58,
      "steps": 3252,
      "hrBpm": 74,
      "systolicBp": 144,
      "diastolicBp": 70,
      "medStatus": "confirmed",
      "riskScore": 11,
      "signals": [
        "Elevated BP (144 mmHg, +2.2 SD)"
      ]
    },
    {
      "date": "2026-08-28",
      "dayIndex": 59,
      "steps": 3261,
      "hrBpm": 74,
      "systolicBp": 142,
      "diastolicBp": 81,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-08-29",
      "dayIndex": 60,
      "steps": 2958,
      "hrBpm": 77,
      "systolicBp": 136,
      "diastolicBp": 66,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-08-30",
      "dayIndex": 61,
      "steps": 3024,
      "hrBpm": 77,
      "systolicBp": 137,
      "diastolicBp": 69,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-08-31",
      "dayIndex": 62,
      "steps": 3368,
      "hrBpm": 75,
      "systolicBp": 126,
      "diastolicBp": 72,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-09-01",
      "dayIndex": 63,
      "steps": 2388,
      "hrBpm": 71,
      "systolicBp": 134,
      "diastolicBp": 81,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-09-02",
      "dayIndex": 64,
      "steps": 2054,
      "hrBpm": 75,
      "systolicBp": 131,
      "diastolicBp": 70,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-09-03",
      "dayIndex": 65,
      "steps": 3145,
      "hrBpm": 77,
      "systolicBp": 133,
      "diastolicBp": 74,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-09-04",
      "dayIndex": 66,
      "steps": 2208,
      "hrBpm": 78,
      "systolicBp": 146,
      "diastolicBp": 69,
      "medStatus": "unconfirmed",
      "riskScore": 27,
      "signals": [
        "Elevated BP (146 mmHg, +2.6 SD)",
        "Reported fatigue / low activity"
      ]
    },
    {
      "date": "2026-09-05",
      "dayIndex": 67,
      "steps": 2141,
      "hrBpm": 74,
      "systolicBp": 137,
      "diastolicBp": 71,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-09-06",
      "dayIndex": 68,
      "steps": 2806,
      "hrBpm": 75,
      "systolicBp": 133,
      "diastolicBp": 68,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-09-07",
      "dayIndex": 69,
      "steps": 2045,
      "hrBpm": 87,
      "systolicBp": 127,
      "diastolicBp": 77,
      "medStatus": "confirmed",
      "riskScore": 29,
      "signals": [
        "Elevated HR (87 bpm)",
        "Reported fatigue / low activity"
      ]
    },
    {
      "date": "2026-09-08",
      "dayIndex": 70,
      "steps": 2411,
      "hrBpm": 80,
      "systolicBp": 137,
      "diastolicBp": 68,
      "medStatus": "unconfirmed",
      "riskScore": 10,
      "signals": [
        "Reported fatigue / low activity"
      ]
    },
    {
      "date": "2026-09-09",
      "dayIndex": 71,
      "steps": 1833,
      "hrBpm": 74,
      "systolicBp": 129,
      "diastolicBp": 70,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-09-10",
      "dayIndex": 72,
      "steps": 2027,
      "hrBpm": 80,
      "systolicBp": 134,
      "diastolicBp": 68,
      "medStatus": "confirmed",
      "riskScore": 10,
      "signals": [
        "Reported fatigue / low activity"
      ]
    },
    {
      "date": "2026-09-11",
      "dayIndex": 73,
      "steps": 2066,
      "hrBpm": 81,
      "systolicBp": 127,
      "diastolicBp": 72,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-09-12",
      "dayIndex": 74,
      "steps": 1703,
      "hrBpm": 77,
      "systolicBp": 142,
      "diastolicBp": 73,
      "medStatus": "unconfirmed",
      "riskScore": 13,
      "signals": [
        "Activity reduced (-36% steps)"
      ]
    },
    {
      "date": "2026-09-13",
      "dayIndex": 75,
      "steps": 1783,
      "hrBpm": 79,
      "systolicBp": 140,
      "diastolicBp": 79,
      "medStatus": "confirmed",
      "riskScore": 10,
      "signals": [
        "Reported fatigue / low activity"
      ]
    },
    {
      "date": "2026-09-14",
      "dayIndex": 76,
      "steps": 1656,
      "hrBpm": 79,
      "systolicBp": 126,
      "diastolicBp": 74,
      "medStatus": "confirmed",
      "riskScore": 13,
      "signals": [
        "Activity reduced (-37% steps)"
      ]
    },
    {
      "date": "2026-09-15",
      "dayIndex": 77,
      "steps": 1451,
      "hrBpm": 79,
      "systolicBp": 133,
      "diastolicBp": 71,
      "medStatus": "confirmed",
      "riskScore": 26,
      "signals": [
        "Activity reduced (-45% steps)",
        "Reported fatigue / low activity"
      ]
    },
    {
      "date": "2026-09-16",
      "dayIndex": 78,
      "steps": 2214,
      "hrBpm": 81,
      "systolicBp": 131,
      "diastolicBp": 71,
      "medStatus": "unconfirmed",
      "riskScore": 10,
      "signals": [
        "Reported fatigue / low activity"
      ]
    },
    {
      "date": "2026-09-17",
      "dayIndex": 79,
      "steps": 1629,
      "hrBpm": 78,
      "systolicBp": 143,
      "diastolicBp": 77,
      "medStatus": "confirmed",
      "riskScore": 13,
      "signals": [
        "Activity reduced (-38% steps)"
      ]
    },
    {
      "date": "2026-09-18",
      "dayIndex": 80,
      "steps": 2114,
      "hrBpm": 71,
      "systolicBp": 135,
      "diastolicBp": 70,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-09-19",
      "dayIndex": 81,
      "steps": 1394,
      "hrBpm": 78,
      "systolicBp": 136,
      "diastolicBp": 70,
      "medStatus": "confirmed",
      "riskScore": 26,
      "signals": [
        "Activity reduced (-47% steps)",
        "Reported fatigue / low activity"
      ]
    },
    {
      "date": "2026-09-20",
      "dayIndex": 82,
      "steps": 1334,
      "hrBpm": 80,
      "systolicBp": 151,
      "diastolicBp": 68,
      "medStatus": "unconfirmed",
      "riskScore": 48,
      "signals": [
        "Elevated BP (151 mmHg, +3.6 SD)",
        "Activity reduced (-50% steps)"
      ]
    },
    {
      "date": "2026-09-21",
      "dayIndex": 83,
      "steps": 669,
      "hrBpm": 78,
      "systolicBp": 139,
      "diastolicBp": 68,
      "medStatus": "confirmed",
      "riskScore": 25,
      "signals": [
        "Activity reduced (-75% steps)"
      ]
    },
    {
      "date": "2026-09-22",
      "dayIndex": 84,
      "steps": 1401,
      "hrBpm": 76,
      "systolicBp": 151,
      "diastolicBp": 71,
      "medStatus": "confirmed",
      "riskScore": 56,
      "signals": [
        "Elevated BP (151 mmHg, +3.6 SD)",
        "Activity reduced (-47% steps)",
        "Reported fatigue / low activity"
      ]
    },
    {
      "date": "2026-09-23",
      "dayIndex": 85,
      "steps": 643,
      "hrBpm": 80,
      "systolicBp": 148,
      "diastolicBp": 70,
      "medStatus": "confirmed",
      "riskScore": 48,
      "signals": [
        "Elevated BP (148 mmHg, +3 SD)",
        "Activity reduced (-76% steps)"
      ]
    },
    {
      "date": "2026-09-24",
      "dayIndex": 86,
      "steps": 150,
      "hrBpm": 78,
      "systolicBp": 140,
      "diastolicBp": 70,
      "medStatus": "unconfirmed",
      "riskScore": 25,
      "signals": [
        "Activity reduced (-94% steps)"
      ]
    },
    {
      "date": "2026-09-25",
      "dayIndex": 87,
      "steps": 584,
      "hrBpm": 75,
      "systolicBp": 142,
      "diastolicBp": 70,
      "medStatus": "unconfirmed",
      "riskScore": 47,
      "signals": [
        "Activity reduced (-78% steps)",
        "3 unconfirmed meds this week",
        "Reported fatigue / low activity"
      ]
    },
    {
      "date": "2026-09-26",
      "dayIndex": 88,
      "steps": 289,
      "hrBpm": 80,
      "systolicBp": 145,
      "diastolicBp": 76,
      "medStatus": "confirmed",
      "riskScore": 50,
      "signals": [
        "Elevated BP (145 mmHg, +2.4 SD)",
        "Activity reduced (-89% steps)",
        "3 unconfirmed meds this week"
      ]
    },
    {
      "date": "2026-09-27",
      "dayIndex": 89,
      "steps": 150,
      "hrBpm": 78,
      "systolicBp": 138,
      "diastolicBp": 65,
      "medStatus": "confirmed",
      "riskScore": 25,
      "signals": [
        "Activity reduced (-94% steps)"
      ]
    },
    {
      "date": "2026-09-28",
      "dayIndex": 90,
      "steps": 217,
      "hrBpm": 80,
      "systolicBp": 140,
      "diastolicBp": 80,
      "medStatus": "unconfirmed",
      "riskScore": 47,
      "signals": [
        "Activity reduced (-92% steps)",
        "3 unconfirmed meds this week",
        "Reported fatigue / low activity"
      ]
    }
  ],
  "SW011": [
    {
      "date": "2026-07-01",
      "dayIndex": 1,
      "steps": 2613,
      "hrBpm": 68,
      "systolicBp": 109,
      "diastolicBp": 71,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-07-02",
      "dayIndex": 2,
      "steps": 1513,
      "hrBpm": 69,
      "systolicBp": 102,
      "diastolicBp": 65,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-07-03",
      "dayIndex": 3,
      "steps": 1756,
      "hrBpm": 66,
      "systolicBp": 103,
      "diastolicBp": 79,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-07-04",
      "dayIndex": 4,
      "steps": 1956,
      "hrBpm": 64,
      "systolicBp": 116,
      "diastolicBp": 66,
      "medStatus": "unconfirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-07-05",
      "dayIndex": 5,
      "steps": 2616,
      "hrBpm": 65,
      "systolicBp": 97,
      "diastolicBp": 72,
      "medStatus": "confirmed",
      "riskScore": 15,
      "signals": [
        "BP drop (97 mmHg)"
      ]
    },
    {
      "date": "2026-07-06",
      "dayIndex": 6,
      "steps": 2058,
      "hrBpm": 63,
      "systolicBp": 111,
      "diastolicBp": 65,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-07-07",
      "dayIndex": 7,
      "steps": 2534,
      "hrBpm": 67,
      "systolicBp": 113,
      "diastolicBp": 69,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-07-08",
      "dayIndex": 8,
      "steps": 2349,
      "hrBpm": 66,
      "systolicBp": 116,
      "diastolicBp": 70,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-07-09",
      "dayIndex": 9,
      "steps": 2138,
      "hrBpm": 67,
      "systolicBp": 114,
      "diastolicBp": 77,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-07-10",
      "dayIndex": 10,
      "steps": 1712,
      "hrBpm": 61,
      "systolicBp": 111,
      "diastolicBp": 67,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-07-11",
      "dayIndex": 11,
      "steps": 1796,
      "hrBpm": 65,
      "systolicBp": 117,
      "diastolicBp": 78,
      "medStatus": "unconfirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-07-12",
      "dayIndex": 12,
      "steps": 2194,
      "hrBpm": 66,
      "systolicBp": 110,
      "diastolicBp": 75,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-07-13",
      "dayIndex": 13,
      "steps": 3189,
      "hrBpm": 66,
      "systolicBp": 110,
      "diastolicBp": 77,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-07-14",
      "dayIndex": 14,
      "steps": 1942,
      "hrBpm": 66,
      "systolicBp": 115,
      "diastolicBp": 66,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-07-15",
      "dayIndex": 15,
      "steps": 2879,
      "hrBpm": 72,
      "systolicBp": 121,
      "diastolicBp": 68,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-07-16",
      "dayIndex": 16,
      "steps": 2302,
      "hrBpm": 68,
      "systolicBp": 109,
      "diastolicBp": 71,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-07-17",
      "dayIndex": 17,
      "steps": 2165,
      "hrBpm": 66,
      "systolicBp": 115,
      "diastolicBp": 76,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-07-18",
      "dayIndex": 18,
      "steps": 1922,
      "hrBpm": 69,
      "systolicBp": 116,
      "diastolicBp": 69,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-07-19",
      "dayIndex": 19,
      "steps": 2575,
      "hrBpm": 67,
      "systolicBp": 104,
      "diastolicBp": 72,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-07-20",
      "dayIndex": 20,
      "steps": 1019,
      "hrBpm": 68,
      "systolicBp": 110,
      "diastolicBp": 79,
      "medStatus": "confirmed",
      "riskScore": 19,
      "signals": [
        "Activity reduced (-53% steps)"
      ]
    },
    {
      "date": "2026-07-21",
      "dayIndex": 21,
      "steps": 2710,
      "hrBpm": 67,
      "systolicBp": 111,
      "diastolicBp": 70,
      "medStatus": "unconfirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-07-22",
      "dayIndex": 22,
      "steps": 1766,
      "hrBpm": 68,
      "systolicBp": 116,
      "diastolicBp": 68,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-07-23",
      "dayIndex": 23,
      "steps": 2089,
      "hrBpm": 74,
      "systolicBp": 102,
      "diastolicBp": 79,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-07-24",
      "dayIndex": 24,
      "steps": 3199,
      "hrBpm": 60,
      "systolicBp": 111,
      "diastolicBp": 66,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-07-25",
      "dayIndex": 25,
      "steps": 1781,
      "hrBpm": 63,
      "systolicBp": 110,
      "diastolicBp": 79,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-07-26",
      "dayIndex": 26,
      "steps": 2615,
      "hrBpm": 69,
      "systolicBp": 116,
      "diastolicBp": 77,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-07-27",
      "dayIndex": 27,
      "steps": 2049,
      "hrBpm": 70,
      "systolicBp": 113,
      "diastolicBp": 67,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-07-28",
      "dayIndex": 28,
      "steps": 2165,
      "hrBpm": 78,
      "systolicBp": 118,
      "diastolicBp": 78,
      "medStatus": "confirmed",
      "riskScore": 15,
      "signals": [
        "Elevated HR (78 bpm)"
      ]
    },
    {
      "date": "2026-07-29",
      "dayIndex": 29,
      "steps": 1684,
      "hrBpm": 60,
      "systolicBp": 121,
      "diastolicBp": 71,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-07-30",
      "dayIndex": 30,
      "steps": 1821,
      "hrBpm": 66,
      "systolicBp": 107,
      "diastolicBp": 82,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-07-31",
      "dayIndex": 31,
      "steps": 1977,
      "hrBpm": 69,
      "systolicBp": 116,
      "diastolicBp": 76,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-08-01",
      "dayIndex": 32,
      "steps": 2503,
      "hrBpm": 63,
      "systolicBp": 109,
      "diastolicBp": 70,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-08-02",
      "dayIndex": 33,
      "steps": 1695,
      "hrBpm": 70,
      "systolicBp": 116,
      "diastolicBp": 73,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-08-03",
      "dayIndex": 34,
      "steps": 2517,
      "hrBpm": 66,
      "systolicBp": 116,
      "diastolicBp": 74,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-08-04",
      "dayIndex": 35,
      "steps": 2524,
      "hrBpm": 61,
      "systolicBp": 109,
      "diastolicBp": 73,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-08-05",
      "dayIndex": 36,
      "steps": 1815,
      "hrBpm": 62,
      "systolicBp": 109,
      "diastolicBp": 75,
      "medStatus": "unconfirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-08-06",
      "dayIndex": 37,
      "steps": 2146,
      "hrBpm": 68,
      "systolicBp": 109,
      "diastolicBp": 68,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-08-07",
      "dayIndex": 38,
      "steps": 2670,
      "hrBpm": 61,
      "systolicBp": 123,
      "diastolicBp": 72,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-08-08",
      "dayIndex": 39,
      "steps": 2321,
      "hrBpm": 65,
      "systolicBp": 120,
      "diastolicBp": 68,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-08-09",
      "dayIndex": 40,
      "steps": 1802,
      "hrBpm": 63,
      "systolicBp": 115,
      "diastolicBp": 72,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-08-10",
      "dayIndex": 41,
      "steps": 2622,
      "hrBpm": 70,
      "systolicBp": 112,
      "diastolicBp": 73,
      "medStatus": "unconfirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-08-11",
      "dayIndex": 42,
      "steps": 1826,
      "hrBpm": 67,
      "systolicBp": 113,
      "diastolicBp": 76,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-08-12",
      "dayIndex": 43,
      "steps": 2340,
      "hrBpm": 74,
      "systolicBp": 111,
      "diastolicBp": 70,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-08-13",
      "dayIndex": 44,
      "steps": 2722,
      "hrBpm": 64,
      "systolicBp": 109,
      "diastolicBp": 70,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-08-14",
      "dayIndex": 45,
      "steps": 2829,
      "hrBpm": 64,
      "systolicBp": 102,
      "diastolicBp": 75,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-08-15",
      "dayIndex": 46,
      "steps": 2355,
      "hrBpm": 68,
      "systolicBp": 107,
      "diastolicBp": 73,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-08-16",
      "dayIndex": 47,
      "steps": 2360,
      "hrBpm": 68,
      "systolicBp": 115,
      "diastolicBp": 78,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-08-17",
      "dayIndex": 48,
      "steps": 1910,
      "hrBpm": 68,
      "systolicBp": 107,
      "diastolicBp": 74,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-08-18",
      "dayIndex": 49,
      "steps": 2192,
      "hrBpm": 66,
      "systolicBp": 106,
      "diastolicBp": 75,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-08-19",
      "dayIndex": 50,
      "steps": 1678,
      "hrBpm": 66,
      "systolicBp": 107,
      "diastolicBp": 73,
      "medStatus": "unconfirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-08-20",
      "dayIndex": 51,
      "steps": 2704,
      "hrBpm": 66,
      "systolicBp": 117,
      "diastolicBp": 71,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-08-21",
      "dayIndex": 52,
      "steps": 1821,
      "hrBpm": 65,
      "systolicBp": 114,
      "diastolicBp": 67,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-08-22",
      "dayIndex": 53,
      "steps": 2723,
      "hrBpm": 71,
      "systolicBp": 106,
      "diastolicBp": 63,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-08-23",
      "dayIndex": 54,
      "steps": 2526,
      "hrBpm": 73,
      "systolicBp": 103,
      "diastolicBp": 75,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-08-24",
      "dayIndex": 55,
      "steps": 2866,
      "hrBpm": 65,
      "systolicBp": 116,
      "diastolicBp": 68,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-08-25",
      "dayIndex": 56,
      "steps": 2642,
      "hrBpm": 65,
      "systolicBp": 117,
      "diastolicBp": 72,
      "medStatus": "unconfirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-08-26",
      "dayIndex": 57,
      "steps": 2279,
      "hrBpm": 69,
      "systolicBp": 105,
      "diastolicBp": 74,
      "medStatus": "unconfirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-08-27",
      "dayIndex": 58,
      "steps": 2486,
      "hrBpm": 67,
      "systolicBp": 107,
      "diastolicBp": 80,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-08-28",
      "dayIndex": 59,
      "steps": 2918,
      "hrBpm": 64,
      "systolicBp": 105,
      "diastolicBp": 75,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-08-29",
      "dayIndex": 60,
      "steps": 2398,
      "hrBpm": 63,
      "systolicBp": 109,
      "diastolicBp": 69,
      "medStatus": "unconfirmed",
      "riskScore": 12,
      "signals": [
        "3 unconfirmed meds this week"
      ]
    },
    {
      "date": "2026-08-30",
      "dayIndex": 61,
      "steps": 1438,
      "hrBpm": 65,
      "systolicBp": 121,
      "diastolicBp": 76,
      "medStatus": "confirmed",
      "riskScore": 12,
      "signals": [
        "3 unconfirmed meds this week"
      ]
    },
    {
      "date": "2026-08-31",
      "dayIndex": 62,
      "steps": 2603,
      "hrBpm": 68,
      "systolicBp": 106,
      "diastolicBp": 77,
      "medStatus": "confirmed",
      "riskScore": 12,
      "signals": [
        "3 unconfirmed meds this week"
      ]
    },
    {
      "date": "2026-09-01",
      "dayIndex": 63,
      "steps": 2476,
      "hrBpm": 69,
      "systolicBp": 112,
      "diastolicBp": 64,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-09-02",
      "dayIndex": 64,
      "steps": 2811,
      "hrBpm": 61,
      "systolicBp": 114,
      "diastolicBp": 74,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-09-03",
      "dayIndex": 65,
      "steps": 2143,
      "hrBpm": 69,
      "systolicBp": 108,
      "diastolicBp": 64,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-09-04",
      "dayIndex": 66,
      "steps": 1898,
      "hrBpm": 68,
      "systolicBp": 111,
      "diastolicBp": 81,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-09-05",
      "dayIndex": 67,
      "steps": 2262,
      "hrBpm": 64,
      "systolicBp": 109,
      "diastolicBp": 71,
      "medStatus": "unconfirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-09-06",
      "dayIndex": 68,
      "steps": 2336,
      "hrBpm": 69,
      "systolicBp": 110,
      "diastolicBp": 73,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-09-07",
      "dayIndex": 69,
      "steps": 1371,
      "hrBpm": 69,
      "systolicBp": 110,
      "diastolicBp": 68,
      "medStatus": "confirmed",
      "riskScore": 23,
      "signals": [
        "Activity reduced (-37% steps)",
        "Reported fatigue / low activity"
      ]
    },
    {
      "date": "2026-09-08",
      "dayIndex": 70,
      "steps": 2170,
      "hrBpm": 73,
      "systolicBp": 115,
      "diastolicBp": 73,
      "medStatus": "confirmed",
      "riskScore": 10,
      "signals": [
        "Reported fatigue / low activity"
      ]
    },
    {
      "date": "2026-09-09",
      "dayIndex": 71,
      "steps": 1179,
      "hrBpm": 68,
      "systolicBp": 118,
      "diastolicBp": 77,
      "medStatus": "unconfirmed",
      "riskScore": 16,
      "signals": [
        "Activity reduced (-46% steps)"
      ]
    },
    {
      "date": "2026-09-10",
      "dayIndex": 72,
      "steps": 1059,
      "hrBpm": 72,
      "systolicBp": 105,
      "diastolicBp": 72,
      "medStatus": "confirmed",
      "riskScore": 28,
      "signals": [
        "Activity reduced (-51% steps)",
        "Reported fatigue / low activity"
      ]
    },
    {
      "date": "2026-09-11",
      "dayIndex": 73,
      "steps": 2260,
      "hrBpm": 69,
      "systolicBp": 111,
      "diastolicBp": 74,
      "medStatus": "unconfirmed",
      "riskScore": 12,
      "signals": [
        "3 unconfirmed meds this week"
      ]
    },
    {
      "date": "2026-09-12",
      "dayIndex": 74,
      "steps": 1578,
      "hrBpm": 72,
      "systolicBp": 114,
      "diastolicBp": 68,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-09-13",
      "dayIndex": 75,
      "steps": 2215,
      "hrBpm": 65,
      "systolicBp": 117,
      "diastolicBp": 67,
      "medStatus": "unconfirmed",
      "riskScore": 22,
      "signals": [
        "3 unconfirmed meds this week",
        "Reported fatigue / low activity"
      ]
    },
    {
      "date": "2026-09-14",
      "dayIndex": 76,
      "steps": 1999,
      "hrBpm": 65,
      "systolicBp": 115,
      "diastolicBp": 72,
      "medStatus": "confirmed",
      "riskScore": 12,
      "signals": [
        "3 unconfirmed meds this week"
      ]
    },
    {
      "date": "2026-09-15",
      "dayIndex": 77,
      "steps": 1384,
      "hrBpm": 68,
      "systolicBp": 125,
      "diastolicBp": 71,
      "medStatus": "confirmed",
      "riskScore": 47,
      "signals": [
        "Elevated BP (125 mmHg, +2.3 SD)",
        "Activity reduced (-36% steps)",
        "3 unconfirmed meds this week",
        "Reported fatigue / low activity"
      ]
    },
    {
      "date": "2026-09-16",
      "dayIndex": 78,
      "steps": 1642,
      "hrBpm": 67,
      "systolicBp": 114,
      "diastolicBp": 69,
      "medStatus": "confirmed",
      "riskScore": 10,
      "signals": [
        "Reported fatigue / low activity"
      ]
    },
    {
      "date": "2026-09-17",
      "dayIndex": 79,
      "steps": 1160,
      "hrBpm": 73,
      "systolicBp": 121,
      "diastolicBp": 72,
      "medStatus": "unconfirmed",
      "riskScore": 28,
      "signals": [
        "Activity reduced (-47% steps)",
        "3 unconfirmed meds this week"
      ]
    },
    {
      "date": "2026-09-18",
      "dayIndex": 80,
      "steps": 1093,
      "hrBpm": 67,
      "systolicBp": 117,
      "diastolicBp": 75,
      "medStatus": "confirmed",
      "riskScore": 18,
      "signals": [
        "Activity reduced (-50% steps)"
      ]
    },
    {
      "date": "2026-09-19",
      "dayIndex": 81,
      "steps": 1461,
      "hrBpm": 70,
      "systolicBp": 112,
      "diastolicBp": 73,
      "medStatus": "confirmed",
      "riskScore": 10,
      "signals": [
        "Reported fatigue / low activity"
      ]
    },
    {
      "date": "2026-09-20",
      "dayIndex": 82,
      "steps": 1201,
      "hrBpm": 64,
      "systolicBp": 115,
      "diastolicBp": 76,
      "medStatus": "confirmed",
      "riskScore": 16,
      "signals": [
        "Activity reduced (-45% steps)"
      ]
    },
    {
      "date": "2026-09-21",
      "dayIndex": 83,
      "steps": 801,
      "hrBpm": 65,
      "systolicBp": 115,
      "diastolicBp": 72,
      "medStatus": "unconfirmed",
      "riskScore": 22,
      "signals": [
        "Activity reduced (-63% steps)"
      ]
    },
    {
      "date": "2026-09-22",
      "dayIndex": 84,
      "steps": 312,
      "hrBpm": 66,
      "systolicBp": 109,
      "diastolicBp": 73,
      "medStatus": "confirmed",
      "riskScore": 35,
      "signals": [
        "Activity reduced (-86% steps)",
        "Reported fatigue / low activity"
      ]
    },
    {
      "date": "2026-09-23",
      "dayIndex": 85,
      "steps": 1845,
      "hrBpm": 66,
      "systolicBp": 122,
      "diastolicBp": 78,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-09-24",
      "dayIndex": 86,
      "steps": 920,
      "hrBpm": 70,
      "systolicBp": 114,
      "diastolicBp": 75,
      "medStatus": "confirmed",
      "riskScore": 20,
      "signals": [
        "Activity reduced (-58% steps)"
      ]
    },
    {
      "date": "2026-09-25",
      "dayIndex": 87,
      "steps": 150,
      "hrBpm": 72,
      "systolicBp": 115,
      "diastolicBp": 62,
      "medStatus": "unconfirmed",
      "riskScore": 35,
      "signals": [
        "Activity reduced (-93% steps)",
        "Reported fatigue / low activity"
      ]
    },
    {
      "date": "2026-09-26",
      "dayIndex": 88,
      "steps": 703,
      "hrBpm": 77,
      "systolicBp": 116,
      "diastolicBp": 78,
      "medStatus": "confirmed",
      "riskScore": 36,
      "signals": [
        "Elevated HR (77 bpm)",
        "Activity reduced (-68% steps)"
      ]
    },
    {
      "date": "2026-09-27",
      "dayIndex": 89,
      "steps": 150,
      "hrBpm": 71,
      "systolicBp": 119,
      "diastolicBp": 68,
      "medStatus": "confirmed",
      "riskScore": 25,
      "signals": [
        "Activity reduced (-93% steps)"
      ]
    },
    {
      "date": "2026-09-28",
      "dayIndex": 90,
      "steps": 150,
      "hrBpm": 65,
      "systolicBp": 120,
      "diastolicBp": 73,
      "medStatus": "confirmed",
      "riskScore": 35,
      "signals": [
        "Activity reduced (-93% steps)",
        "Reported fatigue / low activity"
      ]
    }
  ],
  "SW012": [
    {
      "date": "2026-07-01",
      "dayIndex": 1,
      "steps": 6271,
      "hrBpm": 78,
      "systolicBp": 136,
      "diastolicBp": 74,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-07-02",
      "dayIndex": 2,
      "steps": 6342,
      "hrBpm": 71,
      "systolicBp": 143,
      "diastolicBp": 79,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-07-03",
      "dayIndex": 3,
      "steps": 6820,
      "hrBpm": 71,
      "systolicBp": 134,
      "diastolicBp": 75,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-07-04",
      "dayIndex": 4,
      "steps": 6211,
      "hrBpm": 75,
      "systolicBp": 129,
      "diastolicBp": 79,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-07-05",
      "dayIndex": 5,
      "steps": 6137,
      "hrBpm": 71,
      "systolicBp": 129,
      "diastolicBp": 76,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-07-06",
      "dayIndex": 6,
      "steps": 6321,
      "hrBpm": 77,
      "systolicBp": 137,
      "diastolicBp": 73,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-07-07",
      "dayIndex": 7,
      "steps": 6573,
      "hrBpm": 71,
      "systolicBp": 133,
      "diastolicBp": 87,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-07-08",
      "dayIndex": 8,
      "steps": 6005,
      "hrBpm": 83,
      "systolicBp": 145,
      "diastolicBp": 78,
      "medStatus": "confirmed",
      "riskScore": 13,
      "signals": [
        "Elevated HR (83 bpm)"
      ]
    },
    {
      "date": "2026-07-09",
      "dayIndex": 9,
      "steps": 5808,
      "hrBpm": 74,
      "systolicBp": 140,
      "diastolicBp": 76,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-07-10",
      "dayIndex": 10,
      "steps": 5994,
      "hrBpm": 74,
      "systolicBp": 136,
      "diastolicBp": 77,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-07-11",
      "dayIndex": 11,
      "steps": 6976,
      "hrBpm": 72,
      "systolicBp": 136,
      "diastolicBp": 77,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-07-12",
      "dayIndex": 12,
      "steps": 6998,
      "hrBpm": 73,
      "systolicBp": 129,
      "diastolicBp": 71,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-07-13",
      "dayIndex": 13,
      "steps": 6469,
      "hrBpm": 70,
      "systolicBp": 127,
      "diastolicBp": 81,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-07-14",
      "dayIndex": 14,
      "steps": 6783,
      "hrBpm": 79,
      "systolicBp": 133,
      "diastolicBp": 80,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-07-15",
      "dayIndex": 15,
      "steps": 5820,
      "hrBpm": 77,
      "systolicBp": 139,
      "diastolicBp": 78,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-07-16",
      "dayIndex": 16,
      "steps": 5643,
      "hrBpm": 76,
      "systolicBp": 136,
      "diastolicBp": 79,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-07-17",
      "dayIndex": 17,
      "steps": 6496,
      "hrBpm": 77,
      "systolicBp": 141,
      "diastolicBp": 78,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-07-18",
      "dayIndex": 18,
      "steps": 5945,
      "hrBpm": 75,
      "systolicBp": 131,
      "diastolicBp": 79,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-07-19",
      "dayIndex": 19,
      "steps": 5752,
      "hrBpm": 74,
      "systolicBp": 145,
      "diastolicBp": 80,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-07-20",
      "dayIndex": 20,
      "steps": 6066,
      "hrBpm": 76,
      "systolicBp": 132,
      "diastolicBp": 77,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-07-21",
      "dayIndex": 21,
      "steps": 6541,
      "hrBpm": 76,
      "systolicBp": 148,
      "diastolicBp": 77,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-07-22",
      "dayIndex": 22,
      "steps": 6163,
      "hrBpm": 72,
      "systolicBp": 142,
      "diastolicBp": 80,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-07-23",
      "dayIndex": 23,
      "steps": 5502,
      "hrBpm": 69,
      "systolicBp": 130,
      "diastolicBp": 73,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-07-24",
      "dayIndex": 24,
      "steps": 6701,
      "hrBpm": 76,
      "systolicBp": 141,
      "diastolicBp": 79,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-07-25",
      "dayIndex": 25,
      "steps": 5837,
      "hrBpm": 72,
      "systolicBp": 142,
      "diastolicBp": 79,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-07-26",
      "dayIndex": 26,
      "steps": 6794,
      "hrBpm": 70,
      "systolicBp": 161,
      "diastolicBp": 78,
      "medStatus": "confirmed",
      "riskScore": 29,
      "signals": [
        "Elevated BP (161 mmHg, +3.4 SD)"
      ]
    },
    {
      "date": "2026-07-27",
      "dayIndex": 27,
      "steps": 6021,
      "hrBpm": 73,
      "systolicBp": 136,
      "diastolicBp": 76,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-07-28",
      "dayIndex": 28,
      "steps": 6199,
      "hrBpm": 70,
      "systolicBp": 139,
      "diastolicBp": 80,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-07-29",
      "dayIndex": 29,
      "steps": 5482,
      "hrBpm": 73,
      "systolicBp": 139,
      "diastolicBp": 75,
      "medStatus": "unconfirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-07-30",
      "dayIndex": 30,
      "steps": 5392,
      "hrBpm": 78,
      "systolicBp": 129,
      "diastolicBp": 79,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-07-31",
      "dayIndex": 31,
      "steps": 6309,
      "hrBpm": 71,
      "systolicBp": 139,
      "diastolicBp": 78,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-08-01",
      "dayIndex": 32,
      "steps": 6196,
      "hrBpm": 76,
      "systolicBp": 140,
      "diastolicBp": 71,
      "medStatus": "unconfirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-08-02",
      "dayIndex": 33,
      "steps": 5317,
      "hrBpm": 70,
      "systolicBp": 122,
      "diastolicBp": 81,
      "medStatus": "confirmed",
      "riskScore": 15,
      "signals": [
        "BP drop (122 mmHg)"
      ]
    },
    {
      "date": "2026-08-03",
      "dayIndex": 34,
      "steps": 5493,
      "hrBpm": 75,
      "systolicBp": 135,
      "diastolicBp": 78,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-08-04",
      "dayIndex": 35,
      "steps": 6035,
      "hrBpm": 76,
      "systolicBp": 139,
      "diastolicBp": 76,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-08-05",
      "dayIndex": 36,
      "steps": 5660,
      "hrBpm": 71,
      "systolicBp": 138,
      "diastolicBp": 81,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-08-06",
      "dayIndex": 37,
      "steps": 6319,
      "hrBpm": 75,
      "systolicBp": 129,
      "diastolicBp": 77,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-08-07",
      "dayIndex": 38,
      "steps": 6476,
      "hrBpm": 75,
      "systolicBp": 137,
      "diastolicBp": 81,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-08-08",
      "dayIndex": 39,
      "steps": 5624,
      "hrBpm": 74,
      "systolicBp": 146,
      "diastolicBp": 79,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-08-09",
      "dayIndex": 40,
      "steps": 6388,
      "hrBpm": 72,
      "systolicBp": 142,
      "diastolicBp": 84,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-08-10",
      "dayIndex": 41,
      "steps": 5846,
      "hrBpm": 72,
      "systolicBp": 141,
      "diastolicBp": 78,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-08-11",
      "dayIndex": 42,
      "steps": 5712,
      "hrBpm": 75,
      "systolicBp": 132,
      "diastolicBp": 76,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-08-12",
      "dayIndex": 43,
      "steps": 5736,
      "hrBpm": 72,
      "systolicBp": 139,
      "diastolicBp": 82,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-08-13",
      "dayIndex": 44,
      "steps": 6199,
      "hrBpm": 75,
      "systolicBp": 132,
      "diastolicBp": 77,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-08-14",
      "dayIndex": 45,
      "steps": 5869,
      "hrBpm": 75,
      "systolicBp": 134,
      "diastolicBp": 69,
      "medStatus": "unconfirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-08-15",
      "dayIndex": 46,
      "steps": 5520,
      "hrBpm": 74,
      "systolicBp": 134,
      "diastolicBp": 80,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-08-16",
      "dayIndex": 47,
      "steps": 6282,
      "hrBpm": 70,
      "systolicBp": 144,
      "diastolicBp": 75,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-08-17",
      "dayIndex": 48,
      "steps": 6675,
      "hrBpm": 73,
      "systolicBp": 135,
      "diastolicBp": 77,
      "medStatus": "unconfirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-08-18",
      "dayIndex": 49,
      "steps": 6379,
      "hrBpm": 77,
      "systolicBp": 145,
      "diastolicBp": 75,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-08-19",
      "dayIndex": 50,
      "steps": 5967,
      "hrBpm": 76,
      "systolicBp": 144,
      "diastolicBp": 79,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-08-20",
      "dayIndex": 51,
      "steps": 6306,
      "hrBpm": 71,
      "systolicBp": 139,
      "diastolicBp": 80,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-08-21",
      "dayIndex": 52,
      "steps": 5912,
      "hrBpm": 75,
      "systolicBp": 137,
      "diastolicBp": 80,
      "medStatus": "unconfirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-08-22",
      "dayIndex": 53,
      "steps": 6021,
      "hrBpm": 76,
      "systolicBp": 137,
      "diastolicBp": 75,
      "medStatus": "unconfirmed",
      "riskScore": 12,
      "signals": [
        "3 unconfirmed meds this week"
      ]
    },
    {
      "date": "2026-08-23",
      "dayIndex": 54,
      "steps": 6160,
      "hrBpm": 72,
      "systolicBp": 140,
      "diastolicBp": 78,
      "medStatus": "confirmed",
      "riskScore": 12,
      "signals": [
        "3 unconfirmed meds this week"
      ]
    },
    {
      "date": "2026-08-24",
      "dayIndex": 55,
      "steps": 5508,
      "hrBpm": 73,
      "systolicBp": 136,
      "diastolicBp": 71,
      "medStatus": "unconfirmed",
      "riskScore": 12,
      "signals": [
        "3 unconfirmed meds this week"
      ]
    },
    {
      "date": "2026-08-25",
      "dayIndex": 56,
      "steps": 5217,
      "hrBpm": 70,
      "systolicBp": 128,
      "diastolicBp": 84,
      "medStatus": "confirmed",
      "riskScore": 12,
      "signals": [
        "3 unconfirmed meds this week"
      ]
    },
    {
      "date": "2026-08-26",
      "dayIndex": 57,
      "steps": 5910,
      "hrBpm": 79,
      "systolicBp": 138,
      "diastolicBp": 81,
      "medStatus": "confirmed",
      "riskScore": 12,
      "signals": [
        "3 unconfirmed meds this week"
      ]
    },
    {
      "date": "2026-08-27",
      "dayIndex": 58,
      "steps": 6021,
      "hrBpm": 70,
      "systolicBp": 123,
      "diastolicBp": 77,
      "medStatus": "confirmed",
      "riskScore": 12,
      "signals": [
        "3 unconfirmed meds this week"
      ]
    },
    {
      "date": "2026-08-28",
      "dayIndex": 59,
      "steps": 6648,
      "hrBpm": 76,
      "systolicBp": 124,
      "diastolicBp": 79,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-08-29",
      "dayIndex": 60,
      "steps": 5767,
      "hrBpm": 70,
      "systolicBp": 139,
      "diastolicBp": 85,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-08-30",
      "dayIndex": 61,
      "steps": 6066,
      "hrBpm": 73,
      "systolicBp": 146,
      "diastolicBp": 74,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-08-31",
      "dayIndex": 62,
      "steps": 5615,
      "hrBpm": 76,
      "systolicBp": 132,
      "diastolicBp": 83,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-09-01",
      "dayIndex": 63,
      "steps": 6544,
      "hrBpm": 81,
      "systolicBp": 133,
      "diastolicBp": 77,
      "medStatus": "confirmed",
      "riskScore": 7,
      "signals": [
        "Elevated HR (81 bpm)"
      ]
    },
    {
      "date": "2026-09-02",
      "dayIndex": 64,
      "steps": 5840,
      "hrBpm": 79,
      "systolicBp": 129,
      "diastolicBp": 78,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-09-03",
      "dayIndex": 65,
      "steps": 5964,
      "hrBpm": 76,
      "systolicBp": 136,
      "diastolicBp": 69,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-09-04",
      "dayIndex": 66,
      "steps": 5923,
      "hrBpm": 74,
      "systolicBp": 136,
      "diastolicBp": 71,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-09-05",
      "dayIndex": 67,
      "steps": 6263,
      "hrBpm": 72,
      "systolicBp": 137,
      "diastolicBp": 75,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-09-06",
      "dayIndex": 68,
      "steps": 6274,
      "hrBpm": 73,
      "systolicBp": 136,
      "diastolicBp": 78,
      "medStatus": "unconfirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-09-07",
      "dayIndex": 69,
      "steps": 6228,
      "hrBpm": 78,
      "systolicBp": 136,
      "diastolicBp": 81,
      "medStatus": "confirmed",
      "riskScore": 10,
      "signals": [
        "Reported fatigue / low activity"
      ]
    },
    {
      "date": "2026-09-08",
      "dayIndex": 70,
      "steps": 6112,
      "hrBpm": 74,
      "systolicBp": 133,
      "diastolicBp": 85,
      "medStatus": "confirmed",
      "riskScore": 10,
      "signals": [
        "Reported fatigue / low activity"
      ]
    },
    {
      "date": "2026-09-09",
      "dayIndex": 71,
      "steps": 6204,
      "hrBpm": 73,
      "systolicBp": 135,
      "diastolicBp": 72,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-09-10",
      "dayIndex": 72,
      "steps": 5411,
      "hrBpm": 73,
      "systolicBp": 142,
      "diastolicBp": 76,
      "medStatus": "unconfirmed",
      "riskScore": 10,
      "signals": [
        "Reported fatigue / low activity"
      ]
    },
    {
      "date": "2026-09-11",
      "dayIndex": 73,
      "steps": 6446,
      "hrBpm": 72,
      "systolicBp": 131,
      "diastolicBp": 83,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-09-12",
      "dayIndex": 74,
      "steps": 5517,
      "hrBpm": 79,
      "systolicBp": 139,
      "diastolicBp": 79,
      "medStatus": "unconfirmed",
      "riskScore": 12,
      "signals": [
        "3 unconfirmed meds this week"
      ]
    },
    {
      "date": "2026-09-13",
      "dayIndex": 75,
      "steps": 4888,
      "hrBpm": 79,
      "systolicBp": 134,
      "diastolicBp": 74,
      "medStatus": "confirmed",
      "riskScore": 10,
      "signals": [
        "Reported fatigue / low activity"
      ]
    },
    {
      "date": "2026-09-14",
      "dayIndex": 76,
      "steps": 4841,
      "hrBpm": 71,
      "systolicBp": 143,
      "diastolicBp": 75,
      "medStatus": "unconfirmed",
      "riskScore": 12,
      "signals": [
        "3 unconfirmed meds this week"
      ]
    },
    {
      "date": "2026-09-15",
      "dayIndex": 77,
      "steps": 4486,
      "hrBpm": 73,
      "systolicBp": 134,
      "diastolicBp": 78,
      "medStatus": "confirmed",
      "riskScore": 22,
      "signals": [
        "3 unconfirmed meds this week",
        "Reported fatigue / low activity"
      ]
    },
    {
      "date": "2026-09-16",
      "dayIndex": 78,
      "steps": 4862,
      "hrBpm": 76,
      "systolicBp": 150,
      "diastolicBp": 78,
      "medStatus": "confirmed",
      "riskScore": 22,
      "signals": [
        "3 unconfirmed meds this week",
        "Reported fatigue / low activity"
      ]
    },
    {
      "date": "2026-09-17",
      "dayIndex": 79,
      "steps": 4696,
      "hrBpm": 78,
      "systolicBp": 144,
      "diastolicBp": 72,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-09-18",
      "dayIndex": 80,
      "steps": 4692,
      "hrBpm": 77,
      "systolicBp": 127,
      "diastolicBp": 85,
      "medStatus": "unconfirmed",
      "riskScore": 12,
      "signals": [
        "3 unconfirmed meds this week"
      ]
    },
    {
      "date": "2026-09-19",
      "dayIndex": 81,
      "steps": 5369,
      "hrBpm": 74,
      "systolicBp": 157,
      "diastolicBp": 78,
      "medStatus": "confirmed",
      "riskScore": 30,
      "signals": [
        "Elevated BP (157 mmHg, +2.9 SD)",
        "Reported fatigue / low activity"
      ]
    },
    {
      "date": "2026-09-20",
      "dayIndex": 82,
      "steps": 5103,
      "hrBpm": 78,
      "systolicBp": 144,
      "diastolicBp": 79,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-09-21",
      "dayIndex": 83,
      "steps": 4634,
      "hrBpm": 74,
      "systolicBp": 139,
      "diastolicBp": 76,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-09-22",
      "dayIndex": 84,
      "steps": 4813,
      "hrBpm": 78,
      "systolicBp": 137,
      "diastolicBp": 80,
      "medStatus": "unconfirmed",
      "riskScore": 10,
      "signals": [
        "Reported fatigue / low activity"
      ]
    },
    {
      "date": "2026-09-23",
      "dayIndex": 85,
      "steps": 4158,
      "hrBpm": 75,
      "systolicBp": 143,
      "diastolicBp": 80,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-09-24",
      "dayIndex": 86,
      "steps": 4252,
      "hrBpm": 73,
      "systolicBp": 133,
      "diastolicBp": 78,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-09-25",
      "dayIndex": 87,
      "steps": 3802,
      "hrBpm": 81,
      "systolicBp": 151,
      "diastolicBp": 72,
      "medStatus": "confirmed",
      "riskScore": 31,
      "signals": [
        "Elevated HR (81 bpm)",
        "Activity reduced (-39% steps)",
        "Reported fatigue / low activity"
      ]
    },
    {
      "date": "2026-09-26",
      "dayIndex": 88,
      "steps": 3827,
      "hrBpm": 78,
      "systolicBp": 141,
      "diastolicBp": 73,
      "medStatus": "unconfirmed",
      "riskScore": 13,
      "signals": [
        "Activity reduced (-38% steps)"
      ]
    },
    {
      "date": "2026-09-27",
      "dayIndex": 89,
      "steps": 4601,
      "hrBpm": 79,
      "systolicBp": 140,
      "diastolicBp": 74,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-09-28",
      "dayIndex": 90,
      "steps": 4080,
      "hrBpm": 79,
      "systolicBp": 142,
      "diastolicBp": 85,
      "medStatus": "confirmed",
      "riskScore": 10,
      "signals": [
        "Reported fatigue / low activity"
      ]
    }
  ],
  "SW013": [
    {
      "date": "2026-07-01",
      "dayIndex": 1,
      "steps": 3781,
      "hrBpm": 80,
      "systolicBp": 138,
      "diastolicBp": 74,
      "medStatus": "unconfirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-07-02",
      "dayIndex": 2,
      "steps": 3624,
      "hrBpm": 83,
      "systolicBp": 136,
      "diastolicBp": 79,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-07-03",
      "dayIndex": 3,
      "steps": 4904,
      "hrBpm": 75,
      "systolicBp": 142,
      "diastolicBp": 87,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-07-04",
      "dayIndex": 4,
      "steps": 4027,
      "hrBpm": 81,
      "systolicBp": 136,
      "diastolicBp": 82,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-07-05",
      "dayIndex": 5,
      "steps": 4350,
      "hrBpm": 81,
      "systolicBp": 151,
      "diastolicBp": 79,
      "medStatus": "confirmed",
      "riskScore": 8,
      "signals": [
        "Elevated BP (151 mmHg, +2 SD)"
      ]
    },
    {
      "date": "2026-07-06",
      "dayIndex": 6,
      "steps": 4608,
      "hrBpm": 74,
      "systolicBp": 140,
      "diastolicBp": 78,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-07-07",
      "dayIndex": 7,
      "steps": 5082,
      "hrBpm": 79,
      "systolicBp": 145,
      "diastolicBp": 81,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-07-08",
      "dayIndex": 8,
      "steps": 5039,
      "hrBpm": 78,
      "systolicBp": 131,
      "diastolicBp": 79,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-07-09",
      "dayIndex": 9,
      "steps": 4885,
      "hrBpm": 81,
      "systolicBp": 133,
      "diastolicBp": 77,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-07-10",
      "dayIndex": 10,
      "steps": 4212,
      "hrBpm": 83,
      "systolicBp": 145,
      "diastolicBp": 85,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-07-11",
      "dayIndex": 11,
      "steps": 4782,
      "hrBpm": 81,
      "systolicBp": 132,
      "diastolicBp": 82,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-07-12",
      "dayIndex": 12,
      "steps": 3796,
      "hrBpm": 76,
      "systolicBp": 128,
      "diastolicBp": 87,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-07-13",
      "dayIndex": 13,
      "steps": 4529,
      "hrBpm": 78,
      "systolicBp": 144,
      "diastolicBp": 75,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-07-14",
      "dayIndex": 14,
      "steps": 3827,
      "hrBpm": 80,
      "systolicBp": 137,
      "diastolicBp": 78,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-07-15",
      "dayIndex": 15,
      "steps": 4600,
      "hrBpm": 79,
      "systolicBp": 137,
      "diastolicBp": 78,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-07-16",
      "dayIndex": 16,
      "steps": 4551,
      "hrBpm": 79,
      "systolicBp": 143,
      "diastolicBp": 88,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-07-17",
      "dayIndex": 17,
      "steps": 4433,
      "hrBpm": 79,
      "systolicBp": 140,
      "diastolicBp": 81,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-07-18",
      "dayIndex": 18,
      "steps": 4124,
      "hrBpm": 77,
      "systolicBp": 137,
      "diastolicBp": 81,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-07-19",
      "dayIndex": 19,
      "steps": 5172,
      "hrBpm": 81,
      "systolicBp": 143,
      "diastolicBp": 79,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-07-20",
      "dayIndex": 20,
      "steps": 4774,
      "hrBpm": 73,
      "systolicBp": 144,
      "diastolicBp": 79,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-07-21",
      "dayIndex": 21,
      "steps": 4826,
      "hrBpm": 82,
      "systolicBp": 138,
      "diastolicBp": 80,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-07-22",
      "dayIndex": 22,
      "steps": 4429,
      "hrBpm": 79,
      "systolicBp": 139,
      "diastolicBp": 80,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-07-23",
      "dayIndex": 23,
      "steps": 4580,
      "hrBpm": 73,
      "systolicBp": 154,
      "diastolicBp": 75,
      "medStatus": "confirmed",
      "riskScore": 16,
      "signals": [
        "Elevated BP (154 mmHg, +2.5 SD)"
      ]
    },
    {
      "date": "2026-07-24",
      "dayIndex": 24,
      "steps": 5228,
      "hrBpm": 82,
      "systolicBp": 139,
      "diastolicBp": 83,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-07-25",
      "dayIndex": 25,
      "steps": 5327,
      "hrBpm": 71,
      "systolicBp": 126,
      "diastolicBp": 76,
      "medStatus": "confirmed",
      "riskScore": 15,
      "signals": [
        "BP drop (126 mmHg)"
      ]
    },
    {
      "date": "2026-07-26",
      "dayIndex": 26,
      "steps": 4938,
      "hrBpm": 82,
      "systolicBp": 142,
      "diastolicBp": 77,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-07-27",
      "dayIndex": 27,
      "steps": 4581,
      "hrBpm": 81,
      "systolicBp": 142,
      "diastolicBp": 81,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-07-28",
      "dayIndex": 28,
      "steps": 4263,
      "hrBpm": 82,
      "systolicBp": 136,
      "diastolicBp": 80,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-07-29",
      "dayIndex": 29,
      "steps": 4545,
      "hrBpm": 81,
      "systolicBp": 135,
      "diastolicBp": 87,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-07-30",
      "dayIndex": 30,
      "steps": 4168,
      "hrBpm": 82,
      "systolicBp": 141,
      "diastolicBp": 75,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-07-31",
      "dayIndex": 31,
      "steps": 4834,
      "hrBpm": 78,
      "systolicBp": 137,
      "diastolicBp": 74,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-08-01",
      "dayIndex": 32,
      "steps": 4501,
      "hrBpm": 80,
      "systolicBp": 137,
      "diastolicBp": 77,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-08-02",
      "dayIndex": 33,
      "steps": 4508,
      "hrBpm": 78,
      "systolicBp": 131,
      "diastolicBp": 78,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-08-03",
      "dayIndex": 34,
      "steps": 5057,
      "hrBpm": 81,
      "systolicBp": 140,
      "diastolicBp": 79,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-08-04",
      "dayIndex": 35,
      "steps": 4459,
      "hrBpm": 72,
      "systolicBp": 143,
      "diastolicBp": 83,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-08-05",
      "dayIndex": 36,
      "steps": 4387,
      "hrBpm": 78,
      "systolicBp": 128,
      "diastolicBp": 90,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-08-06",
      "dayIndex": 37,
      "steps": 4178,
      "hrBpm": 77,
      "systolicBp": 138,
      "diastolicBp": 75,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-08-07",
      "dayIndex": 38,
      "steps": 4553,
      "hrBpm": 78,
      "systolicBp": 144,
      "diastolicBp": 86,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-08-08",
      "dayIndex": 39,
      "steps": 4279,
      "hrBpm": 77,
      "systolicBp": 142,
      "diastolicBp": 80,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-08-09",
      "dayIndex": 40,
      "steps": 4748,
      "hrBpm": 78,
      "systolicBp": 144,
      "diastolicBp": 75,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-08-10",
      "dayIndex": 41,
      "steps": 4624,
      "hrBpm": 84,
      "systolicBp": 144,
      "diastolicBp": 82,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-08-11",
      "dayIndex": 42,
      "steps": 3735,
      "hrBpm": 78,
      "systolicBp": 144,
      "diastolicBp": 87,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-08-12",
      "dayIndex": 43,
      "steps": 4453,
      "hrBpm": 77,
      "systolicBp": 129,
      "diastolicBp": 73,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-08-13",
      "dayIndex": 44,
      "steps": 3639,
      "hrBpm": 78,
      "systolicBp": 150,
      "diastolicBp": 80,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-08-14",
      "dayIndex": 45,
      "steps": 3816,
      "hrBpm": 79,
      "systolicBp": 138,
      "diastolicBp": 80,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-08-15",
      "dayIndex": 46,
      "steps": 4164,
      "hrBpm": 83,
      "systolicBp": 147,
      "diastolicBp": 84,
      "medStatus": "unconfirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-08-16",
      "dayIndex": 47,
      "steps": 5459,
      "hrBpm": 75,
      "systolicBp": 140,
      "diastolicBp": 83,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-08-17",
      "dayIndex": 48,
      "steps": 4815,
      "hrBpm": 77,
      "systolicBp": 140,
      "diastolicBp": 79,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-08-18",
      "dayIndex": 49,
      "steps": 4662,
      "hrBpm": 75,
      "systolicBp": 137,
      "diastolicBp": 82,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-08-19",
      "dayIndex": 50,
      "steps": 4082,
      "hrBpm": 81,
      "systolicBp": 157,
      "diastolicBp": 83,
      "medStatus": "confirmed",
      "riskScore": 23,
      "signals": [
        "Elevated BP (157 mmHg, +3.1 SD)"
      ]
    },
    {
      "date": "2026-08-20",
      "dayIndex": 51,
      "steps": 4372,
      "hrBpm": 80,
      "systolicBp": 131,
      "diastolicBp": 75,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-08-21",
      "dayIndex": 52,
      "steps": 5081,
      "hrBpm": 80,
      "systolicBp": 147,
      "diastolicBp": 80,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-08-22",
      "dayIndex": 53,
      "steps": 4593,
      "hrBpm": 78,
      "systolicBp": 151,
      "diastolicBp": 82,
      "medStatus": "confirmed",
      "riskScore": 8,
      "signals": [
        "Elevated BP (151 mmHg, +2 SD)"
      ]
    },
    {
      "date": "2026-08-23",
      "dayIndex": 54,
      "steps": 5452,
      "hrBpm": 82,
      "systolicBp": 142,
      "diastolicBp": 84,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-08-24",
      "dayIndex": 55,
      "steps": 5018,
      "hrBpm": 79,
      "systolicBp": 141,
      "diastolicBp": 73,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-08-25",
      "dayIndex": 56,
      "steps": 5545,
      "hrBpm": 77,
      "systolicBp": 138,
      "diastolicBp": 77,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-08-26",
      "dayIndex": 57,
      "steps": 4711,
      "hrBpm": 78,
      "systolicBp": 141,
      "diastolicBp": 80,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-08-27",
      "dayIndex": 58,
      "steps": 4595,
      "hrBpm": 81,
      "systolicBp": 136,
      "diastolicBp": 82,
      "medStatus": "unconfirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-08-28",
      "dayIndex": 59,
      "steps": 4709,
      "hrBpm": 82,
      "systolicBp": 135,
      "diastolicBp": 77,
      "medStatus": "unconfirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-08-29",
      "dayIndex": 60,
      "steps": 5097,
      "hrBpm": 80,
      "systolicBp": 128,
      "diastolicBp": 76,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-08-30",
      "dayIndex": 61,
      "steps": 5336,
      "hrBpm": 75,
      "systolicBp": 139,
      "diastolicBp": 76,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-08-31",
      "dayIndex": 62,
      "steps": 4739,
      "hrBpm": 80,
      "systolicBp": 138,
      "diastolicBp": 76,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-09-01",
      "dayIndex": 63,
      "steps": 4860,
      "hrBpm": 80,
      "systolicBp": 134,
      "diastolicBp": 82,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-09-02",
      "dayIndex": 64,
      "steps": 4253,
      "hrBpm": 78,
      "systolicBp": 129,
      "diastolicBp": 71,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-09-03",
      "dayIndex": 65,
      "steps": 4638,
      "hrBpm": 81,
      "systolicBp": 143,
      "diastolicBp": 84,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-09-04",
      "dayIndex": 66,
      "steps": 4256,
      "hrBpm": 76,
      "systolicBp": 139,
      "diastolicBp": 81,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-09-05",
      "dayIndex": 67,
      "steps": 3865,
      "hrBpm": 83,
      "systolicBp": 146,
      "diastolicBp": 75,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-09-06",
      "dayIndex": 68,
      "steps": 5032,
      "hrBpm": 80,
      "systolicBp": 141,
      "diastolicBp": 81,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-09-07",
      "dayIndex": 69,
      "steps": 4092,
      "hrBpm": 78,
      "systolicBp": 137,
      "diastolicBp": 83,
      "medStatus": "unconfirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-09-08",
      "dayIndex": 70,
      "steps": 4938,
      "hrBpm": 80,
      "systolicBp": 133,
      "diastolicBp": 85,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-09-09",
      "dayIndex": 71,
      "steps": 3852,
      "hrBpm": 78,
      "systolicBp": 153,
      "diastolicBp": 85,
      "medStatus": "confirmed",
      "riskScore": 13,
      "signals": [
        "Elevated BP (153 mmHg, +2.4 SD)"
      ]
    },
    {
      "date": "2026-09-10",
      "dayIndex": 72,
      "steps": 4769,
      "hrBpm": 78,
      "systolicBp": 141,
      "diastolicBp": 85,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-09-11",
      "dayIndex": 73,
      "steps": 4072,
      "hrBpm": 82,
      "systolicBp": 132,
      "diastolicBp": 83,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-09-12",
      "dayIndex": 74,
      "steps": 4386,
      "hrBpm": 79,
      "systolicBp": 131,
      "diastolicBp": 77,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-09-13",
      "dayIndex": 75,
      "steps": 4145,
      "hrBpm": 79,
      "systolicBp": 139,
      "diastolicBp": 77,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-09-14",
      "dayIndex": 76,
      "steps": 4260,
      "hrBpm": 77,
      "systolicBp": 156,
      "diastolicBp": 76,
      "medStatus": "confirmed",
      "riskScore": 21,
      "signals": [
        "Elevated BP (156 mmHg, +2.9 SD)"
      ]
    },
    {
      "date": "2026-09-15",
      "dayIndex": 77,
      "steps": 4447,
      "hrBpm": 82,
      "systolicBp": 130,
      "diastolicBp": 76,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-09-16",
      "dayIndex": 78,
      "steps": 4517,
      "hrBpm": 75,
      "systolicBp": 143,
      "diastolicBp": 80,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-09-17",
      "dayIndex": 79,
      "steps": 4393,
      "hrBpm": 83,
      "systolicBp": 138,
      "diastolicBp": 82,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-09-18",
      "dayIndex": 80,
      "steps": 4318,
      "hrBpm": 80,
      "systolicBp": 134,
      "diastolicBp": 76,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-09-19",
      "dayIndex": 81,
      "steps": 4045,
      "hrBpm": 82,
      "systolicBp": 141,
      "diastolicBp": 84,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-09-20",
      "dayIndex": 82,
      "steps": 5325,
      "hrBpm": 80,
      "systolicBp": 130,
      "diastolicBp": 83,
      "medStatus": "unconfirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-09-21",
      "dayIndex": 83,
      "steps": 5311,
      "hrBpm": 77,
      "systolicBp": 135,
      "diastolicBp": 81,
      "medStatus": "unconfirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-09-22",
      "dayIndex": 84,
      "steps": 5038,
      "hrBpm": 78,
      "systolicBp": 142,
      "diastolicBp": 83,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-09-23",
      "dayIndex": 85,
      "steps": 5416,
      "hrBpm": 77,
      "systolicBp": 141,
      "diastolicBp": 84,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-09-24",
      "dayIndex": 86,
      "steps": 4860,
      "hrBpm": 78,
      "systolicBp": 145,
      "diastolicBp": 79,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-09-25",
      "dayIndex": 87,
      "steps": 3964,
      "hrBpm": 79,
      "systolicBp": 146,
      "diastolicBp": 76,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-09-26",
      "dayIndex": 88,
      "steps": 5024,
      "hrBpm": 82,
      "systolicBp": 141,
      "diastolicBp": 85,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-09-27",
      "dayIndex": 89,
      "steps": 4275,
      "hrBpm": 76,
      "systolicBp": 139,
      "diastolicBp": 83,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-09-28",
      "dayIndex": 90,
      "steps": 4417,
      "hrBpm": 76,
      "systolicBp": 147,
      "diastolicBp": 79,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    }
  ],
  "SW014": [
    {
      "date": "2026-07-01",
      "dayIndex": 1,
      "steps": 6748,
      "hrBpm": 72,
      "systolicBp": 134,
      "diastolicBp": 90,
      "medStatus": "unconfirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-07-02",
      "dayIndex": 2,
      "steps": 5825,
      "hrBpm": 67,
      "systolicBp": 132,
      "diastolicBp": 80,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-07-03",
      "dayIndex": 3,
      "steps": 5816,
      "hrBpm": 65,
      "systolicBp": 135,
      "diastolicBp": 87,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-07-04",
      "dayIndex": 4,
      "steps": 6489,
      "hrBpm": 68,
      "systolicBp": 131,
      "diastolicBp": 85,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-07-05",
      "dayIndex": 5,
      "steps": 6870,
      "hrBpm": 67,
      "systolicBp": 135,
      "diastolicBp": 83,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-07-06",
      "dayIndex": 6,
      "steps": 6290,
      "hrBpm": 65,
      "systolicBp": 134,
      "diastolicBp": 74,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-07-07",
      "dayIndex": 7,
      "steps": 6260,
      "hrBpm": 71,
      "systolicBp": 135,
      "diastolicBp": 85,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-07-08",
      "dayIndex": 8,
      "steps": 5925,
      "hrBpm": 67,
      "systolicBp": 133,
      "diastolicBp": 93,
      "medStatus": "unconfirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-07-09",
      "dayIndex": 9,
      "steps": 6554,
      "hrBpm": 70,
      "systolicBp": 128,
      "diastolicBp": 83,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-07-10",
      "dayIndex": 10,
      "steps": 6932,
      "hrBpm": 70,
      "systolicBp": 135,
      "diastolicBp": 86,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-07-11",
      "dayIndex": 11,
      "steps": 5094,
      "hrBpm": 68,
      "systolicBp": 139,
      "diastolicBp": 82,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-07-12",
      "dayIndex": 12,
      "steps": 6649,
      "hrBpm": 65,
      "systolicBp": 132,
      "diastolicBp": 81,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-07-13",
      "dayIndex": 13,
      "steps": 6150,
      "hrBpm": 64,
      "systolicBp": 139,
      "diastolicBp": 85,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-07-14",
      "dayIndex": 14,
      "steps": 6224,
      "hrBpm": 69,
      "systolicBp": 131,
      "diastolicBp": 84,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-07-15",
      "dayIndex": 15,
      "steps": 6496,
      "hrBpm": 66,
      "systolicBp": 135,
      "diastolicBp": 82,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-07-16",
      "dayIndex": 16,
      "steps": 6025,
      "hrBpm": 70,
      "systolicBp": 130,
      "diastolicBp": 80,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-07-17",
      "dayIndex": 17,
      "steps": 5556,
      "hrBpm": 70,
      "systolicBp": 138,
      "diastolicBp": 83,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-07-18",
      "dayIndex": 18,
      "steps": 6261,
      "hrBpm": 70,
      "systolicBp": 138,
      "diastolicBp": 88,
      "medStatus": "unconfirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-07-19",
      "dayIndex": 19,
      "steps": 6014,
      "hrBpm": 67,
      "systolicBp": 139,
      "diastolicBp": 84,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-07-20",
      "dayIndex": 20,
      "steps": 5913,
      "hrBpm": 71,
      "systolicBp": 141,
      "diastolicBp": 79,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-07-21",
      "dayIndex": 21,
      "steps": 5838,
      "hrBpm": 70,
      "systolicBp": 137,
      "diastolicBp": 79,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-07-22",
      "dayIndex": 22,
      "steps": 5688,
      "hrBpm": 71,
      "systolicBp": 133,
      "diastolicBp": 83,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-07-23",
      "dayIndex": 23,
      "steps": 6226,
      "hrBpm": 68,
      "systolicBp": 145,
      "diastolicBp": 88,
      "medStatus": "confirmed",
      "riskScore": 12,
      "signals": [
        "Elevated BP (145 mmHg, +2.3 SD)"
      ]
    },
    {
      "date": "2026-07-24",
      "dayIndex": 24,
      "steps": 5820,
      "hrBpm": 67,
      "systolicBp": 133,
      "diastolicBp": 85,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-07-25",
      "dayIndex": 25,
      "steps": 5968,
      "hrBpm": 69,
      "systolicBp": 137,
      "diastolicBp": 81,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-07-26",
      "dayIndex": 26,
      "steps": 5911,
      "hrBpm": 68,
      "systolicBp": 129,
      "diastolicBp": 83,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-07-27",
      "dayIndex": 27,
      "steps": 5962,
      "hrBpm": 66,
      "systolicBp": 124,
      "diastolicBp": 79,
      "medStatus": "confirmed",
      "riskScore": 15,
      "signals": [
        "BP drop (124 mmHg)"
      ]
    },
    {
      "date": "2026-07-28",
      "dayIndex": 28,
      "steps": 5982,
      "hrBpm": 69,
      "systolicBp": 138,
      "diastolicBp": 79,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-07-29",
      "dayIndex": 29,
      "steps": 6555,
      "hrBpm": 66,
      "systolicBp": 140,
      "diastolicBp": 76,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-07-30",
      "dayIndex": 30,
      "steps": 6705,
      "hrBpm": 74,
      "systolicBp": 137,
      "diastolicBp": 83,
      "medStatus": "confirmed",
      "riskScore": 11,
      "signals": [
        "Elevated HR (74 bpm)"
      ]
    },
    {
      "date": "2026-07-31",
      "dayIndex": 31,
      "steps": 6943,
      "hrBpm": 73,
      "systolicBp": 130,
      "diastolicBp": 84,
      "medStatus": "confirmed",
      "riskScore": 7,
      "signals": [
        "Elevated HR (73 bpm)"
      ]
    },
    {
      "date": "2026-08-01",
      "dayIndex": 32,
      "steps": 5392,
      "hrBpm": 68,
      "systolicBp": 131,
      "diastolicBp": 78,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-08-02",
      "dayIndex": 33,
      "steps": 5870,
      "hrBpm": 66,
      "systolicBp": 132,
      "diastolicBp": 88,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-08-03",
      "dayIndex": 34,
      "steps": 5885,
      "hrBpm": 69,
      "systolicBp": 131,
      "diastolicBp": 81,
      "medStatus": "unconfirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-08-04",
      "dayIndex": 35,
      "steps": 5693,
      "hrBpm": 69,
      "systolicBp": 133,
      "diastolicBp": 79,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-08-05",
      "dayIndex": 36,
      "steps": 6338,
      "hrBpm": 67,
      "systolicBp": 139,
      "diastolicBp": 91,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-08-06",
      "dayIndex": 37,
      "steps": 6011,
      "hrBpm": 72,
      "systolicBp": 137,
      "diastolicBp": 79,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-08-07",
      "dayIndex": 38,
      "steps": 6526,
      "hrBpm": 70,
      "systolicBp": 129,
      "diastolicBp": 82,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-08-08",
      "dayIndex": 39,
      "steps": 6851,
      "hrBpm": 69,
      "systolicBp": 142,
      "diastolicBp": 79,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-08-09",
      "dayIndex": 40,
      "steps": 6273,
      "hrBpm": 68,
      "systolicBp": 138,
      "diastolicBp": 77,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-08-10",
      "dayIndex": 41,
      "steps": 6513,
      "hrBpm": 73,
      "systolicBp": 138,
      "diastolicBp": 82,
      "medStatus": "confirmed",
      "riskScore": 7,
      "signals": [
        "Elevated HR (73 bpm)"
      ]
    },
    {
      "date": "2026-08-11",
      "dayIndex": 42,
      "steps": 6359,
      "hrBpm": 70,
      "systolicBp": 144,
      "diastolicBp": 85,
      "medStatus": "confirmed",
      "riskScore": 9,
      "signals": [
        "Elevated BP (144 mmHg, +2.1 SD)"
      ]
    },
    {
      "date": "2026-08-12",
      "dayIndex": 43,
      "steps": 6687,
      "hrBpm": 67,
      "systolicBp": 140,
      "diastolicBp": 80,
      "medStatus": "unconfirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-08-13",
      "dayIndex": 44,
      "steps": 6608,
      "hrBpm": 67,
      "systolicBp": 139,
      "diastolicBp": 87,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-08-14",
      "dayIndex": 45,
      "steps": 6057,
      "hrBpm": 68,
      "systolicBp": 139,
      "diastolicBp": 85,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-08-15",
      "dayIndex": 46,
      "steps": 6566,
      "hrBpm": 64,
      "systolicBp": 145,
      "diastolicBp": 85,
      "medStatus": "confirmed",
      "riskScore": 12,
      "signals": [
        "Elevated BP (145 mmHg, +2.3 SD)"
      ]
    },
    {
      "date": "2026-08-16",
      "dayIndex": 47,
      "steps": 5845,
      "hrBpm": 67,
      "systolicBp": 126,
      "diastolicBp": 74,
      "medStatus": "unconfirmed",
      "riskScore": 15,
      "signals": [
        "BP drop (126 mmHg)"
      ]
    },
    {
      "date": "2026-08-17",
      "dayIndex": 48,
      "steps": 6505,
      "hrBpm": 69,
      "systolicBp": 141,
      "diastolicBp": 75,
      "medStatus": "unconfirmed",
      "riskScore": 12,
      "signals": [
        "3 unconfirmed meds this week"
      ]
    },
    {
      "date": "2026-08-18",
      "dayIndex": 49,
      "steps": 5918,
      "hrBpm": 74,
      "systolicBp": 130,
      "diastolicBp": 78,
      "medStatus": "confirmed",
      "riskScore": 23,
      "signals": [
        "Elevated HR (74 bpm)",
        "3 unconfirmed meds this week"
      ]
    },
    {
      "date": "2026-08-19",
      "dayIndex": 50,
      "steps": 6091,
      "hrBpm": 69,
      "systolicBp": 145,
      "diastolicBp": 93,
      "medStatus": "confirmed",
      "riskScore": 12,
      "signals": [
        "Elevated BP (145 mmHg, +2.3 SD)"
      ]
    },
    {
      "date": "2026-08-20",
      "dayIndex": 51,
      "steps": 5916,
      "hrBpm": 71,
      "systolicBp": 127,
      "diastolicBp": 81,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-08-21",
      "dayIndex": 52,
      "steps": 6061,
      "hrBpm": 69,
      "systolicBp": 133,
      "diastolicBp": 82,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-08-22",
      "dayIndex": 53,
      "steps": 6616,
      "hrBpm": 64,
      "systolicBp": 140,
      "diastolicBp": 80,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-08-23",
      "dayIndex": 54,
      "steps": 5451,
      "hrBpm": 68,
      "systolicBp": 143,
      "diastolicBp": 83,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-08-24",
      "dayIndex": 55,
      "steps": 5607,
      "hrBpm": 66,
      "systolicBp": 137,
      "diastolicBp": 82,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-08-25",
      "dayIndex": 56,
      "steps": 6262,
      "hrBpm": 72,
      "systolicBp": 140,
      "diastolicBp": 80,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-08-26",
      "dayIndex": 57,
      "steps": 5830,
      "hrBpm": 69,
      "systolicBp": 134,
      "diastolicBp": 80,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-08-27",
      "dayIndex": 58,
      "steps": 6849,
      "hrBpm": 69,
      "systolicBp": 127,
      "diastolicBp": 80,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-08-28",
      "dayIndex": 59,
      "steps": 5924,
      "hrBpm": 72,
      "systolicBp": 126,
      "diastolicBp": 83,
      "medStatus": "confirmed",
      "riskScore": 15,
      "signals": [
        "BP drop (126 mmHg)"
      ]
    },
    {
      "date": "2026-08-29",
      "dayIndex": 60,
      "steps": 5216,
      "hrBpm": 68,
      "systolicBp": 142,
      "diastolicBp": 85,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-08-30",
      "dayIndex": 61,
      "steps": 5825,
      "hrBpm": 68,
      "systolicBp": 136,
      "diastolicBp": 83,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-08-31",
      "dayIndex": 62,
      "steps": 5703,
      "hrBpm": 73,
      "systolicBp": 130,
      "diastolicBp": 79,
      "medStatus": "confirmed",
      "riskScore": 7,
      "signals": [
        "Elevated HR (73 bpm)"
      ]
    },
    {
      "date": "2026-09-01",
      "dayIndex": 63,
      "steps": 7046,
      "hrBpm": 68,
      "systolicBp": 135,
      "diastolicBp": 82,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-09-02",
      "dayIndex": 64,
      "steps": 6435,
      "hrBpm": 73,
      "systolicBp": 140,
      "diastolicBp": 83,
      "medStatus": "confirmed",
      "riskScore": 7,
      "signals": [
        "Elevated HR (73 bpm)"
      ]
    },
    {
      "date": "2026-09-03",
      "dayIndex": 65,
      "steps": 5652,
      "hrBpm": 68,
      "systolicBp": 147,
      "diastolicBp": 83,
      "medStatus": "confirmed",
      "riskScore": 19,
      "signals": [
        "Elevated BP (147 mmHg, +2.8 SD)"
      ]
    },
    {
      "date": "2026-09-04",
      "dayIndex": 66,
      "steps": 6452,
      "hrBpm": 70,
      "systolicBp": 137,
      "diastolicBp": 83,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-09-05",
      "dayIndex": 67,
      "steps": 6469,
      "hrBpm": 73,
      "systolicBp": 130,
      "diastolicBp": 81,
      "medStatus": "confirmed",
      "riskScore": 7,
      "signals": [
        "Elevated HR (73 bpm)"
      ]
    },
    {
      "date": "2026-09-06",
      "dayIndex": 68,
      "steps": 5528,
      "hrBpm": 69,
      "systolicBp": 128,
      "diastolicBp": 87,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-09-07",
      "dayIndex": 69,
      "steps": 6023,
      "hrBpm": 68,
      "systolicBp": 136,
      "diastolicBp": 78,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-09-08",
      "dayIndex": 70,
      "steps": 5735,
      "hrBpm": 70,
      "systolicBp": 135,
      "diastolicBp": 81,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-09-09",
      "dayIndex": 71,
      "steps": 5811,
      "hrBpm": 64,
      "systolicBp": 141,
      "diastolicBp": 84,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-09-10",
      "dayIndex": 72,
      "steps": 6152,
      "hrBpm": 74,
      "systolicBp": 131,
      "diastolicBp": 88,
      "medStatus": "confirmed",
      "riskScore": 11,
      "signals": [
        "Elevated HR (74 bpm)"
      ]
    },
    {
      "date": "2026-09-11",
      "dayIndex": 73,
      "steps": 6097,
      "hrBpm": 68,
      "systolicBp": 138,
      "diastolicBp": 88,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-09-12",
      "dayIndex": 74,
      "steps": 6374,
      "hrBpm": 69,
      "systolicBp": 136,
      "diastolicBp": 86,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-09-13",
      "dayIndex": 75,
      "steps": 5978,
      "hrBpm": 70,
      "systolicBp": 141,
      "diastolicBp": 83,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-09-14",
      "dayIndex": 76,
      "steps": 5909,
      "hrBpm": 70,
      "systolicBp": 127,
      "diastolicBp": 86,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-09-15",
      "dayIndex": 77,
      "steps": 5795,
      "hrBpm": 63,
      "systolicBp": 143,
      "diastolicBp": 81,
      "medStatus": "unconfirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-09-16",
      "dayIndex": 78,
      "steps": 6541,
      "hrBpm": 71,
      "systolicBp": 130,
      "diastolicBp": 82,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-09-17",
      "dayIndex": 79,
      "steps": 6571,
      "hrBpm": 76,
      "systolicBp": 140,
      "diastolicBp": 70,
      "medStatus": "confirmed",
      "riskScore": 20,
      "signals": [
        "Elevated HR (76 bpm)"
      ]
    },
    {
      "date": "2026-09-18",
      "dayIndex": 80,
      "steps": 6097,
      "hrBpm": 70,
      "systolicBp": 133,
      "diastolicBp": 85,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-09-19",
      "dayIndex": 81,
      "steps": 6011,
      "hrBpm": 71,
      "systolicBp": 133,
      "diastolicBp": 79,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-09-20",
      "dayIndex": 82,
      "steps": 6083,
      "hrBpm": 68,
      "systolicBp": 140,
      "diastolicBp": 82,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-09-21",
      "dayIndex": 83,
      "steps": 6727,
      "hrBpm": 77,
      "systolicBp": 139,
      "diastolicBp": 82,
      "medStatus": "confirmed",
      "riskScore": 20,
      "signals": [
        "Elevated HR (77 bpm)"
      ]
    },
    {
      "date": "2026-09-22",
      "dayIndex": 84,
      "steps": 5078,
      "hrBpm": 65,
      "systolicBp": 124,
      "diastolicBp": 79,
      "medStatus": "unconfirmed",
      "riskScore": 15,
      "signals": [
        "BP drop (124 mmHg)"
      ]
    },
    {
      "date": "2026-09-23",
      "dayIndex": 85,
      "steps": 5482,
      "hrBpm": 71,
      "systolicBp": 131,
      "diastolicBp": 90,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-09-24",
      "dayIndex": 86,
      "steps": 5727,
      "hrBpm": 68,
      "systolicBp": 132,
      "diastolicBp": 79,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-09-25",
      "dayIndex": 87,
      "steps": 6202,
      "hrBpm": 64,
      "systolicBp": 146,
      "diastolicBp": 87,
      "medStatus": "confirmed",
      "riskScore": 16,
      "signals": [
        "Elevated BP (146 mmHg, +2.6 SD)"
      ]
    },
    {
      "date": "2026-09-26",
      "dayIndex": 88,
      "steps": 5525,
      "hrBpm": 65,
      "systolicBp": 137,
      "diastolicBp": 83,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-09-27",
      "dayIndex": 89,
      "steps": 6799,
      "hrBpm": 75,
      "systolicBp": 139,
      "diastolicBp": 88,
      "medStatus": "confirmed",
      "riskScore": 15,
      "signals": [
        "Elevated HR (75 bpm)"
      ]
    },
    {
      "date": "2026-09-28",
      "dayIndex": 90,
      "steps": 5489,
      "hrBpm": 69,
      "systolicBp": 141,
      "diastolicBp": 83,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    }
  ],
  "SW015": [
    {
      "date": "2026-07-01",
      "dayIndex": 1,
      "steps": 3021,
      "hrBpm": 64,
      "systolicBp": 141,
      "diastolicBp": 80,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-07-02",
      "dayIndex": 2,
      "steps": 2513,
      "hrBpm": 65,
      "systolicBp": 141,
      "diastolicBp": 78,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-07-03",
      "dayIndex": 3,
      "steps": 3257,
      "hrBpm": 64,
      "systolicBp": 143,
      "diastolicBp": 71,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-07-04",
      "dayIndex": 4,
      "steps": 2895,
      "hrBpm": 66,
      "systolicBp": 146,
      "diastolicBp": 76,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-07-05",
      "dayIndex": 5,
      "steps": 3321,
      "hrBpm": 65,
      "systolicBp": 135,
      "diastolicBp": 70,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-07-06",
      "dayIndex": 6,
      "steps": 3209,
      "hrBpm": 60,
      "systolicBp": 135,
      "diastolicBp": 73,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-07-07",
      "dayIndex": 7,
      "steps": 2625,
      "hrBpm": 64,
      "systolicBp": 129,
      "diastolicBp": 77,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-07-08",
      "dayIndex": 8,
      "steps": 2908,
      "hrBpm": 67,
      "systolicBp": 131,
      "diastolicBp": 72,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-07-09",
      "dayIndex": 9,
      "steps": 3113,
      "hrBpm": 60,
      "systolicBp": 130,
      "diastolicBp": 80,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-07-10",
      "dayIndex": 10,
      "steps": 3465,
      "hrBpm": 66,
      "systolicBp": 132,
      "diastolicBp": 71,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-07-11",
      "dayIndex": 11,
      "steps": 2706,
      "hrBpm": 67,
      "systolicBp": 129,
      "diastolicBp": 77,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-07-12",
      "dayIndex": 12,
      "steps": 2164,
      "hrBpm": 66,
      "systolicBp": 133,
      "diastolicBp": 81,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-07-13",
      "dayIndex": 13,
      "steps": 3259,
      "hrBpm": 64,
      "systolicBp": 127,
      "diastolicBp": 76,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-07-14",
      "dayIndex": 14,
      "steps": 3232,
      "hrBpm": 63,
      "systolicBp": 130,
      "diastolicBp": 68,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-07-15",
      "dayIndex": 15,
      "steps": 2760,
      "hrBpm": 68,
      "systolicBp": 146,
      "diastolicBp": 74,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-07-16",
      "dayIndex": 16,
      "steps": 2948,
      "hrBpm": 67,
      "systolicBp": 128,
      "diastolicBp": 78,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-07-17",
      "dayIndex": 17,
      "steps": 2823,
      "hrBpm": 67,
      "systolicBp": 129,
      "diastolicBp": 77,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-07-18",
      "dayIndex": 18,
      "steps": 2755,
      "hrBpm": 69,
      "systolicBp": 131,
      "diastolicBp": 82,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-07-19",
      "dayIndex": 19,
      "steps": 2537,
      "hrBpm": 68,
      "systolicBp": 132,
      "diastolicBp": 77,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-07-20",
      "dayIndex": 20,
      "steps": 2459,
      "hrBpm": 60,
      "systolicBp": 145,
      "diastolicBp": 77,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-07-21",
      "dayIndex": 21,
      "steps": 3371,
      "hrBpm": 63,
      "systolicBp": 145,
      "diastolicBp": 74,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-07-22",
      "dayIndex": 22,
      "steps": 1675,
      "hrBpm": 64,
      "systolicBp": 140,
      "diastolicBp": 69,
      "medStatus": "confirmed",
      "riskScore": 15,
      "signals": [
        "Activity reduced (-42% steps)"
      ]
    },
    {
      "date": "2026-07-23",
      "dayIndex": 23,
      "steps": 2334,
      "hrBpm": 63,
      "systolicBp": 140,
      "diastolicBp": 81,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-07-24",
      "dayIndex": 24,
      "steps": 2345,
      "hrBpm": 64,
      "systolicBp": 142,
      "diastolicBp": 83,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-07-25",
      "dayIndex": 25,
      "steps": 3223,
      "hrBpm": 57,
      "systolicBp": 136,
      "diastolicBp": 78,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-07-26",
      "dayIndex": 26,
      "steps": 2751,
      "hrBpm": 64,
      "systolicBp": 126,
      "diastolicBp": 69,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-07-27",
      "dayIndex": 27,
      "steps": 3285,
      "hrBpm": 63,
      "systolicBp": 147,
      "diastolicBp": 81,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-07-28",
      "dayIndex": 28,
      "steps": 3129,
      "hrBpm": 63,
      "systolicBp": 138,
      "diastolicBp": 70,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-07-29",
      "dayIndex": 29,
      "steps": 2835,
      "hrBpm": 64,
      "systolicBp": 140,
      "diastolicBp": 84,
      "medStatus": "unconfirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-07-30",
      "dayIndex": 30,
      "steps": 2995,
      "hrBpm": 61,
      "systolicBp": 143,
      "diastolicBp": 69,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-07-31",
      "dayIndex": 31,
      "steps": 2666,
      "hrBpm": 64,
      "systolicBp": 115,
      "diastolicBp": 80,
      "medStatus": "confirmed",
      "riskScore": 15,
      "signals": [
        "BP drop (115 mmHg)"
      ]
    },
    {
      "date": "2026-08-01",
      "dayIndex": 32,
      "steps": 2746,
      "hrBpm": 65,
      "systolicBp": 128,
      "diastolicBp": 76,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-08-02",
      "dayIndex": 33,
      "steps": 3286,
      "hrBpm": 66,
      "systolicBp": 138,
      "diastolicBp": 76,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-08-03",
      "dayIndex": 34,
      "steps": 2993,
      "hrBpm": 59,
      "systolicBp": 156,
      "diastolicBp": 77,
      "medStatus": "confirmed",
      "riskScore": 24,
      "signals": [
        "Elevated BP (156 mmHg, +3.1 SD)"
      ]
    },
    {
      "date": "2026-08-04",
      "dayIndex": 35,
      "steps": 2551,
      "hrBpm": 65,
      "systolicBp": 131,
      "diastolicBp": 76,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-08-05",
      "dayIndex": 36,
      "steps": 3754,
      "hrBpm": 72,
      "systolicBp": 124,
      "diastolicBp": 81,
      "medStatus": "confirmed",
      "riskScore": 15,
      "signals": [
        "Elevated HR (72 bpm)"
      ]
    },
    {
      "date": "2026-08-06",
      "dayIndex": 37,
      "steps": 3352,
      "hrBpm": 71,
      "systolicBp": 126,
      "diastolicBp": 74,
      "medStatus": "unconfirmed",
      "riskScore": 11,
      "signals": [
        "Elevated HR (71 bpm)"
      ]
    },
    {
      "date": "2026-08-07",
      "dayIndex": 38,
      "steps": 2913,
      "hrBpm": 60,
      "systolicBp": 125,
      "diastolicBp": 78,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-08-08",
      "dayIndex": 39,
      "steps": 2856,
      "hrBpm": 66,
      "systolicBp": 127,
      "diastolicBp": 79,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-08-09",
      "dayIndex": 40,
      "steps": 2551,
      "hrBpm": 68,
      "systolicBp": 136,
      "diastolicBp": 77,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-08-10",
      "dayIndex": 41,
      "steps": 2902,
      "hrBpm": 71,
      "systolicBp": 138,
      "diastolicBp": 76,
      "medStatus": "confirmed",
      "riskScore": 11,
      "signals": [
        "Elevated HR (71 bpm)"
      ]
    },
    {
      "date": "2026-08-11",
      "dayIndex": 42,
      "steps": 3576,
      "hrBpm": 62,
      "systolicBp": 144,
      "diastolicBp": 73,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-08-12",
      "dayIndex": 43,
      "steps": 2224,
      "hrBpm": 64,
      "systolicBp": 134,
      "diastolicBp": 75,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-08-13",
      "dayIndex": 44,
      "steps": 2490,
      "hrBpm": 70,
      "systolicBp": 125,
      "diastolicBp": 72,
      "medStatus": "confirmed",
      "riskScore": 7,
      "signals": [
        "Elevated HR (70 bpm)"
      ]
    },
    {
      "date": "2026-08-14",
      "dayIndex": 45,
      "steps": 3402,
      "hrBpm": 66,
      "systolicBp": 132,
      "diastolicBp": 80,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-08-15",
      "dayIndex": 46,
      "steps": 3654,
      "hrBpm": 68,
      "systolicBp": 133,
      "diastolicBp": 82,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-08-16",
      "dayIndex": 47,
      "steps": 2951,
      "hrBpm": 67,
      "systolicBp": 136,
      "diastolicBp": 77,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-08-17",
      "dayIndex": 48,
      "steps": 3076,
      "hrBpm": 66,
      "systolicBp": 129,
      "diastolicBp": 72,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-08-18",
      "dayIndex": 49,
      "steps": 3288,
      "hrBpm": 59,
      "systolicBp": 122,
      "diastolicBp": 75,
      "medStatus": "confirmed",
      "riskScore": 15,
      "signals": [
        "BP drop (122 mmHg)"
      ]
    },
    {
      "date": "2026-08-19",
      "dayIndex": 50,
      "steps": 3156,
      "hrBpm": 61,
      "systolicBp": 129,
      "diastolicBp": 72,
      "medStatus": "unconfirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-08-20",
      "dayIndex": 51,
      "steps": 2787,
      "hrBpm": 67,
      "systolicBp": 132,
      "diastolicBp": 87,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-08-21",
      "dayIndex": 52,
      "steps": 2349,
      "hrBpm": 58,
      "systolicBp": 139,
      "diastolicBp": 70,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-08-22",
      "dayIndex": 53,
      "steps": 3338,
      "hrBpm": 67,
      "systolicBp": 147,
      "diastolicBp": 73,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-08-23",
      "dayIndex": 54,
      "steps": 2577,
      "hrBpm": 59,
      "systolicBp": 137,
      "diastolicBp": 78,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-08-24",
      "dayIndex": 55,
      "steps": 2922,
      "hrBpm": 66,
      "systolicBp": 135,
      "diastolicBp": 71,
      "medStatus": "unconfirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-08-25",
      "dayIndex": 56,
      "steps": 3012,
      "hrBpm": 65,
      "systolicBp": 131,
      "diastolicBp": 72,
      "medStatus": "unconfirmed",
      "riskScore": 12,
      "signals": [
        "3 unconfirmed meds this week"
      ]
    },
    {
      "date": "2026-08-26",
      "dayIndex": 57,
      "steps": 2838,
      "hrBpm": 64,
      "systolicBp": 137,
      "diastolicBp": 79,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-08-27",
      "dayIndex": 58,
      "steps": 2785,
      "hrBpm": 62,
      "systolicBp": 136,
      "diastolicBp": 80,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-08-28",
      "dayIndex": 59,
      "steps": 3393,
      "hrBpm": 65,
      "systolicBp": 143,
      "diastolicBp": 77,
      "medStatus": "unconfirmed",
      "riskScore": 12,
      "signals": [
        "3 unconfirmed meds this week"
      ]
    },
    {
      "date": "2026-08-29",
      "dayIndex": 60,
      "steps": 3000,
      "hrBpm": 64,
      "systolicBp": 144,
      "diastolicBp": 83,
      "medStatus": "confirmed",
      "riskScore": 12,
      "signals": [
        "3 unconfirmed meds this week"
      ]
    },
    {
      "date": "2026-08-30",
      "dayIndex": 61,
      "steps": 2541,
      "hrBpm": 66,
      "systolicBp": 133,
      "diastolicBp": 84,
      "medStatus": "confirmed",
      "riskScore": 12,
      "signals": [
        "3 unconfirmed meds this week"
      ]
    },
    {
      "date": "2026-08-31",
      "dayIndex": 62,
      "steps": 2287,
      "hrBpm": 68,
      "systolicBp": 133,
      "diastolicBp": 78,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-09-01",
      "dayIndex": 63,
      "steps": 2560,
      "hrBpm": 67,
      "systolicBp": 154,
      "diastolicBp": 75,
      "medStatus": "confirmed",
      "riskScore": 19,
      "signals": [
        "Elevated BP (154 mmHg, +2.8 SD)"
      ]
    },
    {
      "date": "2026-09-02",
      "dayIndex": 64,
      "steps": 3766,
      "hrBpm": 70,
      "systolicBp": 134,
      "diastolicBp": 74,
      "medStatus": "confirmed",
      "riskScore": 7,
      "signals": [
        "Elevated HR (70 bpm)"
      ]
    },
    {
      "date": "2026-09-03",
      "dayIndex": 65,
      "steps": 3430,
      "hrBpm": 66,
      "systolicBp": 129,
      "diastolicBp": 76,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-09-04",
      "dayIndex": 66,
      "steps": 2347,
      "hrBpm": 66,
      "systolicBp": 136,
      "diastolicBp": 72,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-09-05",
      "dayIndex": 67,
      "steps": 2315,
      "hrBpm": 63,
      "systolicBp": 132,
      "diastolicBp": 76,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-09-06",
      "dayIndex": 68,
      "steps": 3106,
      "hrBpm": 63,
      "systolicBp": 132,
      "diastolicBp": 80,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-09-07",
      "dayIndex": 69,
      "steps": 2735,
      "hrBpm": 63,
      "systolicBp": 147,
      "diastolicBp": 82,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-09-08",
      "dayIndex": 70,
      "steps": 2893,
      "hrBpm": 62,
      "systolicBp": 133,
      "diastolicBp": 72,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-09-09",
      "dayIndex": 71,
      "steps": 2880,
      "hrBpm": 67,
      "systolicBp": 134,
      "diastolicBp": 71,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-09-10",
      "dayIndex": 72,
      "steps": 3266,
      "hrBpm": 62,
      "systolicBp": 136,
      "diastolicBp": 84,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-09-11",
      "dayIndex": 73,
      "steps": 3044,
      "hrBpm": 66,
      "systolicBp": 135,
      "diastolicBp": 70,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-09-12",
      "dayIndex": 74,
      "steps": 2925,
      "hrBpm": 61,
      "systolicBp": 138,
      "diastolicBp": 79,
      "medStatus": "unconfirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-09-13",
      "dayIndex": 75,
      "steps": 2147,
      "hrBpm": 61,
      "systolicBp": 144,
      "diastolicBp": 77,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-09-14",
      "dayIndex": 76,
      "steps": 2953,
      "hrBpm": 61,
      "systolicBp": 135,
      "diastolicBp": 78,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-09-15",
      "dayIndex": 77,
      "steps": 2883,
      "hrBpm": 68,
      "systolicBp": 134,
      "diastolicBp": 72,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-09-16",
      "dayIndex": 78,
      "steps": 2846,
      "hrBpm": 69,
      "systolicBp": 124,
      "diastolicBp": 79,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-09-17",
      "dayIndex": 79,
      "steps": 3130,
      "hrBpm": 70,
      "systolicBp": 137,
      "diastolicBp": 79,
      "medStatus": "confirmed",
      "riskScore": 7,
      "signals": [
        "Elevated HR (70 bpm)"
      ]
    },
    {
      "date": "2026-09-18",
      "dayIndex": 80,
      "steps": 2314,
      "hrBpm": 62,
      "systolicBp": 138,
      "diastolicBp": 84,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-09-19",
      "dayIndex": 81,
      "steps": 1319,
      "hrBpm": 63,
      "systolicBp": 132,
      "diastolicBp": 79,
      "medStatus": "confirmed",
      "riskScore": 19,
      "signals": [
        "Activity reduced (-54% steps)"
      ]
    },
    {
      "date": "2026-09-20",
      "dayIndex": 82,
      "steps": 3228,
      "hrBpm": 65,
      "systolicBp": 132,
      "diastolicBp": 74,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-09-21",
      "dayIndex": 83,
      "steps": 2912,
      "hrBpm": 65,
      "systolicBp": 145,
      "diastolicBp": 71,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-09-22",
      "dayIndex": 84,
      "steps": 2952,
      "hrBpm": 64,
      "systolicBp": 146,
      "diastolicBp": 76,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-09-23",
      "dayIndex": 85,
      "steps": 3156,
      "hrBpm": 69,
      "systolicBp": 143,
      "diastolicBp": 78,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-09-24",
      "dayIndex": 86,
      "steps": 2899,
      "hrBpm": 62,
      "systolicBp": 143,
      "diastolicBp": 82,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-09-25",
      "dayIndex": 87,
      "steps": 2930,
      "hrBpm": 63,
      "systolicBp": 142,
      "diastolicBp": 73,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-09-26",
      "dayIndex": 88,
      "steps": 3305,
      "hrBpm": 64,
      "systolicBp": 131,
      "diastolicBp": 78,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-09-27",
      "dayIndex": 89,
      "steps": 3055,
      "hrBpm": 66,
      "systolicBp": 137,
      "diastolicBp": 78,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-09-28",
      "dayIndex": 90,
      "steps": 2917,
      "hrBpm": 72,
      "systolicBp": 139,
      "diastolicBp": 71,
      "medStatus": "confirmed",
      "riskScore": 15,
      "signals": [
        "Elevated HR (72 bpm)"
      ]
    }
  ],
  "SW016": [
    {
      "date": "2026-07-01",
      "dayIndex": 1,
      "steps": 3282,
      "hrBpm": 79,
      "systolicBp": 130,
      "diastolicBp": 83,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-07-02",
      "dayIndex": 2,
      "steps": 3991,
      "hrBpm": 78,
      "systolicBp": 121,
      "diastolicBp": 82,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-07-03",
      "dayIndex": 3,
      "steps": 2746,
      "hrBpm": 79,
      "systolicBp": 128,
      "diastolicBp": 77,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-07-04",
      "dayIndex": 4,
      "steps": 3057,
      "hrBpm": 81,
      "systolicBp": 131,
      "diastolicBp": 82,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-07-05",
      "dayIndex": 5,
      "steps": 2708,
      "hrBpm": 79,
      "systolicBp": 125,
      "diastolicBp": 75,
      "medStatus": "unconfirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-07-06",
      "dayIndex": 6,
      "steps": 3070,
      "hrBpm": 81,
      "systolicBp": 140,
      "diastolicBp": 84,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-07-07",
      "dayIndex": 7,
      "steps": 3333,
      "hrBpm": 86,
      "systolicBp": 136,
      "diastolicBp": 88,
      "medStatus": "unconfirmed",
      "riskScore": 6,
      "signals": [
        "Elevated HR (86 bpm)"
      ]
    },
    {
      "date": "2026-07-08",
      "dayIndex": 8,
      "steps": 3748,
      "hrBpm": 74,
      "systolicBp": 129,
      "diastolicBp": 88,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-07-09",
      "dayIndex": 9,
      "steps": 3364,
      "hrBpm": 80,
      "systolicBp": 132,
      "diastolicBp": 86,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-07-10",
      "dayIndex": 10,
      "steps": 4094,
      "hrBpm": 83,
      "systolicBp": 140,
      "diastolicBp": 87,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-07-11",
      "dayIndex": 11,
      "steps": 3492,
      "hrBpm": 76,
      "systolicBp": 130,
      "diastolicBp": 82,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-07-12",
      "dayIndex": 12,
      "steps": 2724,
      "hrBpm": 79,
      "systolicBp": 127,
      "diastolicBp": 82,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-07-13",
      "dayIndex": 13,
      "steps": 3163,
      "hrBpm": 79,
      "systolicBp": 130,
      "diastolicBp": 86,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-07-14",
      "dayIndex": 14,
      "steps": 3276,
      "hrBpm": 77,
      "systolicBp": 133,
      "diastolicBp": 85,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-07-15",
      "dayIndex": 15,
      "steps": 2995,
      "hrBpm": 73,
      "systolicBp": 123,
      "diastolicBp": 83,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-07-16",
      "dayIndex": 16,
      "steps": 3041,
      "hrBpm": 83,
      "systolicBp": 138,
      "diastolicBp": 84,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-07-17",
      "dayIndex": 17,
      "steps": 3447,
      "hrBpm": 86,
      "systolicBp": 132,
      "diastolicBp": 84,
      "medStatus": "confirmed",
      "riskScore": 6,
      "signals": [
        "Elevated HR (86 bpm)"
      ]
    },
    {
      "date": "2026-07-18",
      "dayIndex": 18,
      "steps": 2646,
      "hrBpm": 82,
      "systolicBp": 132,
      "diastolicBp": 85,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-07-19",
      "dayIndex": 19,
      "steps": 3318,
      "hrBpm": 84,
      "systolicBp": 127,
      "diastolicBp": 90,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-07-20",
      "dayIndex": 20,
      "steps": 3230,
      "hrBpm": 81,
      "systolicBp": 134,
      "diastolicBp": 81,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-07-21",
      "dayIndex": 21,
      "steps": 2284,
      "hrBpm": 79,
      "systolicBp": 126,
      "diastolicBp": 78,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-07-22",
      "dayIndex": 22,
      "steps": 3926,
      "hrBpm": 80,
      "systolicBp": 130,
      "diastolicBp": 83,
      "medStatus": "unconfirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-07-23",
      "dayIndex": 23,
      "steps": 3633,
      "hrBpm": 80,
      "systolicBp": 140,
      "diastolicBp": 87,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-07-24",
      "dayIndex": 24,
      "steps": 3826,
      "hrBpm": 79,
      "systolicBp": 139,
      "diastolicBp": 84,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-07-25",
      "dayIndex": 25,
      "steps": 3737,
      "hrBpm": 79,
      "systolicBp": 146,
      "diastolicBp": 85,
      "medStatus": "confirmed",
      "riskScore": 13,
      "signals": [
        "Elevated BP (146 mmHg, +2.3 SD)"
      ]
    },
    {
      "date": "2026-07-26",
      "dayIndex": 26,
      "steps": 3402,
      "hrBpm": 82,
      "systolicBp": 126,
      "diastolicBp": 82,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-07-27",
      "dayIndex": 27,
      "steps": 3522,
      "hrBpm": 80,
      "systolicBp": 122,
      "diastolicBp": 78,
      "medStatus": "unconfirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-07-28",
      "dayIndex": 28,
      "steps": 3235,
      "hrBpm": 81,
      "systolicBp": 140,
      "diastolicBp": 85,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-07-29",
      "dayIndex": 29,
      "steps": 3205,
      "hrBpm": 79,
      "systolicBp": 127,
      "diastolicBp": 76,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-07-30",
      "dayIndex": 30,
      "steps": 3036,
      "hrBpm": 82,
      "systolicBp": 134,
      "diastolicBp": 85,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-07-31",
      "dayIndex": 31,
      "steps": 3617,
      "hrBpm": 84,
      "systolicBp": 132,
      "diastolicBp": 81,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-08-01",
      "dayIndex": 32,
      "steps": 3651,
      "hrBpm": 84,
      "systolicBp": 129,
      "diastolicBp": 84,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-08-02",
      "dayIndex": 33,
      "steps": 3023,
      "hrBpm": 77,
      "systolicBp": 119,
      "diastolicBp": 82,
      "medStatus": "unconfirmed",
      "riskScore": 15,
      "signals": [
        "BP drop (119 mmHg)"
      ]
    },
    {
      "date": "2026-08-03",
      "dayIndex": 34,
      "steps": 3050,
      "hrBpm": 72,
      "systolicBp": 135,
      "diastolicBp": 82,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-08-04",
      "dayIndex": 35,
      "steps": 3958,
      "hrBpm": 76,
      "systolicBp": 138,
      "diastolicBp": 88,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-08-05",
      "dayIndex": 36,
      "steps": 4112,
      "hrBpm": 79,
      "systolicBp": 120,
      "diastolicBp": 81,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-08-06",
      "dayIndex": 37,
      "steps": 4168,
      "hrBpm": 84,
      "systolicBp": 132,
      "diastolicBp": 83,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-08-07",
      "dayIndex": 38,
      "steps": 3388,
      "hrBpm": 84,
      "systolicBp": 125,
      "diastolicBp": 84,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-08-08",
      "dayIndex": 39,
      "steps": 2782,
      "hrBpm": 77,
      "systolicBp": 136,
      "diastolicBp": 81,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-08-09",
      "dayIndex": 40,
      "steps": 3687,
      "hrBpm": 78,
      "systolicBp": 141,
      "diastolicBp": 90,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-08-10",
      "dayIndex": 41,
      "steps": 3352,
      "hrBpm": 78,
      "systolicBp": 128,
      "diastolicBp": 92,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-08-11",
      "dayIndex": 42,
      "steps": 3435,
      "hrBpm": 83,
      "systolicBp": 131,
      "diastolicBp": 80,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-08-12",
      "dayIndex": 43,
      "steps": 3825,
      "hrBpm": 77,
      "systolicBp": 137,
      "diastolicBp": 82,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-08-13",
      "dayIndex": 44,
      "steps": 3259,
      "hrBpm": 82,
      "systolicBp": 134,
      "diastolicBp": 88,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-08-14",
      "dayIndex": 45,
      "steps": 3497,
      "hrBpm": 82,
      "systolicBp": 138,
      "diastolicBp": 86,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-08-15",
      "dayIndex": 46,
      "steps": 4182,
      "hrBpm": 80,
      "systolicBp": 121,
      "diastolicBp": 82,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-08-16",
      "dayIndex": 47,
      "steps": 3226,
      "hrBpm": 78,
      "systolicBp": 134,
      "diastolicBp": 77,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-08-17",
      "dayIndex": 48,
      "steps": 3049,
      "hrBpm": 83,
      "systolicBp": 130,
      "diastolicBp": 80,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-08-18",
      "dayIndex": 49,
      "steps": 3666,
      "hrBpm": 81,
      "systolicBp": 129,
      "diastolicBp": 83,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-08-19",
      "dayIndex": 50,
      "steps": 3481,
      "hrBpm": 84,
      "systolicBp": 132,
      "diastolicBp": 84,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-08-20",
      "dayIndex": 51,
      "steps": 3337,
      "hrBpm": 74,
      "systolicBp": 126,
      "diastolicBp": 77,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-08-21",
      "dayIndex": 52,
      "steps": 3261,
      "hrBpm": 74,
      "systolicBp": 131,
      "diastolicBp": 88,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-08-22",
      "dayIndex": 53,
      "steps": 3454,
      "hrBpm": 72,
      "systolicBp": 125,
      "diastolicBp": 80,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-08-23",
      "dayIndex": 54,
      "steps": 3825,
      "hrBpm": 74,
      "systolicBp": 143,
      "diastolicBp": 88,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-08-24",
      "dayIndex": 55,
      "steps": 3307,
      "hrBpm": 84,
      "systolicBp": 127,
      "diastolicBp": 85,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-08-25",
      "dayIndex": 56,
      "steps": 3016,
      "hrBpm": 75,
      "systolicBp": 130,
      "diastolicBp": 74,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-08-26",
      "dayIndex": 57,
      "steps": 2956,
      "hrBpm": 80,
      "systolicBp": 136,
      "diastolicBp": 72,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-08-27",
      "dayIndex": 58,
      "steps": 3313,
      "hrBpm": 81,
      "systolicBp": 132,
      "diastolicBp": 87,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-08-28",
      "dayIndex": 59,
      "steps": 2989,
      "hrBpm": 79,
      "systolicBp": 130,
      "diastolicBp": 82,
      "medStatus": "unconfirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-08-29",
      "dayIndex": 60,
      "steps": 3003,
      "hrBpm": 73,
      "systolicBp": 119,
      "diastolicBp": 82,
      "medStatus": "confirmed",
      "riskScore": 15,
      "signals": [
        "BP drop (119 mmHg)"
      ]
    },
    {
      "date": "2026-08-30",
      "dayIndex": 61,
      "steps": 3894,
      "hrBpm": 76,
      "systolicBp": 127,
      "diastolicBp": 82,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-08-31",
      "dayIndex": 62,
      "steps": 3607,
      "hrBpm": 82,
      "systolicBp": 128,
      "diastolicBp": 79,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-09-01",
      "dayIndex": 63,
      "steps": 3573,
      "hrBpm": 79,
      "systolicBp": 128,
      "diastolicBp": 81,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-09-02",
      "dayIndex": 64,
      "steps": 2750,
      "hrBpm": 75,
      "systolicBp": 135,
      "diastolicBp": 86,
      "medStatus": "unconfirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-09-03",
      "dayIndex": 65,
      "steps": 3545,
      "hrBpm": 80,
      "systolicBp": 128,
      "diastolicBp": 91,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-09-04",
      "dayIndex": 66,
      "steps": 3191,
      "hrBpm": 78,
      "systolicBp": 129,
      "diastolicBp": 87,
      "medStatus": "unconfirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-09-05",
      "dayIndex": 67,
      "steps": 3239,
      "hrBpm": 79,
      "systolicBp": 127,
      "diastolicBp": 81,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-09-06",
      "dayIndex": 68,
      "steps": 3546,
      "hrBpm": 82,
      "systolicBp": 123,
      "diastolicBp": 85,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-09-07",
      "dayIndex": 69,
      "steps": 3191,
      "hrBpm": 81,
      "systolicBp": 130,
      "diastolicBp": 81,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-09-08",
      "dayIndex": 70,
      "steps": 3485,
      "hrBpm": 79,
      "systolicBp": 121,
      "diastolicBp": 84,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-09-09",
      "dayIndex": 71,
      "steps": 3444,
      "hrBpm": 84,
      "systolicBp": 125,
      "diastolicBp": 75,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-09-10",
      "dayIndex": 72,
      "steps": 2741,
      "hrBpm": 81,
      "systolicBp": 121,
      "diastolicBp": 80,
      "medStatus": "unconfirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-09-11",
      "dayIndex": 73,
      "steps": 2940,
      "hrBpm": 80,
      "systolicBp": 125,
      "diastolicBp": 83,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-09-12",
      "dayIndex": 74,
      "steps": 2939,
      "hrBpm": 76,
      "systolicBp": 132,
      "diastolicBp": 82,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-09-13",
      "dayIndex": 75,
      "steps": 3423,
      "hrBpm": 80,
      "systolicBp": 129,
      "diastolicBp": 86,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-09-14",
      "dayIndex": 76,
      "steps": 3999,
      "hrBpm": 79,
      "systolicBp": 139,
      "diastolicBp": 90,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-09-15",
      "dayIndex": 77,
      "steps": 3703,
      "hrBpm": 80,
      "systolicBp": 127,
      "diastolicBp": 84,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-09-16",
      "dayIndex": 78,
      "steps": 4088,
      "hrBpm": 79,
      "systolicBp": 127,
      "diastolicBp": 80,
      "medStatus": "unconfirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-09-17",
      "dayIndex": 79,
      "steps": 3297,
      "hrBpm": 75,
      "systolicBp": 133,
      "diastolicBp": 90,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-09-18",
      "dayIndex": 80,
      "steps": 3224,
      "hrBpm": 80,
      "systolicBp": 122,
      "diastolicBp": 79,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-09-19",
      "dayIndex": 81,
      "steps": 3576,
      "hrBpm": 81,
      "systolicBp": 123,
      "diastolicBp": 87,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-09-20",
      "dayIndex": 82,
      "steps": 3636,
      "hrBpm": 80,
      "systolicBp": 132,
      "diastolicBp": 82,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-09-21",
      "dayIndex": 83,
      "steps": 3451,
      "hrBpm": 80,
      "systolicBp": 128,
      "diastolicBp": 85,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-09-22",
      "dayIndex": 84,
      "steps": 3544,
      "hrBpm": 81,
      "systolicBp": 132,
      "diastolicBp": 86,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-09-23",
      "dayIndex": 85,
      "steps": 2985,
      "hrBpm": 74,
      "systolicBp": 122,
      "diastolicBp": 79,
      "medStatus": "unconfirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-09-24",
      "dayIndex": 86,
      "steps": 3175,
      "hrBpm": 80,
      "systolicBp": 130,
      "diastolicBp": 78,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-09-25",
      "dayIndex": 87,
      "steps": 3784,
      "hrBpm": 79,
      "systolicBp": 133,
      "diastolicBp": 84,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-09-26",
      "dayIndex": 88,
      "steps": 3123,
      "hrBpm": 82,
      "systolicBp": 127,
      "diastolicBp": 86,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-09-27",
      "dayIndex": 89,
      "steps": 3147,
      "hrBpm": 83,
      "systolicBp": 139,
      "diastolicBp": 79,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-09-28",
      "dayIndex": 90,
      "steps": 3724,
      "hrBpm": 83,
      "systolicBp": 127,
      "diastolicBp": 86,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    }
  ],
  "SW017": [
    {
      "date": "2026-07-01",
      "dayIndex": 1,
      "steps": 5850,
      "hrBpm": 80,
      "systolicBp": 137,
      "diastolicBp": 72,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-07-02",
      "dayIndex": 2,
      "steps": 6314,
      "hrBpm": 76,
      "systolicBp": 129,
      "diastolicBp": 80,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-07-03",
      "dayIndex": 3,
      "steps": 5410,
      "hrBpm": 77,
      "systolicBp": 133,
      "diastolicBp": 71,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-07-04",
      "dayIndex": 4,
      "steps": 5818,
      "hrBpm": 73,
      "systolicBp": 128,
      "diastolicBp": 72,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-07-05",
      "dayIndex": 5,
      "steps": 5050,
      "hrBpm": 76,
      "systolicBp": 124,
      "diastolicBp": 69,
      "medStatus": "confirmed",
      "riskScore": 15,
      "signals": [
        "BP drop (124 mmHg)"
      ]
    },
    {
      "date": "2026-07-06",
      "dayIndex": 6,
      "steps": 5859,
      "hrBpm": 73,
      "systolicBp": 134,
      "diastolicBp": 74,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-07-07",
      "dayIndex": 7,
      "steps": 5771,
      "hrBpm": 78,
      "systolicBp": 137,
      "diastolicBp": 82,
      "medStatus": "unconfirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-07-08",
      "dayIndex": 8,
      "steps": 5519,
      "hrBpm": 74,
      "systolicBp": 134,
      "diastolicBp": 81,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-07-09",
      "dayIndex": 9,
      "steps": 6248,
      "hrBpm": 69,
      "systolicBp": 140,
      "diastolicBp": 71,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-07-10",
      "dayIndex": 10,
      "steps": 6204,
      "hrBpm": 81,
      "systolicBp": 131,
      "diastolicBp": 76,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-07-11",
      "dayIndex": 11,
      "steps": 6254,
      "hrBpm": 72,
      "systolicBp": 140,
      "diastolicBp": 73,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-07-12",
      "dayIndex": 12,
      "steps": 5650,
      "hrBpm": 70,
      "systolicBp": 145,
      "diastolicBp": 78,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-07-13",
      "dayIndex": 13,
      "steps": 5904,
      "hrBpm": 81,
      "systolicBp": 132,
      "diastolicBp": 69,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-07-14",
      "dayIndex": 14,
      "steps": 5964,
      "hrBpm": 73,
      "systolicBp": 134,
      "diastolicBp": 84,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-07-15",
      "dayIndex": 15,
      "steps": 5687,
      "hrBpm": 79,
      "systolicBp": 137,
      "diastolicBp": 79,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-07-16",
      "dayIndex": 16,
      "steps": 5521,
      "hrBpm": 71,
      "systolicBp": 140,
      "diastolicBp": 82,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-07-17",
      "dayIndex": 17,
      "steps": 5077,
      "hrBpm": 70,
      "systolicBp": 144,
      "diastolicBp": 78,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-07-18",
      "dayIndex": 18,
      "steps": 6134,
      "hrBpm": 75,
      "systolicBp": 134,
      "diastolicBp": 79,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-07-19",
      "dayIndex": 19,
      "steps": 6281,
      "hrBpm": 80,
      "systolicBp": 132,
      "diastolicBp": 83,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-07-20",
      "dayIndex": 20,
      "steps": 5437,
      "hrBpm": 74,
      "systolicBp": 126,
      "diastolicBp": 79,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-07-21",
      "dayIndex": 21,
      "steps": 5495,
      "hrBpm": 77,
      "systolicBp": 139,
      "diastolicBp": 78,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-07-22",
      "dayIndex": 22,
      "steps": 5725,
      "hrBpm": 74,
      "systolicBp": 140,
      "diastolicBp": 81,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-07-23",
      "dayIndex": 23,
      "steps": 5855,
      "hrBpm": 77,
      "systolicBp": 143,
      "diastolicBp": 73,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-07-24",
      "dayIndex": 24,
      "steps": 5945,
      "hrBpm": 77,
      "systolicBp": 135,
      "diastolicBp": 77,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-07-25",
      "dayIndex": 25,
      "steps": 5336,
      "hrBpm": 79,
      "systolicBp": 140,
      "diastolicBp": 71,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-07-26",
      "dayIndex": 26,
      "steps": 5523,
      "hrBpm": 72,
      "systolicBp": 137,
      "diastolicBp": 78,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-07-27",
      "dayIndex": 27,
      "steps": 5264,
      "hrBpm": 74,
      "systolicBp": 139,
      "diastolicBp": 86,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-07-28",
      "dayIndex": 28,
      "steps": 5955,
      "hrBpm": 67,
      "systolicBp": 137,
      "diastolicBp": 70,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-07-29",
      "dayIndex": 29,
      "steps": 6403,
      "hrBpm": 70,
      "systolicBp": 142,
      "diastolicBp": 77,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-07-30",
      "dayIndex": 30,
      "steps": 5147,
      "hrBpm": 74,
      "systolicBp": 131,
      "diastolicBp": 78,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-07-31",
      "dayIndex": 31,
      "steps": 5195,
      "hrBpm": 81,
      "systolicBp": 127,
      "diastolicBp": 80,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-08-01",
      "dayIndex": 32,
      "steps": 4492,
      "hrBpm": 79,
      "systolicBp": 132,
      "diastolicBp": 76,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-08-02",
      "dayIndex": 33,
      "steps": 5398,
      "hrBpm": 68,
      "systolicBp": 134,
      "diastolicBp": 82,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-08-03",
      "dayIndex": 34,
      "steps": 5813,
      "hrBpm": 69,
      "systolicBp": 136,
      "diastolicBp": 79,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-08-04",
      "dayIndex": 35,
      "steps": 5832,
      "hrBpm": 71,
      "systolicBp": 135,
      "diastolicBp": 76,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-08-05",
      "dayIndex": 36,
      "steps": 5526,
      "hrBpm": 73,
      "systolicBp": 130,
      "diastolicBp": 83,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-08-06",
      "dayIndex": 37,
      "steps": 5784,
      "hrBpm": 76,
      "systolicBp": 133,
      "diastolicBp": 75,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-08-07",
      "dayIndex": 38,
      "steps": 5628,
      "hrBpm": 72,
      "systolicBp": 135,
      "diastolicBp": 75,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-08-08",
      "dayIndex": 39,
      "steps": 4572,
      "hrBpm": 71,
      "systolicBp": 141,
      "diastolicBp": 75,
      "medStatus": "unconfirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-08-09",
      "dayIndex": 40,
      "steps": 5888,
      "hrBpm": 75,
      "systolicBp": 125,
      "diastolicBp": 78,
      "medStatus": "confirmed",
      "riskScore": 15,
      "signals": [
        "BP drop (125 mmHg)"
      ]
    },
    {
      "date": "2026-08-10",
      "dayIndex": 41,
      "steps": 5937,
      "hrBpm": 75,
      "systolicBp": 140,
      "diastolicBp": 79,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-08-11",
      "dayIndex": 42,
      "steps": 5079,
      "hrBpm": 76,
      "systolicBp": 136,
      "diastolicBp": 68,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-08-12",
      "dayIndex": 43,
      "steps": 4810,
      "hrBpm": 73,
      "systolicBp": 130,
      "diastolicBp": 76,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-08-13",
      "dayIndex": 44,
      "steps": 5809,
      "hrBpm": 71,
      "systolicBp": 143,
      "diastolicBp": 80,
      "medStatus": "unconfirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-08-14",
      "dayIndex": 45,
      "steps": 5633,
      "hrBpm": 71,
      "systolicBp": 137,
      "diastolicBp": 71,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-08-15",
      "dayIndex": 46,
      "steps": 6173,
      "hrBpm": 72,
      "systolicBp": 130,
      "diastolicBp": 79,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-08-16",
      "dayIndex": 47,
      "steps": 5561,
      "hrBpm": 72,
      "systolicBp": 141,
      "diastolicBp": 81,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-08-17",
      "dayIndex": 48,
      "steps": 4865,
      "hrBpm": 72,
      "systolicBp": 134,
      "diastolicBp": 86,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-08-18",
      "dayIndex": 49,
      "steps": 6330,
      "hrBpm": 74,
      "systolicBp": 135,
      "diastolicBp": 76,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-08-19",
      "dayIndex": 50,
      "steps": 5662,
      "hrBpm": 74,
      "systolicBp": 138,
      "diastolicBp": 75,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-08-20",
      "dayIndex": 51,
      "steps": 5541,
      "hrBpm": 74,
      "systolicBp": 128,
      "diastolicBp": 76,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-08-21",
      "dayIndex": 52,
      "steps": 6098,
      "hrBpm": 75,
      "systolicBp": 127,
      "diastolicBp": 67,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-08-22",
      "dayIndex": 53,
      "steps": 6231,
      "hrBpm": 75,
      "systolicBp": 131,
      "diastolicBp": 79,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-08-23",
      "dayIndex": 54,
      "steps": 6210,
      "hrBpm": 67,
      "systolicBp": 131,
      "diastolicBp": 82,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-08-24",
      "dayIndex": 55,
      "steps": 5180,
      "hrBpm": 77,
      "systolicBp": 128,
      "diastolicBp": 74,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-08-25",
      "dayIndex": 56,
      "steps": 5357,
      "hrBpm": 72,
      "systolicBp": 141,
      "diastolicBp": 70,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-08-26",
      "dayIndex": 57,
      "steps": 4229,
      "hrBpm": 76,
      "systolicBp": 135,
      "diastolicBp": 80,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-08-27",
      "dayIndex": 58,
      "steps": 4609,
      "hrBpm": 76,
      "systolicBp": 137,
      "diastolicBp": 71,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-08-28",
      "dayIndex": 59,
      "steps": 5991,
      "hrBpm": 76,
      "systolicBp": 138,
      "diastolicBp": 77,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-08-29",
      "dayIndex": 60,
      "steps": 5999,
      "hrBpm": 75,
      "systolicBp": 139,
      "diastolicBp": 85,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-08-30",
      "dayIndex": 61,
      "steps": 5553,
      "hrBpm": 76,
      "systolicBp": 142,
      "diastolicBp": 71,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-08-31",
      "dayIndex": 62,
      "steps": 5117,
      "hrBpm": 69,
      "systolicBp": 145,
      "diastolicBp": 75,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-09-01",
      "dayIndex": 63,
      "steps": 5272,
      "hrBpm": 75,
      "systolicBp": 135,
      "diastolicBp": 71,
      "medStatus": "unconfirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-09-02",
      "dayIndex": 64,
      "steps": 5494,
      "hrBpm": 73,
      "systolicBp": 143,
      "diastolicBp": 74,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-09-03",
      "dayIndex": 65,
      "steps": 5858,
      "hrBpm": 79,
      "systolicBp": 129,
      "diastolicBp": 84,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-09-04",
      "dayIndex": 66,
      "steps": 6268,
      "hrBpm": 78,
      "systolicBp": 138,
      "diastolicBp": 70,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-09-05",
      "dayIndex": 67,
      "steps": 5300,
      "hrBpm": 77,
      "systolicBp": 139,
      "diastolicBp": 73,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-09-06",
      "dayIndex": 68,
      "steps": 5441,
      "hrBpm": 73,
      "systolicBp": 135,
      "diastolicBp": 76,
      "medStatus": "unconfirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-09-07",
      "dayIndex": 69,
      "steps": 5817,
      "hrBpm": 78,
      "systolicBp": 144,
      "diastolicBp": 75,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-09-08",
      "dayIndex": 70,
      "steps": 5717,
      "hrBpm": 73,
      "systolicBp": 140,
      "diastolicBp": 75,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-09-09",
      "dayIndex": 71,
      "steps": 6235,
      "hrBpm": 72,
      "systolicBp": 144,
      "diastolicBp": 66,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-09-10",
      "dayIndex": 72,
      "steps": 5756,
      "hrBpm": 72,
      "systolicBp": 134,
      "diastolicBp": 75,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-09-11",
      "dayIndex": 73,
      "steps": 6215,
      "hrBpm": 78,
      "systolicBp": 152,
      "diastolicBp": 77,
      "medStatus": "unconfirmed",
      "riskScore": 24,
      "signals": [
        "Elevated BP (152 mmHg, +3.1 SD)"
      ]
    },
    {
      "date": "2026-09-12",
      "dayIndex": 74,
      "steps": 5786,
      "hrBpm": 73,
      "systolicBp": 139,
      "diastolicBp": 76,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-09-13",
      "dayIndex": 75,
      "steps": 5519,
      "hrBpm": 74,
      "systolicBp": 138,
      "diastolicBp": 82,
      "medStatus": "unconfirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-09-14",
      "dayIndex": 76,
      "steps": 5466,
      "hrBpm": 75,
      "systolicBp": 133,
      "diastolicBp": 80,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-09-15",
      "dayIndex": 77,
      "steps": 5376,
      "hrBpm": 73,
      "systolicBp": 134,
      "diastolicBp": 71,
      "medStatus": "unconfirmed",
      "riskScore": 12,
      "signals": [
        "3 unconfirmed meds this week"
      ]
    },
    {
      "date": "2026-09-16",
      "dayIndex": 78,
      "steps": 5870,
      "hrBpm": 78,
      "systolicBp": 140,
      "diastolicBp": 70,
      "medStatus": "confirmed",
      "riskScore": 12,
      "signals": [
        "3 unconfirmed meds this week"
      ]
    },
    {
      "date": "2026-09-17",
      "dayIndex": 79,
      "steps": 4880,
      "hrBpm": 78,
      "systolicBp": 147,
      "diastolicBp": 73,
      "medStatus": "confirmed",
      "riskScore": 21,
      "signals": [
        "Elevated BP (147 mmHg, +2.1 SD)",
        "3 unconfirmed meds this week"
      ]
    },
    {
      "date": "2026-09-18",
      "dayIndex": 80,
      "steps": 5529,
      "hrBpm": 73,
      "systolicBp": 129,
      "diastolicBp": 75,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-09-19",
      "dayIndex": 81,
      "steps": 5778,
      "hrBpm": 76,
      "systolicBp": 134,
      "diastolicBp": 72,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-09-20",
      "dayIndex": 82,
      "steps": 5688,
      "hrBpm": 77,
      "systolicBp": 136,
      "diastolicBp": 74,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-09-21",
      "dayIndex": 83,
      "steps": 4731,
      "hrBpm": 76,
      "systolicBp": 134,
      "diastolicBp": 67,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-09-22",
      "dayIndex": 84,
      "steps": 5741,
      "hrBpm": 74,
      "systolicBp": 131,
      "diastolicBp": 79,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-09-23",
      "dayIndex": 85,
      "steps": 5599,
      "hrBpm": 72,
      "systolicBp": 130,
      "diastolicBp": 74,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-09-24",
      "dayIndex": 86,
      "steps": 5978,
      "hrBpm": 72,
      "systolicBp": 142,
      "diastolicBp": 82,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-09-25",
      "dayIndex": 87,
      "steps": 5041,
      "hrBpm": 74,
      "systolicBp": 135,
      "diastolicBp": 71,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-09-26",
      "dayIndex": 88,
      "steps": 5866,
      "hrBpm": 74,
      "systolicBp": 141,
      "diastolicBp": 72,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-09-27",
      "dayIndex": 89,
      "steps": 5168,
      "hrBpm": 73,
      "systolicBp": 140,
      "diastolicBp": 70,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-09-28",
      "dayIndex": 90,
      "steps": 5642,
      "hrBpm": 74,
      "systolicBp": 135,
      "diastolicBp": 83,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    }
  ],
  "SW018": [
    {
      "date": "2026-07-01",
      "dayIndex": 1,
      "steps": 1943,
      "hrBpm": 71,
      "systolicBp": 134,
      "diastolicBp": 85,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-07-02",
      "dayIndex": 2,
      "steps": 2661,
      "hrBpm": 78,
      "systolicBp": 125,
      "diastolicBp": 80,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-07-03",
      "dayIndex": 3,
      "steps": 2242,
      "hrBpm": 79,
      "systolicBp": 136,
      "diastolicBp": 80,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-07-04",
      "dayIndex": 4,
      "steps": 3373,
      "hrBpm": 82,
      "systolicBp": 130,
      "diastolicBp": 84,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-07-05",
      "dayIndex": 5,
      "steps": 3125,
      "hrBpm": 78,
      "systolicBp": 136,
      "diastolicBp": 82,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-07-06",
      "dayIndex": 6,
      "steps": 3108,
      "hrBpm": 78,
      "systolicBp": 126,
      "diastolicBp": 79,
      "medStatus": "unconfirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-07-07",
      "dayIndex": 7,
      "steps": 2669,
      "hrBpm": 85,
      "systolicBp": 131,
      "diastolicBp": 84,
      "medStatus": "confirmed",
      "riskScore": 6,
      "signals": [
        "Elevated HR (85 bpm)"
      ]
    },
    {
      "date": "2026-07-08",
      "dayIndex": 8,
      "steps": 3234,
      "hrBpm": 84,
      "systolicBp": 131,
      "diastolicBp": 85,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-07-09",
      "dayIndex": 9,
      "steps": 2907,
      "hrBpm": 80,
      "systolicBp": 126,
      "diastolicBp": 70,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-07-10",
      "dayIndex": 10,
      "steps": 2988,
      "hrBpm": 79,
      "systolicBp": 132,
      "diastolicBp": 76,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-07-11",
      "dayIndex": 11,
      "steps": 3132,
      "hrBpm": 76,
      "systolicBp": 136,
      "diastolicBp": 86,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-07-12",
      "dayIndex": 12,
      "steps": 3903,
      "hrBpm": 81,
      "systolicBp": 135,
      "diastolicBp": 86,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-07-13",
      "dayIndex": 13,
      "steps": 3133,
      "hrBpm": 76,
      "systolicBp": 126,
      "diastolicBp": 78,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-07-14",
      "dayIndex": 14,
      "steps": 2325,
      "hrBpm": 77,
      "systolicBp": 139,
      "diastolicBp": 84,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-07-15",
      "dayIndex": 15,
      "steps": 2885,
      "hrBpm": 77,
      "systolicBp": 134,
      "diastolicBp": 77,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-07-16",
      "dayIndex": 16,
      "steps": 2667,
      "hrBpm": 81,
      "systolicBp": 131,
      "diastolicBp": 80,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-07-17",
      "dayIndex": 17,
      "steps": 3124,
      "hrBpm": 81,
      "systolicBp": 136,
      "diastolicBp": 74,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-07-18",
      "dayIndex": 18,
      "steps": 2511,
      "hrBpm": 78,
      "systolicBp": 131,
      "diastolicBp": 90,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-07-19",
      "dayIndex": 19,
      "steps": 2849,
      "hrBpm": 80,
      "systolicBp": 134,
      "diastolicBp": 81,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-07-20",
      "dayIndex": 20,
      "steps": 2535,
      "hrBpm": 82,
      "systolicBp": 128,
      "diastolicBp": 80,
      "medStatus": "unconfirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-07-21",
      "dayIndex": 21,
      "steps": 2624,
      "hrBpm": 78,
      "systolicBp": 135,
      "diastolicBp": 75,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-07-22",
      "dayIndex": 22,
      "steps": 3178,
      "hrBpm": 76,
      "systolicBp": 133,
      "diastolicBp": 78,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-07-23",
      "dayIndex": 23,
      "steps": 3995,
      "hrBpm": 78,
      "systolicBp": 132,
      "diastolicBp": 78,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-07-24",
      "dayIndex": 24,
      "steps": 2595,
      "hrBpm": 80,
      "systolicBp": 149,
      "diastolicBp": 80,
      "medStatus": "confirmed",
      "riskScore": 20,
      "signals": [
        "Elevated BP (149 mmHg, +2.9 SD)"
      ]
    },
    {
      "date": "2026-07-25",
      "dayIndex": 25,
      "steps": 2418,
      "hrBpm": 79,
      "systolicBp": 122,
      "diastolicBp": 72,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-07-26",
      "dayIndex": 26,
      "steps": 2360,
      "hrBpm": 81,
      "systolicBp": 124,
      "diastolicBp": 77,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-07-27",
      "dayIndex": 27,
      "steps": 2486,
      "hrBpm": 81,
      "systolicBp": 132,
      "diastolicBp": 72,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-07-28",
      "dayIndex": 28,
      "steps": 2847,
      "hrBpm": 76,
      "systolicBp": 145,
      "diastolicBp": 75,
      "medStatus": "confirmed",
      "riskScore": 10,
      "signals": [
        "Elevated BP (145 mmHg, +2.1 SD)"
      ]
    },
    {
      "date": "2026-07-29",
      "dayIndex": 29,
      "steps": 2233,
      "hrBpm": 78,
      "systolicBp": 136,
      "diastolicBp": 83,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-07-30",
      "dayIndex": 30,
      "steps": 1694,
      "hrBpm": 83,
      "systolicBp": 134,
      "diastolicBp": 85,
      "medStatus": "unconfirmed",
      "riskScore": 14,
      "signals": [
        "Activity reduced (-39% steps)"
      ]
    },
    {
      "date": "2026-07-31",
      "dayIndex": 31,
      "steps": 2618,
      "hrBpm": 77,
      "systolicBp": 140,
      "diastolicBp": 83,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-08-01",
      "dayIndex": 32,
      "steps": 2146,
      "hrBpm": 80,
      "systolicBp": 134,
      "diastolicBp": 82,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-08-02",
      "dayIndex": 33,
      "steps": 3316,
      "hrBpm": 84,
      "systolicBp": 150,
      "diastolicBp": 88,
      "medStatus": "confirmed",
      "riskScore": 23,
      "signals": [
        "Elevated BP (150 mmHg, +3 SD)"
      ]
    },
    {
      "date": "2026-08-03",
      "dayIndex": 34,
      "steps": 3216,
      "hrBpm": 81,
      "systolicBp": 142,
      "diastolicBp": 84,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-08-04",
      "dayIndex": 35,
      "steps": 3700,
      "hrBpm": 83,
      "systolicBp": 138,
      "diastolicBp": 74,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-08-05",
      "dayIndex": 36,
      "steps": 2574,
      "hrBpm": 79,
      "systolicBp": 127,
      "diastolicBp": 82,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-08-06",
      "dayIndex": 37,
      "steps": 2049,
      "hrBpm": 87,
      "systolicBp": 141,
      "diastolicBp": 80,
      "medStatus": "confirmed",
      "riskScore": 14,
      "signals": [
        "Elevated HR (87 bpm)"
      ]
    },
    {
      "date": "2026-08-07",
      "dayIndex": 38,
      "steps": 3099,
      "hrBpm": 75,
      "systolicBp": 123,
      "diastolicBp": 74,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-08-08",
      "dayIndex": 39,
      "steps": 2682,
      "hrBpm": 88,
      "systolicBp": 133,
      "diastolicBp": 85,
      "medStatus": "confirmed",
      "riskScore": 17,
      "signals": [
        "Elevated HR (88 bpm)"
      ]
    },
    {
      "date": "2026-08-09",
      "dayIndex": 40,
      "steps": 1919,
      "hrBpm": 79,
      "systolicBp": 133,
      "diastolicBp": 84,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-08-10",
      "dayIndex": 41,
      "steps": 3106,
      "hrBpm": 77,
      "systolicBp": 145,
      "diastolicBp": 69,
      "medStatus": "confirmed",
      "riskScore": 10,
      "signals": [
        "Elevated BP (145 mmHg, +2.1 SD)"
      ]
    },
    {
      "date": "2026-08-11",
      "dayIndex": 42,
      "steps": 3115,
      "hrBpm": 80,
      "systolicBp": 144,
      "diastolicBp": 83,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-08-12",
      "dayIndex": 43,
      "steps": 2810,
      "hrBpm": 83,
      "systolicBp": 132,
      "diastolicBp": 83,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-08-13",
      "dayIndex": 44,
      "steps": 2855,
      "hrBpm": 79,
      "systolicBp": 135,
      "diastolicBp": 80,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-08-14",
      "dayIndex": 45,
      "steps": 2965,
      "hrBpm": 77,
      "systolicBp": 128,
      "diastolicBp": 81,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-08-15",
      "dayIndex": 46,
      "steps": 2501,
      "hrBpm": 78,
      "systolicBp": 130,
      "diastolicBp": 76,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-08-16",
      "dayIndex": 47,
      "steps": 2220,
      "hrBpm": 76,
      "systolicBp": 133,
      "diastolicBp": 84,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-08-17",
      "dayIndex": 48,
      "steps": 2749,
      "hrBpm": 83,
      "systolicBp": 141,
      "diastolicBp": 76,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-08-18",
      "dayIndex": 49,
      "steps": 1874,
      "hrBpm": 82,
      "systolicBp": 140,
      "diastolicBp": 83,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-08-19",
      "dayIndex": 50,
      "steps": 2116,
      "hrBpm": 81,
      "systolicBp": 127,
      "diastolicBp": 80,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-08-20",
      "dayIndex": 51,
      "steps": 3043,
      "hrBpm": 82,
      "systolicBp": 145,
      "diastolicBp": 75,
      "medStatus": "confirmed",
      "riskScore": 10,
      "signals": [
        "Elevated BP (145 mmHg, +2.1 SD)"
      ]
    },
    {
      "date": "2026-08-21",
      "dayIndex": 52,
      "steps": 2380,
      "hrBpm": 83,
      "systolicBp": 125,
      "diastolicBp": 74,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-08-22",
      "dayIndex": 53,
      "steps": 2757,
      "hrBpm": 80,
      "systolicBp": 135,
      "diastolicBp": 76,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-08-23",
      "dayIndex": 54,
      "steps": 2917,
      "hrBpm": 79,
      "systolicBp": 132,
      "diastolicBp": 76,
      "medStatus": "unconfirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-08-24",
      "dayIndex": 55,
      "steps": 2539,
      "hrBpm": 81,
      "systolicBp": 137,
      "diastolicBp": 80,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-08-25",
      "dayIndex": 56,
      "steps": 2975,
      "hrBpm": 79,
      "systolicBp": 125,
      "diastolicBp": 74,
      "medStatus": "unconfirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-08-26",
      "dayIndex": 57,
      "steps": 3164,
      "hrBpm": 73,
      "systolicBp": 136,
      "diastolicBp": 78,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-08-27",
      "dayIndex": 58,
      "steps": 3621,
      "hrBpm": 82,
      "systolicBp": 132,
      "diastolicBp": 83,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-08-28",
      "dayIndex": 59,
      "steps": 3108,
      "hrBpm": 80,
      "systolicBp": 129,
      "diastolicBp": 81,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-08-29",
      "dayIndex": 60,
      "steps": 2628,
      "hrBpm": 76,
      "systolicBp": 131,
      "diastolicBp": 72,
      "medStatus": "unconfirmed",
      "riskScore": 12,
      "signals": [
        "3 unconfirmed meds this week"
      ]
    },
    {
      "date": "2026-08-30",
      "dayIndex": 61,
      "steps": 2896,
      "hrBpm": 73,
      "systolicBp": 137,
      "diastolicBp": 82,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-08-31",
      "dayIndex": 62,
      "steps": 3042,
      "hrBpm": 77,
      "systolicBp": 138,
      "diastolicBp": 78,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-09-01",
      "dayIndex": 63,
      "steps": 2776,
      "hrBpm": 81,
      "systolicBp": 131,
      "diastolicBp": 77,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-09-02",
      "dayIndex": 64,
      "steps": 2924,
      "hrBpm": 74,
      "systolicBp": 141,
      "diastolicBp": 75,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-09-03",
      "dayIndex": 65,
      "steps": 2766,
      "hrBpm": 80,
      "systolicBp": 144,
      "diastolicBp": 75,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-09-04",
      "dayIndex": 66,
      "steps": 3289,
      "hrBpm": 77,
      "systolicBp": 131,
      "diastolicBp": 80,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-09-05",
      "dayIndex": 67,
      "steps": 2920,
      "hrBpm": 81,
      "systolicBp": 137,
      "diastolicBp": 81,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-09-06",
      "dayIndex": 68,
      "steps": 2091,
      "hrBpm": 82,
      "systolicBp": 129,
      "diastolicBp": 72,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-09-07",
      "dayIndex": 69,
      "steps": 2386,
      "hrBpm": 79,
      "systolicBp": 131,
      "diastolicBp": 82,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-09-08",
      "dayIndex": 70,
      "steps": 2345,
      "hrBpm": 78,
      "systolicBp": 144,
      "diastolicBp": 83,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-09-09",
      "dayIndex": 71,
      "steps": 3738,
      "hrBpm": 80,
      "systolicBp": 128,
      "diastolicBp": 76,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-09-10",
      "dayIndex": 72,
      "steps": 2841,
      "hrBpm": 82,
      "systolicBp": 137,
      "diastolicBp": 75,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-09-11",
      "dayIndex": 73,
      "steps": 3683,
      "hrBpm": 77,
      "systolicBp": 135,
      "diastolicBp": 77,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-09-12",
      "dayIndex": 74,
      "steps": 2538,
      "hrBpm": 84,
      "systolicBp": 132,
      "diastolicBp": 84,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-09-13",
      "dayIndex": 75,
      "steps": 2339,
      "hrBpm": 79,
      "systolicBp": 135,
      "diastolicBp": 82,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-09-14",
      "dayIndex": 76,
      "steps": 3361,
      "hrBpm": 81,
      "systolicBp": 139,
      "diastolicBp": 79,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-09-15",
      "dayIndex": 77,
      "steps": 2209,
      "hrBpm": 79,
      "systolicBp": 136,
      "diastolicBp": 78,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-09-16",
      "dayIndex": 78,
      "steps": 2007,
      "hrBpm": 81,
      "systolicBp": 131,
      "diastolicBp": 85,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-09-17",
      "dayIndex": 79,
      "steps": 2507,
      "hrBpm": 81,
      "systolicBp": 139,
      "diastolicBp": 82,
      "medStatus": "unconfirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-09-18",
      "dayIndex": 80,
      "steps": 2776,
      "hrBpm": 78,
      "systolicBp": 138,
      "diastolicBp": 83,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-09-19",
      "dayIndex": 81,
      "steps": 2632,
      "hrBpm": 83,
      "systolicBp": 133,
      "diastolicBp": 83,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-09-20",
      "dayIndex": 82,
      "steps": 2571,
      "hrBpm": 84,
      "systolicBp": 132,
      "diastolicBp": 82,
      "medStatus": "unconfirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-09-21",
      "dayIndex": 83,
      "steps": 2351,
      "hrBpm": 79,
      "systolicBp": 139,
      "diastolicBp": 83,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-09-22",
      "dayIndex": 84,
      "steps": 3121,
      "hrBpm": 80,
      "systolicBp": 126,
      "diastolicBp": 83,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-09-23",
      "dayIndex": 85,
      "steps": 3998,
      "hrBpm": 81,
      "systolicBp": 142,
      "diastolicBp": 80,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-09-24",
      "dayIndex": 86,
      "steps": 2448,
      "hrBpm": 78,
      "systolicBp": 141,
      "diastolicBp": 80,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-09-25",
      "dayIndex": 87,
      "steps": 3338,
      "hrBpm": 77,
      "systolicBp": 132,
      "diastolicBp": 75,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-09-26",
      "dayIndex": 88,
      "steps": 2747,
      "hrBpm": 76,
      "systolicBp": 140,
      "diastolicBp": 75,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-09-27",
      "dayIndex": 89,
      "steps": 2184,
      "hrBpm": 78,
      "systolicBp": 123,
      "diastolicBp": 79,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-09-28",
      "dayIndex": 90,
      "steps": 3286,
      "hrBpm": 81,
      "systolicBp": 142,
      "diastolicBp": 78,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    }
  ],
  "SW019": [
    {
      "date": "2026-07-01",
      "dayIndex": 1,
      "steps": 3530,
      "hrBpm": 69,
      "systolicBp": 139,
      "diastolicBp": 60,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-07-02",
      "dayIndex": 2,
      "steps": 4064,
      "hrBpm": 66,
      "systolicBp": 139,
      "diastolicBp": 62,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-07-03",
      "dayIndex": 3,
      "steps": 4000,
      "hrBpm": 68,
      "systolicBp": 134,
      "diastolicBp": 68,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-07-04",
      "dayIndex": 4,
      "steps": 4266,
      "hrBpm": 70,
      "systolicBp": 131,
      "diastolicBp": 66,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-07-05",
      "dayIndex": 5,
      "steps": 3468,
      "hrBpm": 70,
      "systolicBp": 121,
      "diastolicBp": 64,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-07-06",
      "dayIndex": 6,
      "steps": 2942,
      "hrBpm": 63,
      "systolicBp": 129,
      "diastolicBp": 68,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-07-07",
      "dayIndex": 7,
      "steps": 3429,
      "hrBpm": 69,
      "systolicBp": 139,
      "diastolicBp": 58,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-07-08",
      "dayIndex": 8,
      "steps": 4079,
      "hrBpm": 64,
      "systolicBp": 138,
      "diastolicBp": 59,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-07-09",
      "dayIndex": 9,
      "steps": 4141,
      "hrBpm": 72,
      "systolicBp": 131,
      "diastolicBp": 67,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-07-10",
      "dayIndex": 10,
      "steps": 3585,
      "hrBpm": 67,
      "systolicBp": 131,
      "diastolicBp": 65,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-07-11",
      "dayIndex": 11,
      "steps": 3825,
      "hrBpm": 66,
      "systolicBp": 126,
      "diastolicBp": 66,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-07-12",
      "dayIndex": 12,
      "steps": 3540,
      "hrBpm": 71,
      "systolicBp": 124,
      "diastolicBp": 61,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-07-13",
      "dayIndex": 13,
      "steps": 3756,
      "hrBpm": 72,
      "systolicBp": 133,
      "diastolicBp": 69,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-07-14",
      "dayIndex": 14,
      "steps": 3085,
      "hrBpm": 66,
      "systolicBp": 130,
      "diastolicBp": 72,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-07-15",
      "dayIndex": 15,
      "steps": 3198,
      "hrBpm": 68,
      "systolicBp": 125,
      "diastolicBp": 61,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-07-16",
      "dayIndex": 16,
      "steps": 4077,
      "hrBpm": 66,
      "systolicBp": 137,
      "diastolicBp": 62,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-07-17",
      "dayIndex": 17,
      "steps": 4119,
      "hrBpm": 69,
      "systolicBp": 120,
      "diastolicBp": 61,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-07-18",
      "dayIndex": 18,
      "steps": 2916,
      "hrBpm": 66,
      "systolicBp": 125,
      "diastolicBp": 61,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-07-19",
      "dayIndex": 19,
      "steps": 4171,
      "hrBpm": 69,
      "systolicBp": 137,
      "diastolicBp": 65,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-07-20",
      "dayIndex": 20,
      "steps": 4029,
      "hrBpm": 68,
      "systolicBp": 121,
      "diastolicBp": 63,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-07-21",
      "dayIndex": 21,
      "steps": 3079,
      "hrBpm": 65,
      "systolicBp": 129,
      "diastolicBp": 70,
      "medStatus": "unconfirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-07-22",
      "dayIndex": 22,
      "steps": 2821,
      "hrBpm": 69,
      "systolicBp": 135,
      "diastolicBp": 67,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-07-23",
      "dayIndex": 23,
      "steps": 3419,
      "hrBpm": 63,
      "systolicBp": 148,
      "diastolicBp": 64,
      "medStatus": "confirmed",
      "riskScore": 17,
      "signals": [
        "Elevated BP (148 mmHg, +2.6 SD)"
      ]
    },
    {
      "date": "2026-07-24",
      "dayIndex": 24,
      "steps": 4426,
      "hrBpm": 66,
      "systolicBp": 133,
      "diastolicBp": 59,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-07-25",
      "dayIndex": 25,
      "steps": 3714,
      "hrBpm": 58,
      "systolicBp": 139,
      "diastolicBp": 62,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-07-26",
      "dayIndex": 26,
      "steps": 2888,
      "hrBpm": 70,
      "systolicBp": 124,
      "diastolicBp": 65,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-07-27",
      "dayIndex": 27,
      "steps": 4074,
      "hrBpm": 62,
      "systolicBp": 133,
      "diastolicBp": 70,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-07-28",
      "dayIndex": 28,
      "steps": 3957,
      "hrBpm": 69,
      "systolicBp": 128,
      "diastolicBp": 60,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-07-29",
      "dayIndex": 29,
      "steps": 4076,
      "hrBpm": 67,
      "systolicBp": 135,
      "diastolicBp": 65,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-07-30",
      "dayIndex": 30,
      "steps": 3524,
      "hrBpm": 66,
      "systolicBp": 126,
      "diastolicBp": 66,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-07-31",
      "dayIndex": 31,
      "steps": 3785,
      "hrBpm": 69,
      "systolicBp": 128,
      "diastolicBp": 61,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-08-01",
      "dayIndex": 32,
      "steps": 4366,
      "hrBpm": 68,
      "systolicBp": 136,
      "diastolicBp": 54,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-08-02",
      "dayIndex": 33,
      "steps": 2878,
      "hrBpm": 66,
      "systolicBp": 133,
      "diastolicBp": 59,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-08-03",
      "dayIndex": 34,
      "steps": 3172,
      "hrBpm": 66,
      "systolicBp": 117,
      "diastolicBp": 61,
      "medStatus": "confirmed",
      "riskScore": 15,
      "signals": [
        "BP drop (117 mmHg)"
      ]
    },
    {
      "date": "2026-08-04",
      "dayIndex": 35,
      "steps": 4282,
      "hrBpm": 64,
      "systolicBp": 134,
      "diastolicBp": 64,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-08-05",
      "dayIndex": 36,
      "steps": 4122,
      "hrBpm": 69,
      "systolicBp": 133,
      "diastolicBp": 72,
      "medStatus": "unconfirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-08-06",
      "dayIndex": 37,
      "steps": 3634,
      "hrBpm": 64,
      "systolicBp": 135,
      "diastolicBp": 61,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-08-07",
      "dayIndex": 38,
      "steps": 3860,
      "hrBpm": 66,
      "systolicBp": 131,
      "diastolicBp": 72,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-08-08",
      "dayIndex": 39,
      "steps": 3129,
      "hrBpm": 73,
      "systolicBp": 131,
      "diastolicBp": 66,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-08-09",
      "dayIndex": 40,
      "steps": 4330,
      "hrBpm": 62,
      "systolicBp": 131,
      "diastolicBp": 62,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-08-10",
      "dayIndex": 41,
      "steps": 3471,
      "hrBpm": 64,
      "systolicBp": 124,
      "diastolicBp": 54,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-08-11",
      "dayIndex": 42,
      "steps": 4130,
      "hrBpm": 65,
      "systolicBp": 125,
      "diastolicBp": 68,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-08-12",
      "dayIndex": 43,
      "steps": 3488,
      "hrBpm": 70,
      "systolicBp": 130,
      "diastolicBp": 73,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-08-13",
      "dayIndex": 44,
      "steps": 4214,
      "hrBpm": 65,
      "systolicBp": 128,
      "diastolicBp": 69,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-08-14",
      "dayIndex": 45,
      "steps": 2783,
      "hrBpm": 71,
      "systolicBp": 141,
      "diastolicBp": 60,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-08-15",
      "dayIndex": 46,
      "steps": 3719,
      "hrBpm": 62,
      "systolicBp": 124,
      "diastolicBp": 68,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-08-16",
      "dayIndex": 47,
      "steps": 2868,
      "hrBpm": 66,
      "systolicBp": 135,
      "diastolicBp": 68,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-08-17",
      "dayIndex": 48,
      "steps": 3737,
      "hrBpm": 66,
      "systolicBp": 126,
      "diastolicBp": 63,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-08-18",
      "dayIndex": 49,
      "steps": 3844,
      "hrBpm": 64,
      "systolicBp": 131,
      "diastolicBp": 69,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-08-19",
      "dayIndex": 50,
      "steps": 4484,
      "hrBpm": 61,
      "systolicBp": 141,
      "diastolicBp": 63,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-08-20",
      "dayIndex": 51,
      "steps": 3538,
      "hrBpm": 64,
      "systolicBp": 123,
      "diastolicBp": 56,
      "medStatus": "unconfirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-08-21",
      "dayIndex": 52,
      "steps": 3846,
      "hrBpm": 70,
      "systolicBp": 125,
      "diastolicBp": 63,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-08-22",
      "dayIndex": 53,
      "steps": 4072,
      "hrBpm": 62,
      "systolicBp": 132,
      "diastolicBp": 71,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-08-23",
      "dayIndex": 54,
      "steps": 4083,
      "hrBpm": 70,
      "systolicBp": 125,
      "diastolicBp": 69,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-08-24",
      "dayIndex": 55,
      "steps": 3976,
      "hrBpm": 66,
      "systolicBp": 138,
      "diastolicBp": 66,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-08-25",
      "dayIndex": 56,
      "steps": 3885,
      "hrBpm": 68,
      "systolicBp": 128,
      "diastolicBp": 64,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-08-26",
      "dayIndex": 57,
      "steps": 3514,
      "hrBpm": 62,
      "systolicBp": 124,
      "diastolicBp": 72,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-08-27",
      "dayIndex": 58,
      "steps": 4058,
      "hrBpm": 61,
      "systolicBp": 134,
      "diastolicBp": 69,
      "medStatus": "unconfirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-08-28",
      "dayIndex": 59,
      "steps": 4168,
      "hrBpm": 71,
      "systolicBp": 125,
      "diastolicBp": 67,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-08-29",
      "dayIndex": 60,
      "steps": 3544,
      "hrBpm": 68,
      "systolicBp": 135,
      "diastolicBp": 61,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-08-30",
      "dayIndex": 61,
      "steps": 3588,
      "hrBpm": 69,
      "systolicBp": 137,
      "diastolicBp": 66,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-08-31",
      "dayIndex": 62,
      "steps": 3743,
      "hrBpm": 65,
      "systolicBp": 141,
      "diastolicBp": 65,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-09-01",
      "dayIndex": 63,
      "steps": 3657,
      "hrBpm": 67,
      "systolicBp": 141,
      "diastolicBp": 68,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-09-02",
      "dayIndex": 64,
      "steps": 3952,
      "hrBpm": 67,
      "systolicBp": 137,
      "diastolicBp": 64,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-09-03",
      "dayIndex": 65,
      "steps": 4640,
      "hrBpm": 63,
      "systolicBp": 129,
      "diastolicBp": 68,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-09-04",
      "dayIndex": 66,
      "steps": 3482,
      "hrBpm": 66,
      "systolicBp": 141,
      "diastolicBp": 68,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-09-05",
      "dayIndex": 67,
      "steps": 3381,
      "hrBpm": 66,
      "systolicBp": 128,
      "diastolicBp": 69,
      "medStatus": "unconfirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-09-06",
      "dayIndex": 68,
      "steps": 4141,
      "hrBpm": 64,
      "systolicBp": 126,
      "diastolicBp": 66,
      "medStatus": "unconfirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-09-07",
      "dayIndex": 69,
      "steps": 3494,
      "hrBpm": 64,
      "systolicBp": 131,
      "diastolicBp": 65,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-09-08",
      "dayIndex": 70,
      "steps": 3233,
      "hrBpm": 64,
      "systolicBp": 115,
      "diastolicBp": 61,
      "medStatus": "confirmed",
      "riskScore": 15,
      "signals": [
        "BP drop (115 mmHg)"
      ]
    },
    {
      "date": "2026-09-09",
      "dayIndex": 71,
      "steps": 4232,
      "hrBpm": 64,
      "systolicBp": 138,
      "diastolicBp": 68,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-09-10",
      "dayIndex": 72,
      "steps": 3103,
      "hrBpm": 70,
      "systolicBp": 132,
      "diastolicBp": 70,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-09-11",
      "dayIndex": 73,
      "steps": 3605,
      "hrBpm": 71,
      "systolicBp": 137,
      "diastolicBp": 66,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-09-12",
      "dayIndex": 74,
      "steps": 3357,
      "hrBpm": 61,
      "systolicBp": 129,
      "diastolicBp": 64,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-09-13",
      "dayIndex": 75,
      "steps": 3670,
      "hrBpm": 66,
      "systolicBp": 131,
      "diastolicBp": 67,
      "medStatus": "unconfirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-09-14",
      "dayIndex": 76,
      "steps": 4276,
      "hrBpm": 70,
      "systolicBp": 130,
      "diastolicBp": 71,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-09-15",
      "dayIndex": 77,
      "steps": 4186,
      "hrBpm": 64,
      "systolicBp": 128,
      "diastolicBp": 59,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-09-16",
      "dayIndex": 78,
      "steps": 3785,
      "hrBpm": 68,
      "systolicBp": 130,
      "diastolicBp": 64,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-09-17",
      "dayIndex": 79,
      "steps": 4015,
      "hrBpm": 65,
      "systolicBp": 122,
      "diastolicBp": 58,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-09-18",
      "dayIndex": 80,
      "steps": 3537,
      "hrBpm": 68,
      "systolicBp": 128,
      "diastolicBp": 65,
      "medStatus": "unconfirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-09-19",
      "dayIndex": 81,
      "steps": 3989,
      "hrBpm": 67,
      "systolicBp": 132,
      "diastolicBp": 68,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-09-20",
      "dayIndex": 82,
      "steps": 4052,
      "hrBpm": 68,
      "systolicBp": 131,
      "diastolicBp": 62,
      "medStatus": "unconfirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-09-21",
      "dayIndex": 83,
      "steps": 3677,
      "hrBpm": 67,
      "systolicBp": 122,
      "diastolicBp": 67,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-09-22",
      "dayIndex": 84,
      "steps": 3689,
      "hrBpm": 64,
      "systolicBp": 133,
      "diastolicBp": 65,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-09-23",
      "dayIndex": 85,
      "steps": 4340,
      "hrBpm": 69,
      "systolicBp": 125,
      "diastolicBp": 68,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-09-24",
      "dayIndex": 86,
      "steps": 3854,
      "hrBpm": 72,
      "systolicBp": 140,
      "diastolicBp": 60,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-09-25",
      "dayIndex": 87,
      "steps": 3006,
      "hrBpm": 66,
      "systolicBp": 139,
      "diastolicBp": 66,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-09-26",
      "dayIndex": 88,
      "steps": 3174,
      "hrBpm": 64,
      "systolicBp": 130,
      "diastolicBp": 67,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-09-27",
      "dayIndex": 89,
      "steps": 4014,
      "hrBpm": 68,
      "systolicBp": 124,
      "diastolicBp": 58,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-09-28",
      "dayIndex": 90,
      "steps": 4509,
      "hrBpm": 63,
      "systolicBp": 139,
      "diastolicBp": 63,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    }
  ],
  "SW020": [
    {
      "date": "2026-07-01",
      "dayIndex": 1,
      "steps": 4253,
      "hrBpm": 77,
      "systolicBp": 113,
      "diastolicBp": 77,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-07-02",
      "dayIndex": 2,
      "steps": 4133,
      "hrBpm": 76,
      "systolicBp": 128,
      "diastolicBp": 75,
      "medStatus": "unconfirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-07-03",
      "dayIndex": 3,
      "steps": 4461,
      "hrBpm": 84,
      "systolicBp": 120,
      "diastolicBp": 83,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-07-04",
      "dayIndex": 4,
      "steps": 4467,
      "hrBpm": 77,
      "systolicBp": 128,
      "diastolicBp": 80,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-07-05",
      "dayIndex": 5,
      "steps": 3730,
      "hrBpm": 75,
      "systolicBp": 131,
      "diastolicBp": 77,
      "medStatus": "unconfirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-07-06",
      "dayIndex": 6,
      "steps": 3703,
      "hrBpm": 82,
      "systolicBp": 131,
      "diastolicBp": 82,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-07-07",
      "dayIndex": 7,
      "steps": 3505,
      "hrBpm": 82,
      "systolicBp": 123,
      "diastolicBp": 88,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-07-08",
      "dayIndex": 8,
      "steps": 4220,
      "hrBpm": 72,
      "systolicBp": 116,
      "diastolicBp": 74,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-07-09",
      "dayIndex": 9,
      "steps": 3340,
      "hrBpm": 78,
      "systolicBp": 123,
      "diastolicBp": 85,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-07-10",
      "dayIndex": 10,
      "steps": 3258,
      "hrBpm": 80,
      "systolicBp": 131,
      "diastolicBp": 79,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-07-11",
      "dayIndex": 11,
      "steps": 3502,
      "hrBpm": 79,
      "systolicBp": 128,
      "diastolicBp": 89,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-07-12",
      "dayIndex": 12,
      "steps": 3757,
      "hrBpm": 77,
      "systolicBp": 118,
      "diastolicBp": 81,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-07-13",
      "dayIndex": 13,
      "steps": 3876,
      "hrBpm": 79,
      "systolicBp": 124,
      "diastolicBp": 76,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-07-14",
      "dayIndex": 14,
      "steps": 3425,
      "hrBpm": 77,
      "systolicBp": 120,
      "diastolicBp": 81,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-07-15",
      "dayIndex": 15,
      "steps": 3484,
      "hrBpm": 81,
      "systolicBp": 124,
      "diastolicBp": 87,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-07-16",
      "dayIndex": 16,
      "steps": 2856,
      "hrBpm": 76,
      "systolicBp": 118,
      "diastolicBp": 90,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-07-17",
      "dayIndex": 17,
      "steps": 4019,
      "hrBpm": 80,
      "systolicBp": 130,
      "diastolicBp": 86,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-07-18",
      "dayIndex": 18,
      "steps": 3541,
      "hrBpm": 80,
      "systolicBp": 129,
      "diastolicBp": 80,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-07-19",
      "dayIndex": 19,
      "steps": 4118,
      "hrBpm": 79,
      "systolicBp": 129,
      "diastolicBp": 87,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-07-20",
      "dayIndex": 20,
      "steps": 4215,
      "hrBpm": 80,
      "systolicBp": 112,
      "diastolicBp": 79,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-07-21",
      "dayIndex": 21,
      "steps": 3053,
      "hrBpm": 76,
      "systolicBp": 125,
      "diastolicBp": 88,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-07-22",
      "dayIndex": 22,
      "steps": 4204,
      "hrBpm": 72,
      "systolicBp": 125,
      "diastolicBp": 81,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-07-23",
      "dayIndex": 23,
      "steps": 3158,
      "hrBpm": 85,
      "systolicBp": 129,
      "diastolicBp": 86,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-07-24",
      "dayIndex": 24,
      "steps": 3792,
      "hrBpm": 83,
      "systolicBp": 124,
      "diastolicBp": 79,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-07-25",
      "dayIndex": 25,
      "steps": 4240,
      "hrBpm": 82,
      "systolicBp": 112,
      "diastolicBp": 76,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-07-26",
      "dayIndex": 26,
      "steps": 3122,
      "hrBpm": 79,
      "systolicBp": 131,
      "diastolicBp": 83,
      "medStatus": "unconfirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-07-27",
      "dayIndex": 27,
      "steps": 3582,
      "hrBpm": 81,
      "systolicBp": 121,
      "diastolicBp": 88,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-07-28",
      "dayIndex": 28,
      "steps": 3369,
      "hrBpm": 77,
      "systolicBp": 116,
      "diastolicBp": 80,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-07-29",
      "dayIndex": 29,
      "steps": 4272,
      "hrBpm": 72,
      "systolicBp": 123,
      "diastolicBp": 79,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-07-30",
      "dayIndex": 30,
      "steps": 2638,
      "hrBpm": 80,
      "systolicBp": 120,
      "diastolicBp": 78,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-07-31",
      "dayIndex": 31,
      "steps": 4318,
      "hrBpm": 84,
      "systolicBp": 129,
      "diastolicBp": 84,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-08-01",
      "dayIndex": 32,
      "steps": 3623,
      "hrBpm": 78,
      "systolicBp": 119,
      "diastolicBp": 74,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-08-02",
      "dayIndex": 33,
      "steps": 3959,
      "hrBpm": 75,
      "systolicBp": 127,
      "diastolicBp": 79,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-08-03",
      "dayIndex": 34,
      "steps": 4125,
      "hrBpm": 77,
      "systolicBp": 123,
      "diastolicBp": 89,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-08-04",
      "dayIndex": 35,
      "steps": 3233,
      "hrBpm": 79,
      "systolicBp": 116,
      "diastolicBp": 81,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-08-05",
      "dayIndex": 36,
      "steps": 4134,
      "hrBpm": 78,
      "systolicBp": 122,
      "diastolicBp": 78,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-08-06",
      "dayIndex": 37,
      "steps": 4791,
      "hrBpm": 76,
      "systolicBp": 121,
      "diastolicBp": 80,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-08-07",
      "dayIndex": 38,
      "steps": 3560,
      "hrBpm": 78,
      "systolicBp": 121,
      "diastolicBp": 81,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-08-08",
      "dayIndex": 39,
      "steps": 2925,
      "hrBpm": 76,
      "systolicBp": 123,
      "diastolicBp": 80,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-08-09",
      "dayIndex": 40,
      "steps": 3764,
      "hrBpm": 78,
      "systolicBp": 127,
      "diastolicBp": 84,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-08-10",
      "dayIndex": 41,
      "steps": 3684,
      "hrBpm": 73,
      "systolicBp": 125,
      "diastolicBp": 81,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-08-11",
      "dayIndex": 42,
      "steps": 3831,
      "hrBpm": 80,
      "systolicBp": 131,
      "diastolicBp": 86,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-08-12",
      "dayIndex": 43,
      "steps": 4381,
      "hrBpm": 84,
      "systolicBp": 109,
      "diastolicBp": 84,
      "medStatus": "confirmed",
      "riskScore": 15,
      "signals": [
        "BP drop (109 mmHg)"
      ]
    },
    {
      "date": "2026-08-13",
      "dayIndex": 44,
      "steps": 4158,
      "hrBpm": 84,
      "systolicBp": 125,
      "diastolicBp": 83,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-08-14",
      "dayIndex": 45,
      "steps": 4268,
      "hrBpm": 81,
      "systolicBp": 130,
      "diastolicBp": 82,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-08-15",
      "dayIndex": 46,
      "steps": 3350,
      "hrBpm": 83,
      "systolicBp": 124,
      "diastolicBp": 82,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-08-16",
      "dayIndex": 47,
      "steps": 3822,
      "hrBpm": 81,
      "systolicBp": 124,
      "diastolicBp": 86,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-08-17",
      "dayIndex": 48,
      "steps": 4409,
      "hrBpm": 79,
      "systolicBp": 124,
      "diastolicBp": 79,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-08-18",
      "dayIndex": 49,
      "steps": 3404,
      "hrBpm": 78,
      "systolicBp": 113,
      "diastolicBp": 80,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-08-19",
      "dayIndex": 50,
      "steps": 4153,
      "hrBpm": 75,
      "systolicBp": 131,
      "diastolicBp": 72,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-08-20",
      "dayIndex": 51,
      "steps": 4710,
      "hrBpm": 81,
      "systolicBp": 122,
      "diastolicBp": 84,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-08-21",
      "dayIndex": 52,
      "steps": 4592,
      "hrBpm": 77,
      "systolicBp": 114,
      "diastolicBp": 85,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-08-22",
      "dayIndex": 53,
      "steps": 3661,
      "hrBpm": 80,
      "systolicBp": 134,
      "diastolicBp": 75,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-08-23",
      "dayIndex": 54,
      "steps": 2571,
      "hrBpm": 75,
      "systolicBp": 120,
      "diastolicBp": 77,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-08-24",
      "dayIndex": 55,
      "steps": 3917,
      "hrBpm": 79,
      "systolicBp": 116,
      "diastolicBp": 79,
      "medStatus": "unconfirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-08-25",
      "dayIndex": 56,
      "steps": 4216,
      "hrBpm": 80,
      "systolicBp": 119,
      "diastolicBp": 77,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-08-26",
      "dayIndex": 57,
      "steps": 3926,
      "hrBpm": 81,
      "systolicBp": 134,
      "diastolicBp": 77,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-08-27",
      "dayIndex": 58,
      "steps": 4505,
      "hrBpm": 82,
      "systolicBp": 126,
      "diastolicBp": 87,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-08-28",
      "dayIndex": 59,
      "steps": 3992,
      "hrBpm": 77,
      "systolicBp": 124,
      "diastolicBp": 84,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-08-29",
      "dayIndex": 60,
      "steps": 2736,
      "hrBpm": 77,
      "systolicBp": 122,
      "diastolicBp": 86,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-08-30",
      "dayIndex": 61,
      "steps": 4061,
      "hrBpm": 83,
      "systolicBp": 132,
      "diastolicBp": 90,
      "medStatus": "unconfirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-08-31",
      "dayIndex": 62,
      "steps": 4622,
      "hrBpm": 78,
      "systolicBp": 124,
      "diastolicBp": 85,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-09-01",
      "dayIndex": 63,
      "steps": 4006,
      "hrBpm": 82,
      "systolicBp": 121,
      "diastolicBp": 82,
      "medStatus": "unconfirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-09-02",
      "dayIndex": 64,
      "steps": 3910,
      "hrBpm": 78,
      "systolicBp": 124,
      "diastolicBp": 93,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-09-03",
      "dayIndex": 65,
      "steps": 3575,
      "hrBpm": 82,
      "systolicBp": 131,
      "diastolicBp": 82,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-09-04",
      "dayIndex": 66,
      "steps": 3528,
      "hrBpm": 78,
      "systolicBp": 116,
      "diastolicBp": 91,
      "medStatus": "unconfirmed",
      "riskScore": 12,
      "signals": [
        "3 unconfirmed meds this week"
      ]
    },
    {
      "date": "2026-09-05",
      "dayIndex": 67,
      "steps": 3337,
      "hrBpm": 76,
      "systolicBp": 127,
      "diastolicBp": 84,
      "medStatus": "confirmed",
      "riskScore": 12,
      "signals": [
        "3 unconfirmed meds this week"
      ]
    },
    {
      "date": "2026-09-06",
      "dayIndex": 68,
      "steps": 3848,
      "hrBpm": 88,
      "systolicBp": 139,
      "diastolicBp": 82,
      "medStatus": "confirmed",
      "riskScore": 31,
      "signals": [
        "Elevated BP (139 mmHg, +2.8 SD)",
        "Elevated HR (88 bpm)"
      ]
    },
    {
      "date": "2026-09-07",
      "dayIndex": 69,
      "steps": 4654,
      "hrBpm": 78,
      "systolicBp": 122,
      "diastolicBp": 85,
      "medStatus": "unconfirmed",
      "riskScore": 12,
      "signals": [
        "3 unconfirmed meds this week"
      ]
    },
    {
      "date": "2026-09-08",
      "dayIndex": 70,
      "steps": 3905,
      "hrBpm": 79,
      "systolicBp": 128,
      "diastolicBp": 86,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-09-09",
      "dayIndex": 71,
      "steps": 3877,
      "hrBpm": 82,
      "systolicBp": 124,
      "diastolicBp": 83,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-09-10",
      "dayIndex": 72,
      "steps": 4266,
      "hrBpm": 70,
      "systolicBp": 123,
      "diastolicBp": 85,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-09-11",
      "dayIndex": 73,
      "steps": 3185,
      "hrBpm": 80,
      "systolicBp": 130,
      "diastolicBp": 82,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-09-12",
      "dayIndex": 74,
      "steps": 3319,
      "hrBpm": 78,
      "systolicBp": 126,
      "diastolicBp": 77,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-09-13",
      "dayIndex": 75,
      "steps": 4055,
      "hrBpm": 82,
      "systolicBp": 114,
      "diastolicBp": 84,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-09-14",
      "dayIndex": 76,
      "steps": 3486,
      "hrBpm": 75,
      "systolicBp": 116,
      "diastolicBp": 87,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-09-15",
      "dayIndex": 77,
      "steps": 2878,
      "hrBpm": 78,
      "systolicBp": 128,
      "diastolicBp": 85,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-09-16",
      "dayIndex": 78,
      "steps": 3777,
      "hrBpm": 83,
      "systolicBp": 119,
      "diastolicBp": 88,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-09-17",
      "dayIndex": 79,
      "steps": 3010,
      "hrBpm": 79,
      "systolicBp": 118,
      "diastolicBp": 85,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-09-18",
      "dayIndex": 80,
      "steps": 4055,
      "hrBpm": 82,
      "systolicBp": 123,
      "diastolicBp": 74,
      "medStatus": "unconfirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-09-19",
      "dayIndex": 81,
      "steps": 3579,
      "hrBpm": 76,
      "systolicBp": 118,
      "diastolicBp": 77,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-09-20",
      "dayIndex": 82,
      "steps": 4041,
      "hrBpm": 81,
      "systolicBp": 114,
      "diastolicBp": 78,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-09-21",
      "dayIndex": 83,
      "steps": 3991,
      "hrBpm": 77,
      "systolicBp": 117,
      "diastolicBp": 75,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-09-22",
      "dayIndex": 84,
      "steps": 4447,
      "hrBpm": 82,
      "systolicBp": 127,
      "diastolicBp": 72,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-09-23",
      "dayIndex": 85,
      "steps": 3677,
      "hrBpm": 74,
      "systolicBp": 120,
      "diastolicBp": 88,
      "medStatus": "unconfirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-09-24",
      "dayIndex": 86,
      "steps": 3613,
      "hrBpm": 84,
      "systolicBp": 122,
      "diastolicBp": 83,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-09-25",
      "dayIndex": 87,
      "steps": 3886,
      "hrBpm": 82,
      "systolicBp": 124,
      "diastolicBp": 81,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-09-26",
      "dayIndex": 88,
      "steps": 4198,
      "hrBpm": 84,
      "systolicBp": 116,
      "diastolicBp": 91,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-09-27",
      "dayIndex": 89,
      "steps": 3978,
      "hrBpm": 84,
      "systolicBp": 127,
      "diastolicBp": 83,
      "medStatus": "confirmed",
      "riskScore": 0,
      "signals": []
    },
    {
      "date": "2026-09-28",
      "dayIndex": 90,
      "steps": 3707,
      "hrBpm": 87,
      "systolicBp": 117,
      "diastolicBp": 78,
      "medStatus": "confirmed",
      "riskScore": 9,
      "signals": [
        "Elevated HR (87 bpm)"
      ]
    }
  ]
};

/** Helper: retrieve full 90-day observation time series for a cohort senior */
export function getSeniorObservations(seniorId: string): CohortDayRecord[] {
  return COHORT_OBSERVATIONS_MAP[seniorId] || [];
}

/** Helper: retrieve senior summary */
export function getCohortSenior(seniorId: string): CohortSeniorSummary | undefined {
  return COHORT_SENIORS.find(s => s.seniorId === seniorId);
}
