"use client";

import Link from "next/link";
import {Menu} from "lucide-react";
import {Button} from "@/components/ui/button";
import {
    Sheet, SheetClose, SheetContent, SheetHeader, SheetTitle, SheetTrigger,
} from "@/components/ui/sheet";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {OTHER_SERVICES, PEST_SERVICES} from "@/lib/data/services";

const links = [
    {href: "/#about", label: "About"},
    {href: "/#pricing", label: "Pricing"},
    {href: "/#contact", label: "Contact"},
];

export default function Navbar() {
    return (
        <nav className="sticky top-0 z-50 bg-[#edebe4]">
            <div className="relative mx-auto flex max-w-7xl items-center justify-center p-4 md:justify-between md:px-8 md:py-3.5">
                <Sheet>
                    <SheetTrigger className="absolute left-4 md:hidden" aria-label="Open menu">
                        <Menu className="size-6" />
                    </SheetTrigger>

                    <SheetContent side="left" className="overflow-y-auto">
                        <SheetHeader className="space-y-4">
                            {links.map(({href, label}) => (
                                <SheetTitle key={href}>
                                    <SheetClose asChild>
                                        <Link href={href} className="block">
                                            {label}
                                        </Link>
                                    </SheetClose>
                                </SheetTitle>
                            ))}
                            <SheetTitle>
                                <SheetClose asChild>
                                    <Link href="/services" className="block">Services</Link>
                                </SheetClose>
                            </SheetTitle>
                            <div className="space-y-2 text-left">
                                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Pest control</p>
                                {PEST_SERVICES.map((service) => (
                                    <SheetClose asChild key={service.slug}>
                                        <Link href={`/services/${service.slug}`} className="block text-sm text-gray-700">
                                            {service.title}
                                        </Link>
                                    </SheetClose>
                                ))}
                                <p className="pt-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Other</p>
                                {OTHER_SERVICES.map((service) => (
                                    <SheetClose asChild key={service.slug}>
                                        <Link href={`/services/${service.slug}`} className="block text-sm text-gray-700">
                                            {service.title}
                                        </Link>
                                    </SheetClose>
                                ))}
                            </div>
                            <SheetClose asChild>
                                <Link href="/signin">
                                    <Button className="btn-primary w-full">Sign in</Button>
                                </Link>
                            </SheetClose>
                        </SheetHeader>
                    </SheetContent>
                </Sheet>

                <Link href="/" className="text-2xl font-bold text-primary">
                    UrbanPestMaster
                </Link>

                <nav className="hidden items-center space-x-8 md:flex">
                    <DropdownMenu>
                        <DropdownMenuTrigger className="text-sm font-medium outline-none">
                            Services
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="start" className="w-56">
                            <DropdownMenuItem asChild>
                                <Link href="/services">All services</Link>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuLabel>Pest control</DropdownMenuLabel>
                            {PEST_SERVICES.map((service) => (
                                <DropdownMenuItem key={service.slug} asChild>
                                    <Link href={`/services/${service.slug}`}>{service.title}</Link>
                                </DropdownMenuItem>
                            ))}
                            <DropdownMenuSeparator />
                            <DropdownMenuLabel>Other services</DropdownMenuLabel>
                            {OTHER_SERVICES.map((service) => (
                                <DropdownMenuItem key={service.slug} asChild>
                                    <Link href={`/services/${service.slug}`}>{service.title}</Link>
                                </DropdownMenuItem>
                            ))}
                        </DropdownMenuContent>
                    </DropdownMenu>

                    {links.map(({href, label}) => (
                        <Link key={href} href={href}>
                            {label}
                        </Link>
                    ))}

                    <Link href="/signin">
                        <Button className="btn-primary">Sign in</Button>
                    </Link>
                </nav>
            </div>
        </nav>
    );
}
