import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import {Lock} from "lucide-react";
import Link from "next/link";
import {GoogleSignInButton} from "@/components/auth/google-button";
import {isGoogleOAuthConfigured} from "@/lib/oauth";

export default function ResetPassword() {
    const googleEnabled = isGoogleOAuthConfigured();
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
                    <CardTitle>Reset Password</CardTitle>
                    <CardDescription>Enter your credentials to continue</CardDescription>
                </CardHeader>
                <CardContent>
                    <form className="flex flex-col gap-4">
                        <div className="flex flex-col gap-1">
                            <Label htmlFor="password"><Lock className="h-4 w-4"/>Password</Label>
                            <Input type="password" id="password" placeholder="Enter your password" required/>
                        </div>
                        <div className="flex flex-col gap-1">
                            <Label htmlFor="password"><Lock className="h-4 w-4"/>Confirm Password</Label>
                            <Input type="password" id="password" placeholder="Enter your password again" required/>
                        </div>
                        <Link href="/admin">
                            <Button type="submit" variant="default" className="w-full">Reset password</Button>
                        </Link>
                        <span className="flex gap-1 justify-center">
                            Remembered password?<Link href="/signin" className="text-primary font-semibold">Sign in</Link>
                        </span>
                        {googleEnabled ? (
                            <>
                                <div className="w-full flex justify-between items-center gap-2 py-3">
                                    <hr className="w-full"/>
                                    <span className="flex-none text-xs">OR CONTINUE WITH</span>
                                    <hr className="w-full"/>
                                </div>
                                <GoogleSignInButton callbackURL="/signin"/>
                            </>
                        ) : null}
                    </form>
                </CardContent>
                <CardFooter className="text-xs">By signing in you accept Privacy Policy and Terms</CardFooter>
            </Card>
        </main>
    );
}