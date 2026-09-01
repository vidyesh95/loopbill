import type {ReactNode} from "react";
import {requireRole} from "@/lib/session";

export default async function AgentLayout({children}: {children: ReactNode}) {
    await requireRole(["agent"]);
    return children;
}
