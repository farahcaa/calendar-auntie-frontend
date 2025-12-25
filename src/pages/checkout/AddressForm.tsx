import { useState } from "react";

type AddressFormValues = {
  fullName: string;
  email: string;
  address1: string;
  address2: string;
  city: string;
  state: string;
  zip: string;
};

const AddressForm = ({
  setOpenForm,
}: {
  setOpenForm: (open: boolean) => void;
}) => {
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

  const handleSubmit = () => {
    if (!validate()) return;

    // Form is valid — you’ll handle the next step elsewhere
    setOpenForm(false);
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-black/50"
        onClick={() => setOpenForm(false)}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
        <div className="w-full max-w-[520px] rounded-3xl bg-white p-6 shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Shipping address</h2>
            <button
              onClick={() => setOpenForm(false)}
              className="text-slate-500 hover:text-slate-900"
            >
              ✕
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <input
                className="w-full rounded-xl border px-3 py-2 text-sm"
                placeholder="Full name"
                value={values.fullName}
                onChange={(e) => update("fullName", e.target.value)}
              />
              {errors.fullName && (
                <p className="mt-1 text-xs text-red-600">{errors.fullName}</p>
              )}
            </div>

            <div>
              <input
                className="w-full rounded-xl border px-3 py-2 text-sm"
                placeholder="Email"
                value={values.email}
                onChange={(e) => update("email", e.target.value)}
              />
              {errors.email && (
                <p className="mt-1 text-xs text-red-600">{errors.email}</p>
              )}
            </div>

            <div>
              <input
                className="w-full rounded-xl border px-3 py-2 text-sm"
                placeholder="Address line 1"
                value={values.address1}
                onChange={(e) => update("address1", e.target.value)}
              />
              {errors.address1 && (
                <p className="mt-1 text-xs text-red-600">{errors.address1}</p>
              )}
            </div>

            <div>
              <input
                className="w-full rounded-xl border px-3 py-2 text-sm"
                placeholder="Address line 2 (optional)"
                value={values.address2}
                onChange={(e) => update("address2", e.target.value)}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <input
                  className="w-full rounded-xl border px-3 py-2 text-sm"
                  placeholder="City"
                  value={values.city}
                  onChange={(e) => update("city", e.target.value)}
                />
                {errors.city && (
                  <p className="mt-1 text-xs text-red-600">{errors.city}</p>
                )}
              </div>

              <div>
                <input
                  className="w-full rounded-xl border px-3 py-2 text-sm"
                  placeholder="State"
                  value={values.state}
                  onChange={(e) => update("state", e.target.value)}
                />
                {errors.state && (
                  <p className="mt-1 text-xs text-red-600">{errors.state}</p>
                )}
              </div>
            </div>

            <div>
              <input
                className="w-full rounded-xl border px-3 py-2 text-sm"
                placeholder="ZIP code"
                value={values.zip}
                onChange={(e) => update("zip", e.target.value)}
              />
              {errors.zip && (
                <p className="mt-1 text-xs text-red-600">{errors.zip}</p>
              )}
            </div>
          </div>

          <div className="mt-6 flex justify-end gap-2">
            <button
              onClick={() => setOpenForm(false)}
              className="rounded-xl border px-4 py-2 text-sm hover:bg-slate-50"
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
      </div>
    </>
  );
};

export default AddressForm;
