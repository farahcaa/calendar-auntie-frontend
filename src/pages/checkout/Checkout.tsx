import { useEffect, useMemo, useState } from "react";

type Item = {
  id: string;
  quantity: number;
};

const Checkout = ({
  setOpenCheckout,
  setOpenForm,
}: {
  setOpenCheckout: (open: boolean) => void;
  setOpenForm: (open: boolean) => void;
}) => {
  const [items, setItems] = useState<Item[]>([]);

  // Load raw ids from localStorage and convert to Item[] with quantity = 1
  useEffect(() => {
    const raw = localStorage.getItem("cart");

    let ids: string[] = [];
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) ids = parsed.map(String);
      } catch {
        ids = [];
      }
    }

    const uniqueIds = Array.from(new Set(ids));
    setItems(uniqueIds.map((id) => ({ id, quantity: 1 })));
  }, []);

  const updateQty = (id: string, nextQty: number) => {
    const qty = Math.max(1, Math.min(99, nextQty));
    setItems((prev) =>
      prev.map((it) => (it.id === id ? { ...it, quantity: qty } : it))
    );
  };

  const removeItem = (id: string) => {
    setItems((prev) => prev.filter((it) => it.id !== id));

    // keep localStorage in sync (ids only)
    const raw = localStorage.getItem("cart");
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        console.log(parsed);
        if (Array.isArray(parsed)) {
          const next = parsed.map(String).filter((x) => x !== id);
          localStorage.setItem("cart", JSON.stringify(next));
        }
      } catch {}
    }
  };

  // Placeholder pricing
  const PRICE_PER_ITEM_CENTS = 1299;

  const subtotalCents = useMemo(
    () =>
      items.reduce((sum, it) => sum + it.quantity * PRICE_PER_ITEM_CENTS, 0),
    [items]
  );

  const shippingCents = 0;
  const taxCents = 0;
  const totalCents = subtotalCents + shippingCents + taxCents;

  const fmt = (cents: number) =>
    (cents / 100).toLocaleString(undefined, {
      style: "currency",
      currency: "USD",
    });

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-black/50"
        onClick={() => setOpenCheckout(false)}
      />

      {/* Overlay container */}
      <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
        <div className="w-full max-w-[680px] rounded-3xl border border-slate-200 bg-white shadow-xl">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
            <div>
              <div className="text-lg font-semibold text-slate-900">
                Checkout
              </div>
              <div className="text-xs text-slate-500">
                Review your items and quantities
              </div>
            </div>

            <button
              onClick={() => setOpenCheckout(false)}
              className="h-9 w-9 rounded-2xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition"
              aria-label="Close checkout"
            >
              ×
            </button>
          </div>

          {/* Body */}
          <div className="px-5 py-5 max-h-[70vh] overflow-y-auto">
            {items.length === 0 ? (
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6 text-sm text-slate-600">
                Your cart is empty.
              </div>
            ) : (
              <div className="space-y-3">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-4"
                  >
                    {/* Product placeholder */}
                    <div className="min-w-0">
                      <div className="text-sm font-semibold text-slate-900 truncate">
                        Product ID: <span className="font-mono">{item.id}</span>
                      </div>
                      <div className="mt-1 text-xs text-slate-500">
                        Price (placeholder): {fmt(PRICE_PER_ITEM_CENTS)} each
                      </div>

                      <button
                        type="button"
                        onClick={() => removeItem(item.id)}
                        className="mt-2 text-xs text-slate-500 hover:text-slate-900 transition"
                      >
                        Remove
                      </button>
                    </div>

                    {/* Quantity */}
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => updateQty(item.id, item.quantity - 1)}
                        className="h-9 w-9 rounded-xl border border-slate-200 bg-white hover:bg-slate-50"
                      >
                        −
                      </button>

                      <input
                        className="h-9 w-16 rounded-xl border border-slate-200 text-center text-sm"
                        inputMode="numeric"
                        value={item.quantity}
                        onChange={(e) => {
                          const n = Number(
                            e.target.value.replace(/[^\d]/g, "")
                          );
                          updateQty(item.id, n || 1);
                        }}
                      />

                      <button
                        type="button"
                        onClick={() => updateQty(item.id, item.quantity + 1)}
                        className="h-9 w-9 rounded-xl border border-slate-200 bg-white hover:bg-slate-50"
                      >
                        +
                      </button>

                      <div className="ml-3 hidden sm:block text-right">
                        <div className="text-sm font-semibold text-slate-900">
                          {fmt(item.quantity * PRICE_PER_ITEM_CENTS)}
                        </div>
                        <div className="text-[11px] text-slate-500">
                          line total
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Summary */}
            <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">Subtotal</span>
                <span className="font-semibold">{fmt(subtotalCents)}</span>
              </div>

              <div className="mt-2 flex justify-between text-sm">
                <span className="text-slate-600">Shipping</span>
                <span className="font-semibold">{fmt(shippingCents)}</span>
              </div>

              <div className="mt-2 flex justify-between text-sm">
                <span className="text-slate-600">Tax</span>
                <span className="font-semibold">{fmt(taxCents)}</span>
              </div>

              <div className="mt-4 border-t pt-4 flex justify-between">
                <span className="font-semibold">Total</span>
                <span className="font-semibold">{fmt(totalCents)}</span>
              </div>

              <div className="mt-2 text-xs text-slate-500">
                Totals are placeholders.
              </div>
            </div>

            {/* Actions */}
            <div className="mt-5 flex justify-end gap-2">
              <button
                onClick={() => setOpenCheckout(false)}
                className="rounded-2xl border px-4 py-2 text-sm font-semibold hover:bg-slate-50"
              >
                Cancel
              </button>

              <button
                disabled={items.length === 0}
                className="rounded-2xl bg-blue-600 px-5 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
                onClick={() => {
                  setOpenForm(true);
                  setOpenCheckout(false);
                }}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Checkout;
