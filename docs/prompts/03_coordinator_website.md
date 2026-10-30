# Prompt 03: Care Coordinator website (reference B)

```
Read docs/PROJECT_BRIEF.md and docs/DESIGN_SYSTEM.md again and look at docs/references/reference_B_doctor_app_coordinator.jpg. This is PHASE 3 only. Do not change app logic (reminders, SOS, voice notes, reports, wearable pipeline, data layer). Phases 1 and 2 must be done.

From reference B take only: a greeting row with avatar, search and bell; one soft green banner card; a row of icon shortcuts; person cards with avatar, name, one detail line and one action; bottom navigation with a raised centre button on phones; segmented tabs for appointments grouped under Today and Tomorrow; a profile page with a green header and fact tiles; a date strip with Morning, Afternoon and Evening slots; an inbox list. Leave out: star ratings, prices, doctor photos, "Book Now" shop style, pill shapes, the fake video call screen, blood group and height tiles that were never entered.

LAYOUTS
- PHONE (below 768px): top bar with initials avatar, "Welcome back" plus the saved name (nothing invented), search, notification bell with unread count. Bottom navigation: Home, Seniors, Inbox, More, with a raised rounded-square centre button that opens a bottom sheet of quick actions (Add medicine, Schedule appointment, Call senior, Call family). Detail pages are full-screen with a back arrow. Forms and pickers are full-screen sheets with a large close button and the primary button fixed at the bottom.
- TABLET (768 to 1023px): two-column cards.
- LAPTOP (1024px and above): left sidebar (about 260px, collapsible to icons) with Home, Seniors, Appointments, Inbox, Settings, avatar and logout. Top bar with search, bell, language and profile menu. Content grid up to about 1280px. Seniors, Appointments and Inbox use list on the left and detail on the right. Wide data uses real tables on laptop that become stacked cards on phones. Escape closes panels and menus.

SCREENS (real data only, calm empty states, never filler)
1. Home "Today": an emergency strip ONLY when an SOS or unconfirmed medicine event is open (senior name, time, "Open in Maps", a Call button that is a tel: link or disabled with "Phone number not added yet", and an Open button), the one place red dominates. A soft green banner with a real count ("No one needs attention right now" when zero) and "View today's list". Shortcut tiles with real counts: Medicine, Vitals, Voice notes, SOS, No response. "Today's priorities": cards sorted by urgency (SOS, medicine not confirmed, flagged voice note, device signal, silence) with initials avatar, name, one-line plain reason, time, status chip with icon and text, and a primary action. Keep Useful / Not useful, Snooze, Mark done and the 12 to 15 alerts per day indicator.
2. Seniors: search by name or phone, tabs All / Needs attention / Stable, cards. Senior profile: deep green header with initials avatar and fact tiles that exist (others "Not added yet"), buttons Call senior, Call family, Edit profile. Tabs: Overview (plain-language reason and the additive "why this score"), Medicines (today's doses, 30 day adherence calendar that fits 320px, add/edit forms, change requests with Approve and Reject), Vitals (own-baseline band charts, source labels, "simulated device" where relevant, empty state), Voice notes (summary, cue tags, play, transcript, "simulated" label), Reports, Family (linked members with phone and a Call button).
3. Appointments: tabs Upcoming / Past / Cancelled, grouped under Today and Tomorrow, type icon (In person or Google Meet), IST time, status with icon and text. Confirm, Reschedule, Cancel, a field to paste a REAL Meet link and a "Join Google Meet" button once present (never fake a link). Schedule flow: date strip, Morning/Afternoon/Evening, slot buttons, note, confirm. Laptop: week view beside the list.
4. Inbox: voice notes from this coordinator's own seniors, family messages and system notifications, filters All / Voice notes / Family / System, unread dot plus a text label. Only items addressed to this coordinator appear.
5. Settings: profile, language (English and Hindi), notification preferences, logout, Reset demo data.

Charts in ResponsiveContainer (about 220 to 280px high on phones, fewer ticks, tap tooltips).

STOP when Phase 3 is done. Report files changed, contrast table, Hindi lines for review, screenshots at 320, 390, 768, 1024 and 1280 if you can capture them (otherwise say you could not check visually), and anything you could not complete. Wait for "continue".
```
