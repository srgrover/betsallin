"use server";

import { IUser } from "@/app/interfaces/user.interface";
import { prisma } from "@/lib";

export const getUserByUsername = async (username: string) => {
  if (!username) {
    return {
      ok: false,
      message: "There is no username to get.",
    };
  }

  const user = await prisma.user.findUnique({
    where: { username },
  });

  return {
    ok: true,
    user: user as IUser,
  };
};
