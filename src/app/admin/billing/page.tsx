import { getInvoices } from "@/lib/db/queries";
import BillingClient from "./billing-client";

export default async function BillingPage() {
  const invoices = await getInvoices();
  return <BillingClient invoices={invoices} />;
}
