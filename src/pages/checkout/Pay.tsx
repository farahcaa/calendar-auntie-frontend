// PaymentForm.tsx
import React, { useState } from "react";
import {
  useStripe,
  useElements,
  PaymentElement,
} from "@stripe/react-stripe-js";
import { useNavigate } from "react-router";

interface PaymentFormProps {
  orderId: string;
}

const Pay: React.FC<PaymentFormProps> = ({ orderId }) => {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsSubmitting(true);
    setMessage(null);

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/order/complete`,
      },
      redirect: "if_required",
    });

    if (error) {
      setMessage(error.message || "Something went wrong.");
      setIsSubmitting(false);
      return;
    }

    if (paymentIntent) {
      if (paymentIntent.status === "succeeded") {
        // You can navigate to your confirmation route
        navigate("/success", { state: { orderId } });
        return;
      }

      if (paymentIntent.status === "processing") {
        setMessage("Your payment is processing...");
      } else if (paymentIntent.status === "requires_payment_method") {
        setMessage("Payment failed, please try a different method.");
      } else {
        setMessage("Something unexpected happened.");
      }
    }

    setIsSubmitting(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md mx-auto">
      <PaymentElement />

      <button
        type="submit"
        disabled={!stripe || isSubmitting}
        className="w-full rounded-md border px-4 py-2"
      >
        {isSubmitting ? "Processing..." : "Pay"}
      </button>

      {message && <div className="text-sm text-red-600 mt-2">{message}</div>}
    </form>
  );
};

export default Pay;
