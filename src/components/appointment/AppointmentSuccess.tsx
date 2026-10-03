import { Button, buttonVariants } from "@/components/ui/Button";
import { AppointmentContactLinks } from "@/components/appointment/AppointmentContactLinks";
import { AppointmentSummary } from "@/components/appointment/AppointmentSummary";
import { appointmentCopy } from "@/data/appointment";
import type { AppointmentCopy } from "@/data/appointment";
import type { Business } from "@/data/business";
import { formatAppointmentReference } from "@/lib/appointments/format";
import type { Appointment } from "@/lib/appointments/types";
import { buildAppointmentWhatsAppMessage } from "@/lib/appointments/whatsappMessage";
import { buildWhatsAppHref, hasValidWhatsAppNumber } from "@/lib/business/contactLinks";

export const SUCCESS_HEADING_ID = "appointment-success-heading";

interface AppointmentSuccessProps {
  appointment: Appointment;
  business: Business;
  onStartOver: () => void;
  copy?: AppointmentCopy;
}

export function AppointmentSuccess({ appointment, business, onStartOver, copy = appointmentCopy }: AppointmentSuccessProps) {
  // Only link to WhatsApp when the live number can actually form a wa.me
  // link; otherwise fall back to whatever direct contact exists.
  const whatsappHref = hasValidWhatsAppNumber(business.whatsapp)
    ? buildWhatsAppHref(business.whatsapp, buildAppointmentWhatsAppMessage(appointment, business.name, copy))
    : null;

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2
          id={SUCCESS_HEADING_ID}
          tabIndex={-1}
          className="text-[22px] font-semibold leading-[1.25] text-foreground focus:outline-none"
        >
          {copy.result.successTitle}
        </h2>
        <p className="mt-2 text-[15px] text-muted-foreground">{copy.result.successDescription}</p>
      </div>

      <AppointmentSummary input={appointment} reference={formatAppointmentReference(appointment.id)} copy={copy} />

      {whatsappHref ? (
        <div className="flex flex-col items-start gap-2">
          <a
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            className={buttonVariants({ variant: "primary", size: "lg", className: "w-full sm:w-auto" })}
          >
            {copy.result.whatsappCta}
            <span className="sr-only"> {copy.result.newTab}</span>
          </a>
          <p className="text-[13px] text-muted-foreground">{copy.result.whatsappHelper}</p>
        </div>
      ) : (
        <AppointmentContactLinks business={business} copy={copy} />
      )}

      <div className="border-t border-border pt-6">
        <Button type="button" variant="secondary" onClick={onStartOver} className="w-full sm:w-auto">
          {copy.actions.startOver}
        </Button>
      </div>
    </div>
  );
}
