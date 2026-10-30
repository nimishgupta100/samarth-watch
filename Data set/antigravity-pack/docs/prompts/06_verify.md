# Prompt 06: verification

```
Read docs/PROJECT_BRIEF.md and docs/DESIGN_SYSTEM.md again. This is PHASE 6, verification only. Fix defects you find, but do not add features.

For every route, at widths 320, 360, 375, 390, 412, 430, 768, 1024, 1280 and 1536, and in phone landscape, check and report in a table:
- no horizontal scroll
- no clipped, overlapping or hidden text in English and Hindi
- tap target sizes (44px, 64px on the Senior website, SOS 72px)
- fixed elements do not cover content and respect safe areas
- charts, tables and calendars fit their containers
- forms work with the on-screen keyboard open
- every button works and shows a visible success or error message
- keyboard and screen reader basics (focus rings, labels, aria-live)
- the Senior website works at 200 percent zoom and with larger text
- the desktop layout is intact

Add a small automated check (for example Playwright) that loads each route at 320px and fails if scrollWidth exceeds the viewport.

Test: login, lockout, route guards, data isolation (Karishma sees only Kamla's data and only her own notifications; Kamla's voice note and SOS reach only nimishgupta100 and Karishma). Medicine rules with Demo speed: reminders at 5, 10 and 15 minutes, family and coordinator notified once at 30 minutes, NOTHING sent to family when taken before 30 minutes, snooze, missed after 2 hours, behaviour after reload. SOS: one tap creates one event, one coordinator notification and one notification per linked family member with the same timestamp and location, the mistake button notifies both, a late location sends a follow-up. Read aloud normalizer: at least 25 cases including "Smt. Kamla Devi", "Col. Rajeshwar Bakshi (Retd.)", "Dr. K. S. Ramanathan", "Shri Rameshwar Pathak".

Search the whole repo for em dashes, en dashes, emoji, "lorem", "TODO", "your-", "example.com", href="#", purple colours, gradients, pill-shaped classes (rounded-full on buttons), and the old seeded names. Fix everything found (except src/evaluation and the backup).

Run the production build. Report bundle size and a Lighthouse mobile score honestly. Confirm lazy-loaded routes and self-hosted fonts.

OUTPUT: the verification table, defects found and fixed, tests and results, and a list of everything you could not fix or verify, plus what I should test on a real phone (run npm run dev -- --host and open the network URL on the phone, same Wi-Fi). Do not claim anything works that a prototype without a backend cannot do: real SMS or OTP, real push, real calls, real speech recognition, direct reads from a smartwatch, background location, real Google Meet links, or sync between different devices.
```
