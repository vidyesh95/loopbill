import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "@/components/ui/card";
import Link from "next/link";
import {redirect} from "next/navigation";
import {count} from "drizzle-orm";
import {db} from "@/lib/db";
import {user} from "@/lib/db/schema";
import SignUpForm from "@/components/auth/signup-form";
import {getCurrentSession} from "@/lib/session";
import {homeForRole} from "@/lib/roles";
import {isGoogleOAuthConfigured} from "@/lib/oauth";

export default async function SignUp() {
    const session = await getCurrentSession();
    if (session) {
        const home = homeForRole(session.user.role);
        if (home !== "/signin") {
            redirect(home);
        }
    }

    const [result] = await db.select({value: count()}).from(user);
    const hasStaff = (result?.value ?? 0) > 0;

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
                    <CardTitle>Sign up</CardTitle>
                    <CardDescription>
                        {hasStaff
                            ? "Staff accounts are created by an administrator"
                            : "Create the first administrator account"}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {hasStaff ? (
                        <div className="flex flex-col gap-4 text-sm text-muted-foreground">
                            <p>
                                Public sign-up is closed. Ask an admin to create your Salesperson or Agent account.
                            </p>
                            <Link href="/signin" className="text-primary font-semibold">
                                Back to sign in
                            </Link>
                        </div>
                    ) : (
                        <SignUpForm googleEnabled={isGoogleOAuthConfigured()}/>
                    )}
                </CardContent>
                <CardFooter className="text-xs">By signing up you accept Privacy Policy and Terms</CardFooter>
            </Card>
        </main>
    );
}
