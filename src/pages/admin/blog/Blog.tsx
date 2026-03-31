import { useMemo } from "react";
import { useNavigate } from "react-router";

type BlogCategoryDto = {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
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
  {
    id: "9f8f8f8a-4444-4b2d-9c11-444444444444",
    name: "Roommate Advice",
    slug: "roommate-advice",
    description: "Choosing roommates and keeping the peace.",
  },
];

const Blog = () => {
  const navigate = useNavigate();

  // Replace this later with:
  // const { data: categories, isLoading } = useGetBlogCategories();
  const isLoading = false;

  const categories = useMemo<BlogCategoryDto[]>(() => {
    return fakeCategories;
  }, []);

  return (
    <div className="min-h-screen bg-zinc-50 px-6 py-10">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-medium uppercase tracking-wide text-zinc-500">
              Admin
            </p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight text-zinc-900">
              Blog Categories
            </h1>
            <p className="mt-2 text-sm text-zinc-600">
              Manage blog categories and navigate into category detail pages.
            </p>
          </div>

          <button
            onClick={() => navigate("/admin/blog-create-category")}
            className="inline-flex items-center justify-center rounded-xl bg-zinc-900 px-5 py-3 text-sm font-medium text-white transition hover:bg-zinc-800"
          >
            Create Category
          </button>
        </div>

        {isLoading ? (
          <div className="space-y-4">
            {[...Array(4)].map((_, index) => (
              <div
                key={index}
                className="animate-pulse rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm"
              >
                <div className="h-5 w-48 rounded bg-zinc-200" />
                <div className="mt-3 h-4 w-72 rounded bg-zinc-100" />
                <div className="mt-4 h-3 w-40 rounded bg-zinc-100" />
              </div>
            ))}
          </div>
        ) : categories.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-zinc-300 bg-white p-10 text-center shadow-sm">
            <h2 className="text-lg font-semibold text-zinc-900">
              No categories yet
            </h2>
            <p className="mt-2 text-sm text-zinc-600">
              Create your first blog category to get started.
            </p>
            <button
              onClick={() => navigate("/admin/blog-category-create")}
              className="mt-5 inline-flex items-center justify-center rounded-xl bg-zinc-900 px-5 py-3 text-sm font-medium text-white transition hover:bg-zinc-800"
            >
              Create Category
            </button>
          </div>
        ) : (
          <div className="grid gap-4">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => navigate(`/admin/blog/${category.id}`)}
                className="group rounded-2xl border border-zinc-200 bg-white p-5 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-zinc-300 hover:shadow-md"
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0">
                    <div className="flex items-center gap-3">
                      <h2 className="text-lg font-semibold text-zinc-900 transition group-hover:text-zinc-700">
                        {category.name}
                      </h2>
                      <span className="rounded-full bg-zinc-100 px-2.5 py-1 text-xs font-medium text-zinc-600">
                        {category.slug}
                      </span>
                    </div>

                    <p className="mt-2 text-sm text-zinc-600">
                      {category.description || "No description provided."}
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

export default Blog;
