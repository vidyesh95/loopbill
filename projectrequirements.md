# Project Requirements: Pest Control Service Management System

## 1. Service Lifecycle and Redo Logic – Full Specification

### 1.1 System Roles & Access Levels

- **Admin**
  - Can create users: Salesperson, Agent, Customer
  - Access to system reports, including sales KPIs and agent performance
  - Can view historical and real-time data of all users
- **Salesperson**
  - Can create customer profiles
  - Can create and manage locations (Building, Wing, Flat No, etc.)
  - Assigns customers and locations to agents for service
  - Handles back-office operations including rescheduling if the customer is not present
- **Agent**
  - Can view only assigned tasks and locations
  - Marks services as completed post-visit
  - Reports customer absence; Salesperson reschedules after coordination
  - Restricted access: cannot view customer details unless configured by admin
- **Customer**
  - No portal access
  - Receive notifications via WhatsApp/SMS for reminders
  - Receives emails for invoices and receipts

### 1.2 Package Structure Overview

- Each pest control package includes 3 scheduled services
- Validity:
  - **1st Service**: Must be completed in the same calendar month as purchase
  - **2nd & 3rd Services**: Scheduled between 90 and 120 days after the previous service
  - Contracts expire if more than 151 days pass without scheduling the next service

### 1.3 Service Interval Enforcement Rules

| Service Stage | Time Window           | System Behavior                          |
| ------------- | --------------------- | ---------------------------------------- |
| 1st Service   | Within purchase month | Manual reminder by Salesperson           |
| 2nd Service   | 90–120 days from 1st  | Reminders on Day 90 and Day 120          |
| 3rd Service   | 90–120 days from 2nd  | Reminders on Day 90 and Day 120          |
| Grace Period  | After Day 151         | Final expiration notice; contract locked |

### 1.4 System Notifications and Dashboard Actions

- WhatsApp/SMS reminders sent on Day 90, Day 120, and Day 151 for pending services
- Admin dashboard shows customers at risk of expiry within 7, 15, and 30 days
- Salespersons can adjust scheduled dates only within the valid range (90–120 days)
- Agents can only see assigned work; they cannot close out-of-range services without override

### 1.5 Redo and Complaint Handling

- Complaints must be raised within the same calendar month of the original service
- Admin sees the complaint 2 days after it is raised
- Redo service can be scheduled only after 3 days of the complaint being attended
- Only one redo is allowed per service unless overridden by Admin
- Salespersons may view complaints, but only Admin can assign redoes

#### Redo Workflow

| Stage            | System Action                              |
| ---------------- | ------------------------------------------ |
| Complaint Raised | System logs date of complaint              |
| Admin Visibility | Complaint shown to Admin after 2 days      |
| Redo Eligibility | 3-day cooldown after complaint is attended |
| Assignment       | Admin assigns redo to Agent                |
| Redo Completion  | Agent completes and system logs redo       |

### 1.6 Missed Service or Customer Absence

- If a customer is not available, Agent informs the Salesperson
- Salesperson marks a job as "Reschedule Required" and contacts the customer
- Salesperson schedules a new date within customer availability
- System may restrict to a maximum of 2 rescheduling per service
- Repeated absences flag the contract for Admin review

### 1.7 Summary of Key Rules

| Item                    | Rule or Constraint                             |
| ----------------------- | ---------------------------------------------- |
| Services per Package    | 3                                              |
| Valid Service Intervals | 90–120 days between services                   |
| Contract Expiry         | No service in 151 days → contract expired      |
| Complaint Validity      | Same month as original service                 |
| Redo Scheduling         | Allowed 3 days after complaint is attended     |
| Admin Visibility        | Complaints shown after 2 days                  |
| Notification Triggers   | Day 90, 120, 151 via WhatsApp/SMS/Email        |
| Max Reschedules         | Up to 2 reschedules per service (configurable) |

## 2. UI/UX Design Blueprint

### 2.1 Admin Portal

- **Dashboard Overview**
  - Key Metrics: Total active packages; upcoming services (7/15/30 days); expired contracts
  - Visualizations: Bar charts for agent performance; pie charts for complaint statuses; line graphs for service trends
- **User Management**
  - Create/manage Salesperson, Agent, and Customer profiles
  - Configure data visibility for agents
- **Complaint Management**
  - Complaint queue with filters (date, status, assigned personnel)
  - Assign re-service jobs to agents with priority levels
- **Reports & Analytics**
  - Generate agent and salesperson KPI reports
  - Export options: PDF, Excel

### 2.2 Salesperson Portal

- **Customer & Location Management**
  - Add new customers with structured location details
  - Assign services to agents with specified schedules
- **Service Calendar**
  - Drag-and-drop interface for scheduling/rescheduling within allowed intervals
  - Alerts when scheduling outside 90–120 day window
- **Service Verification**
  - Review and verify completed services before finalization
  - Provide feedback or request rework
- **Notifications**
  - Automated reminders for upcoming services
  - Manual alerts for custom notifications

### 2.3 Agent Mobile Interface

- **Assigned Jobs**
  - Daily schedule listing with location, service type, and time
  - Integrated maps for route optimization
- **Service Completion**
  - Mark services as “Completed” with optional notes
  - Attach images as proof of service
- **Customer Absence Handling**
  - Immediate reporting of absence to Salesperson
  - Await rescheduling instructions
- **Access Restrictions**
  - Access only assigned jobs and permitted customer information

### 2.4 Customer Interaction

- **Notifications**
  - Service reminders via WhatsApp & SMS
  - Invoices and receipts via email
- **Complaint Submission**
  - Link to a form for raising complaints within the same month
  - Confirmation with expected resolution timeline
- **Rescheduling Requests**
  - Request reschedules via provided links or contact numbers
  - Receive updated service schedule confirmations

### 2.5 Service Lifecycle Management

- Monitor 3 services per package with system-enforced intervals (90–120 days)
- Automated reminders on Day 90, 120; expiration notice on Day 151

### 2.6 Smart System Enhancements

- **Service Validity Tracker**
  - Log scheduled vs. actual completion dates, delays, reschedule counts
  - Visual cues for services nearing expiration
- **Grace Period Warnings**
  - Alerts for customers approaching Day 151
  - Retention outreach options
- **Auto-Expire Contracts**
  - Lock contract and prevent bookings after expiration
  - Lock invoices to prevent unauthorized redo attempts

### 2.7 UI/UX Design Best Practices

- Consistency in branding, color schemes, typography
- Responsive design, especially for mobile agents
- Accessibility compliance
- Intuitive navigation with clear menus
- Real-time feedback for user actions and system events
