"use client"

import NextImage, { type ImageProps } from "next/image"
import { cloudinaryLoader } from "@/lib/cloudinary"
import { useState } from "react"

/**
 * Drop-in replacement for Next.js <Image> that serves every image through Cloudinary.
 * Automatically applies f_auto (WebP/AVIF), q_auto, and responsive widths.
 *
 * Falls back to the original local /public path if the Cloudinary URL fails (e.g. image
 * not yet uploaded), so the site never shows broken images during the migration.
 */
export function CloudinaryImage({ src, onError, ...props }: ImageProps) {
  const [useFallback, setUseFallback] = useState(false)

  const handleError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    setUseFallback(true)
    onError?.(e)
  }

  if (useFallback) {
    const srcStr = src.toString()
    // Local public paths (e.g. "/decoration/flower.png") are valid for
    // Next.js's default loader — serve them directly from /public.
    if (srcStr.startsWith("/")) {
      // eslint-disable-next-line jsx-a11y/alt-text
      return <NextImage src={src} onError={onError} {...props} />
    }
    // Cloudinary public IDs are NOT valid URLs so Next.js's defaultLoader would
    // throw "Invalid URL". Keep using cloudinaryLoader which always produces a
    // valid https://res.cloudinary.com/... URL.
    return (
      <NextImage
        loader={cloudinaryLoader}
        src={src}
        onError={onError}
        {...props}
      />
    )
  }

  return (
    <NextImage
      loader={cloudinaryLoader}
      src={src}
      onError={handleError}
      {...props}
    />
  )
}
