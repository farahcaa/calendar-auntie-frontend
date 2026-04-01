import type { RequestConfig } from "@/lib/client";

export type UseAuthenticatedClientConfig = Partial<RequestConfig> & {
  client?: typeof import("@/lib/client").default;
};

const useAuthenticatedClientConfig = (): UseAuthenticatedClientConfig => {
  const auth = localStorage.getItem("auth");
  return {
    headers: {
      Authorization: auth ? `Bearer ${auth}` : "",
    },
  };
};

export default useAuthenticatedClientConfig;
