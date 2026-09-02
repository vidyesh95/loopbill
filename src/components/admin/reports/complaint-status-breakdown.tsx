"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

import type { ComplaintStatusRow } from "@/lib/data/types";

const complaintStatus: ComplaintStatusRow[] = [
  { name: "Open", value: 15, fill: "oklch(63.7% 0.237 25.331)" },
  { name: "In Progress", value: 8, fill: "oklch(79.5% 0.184 86.047)" },
  { name: "Resolved", value: 45, fill: "oklch(72.3% 0.219 149.579)" },
  { name: "Closed", value: 120, fill: "oklch(62.3% 0.214 259.815)" },
];

export default function ComplaintStatusBreakdown({
  data = complaintStatus,
}: {
  data?: ComplaintStatusRow[];
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Complaint status breakdown</CardTitle>
        <CardDescription>Overview of current complaint resolutions</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={350}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name}: ${((percent ?? 0) * 100).toFixed(0)}%`}
              outerRadius={120}
              dataKey="value"
              stroke="1px"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: "oklch(96.2% 0.044 156.743)",
                border: "1px solid oklch(72.3% 0.219 149.579)",
                borderRadius: "0.5rem",
              }}
              labelStyle={{ color: "#000000" }}
              itemStyle={{ color: "oklch(72.3% 0.219 149.579)" }}
              cursor={{ fill: "oklch(0.552 0.016 285.938)" }}
            />
            <Legend wrapperStyle={{ color: "oklch(0.552 0.016 285.938)" }} />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
