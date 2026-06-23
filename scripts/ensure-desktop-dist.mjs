import { existsSync } from "node:fs";
import path from "node:path";

const desktopDistDir = path.join(process.cwd(), "dist-desktop");
const desktopIndexPath = path.join(desktopDistDir, "index.html");

if (!existsSync(desktopIndexPath)) {
  console.error(
    "Desktop frontend bundle is missing. Run `npm run build:desktop` before packaging the Tauri app."
  );
  process.exit(1);
}

console.log(`Using prebuilt desktop frontend from: ${desktopDistDir}`);
