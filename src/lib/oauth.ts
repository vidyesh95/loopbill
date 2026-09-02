export function isGoogleOAuthConfigured() {
    return Boolean(process.env.GOOGLE_CLIENT_ID?.trim() && process.env.GOOGLE_CLIENT_SECRET?.trim());
}

export function safeCallbackURL(value: string | null | undefined) {
    if (value && value.startsWith("/") && !value.startsWith("//")) {
        return value;
    }
    return "/signin";
}

export function oauthErrorMessage(code: string | null | undefined) {
    if (!code) {
        return null;
    }

    const normalized = code.toLowerCase();
    if (normalized === "signup_disabled" || normalized === "signup disabled") {
        return "No staff account exists for this Google email. Ask an admin to create one first.";
    }
    if (normalized === "account_not_linked" || normalized === "unable_to_link_account") {
        return "This Google account is not linked to a staff user.";
    }
    if (normalized === "email_not_found") {
        return "Google did not return an email address. Use an account with an email and try again.";
    }
    return "Google sign-in failed. Try again or use email and password.";
}
