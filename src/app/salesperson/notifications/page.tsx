import { getNotifications } from "@/lib/db/queries";
import NotificationsClient from "@/app/admin/notifications/notifications-client";

export default async function SalesNotifications() {
  const notifications = await getNotifications();
  return <NotificationsClient notifications={notifications} templates={[]} />;
}
