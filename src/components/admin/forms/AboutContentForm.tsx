"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";
import { AdminLoadingState } from "@/components/admin/layout/AdminLoadingState";
import { FormError } from "@/components/admin/forms/FormError";
import { useUnsavedChangesWarning } from "@/components/admin/useUnsavedChangesWarning";
import { aboutRepository } from "@/lib/content/aboutRepository";
import { aboutContent as defaultAbout } from "@/data/about";
import { useLocale } from "@/lib/i18n/LocaleProvider";
import type { FormEvent } from "react";
import type { AboutContent } from "@/data/about";

type SaveStatus = "idle" | "saving" | "saved";

export function AboutContentForm() {
  const { dictionary } = useLocale();
  const t = dictionary.admin.aboutForm;
  const [form, setForm] = useState<AboutContent>(defaultAbout);
  const [loaded, setLoaded] = useState(false);
  const [status, setStatus] = useState<SaveStatus>("idle");
  const [dirty, setDirty] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useUnsavedChangesWarning(dirty);

  useEffect(() => {
    let active = true;
    aboutRepository.get().then((value) => {
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

  function updateValueItem(index: number, patch: Partial<{ title: string; description: string }>) {
    markDirty();
    setForm((prev) => ({
      ...prev,
      values: {
        ...prev.values,
        items: prev.values.items.map((item, i) => (i === index ? { ...item, ...patch } : item)),
      },
    }));
  }
  function addValueItem() {
    markDirty();
    setForm((prev) => ({
      ...prev,
      values: { ...prev.values, items: [...prev.values.items, { title: "", description: "" }] },
    }));
  }
  function removeValueItem(index: number) {
    markDirty();
    setForm((prev) => ({
      ...prev,
      values: { ...prev.values, items: prev.values.items.filter((_, i) => i !== index) },
    }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("saving");
    const cleaned: AboutContent = {
      ...form,
      values: {
        ...form.values,
        items: form.values.items
          .map((item) => ({ title: item.title.trim(), description: item.description.trim() }))
          .filter((item) => item.title || item.description),
      },
    };
    setError(null);
    try {
      await aboutRepository.set(cleaned);
      setForm(cleaned);
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
      await aboutRepository.reset();
      setForm(defaultAbout);
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
        <legend className="text-[16px] font-semibold text-foreground">{t.sections.mobileStory}</legend>
        <div className="grid gap-5 sm:grid-cols-2">
          <div className="flex flex-col gap-2">
            <label className="text-[14px] font-medium text-foreground">{dictionary.admin.common.eyebrow}</label>
            <Input
              value={form.mobileStory.eyebrow}
              onChange={(e) => {
                markDirty();
                setForm((p) => ({ ...p, mobileStory: { ...p.mobileStory, eyebrow: e.target.value } }));
              }}
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-[14px] font-medium text-foreground">{dictionary.admin.common.heading}</label>
            <Input
              value={form.mobileStory.heading}
              onChange={(e) => {
                markDirty();
                setForm((p) => ({ ...p, mobileStory: { ...p.mobileStory, heading: e.target.value } }));
              }}
              required
            />
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-[14px] font-medium text-foreground">{dictionary.admin.common.description}</label>
          <Textarea
            value={form.mobileStory.description}
            onChange={(e) => {
              markDirty();
              setForm((p) => ({ ...p, mobileStory: { ...p.mobileStory, description: e.target.value } }));
            }}
            required
          />
        </div>
      </fieldset>

      <fieldset className="flex flex-col gap-4">
        <legend className="text-[16px] font-semibold text-foreground">{t.sections.values}</legend>
        <div className="flex flex-col gap-2">
          <label className="text-[14px] font-medium text-foreground">{dictionary.admin.common.heading}</label>
          <Input
            value={form.values.heading}
            onChange={(e) => {
              markDirty();
              setForm((p) => ({ ...p, values: { ...p.values, heading: e.target.value } }));
            }}
            required
          />
        </div>
        <div className="flex flex-col gap-3">
          {form.values.items.map((item, i) => (
            <div key={i} className="grid gap-2 rounded-md border border-border p-3 sm:grid-cols-[1fr_2fr_auto]">
              <Input
                placeholder={dictionary.admin.homepageForm.fields.titlePlaceholder}
                value={item.title}
                onChange={(e) => updateValueItem(i, { title: e.target.value })}
              />
              <Input
                placeholder={dictionary.admin.homepageForm.fields.descriptionPlaceholder}
                value={item.description}
                onChange={(e) => updateValueItem(i, { description: e.target.value })}
              />
              <Button type="button" variant="tertiary" onClick={() => removeValueItem(i)}>
                {dictionary.admin.common.remove}
              </Button>
            </div>
          ))}
          <Button type="button" variant="secondary" onClick={addValueItem} className="self-start">
            {t.addValue}
          </Button>
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
