import { requireCustomerRecord } from "@/lib/account";
import { getJobs } from "@/lib/db/queries-staff";

export default async function AccountServices() {
  const { customer } = await requireCustomerRecord();
  if (!customer) {
    return <p>No customer record is linked to this login.</p>;
  }
  const jobs = (await getJobs()).filter((item) => item.customerId === customer.id);
  return (
    <main className="space-y-4">
      <h1 className="text-2xl font-bold">Services</h1>
      <ul className="space-y-3">
        {jobs.map((job) => (
          <li key={job.id} className="rounded-md border p-4">
            <p className="font-medium">
              #{job.id} {job.serviceType}
            </p>
            <p className="text-sm text-muted-foreground">
              {job.date} · {job.status}
            </p>
          </li>
        ))}
      </ul>
    </main>
  );
}
