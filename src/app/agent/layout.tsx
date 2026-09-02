import type {ReactNode} from "react";
import {requireRole} from "@/lib/session";
import {StaffShell} from "@/components/staff/staff-shell";

export default async function AgentLayout({children}: {children: ReactNode}) {
    const session = await requireRole(["agent"]);
    return (
        <StaffShell staffRole="agent" name={session.user.name} email={session.user.email} compact>
            {children}
        </StaffShell>
    );
}
