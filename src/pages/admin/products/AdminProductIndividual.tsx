import React, { useState } from "react";

const AdminProductIndividual: React.FC = () => {
  const [form, setForm] = useState({
    sku: "",
    title: "",
    description: "",
    price: "0.00",
    inventory_qty: 0,
    is_active: true,
  });

  return (
    <div className="mx-auto max-w-[860px] p-4">
      <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-zinc-900">Edit Product</h2>
          <p className="mt-1 text-sm text-zinc-600">
            Fill out the product details below.
          </p>
        </div>
        <div className="my-10">
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            onClick={() => {}}
          >
            add image
          </button>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {/* SKU */}
          <div>
            <label className="mb-1.5 block text-sm font-semibold text-zinc-900">
              SKU <span className="font-normal text-zinc-500">(required)</span>
            </label>
            <input
              className="w-full rounded-xl border border-zinc-300 bg-white px-3 py-2.5 text-sm text-zinc-900 placeholder:text-zinc-400 shadow-sm outline-none transition focus:border-zinc-900 focus:ring-2 focus:ring-zinc-900/10"
              placeholder="CAL-2026-MANTRA-01, needs to be unique"
              value={form.sku}
              onChange={(e) => setForm({ ...form, sku: e.target.value })}
            />
          </div>

          {/* Price */}
          <div>
            <label className="mb-1.5 block text-sm font-semibold text-zinc-900">
              Price{" "}
              <span className="font-normal text-zinc-500">(required)</span>
            </label>
            <input
              className="w-full rounded-xl border border-zinc-300 bg-white px-3 py-2.5 text-sm text-zinc-900 placeholder:text-zinc-400 shadow-sm outline-none transition focus:border-zinc-900 focus:ring-2 focus:ring-zinc-900/10"
              inputMode="decimal"
              placeholder="19.99"
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
            />
            <p className="mt-1.5 text-xs text-zinc-500">
              Up to 2 decimals (DECIMAL(10,2)).
            </p>
          </div>

          {/* Title */}
          <div className="md:col-span-2">
            <label className="mb-1.5 block text-sm font-semibold text-zinc-900">
              Title{" "}
              <span className="font-normal text-zinc-500">(required)</span>
            </label>
            <input
              className="w-full rounded-xl border border-zinc-300 bg-white px-3 py-2.5 text-sm text-zinc-900 placeholder:text-zinc-400 shadow-sm outline-none transition focus:border-zinc-900 focus:ring-2 focus:ring-zinc-900/10"
              placeholder="Motivation & Discipline Mantra Calendar"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
            />
          </div>

          {/* Description */}
          <div className="md:col-span-2">
            <label className="mb-1.5 block text-sm font-semibold text-zinc-900">
              Description
            </label>
            <textarea
              className="w-full rounded-xl border border-zinc-300 bg-white px-3 py-2.5 text-sm text-zinc-900 placeholder:text-zinc-400 shadow-sm outline-none transition focus:border-zinc-900 focus:ring-2 focus:ring-zinc-900/10"
              rows={5}
              placeholder="Short details about the product..."
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
            />
          </div>

          {/* Inventory */}
          <div>
            <label className="mb-1.5 block text-sm font-semibold text-zinc-900">
              Inventory Qty
            </label>
            <input
              className="w-full rounded-xl border border-zinc-300 bg-white px-3 py-2.5 text-sm text-zinc-900 placeholder:text-zinc-400 shadow-sm outline-none transition focus:border-zinc-900 focus:ring-2 focus:ring-zinc-900/10"
              type="number"
              min={0}
              step={1}
              placeholder="0"
            />
          </div>

          {/* Active */}
          <div className="flex items-center gap-3 md:pt-7">
            <input
              id="is_active"
              type="checkbox"
              className="h-4 w-4 rounded border-zinc-300 text-zinc-900 focus:ring-zinc-900/20"
            />
            <label
              htmlFor="is_active"
              className="text-sm font-semibold text-zinc-900"
            >
              Active{" "}
              <span className="font-normal text-zinc-500">(is_active)</span>
            </label>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
          <button
            className="inline-flex items-center justify-center rounded-xl border border-zinc-900 bg-white px-4 py-2.5 text-sm font-semibold text-zinc-900 shadow-sm transition hover:bg-zinc-50 active:scale-[0.99]"
            type="button"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminProductIndividual;
