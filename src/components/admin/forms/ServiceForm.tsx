"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";
import { FormError } from "@/components/admin/forms/FormError";
import { useUnsavedChangesWarning } from "@/components/admin/useUnsavedChangesWarning";
import { servicesRepository } from "@/lib/content/servicesRepository";
import { useLocale } from "@/lib/i18n/LocaleProvider";
import type { Service, ServiceProcessStep } from "@/data/services";

const SLUG_PATTERN = /^[a-z0-9]+(-[a-z0-9]+)*$/;

function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

interface ServiceFormProps {
  // null = create.
  initialService: Service | null;
  onSaved: () => void;
  onCancel: () => void;
}

export function ServiceForm({ initialService, onSaved, onCancel }: ServiceFormProps) {
  const { dictionary } = useLocale();
  const t = dictionary.admin.services.form;
  const isEditing = initialService !== null;

  const [slug, setSlug] = useState(initialService?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(isEditing);
  const [title, setTitle] = useState(initialService?.title ?? "");
  const [shortDescription, setShortDescription] = useState(initialService?.shortDescription ?? "");
  const [overview, setOverview] = useState(initialService?.overview ?? "");
  const [whoItsFor, setWhoItsFor] = useState<string[]>(initialService?.whoItsFor ?? []);
  const [processSteps, setProcessSteps] = useState<ServiceProcessStep[]>(initialService?.process ?? []);

  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [dirty, setDirty] = useState(false);

  useUnsavedChangesWarning(dirty);

  function markDirty() {
    setDirty(true);
  }

  function updateWhoItsFor(index: number, value: string) {
    markDirty();
    setWhoItsFor((prev) => prev.map((item, i) => (i === index ? value : item)));
  }
  function addWhoItsFor() {
    markDirty();
    setWhoItsFor((prev) => [...prev, ""]);
  }
  function removeWhoItsFor(index: number) {
    markDirty();
    setWhoItsFor((prev) => prev.filter((_, i) => i !== index));
  }

  function updateProcessStep(index: number, patch: Partial<ServiceProcessStep>) {
    markDirty();
    setProcessSteps((prev) => prev.map((step, i) => (i === index ? { ...step, ...patch } : step)));
  }
  function addProcessStep() {
    markDirty();
    setProcessSteps((prev) => [...prev, { title: "", description: "" }]);
  }
  function removeProcessStep(index: number) {
    markDirty();
    setProcessSteps((prev) => prev.filter((_, i) => i !== index));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    const cleanedSlug = slug.trim().toLowerCase();
    if (!SLUG_PATTERN.test(cleanedSlug)) {
      setError(t.slugError);
      return;
    }

    const cleanedTitle = title.trim();
    const cleanedShortDescription = shortDescription.trim();
    const cleanedOverview = overview.trim();
    if (!cleanedTitle || !cleanedShortDescription || !cleanedOverview) {
      setError(t.requiredFieldsError);
      return;
    }

    const service: Service = {
      slug: cleanedSlug,
      title: cleanedTitle,
      shortDescription: cleanedShortDescription,
      overview: cleanedOverview,
      whoItsFor: whoItsFor.map((item) => item.trim()).filter(Boolean),
      process: processSteps
        .map((step) => ({ title: step.title.trim(), description: step.description.trim() }))
        .filter((step) => step.title || step.description),
      image: initialService?.image ?? null,
    };

    setSaving(true);
    try {
      if (isEditing && initialService) {
        await servicesRepository.update(initialService.slug, service);
      } else {
        await servicesRepository.create(service);
      }
      setDirty(false);
      onSaved();
    } catch (err) {
      setError(err instanceof Error ? err.message : t.saveFailed);
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <div className="flex flex-col gap-2 sm:max-w-xs">
        <label htmlFor="service-slug" className="text-[14px] font-medium text-foreground">
          {t.slug}
        </label>
        <Input
          id="service-slug"
          value={slug}
          onChange={(event) => {
            markDirty();
            setSlug(event.target.value);
            setSlugTouched(true);
          }}
          error={Boolean(error)}
          required
        />
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="service-title" className="text-[14px] font-medium text-foreground">
          {t.title}
        </label>
        <Input
          id="service-title"
          value={title}
          onChange={(event) => {
            markDirty();
            setTitle(event.target.value);
            if (!slugTouched) setSlug(slugify(event.target.value));
          }}
          required
        />
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="service-short-description" className="text-[14px] font-medium text-foreground">
          {t.shortDescription}
        </label>
        <Textarea
          id="service-short-description"
          value={shortDescription}
          onChange={(event) => {
            markDirty();
            setShortDescription(event.target.value);
          }}
          required
        />
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="service-overview" className="text-[14px] font-medium text-foreground">
          {t.overview}
        </label>
        <Textarea
          id="service-overview"
          value={overview}
          onChange={(event) => {
            markDirty();
            setOverview(event.target.value);
          }}
          required
        />
      </div>

      <div className="flex flex-col gap-3">
        <span className="text-[14px] font-medium text-foreground">{t.whoItsFor}</span>
        {whoItsFor.map((item, index) => (
          <div key={index} className="flex gap-2">
            <Input
              value={item}
              onChange={(event) => updateWhoItsFor(index, event.target.value)}
              aria-label={t.whoItsForItemAriaTemplate.replace("{n}", String(index + 1))}
            />
            <Button type="button" variant="tertiary" onClick={() => removeWhoItsFor(index)}>
              {dictionary.admin.common.remove}
            </Button>
          </div>
        ))}
        <Button type="button" variant="secondary" onClick={addWhoItsFor} className="self-start">
          {t.addItem}
        </Button>
      </div>

      <div className="flex flex-col gap-3">
        <span className="text-[14px] font-medium text-foreground">{t.processSteps}</span>
        {processSteps.map((step, index) => (
          <div
            key={index}
            className="grid gap-2 rounded-md border border-border p-3 sm:grid-cols-[1fr_2fr_auto] sm:items-start"
          >
            <Input
              placeholder={t.stepTitlePlaceholder}
              value={step.title}
              onChange={(event) => updateProcessStep(index, { title: event.target.value })}
              aria-label={t.processStepTitleAriaTemplate.replace("{n}", String(index + 1))}
            />
            <Input
              placeholder={t.stepDescriptionPlaceholder}
              value={step.description}
              onChange={(event) => updateProcessStep(index, { description: event.target.value })}
              aria-label={t.processStepDescriptionAriaTemplate.replace("{n}", String(index + 1))}
            />
            <Button type="button" variant="tertiary" onClick={() => removeProcessStep(index)}>
              {dictionary.admin.common.remove}
            </Button>
          </div>
        ))}
        <Button type="button" variant="secondary" onClick={addProcessStep} className="self-start">
          {t.addStep}
        </Button>
      </div>

      <FormError message={error} />

      <div className="flex gap-3">
        <Button type="submit" disabled={saving}>
          {saving ? dictionary.admin.common.saving : isEditing ? dictionary.admin.common.save : t.createService}
        </Button>
        <Button type="button" variant="secondary" onClick={onCancel}>
          {dictionary.admin.common.cancel}
        </Button>
      </div>
    </form>
  );
}
