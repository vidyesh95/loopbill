import {headers} from "next/headers";
import {redirect} from "next/navigation";
import {auth, type UserRole} from "@/lib/auth";
import {homeForRole} from "@/lib/roles";

export async function getCurrentSession() {
    return auth.api.getSession({
        headers: await headers(),
    });
}

export async function requireRole(allowed: UserRole[]) {
    const session = await getCurrentSession();
    if (!session) {
        redirect("/signin");
    }

    const role = session.user.role as UserRole;
    if (!allowed.includes(role)) {
        redirect(homeForRole(role));
    }

    return session;
}
