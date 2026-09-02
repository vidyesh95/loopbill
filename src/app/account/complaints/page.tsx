import Link from "next/link";
import { requireCustomerRecord } from "@/lib/account";
import { getComplaints } from "@/lib/db/queries";

export default async function AccountComplaints() {
  const { customer } = await requireCustomerRecord();
  if (!customer) {
    return <p>No customer record is linked to this login.</p>;
  }
  const rows = (await getComplaints()).filter((item) => item.customer === customer.name);
  return (
    <main className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Complaints</h1>
        <Link href="/complaint" className="text-sm underline">
          New complaint
        </Link>
      </div>
      <ul className="space-y-3">
        {rows.map((item) => (
          <li key={item.complaintId} className="rounded-md border p-4">
            <p className="font-medium">
              #{item.complaintId} {item.complaintType}
            </p>
            <p className="text-sm text-muted-foreground">
              {item.status} · {item.date}
            </p>
          </li>
        ))}
      </ul>
    </main>
  );
}
