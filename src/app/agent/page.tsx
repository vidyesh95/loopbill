import {requireRole} from "@/lib/session";
import {getJobs} from "@/lib/db/queries-staff";
import {JobsTable} from "@/components/staff/jobs-table";
import {startOfDay} from "@/lib/lifecycle";

export default async function AgentHome() {
    const session = await requireRole(["agent"]);
    const jobs = await getJobs({agentId: session.user.id});
    const today = startOfDay(new Date()).toDateString();
    const todays = jobs.filter((job) => job.scheduledAt && startOfDay(job.scheduledAt).toDateString() === today);

    return (
        <main className="flex flex-col gap-4">
            <div>
                <h1 className="text-2xl font-bold">Today</h1>
                <p className="text-muted-foreground">Jobs assigned to you</p>
            </div>
            <JobsTable jobs={todays.length ? todays : jobs.slice(0, 8)} hrefFor={(job) => `/agent/jobs/${job.id}`} />
        </main>
    );
}
