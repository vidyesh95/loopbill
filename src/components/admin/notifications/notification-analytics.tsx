import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MailOpen, MailX, Percent, Send } from "lucide-react";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, XAxis, YAxis } from "recharts";
import type { NotificationRow } from "@/lib/data/types";

const chartConfig = {
  count: {
    label: "Count",
    color: "hsl(142, 71%, 45%)",
  },
};

export default function NotificationAnalytics({
  notifications = [],
}: {
  notifications?: NotificationRow[];
}) {
  const total = notifications.length;
  const delivered = notifications.filter((item) => item.status === "Delivered").length;
  const scheduled = notifications.filter((item) => item.status === "Scheduled").length;
  const sending = notifications.filter((item) => item.status === "Sending").length;
  const deliveryRate = total === 0 ? 0 : Math.round((delivered / total) * 100);

  const byType = Object.entries(
    notifications.reduce<Record<string, number>>((acc, item) => {
      acc[item.type] = (acc[item.type] ?? 0) + 1;
      return acc;
    }, {}),
  ).map(([type, count]) => ({ type, count }));

  return (
    <main className="flex h-full w-full flex-col gap-4">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-sm">Total logged</CardTitle>
            <Send size={18} />
          </CardHeader>
          <CardContent>
            <h1 className="text-2xl font-bold">{total}</h1>
            <CardDescription className="py-2 text-xs">In-app notification log</CardDescription>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-sm">Logged as delivered</CardTitle>
            <Percent size={18} />
          </CardHeader>
          <CardContent>
            <h1 className="text-2xl font-bold">{deliveryRate}%</h1>
            <CardDescription className="py-2 text-xs">
              {delivered} of {total}
            </CardDescription>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-sm">Scheduled</CardTitle>
            <MailOpen size={18} />
          </CardHeader>
          <CardContent>
            <h1 className="text-2xl font-bold">{scheduled}</h1>
            <CardDescription className="py-2 text-xs">Status = Scheduled</CardDescription>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-sm">Sending</CardTitle>
            <MailX size={18} />
          </CardHeader>
          <CardContent>
            <h1 className="text-2xl font-bold">{sending}</h1>
            <CardDescription className="py-2 text-xs">Still marked sending</CardDescription>
          </CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>By type</CardTitle>
          <CardDescription>Counts from the notification table</CardDescription>
        </CardHeader>
        <CardContent className="h-75">
          <ChartContainer config={chartConfig} className="h-full w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={byType}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="type" />
                <YAxis allowDecimals={false} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="count" fill="var(--color-count)" />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>
    </main>
  );
}
