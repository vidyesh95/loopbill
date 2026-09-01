import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs";
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "@/components/ui/card";
import ComplaintsTablePagination from "@/components/admin/complaints/complaints-table-pagination";
import FilterByPriority from "@/components/admin/complaints/filter-by-priority";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import {Button} from "@/components/ui/button";
import type {ComplaintRow} from "@/lib/data/types";

const allComplaints: ComplaintRow[] = [
    {
        complaintId: 1,
        customer: 'Amit Sharma',
        serviceId: 3,
        complaintType: 'Service quality',
        priority: 'Normal',
        status: 'Unscheduled',
        date: 'May 10, 2025',
        action: 'Assign agent'
    },
    {
        complaintId: 2,
        customer: 'Priya Patel',
        serviceId: 1,
        complaintType: 'Pest reappearance',
        priority: 'High',
        status: 'Scheduled',
        date: 'May 11, 2025',
        action: 'Update status'
    },
    {
        complaintId: 3,
        customer: 'Neha Kapoor',
        serviceId: 2,
        complaintType: 'Pest reappearance',
        priority: 'High',
        status: 'In progress',
        date: 'May 11, 2025',
        action: 'Update status'
    },
    {
        complaintId: 4,
        customer: 'Vikram Malhotra',
        serviceId: 4,
        complaintType: 'Agent behavior',
        priority: 'Low',
        status: 'Unscheduled',
        date: 'May 11, 2025',
        action: 'Update status'
    },
    {
        complaintId: 5,
        customer: 'Rahul Verma',
        serviceId: 5,
        complaintType: 'Agent behavior',
        priority: 'Low',
        status: 'Resolved',
        date: 'May 11, 2025',
        action: 'Update status'
    },
    {
        complaintId: 6,
        customer: 'Suresh Menon',
        serviceId: 6,
        complaintType: 'Pest reappearance',
        priority: 'High',
        status: 'Resolved',
        date: 'May 29, 2025',
        action: 'Update status'
    },
    {
        complaintId: 7,
        customer: 'Ananya Singh',
        serviceId: 7,
        complaintType: 'Service quality',
        priority: 'Normal',
        status: 'Scheduled',
        date: 'June 1, 2025',
        action: 'Update status'
    },
    {
        complaintId: 8,
        customer: 'Rahul Verma',
        serviceId: 8,
        complaintType: 'Late arrival',
        priority: 'Low',
        status: 'Unscheduled',
        date: 'June 1, 2025',
        action: 'Update status'
    },
    {
        complaintId: 9,
        customer: 'Suresh Menon',
        serviceId: 9,
        complaintType: 'Service quality',
        priority: 'Normal',
        status: 'Resolved',
        date: 'June 1, 2025',
        action: 'Update status'
    },
    {
        complaintId: 10,
        customer: 'Ananya Singh',
        serviceId: 10,
        complaintType: 'Pest reappearance',
        priority: 'High',
        status: 'Unscheduled',
        date: 'April 1, 2025',
        action: 'Assign agent'
    },
    {
        complaintId: 11,
        customer: 'Rahul Verma',
        serviceId: 11,
        complaintType: 'Late arrival',
        priority: 'Low',
        status: 'Resolved',
        date: 'July 1, 2025',
        action: 'Update status'
    },
    {
        complaintId: 12,
        customer: 'Suresh Menon',
        serviceId: 12,
        complaintType: 'Service quality',
        priority: 'Normal',
        status: 'Resolved',
        date: 'July 10, 2025',
        action: 'Update status'
    }
]

const getStatusColor = (status: string) => {
    switch (status) {
        case 'Unscheduled':
            return 'text-red-600 border-red-400 bg-red-100'
        case 'Scheduled':
            return 'text-yellow-600 border-yellow-400 bg-yellow-100'
        case 'In progress':
            return 'text-blue-600 border-blue-400 bg-blue-100'
        case 'Resolved':
            return 'text-green-600 border-green-400 bg-green-100'
        default:
            return 'text-gray-600 border-gray-400 bg-gray-100'
    }
}

const getPriorityColor = (priority: string) => {
    switch (priority) {
        case 'High':
            return 'text-red-600 border-red-400 bg-red-100'
        case 'Normal':
            return 'text-yellow-600 border-yellow-400 bg-yellow-100'
        case 'Low':
            return 'text-green-600 border-green-400 bg-green-100'
        default:
            return 'text-gray-600 border-gray-400 bg-gray-100'
    }
}

const renderComplaints = (rows: ComplaintRow[]) => {
    if (rows.length === 0) {
        return <p>No complaints match the current filters.</p>;
    }
    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Complaint Id</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Service Id</TableHead>
                    <TableHead>Complaint type</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Actions</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {rows.map((complaint) => (
                    <TableRow key={complaint.complaintId}>
                        <TableCell>{complaint.complaintId}</TableCell>
                        <TableCell>{complaint.customer}</TableCell>
                        <TableCell>{complaint.serviceId}</TableCell>
                        <TableCell>{complaint.complaintType}</TableCell>
                        <TableCell>
                            <span className={`px-2 py-0.5 border rounded-full font-semibold ${getPriorityColor(complaint.priority)}`}>
                                {complaint.priority}
                            </span>
                        </TableCell>
                        <TableCell>
                            <span className={`px-2 py-0.5 border rounded-full font-semibold ${getStatusColor(complaint.status)}`}>
                                {complaint.status}
                            </span>
                        </TableCell>
                        <TableCell>{complaint.date}</TableCell>
                        <TableCell className="flex gap-1">
                            <Button variant={"outline"} size={"sm"}>View details</Button>
                            <Button size={"sm"}>{complaint.action}</Button>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    )
}

export default function ComplaintsTable({complaints = allComplaints}: {complaints?: ComplaintRow[]}) {
    const byStatus = (status?: string) =>
        status ? complaints.filter((row) => row.status === status) : complaints;

    return (
        <Tabs defaultValue="all-complaints" className="w-full">
            <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="all-complaints" className="cursor-pointer">All complaints</TabsTrigger>
                <TabsTrigger value="unscheduled-complaints" className="cursor-pointer">
                    Unscheduled complaints
                </TabsTrigger>
                <TabsTrigger value="scheduled-complaints" className="cursor-pointer">Scheduled complaints</TabsTrigger>
                <TabsTrigger value="in-progress-complaints" className="cursor-pointer">
                    In progress complaints
                </TabsTrigger>
                <TabsTrigger value="resolved-complaints" className="cursor-pointer">Resolved complaints</TabsTrigger>
            </TabsList>
            <TabsContent value="all-complaints">
                <Card>
                    <CardHeader>
                        <CardTitle>All complaints</CardTitle>
                        <CardDescription>
                            View and manage all pest control services
                        </CardDescription>
                        <FilterByPriority/>
                    </CardHeader>
                    <CardContent>
                        {renderComplaints(byStatus())}
                    </CardContent>
                    <CardFooter>
                        <ComplaintsTablePagination/>
                    </CardFooter>
                </Card>
            </TabsContent>

            <TabsContent value="unscheduled-complaints">
                <Card>
                    <CardHeader>
                        <CardTitle>Unscheduled complaints</CardTitle>
                        <CardDescription>
                            Complaints unscheduled for investigation and resolution
                        </CardDescription>
                        <FilterByPriority/>
                    </CardHeader>
                    <CardContent>
                        {renderComplaints(byStatus("Unscheduled"))}
                    </CardContent>
                    <CardFooter>
                        <ComplaintsTablePagination/>
                    </CardFooter>
                </Card>
            </TabsContent>

            <TabsContent value={"scheduled-complaints"}>
                <Card>
                    <CardHeader>
                        <CardTitle>Scheduled complaints</CardTitle>
                        <CardDescription>
                            Complaints scheduled for investigation and resolution
                        </CardDescription>
                        <FilterByPriority/>
                    </CardHeader>
                    <CardContent>
                        {renderComplaints(byStatus("Scheduled"))}
                    </CardContent>
                    <CardFooter>
                        <ComplaintsTablePagination/>
                    </CardFooter>
                </Card>
            </TabsContent>

            <TabsContent value={"in-progress-complaints"}>
                <Card>
                    <CardHeader>
                        <CardTitle>In progress complaints</CardTitle>
                        <CardDescription>
                            Complaints currently being investigated and resolved
                        </CardDescription>
                        <FilterByPriority/>
                    </CardHeader>
                    <CardContent>
                        {renderComplaints(byStatus("In progress"))}
                    </CardContent>
                    <CardFooter>
                        <ComplaintsTablePagination/>
                    </CardFooter>
                </Card>
            </TabsContent>

            <TabsContent value={"resolved-complaints"}>
                <Card>
                    <CardHeader>
                        <CardTitle>Resolved complaints</CardTitle>
                        <CardDescription>
                            Successfully resolved complaints
                        </CardDescription>
                        <FilterByPriority/>
                    </CardHeader>
                    <CardContent>
                        {renderComplaints(byStatus("Resolved"))}
                    </CardContent>
                    <CardFooter>
                        <ComplaintsTablePagination/>
                    </CardFooter>
                </Card>
            </TabsContent>
        </Tabs>
    )
}