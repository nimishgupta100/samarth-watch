# Samarth Watch | AI-Powered Early-Warning Dashboard for Seniors Living at Home

> **A Hackathon Prototype built for Samarth Life Management Pvt Ltd**  
> *"Detect decline days or weeks earlier. Flag risk, route to a human, never diagnose."*

---

## Purpose & Philosophy
India has over 150 million elders aged 60+, with millions living independently while adult children work in distant cities or abroad. In this population, health decline is rarely an acute surprise: it manifests as gradual whispers: a missed evening medicine, poorer sleep, reduced appetite, an unreported bathroom slip, or a quiet withdrawal from conversation.

**Samarth Watch** is an AI-powered early-warning system designed specifically for **Care Coordinators**. Every morning, a coordinator opens the dashboard and immediately sees:
1. **Who needs attention today** (ranked by personal risk deviation score, 0 to 100)
2. **Why** (plain-language explanation matching exact additive score contributions)
3. **What to do next** (concrete recommended action chip and a culturally attuned Hindi/English call script)

### Fundamental Principles
- **Risk Signal, Not a Diagnosis:** The system detects multi-modal pattern anomalies and routes them to a human Care Coordinator. It **never** labels a senior with a medical condition or disease.
- **Personal Baselines over Population Averages:** An elder with an established baseline BP of 110 mmHg who rises to 135 mmHg is experiencing a significant +23% shift, even though 135 mmHg is clinically "normal" by population standards. Samarth Watch benchmarks every individual against their own historical band.
- **Alert Fatigue Protection:** Daily caseload is gated to **12 to 15 alerts per coordinator per day** using dynamic thresholding and feedback calibration.

---

## Live Demo Pages & Navigation

### 1. Coordinator Hero Screen: "Today's Priorities" (`/`)
- **Daily Caseload Triage:** Ranked list of alert cards sorted by urgency (Critical `>70`, Moderate `45 to 70`).
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
- **Week-at-a-Glance Icons:** Sleep, Appetite, Medicines, and Mood shown with simple line icons and no medical jargon.
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

## Synthetic Cohort & Ground Truth Engineering

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

## Tech Stack & Architecture

- **Framework:** React 18 + TypeScript + Vite
- **Styling:** Tailwind CSS + Radix UI conventions
- **Icons:** Lucide React
- **Data Visualization:** Recharts (ComposedChart, AreaChart, LineChart, BarChart, PieChart) + Custom SVG Sparklines
- **Routing:** React Router v6
- **State Management:** React Context API with a LocalStorage demo cache and authenticated Supabase event sync
- **Authentication & access:** Supabase Auth (password for staff, SMS OTP for seniors/families) with profile-backed roles and PostgreSQL row-level security

---

## Running the Application Locally

### Prerequisites
- Node.js `v18+` or `v20+` (tested on Node v24)
- npm `v9+`

### Installation
```bash
# Clone the repository
# Clone the repository from your team's Git remote, then enter the folder
cd samarth-watch

# Install dependencies
npm install

# Configure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in a local .env file
# Start development server
npm run dev
```
Open your browser at `http://localhost:5173/` to explore the dashboard.

### Supabase backend setup
1. Copy `.env.example` to `.env` and set the project URL and publishable/anon key. These two `VITE_` values are public client configuration; never put a service-role key in a `VITE_` variable.
2. In the Supabase SQL Editor, run `scripts/supabase_full_schema.sql`, then `scripts/supabase_backend.sql`. The old open prototype policies are removed; the backend migration enables authenticated, profile-based RLS.
3. Configure and enable the SMS provider under **Authentication → Providers → Phone**. Set the project redirect URLs under **Authentication → URL Configuration**.
4. Create an accounts JSON file outside version control and provision accounts with `node scripts/provisionSupabaseUsers.mjs <accounts.json>`. Staff accounts require a username and a strong password; senior/family accounts require an Indian mobile number. Use `linkedSeniorId` to link a family/senior profile to the corresponding `senior_profiles.id`. The matching senior profile must assign coordinators using their `legacyUserId`.
5. Keep `SUPABASE_SERVICE_ROLE_KEY` or `SUPABASE_SECRET_KEY` only in the trusted local/server environment used for provisioning. The provisioner reads `.env` and `scripts/hello.env`. Do not commit a server key, publish it, or add it to any `VITE_` variable. If a service key was previously included in a frontend build, rotate it in Supabase before deploying.

Example account file shape (replace all values; do not commit real account data):
```json
[
  {
    "role": "coordinator",
    "name": "Coordinator Name",
    "username": "careteam",
    "password": "replace-with-a-unique-strong-password",
    "legacyUserId": "coordinator-record-id"
  },
  {
    "role": "senior",
    "name": "Senior Name",
    "phone": "9876543210",
    "legacyUserId": "senior-user-record-id",
    "linkedSeniorId": "senior-record-id",
    "assignedCoordinatorId": "coordinator-record-id",
    "assignedCoordinatorName": "Coordinator Name",
    "linkedFamilyIds": ["family-user-record-id"],
    "linkedFamilyName": "Family Name",
    "linkedFamilyPhone": "9876543211",
    "familyConsentGranted": false,
    "detailedVitalsConsent": false
  },
  {
    "role": "family",
    "name": "Family Name",
    "phone": "9876543211",
    "legacyUserId": "family-user-record-id",
    "linkedSeniorId": "senior-record-id"
  }
]
```

Authenticated users have separate local caches and load their authorized senior profiles and existing records from Supabase. App changes are appended to `app_sync_events`; a per-account browser outbox retries pending writes, and the client fetches permitted event history in pages before polling from its last event ID. Row-level policies scope records by role, senior assignment, family consent, detailed-vitals consent, and location-sharing preference. Consent changes are written through a senior-only database function; the family portal cannot grant consent on the senior's behalf.

The local demo seed and synthetic evaluation cohort are not used as fallback records for authenticated sessions. The browser cache remains an offline/UI cache, not the source of truth. Wearable connection state and simulator readings remain device-local; continuous background collection and vendor-cloud integrations still require a separately deployed mobile/backend integration. These migrations and SMS-provider settings must be applied in your Supabase project before real accounts can use the backend.

### Production Build
```bash
npm run build
npm run preview
```

---

## Wearable Device Integration & Ingestion Pipeline

Samarth Watch includes a comprehensive, production-ready client architecture (`src/wearables/`) for ingesting vitals from smart bands, watches, rings, and home health devices.

### 1. Browser & Device Realities: What Works Now vs What Doesn't
* **What works in this prototype**:
  - **In-Memory Simulator Provider (`SimulatedWearableProvider`)**: 7 deterministic scenarios (`normal`, `rising_resting_hr`, `sustained_low_spo2`, `device_silent`, `battery_low`, `fall_detected`, `device_sos`) for full testing without hardware.
  - **Standard Web Bluetooth (`WebBluetoothProvider`)**: Connects directly from supported Chromium browsers (Chrome/Edge on Android, macOS, Windows, ChromeOS) to real Bluetooth Low Energy (BLE) health peripherals exposing standard GATT profiles.
* **What cannot work from a web page alone**:
  - **iOS Mobile Browsers**: WebKit/iOS Safari explicitly does not implement Web Bluetooth API.
  - **Proprietary Consumer Smartwatches (Apple Watch, Samsung Galaxy Watch, Fitbit, Garmin, Oura)**: These devices do not expose open standard GATT services to web pages. Their health metrics are restricted to native sandboxes (Apple HealthKit, Android Health Connect) or vendor cloud APIs requiring developer licenses and OAuth backends.
  - **Continuous Background Collection**: Browsers cannot poll Web Bluetooth when the tab is closed or backgrounded.

### 2. Standard BLE GATT Services Supported
The pipeline contains binary parsers with bitmask decoders and unit conversions for:
* **Heart Rate Measurement** (`0x2A37` under service `0x180D`): Parses 8-bit / 16-bit heart rate, contact detection flags, energy expended, and RR intervals.
* **Battery Level** (`0x2A19` under service `0x180F`): Parses battery percentage with bounds enforcement.
* **Pulse Oximeter Continuous Measurement** (`0x2A5F` under service `0x1822`): Parses SpO2 % and pulse rate using IEEE-11073 16-bit SFLOAT decoder.
* **Blood Pressure Measurement** (`0x2A35` under service `0x1810`): Decodes systolic, diastolic, mean arterial pressure (MAP), and converts kPa to mmHg when required.
* **Weight Scale Measurement** (`0x2A9D` under service `0x181D`): Decodes kilograms / imperial pounds.

### 3. How to Test With a Real BLE Device
1. Open Samarth Watch on a compatible browser (Google Chrome or Microsoft Edge on Android or Desktop).
2. Ensure your computer or phone's Bluetooth is turned on.
3. Power on a standard BLE peripheral (such as a Polar/Wahoo heart rate chest strap or a Wellue BLE pulse oximeter).
4. Navigate to the **Care Coordinator Senior Profile** (`/coordinator/seniors`) or Senior Band Settings.
5. Click **"Pair Bluetooth Device"**. The browser's native device picker dialog will appear.
6. Select your device. Live readings will stream directly through the quality filter, deduplication engine, and rule evaluation.

### 4. Ingestion Contract (`POST /v1/ingest/readings`)
For production integration with native companion apps or vendor cloud webhook forwards, the pipeline exposes a typed contract in `src/wearables/ingestContract.ts`:
```json
{
  "seniorId": "senior-001",
  "deviceId": "ble-polar-h10-a4f2",
  "deviceType": "heart_rate_strap",
  "samples": [
    {
      "type": "heart_rate",
      "value": 74,
      "unit": "bpm",
      "timestamp": "2026-10-30T10:15:00.000Z",
      "qualityScore": 0.95
    }
  ],
  "clientBatchId": "batch-179330-001"
}
```
* **Deduplication & Idempotency**: Each sample generates a deterministic key (`seniorId + type + timestamp`). Retransmitted duplicate samples are ignored.
* **Quality Filter**: Physiological plausibility ranges (e.g. Heart Rate 30–240 bpm, SpO2 70–100%) reject artifacts with structured rejection logging.
* **Two-Tier Safety Rules Engine**:
  - **Tier 1 (Trend Alerts)**: Sustained deviations (e.g. 3 consecutive low SpO2 readings or rising resting HR) route as high-priority coordinator tasks.
  - **Tier 2 (Emergencies)**: Accelerometer fall detections and physical device SOS triggers immediately bypass routine batching, triggering parallel coordinator and family emergency notifications with 60s debounce protection.

### 5. Production Companion App & Cloud Architecture
* **Companion App Path (`CompanionAppProvider`)**: Lightweight native mobile app (Flutter or React Native) running in the background on the senior's or caregiver's phone. Interacts with Apple HealthKit / Android Health Connect and batches encrypted readings to the `/v1/ingest/readings` endpoint.
* **Cloud Sync Path (`CloudSyncProvider`)**: Server-to-server OAuth webhooks connecting to authorized cloud provider platforms (Withings Health Mate, Garmin Health, Fitbit Web API) with strict DPDP tokenization.

### 6. Map Tiles & Location Privacy Notice
* **OpenStreetMap Tile Usage**: The map display uses public OpenStreetMap tile servers (`https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png`). These public servers are operated by the OpenStreetMap Foundation strictly for light use and testing. Production deployments must use a paid commercial provider (e.g. MapTiler, Stadia Maps) or a self-hosted tile server.
* **Tile Privacy**: HTTP tile requests reveal the viewed bounding box / coordinates to the tile server.
* **Background Limits**: The web app cannot collect location or Bluetooth readings in the background or when the browser tab is closed. Live tracking requires the application window to remain open.
* **Simulated Data**: Prototype mock coordinates and simulated sensor streams are clearly labeled and do not represent real-time physical telemetry.

---

## Legal & Medical Disclaimer
*Samarth Watch is a prototype risk detection system created for demonstration purposes. It does not provide medical advice, diagnosis, or treatment recommendations. All risk alerts must be triaged by qualified human coordinators.*
