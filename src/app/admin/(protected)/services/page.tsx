"use client";

import { AdminPageHeader } from "@/components/admin/layout/AdminPageHeader";
import { ServicesManager } from "@/components/admin/forms/ServicesManager";
import { useLocale } from "@/lib/i18n/LocaleProvider";

export default function AdminServicesPage() {
  const { dictionary } = useLocale();
  return (
    <div className="flex flex-col gap-6">
      <AdminPageHeader title={dictionary.admin.nav.services} description={dictionary.admin.services.description} />
      <ServicesManager />
    </div>
  );
}
