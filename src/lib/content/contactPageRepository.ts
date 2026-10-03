import { createPageContentRepository, pageContentSyncKey } from "@/lib/content/pageContentRepository";
import { contactPageContent as defaultContactPage } from "@/data/contactPage";
import type { ContactPageContent } from "@/data/contactPage";

export const CONTACT_PAGE_SYNC_PING_KEY = pageContentSyncKey("contactPage");

export const contactPageRepository = createPageContentRepository<ContactPageContent>(
  "contactPage",
  defaultContactPage,
  (stored) => ({
    ...defaultContactPage,
    ...stored,
  }),
);
