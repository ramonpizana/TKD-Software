import { execFileSync } from "node:child_process";

const outDirFlagIndex = process.argv.indexOf("--out-dir");
const requestedOutDir =
  outDirFlagIndex >= 0 ? process.argv[outDirFlagIndex + 1] : undefined;
const outDir = requestedOutDir || process.env.TKD_BUILD_OUT_DIR || "dist";

function runNodeScript(scriptPath, args = []) {
  execFileSync(process.execPath, [scriptPath, ...args], {
    stdio: "inherit"
  });
}

runNodeScript("scripts/clean-dist.mjs", ["--out-dir", outDir]);
runNodeScript("scripts/prepare-runtime.mjs");
runNodeScript("node_modules/typescript/bin/tsc", ["--noEmit"]);
runNodeScript("node_modules/vite/bin/vite.js", [
  "build",
  "--configLoader",
  "runner",
  "--outDir",
  outDir
]);

