export function homeForRole(role: string | undefined) {
    if (role === "salesperson") {
        return "/salesperson";
    }
    if (role === "agent") {
        return "/agent";
    }
    return "/admin";
}
