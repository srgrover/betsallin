import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Profile - BetsAllin",
  description: "Profile BetsAllin",
};

export default async function ProfileLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      {children}
    </>
  );
}
