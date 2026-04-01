import { ChevronDown, Menu, ShoppingCart, X } from "lucide-react";
import React from "react";
import { useNavigate } from "react-router";

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
const PALETTE = {
  bg: "#FAF7F2",
  text: "#121212",
  subtle: "#6B6B6B",
  line: "#E6E1D9",
};

const PageHeader = () => {
  const [mobileNavOpen, setMobileNavOpen] = React.useState(false);
  const navigate = useNavigate();
  return (
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
            <a className="hover:opacity-70" href="/#shop">
              Shop
            </a>

            <div className="group relative">
              <button className="inline-flex items-center gap-1 group-hover:opacity-70">
                Collections <ChevronDown className="w-4 h-4" />
              </button>

              <div
                className="invisible group-hover:visible opacity-0 group-hover:opacity-100 transition absolute left-0 bg-white shadow-xl border rounded-xl p-6 grid grid-cols-2 gap-6 min-w-[520px]"
                style={{ borderColor: PALETTE.line }}
              >
                <div>
                  <p className="uppercase tracking-wide text-xs text-neutral-500 mb-2">
                    Calendars
                  </p>
                  <ul className="space-y-1 text-sm">
                    <li>
                      <a href="/#shop" className="hover:underline">
                        Family Collage
                      </a>
                    </li>
                    <li>
                      <a href="/#shop" className="hover:underline">
                        Mantra Series
                      </a>
                    </li>
                    <li>
                      <a href="/#shop" className="hover:underline">
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
                      <a href="/#shop" className="hover:underline">
                        Coffee Quotes
                      </a>
                    </li>
                    <li>
                      <a href="/#shop" className="hover:underline">
                        Nature
                      </a>
                    </li>
                    <li>
                      <a href="/#shop" className="hover:underline">
                        Minimal
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <a className="hover:opacity-70" href="/#tips">
              Tips
            </a>
            <a className="hover:opacity-70" href="/blog">
              Blog
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
              href="/#shop"
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
                  href="/#shop"
                  className="block hover:underline"
                  onClick={() => setMobileNavOpen(false)}
                >
                  Family Collage
                </a>
                <a
                  href="/#shop"
                  className="block hover:underline"
                  onClick={() => setMobileNavOpen(false)}
                >
                  Mantra Series
                </a>
                <a
                  href="/#shop"
                  className="block hover:underline"
                  onClick={() => setMobileNavOpen(false)}
                >
                  Custom Dates
                </a>

                <div className="mt-3 uppercase tracking-wide text-[10px] text-neutral-500">
                  Art Prints
                </div>
                <a
                  href="/#shop"
                  className="block hover:underline"
                  onClick={() => setMobileNavOpen(false)}
                >
                  Coffee Quotes
                </a>
                <a
                  href="/#shop"
                  className="block hover:underline"
                  onClick={() => setMobileNavOpen(false)}
                >
                  Nature
                </a>
                <a
                  href="/#shop"
                  className="block hover:underline"
                  onClick={() => setMobileNavOpen(false)}
                >
                  Minimal
                </a>
              </div>
            </details>

            <a
              href="/#tips"
              className="block hover:opacity-80"
              onClick={() => setMobileNavOpen(false)}
            >
              Tips
            </a>
            <a
              href="/#blog"
              className="block hover:opacity-80"
              onClick={() => setMobileNavOpen(false)}
            >
              Blog
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
  );
};

export default PageHeader;
