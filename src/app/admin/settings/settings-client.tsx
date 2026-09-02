"use client";

import {useState} from "react";
import {useRouter} from "next/navigation";
import {toast} from "sonner";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import {Textarea} from "@/components/ui/textarea";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs";
import {runDailyJobsAction, updateAppSettings, updateCompanySettings} from "@/lib/actions/settings";
import {formString} from "@/lib/utils";

type Branch = {id?: number; name: string; address: string};

export default function SettingsClient({
    company,
    branches,
    remindersEnabled,
    maxReschedules,
    officeHours,
}: {
    company: {name: string; address: string; email: string; phone: string};
    branches: Branch[];
    remindersEnabled: boolean;
    maxReschedules: number;
    officeHours: string;
}) {
    const router = useRouter();
    const [localBranches, setLocalBranches] = useState(branches);

    return (
        <main className="flex w-full flex-col gap-4">
            <div>
                <h1 className="text-2xl font-bold md:text-3xl">Settings</h1>
                <p className="text-muted-foreground">Company, reminders, and daily jobs</p>
            </div>
            <Tabs defaultValue="company">
                <TabsList className="w-full">
                    <TabsTrigger value="company">Company</TabsTrigger>
                    <TabsTrigger value="notifications">Notifications</TabsTrigger>
                    <TabsTrigger value="jobs">Daily jobs</TabsTrigger>
                </TabsList>
                <TabsContent value="company">
                    <form
                        className="max-w-2xl space-y-3"
                        action={async (formData) => {
                            const result = await updateCompanySettings({
                                name: formString(formData, "name"),
                                address: formString(formData, "address"),
                                email: formString(formData, "email"),
                                phone: formString(formData, "phone"),
                                branches: localBranches,
                            });
                            if (!result.ok) {
                                toast.error(result.error);
                                return;
                            }
                            toast.success("Company saved");
                            router.refresh();
                        }}
                    >
                        <Field label="Company name">
                            <Input name="name" defaultValue={company.name} required />
                        </Field>
                        <Field label="Address">
                            <Textarea name="address" defaultValue={company.address} />
                        </Field>
                        <Field label="Email">
                            <Input name="email" type="email" defaultValue={company.email} />
                        </Field>
                        <Field label="Phone">
                            <Input name="phone" defaultValue={company.phone} />
                        </Field>
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <Label>Branches</Label>
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => setLocalBranches([...localBranches, {name: "", address: ""}])}
                                >
                                    Add branch
                                </Button>
                            </div>
                            {localBranches.map((item, index) => (
                                <div key={`${item.id ?? "new"}-${index}`} className="grid gap-2 rounded-md border p-3 md:grid-cols-2">
                                    <Input
                                        placeholder="Branch name"
                                        value={item.name}
                                        onChange={(event) => {
                                            const next = [...localBranches];
                                            next[index] = {...item, name: event.target.value};
                                            setLocalBranches(next);
                                        }}
                                    />
                                    <Input
                                        placeholder="Address"
                                        value={item.address}
                                        onChange={(event) => {
                                            const next = [...localBranches];
                                            next[index] = {...item, address: event.target.value};
                                            setLocalBranches(next);
                                        }}
                                    />
                                </div>
                            ))}
                        </div>
                        <Button type="submit">Save company</Button>
                    </form>
                </TabsContent>
                <TabsContent value="notifications">
                    <form
                        className="max-w-xl space-y-3"
                        action={async (formData) => {
                            const result = await updateAppSettings({
                                remindersEnabled: formData.get("remindersEnabled") === "on",
                                maxReschedules: Number(formData.get("maxReschedules") || 2),
                                officeHours: formString(formData, "officeHours"),
                            });
                            if (!result.ok) {
                                toast.error(result.error);
                                return;
                            }
                            toast.success("Notification settings saved");
                            router.refresh();
                        }}
                    >
                        <label className="flex items-center gap-2 text-sm">
                            <input type="checkbox" name="remindersEnabled" defaultChecked={remindersEnabled} />
                            Enable Day 90 / 120 / 151 reminders
                        </label>
                        <Field label="Max reschedules per service">
                            <Input name="maxReschedules" type="number" defaultValue={maxReschedules} />
                        </Field>
                        <Field label="Office hours">
                            <Input name="officeHours" defaultValue={officeHours} />
                        </Field>
                        <Button type="submit">Save settings</Button>
                    </form>
                </TabsContent>
                <TabsContent value="jobs">
                    <p className="mb-3 text-sm text-muted-foreground">
                        Runs expiry locks, complaint visibility, and reminder placeholders. Same as `pnpm db:tick`.
                    </p>
                    <Button
                        onClick={async () => {
                            const result = await runDailyJobsAction();
                            if (!result.ok) {
                                toast.error(result.error);
                                return;
                            }
                            toast.success(
                                `Tick done. reminders=${result.data.reminders} locked=${result.data.lockedContracts} complaints=${result.data.visibleComplaints}`,
                            );
                            router.refresh();
                        }}
                    >
                        Run daily jobs
                    </Button>
                </TabsContent>
            </Tabs>
        </main>
    );
}

function Field({label, children}: {label: string; children: React.ReactNode}) {
    return (
        <div className="space-y-1">
            <Label>{label}</Label>
            {children}
        </div>
    );
}
