import { createPageContentRepository, pageContentSyncKey } from "@/lib/content/pageContentRepository";
import { servicesPageContent as defaultServicesPage } from "@/data/servicesPage";
import type { ServicesPageContent } from "@/data/servicesPage";

export const SERVICES_PAGE_SYNC_PING_KEY = pageContentSyncKey("servicesPage");

export const servicesPageRepository = createPageContentRepository<ServicesPageContent>(
  "servicesPage",
  defaultServicesPage,
  (stored) => ({
    ...defaultServicesPage,
    ...stored,
    header: { ...defaultServicesPage.header, ...stored.header },
    cta: { ...defaultServicesPage.cta, ...stored.cta },
  }),
);
