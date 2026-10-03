"use client";

import { AdminPageHeader } from "@/components/admin/layout/AdminPageHeader";
import { AppointmentsManager } from "@/components/admin/appointments/AppointmentsManager";
import { useLocale } from "@/lib/i18n/LocaleProvider";

export default function AdminAppointmentsPage() {
  const { dictionary } = useLocale();
  return (
    <div className="flex flex-col gap-6">
      <AdminPageHeader
        title={dictionary.admin.appointments.title}
        description={dictionary.admin.appointments.description}
      />
      <AppointmentsManager />
    </div>
  );
}
