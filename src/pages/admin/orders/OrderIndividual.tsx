import { useMemo } from "react";
import { useParams } from "react-router";
import { useFulfillAdminOrder, useGetAdminOrderById } from "@/gen";
import useAuthenticatedClientConfig from "@/hooks/use-authenticated-client-config";

const money = (n?: number) =>
  typeof n === "number"
    ? n.toLocaleString(undefined, { style: "currency", currency: "USD" })
    : "-";

const OrderIndividual = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const config = useAuthenticatedClientConfig();

  const { data, isLoading, isError, error } = useGetAdminOrderById(
    orderId || "",
    config
  );
  const { mutateAsync: fulfill } = useFulfillAdminOrder(config);

  const handleFulfil = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to mark this order as fulfilled? This action cannot be undone."
    );

    if (confirmed) {
      fulfill({ orderId: orderId || "" }).then(() => alert("success"));
    }
  };
  const order = useMemo(() => {
    // try both shapes safely
    return (data as any)?.data ?? (data as any);
  }, [data]);

  const items = (order?.orderItems ?? []) as Array<any>;

  if (!orderId) {
    return (
      <div className="p-6">
        <div className="text-sm text-red-600">Missing orderId in route.</div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="text-sm text-gray-500">Loading order…</div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-6">
        <div className="text-sm text-red-600">Failed to load order.</div>
        <pre className="mt-2 text-xs text-gray-600 whitespace-pre-wrap">
          {(error as any)?.message ?? String(error)}
        </pre>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="p-6">
        <div className="text-sm text-gray-500">No order data found.</div>
      </div>
    );
  }

  const address = order.address;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Order</h1>
          <p className="text-sm text-gray-500 break-all">ID: {orderId}</p>
        </div>

        <button
          onClick={() => handleFulfil()}
          className="px-4 py-2 rounded-lg bg-black text-white text-sm font-medium hover:opacity-90"
        >
          Mark as Fulfilled
        </button>
      </div>

      {/* Customer + Totals */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Customer */}
        <div className="border rounded-xl bg-white p-4">
          <h2 className="text-sm font-semibold mb-3">Customer</h2>
          <div className="space-y-1 text-sm">
            <div>
              <span className="font-semibold">Name:</span>{" "}
              {order.Name ?? order.name ?? "-"}
            </div>
            <div>
              <span className="font-semibold">Email:</span> {order.email ?? "-"}
            </div>
          </div>
        </div>

        {/* Totals */}
        <div className="border rounded-xl bg-white p-4">
          <h2 className="text-sm font-semibold mb-3">Totals</h2>
          <div className="space-y-1 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Shipping</span>
              <span className="font-medium">{money(order.shipping)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Tax</span>
              <span className="font-medium">{money(order.tax)}</span>
            </div>
            <div className="flex justify-between border-t pt-2 mt-2">
              <span className="font-semibold">Total</span>
              <span className="font-semibold">{money(order.total)}</span>
            </div>
          </div>
        </div>

        {/* Address */}
        <div className="border rounded-xl bg-white p-4">
          <h2 className="text-sm font-semibold mb-3">Address</h2>
          {!address ? (
            <div className="text-sm text-gray-500">No address on file.</div>
          ) : (
            <div className="text-sm space-y-1">
              <div className="text-xs uppercase tracking-wide text-gray-500">
                {address.addressType ?? "ADDRESS"}
              </div>
              <div>{address.line1}</div>
              {address.line2 ? <div>{address.line2}</div> : null}
              <div>
                {address.city}, {address.state} {address.postalCode}
              </div>
              <div>{address.countryCode}</div>
            </div>
          )}
        </div>
      </div>

      {/* Items */}
      <div className="border rounded-xl bg-white">
        <div className="p-4 border-b flex items-center justify-between">
          <h2 className="text-sm font-semibold">Items</h2>
          <div className="text-xs text-gray-500">{items.length} item(s)</div>
        </div>

        {items.length === 0 ? (
          <div className="p-4 text-sm text-gray-500">No items found.</div>
        ) : (
          <ul className="divide-y">
            {items.map((item: any) => (
              <li key={item.id} className="p-4 flex gap-4">
                <div className="h-16 w-16 rounded-lg bg-gray-100 overflow-hidden shrink-0">
                  {item.thumbnail ? (
                    <img
                      src={
                        import.meta.env.VITE_MEDIA_BASE_URL +
                        "/" +
                        item.thumbnail
                      }
                      alt={item.title}
                      className="h-full w-full object-cover"
                    />
                  ) : null}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <div className="font-medium truncate">{item.title}</div>
                      <div className="text-xs text-gray-500 break-all">
                        Item ID: {item.id}
                      </div>
                    </div>

                    <div className="text-right text-sm">
                      <div className="font-semibold">
                        {money(item.total_price)}
                      </div>
                      <div className="text-xs text-gray-500">
                        {item.quantity} × {money(item.unit_price)}
                      </div>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default OrderIndividual;
