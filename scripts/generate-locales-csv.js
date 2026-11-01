/**
 * Regenerates content/locales-seed.csv from the section JSON files.
 * Usage: npm run generate:locales-csv
 */
const fs = require("fs");
const path = require("path");

const root = path.join(__dirname, "..");
const data = path.join(root, "src/data");
const outPath = path.join(root, "content/locales-seed.csv");

function read(name) {
  return JSON.parse(fs.readFileSync(path.join(data, name), "utf8"));
}

function copyFor(file, lang) {
  const copy = file && file.copy && file.copy[lang];
  return copy && typeof copy === "object" ? copy : {};
}

const hero = read("hero.json");
const about = read("about.json");
const portfolio = read("portfolio.json");
const contact = read("contact.json");
const promo = read("promo.json");
const nav = read("nav.json");
const packagesFile = read("packages.json");

function bundle(lang) {
  const flat = {
    ...copyFor(nav, lang),
    ...copyFor(hero, lang),
    ...copyFor(about, lang),
    ...copyFor(portfolio, lang),
    ...copyFor(contact, lang),
    ...copyFor(promo, lang),
    ...(packagesFile.includes && packagesFile.includes[lang]
      ? Object.fromEntries(
          Object.entries(packagesFile.includes[lang]).map(([key, value]) => [
            `packages_description.${key}`,
            value == null ? "" : String(value),
          ])
        )
      : {}),
  };

  (packagesFile.packages || []).forEach((pkg) => {
    const side = pkg.copy && pkg.copy[lang];
    if (!side) return;
    const titleKey =
      pkg.id === "gift_card"
        ? "packages_description.gift_card"
        : `packages_description.session_${pkg.id}`;
    flat[titleKey] = side.title || "";
    flat[`packages_description.desc_${pkg.id}`] = side.description || "";
  });

  return flat;
}

function csvEscape(value) {
  const s = String(value).replace(/\r\n/g, "\n");
  if (/[",\n]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
  return s;
}

const es = bundle("es");
const en = bundle("en");
const keys = [...new Set([...Object.keys(es), ...Object.keys(en)])].sort();
const rows = ["key,es,en"];
for (const key of keys) {
  rows.push([key, csvEscape(es[key] ?? ""), csvEscape(en[key] ?? "")].join(","));
}

fs.mkdirSync(path.dirname(outPath), { recursive: true });
fs.writeFileSync(outPath, rows.join("\n") + "\n");
console.log(`Wrote ${keys.length} rows to ${path.relative(root, outPath)}`);
