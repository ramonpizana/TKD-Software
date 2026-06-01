import { execFileSync } from "node:child_process";

function runNodeScript(scriptPath, args = []) {
  execFileSync(process.execPath, [scriptPath, ...args], {
    stdio: "inherit"
  });
}

runNodeScript("node_modules/eslint/bin/eslint.js", ["."]);
runNodeScript("node_modules/typescript/bin/tsc", ["--noEmit"]);
runNodeScript("node_modules/vitest/vitest.mjs", ["run", "--configLoader", "runner"]);
runNodeScript("scripts/build.mjs");
runNodeScript("scripts/validate-repo.mjs");

