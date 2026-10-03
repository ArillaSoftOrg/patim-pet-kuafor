"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { AdminLoadingState } from "@/components/admin/layout/AdminLoadingState";
import { DestructiveConfirm } from "@/components/admin/DestructiveConfirm";
import { FormError } from "@/components/admin/forms/FormError";
import { ServiceForm } from "@/components/admin/forms/ServiceForm";
import { servicesRepository } from "@/lib/content/servicesRepository";
import { useLocale } from "@/lib/i18n/LocaleProvider";
import type { Service } from "@/data/services";

type View = { mode: "list" } | { mode: "create" } | { mode: "edit"; slug: string };

export function ServicesManager() {
  const { dictionary } = useLocale();
  const t = dictionary.admin.services;
  const [items, setItems] = useState<Service[] | null>(null);
  const [view, setView] = useState<View>({ mode: "list" });
  const [actionError, setActionError] = useState<string | null>(null);

  async function refresh() {
    setItems(await servicesRepository.list());
  }

  useEffect(() => {
    let active = true;
    servicesRepository.list().then((list) => {
      if (active) setItems(list);
    });
    return () => {
      active = false;
    };
  }, []);

  async function handleDelete(slug: string, title: string) {
    const confirmed = window.confirm(t.deleteConfirmTemplate.replace("{title}", title));
    if (!confirmed) return;
    setActionError(null);
    try {
      await servicesRepository.remove(slug);
      await refresh();
    } catch (err) {
      setActionError(err instanceof Error ? err.message : t.deleteFailed);
    }
  }

  if (items === null) {
    return <AdminLoadingState />;
  }

  if (view.mode === "create") {
    return (
      <Card>
        <ServiceForm
          initialService={null}
          onSaved={() => {
            setView({ mode: "list" });
            refresh();
          }}
          onCancel={() => setView({ mode: "list" })}
        />
      </Card>
    );
  }

  if (view.mode === "edit") {
    const item = items.find((entry) => entry.slug === view.slug) ?? null;
    return (
      <Card>
        <ServiceForm
          initialService={item}
          onSaved={() => {
            setView({ mode: "list" });
            refresh();
          }}
          onCancel={() => setView({ mode: "list" })}
        />
      </Card>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center gap-3">
        <Button onClick={() => setView({ mode: "create" })}>{t.addService}</Button>
        <DestructiveConfirm
          message={t.resetConfirm}
          confirmWord="RESET"
          actionLabel={t.resetAll}
          pendingLabel={t.resetting}
          onConfirm={async () => {
            setActionError(null);
            try {
              await servicesRepository.reset();
              await refresh();
            } catch (err) {
              setActionError(err instanceof Error ? err.message : t.resetError);
              throw err;
            }
          }}
        />
      </div>

      <FormError message={actionError} />

      {items.length === 0 ? (
        <EmptyState title={t.emptyTitle} description={t.emptyDescription} />
      ) : (
        <div className="flex flex-col gap-3">
          {items.map((item) => (
            <Card key={item.slug} className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="font-semibold text-foreground">{item.title}</p>
                <p className="text-[14px] text-muted-foreground">/services/{item.slug}</p>
              </div>
              <div className="flex gap-2">
                <Button variant="secondary" onClick={() => setView({ mode: "edit", slug: item.slug })}>
                  {dictionary.admin.common.edit}
                </Button>
                <Button variant="destructive" onClick={() => handleDelete(item.slug, item.title)}>
                  {dictionary.admin.common.delete}
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
