# Samarth Watch: Antigravity pack (start here)

## What is in this pack
- docs/PROJECT_BRIEF.md : everything decided so far
- docs/DESIGN_SYSTEM.md : colours, rules, responsive and accessibility rules
- docs/PRIVATE_ACCOUNTS.md : the 3 accounts (private, never commit)
- docs/prompts/ : 00 kickoff and phases 01 to 06, one prompt per file
- docs/references/ : reference A (landing and login), B (coordinator), C (senior and family), Problem Statement PDF
- docs/dataset/ : cleaned 60+ extract and its notes (not usable for training, see notes)
- docs/NEXT_STEPS_BACKEND_AND_MODEL.md : for later, not for the UI phases
- project-files/ : prepared replacement files (index.html, favicon, _redirects, usePageTitle hook, tailwind.config.js, .gitignore, README.md)

## How to use it in Antigravity
1. Open your existing Samarth Watch project folder in Antigravity (the one with src/, package.json and so on).
2. Copy the docs/ folder and the project-files/ folder from this pack into the root of that project. Do not unzip over src/.
3. Make a git commit of the project as it is now, so you can undo anything.
4. Open docs/prompts/00_kickoff.md, copy the text inside the code block, paste it into the agent chat. Let it read everything and answer. Do not let it change code yet.
5. Then paste 01, wait until it finishes and stops, check it, and only then type "continue" or paste 02. Go in order: 01, 02, 03, 04, 05, 06. One phase at a time.
6. After each phase run npm run dev -- --host, open the network URL on your phone (same Wi-Fi), and look at it yourself before moving on.

## Things you must give later
Coordinator phone number and name, Kamla's details, Karishma's relationship, host and domain, legal entity and contact details for Privacy and Terms, the photos if the agent cannot download them.

## Remember
- Backend and model do not exist yet. The UI works in one browser only (two tabs can be two roles). Different phones will not see each other's data until the backend is built.
- This login is demo authentication. Do not put real phone numbers or the password in a public repo.
- Numbers in the old README and write-up are placeholders until the model is trained.
