"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";
import { FormError } from "@/components/admin/forms/FormError";
import { ImageSlotEditor } from "@/components/admin/images/ImageSlotEditor";
import { useUnsavedChangesWarning } from "@/components/admin/useUnsavedChangesWarning";
import { productsRepository } from "@/lib/content/productsRepository";
import { useLocale } from "@/lib/i18n/LocaleProvider";
import type { Product } from "@/data/products";

const SLUG_PATTERN = /^[a-z0-9]+(-[a-z0-9]+)*$/;

function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

interface ProductFormProps {
  // null = create.
  initialProduct: Product | null;
  onSaved: (slug: string) => void;
  onCancel: () => void;
}

export function ProductForm({ initialProduct, onSaved, onCancel }: ProductFormProps) {
  const { dictionary } = useLocale();
  const t = dictionary.admin.products.form;
  const isEditing = initialProduct !== null;

  const [slug, setSlug] = useState(initialProduct?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(isEditing);
  const [name, setName] = useState(initialProduct?.name ?? "");
  const [brand, setBrand] = useState(initialProduct?.brand ?? "");
  const [category, setCategory] = useState(initialProduct?.category ?? "");
  const [price, setPrice] = useState(initialProduct?.price ?? "");
  const [shortDescription, setShortDescription] = useState(initialProduct?.shortDescription ?? "");
  const [description, setDescription] = useState(initialProduct?.description ?? "");
  const [isPublished, setIsPublished] = useState(initialProduct?.isPublished ?? true);
  const [image, setImage] = useState<string | null>(initialProduct?.image ?? null);

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

    const cleanedSlug = slug.trim().toLowerCase();
    if (!SLUG_PATTERN.test(cleanedSlug)) {
      setError(t.slugError);
      return;
    }

    const cleanedBrand = brand.trim();
    const cleanedName = name.trim();
    const cleanedCategory = category.trim();
    const cleanedShortDescription = shortDescription.trim();
    const cleanedDescription = description.trim();
    const cleanedPrice = price.trim() ? price.trim() : undefined;

    if (!cleanedBrand || !cleanedName || !cleanedCategory || !cleanedShortDescription || !cleanedDescription) {
      setError(t.requiredFieldsError);
      return;
    }

    const product: Product = {
      slug: cleanedSlug,
      name: cleanedName,
      brand: cleanedBrand,
      category: cleanedCategory,
      shortDescription: cleanedShortDescription,
      description: cleanedDescription,
      image,
      price: cleanedPrice,
      isPublished,
    };

    setSaving(true);
    try {
      if (isEditing && initialProduct) {
        await productsRepository.update(initialProduct.slug, product);
      } else {
        await productsRepository.create(product);
      }
      setDirty(false);
      onSaved(cleanedSlug);
    } catch (err) {
      setError(err instanceof Error ? err.message : t.saveFailed);
    } finally {
      setSaving(false);
    }
  }

  async function handleImageChange(ref: string | null) {
    if (!initialProduct) return;
    await productsRepository.update(initialProduct.slug, {
      slug: initialProduct.slug,
      name,
      brand,
      category,
      shortDescription,
      description,
      price: price.trim() || undefined,
      isPublished,
      image: ref,
    });
    setImage(ref);
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <div className="flex flex-col gap-2 sm:max-w-xs">
        <label htmlFor="product-slug" className="text-[14px] font-medium text-foreground">
          {t.slug}
        </label>
        <Input
          id="product-slug"
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

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="flex flex-col gap-2">
          <label htmlFor="product-brand" className="text-[14px] font-medium text-foreground">
            {t.brand}
          </label>
          <Input
            id="product-brand"
            value={brand}
            onChange={(event) => {
              markDirty();
              setBrand(event.target.value);
            }}
            required
          />
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="product-price" className="text-[14px] font-medium text-foreground">
            {t.price}
          </label>
          <Input
            id="product-price"
            value={price}
            onChange={(event) => {
              markDirty();
              setPrice(event.target.value);
            }}
            placeholder={t.pricePlaceholder}
          />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="product-name" className="text-[14px] font-medium text-foreground">
          {t.name}
        </label>
        <Input
          id="product-name"
          value={name}
          onChange={(event) => {
            markDirty();
            setName(event.target.value);
            if (!slugTouched) setSlug(slugify(event.target.value));
          }}
          required
        />
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="product-category" className="text-[14px] font-medium text-foreground">
          {t.category}
        </label>
        <Input
          id="product-category"
          value={category}
          onChange={(event) => {
            markDirty();
            setCategory(event.target.value);
          }}
          required
        />
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="product-short-description" className="text-[14px] font-medium text-foreground">
          {t.shortDescription}
        </label>
        <Textarea
          id="product-short-description"
          value={shortDescription}
          onChange={(event) => {
            markDirty();
            setShortDescription(event.target.value);
          }}
          required
        />
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="product-description" className="text-[14px] font-medium text-foreground">
          {t.fullDescription}
        </label>
        <Textarea
          id="product-description"
          value={description}
          onChange={(event) => {
            markDirty();
            setDescription(event.target.value);
          }}
          required
        />
      </div>

      <label className="flex w-fit items-center gap-2 text-[14px] font-medium text-foreground">
        <input
          type="checkbox"
          checked={isPublished}
          onChange={(event) => {
            markDirty();
            setIsPublished(event.target.checked);
          }}
          className="h-4 w-4 rounded border-input focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        />
        {t.published}
      </label>

      {isEditing ? (
        <ImageSlotEditor
          label={t.imageLabel}
          currentRef={image}
          defaultRef={null}
          aspect="square"
          onChange={handleImageChange}
        />
      ) : (
        <p className="text-[14px] text-muted-foreground">{t.saveFirstHint}</p>
      )}

      <FormError message={error} />

      <div className="flex gap-3">
        <Button type="submit" disabled={saving}>
          {saving ? dictionary.admin.common.saving : isEditing ? dictionary.admin.common.save : t.addProduct}
        </Button>
        <Button type="button" variant="secondary" onClick={onCancel}>
          {dictionary.admin.common.cancel}
        </Button>
      </div>
    </form>
  );
}
