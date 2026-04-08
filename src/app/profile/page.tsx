import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  IconBuildingBridge2,
  IconDatabase,
  IconPencil,
  IconSettings,
  IconStarFilled,
  IconUser,
  IconUsers,
} from "@tabler/icons-react";
import { auth } from "@auth";
import { getUserByEmail } from "@/actions";

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

export default async function UserPermissions() {
  //TODO: Pedir tambien username por parametro url para hacer la busqueda en la base de datos
  const session = await auth();
  const userSession = session?.user;

  const { user, ok, message } = await getUserByEmail(userSession?.email!);

  if (!ok) {
    return <div>{message}</div>;
  }

  return (
    <div className="container mx-auto px-4 py-6 md:px-6 2xl:max-w-[1400px]">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-6 flex flex-col items-start justify-between gap-4 sm:flex-row">
          <div className="flex items-center gap-4">
            <Avatar className="size-18 border-4 border-green-300">
              <AvatarImage
                src={user?.image ?? "https://github.com/shadcn.png"}
                alt="User"
              />
              <AvatarFallback>{user?.name?.charAt(0)}</AvatarFallback>
              <Badge
                variant="default"
                className="absolute left-1/2 bottom-0 -translate-x-1/2 translate-y-2"
              >
                lvl {user?.level}
              </Badge>
            </Avatar>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-semibold">{user?.username}</h1>
                <Badge variant="secondary">Polluelo</Badge>
              </div>
              <p className="text-muted-foreground text-sm flex items-center gap-2">
                <IconStarFilled className="size-3" />
                <span>Exp: {user?.exp} pts</span>
              </p>
            </div>
          </div>
          {userSession!.id === user!.id ? (
            <Button>
              <IconPencil className="mr-2 size-4" />
              Edit Profile
            </Button>
          ) : (
            <Button variant="default">
              <IconUser className="mr-2 size-4" />
              Follow
            </Button>
          )}
        </div>

        {/* Role Selector */}
        <Card className="mb-6 p-0">
          <CardContent className="p-6">
            <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
              <div className="space-y-1">
                <h2 className="text-lg font-semibold">Role Assignment</h2>
                <p className="text-muted-foreground text-sm">
                  Select a predefined role or customize permissions below
                </p>
              </div>
              <div className="w-[200px]">
                <Select defaultValue="admin">
                  <SelectTrigger>
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Administrator</SelectItem>
                    <SelectItem value="manager">Manager</SelectItem>
                    <SelectItem value="editor">Editor</SelectItem>
                    <SelectItem value="viewer">Viewer</SelectItem>
                    <SelectItem value="custom">Custom</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Permissions Grid */}
        <div className="space-y-6">
          {permissions.map((section) => {
            const Icon = section.icon;
            return (
              <Card key={section.category} className="p-0">
                <CardContent className="p-6">
                  <div className="mb-4 flex items-center gap-2">
                    <Icon className="text-muted-foreground size-5" />
                    <h2 className="text-lg font-semibold">
                      {section.category}
                    </h2>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    {section.permissions.map((permission) => (
                      <div
                        key={permission.id}
                        className="flex items-center space-x-2"
                      >
                        <Checkbox id={permission.id} />
                        <Label
                          htmlFor={permission.id}
                          className="text-sm font-normal"
                        >
                          {permission.label}
                        </Label>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Access History */}
        <Card className="mt-6 p-0">
          <CardContent className="p-6">
            <h2 className="mb-4 text-lg font-semibold">
              Recent Access Changes
            </h2>
            <div className="space-y-4">
              {[
                {
                  action: "Role changed to Administrator",
                  by: "Sarah Chen",
                  date: "2 hours ago",
                },
                {
                  action: "Added Data Management permissions",
                  by: "Mike Wilson",
                  date: "1 day ago",
                },
                {
                  action: "Removed Billing access",
                  by: "System Audit",
                  date: "3 days ago",
                },
              ].map((log, i) => (
                <div
                  key={i}
                  className="flex flex-col items-start justify-between border-b py-2 last:border-0 sm:flex-row sm:items-center"
                >
                  <div>
                    <p className="text-sm font-medium">{log.action}</p>
                    <p className="text-muted-foreground text-sm">By {log.by}</p>
                  </div>
                  <span className="text-muted-foreground text-sm">
                    {log.date}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
