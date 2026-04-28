"use server";

import { IUser } from "@/app/interfaces/user.interface";
import { prisma } from "@/lib";

export const getUsers = async (limit: number = 10, page: number = 0) => {
  const offset = page * limit;
  if (limit <= 0 || page < 0) {
    return {
      ok: false,
      message: "Invalid limit or page",
    };
  }

  const usersFound = await prisma.user.findMany({
    take: limit,
    skip: offset,
    include: {
      followers: true,
      following: true,
    },
  });

  return {
    ok: true,
    users: usersFound as IUser[],
  };
};
