import { useEffect } from "react";
import { useNavigate } from "react-router";

const OrderSuccess = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Clear checkout-related keys safely
    localStorage.removeItem("cart");
    localStorage.removeItem("checkout");
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md rounded-2xl bg-white border border-slate-200 p-8 text-center shadow-sm">
        <div className="text-4xl mb-4">🎉</div>
        <h1 className="text-xl font-semibold text-slate-900">
          Order Confirmed!
        </h1>
        <p className="text-slate-600 text-sm mt-2">
          Thank you for your purchase. A confirmation email will be sent
          shortly.
        </p>

        <button
          onClick={() => navigate("/")}
          className="mt-6 w-full rounded-2xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 transition"
        >
          Return to shop
        </button>
      </div>
    </div>
  );
};

export default OrderSuccess;
