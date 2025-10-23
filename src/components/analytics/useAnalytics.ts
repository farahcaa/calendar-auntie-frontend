import { useContext } from "react";
import { AnalyticsContext } from "./analyticsContext";

export function useAnalytics() {
  return useContext(AnalyticsContext);
}
