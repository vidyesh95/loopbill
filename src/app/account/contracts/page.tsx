import { requireCustomerRecord } from "@/lib/account";
import { getContracts } from "@/lib/db/queries";

export default async function AccountContracts() {
  const { customer } = await requireCustomerRecord();
  if (!customer) {
    return <p>No customer record is linked to this login.</p>;
  }
  const rows = (await getContracts()).filter((item) => item.customerId === customer.id);
  return (
    <main className="space-y-4">
      <h1 className="text-2xl font-bold">Contracts</h1>
      <ul className="space-y-3">
        {rows.map((item) => (
          <li key={item.contractId} className="rounded-md border p-4">
            <p className="font-medium">
              #{item.contractId} {item.serviceType}
            </p>
            <p className="text-sm text-muted-foreground">
              {item.status} · {item.paymentStatus} · ₹{item.contractValue.toLocaleString("en-IN")}
            </p>
          </li>
        ))}
      </ul>
    </main>
  );
}
