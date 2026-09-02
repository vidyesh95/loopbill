import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import NotificationsTablePagination from "@/components/admin/notifications/notifications-table-pagination";
import RecentNotificationsTable from "@/components/admin/notifications/recent-notifications-table";
import ScheduledNotificationsTable from "@/components/admin/notifications/scheduled-notifications-table";
import NotificationTemplates from "@/components/admin/notifications/notification-templates";
import NotificationAnalytics from "@/components/admin/notifications/notification-analytics";
import type { NotificationRow, NotificationTemplateRow } from "@/lib/data/types";

const allNotifications: NotificationRow[] = [
  {
    notificationId: 1,
    subject: "Service Reminder - Cockroach Treatment",
    recipients: "Amit Sharma",
    type: "Service Reminder",
    method: "Email, Push",
    status: "Delivered",
    dateTime: "Today, 9:30 AM",
    actions: "View details",
  },
  {
    notificationId: 2,
    subject: "Payment Due Reminder",
    recipients: "All Customers(124)",
    type: "Payment Due",
    method: "Email, Push, SMS",
    status: "Sending",
    dateTime: "Yesterday, 10:00 AM",
    actions: "View Progress",
  },
  {
    notificationId: 3,
    subject: "Service completion confirmation",
    recipients: "Rajesh Kumar",
    type: "Service Completion",
    method: "Email, Push",
    status: "Delivered",
    dateTime: "Yesterday, 2:15 PM",
    actions: "View details",
  },
  {
    notificationId: 4,
    subject: "New Service Offer - Termite Control",
    recipients: "Priya Sharma",
    type: "Promotional",
    method: "Email, Push, SMS",
    status: "Delivered",
    dateTime: "Today, 11:00 AM",
    actions: "View details",
  },
  {
    notificationId: 5,
    subject: "Service Feedback Request",
    recipients: "Amit Patel",
    type: "Feedback Request",
    method: "Email, Push",
    status: "Sending",
    dateTime: "Today, 12:30 PM",
    actions: "View Progress",
  },
  {
    notificationId: 6,
    subject: "Service Reminder - Pest Control",
    recipients: "All Customers(124)",
    type: "Service Reminder",
    method: "Email, Push, SMS",
    status: "Delivered",
    dateTime: "Today, 1:00 PM",
    actions: "View details",
  },
  {
    notificationId: 7,
    subject: "Payment Confirmation",
    recipients: "Rajesh Kumar",
    type: "Payment Confirmation",
    method: "Email, Push",
    status: "Delivered",
    dateTime: "Today, 3:00 PM",
    actions: "View details",
  },
  {
    notificationId: 8,
    subject: "Service Feedback Request",
    recipients: "Priya Sharma",
    type: "Feedback Request",
    method: "Email, Push, SMS",
    status: "Sending",
    dateTime: "Today, 4:00 PM",
    actions: "View Progress",
  },
  {
    notificationId: 9,
    subject: "New Service Offer - Pest Control",
    recipients: "Amit Patel",
    type: "Promotional",
    method: "Email, Push",
    status: "Scheduled",
    dateTime: "Tomorrow, 5:00 PM",
    actions: "Edit, Cancel",
  },
  {
    notificationId: 10,
    subject: "Service Reminder - Termite Control",
    recipients: "All Customers(124)",
    type: "Service Reminder",
    method: "Email, Push, SMS",
    status: "Scheduled",
    dateTime: "May 15, 2025, 6:00 PM",
    actions: "Edit, Cancel",
  },
  {
    notificationId: 11,
    subject: "Payment Due Reminder",
    recipients: "Rajesh Kumar",
    type: "Payment Due",
    method: "Email, Push",
    status: "Delivered",
    dateTime: "Today, 7:00 PM",
    actions: "View details",
  },
  {
    notificationId: 12,
    subject: "Service Completion Confirmation",
    recipients: "Priya Sharma",
    type: "Service Completion",
    method: "Email, Push, SMS",
    status: "Sending",
    dateTime: "Today, 8:00 PM",
    actions: "View Progress",
  },
];

export default function NotificationsTabs({
  notifications = allNotifications,
  templates,
}: {
  notifications?: NotificationRow[];
  templates?: NotificationTemplateRow[];
}) {
  const recentNotifications = notifications.filter(
    (notification) => notification.status !== "Scheduled",
  );
  const scheduledNotifications = notifications.filter(
    (notification) => notification.status === "Scheduled",
  );

  return (
    <Tabs defaultValue="recent-notifications" className="w-full">
      <TabsList className="grid w-full grid-cols-4">
        <TabsTrigger value="recent-notifications" className="cursor-pointer">
          Recent notifications
        </TabsTrigger>
        <TabsTrigger value="scheduled" className="cursor-pointer">
          Scheduled
        </TabsTrigger>
        <TabsTrigger value="templates" className="cursor-pointer">
          Templates
        </TabsTrigger>
        <TabsTrigger value="analytics" className="cursor-pointer">
          Analytics
        </TabsTrigger>
      </TabsList>
      <TabsContent value="recent-notifications">
        <Card>
          <CardHeader>
            <CardTitle>Recent Notifications</CardTitle>
            <CardDescription>Recently sent notifications and their delivery status</CardDescription>
          </CardHeader>
          <CardContent>
            <RecentNotificationsTable recentNotifications={recentNotifications} />
          </CardContent>
          <CardFooter>
            <NotificationsTablePagination />
          </CardFooter>
        </Card>
      </TabsContent>

      <TabsContent value="scheduled">
        <Card>
          <CardHeader>
            <CardTitle>Scheduled Notifications</CardTitle>
            <CardDescription>Notifications scheduled for future delivery</CardDescription>
          </CardHeader>
          <CardContent>
            <ScheduledNotificationsTable scheduledNotifications={scheduledNotifications} />
          </CardContent>
          <CardFooter>
            <NotificationsTablePagination />
          </CardFooter>
        </Card>
      </TabsContent>

      <TabsContent value={"templates"}>
        <Card>
          <CardHeader>
            <CardTitle>Notifications templates</CardTitle>
            <CardDescription>Predefined templates for common notifications</CardDescription>
          </CardHeader>
          <CardContent>
            <NotificationTemplates templates={templates} />
          </CardContent>
          <CardFooter>
            <NotificationsTablePagination />
          </CardFooter>
        </Card>
      </TabsContent>

      <TabsContent value={"analytics"}>
        <Card>
          <CardHeader>
            <CardTitle>Notification analytics</CardTitle>
            <CardDescription>Insights into notification delivery and engagement</CardDescription>
          </CardHeader>
          <CardContent>
            <NotificationAnalytics notifications={notifications} />
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
