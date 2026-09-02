import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "lucide-react";
import { FormCacheProvider, useFormCache } from "@/state/form-cache-context";

interface ScheduleServiceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ScheduleServiceForm = ({ onClose }: { onClose: () => void }) => {
  const { getFormData, setFormData, clearFormData } = useFormCache();
  const formId = "schedule-service-modal";
  const cachedData = getFormData(formId);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const formData = new FormData(e.currentTarget);
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const data = {
        customerSelect: formData.get("customerSelect"),
        serviceType: formData.get("serviceType"),
        serviceDate: formData.get("serviceDate"),
        serviceTime: formData.get("serviceTime"),
        assignAgent: formData.get("assignAgent"),
        priority: formData.get("priority"),
        notes: formData.get("notes"),
      };

      console.log("Service scheduled successfully:", data);
      clearFormData(formId);
      onClose();
    } catch (error) {
      console.error("Failed to schedule service:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    const currentData = getFormData(formId) || {};
    setFormData(formId, { ...currentData, [field]: value });
  };

  // Helper function to safely get cached string values
  const getCachedValue = (key: string): string => {
    return (cachedData?.[key] as string) || "";
  };

  return (
    <>
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2">
          <Calendar className="text-google-blue h-5 w-5" />
          Schedule New Service
        </DialogTitle>
        <DialogDescription>Schedule a new service appointment for a customer</DialogDescription>
      </DialogHeader>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="customerSelect">Select Customer *</Label>
          <Select
            name="customerSelect"
            defaultValue={getCachedValue("customerSelect")}
            onValueChange={(value) => handleInputChange("customerSelect", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Choose a customer" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="amit">Amit Sharma - Building A, Flat 304</SelectItem>
              <SelectItem value="priya">Priya Patel - Building C, Flat 101</SelectItem>
              <SelectItem value="neha">Neha Kapoor - Building D, Flat 203</SelectItem>
              <SelectItem value="vikram">Vikram Malhotra - Building B, Flat 502</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="serviceType">Service Type *</Label>
          <Select
            name="serviceType"
            defaultValue={getCachedValue("serviceType")}
            onValueChange={(value) => handleInputChange("serviceType", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select service type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="cockroach">Cockroach Control</SelectItem>
              <SelectItem value="termite">Termite Control</SelectItem>
              <SelectItem value="rodent">Rodent Control</SelectItem>
              <SelectItem value="mosquito">Mosquito Treatment</SelectItem>
              <SelectItem value="ant">Ant Control</SelectItem>
              <SelectItem value="general">General Pest Control</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="serviceDate">Service Date *</Label>
            <Input
              name="serviceDate"
              type="date"
              defaultValue={getCachedValue("serviceDate")}
              onChange={(e) => handleInputChange("serviceDate", e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="serviceTime">Service Time *</Label>
            <Input
              name="serviceTime"
              type="time"
              defaultValue={getCachedValue("serviceTime")}
              onChange={(e) => handleInputChange("serviceTime", e.target.value)}
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="assignAgent">Assign Agent *</Label>
          <Select
            name="assignAgent"
            defaultValue={getCachedValue("assignAgent")}
            onValueChange={(value) => handleInputChange("assignAgent", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select an agent" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="raj">Raj Kumar</SelectItem>
              <SelectItem value="sanjay">Sanjay Singh</SelectItem>
              <SelectItem value="anita">Anita Desai</SelectItem>
              <SelectItem value="vikram">Vikram Sharma</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="priority">Priority Level</Label>
          <Select
            name="priority"
            defaultValue={getCachedValue("priority") || "normal"}
            onValueChange={(value) => handleInputChange("priority", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="normal">Normal</SelectItem>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="urgent">Urgent</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="notes">Special Instructions</Label>
          <Textarea
            name="notes"
            placeholder="Any special instructions for the agent..."
            rows={3}
            defaultValue={getCachedValue("notes")}
            onChange={(e) => handleInputChange("notes", e.target.value)}
          />
        </div>

        <div className="flex gap-3 pt-4">
          <Button type="button" variant="outline" onClick={onClose} className="flex-1">
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting} className="flex-1">
            <Calendar className="mr-2 h-4 w-4" />
            {isSubmitting ? "Scheduling..." : "Schedule Service"}
          </Button>
        </div>
      </form>
    </>
  );
};

const ScheduleServiceModal = ({ isOpen, onClose }: ScheduleServiceModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <FormCacheProvider>
          <ScheduleServiceForm onClose={onClose} />
        </FormCacheProvider>
      </DialogContent>
    </Dialog>
  );
};

export default ScheduleServiceModal;
