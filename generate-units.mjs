#!/usr/bin/env node
/*
 * generate-units.mjs — build public unit pages from units/data/<id>.json.
 *
 *   node generate-units.mjs                 build all PUBLISHED units + index
 *   node generate-units.mjs --force-draft EXAMPLE   also build a DRAFT unit (local test only)
 *
 * Refuses to build a PUBLISHED unit unless the scrub + permission flags are true
 * and the media gate is met (>=3 photos on disk, video, price per visibility).
 * The data file is the PUBLIC rendering: internal fields (dealer, source URL,
 * floor/target price, VIN, plate) must not exist in it at all — the generator
 * rejects them by key.
 */
import { readFileSync, writeFileSync, readdirSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = dirname(fileURLToPath(import.meta.url));
// DOMAIN (operator decision 2026-08-01): charwatransport.com preferred — it matches
// the social-media handles. Until the domain is bought + DNS'd, pages build against
// charwa.de but NO link goes out to followers (shared links are permanent).
// When bought: flip BASE_URL, swap the CNAME file, regenerate.
const BASE_URL = "https://charwa.de";

// WA CTA (operator decision 2026-08-01): the future Meta WABA business number, so
// enquiries enter the wa_inbound queue -> CRM. Blocked on Meta verification.
// The ops number below is a build placeholder — swap BEFORE the first real share.
const WA_NUMBER = "491604940999"; // PLACEHOLDER — replace with WABA number
const PHONE = "+491604940999";

const UNITS = join(ROOT, "units");
const DATA = join(UNITS, "data");
const TEMPLATE = readFileSync(join(UNITS, "_template.html"), "utf8");

const FORBIDDEN_KEYS = new Set([
  "floorPrice", "floor_price", "targetPrice", "target_price", "dealerAsk",
  "dealer_ask", "purchasePrice", "purchase_price", "margin", "supplier",
  "dealer", "source_url", "sourceUrl", "listing_url", "vin", "plate", "city", "yard",
]);

const VERIFIED_SOURCES = new Set(["media_verified", "call_verified", "registry_verified", "onsite"]);

const COUNTRIES = {
  NL: { en: "Netherlands", ru: "Нидерланды" },
  DE: { en: "Germany", ru: "Германия" },
  PL: { en: "Poland", ru: "Польша" },
  BE: { en: "Belgium", ru: "Бельгия" },
  FR: { en: "France", ru: "Франция" },
  CZ: { en: "Czech Republic", ru: "Чехия" },
  LT: { en: "Lithuania", ru: "Литва" },
};

const I18N = {
  ru: {
    photos: "Фото", video: "Видео", unitNo: "Номер",
    kEz: "Первая регистрация", kKm: "Пробег", kGearbox: "КПП",
    kRetarder: "Ретардер", kEuro: "Экологический класс", kAxles: "Колёсная формула",
    valueYes: "Да", valueNo: "Нет", valueAutomatic: "Автомат", valueManual: "Механика",
    priceTitle: "Цена", priceBasis: "нетто, без НДС (MwSt.) — экспорт",
    priceOnRequest: "Цена по запросу",
    factsTitle: "Проверенные данные", srcVerified: "Проверено", srcStated: "Со слов продавца",
    specTitle: "Характеристики", locationTitle: "Местонахождение", notesTitle: "Условия",
    note1: "Все цены нетто, без НДС (MwSt.) — экспорт.",
    note2: "Экспортные документы (EX/T2, 0% НДС) оформляет Charwa GmbH, Берлин.",
    note3: "Осмотр на месте (DEKRA или независимый эксперт) возможен до полной оплаты.",
    note4: "Доставка до места назначения организуется по запросу.",
    note5: "Предложение действительно при наличии; возможны изменения.",
    ctaWa: "Написать в WhatsApp", ctaCall: "Позвонить",
  },
  en: {
    photos: "Photos", video: "Video", unitNo: "No.",
    kEz: "First registration", kKm: "Mileage", kGearbox: "Gearbox",
    kRetarder: "Retarder", kEuro: "Emission class", kAxles: "Axle configuration",
    valueYes: "Yes", valueNo: "No", valueAutomatic: "Automatic", valueManual: "Manual",
    priceTitle: "Price", priceBasis: "netto, excl. MwSt. (VAT) — export",
    priceOnRequest: "Price on request",
    factsTitle: "Verified facts", srcVerified: "Verified", srcStated: "Seller stated",
    specTitle: "Specification", locationTitle: "Location", notesTitle: "Terms",
    note1: "All prices are netto, excl. MwSt. (VAT) — export.",
    note2: "Export documents (EX/T2, 0% VAT) are prepared by Charwa GmbH, Berlin.",
    note3: "On-site inspection (DEKRA or an independent expert) is permitted before final payment.",
    note4: "Delivery to destination is organized on request.",
    note5: "Offer subject to prior sale, errors and availability.",
    ctaWa: "Message on WhatsApp", ctaCall: "Call",
  },
};

const esc = (s) =>
  String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const deNum = (n) => Number(n).toLocaleString("de-DE");

function scanForbidden(obj, path = "") {
  if (Array.isArray(obj)) { obj.forEach((v, i) => scanForbidden(v, `${path}[${i}]`)); return; }
  if (obj && typeof obj === "object") {
    for (const [k, v] of Object.entries(obj)) {
      if (FORBIDDEN_KEYS.has(k)) throw new Error(`forbidden internal field "${path}${path ? "." : ""}${k}" — the unit JSON is the PUBLIC rendering; internal facts stay in the CRM/deal folder`);
      scanForbidden(v, `${path}${path ? "." : ""}${k}`);
    }
  }
}

function validate(u, id) {
  scanForbidden(u);
  const fail = (m) => { throw new Error(`${id}: ${m}`); };
  if (u.status !== "PUBLISHED") return; // DRAFT etc. validated only on forced build
  if (!u.flags?.photos_scrubbed_ok) fail("photos_scrubbed_ok is not true — human scrub gate (signage/watermark/plate/price-card check) must pass first");
  if (!u.flags?.dealer_permission_asked) fail("dealer_permission_asked is not true — reproduction right is the dealer's; ask before publishing their media");
  const photos = u.media?.photos ?? [];
  if (photos.length < 3) fail(`media gate: ${photos.length} photos < 3`);
  if (!u.media?.video_youtube) fail("media gate: video_youtube missing");
  for (const p of photos) if (!existsSync(join(ROOT, p))) fail(`photo not on disk: ${p}`);
  const vis = u.price?.visibility ?? "PUBLIC";
  if (vis === "PUBLIC" && !(u.price?.list > 0)) fail("visibility PUBLIC but price.list missing — nothing publishes without a price");
  if (vis === "ON_REQUEST" && u.price?.list) fail("visibility ON_REQUEST must not carry price.list in the public JSON");
}

function factTiles(u) {
  const tile = (labelKey, valueHtml) =>
    `                <div class="u-tile"><span class="u-tile__label" data-k="${labelKey}"></span><span class="u-tile__value">${valueHtml}</span></div>`;
  const k = (key) => `<span data-k="${key}"></span>`;
  return [
    tile("kEz", esc(u.first_reg ?? u.year)),
    tile("kKm", `${deNum(u.km)} km`),
    tile("kGearbox", u.gearbox === "automatic" ? k("valueAutomatic") : u.gearbox === "manual" ? k("valueManual") : esc(u.gearbox ?? "—")),
    tile("kRetarder", u.retarder ? k("valueYes") : k("valueNo")),
    tile("kEuro", esc(u.euro ?? "—")),
    tile("kAxles", esc(u.axle_config ?? "—")),
  ].join("\n");
}

function priceBlock(u) {
  const vis = u.price?.visibility ?? "PUBLIC";
  if (vis !== "PUBLIC")
    return `            <div class="u-price u-price--request" style="padding:0"><span class="u-price__eyebrow" data-k="priceTitle"></span><div class="u-price__value" data-k="priceOnRequest"></div></div>`;
  return [
    `            <span class="u-price__eyebrow" data-k="priceTitle"></span>`,
    `            <div class="u-price__value"><span class="u-price__cur">${esc(u.price.currency ?? "EUR")}</span>${deNum(u.price.list)}</div>`,
    `            <div class="u-price__basis" data-k="priceBasis"></div>`,
  ].join("\n");
}

function verifiedRows(u) {
  return (u.facts ?? []).map((f) => {
    const verified = VERIFIED_SOURCES.has(f.source);
    const badge = `<span class="u-src u-src--${verified ? "verified" : "stated"}" data-k="${verified ? "srcVerified" : "srcStated"}"></span>`;
    const label = `<span data-lang="ru">${esc(f.label_ru)}</span><span data-lang="en">${esc(f.label_en)}</span>`;
    return `                    <tr><td>${label}</td><td class="u-num">${esc(f.value)}${badge}</td></tr>`;
  }).join("\n");
}

function conditionComment(u) {
  if (!u.condition_comment_en && !u.condition_comment_ru) return "";
  return `            <div class="u-comment"><span data-lang="ru">${esc(u.condition_comment_ru ?? "")}</span><span data-lang="en">${esc(u.condition_comment_en ?? "")}</span></div>`;
}

function specSection(u) {
  const groups = Object.entries(u.spec ?? {}).filter(([, kv]) => kv && Object.keys(kv).length);
  if (!groups.length) return "";
  const parts = groups.map(([name, kv]) => {
    const rows = Object.entries(kv)
      .filter(([, v]) => v !== null && v !== "" && v !== undefined)
      .map(([label, v]) => `                    <tr><td>${esc(label)}</td><td class="u-num">${v === true ? "Yes" : esc(v)}</td></tr>`)
      .join("\n");
    return `            <div class="u-spec-group"><h3>${esc(name)}</h3><table class="u-table"><tbody>\n${rows}\n                </tbody></table></div>`;
  });
  return `        <section class="u-block">\n            <h2 class="u-eyebrow" data-k="specTitle"></h2>\n${parts.join("\n")}\n        </section>`;
}

function render(u) {
  const id = u.id;
  const title = `${u.make} ${u.model} · ${u.year}`;
  const photos = u.media.photos;
  const country = COUNTRIES[u.location_country] ?? { en: u.location_country, ru: u.location_country };
  const pageUrl = `${BASE_URL}/units/${id}.html`;
  const ogImage = `${BASE_URL}/${photos[0]}`;
  const pub = (u.price?.visibility ?? "PUBLIC") === "PUBLIC";
  const priceLine = pub ? `EUR ${deNum(u.price.list)} netto` : "Цена по запросу / Price on request";
  const ogDesc = [priceLine, `${deNum(u.km)} km`, u.euro, u.retarder ? "Retarder" : null, `Экспорт из ЕС — доставка организуется · EU export, delivery arranged`]
    .filter(Boolean).join(" · ");
  const waText = encodeURIComponent(`Unit ${id} — ${u.make} ${u.model} (${u.year})`);

  const jsonld = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: title,
    sku: id,
    image: photos.map((p) => `${BASE_URL}/${p}`),
    brand: { "@type": "Brand", name: u.make },
    ...(pub && {
      offers: {
        "@type": "Offer", price: u.price.list, priceCurrency: u.price.currency ?? "EUR",
        availability: "https://schema.org/InStock",
        seller: { "@type": "Organization", name: "Charwa GmbH" },
      },
    }),
  };

  const gallery = photos.map((p, i) =>
    `                <img src="../${p}" alt="${esc(title)} — ${i + 1}"${i ? ' loading="lazy"' : ""}>`).join("\n");
  const video = u.media.video_youtube
    ? `                <a class="u-gallery__video" href="${esc(u.media.video_youtube)}" target="_blank" rel="noopener" data-k="video"></a>` : "";

  return TEMPLATE
    .replaceAll("{{PAGE_TITLE}}", esc(`${title} — Charwa`))
    .replaceAll("{{META_DESC}}", esc(ogDesc))
    .replaceAll("{{OG_TITLE}}", esc(`${title} · ${deNum(u.km)} km`))
    .replaceAll("{{OG_DESC}}", esc(ogDesc))
    .replaceAll("{{OG_URL}}", esc(pageUrl))
    .replaceAll("{{OG_IMAGE}}", esc(ogImage))
    .replaceAll("{{JSONLD}}", JSON.stringify(jsonld))
    .replaceAll("{{TITLE}}", esc(title))
    .replaceAll("{{ID}}", esc(id))
    .replaceAll("{{GALLERY_ITEMS}}", gallery)
    .replaceAll("{{PHOTO_COUNT}}", String(photos.length))
    .replaceAll("{{VIDEO_LINK}}", video)
    .replaceAll("{{FACT_TILES}}", factTiles(u))
    .replaceAll("{{PRICE_BLOCK}}", priceBlock(u))
    .replaceAll("{{VERIFIED_FACTS_ROWS}}", verifiedRows(u))
    .replaceAll("{{CONDITION_COMMENT}}", conditionComment(u))
    .replaceAll("{{SPEC_SECTION}}", specSection(u))
    .replaceAll("{{LOCATION_NAME_RU}}", esc(country.ru))
    .replaceAll("{{LOCATION_NAME_EN}}", esc(country.en))
    .replaceAll("{{WA_LINK}}", `https://wa.me/${WA_NUMBER}?text=${waText}`)
    .replaceAll("{{TEL_LINK}}", PHONE)
    .replaceAll("{{I18N_JSON}}", JSON.stringify(I18N));
}

// 5-line English caption pack for the outsourced posting agent (all platforms).
// Only public-JSON data — captions can't leak what the JSON doesn't hold.
// km rounded to the nearest 10k: reads cleaner AND breaks reverse-search
// matching against the source ad's exact figure.
function caption(u, pageUrl) {
  const kmRounded = Math.round(u.km / 10000) * 10000;
  const enNum = (n) => Number(n).toLocaleString("en-US");
  const gearbox = u.gearbox === "automatic" ? "Automatic" : u.gearbox === "manual" ? "Manual" : u.gearbox;
  const country = (COUNTRIES[u.location_country] ?? { en: u.location_country }).en;
  const pub = (u.price?.visibility ?? "PUBLIC") === "PUBLIC";
  return [
    `${u.make} ${u.model} · ${u.year}`,
    [`~${enNum(kmRounded)} km`, gearbox, u.retarder ? "Retarder" : null].filter(Boolean).join(" · "),
    [u.euro, u.axle_config, country].filter(Boolean).join(" · "),
    pub ? `EUR ${enNum(u.price.list)} net — EU export documents handled`
        : "Price on request — EU export documents handled",
    pageUrl,
  ].join("\n") + "\n";
}

function buildIndex(units) {
  const rows = units.map((u) => {
    const pub = (u.price?.visibility ?? "PUBLIC") === "PUBLIC";
    const price = pub ? `EUR ${deNum(u.price.list)}` : "—";
    return `        <li><a href="${u.id}.html"><strong>${esc(u.make)} ${esc(u.model)}</strong> · ${u.year} · ${deNum(u.km)} km <span>${price}</span></a></li>`;
  }).join("\n");
  return `<!DOCTYPE html>
<html lang="ru">
<head>
<meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Units — Charwa</title><meta name="robots" content="noindex">
<link rel="stylesheet" href="../css/unit.css">
</head>
<body>
<header class="u-band"><div class="u-band__brand"><a class="u-band__wordmark" href="https://charwa.de">CHARWA</a><span class="u-band__tagline">VEHICLE EXPORT TRADING</span></div></header>
<main class="u-main"><section class="u-block"><h2 class="u-eyebrow">Units</h2>
    <ul class="u-index">
${rows}
    </ul>
</section></main>
</body>
</html>
`;
}

// ---- main ----
const args = process.argv.slice(2);
const forceDraft = args.includes("--force-draft") ? args[args.indexOf("--force-draft") + 1] : null;

const built = [];
for (const f of readdirSync(DATA).filter((f) => f.endsWith(".json")).sort()) {
  const u = JSON.parse(readFileSync(join(DATA, f), "utf8"));
  const id = u.id ?? f.replace(/\.json$/, "");
  if (u.status !== "PUBLISHED" && id !== forceDraft) {
    console.log(`skip ${id} (status ${u.status})`);
    continue;
  }
  if (id === forceDraft) u.status = "PUBLISHED"; // run the full gate on forced builds too
  validate(u, id);
  writeFileSync(join(UNITS, `${id}.html`), render(u));
  writeFileSync(join(UNITS, `${id}.caption.txt`), caption(u, `${BASE_URL}/units/${id}.html`));
  console.log(`built units/${id}.html (+ caption)`);
  if (id !== forceDraft) built.push(u);
}
writeFileSync(join(UNITS, "index.html"), buildIndex(built));
console.log(`built units/index.html (${built.length} published)`);
