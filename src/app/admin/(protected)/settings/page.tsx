"use client";

import { AdminPageHeader } from "@/components/admin/layout/AdminPageHeader";
import { SettingsPanel } from "@/components/admin/forms/SettingsPanel";
import { useLocale } from "@/lib/i18n/LocaleProvider";

export default function AdminSettingsPage() {
  const { dictionary } = useLocale();
  return (
    <div className="flex flex-col gap-6">
      <AdminPageHeader title={dictionary.admin.settings.title} description={dictionary.admin.settings.description} />
      <SettingsPanel />
    </div>
  );
}
