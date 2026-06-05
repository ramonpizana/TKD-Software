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
  const cargoTargetDir = isWindows
    ? path.join(os.homedir(), "AppData", "Local", "tkd-software-target")
    : path.join(process.cwd(), ".cargo-target");
  const cargoBinExists = isWindows && existsSync(cargoBin);
  const pathEntries = getPathEntries(env.PATH);
  const hasCargoBinOnPath = pathEntries.some(
    (entry) => entry.toLowerCase() === cargoBin.toLowerCase()
  );

  if (cargoBinExists && !hasCargoBinOnPath) {
    env.PATH = [cargoBin, ...pathEntries].join(path.delimiter);
  }

  if (!env.CARGO_TARGET_DIR) {
    env.CARGO_TARGET_DIR = cargoTargetDir;
  }

  return {
    env,
    cargoBin,
    cargoBinExists,
    cargoTargetDir,
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

export function stopWindowsDesktopHostProcesses(processName, executableRootPath) {
  if (process.platform !== "win32" || !processName || !executableRootPath) {
    return;
  }

  const escapedRootPath = executableRootPath.replace(/'/g, "''");
  const escapedProcessName = processName.replace(/'/g, "''");

  const script = [
    `$root = '${escapedRootPath}'`,
    `$name = '${escapedProcessName}'`,
    "Get-CimInstance Win32_Process -Filter \"Name = '$($name)'\" |",
    "Where-Object { $_.ExecutablePath -and $_.ExecutablePath.StartsWith($root, [System.StringComparison]::OrdinalIgnoreCase) } |",
    "ForEach-Object { Stop-Process -Id $_.ProcessId -Force }"
  ].join(" ");

  try {
    execFileSync("powershell.exe", ["-NoProfile", "-Command", script], {
      stdio: ["ignore", "ignore", "ignore"]
    });
  } catch {
    // Best-effort cleanup only.
  }
}

export function getDesktopArtifactPaths(cargoTargetDir) {
  const releaseDir = path.join(cargoTargetDir, "release");

  return {
    cargoTargetDir,
    nsisBundleDir: path.join(releaseDir, "bundle", "nsis"),
    releaseBinaryPath: path.join(releaseDir, "tkd-software.exe")
  };
}
