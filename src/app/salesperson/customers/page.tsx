import { getCurrentSession } from "@/lib/session";
import { getCustomers } from "@/lib/db/queries-staff";
import CustomersClient from "./customers-client";

export default async function SalesCustomers() {
  const session = await getCurrentSession();
  const customers = await getCustomers(session?.user.id);
  return <CustomersClient customers={customers} />;
}
