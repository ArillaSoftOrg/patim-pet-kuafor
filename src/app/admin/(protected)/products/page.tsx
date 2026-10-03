"use client";

import { AdminPageHeader } from "@/components/admin/layout/AdminPageHeader";
import { ProductsManager } from "@/components/admin/forms/ProductsManager";
import { useLocale } from "@/lib/i18n/LocaleProvider";

export default function AdminProductsPage() {
  const { dictionary } = useLocale();
  return (
    <div className="flex flex-col gap-6">
      <AdminPageHeader title={dictionary.admin.nav.products} description={dictionary.admin.products.description} />
      <ProductsManager />
    </div>
  );
}
