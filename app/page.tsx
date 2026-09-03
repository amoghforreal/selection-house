import type { Metadata } from 'next'
import { Hero } from '@/components/home/hero'
import { FeaturedCategories } from '@/components/home/featured-categories'
import { WhyWholesale } from '@/components/home/why-wholesale'
import { CtaBanner } from '@/components/home/cta-banner'

export const metadata: Metadata = {
  title: 'Home',
  description:
    'Selection House is a trusted wholesale sports goods supplier based in Pilibhit, serving shop owners since 1989. Register your business for wholesale pricing.',
}

export default function HomePage() {
  return (
    <>
      <Hero />
      <FeaturedCategories />
      <WhyWholesale />
      <CtaBanner />
    </>
  )
}
