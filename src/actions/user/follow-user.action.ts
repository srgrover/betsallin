"use server";

import { prisma } from "@/lib";
import { revalidatePath } from "next/cache";

export const followUser = async (followerId: string, followingId: string) => {
  if (!followerId || !followingId) {
    return {
      ok: false,
      message: "There is no user to follow.",
    };
  }

  const followed = await prisma.follow.create({
    data: {
      followerId,
      followingId,
    },
  });

  revalidatePath("/users");

  return {
    ok: true,
    followed,
  };
};
