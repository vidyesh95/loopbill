import type { ReactNode } from "react";
import { requireRole } from "@/lib/session";
import { StaffShell } from "@/components/staff/staff-shell";

export default async function SalespersonLayout({ children }: { children: ReactNode }) {
  const session = await requireRole(["salesperson"]);
  return (
    <StaffShell staffRole="salesperson" name={session.user.name} email={session.user.email}>
      {children}
    </StaffShell>
  );
}
