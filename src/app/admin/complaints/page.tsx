import {getComplaintsForRole, getJobs, getLookups} from "@/lib/db/queries-staff";
import ComplaintsClient from "./complaints-client";

export default async function Complaints() {
    const [complaints, lookups, jobs] = await Promise.all([
        getComplaintsForRole("admin"),
        getLookups(),
        getJobs(),
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
            canAssignRedo
            agents={lookups.agents}
        />
    );
}
