"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  DndContext,
  PointerSensor,
  useDraggable,
  useDroppable,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { addMonths, format, isSameDay, startOfMonth, startOfWeek } from "date-fns";
import { rescheduleService } from "@/lib/actions/ops";

export type CalendarService = {
  id: number;
  customer: string;
  serviceType: string;
  date: string;
  scheduledAt?: string | Date | null;
  agent: string;
  status: string;
};

function jobDate(service: CalendarService) {
  if (service.scheduledAt) {
    return new Date(service.scheduledAt);
  }
  const parsed = new Date(service.date);
  return Number.isNaN(parsed.getTime()) ? new Date() : parsed;
}

function DraggableJob({ service }: { service: CalendarService }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: `job-${service.id}`,
    data: { serviceId: service.id },
  });
  return (
    <button
      type="button"
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className="w-full truncate rounded border bg-background px-1 py-0.5 text-left text-xs"
      style={{
        opacity: isDragging ? 0.4 : 1,
        transform: transform ? `translate(${transform.x}px, ${transform.y}px)` : undefined,
      }}
    >
      #{service.id} {service.customer}
    </button>
  );
}

function DayCell({
  date,
  jobs,
}: {
  date: Date;
  jobs: CalendarService[];
}) {
  const id = format(date, "yyyy-MM-dd");
  const { setNodeRef, isOver } = useDroppable({ id, data: { date: id } });
  return (
    <div
      ref={setNodeRef}
      className={`min-h-24 rounded-md border p-1 ${isOver ? "border-primary bg-primary/5" : ""}`}
    >
      <p className="text-xs text-muted-foreground">{format(date, "d")}</p>
      <div className="mt-1 space-y-1">
        {jobs.map((job) => (
          <DraggableJob key={job.id} service={job} />
        ))}
      </div>
    </div>
  );
}

export default function CalendarView({
  isOpen,
  onClose,
  services,
  allowOverride = false,
}: {
  isOpen: boolean;
  onClose: () => void;
  services: CalendarService[];
  allowOverride?: boolean;
}) {
  const router = useRouter();
  const [month, setMonth] = useState(startOfMonth(new Date()));
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 6 } }));

  const days = useMemo(() => {
    const start = startOfWeek(month, { weekStartsOn: 1 });
    return Array.from({ length: 42 }, (_, index) => {
      const date = new Date(start);
      date.setDate(start.getDate() + index);
      return date;
    });
  }, [month]);

  async function onDragEnd(event: DragEndEvent) {
    const serviceId = event.active.data.current?.serviceId as number | undefined;
    const date = event.over?.data.current?.date as string | undefined;
    if (!serviceId || !date) {
      return;
    }
    const result = await rescheduleService({
      serviceId,
      date,
      override: allowOverride,
    });
    if (!result.ok) {
      toast.error(result.error);
      return;
    }
    toast.success(`Moved #${serviceId} to ${date}`);
    router.refresh();
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-4xl">
        <DialogHeader>
          <DialogTitle>Service calendar</DialogTitle>
          <DialogDescription>
            Drag a job onto a day to reschedule. Dates outside 90–120 days are blocked unless
            overridden.
          </DialogDescription>
        </DialogHeader>
        <div className="mb-3 flex items-center justify-between">
          <Button variant="outline" size="sm" onClick={() => setMonth(addMonths(month, -1))}>
            Previous
          </Button>
          <p className="font-medium">{format(month, "MMMM yyyy")}</p>
          <Button variant="outline" size="sm" onClick={() => setMonth(addMonths(month, 1))}>
            Next
          </Button>
        </div>
        <DndContext sensors={sensors} onDragEnd={onDragEnd}>
          <div className="grid grid-cols-7 gap-1 text-center text-xs font-medium">
            {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
              <div key={day}>{day}</div>
            ))}
          </div>
          <div className="mt-1 grid grid-cols-7 gap-1">
            {days.map((date) => (
              <DayCell
                key={date.toISOString()}
                date={date}
                jobs={services.filter((service) => isSameDay(jobDate(service), date))}
              />
            ))}
          </div>
        </DndContext>
        <div className="mt-3 flex flex-wrap gap-2">
          {["Scheduled", "Completed", "Reschedule required"].map((status) => (
            <Badge key={status} variant="outline">
              {status}
            </Badge>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
