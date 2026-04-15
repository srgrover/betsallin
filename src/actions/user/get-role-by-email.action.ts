"use server";

import { prisma } from "@/lib";

export const getRoleByEmail = async (email: string) => {
  if (!email) {
    return {
      ok: false,
      message: "Have not an account to compare",
    };
  }

  const userFound = await prisma.user.findUnique({
    where: { email },
    select: {
      role: true,
    },
  });

  return {
    ok: true,
    role: userFound?.role,
  };
};
