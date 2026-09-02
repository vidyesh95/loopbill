import {getCurrentSession} from "@/lib/session";
import {getLookups, getRescheduleQueue} from "@/lib/db/queries-staff";
import RescheduleClient from "./reschedule-client";

export default async function SalesReschedule() {
    const session = await getCurrentSession();
    const [queue, lookups] = await Promise.all([
        getRescheduleQueue(session?.user.id),
        getLookups(),
    ]);
    return <RescheduleClient queue={queue} agents={lookups.agents} />;
}
