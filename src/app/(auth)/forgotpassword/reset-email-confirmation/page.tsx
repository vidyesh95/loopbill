import Link from "next/link";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import {Mail} from "lucide-react";
import {Button} from "@/components/ui/button";

export default function ResetEmailConfirmation() {
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
                    <CardTitle className="text-center">Reset email sent</CardTitle>
                    <CardDescription className="text-center">Reset your password by clicking on link in email</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col items-center gap-4">
                    <div className="h-16 w-16 flex justify-center items-center bg-yellow-100 rounded-full">
                        <Mail size={32} color="oklch(72.3% 0.219 149.579)"/>
                    </div>

                    <h2 className="text-2xl font-bold text-center">Check Your Email</h2>
                    <div className="flex flex-col gap-0">
                        <h4 className="text-center">We&#39;ve sent a password reset link to</h4>
                        <span className="text-center font-bold">admin@gmail.com</span>
                    </div>
                    <p className="text text-center text-sm mb-8">Didn&#39;t receive the email? Check your spam folder or
                        <Link href="/reset-password" className="w-auto text-primary font-bold"> try again</Link>
                    </p>
                    <Link href="/signin" className="text-center text-primary font-semibold">
                        <Button variant="outline" className="w-full">Back to Sign in</Button>
                    </Link>
                </CardContent>
            </Card>
        </main>
    );
}