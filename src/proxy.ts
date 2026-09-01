import {getSessionCookie} from "better-auth/cookies";
import {type NextRequest, NextResponse} from "next/server";

const protectedPrefixes = ["/admin", "/agent", "/salesperson"];

export function proxy(request: NextRequest) {
    const {pathname} = request.nextUrl;
    const isProtected = protectedPrefixes.some(
        (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
    );

    if (!isProtected) {
        return NextResponse.next();
    }

    const sessionCookie = getSessionCookie(request);
    if (!sessionCookie) {
        const signInUrl = new URL("/signin", request.url);
        signInUrl.searchParams.set("next", pathname);
        return NextResponse.redirect(signInUrl);
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/admin/:path*", "/agent/:path*", "/salesperson/:path*"],
};
