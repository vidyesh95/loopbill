import Navbar from "@/components/customer/home/navbar";
import Footer from "@/components/customer/home/footer";
import { WhatsappWidget } from "@/components/customer/whatsapp-widget";
import { PublicSiteProvider } from "@/components/customer/public-site-context";
import { Toaster } from "@/components/ui/sonner";
import { getPublicSite } from "@/lib/public-site";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export default async function CustomerLayout({ children }: { children: React.ReactNode }) {
  const [{ company, services, pricing }, session] = await Promise.all([
    getPublicSite(),
    auth.api.getSession({ headers: await headers() }),
  ]);
  const role = session?.user.role;
  const accountHref = role === "customer" ? "/account" : role ? "/signin" : undefined;

  return (
    <PublicSiteProvider value={{ company, services, pricing, accountHref }}>
      <div className="min-h-screen bg-[oklch(0.965_0.012_95)]">
        <Navbar />
        {children}
        <Footer />
        <WhatsappWidget />
        <Toaster theme="light" />
      </div>
    </PublicSiteProvider>
  );
}
