"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Calendar, Download } from "lucide-react";
import TopStatisticsCards from "@/components/admin/reports/top-statistics-cards";
import UpcomingServices from "@/components/admin/upcoming-services";
import RecentActivities from "@/components/admin/recent-activities";
import ServicesAtRisk from "@/components/admin/services-at-risk";
import PendingComplaints from "@/components/admin/pending-complaints";
import AgentPerformance from "@/components/admin/reports/agent-performance";
import ComplaintStatusBreakdown from "@/components/admin/reports/complaint-status-breakdown";
import ServiceTrends from "@/components/admin/reports/service-trends";
import { ScheduleServiceDialog } from "@/components/staff/staff-forms";
import type { ActivityItem } from "@/components/admin/recent-activities";
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
  activities?: ActivityItem[];
  customers?: Array<{ id: number; name: string }>;
  agents?: Array<{ id: string; name: string }>;
}

export default function AdminDashboardClient({
  stats,
  upcoming,
  atRisk,
  pending,
  agentPerformance,
  complaintStatus,
  serviceTrends,
  activities,
  customers = [],
  agents = [],
}: AdminDashboardClientProps) {
  const [showScheduleModal, setShowScheduleModal] = useState(false);

  return (
    <main className="flex w-full flex-col gap-4">
      <div className="flex flex-col items-start justify-between gap-2 md:flex-row md:items-center">
        <div>
          <h1 className="text-2xl font-bold md:text-3xl">Admin Dashboard</h1>
          <p className="text-muted-foreground">Overview of UrbanPestMaster operations</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="cursor-pointer">
            <Download />
            Export report
          </Button>
          <Button
            type="button"
            variant="default"
            className="cursor-pointer"
            onClick={() => setShowScheduleModal(true)}
          >
            <Calendar />
            Schedule Service
          </Button>
        </div>
      </div>
      <TopStatisticsCards stats={stats} />
      <hr />
      <UpcomingServices services={upcoming} />
      <RecentActivities items={activities} />
      <ServicesAtRisk items={atRisk} />
      <PendingComplaints items={pending} />
      <AgentPerformance data={agentPerformance} />
      <ComplaintStatusBreakdown data={complaintStatus} />
      <ServiceTrends data={serviceTrends} />

      <ScheduleServiceDialog
        open={showScheduleModal}
        onOpenChange={setShowScheduleModal}
        customers={customers}
        agents={agents}
        allowOverride
      />
    </main>
  );
}
