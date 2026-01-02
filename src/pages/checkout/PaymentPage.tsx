import { useLocation, useNavigate } from "react-router";
import { XCircle } from "lucide-react";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import Pay from "./Pay";
import PaymentContent from "./PaymentContent";

const stripePromise = loadStripe(
  import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || ""
);

const PaymentPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const state = location.state as
    | { clientSecret: string; orderId: string }
    | undefined;

  if (!state?.clientSecret) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
        <div className="max-w-md w-full bg-white border border-red-200 rounded-2xl p-8 text-center shadow-sm">
          <XCircle className="mx-auto h-12 w-12 text-red-500" />
          <h2 className="mt-4 text-lg font-semibold text-slate-900">
            Payment Session Not Found
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            We couldn't start the payment process. Please return to your cart
            and try again.
          </p>

          <button
            onClick={() => navigate("/cart")}
            className="mt-6 w-full rounded-2xl bg-red-600 text-white font-medium px-4 py-2 text-sm hover:bg-red-700 transition"
          >
            Back to Cart
          </button>
        </div>
      </div>
    );
  }

  const { clientSecret, orderId } = state;

  return (
    <Elements stripe={stripePromise} options={{ clientSecret }}>
      <PaymentContent orderId={orderId} />
    </Elements>
  );
};

export default PaymentPage;
