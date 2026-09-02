import dynamic from "next/dynamic";
import { requireRole } from "@/lib/session";
import { getJobs } from "@/lib/db/queries-staff";

const JobMap = dynamic(() => import("@/components/agent/job-map"), { ssr: false });

export default async function AgentMap() {
  const session = await requireRole(["agent"]);
  const jobs = await getJobs({
    agentId: session.user.id,
    statuses: ["Scheduled", "In progress", "Reschedule required"],
  });
  const withPins = jobs.filter((job) => job.lat && job.lng);

  return (
    <main className="flex flex-col gap-4">
      <div>
        <h1 className="text-2xl font-bold">Service map</h1>
        <p className="text-muted-foreground">
          OpenStreetMap pins for jobs with saved coordinates. Save a customer address to geocode it.
        </p>
      </div>
      <JobMap
        jobs={jobs.map((job) => ({
          id: job.id,
          customer: job.customer,
          address: job.address,
          location: job.location,
          lat: job.lat,
          lng: job.lng,
        }))}
      />
      {withPins.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          No pins yet. Edit a customer location so Nominatim can store lat/lng.
        </p>
      ) : null}
      <ul className="space-y-2">
        {jobs.map((job) => (
          <li key={job.id} className="rounded-md border p-3 text-sm">
            #{job.id} {job.customer} — {job.address || job.location || "No address"}
            {job.lat && job.lng ? " · pinned" : " · not geocoded"}
          </li>
        ))}
      </ul>
    </main>
  );
}
