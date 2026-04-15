'use client'

import { Card, CardContent } from '@/components/ui/card'
import { SelectTrigger, SelectValue, SelectContent, SelectItem, Select } from './ui/select'

import { toast } from 'sonner';

interface Props {
  selectedRole: string;
  onRoleChange?: (role: string) => Promise<{ ok: boolean; message?: string }>;
}

const ROLES = [
  { value: 'admin', label: 'Admin' },
  { value: 'user', label: 'User' },
]

const RoleSelector = ({ selectedRole, onRoleChange }: Props) => {
  const handleChange = async (role: string) => {
    if (onRoleChange) {
      const { ok, message } = await onRoleChange(role);
      if (!ok) {
        toast.error(message || "Failed to update role");
        return;
      }
      toast.success("Role updated successfully");
    } else {
      console.log(role)
    }
  }

  return (
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
            <Select defaultValue={selectedRole} onValueChange={handleChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent>
                {
                  ROLES.map((role) => (
                    <SelectItem key={role.value} value={role.value.toUpperCase()}>
                      {role.label}
                    </SelectItem>
                  ))
                }
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default RoleSelector
