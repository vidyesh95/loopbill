import { getCurrentSession } from "@/lib/session";
import { getJobs, getLookups } from "@/lib/db/queries-staff";
import ScheduleClient from "./schedule-client";

export default async function SalesSchedule() {
  const session = await getCurrentSession();
  const [jobs, lookups] = await Promise.all([
    getJobs({ salespersonId: session?.user.id }),
    getLookups(),
  ]);
  return <ScheduleClient jobs={jobs} customers={lookups.customers} agents={lookups.agents} />;
}
