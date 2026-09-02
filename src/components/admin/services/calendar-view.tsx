import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Calendar } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";
import { format, isSameDay } from "date-fns";

interface Service {
  id: number;
  customer: string;
  serviceType: string;
  date: string;
  agent: string;
  status: string;
  location: string;
  phone: string;
  amount: string;
}

interface CalendarViewProps {
  isOpen: boolean;
  onClose: () => void;
  services: Service[];
}

const CalendarView = ({ isOpen, onClose, services }: CalendarViewProps) => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completed":
        return "bg-green-100 text-green-700";
      case "In progress":
        return "bg-blue-100 text-blue-700";
      case "Scheduled":
        return "bg-yellow-100 text-yellow-700";
      case "Redo Required":
        return "bg-red-100 text-red-700";
      case "Expired":
        return "bg-gray-100 text-gray-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getServicesForDate = (date: Date) => {
    return services.filter((service) => {
      try {
        const serviceDate = new Date(service.date);
        return isSameDay(serviceDate, date);
      } catch {
        return false;
      }
    });
  };

  const selectedDateServices = getServicesForDate(selectedDate);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-h-[80vh] overflow-auto sm:max-w-225">
        <DialogHeader>
          <DialogTitle>Calendar View</DialogTitle>
          <DialogDescription>View and manage services by date</DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={(date) => date && setSelectedDate(date)}
              className="rounded-md border"
              modifiers={{
                hasService: (date) => getServicesForDate(date).length > 0,
              }}
              modifiersClassNames={{
                hasService: "bg-google-blue/20 text-google-blue font-semibold",
              }}
            />
            <div className="mt-4 space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <div className="bg-google-blue/20 h-3 w-3 rounded"></div>
                <span>Days with scheduled services</span>
              </div>
            </div>
          </div>

          <div>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">
                  Services for {format(selectedDate, "MMMM d, yyyy")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {selectedDateServices.length === 0 ? (
                  <p className="py-8 text-center text-muted-foreground">
                    No services scheduled for this date
                  </p>
                ) : (
                  <div className="space-y-3">
                    {selectedDateServices.map((service) => (
                      <div
                        key={service.id}
                        className="rounded-lg border p-3 transition-colors hover:bg-muted/50"
                      >
                        <div className="mb-2 flex items-start justify-between">
                          <div>
                            <p className="font-medium">{service.customer}</p>
                            <p className="text-sm text-muted-foreground">{service.serviceType}</p>
                          </div>
                          <Badge className={getStatusColor(service.status)}>{service.status}</Badge>
                        </div>
                        <div className="space-y-1 text-sm text-muted-foreground">
                          <p>Agent: {service.agent}</p>
                          <p>Location: {service.location}</p>
                          <p>Amount: {service.amount}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            <div className="mt-4">
              <h4 className="mb-2 font-medium">Quick Stats</h4>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="rounded bg-green-50 p-2">
                  <p className="font-medium text-green-700">
                    {services.filter((s) => s.status === "Completed").length}
                  </p>
                  <p className="text-green-600">Completed</p>
                </div>
                <div className="rounded bg-blue-50 p-2">
                  <p className="font-medium text-blue-700">
                    {
                      services.filter((s) => s.status === "Scheduled" || s.status === "In progress")
                        .length
                    }
                  </p>
                  <p className="text-blue-600">Upcoming</p>
                </div>
                <div className="rounded bg-red-50 p-2">
                  <p className="font-medium text-red-700">
                    {services.filter((s) => s.status === "Redo Required").length}
                  </p>
                  <p className="text-red-600">Redo Required</p>
                </div>
                <div className="rounded bg-gray-50 p-2">
                  <p className="font-medium text-gray-700">
                    {services.filter((s) => s.status === "Expired").length}
                  </p>
                  <p className="text-gray-600">Expired</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CalendarView;
