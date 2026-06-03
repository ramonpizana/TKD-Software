import { execFileSync } from "node:child_process";
import { existsSync } from "node:fs";
import os from "node:os";
import path from "node:path";

function getPathEntries(currentPath = process.env.PATH ?? "") {
  return currentPath
    .split(path.delimiter)
    .map((entry) => entry.trim())
    .filter((entry) => entry.length > 0);
}

export function getWindowsCargoBin() {
  return path.join(os.homedir(), ".cargo", "bin");
}

export function withDesktopToolchainEnv(baseEnv = process.env) {
  const env = { ...baseEnv };
  const isWindows = process.platform === "win32";
  const cargoBin = getWindowsCargoBin();
  const cargoBinExists = isWindows && existsSync(cargoBin);
  const pathEntries = getPathEntries(env.PATH);
  const hasCargoBinOnPath = pathEntries.some(
    (entry) => entry.toLowerCase() === cargoBin.toLowerCase()
  );

  if (cargoBinExists && !hasCargoBinOnPath) {
    env.PATH = [cargoBin, ...pathEntries].join(path.delimiter);
  }

  return {
    env,
    cargoBin,
    cargoBinExists,
    pathAugmented: cargoBinExists && !hasCargoBinOnPath
  };
}

export function readCommandOutput(command, args = ["--version"], env = process.env) {
  try {
    return execFileSync(command, args, {
      encoding: "utf8",
      env,
      stdio: ["ignore", "pipe", "ignore"]
    }).trim();
  } catch {
    return null;
  }
}
