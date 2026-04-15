"use server";

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
    user,
  };
};
