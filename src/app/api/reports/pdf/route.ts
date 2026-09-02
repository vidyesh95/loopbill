import { NextResponse } from "next/server";
import { renderToBuffer } from "@react-pdf/renderer";
import { requireRole } from "@/lib/session";
import {
  getAgentPerformance,
  getComplaintStatusBreakdown,
  getDashboardStats,
  getServiceTrends,
} from "@/lib/db/queries";
import { ReportDocument } from "@/lib/pdf/invoice-document";

export async function GET() {
  await requireRole(["admin"]);
  const [stats, agents, complaints, trends] = await Promise.all([
    getDashboardStats(),
    getAgentPerformance(),
    getComplaintStatusBreakdown(),
    getServiceTrends(),
  ]);

  const lines = [
    `Total packages: ${stats.totalPackages}`,
    `Active services: ${stats.activeServices}`,
    `Completed this month: ${stats.completedThisMonth}`,
    `Expiring soon: ${stats.expiringSoon}`,
    `Pending complaints: ${stats.pendingComplaints}`,
    "",
    "Agents",
    ...agents.map((row) => `${row.name}: ${row.servicesCompleted} completed, ${row.efficiency}%`),
    "",
    "Complaints",
    ...complaints.map((row) => `${row.name}: ${row.value}`),
    "",
    "Trends",
    ...trends.map((row) => `${row.month}: ${row.services} services, INR ${row.revenue}`),
  ];

  const buffer = await renderToBuffer(
    ReportDocument({
      title: "LoopBill operations report",
      generatedAt: new Date().toISOString(),
      lines,
    }),
  );

  return new NextResponse(new Uint8Array(buffer), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": 'attachment; filename="loopbill-report.pdf"',
    },
  });
}
