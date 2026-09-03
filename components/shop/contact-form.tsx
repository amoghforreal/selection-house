'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { CheckCircle2 } from 'lucide-react'

export function ContactForm() {
  const supabase = createClient()
  const [form, setForm] = useState({ name: '', phone: '', email: '', message: '' })
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    if (!form.name.trim() || !form.message.trim()) {
      setError('Please fill in your name and message')
      return
    }

    setSubmitting(true)

    const { error: insertError } = await supabase.from('contact_messages').insert({
      name: form.name,
      phone: form.phone || null,
      email: form.email || null,
      message: form.message,
    })

    setSubmitting(false)

    if (insertError) {
      setError('Something went wrong. Please try WhatsApp instead.')
      return
    }

    setSubmitted(true)
    setForm({ name: '', phone: '', email: '', message: '' })
  }

  if (submitted) {
    return (
      <div className="text-center py-8">
        <CheckCircle2 className="h-12 w-12 mx-auto text-primary mb-4" />
        <h3 className="text-lg font-semibold mb-2">Message Sent</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Thank you for reaching out. Our team will get back to you shortly.
        </p>
        <Button variant="outline" onClick={() => setSubmitted(false)}>
          Send Another Message
        </Button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Your Name</Label>
          <Input
            id="name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="Ramesh Kumar"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="phone">Phone Number</Label>
          <Input
            id="phone"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            placeholder="9876543210"
          />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          placeholder="you@yourshop.com"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="message">Message</Label>
        <Textarea
          id="message"
          value={form.message}
          onChange={(e) => setForm({ ...form, message: e.target.value })}
          placeholder="Tell us what you're looking for..."
          rows={5}
        />
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}

      <Button type="submit" className="w-full sm:w-auto" disabled={submitting}>
        {submitting ? 'Sending...' : 'Send Message'}
      </Button>
    </form>
  )
}
