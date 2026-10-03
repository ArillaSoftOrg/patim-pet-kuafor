"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { AdminLoadingState } from "@/components/admin/layout/AdminLoadingState";
import { DestructiveConfirm } from "@/components/admin/DestructiveConfirm";
import { FormError } from "@/components/admin/forms/FormError";
import { FaqForm } from "@/components/admin/forms/FaqForm";
import { faqsRepository } from "@/lib/content/faqsRepository";
import { useLocale } from "@/lib/i18n/LocaleProvider";
import type { Faq } from "@/data/faqs";

type View = { mode: "list" } | { mode: "create" } | { mode: "edit"; id: string };

export function FaqManager() {
  const { dictionary } = useLocale();
  const t = dictionary.admin.faq;
  const [items, setItems] = useState<Faq[] | null>(null);
  const [view, setView] = useState<View>({ mode: "list" });
  const [actionError, setActionError] = useState<string | null>(null);

  async function refresh() {
    setItems(await faqsRepository.list());
  }

  useEffect(() => {
    let active = true;
    faqsRepository.list().then((list) => {
      if (active) setItems(list);
    });
    return () => {
      active = false;
    };
  }, []);

  async function handleDelete(id: string, question: string) {
    const confirmed = window.confirm(t.deleteConfirmTemplate.replace("{question}", question));
    if (!confirmed) return;
    setActionError(null);
    try {
      await faqsRepository.remove(id);
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
        <FaqForm
          initialFaq={null}
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
    const item = items.find((entry) => entry.id === view.id) ?? null;
    return (
      <Card>
        <FaqForm
          initialFaq={item}
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
        <Button onClick={() => setView({ mode: "create" })}>{t.addFaq}</Button>
        <DestructiveConfirm
          message={t.removeAllConfirm}
          confirmWord="DELETE"
          actionLabel={t.removeAll}
          pendingLabel={t.removing}
          onConfirm={async () => {
            setActionError(null);
            try {
              await faqsRepository.reset();
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
            <Card key={item.id} className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-[13px] font-medium uppercase tracking-wide text-primary">
                  {dictionary.shared.faqCategories[item.category]}
                </p>
                <p className="font-semibold text-foreground">{item.question}</p>
              </div>
              <div className="flex gap-2">
                <Button variant="secondary" onClick={() => setView({ mode: "edit", id: item.id })}>
                  {dictionary.admin.common.edit}
                </Button>
                <Button variant="destructive" onClick={() => handleDelete(item.id, item.question)}>
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
