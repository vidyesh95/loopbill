"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Lock, Mail, Phone } from "lucide-react";
import Link from "next/link";
import { GoogleSignInButton } from "@/components/auth/google-button";
import { authClient, homeForRole } from "@/lib/auth-client";

export default function SignUpForm({ googleEnabled }: { googleEnabled: boolean }) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    const form = new FormData(event.currentTarget);
    const email = typeof form.get("email") === "string" ? (form.get("email") as string) : "";
    const password =
      typeof form.get("password") === "string" ? (form.get("password") as string) : "";
    const confirm =
      typeof form.get("password2") === "string" ? (form.get("password2") as string) : "";

    if (!email.includes("@")) {
      setError("Use a valid email address to create the first admin.");
      return;
    }
    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }

    setPending(true);
    const { data, error: signUpError } = await authClient.signUp.email({
      email,
      password,
      name: email.split("@")[0] ?? "Admin",
      role: "admin",
      phone: "",
      department: "Management",
      status: "active",
    });
    setPending(false);

    if (signUpError || !data) {
      setError(signUpError?.message ?? "Could not create the account.");
      return;
    }

    router.push(homeForRole(data.user.role));
    router.refresh();
  }

  return (
    <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
      <div className="flex flex-col gap-1">
        <Label htmlFor="email">
          <Mail className="h-4 w-4" />
          Email or
          <Phone className="h-4 w-4" />
          Phone number
        </Label>
        <Input
          type="text"
          id="email"
          name="email"
          placeholder="Enter your email or phone number"
          pattern="^([^\s@]+@[^\s@]+\.[^\s@]+|\+?\d{10,15})$"
          title="Please enter a valid email or phone number"
          required
        />
      </div>
      <div className="flex flex-col gap-1">
        <Label htmlFor="password">
          <Lock className="h-4 w-4" />
          Password
        </Label>
        <Input
          type="password"
          id="password"
          name="password"
          placeholder="Enter your password"
          required
        />
      </div>
      <div className="flex flex-col gap-1">
        <Label htmlFor="password2">
          <Lock className="h-4 w-4" />
          Confirm password
        </Label>
        <Input
          type="password"
          id="password2"
          name="password2"
          placeholder="Enter your password again"
          required
        />
      </div>
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
      <Button type="submit" variant="default" className="w-full" disabled={pending}>
        {pending ? "Creating account..." : "Sign up"}
      </Button>
      <span className="flex justify-center gap-1">
        Already have an account?
        <Link href="/signin" className="font-semibold text-primary">
          Sign in
        </Link>
      </span>
      {googleEnabled ? (
        <>
          <div className="flex w-full items-center justify-between gap-2 py-3">
            <hr className="w-full" />
            <span className="flex-none text-xs">OR CONTINUE WITH</span>
            <hr className="w-full" />
          </div>
          <GoogleSignInButton callbackURL="/admin" requestSignUp />
        </>
      ) : null}
    </form>
  );
}
