"use client";

import { useMemo, useState, type ReactNode } from "react";
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
import { QuoteDialog } from "@/components/customer/quote-dialog";
import {
  BHK_OPTIONS,
  DURATION_OPTIONS,
  PRICED_SERVICES,
  SQFT_OPTIONS,
  calculatePrice,
  describeQuote,
  formatInr,
  isPricedServiceSlug,
  type BhkValue,
  type DurationValue,
  type PricedServiceSlug,
} from "@/lib/data/pricing";
import type { PropertyType } from "@/lib/data/services";

type PriceCalculatorProps = {
  propertyType?: PropertyType;
  defaultService?: string;
  source?: string;
};

export function PriceCalculator({
  propertyType = "Residential",
  defaultService,
  source,
}: PriceCalculatorProps) {
  const initialService = isPricedServiceSlug(defaultService ?? "") ? defaultService : "cockroach";

  const [service, setService] = useState<PricedServiceSlug>(initialService as PricedServiceSlug);
  const [bhk, setBhk] = useState<BhkValue>("1bhk");
  const [sqft, setSqft] = useState<number>(100);
  const [duration, setDuration] = useState<DurationValue>("one-time");
  const [pincode, setPincode] = useState("");

  const area = propertyType === "Residential" ? bhk : sqft;
  const price = useMemo(
    () => calculatePrice({ propertyType, service, area, duration }),
    [propertyType, service, area, duration],
  );

  const quoteMessage = describeQuote({
    propertyType,
    service,
    area,
    duration,
    pincode,
    price,
  });

  const durationLabel = DURATION_OPTIONS.find((option) => option.value === duration)?.label;
  const areaLabel =
    propertyType === "Residential"
      ? BHK_OPTIONS.find((option) => option.value === bhk)?.label
      : `${sqft} sqft`;

  return (
    <div className="rounded-2xl border border-[oklch(0.78_0.02_95)] bg-[oklch(0.99_0.008_95)] p-6 shadow-[0_20px_50px_-28px_oklch(0.3_0.04_145/0.35)] sm:p-8">
      <div className="mb-6">
        <p className="text-xs font-semibold tracking-[0.18em] text-primary uppercase">
          {propertyType} rates
        </p>
        <h3 className="mt-2 font-display text-2xl text-foreground">Estimate your treatment</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          Same rate card as urbanpestmaster.com —{" "}
          {propertyType === "Residential" ? "priced by BHK" : "priced by square feet"}, then One
          Time, 1 Year, or 2 Year.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field label="Service">
          <Select value={service} onValueChange={(value) => setService(value as PricedServiceSlug)}>
            <SelectTrigger className="w-full bg-background">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {PRICED_SERVICES.map((item) => (
                <SelectItem key={item.slug} value={item.slug}>
                  {item.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>

        {propertyType === "Residential" ? (
          <Field label="Area">
            <Select value={bhk} onValueChange={(value) => setBhk(value as BhkValue)}>
              <SelectTrigger className="w-full bg-background">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {BHK_OPTIONS.map((item) => (
                  <SelectItem key={item.value} value={item.value}>
                    {item.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
        ) : (
          <Field label="Area">
            <Select
              value={String(sqft)}
              onValueChange={(value) => setSqft(Number.parseInt(value, 10))}
            >
              <SelectTrigger className="w-full bg-background">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {SQFT_OPTIONS.map((item) => (
                  <SelectItem key={item} value={String(item)}>
                    {item} sqft
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
        )}

        <Field label="Duration">
          <Select value={duration} onValueChange={(value) => setDuration(value as DurationValue)}>
            <SelectTrigger className="w-full bg-background">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {DURATION_OPTIONS.map((item) => (
                <SelectItem key={item.value} value={item.value}>
                  {item.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>

        <Field label="Pincode (optional)">
          <Input
            inputMode="numeric"
            placeholder="400101"
            value={pincode}
            onChange={(event) => setPincode(event.target.value)}
            className="bg-background"
          />
        </Field>
      </div>

      <div className="mt-6 flex flex-col gap-4 border-t border-[oklch(0.86_0.015_95)] pt-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs tracking-[0.16em] text-muted-foreground uppercase">
            Estimated price
          </p>
          <p className="mt-1 font-display text-4xl text-primary">{formatInr(price)}</p>
          <p className="mt-1 text-sm text-muted-foreground">
            {areaLabel} · {durationLabel}
          </p>
        </div>

        <QuoteDialog
          defaultPropertyType={propertyType}
          defaultService={service}
          defaultMessage={quoteMessage}
          defaultSource={source ?? `pricing:${propertyType.toLowerCase()}`}
          title="Book this treatment"
          description="We will confirm the visit on a call or WhatsApp. The estimate below uses the published rate card."
          trigger={<Button className="btn-primary w-full sm:w-auto">Book now</Button>}
        />
      </div>
    </div>
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
