import "./globals.css"
import { ReactNode } from "react"
import Navbar from "../components/Navbar"
import SessionProviderWrapper from "../components/SessionProviderWrapper"
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "FL0CK",
  description: "A social network where you own your data.",
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/res/icon.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-neutral-950 text-white">
        <SessionProviderWrapper>
          <Navbar />
          {children}
        </SessionProviderWrapper>
      </body>
    </html>
  );
}