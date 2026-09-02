import TopStatisticsCards from "@/components/admin/reports/top-statistics-cards";
import { ExportButtons } from "@/components/staff/export-buttons";
import AgentPerformance from "@/components/admin/reports/agent-performance";
import ComplaintStatusBreakdown from "@/components/admin/reports/complaint-status-breakdown";
import ServiceTrends from "@/components/admin/reports/service-trends";
import {
  getAgentPerformance,
  getComplaintStatusBreakdown,
  getDashboardStats,
  getServiceTrends,
} from "@/lib/db/queries";

export default async function Reports() {
  const [stats, agentPerformance, complaintStatus, serviceTrends] = await Promise.all([
    getDashboardStats(),
    getAgentPerformance(),
    getComplaintStatusBreakdown(),
    getServiceTrends(),
  ]);

  return (
    <main className="flex w-full flex-col gap-4">
      <div className="flex flex-col items-start justify-between gap-2 md:flex-row md:items-center">
        <div>
          <h1 className="text-2xl font-bold md:text-3xl">Reports</h1>
          <p className="text-muted-foreground">Overview of UrbanPestMaster operations</p>
        </div>
        <ExportButtons
          payload={{ stats, agentPerformance, complaintStatus, serviceTrends }}
        />
      </div>
      <TopStatisticsCards stats={stats} />
      <hr />
      <AgentPerformance data={agentPerformance} />
      <ComplaintStatusBreakdown data={complaintStatus} />
      <ServiceTrends data={serviceTrends} />
    </main>
  );
}
