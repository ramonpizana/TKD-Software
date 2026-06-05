import { existsSync, readdirSync, statSync } from "node:fs";
import path from "node:path";
import {
  getDesktopArtifactPaths,
  withDesktopToolchainEnv
} from "./desktop-runtime.mjs";

const desktopRuntime = withDesktopToolchainEnv();
const artifactPaths = getDesktopArtifactPaths(desktopRuntime.env.CARGO_TARGET_DIR);

function getNewestInstaller(directoryPath) {
  if (!existsSync(directoryPath)) {
    return null;
  }

  const candidates = readdirSync(directoryPath)
    .filter((entry) => entry.toLowerCase().endsWith(".exe"))
    .map((entry) => path.join(directoryPath, entry))
    .map((filePath) => ({
      filePath,
      stats: statSync(filePath)
    }))
    .sort((left, right) => right.stats.mtimeMs - left.stats.mtimeMs);

  return candidates[0]?.filePath ?? null;
}

const newestInstaller = getNewestInstaller(artifactPaths.nsisBundleDir);

console.log("TKD-Software desktop artifacts");
console.log("------------------------------");
console.log(`Cargo target dir: ${artifactPaths.cargoTargetDir}`);
console.log(`NSIS bundle dir: ${artifactPaths.nsisBundleDir}`);
console.log(`Release binary path: ${artifactPaths.releaseBinaryPath}`);
console.log(`Latest installer: ${newestInstaller ?? "not found yet"}`);
