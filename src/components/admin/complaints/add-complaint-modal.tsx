import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface AddComplaintProps {
  isOpen: boolean;
  onClose: () => void;
}

const AddComplaintModal = ({ isOpen, onClose }: AddComplaintProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add New Complaint</DialogTitle>
          <DialogDescription>Register a new customer complaint for investigation</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="grid gap-2">
            <label htmlFor="customer_name" className="text-sm font-medium">
              Customer Name
            </label>
            <input
              id="customer_name"
              className="h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              placeholder="Enter customer name"
            />
          </div>

          <div className="grid gap-2">
            <label htmlFor="service_id" className="text-sm font-medium">
              Service ID
            </label>
            <input
              id="service_id"
              className="h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              placeholder="Enter service ID"
            />
          </div>

          <div className="grid gap-2">
            <label htmlFor="complaint_type" className="text-sm font-medium">
              Complaint Type
            </label>
            <select
              id="complaint_type"
              className="h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            >
              <option value="">Select complaint type</option>
              <option value="service_quality">Service Quality</option>
              <option value="pest_reappearance">Pest Reappearance</option>
              <option value="agent_behavior">Agent Behavior</option>
              <option value="incomplete_service">Incomplete Service</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div className="grid gap-2">
            <label htmlFor="priority" className="text-sm font-medium">
              Priority
            </label>
            <select
              id="priority"
              className="h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="urgent">Urgent</option>
            </select>
          </div>

          <div className="grid gap-2">
            <label htmlFor="description" className="text-sm font-medium">
              Complaint Description
            </label>
            <Textarea
              id="description"
              placeholder="Provide detailed description of the complaint..."
              rows={4}
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button variant="outline" onClick={onClose} className="flex-1 cursor-pointer">
              Cancel
            </Button>
            <Button className="flex-1 cursor-pointer">Submit Complaint</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddComplaintModal;
