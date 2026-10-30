# Samarth Watch Dataset Integration Package

## Source and eligibility
Original user-uploaded `archive.zip` contains `healthcare_dataset.csv` with 55,500 hospital admission rows. Filter: `Age >= 60`; exact duplicate rows removed. Source names, doctors, hospitals, insurance, billing and room identifiers are excluded from outputs. Source rows are not verified unique persons. Do not treat source hospital admissions as continuous home-care observations.

## Files
- `seniors_60plus_records.csv`: all qualifying source hospital records, pseudonymous record IDs.
- `demo_200_senior_profiles.csv`: deterministic selection of 200 source rows, pseudonymous senior IDs; not confirmed unique real people.
- `demo_90day_simulated_observations.csv`: 200 x 90 days of entirely simulated steps, resting heart rate and BP. These measurements DO NOT come from source.
- `demo_90day_simulated_medication_events.csv`: entirely simulated daily confirmation statuses; medicine names come from source record. Confirmation is not proof of ingestion.
- `demo_simulated_checkin_notes.csv`: entirely simulated English text notes, not recorded audio or real speech-to-text.
- `demo_12_planted_decline_scenarios.csv`: entirely synthetic scenario labels for testing. Not clinical ground truth.
- `dataset_summary.json`: counts, source distribution and limitations.
- `ANTIGRAVITY_INTEGRATION_PROMPT.md`: full integration instructions.

## Import rules
Use `senior_id` as foreign key across the five demo files; `record_id` maps to source hospital row. Never join source records by name. Do not merge this cohort with an existing validated cohort without explicit migration design. Keep simulated origin badges visible in the UI and exported metrics.

## Evaluation caveat
The 12 synthetic scenario labels are not validated early-warning outcomes. Derive all metrics by running the actual risk model against the data and these labels. Do not invent precision, recall, lead time, or medical benefit. Baselines should be calculated from early simulated days and should not use future days (avoid leakage).

## Privacy
Source names were excluded. This does not guarantee formal anonymization. Treat imported source-derived attributes as sensitive; restrict access and avoid sending raw records to external LLMs.
