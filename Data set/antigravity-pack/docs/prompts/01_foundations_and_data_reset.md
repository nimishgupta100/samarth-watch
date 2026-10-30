# Prompt 01: foundations and data reset

```
Read docs/PROJECT_BRIEF.md, docs/DESIGN_SYSTEM.md and docs/PRIVATE_ACCOUNTS.md again. This is PHASE 1 only. Do not start any other phase. Do not change app logic other than what is listed here.

STEP 0: BACKUP
Before deleting anything, create a git branch or tag named backup-before-data-reset (or copy the old data folder outside src if git is not available). Tell me what you backed up.

STEP 1: APPLY THE PREPARED FILES
Copy the files in project-files/ into the project at the same relative paths: index.html, public/favicon.svg, public/_redirects, src/hooks/usePageTitle.ts, tailwind.config.js, .gitignore, README.md. Merge, do not blindly overwrite: if the real project has changed since, keep its changes and tell me what you merged. Make sure docs/PRIVATE_ACCOUNTS.md is git-ignored.

STEP 2: DESIGN FOUNDATIONS
Create the tokens from docs/DESIGN_SYSTEM.md as CSS variables and in the Tailwind theme. Self-host the fonts (Latin and Devanagari subsets) and remove the Google Fonts links. Build the shared components listed in the design system. Replace the old navy and teal brand colours everywhere with the new tokens, keeping status colours meaningful. Report the contrast ratios you verified.

STEP 3: REMOVE ALL OLD DATA FROM THE LIVE APP
Remove old seeded seniors, coordinators, managers, family members, names (Kamala Devi, Col. Rajeshwar Bakshi, Savitri Sen, Rameshwar Pathak, Usha Narang, K. S. Ramanathan, Pratibha Joshi, Gurpreet Singh, Meenakshi Sundaram, Anand Deshmukh, Shakuntala Verma, Bhupendra Patel and any other generated person), medicines, vitals, notes, alerts, appointments, notifications, SOS events, voice notes, reports, demo accounts, and the "Demo accounts" box on the login page. Add DATA_VERSION (for example 2) so stale localStorage and IndexedDB keys are cleared on first load.
Keep the 200-senior synthetic cohort and its generator ONLY in an isolated folder src/evaluation/, read-only, used by the Model Evaluation page, clearly labelled "Synthetic evaluation cohort", and not connected to any login, role website or notification. Also copy docs/dataset/ into src/evaluation/dataset/ unchanged. Tell me exactly what you moved. Do not delete the cohort generator unless I say so.

STEP 4: THE NEW DATA (the only data in the live app)
Create exactly the three users and one senior record in docs/PRIVATE_ACCOUNTS.md. Nothing else is invented. Fields not given (age, city, address, living situation, language, emergency contacts, medicines, readings, check-ins, appointments, notifications) start EMPTY and show "Not added yet" or an empty state. Store the coordinator password only as a salted hash (Web Crypto). Consent defaults: family sharing ON, detailed health sharing OFF, changeable by Kamla. No Operations Manager account. Coordinator phone number is missing, so Call coordinator buttons show a disabled "Phone number not added yet".

STEP 5: LOGIN
One form with the field "Username or mobile number". Coordinator signs in with a password. Senior and Family use the mobile number plus a simulated Demo OTP (code in one constants file, nothing sent, never displayed). Normalize Indian mobile numbers (spaces, dashes, +91, 10 digits, type="tel", inputMode="numeric"). One generic error message ("Details did not match. Please check and try again."), 30 second lockout after 5 failures. Session in sessionStorage so two tabs can be two roles. Redirects: coordinator to the Coordinator website, senior to /senior-home, family to /family. Route guards stop any role opening another role's routes, with a short plain message. Logout clears the session. Tell me which demo OTP you chose.

STEP 6: DATA LAYER
Put all data access behind a typed repository interface (User, Senior, Medicine, DoseLog, CheckIn, VoiceNote, Reading, Appointment, SosEvent, Notification, ChangeRequest, ReportPreference). Implement with localStorage (IndexedDB for audio) and a storage event listener so two tabs on the same browser update live. Notifications are per recipient. The voice note summarizer, wearable provider, call service and location service are interfaces with a clearly labelled simulated implementation. Document in the README that localStorage data exists only in one browser, that a Senior and a Family member on different phones will NOT see each other's data until a real backend exists, and that this login is demo authentication only.

STEP 7: MINIMAL COORDINATOR FORMS (with success and error messages, English and Hindi)
Edit my profile, edit Kamla's profile, add/edit/remove a medicine (name, instruction text, times, no dosing advice), approve or reject family medicine change requests, confirm appointment requests, and a labelled "Reset demo data" button with a confirmation. Only the forms, not the full coordinator UI (that is Phase 3).

TESTS
After a fresh start: exactly 3 users and 1 senior, and zero medicines, readings, check-ins, notes, alerts, appointments and notifications. A search through src (excluding src/evaluation and the backup) finds none of the old names. Old localStorage is cleared. Login and lockout tests, number formats, route guard tests (senior cannot open /family or coordinator routes, family cannot open /senior-home or coordinator routes), data isolation tests.

STOP when Phase 1 is done. Report: what you backed up and moved, files changed, the contrast table, the demo OTP, the tests, and anything you could not complete. Wait for me to write "continue".
```
