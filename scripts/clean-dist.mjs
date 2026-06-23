import { execFileSync } from "node:child_process";
import { rmSync } from "node:fs";
import path from "node:path";

const outDirFlagIndex = process.argv.indexOf("--out-dir");
const requestedOutDir =
  outDirFlagIndex >= 0 ? process.argv[outDirFlagIndex + 1] : undefined;
const distDir = path.join(
  process.cwd(),
  requestedOutDir || process.env.TKD_BUILD_OUT_DIR || "dist"
);

if (process.platform === "win32") {
  const escapedPath = distDir.replace(/'/g, "''");
  execFileSync(
    "powershell",
    [
      "-NoProfile",
      "-Command",
      `if (Test-Path -LiteralPath '${escapedPath}') { Remove-Item -LiteralPath '${escapedPath}' -Recurse -Force }`
    ],
    { stdio: "pipe" }
  );
} else {
  rmSync(distDir, { recursive: true, force: true });
}

console.log(`Cleaned dist directory: ${distDir}`);
