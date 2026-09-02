"use client";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod/v4";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";

const formSchema = z
  .object({
    notificationsEnabled: z.boolean(),
    emailNotifications: z.boolean(),
    smsNotifications: z.boolean(),
    pushNotifications: z.boolean(),
  })
  .refine(
    (value) => {
      // If notifications are disabled, all must be false
      if (!value.notificationsEnabled) {
        return !value.emailNotifications && !value.smsNotifications && !value.pushNotifications;
      }
      // If notifications are enabled, at least one must be true
      return value.emailNotifications || value.smsNotifications || value.pushNotifications;
    },
    {
      error: "If notifications are enabled, at least one of email, SMS, and push must be enabled.",
      path: ["notificationsEnabled"],
    },
  );

export default function NotificationsSettings() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      notificationsEnabled: true,
      emailNotifications: true,
      smsNotifications: false,
      pushNotifications: true,
    },
  });

  const notificationEnabled = form.watch("notificationsEnabled");

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className={"flex gap-1"}>
          <Bell size={18} color={"oklch(72.3% 0.219 149.579)"} />
          Notification settings
        </CardTitle>
        <CardDescription>Configure notification preferences</CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className={"mb-4 grid gap-4"}>
            <FormField
              control={form.control}
              name={"notificationsEnabled"}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className={"flex cursor-pointer items-center justify-between gap-2"}>
                    <div className={"flex flex-col gap-1"}>
                      All notifications
                      <FormDescription className={"font-normal"}>
                        Receive all notifications
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={(checked) => field.onChange(checked)}
                      />
                    </FormControl>
                  </FormLabel>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name={"emailNotifications"}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className={"flex cursor-pointer items-center justify-between gap-2"}>
                    <div className={"flex flex-col gap-1"}>
                      Email notifications
                      <FormDescription className={"font-normal"}>
                        Receive notifications by email
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Checkbox
                        disabled={!notificationEnabled}
                        checked={field.value}
                        onCheckedChange={(checked) => field.onChange(checked)}
                      />
                    </FormControl>
                  </FormLabel>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name={"smsNotifications"}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className={"flex cursor-pointer items-center justify-between gap-2"}>
                    <div className={"flex flex-col gap-1"}>
                      SMS notifications
                      <FormDescription className={"font-normal"}>
                        Receive notifications by SMS
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Checkbox
                        disabled={!notificationEnabled}
                        checked={field.value}
                        onCheckedChange={(checked) => field.onChange(checked)}
                      />
                    </FormControl>
                  </FormLabel>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name={"pushNotifications"}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className={"flex cursor-pointer items-center justify-between gap-2"}>
                    <div className={"flex flex-col gap-1"}>
                      Push notifications
                      <FormDescription className={"font-normal"}>
                        Receive push notifications
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Checkbox
                        disabled={!notificationEnabled}
                        checked={field.value}
                        onCheckedChange={(checked) => field.onChange(checked)}
                      />
                    </FormControl>
                  </FormLabel>
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter>
            <Button type={"submit"} className={"w-full cursor-pointer"}>
              Update preferences
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
