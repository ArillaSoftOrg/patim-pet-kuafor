"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { FormError } from "@/components/admin/forms/FormError";
import { useUnsavedChangesWarning } from "@/components/admin/useUnsavedChangesWarning";
import { faqsRepository } from "@/lib/content/faqsRepository";
import { faqCategories } from "@/data/faqs";
import { useLocale } from "@/lib/i18n/LocaleProvider";
import type { Faq, FaqCategory } from "@/data/faqs";

interface FaqFormProps {
  // null = create.
  initialFaq: Faq | null;
  onSaved: () => void;
  onCancel: () => void;
}

export function FaqForm({ initialFaq, onSaved, onCancel }: FaqFormProps) {
  const { dictionary } = useLocale();
  const t = dictionary.admin.faq.form;
  const isEditing = initialFaq !== null;
  // A brand-new FAQ needs a stable id up front — FaqsRepository.create()
  // requires a client-supplied id.
  const [id] = useState(initialFaq?.id ?? crypto.randomUUID());

  const [category, setCategory] = useState<FaqCategory>(initialFaq?.category ?? "General");
  const [question, setQuestion] = useState(initialFaq?.question ?? "");
  const [answer, setAnswer] = useState(initialFaq?.answer ?? "");

  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [dirty, setDirty] = useState(false);

  useUnsavedChangesWarning(dirty);

  function markDirty() {
    setDirty(true);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    const cleanedQuestion = question.trim();
    const cleanedAnswer = answer.trim();
    if (!cleanedQuestion || !cleanedAnswer) {
      setError(t.validation);
      return;
    }

    const faq: Faq = { id, category, question: cleanedQuestion, answer: cleanedAnswer };

    setSaving(true);
    try {
      if (isEditing) {
        await faqsRepository.update(id, faq);
      } else {
        await faqsRepository.create(faq);
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
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <div className="flex flex-col gap-2">
        <label htmlFor="faq-category" className="text-[14px] font-medium text-foreground">
          {t.category}
        </label>
        <Select
          id="faq-category"
          value={category}
          onChange={(e) => {
            markDirty();
            setCategory(e.target.value as FaqCategory);
          }}
        >
          {faqCategories.map((cat) => (
            <option key={cat} value={cat}>
              {dictionary.shared.faqCategories[cat]}
            </option>
          ))}
        </Select>
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="faq-question" className="text-[14px] font-medium text-foreground">
          {t.question}
        </label>
        <Input
          id="faq-question"
          value={question}
          onChange={(e) => {
            markDirty();
            setQuestion(e.target.value);
          }}
          required
        />
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="faq-answer" className="text-[14px] font-medium text-foreground">
          {t.answer}
        </label>
        <Textarea
          id="faq-answer"
          value={answer}
          onChange={(e) => {
            markDirty();
            setAnswer(e.target.value);
          }}
          required
        />
      </div>

      <FormError message={error} />

      <div className="flex gap-3">
        <Button type="submit" disabled={saving}>
          {saving ? dictionary.admin.common.saving : isEditing ? dictionary.admin.common.save : t.addFaq}
        </Button>
        <Button type="button" variant="secondary" onClick={onCancel}>
          {dictionary.admin.common.cancel}
        </Button>
      </div>
    </form>
  );
}
