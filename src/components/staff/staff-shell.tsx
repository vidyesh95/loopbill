import { cookies } from "next/headers";
import { SidebarProvider } from "@/components/ui/sidebar";
import TopNav from "@/components/admin/top-navbar";
import { StaffSidebar } from "@/components/staff/staff-sidebar";
import { Toaster } from "@/components/ui/sonner";
import type { UserRole } from "@/lib/auth";

type StaffShellProps = {
  staffRole: UserRole;
  name: string;
  email: string;
  children: React.ReactNode;
  compact?: boolean;
};

export async function StaffShell({ staffRole, name, email, children, compact }: StaffShellProps) {
  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get("sidebar_state")?.value === "true";

  return (
    <SidebarProvider defaultOpen={defaultOpen}>
      <div className="flex min-h-screen w-full">
        <StaffSidebar role={staffRole} name={name} />
        <section className="flex flex-1 flex-col">
          <TopNav name={name} email={email} />
          <main className={`flex-1 overflow-auto ${compact ? "p-3 md:p-4" : "p-4 md:p-6"}`}>
            {children}
          </main>
          <Toaster theme="light" />
        </section>
      </div>
    </SidebarProvider>
  );
}
