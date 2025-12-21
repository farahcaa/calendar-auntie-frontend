import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { ShoppingCart, ExternalLink, Mail, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { GetProducts200, useGetProducts } from "@/gen";

/**
 * Jeanne Calendars – "Modern Retail" theme inspired by Banana Republic
 * A luxe, editorial look: oversized hero, clean nav, neutral palette,
 * generous white space, minimal lines, tall type, hover zoom on products.
 *
 * How to use:
 *  - Replace PRINTIFY_URL, contact email, product data and images.
 *  - Fonts: Pair a classy serif for headings (e.g., "Playfair Display" or
 *    "Libre Baskerville") with Inter/Poppins for body (add via <link> in _app).
 */

const PRINTIFY_URL = "https://your-printify-or-shop-url.example";

const PALETTE = {
  bg: "#FAF7F2", // warm cream
  text: "#121212",
  subtle: "#6B6B6B",
  line: "#E6E1D9",
};

const PRODUCTS = [
  {
    id: "cal-2026",
    title: "2026 Photo Calendar",
    subtitle: "Premium matte · 11.5×14 in",
    price: 38,
    image:
      "https://images.unsplash.com/photo-1513151233558-d860c5398176?q=80&w=1600&auto=format&fit=crop",
    printifyUrl: PRINTIFY_URL,
    options: [
      { key: "size", label: "Size", values: ["11.5×14 in", "8.5×11 in"] },
      { key: "paper", label: "Paper", values: ["Matte", "Silk"] },
    ],
  },
  {
    id: "coffee-quotes",
    title: "Coffee Quote Prints (Set of 3)",
    subtitle: "8×10 in · heavyweight",
    price: 24,
    image:
      "https://images.unsplash.com/photo-1513151233558-d860c5398176?q=80&w=1600&auto=format&fit=crop",
    printifyUrl: PRINTIFY_URL,
    options: [{ key: "size", label: "Size", values: ["8×10 in", "11×14 in"] }],
  },
  {
    id: "wall-prints",
    title: "Minimal Wall Prints",
    subtitle: "Gallery set · neutral inks",
    price: 49,
    image:
      "https://images.unsplash.com/photo-1513151233558-d860c5398176?q=80&w=1600&auto=format&fit=crop",
    printifyUrl: PRINTIFY_URL,
    options: [
      { key: "size", label: "Size", values: ["8×10", "11×14", "16×20"] },
    ],
  },
];

function Container({ children, className = "", id }) {
  return (
    <div id={id} className={`mx-auto max-w-[1180px] px-4 ${className}`}>
      {children}
    </div>
  );
}

function TopBar() {
  return (
    <div className="w-full border-b" style={{ borderColor: PALETTE.line }}>
      <Container id="" className="py-3 flex items-center justify-between">
        <div className="flex items-center gap-6 text-sm">
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
        <div className="text-xl tracking-[0.18em]">JEANNE CALENDARS</div>
        <div className="flex items-center gap-4 text-sm">
          <a className="hover:opacity-70" href="mailto:hello@example.com">
            Contact
          </a>
          <button className="inline-flex items-center gap-2 hover:opacity-70">
            <ShoppingCart className="w-4 h-4" />
            Cart
          </button>
        </div>
      </Container>
    </div>
  );
}

function Hero() {
  return (
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
        <Container id="" className="pt-32 pb-28">
          <div className="max-w-2xl text-white">
            <motion.h1
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="font-serif text-5xl md:text-6xl leading-tight "
            >
              Elevated photo calendars for everyday luxury
            </motion.h1>
            <p className="mt-4 text-sm md:text-base opacity-90">
              Clean layouts. Neutral palette. Thoughtful details. Order via
              Printify or let me hand‑package and mail directly to you.
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
  );
}

function ProductCard(data: GetProducts200) {
  console.log(data);
  return (
    <div className="group border rounded-sm overflow-hidden">
      <div className="overflow-hidden">
        <img
          src={import.meta.env.VITE_MEDIA_BASE_URL + "/" + data.data.thumbnail}
          alt={"calendar image"}
          className="w-full h-80 object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>
      <div className="px-4 py-5">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold tracking-tight">{data.data.title}</h3>
            <p className="text-sm text-black">{data.data.description}</p>
          </div>
          <div className="text-sm">${data.data.price}</div>
        </div>
        <div className="mt-4 flex gap-2">
          <Button className="rounded-none text-sm">Direct Order</Button>
        </div>
      </div>
    </div>
  );
}

function DirectOrderDialog({ open, setOpen, product }) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    address: "",
    quantity: 1,
    notes: "",
    options: {},
  });
  const mailtoHref = useMemo(() => {
    if (!product) return "#";
    const subject = encodeURIComponent(`Direct Order: ${product.title}`);
    const body = encodeURIComponent(
      [
        `Product: ${product.title}`,
        `Quantity: ${form.quantity}`,
        ...Object.entries(form.options).map(([k, v]) => `${k}: ${v}`),
        `Name: ${form.name}`,
        `Email: ${form.email}`,
        `Address: ${form.address}`,
        `Notes: ${form.notes}`,
      ].join("")
    );
    return `mailto:hello@example.com?subject=${subject}&body=${body}`;
  }, [form, product]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[680px]">
        <DialogHeader>
          <DialogTitle className="font-serif tracking-tight">
            Direct order – {product?.title}
          </DialogTitle>
        </DialogHeader>
        <div className="grid gap-3">
          {product?.options?.length ? (
            <div className="grid sm:grid-cols-2 gap-3">
              {product.options.map((opt) => (
                <div key={opt.key} className="grid gap-1">
                  <label className="text-xs" style={{ color: PALETTE.subtle }}>
                    {opt.label}
                  </label>
                  <select
                    className="border px-3 py-2"
                    style={{ borderColor: PALETTE.line }}
                    onChange={(e) =>
                      setForm((f) => ({
                        ...f,
                        options: { ...f.options, [opt.label]: e.target.value },
                      }))
                    }
                  >
                    <option value="">Select…</option>
                    {opt.values.map((v) => (
                      <option key={v} value={v}>
                        {v}
                      </option>
                    ))}
                  </select>
                </div>
              ))}
            </div>
          ) : null}

          <div className="grid sm:grid-cols-2 gap-3">
            <div className="grid gap-1">
              <label className="text-xs" style={{ color: PALETTE.subtle }}>
                Your name
              </label>
              <Input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </div>
            <div className="grid gap-1">
              <label className="text-xs" style={{ color: PALETTE.subtle }}>
                Email
              </label>
              <Input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </div>
            <div className="grid gap-1">
              <label className="text-xs" style={{ color: PALETTE.subtle }}>
                Quantity
              </label>
              <Input
                type="number"
                min={1}
                value={form.quantity}
                onChange={(e) =>
                  setForm({ ...form, quantity: Number(e.target.value) })
                }
              />
            </div>
            <div className="sm:col-span-2 grid gap-1">
              <label className="text-xs" style={{ color: PALETTE.subtle }}>
                Shipping address
              </label>
              <Textarea
                rows={3}
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
              />
            </div>
            <div className="sm:col-span-2 grid gap-1">
              <label className="text-xs" style={{ color: PALETTE.subtle }}>
                Notes (deadlines, special requests)
              </label>
              <Textarea
                rows={3}
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
              />
            </div>
          </div>
          <div className="flex items-center justify-between pt-1">
            <a href={mailtoHref}>
              <Button className="rounded-none">
                <Mail className="w-4 h-4 mr-2" />
                Email order request
              </Button>
            </a>
            <p className="text-xs" style={{ color: PALETTE.subtle }}>
              (You’ll receive a quote by email before paying.)
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function Shop() {
  const [selected, setSelected] = useState(null);
  const [open, setOpen] = useState(false);
  const { data } = useGetProducts();

  console.log(data);

  return (
    <Container className="py-16" id="shop">
      <div
        className="flex items-end justify-between border-b pb-4"
        style={{ borderColor: PALETTE.line }}
      >
        <h2 className="font-serif text-4xl tracking-tight">New Arrivals</h2>
      </div>
      <div className="grid md:grid-cols-3 gap-8 mt-8">
        {data?.data.content.map((p: GetProducts200) => (
          <ProductCard data={p} />
        ))}
      </div>
      <DirectOrderDialog open={open} setOpen={setOpen} product={selected} />
    </Container>
  );
}

function SplitBanner() {
  return (
    <div className="my-20">
      <Container id="">
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
                Choose automated Printify production or a hand‑checked order
                fulfilled by me. Either way, your photos get the white‑glove
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
  );
}

function Tips() {
  const tips = [
    {
      t: "Photo picking",
      b: "Mix close‑ups & wide shots; keep lighting bright.",
    },
    { t: "Cropping", b: "Leave ~0.25 in safe margin—spirals & trims." },
    { t: "Mantras", b: "3–6 words read best. Keep it simple." },
    { t: "Delivery", b: "PNG/JPEG 300DPI; HEIC ok—I’ll convert." },
  ];
  return (
    <Container id="tips" className="py-16">
      <h2 className="font-serif text-4xl tracking-tight mb-6">Tips & Tricks</h2>
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
              <b>Turnaround.</b> Printify per listing; direct orders 5–7
              business days after proof.
            </p>
            <p>
              <b>Proofs.</b> PDF proof included with one round of edits.
            </p>
            <p>
              <b>Shipping.</b> USPS/UPS with tracking; local pickup in
              Indianapolis.
            </p>
          </TabsContent>
          <TabsContent value="prep" className="mt-4 text-sm">
            <ul className="list-disc pl-5 space-y-1">
              <li>24–40 high‑res photos (12 months + cover options)</li>
              <li>Birthdays/anniversaries to print on the grid (optional)</li>
              <li>Preferred fonts/colors or “surprise me”</li>
              <li>Deadline/date needed</li>
            </ul>
          </TabsContent>
        </Tabs>
      </div>
    </Container>
  );
}

function Journal() {
  const posts = [
    {
      title: "Building a clean collage layout",
      date: "Oct 2025",
      excerpt:
        "My go‑to is a 3×3 or 4×3 grid with generous gutters and calm margins…",
    },
    {
      title: "Fonts that pair with Black Mango",
      date: "Sep 2025",
      excerpt:
        "A refined serif for headlines, a modern sans for body—timeless and readable.",
    },
  ];
  return (
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
  );
}

function Footer() {
  return (
    <div className="border-t" style={{ borderColor: PALETTE.line }}>
      <Container className="py-12 grid md:grid-cols-4 gap-8 text-sm">
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
        <div>
          <div
            className="uppercase tracking-wide text-xs mb-2"
            style={{ color: PALETTE.subtle }}
          >
            Newsletter
          </div>
          <div className="flex gap-2">
            <Input placeholder="your@email.com" className="rounded-none" />
            <Button className="rounded-none">Join</Button>
          </div>
          <div className="mt-2 text-xs" style={{ color: PALETTE.subtle }}>
            By subscribing, you agree to receive updates.
          </div>
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
              href={PRINTIFY_URL}
              target="_blank"
              rel="noreferrer"
            >
              Printify Shop
            </a>
            <span>•</span>
            <a className="underline" href="mailto:hello@example.com">
              Email
            </a>
          </div>
        </Container>
      </div>
    </div>
  );
}

export default function MomPage() {
  return (
    <div
      className="min-h-screen bg-white text-[15px]"
      style={{ color: PALETTE.text }}
    >
      <TopBar />
      <Hero />
      <Shop />
      <SplitBanner />
      <Tips />
      <Journal />
      <Footer />
    </div>
  );
}
