import NextAuth from "next-auth"
import "next-auth/jwt"
import Github from "next-auth/providers/github"
import Google from "next-auth/providers/google"

export const { handlers, auth, signIn, signOut } = NextAuth({
  debug: process.env.AUTH_DEBUG === 'true', // Activamos debug para ver qué pasa en consola
  theme: { logo: "https://authjs.dev/img/logo-sm.png" },
  providers: [
    Github({
        clientId: process.env.AUTH_GITHUB_ID!,
        clientSecret: process.env.AUTH_GITHUB_SECRET!,
    }),
    Google({
        clientId: process.env.AUTH_GOOGLE_ID!,
        clientSecret: process.env.AUTH_GOOGLE_SECRET!
    }),
  ],
  session: { strategy: "jwt" },
  callbacks: {
    async signIn({ user, account, profile }) {
      // AQUÍ PUEDES CAPTURAR AL USUARIO AL INICIAR SESIÓN
      console.log('--- SIGN IN CALLBACK ---')
      console.log('User logged in:', user.email)
      
      // Puedes poner lógica aquí para validar algo del usuario
      // Si devuelves false, el login se cancela y se redirige a error
      return true
    },
    async jwt({ token, trigger, session, account, user }) {
      if (user) {
        // En el primer login el objeto 'user' viene lleno
        // Puedes pasar datos al token para que estén disponibles en la sesión
        token.id = user.id
      }
      if (trigger === "update") token.name = session.user.name
      if (account?.provider === "keycloak") {
        return { ...token, accessToken: account.access_token }
      }
      return token
    },
    async session({ session, token }) {
      // Pasamos el ID del token a la sesión
      if (session.user) {
        session.user.id = token.id as string
      }
      if (token?.accessToken) session.accessToken = token.accessToken as string

      return session
    },
  },
})

declare module "next-auth" {
  interface Session {
    user: {
      id?: string
      name?: string | null
      email?: string | null
      image?: string | null
    }
    accessToken?: string
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string
    accessToken?: string
  }
}