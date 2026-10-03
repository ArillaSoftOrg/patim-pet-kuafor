import Link from "next/link";
import { FormField } from "@/components/ui/FormField";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { fieldId } from "@/components/appointment/wizardState";
import type { StepProps } from "@/components/appointment/steps/stepProps";
import { messagingFeatureFlags } from "@/lib/messaging/featureFlags";
import { useLocale } from "@/lib/i18n/LocaleProvider";
import { buildLocalizedPath } from "@/lib/i18n/pathLocale";

export function CustomerStep({ state, dispatch, errorFor, copy }: StepProps) {
  const { locale } = useLocale();
  const { customer } = state;

  return (
    <div className="flex flex-col gap-6">
      <FormField id={fieldId("customer.fullName")} label={copy.fields.fullName.label} error={errorFor("customer.fullName")}>
        {(control) => (
          <Input
            {...control}
            value={customer.fullName}
            onChange={(event) => dispatch({ type: "setCustomer", field: "fullName", value: event.target.value })}
            autoComplete="name"
          />
        )}
      </FormField>

      <div className="grid gap-6 sm:grid-cols-2">
        <FormField
          id={fieldId("customer.phone")}
          label={copy.fields.phone.label}
          helper={copy.fields.phone.helper}
          error={errorFor("customer.phone")}
        >
          {(control) => (
            <Input
              {...control}
              type="tel"
              inputMode="tel"
              value={customer.phone}
              onChange={(event) => dispatch({ type: "setCustomer", field: "phone", value: event.target.value })}
              autoComplete="tel"
            />
          )}
        </FormField>

        <FormField
          id={fieldId("customer.email")}
          label={copy.fields.email.label}
          labelSuffix={copy.optional}
          error={errorFor("customer.email")}
        >
          {(control) => (
            <Input
              {...control}
              type="email"
              value={customer.email}
              onChange={(event) => dispatch({ type: "setCustomer", field: "email", value: event.target.value })}
              autoComplete="email"
            />
          )}
        </FormField>
      </div>

      <FormField
        id={fieldId("customer.notes")}
        label={copy.fields.customerNotes.label}
        labelSuffix={copy.optional}
        error={errorFor("customer.notes")}
      >
        {(control) => (
          <Textarea
            {...control}
            value={customer.notes}
            onChange={(event) => dispatch({ type: "setCustomer", field: "notes", value: event.target.value })}
          />
        )}
      </FormField>

      <p className="text-[13px] text-muted-foreground">
        {copy.privacy.formNote}{" "}
        <Link
          href={buildLocalizedPath(locale, "/kvkk")}
          className="rounded-sm font-medium text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          {copy.privacy.kvkkLink}
        </Link>
        {" · "}
        <Link
          href={buildLocalizedPath(locale, "/privacy")}
          className="rounded-sm font-medium text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          {copy.privacy.policyLink}
        </Link>
      </p>

      {/* Entirely separate from the KVKK/Privacy note above — a different
          consent, for a different purpose, never bundled with the
          appointment disclosure. Only rendered at all when a messaging
          package has turned this feature on for this deployment; unchecked
          by default and never required to continue. */}
      {messagingFeatureFlags.marketingConsentEnabled && (
        <label className="flex items-start gap-3 rounded-lg border border-border p-4">
          <input
            type="checkbox"
            checked={state.marketingConsent}
            onChange={(event) => dispatch({ type: "setMarketingConsent", value: event.target.checked })}
            className="mt-0.5 h-4 w-4 flex-shrink-0 rounded border-border text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
          <span className="flex flex-col gap-1">
            <span className="text-[14px] font-medium text-foreground">{copy.marketing.checkboxLabel}</span>
            <span className="text-[13px] text-muted-foreground">{copy.marketing.helper}</span>
          </span>
        </label>
      )}
    </div>
  );
}
