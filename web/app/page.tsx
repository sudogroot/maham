import { CallToAction } from '@/components/landing-page/ui/CallToAction'
import { Faqs } from '@/components/landing-page/ui/Faqs'
import { Footer } from '@/components/landing-page/ui/Footer'
import { Header } from '@/components/landing-page/ui/Header'
import { Hero } from '@/components/landing-page/ui/Hero'
import { Pricing } from '@/components/landing-page/ui/Pricing'
import { PrimaryFeatures } from '@/components/landing-page/ui/PrimaryFeatures'
import { SecondaryFeatures } from '@/components/landing-page/ui/SecondaryFeatures'
import { Testimonials } from '@/components/landing-page/ui/Testimonials'

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <PrimaryFeatures />
        <SecondaryFeatures />
        <CallToAction />
        <Testimonials />
        {/* <Pricing /> */}
        {/* <Faqs /> */}
      </main>
      <Footer />
    </>
  )
}
