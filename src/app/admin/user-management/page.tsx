import { getStaffUsers } from "@/lib/db/queries";
import UserManagementClient from "./user-management-client";

export default async function UserManagement() {
  const users = await getStaffUsers();
  return <UserManagementClient users={users} />;
}
