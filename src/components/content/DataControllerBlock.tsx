import { Card } from "@/components/ui/Card";
import { Heading } from "@/components/ui/Heading";
import { legalIdentity } from "@/data/legal";
import type { LegalIdentityLabels } from "@/data/legal";

// Renders the data-controller identity (KVKK Madde 10) from the single
// shared legalIdentity object in data/legal.ts. Fields left null there
// show the localized placeholder instead of being silently omitted, so
// it stays obvious — on every legal page, in every language — that the
// business still needs to confirm them. Filling in legalIdentity once is
// the only change needed to make every legal page show the real values.
export function DataControllerBlock({ labels }: { labels: LegalIdentityLabels }) {
  const rows: Array<[string, string | null]> = [
    [labels.tradeName, legalIdentity.tradeName],
    [labels.legalName, legalIdentity.legalName],
    [labels.mersisNo, legalIdentity.mersisNo],
    [labels.taxOffice, legalIdentity.taxOffice],
    [labels.taxNumber, legalIdentity.taxNumber],
    [labels.registeredAddress, legalIdentity.registeredAddress],
    [labels.contactNote, legalIdentity.kvkkContactEmail ?? legalIdentity.kvkkContactAddress],
  ];

  return (
    <Card as="div" className="bg-muted">
      <Heading level="h4" as="h2">
        {labels.heading}
      </Heading>
      <dl className="mt-4 flex flex-col gap-3">
        {rows.map(([label, value]) => (
          <div key={label} className="flex flex-col gap-0.5 sm:flex-row sm:gap-4">
            <dt className="text-[14px] font-medium text-muted-foreground sm:w-56 sm:flex-shrink-0">{label}</dt>
            <dd className={value ? "text-[15px] text-foreground" : "text-[15px] italic text-muted-foreground"}>
              {value ?? labels.unknown}
            </dd>
          </div>
        ))}
      </dl>
    </Card>
  );
}
