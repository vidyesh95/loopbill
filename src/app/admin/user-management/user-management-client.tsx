"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Download, UserPlus } from "lucide-react";
import AddNewUserModal from "@/components/admin/user-management/add-new-user-modal";
import UserManagementTable from "@/components/admin/user-management/user-management-table";
import UserDetailsModal from "@/components/admin/user-management/user-details-modal";
import EditUserDetailsModal from "@/components/admin/user-management/edit-user-details-modal";
import ManageUserRoleModal from "@/components/admin/user-management/manage-user-role-modal";
import type { StaffUserRow } from "@/lib/data/types";

export default function UserManagementClient({ users }: { users: StaffUserRow[] }) {
  const [isAddNewUserOpen, setIsAddNewUserOpen] = useState(false);
  const [isUserDetailsModalOpen, setIsUserDetailsModalOpen] = useState(false);
  const [isEditUserDetailsModalOpen, setIsEditUserDetailsModalOpen] = useState(false);
  const [isManageUserRoleModalOpen, setIsManageUserRoleModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<StaffUserRow | null>(null);

  return (
    <main className="flex w-full flex-col gap-4">
      <div className="flex flex-col items-start justify-between gap-2 md:flex-row md:items-center">
        <div>
          <h1 className="text-2xl font-bold md:text-3xl">User management</h1>
          <p className="text-muted-foreground">
            Manage system users, roles, permissions, and access control
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="cursor-pointer">
            <Download />
            Export users
          </Button>
          <Button className="cursor-pointer" onClick={() => setIsAddNewUserOpen(true)}>
            <UserPlus />
            Add new user
          </Button>
        </div>
      </div>
      <UserManagementTable
        users={users}
        handleUserDetails={(user) => {
          setSelectedUser(user);
          setIsUserDetailsModalOpen(true);
        }}
        handleEditUserDetails={(user) => {
          setSelectedUser(user);
          setIsEditUserDetailsModalOpen(true);
        }}
        handleManageUserRole={(user) => {
          setSelectedUser(user);
          setIsManageUserRoleModalOpen(true);
        }}
      />

      <AddNewUserModal isOpen={isAddNewUserOpen} onClose={() => setIsAddNewUserOpen(false)} />

      {selectedUser ? (
        <>
          <UserDetailsModal
            isOpen={isUserDetailsModalOpen}
            onClose={() => setIsUserDetailsModalOpen(false)}
            user={selectedUser}
          />
          <EditUserDetailsModal
            isOpen={isEditUserDetailsModalOpen}
            onClose={() => setIsEditUserDetailsModalOpen(false)}
            user={selectedUser}
          />
          <ManageUserRoleModal
            isOpen={isManageUserRoleModalOpen}
            onClose={() => setIsManageUserRoleModalOpen(false)}
            user={selectedUser}
          />
        </>
      ) : null}
    </main>
  );
}
