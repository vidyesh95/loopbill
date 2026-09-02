"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { JobsTable } from "@/components/staff/jobs-table";
import { ScheduleServiceDialog } from "@/components/staff/staff-forms";
import CalendarView from "@/components/admin/services/calendar-view";
import type { JobRecord } from "@/lib/db/queries-staff";

export default function ScheduleClient({
  jobs,
  customers,
  agents,
}: {
  jobs: JobRecord[];
  customers: Array<{ id: number; name: string }>;
  agents: Array<{ id: string; name: string }>;
}) {
  const [open, setOpen] = useState(false);
  const [calendarOpen, setCalendarOpen] = useState(false);
  return (
    <main className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Schedule</h1>
          <p className="text-muted-foreground">
            Assign agents. Dates outside 90–120 days are rejected.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setCalendarOpen(true)}>
            Calendar
          </Button>
          <Button onClick={() => setOpen(true)}>Schedule service</Button>
        </div>
      </div>
      <JobsTable jobs={jobs} />
      <CalendarView
        isOpen={calendarOpen}
        onClose={() => setCalendarOpen(false)}
        services={jobs.map((job) => ({
          id: job.id,
          customer: job.customer,
          serviceType: job.serviceType,
          date: job.date,
          scheduledAt: job.scheduledAt,
          agent: job.agent,
          status: job.status,
        }))}
      />
      <ScheduleServiceDialog
        open={open}
        onOpenChange={setOpen}
        customers={customers}
        agents={agents}
      />
    </main>
  );
}
