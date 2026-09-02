"use client";

import {useState} from "react";
import {createStaffUser} from "@/lib/actions/staff";
import {Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle,} from "@/components/ui/dialog";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue,} from "@/components/ui/select";
import {Save, UserPlus} from "lucide-react";
import {toast} from "sonner";

interface AddUserModalProps {
    isOpen: boolean;
    onClose: (open: boolean) => void;
}

const AddNewUserModal = ({isOpen, onClose}: AddUserModalProps) => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        role: "",
        department: "",
        password: "",
        confirmPassword: ""
    });

    const handleInputChange = (field: string, value: string) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (formData.password !== formData.confirmPassword) {
            toast.error("Error", {description: "Passwords do not match"})
            return
        }

        const result = await createStaffUser({
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            role: formData.role,
            department: formData.department,
            password: formData.password,
        });
        if (!result.ok) {
            toast.error(result.error);
            return;
        }

        toast.success("Success", {description: "User created successfully"})

        onClose(false)
        setFormData({
            name: "",
            email: "",
            phone: "",
            role: "",
            department: "",
            password: "",
            confirmPassword: ""
        });
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <UserPlus className="h-5 w-5 text-google-blue"/>
                        Add New User
                    </DialogTitle>
                    <DialogDescription>
                        Create a new user account with appropriate role and permissions
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Full Name</Label>
                            <Input
                                id="name"
                                value={formData.name}
                                onChange={(e) => handleInputChange("name", e.target.value)}
                                placeholder="Enter full name"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email">Email Address</Label>
                            <Input
                                id="email"
                                type="email"
                                value={formData.email}
                                onChange={(e) => handleInputChange("email", e.target.value)}
                                placeholder="Enter email address"
                                required
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="phone">Phone Number</Label>
                            <Input
                                id="phone"
                                value={formData.phone}
                                onChange={(e) => handleInputChange("phone", e.target.value)}
                                placeholder="+91 98765 43210"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="role">Role</Label>
                            <Select onValueChange={(value) => handleInputChange("role", value)}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select role"/>
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Administrator">Administrator</SelectItem>
                                    <SelectItem value="Sales Manager">Sales Manager</SelectItem>
                                    <SelectItem value="Agent">Agent</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="department">Department</Label>
                        <Select onValueChange={(value) => handleInputChange("department", value)}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select department"/>
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Management">Management</SelectItem>
                                <SelectItem value="Sales">Sales</SelectItem>
                                <SelectItem value="Operations">Operations</SelectItem>
                                <SelectItem value="Customer Service">Customer Service</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
                            <Input
                                id="password"
                                type="password"
                                value={formData.password}
                                onChange={(e) => handleInputChange("password", e.target.value)}
                                placeholder="Enter password"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="confirmPassword">Confirm Password</Label>
                            <Input
                                id="confirmPassword"
                                type="password"
                                value={formData.confirmPassword}
                                onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                                placeholder="Confirm password"
                                required
                            />
                        </div>
                    </div>

                    <div className="bg-blue-50 p-4 rounded-lg">
                        <h4 className="font-medium text-sm mb-2">Role Permissions:</h4>
                        <div className="space-y-1 text-xs text-muted-foreground">
                            <div><span className="font-medium">Administrator:</span> Full system access and user
                                management
                            </div>
                            <div><span className="font-medium">Sales Manager:</span> Customer management and sales
                                operations
                            </div>
                            <div><span className="font-medium">Agent:</span> Service execution and basic reporting</div>
                        </div>
                    </div>

                    <div className="flex gap-3 pt-4">
                        <Button type="button" variant="outline" onClick={() => onClose(false)} className="flex-1">
                            Cancel
                        </Button>
                        <Button type="submit" className="flex-1">
                            <Save className="mr-2 h-4 w-4"/>
                            Create User
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default AddNewUserModal;