"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { provisionCustomerLogin } from "@/lib/actions/portal";
import { formString } from "@/lib/utils";
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
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<CustomerRecord | undefined>();
  const [portalFor, setPortalFor] = useState<CustomerRecord | undefined>();

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
                <div className="flex gap-2">
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
                  {item.userId ? (
                    <span className="text-xs text-muted-foreground">Portal on</span>
                  ) : (
                    <Button size="sm" variant="ghost" onClick={() => setPortalFor(item)}>
                      Portal login
                    </Button>
                  )}
                </div>
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
      <Dialog open={Boolean(portalFor)} onOpenChange={(value) => !value && setPortalFor(undefined)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Portal login for {portalFor?.name}</DialogTitle>
          </DialogHeader>
          <form
            className="space-y-3"
            action={async (formData) => {
              if (!portalFor) {
                return;
              }
              const result = await provisionCustomerLogin({
                customerId: portalFor.id,
                email: formString(formData, "email", portalFor.email),
                password: formString(formData, "password"),
              });
              if (!result.ok) {
                toast.error(result.error);
                return;
              }
              toast.success("Portal login created");
              setPortalFor(undefined);
              router.refresh();
            }}
          >
            <Input name="email" type="email" defaultValue={portalFor?.email} required />
            <Input name="password" type="password" minLength={8} required placeholder="Password" />
            <Button type="submit" className="w-full">
              Create login
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </main>
  );
}
