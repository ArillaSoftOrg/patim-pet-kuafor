"use client";

import { AdminPageHeader } from "@/components/admin/layout/AdminPageHeader";
import { ContentTabs } from "@/components/admin/content/ContentTabs";
import { useLocale } from "@/lib/i18n/LocaleProvider";

export default function AdminContentPage() {
  const { dictionary } = useLocale();
  return (
    <div className="flex flex-col gap-6">
      <AdminPageHeader title={dictionary.admin.content.title} description={dictionary.admin.content.description} />
      <ContentTabs />
    </div>
  );
}
