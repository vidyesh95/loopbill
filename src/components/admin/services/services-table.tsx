"use client";

import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs";
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "@/components/ui/card";
import FilterByServiceType from "@/components/admin/services/filter-by-service-type";
import {useState} from "react";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import {Button} from "@/components/ui/button";
import ServicesTablePagination from "@/components/admin/services/services-table-pagination";
import type {ServiceRow} from "@/lib/data/types";

const allServices: ServiceRow[] = [
    {
        id: 1,
        customer: 'Amit Sharma',
        serviceType: 'Cockroach control',
        date: 'May 11, 2025',
        agent: 'Raj Kumar',
        status: 'Completed',
        location: "Building A, Flat 304",
        phone: "+91 9876543210",
        amount: "₹2,500"
    },
    {
        id: 2,
        customer: 'Priya Patel',
        serviceType: 'Rodent control',
        date: 'May 11, 2025',
        agent: 'Sanjay Singh',
        status: 'Completed',
        location: "Building C, Flat 101",
        phone: "+91 9876543211",
        amount: "₹3,000"
    },
    {
        id: 3,
        customer: 'Neha Kapoor',
        serviceType: 'Mosquito control',
        date: 'May 11, 2025',
        agent: 'Raj Kumar',
        status: 'Completed',
        location: "Building D, Flat 203",
        phone: "+91 9876543212",
        amount: "₹2,000"
    },
    {
        id: 4,
        customer: 'Vikram Malhotra',
        serviceType: 'Termite control',
        date: 'May 11, 2025',
        agent: 'Anita Desai',
        status: 'In progress',
        location: "Building B, Flat 502",
        phone: "+91 9876543213",
        amount: "₹4,000"
    },
    {
        id: 5,
        customer: 'Rahul Verma',
        serviceType: 'Ant control',
        date: 'May 11, 2025',
        agent: 'Raj Kumar',
        status: 'Scheduled',
        location: "Building B, Flat 303",
        phone: "+91 9876543214",
        amount: "₹2,200"
    },
    {
        id: 6,
        customer: 'Suresh Menon',
        serviceType: 'Mosquito treatment',
        date: 'May 29, 2025',
        agent: 'Unassigned',
        status: 'Unscheduled',
        location: "Building E, Flat 105",
        phone: "+91 9876543215",
        amount: "₹0"
    },
    {
        id: 7,
        customer: 'Ananya Singh',
        serviceType: 'Basic pest control',
        date: 'June 1, 2025',
        agent: 'Unassigned',
        status: 'Unscheduled',
        location: "Building F, Flat 201",
        phone: "+91 9876543216",
        amount: "₹4,000"
    },
    {
        id: 8,
        customer: 'Rahul Verma',
        serviceType: 'Ant control',
        date: 'June 1, 2025',
        agent: 'Unassigned',
        status: 'Unscheduled',
        location: "Building G, Flat 302",
        phone: "+91 9876543217",
        amount: "₹2,000"
    },
    {
        id: 9,
        customer: 'Suresh Menon',
        serviceType: 'Mosquito treatment',
        date: 'June 1, 2025',
        agent: 'Sanjay Singh',
        status: 'Redo required',
        location: "Building H, Flat 401",
        phone: "+91 9876543218",
        amount: "₹0"
    },
    {
        id: 10,
        customer: 'Ananya Singh',
        serviceType: 'General pest control',
        date: 'April 1, 2025',
        agent: 'Raj Kumar',
        status: 'Expired',
        location: "Building I, Flat 503",
        phone: "+91 9876543219",
        amount: "₹0"
    },
    {
        id: 11,
        customer: 'Rahul Verma',
        serviceType: 'Ant control',
        date: 'July 1, 2025',
        agent: 'Raj Kumar',
        status: 'Redo required',
        location: "Building J, Flat 602",
        phone: "+91 9876543220",
        amount: "₹1000"
    },
    {
        id: 12,
        customer: 'Suresh Menon',
        serviceType: 'Mosquito treatment',
        date: 'July 10, 2025',
        agent: 'Sanjay Singh',
        status: 'Redo required',
        location: "Building K, Flat 701",
        phone: "+91 9876543221",
        amount: "₹3000"
    }
]

const getStatusColor = (status: string) => {
    switch (status) {
        case 'Scheduled':
            return 'text-yellow-600 border-yellow-400 bg-yellow-100'
        case 'In progress':
            return 'text-blue-600 border-blue-400 bg-blue-100'
        case 'Unscheduled':
            return 'text-orange-600 border-orange-400 bg-orange-100'
        case 'Redo required':
            return 'text-red-600 border-red-400 bg-red-100'
        case 'Completed':
            return 'text-green-600 border-green-400 bg-green-100'
        case 'Expired':
            return 'text-gray-600 border-gray-400 bg-gray-100'
        default:
            return 'text-gray-600 border-gray-400 bg-gray-100'
    }
}

function filterServicesStatus(services: ServiceRow[], status: string) {
    switch (status) {
        case 'upcoming-services':
            return services.filter((service) => service.status === 'Scheduled' || service.status === 'In progress' || service.status === 'Unscheduled')
        case 'completed-services':
            return services.filter((service) => service.status === 'Completed')
        case 'redo-services':
            return services.filter((service) => service.status === 'Redo required')
        case 'expired-services':
            return services.filter((service) => service.status === 'Expired')
        default:
            return services
    }
}

const renderServices = (services: {
    id: number;
    customer: string;
    serviceType: string;
    date: string;
    agent: string;
    status: string;
}[]) => {
    if (services.length === 0) {
        return <p>No services match the current filters.</p>;
    }

    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Id</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Service Type</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Agent</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Action</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {services.map((service) => (
                    <TableRow key={service.id}>
                        <TableCell>{service.id}</TableCell>
                        <TableCell>{service.customer}</TableCell>
                        <TableCell>{service.serviceType}</TableCell>
                        <TableCell>{service.date}</TableCell>
                        <TableCell>{service.agent}</TableCell>
                        <TableCell>
                            <span
                                className={`px-2 py-0.5 border rounded-full font-semibold ${getStatusColor(service.status)}`}>{service.status}
                            </span>
                        </TableCell>
                        <TableCell><Button variant={"outline"} size={"sm"}>View details</Button></TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
}

export default function ServicesTable({services = allServices}: {services?: ServiceRow[]}) {
    // State for the 'upcoming-services' tab's service type filter
    const [upcomingSelectedServiceType, setUpcomingSelectedServiceType] = useState<string>("all");
    // Add similar states for other tabs if they need independent filtering
    const [allServicesSelectedServiceType, setAllServicesSelectedServiceType] = useState<string>("all");
    const [completedSelectedServiceType, setCompletedSelectedServiceType] = useState<string>("all");
    const [redoSelectedServiceType, setRedoSelectedServiceType] = useState<string>("all");
    const [expiredSelectedServiceType, setExpiredSelectedServiceType] = useState<string>("all");


    // Logic for 'all-services' tab
    const allServicesByStatus = filterServicesStatus(services, 'all-services');
    const allServicesFilteredByType = allServicesSelectedServiceType === "all"
        ? allServicesByStatus
        : allServicesByStatus.filter(service => service.serviceType === allServicesSelectedServiceType);

    // Logic for 'upcoming-services' tab
    const upcomingServicesByStatus = filterServicesStatus(services, 'upcoming-services');
    const upcomingServicesFilteredByType = upcomingSelectedServiceType === "all"
        ? upcomingServicesByStatus
        : upcomingServicesByStatus.filter(service => service.serviceType === upcomingSelectedServiceType);

    // Logic for 'completed-services' tab
    const completedServicesByStatus = filterServicesStatus(services, 'completed-services');
    const completedServicesFilteredByType = completedSelectedServiceType === "all"
        ? completedServicesByStatus
        : completedServicesByStatus.filter(service => service.serviceType === completedSelectedServiceType);

    // Logic for 'redo-services' tab
    const redoServicesByStatus = filterServicesStatus(services, 'redo-services');
    const redoServicesFilteredByType = redoSelectedServiceType === "all"
        ? redoServicesByStatus
        : redoServicesByStatus.filter(service => service.serviceType === redoSelectedServiceType);

    // Logic for 'expired-services' tab
    const expiredServicesByStatus = filterServicesStatus(services, 'expired-services');
    const expiredServicesFilteredByType = expiredSelectedServiceType === "all"
        ? expiredServicesByStatus
        : expiredServicesByStatus.filter(service => service.serviceType === expiredSelectedServiceType);

    return (
        <Tabs defaultValue="all-services" className="w-full">
            <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="all-services" className="cursor-pointer">All services</TabsTrigger>
                <TabsTrigger value="upcoming-services" className="cursor-pointer">Upcoming services</TabsTrigger>
                <TabsTrigger value="completed-services" className="cursor-pointer">Completed services</TabsTrigger>
                <TabsTrigger value="redo-services" className="cursor-pointer">Redo services</TabsTrigger>
                <TabsTrigger value="expired-services" className="cursor-pointer">Expired services</TabsTrigger>
            </TabsList>
            <TabsContent value="all-services">
                <Card>
                    <CardHeader>
                        <CardTitle>All services</CardTitle>
                        <CardDescription>
                            View and manage all pest control services
                        </CardDescription>
                        <FilterByServiceType
                            value={allServicesSelectedServiceType}
                            onValueChange={setAllServicesSelectedServiceType}
                        />
                    </CardHeader>
                    <CardContent>
                        {renderServices(allServicesFilteredByType)}
                    </CardContent>
                    <CardFooter>
                        <ServicesTablePagination/>
                    </CardFooter>
                </Card>
            </TabsContent>

            <TabsContent value="upcoming-services">
                <Card>
                    <CardHeader>
                        <CardTitle>Upcoming services</CardTitle>
                        <CardDescription>
                            Services scheduled or in progress
                        </CardDescription>
                        <FilterByServiceType
                            value={upcomingSelectedServiceType}
                            onValueChange={setUpcomingSelectedServiceType}
                        />
                    </CardHeader>
                    <CardContent>
                        {renderServices(upcomingServicesFilteredByType)}
                    </CardContent>
                    <CardFooter>
                        <ServicesTablePagination/>
                    </CardFooter>
                </Card>
            </TabsContent>

            <TabsContent value={"completed-services"}>
                <Card>
                    <CardHeader>
                        <CardTitle>Completed services</CardTitle>
                        <CardDescription>
                            Services that have been completed successfully
                        </CardDescription>
                        <FilterByServiceType
                            value={completedSelectedServiceType}
                            onValueChange={setCompletedSelectedServiceType}
                        />
                    </CardHeader>
                    <CardContent>
                        {renderServices(completedServicesFilteredByType)}
                    </CardContent>
                    <CardFooter>
                        <ServicesTablePagination/>
                    </CardFooter>
                </Card>
            </TabsContent>

            <TabsContent value={"redo-services"}>
                <Card>
                    <CardHeader>
                        <CardTitle>Redo services</CardTitle>
                        <CardDescription>
                            Services that need to be redone due to complaints
                        </CardDescription>
                        <FilterByServiceType
                            value={redoSelectedServiceType}
                            onValueChange={setRedoSelectedServiceType}
                        />
                    </CardHeader>
                    <CardContent>
                        {renderServices(redoServicesFilteredByType)}
                    </CardContent>
                    <CardFooter>
                        <ServicesTablePagination/>
                    </CardFooter>
                </Card>
            </TabsContent>

            <TabsContent value={"expired-services"}>
                <Card>
                    <CardHeader>
                        <CardTitle>Expired services</CardTitle>
                        <CardDescription>
                            Services that have expired without completion
                        </CardDescription>
                        <FilterByServiceType
                            value={expiredSelectedServiceType}
                            onValueChange={setExpiredSelectedServiceType}
                        />
                    </CardHeader>
                    <CardContent>
                        {renderServices(expiredServicesFilteredByType)}
                    </CardContent>
                    <CardFooter>
                        <ServicesTablePagination/>
                    </CardFooter>
                </Card>
            </TabsContent>
        </Tabs>
    )
}