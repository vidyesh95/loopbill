import Link from "next/link";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { JobRecord } from "@/lib/db/queries-staff";

export function JobsTable({
  jobs,
  hrefFor,
}: {
  jobs: JobRecord[];
  hrefFor?: (job: JobRecord) => string;
}) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>ID</TableHead>
          <TableHead>Customer</TableHead>
          <TableHead>Service</TableHead>
          <TableHead>Date</TableHead>
          <TableHead>Agent</TableHead>
          <TableHead>Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {jobs.map((job) => (
          <TableRow key={job.id}>
            <TableCell>
              {hrefFor ? (
                <Link className="text-primary underline" href={hrefFor(job)}>
                  #{job.id}
                </Link>
              ) : (
                `#${job.id}`
              )}
            </TableCell>
            <TableCell>
              <div>{job.customer}</div>
              <div className="text-xs text-muted-foreground">{job.location}</div>
            </TableCell>
            <TableCell>
              {job.serviceType}
              <div className="text-xs text-muted-foreground">Visit {job.serviceNumber}</div>
            </TableCell>
            <TableCell>{job.date}</TableCell>
            <TableCell>{job.agent}</TableCell>
            <TableCell>{job.status}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
