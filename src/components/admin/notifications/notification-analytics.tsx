import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MailOpen, MailX, Percent, Send } from "lucide-react";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";

const performanceData = [
  { month: "Jan", sent: 1200, delivered: 1150, opened: 850, clicked: 320 },
  { month: "Feb", sent: 1400, delivered: 1350, opened: 1020, clicked: 410 },
  { month: "Mar", sent: 1600, delivered: 1520, opened: 1180, clicked: 475 },
  { month: "Apr", sent: 1800, delivered: 1730, opened: 1350, clicked: 540 },
  { month: "May", sent: 2000, delivered: 1900, opened: 1520, clicked: 608 },
  { month: "Jun", sent: 1750, delivered: 1680, opened: 1260, clicked: 504 },
  { month: "Jul", sent: 3500, delivered: 3400, opened: 2700, clicked: 1080 },
  { month: "Aug", sent: 3700, delivered: 3600, opened: 2900, clicked: 1160 },
  { month: "Sep", sent: 4000, delivered: 3900, opened: 3100, clicked: 1240 },
  { month: "Oct", sent: 4200, delivered: 4100, opened: 3300, clicked: 1320 },
  { month: "Nov", sent: 4500, delivered: 4400, opened: 3600, clicked: 1440 },
  { month: "Dec", sent: 4800, delivered: 4700, opened: 3900, clicked: 1560 },
];

const chartConfig = {
  sent: {
    label: "Sent",
    color: "hsl(220, 70%, 50%)",
  },
  delivered: {
    label: "Delivered",
    color: "hsl(142, 71%, 45%)",
  },
  opened: {
    label: "Opened",
    color: "hsl(346, 87%, 43%)",
  },
  clicked: {
    label: "Clicked",
    color: "hsl(262, 83%, 58%)",
  },
};

export default function NotificationAnalytics() {
  return (
    <main className="flex h-full w-full flex-col gap-4">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-l-4 border-l-blue-500 hover:shadow-md">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-sm">Total sent</CardTitle>
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100">
              <Send color="oklch(62.3% 0.214 259.815)" size={18} />
            </div>
          </CardHeader>
          <CardContent>
            <h1 className="text-2xl font-bold">2,847</h1>
            <CardDescription className="py-2 text-xs">+12% from last month</CardDescription>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500 hover:shadow-md">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-sm">Delivery rate</CardTitle>
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100">
              <Percent color="oklch(72.3% 0.219 149.579)" size={18} />
            </div>
          </CardHeader>
          <CardContent>
            <h1 className="text-2xl font-bold">98.5%</h1>
            <CardDescription className="py-2 text-xs">+0.3% from last month</CardDescription>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-yellow-500 hover:shadow-md">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-sm">Open rate</CardTitle>
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-yellow-100">
              <MailOpen color="oklch(79.5% 0.184 86.047)" size={18} />
            </div>
          </CardHeader>
          <CardContent>
            <h1 className="text-2xl font-bold">74.2%</h1>
            <CardDescription className="py-2 text-xs">+5.1% from last month</CardDescription>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-red-500 hover:shadow-md">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-sm">Failed deliveries</CardTitle>
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-red-100">
              <MailX color="oklch(63.7% 0.237 25.331)" size={18} />
            </div>
          </CardHeader>
          <CardContent>
            <h1 className="text-2xl font-bold">43</h1>
            <CardDescription className="py-2 text-xs">-8 from last month</CardDescription>
          </CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Notification analytics</CardTitle>
          <CardDescription>Performance metrics and engagement statistics</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Notification Delivery Rates</CardTitle>
              </CardHeader>
              <CardContent>
                <ChartContainer config={chartConfig} className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={performanceData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Area
                        type="monotone"
                        dataKey="sent"
                        stackId="1"
                        stroke="hsl(220, 70%, 50%)"
                        fill="hsl(220, 70%, 50%)"
                        fillOpacity={0.6}
                      />
                      <Area
                        type="monotone"
                        dataKey="delivered"
                        stackId="1"
                        stroke="hsl(142, 71%, 45%)"
                        fill="hsl(142, 71%, 45%)"
                        fillOpacity={0.6}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Engagement Metrics</CardTitle>
              </CardHeader>
              <CardContent>
                <ChartContainer config={chartConfig} className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={performanceData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Line
                        type="monotone"
                        dataKey="opened"
                        stroke="hsl(346, 87%, 43%)"
                        strokeWidth={2}
                      />
                      <Line
                        type="monotone"
                        dataKey="clicked"
                        stroke="hsl(262, 83%, 58%)"
                        strokeWidth={2}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
