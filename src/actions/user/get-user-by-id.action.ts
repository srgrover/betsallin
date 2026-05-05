"use server";

import { IUser } from "@/app/interfaces/user.interface";
import { prisma } from "@/lib";

export const getUserById = async (id: string) => {
    if (!id) {
        return {
            ok: false,
            message: "Have not an account to compare",
        };
    }

    const userFound = await prisma.user.findUnique({
        where: { id },
        include: {
            following: true,
            followers: true,
        }
    });

    return {
        ok: true,
        user: userFound as IUser,
    };
};
