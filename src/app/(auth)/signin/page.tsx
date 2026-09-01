import {Suspense} from "react";
import {redirect} from "next/navigation";
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "@/components/ui/card";
import Link from "next/link";
import SignInForm from "@/components/auth/signin-form";
import {getCurrentSession} from "@/lib/session";
import {homeForRole} from "@/lib/roles";

export default async function SignIn() {
    const session = await getCurrentSession();
    if (session) {
        redirect(homeForRole(session.user.role));
    }
    return (
        <main className="min-h-screen py-4 flex flex-col justify-center items-center bg-[#edebe4]">
            <Link href="/" className="text-3xl font-bold text-primary text-center mb-2">
                UrbanPestMaster
            </Link>
            <p className="text-gray-600 text-base text-center max-w-76 pb-6">
                Professional pest control solutions for your home and business
            </p>
            <Card className="w-88">
                <CardHeader>
                    <CardTitle>Sign in</CardTitle>
                    <CardDescription>Enter your credentials to continue</CardDescription>
                </CardHeader>
                <CardContent>
                    <Suspense fallback={<p className="text-sm text-muted-foreground">Loading sign in...</p>}>
                        <SignInForm/>
                    </Suspense>
                </CardContent>
                <CardFooter className="text-xs">By signing in you accept Privacy Policy and Terms</CardFooter>
            </Card>
        </main>
    );
}
