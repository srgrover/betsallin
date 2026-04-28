"use server";

import { prisma } from "@/lib";
import { revalidatePath } from "next/cache";

export const unfollowUser = async (followerId: string, followingId: string) => {
  if (!followerId || !followingId) {
    return {
      ok: false,
      message: "There is no user to follow.",
    };
  }

  const followed = await prisma.follow.delete({
    where: {
      followerId_followingId: {
        followerId,
        followingId,
      }
    },
  });

  revalidatePath("/users");


  return {
    ok: true,
    followed,
  };
};
