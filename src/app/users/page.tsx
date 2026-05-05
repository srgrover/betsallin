
import { auth } from "@auth";
import { toast } from "sonner";
import { UserList } from "@/components";
import { redirect } from "next/navigation";
import { getUsers } from "@/actions";
import { getUserById } from "@/actions/user/get-user-by-id.action";

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

  const { user, ok: okUser, message: messageUser } = await getUserById(userSession.id!);
  if (!okUser) {
    toast.error(messageUser, {
      position: "top-right",
      richColors: true,
    });
  }
  console.log(user)
  return (
    <div className="container mx-auto px-4 py-6 md:px-6 2xl:max-w-[1400px]">
      <div className="max-w-4xl grid grid-cols-2 gap-4">
        <div className="rounded-md border p-6">
          <h1 className="text-2xl font-bold mb-4">Users</h1>
          {
            users && users.length > 0 ? (
              <UserList users={users} user={user!} />
            ) : (
              <p>No users found</p>
            )
          }
        </div>
      </div>
    </div>
  );
}
