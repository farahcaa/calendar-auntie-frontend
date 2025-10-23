import { createContext } from "react";

export type AnalyticsContextValue = {
  track: (
    event: string,
    value?: number,
    extras?: Record<string, unknown>
  ) => void;
  enabled: boolean;
};

export const AnalyticsContext = createContext<AnalyticsContextValue>({
  track: () => {},
  enabled: false,
});
