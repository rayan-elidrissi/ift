'use client'

import { Navbar } from '@/components/Navbar'
import { Hero } from '@/components/Hero'
import { FeaturedProjects } from '@/components/FeaturedProjects'
import { Footer } from '@/components/Footer'
import { CMSWrapper } from '@/components/cms/CMSWrapper'
import { AuthPage } from '@/components/AuthPage'

export default function HomePage() {
  return (
    <>
      <Navbar />
      <AuthPage />
      <CMSWrapper>
        <Hero />
        <FeaturedProjects />
        <Footer />
      </CMSWrapper>
    </>
  )
}
