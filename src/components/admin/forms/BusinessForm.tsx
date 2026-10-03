"use client";

import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";
import { AdminLoadingState } from "@/components/admin/layout/AdminLoadingState";
import { FormError } from "@/components/admin/forms/FormError";
import { useUnsavedChangesWarning } from "@/components/admin/useUnsavedChangesWarning";
import { businessRepository } from "@/lib/content/businessRepository";
import { business as defaultBusiness } from "@/data/business";
import { useLocale } from "@/lib/i18n/LocaleProvider";
import type { Business, SocialLink } from "@/data/business";

type Status = "idle" | "saving" | "saved";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function isValidHttpUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

export function BusinessForm() {
  const { dictionary } = useLocale();
  const t = dictionary.admin.business;
  const [form, setForm] = useState<Business>(defaultBusiness);
  const [loaded, setLoaded] = useState(false);
  const [status, setStatus] = useState<Status>("idle");
  const [dirty, setDirty] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useUnsavedChangesWarning(dirty);

  useEffect(() => {
    let active = true;
    businessRepository.get().then((value) => {
      if (!active) return;
      setForm(value);
      setLoaded(true);
    });
    return () => {
      active = false;
    };
  }, []);

  function updateField<K extends keyof Business>(key: K, value: Business[K]) {
    setStatus("idle");
    setDirty(true);
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function updateServiceArea(index: number, value: string) {
    setStatus("idle");
    setDirty(true);
    setForm((prev) => ({
      ...prev,
      serviceAreas: prev.serviceAreas.map((area, i) => (i === index ? value : area)),
    }));
  }
  function addServiceArea() {
    setDirty(true);
    setForm((prev) => ({ ...prev, serviceAreas: [...prev.serviceAreas, ""] }));
  }
  function removeServiceArea(index: number) {
    setDirty(true);
    setForm((prev) => ({
      ...prev,
      serviceAreas: prev.serviceAreas.filter((_, i) => i !== index),
    }));
  }

  function updateSocialLink(index: number, patch: Partial<SocialLink>) {
    setStatus("idle");
    setDirty(true);
    setForm((prev) => ({
      ...prev,
      socialLinks: prev.socialLinks.map((link, i) => (i === index ? { ...link, ...patch } : link)),
    }));
  }
  function addSocialLink() {
    setDirty(true);
    setForm((prev) => ({ ...prev, socialLinks: [...prev.socialLinks, { platform: "", url: "" }] }));
  }
  function removeSocialLink(index: number) {
    setDirty(true);
    setForm((prev) => ({
      ...prev,
      socialLinks: prev.socialLinks.filter((_, i) => i !== index),
    }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    const cleaned: Business = {
      ...form,
      serviceAreas: form.serviceAreas.map((area) => area.trim()).filter(Boolean),
      socialLinks: form.socialLinks
        .map((link) => ({ platform: link.platform.trim(), url: link.url.trim() }))
        .filter((link) => link.platform && link.url),
    };

    if (cleaned.email && !EMAIL_PATTERN.test(cleaned.email)) {
      setError(t.errors.invalidEmail);
      return;
    }
    const invalidLink = cleaned.socialLinks.find((link) => !isValidHttpUrl(link.url));
    if (invalidLink) {
      setError(t.errors.invalidSocialUrlTemplate.replace("{name}", invalidLink.platform || invalidLink.url));
      return;
    }

    setStatus("saving");
    try {
      await businessRepository.set(cleaned);
      setForm(cleaned);
      setStatus("saved");
      setDirty(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : t.errors.saveFailed);
      setStatus("idle");
    }
  }

  async function handleReset() {
    const confirmed = window.confirm(t.resetConfirm);
    if (!confirmed) return;
    try {
      await businessRepository.reset();
      setForm(defaultBusiness);
      setStatus("idle");
      setDirty(false);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : t.errors.resetFailed);
    }
  }

  if (!loaded) {
    return <AdminLoadingState />;
  }

  const emailInvalid = Boolean(form.email && !EMAIL_PATTERN.test(form.email));

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-8">
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="flex flex-col gap-2">
          <label htmlFor="business-name" className="text-[14px] font-medium text-foreground">
            {t.fields.name}
          </label>
          <Input
            id="business-name"
            value={form.name}
            onChange={(event) => updateField("name", event.target.value)}
            required
          />
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="business-tagline" className="text-[14px] font-medium text-foreground">
            {t.fields.tagline}
          </label>
          <Input
            id="business-tagline"
            value={form.tagline ?? ""}
            onChange={(event) => updateField("tagline", event.target.value || null)}
          />
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="business-phone" className="text-[14px] font-medium text-foreground">
            {t.fields.phone}
          </label>
          <Input
            id="business-phone"
            type="tel"
            value={form.phone ?? ""}
            onChange={(event) => updateField("phone", event.target.value || null)}
          />
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="business-email" className="text-[14px] font-medium text-foreground">
            {t.fields.email}
          </label>
          <Input
            id="business-email"
            type="email"
            value={form.email ?? ""}
            onChange={(event) => updateField("email", event.target.value || null)}
            error={emailInvalid}
            aria-describedby={emailInvalid ? "business-email-error" : undefined}
          />
          {emailInvalid && (
            <p id="business-email-error" className="text-[13px] text-destructive">
              {t.errors.emailHint}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="business-whatsapp" className="text-[14px] font-medium text-foreground">
            {t.fields.whatsapp}
          </label>
          <Input
            id="business-whatsapp"
            value={form.whatsapp ?? ""}
            onChange={(event) => updateField("whatsapp", event.target.value || null)}
          />
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="business-address" className="text-[14px] font-medium text-foreground">
            {t.fields.address}
          </label>
          <Input
            id="business-address"
            value={form.address ?? ""}
            onChange={(event) => updateField("address", event.target.value || null)}
          />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="business-hours" className="text-[14px] font-medium text-foreground">
          {t.fields.hours}
        </label>
        <Textarea
          id="business-hours"
          value={form.businessHours ?? ""}
          onChange={(event) => updateField("businessHours", event.target.value || null)}
          placeholder={t.fields.hoursPlaceholder}
        />
      </div>

      <div className="flex flex-col gap-3">
        <span className="text-[14px] font-medium text-foreground">{t.fields.serviceAreas}</span>
        {form.serviceAreas.map((area, index) => (
          <div key={index} className="flex gap-2">
            <Input
              value={area}
              onChange={(event) => updateServiceArea(index, event.target.value)}
              aria-label={t.fields.serviceAreaAriaTemplate.replace("{n}", String(index + 1))}
            />
            <Button type="button" variant="tertiary" onClick={() => removeServiceArea(index)}>
              {dictionary.admin.common.remove}
            </Button>
          </div>
        ))}
        <Button type="button" variant="secondary" onClick={addServiceArea} className="self-start">
          {t.fields.addServiceArea}
        </Button>
      </div>

      <div className="flex flex-col gap-3">
        <span className="text-[14px] font-medium text-foreground">{t.fields.socialLinks}</span>
        {form.socialLinks.map((link, index) => (
          <div key={index} className="grid gap-2 sm:grid-cols-[1fr_2fr_auto]">
            <Input
              placeholder={t.fields.platformPlaceholder}
              value={link.platform}
              onChange={(event) => updateSocialLink(index, { platform: event.target.value })}
              aria-label={t.fields.socialLinkPlatformAriaTemplate.replace("{n}", String(index + 1))}
            />
            <Input
              placeholder={t.fields.urlPlaceholder}
              type="url"
              value={link.url}
              onChange={(event) => updateSocialLink(index, { url: event.target.value })}
              aria-label={t.fields.socialLinkUrlAriaTemplate.replace("{n}", String(index + 1))}
            />
            <Button type="button" variant="tertiary" onClick={() => removeSocialLink(index)}>
              {dictionary.admin.common.remove}
            </Button>
          </div>
        ))}
        <Button type="button" variant="secondary" onClick={addSocialLink} className="self-start">
          {t.fields.addSocialLink}
        </Button>
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
