"use client";

import { useState, type ReactNode } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { usePublishedServices } from "@/components/customer/public-site-context";

export function EnquiryForm({ source = "home-enquiry" }: { source?: string }) {
  const services = usePublishedServices();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [service, setService] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);

    const parts = name.trim().split(/\s+/);
    const firstName = parts[0] ?? "";
    const lastName = parts.slice(1).join(" ") || "Enquiry";
    const serviceTitle = services.find((item) => item.slug === service)?.title ?? service;

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName,
          lastName,
          email,
          phone,
          propertyType: "Residential",
          service,
          message: `Homepage enquiry for ${serviceTitle}.`,
          source,
        }),
      });

      if (!res.ok) {
        toast.error("Please check the form and try again.");
        return;
      }

      toast.success("Enquiry sent. We will call or WhatsApp you shortly.");
      setName("");
      setPhone("");
      setEmail("");
      setService("");
    } catch {
      toast.error("Unable to send your enquiry. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="grid gap-4">
      <Field label="Service">
        <Select value={service || undefined} onValueChange={setService}>
          <SelectTrigger className="w-full bg-background">
            <SelectValue placeholder="Select your service" />
          </SelectTrigger>
          <SelectContent>
            {services.map((item) => (
              <SelectItem key={item.slug} value={item.slug}>
                {item.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </Field>
      <Field label="Name">
        <Input
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="Your name"
          required
          className="bg-background"
        />
      </Field>
      <Field label="Phone">
        <Input
          type="tel"
          value={phone}
          onChange={(event) => setPhone(event.target.value)}
          placeholder="+91 86001 39094"
          required
          className="bg-background"
        />
      </Field>
      <Field label="Email">
        <Input
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="you@example.com"
          required
          className="bg-background"
        />
      </Field>
      <Button type="submit" className="btn-primary w-full" disabled={loading || !service}>
        {loading ? "Sending…" : "Submit"}
      </Button>
    </form>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="space-y-2">
      <Label className="text-sm font-medium">{label}</Label>
      {children}
    </div>
  );
}
