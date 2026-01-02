import {
  useDeleteAdminProductsProductid,
  useDeleteAdminProductsProductidMediaDeleteMediaid,
  useGetAdminProductsProductid,
  usePutAdminProductsProductid,
} from "@/gen";
import { useProductMediaUpload } from "@/hooks/post-media-upload";
import useAuthenticatedClientConfig from "@/hooks/use-authenticated-client-config";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";

const AdminProductIndividual: React.FC = () => {
  const config = useAuthenticatedClientConfig();
  const navigate = useNavigate();
  const { productId } = useParams();

  const { mutateAsync: deleteProduct, isPending: isPendingUpdate } =
    useDeleteAdminProductsProductid({
      ...config,
    });

  const { mutateAsync: updateProduct, isPending: isPendingDelete } =
    usePutAdminProductsProductid({
      ...config,
    });
  const { data } = useGetAdminProductsProductid(productId || "", {
    ...config,
  });

  const { mutateAsync } = useDeleteAdminProductsProductidMediaDeleteMediaid({
    ...config,
  });

  const [form, setForm] = useState({
    sku: data?.data.sku || "",
    title: data?.data.title || "",
    description: data?.data.description || "",
    price: data?.data.price || "0.00",
    inventoryQty: data?.data.inventoryQty || 0,
    isActive: data?.data.isActive || false,
  });

  const {
    upload,
    mediaId,
    uploading,
    error: uploadError,
  } = useProductMediaUpload();

  useEffect(() => {
    if (data) {
      setForm({
        sku: data.data.sku,
        title: data.data.title,
        description: data.data.description,
        price: data.data.price,
        inventoryQty: data.data.inventoryQty,
        isActive: data.data.isActive,
      });
    }
  }, [data]);

  const handleDeleteProduct = async () => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      await deleteProduct({ productId: productId || "" });
      alert("Product deleted successfully.");
      navigate("/admin/products");
    }
  };

  const handleProductUpdate = async (e: React.FormEvent) => {
    e.preventDefault();

    await updateProduct({
      productId: productId!,
      data: form,
    });
    alert("Product updated successfully!");
  };
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    if (data?.data.thumbnails && data?.data.thumbnails?.length > 0) {
      alert("Product already has an image uploaded.");
      return;
    }
    upload(productId || "", files[0])
      .then(() => {
        alert("Success please wait for image to load");
        window.location.reload();
      })
      .catch(async (err) => {
        console.error("Error uploading file:", err);
        alert("Error uploading file: " + uploadError?.message);
      });
    // reset the input value to allow re-uploading the same file

    e.target.value = "";
  };

  const handleDeleteMedia = async () => {
    if (!data?.data.thumbnails || data?.data.thumbnails?.length === 0) {
      alert("No media to delete.");
      return;
    }
    if (data.data.thumbnails.length > 0) {
      const mediaId = data.data.thumbnails[0].split("/").pop();
      console.log("Media ID to delete:", mediaId);
      await mutateAsync({ productId: productId || "", mediaId: mediaId });
      alert("Media deleted successfully.");
      window.location.reload();
    } else {
      alert("No media ID available for deletion.");
    }
  };

  return (
    <div className="mx-auto max-w-[860px] p-4">
      <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-zinc-900">Edit Product</h2>
          <p className="mt-1 text-sm text-zinc-600">
            Fill out the product details below.
          </p>
        </div>
        <div className="my-10 flex">
          <div className="flex flex-col w-50">
            <label className="mb-1.5 block text-sm font-semibold text-zinc-900">
              Upload Image
            </label>
            <input
              placeholder="upload image"
              alt="Upload Image"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              type="file"
              onChange={(e) => handleFileUpload(e)}
            />
            <button
              className="mt-auto inline-flex items-center justify-center rounded-xl border border-zinc-900 bg-white px-4 py-2.5 text-sm font-semibold text-zinc-900 shadow-sm transition hover:bg-zinc-50 active:scale-[0.99]"
              type="button"
              onClick={() => handleDeleteMedia()}
            >
              Remove Image
            </button>
          </div>
          <div className="flex w-60 h-60 ml-auto">
            {data?.data.thumbnails?.map((thumbnail, index) => (
              <img
                key={index}
                src={import.meta.env.VITE_MEDIA_BASE_URL + thumbnail}
                alt={`Thumbnail ${index + 1}`}
                className=" object-cover"
              />
            ))}
          </div>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {/* SKU */}
          <div>
            <label className="mb-1.5 block text-sm font-semibold text-zinc-900">
              SKU <span className="font-normal text-zinc-500">(required)</span>
            </label>
            <input
              className="w-full rounded-xl border border-zinc-300 bg-white px-3 py-2.5 text-sm text-zinc-900 placeholder:text-zinc-400 shadow-sm outline-none transition focus:border-zinc-900 focus:ring-2 focus:ring-zinc-900/10"
              placeholder="CAL-2026-MANTRA-01, needs to be unique"
              value={form.sku}
              onChange={(e) => setForm({ ...form, sku: e.target.value })}
            />
          </div>

          {/* Price */}
          <div>
            <label className="mb-1.5 block text-sm font-semibold text-zinc-900">
              Price{" "}
              <span className="font-normal text-zinc-500">(required)</span>
            </label>
            <input
              className="w-full rounded-xl border border-zinc-300 bg-white px-3 py-2.5 text-sm text-zinc-900 placeholder:text-zinc-400 shadow-sm outline-none transition focus:border-zinc-900 focus:ring-2 focus:ring-zinc-900/10"
              inputMode="decimal"
              placeholder="19.99"
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
            />
            <p className="mt-1.5 text-xs text-zinc-500">
              Up to 2 decimals (DECIMAL(10,2)).
            </p>
          </div>

          {/* Title */}
          <div className="md:col-span-2">
            <label className="mb-1.5 block text-sm font-semibold text-zinc-900">
              Title{" "}
              <span className="font-normal text-zinc-500">(required)</span>
            </label>
            <input
              className="w-full rounded-xl border border-zinc-300 bg-white px-3 py-2.5 text-sm text-zinc-900 placeholder:text-zinc-400 shadow-sm outline-none transition focus:border-zinc-900 focus:ring-2 focus:ring-zinc-900/10"
              placeholder="Motivation & Discipline Mantra Calendar"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
            />
          </div>

          {/* Description */}
          <div className="md:col-span-2">
            <label className="mb-1.5 block text-sm font-semibold text-zinc-900">
              Description
            </label>
            <textarea
              className="w-full rounded-xl border border-zinc-300 bg-white px-3 py-2.5 text-sm text-zinc-900 placeholder:text-zinc-400 shadow-sm outline-none transition focus:border-zinc-900 focus:ring-2 focus:ring-zinc-900/10"
              rows={5}
              placeholder="Short details about the product..."
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
            />
          </div>

          {/* Inventory */}
          <div>
            <label className="mb-1.5 block text-sm font-semibold text-zinc-900">
              Inventory Qty
            </label>
            <input
              className="w-full rounded-xl border border-zinc-300 bg-white px-3 py-2.5 text-sm text-zinc-900 placeholder:text-zinc-400 shadow-sm outline-none transition focus:border-zinc-900 focus:ring-2 focus:ring-zinc-900/10"
              type="number"
              min={0}
              step={1}
              value={form.inventoryQty}
              onChange={(e) =>
                setForm({ ...form, inventoryQty: e.target.value })
              }
              placeholder="0"
            />
          </div>

          {/* Active */}
          <div className="flex items-center gap-3 md:pt-7">
            <input
              id="isActive"
              type="checkbox"
              checked={form.isActive}
              onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
              className="h-4 w-4 rounded border-zinc-300 text-zinc-900 focus:ring-zinc-900/20"
            />
            <label
              htmlFor="isActive"
              className="text-sm font-semibold text-zinc-900"
            >
              Active{" "}
              <span className="font-normal text-zinc-500">(isActive)</span>
            </label>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-6 flex flex-row gap-3 justify-between">
          <button
            className="inline-flex items-center justify-center rounded-xl border border-zinc-900 bg-white px-4 py-2.5 text-sm font-semibold text-zinc-900 shadow-sm transition hover:bg-zinc-50 active:scale-[0.99]"
            type="button"
            onClick={handleProductUpdate}
          >
            {isPendingUpdate ? "Saving..." : "Save Changes"}
          </button>
          <button
            className="inline-flex items-center justify-center rounded-xl border border-zinc-900 bg-red-500 px-4 py-2.5 text-sm font-semibold shadow-sm text-white  transition hover:bg-red-600 active:scale-[0.99]"
            type="button"
            onClick={handleDeleteProduct}
          >
            {isPendingDelete ? "Deleting..." : "Delete Product"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminProductIndividual;
