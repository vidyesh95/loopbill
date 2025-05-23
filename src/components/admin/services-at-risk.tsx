import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import {Button} from "@/components/ui/button";

const servicesAtRisk = [
    {
        id: 1,
        customer: 'Rohit Khanna',
        package: 'Premium Pest Control',
        nextService: '3rd Service',
        daysLeft: '7 days',
        status: 'Critical',
        action: 'Contact'
    },
    {
        id: 2,
        customer: 'Ananya Singh',
        package: 'Basic Pest Control',
        nextService: '2nd Service',
        daysLeft: '12 days',
        status: 'Warning',
        action: 'Schedule'
    },
    {
        id: 3,
        customer: 'Suresh Menon',
        package: 'Premium Pest Control',
        nextService: '3rd Service',
        daysLeft: '15 days',
        status: 'Warning',
        action: 'Schedule'
    },
    {
        id: 4,
        customer: 'Vikram Malhotra',
        package: 'Basic Pest Control',
        nextService: '2nd Service',
        daysLeft: '18 days',
        status: 'Warning',
        action: 'Schedule'
    }
]

export default function ServicesAtRisk() {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Services at Risk</CardTitle>
                <CardDescription>Services approaching expiration dates</CardDescription>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Customer</TableHead>
                            <TableHead>Package</TableHead>
                            <TableHead>Next Service</TableHead>
                            <TableHead>Days Left</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Action</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {servicesAtRisk.map((service) => (
                            <TableRow key={service.id}>
                                <TableCell>{service.customer}</TableCell>
                                <TableCell>{service.package}</TableCell>
                                <TableCell>{service.nextService}</TableCell>
                                <TableCell>
                                    <span
                                        className={`font-semibold ${service.status === 'Critical' ? 'text-red-600' : 'text-yellow-600'}`}>
                                        {service.daysLeft}
                                    </span>
                                </TableCell>
                                <TableCell>
                                    <span
                                        className={`px-2 py-0.5 border rounded-full font-semibold ${service.status === 'Critical' ? 'text-red-600 border-red-400 bg-red-100' : 'text-yellow-600 border-yellow-400 bg-yellow-100'}`}>
                                        {service.status}
                                    </span>
                                </TableCell>
                                <TableCell>
                                    <Button variant={"outline"} size={"sm"}>
                                        {service.action}
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                <Button variant={"outline"} className="w-full mt-4 cursor-pointer">View all services</Button>
            </CardContent>
        </Card>
    );
}