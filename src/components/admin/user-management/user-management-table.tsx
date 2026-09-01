import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs";
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "@/components/ui/card";
import UserManagementTablePagination from "@/components/admin/user-management/user-management-table-pagination";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import {Button} from "@/components/ui/button";
import {Clock4, Eye, Shield, SquarePen, Trash2} from "lucide-react";
import {Tooltip, TooltipContent, TooltipTrigger} from "@/components/ui/tooltip";

interface User {
    userId: number;
    name: string;
    email: string;
    phone: string;
    role: string;
    status: string;
    lastLogin: string;
    createdDate: string;
    department: string;
    permissions: string[];
}

interface RenderUsersProps {
    usersData: User[];
    handleUserDetails: (user: User) => void;
    handleEditUserDetails: (user: User) => void;
    handleManageUserRole: (user: User) => void;
}


const users: User[] = [
    {
        userId: 1,
        name: "Rajesh Kumar",
        email: "rajesh.kumar@pestcontrol.com",
        phone: "+91 98765 43210",
        role: "Administrator",
        status: "Active",
        lastLogin: "2024-01-15 10:30 AM",
        createdDate: "2023-06-01",
        department: "Management",
        permissions: ["All Access"]
    },
    {
        userId: 2,
        name: "Priya Sharma",
        email: "priya.sharma@pestcontrol.com",
        phone: "+91 98765 43211",
        role: "Sales Manager",
        status: "Active",
        lastLogin: "2024-01-14 03:45 PM",
        createdDate: "2023-07-15",
        department: "Sales",
        permissions: ["Customer Management", "Sales Operations", "Reports"]
    },
    {
        userId: 3,
        name: "Amit Patel",
        email: "amit.patel@pestcontrol.com",
        phone: "+91 98765 43212",
        role: "Agent",
        status: "Active",
        lastLogin: "2024-01-14 09:15 AM",
        createdDate: "2023-08-20",
        department: "Operations",
        permissions: ["Service Management", "Basic Reports"]
    },
    {
        userId: 4,
        name: "Sneha Reddy",
        email: "sneha.reddy@pestcontrol.com",
        phone: "+91 98765 43213",
        role: "Sales Manager",
        status: "Inactive",
        lastLogin: "2023-12-28 02:20 PM",
        createdDate: "2023-05-10",
        department: "Sales",
        permissions: ["Customer Management", "Sales Operations"]
    },
    {
        userId: 5,
        name: "Vikram Singh",
        email: "vikram.singh@pestcontrol.com",
        phone: "+91 98765 43214",
        role: "Agent",
        status: "Pending",
        lastLogin: "Never",
        createdDate: "2024-01-10",
        department: "Operations",
        permissions: ["Service Management"]
    }
];

const getRoleColor = (role: string) => {
    switch (role) {
        case 'Administrator':
            return 'text-purple-600 border-purple-400 bg-purple-100'
        case 'Sales Manager':
            return 'text-pink-600 border-pink-400 bg-pink-100'
        case 'Agent':
            return 'text-blue-600 border-blue-400 bg-blue-100'
        case 'Customer':
            return 'text-gray-600 border-gray-400 bg-gray-100'
        default:
            return 'text-gray-600 border-gray-400 bg-gray-100'
    }
}

const getStatusColor = (status: string) => {
    switch (status) {
        case 'Active':
            return 'text-green-600 border-green-400 bg-green-100'
        case 'Pending':
            return 'text-yellow-600 border-yellow-400 bg-yellow-100'
        case 'Inactive':
            return 'text-red-600 border-red-400 bg-red-100'
        default:
            return 'text-red-600 border-red-400 bg-red-100'
    }
}

const renderUsers = ({ usersData, handleUserDetails, handleEditUserDetails, handleManageUserRole }: RenderUsersProps) => {
    if (usersData.length === 0) {
        return <p>No Users match the current filters.</p>;
    }
    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead className="align-top text-wrap whitespace-normal">User details</TableHead>
                    <TableHead className="align-top text-wrap whitespace-normal">Contact information</TableHead>
                    <TableHead className="align-top text-wrap whitespace-normal">Role and Department</TableHead>
                    <TableHead className="align-top text-wrap whitespace-normal">Status</TableHead>
                    <TableHead className="align-top text-wrap whitespace-normal">Last login</TableHead>
                    <TableHead className="align-top text-wrap whitespace-normal">Actions</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {users.map((user) => (
                    <TableRow key={user.userId}>
                        <TableCell>
                            <div className="flex flex-col">
                                <span className="font-semibold">{user.userId}</span>
                                <span className="text-wrap whitespace-normal">{user.name}</span>
                            </div>
                        </TableCell>
                        <TableCell>
                            <div className="flex flex-col">
                                <span className="font-semibold">{user.email}</span>
                                <span className="text-wrap whitespace-normal">{user.phone}</span>
                            </div>
                        </TableCell>
                        <TableCell>
                            <span
                                className={`px-2 py-0.5 border rounded-full font-semibold ${getRoleColor(user.role)}`}>
                                {user.role}
                            </span>
                        </TableCell>
                        <TableCell>
                            <span
                                className={`px-2 py-0.5 border rounded-full font-semibold ${getStatusColor(user.status)}`}>
                                {user.status}
                            </span>
                        </TableCell>
                        <TableCell className={"flex gap-1 items-center"}><Clock4 size={14}/>{user.lastLogin}</TableCell>
                        <TableCell>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button variant={"outline"} size={"sm"}
                                            className={"hover:bg-blue-500 hover:text-white"}
                                            onClick={()=> handleUserDetails(user)}>
                                        <Eye/>
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>User details</p>
                                </TooltipContent>
                            </Tooltip>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button variant={"outline"} size={"sm"}
                                            className="ml-1 hover:bg-blue-500 hover:text-white"
                                            onClick={()=> handleEditUserDetails(user)}>
                                        <SquarePen/>
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>Edit user details</p>
                                </TooltipContent>
                            </Tooltip>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button variant={"outline"} size={"sm"}
                                            className="ml-1 hover:bg-green-500 hover:text-white"
                                            onClick={()=> handleManageUserRole(user)}>
                                        <Shield/>
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>Manage user permissions</p>
                                </TooltipContent>
                            </Tooltip>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button variant={"outline"} size={"sm"}
                                            className="ml-1 text-red-500 hover:bg-red-500 hover:text-white">
                                        <Trash2/>
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>Permanently delete user</p>
                                </TooltipContent>
                            </Tooltip>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    )
}

interface UserManagementTableProps {
    handleUserDetails: (user: User) => void;
    handleEditUserDetails: (user: User) => void;
    handleManageUserRole: (user: User) => void; // Renamed from handleManageUserPermissions for consistency
}

export default function UserManagementTable({handleUserDetails, handleEditUserDetails, handleManageUserRole}: UserManagementTableProps) {
    const renderUsersArgs: RenderUsersProps = {
        usersData: users,
        handleUserDetails: handleUserDetails,
        handleEditUserDetails: handleEditUserDetails,
        handleManageUserRole: handleManageUserRole
    }

    return (
        <Tabs defaultValue="all-users" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="all-users" className="cursor-pointer">All contracts</TabsTrigger>
                <TabsTrigger value="active-users" className="cursor-pointer">Active contracts</TabsTrigger>
                <TabsTrigger value="inactive-users" className="cursor-pointer">Payment pending</TabsTrigger>
                <TabsTrigger value="pending-users" className="cursor-pointer">Expiring soon</TabsTrigger>
            </TabsList>
            <TabsContent value="all-users">
                <Card>
                    <CardHeader>
                        <CardTitle>All system Users</CardTitle>
                        <CardDescription>
                            Complete list of all users in the system
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {renderUsers(renderUsersArgs)}
                    </CardContent>
                    <CardFooter>
                        <UserManagementTablePagination/>
                    </CardFooter>
                </Card>
            </TabsContent>

            <TabsContent value="active-users">
                <Card>
                    <CardHeader>
                        <CardTitle>Active users</CardTitle>
                        <CardDescription>
                            Users who are currently active in the system
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {renderUsers(renderUsersArgs)}
                    </CardContent>
                    <CardFooter>
                        <UserManagementTablePagination/>
                    </CardFooter>
                </Card>
            </TabsContent>

            <TabsContent value={"inactive-users"}>
                <Card>
                    <CardHeader>
                        <CardTitle>Inactive Users</CardTitle>
                        <CardDescription>
                            Users who have been deactivated or suspended
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {renderUsers(renderUsersArgs)}
                    </CardContent>
                    <CardFooter>
                        <UserManagementTablePagination/>
                    </CardFooter>
                </Card>
            </TabsContent>

            <TabsContent value={"pending-users"}>
                <Card>
                    <CardHeader>
                        <CardTitle>Pending Users</CardTitle>
                        <CardDescription>
                            New users awaiting activation or approval
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {renderUsers(renderUsersArgs)}
                    </CardContent>
                    <CardFooter>
                        <UserManagementTablePagination/>
                    </CardFooter>
                </Card>
            </TabsContent>
        </Tabs>
    )
}