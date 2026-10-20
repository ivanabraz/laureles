/**
 * GitHub Pages serves 404.html for unknown paths.
 * Copy index.html → 404.html so client-side routes (/admin, /portfolio, …) work.
 */
const fs = require("fs");
const path = require("path");

const buildDir = path.join(__dirname, "..", "build");
const indexFile = path.join(buildDir, "index.html");
const notFoundFile = path.join(buildDir, "404.html");

if (!fs.existsSync(indexFile)) {
  console.warn("spa-github-pages: build/index.html not found, skipping.");
  process.exit(0);
}

fs.copyFileSync(indexFile, notFoundFile);
console.log("spa-github-pages: wrote build/404.html");
