import {
  CalendarCheck,
  ClipboardList,
  FileText,
  LayoutDashboard,
  MapPin,
  MessageSquare,
  Settings,
  Star,
  Wrench,
  type LucideIcon,
} from "lucide-react";

export interface AdminNavItem {
  title: string;
  href: string;
  icon: LucideIcon;
}

export const ADMIN_NAV_ITEMS: AdminNavItem[] = [

  {
    title: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard,
  },
   {
    title: "Bookings",
    href: "/admin/bookings",
    icon: CalendarCheck,


  },

  {
  title: "Availability",
  href: "/admin/availability",
  icon: CalendarCheck,
},
  {
    title: "Services",
    href: "/admin/services",
    icon: Wrench,
  },
  {
    title: "Service Areas",
    href: "/admin/service-areas",
    icon: MapPin,
  },
  {
    title: "FAQs",
    href: "/admin/faqs",
    icon: MessageSquare,
  },
  {
    title: "Blog",
    href: "/admin/blog",
    icon: FileText,
  },
  {
    title: "Reviews",
    href: "/admin/testimonials",
    icon: Star,
  },

 
  {
    title: "Site Settings",
    href: "/admin/settings",
    icon: Settings,
  },
];