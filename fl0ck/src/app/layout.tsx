import "./globals.css"
import { ReactNode } from "react"
import Navbar from "../components/Navbar"
import SessionProviderWrapper from "../components/SessionProviderWrapper"

export const metadata = {
  title: "FL0CK",
  description: "Fork Links of Creative Knowledge — a GitHub-powered social space.",
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-neutral-950 text-white">
        <SessionProviderWrapper>
          <Navbar />
          <main className="p-8">{children}</main>
        </SessionProviderWrapper>
      </body>
    </html>
  )
}
