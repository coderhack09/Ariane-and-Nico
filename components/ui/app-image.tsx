"use client"

import NextImage, { type ImageProps } from "next/image"

/**
 * Drop-in replacement for Next.js <Image> that serves images directly from the /public folder.
 */
export function AppImage({ src, onError, ...props }: ImageProps) {
  return <NextImage src={src} onError={onError} {...props} />
}
