"use client";

import {useState} from "react";
import {Button} from "@/components/ui/button";
import {Calendar, Plus} from "lucide-react";
import ServiceScheduleTimeline from "@/components/admin/services/service-schedule-timeline";
import ServicesTable from "@/components/admin/services/services-table";
import NewServiceModal from "@/components/admin/services/new-service";
import CalendarView from "@/components/admin/services/calendar-view";
import type {ServiceRow} from "@/lib/data/types";

export default function ServicesClient({services}: {services: ServiceRow[]}) {
    const [isCalendarViewOpen, setIsCalendarViewOpen] = useState(false);
    const [isNewServiceOpen, setIsNewServiceOpen] = useState(false);

    return (
        <main className="w-full flex flex-col gap-4">
            <div className="flex justify-between flex-col md:flex-row items-start md:items-center gap-2">
                <div>
                    <h1 className="text-2xl font-bold md:text-3xl">Services</h1>
                    <p className="text-muted-foreground">Manage all pest control services</p>
                </div>
                <div className="flex items-center gap-2">
                    <Button
                        variant="outline"
                        className="cursor-pointer"
                        onClick={() => setIsCalendarViewOpen(true)}>
                        <Calendar/>Calendar view
                    </Button>
                    <Button
                        className="cursor-pointer"
                        onClick={() => setIsNewServiceOpen(true)}>
                        <Plus/>New service
                    </Button>
                </div>
            </div>
            <ServicesTable services={services}/>
            <ServiceScheduleTimeline/>

            <NewServiceModal
                isOpen={isNewServiceOpen}
                onClose={() => setIsNewServiceOpen(false)}
            />

            <CalendarView
                isOpen={isCalendarViewOpen}
                onClose={() => setIsCalendarViewOpen(false)}
                services={services}
            />
        </main>
    );
}
