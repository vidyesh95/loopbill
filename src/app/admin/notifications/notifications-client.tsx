"use client";

import {useState} from "react";
import {Button} from "@/components/ui/button";
import {Bell, Plus} from "lucide-react";
import {NotificationDialog} from "@/components/staff/staff-forms";
import NotificationsTabs from "@/components/admin/notifications/notifications-tabs";
import type {NotificationRow, NotificationTemplateRow} from "@/lib/data/types";

export default function NotificationsClient({
    notifications,
    templates,
}: {
    notifications: NotificationRow[];
    templates: NotificationTemplateRow[];
}) {
    const [isSendNewNotificationOpen, setIsSendNewNotificationOpen] = useState(false);

    return (
        <main className="w-full flex flex-col gap-4">
            <div className="flex justify-between flex-col md:flex-row items-start md:items-center gap-2">
                <div>
                    <h1 className="text-2xl font-bold md:text-3xl">Notifications</h1>
                    <p className="text-muted-foreground">
                        Manage and send notifications to users and customers
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" className="cursor-pointer">
                        <Bell/>View templates
                    </Button>
                    <Button
                        className="cursor-pointer"
                        onClick={() => setIsSendNewNotificationOpen(true)}>
                        <Plus/>Send new notification
                    </Button>
                </div>
            </div>
            <NotificationsTabs notifications={notifications} templates={templates}/>

            <NotificationDialog
                open={isSendNewNotificationOpen}
                onOpenChange={setIsSendNewNotificationOpen}
            />
        </main>
    );
}
