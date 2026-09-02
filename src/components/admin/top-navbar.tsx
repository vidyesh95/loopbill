import { Input } from "@/components/ui/input";
import { SidebarTrigger } from "@/components/ui/sidebar";
import {
  Bell,
  Calendar,
  CalendarClock,
  CircleUserRound,
  Settings,
  TriangleAlert,
} from "lucide-react";
import Image from "next/image";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import LogoutMenuItem from "@/components/auth/logout-menu-item";

interface TopNavbarProps {
  name?: string;
  email?: string;
}

export default function TopNavbar({ name = "Admin", email = "" }: TopNavbarProps) {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-2 border-b bg-white px-4">
      <SidebarTrigger className="cursor-pointer" />

      {/*Search bar*/}
      <Input
        placeholder="Search..."
        className="flex flex-1 items-center border-none bg-[#f7f6f0]"
      />

      {/*Notifications*/}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <div className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-gray-200">
            <Bell size={18} />
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-90">
          <DropdownMenuLabel>Notifications</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-yellow-100">
              <CalendarClock color="oklch(79.5% 0.184 86.047)" size={18} />
            </div>
            <div className="flex flex-col items-start gap-1">
              <h3>Service expiring</h3>
              <p>Client #128 service will expire in 7 days</p>
              <h6>5 minutes ago</h6>
            </div>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-red-100">
              <TriangleAlert color="oklch(63.7% 0.237 25.331)" size={18} />
            </div>
            <div className="flex flex-col items-start gap-1">
              <h3>Complaint raised</h3>
              <p>New complaint for service #329</p>
              <h6>2 hours ago</h6>
            </div>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-yellow-100">
              <CalendarClock color="oklch(79.5% 0.184 86.047)" size={18} />
            </div>
            <div className="flex flex-col items-start gap-1">
              <h3>Service expiring</h3>
              <p>Client #127 service will expire in 7 days</p>
              <h6>3 days ago</h6>
            </div>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-yellow-100">
              <CalendarClock color="oklch(79.5% 0.184 86.047)" size={18} />
            </div>
            <div className="flex flex-col items-start gap-1">
              <h3>Service expiring</h3>
              <p>Client #126 service will expire in 7 days</p>
              <h6>5 days ago</h6>
            </div>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/*Upcoming services*/}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <div className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-gray-200">
            <Calendar size={18} />
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-90">
          <DropdownMenuLabel>Upcoming Services</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="flex flex-col items-start gap-1">
            <h3 className="font-semibold">Today (3)</h3>
            <div>
              <p className="text-muted-foreground">10:00 AM - Service #421 - Cockroach Treatment</p>
              <p className="text-muted-foreground">2:30 PM - Service #422 - Ant Control</p>
              <p className="text-muted-foreground">2:30 PM - Service #422 - Cockroach Treatment</p>
            </div>
          </DropdownMenuItem>
          <DropdownMenuItem className="flex flex-col items-start gap-1">
            <h3 className="font-semibold">Tomorrow (6)</h3>
            <div>
              <p className="text-muted-foreground">10:00 AM - Service #421 - Cockroach Treatment</p>
              <p className="text-muted-foreground">2:30 PM - Service #422 - Ant Control</p>
              <p className="text-muted-foreground">2:30 PM - Service #422 - Cockroach Treatment</p>
              <p className="text-muted-foreground">10:00 AM - Service #421 - Cockroach Treatment</p>
              <p className="text-muted-foreground">2:30 PM - Service #422 - Ant Control</p>
              <p className="text-muted-foreground">2:30 PM - Service #422 - Cockroach Treatment</p>
            </div>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/*Authentication and authorization*/}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <div className="flex h-10 w-10 cursor-pointer items-center justify-center overflow-hidden rounded-full border border-gray-200">
            <Image src="/profile_image.png" width={38} height={38} alt="Profile image" />
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-90">
          <DropdownMenuLabel>
            <div className="flex items-center gap-2">
              <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-full border border-gray-200">
                <Image src="/profile_image.png" width={64} height={64} alt="Profile image" />
              </div>
              <div>
                <h4 className="max-w-64 truncate text-lg font-bold text-primary">{name}</h4>
                <p className="max-w-64 truncate text-sm text-muted-foreground">{email}</p>
              </div>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <CircleUserRound size={24} />
            Profile
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Settings size={24} />
            Settings
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <LogoutMenuItem />
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}
