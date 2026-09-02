"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CustomerDialog } from "@/components/staff/staff-forms";
import type { CustomerRecord } from "@/lib/db/queries-staff";

export default function CustomersClient({ customers }: { customers: CustomerRecord[] }) {
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<CustomerRecord | undefined>();

  return (
    <main className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Customers</h1>
          <p className="text-muted-foreground">Profiles and structured locations</p>
        </div>
        <Button
          onClick={() => {
            setEditing(undefined);
            setOpen(true);
          }}
        >
          Add customer
        </Button>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead>Location</TableHead>
            <TableHead />
          </TableRow>
        </TableHeader>
        <TableBody>
          {customers.map((item) => (
            <TableRow key={item.id}>
              <TableCell>{item.name}</TableCell>
              <TableCell>{item.phone}</TableCell>
              <TableCell>
                {item.label}
                <div className="text-xs text-muted-foreground">{item.address}</div>
              </TableCell>
              <TableCell>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setEditing(item);
                    setOpen(true);
                  }}
                >
                  Edit
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <CustomerDialog
        open={open}
        onOpenChange={setOpen}
        initial={
          editing
            ? {
                id: editing.id,
                locationId: editing.locationId ?? undefined,
                name: editing.name,
                phone: editing.phone,
                email: editing.email,
                label: editing.label,
                address: editing.address,
                building: editing.building,
                wing: editing.wing,
                flatNo: editing.flatNo,
              }
            : undefined
        }
      />
    </main>
  );
}
