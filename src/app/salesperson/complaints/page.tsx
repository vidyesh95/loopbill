import { getCurrentSession } from "@/lib/session";
import { getComplaintsForRole, getJobs, getLookups } from "@/lib/db/queries-staff";
import ComplaintsClient from "@/app/admin/complaints/complaints-client";

export default async function SalesComplaints() {
  const session = await getCurrentSession();
  const [complaints, lookups, jobs] = await Promise.all([
    getComplaintsForRole("salesperson", session?.user.id),
    getLookups(),
    getJobs({ salespersonId: session?.user.id }),
  ]);
  return (
    <ComplaintsClient
      complaints={complaints}
      customers={lookups.customers}
      services={jobs.map((job) => ({
        id: job.id,
        customerId: job.customerId,
        label: `#${job.id} ${job.customer} — ${job.serviceType}`,
      }))}
    />
  );
}
