# Seniors 60+ extract: notes and limits

Source file: healthcare_dataset.csv (inside archive.zip), 55,500 rows, 15 columns, one row per hospital admission.
Dates in the source: 2019-05-08 to 2024-05-07.
The source looks like a synthetic (randomly generated) dataset, not real patient records. Confirm its publisher, licence and exact citation on its download page before you cite it. This file does not contain that information.

## What was done
1. Removed 534 exact duplicate rows (200 of them in the 60+ group).
2. Kept only people aged 60 or above: 20,948 rows, ages 60 to 89 (source maximum is 89).
3. Dropped columns that identify or do not matter for Samarth Watch: Name, Doctor, Hospital, Insurance Provider, Billing Amount, Room Number, Blood Type, admission and discharge dates.
4. Added length_of_stay_days (discharge minus admission) and a new record_id (S60-00001 and so on). Rows are shuffled with a fixed seed (42).

Output: seniors_60plus_clean.csv with columns
record_id, age, gender, source_condition_label, admission_type, length_of_stay_days, source_medication, source_test_result

## Age and gender in the 60+ group
Age bands: 60 to 69, 70 to 79, 80 to 89 (see the counts printed when the file was built; recompute with pandas if needed).
Gender: Male and Female only, about 50 percent each.

## Important limits (read before using it)
- Every category in this file is spread almost perfectly evenly (six conditions at about 1 in 6 each, three admission types at about 1 in 3 each, three test results at about 1 in 3 each, five medicines at about 1 in 5 each).
- Statistical tests on the 60+ rows found no real relationship between condition and medicine, condition and test result, condition and age, condition and gender, or age and length of stay. So a row is a random combination, not a believable patient. For example, a medicine can be paired with a condition it would never be used for.
- Therefore do NOT use source_condition_label or source_medication as ground truth, as disease prevalence, as a medicine list for a senior, or as training labels. Doing so would give nonsense results and would put condition names into the product, which the problem statement forbids showing to seniors or families.
- There are no vitals (BP, sugar, SpO2, weight, pulse), no medicine adherence logs, no call notes and no daily time series. These are the signals the problem statement needs, so this file cannot train or validate the risk model.
- The data is a US style hospital admissions table (insurers, hospital names). It is not about seniors living at home in India.

## Where it can still be used
- As a labelled, clearly synthetic pool of age and gender values for the 200-senior evaluation cohort (src/evaluation), if you want ages 60 to 89 with an even gender split. You can also set this directly in your generator without this file.
- As a note in the write-up that you reviewed this dataset and why it was not used for training.
- Not in the live app: the live app contains only the accounts you gave (Kamla, Karishma and the coordinator).

## What you still need
Daily vitals, medicine adherence and call-note data for 200+ seniors over 90 days must come from your own seeded generator, with personal baselines, noise, missing entries and planted decline cases, documented as the problem statement asks. Public datasets (for example PhysioNet open datasets for vital-sign patterns, open Hindi-English code-mixed text corpora, open speech models) can support parts of it. Check each one's licence and cite it.
