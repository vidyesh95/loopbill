import { requireRole } from "@/lib/session";
import { StaffShell } from "@/components/staff/staff-shell";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await requireRole(["admin"]);
  return (
    <StaffShell staffRole="admin" name={session.user.name} email={session.user.email}>
      {children}
    </StaffShell>
  );
}
