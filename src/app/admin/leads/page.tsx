import { getLeads } from "@/lib/db/queries-staff";
import LeadsClient from "@/components/staff/leads-client";

export default async function AdminLeads() {
  const leads = await getLeads();
  return <LeadsClient leads={leads} title="Website leads" />;
}
