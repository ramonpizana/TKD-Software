import { execFileSync } from "node:child_process";

function runNodeScript(scriptPath, args = []) {
  execFileSync(process.execPath, [scriptPath, ...args], {
    stdio: "inherit"
  });
}

runNodeScript("scripts/check-desktop-prereqs.mjs");
runNodeScript("scripts/build.mjs", ["--out-dir", "dist-desktop"]);
runNodeScript("scripts/run-tauri.mjs", ["build"]);
