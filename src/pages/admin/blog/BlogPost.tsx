import { useState } from "react";
import { useNavigate, useParams } from "react-router";
import ReactMarkdown from "react-markdown";
import remarkBreaks from "remark-breaks";
import { deleteBlogPost, useGetBlogPostById } from "@/gen";
import useAuthenticatedClientConfig from "@/hooks/use-authenticated-client-config";

const BlogPost = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [isDeleting, setIsDeleting] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  const config = useAuthenticatedClientConfig();
  const { data: post, isLoading } = useGetBlogPostById(id ?? "");

  const handleCopyMarkdown = async () => {
    if (!post) return;

    try {
      await navigator.clipboard.writeText(post.data.bodyMarkdown || "");
      setCopySuccess(true);
      window.setTimeout(() => setCopySuccess(false), 1500);
    } catch (error) {
      console.error("Failed to copy markdown", error);
    }
  };

  const handleDelete = async () => {
    if (!post) return;

    const confirmed = window.confirm(
      `Delete "${post.data.title}"? This action cannot be undone.`,
    );

    if (!confirmed) return;

    try {
      setIsDeleting(true);

      await deleteBlogPost({ id: id ?? "" }, { ...config });
      navigate(-1);
    } catch (error) {
      console.error("Failed to delete post", error);
    } finally {
      setIsDeleting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-zinc-50 px-6 py-10">
        <div className="mx-auto max-w-4xl animate-pulse">
          <div className="h-8 w-64 rounded bg-zinc-200" />
          <div className="mt-4 h-4 w-40 rounded bg-zinc-100" />
          <div className="mt-8 rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm">
            <div className="h-5 w-48 rounded bg-zinc-200" />
            <div className="mt-4 h-4 w-full rounded bg-zinc-100" />
            <div className="mt-2 h-4 w-11/12 rounded bg-zinc-100" />
            <div className="mt-2 h-4 w-10/12 rounded bg-zinc-100" />
          </div>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-zinc-50 px-6 py-10">
        <div className="mx-auto max-w-3xl rounded-2xl border border-dashed border-zinc-300 bg-white p-10 text-center shadow-sm">
          <h1 className="text-2xl font-semibold text-zinc-900">
            Post not found
          </h1>
          <p className="mt-2 text-sm text-zinc-600">
            The post you are looking for does not exist.
          </p>
          <button
            onClick={() => navigate(-1)}
            className="mt-5 inline-flex items-center justify-center rounded-xl bg-zinc-900 px-5 py-3 text-sm font-medium text-white transition hover:bg-zinc-800"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50 px-6 py-10">
      <div className="mx-auto max-w-4xl">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-sm font-medium uppercase tracking-wide text-zinc-500">
              Blog Post
            </p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight text-zinc-900">
              {post.data.title}
            </h1>
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-zinc-100 px-3 py-1 text-xs font-medium text-zinc-700">
                {post.data.slug}
              </span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={handleCopyMarkdown}
              className="inline-flex items-center justify-center rounded-xl border border-zinc-300 bg-white px-4 py-3 text-sm font-medium text-zinc-700 transition hover:bg-zinc-50"
            >
              {copySuccess ? "Copied" : "Copy Markdown"}
            </button>

            <button
              onClick={handleDelete}
              disabled={isDeleting}
              className="inline-flex items-center justify-center rounded-xl bg-red-600 px-4 py-3 text-sm font-medium text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </button>
          </div>
        </div>

        {post.data.excerpt && (
          <div className="mb-6 rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
            <p className="text-sm leading-7 text-zinc-600">
              {post.data.excerpt}
            </p>
          </div>
        )}

        <div className="rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm">
          <article className="prose prose-zinc max-w-none prose-p:my-4">
            <ReactMarkdown remarkPlugins={[remarkBreaks]}>
              {post.data.bodyMarkdown}
            </ReactMarkdown>
          </article>
        </div>
      </div>
    </div>
  );
};

export default BlogPost;
