import { getCurrentSession } from "@/lib/session";
import { getJobs } from "@/lib/db/queries-staff";
import SalesServicesClient from "./services-client";

export default async function SalesServices() {
  const session = await getCurrentSession();
  const jobs = await getJobs({ salespersonId: session?.user.id });
  return <SalesServicesClient jobs={jobs} />;
}
