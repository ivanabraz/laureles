/**
 * Regenerates content/locales-seed.csv from public/locales/{es,en}/global.json
 * Usage: npm run generate:locales-csv
 */
const fs = require("fs");
const path = require("path");

const root = path.join(__dirname, "..");
const esPath = path.join(root, "public/locales/es/global.json");
const enPath = path.join(root, "public/locales/en/global.json");
const outPath = path.join(root, "content/locales-seed.csv");

const es = JSON.parse(fs.readFileSync(esPath, "utf8")).global;
const en = JSON.parse(fs.readFileSync(enPath, "utf8")).global;

function flatten(obj, prefix = "", out = {}) {
  for (const [k, v] of Object.entries(obj)) {
    const key = prefix ? `${prefix}.${k}` : k;
    if (v !== null && typeof v === "object" && !Array.isArray(v)) {
      flatten(v, key, out);
    } else {
      out[key] = v == null ? "" : String(v);
    }
  }
  return out;
}

function csvEscape(value) {
  const s = String(value).replace(/\r\n/g, "\n");
  if (/[",\n]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
  return s;
}

const flatEs = flatten(es);
const flatEn = flatten(en);
const keys = [...new Set([...Object.keys(flatEs), ...Object.keys(flatEn)])].sort();

const rows = ["key,es,en"];
for (const key of keys) {
  rows.push(
    [key, csvEscape(flatEs[key] ?? ""), csvEscape(flatEn[key] ?? "")].join(",")
  );
}

fs.mkdirSync(path.dirname(outPath), { recursive: true });
fs.writeFileSync(outPath, rows.join("\n") + "\n");
console.log(`Wrote ${keys.length} rows to ${path.relative(root, outPath)}`);
