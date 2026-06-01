import { execFileSync } from "node:child_process";

function runNodeScript(scriptPath, args = []) {
  execFileSync(process.execPath, [scriptPath, ...args], {
    stdio: "inherit"
  });
}

runNodeScript("scripts/clean-dist.mjs");
runNodeScript("scripts/prepare-runtime.mjs");
runNodeScript("node_modules/typescript/bin/tsc", ["--noEmit"]);
runNodeScript("node_modules/vite/bin/vite.js", ["build", "--configLoader", "runner"]);

