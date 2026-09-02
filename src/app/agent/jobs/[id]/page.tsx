import {notFound} from "next/navigation";
import {requireRole} from "@/lib/session";
import {getJobById} from "@/lib/db/queries-staff";
import JobClient from "./job-client";

export default async function AgentJobPage({params}: {params: Promise<{id: string}>}) {
    const session = await requireRole(["agent"]);
    const {id} = await params;
    const job = await getJobById(Number(id), session.user.id);
    if (!job) {
        notFound();
    }
    return <JobClient job={job} />;
}
