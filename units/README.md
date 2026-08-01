# units/ — public vehicle-details pages (the advertise page)

Mobile-first, share-ready page per unit — the link WhatsApp / Instagram / TikTok
posts point at. Design vendored from the **"Charwa Design System"** claude.ai
project (navy structure, green reserved for money, no icons, system fonts,
`EUR 24.500` German number convention). Deliberately does NOT use the site's
`css/style.css` — two design systems must not blend; unit pages are standalone
(`css/unit.css`). Languages: RU (default) + EN, client-side toggle.

Plan + decisions: `charwa_ai_assistant/docs/plan-advertise-page.md` (PR #155 there).

## Publish a unit

1. Copy `data/EXAMPLE.json` → `data/U-<seq>.json`; fill it. **Never guess — an
   empty field is a correct field.** Internal facts (dealer, source URL, VIN,
   plate, floor/target price, margin) must not appear in this file at all — the
   generator rejects the keys; the file IS the public rendering.
2. Photos: pick + downscale (~1600px, quality ~80) into `img/units/U-<seq>/`,
   e.g. `sips -Z 1600 *.jpg --out .`. First photo = OG card image (WhatsApp
   unfurl) — choose the best 4:3-ish shot.
3. **Scrub check (human, mandatory)** — every photo AND the video:
   - no dealer signage, yard boards, or building identifiers
   - no watermarks / marketplace overlays
   - no license plates readable
   - no windscreen price cards
   - no documents, screens, or paperwork in frame
   - condition text mentions no dealer/city
   Then set `"photos_scrubbed_ok": true`.
4. Dealer said yes to "can I show this to my buyers?" → set
   `"dealer_permission_asked": true`. (Their photos, their reproduction right.)
5. Set `"status": "PUBLISHED"` and run `node generate-units.mjs`. The generator
   refuses unless: both flags true, ≥3 photos on disk, video link present, and
   price consistent with `visibility` (PUBLIC needs `list`; ON_REQUEST must omit
   it — the floor/target prices live in the CRM, never here).
6. Commit `units/U-<seq>.html` + data + images, push. Page:
   `https://charwa.de/units/U-<seq>.html`. Share that link.

`node generate-units.mjs --force-draft <ID>` builds a DRAFT locally (full gates
still run); forced builds are excluded from `units/index.html` and
`units/EXAMPLE.html` is gitignored.

## Field notes

- `facts[]` — the verified-facts block. `source` ∈ `media_verified` /
  `call_verified` / `registry_verified` / `onsite` (renders **Verified**) or
  `seller_stated` / `listing` (renders **Seller stated** — never shows as
  verified, by design). TÜV date, known damage (disclose, don't hide), keys, km
  source belong here. `value` is shown as-is in both languages — keep it
  language-neutral (dates, numbers, "None disclosed").
- `spec` — grouped table, operator-written English labels (untranslated by the
  RU toggle; keep labels short). Empty/null values don't render.
- `location_country` — ISO code, country granularity ONLY (a city + one yard
  photo identifies the dealer).
- Moving domains later (e.g. charwatransport.com): flip `BASE_URL` in
  `generate-units.mjs`, regenerate, done.
