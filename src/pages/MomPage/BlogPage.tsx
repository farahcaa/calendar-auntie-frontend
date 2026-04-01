import { useGetBlogPostById } from "@/gen";
import React from "react";
import ReactMarkdown from "react-markdown";
import remarkBreaks from "remark-breaks";
import { useNavigate, useParams } from "react-router";
import PageHeader from "@/components/layout/PageHeader";

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
  <div id={id} className={`mx-auto max-w-[860px] px-4 ${className}`}>
    {children}
  </div>
);

const BlogPage = () => {
  const navigate = useNavigate();
  const { postId } = useParams();

  const {
    data: post,
    isLoading,
    isError,
  } = useGetBlogPostById(postId ?? "", {
    query: {
      enabled: !!postId,
    },
  });

  return (
    <div
      className="min-h-screen bg-white text-[15px]"
      style={{ color: PALETTE.text }}
    >
      <PageHeader />
      <Container className="py-16">
        <div className="mb-8">
          <button
            onClick={() => navigate("/blog")}
            className="text-sm underline hover:opacity-70"
            style={{ color: PALETTE.subtle }}
          >
            ← Back to blog
          </button>
        </div>

        {isLoading ? (
          <div className="text-sm" style={{ color: PALETTE.subtle }}>
            Loading post...
          </div>
        ) : isError || !post ? (
          <div className="text-sm" style={{ color: PALETTE.subtle }}>
            Post not found.
          </div>
        ) : (
          <>
            <header
              className="border-b pb-8 mb-10"
              style={{ borderColor: PALETTE.line }}
            >
              {post.data?.createdAt && (
                <div className="text-xs mb-3" style={{ color: PALETTE.subtle }}>
                  {new Date(post.data?.createdAt).toLocaleDateString(
                    undefined,
                    {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    },
                  )}
                </div>
              )}

              <h1 className="font-serif text-4xl md:text-5xl leading-tight tracking-tight">
                {post.data?.title}
              </h1>

              {post.data?.excerpt && (
                <p
                  className="mt-5 text-base max-w-2xl"
                  style={{ color: PALETTE.subtle }}
                >
                  {post.data?.excerpt}
                </p>
              )}
            </header>

            <article className="prose prose-neutral max-w-none">
              <ReactMarkdown remarkPlugins={[remarkBreaks]}>
                {post.data?.bodyMarkdown ?? ""}
              </ReactMarkdown>
            </article>
          </>
        )}
      </Container>
    </div>
  );
};

export default BlogPage;
