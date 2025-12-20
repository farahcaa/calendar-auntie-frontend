import {
  usePostAdminProductsProductidMedia,
  usePutAdminProductsProductidMediaMediaid,
} from "@/gen";
import useAuthenticatedClientConfig from "@/hooks/use-authenticated-client-config";
import { useState } from "react";

export function useProductMediaUpload() {
  const [mediaIdState, setMediaId] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const config = useAuthenticatedClientConfig();
  const { mutateAsync: putAdminProductsProductidMedia } =
    usePutAdminProductsProductidMediaMediaid({ ...config });
  const { mutateAsync: postAdminProductsProductidMedia } =
    usePostAdminProductsProductidMedia({
      ...config,
    });

  const upload = async (productId: string, file: File) => {
    try {
      setUploading(true);
      setError(null);
      if (!productId) {
        throw new Error("Product ID is required");
      }
      const { data } = await postAdminProductsProductidMedia({ productId }); // call the actual endpoint
      if (!data) throw new Error("Failed to fetch upload URL");

      const { uploadUrl, mediaId } = data;
      const res = await fetch(uploadUrl, {
        method: "PUT",
        headers: {
          "Content-Type": file.type,
        },
        body: file,
      });
      if (!res.ok) throw new Error("Upload failed");

      const { data: putAdminProductsProductidMediaData } =
        await putAdminProductsProductidMedia({ productId, mediaId });
      if (!putAdminProductsProductidMediaData) {
        throw new Error("Failed to associate media with product");
      }

      setMediaId(mediaId);
      return mediaId;
    } catch (err: any) {
      setError(err.message || "Unknown error");
      throw err;
    } finally {
      setUploading(false);
    }
  };

  return {
    upload,
    mediaId: mediaIdState,
    uploading,
    error,
  };
}
