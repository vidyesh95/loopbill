import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";

const getStatusColor = (status: string) => {
  switch (status) {
    case "Delivered":
      return "text-green-600 border-green-400 bg-green-100";
    case "Scheduled":
      return "text-yellow-600 border-yellow-400 bg-yellow-100";
    case "Sending":
      return "text-orange-600 border-orange-400 bg-orange-100";
    default:
      return "text-yellow-600 border-yellow-400 bg-yellow-100";
  }
};

interface Notification {
  notificationId: number;
  subject: string;
  recipients: string;
  type: string;
  method: string;
  status: string;
  dateTime: string;
  actions: string;
}

interface ScheduledNotificationsProps {
  scheduledNotifications: Notification[];
}

export default function ScheduledNotificationsTable({
  scheduledNotifications,
}: ScheduledNotificationsProps) {
  if (scheduledNotifications.length === 0) {
    return <p>No notifications match the current filters.</p>;
  }
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="font-semibold">Subject</TableHead>
          <TableHead className="font-semibold">Recipients</TableHead>
          <TableHead className="font-semibold">Type</TableHead>
          <TableHead className="font-semibold">Method</TableHead>
          <TableHead className="font-semibold">Status</TableHead>
          <TableHead className="font-semibold text-wrap whitespace-normal">
            Sent date & time
          </TableHead>
          <TableHead className="font-semibold">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {scheduledNotifications.map((notification) => (
          <TableRow key={notification.notificationId}>
            <TableCell className="text-wrap whitespace-normal">{notification.subject}</TableCell>
            <TableCell className="text-wrap whitespace-normal">{notification.recipients}</TableCell>
            <TableCell className="text-wrap whitespace-normal">{notification.type}</TableCell>
            <TableCell className="text-wrap whitespace-normal">{notification.method}</TableCell>
            <TableCell>
              <span
                className={`rounded-full border px-2 py-0.5 font-semibold ${getStatusColor(notification.status)}`}
              >
                {notification.status}
              </span>
            </TableCell>
            <TableCell className="text-wrap whitespace-normal">{notification.dateTime}</TableCell>
            <TableCell>
              {notification.actions.split(",").map((action) => (
                <Button
                  key={action.trim()}
                  variant={"outline"}
                  size={"sm"}
                  className="mr-2 last:mr-0"
                >
                  {action.trim()}
                </Button>
              ))}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
