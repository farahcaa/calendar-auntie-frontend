import { useMemo } from "react";
import { useNavigate, useParams } from "react-router";

type BlogCategoryDto = {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
};

type BlogPostDto = {
  id: string;
  categoryId: string;
  title: string;
  slug: string;
  excerpt?: string | null;
  bodyMarkdown: string;
  published: boolean;
};

const fakeCategories: BlogCategoryDto[] = [
  {
    id: "9f8f8f8a-1111-4b2d-9c11-111111111111",
    name: "Apartment Tips",
    slug: "apartment-tips",
    description: "Advice for finding, managing, and enjoying apartments.",
  },
  {
    id: "9f8f8f8a-2222-4b2d-9c11-222222222222",
    name: "Student Housing",
    slug: "student-housing",
    description: "Content focused on leases, roommates, and student living.",
  },
  {
    id: "9f8f8f8a-3333-4b2d-9c11-333333333333",
    name: "Moving Guides",
    slug: "moving-guides",
    description: "Packing, moving, setup, and move-in checklists.",
  },
];

const fakePosts: BlogPostDto[] = [
  {
    id: "a1b2c3d4-1111-4444-8888-aaaaaaaaaaaa",
    categoryId: "9f8f8f8a-1111-4b2d-9c11-111111111111",
    title: "How to Avoid Bad Student Subleases",
    slug: "how-to-avoid-bad-student-subleases",
    excerpt: "A practical checklist for avoiding scams and vague agreements.",
    published: true,
    bodyMarkdown: "# How to Avoid Bad Student Subleases",
  },
  {
    id: "a1b2c3d4-2222-4444-8888-bbbbbbbbbbbb",
    categoryId: "9f8f8f8a-1111-4b2d-9c11-111111111111",
    title: "Questions to Ask Before Signing Anything",
    slug: "questions-to-ask-before-signing-anything",
    excerpt:
      "Simple questions that can save you from a messy housing situation.",
    published: false,
    bodyMarkdown: "# Questions to Ask Before Signing Anything",
  },
  {
    id: "a1b2c3d4-3333-4444-8888-cccccccccccc",
    categoryId: "9f8f8f8a-2222-4b2d-9c11-222222222222",
    title: "Roommate Red Flags to Watch For",
    slug: "roommate-red-flags-to-watch-for",
    excerpt: "A few early warning signs can save you a semester of stress.",
    published: true,
    bodyMarkdown: "# Roommate Red Flags",
  },
];

const BlogCategoryDetail = () => {
  const navigate = useNavigate();
  const { CategoryId } = useParams();

  // Later replace with real hooks like:
  // const { data: category, isLoading: categoryLoading } = useGetBlogCategoryById(id ?? "");
  // const { data: posts = [], isLoading: postsLoading } = useGetBlogPostsByCategory(id ?? "");

  const isLoading = false;

  const category = useMemo(() => {
    return fakeCategories.find((item) => item.id === CategoryId);
  }, [CategoryId]);

  const posts = useMemo(() => {
    return fakePosts.filter((item) => item.categoryId === CategoryId);
  }, [CategoryId]);

  if (isLoading) {
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
              {category.name}
            </h1>
            <p className="mt-2 text-sm text-zinc-600">
              {category.description || "No description provided."}
            </p>
          </div>

          <button
            onClick={() => navigate(`/admin/blog/${category.id}/create-post`)}
            className="inline-flex items-center justify-center rounded-xl bg-zinc-900 px-5 py-3 text-sm font-medium text-white transition hover:bg-zinc-800"
          >
            Create Post
          </button>
        </div>

        {posts.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-zinc-300 bg-white p-10 text-center shadow-sm">
            <h2 className="text-lg font-semibold text-zinc-900">
              No posts in this category
            </h2>
            <p className="mt-2 text-sm text-zinc-600">
              Create the first post for this category.
            </p>
            <button
              onClick={() => navigate(`/admin/blog/${category.id}/create-post`)}
              className="mt-5 inline-flex items-center justify-center rounded-xl bg-zinc-900 px-5 py-3 text-sm font-medium text-white transition hover:bg-zinc-800"
            >
              Create Post
            </button>
          </div>
        ) : (
          <div className="grid gap-4">
            {posts.map((post) => (
              <button
                key={post.id}
                onClick={() => navigate(`/admin/blog/post/${post.id}`)}
                className="group rounded-2xl border border-zinc-200 bg-white p-5 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-zinc-300 hover:shadow-md"
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-3">
                      <h2 className="text-lg font-semibold text-zinc-900 transition group-hover:text-zinc-700">
                        {post.title}
                      </h2>
                      <span className="rounded-full bg-zinc-100 px-2.5 py-1 text-xs font-medium text-zinc-600">
                        {post.slug}
                      </span>
                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                          post.published
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-amber-100 text-amber-700"
                        }`}
                      >
                        {post.published ? "Published" : "Draft"}
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
