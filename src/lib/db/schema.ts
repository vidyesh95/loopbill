import {integer, sqliteTable, text, uniqueIndex} from "drizzle-orm/sqlite-core";

export const user = sqliteTable("user", {
    id: text("id").primaryKey(),
    name: text("name").notNull(),
    email: text("email").notNull().unique(),
    emailVerified: integer("email_verified", {mode: "boolean"}).notNull().default(false),
    image: text("image"),
    createdAt: integer("created_at", {mode: "timestamp_ms"}).notNull(),
    updatedAt: integer("updated_at", {mode: "timestamp_ms"}).notNull(),
    role: text("role").notNull().default("agent"),
    phone: text("phone"),
    department: text("department"),
    status: text("status").notNull().default("active"),
});

export const session = sqliteTable("session", {
    id: text("id").primaryKey(),
    expiresAt: integer("expires_at", {mode: "timestamp_ms"}).notNull(),
    token: text("token").notNull().unique(),
    createdAt: integer("created_at", {mode: "timestamp_ms"}).notNull(),
    updatedAt: integer("updated_at", {mode: "timestamp_ms"}).notNull(),
    ipAddress: text("ip_address"),
    userAgent: text("user_agent"),
    userId: text("user_id")
        .notNull()
        .references(() => user.id, {onDelete: "cascade"}),
});

export const account = sqliteTable("account", {
    id: text("id").primaryKey(),
    accountId: text("account_id").notNull(),
    providerId: text("provider_id").notNull(),
    issuer: text("issuer"),
    userId: text("user_id")
        .notNull()
        .references(() => user.id, {onDelete: "cascade"}),
    accessToken: text("access_token"),
    refreshToken: text("refresh_token"),
    idToken: text("id_token"),
    accessTokenExpiresAt: integer("access_token_expires_at", {mode: "timestamp_ms"}),
    refreshTokenExpiresAt: integer("refresh_token_expires_at", {mode: "timestamp_ms"}),
    scope: text("scope"),
    password: text("password"),
    createdAt: integer("created_at", {mode: "timestamp_ms"}).notNull(),
    updatedAt: integer("updated_at", {mode: "timestamp_ms"}).notNull(),
});

export const verification = sqliteTable("verification", {
    id: text("id").primaryKey(),
    identifier: text("identifier").notNull(),
    value: text("value").notNull(),
    expiresAt: integer("expires_at", {mode: "timestamp_ms"}).notNull(),
    createdAt: integer("created_at", {mode: "timestamp_ms"}).notNull(),
    updatedAt: integer("updated_at", {mode: "timestamp_ms"}).notNull(),
});

export const permission = sqliteTable("permission", {
    id: text("id").primaryKey(),
    name: text("name").notNull(),
    description: text("description").notNull(),
});

export const userPermission = sqliteTable(
    "user_permission",
    {
        userId: text("user_id")
            .notNull()
            .references(() => user.id, {onDelete: "cascade"}),
        permissionId: text("permission_id")
            .notNull()
            .references(() => permission.id, {onDelete: "cascade"}),
    },
    (table) => [uniqueIndex("user_permission_unique").on(table.userId, table.permissionId)],
);

export const company = sqliteTable("company", {
    id: integer("id").primaryKey({autoIncrement: true}),
    name: text("name").notNull(),
    address: text("address"),
    email: text("email"),
    phone: text("phone"),
});

export const branch = sqliteTable("branch", {
    id: integer("id").primaryKey({autoIncrement: true}),
    companyId: integer("company_id")
        .notNull()
        .references(() => company.id, {onDelete: "cascade"}),
    name: text("name").notNull(),
    address: text("address").notNull(),
});

export const serviceType = sqliteTable("service_type", {
    id: integer("id").primaryKey({autoIncrement: true}),
    name: text("name").notNull().unique(),
});

export const packageCatalog = sqliteTable("package", {
    id: integer("id").primaryKey({autoIncrement: true}),
    name: text("name").notNull().unique(),
    price: text("price"),
    description: text("description"),
});

export const customer = sqliteTable("customer", {
    id: integer("id").primaryKey({autoIncrement: true}),
    name: text("name").notNull(),
    phone: text("phone"),
    email: text("email"),
    salespersonId: text("salesperson_id").references(() => user.id, {onDelete: "set null"}),
});

export const location = sqliteTable("location", {
    id: integer("id").primaryKey({autoIncrement: true}),
    customerId: integer("customer_id")
        .notNull()
        .references(() => customer.id, {onDelete: "cascade"}),
    label: text("label").notNull(),
    address: text("address"),
    building: text("building"),
    wing: text("wing"),
    flatNo: text("flat_no"),
});

export const contract = sqliteTable("contract", {
    id: integer("id").primaryKey({autoIncrement: true}),
    customerId: integer("customer_id")
        .notNull()
        .references(() => customer.id, {onDelete: "cascade"}),
    locationId: integer("location_id").references(() => location.id, {onDelete: "set null"}),
    packageId: integer("package_id").references(() => packageCatalog.id, {onDelete: "set null"}),
    salespersonId: text("salesperson_id").references(() => user.id, {onDelete: "set null"}),
    serviceType: text("service_type").notNull(),
    contractValue: integer("contract_value").notNull(),
    paymentStatus: text("payment_status").notNull(),
    paymentFrequency: text("payment_frequency").notNull(),
    nextPayment: text("next_payment"),
    contractDate: text("contract_date").notNull(),
    expiryDate: text("expiry_date").notNull(),
    purchasedAt: integer("purchased_at", {mode: "timestamp_ms"}),
    locked: integer("locked", {mode: "boolean"}).notNull().default(false),
    rescheduleFlags: integer("reschedule_flags").notNull().default(0),
    status: text("status").notNull(),
});

export const service = sqliteTable("service", {
    id: integer("id").primaryKey({autoIncrement: true}),
    contractId: integer("contract_id").references(() => contract.id, {onDelete: "set null"}),
    customerId: integer("customer_id")
        .notNull()
        .references(() => customer.id, {onDelete: "cascade"}),
    locationId: integer("location_id").references(() => location.id, {onDelete: "set null"}),
    serviceType: text("service_type").notNull(),
    date: text("date").notNull(),
    scheduledAt: integer("scheduled_at", {mode: "timestamp_ms"}),
    agentId: text("agent_id").references(() => user.id, {onDelete: "set null"}),
    status: text("status").notNull(),
    amount: integer("amount").notNull().default(0),
    serviceNumber: integer("service_number").notNull().default(1),
    notes: text("notes"),
    completionNotes: text("completion_notes"),
    completedAt: integer("completed_at", {mode: "timestamp_ms"}),
    rescheduleCount: integer("reschedule_count").notNull().default(0),
    absenceReportedAt: integer("absence_reported_at", {mode: "timestamp_ms"}),
    redoOfServiceId: integer("redo_of_service_id"),
});

export const complaint = sqliteTable("complaint", {
    id: integer("id").primaryKey({autoIncrement: true}),
    serviceId: integer("service_id")
        .notNull()
        .references(() => service.id, {onDelete: "cascade"}),
    customerId: integer("customer_id")
        .notNull()
        .references(() => customer.id, {onDelete: "cascade"}),
    complaintType: text("complaint_type").notNull(),
    priority: text("priority").notNull(),
    status: text("status").notNull(),
    date: text("date").notNull(),
    issue: text("issue"),
    action: text("action"),
    raisedAt: integer("raised_at", {mode: "timestamp_ms"}),
    visibleToAdminAt: integer("visible_to_admin_at", {mode: "timestamp_ms"}),
    attendedAt: integer("attended_at", {mode: "timestamp_ms"}),
    redoServiceId: integer("redo_service_id"),
});

export const notificationTemplate = sqliteTable("notification_template", {
    id: integer("id").primaryKey({autoIncrement: true}),
    cardTitle: text("card_title").notNull(),
    cardDescription: text("card_description").notNull(),
    subject: text("subject").notNull(),
    message: text("message").notNull(),
});

export const notification = sqliteTable("notification", {
    id: integer("id").primaryKey({autoIncrement: true}),
    subject: text("subject").notNull(),
    recipients: text("recipients").notNull(),
    type: text("type").notNull(),
    method: text("method").notNull(),
    status: text("status").notNull(),
    dateTime: text("date_time").notNull(),
    actions: text("actions").notNull(),
});

export const lead = sqliteTable("lead", {
    id: integer("id").primaryKey({autoIncrement: true}),
    name: text("name").notNull(),
    email: text("email").notNull(),
    phone: text("phone").notNull(),
    propertyType: text("property_type").notNull(),
    service: text("service").notNull(),
    message: text("message").notNull(),
    source: text("source").notNull(),
    status: text("status").notNull().default("new"),
    createdAt: integer("created_at", {mode: "timestamp_ms"}).notNull(),
});

export const serviceProof = sqliteTable("service_proof", {
    id: integer("id").primaryKey({autoIncrement: true}),
    serviceId: integer("service_id")
        .notNull()
        .references(() => service.id, {onDelete: "cascade"}),
    url: text("url").notNull(),
    createdAt: integer("created_at", {mode: "timestamp_ms"}).notNull(),
});

export const appSetting = sqliteTable("app_setting", {
    key: text("key").primaryKey(),
    value: text("value").notNull(),
});

export const rescheduleRequest = sqliteTable("reschedule_request", {
    id: integer("id").primaryKey({autoIncrement: true}),
    serviceId: integer("service_id").references(() => service.id, {onDelete: "set null"}),
    customerId: integer("customer_id").references(() => customer.id, {onDelete: "set null"}),
    phone: text("phone"),
    requestedDate: text("requested_date"),
    reason: text("reason"),
    status: text("status").notNull().default("pending"),
    source: text("source").notNull(),
    createdAt: integer("created_at", {mode: "timestamp_ms"}).notNull(),
});

export const siteService = sqliteTable("site_service", {
    id: integer("id").primaryKey({autoIncrement: true}),
    slug: text("slug").notNull().unique(),
    title: text("title").notNull(),
    category: text("category").notNull(),
    summary: text("summary").notNull(),
    details: text("details").notNull(),
    sort: integer("sort").notNull().default(0),
    published: integer("published", {mode: "boolean"}).notNull().default(true),
});

export const sitePricing = sqliteTable("site_pricing", {
    id: integer("id").primaryKey({autoIncrement: true}),
    slug: text("slug").notNull().unique(),
    label: text("label").notNull(),
    residentialBase: integer("residential_base").notNull(),
    commercialPerSqft: integer("commercial_per_sqft").notNull(),
    multipliers: text("multipliers"),
});

export const siteContent = sqliteTable("site_content", {
    key: text("key").primaryKey(),
    value: text("value").notNull(),
});
