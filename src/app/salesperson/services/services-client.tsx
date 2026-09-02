"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { JobsTable } from "@/components/staff/jobs-table";
import { verifyService } from "@/lib/actions/ops";
import type { JobRecord } from "@/lib/db/queries-staff";

export default function SalesServicesClient({ jobs }: { jobs: JobRecord[] }) {
  const router = useRouter();
  const completed = jobs.filter((job) => job.status === "Completed");

  return (
    <main className="flex flex-col gap-4">
      <div>
        <h1 className="text-2xl font-bold">Service verification</h1>
        <p className="text-muted-foreground">Confirm completed visits or request rework</p>
      </div>
      <JobsTable jobs={jobs} />
      <div className="space-y-2">
        {completed.map((job) => (
          <div
            key={job.id}
            className="flex flex-wrap items-center gap-2 rounded-md border px-3 py-2 text-sm"
          >
            #{job.id} {job.customer} — {job.serviceType}
            <Button
              size="sm"
              variant="outline"
              onClick={async () => {
                const result = await verifyService(job.id, false);
                if (!result.ok) {
                  toast.error(result.error);
                  return;
                }
                toast.success("Verified");
                router.refresh();
              }}
            >
              Verify
            </Button>
            <Button
              size="sm"
              onClick={async () => {
                const result = await verifyService(job.id, true);
                if (!result.ok) {
                  toast.error(result.error);
                  return;
                }
                toast.success("Rework requested");
                router.refresh();
              }}
            >
              Request rework
            </Button>
          </div>
        ))}
      </div>
    </main>
  );
}
