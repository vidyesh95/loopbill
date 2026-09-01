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
});

export const location = sqliteTable("location", {
    id: integer("id").primaryKey({autoIncrement: true}),
    customerId: integer("customer_id")
        .notNull()
        .references(() => customer.id, {onDelete: "cascade"}),
    label: text("label").notNull(),
    address: text("address"),
});

export const contract = sqliteTable("contract", {
    id: integer("id").primaryKey({autoIncrement: true}),
    customerId: integer("customer_id")
        .notNull()
        .references(() => customer.id, {onDelete: "cascade"}),
    locationId: integer("location_id").references(() => location.id, {onDelete: "set null"}),
    packageId: integer("package_id").references(() => packageCatalog.id, {onDelete: "set null"}),
    serviceType: text("service_type").notNull(),
    contractValue: integer("contract_value").notNull(),
    paymentStatus: text("payment_status").notNull(),
    paymentFrequency: text("payment_frequency").notNull(),
    nextPayment: text("next_payment"),
    contractDate: text("contract_date").notNull(),
    expiryDate: text("expiry_date").notNull(),
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
