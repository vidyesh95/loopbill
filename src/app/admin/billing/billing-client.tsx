"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { markInvoicePaid, voidInvoice } from "@/lib/actions/invoices";
import type { InvoiceRow } from "@/lib/data/types";

export default function BillingClient({ invoices }: { invoices: InvoiceRow[] }) {
  const router = useRouter();

  return (
    <main className="flex w-full flex-col gap-4">
      <div>
        <h1 className="text-2xl font-bold md:text-3xl">Billing</h1>
        <p className="text-muted-foreground">Invoices issued from contracts. Mark paid in-app.</p>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Number</TableHead>
            <TableHead>Customer</TableHead>
            <TableHead>Contract</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Due</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {invoices.map((item) => (
            <TableRow key={item.id}>
              <TableCell>{item.number}</TableCell>
              <TableCell>{item.customerName}</TableCell>
              <TableCell>{item.contractId ?? "—"}</TableCell>
              <TableCell>₹{item.amount.toLocaleString("en-IN")}</TableCell>
              <TableCell>{item.status}</TableCell>
              <TableCell>{item.dueAt || "—"}</TableCell>
              <TableCell className="space-x-2">
                <Button asChild size="sm" variant="outline">
                  <a href={`/api/invoices/${item.id}/pdf`}>PDF</a>
                </Button>
                {item.status !== "Paid" && item.status !== "Void" ? (
                  <Button
                    size="sm"
                    onClick={async () => {
                      const result = await markInvoicePaid(item.id);
                      if (!result.ok) {
                        toast.error(result.error);
                        return;
                      }
                      toast.success("Marked paid");
                      router.refresh();
                    }}
                  >
                    Mark paid
                  </Button>
                ) : null}
                {item.status !== "Void" && item.status !== "Paid" ? (
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={async () => {
                      const result = await voidInvoice(item.id);
                      if (!result.ok) {
                        toast.error(result.error);
                        return;
                      }
                      toast.success("Voided");
                      router.refresh();
                    }}
                  >
                    Void
                  </Button>
                ) : null}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </main>
  );
}
