'use client'

import { Navbar } from '@/components/Navbar'
import { Research } from '@/components/Research'
import { Footer } from '@/components/Footer'
import { CMSWrapper } from '@/components/cms/CMSWrapper'
import { AuthPage } from '@/components/AuthPage'

export default function ResearchPage() {
  return (
    <>
      <Navbar />
      <AuthPage />
      <CMSWrapper>
        <Research />
        <Footer />
      </CMSWrapper>
    </>
  )
}
