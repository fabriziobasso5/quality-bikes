"use client";

import { useState } from "react";
import MotoPhoto from "./MotoPhoto";
import type { Motorcycle } from "@/data/motorcycles";

export default function MotoGallery({ moto }: { moto: Motorcycle }) {
  const [active, setActive] = useState(1);
  const total = moto.photoCount || 1;

  return (
    <div>
      <MotoPhoto
        moto={moto}
        index={active}
        className="h-96 w-full lg:h-[480px]"
        sizes="(max-width: 1024px) 100vw, 50vw"
        priority
      />
      {total > 1 && (
        <div className="mt-3 grid grid-cols-5 gap-2">
          {Array.from({ length: total }, (_, i) => i + 1).map((i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              aria-label={`Ver foto ${i}`}
              className={`overflow-hidden border transition ${
                active === i ? "border-brand-navy" : "border-black/10 opacity-70 hover:opacity-100"
              }`}
            >
              <MotoPhoto moto={moto} index={i} className="h-16 w-full" sizes="20vw" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
