import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router";

type CreateBlogPostRequest = {
  categoryId: string;
  title: string;
  slug: string;
  excerpt?: string | null;
  bodyMarkdown: string;
  published: boolean;
};

type BlogPostDto = {
  id: string;
  categoryId: string;
  title: string;
  slug: string;
  excerpt?: string | null;
  bodyMarkdown: string;
  published: boolean;
  publishedAt?: string | null;
};

const slugify = (value: string): string => {
  return value
    .toLowerCase()
    .trim()
    .replace(/['"]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
};

const CreateBlogPost = () => {
  const navigate = useNavigate();
  const { categoryId } = useParams();

  const [form, setForm] = useState<CreateBlogPostRequest>({
    categoryId: categoryId ?? "",
    title: "",
    slug: "",
    excerpt: "",
    bodyMarkdown: `# New Post

Write your content here.
`,
    published: false,
  });

  const [slugTouched, setSlugTouched] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generatedSlug = useMemo(() => slugify(form.title), [form.title]);
  const effectiveSlug = slugTouched ? form.slug : generatedSlug;

  const handleTitleChange = (value: string) => {
    setForm((prev) => ({
      ...prev,
      title: value,
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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    const payload: CreateBlogPostRequest = {
      categoryId: form.categoryId,
      title: form.title.trim(),
      slug: effectiveSlug.trim(),
      excerpt: form.excerpt?.trim() ? form.excerpt.trim() : null,
      bodyMarkdown: form.bodyMarkdown.trim(),
      published: form.published,
    };

    if (!payload.categoryId) {
      setError("Category id is missing from the route.");
      return;
    }

    if (!payload.title) {
      setError("Title is required.");
      return;
    }

    if (!payload.slug) {
      setError("Slug is required.");
      return;
    }

    if (!payload.bodyMarkdown) {
      setError("Markdown body is required.");
      return;
    }

    try {
      setIsSubmitting(true);

      // Replace later with your mutation hook
      // const created = await createBlogPostMutation.mutateAsync({ data: payload });

      const created: BlogPostDto = {
        id: "new-fake-id-123",
        categoryId: payload.categoryId,
        title: payload.title,
        slug: payload.slug,
        excerpt: payload.excerpt,
        bodyMarkdown: payload.bodyMarkdown,
        published: payload.published,
        publishedAt: payload.published ? new Date().toISOString() : null,
      };

      navigate(`/admin/blog/post/${created.id}`);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to create blog post.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 px-6 py-10">
      <div className="mx-auto max-w-3xl">
        <div className="mb-8">
          <p className="text-sm font-medium uppercase tracking-wide text-zinc-500">
            Admin
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-zinc-900">
            Create Blog Post
          </h1>
          <p className="mt-2 text-sm text-zinc-600">
            Create a new post for this category.
          </p>
        </div>

        <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="title"
                className="mb-2 block text-sm font-medium text-zinc-900"
              >
                Title
              </label>
              <input
                id="title"
                type="text"
                value={form.title}
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder="How to Avoid Bad Student Subleases"
                className="w-full rounded-xl border border-zinc-300 bg-white px-4 py-3 text-sm text-zinc-900 outline-none transition focus:border-zinc-400 focus:ring-2 focus:ring-zinc-200"
              />
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
                value={effectiveSlug}
                onChange={(e) => handleSlugChange(e.target.value)}
                placeholder="how-to-avoid-bad-student-subleases"
                className="w-full rounded-xl border border-zinc-300 bg-white px-4 py-3 text-sm text-zinc-900 outline-none transition focus:border-zinc-400 focus:ring-2 focus:ring-zinc-200"
              />
            </div>

            <div>
              <label
                htmlFor="excerpt"
                className="mb-2 block text-sm font-medium text-zinc-900"
              >
                Excerpt
              </label>
              <textarea
                id="excerpt"
                rows={3}
                value={form.excerpt ?? ""}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, excerpt: e.target.value }))
                }
                placeholder="Short summary of the post..."
                className="w-full rounded-xl border border-zinc-300 bg-white px-4 py-3 text-sm text-zinc-900 outline-none transition focus:border-zinc-400 focus:ring-2 focus:ring-zinc-200"
              />
            </div>

            <div>
              <label
                htmlFor="bodyMarkdown"
                className="mb-2 block text-sm font-medium text-zinc-900"
              >
                Markdown Body
              </label>
              <textarea
                id="bodyMarkdown"
                rows={16}
                value={form.bodyMarkdown}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, bodyMarkdown: e.target.value }))
                }
                placeholder="# Title"
                className="w-full rounded-xl border border-zinc-300 bg-white px-4 py-3 font-mono text-sm text-zinc-900 outline-none transition focus:border-zinc-400 focus:ring-2 focus:ring-zinc-200"
              />
            </div>

            <label className="flex items-center gap-3 rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3">
              <input
                type="checkbox"
                checked={form.published}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, published: e.target.checked }))
                }
                className="h-4 w-4 rounded border-zinc-300"
              />
              <span className="text-sm font-medium text-zinc-800">
                Publish immediately
              </span>
            </label>

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
                {isSubmitting ? "Creating..." : "Create Post"}
              </button>

              <button
                type="button"
                onClick={() => navigate(-1)}
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

export default CreateBlogPost;
