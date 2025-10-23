import axios from "axios";

import type { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";

const VITE_BACKEND_BASE_URL = import.meta.env.VITE_BACKEND_BASE_URL;

/**
 * Subset of AxiosRequestConfig
 */
export type RequestConfig<TData = unknown> = {
  url?: string;
  method: "GET" | "PUT" | "PATCH" | "POST" | "DELETE";
  params?: unknown;
  data?: TData;
  responseType?:
    | "arraybuffer"
    | "blob"
    | "document"
    | "json"
    | "text"
    | "stream";
  signal?: AbortSignal;
  headers?: AxiosRequestConfig["headers"];
};
/**
 * Subset of AxiosResponse
 */
export type ResponseConfig<TData = unknown> = {
  data: TData;
  status: number;
  statusText: string;
  headers?: AxiosResponse["headers"];
};

export const axiosInstance = axios.create({
  baseURL: VITE_BACKEND_BASE_URL,
  paramsSerializer: {
    serialize: (params) => {
      return new URLSearchParams(params).toString();
    },
  },
});

export type ResponseErrorConfig<TError = unknown> = {
  response?: {
    data: TError;
    status: number;
    statusText: string;
    headers?: AxiosResponse["headers"];
  };
  request?: {
    data: TError;
    status: number;
    statusText: string;
    headers?: AxiosResponse["headers"];
  };
  message: string;
  config: RequestConfig;
  isAxiosError: boolean;
  toJSON: () => {
    message: string;
    config: RequestConfig;
    code?: string | null;
    request?: unknown;
  };
};

export const axiosClient = async <
  TData,
  TError = unknown,
  TVariables = unknown,
>(
  config: RequestConfig<TVariables>
): Promise<ResponseConfig<TData>> => {
  const promise = axiosInstance
    .request<TVariables, ResponseConfig<TData>>({ ...config })
    .catch((e: AxiosError<TError>) => {
      throw e;
    });

  return promise;
};

export default axiosClient;

export function createAuthenticatedClient(token: string) {
  return function <TData, TError = unknown, TVariables = unknown>(
    reqConfig: RequestConfig<TVariables>
  ): Promise<ResponseConfig<TData>> {
    return axiosClient<TData, TError, TVariables>({
      ...reqConfig,
      headers: {
        ...reqConfig.headers,
        Authorization: `Bearer ${token}`,
      },
    });
  };
}
