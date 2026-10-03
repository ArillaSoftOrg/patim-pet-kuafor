import { createPageContentRepository, pageContentSyncKey } from "@/lib/content/pageContentRepository";
import { homepage as defaultHomepage } from "@/data/homepage";
import type { HomepageContent } from "@/data/homepage";

export const HOMEPAGE_SYNC_PING_KEY = pageContentSyncKey("homepage");

export const homepageRepository = createPageContentRepository<HomepageContent>(
  "homepage",
  defaultHomepage,
  (stored) => ({
    ...defaultHomepage,
    ...stored,
    // `image` is pulled out with `??` on both of these (not a plain
    // spread) so an explicit `image: null` already sitting in the stored
    // row — the normal state before any admin has uploaded a photo for
    // that slot — can't erase a real static default the same way the
    // services/about image fallbacks below had to be fixed for. A real
    // uploaded ref (truthy) still always wins.
    hero: { ...defaultHomepage.hero, ...stored.hero, image: stored.hero?.image ?? defaultHomepage.hero.image },
    // mobileSalon/beforeAfter/testimonials were missing here — every other
    // section gets its defaults deep-merged under a partial stored value,
    // but these three didn't, so a stored value for any of them would have
    // replaced the whole section (dropping any field the admin form
    // doesn't expose, e.g. `gallery`/`items`) instead of filling gaps.
    // HomepageContentForm doesn't expose fields for these sections, but it
    // does round-trip (load → save) the full object, so saving any other
    // homepage field would otherwise have silently frozen a same-day
    // snapshot of these three into the database — permanently shadowing
    // future static-default updates to them for this row.
    mobileSalon: { ...defaultHomepage.mobileSalon, ...stored.mobileSalon },
    beforeAfter: { ...defaultHomepage.beforeAfter, ...stored.beforeAfter },
    servicesSection: { ...defaultHomepage.servicesSection, ...stored.servicesSection },
    campaign: { ...defaultHomepage.campaign, ...stored.campaign },
    mobileHighlight: {
      ...defaultHomepage.mobileHighlight,
      ...stored.mobileHighlight,
      image: stored.mobileHighlight?.image ?? defaultHomepage.mobileHighlight.image,
    },
    whyKulapaws: { ...defaultHomepage.whyKulapaws, ...stored.whyKulapaws },
    productsPreview: { ...defaultHomepage.productsPreview, ...stored.productsPreview },
    howItWorks: { ...defaultHomepage.howItWorks, ...stored.howItWorks },
    testimonials: { ...defaultHomepage.testimonials, ...stored.testimonials },
    faqPreview: { ...defaultHomepage.faqPreview, ...stored.faqPreview },
    finalCta: { ...defaultHomepage.finalCta, ...stored.finalCta },
  }),
);
