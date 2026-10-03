import type { AdminNavItem } from "@/components/admin/layout/adminNav";
import type { Dictionary } from "@/lib/i18n/dictionaries";

// adminNavItems' `label` field is left as plain English on purpose, same
// rationale as navLabels.ts for the public nav — keying off `href` (stable,
// unique per item) rather than the label text avoids ambiguity between
// e.g. "Products" used both as a nav item and an FAQ category.
const HREF_KEYS: Record<string, keyof Dictionary["admin"]["nav"]> = {
  "/admin": "dashboard",
  "/admin/appointments": "appointments",
  "/admin/business": "business",
  "/admin/services": "services",
  "/admin/products": "products",
  "/admin/content": "content",
  "/admin/images": "images",
  "/admin/settings": "settings",
};

export function adminNavLabel(dictionary: Dictionary, item: AdminNavItem): string {
  const key = HREF_KEYS[item.href];
  return key ? dictionary.admin.nav[key] : item.label;
}
