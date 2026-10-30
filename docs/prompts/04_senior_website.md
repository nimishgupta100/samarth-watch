# Prompt 04: Senior website (reference C, simplified on purpose)

```
Read docs/PROJECT_BRIEF.md and docs/DESIGN_SYSTEM.md again and look at docs/references/reference_C_senior_care_app_senior_and_family.jpeg. This is PHASE 4 only. Do not change app logic. Phases 1 to 3 must be done.

From reference C take only: the greeting header with avatar and bell, quick action tiles, the medication tracker structure, soft cards. Leave out: any photo of people, the "75% wellness" ring, heart rate and temperature tiles that are not real readings, motivational text tied to a number, invented appointments or medicines, gradients, frosted glass, the black "Get Started" slider, pill shapes.

LAYOUT ON EVERY SCREEN SIZE: ONE centred column. Full width on phones, about 640 to 720px centred on laptops with the same big buttons. Never a sidebar, tabs or multi-column dashboard. Plain mint background outside the column. Mouse and keyboard must work as well as touch (visible focus rings, Enter and Space activate buttons).

PRINCIPLES: one action per screen, at most 3 buttons plus the fixed SOS button, buttons at least 64px tall and full width, rectangular, text 22px or larger, headings 32px or larger, 7:1 contrast, no charts, scores, tabs or medical terms, a Back button, larger text and high contrast modes, warm neutral wording that never names a condition. SOS is fixed at the bottom of the column inside the safe area, at least 72px tall, always visible, never covered by toasts, with bottom padding on the page. A Listen bar (Play, Pause, Stop, Read again, Slow and Normal) sits under the content and never overlaps SOS. Use the existing speech normalizer.

SCREENS
1. Home: greeting by local hour and language ("Good morning, Kamla" / "Namaste, Kamla ji") with an initials avatar and a bell that opens her notifications full screen. A "Next" card: the next medicine with time and name, or "No medicine is due right now", or "No medicine has been added yet. Your coordinator will add it."; a "Due now" text badge when a dose is due. Then at most three large actions: Today's medicine, Daily check-in, Talk to my coordinator. A small "Settings" link at the bottom (language, larger text, high contrast, consent, log out).
2. Today's medicine: today's date, "2 of 4 done today" as real text plus a simple bar. Doses in time order under Morning, Afternoon, Evening as large cards (name, the coordinator's instruction line, time, status with icon and text: Taken at 8:05 AM, Due now, Later today, Missed). The due dose is expanded with exactly two buttons: "Yes, I took it" and "Not yet". Success message after tapping. No date strip, no month view. Never show dosing advice, side effects or a condition.
3. Restyle the existing flows with the new tokens and cards, behaviour unchanged: daily check-in (4 questions, one per screen), voice note (single tap start and stop, very large button, timer, level meter, 60 second limit, Listen again / Record again / Send / Skip), health reading (one per screen, no interpretation), talk to my coordinator (type, at most 3 slots, confirmation), consent (one tap), and the SOS flow (single tap, calm "Sent" screen, "I pressed this by mistake" for 60 seconds, "Call my family" and "Call my coordinator" buttons, "If this is life threatening, call 112"). Show "Join Google Meet" only when a real link exists.

Test at 200 percent zoom and with larger browser text: nothing may be cut off or overlap.

STOP when Phase 4 is done. Report files changed, contrast table (7:1 target), Hindi lines for review, screenshots at 320, 390, 768 and 1280 if you can capture them (otherwise say you could not check visually), and anything you could not complete. Wait for "continue".
```
