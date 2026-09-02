export const SERVICE_STATUSES = [
  "Scheduled",
  "In progress",
  "Unscheduled",
  "Completed",
  "Redo required",
  "Reschedule required",
  "Expired",
] as const;

export const COMPLAINT_STATUSES = ["Unscheduled", "Scheduled", "In progress", "Resolved"] as const;
export const COMPLAINT_PRIORITIES = ["High", "Normal", "Low"] as const;
export const COMPLAINT_TYPES = [
  "Service quality",
  "Pest reappearance",
  "Agent behavior",
  "Late arrival",
] as const;

export const CONTRACT_STATUSES = ["Active", "Expiring Soon", "Expired"] as const;
export const PAYMENT_STATUSES = ["Paid", "Pending", "Overdue"] as const;
export const PAYMENT_FREQUENCIES = ["Monthly", "Quarterly", "Half-yearly", "Yearly"] as const;

export const USER_ROLES = ["admin", "salesperson", "agent", "customer"] as const;
export const INVOICE_STATUSES = ["Draft", "Issued", "Paid", "Overdue", "Void"] as const;
export const USER_STATUSES = ["active", "inactive", "pending"] as const;

export const LEAD_STATUSES = ["new", "contacted", "converted", "closed"] as const;
export const NOTIFICATION_STATUSES = ["Delivered", "Sending", "Scheduled"] as const;
export const NOTIFICATION_METHODS = ["Email", "SMS", "WhatsApp", "Push"] as const;

export const ROLE_LABELS = {
  admin: "Administrator",
  salesperson: "Sales Manager",
  agent: "Agent",
  customer: "Customer",
} as const;

export function roleFromLabel(label: string) {
  if (label === "Administrator") {
    return "admin";
  }
  if (label === "Sales Manager") {
    return "salesperson";
  }
  if (label === "Customer") {
    return "customer";
  }
  return "agent";
}

export function roleLabel(role: string) {
  if (role === "admin") {
    return ROLE_LABELS.admin;
  }
  if (role === "salesperson") {
    return ROLE_LABELS.salesperson;
  }
  if (role === "customer") {
    return ROLE_LABELS.customer;
  }
  return ROLE_LABELS.agent;
}

export function statusLabel(status: string) {
  if (status === "inactive") {
    return "Inactive";
  }
  if (status === "pending") {
    return "Pending";
  }
  return "Active";
}

export const DEFAULT_MAX_RESCHEDULES = 2;
export const INTERVAL_MIN_DAYS = 90;
export const INTERVAL_MAX_DAYS = 120;
export const CONTRACT_LOCK_DAYS = 151;
export const COMPLAINT_ADMIN_DELAY_DAYS = 2;
export const REDO_COOLDOWN_DAYS = 3;
export const AT_RISK_WINDOWS = [7, 15, 30] as const;
