import Link from 'next/link'
import Image from 'next/image'
import {Button} from '@/components/ui/button'
import {
    Sheet, SheetClose, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger,
} from '@/components/ui/sheet'

const links = [
    {id: 'about', label: 'About'},
    {id: 'pricing', label: 'Pricing'},
    {id: 'contact', label: 'Contact'},
]

export default function Navbar() {
    return (
        <nav className="sticky top-0 z-50 bg-[#edebe4]">
            <div
                className="relative mx-auto flex max-w-7xl items-center justify-center p-4 md:py-3.5 md:px-8 md:justify-between">
                {/* Mobile ▸ menu button (hidden on md+) */}
                <Sheet>
                    <SheetTrigger className="absolute left-4 md:hidden">
                        <Image
                            src="/menu_24dp_1F1F1F_FILL0_wght400_GRAD0_opsz24.svg"
                            alt="menu"
                            width={24}
                            height={24}
                        />
                    </SheetTrigger>

                    <SheetContent side="left">
                        <SheetHeader className="space-y-4">
                            {links.map(({id, label}) => (
                                <SheetTitle key={id}>
                                    <SheetClose asChild>
                                        <Link
                                            href={{pathname: '/', hash: id}}
                                            scroll
                                            className="block"
                                        >
                                            {label}
                                        </Link>
                                    </SheetClose>
                                </SheetTitle>
                            ))}
                            <SheetDescription>
                                <SheetClose asChild>
                                    <Link href="/signin">
                                        <Button className="btn-primary w-full">
                                            Sign in
                                        </Button>
                                    </Link>
                                </SheetClose>
                            </SheetDescription>
                        </SheetHeader>
                    </SheetContent>
                </Sheet>

                {/* Brand */}
                <Link href="/" className="text-2xl font-bold text-primary">
                    UrbanPestMaster
                </Link>

                {/* Desktop ▸ link group */}
                <nav className="hidden items-center space-x-8 md:flex">
                    {links.map(({id, label}) => (
                        <Link key={id} href={{pathname: '/', hash: id}} scroll>
                            {label}
                        </Link>
                    ))}

                    <Link href="/signin">
                        <Button className="btn-primary">Sign in</Button>
                    </Link>
                </nav>
            </div>
        </nav>
    )
}