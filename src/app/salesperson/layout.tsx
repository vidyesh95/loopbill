import type {ReactNode} from "react";
import {requireRole} from "@/lib/session";

export default async function SalespersonLayout({children}: {children: ReactNode}) {
    await requireRole(["salesperson"]);
    return children;
}
