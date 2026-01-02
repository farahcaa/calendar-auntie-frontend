import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useGetCheckoutPricing, useGetProductsItems } from "@/gen";
import Pay from "./Pay";

type Item = {
  id: string;
  quantity: number;
};

interface PaymentContentProps {
  orderId: string;
}

const PaymentContent: React.FC<PaymentContentProps> = ({ orderId }) => {
  const navigate = useNavigate();

  const [items, setItems] = useState<Item[]>([]);
  const [ids, setIds] = useState<string[]>([]);

  useEffect(() => {
    const raw = localStorage.getItem("checkout");
    if (!raw) return;

    try {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        const cleanItems: Item[] = parsed
          .filter(
            (it: any) =>
              it && typeof it.id === "string" && typeof it.quantity === "number"
          )
          .map((it: any) => ({
            id: String(it.id),
            quantity: Math.max(1, it.quantity),
          }));

        setItems(cleanItems);
        setIds(cleanItems.map((it) => it.id));
      }
    } catch {
      // ignore
    }
  }, []);

  const { data: cartData } = useGetProductsItems({ ids });
  const { data: taxData } = useGetCheckoutPricing();

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

  return (
    <div className="min-h-screen bg-slate-50">
      {/* your nicer Payment layout from before */}
      <main className="mx-auto max-w-6xl px-4 py-8">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,2fr)_minmax(280px,1fr)]">
          {/* Left: payment form */}
          <section className="space-y-4">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <h2 className="font-semibold text-sm text-slate-900">
                    Payment Details
                  </h2>
                  <p className="text-xs text-slate-500">
                    We accept all major credit and debit cards. Your payment is
                    securely processed by Stripe.
                  </p>
                </div>
                <div className="flex flex-col items-end text-[10px] text-slate-400">
                  <span>Order ID</span>
                  <span className="font-mono text-[10px] text-slate-600 truncate max-w-[140px]">
                    {orderId}
                  </span>
                </div>
              </div>

              <Pay orderId={orderId} />
            </div>
          </section>

          {/* Right: order summary */}
          <aside className="lg:sticky lg:top-6 space-y-4">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <h2 className="font-semibold text-sm text-slate-900">
                Order Summary
              </h2>

              <div className="mt-4 max-h-64 space-y-3 overflow-y-auto pr-1">
                {items.length === 0 || !cartData?.data ? (
                  <p className="text-xs text-slate-500">Your cart is empty.</p>
                ) : (
                  cartData.data.map((product) => {
                    const match = items.find((it) => it.id === product.id);
                    if (!match) return null;
                    const lineTotal = match.quantity * product.price;

                    return (
                      <div
                        key={product.id}
                        className="flex items-center gap-3 text-xs"
                      >
                        <img
                          className="h-12 w-12 rounded-lg border border-slate-100 object-cover"
                          src={
                            import.meta.env.VITE_MEDIA_BASE_URL +
                            "/" +
                            product.thumbnail
                          }
                          alt={product.title}
                        />
                        <div className="flex-1 min-w-0">
                          <p className="truncate font-medium text-slate-900">
                            {product.title}
                          </p>
                          <p className="text-[11px] text-slate-500">
                            {match.quantity} × ${product.price.toFixed(2)}
                          </p>
                        </div>
                        <p className="text-[11px] font-semibold text-slate-900">
                          ${lineTotal.toFixed(2)}
                        </p>
                      </div>
                    );
                  })
                )}
              </div>

              <div className="mt-4 border-t pt-4 text-sm space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-600">Subtotal</span>
                  <span className="font-semibold">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Shipping</span>
                  <span className="font-semibold">${shipping.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Tax</span>
                  <span className="font-semibold">${tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between border-t pt-3 font-semibold">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>

              <p className="mt-3 text-[11px] text-slate-500">
                You will be charged{" "}
                <span className="font-semibold text-slate-900">
                  ${total.toFixed(2)}
                </span>{" "}
                today.
              </p>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
};

export default PaymentContent;
