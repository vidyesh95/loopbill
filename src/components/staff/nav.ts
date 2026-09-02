import type { LucideIcon } from "lucide-react";
import {
  Bell,
  CalendarClock,
  ChartSpline,
  Globe,
  Home,
  Inbox,
  MapPin,
  ReceiptText,
  Settings,
  Wallet,
  ShieldCheck,
  TriangleAlert,
  UserRound,
  UserRoundCog,
  Users,
} from "lucide-react";
import type { UserRole } from "@/lib/auth";

export type StaffNavItem = {
  label: string;
  href: string;
  icon: LucideIcon;
};

export const staffNav: Record<UserRole, StaffNavItem[]> = {
  admin: [
    { label: "Dashboard", href: "/admin", icon: Home },
    { label: "Services", href: "/admin/services", icon: ShieldCheck },
    { label: "Reports", href: "/admin/reports", icon: ChartSpline },
    { label: "Complaints", href: "/admin/complaints", icon: TriangleAlert },
    { label: "Contracts", href: "/admin/contracts", icon: ReceiptText },
    { label: "Billing", href: "/admin/billing", icon: Wallet },
    { label: "User management", href: "/admin/user-management", icon: UserRoundCog },
    { label: "Leads", href: "/admin/leads", icon: Inbox },
    { label: "Website", href: "/admin/website", icon: Globe },
    { label: "Notifications", href: "/admin/notifications", icon: Bell },
    { label: "Settings", href: "/admin/settings", icon: Settings },
  ],
  salesperson: [
    { label: "Dashboard", href: "/salesperson", icon: Home },
    { label: "Customers", href: "/salesperson/customers", icon: Users },
    { label: "Schedule", href: "/salesperson/schedule", icon: CalendarClock },
    { label: "Reschedule", href: "/salesperson/reschedule", icon: TriangleAlert },
    { label: "Services", href: "/salesperson/services", icon: ShieldCheck },
    { label: "Complaints", href: "/salesperson/complaints", icon: Inbox },
    { label: "Leads", href: "/salesperson/leads", icon: UserRound },
    { label: "Notifications", href: "/salesperson/notifications", icon: Bell },
  ],
  agent: [
    { label: "Today", href: "/agent", icon: Home },
    { label: "Schedule", href: "/agent/schedule", icon: CalendarClock },
    { label: "Service map", href: "/agent/servicemap", icon: MapPin },
  ],
  customer: [
    { label: "Account", href: "/account", icon: Home },
    { label: "Contracts", href: "/account/contracts", icon: ReceiptText },
    { label: "Services", href: "/account/services", icon: ShieldCheck },
    { label: "Invoices", href: "/account/invoices", icon: Wallet },
    { label: "Complaints", href: "/account/complaints", icon: TriangleAlert },
  ],
};
