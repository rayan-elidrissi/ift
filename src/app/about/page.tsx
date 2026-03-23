'use client'

import { Navbar } from '@/components/Navbar'
import { About } from '@/components/About'
import { Footer } from '@/components/Footer'
import { CMSWrapper } from '@/components/cms/CMSWrapper'
import { AuthPage } from '@/components/AuthPage'

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <AuthPage />
      <CMSWrapper>
        <About />
        <Footer />
      </CMSWrapper>
    </>
  )
}
