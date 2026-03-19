'use server';

import { signIn } from "@auth";

export const login = async (provider: string) => {
  await signIn(provider, { redirectTo: "/" });
};