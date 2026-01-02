import { useState } from "react";
import { useNavigate } from "react-router";

type AddressFormValues = {
  fullName: string;
  email: string;
  address1: string;
  address2: string;
  city: string;
  state: string;
  zip: string;
};

const Details = () => {
  const navigate = useNavigate();

  const [values, setValues] = useState<AddressFormValues>({
    fullName: "",
    email: "",
    address1: "",
    address2: "",
    city: "",
    state: "",
    zip: "",
  });

  const [errors, setErrors] = useState<
    Partial<Record<keyof AddressFormValues, string>>
  >({});

  const update = (field: keyof AddressFormValues, value: string) => {
    setValues((prev) => ({ ...prev, [field]: value }));
  };

  const validate = () => {
    const nextErrors: typeof errors = {};

    if (!values.fullName.trim()) nextErrors.fullName = "Full name is required";
    if (!values.email.trim() || !values.email.includes("@"))
      nextErrors.email = "Valid email is required";
    if (!values.address1.trim()) nextErrors.address1 = "Address is required";
    if (!values.city.trim()) nextErrors.city = "City is required";
    if (!values.state.trim()) nextErrors.state = "State is required";
    if (!values.zip.trim() || values.zip.length < 5)
      nextErrors.zip = "Valid ZIP code is required";

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    const parsedItems = JSON.parse(localStorage.getItem("checkout") || "");

    console.log(parsedItems);
    const res = await fetch(
      import.meta.env.VITE_BACKEND_BASE_URL + "/checkout/create",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          checkoutOrderDTO: parsedItems,
          checkoutAddressDTO: values,
        }),
      }
    );

    const data = await res.json(); // { orderId, clientSecret }

    console.log(data);
    navigate("/pay", {
      state: {
        orderId: data.orderId,
        clientSecret: data.clientSecret,
      },
    });
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-4">
          <div>
            <h1 className="text-xl font-semibold text-slate-900">
              Shipping details
            </h1>
            <p className="text-xs text-slate-500">
              Enter your contact and shipping information.
            </p>
          </div>

          <button
            onClick={() => navigate("/checkout")}
            className="inline-flex items-center rounded-2xl border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition"
          >
            ← Back
          </button>
        </div>
      </header>

      {/* Form Card */}
      <main className="mx-auto flex max-w-3xl px-4 py-8">
        <div className="w-full rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-sm font-semibold text-slate-900">
            Shipping address
          </h2>
          <p className="mt-1 text-xs text-slate-500">
            We’ll use this information to ship your order.
          </p>

          <div className="mt-6 space-y-4">
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-700">
                Full name
              </label>
              <input
                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/60"
                placeholder="John Doe"
                value={values.fullName}
                onChange={(e) => update("fullName", e.target.value)}
              />
              {errors.fullName && (
                <p className="mt-1 text-xs text-red-600">{errors.fullName}</p>
              )}
            </div>

            <div>
              <label className="mb-1 block text-xs font-medium text-slate-700">
                Email
              </label>
              <input
                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/60"
                placeholder="you@example.com"
                value={values.email}
                onChange={(e) => update("email", e.target.value)}
              />
              {errors.email && (
                <p className="mt-1 text-xs text-red-600">{errors.email}</p>
              )}
            </div>

            <div>
              <label className="mb-1 block text-xs font-medium text-slate-700">
                Address line 1
              </label>
              <input
                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/60"
                placeholder="Street address"
                value={values.address1}
                onChange={(e) => update("address1", e.target.value)}
              />
              {errors.address1 && (
                <p className="mt-1 text-xs text-red-600">{errors.address1}</p>
              )}
            </div>

            <div>
              <label className="mb-1 block text-xs font-medium text-slate-700">
                Address line 2 (optional)
              </label>
              <input
                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/60"
                placeholder="Apartment, suite, etc."
                value={values.address2}
                onChange={(e) => update("address2", e.target.value)}
              />
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-700">
                  City
                </label>
                <input
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/60"
                  placeholder="City"
                  value={values.city}
                  onChange={(e) => update("city", e.target.value)}
                />
                {errors.city && (
                  <p className="mt-1 text-xs text-red-600">{errors.city}</p>
                )}
              </div>

              <div>
                <label className="mb-1 block text-xs font-medium text-slate-700">
                  State
                </label>
                <input
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/60"
                  placeholder="State"
                  value={values.state}
                  onChange={(e) => update("state", e.target.value)}
                />
                {errors.state && (
                  <p className="mt-1 text-xs text-red-600">{errors.state}</p>
                )}
              </div>
            </div>

            <div className="sm:w-1/2">
              <label className="mb-1 block text-xs font-medium text-slate-700">
                ZIP code
              </label>
              <input
                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/60"
                placeholder="12345"
                value={values.zip}
                onChange={(e) => update("zip", e.target.value)}
              />
              {errors.zip && (
                <p className="mt-1 text-xs text-red-600">{errors.zip}</p>
              )}
            </div>
          </div>

          <div className="mt-8 flex justify-between gap-3">
            <button
              onClick={() => navigate(-1)}
              className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              Cancel
            </button>

            <button
              onClick={handleSubmit}
              className="rounded-xl bg-blue-600 px-5 py-2 text-sm font-semibold text-white hover:bg-blue-700"
            >
              Continue
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Details;
