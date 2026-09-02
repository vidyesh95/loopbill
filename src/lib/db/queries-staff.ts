import { and, desc, eq, inArray, isNotNull, ne, or } from "drizzle-orm";
import { db } from "@/lib/db";
import {
  complaint,
  contract,
  customer,
  lead,
  location,
  packageCatalog,
  rescheduleRequest,
  service,
  serviceProof,
  user,
} from "@/lib/db/schema";
import { complaintVisibleToAdmin, daysUntilLock } from "@/lib/lifecycle";

export type CustomerRecord = {
  id: number;
  name: string;
  phone: string;
  email: string;
  userId: string | null;
  salespersonId: string | null;
  salesperson: string;
  locationId: number | null;
  label: string;
  address: string;
  building: string;
  wing: string;
  flatNo: string;
};

export type JobRecord = {
  id: number;
  customerId: number;
  customer: string;
  phone: string;
  email: string;
  serviceType: string;
  date: string;
  scheduledAt: Date | null;
  agentId: string | null;
  agent: string;
  status: string;
  location: string;
  address: string;
  lat: string | null;
  lng: string | null;
  amount: number;
  serviceNumber: number;
  notes: string;
  completionNotes: string;
  rescheduleCount: number;
  absenceReportedAt: Date | null;
  contractId: number | null;
  proofs: string[];
};

export async function getCustomers(salespersonId?: string): Promise<CustomerRecord[]> {
  const rows = await db
    .select({
      id: customer.id,
      name: customer.name,
      phone: customer.phone,
      email: customer.email,
      userId: customer.userId,
      salespersonId: customer.salespersonId,
      salesperson: user.name,
      locationId: location.id,
      label: location.label,
      address: location.address,
      building: location.building,
      wing: location.wing,
      flatNo: location.flatNo,
    })
    .from(customer)
    .leftJoin(location, eq(location.customerId, customer.id))
    .leftJoin(user, eq(customer.salespersonId, user.id))
    .orderBy(customer.id);

  const seen = new Set<number>();
  return rows
    .filter((row) => {
      if (salespersonId && row.salespersonId !== salespersonId) {
        return false;
      }
      if (seen.has(row.id)) {
        return false;
      }
      seen.add(row.id);
      return true;
    })
    .map((row) => ({
      id: row.id,
      name: row.name,
      phone: row.phone ?? "",
      email: row.email ?? "",
      userId: row.userId,
      salespersonId: row.salespersonId,
      salesperson: row.salesperson ?? "Unassigned",
      locationId: row.locationId,
      label: row.label ?? "",
      address: row.address ?? "",
      building: row.building ?? "",
      wing: row.wing ?? "",
      flatNo: row.flatNo ?? "",
    }));
}

export async function getAgents() {
  return db
    .select({ id: user.id, name: user.name, status: user.status })
    .from(user)
    .where(and(eq(user.role, "agent"), eq(user.status, "active")));
}

export async function getPackages() {
  return db.select().from(packageCatalog).orderBy(packageCatalog.id);
}

function toJob(
  row: {
    id: number;
    customerId: number;
    customer: string;
    phone: string | null;
    email: string | null;
    serviceType: string;
    date: string;
    scheduledAt: Date | null;
    agentId: string | null;
    agent: string | null;
    status: string;
    location: string | null;
    address: string | null;
    lat: string | null;
    lng: string | null;
    amount: number;
    serviceNumber: number;
    notes: string | null;
    completionNotes: string | null;
    rescheduleCount: number;
    absenceReportedAt: Date | null;
    contractId: number | null;
  },
  proofs: string[],
): JobRecord {
  return {
    id: row.id,
    customerId: row.customerId,
    customer: row.customer,
    phone: row.phone ?? "",
    email: row.email ?? "",
    serviceType: row.serviceType,
    date: row.date,
    scheduledAt: row.scheduledAt,
    agentId: row.agentId,
    agent: row.agent ?? "Unassigned",
    status: row.status,
    location: row.location ?? "",
    address: row.address ?? row.location ?? "",
    lat: row.lat,
    lng: row.lng,
    amount: row.amount,
    serviceNumber: row.serviceNumber,
    notes: row.notes ?? "",
    completionNotes: row.completionNotes ?? "",
    rescheduleCount: row.rescheduleCount,
    absenceReportedAt: row.absenceReportedAt,
    contractId: row.contractId,
    proofs,
  };
}

export async function getJobs(filter?: {
  agentId?: string;
  salespersonId?: string;
  statuses?: string[];
}): Promise<JobRecord[]> {
  const rows = await db
    .select({
      id: service.id,
      customerId: service.customerId,
      customer: customer.name,
      phone: customer.phone,
      email: customer.email,
      serviceType: service.serviceType,
      date: service.date,
      scheduledAt: service.scheduledAt,
      agentId: service.agentId,
      agent: user.name,
      status: service.status,
      location: location.label,
      address: location.address,
      lat: location.lat,
      lng: location.lng,
      amount: service.amount,
      serviceNumber: service.serviceNumber,
      notes: service.notes,
      completionNotes: service.completionNotes,
      rescheduleCount: service.rescheduleCount,
      absenceReportedAt: service.absenceReportedAt,
      contractId: service.contractId,
      salespersonId: customer.salespersonId,
    })
    .from(service)
    .innerJoin(customer, eq(service.customerId, customer.id))
    .leftJoin(user, eq(service.agentId, user.id))
    .leftJoin(location, eq(service.locationId, location.id))
    .orderBy(desc(service.scheduledAt), service.id);

  const proofs = await db.select().from(serviceProof);
  const proofsByService = new Map<number, string[]>();
  for (const item of proofs) {
    const list = proofsByService.get(item.serviceId) ?? [];
    list.push(item.url);
    proofsByService.set(item.serviceId, list);
  }

  return rows
    .filter((row) => {
      if (filter?.agentId && row.agentId !== filter.agentId) {
        return false;
      }
      if (filter?.salespersonId && row.salespersonId !== filter.salespersonId) {
        return false;
      }
      if (filter?.statuses && !filter.statuses.includes(row.status)) {
        return false;
      }
      return true;
    })
    .map((row) => toJob(row, proofsByService.get(row.id) ?? []));
}

export async function getJobById(id: number, agentId?: string) {
  const jobs = await getJobs(agentId ? { agentId } : undefined);
  return jobs.find((job) => job.id === id) ?? null;
}

export async function getComplaintsForRole(role: string, salespersonId?: string) {
  const rows = await db
    .select({
      complaintId: complaint.id,
      customer: customer.name,
      customerId: complaint.customerId,
      serviceId: complaint.serviceId,
      complaintType: complaint.complaintType,
      priority: complaint.priority,
      status: complaint.status,
      date: complaint.date,
      action: complaint.action,
      issue: complaint.issue,
      visibleToAdminAt: complaint.visibleToAdminAt,
      attendedAt: complaint.attendedAt,
      redoServiceId: complaint.redoServiceId,
      salespersonId: customer.salespersonId,
    })
    .from(complaint)
    .innerJoin(customer, eq(complaint.customerId, customer.id))
    .orderBy(complaint.id);

  return rows
    .filter((row) => {
      if (salespersonId && row.salespersonId !== salespersonId) {
        return false;
      }
      if (role === "admin" && !complaintVisibleToAdmin(row.visibleToAdminAt)) {
        return false;
      }
      return true;
    })
    .map((row) => ({
      complaintId: row.complaintId,
      customer: row.customer,
      customerId: row.customerId,
      serviceId: row.serviceId,
      complaintType: row.complaintType,
      priority: row.priority,
      status: row.status,
      date: row.date,
      action: row.action ?? "Update status",
      issue: row.issue,
      attendedAt: row.attendedAt,
      redoServiceId: row.redoServiceId,
    }));
}

export async function getRescheduleQueue(salespersonId?: string) {
  const rows = await db
    .select({
      id: rescheduleRequest.id,
      serviceId: rescheduleRequest.serviceId,
      customerId: rescheduleRequest.customerId,
      customer: customer.name,
      phone: rescheduleRequest.phone,
      customerPhone: customer.phone,
      requestedDate: rescheduleRequest.requestedDate,
      reason: rescheduleRequest.reason,
      status: rescheduleRequest.status,
      source: rescheduleRequest.source,
      createdAt: rescheduleRequest.createdAt,
      serviceType: service.serviceType,
      currentDate: service.date,
      rescheduleCount: service.rescheduleCount,
      salespersonId: customer.salespersonId,
    })
    .from(rescheduleRequest)
    .leftJoin(customer, eq(rescheduleRequest.customerId, customer.id))
    .leftJoin(service, eq(rescheduleRequest.serviceId, service.id))
    .orderBy(desc(rescheduleRequest.createdAt));

  return rows.filter((row) => !salespersonId || row.salespersonId === salespersonId);
}

export async function getLeads() {
  return db.select().from(lead).orderBy(desc(lead.createdAt));
}

export async function getContractsAtRisk() {
  const rows = await db
    .select({
      id: contract.id,
      customer: customer.name,
      packageName: packageCatalog.name,
      status: contract.status,
      purchasedAt: contract.purchasedAt,
      locked: contract.locked,
    })
    .from(contract)
    .innerJoin(customer, eq(contract.customerId, customer.id))
    .leftJoin(packageCatalog, eq(contract.packageId, packageCatalog.id))
    .where(
      or(
        eq(contract.status, "Expiring Soon"),
        eq(contract.locked, true),
        eq(contract.status, "Active"),
      ),
    );

  const visits = await db.select().from(service).where(eq(service.status, "Completed"));
  return rows.map((row) => {
    const last = visits
      .filter((item) => item.contractId === row.id && item.completedAt)
      .sort((a, b) => (a.completedAt?.getTime() ?? 0) - (b.completedAt?.getTime() ?? 0))
      .at(-1);
    const daysLeft = daysUntilLock(last?.completedAt ?? row.purchasedAt);
    const critical = row.locked || (daysLeft !== null && daysLeft <= 7);
    return {
      id: row.id,
      customer: row.customer,
      package: row.packageName ?? "Package",
      nextService: last ? `Service ${(last.serviceNumber ?? 1) + 1}` : "1st Service",
      daysLeft: daysLeft === null ? "—" : `${Math.max(daysLeft, 0)} days`,
      status: critical ? "Critical" : "Warning",
      action: critical ? "Contact" : "Schedule",
    };
  });
}

export async function getRecentActivities(limit = 8) {
  const completed = await db
    .select({
      id: service.id,
      customer: customer.name,
      agent: user.name,
      serviceType: service.serviceType,
      at: service.completedAt,
    })
    .from(service)
    .innerJoin(customer, eq(service.customerId, customer.id))
    .leftJoin(user, eq(service.agentId, user.id))
    .where(eq(service.status, "Completed"))
    .orderBy(desc(service.completedAt))
    .limit(limit);

  const absences = await db
    .select({
      id: service.id,
      customer: customer.name,
      serviceType: service.serviceType,
      at: service.absenceReportedAt,
    })
    .from(service)
    .innerJoin(customer, eq(service.customerId, customer.id))
    .where(isNotNull(service.absenceReportedAt))
    .orderBy(desc(service.absenceReportedAt))
    .limit(limit);

  const complaints = await db
    .select({
      id: complaint.id,
      customer: customer.name,
      issue: complaint.issue,
      at: complaint.raisedAt,
    })
    .from(complaint)
    .innerJoin(customer, eq(complaint.customerId, customer.id))
    .orderBy(desc(complaint.raisedAt))
    .limit(limit);

  const items = [
    ...completed.map((row) => ({
      kind: "completed" as const,
      title: `Service #${row.id} completed`,
      detail: `${row.agent ?? "Agent"} completed ${row.serviceType} at ${row.customer}'s location`,
      at: row.at,
    })),
    ...absences.map((row) => ({
      kind: "absence" as const,
      title: "Reschedule requested",
      detail: `Customer unavailable for Service #${row.id} (${row.serviceType})`,
      at: row.at,
    })),
    ...complaints.map((row) => ({
      kind: "complaint" as const,
      title: "New complaint received",
      detail: row.issue ?? `Complaint #${row.id} from ${row.customer}`,
      at: row.at,
    })),
  ]
    .filter((item) => item.at)
    .sort((a, b) => (b.at?.getTime() ?? 0) - (a.at?.getTime() ?? 0))
    .slice(0, limit);

  return items;
}

export async function getLookups() {
  const [customers, agents, packages] = await Promise.all([
    db
      .select({ id: customer.id, name: customer.name, phone: customer.phone })
      .from(customer)
      .orderBy(customer.name),
    getAgents(),
    getPackages(),
  ]);
  return { customers, agents, packages };
}

export { ne, inArray };
