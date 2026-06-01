import { mkdirSync } from "node:fs";
import path from "node:path";

const runtimeTempDir = path.join(process.cwd(), "node_modules", ".vite-temp");

mkdirSync(runtimeTempDir, { recursive: true });

console.log(`Prepared runtime temp directory: ${runtimeTempDir}`);

