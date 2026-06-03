import { mkdirSync } from "node:fs";
import path from "node:path";

const runtimeTempDir = path.join(process.cwd(), "node_modules", ".vite-temp");
const viteCacheDir = path.join(runtimeTempDir, "vite-cache");

mkdirSync(runtimeTempDir, { recursive: true });
mkdirSync(viteCacheDir, { recursive: true });

console.log(`Prepared runtime temp directory: ${runtimeTempDir}`);
console.log(`Prepared Vite cache directory: ${viteCacheDir}`);

