import { getNotificationTemplates, getNotifications } from "@/lib/db/queries";
import NotificationsClient from "./notifications-client";

export default async function Notifications() {
  const [notifications, templates] = await Promise.all([
    getNotifications(),
    getNotificationTemplates(),
  ]);

  return <NotificationsClient notifications={notifications} templates={templates} />;
}
