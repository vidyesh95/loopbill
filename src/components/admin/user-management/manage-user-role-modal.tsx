
import { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Shield, Save } from "lucide-react";
import { toast } from "sonner";

interface ManageUserRoleModalProps {
    isOpen: boolean;
    onClose: (open: boolean) => void;
    user: any;
}

const availablePermissions = [
    { id: 'dashboard', name: 'Dashboard Access', description: 'View main dashboard and overview' },
    { id: 'users', name: 'User Management', description: 'Create, edit, and manage users' },
    { id: 'customers', name: 'Customer Management', description: 'Manage customer information and accounts' },
    { id: 'services', name: 'Service Management', description: 'Schedule and manage pest control services' },
    { id: 'reports', name: 'Reports & Analytics', description: 'Generate and view business reports' },
    { id: 'settings', name: 'System Settings', description: 'Configure system-wide settings' },
    { id: 'complaints', name: 'Complaint Handling', description: 'Manage customer complaints and feedback' },
    { id: 'notifications', name: 'Send Notifications', description: 'Send notifications to customers and staff' },
    { id: 'contracts', name: 'Contract Management', description: 'Manage customer contracts and agreements' },
    { id: 'billing', name: 'Billing & Payments', description: 'Handle billing and payment processing' },
];

function getRolePermissions(role: string | undefined) {
    const rolePermissions: Record<string, boolean> = {};

    if (role === 'Administrator') {
        availablePermissions.forEach(perm => {
            rolePermissions[perm.id] = true;
        });
    } else if (role === 'Sales Manager') {
        ['dashboard', 'customers', 'services', 'reports', 'complaints', 'notifications', 'contracts'].forEach(id => {
            rolePermissions[id] = true;
        });
    } else if (role === 'Agent') {
        ['dashboard', 'services', 'complaints'].forEach(id => {
            rolePermissions[id] = true;
        });
    }

    return rolePermissions;
}

const ManageUserRoleModal = ({ isOpen, onClose, user }: ManageUserRoleModalProps) => {
    const [permissions, setPermissions] = useState<Record<string, boolean>>(
        () => getRolePermissions(user?.role)
    );
    const [currentUser, setCurrentUser] = useState(user);

    if (user !== currentUser) {
        setCurrentUser(user);
        setPermissions(getRolePermissions(user?.role));
    }

    const handlePermissionChange = (permissionId: string, checked: boolean) => {
        setPermissions(prev => ({
            ...prev,
            [permissionId]: checked
        }));
    };

    const handleSubmit = () => {
        // Here you would typically make an API call to update user permissions
        console.log("Updating permissions for user:", user?.id, permissions);

        toast.success("Success",{description: "User permissions updated successfully",});

        onClose(false);
    };

    if (!user) return null;

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-175">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Shield className="h-5 w-5 text-google-blue" />
                        Manage Permissions: {user.name}
                    </DialogTitle>
                    <DialogDescription>
                        Configure specific permissions for this user ({user.role})
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4">
                    <div className="bg-blue-50 p-4 rounded-lg">
                        <h4 className="font-medium text-sm mb-2">Current Role: {user.role}</h4>
                        <p className="text-xs text-muted-foreground">
                            Permissions shown below are in addition to the base permissions for this role.
                        </p>
                    </div>

                    <div className="space-y-4 max-h-100 overflow-y-auto">
                        <h4 className="font-medium">Available Permissions</h4>
                        {availablePermissions.map((permission) => (
                            <div key={permission.id} className="flex items-start space-x-3 p-3 border rounded-lg">
                                <Checkbox
                                    id={permission.id}
                                    checked={permissions[permission.id] || false}
                                    onCheckedChange={(checked) => handlePermissionChange(permission.id, !!checked)}
                                />
                                <div className="flex-1">
                                    <label
                                        htmlFor={permission.id}
                                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                                    >
                                        {permission.name}
                                    </label>
                                    <p className="text-xs text-muted-foreground mt-1">
                                        {permission.description}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="bg-yellow-50 p-4 rounded-lg">
                        <h4 className="font-medium text-sm mb-2">Permission Summary:</h4>
                        <div className="text-xs text-muted-foreground">
                            <div><span className="font-medium">Active Permissions:</span> {Object.values(permissions).filter(Boolean).length}</div>
                            <div><span className="font-medium">Total Available:</span> {availablePermissions.length}</div>
                        </div>
                    </div>
                </div>

                <div className="flex gap-3 pt-4">
                    <Button variant="outline" onClick={() => onClose(false)} className="flex-1">
                        Cancel
                    </Button>
                    <Button onClick={handleSubmit} className="flex-1">
                        <Save className="mr-2 h-4 w-4" />
                        Save Permissions
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default ManageUserRoleModal;