"use client";

import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { AdminPageHeader } from "@/components/admin/layout/AdminPageHeader";
import { adminNavItems } from "@/components/admin/layout/adminNav";
import { adminNavLabel } from "@/lib/i18n/adminNavLabels";
import { useLocale } from "@/lib/i18n/LocaleProvider";
import type { Dictionary } from "@/lib/i18n/dictionaries";

function sectionDescription(dictionary: Dictionary, href: string): string {
  const sections = dictionary.admin.dashboard.sections;
  const key = href.replace("/admin/", "") as keyof typeof sections;
  return sections[key] ?? "";
}

export default function AdminDashboardPage() {
  const { dictionary } = useLocale();
  const sections = adminNavItems.filter((item) => item.href !== "/admin");

  return (
    <div className="flex flex-col gap-6">
      <AdminPageHeader
        title={dictionary.admin.dashboard.title}
        description={dictionary.admin.dashboard.description}
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {sections.map((item) => (
          <Card key={item.href} as="article" interactive className="relative flex flex-col gap-2">
            <Link
              href={item.href}
              className="font-semibold text-foreground after:absolute after:inset-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm"
            >
              {adminNavLabel(dictionary, item)}
            </Link>
            <p className="text-[14px] text-muted-foreground">{sectionDescription(dictionary, item.href)}</p>
          </Card>
        ))}
      </div>
    </div>
  );
}
