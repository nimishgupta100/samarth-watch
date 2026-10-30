# Prompt 05: Family website (reference C)

```
Read docs/PROJECT_BRIEF.md and docs/DESIGN_SYSTEM.md again and look at docs/references/reference_C_senior_care_app_senior_and_family.jpeg. This is PHASE 5 only. Do not change app logic. Phases 1 to 4 must be done.

From reference C take only: the header, quick action tiles, the medication tracker with month label, date strip, Morning/Afternoon/Evening segments, "Today's progress" and dose cards, and the upcoming appointment card. Leave out: photos of people, wellness percentage, invented vitals, invented appointments and medicines, motivational text, gradients, pill shapes.

LAYOUTS
- PHONE (below 768px): top bar with Kamla's initials avatar and name, last check-in time, a bell with unread count, language inside the profile menu. Bottom navigation: Home, Medicines, Health, More (More holds Appointments, Messages, Reports, Settings, Log out). Detail screens are full-screen pages with a back arrow. Forms and pickers are full-screen sheets with a large close button and the primary button fixed at the bottom with safe-area padding.
- TABLET (768 to 1023px): two columns.
- LAPTOP (1024px and above): left sidebar (about 260px, collapsible) with Home, Medicines, Health, Appointments, Messages, Reports, Settings and log out. Content grid up to about 1280px. Medicines and Appointments use a two-pane layout. Real tables on laptop, stacked cards on phones. Escape closes panels.

SCREENS (real data only, empty states, always about Kamla only)
1. Home: emergency banner ONLY when an SOS or unconfirmed medicine is open: the fact, the time, "Open in Maps" (for SOS), status Informed / Coordinator is calling / Resolved, "Call Kamla" (tel: link) and, for medicine, "I spoke to them, they took it" (logged as confirmed by family, never as taken by the senior). Summary card with initials avatar, fact tiles that exist (others "Not added yet") and the existing plain-language status with icon and text, never a numeric risk score. "Medicines today: 2 of 4 taken" ring or bar with the text beside it, from real counts. Quick action tiles: Medicines, Calendar, Messages, Call Kamla, Get report. Today's medicine list, upcoming appointment card (or a "Book a session" button), latest voice note summary (only if consent allows), latest readings strip (only if they exist and detailed sharing is allowed, with source and time).
2. Medicines: month label with arrows, 7-day date strip, tabs Morning / Afternoon / Evening, "2 of 4 taken" progress card from real counts, dose cards with status chips (Taken with time, Pending, Reminded, Not confirmed, Missed, Confirmed by family), a History tab with the 30 day calendar (fits 320px) and legend, and "Request a medicine change" with its status (Requested, Approved, Rejected).
3. Health: latest readings with date, time and source (manual, family, or device name with "simulated" where relevant). Charts (14, 30, 90 days) with Kamla's OWN baseline band, tap tooltips, plain comparisons ("A little higher than her usual this week"). Only if Kamla allowed detailed sharing, otherwise a respectful explanation. Family can add a reading labelled "added by family". Empty state when there are none.
4. Appointments: tabs Upcoming / Past / Cancelled, booking flow (type In person or Google Meet, date strip, IST slots, optional note, confirm), "Join Google Meet" only after the coordinator adds a real link (otherwise "The coordinator will add the meeting link before the call."), Add to calendar (.ics with IST), reschedule and cancel with success and error messages.
5. Messages: a simple conversation with the coordinator, rectangular bubbles, sent and failed states. Add an honest note in the README that without a backend it works only in the same browser.
6. Reports: "Get report" with Daily or Weekly, an optional in-app automatic reminder, readable on a phone, Print and Download PDF, A4 print styles, built only from real events with an empty state.
7. Notifications: bottom sheet on phones, side panel on laptop, only items addressed to Karishma.
8. Settings, and the respectful consent-paused screen that leaves no data in the DOM and explains the emergency-only exception.

Never show internal risk scores, anomaly values, model names or other coordinators' notes.

STOP when Phase 5 is done. Report files changed, contrast table, Hindi lines for review, screenshots at 320, 390, 768, 1024 and 1280 if you can capture them (otherwise say you could not check visually), and anything you could not complete. Wait for "continue".
```
