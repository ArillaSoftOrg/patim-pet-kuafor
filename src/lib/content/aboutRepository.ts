import { createPageContentRepository, pageContentSyncKey } from "@/lib/content/pageContentRepository";
import { aboutContent as defaultAbout } from "@/data/about";
import type { AboutContent } from "@/data/about";

export const ABOUT_SYNC_PING_KEY = pageContentSyncKey("about");

export const aboutRepository = createPageContentRepository<AboutContent>("about", defaultAbout, (stored) => ({
  ...defaultAbout,
  ...stored,
  header: { ...defaultAbout.header, ...stored.header },
  mobileStory: {
    ...defaultAbout.mobileStory,
    ...stored.mobileStory,
    // A plain `...stored.mobileStory` spread would let an explicit
    // `image: null` in the stored row (the normal, current state — no
    // admin has uploaded an About photo yet) win over and erase a real
    // static default. `??` treats that stored null as "nothing to
    // override with" and keeps the default instead; a real uploaded ref
    // still wins as before.
    image: stored.mobileStory?.image ?? defaultAbout.mobileStory.image,
  },
  values: { ...defaultAbout.values, ...stored.values },
  cta: { ...defaultAbout.cta, ...stored.cta },
}));
