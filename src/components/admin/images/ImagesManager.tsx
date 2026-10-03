"use client";

import { useEffect, useState } from "react";
import { AdminLoadingState } from "@/components/admin/layout/AdminLoadingState";
import { ImageSlotEditor } from "@/components/admin/images/ImageSlotEditor";
import { businessRepository } from "@/lib/content/businessRepository";
import { homepageRepository } from "@/lib/content/homepageRepository";
import { aboutRepository } from "@/lib/content/aboutRepository";
import { servicesRepository } from "@/lib/content/servicesRepository";
import { business as defaultBusiness } from "@/data/business";
import { homepage as defaultHomepage } from "@/data/homepage";
import { aboutContent as defaultAbout } from "@/data/about";
import { services as defaultServices } from "@/data/services";
import { useLocale } from "@/lib/i18n/LocaleProvider";
import type { Business } from "@/data/business";
import type { HomepageContent } from "@/data/homepage";
import type { AboutContent } from "@/data/about";
import type { Service } from "@/data/services";

export function ImagesManager() {
  const { dictionary } = useLocale();
  const t = dictionary.admin.images;
  const [business, setBusiness] = useState<Business | null>(null);
  const [homepage, setHomepage] = useState<HomepageContent | null>(null);
  const [about, setAbout] = useState<AboutContent | null>(null);
  const [servicesList, setServicesList] = useState<Service[] | null>(null);

  useEffect(() => {
    let active = true;
    Promise.all([
      businessRepository.get(),
      homepageRepository.get(),
      aboutRepository.get(),
      servicesRepository.list(),
    ]).then(([b, h, a, s]) => {
      if (!active) return;
      setBusiness(b);
      setHomepage(h);
      setAbout(a);
      setServicesList(s);
    });
    return () => {
      active = false;
    };
  }, []);

  if (!business || !homepage || !about || !servicesList) {
    return <AdminLoadingState />;
  }

  return (
    <div className="flex flex-col gap-6">
      <ImageSlotEditor
        label={t.logo}
        currentRef={business.logoSrc}
        defaultRef={defaultBusiness.logoSrc}
        aspect="square"
        fit="contain"
        onChange={async (ref) => {
          const next = { ...business, logoSrc: ref ?? defaultBusiness.logoSrc };
          await businessRepository.set(next);
          setBusiness(next);
        }}
      />

      <ImageSlotEditor
        label={t.heroImage}
        currentRef={homepage.hero.image}
        defaultRef={defaultHomepage.hero.image}
        onChange={async (ref) => {
          const next = { ...homepage, hero: { ...homepage.hero, image: ref } };
          await homepageRepository.set(next);
          setHomepage(next);
        }}
      />

      <ImageSlotEditor
        label={t.mobileHighlightImage}
        currentRef={homepage.mobileHighlight.image}
        defaultRef={defaultHomepage.mobileHighlight.image}
        onChange={async (ref) => {
          const next = { ...homepage, mobileHighlight: { ...homepage.mobileHighlight, image: ref } };
          await homepageRepository.set(next);
          setHomepage(next);
        }}
      />

      {homepage.beforeAfter.gallery.map((item, index) => {
        // Unlike hero/mobileHighlight/about (whose true "unset" state is
        // null, rendering a placeholder box), Before/After always shows a
        // real photo — the packaged public/before-after/{id}.jpg default
        // when no admin override exists. currentRef falls back to that same
        // path (not null) so isDefault reads true until an admin actually
        // uploads something, same as how a fresh Service row's `image`
        // already equals its own shipped default path.
        const defaultRef = `/before-after/${item.id}.jpg`;
        return (
          <ImageSlotEditor
            key={item.id}
            label={t.beforeAfterImageTemplate.replace("{n}", String(index + 1))}
            currentRef={item.image ?? defaultRef}
            defaultRef={defaultRef}
            aspect="square"
            fit="contain"
            onChange={async (ref) => {
              const nextGallery = homepage.beforeAfter.gallery.map((g, i) => (i === index ? { ...g, image: ref } : g));
              const next = { ...homepage, beforeAfter: { ...homepage.beforeAfter, gallery: nextGallery } };
              await homepageRepository.set(next);
              setHomepage(next);
            }}
          />
        );
      })}

      <ImageSlotEditor
        label={t.aboutImage}
        currentRef={about.mobileStory.image}
        defaultRef={defaultAbout.mobileStory.image}
        onChange={async (ref) => {
          const next = { ...about, mobileStory: { ...about.mobileStory, image: ref } };
          await aboutRepository.set(next);
          setAbout(next);
        }}
      />

      {servicesList.map((service) => (
        <ImageSlotEditor
          key={service.slug}
          label={t.serviceImageTemplate.replace("{title}", service.title)}
          currentRef={service.image}
          defaultRef={defaultServices.find((s) => s.slug === service.slug)?.image ?? null}
          onChange={async (ref) => {
            const next = { ...service, image: ref };
            await servicesRepository.update(service.slug, next);
            setServicesList((prev) => prev?.map((s) => (s.slug === service.slug ? next : s)) ?? null);
          }}
        />
      ))}
    </div>
  );
}
