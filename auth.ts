import { createUser, getUserByEmail } from "@/actions";
import NextAuth from "next-auth";
import "next-auth/jwt";
import Github from "next-auth/providers/github";
import Google from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";

export const { handlers, auth, signIn, signOut } = NextAuth({
  debug: process.env.AUTH_DEBUG === "true", // Activamos debug para ver qué pasa en consola
  theme: { logo: "https://authjs.dev/img/logo-sm.png" },
  providers: [
    CredentialsProvider({
      // The name to display on the sign in form (e.g. 'Sign in with...')
      name: 'Credentials',
      // The credentials is used to generate a suitable form on the sign in page.
      // You can specify whatever fields you are expecting to be submitted.
      // e.g. domain, username, password, 2FA token, etc.
      // You can pass any HTML attribute to the <input> tag through the object.
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        passwordConfirmation: { label: "Password Confirmation", type: "password" }
      },
      async authorize(credentials, req) {
        // You need to provide your own logic here that takes the credentials
        // submitted and returns either a object representing a user or value
        // that is false/null if the credentials are invalid.
        // e.g. return { id: 1, name: 'J Smith', email: 'jsmith@example.com' }
        // You can also use the `req` object to obtain additional parameters
        // (i.e., the request IP address)
        const res = await fetch("/your/endpoint", {
          method: 'POST',
          body: JSON.stringify(credentials),
          headers: { "Content-Type": "application/json" }
        })
        const user = await res.json()

        // If no error and we have user data, return it
        if (res.ok && user) {
          return user
        }
        // Return null if user data could not be retrieved
        return null
      }
    }),
    Github({
      clientId: process.env.AUTH_GITHUB_ID!,
      clientSecret: process.env.AUTH_GITHUB_SECRET!,
    }),
    Google({
      clientId: process.env.AUTH_GOOGLE_ID!,
      clientSecret: process.env.AUTH_GOOGLE_SECRET!,
    }),
  ],
  session: { strategy: "jwt" },
  callbacks: {
    async signIn({ user, account, profile }) {
      if (!user.email) return false;

      try {
        const responseUser = await getUserByEmail(user.email);
        const { ok, user: existingUser } = responseUser;

        if (!ok) return false;

        if (!existingUser) {
          const createResponse = await createUser(user);
          const { ok } = createResponse;

          if (!ok) return false;
          return true;
        }
      } catch (error) {
        console.error("Error al iniciar sesión: ", error);
        throw new Error("Error al iniciar sesión.");
      }
      return true;
    },
    async jwt({ token, trigger, session, account, user }) {
      if (user) {
        try {
          const responseUser = await getUserByEmail(user.email!);

          if (responseUser.ok && responseUser.user) {
            // En el primer login el objeto 'user' viene lleno
            // Puedes pasar datos al token para que estén disponibles en la sesión
            token.id = responseUser.user.id;
            token.role = responseUser.user.role;
          }
        } catch (error) {
          console.error("Error adding id to token: ", error);
        }
      }
      if (trigger === "update") {
        if (session?.user?.name) token.name = session.user.name;
        if (session?.user?.image) token.picture = session.user.image;
      }
      if (account?.provider === "keycloak") {
        return { ...token, accessToken: account.access_token };
      }
      return token;
    },
    async session({ session, token }) {
      // Pasamos el ID del token a la sesión
      if (session?.user && token.id) {
        session.user.id = token.id as string;
      }
      if (token?.accessToken) session.accessToken = token.accessToken as string;
      if (session?.user && token.role) {
        session.user.role = token.role as string;
      }

      return session;
    },
  },
});

declare module "next-auth" {
  interface Session {
    user: {
      id?: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      role?: string | null;
    };
    accessToken?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    accessToken?: string;
  }
}
