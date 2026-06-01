import { execFileSync } from "node:child_process";
import { rmSync } from "node:fs";
import path from "node:path";

const distDir = path.join(process.cwd(), "dist");

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
