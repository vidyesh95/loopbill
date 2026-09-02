import type { Metadata } from "next";
import RescheduleForm from "./reschedule-form";

export const metadata: Metadata = {
  title: "Request a reschedule | Urban Pest Master",
  description: "Ask Sales to move your upcoming pest control visit.",
};

export default function ReschedulePage() {
  return (
    <main className="mx-auto max-w-xl px-4 py-20">
      <h1 className="mb-3 text-3xl font-bold">Request a reschedule</h1>
      <p className="mb-6 text-muted-foreground">
        Sales will confirm a new date inside the allowed service window.
      </p>
      <RescheduleForm />
    </main>
  );
}
