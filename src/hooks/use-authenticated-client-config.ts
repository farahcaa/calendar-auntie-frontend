export type UseAuthenticatedClientConfig = {
  client: {
    headers: {
      Authorization: string;
    };
  };
};

const useAuthenticatedClientConfig = (): UseAuthenticatedClientConfig => {
  const auth = localStorage.getItem("auth");
  return {
    client: {
      headers: {
        Authorization: auth ? `Bearer ${auth}` : "",
      },
    },
  };
};

export default useAuthenticatedClientConfig;
