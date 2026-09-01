import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import {Mail, Lock} from "lucide-react";
import Link from "next/link";
import {Checkbox} from "@/components/ui/checkbox";
import AdvancedOptions from "@/components/auth/signin/advancedOption";

export default function SignIn() {
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
                    <form className="flex flex-col gap-4">
                        <div className="flex flex-col gap-1">
                            <Label htmlFor="email"><Mail className="h-4 w-4"/>Email</Label>
                            <Input type="email"
                                   id="email"
                                   placeholder="Enter your email"
                                   title="Please enter a valid email"
                                   required/>
                        </div>
                        <div className="flex flex-col gap-1">
                            <Label htmlFor="password"><Lock className="h-4 w-4"/>Password</Label>
                            <Input type="password" id="password" placeholder="Enter your password" required/>
                        </div>
                        <div className="w-full flex justify-between items-center gap-2">
                            <div className="flex items-center gap-2">
                                <Checkbox id="remember"/>
                                <Label htmlFor="remember">Remember me</Label>
                            </div>
                            <Link href="/forgotpassword" className="text-sm text-primary font-semibold">Forgot password?</Link>
                        </div>

                        {/* Advanced options */}
                        <AdvancedOptions />

                        <Link href="/admin">
                            <Button type="submit" variant="default" className="w-full">Sign in</Button>
                        </Link>
                        <span className="flex gap-1 justify-center">
                            Don&#39;t have an account?<Link href="/signup" className="text-primary font-semibold">Sign up</Link>
                        </span>
                        <div className="w-full flex justify-between items-center gap-2 py-3">
                            <hr className="w-full"/>
                            <span className="flex-none text-xs">OR CONTINUE WITH</span>
                            <hr className="w-full"/>
                        </div>
                        <Button type="button" variant="outline" className="w-full"><Mail className="me-2 h-4 w-4"/>Continue
                            with Google</Button>
                    </form>
                </CardContent>
                <CardFooter className="text-xs">By signing in you accept Privacy Policy and Terms</CardFooter>
            </Card>
        </main>
    );
}