import { execFileSync, spawn } from "node:child_process";
import http from "node:http";

const devUrl = new URL("http://127.0.0.1:5173/");
const devHost = devUrl.hostname;
const devPort = Number(devUrl.port);
const tauriCacheDir = "node_modules/.vite-temp/vite-cache-tauri";

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function isDevServerReachable() {
  return new Promise((resolve) => {
    const request = http.get(devUrl, (response) => {
      response.resume();
      resolve((response.statusCode ?? 500) < 500);
    });

    request.on("error", () => resolve(false));
    request.setTimeout(1200, () => {
      request.destroy();
      resolve(false);
    });
  });
}

function getListeningPids() {
  if (process.platform === "win32") {
    try {
      const output = execFileSync(
        "powershell.exe",
        [
          "-NoProfile",
          "-Command",
          `Get-NetTCPConnection -LocalAddress ${devHost} -LocalPort ${devPort} -State Listen -ErrorAction SilentlyContinue | Select-Object -ExpandProperty OwningProcess | Sort-Object -Unique`
        ],
        { encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] }
      );

      return output
        .split(/\r?\n/)
        .map((value) => Number.parseInt(value.trim(), 10))
        .filter((value) => Number.isInteger(value) && value > 0);
    } catch {
      return [];
    }
  }

  return [];
}

function terminatePids(pids) {
  for (const pid of pids) {
    if (pid === process.pid) {
      continue;
    }

    try {
      if (process.platform === "win32") {
        execFileSync("taskkill", ["/PID", String(pid), "/T", "/F"], {
          stdio: ["ignore", "ignore", "ignore"]
        });
      } else {
        process.kill(pid, "SIGTERM");
      }
    } catch {
      // Ignore failures here; the follow-up reachability probe is authoritative.
    }
  }
}

if (await isDevServerReachable()) {
  console.log(`Using existing Vite server at ${devUrl.href}`);
  process.exit(0);
}

const listeningPids = getListeningPids();

if (listeningPids.length > 0) {
  console.log(
    `Port ${devPort} is occupied by a non-responsive process (${listeningPids.join(", ")}). Restarting the Vite dev server.`
  );
  terminatePids(listeningPids);
  await sleep(900);

  if (await isDevServerReachable()) {
    console.log(`Recovered existing Vite server at ${devUrl.href}`);
    process.exit(0);
  }
}

const child = spawn(
  process.execPath,
  ["scripts/start-vite-dev.mjs", "--cache-dir", tauriCacheDir],
  {
    env: process.env,
    shell: false,
    stdio: "inherit"
  }
);

child.on("exit", (code) => {
  process.exit(code ?? 0);
});
