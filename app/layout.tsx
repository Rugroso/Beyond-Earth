import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import { EditorProvider } from "@/contexts/editor-context"
import { Suspense } from "react"
import "./globals.css"

export const metadata: Metadata = {
  title: "Beyond Earth",
  description: "A visual editor for building your home in space",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        <Suspense fallback={<div>Loading...</div>}>
          <EditorProvider>{children}</EditorProvider>
          <Analytics />
        </Suspense>
      </body>
    </html>
  )
}
