import AdminDashboardClient from "@/components/admin/admin-dashboard-client";
import {
  getAgentPerformance,
  getComplaintStatusBreakdown,
  getDashboardStats,
  getPendingComplaints,
  getServiceTrends,
  getServicesAtRisk,
  getUpcomingServices,
} from "@/lib/db/queries";
import { getLookups, getRecentActivities } from "@/lib/db/queries-staff";

export default async function Admin() {
  const [
    stats,
    upcoming,
    atRisk,
    pending,
    agentPerformance,
    complaintStatus,
    serviceTrends,
    activities,
    lookups,
  ] = await Promise.all([
    getDashboardStats(),
    getUpcomingServices(),
    getServicesAtRisk(),
    getPendingComplaints(),
    getAgentPerformance(),
    getComplaintStatusBreakdown(),
    getServiceTrends(),
    getRecentActivities(),
    getLookups(),
  ]);

  return (
    <AdminDashboardClient
      stats={stats}
      upcoming={upcoming}
      atRisk={atRisk}
      pending={pending}
      agentPerformance={agentPerformance}
      complaintStatus={complaintStatus}
      serviceTrends={serviceTrends}
      activities={activities}
      customers={lookups.customers}
      agents={lookups.agents}
    />
  );
}
