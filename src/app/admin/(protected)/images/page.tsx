"use client";

import { AdminPageHeader } from "@/components/admin/layout/AdminPageHeader";
import { ImagesManager } from "@/components/admin/images/ImagesManager";
import { useLocale } from "@/lib/i18n/LocaleProvider";

export default function AdminImagesPage() {
  const { dictionary } = useLocale();
  return (
    <div className="flex flex-col gap-6">
      <AdminPageHeader title={dictionary.admin.nav.images} description={dictionary.admin.images.description} />
      <ImagesManager />
    </div>
  );
}
