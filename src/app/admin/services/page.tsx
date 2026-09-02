import { getServices } from "@/lib/db/queries";
import { getLookups } from "@/lib/db/queries-staff";
import ServicesClient from "./services-client";

export default async function Services() {
  const [services, lookups] = await Promise.all([getServices(), getLookups()]);
  return (
    <ServicesClient services={services} customers={lookups.customers} agents={lookups.agents} />
  );
}
