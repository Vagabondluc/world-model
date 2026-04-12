import fs from "node:fs";
import path from "node:path";

const distDir = path.resolve(process.cwd(), "dist");
const mainHtml = path.join(distDir, "index.html");
const dashboardHtml = path.join(distDir, "dashboard.html");

const missing = [mainHtml, dashboardHtml].filter((p) => !fs.existsSync(p));
if (missing.length) {
  console.error("Missing build artifacts:");
  for (const file of missing) console.error(` - ${file}`);
  process.exit(1);
}

const mainContent = fs.readFileSync(mainHtml, "utf8");
const dashboardContent = fs.readFileSync(dashboardHtml, "utf8");

if (mainContent === dashboardContent) {
  console.error("index.html and dashboard.html are identical; expected distinct entry outputs.");
  process.exit(1);
}

if (!/assets\/main-[^"]+\.js/.test(mainContent)) {
  console.error("index.html does not reference main entry bundle (assets/main-*.js).");
  process.exit(1);
}

if (!/assets\/dashboard-[^"]+\.js/.test(dashboardContent)) {
  console.error("dashboard.html does not reference dashboard entry bundle (assets/dashboard-*.js).");
  process.exit(1);
}

console.log("Build entry artifacts verified:");
console.log(` - ${mainHtml}`);
console.log(` - ${dashboardHtml}`);
