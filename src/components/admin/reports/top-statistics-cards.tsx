import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, CalendarClock, ShieldCheck, TriangleAlert } from "lucide-react";
import type { DashboardStats } from "@/lib/data/types";

export default function TopStatisticsCards({ stats }: { stats?: DashboardStats }) {
  const totalPackages = stats?.totalPackages ?? 0;
  const activeServices = stats?.activeServices ?? 0;
  const completedThisMonth = stats?.completedThisMonth ?? 0;
  const expiringSoon = stats?.expiringSoon ?? 0;
  const pendingComplaints = stats?.pendingComplaints ?? 0;
  const highPriorityComplaints = stats?.highPriorityComplaints ?? 0;
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card className="border-l-4 border-l-blue-500 hover:shadow-md">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-sm">Total Packages</CardTitle>
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100">
            <Activity color="oklch(62.3% 0.214 259.815)" size={18} />
          </div>
        </CardHeader>
        <CardContent>
          <h1 className="text-2xl font-bold">{totalPackages.toLocaleString("en-IN")}</h1>
          <CardDescription className="py-2 text-xs">
            Seeded contracts in the database
          </CardDescription>
        </CardContent>
      </Card>

      <Card className="border-l-4 border-l-green-500 hover:shadow-md">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-sm">Active Services</CardTitle>
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100">
            <ShieldCheck color="oklch(72.3% 0.219 149.579)" size={18} />
          </div>
        </CardHeader>
        <CardContent>
          <h1 className="text-2xl font-bold">{activeServices.toLocaleString("en-IN")}</h1>
          <CardDescription className="py-2 text-xs">
            {completedThisMonth} completed this month
          </CardDescription>
        </CardContent>
      </Card>

      <Card className="border-l-4 border-l-yellow-500 hover:shadow-md">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-sm">Expiring Soon</CardTitle>
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-yellow-100">
            <CalendarClock color="oklch(79.5% 0.184 86.047)" size={18} />
          </div>
        </CardHeader>
        <CardContent>
          <h1 className="text-2xl font-bold">{expiringSoon.toLocaleString("en-IN")}</h1>
          <CardDescription className="py-2 text-xs">Marked expiring soon</CardDescription>
        </CardContent>
      </Card>

      <Card className="border-l-4 border-l-red-500 hover:shadow-md">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-sm">Pending Complaints</CardTitle>
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-red-100">
            <TriangleAlert color="oklch(63.7% 0.237 25.331)" size={18} />
          </div>
        </CardHeader>
        <CardContent>
          <h1 className="text-2xl font-bold">{pendingComplaints.toLocaleString("en-IN")}</h1>
          <CardDescription className="py-2 text-xs">
            {highPriorityComplaints} require immediate attention
          </CardDescription>
        </CardContent>
      </Card>
    </div>
  );
}
