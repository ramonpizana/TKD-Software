import { execFileSync } from "node:child_process";

const cacheDirFlagIndex = process.argv.indexOf("--cache-dir");
const cacheDirFromArg =
  cacheDirFlagIndex >= 0 ? process.argv[cacheDirFlagIndex + 1] : undefined;
const prepareRuntimeArgs = ["scripts/prepare-runtime.mjs"];
const runtimeEnv = { ...process.env };

if (cacheDirFromArg) {
  prepareRuntimeArgs.push("--cache-dir", cacheDirFromArg);
  runtimeEnv.TKD_VITE_CACHE_DIR = cacheDirFromArg;
}

execFileSync(process.execPath, prepareRuntimeArgs, {
  env: runtimeEnv,
  stdio: "inherit"
});

execFileSync(process.execPath, ["./node_modules/vite/bin/vite.js", "--configLoader", "runner"], {
  env: runtimeEnv,
  stdio: "inherit"
});
