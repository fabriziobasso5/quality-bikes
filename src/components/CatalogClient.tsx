"use client";

import { useCallback, useEffect, useState } from "react";
import CatalogFilters, { type CatalogFilterValues } from "./CatalogFilters";
import MotoCard from "./MotoCard";
import { RevealGroup, RevealItem } from "./Reveal";
import type { Motorcycle } from "@/data/motorcycles";

const EMPTY_FILTERS: CatalogFilterValues = { brand: "", category: "", cc: "", condition: "" };

function readFiltersFromLocation(): CatalogFilterValues {
  const params = new URLSearchParams(window.location.search);
  return {
    brand: params.get("brand") ?? "",
    category: params.get("category") ?? "",
    cc: params.get("cc") ?? "",
    condition: params.get("condition") ?? "",
  };
}

// Deliberately avoids next/navigation's useSearchParams(): in a static export
// (no server) that hook forces this whole subtree to bail out of the
// prerendered HTML and render only after client hydration, which proved
// unreliable on GitHub Pages (catalog silently stayed empty). Plain state +
// the browser's own history API renders the full grid in the static HTML
// immediately and just layers URL sync on top, matching how the homepage's
// featured grid (which has no such issue) is server-rendered directly.
export default function CatalogClient({ motorcycles }: { motorcycles: Motorcycle[] }) {
  const [filters, setFilters] = useState<CatalogFilterValues>(EMPTY_FILTERS);

  // Pick up filters from the URL once mounted (deep-linking support).
  useEffect(() => {
    setFilters(readFiltersFromLocation());
  }, []);

  // Keep the URL in sync as a side effect of state changes, rather than
  // inside the state updater itself — calling history.replaceState from
  // within setState's updater fires while React is still rendering, which
  // triggers Next's router to update its own state mid-render (React warns:
  // "Cannot update a component while rendering a different component").
  useEffect(() => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.set(key, value);
    });
    const query = params.toString();
    window.history.replaceState(null, "", query ? `?${query}` : window.location.pathname);
  }, [filters]);

  const handleChange = useCallback((key: keyof CatalogFilterValues, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  }, []);

  const handleClear = useCallback(() => {
    setFilters(EMPTY_FILTERS);
  }, []);

  const filtered = motorcycles.filter((moto) => {
    if (filters.brand && moto.brand !== filters.brand) return false;
    if (filters.category && moto.category !== filters.category) return false;
    if (filters.condition && moto.condition !== filters.condition) return false;
    if (filters.cc) {
      const [min, max] = filters.cc.split("-").map(Number);
      if (moto.cc < min || moto.cc > max) return false;
    }
    return true;
  });

  return (
    <>
      <div className="mt-8">
        <CatalogFilters values={filters} onChange={handleChange} onClear={handleClear} />
      </div>

      {filtered.length === 0 ? (
        <p className="mt-16 text-center text-brand-text/60">
          No encontramos motos con esos filtros. Escríbenos por WhatsApp y te ayudamos a
          encontrar la opción ideal.
        </p>
      ) : (
        <RevealGroup className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((moto) => (
            <RevealItem key={moto.slug}>
              <MotoCard moto={moto} />
            </RevealItem>
          ))}
        </RevealGroup>
      )}
    </>
  );
}
