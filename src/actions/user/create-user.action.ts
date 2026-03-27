"use server";

import { prisma } from "@/lib";
import { User } from "next-auth";

export const createUser = async (user: User) => {
  if (!user) {
    return {
      ok: false,
      message: "There is no user to create.",
    };
  }

  const userCreated = await prisma.user.create({
    data: {
      email: user.email!,
      name: user.name,
      image: user.image,
      username: user.email!.split("@")[0],
      //   password: ''
    },
  });

  return {
    ok: true,
    user: userCreated,
  };
};
