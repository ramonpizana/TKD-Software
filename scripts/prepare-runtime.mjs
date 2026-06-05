import { mkdirSync } from "node:fs";
import path from "node:path";

const cacheDirFlagIndex = process.argv.indexOf("--cache-dir");
const cacheDirFromArg =
  cacheDirFlagIndex >= 0 ? process.argv[cacheDirFlagIndex + 1] : undefined;
const runtimeTempDir = path.join(process.cwd(), "node_modules", ".vite-temp");
const viteCacheDir = cacheDirFromArg
  ? path.resolve(process.cwd(), cacheDirFromArg)
  : process.env.TKD_VITE_CACHE_DIR
    ? path.resolve(process.cwd(), process.env.TKD_VITE_CACHE_DIR)
  : path.join(runtimeTempDir, "vite-cache");

mkdirSync(runtimeTempDir, { recursive: true });
mkdirSync(viteCacheDir, { recursive: true });

console.log(`Prepared runtime temp directory: ${runtimeTempDir}`);
console.log(`Prepared Vite cache directory: ${viteCacheDir}`);

