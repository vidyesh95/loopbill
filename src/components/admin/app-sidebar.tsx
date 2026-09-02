import {
  Bell,
  ChartSpline,
  ChevronsUpDown,
  CircleUserRound,
  Home,
  ReceiptText,
  Settings,
  ShieldCheck,
  TriangleAlert,
  UserRoundCog,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Menu items
const items = [
  {
    id: "1",
    label: "Dashboard",
    icon: Home,
    href: "/admin",
  },
  {
    id: "2",
    label: "Services",
    icon: ShieldCheck,
    href: "/admin/services",
  },
  {
    id: "3",
    label: "Reports",
    icon: ChartSpline,
    href: "/admin/reports",
  },
  {
    id: "4",
    label: "Complaints",
    icon: TriangleAlert,
    href: "/admin/complaints",
  },
  {
    id: "5",
    label: "Contracts",
    icon: ReceiptText,
    href: "/admin/contracts",
  },
  {
    id: "6",
    label: "User management",
    icon: UserRoundCog,
    href: "/admin/user-management",
  },
  {
    id: "7",
    label: "Notifications",
    icon: Bell,
    href: "/admin/notifications",
  },
  {
    id: "8",
    label: "Settings",
    icon: Settings,
    href: "/admin/settings",
  },
];

export function AppSidebar() {
  return (
    <Sidebar collapsible="offcanvas">
      <SidebarHeader>
        {/* Brand */}
        <Link href="/admin" className="p-2 text-2xl font-bold text-primary">
          UrbanPestMaster
        </Link>
        <hr />
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.label}>
                  <SidebarMenuButton asChild>
                    <a href={item.href}>
                      <item.icon />
                      <span>{item.label}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton className="cursor-pointer">
                  <CircleUserRound /> Vidyesh Churi
                  <ChevronsUpDown className="ml-auto" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent side="right" className="w-[--radix-popper-anchor-width]">
                <DropdownMenuItem>
                  <span>Account</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <span>Sign out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
