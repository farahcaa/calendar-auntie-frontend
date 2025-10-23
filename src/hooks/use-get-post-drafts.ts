import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { getPostsDrafts, PostDraftDTO, postPostsDrafts } from "@/gen";
import useEasyAuth from "./use-easy-auth";
import { createAuthenticatedClient } from "@/lib/create-authenticated-client";

export function useEnsurePostDraft() {
  const { user } = useEasyAuth();
  const [finalData, setFinalData] = useState<PostDraftDTO>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const hasFetched = useRef(false);

  const client = useMemo(
    () => createAuthenticatedClient(user?.access_token || ""),
    [user?.access_token]
  );

  const ensureDraft = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await getPostsDrafts({ client });
      if (res.status === 200 && res.data) {
        setFinalData(res.data);
        return;
      }
    } catch (err: any) {
      if (err?.response?.status === 404) {
        try {
          const { data: created } = await postPostsDrafts({ client });
          setFinalData(created);
          return;
        } catch (createErr: any) {
          setError(createErr.message || "Failed to create draft");
        }
      } else {
        setError(err.message || "Unknown error fetching draft");
      }
    } finally {
      setLoading(false);
    }
  }, [client]);

  useEffect(() => {
    if (!hasFetched.current) {
      hasFetched.current = true;
      ensureDraft();
    }
  }, [ensureDraft]);

  return {
    postDraft: finalData,
    loading,
    error,
    refetch: ensureDraft,
  };
}
