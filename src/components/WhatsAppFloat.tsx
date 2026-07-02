import { buildWhatsAppLink } from "@/lib/site-config";

export default function WhatsAppFloat() {
  const href = buildWhatsAppLink(
    "Hola, quiero información sobre el inventario de Quality Bikes."
  );

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Escribir por WhatsApp"
      className="fixed z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg shadow-black/20 transition hover:scale-105"
      style={{
        right: "calc(1.25rem + env(safe-area-inset-right))",
        bottom: "calc(1.25rem + env(safe-area-inset-bottom))",
      }}
    >
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-7 w-7" aria-hidden="true">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.148.198 2.095 3.2 5.076 4.487.71.306 1.263.489 1.694.626.712.227 1.36.195 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
        <path d="M12.004 2C6.486 2 2 6.486 2 12.004c0 1.888.51 3.716 1.476 5.318L2 22l4.828-1.442a9.96 9.96 0 0 0 5.176 1.442h.004c5.518 0 10.004-4.486 10.004-10.004C22.012 6.486 17.526 2 12.004 2zm0 18.176a8.14 8.14 0 0 1-4.152-1.136l-.298-.177-2.868.856.86-2.797-.194-.287a8.15 8.15 0 0 1-1.242-4.335c0-4.51 3.67-8.18 8.18-8.18a8.13 8.13 0 0 1 5.786 2.398 8.13 8.13 0 0 1 2.395 5.784c0 4.51-3.67 8.18-8.18 8.18z" />
      </svg>
    </a>
  );
}
