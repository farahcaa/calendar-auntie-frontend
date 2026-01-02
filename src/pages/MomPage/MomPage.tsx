import { motion } from "framer-motion";
import { ShoppingCart, ChevronDown, X, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { GetProducts200, useGetProducts } from "@/gen";
import { useState } from "react";
import { useNavigate } from "react-router";

const PALETTE = {
  bg: "#FAF7F2", // warm cream
  text: "#121212",
  subtle: "#6B6B6B",
  line: "#E6E1D9",
};

export default function MomPage() {
  const { data } = useGetProducts();
  const navigate = useNavigate();

  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const tips = [
    {
      t: "Photo picking",
      b: "Mix close-ups & wide shots; keep lighting bright.",
    },
    { t: "Cropping", b: "Leave ~0.25 in safe margin—spirals & trims." },
    { t: "Delivery", b: "PNG/JPEG 300DPI." },
  ];

  const posts = [
    {
      title: "Building a clean collage layout",
      date: "Oct 2025",
      excerpt:
        "My go-to is a 3×3 or 4×3 grid with generous gutters and calm margins…",
    },
    {
      title: "Fonts that pair with Black Mango",
      date: "Sep 2025",
      excerpt:
        "A refined serif for headlines, a modern sans for body—timeless and readable.",
    },
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

  // NOTE: You have an API-model mismatch in your original snippet:
  // - You call <ProductCard data={p} /> but your ProductCard signature is function ProductCard(data: GetProducts200)
  // This version just renders inline and assumes the backend returns:
  // data.data.content: Array<{ thumbnail, title, description, price, id? }>
  // Adjust fields as needed.

  return (
    <div
      className="min-h-screen bg-white text-[15px]"
      style={{ color: PALETTE.text }}
    >
      {/* TopBar */}
      <div
        className="sticky top-0 bg-white/90 z-50 w-full border-b backdrop-blur"
        style={{ borderColor: PALETTE.line }}
      >
        <Container className="py-3 flex items-center justify-between">
          {/* Left: desktop nav / mobile hamburger */}
          <div className="flex items-center gap-6 text-sm">
            {/* Mobile: hamburger */}
            <button
              className="flex items-center justify-center md:hidden rounded-full border px-2 py-1 text-xs hover:bg-neutral-50"
              onClick={() => setMobileNavOpen((prev) => !prev)}
              aria-label="Toggle navigation"
            >
              {mobileNavOpen ? (
                <X className="w-4 h-4" />
              ) : (
                <Menu className="w-4 h-4" />
              )}
            </button>

            {/* Desktop nav */}
            <div className="hidden md:flex items-center gap-6">
              <a className="hover:opacity-70" href="#shop">
                Shop
              </a>

              <div className="group relative">
                <button className="inline-flex items-center gap-1 hover:opacity-70">
                  Collections <ChevronDown className="w-4 h-4" />
                </button>

                <div
                  className="invisible group-hover:visible opacity-0 group-hover:opacity-100 transition absolute left-0 mt-3 bg-white shadow-xl border rounded-xl p-6 grid grid-cols-2 gap-6 min-w-[520px]"
                  style={{ borderColor: PALETTE.line }}
                >
                  <div>
                    <p className="uppercase tracking-wide text-xs text-neutral-500 mb-2">
                      Calendars
                    </p>
                    <ul className="space-y-1 text-sm">
                      <li>
                        <a href="#shop" className="hover:underline">
                          Family Collage
                        </a>
                      </li>
                      <li>
                        <a href="#shop" className="hover:underline">
                          Mantra Series
                        </a>
                      </li>
                      <li>
                        <a href="#shop" className="hover:underline">
                          Custom Dates
                        </a>
                      </li>
                    </ul>
                  </div>

                  <div>
                    <p className="uppercase tracking-wide text-xs text-neutral-500 mb-2">
                      Art Prints
                    </p>
                    <ul className="space-y-1 text-sm">
                      <li>
                        <a href="#shop" className="hover:underline">
                          Coffee Quotes
                        </a>
                      </li>
                      <li>
                        <a href="#shop" className="hover:underline">
                          Nature
                        </a>
                      </li>
                      <li>
                        <a href="#shop" className="hover:underline">
                          Minimal
                        </a>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              <a className="hover:opacity-70" href="#tips">
                Tips
              </a>
              <a className="hover:opacity-70" href="#blog">
                Journal
              </a>
            </div>
          </div>

          {/* Center: brand (slightly smaller on mobile) */}
          <div className="text-sm md:text-xl tracking-[0.18em] text-center flex-1 md:flex-none">
            JEANNE CALENDARS
          </div>

          {/* Right: contact + cart */}
          <div className="flex items-center gap-3 text-sm justify-end">
            <a
              className="hover:opacity-70 hidden sm:inline"
              href="mailto:hello@example.com"
            >
              Contact
            </a>
            <button
              className="inline-flex items-center gap-1 sm:gap-2 hover:opacity-70 rounded-full border px-2 py-1 text-xs sm:text-sm"
              onClick={() => navigate("/checkout")}
            >
              <ShoppingCart className="w-4 h-4" />
              <span className="hidden xs:inline">Cart</span>
            </button>
          </div>
        </Container>

        {/* Mobile nav dropdown */}
        {mobileNavOpen && (
          <div
            className="md:hidden border-t"
            style={{ borderColor: PALETTE.line }}
          >
            <Container className="py-3 space-y-3 text-sm">
              <a
                href="#shop"
                className="block hover:opacity-80"
                onClick={() => setMobileNavOpen(false)}
              >
                Shop
              </a>

              <details className="group">
                <summary className="flex items-center justify-between cursor-pointer hover:opacity-80">
                  <span>Collections</span>
                  <ChevronDown className="w-4 h-4" />
                </summary>
                <div className="mt-2 pl-3 space-y-1 text-xs text-neutral-700">
                  <div className="uppercase tracking-wide text-[10px] text-neutral-500">
                    Calendars
                  </div>
                  <a
                    href="#shop"
                    className="block hover:underline"
                    onClick={() => setMobileNavOpen(false)}
                  >
                    Family Collage
                  </a>
                  <a
                    href="#shop"
                    className="block hover:underline"
                    onClick={() => setMobileNavOpen(false)}
                  >
                    Mantra Series
                  </a>
                  <a
                    href="#shop"
                    className="block hover:underline"
                    onClick={() => setMobileNavOpen(false)}
                  >
                    Custom Dates
                  </a>

                  <div className="mt-3 uppercase tracking-wide text-[10px] text-neutral-500">
                    Art Prints
                  </div>
                  <a
                    href="#shop"
                    className="block hover:underline"
                    onClick={() => setMobileNavOpen(false)}
                  >
                    Coffee Quotes
                  </a>
                  <a
                    href="#shop"
                    className="block hover:underline"
                    onClick={() => setMobileNavOpen(false)}
                  >
                    Nature
                  </a>
                  <a
                    href="#shop"
                    className="block hover:underline"
                    onClick={() => setMobileNavOpen(false)}
                  >
                    Minimal
                  </a>
                </div>
              </details>

              <a
                href="#tips"
                className="block hover:opacity-80"
                onClick={() => setMobileNavOpen(false)}
              >
                Tips
              </a>
              <a
                href="#blog"
                className="block hover:opacity-80"
                onClick={() => setMobileNavOpen(false)}
              >
                Journal
              </a>
              <a
                href="mailto:hello@example.com"
                className="block hover:opacity-80"
                onClick={() => setMobileNavOpen(false)}
              >
                Contact
              </a>
            </Container>
          </div>
        )}
      </div>

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
          {data?.data.content?.map((p: GetProducts200) => {
            // adjust these paths to match your generated types
            const thumbnail =
              (p as any)?.thumbnail ?? (p as any)?.data?.thumbnail;
            const title = (p as any)?.title ?? (p as any)?.data?.title;
            const description =
              (p as any)?.description ?? (p as any)?.data?.description;
            const price = (p as any)?.price ?? (p as any)?.data?.price;
            const id = (p as any)?.id ?? (p as any)?.data?.id;
            console.log(p);
            return (
              <div
                key={(p as any)?.id ?? title ?? Math.random()}
                className="group border rounded-sm overflow-hidden"
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
                      onClick={() => {
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

      {/* Journal */}
      <Container id="blog" className="py-16">
        <h2 className="font-serif text-4xl tracking-tight mb-6">Journal</h2>
        <div className="grid md:grid-cols-2 gap-6">
          {posts.map((p, i) => (
            <div
              key={i}
              className="border p-6"
              style={{ borderColor: PALETTE.line }}
            >
              <div className="text-xs" style={{ color: PALETTE.subtle }}>
                {p.date}
              </div>
              <div className="font-semibold mt-1">{p.title}</div>
              <p className="text-sm mt-2" style={{ color: PALETTE.subtle }}>
                {p.excerpt}
              </p>
            </div>
          ))}
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
