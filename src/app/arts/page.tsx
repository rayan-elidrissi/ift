'use client'

import { Navbar } from '@/components/Navbar'
import { Arts } from '@/components/Arts'
import { Footer } from '@/components/Footer'
import { CMSWrapper } from '@/components/cms/CMSWrapper'
import { AuthPage } from '@/components/AuthPage'

export default function ArtsPage() {
  return (
    <>
      <Navbar />
      <AuthPage />
      <CMSWrapper>
        <Arts />
        <Footer />
      </CMSWrapper>
    </>
  )
}
