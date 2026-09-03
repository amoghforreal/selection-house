'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Star, MessageSquare } from 'lucide-react'

type Review = {
  id: string
  rating: number
  comment: string | null
  created_at: string
  profile: { full_name: string } | null
}

export function ReviewSection({
  productId,
  isLoggedIn,
}: {
  productId: string
  isLoggedIn: boolean
}) {
  const supabase = createClient()
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [rating, setRating] = useState(0)
  const [hoverRating, setHoverRating] = useState(0)
  const [comment, setComment] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  async function loadReviews() {
    setLoading(true)
    const { data } = await supabase
      .from('reviews')
      .select('id, rating, comment, created_at, profile:profiles(full_name)')
      .eq('product_id', productId)
      .eq('is_approved', true)
      .order('created_at', { ascending: false })

    setReviews((data as unknown as Review[]) || [])
    setLoading(false)
  }

  useEffect(() => {
    loadReviews()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productId])

  async function handleSubmit() {
    if (rating === 0) return
    setSubmitting(true)

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      setSubmitting(false)
      return
    }

    await supabase.from('reviews').insert({
      product_id: productId,
      profile_id: user.id,
      rating,
      comment: comment || null,
    })

    setSubmitting(false)
    setSubmitted(true)
    setRating(0)
    setComment('')
  }

  const averageRating =
    reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : 0

  return (
    <div className="mt-10 pt-10 border-t">
      <div className="flex items-center gap-3 mb-6">
        <h2 className="text-xl font-bold">Reviews</h2>
        {reviews.length > 0 && (
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 fill-accent text-accent" />
            <span className="text-sm font-medium">{averageRating.toFixed(1)}</span>
            <span className="text-sm text-muted-foreground">({reviews.length})</span>
          </div>
        )}
      </div>

      {isLoggedIn && (
        <div className="border rounded-xl p-5 mb-6">
          {submitted ? (
            <p className="text-sm text-primary">
              Thank you, your review has been submitted and is awaiting approval.
            </p>
          ) : (
            <>
              <p className="text-sm font-semibold mb-3">Leave a Review</p>
              <div className="flex items-center gap-1 mb-3">
                {Array.from({ length: 5 }).map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    onMouseEnter={() => setHoverRating(i + 1)}
                    onMouseLeave={() => setHoverRating(0)}
                    onClick={() => setRating(i + 1)}
                  >
                    <Star
                      className={`h-6 w-6 transition-colors ${
                        i < (hoverRating || rating)
                          ? 'fill-accent text-accent'
                          : 'text-muted-foreground'
                      }`}
                    />
                  </button>
                ))}
              </div>
              <Textarea
                placeholder="Share your experience with this product (optional)..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={3}
                className="mb-3"
              />
              <Button onClick={handleSubmit} disabled={rating === 0 || submitting} size="sm">
                {submitting ? 'Submitting...' : 'Submit Review'}
              </Button>
            </>
          )}
        </div>
      )}

      {loading ? (
        <p className="text-sm text-muted-foreground">Loading reviews...</p>
      ) : reviews.length === 0 ? (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <MessageSquare className="h-4 w-4" />
          No reviews yet for this product.
        </div>
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => (
            <div key={review.id} className="border-b pb-4 last:border-0">
              <div className="flex items-center gap-2 mb-1">
                <div className="flex items-center gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`h-3.5 w-3.5 ${
                        i < review.rating ? 'fill-accent text-accent' : 'text-muted-foreground'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm font-medium">
                  {review.profile?.full_name || 'Anonymous'}
                </span>
              </div>
              {review.comment && (
                <p className="text-sm text-muted-foreground">{review.comment}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
