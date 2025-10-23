// AnalyticsProvider.tsx
import React, { useEffect, useMemo } from "react";
import { baseEvent, sendAnalytics, track as directTrack } from "./analytics";
import { useLocation } from "react-router";
import { AnalyticsContext, AnalyticsContextValue } from "./analyticsContext";

type Props = {
  children: React.ReactNode;
  enabled?: boolean; // gate by consent
  autoPageViews?: boolean;
};

export function AnalyticsProvider({
  children,
  enabled = true,
  autoPageViews = true,
}: Props) {
  const location = useLocation();

  useEffect(() => {
    if (!enabled || !autoPageViews) return;
    // This will still run multiple times in StrictMode/HMR, but dedupe stops repeats
    const evt = baseEvent();
    evt.event = "page_view";
    sendAnalytics(evt);
  }, [
    enabled,
    autoPageViews,
    location.pathname,
    location.search,
    location.hash,
  ]);

  const value = useMemo<AnalyticsContextValue>(
    () => ({
      enabled,
      track: (event, value, extras) => {
        if (!enabled) return;
        directTrack(event, value, extras);
      },
    }),
    [enabled]
  );

  return (
    <AnalyticsContext.Provider value={value}>
      {children}
    </AnalyticsContext.Provider>
  );
}
