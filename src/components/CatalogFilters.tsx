"use client";

import { brands, categories } from "@/data/motorcycles";

export interface CatalogFilterValues {
  brand: string;
  category: string;
  cc: string;
  condition: string;
}

const selectClass =
  "w-full rounded-none border border-black/15 bg-brand-bg px-4 py-3 text-base text-brand-text focus:border-brand-navy focus:outline-none sm:text-sm";

export default function CatalogFilters({
  values,
  onChange,
  onClear,
}: {
  values: CatalogFilterValues;
  onChange: (key: keyof CatalogFilterValues, value: string) => void;
  onClear: () => void;
}) {
  const hasFilters = Object.values(values).some(Boolean);

  return (
    <div className="grid grid-cols-1 gap-4 border border-black/10 bg-brand-bg-soft p-6 sm:grid-cols-2 lg:grid-cols-5">
      <select
        className={selectClass}
        value={values.brand}
        onChange={(e) => onChange("brand", e.target.value)}
      >
        <option value="">Todas las marcas</option>
        {brands.map((b) => (
          <option key={b} value={b}>
            {b}
          </option>
        ))}
      </select>

      <select
        className={selectClass}
        value={values.category}
        onChange={(e) => onChange("category", e.target.value)}
      >
        <option value="">Toda categoría</option>
        {categories.map((c) => (
          <option key={c.value} value={c.value}>
            {c.label}
          </option>
        ))}
      </select>

      <select
        className={selectClass}
        value={values.cc}
        onChange={(e) => onChange("cc", e.target.value)}
      >
        <option value="">Toda cilindrada</option>
        <option value="0-350">Hasta 350 cc</option>
        <option value="350-650">350 – 650 cc</option>
        <option value="650-9999">+650 cc</option>
      </select>

      <select
        className={selectClass}
        value={values.condition}
        onChange={(e) => onChange("condition", e.target.value)}
      >
        <option value="">0 km y seminueva</option>
        <option value="0km">0 km</option>
        <option value="seminueva">Seminueva</option>
      </select>

      <button
        onClick={onClear}
        disabled={!hasFilters}
        className="border border-black/15 px-4 py-3 text-sm tracking-wide uppercase text-brand-text/70 transition hover:border-brand-red hover:text-brand-red disabled:cursor-not-allowed disabled:opacity-30"
      >
        Limpiar filtros
      </button>
    </div>
  );
}
