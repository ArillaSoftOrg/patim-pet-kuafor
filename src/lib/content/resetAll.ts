import { businessRepository } from "@/lib/content/businessRepository";
import { homepageRepository } from "@/lib/content/homepageRepository";
import { aboutRepository } from "@/lib/content/aboutRepository";
import { servicesPageRepository } from "@/lib/content/servicesPageRepository";
import { contactPageRepository } from "@/lib/content/contactPageRepository";
import { servicesRepository } from "@/lib/content/servicesRepository";
import { faqsRepository } from "@/lib/content/faqsRepository";

// Used by the /admin/settings "reset everything" action. Reverts every
// Supabase-backed content repository to its shipped default. Each
// repository's own reset() is responsible for any Supabase Storage image
// cleanup it needs (business logo, service images, page-content images) —
// there is no separate local image store to clear.
export async function resetAllLocalContent(): Promise<void> {
  await Promise.all([
    businessRepository.reset(),
    homepageRepository.reset(),
    aboutRepository.reset(),
    servicesPageRepository.reset(),
    contactPageRepository.reset(),
    servicesRepository.reset(),
    faqsRepository.reset(),
  ]);
}
