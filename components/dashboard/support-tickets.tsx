'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { LoadingSpinner } from '@/components/shared/loading-spinner'
import { MessageSquare, Plus } from 'lucide-react'

type Ticket = {
  id: string
  subject: string
  message: string
  status: string
  created_at: string
}

const STATUS_VARIANTS: Record<string, string> = {
  open: 'bg-accent text-accent-foreground',
  in_progress: 'bg-primary text-primary-foreground',
  resolved: 'bg-green-600 text-white',
  closed: 'bg-muted text-muted-foreground',
}

export function SupportTickets() {
  const supabase = createClient()
  const [tickets, setTickets] = useState<Ticket[]>([])
  const [businessId, setBusinessId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [subject, setSubject] = useState('')
  const [message, setMessage] = useState('')

  async function loadTickets() {
    setLoading(true)
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      setLoading(false)
      return
    }

    const { data: business } = await supabase
      .from('businesses')
      .select('id')
      .eq('profile_id', user.id)
      .maybeSingle()

    if (!business) {
      setLoading(false)
      return
    }

    setBusinessId(business.id)

    const { data } = await supabase
      .from('support_tickets')
      .select('id, subject, message, status, created_at')
      .eq('business_id', business.id)
      .order('created_at', { ascending: false })

    setTickets(data || [])
    setLoading(false)
  }

  useEffect(() => {
    loadTickets()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function submitTicket() {
    if (!businessId || !subject.trim() || !message.trim()) return
    setSubmitting(true)

    await supabase.from('support_tickets').insert({
      business_id: businessId,
      subject,
      message,
    })

    setSubject('')
    setMessage('')
    setShowForm(false)
    setSubmitting(false)
    await loadTickets()
  }

  if (loading) {
    return <LoadingSpinner label="Loading support tickets..." />
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Support</h1>
        <Button onClick={() => setShowForm(!showForm)}>
          <Plus className="h-4 w-4 mr-2" />
          New Ticket
        </Button>
      </div>

      {showForm && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-base">Raise a Support Ticket</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Subject</Label>
              <Input
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Issue with order SH-1234"
              />
            </div>
            <div className="space-y-2">
              <Label>Message</Label>
              <Textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Describe the issue in detail..."
                rows={4}
              />
            </div>
            <Button onClick={submitTicket} disabled={submitting}>
              {submitting ? 'Submitting...' : 'Submit Ticket'}
            </Button>
          </CardContent>
        </Card>
      )}

      {tickets.length === 0 ? (
        <div className="border rounded-xl p-12 text-center">
          <MessageSquare className="h-10 w-10 mx-auto text-muted-foreground mb-4" />
          <p className="text-muted-foreground">No support tickets yet.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {tickets.map((ticket) => (
            <Card key={ticket.id}>
              <CardContent className="pt-6">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-medium text-sm">{ticket.subject}</h3>
                  <Badge className={STATUS_VARIANTS[ticket.status] || ''}>
                    {ticket.status.replace('_', ' ')}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-2">{ticket.message}</p>
                <p className="text-xs text-muted-foreground">
                  {new Date(ticket.created_at).toLocaleDateString('en-IN', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                  })}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
