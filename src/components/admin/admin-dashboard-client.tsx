"use client";

import {useState} from "react";
import {Button} from "@/components/ui/button";
import {Calendar, Download} from "lucide-react";
import TopStatisticsCards from "@/components/admin/reports/top-statistics-cards";
import UpcomingServices from "@/components/admin/upcoming-services";
import RecentActivities from "@/components/admin/recent-activities";
import ServicesAtRisk from "@/components/admin/services-at-risk";
import PendingComplaints from "@/components/admin/pending-complaints";
import AgentPerformance from "@/components/admin/reports/agent-performance";
import ComplaintStatusBreakdown from "@/components/admin/reports/complaint-status-breakdown";
import ServiceTrends from "@/components/admin/reports/service-trends";
import ScheduleServiceModal from "@/components/admin/schedule-service-modal";
import type {
    AgentPerformanceRow,
    ComplaintStatusRow,
    DashboardStats,
    PendingComplaintRow,
    ServiceAtRiskRow,
    ServiceTrendRow,
    UpcomingServiceRow,
} from "@/lib/data/types";

interface AdminDashboardClientProps {
    stats: DashboardStats;
    upcoming: UpcomingServiceRow[];
    atRisk: ServiceAtRiskRow[];
    pending: PendingComplaintRow[];
    agentPerformance: AgentPerformanceRow[];
    complaintStatus: ComplaintStatusRow[];
    serviceTrends: ServiceTrendRow[];
}

export default function AdminDashboardClient({
    stats,
    upcoming,
    atRisk,
    pending,
    agentPerformance,
    complaintStatus,
    serviceTrends,
}: AdminDashboardClientProps) {
    const [showScheduleModal, setShowScheduleModal] = useState(false);

    return (
        <main className="w-full flex flex-col gap-4">
            <div className="flex justify-between flex-col md:flex-row items-start md:items-center gap-2">
                <div>
                    <h1 className="text-2xl font-bold md:text-3xl">Admin Dashboard</h1>
                    <p className="text-muted-foreground">Overview of UrbanPestMaster operations</p>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" className="cursor-pointer"><Download/>Export report</Button>
                    <Button
                        type="button"
                        variant="default"
                        className="cursor-pointer"
                        onClick={() => setShowScheduleModal(true)}
                    >
                        <Calendar/>Schedule Service
                    </Button>
                </div>
            </div>
            <TopStatisticsCards stats={stats}/>
            <hr/>
            <UpcomingServices services={upcoming}/>
            <RecentActivities/>
            <ServicesAtRisk items={atRisk}/>
            <PendingComplaints items={pending}/>
            <AgentPerformance data={agentPerformance}/>
            <ComplaintStatusBreakdown data={complaintStatus}/>
            <ServiceTrends data={serviceTrends}/>

            <ScheduleServiceModal isOpen={showScheduleModal} onClose={() => setShowScheduleModal(false)}/>
        </main>
    );
}
