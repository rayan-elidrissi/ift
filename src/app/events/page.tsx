'use client'

import { Navbar } from '@/components/Navbar'
import { Events } from '@/components/Events'
import { Footer } from '@/components/Footer'
import { CMSWrapper } from '@/components/cms/CMSWrapper'
import { AuthPage } from '@/components/AuthPage'

export default function EventsPage() {
  return (
    <>
      <Navbar />
      <AuthPage />
      <CMSWrapper>
        <Events />
        <Footer />
      </CMSWrapper>
    </>
  )
}
