import Navbar from "@/components/customer/home/navbar";
import Footer from "@/components/customer/home/footer";
import {Toaster} from "@/components/ui/sonner";

export default function CustomerLayout({children}: {children: React.ReactNode}) {
    return (
        <div className="min-h-screen bg-[#f7f6f0]">
            <Navbar />
            {children}
            <Footer />
            <Toaster theme="light" />
        </div>
    );
}
