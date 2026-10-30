# Next steps after the UI: backend and model (do NOT give this to the UI phases)

The UI phases build screens on top of a browser-only data layer. These are the next jobs, in this order.

## 1. Honesty first
The numbers currently in the README, write-up and Model Evaluation page (86.4% precision, 91.7% recall, 5.8 days early, 92.4% top-10, XGBoost, Whisper Medium Indic, on-device masking) must be replaced with numbers your own code produced. Report case-level metrics and alert-level metrics separately.

## 2. Model training plan
| Part | What to do | Training needed |
|---|---|---|
| Rules baseline | BP above 140, sugar above 180 and similar simple rules | No |
| Personal baseline | Rolling 30 day mean and SD per senior, then Z-scores | No |
| Anomaly model | Isolation Forest on baseline-relative features | Yes |
| Notes to cues | Keyword and lexicon extractor for Hindi-English, optional small classifier | Lexicon no, classifier yes |
| Speech to text | Pretrained Whisper (or an Indic Whisper) | No, use only |

Steps
1. Export the synthetic cohort (200 seniors, 90 days) to daily.csv and a labels.csv with senior_id and onset_day for each planted case. Fix the random seed.
2. Colab or Jupyter with pandas, numpy, scikit-learn, matplotlib.
3. Features per senior-day: personal Z-scores, missed doses in the last 3 and 7 days, days of silence, NLP cue counts, trend slope.
4. Train on early normal days only (for example days 31 to 60), split by senior, never by random day.
5. Convert scores to 0 to 100 using training percentiles. Explain each score with the per-feature Z-contributions.
6. Evaluate on planted cases: case-level precision and recall, days early (first alert minus onset), alert-level precision. Compare against the rules baseline on the same data.
7. Save the model (joblib) and serve scoring from a backend.

Starter code
```python
import pandas as pd, numpy as np
from sklearn.ensemble import IsolationForest

df = pd.read_csv("daily.csv", parse_dates=["date"]).sort_values(["senior_id", "date"])
vitals = ["sys_bp", "dia_bp", "fasting_glucose", "spo2", "weight", "pulse"]

def add_z(g):
    for v in vitals:
        mu = g[v].rolling(30, min_periods=14).mean().shift(1)
        sd = g[v].rolling(30, min_periods=14).std().shift(1).clip(lower=1e-6)
        g[f"z_{v}"] = (g[v] - mu) / sd
    return g

df = df.groupby("senior_id", group_keys=False).apply(add_z)
features = [f"z_{v}" for v in vitals] + ["missed_doses_3d", "silent_days", "cue_count", "trend_slope"]
X = df[features].fillna(0)

train = X[df["day_index"].between(31, 60)]
iso = IsolationForest(n_estimators=200, contamination="auto", random_state=42).fit(train)

raw = -iso.score_samples(X)
ref = -iso.score_samples(train)
df["risk"] = np.interp(raw, [np.percentile(ref, 50), np.percentile(ref, 99)], [0, 100]).clip(0, 100)
```
The column names above are assumptions. Use your real ones.

## 3. Backend plan
- Supabase (free tier): auth, Postgres, realtime, storage for audio. This is what makes Kamla's phone and Karishma's phone see the same data.
- A small FastAPI service (Render or Railway) running the Isolation Forest, the NLP cue extractor and Whisper. It returns each senior's risk score and the "why".
- Notifications: in-app realtime first, then web push. Real SMS or OTP in India needs a provider and DLT registration. Two-number SOS calling needs Exotel or Twilio from a backend.
- Mask personal data (names, phone numbers, addresses) before any external service.

## 4. Datasets
The hospital admissions extract in docs/dataset/ cannot train this model (see its notes). Public sources worth checking, each for licence and citation: PhysioNet open datasets for vital-sign patterns, open Hindi-English code-mixed text corpora, open speech models that support Indian languages, and the Longitudinal Ageing Study in India (access by application). Cite every dataset and model in the write-up.
