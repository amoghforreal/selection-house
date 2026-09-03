'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Repeat, Check } from 'lucide-react'

export function SaveForReorderButton({
  productId,
  isLoggedIn,
  variant = 'default',
}: {
  productId: string
  isLoggedIn: boolean
  variant?: 'default' | 'icon'
}) {
  const supabase = createClient()
  const [saved, setSaved] = useState(false)
  const [loading, setLoading] = useState(true)
  const [toggling, setToggling] = useState(false)

  useEffect(() => {
    async function checkSaved() {
      if (!isLoggedIn) {
        setLoading(false)
        return
      }

      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        setLoading(false)
        return
      }

      const { data } = await supabase
        .from('wishlist_items')
        .select('id')
        .eq('profile_id', user.id)
        .eq('product_id', productId)
        .maybeSingle()

      setSaved(!!data)
      setLoading(false)
    }

    checkSaved()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productId, isLoggedIn])

  async function toggle() {
    if (!isLoggedIn) return
    setToggling(true)

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      setToggling(false)
      return
    }

    if (saved) {
      await supabase
        .from('wishlist_items')
        .delete()
        .eq('profile_id', user.id)
        .eq('product_id', productId)
      setSaved(false)
    } else {
      await supabase
        .from('wishlist_items')
        .insert({ profile_id: user.id, product_id: productId })
      setSaved(true)
    }

    setToggling(false)
  }

  if (!isLoggedIn || loading) return null

  if (variant === 'icon') {
    return (
      <Button
        variant="outline"
        size="icon-sm"
        onClick={toggle}
        disabled={toggling}
        title={saved ? 'Saved for reorder' : 'Save for reorder'}
        className={saved ? 'text-primary border-primary' : ''}
      >
        {saved ? <Check className="h-4 w-4" /> : <Repeat className="h-4 w-4" />}
      </Button>
    )
  }

  return (
    <Button variant="outline" onClick={toggle} disabled={toggling} className="w-full">
      {saved ? (
        <>
          <Check className="h-4 w-4 mr-2" />
          Saved for Reorder
        </>
      ) : (
        <>
          <Repeat className="h-4 w-4 mr-2" />
          Save for Reorder
        </>
      )}
    </Button>
  )
}
