
import {
  IconBuildingBridge2,
  IconDatabase,
  IconSettings,
  IconUsers,
} from "@tabler/icons-react";
import { auth } from "@auth";
import { toast } from "sonner";
import { UserList } from "@/components";
import { redirect } from "next/navigation";
import { getUsers } from "@/actions";

const permissions = [
  {
    category: "User Management",
    icon: IconUsers,
    permissions: [
      { id: "users.view", label: "View users" },
      { id: "users.create", label: "Create users" },
      { id: "users.edit", label: "Edit users" },
      { id: "users.delete", label: "Delete users" },
    ],
  },
  {
    category: "Organization",
    icon: IconBuildingBridge2,
    permissions: [
      { id: "org.settings", label: "Manage organization settings" },
      { id: "org.billing", label: "Access billing" },
      { id: "org.teams", label: "Manage teams" },
    ],
  },
  {
    category: "Data Access",
    icon: IconDatabase,
    permissions: [
      { id: "data.read", label: "Read data" },
      { id: "data.write", label: "Write data" },
      { id: "data.delete", label: "Delete data" },
      { id: "data.share", label: "Share data" },
    ],
  },
  {
    category: "System Settings",
    icon: IconSettings,
    permissions: [
      { id: "settings.view", label: "View settings" },
      { id: "settings.edit", label: "Edit settings" },
      { id: "settings.security", label: "Manage security" },
    ],
  },
];

export default async function ProfilePage() {
  const session = await auth();
  if (!session) {
    redirect("/login");
  }
  const userSession = session?.user;

  const { users, ok, message } = await getUsers(10, 0);

  if (!ok) {
    toast.error(message, {
      position: "top-right",
      richColors: true,
    });
  }


  return (
    <div className="container mx-auto px-4 py-6 md:px-6 2xl:max-w-[1400px]">
      <div className="max-w-4xl grid grid-cols-2 gap-4">
        <div className="rounded-md border p-6">
          <h1 className="text-2xl font-bold mb-4">Users</h1>
          {
            users && users.length > 0 ? (
              <UserList users={users} sessionId={userSession.id!} />
            ) : (
              <p>No users found</p>
            )
          }
        </div>
      </div>
    </div>
  );
}
