import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ResetEmailConfirmation() {
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
          <CardTitle className="text-center">Reset email sent</CardTitle>
          <CardDescription className="text-center">
            Reset your password by clicking on link in email
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-yellow-100">
            <Mail size={32} color="oklch(72.3% 0.219 149.579)" />
          </div>

          <h2 className="text-center text-2xl font-bold">Check Your Email</h2>
          <div className="flex flex-col gap-0">
            <h4 className="text-center">We&#39;ve sent a password reset link to</h4>
            <span className="text-center font-bold">admin@gmail.com</span>
          </div>
          <p className="text mb-8 text-center text-sm">
            Didn&#39;t receive the email? Check your spam folder or
            <Link href="/reset-password" className="w-auto font-bold text-primary">
              {" "}
              try again
            </Link>
          </p>
          <Link href="/signin" className="text-center font-semibold text-primary">
            <Button variant="outline" className="w-full">
              Back to Sign in
            </Button>
          </Link>
        </CardContent>
      </Card>
    </main>
  );
}
