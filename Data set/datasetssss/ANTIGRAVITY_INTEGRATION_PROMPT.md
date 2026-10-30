# ANTIGRAVITY MASTER PROMPT — SAMARTH WATCH DATASET INTEGRATION

You are the engineer responsible for integrating the attached Samarth Watch dataset package into my EXISTING Samarth Watch application. The application serves seniors aged 60+, families, and Care Coordinators, with n8n-powered AI workflows. Implement, test and document the integration. Do not replace my existing website or pretend that source hospital records contain home monitoring history.

## Files I am uploading
1. `demo_200_senior_profiles.csv` — 200 source-derived, pseudonymized hospital admission rows; not verified unique persons.
2. `demo_90day_simulated_observations.csv` — 18,000 explicitly simulated daily activity/vitals records.
3. `demo_90day_simulated_medication_events.csv` — 18,000 explicitly simulated medication confirmation records.
4. `demo_simulated_checkin_notes.csv` — simulated free-text check-ins, not real voice or STT.
5. `demo_12_planted_decline_scenarios.csv` — 12 synthetic decline scenarios for evaluation.
6. `seniors_60plus_records.csv` — all cleaned source rows aged 60+, for optional admin-only exploration, not default app population.
7. `dataset_summary.json` and `README_DATASET.md` — provenance, statistics, limitations and rules.

## Required implementation checklist
- [ ] Inspect the existing repo, DB schema, API, pages, model, and n8n workflows before editing.
- [ ] Make a safe backup and define a migration strategy; do not silently overwrite current senior data.
- [ ] Import the 200 demo profiles with stable `senior_id` keys and source provenance fields.
- [ ] Import all 90-day simulated observations with proper date parsing and senior foreign keys.
- [ ] Import medication events and check-in notes with clear SIMULATED_NOT_OBSERVED flags.
- [ ] Import planted scenarios as test/evaluation-only labels, NEVER as features visible to the risk predictor or agent.
- [ ] Validate all demo profiles are aged 60+, IDs are unique, dates cover 90 days, foreign keys resolve, and no unexpected missing values exist.
- [ ] Calculate personal baseline using ONLY earlier days, with no future data leakage.
- [ ] Connect existing deterministic risk engine and any implemented anomaly model; do not fabricate trained models or scores.
- [ ] Build Coordinator dashboard with real stored cohort, daily risk trend, evidence and tasks.
- [ ] Build Senior View with accessible check-ins, medication confirmations and independent SOS; preserve consent and roles.
- [ ] Build Family View with only authorized summaries, medication states, appointments and alerts.
- [ ] Connect n8n monitoring agent through authenticated backend APIs; agent must call tools, inspect real stored synthetic records and create justified internal tasks with deduplication.
- [ ] Never give AI the planted-case label or unmasked unnecessary private data.
- [ ] Do not infer medication schedules from medicine names; demo 09:00 schedule is simulated and explicitly labeled.
- [ ] Keep deterministic 5-minute reminder, 30-minute escalation and 2-hour missed cutoff separate from LLM.
- [ ] Preserve voice/IVR distinction: text check-in dataset is NOT speech recognition data.
- [ ] Make a visible demo/synthetic data badge and explain hospital-record origin versus simulated home observations.
- [ ] Compute actual precision, recall, FP/FN, alert counts and lead time using evaluation scripts; label synthetic scenario evaluation, never clinical validation.
- [ ] Run migration tests, API tests, role/consent tests, n8n execution test, and frontend build; show evidence.
- [ ] Keep `TASKS.md` checkboxes updated: check only after verified completion; report blockers.
- [ ] Provide final changed-file list, commands, screenshots/logs, and accurate implemented/demonstrated/validated status.

## UI specifics
Create a clean senior 60+ cohort overview, filter by age/gender/condition/admission type, a senior profile with historical hospital fields clearly separated from simulated home-monitoring trends, a medication confirmation timeline, notes timeline, explainable risk panel, Care Coordinator priorities, family consent-gated view, and n8n agent activity log. All dashboards must read database/API data, not hardcoded arrays. Do not show clinical diagnosis predictions.

## Data safety and honesty
This source is hospital admission data, not real home monitoring. 200 rows are selected from admissions, not confirmed 200 unique people. All daily steps, HR, BP, adherence confirmations, free-text check-ins, and decline labels in this package are SIMULATED. Do not mix simulated and observed data without visible provenance. Do not report accuracy or clinical usefulness until verified, and never claim this is a real patient dataset. Do not use name-based identity matching. Keep any actual names out of frontend and LLM payloads.

Start by reading README_DATASET.md and dataset_summary.json, then inspect the original repository. Implement in stages and keep checkboxes with proof.
