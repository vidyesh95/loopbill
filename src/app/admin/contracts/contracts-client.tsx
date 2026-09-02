"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import ContractsTable from "@/components/admin/contracts/contracts-table";
import { ContractDialog } from "@/components/staff/staff-forms";
import type { ContractRow } from "@/lib/data/types";

export default function ContractsClient({
  contracts,
  customers,
  packages,
}: {
  contracts: ContractRow[];
  customers: Array<{ id: number; name: string }>;
  packages: Array<{ id: number; name: string }>;
}) {
  const [open, setOpen] = useState(false);

  return (
    <main className="flex w-full flex-col gap-4">
      <div className="flex flex-col items-start justify-between gap-2 md:flex-row md:items-center">
        <div>
          <h1 className="text-2xl font-bold md:text-3xl">Contracts management</h1>
          <p className="text-muted-foreground">
            Manage customer contracts, payments, and subscription details
          </p>
        </div>
        <Button className="cursor-pointer" onClick={() => setOpen(true)}>
          <Plus />
          New Contract
        </Button>
      </div>
      <ContractsTable contracts={contracts} />
      <ContractDialog
        open={open}
        onOpenChange={setOpen}
        customers={customers}
        packages={packages}
      />
    </main>
  );
}
