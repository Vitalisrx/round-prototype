# Round / V4

A mobile-first group finder for small, nearby activities starting within twenty minutes.

**Interactive concept only.** All people, places, travel estimates, conversations and attendance records are fictional. The app is a local simulation, not a real meetup service. Round remains a working name.

## Run

Serve this folder as a static site, or open the generated standalone `round_v4.html` file. The modular app uses `index.html`, `v4.css`, `v4-core.js`, `v4-art.js`, and `v4-app.js`. No API keys, package installation, external fonts, image CDN or backend are required for the prototype.

The HTML Content Security Policy permits same-origin scripts and prevents network connections from the application. Browser storage keeps local demonstration state when available; otherwise the app reports its in-memory fallback. Reset is under **Fictional people & places → Reset all V4 demo data**.

## The complete walkthrough

1. Open Spades and review the public-place details and actual sample roster.
2. Take the spot, then say **I'm going**. Joining and readiness are different.
3. Use the visibly labeled **demo control** to simulate the other participants becoming ready.
4. Jump to the sample meeting. Tap **I'm here**.
5. Use **Finish sample activity & report**. Select the registered people you met.
6. Save your report. Points are still **35**.
7. Explicitly simulate reciprocal confirmations. The full four-person Spades scenario awards Wild card (40 AP) and Plot twist (25 AP), giving **100 AP** exactly once.
8. Put on the cards, customize the character, or save the fictional keepsake.

The partial-confirmation path records participation without claiming that a full four-person format happened. Host-reported companions fill capacity but cannot act as independent account witnesses.

## What changed from the published V3

V4 is a full replacement, not a reduced export or CSS overlay. The earlier published single page was materially smaller than the downloadable V3.

- Graphite surfaces, white primary actions, ice-blue accents and original ceramic character art replace the purple/lime UI and emoji collectibles.
- Search retains keyboard focus. No native select stack: searchable activity and venue pickers, direct time choices, capacity steppers and progressive details.
- A deterministic state model powers all screens: discovery, seat capacity, readiness, sample travel eligibility, expiry, chat, evidence, rewards and equipment.
- Searches stay exact. Total available time includes the remaining wait plus expected activity duration. Filters never silently expand.
- One active group, fixed-format minimums and release/cancellation behavior are enforced locally.
- All arbitrary chat and note text is escaped. Stranger replies, attendance and connected AI are never fabricated as real.
- Character customization and earned wearables persist locally. The collection never determines admission, skill, safety or human worth.

## Code map

| File | Responsibility |
|---|---|
| `index.html` | Semantic application shell and CSP |
| `v4-core.js` | Fixtures, reducer, state validation, reachability, evidence and award rules |
| `v4-art.js` | Original vector icons, ceramic characters, collectible objects, illustrated sample places |
| `v4.css` | Responsive design system, direct controls, sheets, chat, collection and reduced motion |
| `v4-app.js` | Screen rendering, event delegation, local storage, dialogs, guide, keepsake export |
| `test-core.js` | 52 executable core invariants; run `node test-core.js` |

The core is separated from presentation so a later backend can replace local authority rather than trusting browser claims. This prototype does not implement that backend.

## Validation and limits

The release passed **52 core invariant checks** and **48 Chromium interaction/layout checks** in the authoring environment. The five uploaded app-file Git blob hashes match the tested local source byte-for-byte. Core tests and syntax checks also run in the repository's V4 prototype checks workflow.

Browser checks exercised the exact standalone document via Playwright `set_content`, not a hosted origin: the managed browser rejected file, localhost and public URL navigation with `ERR_BLOCKED_BY_ADMINISTRATOR`. Widths 320, 360, 390, 430, 768, 1024 and 1440 were checked for horizontal overflow. Keyboard dialog behavior, search/picker focus, chat escaping, the complete reward flow, exports and expiry were exercised. This is not physical-device, screen-reader, public-host, cross-browser, performance or security certification.

GitHub Pages requires an enabled Pages publishing source. A repository commit or successful core-test workflow is not evidence of a successful Pages deployment. A raw.githack preview is a third-party view of public GitHub source, not GitHub Pages or a production service.

## Explicit non-features

No real accounts, multiuser transactions, authenticated attendance, live routing, actual location collection, venue reservations, real message delivery, connected AI model, push delivery, payments or staffed moderation. Demo peer controls are intentionally exposed and cannot be used as production verification. Local storage is editable by its owner and has no authority over real-world claims.

Before a live pilot: implement server-authoritative capacity and plan versions, account/witness authorization, trusted time, real venue operations, block/report enforcement, operational moderation, consent and retention policies, corrections/appeals, notification failure handling, real devices and accessibility testing. No amount of prototype polish replaces these gates.

Only `Vitalisrx/round-prototype` is in scope. Other repositories are unrelated.
