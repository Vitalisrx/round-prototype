# Round V5 / Springboard

**Good company. No big plan.** A lightweight group finder for real-world activities, expressed as a fictional local prototype.

## Preview

Updating preview: https://raw.githack.com/Vitalisrx/round-prototype/main/index.html

The header must say **ROUND V5**, and the page uses a light theme. Old commit-pinned V3/V4 links are immutable and cannot display a new release. raw.githack may show a first-visit destination confirmation. It is a third-party preview service, not GitHub Pages or production hosting.

## What V5 actually implements

- Fifty activity templates and sixty named formats, not a universal five-person cap. Singles tennis: two; Spades: four; basketball five-on-five: ten; volleyball six-on-six: twelve. Flexible activities have sensible bounded defaults.
- Recognizable dropdown choices, optional search within the menu, nearby walking budget, and secondary cost/access/pace/total-time refinements. Empty inventory is never replaced with fake matches.
- Activity and suitable public place drive creation. No arbitrary start-time picker. Joining affirms the plan; a minimally viable group sets a near-term meeting target within a bounded recruiting window.
- Open joining by default. Optional host requests support actual candidate inspection, invitation, and separate invitee acceptance. A pending request or invitation never occupies capacity.
- Contextual player cards: the selected person's relevant activity record, collection, broad participation, and original character. No public reliability score or achievement admission gate.
- Local typed chat, quick replies, and character stickers. Sample messages are labeled. No connected AI or real person is impersonated.
- Eighteen authored collectibles, clear criteria, progress, three showcase pins, starter appearance customization, usable character props, and anonymous fictional keepsakes.
- One active commitment, capacity and format validation, invitation expiry, optional short interests, self-check-in versus evidence, and idempotent awards.

## Try the whole loop

Open **Spades**, inspect **Maya**, return to the plan and choose **I'm in**. A second generic ready button is not required. Use the explicitly labeled demo controls to jump to the meeting, check in, finish the activity, select the people met, and simulate reciprocal confirmations.

The account starts at **60 AP**. Joining, check-in and the user's report keep it at 60. The full Spades example grants **Wild card (50)** and **The missing piece (25)** for **135 AP once**. Partial evidence cannot claim the four-person format. Put the item on or export an anonymous keepsake.

To test host review: create Coffee, expand secondary options, choose **Ask me first**, publish locally, and use **Add a sample join request**. Inspect the candidate, invite them, then separately simulate their acceptance. Neither inspecting nor inviting manufactures an accepted seat.

## Run and test

```sh
node tests/core.test.js
python build.py
python -m pip install playwright==1.57.0
python -m playwright install --with-deps chromium
mkdir -p screens
python -m http.server 8765 --bind 127.0.0.1
# From another terminal:
BASE_URL=http://127.0.0.1:8765/ python tests/browser.test.py
```

`build.py` produces a complete self-contained `round_v5.html` with explicit script hashes in its Content Security Policy. No library, image, font, API, analytics or model network request is needed by the prototype.

The authoring environment passed 44 authored state tests plus 13,200 table-driven capacity cases and 64 inline Chromium UI checks. Large mechanical test counts are not real-user validation. The V5 release workflow separately runs actual HTTP-origin UI tests (including persistence) and a public-host check. **Consult its actual result, not this README, for whether a URL was successfully verified.**

The public-host test compares all five served application files byte-for-byte to the checked-out release, opens the public page in Chromium, inspects a person, joins, completes the fictional evidence/reward flow and reloads the page. Its browser uses raw.githack's documented automation confirmation cookie; ordinary first-time visitors may see the host's destination notice. Reports and screenshots are retained as workflow artifacts for fourteen days.

## Source map

`v5/core.js`: controlled catalog, formats, local state, capacity, timing, requests, evidence, awards.

`v5/art.js`: original expressive characters, icons and collectible art.

`v5/style.css`: light Springboard design system, responsive layouts and choice controls.

`v5/app.js`: finder, creation, player-card inspection, host/candidate flows, chat, collection and export.

V4 source and core tests remain archived at the root. V4 is not the current entry point.

## Research and limits

The accompanying founder package contains a source register, a selected product direction and a reproducible **10,000-row decision matrix**: fifty activities × ten situations × twenty questions. These are AI-authored scenario applications, **not 10,000 studies, interviews, independent conversion findings, or a virality guarantee**. See `research/SOURCES.md` for the actual reviewed sources.

Everything on screen is fictional. Browser storage is editable and is not a security boundary. No real authentication, multiuser database, witness identity, live routing, venue availability, remote messaging, push delivery, payment collection or operational moderation is connected. Start-time defaults and arrival calculations are illustrative, not real transport predictions.

Before a live adult/public-place pilot: server-authoritative transactions, authenticated witness authorization, plan-version consent, venue operations, maintained access information, blocked-user enforcement, reporting and response staffing, appeals, retention/deletion design, physical-device and assistive-technology testing are required. The achievement system must never certify somebody's character, ability or safety.

Only `Vitalisrx/round-prototype` is in scope. Other repositories are unrelated.
