import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import {CalendarClock, Check, Ticket} from "lucide-react";

export type ActivityItem = {
    kind: "completed" | "absence" | "complaint";
    title: string;
    detail: string;
    at: Date | null;
};

export default function RecentActivities({items}: {items?: ActivityItem[]}) {
    const rows = items?.length
        ? items
        : [];

    return (
        <Card>
            <CardHeader>
                <CardTitle>Recent Activities</CardTitle>
                <CardDescription>Latest system activities</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="flex flex-col gap-4">
                    {rows.length === 0 ? <p className="text-sm text-muted-foreground">No recent activity.</p> : null}
                    {rows.map((item, index) => (
                        <div key={`${item.kind}-${index}`} className="flex items-center gap-4">
                            <div
                                className={`flex h-10 w-10 items-center justify-center rounded-full ${
                                    item.kind === "completed"
                                        ? "bg-green-100"
                                        : item.kind === "absence"
                                          ? "bg-yellow-100"
                                          : "bg-red-100"
                                }`}
                            >
                                {item.kind === "completed" ? (
                                    <Check size={24} color="oklch(72.3% 0.219 149.579)" />
                                ) : item.kind === "absence" ? (
                                    <CalendarClock size={24} color="oklch(79.5% 0.184 86.047)" />
                                ) : (
                                    <Ticket size={24} color="oklch(63.7% 0.237 25.331)" />
                                )}
                            </div>
                            <div>
                                <p className="text-sm">{item.title}</p>
                                <p className="text-sm text-muted-foreground">{item.detail}</p>
                                <p className="text-xs text-muted-foreground">
                                    {item.at ? item.at.toLocaleString() : ""}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}
