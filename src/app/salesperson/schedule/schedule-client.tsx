"use client";

import {useState} from "react";
import {Button} from "@/components/ui/button";
import {JobsTable} from "@/components/staff/jobs-table";
import {ScheduleServiceDialog} from "@/components/staff/staff-forms";
import type {JobRecord} from "@/lib/db/queries-staff";

export default function ScheduleClient({
    jobs,
    customers,
    agents,
}: {
    jobs: JobRecord[];
    customers: Array<{id: number; name: string}>;
    agents: Array<{id: string; name: string}>;
}) {
    const [open, setOpen] = useState(false);
    return (
        <main className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold">Schedule</h1>
                    <p className="text-muted-foreground">Assign agents. Dates outside 90–120 days are rejected.</p>
                </div>
                <Button onClick={() => setOpen(true)}>Schedule service</Button>
            </div>
            <JobsTable jobs={jobs} />
            <ScheduleServiceDialog open={open} onOpenChange={setOpen} customers={customers} agents={agents} />
        </main>
    );
}
