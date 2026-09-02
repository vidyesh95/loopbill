import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Bell, Mail, User } from "lucide-react";

interface SendNewNotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SendNewNotificationModal = ({ isOpen, onClose }: SendNewNotificationModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Send New Notification</DialogTitle>
          <DialogDescription>Send notifications to users or customers</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="grid gap-2">
            <label htmlFor="notification_type" className="text-sm font-medium">
              Notification Type
            </label>
            <select
              id="notification_type"
              className="h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            >
              <option value="">Select notification type</option>
              <option value="service_reminder">Service Reminder</option>
              <option value="payment_due">Payment Due</option>
              <option value="service_completion">Service Completion</option>
              <option value="general_announcement">General Announcement</option>
              <option value="maintenance_alert">Maintenance Alert</option>
            </select>
          </div>

          <div className="grid gap-2">
            <label htmlFor="recipient_type" className="text-sm font-medium">
              Send To
            </label>
            <select
              id="recipient_type"
              className="h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            >
              <option value="all_customers">All Customers</option>
              <option value="specific_customer">Specific Customer</option>
              <option value="all_agents">All Agents</option>
              <option value="specific_agent">Specific Agent</option>
              <option value="sales_team">Sales Team</option>
              <option value="admin_team">Admin Team</option>
            </select>
          </div>

          <div className="grid gap-2">
            <label htmlFor="delivery_method" className="text-sm font-medium">
              Delivery Method
            </label>
            <div className="flex gap-2">
              <div className="flex flex-1 items-center space-x-2 rounded-md border p-3">
                <input type="checkbox" id="email" className="rounded" />
                <Mail className="text-google-blue h-4 w-4" />
                <label htmlFor="email" className="text-sm">
                  Email
                </label>
              </div>
              <div className="flex flex-1 items-center space-x-2 rounded-md border p-3">
                <input type="checkbox" id="push" className="rounded" />
                <Bell className="text-google-green h-4 w-4" />
                <label htmlFor="push" className="text-sm">
                  Push
                </label>
              </div>
              <div className="flex flex-1 items-center space-x-2 rounded-md border p-3">
                <input type="checkbox" id="sms" className="rounded" />
                <User className="text-google-yellow h-4 w-4" />
                <label htmlFor="sms" className="text-sm">
                  SMS
                </label>
              </div>
            </div>
          </div>

          <div className="grid gap-2">
            <label htmlFor="subject" className="text-sm font-medium">
              Subject
            </label>
            <input
              id="subject"
              className="h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              placeholder="Enter notification subject"
            />
          </div>

          <div className="grid gap-2">
            <label htmlFor="message" className="text-sm font-medium">
              Message
            </label>
            <Textarea id="message" placeholder="Enter your notification message..." rows={4} />
          </div>

          <div className="grid gap-2">
            <label htmlFor="schedule" className="text-sm font-medium">
              Schedule
            </label>
            <select
              id="schedule"
              className="h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            >
              <option value="immediate">Send Immediately</option>
              <option value="scheduled">Schedule for Later</option>
            </select>
          </div>

          <div className="flex gap-3 pt-4">
            <Button variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button className="flex-1">Send Notification</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SendNewNotificationModal;
