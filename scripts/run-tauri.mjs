import { execFileSync } from "node:child_process";
import { withDesktopToolchainEnv } from "./desktop-runtime.mjs";

const args = process.argv.slice(2);
const desktopRuntime = withDesktopToolchainEnv();

try {
  execFileSync(process.execPath, ["./node_modules/@tauri-apps/cli/tauri.js", ...args], {
    env: desktopRuntime.env,
    stdio: "inherit"
  });
} catch (error) {
  process.exit(error.status ?? 1);
}
