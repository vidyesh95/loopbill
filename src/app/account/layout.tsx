import { requireRole } from "@/lib/session";
import { StaffShell } from "@/components/staff/staff-shell";

export default async function AccountLayout({ children }: { children: React.ReactNode }) {
  const session = await requireRole(["customer"]);
  return (
    <StaffShell staffRole="customer" name={session.user.name} email={session.user.email}>
      {children}
    </StaffShell>
  );
}
