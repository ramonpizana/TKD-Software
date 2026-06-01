import { execFileSync } from "node:child_process";
import { existsSync } from "node:fs";
import os from "node:os";

function readCommandOutput(command, args = ["--version"]) {
  try {
    return execFileSync(command, args, {
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"]
    }).trim();
  } catch {
    return null;
  }
}

const platform = os.platform();
const nodeVersion = process.version;
const rustcVersion = readCommandOutput("rustc");
const cargoVersion = readCommandOutput("cargo");
const buildToolsMarkerPaths = [
  "C:\\Program Files (x86)\\Microsoft Visual Studio\\Installer\\vswhere.exe",
  "C:\\Program Files\\Microsoft Visual Studio\\Installer\\vswhere.exe"
];
const hasVsWhere = buildToolsMarkerPaths.some((filePath) => existsSync(filePath));

const failures = [];
const advisories = [];

if (platform !== "win32") {
  advisories.push(
    "This desktop target is being prepared as Windows-first. Packaging guidance in this repo assumes Windows."
  );
}

if (Number.parseInt(nodeVersion.slice(1), 10) < 22) {
  failures.push(`Node 22 or newer is required. Current version: ${nodeVersion}`);
}

if (!rustcVersion) {
  failures.push("Rust is missing. Install rustup so `rustc` becomes available.");
}

if (!cargoVersion) {
  failures.push("Cargo is missing. Install rustup so `cargo` becomes available.");
}

if (!hasVsWhere) {
  advisories.push(
    "Visual Studio Build Tools were not detected from the usual installer path. Confirm that 'Desktop development with C++' is installed."
  );
}

advisories.push(
  "WebView2 is usually already present on Windows 10 1803+ and Windows 11. If Tauri later complains about WebView2, install the Evergreen runtime."
);

console.log("TKD-Software desktop doctor");
console.log("---------------------------");
console.log(`Platform: ${platform}`);
console.log(`Node: ${nodeVersion}`);
console.log(`rustc: ${rustcVersion ?? "missing"}`);
console.log(`cargo: ${cargoVersion ?? "missing"}`);
console.log(`VS Build Tools marker: ${hasVsWhere ? "detected" : "not detected"}`);
console.log();

if (advisories.length > 0) {
  console.log("Advisories:");
  for (const advisory of advisories) {
    console.log(`- ${advisory}`);
  }
  console.log();
}

if (failures.length > 0) {
  console.log("Missing prerequisites:");
  for (const failure of failures) {
    console.log(`- ${failure}`);
  }
  console.log();
  console.log(
    "See docs/desktop/windows-setup.md for the step-by-step Windows setup."
  );
  process.exit(1);
}

console.log("Desktop prerequisites look ready for the next Tauri step.");
