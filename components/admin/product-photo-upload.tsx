'use client'

import { useRef, useState } from 'react'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { placeholderImage } from '@/lib/placeholder-image'
import { Upload, ImageIcon } from 'lucide-react'

export function ProductPhotoUpload({
  productId,
  productName,
  currentImageUrl,
  onUploaded,
}: {
  productId: string
  productName: string
  currentImageUrl: string | null
  onUploaded: (url: string) => void
}) {
  const supabase = createClient()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(currentImageUrl)

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    setError(null)
    setUploading(true)

    const fileExt = file.name.split('.').pop()
    const filePath = `${productId}-${Date.now()}.${fileExt}`

    const { error: uploadError } = await supabase.storage
      .from('product-photos')
      .upload(filePath, file, { upsert: true })

    if (uploadError) {
      setError(uploadError.message)
      setUploading(false)
      return
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from('product-photos').getPublicUrl(filePath)

    const { error: updateError } = await supabase
      .from('products')
      .update({ cover_image_url: publicUrl })
      .eq('id', productId)

    setUploading(false)

    if (updateError) {
      setError(updateError.message)
      return
    }

    setPreviewUrl(publicUrl)
    onUploaded(publicUrl)
  }

  return (
    <div>
      <div className="relative aspect-square w-full max-w-xs rounded-xl overflow-hidden bg-secondary border mb-3">
        <Image
          src={previewUrl || placeholderImage(productName, 500, 500)}
          alt="Product cover"
          fill
          className="object-cover"
          sizes="320px"
        />
        {!previewUrl && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/30">
            <span className="text-white text-xs flex items-center gap-1.5">
              <ImageIcon className="h-4 w-4" />
              Placeholder shown, upload a real photo
            </span>
          </div>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />

      <Button
        type="button"
        variant="outline"
        onClick={() => fileInputRef.current?.click()}
        disabled={uploading}
      >
        <Upload className="h-4 w-4 mr-2" />
        {uploading ? 'Uploading...' : previewUrl ? 'Change Photo' : 'Upload Photo'}
      </Button>

      {error && <p className="text-sm text-destructive mt-2">{error}</p>}
    </div>
  )
}
