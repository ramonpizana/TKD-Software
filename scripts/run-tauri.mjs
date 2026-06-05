import { execFileSync } from "node:child_process";
import {
  stopWindowsDesktopHostProcesses,
  withDesktopToolchainEnv
} from "./desktop-runtime.mjs";

const args = process.argv.slice(2);
const desktopRuntime = withDesktopToolchainEnv();
const tauriSubcommand = args[0];

if (tauriSubcommand === "dev" || tauriSubcommand === "build") {
  stopWindowsDesktopHostProcesses(
    "tkd-software.exe",
    desktopRuntime.env.CARGO_TARGET_DIR
  );
}

try {
  execFileSync(process.execPath, ["./node_modules/@tauri-apps/cli/tauri.js", ...args], {
    env: desktopRuntime.env,
    stdio: "inherit"
  });
} catch (error) {
  process.exit(error.status ?? 1);
}
