'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { LoadingSpinner } from '@/components/shared/loading-spinner'
import { Star, Check, Trash2 } from 'lucide-react'

type Review = {
  id: string
  rating: number
  comment: string | null
  is_approved: boolean
  created_at: string
  product: { name: string } | null
  profile: { full_name: string } | null
}

export function ReviewModerator() {
  const supabase = createClient()
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)

  async function loadReviews() {
    setLoading(true)
    const { data } = await supabase
      .from('reviews')
      .select('id, rating, comment, is_approved, created_at, product:products(name), profile:profiles(full_name)')
      .order('created_at', { ascending: false })
    setReviews((data as unknown as Review[]) || [])
    setLoading(false)
  }

  useEffect(() => {
    loadReviews()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function approveReview(id: string) {
    await supabase.from('reviews').update({ is_approved: true }).eq('id', id)
    await loadReviews()
  }

  async function deleteReview(id: string) {
    await supabase.from('reviews').delete().eq('id', id)
    await loadReviews()
  }

  if (loading) {
    return <LoadingSpinner label="Loading reviews..." />
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Reviews</h1>

      {reviews.length === 0 ? (
        <div className="border rounded-xl p-12 text-center">
          <Star className="h-10 w-10 mx-auto text-muted-foreground mb-4" />
          <p className="text-muted-foreground">No reviews yet.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {reviews.map((review) => (
            <div key={review.id} className="border rounded-xl p-4">
              <div className="flex items-start justify-between mb-2 flex-wrap gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-sm">
                      {review.product?.name || 'Unknown product'}
                    </span>
                    {!review.is_approved && <Badge variant="secondary">Pending</Badge>}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {review.profile?.full_name || 'Anonymous'} &middot;{' '}
                    {new Date(review.created_at).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </p>
                </div>
                <div className="flex items-center gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`h-3.5 w-3.5 ${
                        i < review.rating
                          ? 'fill-accent text-accent'
                          : 'text-muted-foreground'
                      }`}
                    />
                  ))}
                </div>
              </div>
              {review.comment && (
                <p className="text-sm text-muted-foreground mb-3">{review.comment}</p>
              )}
              <div className="flex items-center gap-2">
                {!review.is_approved && (
                  <Button size="sm" onClick={() => approveReview(review.id)}>
                    <Check className="h-3.5 w-3.5 mr-1" />
                    Approve
                  </Button>
                )}
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => deleteReview(review.id)}
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
