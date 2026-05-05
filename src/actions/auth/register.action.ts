'use server';

import { signIn } from "@auth";
import { getUserByEmail } from "../user/get-user-by-email.action";
import { createUser } from "../user/create-user.action";
import { prisma } from "@/lib";
import { hash } from "bcrypt";


export const register = async (email: string, password: string, passwordConfirmation: string) => {
  if (password !== passwordConfirmation) {
    throw new Error("Passwords do not match");
  }

  try {
    const responseUser = await getUserByEmail(email);

    if (responseUser.ok && responseUser.user) {
      throw new Error("User already exists");
    }

    const hashedPassword = await hash(password, 10);

    const userCreated = await prisma.user.create({
      data: {
        email,
        username: email.split("@")[0],
        password: hashedPassword
      },
    });

    return {
      ok: true,
      user: userCreated,
    }

  } catch (error) {
    console.error("Error registering: ", error);
    throw new Error("Error registering");
  }
};