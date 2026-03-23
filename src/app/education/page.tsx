'use client'

import { Navbar } from '@/components/Navbar'
import { Education } from '@/components/Education'
import { Footer } from '@/components/Footer'
import { CMSWrapper } from '@/components/cms/CMSWrapper'
import { AuthPage } from '@/components/AuthPage'

export default function EducationPage() {
  return (
    <>
      <Navbar />
      <AuthPage />
      <CMSWrapper>
        <Education />
        <Footer />
      </CMSWrapper>
    </>
  )
}
