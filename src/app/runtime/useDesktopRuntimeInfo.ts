import { useEffect, useState } from "react";
import { isTauri } from "@tauri-apps/api/core";

export interface DesktopRuntimeInfo {
  appName: string | null;
  appVersion: string | null;
  identifier: string | null;
  shell: "tauri" | "web";
  windowLabel: string | null;
}

const initialRuntimeInfo: DesktopRuntimeInfo = {
  appName: null,
  appVersion: null,
  identifier: null,
  shell: isTauri() ? "tauri" : "web",
  windowLabel: null
};

export function useDesktopRuntimeInfo() {
  const [runtime, setRuntime] = useState<DesktopRuntimeInfo>(initialRuntimeInfo);

  useEffect(() => {
    if (!isTauri()) {
      return;
    }

    let isMounted = true;

    async function loadRuntimeMetadata() {
      const [{ getIdentifier, getName, getVersion }, { getCurrentWindow }] =
        await Promise.all([
          import("@tauri-apps/api/app"),
          import("@tauri-apps/api/window")
        ]);
      const currentWindow = getCurrentWindow();
      const [appName, appVersion, identifier] = await Promise.all([
        getName(),
        getVersion(),
        getIdentifier()
      ]);

      if (!isMounted) {
        return;
      }

      setRuntime({
        appName,
        appVersion,
        identifier,
        shell: "tauri",
        windowLabel: currentWindow.label
      });
    }

    void loadRuntimeMetadata();

    return () => {
      isMounted = false;
    };
  }, []);

  return runtime;
}
