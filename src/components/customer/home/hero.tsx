import Link from "next/link";
import Image from "next/image";
import {Button} from "@/components/ui/button";
import {QuoteDialog} from "@/components/customer/quote-dialog";

export default function Hero() {
    return (
        <header className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center bg-gradient-to-b from-[#edebe4] to-[#f7f6f0]">
            <Image alt="pest image" src="/sprayman.svg" width={300} height={300} />
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
