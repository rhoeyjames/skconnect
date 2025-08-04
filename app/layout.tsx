import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import Navbar from "@/components/navbar"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "SKConnect - Youth Development Portal",
  description: "Empowering Filipino youth through community engagement and Sangguniang Kabataan initiatives",
  keywords: ["SK", "youth", "Philippines", "community", "barangay", "development"],
  authors: [{ name: "SKConnect Team" }],
  openGraph: {
    title: "SKConnect - Youth Development Portal",
    description: "Empowering Filipino youth through community engagement",
    type: "website",
    locale: "en_PH",
  },
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          <Navbar />
          <main>{children}</main>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}
