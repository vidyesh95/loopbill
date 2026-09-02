"use client";

import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { HandPlatter, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm } from "react-hook-form";
import { z } from "zod/v4";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// A single service block
const singleServiceSchema = z.object({
  serviceName: z
    .string()
    .trim()
    .min(1, "Service name is required")
    .max(100, "Service name must be less than 100 characters"),
  durationType: z.enum(["one-time", "one-year", "two-years"], { error: "Select a duration type" }),
  pricePer100SqFt: z.coerce
    .number({ error: "Must be a number" })
    .gt(0, "Price per 100 SqFt must be greater than zero"),
  deliveryChargePerKm: z.coerce
    .number({ error: "Must be a number" })
    .nonnegative("Value cannot be negative"),
  serviceStatus: z.enum(["active", "inactive"], { error: "Select a service status" }),
});

// Schema for the entire service configuration form with an array of services
const serviceConfigurationSchema = z.object({
  services: z.array(singleServiceSchema),
});

// Types from schema
type ServiceFormInput = z.input<typeof serviceConfigurationSchema>; // // raw (unknown numbers)
type ServiceFormOutput = z.output<typeof serviceConfigurationSchema>; // parsed (real numbers)

// Default values for the form
const defaultService: ServiceFormOutput["services"][0] = {
  serviceName: "",
  durationType: "one-time",
  pricePer100SqFt: 0,
  deliveryChargePerKm: 0,
  serviceStatus: "active",
};

// RHF setup
export default function ServiceConfiguration() {
  const form = useForm<ServiceFormInput, unknown, ServiceFormOutput>({
    resolver: zodResolver(serviceConfigurationSchema),
    defaultValues: {
      services: [defaultService],
    },
  });

  const { fields, append, remove } = useFieldArray({ control: form.control, name: "services" });

  // Submit handler
  function onSubmit(values: ServiceFormOutput) {
    console.log(values);
    // Here you can:
    // - Update component state
    // - Make API calls
    // - Show success/error messages
    // - Navigate to another page
    // - Access other component methods/state
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <Card>
          <CardHeader>
            <CardTitle className={"flex gap-1"}>
              <HandPlatter size={18} color={"oklch(65.6% 0.241 354.308)"} />
              Service configuration
            </CardTitle>
            <CardDescription>Configure service types and pricing</CardDescription>
          </CardHeader>
          <CardContent>
            <div className={"flex flex-row justify-between"}>
              <h4 className={"mt-4 font-semibold text-pink-500"}>Services</h4>
              <Button
                variant={"outline"}
                type={"button"}
                className={"cursor-pointer"}
                onClick={() => append({ ...defaultService })}
              >
                <Plus />
                Add service
              </Button>
            </div>
            <hr className={"my-4"} />
            <section className={"space-y-4"}>
              {fields.length === 0 ? (
                <div className={"py-8 text-center text-gray-500"}>
                  <HandPlatter size={48} className={"mx-auto mb-4 opacity-50"} />
                  <p className={"mb-2 text-lg font-medium"}>No services configured</p>
                  <p className={"text-sm"}>Add your first service to get started</p>
                </div>
              ) : (
                fields.map((field, index) => (
                  <Card key={field.id}>
                    <CardHeader>
                      <CardTitle className={"text-pink-500"}>Service&nbsp;{index + 1}</CardTitle>
                      <CardAction>
                        <Button
                          variant={"outline"}
                          type={"button"}
                          className={"cursor-pointer"}
                          onClick={() => remove(index)}
                        >
                          <Trash2 color={"oklch(63.7% 0.237 25.331)"} />
                        </Button>
                      </CardAction>
                    </CardHeader>
                    <CardContent className={"grid grid-cols-1 gap-4 md:grid-cols-2"}>
                      <FormField
                        control={form.control}
                        name={`services.${index}.serviceName`}
                        render={({ field }) => (
                          <FormItem className={"space-y-2"}>
                            <FormLabel htmlFor={`service-name-${index}`}>Service name</FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                id={`service-name-${index}`}
                                type={"text"}
                                placeholder={"Service name"}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name={`services.${index}.durationType`}
                        render={({ field }) => (
                          <FormItem className={"space-y-2"}>
                            <FormLabel htmlFor={`service-duration-type-${index}`}>
                              Service duration type
                            </FormLabel>
                            <Select defaultValue={field.value} onValueChange={field.onChange}>
                              <FormControl>
                                <SelectTrigger
                                  id={`service-duration-type-${index}`}
                                  className="w-full cursor-pointer"
                                >
                                  <SelectValue placeholder="Service duration type" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="one-time">One time</SelectItem>
                                <SelectItem value="one-year">1 Year</SelectItem>
                                <SelectItem value="two-years">2 Years</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name={`services.${index}.pricePer100SqFt`}
                        render={({ field }) => (
                          <FormItem className={"space-y-2"}>
                            <FormLabel htmlFor={`price-per-100sqft-${index}`}>
                              Price per 100 Square Feet(₹)
                            </FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                value={field.value as number}
                                id={`price-per-100sqft-${index}`}
                                type={"number"}
                                placeholder={"Price per 100 Square Feet(₹)"}
                                onChange={(event) =>
                                  field.onChange(Number(event.target.valueAsNumber))
                                }
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name={`services.${index}.deliveryChargePerKm`}
                        render={({ field }) => (
                          <FormItem className={"space-y-2"}>
                            <FormLabel htmlFor={`delivery-charge-per-km-${index}`}>
                              Delivery charge per Km(₹)
                            </FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                value={field.value as number}
                                id={`delivery-charge-per-km-${index}`}
                                type={"number"}
                                placeholder={"Delivery charge per Km(₹)"}
                                onChange={(event) =>
                                  field.onChange(Number(event.target.valueAsNumber))
                                }
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name={`services.${index}.serviceStatus`}
                        render={({ field }) => (
                          <FormItem className={"space-y-2"}>
                            <FormLabel htmlFor={`service-status-${index}`}>
                              Service status
                            </FormLabel>
                            <Select defaultValue={field.value} onValueChange={field.onChange}>
                              <FormControl>
                                <SelectTrigger
                                  id={`service-status-${index}`}
                                  className="w-full cursor-pointer"
                                >
                                  <SelectValue placeholder="Service status" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="active">Active</SelectItem>
                                <SelectItem value="inactive">Inactive</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </CardContent>
                  </Card>
                ))
              )}
            </section>
          </CardContent>
          <CardFooter>
            <Button type={"submit"} className={"w-full cursor-pointer"}>
              Save changes
            </Button>
          </CardFooter>
        </Card>
      </form>
    </Form>
  );
}
