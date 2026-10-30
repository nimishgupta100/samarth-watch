# Samarth Watch: Dataset Integration Tasks (TASKS.md)

Tracking implementation of the 200-senior 60+ cohort dataset, 90-day simulated observations, risk model, n8n AI Agent integration, and dashboard connectivity.

> **Status Legend:**
> - `[ ]` Not started / In progress
> - `[x]` Implemented and verified by automated tests

---

## Task Checklist

### Phase 1: Inspection, Migration Strategy, and Provenance Safeguards
- [x] Inspect existing repo, DB schema, repository layer, role guards, and UI components.
- [x] Create safe backup before migration; do not overwrite live user accounts (`nimishgupta100`, Kamla, Karishma).
- [x] Define provenance flags: `source_record_pseudonymized` for hospital records, `SIMULATED_NOT_OBSERVED` for 90-day vitals, medications, check-in notes, and synthetic decline scenarios.
- [x] Ensure no clinical claims: show explicit badges that measurements are simulated and source rows are hospital admission records.

### Phase 2: Data Import & Validation (200 Seniors, 90 Days)
- [ ] Import 200 demo senior profiles with stable `SW001`-`SW200` IDs and source provenance (`record_id`, `age`, `gender`, `medical_condition`, `medication_name`, `test_result`, `admission_type`).
- [ ] Import 18,000 simulated observation rows (steps, resting HR, systolic/diastolic BP) with date parsing.
- [ ] Import 18,000 simulated medication events (`confirmed`, `unconfirmed`) with `SIMULATED_NOT_OBSERVED` flag.
- [ ] Import simulated check-in notes with explicit `simulated_text_not_voice` mode.
- [ ] Import 12 planted decline scenarios strictly as evaluation ground truth; never expose labels as features to prediction model or n8n agent.
- [ ] Validate cohort integrity: all seniors aged 60+, IDs unique, dates span 90 days, no leakage from future windows into baselines.

### Phase 3: Personal Baseline Calculation & Explainable Risk Engine
- [ ] Calculate personal baselines using ONLY days 1-30 (mean & SD for systolic BP, diastolic BP, HR, steps) with no future leakage.
- [ ] Connect deterministic risk engine: Z-score deviations from personal baseline + medication misses + check-in cue tags.
- [ ] Verify additive explainability: sub-scores sum to total risk score with top contributing factors.
- [ ] Run benchmark evaluation against the 12 planted scenarios: compute actual TP, FP, FN, TN, precision, recall, lead days.

### Phase 4: Coordinator Dashboard Integration
- [ ] Add 200-senior cohort browser in Coordinator view (`/coordinator/seniors` or dedicated cohort view) with filters by age, gender, medical condition, admission type, and urgency.
- [ ] Connect senior detail view with medical history, 90-day activity trends, baseline vitals charts (with ±1.5 SD bands), medication adherence calendar, and notes timeline.
- [ ] Include explainable risk score breakdown and recommended next actions (Call senior, Review meds, Schedule visit).
- [ ] Keep active emergency strip and daily alert prioritization intact.

### Phase 5: Senior & Family Dashboards Connectivity
- [ ] Connect Senior View (`/senior-home`): accessible check-ins, medication confirmations, and independent one-tap SOS.
- [ ] Connect Family View (`/family`): consent-gated view with non-alarmist status, adherence summary, upcoming visits, and health trends (only when detailed vitals consent is granted).
- [ ] Enforce consent pause: when senior pauses sharing, family view displays respectful privacy notice and DOM contains no health records.

### Phase 6: n8n AI Agent Integration & Activity Log
- [ ] Build n8n webhook / API service adapter with tool-calling interface (`getSeniorObservations`, `getPersonalBaseline`, `createCoordinatorTask`).
- [ ] Implement deduplication and idempotency for coordinator tasks.
- [ ] Mask PII and redact planted decline labels from all agent payloads.
- [ ] Add Coordinator n8n Agent Activity Log view showing recent autonomous analyses, evidence retrieved, and created follow-up tasks.

### Phase 7: Verification, Automated Testing & Documentation
- [ ] Write and run automated tests for data validation, baseline calculation, risk engine, and consent guards.
- [ ] Verify full production build (`npm run build`).
- [ ] Verify zero em dashes or en dashes across codebase.
- [ ] Provide summary report with file list, test output, and screenshots/logs.
