import type { Metadata } from 'next'
import Link from 'next/link'
import { MapPin, Phone, Clock, MessageCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

export const metadata: Metadata = {
  title: 'Contact Us',
  description:
    'Get in touch with Selection House for wholesale sports goods inquiries. Visit us in Pilibhit, call, or message us on WhatsApp.',
}

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-14">
      <div className="text-center mb-12">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">Contact Us</h1>
        <p className="text-muted-foreground max-w-xl mx-auto">
          Have a question about wholesale pricing, an order, or product availability?
          Reach out, we usually respond within a few hours.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* Contact info */}
        <div className="lg:col-span-2 space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center gap-3 space-y-0">
              <div className="h-11 w-11 rounded-lg bg-primary flex items-center justify-center shrink-0">
                <MapPin className="h-5 w-5 text-primary-foreground" />
              </div>
              <div>
                <CardTitle className="text-base">Visit Our Store</CardTitle>
                <CardDescription>
                  Station Road, Pilibhit, Opp. BOB Bank, Pilibhit, Uttar Pradesh
                </CardDescription>
              </div>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center gap-3 space-y-0">
              <div className="h-11 w-11 rounded-lg bg-primary flex items-center justify-center shrink-0">
                <Phone className="h-5 w-5 text-primary-foreground" />
              </div>
              <div>
                <CardTitle className="text-base">Call Us</CardTitle>
                <CardDescription>
                  <a href="tel:+916398658181" className="hover:text-primary transition-colors">
                    +91 63986 58181
                  </a>
                </CardDescription>
              </div>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center gap-3 space-y-0">
              <div className="h-11 w-11 rounded-lg bg-primary flex items-center justify-center shrink-0">
                <MessageCircle className="h-5 w-5 text-primary-foreground" />
              </div>
              <div>
                <CardTitle className="text-base">WhatsApp</CardTitle>
                <CardDescription>
                  <Link
                    href="https://wa.me/916398658181"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-primary transition-colors"
                  >
                    Message us directly
                  </Link>
                </CardDescription>
              </div>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center gap-3 space-y-0">
              <div className="h-11 w-11 rounded-lg bg-primary flex items-center justify-center shrink-0">
                <Clock className="h-5 w-5 text-primary-foreground" />
              </div>
              <div>
                <CardTitle className="text-base">Business Hours</CardTitle>
                <CardDescription>Mon to Sat: 10:00 AM to 8:00 PM</CardDescription>
              </div>
            </CardHeader>
          </Card>
        </div>

        {/* Contact form (visual only for now, wiring comes with support_tickets integration) */}
        <div className="lg:col-span-3">
          <Card>
            <CardHeader>
              <CardTitle>Send Us a Message</CardTitle>
              <CardDescription>
                Fill out the form and our team will get back to you shortly.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Your Name</Label>
                    <Input id="name" name="name" placeholder="Ramesh Kumar" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input id="phone" name="phone" placeholder="9876543210" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" name="email" type="email" placeholder="you@yourshop.com" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="message">Message</Label>
                  <Textarea
                    id="message"
                    name="message"
                    placeholder="Tell us what you're looking for..."
                    rows={5}
                  />
                </div>
                <Button type="submit" className="w-full sm:w-auto">
                  Send Message
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
