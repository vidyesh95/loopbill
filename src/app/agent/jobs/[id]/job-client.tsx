"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  completeAssignedService,
  reportCustomerAbsence,
  uploadServiceProof,
} from "@/lib/actions/agent";
import type { JobRecord } from "@/lib/db/queries-staff";
import { formString } from "@/lib/utils";

export default function JobClient({ job }: { job: JobRecord }) {
  const router = useRouter();

  return (
    <main className="mx-auto flex max-w-xl flex-col gap-4">
      <div>
        <h1 className="text-2xl font-bold">
          #{job.id} {job.serviceType}
        </h1>
        <p className="text-muted-foreground">
          {job.customer} · {job.location}
        </p>
        <p className="text-sm">{job.date}</p>
      </div>
      <p className="text-sm">Phone: {job.phone || "Hidden"}</p>
      <p className="text-sm">Status: {job.status}</p>
      {job.proofs.length > 0 ? (
        <div className="grid grid-cols-2 gap-2">
          {job.proofs.map((url) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img key={url} src={url} alt="Service proof" className="rounded-md border" />
          ))}
        </div>
      ) : null}
      <form
        className="space-y-2"
        action={async (formData) => {
          formData.set("serviceId", String(job.id));
          const result = await uploadServiceProof(formData);
          if (!result.ok) {
            toast.error(result.error);
            return;
          }
          toast.success("Photo uploaded");
          router.refresh();
        }}
      >
        <input type="file" name="file" accept="image/*" required />
        <Button type="submit" variant="outline">
          Upload proof
        </Button>
      </form>
      <form
        className="space-y-2"
        action={async (formData) => {
          const result = await completeAssignedService({
            serviceId: job.id,
            notes: formString(formData, "notes"),
          });
          if (!result.ok) {
            toast.error(result.error);
            return;
          }
          toast.success("Job completed");
          router.refresh();
        }}
      >
        <Textarea name="notes" placeholder="Completion notes" defaultValue={job.completionNotes} />
        <Button type="submit" className="w-full">
          Mark completed
        </Button>
      </form>
      <form
        action={async (formData) => {
          const result = await reportCustomerAbsence(
            job.id,
            formString(formData, "reason", "Customer not present"),
          );
          if (!result.ok) {
            toast.error(result.error);
            return;
          }
          toast.success("Absence sent to Sales");
          router.refresh();
        }}
      >
        <Textarea name="reason" placeholder="Customer absence notes" />
        <Button type="submit" variant="destructive" className="mt-2 w-full">
          Customer absent
        </Button>
      </form>
    </main>
  );
}
