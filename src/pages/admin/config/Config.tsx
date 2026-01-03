import { useEffect, useState } from "react";
import { useGetCheckoutPricing, usePostConfig } from "@/gen";
import useAuthenticatedClientConfig from "@/hooks/use-authenticated-client-config";

const Config = () => {
  const config = useAuthenticatedClientConfig();
  const { mutate, isLoading } = usePostConfig(config);
  const { data } = useGetCheckoutPricing();
  const [shipping, setShipping] = useState("");
  const [tax, setTax] = useState("");

  const submit = () => {
    const shippingNum = Number(shipping);
    const taxNum = Number(tax);

    if (Number.isNaN(shippingNum) || Number.isNaN(taxNum)) {
      alert("Please enter valid numbers for shipping and tax.");
      return;
    }

    mutate(
      { data: { shipping: shippingNum, tax: taxNum } },
      {
        onSuccess: () => alert("Configuration updated"),
        onError: () => alert("Failed to update configuration"),
      }
    );
  };

  useEffect(() => {
    if (data) {
      setShipping((data.data.shipping || "").toString());
      setTax((data.data.tax || "").toString());
    }
  }, [data]);

  return (
    <div className="p-6 max-w-sm space-y-4">
      <h1 className="text-lg font-semibold">Checkout Configuration</h1>

      <div className="space-y-2">
        <label className="block text-sm font-medium">Shipping</label>
        <input
          type="number"
          step="0.01"
          value={shipping}
          onChange={(e) => setShipping(e.target.value)}
          className="w-full border rounded-lg px-3 py-2 text-sm"
          placeholder="e.g. 4.99"
        />
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium">Tax</label>
        <input
          type="number"
          step="0.01"
          value={tax}
          onChange={(e) => setTax(e.target.value)}
          className="w-full border rounded-lg px-3 py-2 text-sm"
          placeholder="e.g. 0.07"
        />
      </div>

      <button
        onClick={submit}
        disabled={isLoading}
        className="w-full rounded-lg bg-black text-white py-2 text-sm font-medium disabled:opacity-50"
      >
        {isLoading ? "Saving..." : "Save"}
      </button>
    </div>
  );
};

export default Config;
