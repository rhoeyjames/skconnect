import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import Navbar from "@/components/navbar"
import { ErrorBoundary } from "@/components/error-boundary"
import ConnectivityStatus from "@/components/connectivity-status"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "SKConnect - Youth Engagement Platform",
  description: "Connecting youth with their Sangguniang Kabataan for better community engagement",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          <Navbar />
          <ErrorBoundary>
            <main>{children}</main>
          </ErrorBoundary>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}
