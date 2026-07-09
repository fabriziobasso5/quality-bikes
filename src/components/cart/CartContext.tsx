"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import type { Product } from "@/data/products";

/**
 * "Pedido" (order) = el carrito de la sección Productos. Regla de negocio
 * inquebrantable: NUNCA se guardan ni se muestran precios. Solo qué producto,
 * qué presentación y cuánta cantidad — la lista se envía por WhatsApp para
 * cotizar, igual que la consulta de una moto.
 */
export interface CartItem {
  slug: string;
  name: string;
  brand: Product["brand"];
  // null cuando el producto no tiene presentaciones (p. ej. gasolinas a granel).
  presentation: string | null;
  qty: number;
}

interface CartContextValue {
  items: CartItem[];
  count: number;
  add: (product: Product, presentation: string | null, qty: number) => void;
  remove: (key: string) => void;
  setQty: (key: string, qty: number) => void;
  clear: () => void;
  // Identidad estable de una línea (producto + presentación).
  keyOf: (item: Pick<CartItem, "slug" | "presentation">) => string;
}

const STORAGE_KEY = "qb-pedido-v1";

const CartContext = createContext<CartContextValue | null>(null);

function itemKey(item: Pick<CartItem, "slug" | "presentation">) {
  return `${item.slug}::${item.presentation ?? ""}`;
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  // Evita que el primer efecto de persistencia pise lo guardado con [] antes
  // de haber leído localStorage (patrón de hidratación en export estático).
  const ready = useRef(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) setItems(parsed);
      }
    } catch {
      // localStorage bloqueado o JSON corrupto: arrancamos con pedido vacío.
    }
    ready.current = true;
  }, []);

  useEffect(() => {
    if (!ready.current) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // Sin persistencia: el pedido sigue vivo en memoria durante la sesión.
    }
  }, [items]);

  const add = useCallback<CartContextValue["add"]>((product, presentation, qty) => {
    setItems((prev) => {
      const key = itemKey({ slug: product.slug, presentation });
      const existing = prev.find((it) => itemKey(it) === key);
      if (existing) {
        return prev.map((it) =>
          itemKey(it) === key ? { ...it, qty: it.qty + qty } : it,
        );
      }
      return [
        ...prev,
        { slug: product.slug, name: product.name, brand: product.brand, presentation, qty },
      ];
    });
  }, []);

  const remove = useCallback<CartContextValue["remove"]>((key) => {
    setItems((prev) => prev.filter((it) => itemKey(it) !== key));
  }, []);

  const setQty = useCallback<CartContextValue["setQty"]>((key, qty) => {
    setItems((prev) =>
      qty <= 0
        ? prev.filter((it) => itemKey(it) !== key)
        : prev.map((it) => (itemKey(it) === key ? { ...it, qty } : it)),
    );
  }, []);

  const clear = useCallback(() => setItems([]), []);

  const value = useMemo<CartContextValue>(
    () => ({
      items,
      count: items.reduce((sum, it) => sum + it.qty, 0),
      add,
      remove,
      setQty,
      clear,
      keyOf: itemKey,
    }),
    [items, add, remove, setQty, clear],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart debe usarse dentro de <CartProvider>");
  return ctx;
}
