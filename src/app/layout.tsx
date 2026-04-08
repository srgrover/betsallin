import type { Metadata } from "next";
import { Raleway } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { SessionProvider } from "next-auth/react";
import { auth } from "../../auth";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AppSidebar } from "@/components/app-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { getUserByEmail } from "@/actions";
import { IUser } from "./interfaces/user.interface";

const raleway = Raleway({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "PlayAllin",
  description: "Your Bet game app",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();
  const userSession = session?.user;
  let userData: IUser | null = null;

  if (userSession) {
    const { user, ok, message } = await getUserByEmail(userSession.email!);
    if (ok) {
      userData = user as IUser;
    } else {
      console.error(message);
    }
  }

  return (
    <html lang="en" className={cn("font-sans", raleway.variable)}>
      <body className={`${raleway.variable} ${raleway.variable} antialiased`}>
        <SessionProvider session={session}>
          <TooltipProvider>
            <SidebarProvider className="flex flex-col">
              <main className="min-h-screen flex flex-1">
                <AppSidebar user={userData!} />
                <div className="w-full flex-1 overflow-y-auto">{children}</div>
              </main>
            </SidebarProvider>
          </TooltipProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
