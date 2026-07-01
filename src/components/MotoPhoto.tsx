import Image from "next/image";
import MotoImagePlaceholder from "./MotoImagePlaceholder";
import type { Motorcycle } from "@/data/motorcycles";

export default function MotoPhoto({
  moto,
  index = 1,
  className = "",
  sizes,
  priority = false,
}: {
  moto: Motorcycle;
  index?: number;
  className?: string;
  sizes?: string;
  priority?: boolean;
}) {
  if (!moto.photoCount || index > moto.photoCount) {
    return <MotoImagePlaceholder brand={moto.brand} model={moto.model} className={className} />;
  }

  return (
    <div className={`relative ${className}`}>
      <Image
        src={`/images/inventory/${moto.slug}/${index}.webp`}
        alt={`${moto.brand} ${moto.model}`}
        fill
        sizes={sizes ?? "(max-width: 768px) 100vw, 50vw"}
        className="object-cover"
        priority={priority}
      />
    </div>
  );
}
