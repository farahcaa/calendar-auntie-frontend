import { useGetCheckoutPricing, useGetProductsItems } from "@/gen";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";

type Item = {
  id: string;
  quantity: number;
};

const Checkout = () => {
  const navigate = useNavigate();

  const [items, setItems] = useState<Item[]>([]);
  const [ids, setIds] = useState<string[]>([]);

  const { data: cartData } = useGetProductsItems({ ids });
  const { data: taxData } = useGetCheckoutPricing();

  useEffect(() => {
    const raw = localStorage.getItem("cart");
    let parsedIds: string[] = [];

    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) parsedIds = parsed.map(String);
      } catch {
        parsedIds = [];
      }
    }

    const uniqueIds = Array.from(new Set(parsedIds));
    setIds(uniqueIds);
    setItems(uniqueIds.map((id) => ({ id, quantity: 1 })));
  }, []);

  const removeItem = (id: string) => {
    setItems((prev) => prev.filter((it) => it.id !== id));

    // sync to localStorage
    const raw = localStorage.getItem("cart");
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          const next = parsed.filter((x: string) => x !== id);
          localStorage.setItem("cart", JSON.stringify(next));
        }
      } catch {
        alert("Error removing item");
      }
    }
  };

  const calculateSub = () => {
    if (!cartData?.data) return 0;
    return items.reduce((total, item) => {
      const product = cartData.data.find((p) => p.id === item.id);
      return product ? total + item.quantity * product.price : total;
    }, 0);
  };

  const shipping = items.length === 0 ? 0 : (taxData?.data.shipping ?? 0);
  const tax = items.length === 0 ? 0 : (taxData?.data.tax ?? 0);
  const subtotal = calculateSub();
  const total = items.length === 0 ? 0 : subtotal + shipping + tax;

  const handleContinue = () => {
    localStorage.setItem("checkout", JSON.stringify(items));
    navigate("/details"); // ⬅️ new navigation
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <div>
            <h1 className="text-xl font-semibold text-slate-900">Checkout</h1>
            <p className="text-xs text-slate-500">
              Review your cart before entering your information
            </p>
          </div>

          <button
            onClick={() => navigate("/")}
            className="rounded-2xl border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition"
          >
            ✕ Close
          </button>
        </div>
      </header>

      {/* Body */}
      <main className="mx-auto max-w-6xl px-4 py-8">
        {items.length === 0 ? (
          <div className="mx-auto max-w-md rounded-2xl border border-dashed border-slate-200 bg-white p-8 text-center">
            <div className="text-3xl mb-3">🛒</div>
            <h2 className="text-base font-semibold text-slate-900">
              Your cart is empty
            </h2>
            <button
              onClick={() => navigate("/")}
              className="mt-5 inline-flex items-center rounded-2xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
            >
              Return to shop
            </button>
          </div>
        ) : (
          <div className="grid gap-8 lg:grid-cols-[minmax(0,2fr)_minmax(280px,1fr)]">
            {/* Items List */}
            <section className="space-y-4">
              <h2 className="text-sm font-semibold text-slate-900">
                Your Items
              </h2>
              {cartData?.data?.map((item, index) => (
                <div
                  key={item.id}
                  className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-4 sm:flex-row sm:justify-between"
                >
                  <img
                    className="h-28 w-28 rounded-xl border border-slate-100 object-cover"
                    alt={item.title}
                    src={
                      import.meta.env.VITE_MEDIA_BASE_URL + "/" + item.thumbnail
                    }
                  />

                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm text-slate-900 truncate">
                      {item.title}
                    </p>
                    <p className="mt-1 text-xs text-slate-500">
                      ${item.price} each
                    </p>

                    <button
                      className="mt-2 text-xs text-red-500 hover:underline"
                      onClick={() => removeItem(item.id)}
                    >
                      Remove
                    </button>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      className="h-8 w-8 border rounded-lg hover:bg-slate-100"
                      onClick={() =>
                        setItems((prev) =>
                          prev.map((it, i) =>
                            i === index
                              ? {
                                  ...it,
                                  quantity: Math.max(1, it.quantity - 1),
                                }
                              : it
                          )
                        )
                      }
                    >
                      −
                    </button>

                    <input
                      readOnly
                      className="w-12 text-center border rounded-lg"
                      value={items[index].quantity}
                    />

                    <button
                      className="h-8 w-8 border rounded-lg hover:bg-slate-100"
                      onClick={() =>
                        setItems((prev) =>
                          prev.map((it, i) =>
                            i === index
                              ? { ...it, quantity: it.quantity + 1 }
                              : it
                          )
                        )
                      }
                    >
                      +
                    </button>
                  </div>

                  <p className="font-semibold text-sm text-right w-20">
                    ${(items[index].quantity * item.price).toFixed(2)}
                  </p>
                </div>
              ))}
            </section>

            {/* Summary */}
            <aside className="lg:sticky lg:top-6">
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <h2 className="font-semibold text-sm text-slate-900">
                  Order Summary
                </h2>

                <div className="text-sm mt-4 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-slate-600">Subtotal</span>
                    <span className="font-semibold">
                      ${subtotal.toFixed(2)}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-slate-600">Shipping</span>
                    <span className="font-semibold">
                      ${shipping.toFixed(2)}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-slate-600">Tax</span>
                    <span className="font-semibold">${tax.toFixed(2)}</span>
                  </div>

                  <div className="pt-3 border-t flex justify-between font-semibold">
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </div>

                <button
                  disabled={items.length === 0}
                  onClick={handleContinue}
                  className="mt-5 w-full rounded-2xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
                >
                  Continue to details →
                </button>
              </div>
            </aside>
          </div>
        )}
      </main>
    </div>
  );
};

export default Checkout;
