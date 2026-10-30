# Samarth Watch: design system and strict rules

Applies to every page, every phase.

## Look
Calm healthcare feel. Pale sage and mint backgrounds, deep forest green for headings and primary buttons, sage as accent, off-white cards with thin light borders, generous padding and white space, thin outline Lucide icons (stroke about 1.5) in soft rounded-square tiles.
References (docs/references/): A dental clinic website (landing and login), B doctor app (coordinator), C senior care app (senior and family). Take mood, structure and spacing only. Never copy brand names, photos, prices, ratings or wording.

## Tokens (create once as CSS variables and in the Tailwind theme)
- forest #1F4D3F (headings, primary button), forest-dark #173B30 (hover)
- sage #6E9A82 (accent, icons)
- mint #EEF5F1 (page background), mint-deep #E2EEE7 (sections)
- cream #FAFCFA (cards), border #D5E4DB
- text #14261F, muted text #4A5F55
- red #DC2626 and amber #D97706 ONLY for urgency and warnings (SOS, missed medicine, emergency). Green for success.
- Adjust values only if contrast fails, then report the ratios.

## Contrast and status
Text at least 4.5:1, Senior website at least 7:1. If a pairing fails, darken the text, not the background. Status is never colour alone: always icon plus text.

## Type and languages
Plus Jakarta Sans (Latin) and Noto Sans Devanagari (Hindi), self-hosted, line height at least 1.5 so Hindi marks are not clipped. English and Hindi only, through the i18n layer. Every new string needs both languages. List Hindi lines for native review.

## Shared components (build once, reuse)
AppShell variants, TopBar, BottomNav, Sidebar, Card, Button, Input, SegmentedTabs, StatusChip, EmptyState, DateStrip, SlotPicker, Sheet, Toast, NotificationPanel.

## Strict rules (no exceptions)
- No pill-shaped or fully round buttons, tabs or chips. Use rounded rectangles (rounded-lg, about 8px), cards at most rounded-xl.
- No purple. No gradients. No frosted glass except the login card (with a solid fallback). No emoji (Lucide icons only). No em dashes or en dashes anywhere in code, copy or comments.
- No fake reviews, testimonials, star ratings, counters, statistics, prices, fake names, fake appointments or invented health scores such as a wellness percentage. Every number shown is a real count from the app data.
- No AI-generated photos. No stock faces inside the app: people in the app get initials avatars on a flat tint.
- No vague hero text, no AI slop copy, no "Made with AI" tag, no scroll-triggered animations, parallax, cursor effects or looping motion. Simple fades only, and respect prefers-reduced-motion.
- Never invent data or behaviour. If a feature does not exist yet, show an honest empty state or "Not available yet".
- Label simulated parts (voice summaries, device data, calls) wherever they appear. The app is labelled a prototype on synthetic data, not a medical device.
- The system never diagnoses and never gives medical or dosing advice.

## Responsive and accessibility rules
- Mobile first. No horizontal scroll at 320px. Check 320, 360, 375, 390, 412, 430, 768, 1024, 1280 and 1536, plus phone landscape.
- viewport-fit=cover, safe-area padding for top bars, bottom navigation, SOS button and sheets, 100dvh instead of 100vh, never disable pinch zoom.
- Tap targets at least 44px (64px on the Senior website, SOS 72px). Inputs at least 16px with correct type, inputMode, autoComplete and enterKeyHint.
- Semantic landmarks, skip link, visible focus rings, keyboard operable, aria-live for messages, focus trapped in sheets and restored on close, usePageTitle on every page with translated titles.
- Wide tables become stacked cards on phones. Charts sit in ResponsiveContainer (about 220 to 280px high on phones, fewer ticks, tap tooltips).
- Lazy-load routes. Self-host fonts. Report bundle size and a Lighthouse mobile score honestly.
