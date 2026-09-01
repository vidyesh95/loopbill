import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import {Button} from "@/components/ui/button";

import type {UpcomingServiceRow} from "@/lib/data/types";

const upcomingServices: UpcomingServiceRow[] = [
    {
        id: 1,
        customer: 'Amit Sharma',
        serviceType: 'Cockroach Control',
        date: 'Today, 2:30 PM',
        agent: 'Raj Kumar'
    },
    {
        id: 2,
        customer: 'Priya Patel',
        serviceType: 'Rodent Control',
        date: 'Tomorrow, 10:00 AM',
        agent: 'Sanjay Singh'
    },
    {
        id: 3,
        customer: 'Neha Kapoor',
        serviceType: 'Mosquito Treatment',
        date: 'May 14, 4:00 PM',
        agent: 'Raj Kumar'
    },
    {
        id: 4,
        customer: 'Vikram Malhotra',
        serviceType: 'Termite Control',
        date: 'May 15, 9:30 AM',
        agent: 'Anita Desai'
    }
]

export default function UpcomingServices({services = upcomingServices}: {services?: UpcomingServiceRow[]}) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Upcoming Services</CardTitle>
                <CardDescription>Services scheduled for the next 7 days</CardDescription>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Customer</TableHead>
                            <TableHead>Service type</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead>Agent</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {services.map((service) => (
                            <TableRow key={service.id}>
                                <TableCell>{service.customer}</TableCell>
                                <TableCell>{service.serviceType}</TableCell>
                                <TableCell>{service.date}</TableCell>
                                <TableCell>{service.agent}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                <Button variant={"outline"} className="w-full mt-4 cursor-pointer">View all services</Button>
            </CardContent>
        </Card>
    );
}