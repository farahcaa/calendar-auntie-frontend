import { deleteBlogCategory, useGetBlogsByCategoryId } from "@/gen";
import { useGetBlogCategoryById } from "@/gen/hooks/BlogHooks/useGetBlogCategoryById";
import useAuthenticatedClientConfig from "@/hooks/use-authenticated-client-config";
import { useNavigate, useParams } from "react-router";

const BlogCategoryDetail = () => {
  const navigate = useNavigate();
  const { CategoryId } = useParams();
  const config = useAuthenticatedClientConfig();
  const { data: category, isLoading: categoryLoading } = useGetBlogCategoryById(
    CategoryId ?? "",
  );
  const { data: posts, isLoading: postsLoading } = useGetBlogsByCategoryId(
    CategoryId ?? "",
  );

  console.log("category", category);
  const handleDeleteCategory = async () => {
    const confirmed = window.confirm(
      `Delete category "${category?.data.name}"? This will also delete all posts in this category. This action cannot be undone.`,
    );

    if (!confirmed) return;

    try {
      await deleteBlogCategory({ id: CategoryId ?? "" }, { ...config });
      navigate("/admin/blog");
    } catch (error) {
      console.error("Failed to delete category", error);
    }
  };
  if (categoryLoading || postsLoading) {
    return (
      <div className="min-h-screen bg-zinc-50 px-6 py-10">
        <div className="mx-auto max-w-4xl animate-pulse">
          <div className="h-8 w-64 rounded bg-zinc-200" />
          <div className="mt-3 h-4 w-96 rounded bg-zinc-100" />
          <div className="mt-8 space-y-4">
            {[...Array(3)].map((_, index) => (
              <div
                key={index}
                className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm"
              >
                <div className="h-5 w-56 rounded bg-zinc-200" />
                <div className="mt-3 h-4 w-80 rounded bg-zinc-100" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!category) {
    return (
      <div className="min-h-screen bg-zinc-50 px-6 py-10">
        <div className="mx-auto max-w-3xl rounded-2xl border border-dashed border-zinc-300 bg-white p-10 text-center shadow-sm">
          <h1 className="text-2xl font-semibold text-zinc-900">
            Category not found
          </h1>
          <p className="mt-2 text-sm text-zinc-600">
            The category you are looking for does not exist.
          </p>
          <button
            onClick={() => navigate("/admin/blog")}
            className="mt-5 inline-flex items-center justify-center rounded-xl bg-zinc-900 px-5 py-3 text-sm font-medium text-white transition hover:bg-zinc-800"
          >
            Back to Categories
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50 px-6 py-10">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <button
              onClick={() => navigate("/admin/blog")}
              className="mb-4 text-sm font-medium text-zinc-500 transition hover:text-zinc-800"
            >
              ← Back to Categories
            </button>

            <p className="text-sm font-medium uppercase tracking-wide text-zinc-500">
              Blog Category
            </p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight text-zinc-900">
              {category.data.name}
            </h1>
            <p className="mt-2 text-sm text-zinc-600">
              {category.data.description || "No description provided."}
            </p>
          </div>

          <button
            onClick={() => navigate(`/admin/blog-create-post/${CategoryId}`)}
            className="inline-flex items-center justify-center rounded-xl bg-zinc-900 px-5 py-3 text-sm font-medium text-white transition hover:bg-zinc-800"
          >
            Create Post
          </button>
          <button
            onClick={handleDeleteCategory}
            className="inline-flex items-center justify-center rounded-xl bg-red-900 px-5 py-3 text-sm font-medium text-white transition hover:bg-red-800"
          >
            Delete Category
          </button>
        </div>

        {posts?.data.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-zinc-300 bg-white p-10 text-center shadow-sm">
            <h2 className="text-lg font-semibold text-zinc-900">
              No posts in this category
            </h2>
            <p className="mt-2 text-sm text-zinc-600">
              Create the first post for this category.
            </p>
            <button
              onClick={() => navigate(`/admin/blog-create-post/${CategoryId}`)}
              className="mt-5 inline-flex items-center justify-center rounded-xl bg-zinc-900 px-5 py-3 text-sm font-medium text-white transition hover:bg-zinc-800"
            >
              Create Post
            </button>
          </div>
        ) : (
          <div className="grid gap-4">
            {posts?.data.map((post) => (
              <button
                key={post.id}
                onClick={() => navigate(`/admin/blog/post/${post.id}`)}
                className="group rounded-2xl border border-zinc-200 bg-white p-5 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-zinc-300 hover:shadow-md"
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-3">
                      <h2 className="text-lg font-semibold text-zinc-900 transition group-hover:text-zinc-700">
                        {post.categoryName}
                      </h2>
                      <span className="rounded-full bg-zinc-100 px-2.5 py-1 text-xs font-medium text-zinc-600">
                        {post.slug}
                      </span>
                    </div>

                    <p className="mt-2 text-sm text-zinc-600">
                      {post.excerpt || "No excerpt provided."}
                    </p>
                  </div>

                  <div className="shrink-0 text-sm font-medium text-zinc-500 transition group-hover:text-zinc-700">
                    Open →
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BlogCategoryDetail;
