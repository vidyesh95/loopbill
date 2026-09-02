import Link from "next/link";
import { requireCustomerRecord } from "@/lib/account";
import { getInvoices } from "@/lib/db/queries";
import { getJobs } from "@/lib/db/queries-staff";
import { getContracts } from "@/lib/db/queries";

export default async function AccountHome() {
  const { customer } = await requireCustomerRecord();
  if (!customer) {
    return <p>No customer record is linked to this login.</p>;
  }
  const [contracts, jobs, invoices] = await Promise.all([
    getContracts(),
    getJobs(),
    getInvoices(customer.id),
  ]);
  const mine = contracts.filter((item) => item.customerName === customer.name);
  const myJobs = jobs.filter((item) => item.customerId === customer.id);

  return (
    <main className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Welcome, {customer.name}</h1>
        <p className="text-muted-foreground">Your contracts, visits, and invoices.</p>
      </div>
      <div className="grid gap-3 md:grid-cols-3">
        <Link href="/account/contracts" className="rounded-md border p-4">
          <p className="text-sm text-muted-foreground">Contracts</p>
          <p className="text-2xl font-semibold">{mine.length}</p>
        </Link>
        <Link href="/account/services" className="rounded-md border p-4">
          <p className="text-sm text-muted-foreground">Services</p>
          <p className="text-2xl font-semibold">{myJobs.length}</p>
        </Link>
        <Link href="/account/invoices" className="rounded-md border p-4">
          <p className="text-sm text-muted-foreground">Invoices</p>
          <p className="text-2xl font-semibold">{invoices.length}</p>
        </Link>
      </div>
      <div className="flex gap-3 text-sm">
        <Link href="/complaint" className="underline">
          Raise a complaint
        </Link>
        <Link href="/reschedule" className="underline">
          Request reschedule
        </Link>
      </div>
    </main>
  );
}
