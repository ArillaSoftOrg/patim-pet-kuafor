"use client";

import { Card } from "@/components/ui/Card";
import { AdminPageHeader } from "@/components/admin/layout/AdminPageHeader";
import { BusinessForm } from "@/components/admin/forms/BusinessForm";
import { useLocale } from "@/lib/i18n/LocaleProvider";

export default function AdminBusinessPage() {
  const { dictionary } = useLocale();
  return (
    <div className="flex flex-col gap-6">
      <AdminPageHeader title={dictionary.admin.business.title} description={dictionary.admin.business.description} />
      <Card>
        <BusinessForm />
      </Card>
    </div>
  );
}
