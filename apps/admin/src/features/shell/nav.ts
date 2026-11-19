import {
  BadgePercentIcon,
  BarChart3Icon,
  BoxesIcon,
  CreditCardIcon,
  FolderTreeIcon,
  GalleryHorizontalIcon,
  LayoutDashboardIcon,
  MessageSquareTextIcon,
  PackageIcon,
  SettingsIcon,
  ShieldCheckIcon,
  ShoppingCartIcon,
  TagIcon,
  TruckIcon,
  UsersIcon,
} from "lucide-react";

export const NAV = [
  {
    group: "Overview",
    items: [
      { href: "/", label: "Dashboard", icon: LayoutDashboardIcon },
      { href: "/reports", label: "Reports", icon: BarChart3Icon },
    ],
  },
  {
    group: "Catalogue",
    items: [
      { href: "/products", label: "Products", icon: PackageIcon },
      { href: "/categories", label: "Categories", icon: FolderTreeIcon },
      { href: "/brands", label: "Brands", icon: TagIcon },
      { href: "/inventory", label: "Inventory", icon: BoxesIcon },
    ],
  },
  {
    group: "Sales",
    items: [
      { href: "/orders", label: "Orders", icon: ShoppingCartIcon },
      { href: "/payments", label: "Payments", icon: CreditCardIcon },
      { href: "/shipping", label: "Shipping", icon: TruckIcon },
      { href: "/customers", label: "Customers", icon: UsersIcon },
    ],
  },
  {
    group: "Marketing",
    items: [
      { href: "/coupons", label: "Coupons", icon: BadgePercentIcon },
      { href: "/banners", label: "Banners", icon: GalleryHorizontalIcon },
      { href: "/reviews", label: "Reviews", icon: MessageSquareTextIcon },
    ],
  },
  {
    group: "Settings",
    items: [
      { href: "/admin-users", label: "Admin users", icon: ShieldCheckIcon },
      { href: "/settings", label: "Store settings", icon: SettingsIcon },
    ],
  },
] as const;
