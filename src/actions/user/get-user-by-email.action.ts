"use server";

import { IUser } from "@/app/interfaces/user.interface";
import { prisma } from "@/lib";

export const getUserByEmail = async (email: string) => {
  if (!email) {
    return {
      ok: false,
      message: "Have not an account to compare",
    };
  }

  const userFound = await prisma.user.findUnique({
    where: { email },
  });

  return {
    ok: true,
    user: userFound as IUser,
  };
};
