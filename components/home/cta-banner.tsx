import Link from 'next/link'
import { ArrowRight, Phone } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { getSiteSettings } from '@/lib/site-settings'

export async function CtaBanner() {
  const settings = await getSiteSettings()
  const whatsapp = settings?.business_whatsapp || '916398658181'

  return (
    <section className="bg-accent text-accent-foreground">
      <div className="mx-auto max-w-7xl px-4 py-12 md:py-16 flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold mb-2">
            Ready to Stock Your Shop With Selection House?
          </h2>
          <p className="text-accent-foreground/80 text-sm md:text-base max-w-xl">
            Register your business today and get access to real wholesale pricing,
            bulk discounts, and a dedicated support team.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 shrink-0">
          <Button
            size="lg"
            className="bg-primary text-primary-foreground hover:bg-primary/90 text-base"
            render={<Link href="/register" />}
          >
            Register Your Business
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="bg-transparent border-accent-foreground/30 text-accent-foreground hover:bg-accent-foreground/10 text-base"
            render={<Link href={`https://wa.me/${whatsapp}`} target="_blank" rel="noopener noreferrer" />}
          >
            <Phone className="h-4 w-4 mr-2" />
            WhatsApp Us
          </Button>
        </div>
      </div>
    </section>
  )
}
