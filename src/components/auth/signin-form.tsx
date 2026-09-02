"use client";

import {useState} from "react";
import {useRouter, useSearchParams} from "next/navigation";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import {Checkbox} from "@/components/ui/checkbox";
import {Lock, Mail} from "lucide-react";
import Link from "next/link";
import {GoogleSignInButton} from "@/components/auth/google-button";
import {authClient, homeForRole} from "@/lib/auth-client";
import {oauthErrorMessage} from "@/lib/oauth";

export default function SignInForm({googleEnabled, allowSignup}: {googleEnabled: boolean; allowSignup?: boolean}) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [error, setError] = useState<string | null>(() => oauthErrorMessage(searchParams.get("error")));
    const [pending, setPending] = useState(false);

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setError(null);
        setPending(true);

        const form = new FormData(event.currentTarget);
        const email = typeof form.get("email") === "string" ? form.get("email") as string : "";
        const password = typeof form.get("password") === "string" ? form.get("password") as string : "";
        const rememberMe = form.get("remember") === "on";

        const {data, error: signInError} = await authClient.signIn.email({
            email,
            password,
            rememberMe,
        });

        setPending(false);

        if (signInError || !data) {
            setError(signInError?.message ?? "Could not sign in. Check your email and password.");
            return;
        }

        const next = searchParams.get("next");
        router.push(next || homeForRole(data.user.role));
        router.refresh();
    }

    return (
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <div className="flex flex-col gap-1">
                <Label htmlFor="email"><Mail className="h-4 w-4"/>Email</Label>
                <Input
                    type="email"
                    id="email"
                    name="email"
                    placeholder="Enter your email"
                    title="Please enter a valid email"
                    required
                />
            </div>
            <div className="flex flex-col gap-1">
                <Label htmlFor="password"><Lock className="h-4 w-4"/>Password</Label>
                <Input type="password" id="password" name="password" placeholder="Enter your password" required/>
            </div>
            <div className="w-full flex justify-between items-center gap-2">
                <div className="flex items-center gap-2">
                    <Checkbox id="remember" name="remember"/>
                    <Label htmlFor="remember">Remember me</Label>
                </div>
                <Link href="/forgotpassword" className="text-sm text-primary font-semibold">Forgot password?</Link>
            </div>

            {error ? <p className="text-sm text-red-600">{error}</p> : null}

            <Button type="submit" variant="default" className="w-full" disabled={pending}>
                {pending ? "Signing in..." : "Sign in"}
            </Button>
            {allowSignup ? (
                <span className="flex gap-1 justify-center">
                    Don&#39;t have an account?<Link href="/signup" className="text-primary font-semibold">Sign up</Link>
                </span>
            ) : null}
            {googleEnabled ? (
                <>
                    <div className="w-full flex justify-between items-center gap-2 py-3">
                        <hr className="w-full"/>
                        <span className="flex-none text-xs">OR CONTINUE WITH</span>
                        <hr className="w-full"/>
                    </div>
                    <GoogleSignInButton callbackURL={searchParams.get("next") ?? "/signin"}/>
                </>
            ) : null}
        </form>
    );
}
