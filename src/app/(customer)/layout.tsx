import Navbar from "@/components/customer/home/navbar";
import Footer from "@/components/customer/home/footer";
import { WhatsappWidget } from "@/components/customer/whatsapp-widget";
import { Toaster } from "@/components/ui/sonner";

export default function CustomerLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[oklch(0.965_0.012_95)]">
      <Navbar />
      {children}
      <Footer />
      <WhatsappWidget />
      <Toaster theme="light" />
    </div>
  );
}
