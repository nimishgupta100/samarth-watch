# Samarth Watch | AI-Powered Early-Warning Dashboard for Seniors Living at Home

> **A Hackathon Prototype built for Samarth Life Management Pvt Ltd**  
> *"Detect decline days or weeks earlier. Flag risk, route to a human, never diagnose."*

---

## 🎯 Purpose & Philosophy
India has over 150 million elders aged 60+, with millions living independently while adult children work in distant cities or abroad. In this population, health decline is rarely an acute surprise—it manifests as gradual whispers: a missed evening medicine, poorer sleep, reduced appetite, an unreported bathroom slip, or a quiet withdrawal from conversation.

**Samarth Watch** is an AI-powered early-warning system designed specifically for **Care Coordinators**. Every morning, a coordinator opens the dashboard and immediately sees:
1. **Who needs attention today** (ranked by personal risk deviation score, 0–100)
2. **Why** (plain-language explanation matching exact additive score contributions)
3. **What to do next** (concrete recommended action chip and a culturally attuned Hindi/English call script)

### 🛡️ Fundamental Principles
- **Risk Signal, Not a Diagnosis:** The system detects multi-modal pattern anomalies and routes them to a human Care Coordinator. It **never** labels a senior with a medical condition or disease.
- **Personal Baselines over Population Averages:** An elder with an established baseline BP of 110 mmHg who rises to 135 mmHg is experiencing a significant +23% shift, even though 135 mmHg is clinically "normal" by population standards. Samarth Watch benchmarks every individual against their own historical band.
- **Alert Fatigue Protection:** Daily caseload is gated to **12–15 alerts per coordinator per day** using dynamic thresholding and feedback calibration.

---

## 🚀 Live Demo Pages & Navigation

### 1. Coordinator Hero Screen: "Today's Priorities" (`/`)
- **Daily Caseload Triage:** Ranked list of alert cards sorted by urgency (Critical `>70`, Moderate `45–70`).
- **Fatigue Protection:** Live Daily Alert Cap indicator (e.g. `12 / 15` alerts today).
- **Rich Context on Every Card:** 14-day trend sparkline, days since personal baseline shift, top 3 plain-language reasons, recommended action chip (`Call today`, `Schedule doctor visit`, `Medicine review`, `Contact family`).
- **Interactive Feedback Loop:** "Useful" vs "Not useful" thumbs feedback updates the live "Alert Precision this week" metric. "Mark as done" and "Snooze 24h" actions for queue resolution.
- **Multi-dimensional Filters:** Filter by urgency, signal type (vitals, medication, call notes, silence), and city.

### 2. Senior Detail & Calibrated Baseline (`/senior/:id`)
- **Profile & Living Situation:** Living alone, with spouse, or with domestic help, plus emergency contacts.
- **"Why This Score" Additive Attribution:** A horizontal bar chart of exact additive score contributions (vitals shift + call cues + medication adherence + silence + trend velocity) that sums **identically** to the total risk score.
- **Personalized Vitals Trajectory:** 14d/30d/90d interactive charts for Blood Pressure, Fasting Glucose, SpO2, and Weight with the senior's **own calibrated baseline band (Mean ± 1.5 SD) shaded**, highlighting genuine anomalies.
- **Medication Adherence Heatmap:** 90-day interactive calendar grid displaying full adherence, partial skips, and missed dose logs.
- **Multilingual Call Notes Feed:** Indian code-mixed Hindi, Hinglish, and English call logs with highlighted NLP cue tags (`pain`, `dizziness`, `low appetite`, `loneliness`, `fall`, `confusion`, `poor sleep`). Features an instant **"Translate to English"** toggle.
- **Care Coordinator Call Script:** Ready-to-read conversational guide in Hindi (*"Namaste Kamala ji..."*) and English with one-click clipboard copy.

### 3. Voice & IVR Check-in Simulator (`/voice-checkin`)
- **Accessible Low-Tech Design:** Simulated phone handset for seniors using basic keypad feature phones over 2G cellular networks.
- **4 Key Wellbeing Questions:** Audio prompts and large tactile buttons (1 = Theek, 2 = Thoda kharab, 3 = Bahut kharab).
- **Simulated Voice Note Equalizer:** Animated audio waveform simulating a senior's Hindi speech (*"Sar ghoom raha tha..."*), automated Whisper speech-to-text, and live NLP cue tagging with confidence levels.
- **High-Contrast & Large Font Mode:** Tailored for seniors with low vision.

### 4. Operations Manager Dashboard (`/operations`)
- **5 Core Executive KPIs:** Alerts per day, average response time (42m), % alerts marked useful (89.2%), precision at top-10 (92.4%), average days-early detection (5.8 days).
- **Operational Charts:** Alert volume over time, coordinator response times, outcome distributions (Resolved, Escalated, Snoozed, False alarm), and city-by-city comparisons (Delhi NCR, Lucknow, Chandigarh, Bengaluru, Pune, Kolkata, Jaipur).
- **Live Caseload Table:** Balancing workload across active Care Coordinators.

### 5. Family Companion Summary (`/family-summary`)
- **Warm, Non-Alarmist Tone:** Weekly summary letter written in gentle, reassuring Hindi or English.
- **Week-at-a-Glance Icons:** Sleep 🌙, Appetite 🍲, Medicines 💊, and Mood 😊 without medical jargon.
- **Urgent Alert Banner:** Only triggered for critical events under coordinator review.
- **Senior-First Consent Enforcement:** If the senior pauses consent, the family view is instantly blocked with a respectful explanation of senior autonomy.

### 6. Model & Technical Evaluation (Judges' Hub) (`/model-evaluation`)
- **Benchmark Table:** Comparative analysis of **Rules Baseline** vs **ML Only** (Isolation Forest + XGBoost) vs **Samarth Hybrid Ensemble**.
- **Precision-at-Top-K Curve:** Visual validation proving `>88%` precision at `k=12`.
- **Confusion Matrix:** Evaluated on the 200-senior synthetic cohort with 12 planted decline trajectories (TP=11, FP=1, FN=1, TN=187).
- **6-Stage Architecture Diagram:** Multi-modal ingestion → On-device masking → Indic NLP → Personalized baseline & ML → Alert gating → Explainable coordinator dashboard.
- **Frugal Cost Breakdown at 10,000 Seniors:** Itemized infrastructure totaling **₹35.00 (~$0.42 USD) per senior per month**.
- **Transparent Limitations:** Disclosing calibration requirements and network dependencies.

### 7. Privacy, Consent & Safety (`/privacy-safety`)
- **Interactive Data Masking Demo:** Live toggle showing real-time PII redaction (names, Aadhaar, phone, street address) into tokenized hashes before external cloud transmission.
- **Role-Based Access Control (RBAC) Matrix:** Granular boundaries for Coordinators, Managers, Families, and Cloud APIs.
- **DPDP Act 2023 Alignment:** Consent lifecycle protocol giving seniors autonomous control over their personal health signals.

---

## 🔬 Synthetic Cohort & Ground Truth Engineering

The dataset is generated via a reproducible seeded pseudo-random engine (`src/data/mockDataGenerator.ts`) containing:
- **200 Seniors** across 10 Indian cities (Lucknow, Delhi NCR, Chandigarh, Jaipur, Bengaluru, Pune, Kolkata, Mumbai, Ahmedabad, Dehradun).
- **90 Days of Longitudinal Data** per senior (18,000 daily patient records).
- **12 Ground-Truth Planted Decline Trajectories**:
  1. *Smt. Kamala Devi (78, Lucknow)*: Gradual systolic BP drift (+22%) paired with dizziness and sleep complaints.
  2. *Col. Rajeshwar Bakshi (Retd.) (81, Chandigarh)*: Missed evening Metformin leading to fasting glucose drift up to 192 mg/dL.
  3. *Smt. Savitri Sen (74, Kolkata)*: Bathroom slip scare followed by 2 days of silence and domestic helper reports of appetite loss.
  4. *Shri Rameshwar Pathak (79, Jaipur)*: Mild cognitive disorientation (asking day of week, duplicate pill attempt).
  5. *Smt. Usha Narang (76, Delhi)*: Post-bereavement loneliness cues and sharp drop in check-in duration.
  6. *Dr. K. S. Ramanathan (83, Bengaluru)*: Fluid retention weight gain (+2.4 kg in 4 days) and nocturnal breathlessness.
  7. *Smt. Pratibha Joshi (72, Pune)*: Osteoarthritis pain flare-up halting daily walks.
  8. *Shri Gurpreet Singh (77, Chandigarh)*: Post-prandial hyperglycemia with family consent paused.
  9. *Smt. Meenakshi Sundaram (80, Bengaluru)*: Unresponsive silence / unopened dispenser.
  10. *Shri Anand Deshmukh (75, Mumbai)*: SpO2 dip to 92% with persistent appetite fatigue.
  11. *Smt. Shakuntala Verma (82, Lucknow)*: Orthostatic BP fluctuations.
  12. *Shri Bhupendra Patel (73, Ahmedabad)*: Erratic statin timing and afternoon fatigue.

---

## 🛠️ Tech Stack & Architecture

- **Framework:** React 18 + TypeScript + Vite
- **Styling:** Tailwind CSS + Radix UI conventions
- **Icons:** Lucide React
- **Data Visualization:** Recharts (ComposedChart, AreaChart, LineChart, BarChart, PieChart) + Custom SVG Sparklines
- **Routing:** React Router v6
- **State Management:** React Context API with LocalStorage persistence for demo actions

---

## 📦 Running the Application Locally

### Prerequisites
- Node.js `v18+` or `v20+` (tested on Node v24)
- npm `v9+`

### Installation
```bash
# Clone the repository
git clone https://github.com/your-username/samarth-watch.git
cd samarth-watch

# Install dependencies
npm install

# Start development server
npm run dev
```
Open your browser at `http://localhost:5173/` to explore the dashboard.

### Production Build
```bash
npm run build
npm run preview
```

---

## ⚖️ Legal & Medical Disclaimer
*Samarth Watch is a prototype risk detection system created for demonstration purposes. It does not provide medical advice, diagnosis, or treatment recommendations. All risk alerts must be triaged by qualified human coordinators.*
