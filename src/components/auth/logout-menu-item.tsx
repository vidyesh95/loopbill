"use client";

import {useRouter} from "next/navigation";
import {DropdownMenuItem} from "@/components/ui/dropdown-menu";
import {LogOut} from "lucide-react";
import {authClient} from "@/lib/auth-client";

export default function LogoutMenuItem() {
    const router = useRouter();

    async function handleLogout() {
        await authClient.signOut();
        router.push("/signin");
        router.refresh();
    }

    return (
        <DropdownMenuItem onClick={handleLogout}>
            <LogOut size={24}/>
            Logout
        </DropdownMenuItem>
    );
}
