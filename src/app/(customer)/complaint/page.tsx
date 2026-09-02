import type {Metadata} from "next";
import ComplaintForm from "./complaint-form";

export const metadata: Metadata = {
    title: "Raise a complaint | Urban Pest Master",
    description: "Report a service issue in the same calendar month as your visit.",
};

export default function ComplaintPage() {
    return (
        <main className="mx-auto max-w-xl px-4 py-20">
            <h1 className="mb-3 text-3xl font-bold">Raise a complaint</h1>
            <p className="mb-6 text-muted-foreground">
                Complaints must be filed in the same calendar month as the original service. Use the
                phone number on your booking.
            </p>
            <ComplaintForm />
        </main>
    );
}
