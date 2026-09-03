'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { LoadingSpinner } from '@/components/shared/loading-spinner'
import { Mail, Trash2, Phone } from 'lucide-react'

type Message = {
  id: string
  name: string
  email: string | null
  phone: string | null
  message: string
  is_read: boolean
  created_at: string
}

export function ContactMessagesInbox() {
  const supabase = createClient()
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(true)

  async function loadMessages() {
    setLoading(true)
    const { data } = await supabase
      .from('contact_messages')
      .select('*')
      .order('created_at', { ascending: false })
    setMessages(data || [])
    setLoading(false)
  }

  useEffect(() => {
    loadMessages()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function markRead(id: string) {
    await supabase.from('contact_messages').update({ is_read: true }).eq('id', id)
    await loadMessages()
  }

  async function deleteMessage(id: string) {
    await supabase.from('contact_messages').delete().eq('id', id)
    await loadMessages()
  }

  if (loading) {
    return <LoadingSpinner label="Loading messages..." />
  }

  const unreadCount = messages.filter((m) => !m.is_read).length

  return (
    <div>
      <h1 className="text-2xl font-bold mb-1">Contact Messages</h1>
      <p className="text-muted-foreground text-sm mb-6">
        {unreadCount > 0 ? `${unreadCount} unread` : 'All caught up'}
      </p>

      {messages.length === 0 ? (
        <div className="border rounded-xl p-12 text-center">
          <Mail className="h-10 w-10 mx-auto text-muted-foreground mb-4" />
          <p className="text-muted-foreground">No messages yet.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`border rounded-xl p-4 ${!msg.is_read ? 'border-primary' : ''}`}
            >
              <div className="flex items-start justify-between mb-2 flex-wrap gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-sm">{msg.name}</span>
                    {!msg.is_read && <Badge className="bg-accent text-accent-foreground">New</Badge>}
                  </div>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
                    {msg.email && <span>{msg.email}</span>}
                    {msg.phone && (
                      <span className="flex items-center gap-1">
                        <Phone className="h-3 w-3" />
                        {msg.phone}
                      </span>
                    )}
                    <span>
                      {new Date(msg.created_at).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>
                </div>
              </div>
              <p className="text-sm text-muted-foreground mb-3">{msg.message}</p>
              <div className="flex items-center gap-2">
                {!msg.is_read && (
                  <Button size="sm" variant="outline" onClick={() => markRead(msg.id)}>
                    Mark as Read
                  </Button>
                )}
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => deleteMessage(msg.id)}
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 className="h-3.5 w-3.5 mr-1" />
                  Delete
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
