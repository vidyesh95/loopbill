import Link from "next/link";
import {Bug} from "lucide-react";
import {Button} from "@/components/ui/button";
import {QuoteDialog} from "@/components/customer/quote-dialog";

export default function Hero() {
    return (
        <header className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center bg-[#edebe4]">
            <div className="mb-6 flex size-24 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Bug className="size-12" aria-hidden />
            </div>
            <h1 className="mb-4 max-w-3xl px-4 text-center text-3xl font-bold text-primary md:text-6xl">
                Professional Pest Control Solutions
            </h1>
            <p className="mb-12 max-w-3xl px-4 text-center text-base text-gray-600 md:text-xl">
                Protect your home and business from unwanted pests with our expert
                services. Professional, reliable, and guaranteed results.
            </p>
            <div className="flex w-full flex-col justify-center gap-4 px-4 sm:w-auto sm:flex-row">
                <QuoteDialog
                    defaultSource="hero"
                    trigger={<Button className="btn-primary">Get Free Quote</Button>}
                />
                <Button asChild variant="outline">
                    <Link href="/#about">Learn More</Link>
                </Button>
            </div>
        </header>
    );
}
