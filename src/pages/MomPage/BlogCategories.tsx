import PageHeader from "@/components/layout/PageHeader";
import { useGetBlogCategories } from "@/gen";

import React from "react";
import { useNavigate } from "react-router";

const PALETTE = {
  bg: "#FAF7F2",
  text: "#121212",
  subtle: "#6B6B6B",
  line: "#E6E1D9",
};

const Container = ({
  children,
  className = "",
  id,
}: {
  children: React.ReactNode;
  className?: string;
  id?: string;
}) => (
  <div id={id} className={`mx-auto max-w-[1180px] px-4 ${className}`}>
    {children}
  </div>
);

export default function BlogCategoriesPage() {
  const navigate = useNavigate();
  const { data: categories, isLoading } = useGetBlogCategories();
  return (
    <div
      className="min-h-screen bg-white text-[15px]"
      style={{ color: PALETTE.text }}
    >
      <PageHeader />
      <Container className="py-16">
        <div
          className="flex items-end justify-between border-b pb-4"
          style={{ borderColor: PALETTE.line }}
        >
          <div>
            <div
              className="uppercase tracking-[0.2em] text-xs mb-2"
              style={{ color: PALETTE.subtle }}
            >
              Blog
            </div>
            <h1 className="font-serif text-4xl tracking-tight">
              Blog Categories
            </h1>
          </div>
        </div>

        {isLoading ? (
          <div className="py-12 text-sm" style={{ color: PALETTE.subtle }}>
            Loading categories...
          </div>
        ) : !categories?.data?.length ? (
          <div className="py-12 text-sm" style={{ color: PALETTE.subtle }}>
            No categories found.
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
            {categories.data.map((category) => (
              <button
                key={category.id}
                onClick={() => navigate(`/blog/${category.id}`)}
                className="text-left border p-6 hover:shadow-sm transition"
                style={{ borderColor: PALETTE.line, background: PALETTE.bg }}
              >
                <div
                  className="uppercase tracking-wide text-xs"
                  style={{ color: PALETTE.subtle }}
                >
                  Category
                </div>

                <div className="font-semibold text-lg mt-2">
                  {category.name}
                </div>

                {category.description && (
                  <p
                    className="text-sm mt-3 line-clamp-3"
                    style={{ color: PALETTE.subtle }}
                  >
                    {category.description}
                  </p>
                )}

                <div className="mt-5 text-sm underline">Open category →</div>
              </button>
            ))}
          </div>
        )}
      </Container>
    </div>
  );
}
