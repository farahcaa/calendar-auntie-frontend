import { useGetAdminOrders, useGetAdminOrdersPaid } from "@/gen";
import useAuthenticatedClientConfig from "@/hooks/use-authenticated-client-config";
import { useNavigate } from "react-router";

const AdminOrders = () => {
  const config = useAuthenticatedClientConfig();
  const navigate = useNavigate();

  // All orders
  const { data: ordersResponse, isLoading: isLoadingOrders } =
    useGetAdminOrders({ page: 0 }, config);

  console.log(ordersResponse);
  // Orders that need to be processed / paid
  const { data: paidResponse, isLoading: isLoadingPaid } =
    useGetAdminOrdersPaid({ page: 0 }, config);

  console.log(paidResponse);
  const orders = ordersResponse?.data ?? [];
  const paidOrders = paidResponse?.data ?? [];

  const handleClickOrder = (orderId: string | number) => {
    navigate(`/admin/orders/${orderId}`);
  };

  return (
    <div className="w-full h-full p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-full">
        {/* LEFT: All Orders */}
        <div className="border rounded-lg bg-white flex flex-col">
          <div className="px-4 py-3 border-b">
            <h2 className="text-lg font-semibold">All Orders</h2>
          </div>

          {isLoadingOrders && (
            <div className="p-4 text-sm text-gray-500">Loading orders...</div>
          )}

          {!isLoadingOrders && orders.length === 0 && (
            <div className="p-4 text-sm text-gray-500">No orders found.</div>
          )}

          <div className="flex-1 overflow-y-auto">
            <ul className="divide-y">
              {orders.content &&
                orders.content.map((order: any) => (
                  <li
                    key={order.id}
                    className="px-4 py-3 cursor-pointer hover:bg-gray-50 transition"
                    onClick={() => handleClickOrder(order.id)}
                  >
                    <div className="text-sm font-mono break-all">
                      <span className="font-semibold">ID: </span>
                      {order.id}
                    </div>
                    <div className="text-xs text-gray-600 mt-1">
                      <span className="font-semibold">Timestamp: </span>
                      {new Date(order.timestamp).toLocaleString()}
                    </div>
                    <div className="text-xs mt-1">
                      <span className="font-semibold">Status: </span>
                      {order.orderStatus}
                    </div>
                  </li>
                ))}
            </ul>
          </div>
        </div>

        {/* RIGHT: Orders to Process / Paid Orders */}
        <div className="border rounded-lg bg-white flex flex-col">
          <div className="px-4 py-3 border-b">
            <h2 className="text-lg font-semibold">Orders to Process</h2>
          </div>

          {isLoadingPaid && (
            <div className="p-4 text-sm text-gray-500">
              Loading orders to process...
            </div>
          )}

          {!isLoadingPaid && paidOrders.length === 0 && (
            <div className="p-4 text-sm text-gray-500">
              No orders waiting to be processed.
            </div>
          )}

          <div className="flex-1 overflow-y-auto">
            <ul className="divide-y">
              {paidOrders.content &&
                paidOrders.content.map((order: any) => (
                  <li
                    key={order.id}
                    className="px-4 py-3 cursor-pointer hover:bg-gray-50 transition"
                    onClick={() => handleClickOrder(order.id)}
                  >
                    <div className="text-sm font-mono break-all">
                      <span className="font-semibold">ID: </span>
                      {order.id}
                    </div>
                    <div className="text-xs text-gray-600 mt-1">
                      <span className="font-semibold">Timestamp: </span>
                      {new Date(order.timestamp).toLocaleString()}
                    </div>
                    <div className="text-xs mt-1">
                      <span className="font-semibold">Status: </span>
                      {order.orderStatus}
                    </div>
                  </li>
                ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminOrders;
