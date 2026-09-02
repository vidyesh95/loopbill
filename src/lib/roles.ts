export function homeForRole(role: string | undefined) {
    if (role === "admin") {
        return "/admin";
    }
    if (role === "salesperson") {
        return "/salesperson";
    }
    if (role === "agent") {
        return "/agent";
    }
    return "/signin";
}
