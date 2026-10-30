# Prompt 02: starting page, login page, 404 (reference A)

```
Read docs/PROJECT_BRIEF.md and docs/DESIGN_SYSTEM.md again and look at docs/references/reference_A_dental_clinic_website.jpg. This is PHASE 2 only. Do not change app logic. Phase 1 must already be done.

From reference A take only: calm sage and mint palette, deep green headings and buttons, layout rhythm (top bar, hero with a card on the right, six feature cards with thin line icons, a split photo section, quiet footer), soft cards, generous space. Do NOT copy its brand, wording, photo, star rating, testimonial, "5,000+ patients" counters, script accents or pill buttons.

STARTING PAGE, route "/" (public, mobile first, English and Hindi with a language selector). If a session exists, show "Open my dashboard" instead of "Log in" and send the user to their role home.
- Top bar: logo mark and the name Samarth Watch (links to "/"), section links, language selector, primary "Log in" button. On phones a menu button opens a full-height drawer (closes on route change, Escape and outside tap, focus trapped).
- Hero: label "For Care Coordinators and families". Headline "Know who needs a call today." Line: "Samarth Watch brings medicine, check-ins, voice notes and wearable readings into one daily list, so a Care Coordinator can reach a senior before a small problem grows." Buttons "Log in" (primary) and "See how it works". Three small facts with line icons: "The senior decides what family can see", "Hindi and English", "Large text and simple steps for seniors". Real photo background (see Photos).
- Features, six cards, exact plain copy (write the Hindi too):
  Medicine reminders: "If a dose is not confirmed within 30 minutes, the family and coordinator are told. If it is taken, nobody is bothered."
  One-tap SOS: "One tap sends an alert with location to the coordinator and the family together."
  Voice notes: "A senior speaks. Only their own coordinator receives it, with a short summary." Tag: "Summary is simulated in this prototype".
  Health readings: "Readings from a band or watch are compared with the senior's own usual, not a general average." Tag: "Device data is simulated in this prototype".
  Family reports: "A daily or weekly report in plain language, with a button to get it whenever needed."
  Privacy and consent: "The senior controls what the family sees. Emergency alerts are the only exception, and they share only the essentials."
- How it works: three columns (Senior, Family, Care Coordinator) with a short plain paragraph each.
- Split section with a photo: "Made for people who do not use apps", three short lines about large text, voice and no medical jargon, "Works in the phone's browser".
- Honest note: "This is a prototype running on synthetic data. It is not a medical device. It flags risk to a human and never diagnoses."
- Final call to action, then a footer: logo, Privacy Policy and Terms links, Credits link, language selector, "Prototype on synthetic data. Not a medical device.", copyright year from new Date().getFullYear(). No social icons, no fake contact details, no testimonials, ratings, counters, pricing or newsletter.

LEGAL PAGES: write short, plain Privacy Policy and Terms pages for a prototype (what data the demo stores in the browser, consent, emergency exception, no medical advice). Do not invent a company name, address or contact details. If the owner's details are missing, leave the contact line out and list this as something I must provide.

LOGIN PAGE "/login": desktop shows a photo background with a flat scrim, a short intro on the left (small label, heading "Log in to Samarth Watch", two plain lines, the three small facts) and a frosted login card on the right with a solid fallback colour. Phone: single column, card first. Card: title, the one field "Username or mobile number" and the credential step already built (password for coordinator, Demo OTP for senior and family), show/hide password, primary button, aria-live success and error messages, language selector, a lock icon line. Do NOT show any usernames, passwords or OTP codes anywhere. Keep the generic error and the lockout. Logged-in users who open /login go to their home. Add a "Back to home" link.

ALSO: restyle the 404 page with the same look and a button back to "/", and add a Credits page.

PHOTOS: real photographs only, free commercial licence (Unsplash, Pexels, Wikimedia Commons) or supplied by me. Documentary style, Indian seniors and families in everyday home settings, no cartoons, no hospital clichés, no AI images. Self-host in /public/images as WebP with srcset, width and height set, hero eager and others lazy, mobile hero under about 150 KB, descriptive alt text, a flat scrim so text keeps 4.5:1. Record file, source URL, photographer and licence on the Credits page. If you cannot download images here, do NOT hotlink and do NOT fake photos: build the image slots with a flat tint fallback and give me a list (slot name, file name, size, subject, folder).

Responsive, accessibility and performance rules in docs/DESIGN_SYSTEM.md apply. usePageTitle with unique translated titles and descriptions for "/", "/login", Privacy, Terms, Credits and 404.

STOP when Phase 2 is done. Report files changed, contrast ratios, the photo slot list, Hindi lines for review, screenshots at 320, 390, 768 and 1280 if you can capture them (otherwise say you could not check visually), and anything you could not complete. Wait for "continue".
```
