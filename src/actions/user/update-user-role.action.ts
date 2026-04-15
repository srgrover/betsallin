"use server";

import { prisma } from "@/lib";
import { auth } from "@auth";
import { getRoleByEmail } from "./get-role-by-email.action";

export const updateUserRole = async (userId: string, role: string) => {
  const session = await auth();
  const userSession = session?.user;
  if (!userSession) {
    return {
      ok: false,
      message: "You must be logged in to update user.",
    };
  }

  const { ok: okRole, role: roleDb, message: messageRole } = await getRoleByEmail(userSession.email!);

  if (!okRole) {
    return {
      ok: false,
      message: messageRole,
    };
  }

  if (roleDb !== 'ADMIN') {
    return {
      ok: false,
      message: "You are not authorized to update user role.",
    };
  }

  const updated = await prisma.user.update({
    where: {
      id: userId
    },
    data: {
      role: role,
    },
  });

  return {
    ok: true,
    user: updated,
  };
};
