import { requireCustomerRecord } from "@/lib/account";
import { getInvoices } from "@/lib/db/queries";

export default async function AccountInvoices() {
  const { customer } = await requireCustomerRecord();
  if (!customer) {
    return <p>No customer record is linked to this login.</p>;
  }
  const invoices = await getInvoices(customer.id);
  return (
    <main className="space-y-4">
      <h1 className="text-2xl font-bold">Invoices</h1>
      <ul className="space-y-3">
        {invoices.map((item) => (
          <li key={item.id} className="flex items-center justify-between rounded-md border p-4">
            <div>
              <p className="font-medium">{item.number}</p>
              <p className="text-sm text-muted-foreground">
                ₹{item.amount.toLocaleString("en-IN")} · {item.status}
              </p>
            </div>
            <a className="text-sm underline" href={`/api/invoices/${item.id}/pdf`}>
              PDF
            </a>
          </li>
        ))}
      </ul>
    </main>
  );
}
