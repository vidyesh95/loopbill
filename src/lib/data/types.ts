export type StaffRoleLabel = "Administrator" | "Sales Manager" | "Agent";

export interface StaffUserRow {
    id?: string;
    userId: number;
    name: string;
    email: string;
    phone: string;
    role: StaffRoleLabel;
    status: string;
    lastLogin: string;
    createdDate: string;
    department: string;
    permissions: string[];
}

export interface ServiceRow {
    id: number;
    customer: string;
    serviceType: string;
    date: string;
    agent: string;
    status: string;
    location: string;
    phone: string;
    amount: string;
}

export interface ComplaintRow {
    complaintId: number;
    customer: string;
    serviceId: number;
    complaintType: string;
    priority: string;
    status: string;
    date: string;
    action: string;
    issue?: string | null;
}

export interface ContractRow {
    contractId: number;
    customerName: string;
    customerAddress: string;
    serviceType: string;
    contractValue: number;
    paymentStatus: string;
    nextPayment: string;
    contractDate: string;
    expiryDate: string;
    status: string;
    paymentFrequency: string;
}

export interface NotificationRow {
    notificationId: number;
    subject: string;
    recipients: string;
    type: string;
    method: string;
    status: string;
    dateTime: string;
    actions: string;
}

export interface NotificationTemplateRow {
    id: number;
    cardTitle: string;
    cardDescription: string;
    subject: string;
    message: string;
}

export interface UpcomingServiceRow {
    id: number;
    customer: string;
    serviceType: string;
    date: string;
    agent: string;
}

export interface ServiceAtRiskRow {
    id: number;
    customer: string;
    package: string;
    nextService: string;
    daysLeft: string;
    status: string;
    action: string;
}

export interface PendingComplaintRow {
    id: number;
    customer: string;
    serviceDate: string;
    complaintDate: string;
    issue: string;
    validity: string;
}

export interface DashboardStats {
    totalPackages: number;
    activeServices: number;
    completedThisMonth: number;
    expiringSoon: number;
    pendingComplaints: number;
    highPriorityComplaints: number;
}

export interface AgentPerformanceRow {
    name: string;
    servicesCompleted: number;
    efficiency: number;
}

export interface ComplaintStatusRow {
    name: string;
    value: number;
    fill: string;
}

export interface ServiceTrendRow {
    month: string;
    services: number;
    revenue: number;
}
