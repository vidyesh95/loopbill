import { and, count, eq, inArray, ne, sql } from "drizzle-orm";
import { db } from "@/lib/db";
import {
  complaint,
  contract,
  customer,
  location,
  notification,
  notificationTemplate,
  service,
  user,
  userPermission,
} from "@/lib/db/schema";
import type {
  AgentPerformanceRow,
  ComplaintRow,
  ComplaintStatusRow,
  ContractRow,
  DashboardStats,
  NotificationRow,
  NotificationTemplateRow,
  PendingComplaintRow,
  ServiceAtRiskRow,
  ServiceRow,
  ServiceTrendRow,
  StaffUserRow,
  UpcomingServiceRow,
} from "@/lib/data/types";

function roleLabel(role: string) {
  if (role === "admin") {
    return "Administrator";
  }
  if (role === "salesperson") {
    return "Sales Manager";
  }
  return "Agent";
}

function statusLabel(status: string) {
  if (status === "inactive") {
    return "Inactive";
  }
  if (status === "pending") {
    return "Pending";
  }
  return "Active";
}

function rupees(amount: number) {
  return `₹${amount.toLocaleString("en-IN")}`;
}

export async function getStaffUsers(): Promise<StaffUserRow[]> {
  const rows = await db.select().from(user).orderBy(user.createdAt);
  const permissionRows = await db.select().from(userPermission);

  return rows.map((row, index) => {
    const permissionIds = permissionRows
      .filter((item) => item.userId === row.id)
      .map((item) => item.permissionId);
    return {
      id: row.id,
      userId: index + 1,
      name: row.name,
      email: row.email,
      phone: row.phone ?? "",
      role: roleLabel(row.role),
      status: statusLabel(row.status),
      lastLogin: "Never",
      createdDate: row.createdAt.toISOString().slice(0, 10),
      department: row.department ?? "",
      permissions: permissionIds.length > 0 ? permissionIds : ["dashboard"],
    };
  });
}

export async function getServices(): Promise<ServiceRow[]> {
  const rows = await db
    .select({
      id: service.id,
      customer: customer.name,
      serviceType: service.serviceType,
      date: service.date,
      agent: user.name,
      status: service.status,
      location: location.label,
      phone: customer.phone,
      amount: service.amount,
    })
    .from(service)
    .innerJoin(customer, eq(service.customerId, customer.id))
    .leftJoin(user, eq(service.agentId, user.id))
    .leftJoin(location, eq(service.locationId, location.id))
    .orderBy(service.id);

  return rows.map((row) => ({
    id: row.id,
    customer: row.customer,
    serviceType: row.serviceType,
    date: row.date,
    agent: row.agent ?? "Unassigned",
    status: row.status,
    location: row.location ?? "",
    phone: row.phone ?? "",
    amount: rupees(row.amount),
  }));
}

export async function getComplaints(): Promise<ComplaintRow[]> {
  const rows = await db
    .select({
      complaintId: complaint.id,
      customer: customer.name,
      serviceId: complaint.serviceId,
      complaintType: complaint.complaintType,
      priority: complaint.priority,
      status: complaint.status,
      date: complaint.date,
      action: complaint.action,
      issue: complaint.issue,
    })
    .from(complaint)
    .innerJoin(customer, eq(complaint.customerId, customer.id))
    .orderBy(complaint.id);

  return rows.map((row) => ({
    ...row,
    action: row.action ?? "Update status",
  }));
}

export async function getContracts(): Promise<ContractRow[]> {
  const rows = await db
    .select({
      contractId: contract.id,
      customerName: customer.name,
      customerAddress: location.address,
      locationLabel: location.label,
      serviceType: contract.serviceType,
      contractValue: contract.contractValue,
      paymentStatus: contract.paymentStatus,
      nextPayment: contract.nextPayment,
      contractDate: contract.contractDate,
      expiryDate: contract.expiryDate,
      status: contract.status,
      paymentFrequency: contract.paymentFrequency,
    })
    .from(contract)
    .innerJoin(customer, eq(contract.customerId, customer.id))
    .leftJoin(location, eq(contract.locationId, location.id))
    .orderBy(contract.id);

  return rows.map((row) => ({
    contractId: row.contractId,
    customerName: row.customerName,
    customerAddress: row.customerAddress ?? row.locationLabel ?? "",
    serviceType: row.serviceType,
    contractValue: row.contractValue,
    paymentStatus: row.paymentStatus,
    nextPayment: row.nextPayment ?? "",
    contractDate: row.contractDate,
    expiryDate: row.expiryDate,
    status: row.status,
    paymentFrequency: row.paymentFrequency,
  }));
}

export async function getNotifications(): Promise<NotificationRow[]> {
  const rows = await db.select().from(notification).orderBy(notification.id);
  return rows.map((row) => ({
    notificationId: row.id,
    subject: row.subject,
    recipients: row.recipients,
    type: row.type,
    method: row.method,
    status: row.status,
    dateTime: row.dateTime,
    actions: row.actions,
  }));
}

export async function getNotificationTemplates(): Promise<NotificationTemplateRow[]> {
  return db.select().from(notificationTemplate).orderBy(notificationTemplate.id);
}

export async function getDashboardStats(): Promise<DashboardStats> {
  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).getTime();
  const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 1).getTime();

  const [packages] = await db.select({ value: count() }).from(contract);
  const [active] = await db
    .select({ value: count() })
    .from(service)
    .where(inArray(service.status, ["Scheduled", "In progress", "Unscheduled"]));
  const [completed] = await db
    .select({ value: count() })
    .from(service)
    .where(
      and(
        eq(service.status, "Completed"),
        sql`${service.scheduledAt} >= ${monthStart} and ${service.scheduledAt} < ${monthEnd}`,
      ),
    );
  const [expiring] = await db
    .select({ value: count() })
    .from(contract)
    .where(eq(contract.status, "Expiring Soon"));
  const [pending] = await db
    .select({ value: count() })
    .from(complaint)
    .where(ne(complaint.status, "Resolved"));
  const [highPriority] = await db
    .select({ value: count() })
    .from(complaint)
    .where(and(ne(complaint.status, "Resolved"), eq(complaint.priority, "High")));

  return {
    totalPackages: packages.value,
    activeServices: active.value,
    completedThisMonth: completed.value,
    expiringSoon: expiring.value,
    pendingComplaints: pending.value,
    highPriorityComplaints: highPriority.value,
  };
}

export async function getUpcomingServices(limit = 6): Promise<UpcomingServiceRow[]> {
  const rows = await db
    .select({
      id: service.id,
      customer: customer.name,
      serviceType: service.serviceType,
      date: service.date,
      agent: user.name,
    })
    .from(service)
    .innerJoin(customer, eq(service.customerId, customer.id))
    .leftJoin(user, eq(service.agentId, user.id))
    .where(inArray(service.status, ["Scheduled", "In progress", "Unscheduled"]))
    .orderBy(service.id)
    .limit(limit);

  return rows.map((row) => ({
    ...row,
    agent: row.agent ?? "Unassigned",
  }));
}

export async function getServicesAtRisk(limit = 6): Promise<ServiceAtRiskRow[]> {
  const { getContractsAtRisk } = await import("@/lib/db/queries-staff");
  const rows = await getContractsAtRisk();
  return rows.slice(0, limit);
}

export async function getPendingComplaints(limit = 6): Promise<PendingComplaintRow[]> {
  const rows = await db
    .select({
      id: complaint.id,
      customer: customer.name,
      serviceDate: service.date,
      complaintDate: complaint.date,
      issue: complaint.issue,
      priority: complaint.priority,
    })
    .from(complaint)
    .innerJoin(customer, eq(complaint.customerId, customer.id))
    .innerJoin(service, eq(complaint.serviceId, service.id))
    .where(ne(complaint.status, "Resolved"))
    .orderBy(complaint.id)
    .limit(limit);

  return rows.map((row) => ({
    id: row.id,
    customer: row.customer,
    serviceDate: row.serviceDate,
    complaintDate: row.complaintDate,
    issue: row.issue ?? row.priority,
    validity: row.priority === "Low" ? "Invalid" : "Valid",
  }));
}

export async function getAgentPerformance(): Promise<AgentPerformanceRow[]> {
  const rows = await db
    .select({
      name: user.name,
      status: service.status,
    })
    .from(service)
    .innerJoin(user, eq(service.agentId, user.id));

  const byAgent = new Map<string, { completed: number; assigned: number }>();
  for (const row of rows) {
    const current = byAgent.get(row.name) ?? { completed: 0, assigned: 0 };
    current.assigned += 1;
    if (row.status === "Completed") {
      current.completed += 1;
    }
    byAgent.set(row.name, current);
  }

  return [...byAgent.entries()]
    .map(([name, stats]) => ({
      name,
      servicesCompleted: stats.completed,
      efficiency: stats.assigned === 0 ? 0 : Math.round((stats.completed / stats.assigned) * 100),
    }))
    .sort((a, b) => b.servicesCompleted - a.servicesCompleted)
    .slice(0, 6);
}

export async function getComplaintStatusBreakdown(): Promise<ComplaintStatusRow[]> {
  const rows = await db
    .select({
      status: complaint.status,
      value: count(),
    })
    .from(complaint)
    .groupBy(complaint.status);

  const colors: Record<string, string> = {
    Unscheduled: "oklch(63.7% 0.237 25.331)",
    Scheduled: "oklch(79.5% 0.184 86.047)",
    "In progress": "oklch(62.3% 0.214 259.815)",
    Resolved: "oklch(72.3% 0.219 149.579)",
  };

  return rows.map((row) => ({
    name: row.status,
    value: row.value,
    fill: colors[row.status] ?? "oklch(0.552 0.016 285.938)",
  }));
}

export async function getServiceTrends(): Promise<ServiceTrendRow[]> {
  const rows = await db
    .select({
      scheduledAt: service.scheduledAt,
      amount: service.amount,
    })
    .from(service);

  const buckets = new Map<string, { services: number; revenue: number; order: number }>();
  for (const row of rows) {
    const date = row.scheduledAt ?? new Date();
    const key = date.toLocaleString("en-US", { month: "short" });
    const order = date.getFullYear() * 12 + date.getMonth();
    const current = buckets.get(key) ?? { services: 0, revenue: 0, order };
    current.services += 1;
    current.revenue += row.amount;
    buckets.set(key, current);
  }

  return [...buckets.entries()]
    .sort((a, b) => a[1].order - b[1].order)
    .map(([month, stats]) => ({
      month,
      services: stats.services,
      revenue: stats.revenue,
    }));
}
