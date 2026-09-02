"use client";

import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import type {
  AgentPerformanceRow,
  ComplaintStatusRow,
  DashboardStats,
  ServiceTrendRow,
} from "@/lib/data/types";

type ExportPayload = {
  stats: DashboardStats;
  agentPerformance: AgentPerformanceRow[];
  complaintStatus: ComplaintStatusRow[];
  serviceTrends: ServiceTrendRow[];
};

function csvEscape(value: string | number) {
  const text = String(value);
  return /[",\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
}

function toCsv(payload: ExportPayload) {
  const lines = [
    "Metric,Value",
    `Total packages,${payload.stats.totalPackages}`,
    `Active services,${payload.stats.activeServices}`,
    `Completed this month,${payload.stats.completedThisMonth}`,
    `Expiring soon,${payload.stats.expiringSoon}`,
    `Pending complaints,${payload.stats.pendingComplaints}`,
    `High priority complaints,${payload.stats.highPriorityComplaints}`,
    "",
    "Agent,Completed,Efficiency",
    ...payload.agentPerformance.map(
      (row) => `${csvEscape(row.name)},${row.servicesCompleted},${row.efficiency}`,
    ),
    "",
    "Complaint status,Count",
    ...payload.complaintStatus.map((row) => `${csvEscape(row.name)},${row.value}`),
    "",
    "Month,Services,Revenue",
    ...payload.serviceTrends.map((row) => `${row.month},${row.services},${row.revenue}`),
  ];
  return lines.join("\n");
}

export function ExportButtons({ payload }: { payload: ExportPayload }) {
  function downloadCsv() {
    const blob = new Blob([toCsv(payload)], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "loopbill-report.csv";
    link.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="flex gap-2">
      <Button variant="outline" className="cursor-pointer" onClick={downloadCsv}>
        <Download />
        Export CSV
      </Button>
      <Button className="cursor-pointer" onClick={() => {
        window.location.href = "/api/reports/pdf";
      }}>
        Export PDF
      </Button>
    </div>
  );
}
