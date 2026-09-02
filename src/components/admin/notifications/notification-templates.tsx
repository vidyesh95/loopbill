"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { upsertNotificationTemplate } from "@/lib/actions/settings";
import { sendManualNotification } from "@/lib/actions/ops";
import { formString } from "@/lib/utils";
import type { NotificationTemplateRow } from "@/lib/data/types";

export default function NotificationTemplates({
  templates = [],
}: {
  templates?: NotificationTemplateRow[];
}) {
  const router = useRouter();
  const [editingId, setEditingId] = useState<number | null>(null);

  return (
    <section className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
      {templates.map((item) => (
        <Card key={item.id}>
          {editingId === item.id ? (
            <form
              className="space-y-2 p-4"
              action={async (formData) => {
                const result = await upsertNotificationTemplate({
                  id: item.id,
                  cardTitle: formString(formData, "cardTitle", item.cardTitle),
                  cardDescription: formString(formData, "cardDescription", item.cardDescription),
                  subject: formString(formData, "subject", item.subject),
                  message: formString(formData, "message", item.message),
                });
                if (!result.ok) {
                  toast.error(result.error);
                  return;
                }
                toast.success("Template saved");
                setEditingId(null);
                router.refresh();
              }}
            >
              <Input name="cardTitle" defaultValue={item.cardTitle} />
              <Input name="cardDescription" defaultValue={item.cardDescription} />
              <Input name="subject" defaultValue={item.subject} />
              <Textarea name="message" defaultValue={item.message} rows={4} />
              <div className="flex gap-2">
                <Button type="submit" size="sm">
                  Save
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() => setEditingId(null)}
                >
                  Cancel
                </Button>
              </div>
            </form>
          ) : (
            <>
              <CardHeader>
                <CardTitle>{item.cardTitle}</CardTitle>
                <CardDescription>{item.cardDescription}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="font-semibold">
                  Subject: <span className="font-normal">{item.subject}</span>
                </p>
                <p className="font-semibold">
                  Message: <span className="font-normal">{item.message}</span>
                </p>
              </CardContent>
              <CardFooter>
                <Button variant="outline" onClick={() => setEditingId(item.id)}>
                  Edit
                </Button>
                <Button
                  className="ml-2"
                  onClick={async () => {
                    const result = await sendManualNotification({
                      subject: item.subject,
                      recipients: "Staff preview",
                      type: item.cardTitle,
                      message: item.message,
                      methods: ["Email"],
                    });
                    if (!result.ok) {
                      toast.error(result.error);
                      return;
                    }
                    toast.success("Logged from template");
                    router.refresh();
                  }}
                >
                  Use template
                </Button>
              </CardFooter>
            </>
          )}
        </Card>
      ))}
    </section>
  );
}
