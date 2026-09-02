"use client";

import {useState} from "react";
import {Button} from "@/components/ui/button";
import {Calendar, Plus} from "lucide-react";
import ServiceScheduleTimeline from "@/components/admin/services/service-schedule-timeline";
import ServicesTable from "@/components/admin/services/services-table";
import CalendarView from "@/components/admin/services/calendar-view";
import {ScheduleServiceDialog} from "@/components/staff/staff-forms";
import type {ServiceRow} from "@/lib/data/types";

export default function ServicesClient({
    services,
    customers,
    agents,
}: {
    services: ServiceRow[];
    customers: Array<{id: number; name: string}>;
    agents: Array<{id: string; name: string}>;
}) {
    const [isCalendarViewOpen, setIsCalendarViewOpen] = useState(false);
    const [isNewServiceOpen, setIsNewServiceOpen] = useState(false);

    return (
        <main className="flex w-full flex-col gap-4">
            <div className="flex flex-col items-start justify-between gap-2 md:flex-row md:items-center">
                <div>
                    <h1 className="text-2xl font-bold md:text-3xl">Services</h1>
                    <p className="text-muted-foreground">Manage all pest control services</p>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" className="cursor-pointer" onClick={() => setIsCalendarViewOpen(true)}>
                        <Calendar />
                        Calendar view
                    </Button>
                    <Button className="cursor-pointer" onClick={() => setIsNewServiceOpen(true)}>
                        <Plus />
                        New service
                    </Button>
                </div>
            </div>
            <ServicesTable services={services} />
            <ServiceScheduleTimeline />
            <ScheduleServiceDialog
                open={isNewServiceOpen}
                onOpenChange={setIsNewServiceOpen}
                customers={customers}
                agents={agents}
                allowOverride
            />
            <CalendarView isOpen={isCalendarViewOpen} onClose={() => setIsCalendarViewOpen(false)} services={services} />
        </main>
    );
}
