"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";
import { AdminLoadingState } from "@/components/admin/layout/AdminLoadingState";
import { FormError } from "@/components/admin/forms/FormError";
import { useUnsavedChangesWarning } from "@/components/admin/useUnsavedChangesWarning";
import { contactPageRepository } from "@/lib/content/contactPageRepository";
import { contactPageContent as defaultContactPage } from "@/data/contactPage";
import { useLocale } from "@/lib/i18n/LocaleProvider";
import type { FormEvent } from "react";
import type { ContactPageContent } from "@/data/contactPage";

type SaveStatus = "idle" | "saving" | "saved";

export function ContactPageContentForm() {
  const { dictionary } = useLocale();
  const t = dictionary.admin.contactPageForm;
  const [form, setForm] = useState<ContactPageContent>(defaultContactPage);
  const [loaded, setLoaded] = useState(false);
  const [status, setStatus] = useState<SaveStatus>("idle");
  const [dirty, setDirty] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useUnsavedChangesWarning(dirty);

  useEffect(() => {
    let active = true;
    contactPageRepository.get().then((value) => {
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
      await contactPageRepository.set(form);
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
      await contactPageRepository.reset();
      setForm(defaultContactPage);
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
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <label className="text-[14px] font-medium text-foreground">{dictionary.admin.common.title}</label>
        <Input
          value={form.title}
          onChange={(e) => {
            markDirty();
            setForm((p) => ({ ...p, title: e.target.value }));
          }}
          required
        />
      </div>
      <div className="flex flex-col gap-2">
        <label className="text-[14px] font-medium text-foreground">{dictionary.admin.common.description}</label>
        <Textarea
          value={form.description}
          onChange={(e) => {
            markDirty();
            setForm((p) => ({ ...p, description: e.target.value }));
          }}
          required
        />
      </div>

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
