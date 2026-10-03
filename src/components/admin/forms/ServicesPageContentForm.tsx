"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";
import { AdminLoadingState } from "@/components/admin/layout/AdminLoadingState";
import { FormError } from "@/components/admin/forms/FormError";
import { useUnsavedChangesWarning } from "@/components/admin/useUnsavedChangesWarning";
import { servicesPageRepository } from "@/lib/content/servicesPageRepository";
import { servicesPageContent as defaultServicesPage } from "@/data/servicesPage";
import { useLocale } from "@/lib/i18n/LocaleProvider";
import type { FormEvent } from "react";
import type { ServicesPageContent } from "@/data/servicesPage";

type SaveStatus = "idle" | "saving" | "saved";

export function ServicesPageContentForm() {
  const { dictionary } = useLocale();
  const t = dictionary.admin.servicesPageForm;
  const [form, setForm] = useState<ServicesPageContent>(defaultServicesPage);
  const [loaded, setLoaded] = useState(false);
  const [status, setStatus] = useState<SaveStatus>("idle");
  const [dirty, setDirty] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useUnsavedChangesWarning(dirty);

  useEffect(() => {
    let active = true;
    servicesPageRepository.get().then((value) => {
      if (!active) return;
      setForm(value);
      setLoaded(true);
    });
    return () => {
      active = false;
    };
  }, []);

  function markDirty() {
    setStatus("idle");
    setDirty(true);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("saving");
    setError(null);
    try {
      await servicesPageRepository.set(form);
      setStatus("saved");
      setDirty(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : t.saveError);
      setStatus("idle");
    }
  }

  async function handleReset() {
    const confirmed = window.confirm(t.resetConfirm);
    if (!confirmed) return;
    setError(null);
    try {
      await servicesPageRepository.reset();
      setForm(defaultServicesPage);
      setStatus("idle");
      setDirty(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : t.resetError);
    }
  }

  if (!loaded) {
    return <AdminLoadingState />;
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-8">
      <fieldset className="flex flex-col gap-4">
        <legend className="text-[16px] font-semibold text-foreground">{t.sections.pageHeader}</legend>
        <div className="grid gap-5 sm:grid-cols-2">
          <div className="flex flex-col gap-2">
            <label className="text-[14px] font-medium text-foreground">{dictionary.admin.common.eyebrow}</label>
            <Input
              value={form.header.eyebrow}
              onChange={(e) => {
                markDirty();
                setForm((p) => ({ ...p, header: { ...p.header, eyebrow: e.target.value } }));
              }}
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-[14px] font-medium text-foreground">{dictionary.admin.common.title}</label>
            <Input
              value={form.header.title}
              onChange={(e) => {
                markDirty();
                setForm((p) => ({ ...p, header: { ...p.header, title: e.target.value } }));
              }}
              required
            />
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-[14px] font-medium text-foreground">{dictionary.admin.common.description}</label>
          <Textarea
            value={form.header.description}
            onChange={(e) => {
              markDirty();
              setForm((p) => ({ ...p, header: { ...p.header, description: e.target.value } }));
            }}
            required
          />
        </div>
      </fieldset>

      <fieldset className="flex flex-col gap-4">
        <legend className="text-[16px] font-semibold text-foreground">{t.sections.cta}</legend>
        <div className="flex flex-col gap-2">
          <label className="text-[14px] font-medium text-foreground">{dictionary.admin.common.heading}</label>
          <Input
            value={form.cta.heading}
            onChange={(e) => {
              markDirty();
              setForm((p) => ({ ...p, cta: { ...p.cta, heading: e.target.value } }));
            }}
            required
          />
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-[14px] font-medium text-foreground">{dictionary.admin.common.description}</label>
          <Textarea
            value={form.cta.description}
            onChange={(e) => {
              markDirty();
              setForm((p) => ({ ...p, cta: { ...p.cta, description: e.target.value } }));
            }}
            required
          />
        </div>
      </fieldset>

      <FormError message={error} />

      <div className="flex flex-wrap items-center gap-3">
        <Button type="submit" disabled={status === "saving"}>
          {status === "saving" ? dictionary.admin.common.saving : dictionary.admin.common.save}
        </Button>
        <Button type="button" variant="secondary" onClick={handleReset}>
          {dictionary.admin.common.reset}
        </Button>
        {status === "saved" && <span className="text-[14px] text-success">{dictionary.admin.common.saved}</span>}
      </div>
    </form>
  );
}
