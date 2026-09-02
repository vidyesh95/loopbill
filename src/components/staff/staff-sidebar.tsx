"use client";

import Link from "next/link";
import {usePathname} from "next/navigation";
import {ChevronsUpDown, CircleUserRound} from "lucide-react";
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
import {DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger} from "@/components/ui/dropdown-menu";
import LogoutMenuItem from "@/components/auth/logout-menu-item";
import {staffNav} from "@/components/staff/nav";
import type {UserRole} from "@/lib/auth";
import {roleLabel} from "@/lib/data/status";
import {homeForRole} from "@/lib/roles";

type StaffSidebarProps = {
    role: UserRole;
    name: string;
};

export function StaffSidebar({role, name}: StaffSidebarProps) {
    const pathname = usePathname();
    const items = staffNav[role];
    const home = homeForRole(role);

    return (
        <Sidebar collapsible="offcanvas">
            <SidebarHeader>
                <Link href={home} className="p-2 text-2xl font-bold text-primary">
                    UrbanPestMaster
                </Link>
                <p className="px-2 pb-2 text-xs text-muted-foreground">{roleLabel(role)}</p>
                <hr />
            </SidebarHeader>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {items.map((item) => {
                                const active = pathname === item.href || (item.href !== home && pathname.startsWith(`${item.href}/`));
                                return (
                                    <SidebarMenuItem key={item.href}>
                                        <SidebarMenuButton asChild isActive={active}>
                                            <Link href={item.href}>
                                                <item.icon />
                                                <span>{item.label}</span>
                                            </Link>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                );
                            })}
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
                                    <CircleUserRound />
                                    <span className="truncate">{name}</span>
                                    <ChevronsUpDown className="ml-auto" />
                                </SidebarMenuButton>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent side="right" className="w-[--radix-popper-anchor-width]">
                                <DropdownMenuItem asChild>
                                    <Link href={role === "admin" ? "/admin/settings" : home}>Account</Link>
                                </DropdownMenuItem>
                                <LogoutMenuItem />
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>
        </Sidebar>
    );
}
