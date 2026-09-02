import {requireRole} from "@/lib/session";
import {getJobs} from "@/lib/db/queries-staff";

export default async function AgentMap() {
    const session = await requireRole(["agent"]);
    const jobs = await getJobs({
        agentId: session.user.id,
        statuses: ["Scheduled", "In progress", "Reschedule required"],
    });

    return (
        <main className="flex flex-col gap-4">
            <div>
                <h1 className="text-2xl font-bold">Service map</h1>
                <p className="text-muted-foreground">Open each stop in Google Maps</p>
            </div>
            <div className="space-y-3">
                {jobs.map((job) => {
                    const query = encodeURIComponent(job.address || job.location || job.customer);
                    const href = `https://www.google.com/maps/search/?api=1&query=${query}`;
                    return (
                        <article key={job.id} className="rounded-md border p-4">
                            <h2 className="font-semibold">
                                #{job.id} {job.customer}
                            </h2>
                            <p className="text-sm text-muted-foreground">{job.address || job.location}</p>
                            <a className="text-sm text-primary underline" href={href} target="_blank" rel="noreferrer">
                                Open in Maps
                            </a>
                            {job.address ? (
                                <iframe
                                    title={`Map ${job.id}`}
                                    className="mt-3 h-40 w-full rounded-md border"
                                    src={`https://maps.google.com/maps?q=${query}&output=embed`}
                                />
                            ) : null}
                        </article>
                    );
                })}
            </div>
        </main>
    );
}
