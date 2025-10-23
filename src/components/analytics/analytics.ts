export type BaseEvent = {
  ts?: string;
  event: string;
  user_id?: string;
  session_id?: string;
  trace_id?: string;
  source?: string;
  page?: string;
  referrer?: string;
  utm_source?: string | null;
  utm_medium?: string | null;
  utm_campaign?: string | null;
  device?: string | null;
  browser?: string | null;
  region?: null;
  country?: null;
  app_version?: string;
  value?: number;
  // server will enrich: device, browser, country, region
};

const INGEST_URL =
  import.meta.env.VITE_GEO_URL || "https://campuscribs.org/geo";
const APP_VERSION = import.meta.env.VITE_APP_VERSION || "dev";
const SESSION_TIMEOUT_MS = 30 * 60 * 1000;
export type DeviceType = "Mobile" | "Tablet" | "Desktop" | "Unknown";

/** Detect device type (Mobile/Tablet/Desktop) using Client Hints with UA fallback. */
export function detectDevice(): DeviceType {
  // SSR guard
  if (typeof navigator === "undefined") return "Unknown";

  // 1) Client Hints (most accurate & cheap)
  const uaData: any = (navigator as any).userAgentData;
  if (uaData && typeof uaData.mobile === "boolean") {
    // userAgentData doesn't distinguish tablet vs mobile; handle tablet in fallback below
    return uaData.mobile ? "Mobile" : "Desktop";
  }

  // 2) User-Agent heuristics (covers tablets + older browsers)
  const ua = navigator.userAgent;

  // iPadOS pretends to be Mac; detect via touch capability
  const isIpadOS =
    navigator.platform === "MacIntel" && (navigator as any).maxTouchPoints > 1;

  const isTablet =
    /iPad|Tablet|PlayBook|Silk/i.test(ua) ||
    (isIpadOS && !/iPhone|Mobile/i.test(ua)) ||
    (/Android/i.test(ua) && !/Mobile/i.test(ua));

  if (isTablet) return "Tablet";
  if (/Mobi|Android|iPhone|iPod/i.test(ua)) return "Mobile";
  if (/Windows|Macintosh|Linux|X11/i.test(ua)) return "Desktop";

  return "Unknown";
}

/** Detect browser name + version, preferring Client Hints, falling back to UA parsing. */
export function detectBrowser(): string {
  if (typeof navigator === "undefined") return "Unknown";

  // 1) Client Hints (brands list)
  const uaData: any = (navigator as any).userAgentData;
  if (uaData?.brands?.length) {
    // Pick the first brand that isn't the pseudo "Not A Brand"
    const brands = uaData.brands.filter((b: any) => b.brand !== "Not A Brand");
    if (brands.length) {
      // Example brand entries: { brand: 'Chromium', version: '124' }, { brand: 'Google Chrome', version: '124' }
      const top = brands[0];
      return `${top.brand} ${top.version}`.trim();
    }
  }

  // 2) UA fallback parsing
  const ua = navigator.userAgent;

  // Order matters to avoid false positives
  const m = ua.match(/Edg\/([\d.]+)/i)
    ? ["Edge", ua.match(/Edg\/([\d.]+)/i)![1]]
    : ua.match(/OPR\/([\d.]+)/i)
      ? ["Opera", ua.match(/OPR\/([\d.]+)/i)![1]]
      : /CriOS\/([\d.]+)/i.test(ua)
        ? ["Chrome (iOS)", ua.match(/CriOS\/([\d.]+)/i)![1]]
        : /Chrome\/([\d.]+)/i.test(ua)
          ? ["Chrome", ua.match(/Chrome\/([\d.]+)/i)![1]]
          : /Firefox\/([\d.]+)/i.test(ua)
            ? ["Firefox", ua.match(/Firefox\/([\d.]+)/i)![1]]
            : /Version\/([\d.]+).*Safari/i.test(ua)
              ? ["Safari", ua.match(/Version\/([\d.]+).*Safari/i)![1]]
              : /MSIE\s([\d.]+)/i.test(ua)
                ? ["IE", ua.match(/MSIE\s([\d.]+)/i)![1]]
                : /Trident\/.*rv:([\d.]+)/i.test(ua)
                  ? ["IE", ua.match(/Trident\/.*rv:([\d.]+)/i)![1]]
                  : null;

  return m ? `${m[0]} ${m[1]}` : "Unknown";
}
const storage = {
  get(k: string) {
    try {
      return localStorage.getItem(k) ?? undefined;
    } catch {
      return undefined;
    }
  },
  set(k: string, v: string) {
    try {
      localStorage.setItem(k, v);
    } catch {}
  },
};

export function uuid(): string {
  return (
    (crypto as any)?.randomUUID?.() ??
    "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
      const r = (Math.random() * 16) | 0;
      const v = c === "x" ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    })
  );
}

export function getOrSet(key: string, gen: () => string) {
  const v = storage.get(key);
  if (v) return v;
  const n = gen();
  storage.set(key, n);
  return n;
}

export function getUserId() {
  return getOrSet("cc_user_id", uuid);
}

export function getSessionId() {
  const now = Date.now();
  const last = Number(storage.get("cc_last") ?? "0");
  let sid = storage.get("cc_sid");
  if (!sid || Number.isNaN(last) || now - last > SESSION_TIMEOUT_MS) {
    sid = uuid();
    storage.set("cc_sid", sid);
  }
  storage.set("cc_last", String(now));
  return sid!;
}

function parseUTM(url: string) {
  try {
    const u = new URL(url, location.origin);
    return {
      utm_source: u.searchParams.get("utm_source"),
      utm_medium: u.searchParams.get("utm_medium"),
      utm_campaign: u.searchParams.get("utm_campaign"),
    };
  } catch {
    return { utm_source: null, utm_medium: null, utm_campaign: null };
  }
}

export function baseEvent(): BaseEvent {
  const utm = parseUTM(location.href);
  return {
    ts: new Date().toISOString(),
    event: "page_view",
    user_id: getUserId(),
    session_id: getSessionId(),
    trace_id: uuid(),
    source: document.referrer ? new URL(document.referrer).host : "direct",
    page: location.href,
    referrer: document.referrer || undefined,
    app_version: APP_VERSION,
    ...utm,
    device: detectDevice(),
    browser: detectBrowser(),
    region: null,
    country: null,
  };
}
// Dedup within a short window
const recent = new Map<string, number>(); // key -> timestamp
const DEDUPE_MS = 1500;

function shouldSend(key: string): boolean {
  const now = Date.now();
  const last = recent.get(key) ?? 0;
  if (now - last < DEDUPE_MS) return false;
  recent.set(key, now);
  return true;
}

export function sendAnalytics(evt: BaseEvent) {
  const key = `${evt.event}:${evt.page ?? ""}:${evt.session_id ?? ""}`;
  if (!shouldSend(key)) return;

  const payload = JSON.stringify(evt);
  // sendBeacon first; only fallback to fetch if beacon definitely failed
  if (typeof navigator.sendBeacon === "function") {
    const ok = navigator.sendBeacon(
      INGEST_URL,
      new Blob([payload], { type: "application/json" })
    );
    if (ok) return;
  }

  fetch(INGEST_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: payload,
    keepalive: true,
    credentials: "omit",
  }).catch(() => {});
}

// Optional: plain function you can call anywhere
export function track(
  event: string,
  value?: number,
  extras?: Record<string, unknown>
) {
  const evt: BaseEvent = { ...baseEvent(), event, value, ...(extras || {}) };
  sendAnalytics(evt);
}
