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

export default async function Admin() {
    const [stats, upcoming, atRisk, pending, agentPerformance, complaintStatus, serviceTrends] = await Promise.all([
        getDashboardStats(),
        getUpcomingServices(),
        getServicesAtRisk(),
        getPendingComplaints(),
        getAgentPerformance(),
        getComplaintStatusBreakdown(),
        getServiceTrends(),
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
        />
    );
}
