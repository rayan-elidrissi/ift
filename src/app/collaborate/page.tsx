'use client'

import { Navbar } from '@/components/Navbar'
import { Collaborate } from '@/components/Collaborate'
import { Footer } from '@/components/Footer'
import { CMSWrapper } from '@/components/cms/CMSWrapper'
import { AuthPage } from '@/components/AuthPage'

export default function CollaboratePage() {
  return (
    <>
      <Navbar />
      <AuthPage />
      <CMSWrapper>
        <Collaborate />
        <Footer />
      </CMSWrapper>
    </>
  )
}
