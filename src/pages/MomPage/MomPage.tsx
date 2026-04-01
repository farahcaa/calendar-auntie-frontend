import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ProductDTO, useGetProducts, useGetRecentBlogPosts } from "@/gen";
import { useNavigate } from "react-router";
import PageHeader from "@/components/layout/PageHeader";
import { useState } from "react";
import ProductPopUp from "./ProductPopUp";

const PALETTE = {
  bg: "#FAF7F2", // warm cream
  text: "#121212",
  subtle: "#6B6B6B",
  line: "#E6E1D9",
};

export default function MomPage() {
  const { data } = useGetProducts();
  const navigate = useNavigate();
  const { data: blogPosts, isError: isBlogPostsError } =
    useGetRecentBlogPosts();
  const [selectedProduct, setSelectedProduct] = useState<ProductDTO | null>(
    null,
  );
  const tips = [
    {
      t: "Photo picking",
      b: "Mix close-ups & wide shots; keep lighting bright.",
    },
    { t: "Cropping", b: "Leave ~0.25 in safe margin—spirals & trims." },
    { t: "Delivery", b: "PNG/JPEG 300DPI." },
  ];

  const handleAddCartItem = (id: string) => {
    const raw = localStorage.getItem("cart");

    let items: string[] = [];

    if (raw) {
      try {
        items = JSON.parse(raw);
      } catch {
        items = [];
      }
    }

    if (!items.includes(id)) {
      items.push(id);
      localStorage.setItem("cart", JSON.stringify(items));
      alert("Item added!");
    } else {
      alert("Item already in cart!");
    }
  };
  // local helper for consistent layout
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

  return (
    <div
      className="min-h-screen bg-white text-[15px]"
      style={{ color: PALETTE.text }}
    >
      <PageHeader />
      {/* Hero */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0" aria-hidden>
          <img
            className="w-full h-full object-cover"
            alt="Collage hero"
            src="./hero.jpg"
          />
        </div>

        <div
          className="relative"
          style={{
            background: "linear-gradient(rgba(0,0,0,0.0), rgba(0,0,0,0.35))",
          }}
        >
          <Container className="pt-32 pb-28">
            <div className="max-w-2xl text-white">
              <motion.h1
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="font-serif text-5xl md:text-6xl leading-tight"
              >
                Elevated photo calendars for everyday luxury
              </motion.h1>

              <p className="mt-4 text-sm md:text-base opacity-90">
                Clean layouts. Neutral palette. Thoughtful details. Order via
                Printify or let me hand-package and mail directly to you.
              </p>

              <div className="mt-6 flex gap-3">
                <a href="#shop">
                  <Button
                    size="lg"
                    className="rounded-none bg-black text-white hover:bg-neutral-800"
                  >
                    Shop Calendars
                  </Button>
                </a>

                <a href="#tips">
                  <Button
                    size="lg"
                    variant="outline"
                    className="rounded-none border-white text-white hover:bg-white hover:text-black text-gray-600"
                  >
                    Learn More
                  </Button>
                </a>
              </div>
            </div>
          </Container>
        </div>
      </div>

      {/* Shop */}
      <Container className="py-16" id="shop">
        <div
          className="flex items-end justify-between border-b pb-4"
          style={{ borderColor: PALETTE.line }}
        >
          <h2 className="font-serif text-4xl tracking-tight">New Arrivals</h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mt-8">
          {data?.data.content?.map((p: ProductDTO) => {
            // adjust these paths to match your generated types
            const thumbnail =
              (p as ProductDTO)?.thumbnail ??
              (p as ProductDTO)?.data?.thumbnail;
            const title =
              (p as ProductDTO)?.title ?? (p as ProductDTO)?.data?.title;
            const description =
              (p as ProductDTO)?.description ??
              (p as ProductDTO)?.data?.description;
            const price =
              (p as ProductDTO)?.price ?? (p as ProductDTO)?.data?.price;
            const id = (p as ProductDTO)?.id ?? (p as ProductDTO)?.data?.id;

            return (
              <div
                key={(p as ProductDTO)?.id ?? title ?? Math.random()}
                className="group border rounded-sm overflow-hidden"
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedProduct(p);
                }}
              >
                <div className="overflow-hidden">
                  <img
                    src={`${import.meta.env.VITE_MEDIA_BASE_URL}/${thumbnail}`}
                    alt="calendar image"
                    className="w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>

                <div className="px-4 py-5">
                  <div className="flex items-center justify-between gap-4">
                    <div className="min-w-0">
                      <h3 className="font-semibold tracking-tight truncate">
                        {title}
                      </h3>
                      <p className="text-sm text-black line-clamp-2">
                        {description}
                      </p>
                    </div>
                    <div className="text-sm whitespace-nowrap">${price}</div>
                  </div>

                  <div className="mt-4 flex gap-2">
                    <Button
                      className="rounded-none text-sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAddCartItem(id);
                      }}
                    >
                      Add To cart
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        {selectedProduct && (
          <ProductPopUp
            product={selectedProduct}
            removeSelectedProduct={() => setSelectedProduct(null)}
            addToCart={(id) => handleAddCartItem(id)}
          />
        )}
      </Container>

      {/* SplitBanner */}
      <div className="my-20">
        <Container>
          <div className="grid md:grid-cols-2 gap-6 items-stretch">
            <div
              className="p-10 border flex flex-col justify-between"
              style={{ background: PALETTE.bg, borderColor: PALETTE.line }}
            >
              <div>
                <h3 className="font-serif text-3xl tracking-tight">
                  Made-to-order, thoughtfully packed
                </h3>
                <p className="mt-3 text-sm" style={{ color: PALETTE.subtle }}>
                  Choose automated Printify production or a hand-checked order
                  fulfilled by me. Either way, your photos get the white-glove
                  treatment.
                </p>
              </div>
              <div className="mt-6">
                <a href="#tips" className="underline">
                  How to prepare your photos
                </a>
              </div>
            </div>

            <div className="overflow-hidden">
              <img
                className="w-full h-full object-cover"
                alt="Calendars"
                src="./vert.jpg"
              />
            </div>
          </div>
        </Container>
      </div>

      {/* Tips */}
      <Container id="tips" className="py-16">
        <h2 className="font-serif text-4xl tracking-tight mb-6">
          Tips & Tricks
        </h2>

        <div className="grid md:grid-cols-2 gap-4">
          {tips.map((x, i) => (
            <div
              key={i}
              className="border p-6"
              style={{ background: PALETTE.bg, borderColor: PALETTE.line }}
            >
              <div
                className="uppercase tracking-wide text-xs"
                style={{ color: PALETTE.subtle }}
              >
                {x.t}
              </div>
              <div className="mt-1">{x.b}</div>
            </div>
          ))}
        </div>

        <div className="mt-8">
          <Tabs defaultValue="faqs">
            <TabsList className="rounded-none">
              <TabsTrigger value="faqs">FAQs</TabsTrigger>
              <TabsTrigger value="prep">Photo Prep</TabsTrigger>
            </TabsList>

            <TabsContent value="faqs" className="mt-4 space-y-2 text-sm">
              <p>
                <b>Turnaround.</b> Premade Calendars 3-5 days, Custom Calendars
                1-2 weeks
              </p>
              <p>
                <b>Shipping.</b> USPS/UPS with tracking; local pickup in
                Indianapolis.
              </p>
            </TabsContent>

            <TabsContent value="prep" className="mt-4 text-sm">
              <ul className="list-disc pl-5 space-y-1">
                <li>24–40 high-res photos (12 months + cover options)</li>
                <li>Birthdays/anniversaries to print on the grid (optional)</li>
                <li>Preferred fonts/colors or “surprise me”</li>
                <li>Deadline/date needed</li>
              </ul>
            </TabsContent>
          </Tabs>
        </div>
      </Container>

      {/* Blog */}
      <Container id="blog" className="py-16">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-serif text-4xl tracking-tight">Blog</h2>

          <button
            onClick={() => navigate("/blog")}
            className="text-sm underline hover:opacity-70"
            style={{ color: PALETTE.subtle }}
          >
            View all →
          </button>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {blogPosts?.data.map((p) => (
            <div
              key={p.id}
              onClick={() => navigate(`/blog/${p.categoryId}/${p.id}`)}
              className="border p-6 cursor-pointer hover:shadow-sm transition"
              style={{ borderColor: PALETTE.line }}
            >
              <div className="text-xs" style={{ color: PALETTE.subtle }}>
                {new Date(p.createdAt).toLocaleDateString(undefined, {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </div>

              <div className="font-semibold mt-1">{p.title}</div>

              <p className="text-sm mt-2" style={{ color: PALETTE.subtle }}>
                {p.excerpt}
              </p>
            </div>
          ))}
          {blogPosts?.data.length === 0 && (
            <div className="text-sm" style={{ color: PALETTE.subtle }}>
              No blog posts yet. Check back soon!
            </div>
          )}
          {isBlogPostsError && (
            <div className="text-sm" style={{ color: PALETTE.subtle }}>
              Failed to load blog posts.
            </div>
          )}
        </div>
      </Container>

      {/* Footer */}
      <div className="border-t" style={{ borderColor: PALETTE.line }}>
        <Container
          id="footer"
          className="py-12 grid md:grid-cols-4 gap-8 text-sm"
        >
          <div className="md:col-span-2">
            <div className="text-xl tracking-[0.18em]">JEANNE CALENDARS</div>
            <p className="mt-3" style={{ color: PALETTE.subtle }}>
              Elevated, modern calendars and prints. Designed in Indianapolis.
            </p>
          </div>

          <div>
            <div
              className="uppercase tracking-wide text-xs mb-2"
              style={{ color: PALETTE.subtle }}
            >
              Explore
            </div>
            <ul className="space-y-1">
              <li>
                <a href="#shop" className="hover:underline">
                  Shop
                </a>
              </li>
              <li>
                <a href="#tips" className="hover:underline">
                  Tips
                </a>
              </li>
              <li>
                <a href="#blog" className="hover:underline">
                  Journal
                </a>
              </li>
            </ul>
          </div>
        </Container>

        <div
          className="border-t py-6 text-xs"
          style={{ borderColor: PALETTE.line }}
        >
          <Container className="flex items-center justify-between">
            <div>© {new Date().getFullYear()} Jeanne Calendars</div>
            <div className="flex items-center gap-3">
              <a
                className="underline"
                href="mailto:jeanne.farah@calendarauntie.com"
              >
                Email
              </a>
            </div>
          </Container>
        </div>
      </div>
    </div>
  );
}
