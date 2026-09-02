import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye, Mail, Phone, Calendar, Clock, Shield, Building, User } from "lucide-react";
import type { StaffUserRow } from "@/lib/data/types";

interface UserDetailsModalProps {
  isOpen: boolean;
  onClose: (open: boolean) => void;
  user: StaffUserRow | null;
}

const UserDetailsModal = ({ isOpen, onClose, user }: UserDetailsModalProps) => {
  if (!user) return null;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Active":
        return <Badge className="border-green-200 bg-green-100 text-green-800">Active</Badge>;
      case "Inactive":
        return <Badge className="border-red-200 bg-red-100 text-red-800">Inactive</Badge>;
      case "Pending":
        return <Badge className="border-yellow-200 bg-yellow-100 text-yellow-800">Pending</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case "Administrator":
        return (
          <Badge className="border-purple-200 bg-purple-100 text-purple-800">Administrator</Badge>
        );
      case "Sales Manager":
        return <Badge className="border-blue-200 bg-blue-100 text-blue-800">Sales Manager</Badge>;
      case "Agent":
        return <Badge className="border-gray-200 bg-gray-100 text-gray-800">Agent</Badge>;
      default:
        return <Badge variant="outline">{role}</Badge>;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Eye className="text-google-blue h-5 w-5" />
            User Details: {user.name}
          </DialogTitle>
          <DialogDescription>
            Comprehensive view of user information and permissions
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="flex items-center gap-2 text-lg font-semibold">
              <User className="h-5 w-5" />
              Basic Information
            </h3>
            <div className="grid grid-cols-2 gap-4 rounded-lg bg-gray-50 p-4">
              <div>
                <p className="text-sm font-medium text-gray-600">Full Name</p>
                <p className="text-sm font-medium">{user.name}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">User ID</p>
                <p className="text-sm font-medium">{user.id}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Email Address</p>
                <p className="flex items-center gap-1 text-sm font-medium">
                  <Mail className="h-4 w-4" />
                  {user.email}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Phone Number</p>
                <p className="flex items-center gap-1 text-sm font-medium">
                  <Phone className="h-4 w-4" />
                  {user.phone}
                </p>
              </div>
            </div>
          </div>

          {/* Role & Department */}
          <div className="space-y-4">
            <h3 className="flex items-center gap-2 text-lg font-semibold">
              <Building className="h-5 w-5" />
              Role & Department
            </h3>
            <div className="grid grid-cols-2 gap-4 rounded-lg bg-gray-50 p-4">
              <div>
                <p className="text-sm font-medium text-gray-600">Role</p>
                <div className="mt-1">{getRoleBadge(user.role)}</div>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Department</p>
                <p className="text-sm font-medium">{user.department}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Status</p>
                <div className="mt-1">{getStatusBadge(user.status)}</div>
              </div>
            </div>
          </div>

          {/* Account Activity */}
          <div className="space-y-4">
            <h3 className="flex items-center gap-2 text-lg font-semibold">
              <Clock className="h-5 w-5" />
              Account Activity
            </h3>
            <div className="grid grid-cols-2 gap-4 rounded-lg bg-gray-50 p-4">
              <div>
                <p className="text-sm font-medium text-gray-600">Created Date</p>
                <p className="flex items-center gap-1 text-sm font-medium">
                  <Calendar className="h-4 w-4" />
                  {user.createdDate}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Last Login</p>
                <p className="flex items-center gap-1 text-sm font-medium">
                  <Clock className="h-4 w-4" />
                  {user.lastLogin}
                </p>
              </div>
            </div>
          </div>

          {/* Permissions */}
          <div className="space-y-4">
            <h3 className="flex items-center gap-2 text-lg font-semibold">
              <Shield className="h-5 w-5" />
              Permissions
            </h3>
            <div className="rounded-lg bg-gray-50 p-4">
              <div className="flex flex-wrap gap-2">
                {user.permissions.map((permission: string, index: number) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {permission}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <Button onClick={() => onClose(false)}>Close</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default UserDetailsModal;
