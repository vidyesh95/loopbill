"use client";

import {useState} from "react";
import {Button} from "@/components/ui/button";
import {Plus, Search} from "lucide-react";
import AddComplaintModal from "@/components/admin/complaints/add-complaint-modal";
import ComplaintsTable from "@/components/admin/complaints/complaints-table";
import type {ComplaintRow} from "@/lib/data/types";

export default function ComplaintsClient({complaints}: {complaints: ComplaintRow[]}) {
    const [isAddComplaintOpen, setIsAddComplaintOpen] = useState(false);

    return (
        <main className="w-full flex flex-col gap-4">
            <div className="flex justify-between flex-col md:flex-row items-start md:items-center gap-2">
                <div>
                    <h1 className="text-2xl font-bold md:text-3xl">Complaints</h1>
                    <p className="text-muted-foreground">Track and resolve customer complaints</p>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" className="cursor-pointer">
                        <Search/>Search complaints
                    </Button>
                    <Button
                        className="cursor-pointer"
                        onClick={() => setIsAddComplaintOpen(true)}>
                        <Plus/>Add complaint
                    </Button>
                </div>
            </div>
            <ComplaintsTable complaints={complaints}/>

            <AddComplaintModal
                isOpen={isAddComplaintOpen}
                onClose={() => setIsAddComplaintOpen(false)}
            />
        </main>
    );
}
