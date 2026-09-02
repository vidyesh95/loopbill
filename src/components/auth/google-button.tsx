"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { safeCallbackURL } from "@/lib/oauth";

function GoogleMark() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="size-4">
      <path
        fill="#4285F4"
        d="M23.49 12.27c0-.85-.08-1.67-.22-2.46H12v4.66h6.46a5.52 5.52 0 0 1-2.4 3.62v3h3.88c2.27-2.09 3.55-5.17 3.55-8.82"
      />
      <path
        fill="#34A853"
        d="M12 24c3.24 0 5.96-1.07 7.95-2.91l-3.88-3c-1.08.72-2.47 1.15-4.07 1.15-3.13 0-5.78-2.11-6.73-4.96H1.27v3.11A12 12 0 0 0 12 24"
      />
      <path
        fill="#FBBC05"
        d="M5.27 14.28A7.2 7.2 0 0 1 4.89 12c0-.79.14-1.56.38-2.28V6.61H1.27A12 12 0 0 0 0 12c0 1.94.46 3.77 1.27 5.39z"
      />
      <path
        fill="#EA4335"
        d="M12 4.75c1.76 0 3.34.61 4.59 1.8l3.44-3.44C17.95 1.14 15.24 0 12 0 7.31 0 3.26 2.69 1.27 6.61l4 3.11C6.22 6.86 8.87 4.75 12 4.75"
      />
    </svg>
  );
}

export function GoogleSignInButton({
  callbackURL,
  errorCallbackURL = "/signin",
  requestSignUp = false,
}: {
  callbackURL?: string;
  errorCallbackURL?: string;
  requestSignUp?: boolean;
}) {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleClick() {
    setError(null);
    setPending(true);
    const { error: signInError } = await authClient.signIn.social({
      provider: "google",
      callbackURL: safeCallbackURL(callbackURL),
      errorCallbackURL,
      requestSignUp,
    });
    setPending(false);
    if (signInError) {
      setError(signInError.message ?? "Could not start Google sign-in.");
    }
  }

  return (
    <>
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
      <Button
        type="button"
        variant="outline"
        className="w-full"
        disabled={pending}
        onClick={handleClick}
      >
        <GoogleMark />
        {pending ? "Redirecting..." : "Continue with Google"}
      </Button>
    </>
  );
}
