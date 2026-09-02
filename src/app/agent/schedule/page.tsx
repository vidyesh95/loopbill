import { requireRole } from "@/lib/session";
import { getJobs } from "@/lib/db/queries-staff";
import { JobsTable } from "@/components/staff/jobs-table";

export default async function AgentSchedule() {
  const session = await requireRole(["agent"]);
  const jobs = await getJobs({
    agentId: session.user.id,
    statuses: ["Scheduled", "In progress", "Reschedule required"],
  });

  return (
    <main className="flex flex-col gap-4">
      <div>
        <h1 className="text-2xl font-bold">Schedule</h1>
        <p className="text-muted-foreground">Upcoming assigned work</p>
      </div>
      <JobsTable jobs={jobs} hrefFor={(job) => `/agent/jobs/${job.id}`} />
    </main>
  );
}
