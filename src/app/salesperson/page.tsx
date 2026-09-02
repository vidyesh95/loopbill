import {getCurrentSession} from "@/lib/session";
import {getCustomers, getJobs, getRescheduleQueue} from "@/lib/db/queries-staff";
import {getServicesAtRisk} from "@/lib/db/queries";
import Link from "next/link";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";

export default async function SalespersonHome() {
    const session = await getCurrentSession();
    const salespersonId = session?.user.id;
    const [customers, jobs, queue, atRisk] = await Promise.all([
        getCustomers(salespersonId),
        getJobs({salespersonId}),
        getRescheduleQueue(salespersonId),
        getServicesAtRisk(6),
    ]);
    const upcoming = jobs.filter((job) => ["Scheduled", "In progress", "Unscheduled"].includes(job.status));

    return (
        <main className="grid gap-4 md:grid-cols-2">
            <div className="md:col-span-2">
                <h1 className="text-2xl font-bold md:text-3xl">Sales Manager</h1>
                <p className="text-muted-foreground">Customers, schedules, and reschedule queue</p>
            </div>
            <Stat title="My customers" value={customers.length} href="/salesperson/customers" />
            <Stat title="Upcoming jobs" value={upcoming.length} href="/salesperson/schedule" />
            <Stat title="Reschedule queue" value={queue.filter((item) => item.status === "pending").length} href="/salesperson/reschedule" />
            <Stat title="At-risk packages" value={atRisk.length} href="/salesperson/schedule" />
            <Card className="md:col-span-2">
                <CardHeader>
                    <CardTitle>Absence / reschedule queue</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                    {queue.slice(0, 6).map((item) => (
                        <div key={item.id} className="flex justify-between gap-2 border-b py-2">
                            <span>
                                {item.customer ?? item.phone} — {item.reason}
                            </span>
                            <Link className="text-primary underline" href="/salesperson/reschedule">
                                Open
                            </Link>
                        </div>
                    ))}
                    {queue.length === 0 ? <p className="text-muted-foreground">No pending reschedules.</p> : null}
                </CardContent>
            </Card>
        </main>
    );
}

function Stat({title, value, href}: {title: string; value: number; href: string}) {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-base">{title}</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-3xl font-bold">{value}</p>
                <Link href={href} className="text-sm text-primary underline">
                    View
                </Link>
            </CardContent>
        </Card>
    );
}
