import {config} from "dotenv";
import {createLocalAccountIssuer} from "better-auth/db";
import {hashPassword} from "better-auth/crypto";

config({path: ".env.local"});
config({path: ".env", override: true});

import {db} from "./index";
import {
    account,
    branch,
    company,
    complaint,
    contract,
    customer,
    location,
    notification,
    notificationTemplate,
    packageCatalog,
    permission,
    service,
    serviceType,
    session,
    user,
    userPermission,
    verification,
} from "./schema";

const DEV_PASSWORD = "Password123!";
const RNG_SEED = 20260301;

function mulberry32(seed: number) {
    let value = seed;
    return () => {
        value |= 0;
        value = (value + 0x6d2b79f5) | 0;
        let t = Math.imul(value ^ (value >>> 15), 1 | value);
        t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
}

const random = mulberry32(RNG_SEED);

function pick<T>(items: T[]) {
    return items[Math.floor(random() * items.length)] as T;
}

function staffId(name: string) {
    return `staff_${name.toLowerCase().replace(/[^a-z0-9]+/g, "_")}`;
}

function parseAmount(value: string) {
    return Number(value.replace(/[₹,\s]/g, "")) || 0;
}

function parseDisplayDate(value: string) {
    const parsed = new Date(value);
    return Number.isNaN(parsed.getTime()) ? new Date("2025-05-11T10:00:00") : parsed;
}

function formatDisplayDate(date: Date) {
    return date.toLocaleDateString("en-US", {month: "long", day: "numeric", year: "numeric"});
}

function formatDdMmYyyy(date: Date) {
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    return `${day}-${month}-${date.getFullYear()}`;
}

function addDays(date: Date, days: number) {
    const next = new Date(date);
    next.setDate(next.getDate() + days);
    return next;
}

function emailFromName(name: string, domain: string) {
    return `${name.toLowerCase().replace(/[^a-z]+/g, ".")}@${domain}`;
}

const permissions = [
    {id: "dashboard", name: "Dashboard Access", description: "View main dashboard and overview"},
    {id: "users", name: "User Management", description: "Create, edit, and manage users"},
    {id: "customers", name: "Customer Management", description: "Manage customer information and accounts"},
    {id: "services", name: "Service Management", description: "Schedule and manage pest control services"},
    {id: "reports", name: "Reports & Analytics", description: "Generate and view business reports"},
    {id: "settings", name: "System Settings", description: "Configure system-wide settings"},
    {id: "complaints", name: "Complaint Handling", description: "Manage customer complaints and feedback"},
    {id: "notifications", name: "Send Notifications", description: "Send notifications to customers and staff"},
    {id: "contracts", name: "Contract Management", description: "Manage customer contracts and agreements"},
    {id: "billing", name: "Billing & Payments", description: "Handle billing and payment processing"},
];

function permissionIdsForRole(role: string) {
    if (role === "admin") {
        return permissions.map((item) => item.id);
    }
    if (role === "salesperson") {
        return ["dashboard", "customers", "services", "reports", "complaints", "notifications", "contracts"];
    }
    return ["dashboard", "services", "complaints"];
}

const serviceTypes = [
    "Ant control",
    "Bed bug control",
    "Bird control",
    "Cockroach control",
    "Flea and Tick control",
    "Fly control",
    "General pest control",
    "Insect control",
    "Mosquito control",
    "Rodent",
    "Mosquito treatment",
    "Termite control",
    "Wildlife control",
];

const existingStaff = [
    {
        name: "Vidyesh",
        email: "vidyesh95@gmail.com",
        phone: "",
        role: "admin",
        status: "active",
        department: "Management",
        createdAt: new Date("2023-06-01"),
    },
    {
        name: "Rajesh Kumar",
        email: "rajesh.kumar@pestcontrol.com",
        phone: "+91 98765 43210",
        role: "salesperson",
        status: "active",
        department: "Sales",
        createdAt: new Date("2023-06-01"),
    },
    {
        name: "Priya Sharma",
        email: "priya.sharma@pestcontrol.com",
        phone: "+91 98765 43211",
        role: "salesperson",
        status: "active",
        department: "Sales",
        createdAt: new Date("2023-07-15"),
    },
    {
        name: "Amit Patel",
        email: "amit.patel@pestcontrol.com",
        phone: "+91 98765 43212",
        role: "agent",
        status: "active",
        department: "Operations",
        createdAt: new Date("2023-08-20"),
    },
    {
        name: "Sneha Reddy",
        email: "sneha.reddy@pestcontrol.com",
        phone: "+91 98765 43213",
        role: "salesperson",
        status: "inactive",
        department: "Sales",
        createdAt: new Date("2023-05-10"),
    },
    {
        name: "Vikram Singh",
        email: "vikram.singh@pestcontrol.com",
        phone: "+91 98765 43214",
        role: "agent",
        status: "pending",
        department: "Operations",
        createdAt: new Date("2024-01-10"),
    },
    {
        name: "Raj Kumar",
        email: "raj.kumar@pestcontrol.com",
        phone: "+91 98765 43220",
        role: "agent",
        status: "active",
        department: "Operations",
        createdAt: new Date("2023-09-01"),
    },
    {
        name: "Sanjay Singh",
        email: "sanjay.singh@pestcontrol.com",
        phone: "+91 98765 43221",
        role: "agent",
        status: "active",
        department: "Operations",
        createdAt: new Date("2023-09-12"),
    },
    {
        name: "Anita Desai",
        email: "anita.desai@pestcontrol.com",
        phone: "+91 98765 43222",
        role: "agent",
        status: "active",
        department: "Operations",
        createdAt: new Date("2023-10-03"),
    },
    {
        name: "Vikram Sharma",
        email: "vikram.sharma@pestcontrol.com",
        phone: "+91 98765 43223",
        role: "agent",
        status: "active",
        department: "Operations",
        createdAt: new Date("2023-10-18"),
    },
    {
        name: "Karan Mehta",
        email: "karan.mehta@pestcontrol.com",
        phone: "+91 98765 43224",
        role: "salesperson",
        status: "active",
        department: "Sales",
        createdAt: new Date("2024-02-02"),
    },
    {
        name: "Divya Iyer",
        email: "divya.iyer@pestcontrol.com",
        phone: "+91 98765 43225",
        role: "salesperson",
        status: "active",
        department: "Sales",
        createdAt: new Date("2024-03-08"),
    },
];

const existingCustomers = [
    {name: "Amit Sharma", phone: "+91 9876543210", email: "amit.sharma@example.com", label: "Building A, Flat 304", address: "Building A, Flat 304, Andheri East, Mumbai, Maharashtra 400069"},
    {name: "Priya Patel", phone: "+91 9876543211", email: "priya.patel@example.com", label: "Building C, Flat 101", address: "Building C, Flat 101, Bandra West, Mumbai, Maharashtra 400050"},
    {name: "Neha Kapoor", phone: "+91 9876543212", email: "neha.kapoor@example.com", label: "Building D, Flat 203", address: "Building D, Flat 203, Powai, Mumbai, Maharashtra 400076"},
    {name: "Vikram Malhotra", phone: "+91 9876543213", email: "vikram.malhotra@example.com", label: "Building B, Flat 502", address: "Building B, Flat 502, Koramangala, Bangalore, Karnataka 560034"},
    {name: "Rahul Verma", phone: "+91 9876543214", email: "rahul.verma@example.com", label: "Building B, Flat 303", address: "Building B, Flat 303, Indiranagar, Bangalore, Karnataka 560038"},
    {name: "Suresh Menon", phone: "+91 9876543215", email: "suresh.menon@example.com", label: "Building E, Flat 105", address: "Building E, Flat 105, Alwarpet, Chennai, Tamil Nadu 600018"},
    {name: "Ananya Singh", phone: "+91 9876543216", email: "ananya.singh@example.com", label: "Building F, Flat 201", address: "Building F, Flat 201, Salt Lake, Kolkata, West Bengal 700091"},
    {name: "Rajesh Kumar", phone: "+91 90000 10001", email: "rajesh.kumar.customer@example.com", label: "B-101, Sunflower Apartments", address: "B-101, Sunflower Apartments, MG Road, Bangalore, Karnataka 560001"},
    {name: "Priya Sharma", phone: "+91 90000 10002", email: "priya.sharma.customer@example.com", label: "Flat 205, Green Valley Society", address: "Flat 205, Green Valley Society, Sector 12, Noida, UP 201301"},
    {name: "Amit Patel", phone: "+91 90000 10003", email: "amit.patel.customer@example.com", label: "301, Business Tower", address: "301, Business Tower, SG Highway, Ahmedabad, Gujarat 380015"},
    {name: "Rohit Khanna", phone: "+91 9876543222", email: "rohit.khanna@example.com", label: "Tower 4, Flat 1201", address: "Tower 4, Flat 1201, Hiranandani Gardens, Powai, Mumbai, Maharashtra 400076"},
    {name: "Kavita Reddy", phone: "+91 9876543223", email: "kavita.reddy@example.com", label: "Villa 18", address: "Villa 18, Jubilee Hills, Hyderabad, Telangana 500033"},
    {name: "Aryan Gupta", phone: "+91 9876543224", email: "aryan.gupta@example.com", label: "House 22, Sector 45", address: "House 22, Sector 45, Gurugram, Haryana 122003"},
    {name: "Arjun Nair", phone: "+91 9876543225", email: "arjun.nair@example.com", label: "Flat 8B, Marine Drive", address: "Flat 8B, Marine Drive, Kochi, Kerala 682031"},
    {name: "Meera Shah", phone: "+91 9876543226", email: "meera.shah@example.com", label: "Shop 12, CG Road", address: "Shop 12, CG Road, Navrangpura, Ahmedabad, Gujarat 380009"},
];

const extraCustomerNames = [
    "Isha Banerjee",
    "Farhan Qureshi",
    "Nandini Rao",
    "Harsh Vardhan",
    "Pooja Kulkarni",
    "Devansh Joshi",
    "Tanvi Deshmukh",
    "Mohit Bansal",
    "Rhea Fernandes",
    "Aditya Pillai",
    "Sana Sheikh",
    "Yash Agarwal",
    "Lakshmi Narayan",
    "Kabir Anand",
    "Trisha Menon",
];

const extraCities = [
    ["Pune", "Maharashtra", "411001"],
    ["Jaipur", "Rajasthan", "302001"],
    ["Lucknow", "Uttar Pradesh", "226001"],
    ["Surat", "Gujarat", "395003"],
    ["Nagpur", "Maharashtra", "440001"],
    ["Coimbatore", "Tamil Nadu", "641001"],
    ["Bhopal", "Madhya Pradesh", "462001"],
    ["Vadodara", "Gujarat", "390001"],
    ["Chandigarh", "Chandigarh", "160017"],
    ["Visakhapatnam", "Andhra Pradesh", "530002"],
];

const existingServices = [
    {id: 1, customer: "Amit Sharma", serviceType: "Cockroach control", date: "May 11, 2025", agent: "Raj Kumar", status: "Completed", location: "Building A, Flat 304", amount: "₹2,500"},
    {id: 2, customer: "Priya Patel", serviceType: "Rodent control", date: "May 11, 2025", agent: "Sanjay Singh", status: "Completed", location: "Building C, Flat 101", amount: "₹3,000"},
    {id: 3, customer: "Neha Kapoor", serviceType: "Mosquito control", date: "May 11, 2025", agent: "Raj Kumar", status: "Completed", location: "Building D, Flat 203", amount: "₹2,000"},
    {id: 4, customer: "Vikram Malhotra", serviceType: "Termite control", date: "May 11, 2025", agent: "Anita Desai", status: "In progress", location: "Building B, Flat 502", amount: "₹4,000"},
    {id: 5, customer: "Rahul Verma", serviceType: "Ant control", date: "May 11, 2025", agent: "Raj Kumar", status: "Scheduled", location: "Building B, Flat 303", amount: "₹2,200"},
    {id: 6, customer: "Suresh Menon", serviceType: "Mosquito treatment", date: "May 29, 2025", agent: "Unassigned", status: "Unscheduled", location: "Building E, Flat 105", amount: "₹0"},
    {id: 7, customer: "Ananya Singh", serviceType: "Basic pest control", date: "June 1, 2025", agent: "Unassigned", status: "Unscheduled", location: "Building F, Flat 201", amount: "₹4,000"},
    {id: 8, customer: "Rahul Verma", serviceType: "Ant control", date: "June 1, 2025", agent: "Unassigned", status: "Unscheduled", location: "Building G, Flat 302", amount: "₹2,000"},
    {id: 9, customer: "Suresh Menon", serviceType: "Mosquito treatment", date: "June 1, 2025", agent: "Sanjay Singh", status: "Redo required", location: "Building H, Flat 401", amount: "₹0"},
    {id: 10, customer: "Ananya Singh", serviceType: "General pest control", date: "April 1, 2025", agent: "Raj Kumar", status: "Expired", location: "Building I, Flat 503", amount: "₹0"},
    {id: 11, customer: "Rahul Verma", serviceType: "Ant control", date: "July 1, 2025", agent: "Raj Kumar", status: "Redo required", location: "Building J, Flat 602", amount: "₹1000"},
    {id: 12, customer: "Suresh Menon", serviceType: "Mosquito treatment", date: "July 10, 2025", agent: "Sanjay Singh", status: "Redo required", location: "Building K, Flat 701", amount: "₹3000"},
];

const existingComplaints = [
    {id: 1, customer: "Amit Sharma", serviceId: 3, complaintType: "Service quality", priority: "Normal", status: "Unscheduled", date: "May 10, 2025", action: "Assign agent", issue: "Pests reappeared after treatment"},
    {id: 2, customer: "Priya Patel", serviceId: 1, complaintType: "Pest reappearance", priority: "High", status: "Scheduled", date: "May 11, 2025", action: "Update status", issue: "Treatment not effective"},
    {id: 3, customer: "Neha Kapoor", serviceId: 2, complaintType: "Pest reappearance", priority: "High", status: "In progress", date: "May 11, 2025", action: "Update status", issue: "Pests reappeared after treatment"},
    {id: 4, customer: "Vikram Malhotra", serviceId: 4, complaintType: "Agent behavior", priority: "Low", status: "Unscheduled", date: "May 11, 2025", action: "Update status", issue: "Agent arrived late and was unprofessional"},
    {id: 5, customer: "Rahul Verma", serviceId: 5, complaintType: "Agent behavior", priority: "Low", status: "Resolved", date: "May 11, 2025", action: "Update status", issue: "Agent did not explain the treatment"},
    {id: 6, customer: "Suresh Menon", serviceId: 6, complaintType: "Pest reappearance", priority: "High", status: "Resolved", date: "May 29, 2025", action: "Update status", issue: "Mosquitoes returned within a week"},
    {id: 7, customer: "Ananya Singh", serviceId: 7, complaintType: "Service quality", priority: "Normal", status: "Scheduled", date: "June 1, 2025", action: "Update status", issue: "Service quality issues"},
    {id: 8, customer: "Rahul Verma", serviceId: 8, complaintType: "Late arrival", priority: "Low", status: "Unscheduled", date: "June 1, 2025", action: "Update status", issue: "Technician arrived 90 minutes late"},
    {id: 9, customer: "Suresh Menon", serviceId: 9, complaintType: "Service quality", priority: "Normal", status: "Resolved", date: "June 1, 2025", action: "Update status", issue: "Incomplete coverage of kitchen area"},
    {id: 10, customer: "Ananya Singh", serviceId: 10, complaintType: "Pest reappearance", priority: "High", status: "Unscheduled", date: "April 1, 2025", action: "Assign agent", issue: "Treatment not effective"},
    {id: 11, customer: "Rahul Verma", serviceId: 11, complaintType: "Late arrival", priority: "Low", status: "Resolved", date: "July 1, 2025", action: "Update status", issue: "Missed the scheduled window"},
    {id: 12, customer: "Suresh Menon", serviceId: 12, complaintType: "Service quality", priority: "Normal", status: "Resolved", date: "July 10, 2025", action: "Update status", issue: "Redo required after complaint"},
];

const existingContracts = [
    {id: 1, customer: "Rajesh Kumar", serviceType: "Comprehensive Pest Control", value: 25000, paymentStatus: "Paid", nextPayment: "15-07-2025", contractDate: "15-04-2025", expiryDate: "14-07-2025", status: "Active", paymentFrequency: "Quarterly", packageName: "Professional"},
    {id: 2, customer: "Priya Sharma", serviceType: "Termite Treatment", value: 15000, paymentStatus: "Pending", nextPayment: "20-07-2025", contractDate: "20-01-2025", expiryDate: "19-07-2025", status: "Active", paymentFrequency: "Half-yearly", packageName: "Basic"},
    {id: 3, customer: "Amit Patel", serviceType: "Cockroach Control", value: 8000, paymentStatus: "Overdue", nextPayment: "30-05-2025", contractDate: "30-04-2025", expiryDate: "29-05-2025", status: "Expiring Soon", paymentFrequency: "Monthly", packageName: "Basic"},
];

const existingNotifications = [
    {id: 1, subject: "Service Reminder - Cockroach Treatment", recipients: "Amit Sharma", type: "Service Reminder", method: "Email, Push", status: "Delivered", dateTime: "Today, 9:30 AM", actions: "View details"},
    {id: 2, subject: "Payment Due Reminder", recipients: "All Customers(124)", type: "Payment Due", method: "Email, Push, SMS", status: "Sending", dateTime: "Yesterday, 10:00 AM", actions: "View Progress"},
    {id: 3, subject: "Service completion confirmation", recipients: "Rajesh Kumar", type: "Service Completion", method: "Email, Push", status: "Delivered", dateTime: "Yesterday, 2:15 PM", actions: "View details"},
    {id: 4, subject: "New Service Offer - Termite Control", recipients: "Priya Sharma", type: "Promotional", method: "Email, Push, SMS", status: "Delivered", dateTime: "Today, 11:00 AM", actions: "View details"},
    {id: 5, subject: "Service Feedback Request", recipients: "Amit Patel", type: "Feedback Request", method: "Email, Push", status: "Sending", dateTime: "Today, 12:30 PM", actions: "View Progress"},
    {id: 6, subject: "Service Reminder - Pest Control", recipients: "All Customers(124)", type: "Service Reminder", method: "Email, Push, SMS", status: "Delivered", dateTime: "Today, 1:00 PM", actions: "View details"},
    {id: 7, subject: "Payment Confirmation", recipients: "Rajesh Kumar", type: "Payment Confirmation", method: "Email, Push", status: "Delivered", dateTime: "Today, 3:00 PM", actions: "View details"},
    {id: 8, subject: "Service Feedback Request", recipients: "Priya Sharma", type: "Feedback Request", method: "Email, Push, SMS", status: "Sending", dateTime: "Today, 4:00 PM", actions: "View Progress"},
    {id: 9, subject: "New Service Offer - Pest Control", recipients: "Amit Patel", type: "Promotional", method: "Email, Push", status: "Scheduled", dateTime: "Tomorrow, 5:00 PM", actions: "Edit, Cancel"},
    {id: 10, subject: "Service Reminder - Termite Control", recipients: "All Customers(124)", type: "Service Reminder", method: "Email, Push, SMS", status: "Scheduled", dateTime: "May 15, 2025, 6:00 PM", actions: "Edit, Cancel"},
    {id: 11, subject: "Payment Due Reminder", recipients: "Rajesh Kumar", type: "Payment Due", method: "Email, Push", status: "Delivered", dateTime: "Today, 7:00 PM", actions: "View details"},
    {id: 12, subject: "Service Completion Confirmation", recipients: "Priya Sharma", type: "Service Completion", method: "Email, Push, SMS", status: "Sending", dateTime: "Today, 8:00 PM", actions: "View Progress"},
];

const templates = [
    {cardTitle: "Service Reminder", cardDescription: "Remind customers about upcoming services", subject: "Service Reminder - {service_type}", message: "Your {service_type} service is scheduled for {date}..."},
    {cardTitle: "Payment Due", cardDescription: "Notify customers about pending payments", subject: "Payment Due - Invoice #{invoice_number}", message: "Your payment of ₹{amount} is due on {due_date}..."},
    {cardTitle: "Service Completion", cardDescription: "Confirm service completion with customers", subject: "Service Completion - {service_type}", message: "Your {service_type} service was completed on {date}..."},
    {cardTitle: "Promotional Offer", cardDescription: "Inform customers about new offers and discounts", subject: "New Offer - {offer_name}", message: "Enjoy {discount}% off on {offer_name} valid until {expiry_date}..."},
    {cardTitle: "Feedback Request", cardDescription: "Request feedback after service completion", subject: "Feedback Request - {service_type}", message: "We value your feedback! Please share your experience with our {service_type} service..."},
];

async function reset() {
    await db.delete(notification);
    await db.delete(notificationTemplate);
    await db.delete(complaint);
    await db.delete(service);
    await db.delete(contract);
    await db.delete(location);
    await db.delete(customer);
    await db.delete(userPermission);
    await db.delete(session);
    await db.delete(account);
    await db.delete(verification);
    await db.delete(user);
    await db.delete(permission);
    await db.delete(serviceType);
    await db.delete(packageCatalog);
    await db.delete(branch);
    await db.delete(company);
}

async function seed() {
    await reset();
    const passwordHash = await hashPassword(DEV_PASSWORD);
    const now = new Date();

    await db.insert(company).values({
        name: "UrbanPestMaster",
        address: "Kandivali East, Mumbai, Maharashtra",
        email: "contact@urbanpestmaster.in",
        phone: "+91 74985 18198 / 86001 39094",
    });
    const [companyRow] = await db.select().from(company).limit(1);
    if (!companyRow) {
        throw new Error("Company seed failed");
    }

    await db.insert(branch).values([
        {
            companyId: companyRow.id,
            name: "Kandivali",
            address: "Shop no. 1, Ram Bhagat Pandey Apartment, Poisar, Kandivali (E) - 400 101",
        },
        {
            companyId: companyRow.id,
            name: "Virar",
            address: "Shop no. 10, Yashwant Nagar, Virar (W) - 401 303",
        },
    ]);

    await db.insert(permission).values(permissions);
    await db.insert(serviceType).values(serviceTypes.map((name) => ({name})));
    await db.insert(packageCatalog).values([
        {name: "Basic", price: "₹999", description: "Perfect for small homes"},
        {name: "Professional", price: "₹9999", description: "Ideal for larger homes"},
        {name: "Premium", price: "₹14999", description: "Premium pest control with priority service"},
        {name: "Enterprise", price: "Custom", description: "For commercial properties"},
    ]);

    const packages = await db.select().from(packageCatalog);
    const packageByName = new Map(packages.map((item) => [item.name, item.id]));

    for (const staff of existingStaff) {
        const id = staffId(staff.name);
        await db.insert(user).values({
            id,
            name: staff.name,
            email: staff.email,
            emailVerified: true,
            createdAt: staff.createdAt,
            updatedAt: now,
            role: staff.role,
            phone: staff.phone,
            department: staff.department,
            status: staff.status,
        });
        await db.insert(account).values({
            id: `acc_${id}`,
            accountId: id,
            providerId: "credential",
            issuer: createLocalAccountIssuer("credential"),
            userId: id,
            password: passwordHash,
            createdAt: staff.createdAt,
            updatedAt: now,
        });
        await db.insert(userPermission).values(
            permissionIdsForRole(staff.role).map((permissionId) => ({
                userId: id,
                permissionId,
            })),
        );
    }

    const extraCustomers = extraCustomerNames.map((name, index) => {
        const [city, state, pin] = pick(extraCities);
        const building = String.fromCharCode(65 + (index % 12));
        const flat = 100 + index * 3;
        return {
            name,
            phone: `+91 98${String(76000000 + index).slice(-8)}`,
            email: emailFromName(name, "example.com"),
            label: `Building ${building}, Flat ${flat}`,
            address: `Building ${building}, Flat ${flat}, ${city}, ${state} ${pin}`,
        };
    });

    const allCustomers = [...existingCustomers, ...extraCustomers];
    await db.insert(customer).values(
        allCustomers.map((item) => ({
            name: item.name,
            phone: item.phone,
            email: item.email,
        })),
    );

    const customers = await db.select().from(customer);
    const customerByName = new Map(customers.map((item) => [item.name, item]));

    await db.insert(location).values(
        allCustomers.map((item) => {
            const row = customerByName.get(item.name);
            if (!row) {
                throw new Error(`Missing customer ${item.name}`);
            }
            return {
                customerId: row.id,
                label: item.label,
                address: item.address,
            };
        }),
    );

    const locations = await db.select().from(location);
    const locationByCustomerId = new Map(locations.map((item) => [item.customerId, item]));

    const agentIds = existingStaff.filter((item) => item.role === "agent" && item.status === "active").map((item) => staffId(item.name));

    for (const item of existingContracts) {
        const customerRow = customerByName.get(item.customer);
        if (!customerRow) {
            throw new Error(`Missing contract customer ${item.customer}`);
        }
        await db.insert(contract).values({
            id: item.id,
            customerId: customerRow.id,
            locationId: locationByCustomerId.get(customerRow.id)?.id,
            packageId: packageByName.get(item.packageName),
            serviceType: item.serviceType,
            contractValue: item.value,
            paymentStatus: item.paymentStatus,
            paymentFrequency: item.paymentFrequency,
            nextPayment: item.nextPayment,
            contractDate: item.contractDate,
            expiryDate: item.expiryDate,
            status: item.status,
        });
    }

    const generatedCustomers = customers.filter((item) => !existingContracts.some((contractRow) => contractRow.customer === item.name));
    let contractId = existingContracts.length;
    const paymentStatuses = ["Paid", "Pending", "Overdue"] as const;
    const frequencies = ["Monthly", "Quarterly", "Half-yearly", "Yearly"] as const;
    const contractStatuses = ["Active", "Active", "Expiring Soon", "Expired"] as const;
    const packageNames = ["Basic", "Professional", "Premium"] as const;

    for (const customerRow of generatedCustomers.slice(0, 22)) {
        contractId += 1;
        const start = addDays(new Date("2025-01-15"), Math.floor(random() * 180));
        const status = pick([...contractStatuses]);
        const expiry = addDays(start, status === "Expired" ? 80 : status === "Expiring Soon" ? 100 : 140);
        const locationRow = locationByCustomerId.get(customerRow.id);
        const serviceTypeName = pick(serviceTypes);
        await db.insert(contract).values({
            id: contractId,
            customerId: customerRow.id,
            locationId: locationRow?.id,
            packageId: packageByName.get(pick([...packageNames])),
            serviceType: serviceTypeName,
            contractValue: 6000 + Math.floor(random() * 24000),
            paymentStatus: pick([...paymentStatuses]),
            paymentFrequency: pick([...frequencies]),
            nextPayment: formatDdMmYyyy(addDays(start, 30)),
            contractDate: formatDdMmYyyy(start),
            expiryDate: formatDdMmYyyy(expiry),
            status,
        });
    }

    const contracts = await db.select().from(contract);
    const contractByCustomerId = new Map(contracts.map((item) => [item.customerId, item]));

    for (const item of existingServices) {
        const customerRow = customerByName.get(item.customer);
        if (!customerRow) {
            throw new Error(`Missing service customer ${item.customer}`);
        }
        await db.insert(service).values({
            id: item.id,
            contractId: contractByCustomerId.get(customerRow.id)?.id,
            customerId: customerRow.id,
            locationId: locationByCustomerId.get(customerRow.id)?.id,
            serviceType: item.serviceType,
            date: item.date,
            scheduledAt: parseDisplayDate(item.date),
            agentId: item.agent === "Unassigned" ? null : staffId(item.agent),
            status: item.status,
            amount: parseAmount(item.amount),
        });
    }

    const serviceStatuses = ["Completed", "Scheduled", "In progress", "Unscheduled", "Redo required", "Expired"] as const;
    let serviceId = existingServices.length;
    for (const contractRow of contracts) {
        const visitCount = 1 + Math.floor(random() * 3);
        for (let visit = 0; visit < visitCount && serviceId < 50; visit += 1) {
            const alreadySeeded = existingServices.some((item) => {
                const customerRow = customerByName.get(item.customer);
                return customerRow?.id === contractRow.customerId;
            });
            if (alreadySeeded && visit === 0) {
                continue;
            }
            serviceId += 1;
            const scheduled = addDays(new Date("2025-02-01"), Math.floor(random() * 220) + visit * 100);
            const status = pick([...serviceStatuses]);
            await db.insert(service).values({
                id: serviceId,
                contractId: contractRow.id,
                customerId: contractRow.customerId,
                locationId: contractRow.locationId,
                serviceType: contractRow.serviceType,
                date: formatDisplayDate(scheduled),
                scheduledAt: scheduled,
                agentId: status === "Unscheduled" ? null : pick(agentIds),
                status,
                amount: status === "Unscheduled" || status === "Expired" ? 0 : 1500 + Math.floor(random() * 3500),
            });
        }
    }

    for (const item of existingComplaints) {
        const customerRow = customerByName.get(item.customer);
        if (!customerRow) {
            throw new Error(`Missing complaint customer ${item.customer}`);
        }
        await db.insert(complaint).values({
            id: item.id,
            serviceId: item.serviceId,
            customerId: customerRow.id,
            complaintType: item.complaintType,
            priority: item.priority,
            status: item.status,
            date: item.date,
            issue: item.issue,
            action: item.action,
        });
    }

    const generatedServices = await db.select().from(service);
    const extraServicePool = generatedServices.filter((item) => item.id > 12 && item.status !== "Completed");
    const complaintTypes = ["Service quality", "Pest reappearance", "Agent behavior", "Late arrival"] as const;
    const priorities = ["High", "Normal", "Low"] as const;
    const complaintStatuses = ["Unscheduled", "Scheduled", "In progress", "Resolved"] as const;
    let complaintId = existingComplaints.length;
    for (const serviceRow of extraServicePool.slice(0, 8)) {
        complaintId += 1;
        await db.insert(complaint).values({
            id: complaintId,
            serviceId: serviceRow.id,
            customerId: serviceRow.customerId,
            complaintType: pick([...complaintTypes]),
            priority: pick([...priorities]),
            status: pick([...complaintStatuses]),
            date: serviceRow.date,
            issue: pick([
                "Pests reappeared after treatment",
                "Treatment not effective",
                "Service quality issues",
                "Technician arrived late",
            ]),
            action: "Update status",
        });
    }

    await db.insert(notification).values(
        existingNotifications.map((item) => ({
            id: item.id,
            subject: item.subject,
            recipients: item.recipients,
            type: item.type,
            method: item.method,
            status: item.status,
            dateTime: item.dateTime,
            actions: item.actions,
        })),
    );

    const extraNotificationTypes = ["Service Reminder", "Payment Due", "Service Completion", "Feedback Request"] as const;
    const extraStatuses = ["Delivered", "Sending", "Scheduled"] as const;
    for (let index = 0; index < 8; index += 1) {
        const type = pick([...extraNotificationTypes]);
        const status = pick([...extraStatuses]);
        await db.insert(notification).values({
            id: existingNotifications.length + index + 1,
            subject: `${type} - ${pick(serviceTypes)}`,
            recipients: pick(allCustomers).name,
            type,
            method: pick(["Email, Push", "Email, Push, SMS", "SMS"]),
            status,
            dateTime: formatDisplayDate(addDays(new Date("2025-06-01"), index * 4)),
            actions: status === "Scheduled" ? "Edit, Cancel" : "View details",
        });
    }

    await db.insert(notificationTemplate).values(templates);

    const admin = existingStaff.find((staff) => staff.role === "admin");
    console.log(`Seeded ${existingStaff.length} staff (password: ${DEV_PASSWORD})`);
    console.log(`Admin login: ${admin?.email} / ${DEV_PASSWORD}`);
}

seed()
    .then(() => {
        console.log("Database seed complete.");
        process.exit(0);
    })
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
