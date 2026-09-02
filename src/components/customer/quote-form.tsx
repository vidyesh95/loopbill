"use client";

import { useState, type ReactNode } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { PROPERTY_TYPES, type PropertyType } from "@/lib/data/services";
import { usePublishedServices } from "@/components/customer/public-site-context";

export type QuoteFormProps = {
  defaultService?: string;
  defaultPropertyType?: PropertyType;
  defaultSource?: string;
  defaultMessage?: string;
  submitLabel?: string;
  onSuccess?: () => void;
};

const Field = ({
  label,
  htmlFor,
  children,
}: {
  label: string;
  htmlFor?: string;
  children: ReactNode;
}) => (
  <div className="space-y-2">
    <Label htmlFor={htmlFor} className="text-sm font-medium">
      {label}
    </Label>
    {children}
  </div>
);

export function QuoteForm({
  defaultService = "",
  defaultPropertyType = "Residential",
  defaultSource = "contact",
  defaultMessage = "",
  submitLabel = "Send Message",
  onSuccess,
}: QuoteFormProps) {
  const services = usePublishedServices();
  const pest = services.filter((item) => item.category === "pest");
  const other = services.filter((item) => item.category === "other");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [propertyType, setPropertyType] = useState<PropertyType>(defaultPropertyType);
  const [service, setService] = useState(defaultService);
  const [message, setMessage] = useState(defaultMessage);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName,
          lastName,
          email,
          phone,
          propertyType,
          service,
          message,
          source: defaultSource,
        }),
      });

      if (!res.ok) {
        let serverMessage: string | undefined;
        try {
          const json = (await res.json()) as { message?: string };
          serverMessage = json?.message;
        } catch {
          /* body not JSON */
        }
        toast.error(serverMessage ?? `Request failed: ${res.status} ${res.statusText}`);
        return;
      }

      toast.success("Message sent! We’ll be in touch soon.");
      setFirstName("");
      setLastName("");
      setEmail("");
      setPhone("");
      setPropertyType(defaultPropertyType);
      setService(defaultService);
      setMessage(defaultMessage);
      onSuccess?.();
    } catch (error) {
      console.error(error);
      toast.error("Unable to send your enquiry. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field label="First Name" htmlFor="quote-first-name">
          <Input
            id="quote-first-name"
            placeholder="Johnny"
            value={firstName}
            onChange={(event) => setFirstName(event.target.value)}
            required
          />
        </Field>
        <Field label="Last Name" htmlFor="quote-last-name">
          <Input
            id="quote-last-name"
            placeholder="Walker"
            value={lastName}
            onChange={(event) => setLastName(event.target.value)}
            required
          />
        </Field>
      </div>

      <Field label="Email" htmlFor="quote-email">
        <Input
          id="quote-email"
          type="email"
          placeholder="johnny@example.com"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
        />
      </Field>

      <Field label="Phone" htmlFor="quote-phone">
        <Input
          id="quote-phone"
          type="tel"
          placeholder="+91 00000 00000"
          value={phone}
          onChange={(event) => setPhone(event.target.value)}
          required
        />
      </Field>

      <Field label="Property type">
        <RadioGroup
          value={propertyType}
          onValueChange={(value) => setPropertyType(value as PropertyType)}
          className="flex flex-wrap gap-4"
        >
          {PROPERTY_TYPES.map((type) => (
            <label key={type} className="flex items-center gap-2 text-sm">
              <RadioGroupItem value={type} id={`property-${type}`} />
              {type}
            </label>
          ))}
        </RadioGroup>
      </Field>

      <Field label="Service">
        <Select value={service || undefined} onValueChange={setService}>
          <SelectTrigger id="quote-service" className="w-full">
            <SelectValue placeholder="Select a service" />
          </SelectTrigger>
          <SelectContent>
            {pest.map((item) => (
              <SelectItem key={item.slug} value={item.slug}>
                {item.title}
              </SelectItem>
            ))}
            {other.map((item) => (
              <SelectItem key={item.slug} value={item.slug}>
                {item.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </Field>

      <Field label="Message" htmlFor="quote-message">
        <Textarea
          id="quote-message"
          placeholder="Tell us about your pest control needs..."
          className="h-32"
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          required
        />
      </Field>

      <Button type="submit" className="btn-primary w-full" disabled={loading || !service}>
        {loading ? "Sending…" : submitLabel}
      </Button>
    </form>
  );
}
