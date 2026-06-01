import { ringSnapshotSchema, type RingSnapshot } from "./schemas";

const STORAGE_KEY = "tkd-software:ring-foundation:v1";

export function loadSnapshot(fallback: RingSnapshot): RingSnapshot {
  if (typeof window === "undefined") {
    return fallback;
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);

    if (!raw) {
      return fallback;
    }

    const parsed = ringSnapshotSchema.safeParse(JSON.parse(raw));
    return parsed.success ? parsed.data : fallback;
  } catch {
    return fallback;
  }
}

export function saveSnapshot(snapshot: RingSnapshot): void {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(snapshot));
}

