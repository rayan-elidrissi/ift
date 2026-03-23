import type { Metadata } from 'next'
import { SessionProvider } from 'next-auth/react'
import { Toaster } from 'sonner'
import { AuthProvider } from '@/context/AuthContext'
import '@/styles/globals.css'

export const metadata: Metadata = {
  title: 'Institute for Future Technologies',
  description: 'IFT — Research, Education, Arts',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <SessionProvider>
          <AuthProvider>
            {children}
            <Toaster position="bottom-right" richColors />
          </AuthProvider>
        </SessionProvider>
      </body>
    </html>
  )
}
