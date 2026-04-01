import { createBlogCategory } from "@/gen";
import useAuthenticatedClientConfig from "@/hooks/use-authenticated-client-config";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router";
import axios from "axios";

type CreateBlogCategoryRequest = {
  name: string;
  slug: string;
  description?: string | null;
};

const slugify = (value: string): string => {
  return value
    .toLowerCase()
    .trim()
    .replace(/['"]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
};

const CreateCategory = () => {
  const navigate = useNavigate();
  const config = useAuthenticatedClientConfig();
  const [form, setForm] = useState<CreateBlogCategoryRequest>({
    name: "",
    slug: "",
    description: "",
  });

  const [slugTouched, setSlugTouched] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generatedSlug = useMemo(() => slugify(form.name), [form.name]);
  const effectiveSlug = slugTouched ? form.slug : generatedSlug;

  const handleNameChange = (value: string) => {
    setForm((prev) => ({
      ...prev,
      name: value,
      slug: slugTouched ? prev.slug : slugify(value),
    }));
  };

  const handleSlugChange = (value: string) => {
    setSlugTouched(true);
    setForm((prev) => ({
      ...prev,
      slug: slugify(value),
    }));
  };

  const handleDescriptionChange = (value: string) => {
    setForm((prev) => ({
      ...prev,
      description: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    const payload: CreateBlogCategoryRequest = {
      name: form.name.trim(),
      slug: effectiveSlug.trim(),
      description: form.description?.trim() ? form.description.trim() : null,
    };

    if (!payload.name) {
      setError("Name is required.");
      return;
    }

    if (!payload.slug) {
      setError("Slug is required.");
      return;
    }

    try {
      setIsSubmitting(true);

      const response = await createBlogCategory(payload, { ...config });

      if (response.status == 409) {
        throw new Error(
          "Conflict: A category with the same slug already exists.",
        );
      } else if (response.status != 200) {
        throw new Error("Failed to create blog category.");
      }

      navigate(`/admin/blog`);
    } catch (err) {
      console.log("Error creating category:", err);

      if (axios.isAxiosError(err)) {
        const status = err.response?.status;

        if (status === 409) {
          setError(
            `A category with the slug "${payload.slug}" already exists. Please choose a different slug.`,
          );
        } else {
          setError(
            `Failed to create category. Server responded with status ${status ?? "unknown"}.`,
          );
        }
      } else {
        setError("An unexpected error occurred.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 px-6 py-10">
      <div className="mx-auto max-w-2xl">
        <div className="mb-8">
          <p className="text-sm font-medium uppercase tracking-wide text-zinc-500">
            Admin
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-zinc-900">
            Create Blog Category
          </h1>
          <p className="mt-2 text-sm text-zinc-600">
            Create a category for grouping blog posts.
          </p>
        </div>

        <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="name"
                className="mb-2 block text-sm font-medium text-zinc-900"
              >
                Name
              </label>
              <input
                id="name"
                type="text"
                maxLength={100}
                value={form.name}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder="Apartment Tips"
                className="w-full rounded-xl border border-zinc-300 bg-white px-4 py-3 text-sm text-zinc-900 outline-none transition focus:border-zinc-400 focus:ring-2 focus:ring-zinc-200"
              />
              <p className="mt-2 text-xs text-zinc-500">
                Human-readable category name.
              </p>
            </div>

            <div>
              <label
                htmlFor="slug"
                className="mb-2 block text-sm font-medium text-zinc-900"
              >
                Slug
              </label>
              <input
                id="slug"
                type="text"
                maxLength={120}
                value={effectiveSlug}
                onChange={(e) => handleSlugChange(e.target.value)}
                placeholder="apartment-tips"
                className="w-full rounded-xl border border-zinc-300 bg-white px-4 py-3 text-sm text-zinc-900 outline-none transition focus:border-zinc-400 focus:ring-2 focus:ring-zinc-200"
              />
              <p className="mt-2 text-xs text-zinc-500">
                URL-safe identifier. Auto-generated from the name unless you
                edit it.
              </p>
            </div>

            <div>
              <label
                htmlFor="description"
                className="mb-2 block text-sm font-medium text-zinc-900"
              >
                Description
              </label>
              <textarea
                id="description"
                rows={5}
                value={form.description ?? ""}
                onChange={(e) => handleDescriptionChange(e.target.value)}
                placeholder="Short description for this category..."
                className="w-full rounded-xl border border-zinc-300 bg-white px-4 py-3 text-sm text-zinc-900 outline-none transition focus:border-zinc-400 focus:ring-2 focus:ring-zinc-200"
              />
              <p className="mt-2 text-xs text-zinc-500">
                Optional internal or public-facing description.
              </p>
            </div>

            {error && (
              <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}

            <div className="flex items-center gap-3 pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex items-center justify-center rounded-xl bg-zinc-900 px-5 py-3 text-sm font-medium text-white transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSubmitting ? "Creating..." : "Create Category"}
              </button>

              <button
                type="button"
                onClick={() => navigate("/admin/blog")}
                className="inline-flex items-center justify-center rounded-xl border border-zinc-300 bg-white px-5 py-3 text-sm font-medium text-zinc-700 transition hover:bg-zinc-50"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateCategory;
