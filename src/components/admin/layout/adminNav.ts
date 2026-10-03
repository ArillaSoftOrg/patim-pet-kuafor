export interface AdminNavItem {
  label: string;
  href: string;
}

export const adminNavItems: AdminNavItem[] = [
  { label: "Dashboard", href: "/admin" },
  { label: "Appointments", href: "/admin/appointments" },
  { label: "Business", href: "/admin/business" },
  { label: "Services", href: "/admin/services" },
  { label: "Products", href: "/admin/products" },
  { label: "Content", href: "/admin/content" },
  { label: "Images", href: "/admin/images" },
  { label: "Settings", href: "/admin/settings" },
];
