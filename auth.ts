import NextAuth from "next-auth"
import "next-auth/jwt"
import Github from "next-auth/providers/github"
import Google from "next-auth/providers/google"

export const { handlers, auth, signIn, signOut } = NextAuth({
  debug: !!process.env.AUTH_DEBUG,
  theme: { logo: "https://authjs.dev/img/logo-sm.png" },
  providers: [
    Github({
        clientId: process.env.GITHUB_ID ?? '',
        clientSecret: process.env.GITHUB_SECRET ?? '',
    }),
    Google({
        clientId: process.env.GOOGLE_CLIENT_ID ?? '',
        clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? ''
    }),
  ],
  session: { strategy: "jwt" },
//   authorized({ request, auth }) {
//       const { pathname } = request.nextUrl
//       if (pathname === "/middleware-example") return !!auth
//       return true
//   },
  callbacks: {
    async jwt({ token, trigger, session, account, user }) {
      if (user) { // user is only available on first sign in
        try {
          // TODO: Set correct ID for user from DB
          // const responseUser = await getUserByEmail(user);

          // if (responseUser.ok && responseUser.user) {
          //   token.id = responseUser.user.id;
          // }
        } catch (error) {
            console.error('Error adding id to token: ', error)
        }
      }
      if (trigger === "update") token.name = session.user.name
      if (account?.provider === "keycloak") {
        return { ...token, accessToken: account.access_token }
      }
      return token
    },
    async session({ session, token }) {
      if (token?.accessToken) session.accessToken = token.accessToken

      return session
    },
  },
//   experimental: { enableWebAuthn: true },
})

declare module "next-auth" {
  interface Session {
    accessToken?: string
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    accessToken?: string
  }
}