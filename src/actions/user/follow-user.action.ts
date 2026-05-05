"use server";

import { prisma } from "@/lib";
import { revalidatePath } from "next/cache";

export const followUser = async (followerId: string, followingId: string) => {
  console.log("followerId", followerId);
  console.log("followingId", followingId);
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
  revalidatePath(`/profile`);

  return {
    ok: true,
    followed,
  };
};
