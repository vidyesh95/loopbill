import { Suspense } from "react";
import { redirect } from "next/navigation";
import { count } from "drizzle-orm";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import SignInForm from "@/components/auth/signin-form";
import { getCurrentSession } from "@/lib/session";
import { homeForRole } from "@/lib/roles";
import { isGoogleOAuthConfigured } from "@/lib/oauth";
import { db } from "@/lib/db";
import { user } from "@/lib/db/schema";

export default async function SignIn() {
  const session = await getCurrentSession();
  if (session) {
    const home = homeForRole(session.user.role);
    if (home !== "/signin") {
      redirect(home);
    }
  }

  const [result] = await db.select({ value: count() }).from(user);
  const allowSignup = (result?.value ?? 0) === 0;

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-[#edebe4] py-4">
      <Link href="/" className="mb-2 text-center text-3xl font-bold text-primary">
        UrbanPestMaster
      </Link>
      <p className="max-w-76 pb-6 text-center text-base text-gray-600">
        Professional pest control solutions for your home and business
      </p>
      <Card className="w-88">
        <CardHeader>
          <CardTitle>Sign in</CardTitle>
          <CardDescription>Enter your credentials to continue</CardDescription>
        </CardHeader>
        <CardContent>
          <Suspense fallback={<p className="text-sm text-muted-foreground">Loading sign in...</p>}>
            <SignInForm googleEnabled={isGoogleOAuthConfigured()} allowSignup={allowSignup} />
          </Suspense>
        </CardContent>
        <CardFooter className="text-xs">
          By signing in you accept Privacy Policy and Terms
        </CardFooter>
      </Card>
    </main>
  );
}
