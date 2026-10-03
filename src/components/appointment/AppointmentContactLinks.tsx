import { appointmentCopy } from "@/data/appointment";
import type { AppointmentCopy } from "@/data/appointment";
import type { Business } from "@/data/business";
import { buildTelHref, buildWhatsAppHref, hasValidWhatsAppNumber } from "@/lib/business/contactLinks";

const linkClassName =
  "rounded-sm font-medium text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";

// Direct-contact fallback from the live business record. Renders nothing
// when the business has no usable phone or WhatsApp number.
export function AppointmentContactLinks({ business, copy = appointmentCopy }: { business: Business; copy?: AppointmentCopy }) {
  const phone = business.phone;
  const whatsapp = hasValidWhatsAppNumber(business.whatsapp) ? business.whatsapp : null;
  if (!phone && !whatsapp) return null;

  return (
    <div className="text-[14px] text-foreground">
      <p>{copy.result.contactFallback}</p>
      <ul className="mt-2 flex flex-wrap gap-x-6 gap-y-2">
        {phone && (
          <li>
            <a href={buildTelHref(phone)} className={linkClassName}>
              {copy.result.call} {phone}
            </a>
          </li>
        )}
        {whatsapp && (
          <li>
            <a href={buildWhatsAppHref(whatsapp)} target="_blank" rel="noopener noreferrer" className={linkClassName}>
              {copy.result.whatsapp}
              <span className="sr-only"> {copy.result.newTab}</span>
            </a>
          </li>
        )}
      </ul>
    </div>
  );
}
