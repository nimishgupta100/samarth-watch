# Samarth Watch: project brief (single source of truth)

Date: 30 October 2026. Read this before touching any code. Credentials and phone numbers are in docs/PRIVATE_ACCOUNTS.md. Visual rules are in docs/DESIGN_SYSTEM.md.

## 1. What this is
- Samarth Watch is a hackathon prototype for Samarth Life Management Pvt Ltd (40,000+ seniors, 350+ cities, served by Care Coordinators).
- Problem: an AI early-warning system that detects health and wellbeing decline in seniors living at home and tells a Care Coordinator who needs attention today, why, and what to do next.
- Rules from the Problem Statement (docs/references/Problem_Statement.pdf): not a diagnosis tool (flags risk, routes to a human, never tells anyone they have a condition); low-tech seniors (voice or simple input, Hindi or English); alert fatigue (precision matters as much as recall); privacy (role-based access, consent for family sharing, masking before any external service); low cost at 10,000+ seniors; cite every dataset and model.
- Core requirements: ingest 3+ data types (vitals, medication logs, call notes); NLP on Hindi-English notes; daily risk score from a rules baseline plus at least one ML or anomaly model, with changes from the senior's OWN baseline; explainable dashboard sorted by urgency.
- Synthetic cohort: at least 200 seniors over 90 days with noise, missing entries and planted decline cases, documented.
- Deliverables: live prototype, Git repo with README, write-up (max 4 pages), metrics on planted cases (precision, recall, days early), 5 minute pitch and demo.
- Judging weights: technical depth 25%, real-world usefulness 25%, explainability 15%, accessibility for seniors 15%, privacy and safety 10%, presentation 10%.

## 2. Current state
- Stack (do not change): React 18, TypeScript, Vite, Tailwind CSS 3, React Router v6, Recharts, Lucide React, tailwind-merge, clsx.
- No backend. All data is in the browser (localStorage / IndexedDB). No database, no real auth, no real SMS, push, calls, speech-to-text or model server.
- No ML model has been trained yet. Numbers in the README, write-up and Model Evaluation page (86.4% precision, 91.7% recall, 5.8 days early, 92.4% top-10, Rs 35 per senior per month, XGBoost, Whisper Medium Indic, on-device masking) are PLACEHOLDERS until computed from real runs. Do not present them as results.
- The assistant that wrote this brief has NOT seen src/ or public/. Read the real code first and report differences.
- Prepared replacement files are in project-files/ (index.html, favicon, _redirects, usePageTitle hook, tailwind.config.js, .gitignore, README.md).

## 3. Roles, accounts and login
- Roles: Care Coordinator, Senior, Family, Operations Manager.
- Accounts: see docs/PRIVATE_ACCOUNTS.md. Exactly three users and one senior record. Nothing else is invented. Everything not listed starts EMPTY ("Not added yet" or an empty state).
- Operations Manager: no account. Keep the code and route guard, create no account, show no fake numbers.
- One login page for everyone: field "Username or mobile number". Coordinator uses a password. Senior and Family use the mobile number plus a simulated "Demo OTP" step (code kept in one constants file, nothing is sent, never shown on the page). Normalize Indian mobile numbers (spaces, dashes, +91). Generic error message, 30 second lockout after 5 failed attempts. Session in sessionStorage so two browser tabs can be two different roles.
- After login: coordinator goes to the Coordinator website, senior to /senior-home, family to /family. Route guards block cross-role URLs with a short plain message.
- Senior and Family sign in the same way but see two completely different websites.
- Old seeded data (Kamala Devi and the other planted seniors, demo accounts, the demo accounts box) is removed from the live app. The 200-senior synthetic cohort stays ONLY in src/evaluation/ for the Model Evaluation page and write-up.
- Languages: English and Hindi ONLY. The whole UI translates instantly. Greetings by local hour ("Good morning, Kamla" / "Namaste, Kamla ji" in Devanagari). Typed i18n keys so a missing key is a compile error. No hardcoded user-facing strings. Hindi strings need native review.

## 4. Senior website (Kamla)
- Simplest possible: one centred column on phone and laptop, one action per screen, max 3 buttons plus the fixed SOS button, buttons at least 64px tall, text 22px or larger, 7:1 contrast, no charts, scores, tabs or medical terms, a Listen bar, a Back button, larger text and high contrast modes, warm neutral wording that never names a condition.
- Home: greeting, a "Next" card (next medicine, or "No medicine has been added yet. Your coordinator will add it."), then only: Today's medicine, Daily check-in, Talk to my coordinator. A Settings link at the bottom (language, larger text, contrast, consent, log out).
- Medicine: today only, doses grouped Morning, Afternoon, Evening. The due dose has exactly two buttons: "Yes, I took it" and "Not yet".
- Check-in: 4 questions, one per screen, three answers (Theek, Thoda kharab, Bahut kharab) with icons.
- Voice note: single tap to start, single tap to stop (no press and hold), very large button, visible "Recording" label with timer and level meter, 60 second limit with a warning at 50, then Listen again, Record again, Send, and always Skip. If the microphone is denied: calm message and Skip. The note goes ONLY to Kamla's assigned coordinator with a short summary and cue tags (pain, dizziness, low appetite, loneliness, fall, confusion, poor sleep). Transcript and summary are SIMULATED in the demo and labelled so. Kamla only sees "Sent. Thank you." Family sees a short summary only if consent allows.
- Health reading (optional): one reading per screen (BP, sugar, SpO2, weight, pulse), numeric input with plus and minus, no interpretation shown.
- Talk to my coordinator: Call or video, or Visit at home, then at most 3 time slots, then a confirmation.
- Consent: one tap to share with family or not, plus a separate choice for detailed health readings. Defaults: family sharing ON, detailed health OFF.

## 5. Family website (Karishma): complete information about Kamla only
- Phone: bottom navigation (Home, Medicines, Health, More). Laptop: left sidebar and two-pane screens.
- Home: emergency banner only when an SOS or unconfirmed medicine is open; summary card with plain-language status (Doing well, Worth a check, Coordinator is following up) with icon and text, never a numeric risk score; "Medicines today: 2 of 4 taken" from real counts; quick actions (Medicines, Calendar, Messages, Call Kamla, Get report); today's medicine; upcoming appointment; latest voice note summary (consent); latest readings (only if they exist and detailed sharing is allowed).
- Medicines: date strip, Morning/Afternoon/Evening tabs, progress card, status chips (Taken, Pending, Reminded, Not confirmed, Missed, Confirmed by family), 30 day calendar, "Request a medicine change" (needs coordinator approval).
- Health: readings with date, time and source; charts with Kamla's OWN baseline band; plain comparisons ("A little higher than her usual this week"); only with detailed sharing; family can add a reading labelled "added by family".
- Appointments, Messages (works only in the same browser until a backend exists), Reports, Notifications (only items addressed to Karishma), Settings.
- If Kamla pauses sharing: respectful explanation and no data in the DOM. Emergencies still send the minimal fact.
- Never show risk scores, anomaly values, model names or other coordinators' notes.

## 6. Coordinator website (nimishgupta100)
- Phone: bottom navigation (Home, Seniors, Inbox, More) with a centre quick-actions button. Laptop: sidebar plus list and detail panes.
- Home "Today": emergency strip, banner with a real count, shortcut tiles (Medicine, Vitals, Voice notes, SOS, No response), ranked priority cards with reason and action, Useful / Not useful, Snooze, Mark done, alert cap 12 to 15 per day.
- Seniors list and profile (Overview with the additive "why this score", Medicines, Vitals, Voice notes, Reports, Family).
- Appointments (Upcoming, Past, Cancelled), paste a REAL Google Meet link, Confirm, Reschedule, Cancel. Inbox (own seniors only). Settings and Reset demo data.
- Forms: edit profile, edit Kamla's profile, add/edit/remove medicine, approve or reject family change requests, confirm appointments.
- The coordinator phone number is not given yet, so "Call coordinator" shows "Phone number not added yet" until he adds it.

## 7. Behaviour rules
Medicine reminders
- Dose due: the Senior sees a reminder. No response means a reminder every 5 minutes.
- Still not confirmed 30 minutes after the scheduled time: notify ALL linked family AND the coordinator ("[Name] has not confirmed the [time] medicine yet. Please call to check.").
- Taken before 30 minutes: stop everything and send NOTHING to family (their dashboard just shows Taken). Taken after the family alert: no new notification, the dashboard updates and the banner clears.
- "Not yet" snoozes 5 minutes but does not stop the 30 minute rule. After 2 hours the dose is logged as missed.
- The family button "I spoke to them, they took it" is logged as confirmed by family, never as taken by the senior.
- No dosing advice, no side effects, no conditions. Thresholds live in one constants file. Logic is pure timestamp functions (reload safe). A labelled "Demo speed" control makes the rules demonstrable.

SOS
- ONE tap sends immediately (no confirmation screen). A calm "Sent" screen follows with an "I pressed this by mistake" button for 60 seconds, which marks the event "cancelled by senior" and tells both parties it was a false alarm.
- One event, one notification to the assigned coordinator and every linked family member, same timestamp, with location.
- Location: browser Geolocation (needs HTTPS and permission, asked during setup). Falls back to the last known location with its age, then to the home address labelled as such. Sent as text plus an "Open in Maps" link, with a follow-up update if it arrives late. Never tracked continuously.
- Calls: a browser cannot dial two numbers at once. The demo shows simulated "Calling coordinator" and "Calling family" lines plus two tel: buttons. Production would use Exotel or Twilio from a backend. Never claim real calls were placed.
- SOS ignores family consent but sends only fact, time, location and status. Plain text: "If this is life threatening, call 112". Never claim an ambulance or emergency services were called. Only the coordinator can resolve an SOS.

Wearables (smart band, watch, ring)
- WearableProvider interface: simulated device (demo, labelled), optional Web Bluetooth (standard BLE heart rate only, Chrome, not iOS Safari), production path documented only (Health Connect, HealthKit or vendor cloud API through a backend or companion app). Pairing is done by coordinator or family; the senior only consents.
- Tier 1 (deviation from own baseline): normal alert gating. Tier 2 (fall plus no movement, device SOS button, hard limits persisting across several samples): fires the same SOS flow with location. Thresholds are configurable placeholders for a clinician to set. A silent device gives a Tier 1 "no data" signal only. Messages never name a condition.

Read aloud
- A normalizer expands abbreviations before speaking (Smt. to Shrimati, Col. to Colonel, Dr. to Doctor, Retd., BP, SpO2, units, times, numbers). Rate about 0.85, Slow and Normal, one sentence at a time, Play, Pause, Stop, Read again, sentence highlight, best en-IN or hi-IN voice, never auto-plays, stops on navigation or language change.

Reports
- Family "Get report": Daily or Weekly, built only from real events (medicine, check-ins, voice summaries if consent allows, readings if allowed, SOS, appointments, coordinator actions). On screen, Print, Download PDF. Automatic delivery is an in-app reminder only.

Appointments
- In person or Google Meet, IST slots, optional note, statuses (requested, confirmed, completed, cancelled), .ics download with IST. The app never generates Meet links; the coordinator pastes a real one.

## 8. Model and data plan (not built yet)
- Rules baseline, personal rolling 30 day Z-scores, Isolation Forest on baseline-relative features, lexicon NLP for Hindi-English cues (optional small classifier), pretrained Whisper for speech (not trained), adaptive top-k alert gating.
- Train on early normal days, split by senior, evaluate on planted cases: case-level precision and recall, days early, alert-level precision. Report only numbers the code produced, and say the data is synthetic.
- Backend plan: Supabase (auth, Postgres, realtime, storage) plus a small FastAPI service for scoring and Whisper. See docs/NEXT_STEPS_BACKEND_AND_MODEL.md.
- docs/dataset/ holds a 60+ extract of a hospital admissions file. It is random synthetic data with no vitals, no adherence and no notes, so it cannot train the model. Read docs/dataset/DATASET_NOTES.md.

## 9. Known problems to fix later
- Precision conflict: the benchmark table says 86.4% and 91.7%, while the confusion matrix (TP=11, FP=1, FN=1) gives 91.7% for both.
- Planted cases 7 to 12 are generic in the write-up but named in the README. Check-in questions: 3 in the write-up, 4 in the README. "Precision at top-10 of 92.4%" needs a definition. Operations figures must be labelled synthetic.
- Google Fonts sends visitor IPs to Google: self-host fonts.
- README and write-up still contain emoji headings and em dashes.

## 10. Pre-launch checklist
- Done in project-files: favicon, page titles and descriptions, SPA fallback, font stack.
- Still to do: custom domain (needs a host), "Made with AI" tag check, Privacy and Terms pages (need legal entity name and contact details), horizontal scroll and mobile overflow, broken links and buttons, footer links, mobile menu, custom 404, image compression, success and error messages, placeholder text, unused navigation, clickable logo, phone and email (need real values), full mobile optimisation.

## 11. Needed from the owner
Coordinator phone number and display name; Operations Manager account (if any); Kamla's details (age, city, address, living situation, language, medicines); Karishma's relationship; hosting provider and domain; legal entity and contact details; deadline; licence-checked photos; the demo OTP code to use.

## 12. Not now
AI agent or chat assistant: later. Do not add any button, route or "coming soon" text for it. Keep the architecture clean enough to add it without rewrites.
