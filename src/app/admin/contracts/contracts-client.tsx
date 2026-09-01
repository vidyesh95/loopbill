"use client";

import {useState} from "react";
import {Download, Plus} from "lucide-react";
import NewContractModal from "@/components/admin/contracts/new-contract-modal";
import {Button} from "@/components/ui/button";
import ContractsTable from "@/components/admin/contracts/contracts-table";
import type {ContractRow} from "@/lib/data/types";

export default function ContractsClient({contracts}: {contracts: ContractRow[]}) {
    const [isNewContractOpen, setIsNewContractOpen] = useState(false);

    return (
        <main className="w-full flex flex-col gap-4">
            <div className="flex justify-between flex-col md:flex-row items-start md:items-center gap-2">
                <div>
                    <h1 className="text-2xl font-bold md:text-3xl">Contracts management</h1>
                    <p className="text-muted-foreground">
                        Manage customer contracts, payments, and subscription details
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" className="cursor-pointer">
                        <Download/>Export contracts
                    </Button>
                    <Button
                        className="cursor-pointer"
                        onClick={() => setIsNewContractOpen(true)}>
                        <Plus/>New Contract
                    </Button>
                </div>
            </div>
            <ContractsTable contracts={contracts}/>

            <NewContractModal
                isOpen={isNewContractOpen}
                onClose={() => setIsNewContractOpen(false)}
            />
        </main>
    );
}
