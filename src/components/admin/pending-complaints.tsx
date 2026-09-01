import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import {Button} from "@/components/ui/button";

import type {PendingComplaintRow} from "@/lib/data/types";

const pendingComplaints: PendingComplaintRow[] = [
    {
        id: 1,
        customer: 'Amit Sharma',
        serviceDate: 'May 8, 2025',
        complaintDate: 'May 10, 2025',
        issue: 'Pests reappeared after treatment',
        validity: 'Valid'
    },
    {
        id: 2,
        customer: 'Rahul Verma',
        serviceDate: 'May 6, 2025',
        complaintDate: 'May 10, 2025',
        issue: 'Treatment not effective',
        validity: 'Valid'
    },
    {
        id: 3,
        customer: 'Suresh Menon',
        serviceDate: 'April 15, 2025',
        complaintDate: 'May 17, 2025',
        issue: 'Service quality issues',
        validity: 'Invalid'
    },
    {
        id: 4,
        customer: 'Vikram Malhotra',
        serviceDate: 'May 28, 2025',
        complaintDate: 'June 1, 2025',
        issue: 'Pests reappeared after treatment',
        validity: 'Valid'
    },
    {
        id: 5,
        customer: 'Ananya Singh',
        serviceDate: 'May 28, 2025',
        complaintDate: 'June 29, 2025',
        issue: 'Treatment not effective',
        validity: 'Invalid'
    }
]

export default function PendingComplaints({items = pendingComplaints}: {items?: PendingComplaintRow[]}) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Pending Complaints</CardTitle>
                <CardDescription>Customers not happy with service</CardDescription>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>ID</TableHead>
                            <TableHead>Customer</TableHead>
                            <TableHead>Service Date</TableHead>
                            <TableHead>Complaint Date</TableHead>
                            <TableHead>Issue</TableHead>
                            <TableHead>Validity</TableHead>
                            <TableHead>Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {items.map((complaints) => (
                            <TableRow key={complaints.id}>
                                <TableCell>{complaints.id}</TableCell>
                                <TableCell>{complaints.customer}</TableCell>
                                <TableCell>{complaints.serviceDate}</TableCell>
                                <TableCell>{complaints.complaintDate}</TableCell>
                                <TableCell>{complaints.issue}</TableCell>
                                <TableCell>
                                    <span
                                        className={`px-2 py-0.5 border rounded-full font-semibold ${complaints.validity === 'Invalid' ? 'text-red-600 border-red-400 bg-red-100' : 'text-green-600 border-green-400 bg-green-100'}`}>
                                        {complaints.validity}
                                    </span>
                                </TableCell>
                                <TableCell>
                                    <div className="flex gap-2">
                                        <Button variant={complaints.validity === 'Invalid' ? 'destructive':'default'} size={"sm"}>
                                            {complaints.validity === 'Invalid' ? 'Reject':'Assign'}
                                        </Button>
                                        <Button variant={"outline"} size={"sm"}>
                                            Contact
                                        </Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                <Button variant={"outline"} className="w-full mt-4 cursor-pointer">View all complaints</Button>
            </CardContent>
        </Card>
    );
}