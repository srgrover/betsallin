"use server";

import { IUser } from "@/app/interfaces/user.interface";
import { prisma } from "@/lib";
import { getUserByUsername } from "./get-user-by-username.action";
import { auth } from "@auth";
import { getRoleByEmail } from "./get-role-by-email.action";

export const updateUser = async (user: IUser) => {
  const session = await auth();
  const userSession = session?.user;
  if (!userSession) {
    return {
      ok: false,
      message: "You must be logged in to update user.",
    };
  }

  if (!user) {
    return {
      ok: false,
      message: "There is no user to create.",
    };
  }

  const { ok, message, user: userDb } = await validateUser(user);
  if (!ok) {
    return {
      ok: false,
      message,
    };
  }

  const {
    ok: okRole,
    role,
    message: messageRole,
  } = await getRoleByEmail(userSession.email!);

  if (!okRole) {
    return {
      ok: false,
      message: messageRole,
    };
  }

  const userCreated = await prisma.user.update({
    where: {
      id: user.id,
    },
    data: {
      name: user.name,
      image: user.image,
      username: user.username,
      ...(role === "ADMIN" && { role: user.role }),
    },
  });

  return {
    ok: true,
    user: userCreated,
  };
};

async function validateUser(user: IUser) {
  if (!user.name) {
    return {
      ok: false,
      message: "There is no name to create.",
    };
  }

  if (!user.username) {
    return {
      ok: false,
      message: "There is no username to create.",
    };
  } else {
    const {
      user: userDb,
      ok,
      message,
    } = await getUserByUsername(user.username);
    console.log("userDb", userDb, "ok", ok, "message", message);
    if (!ok) {
      return {
        ok: false,
        message,
      };
    }

    if (userDb && user.id !== userDb!.id) {
      return {
        ok: false,
        message: "Username already exists.",
      };
    }
  }

  return {
    ok: true,
    user,
  };
}
