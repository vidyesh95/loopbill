import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Timeline,
  TimelineConnector,
  TimelineContent,
  TimelineDescription,
  TimelineDot,
  TimelineItem,
  TimelineOppositeContent,
  TimelineSeparator,
  TimelineTitle,
} from "@/components/ui/timeline";
import { Circle, Clock } from "lucide-react";

export default function ServiceScheduleTimeline() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Service schedule timeline</CardTitle>
        <CardDescription>Visual timeline of service schedule</CardDescription>
      </CardHeader>
      <CardContent>
        <Timeline>
          <TimelineItem>
            <TimelineOppositeContent>
              <TimelineTitle>Today</TimelineTitle>
            </TimelineOppositeContent>
            <TimelineSeparator>
              <TimelineDot>
                <Circle color={"oklch(62.3% 0.214 259.815)"} fill="oklch(62.3% 0.214 259.815)" />
              </TimelineDot>
              <TimelineConnector />
            </TimelineSeparator>
            <TimelineContent>
              <TimelineTitle>5 Services Scheduled</TimelineTitle>
              <TimelineDescription className="flex items-center gap-1">
                <Clock size={12} />
                9:00 AM - Amit Sharma (Cockroach Control)
              </TimelineDescription>
              <TimelineDescription className="flex items-center gap-1">
                <Clock size={12} />
                11:30 AM - Priya Patel (Rodent Control)
              </TimelineDescription>
              <TimelineDescription className="flex items-center gap-1">
                <Clock size={12} />
                2:30 PM - Neha Kapoor (Mosquito Treatment)
              </TimelineDescription>
              <TimelineDescription className="flex items-center gap-1">
                <Clock size={12} />
                4:00 PM - Vikram Malhotra (Termite Control)
              </TimelineDescription>
              <TimelineDescription className="flex items-center gap-1">
                <Clock size={12} />
                5:30 PM - Rahul Verma (Ant Control)
              </TimelineDescription>
            </TimelineContent>
          </TimelineItem>

          <TimelineItem>
            <TimelineOppositeContent>
              <TimelineTitle>Tomorrow</TimelineTitle>
            </TimelineOppositeContent>
            <TimelineSeparator>
              <TimelineDot>
                <Circle color={"oklch(72.3% 0.219 149.579)"} fill={"oklch(72.3% 0.219 149.579)"} />
              </TimelineDot>
              <TimelineConnector />
            </TimelineSeparator>
            <TimelineContent>
              <TimelineTitle>3 Services Scheduled</TimelineTitle>
              <TimelineDescription className="flex items-center gap-1">
                <Clock size={12} />
                9:30 AM - Suresh Menon (Bed Bug Treatment)
              </TimelineDescription>
              <TimelineDescription className="flex items-center gap-1">
                <Clock size={12} />
                2:00 PM - Kavita Reddy (Cockroach Control)
              </TimelineDescription>
              <TimelineDescription className="flex items-center gap-1">
                <Clock size={12} />
                4:30 PM - Aryan Gupta (Termite Inspection)
              </TimelineDescription>
            </TimelineContent>
          </TimelineItem>

          <TimelineItem>
            <TimelineOppositeContent>
              <TimelineTitle>May 13</TimelineTitle>
            </TimelineOppositeContent>
            <TimelineSeparator>
              <TimelineDot>
                <Circle color={"oklch(79.5% 0.184 86.047)"} fill={"oklch(79.5% 0.184 86.047)"} />
              </TimelineDot>
              <TimelineConnector />
            </TimelineSeparator>
            <TimelineContent>
              <TimelineTitle>2 Services Scheduled</TimelineTitle>
              <TimelineDescription className="flex items-center gap-1">
                <Clock size={12} />
                11:00 AM - Arjun Nair (Termite Control)
              </TimelineDescription>
              <TimelineDescription className="flex items-center gap-1">
                <Clock size={12} />
                3:00 PM - Meera Shah (Cockroach Control)
              </TimelineDescription>
            </TimelineContent>
          </TimelineItem>
        </Timeline>
      </CardContent>
    </Card>
  );
}
