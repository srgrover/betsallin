"use server";

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
  console.log("userFound", userFound);

  return {
    ok: true,
    user: userFound,
  };
};
