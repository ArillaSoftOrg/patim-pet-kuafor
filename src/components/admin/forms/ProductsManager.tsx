"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { AdminLoadingState } from "@/components/admin/layout/AdminLoadingState";
import { FormError } from "@/components/admin/forms/FormError";
import { ProductForm } from "@/components/admin/forms/ProductForm";
import { productsRepository } from "@/lib/content/productsRepository";
import { useLocale } from "@/lib/i18n/LocaleProvider";
import type { Product } from "@/data/products";

type View = { mode: "list" } | { mode: "create" } | { mode: "edit"; slug: string };

export function ProductsManager() {
  const { dictionary } = useLocale();
  const t = dictionary.admin.products;
  const [items, setItems] = useState<Product[] | null>(null);
  const [view, setView] = useState<View>({ mode: "list" });
  const [actionError, setActionError] = useState<string | null>(null);

  async function refresh() {
    setItems(await productsRepository.list());
  }

  useEffect(() => {
    let active = true;
    productsRepository.list().then((list) => {
      if (active) setItems(list);
    });
    return () => {
      active = false;
    };
  }, []);

  async function handleDelete(slug: string, name: string) {
    const confirmed = window.confirm(t.deleteConfirmTemplate.replace("{name}", name));
    if (!confirmed) return;
    setActionError(null);
    try {
      await productsRepository.remove(slug);
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
        <ProductForm
          // See the comment on the "edit" branch's `key` below — same
          // reasoning applies to keeping create/edit from being reconciled
          // as the same component instance.
          key="__create__"
          initialProduct={null}
          onSaved={async (slug) => {
            await refresh();
            setView({ mode: "edit", slug });
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
        <ProductForm
          // Keyed by slug so switching the edited product (or arriving
          // here fresh from create, above) always mounts a clean instance
          // with correctly-seeded field state.
          key={view.slug}
          initialProduct={item}
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
        <Button onClick={() => setView({ mode: "create" })}>{t.addProduct}</Button>
      </div>

      <FormError message={actionError} />

      {items.length === 0 ? (
        <EmptyState title={t.emptyTitle} description={t.emptyDescription} />
      ) : (
        <div className="flex flex-col gap-3">
          {items.map((item) => (
            <Card key={item.slug} className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <p className="font-semibold text-foreground">{item.name}</p>
                  {!item.isPublished && (
                    <span className="rounded-full bg-muted px-2 py-0.5 text-[12px] font-medium text-muted-foreground">
                      {t.hiddenBadge}
                    </span>
                  )}
                </div>
                <p className="text-[14px] text-muted-foreground">
                  /products/{item.slug} · {item.brand} · {item.category}
                </p>
              </div>
              <div className="flex gap-2">
                <Button variant="secondary" onClick={() => setView({ mode: "edit", slug: item.slug })}>
                  {dictionary.admin.common.edit}
                </Button>
                <Button variant="destructive" onClick={() => handleDelete(item.slug, item.name)}>
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
