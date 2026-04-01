import PageHeader from "@/components/layout/PageHeader";
import { useGetBlogsByCategoryId, useGetBlogCategoryById } from "@/gen";

import React from "react";
import { useNavigate, useParams } from "react-router";

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

const BlogPosts = () => {
  const navigate = useNavigate();
  const { categoryId } = useParams();

  const { data: category, isLoading: isCategoryLoading } =
    useGetBlogCategoryById(categoryId ?? "", {
      query: {
        enabled: !!categoryId,
      },
    });

  const {
    data: posts,
    isLoading: isPostsLoading,
    isError,
  } = useGetBlogsByCategoryId(categoryId ?? "", {
    query: {
      enabled: !!categoryId,
    },
  });

  return (
    <div
      className="min-h-screen bg-white text-[15px]"
      style={{ color: PALETTE.text }}
    >
      <PageHeader />
      <Container className="py-16">
        <div className="mb-6">
          <button
            onClick={() => navigate("/blog")}
            className="text-sm underline hover:opacity-70"
            style={{ color: PALETTE.subtle }}
          >
            ← Back to categories
          </button>
        </div>

        <div className="border-b pb-6" style={{ borderColor: PALETTE.line }}>
          <div
            className="uppercase tracking-[0.2em] text-xs mb-2"
            style={{ color: PALETTE.subtle }}
          >
            Category
          </div>

          <h1 className="font-serif text-4xl tracking-tight">
            {isCategoryLoading
              ? "Loading..."
              : (category?.data?.name ?? "Blog Posts")}
          </h1>

          {category?.data?.description && (
            <p
              className="max-w-2xl mt-4 text-sm"
              style={{ color: PALETTE.subtle }}
            >
              {category?.data?.description}
            </p>
          )}
        </div>

        {isPostsLoading ? (
          <div className="py-12 text-sm" style={{ color: PALETTE.subtle }}>
            Loading posts...
          </div>
        ) : isError ? (
          <div className="py-12 text-sm" style={{ color: PALETTE.subtle }}>
            Failed to load posts.
          </div>
        ) : !posts?.data?.length ? (
          <div className="py-12 text-sm" style={{ color: PALETTE.subtle }}>
            No posts in this category yet.
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6 mt-8">
            {posts.data.map((post) => (
              <button
                key={post.id}
                onClick={() => navigate(`/blog/${categoryId}/${post.id}`)}
                className="text-left border p-6 hover:shadow-sm transition"
                style={{ borderColor: PALETTE.line, background: "white" }}
              >
                {post.createdAt && (
                  <div className="text-xs" style={{ color: PALETTE.subtle }}>
                    {new Date(post.createdAt).toLocaleDateString(undefined, {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </div>
                )}

                <div className="font-semibold mt-2 text-lg">{post.title}</div>

                {post.excerpt && (
                  <p
                    className="text-sm mt-3 line-clamp-3"
                    style={{ color: PALETTE.subtle }}
                  >
                    {post.excerpt}
                  </p>
                )}

                <div className="mt-5 text-sm underline">Read post →</div>
              </button>
            ))}
          </div>
        )}
      </Container>
    </div>
  );
};

export default BlogPosts;
