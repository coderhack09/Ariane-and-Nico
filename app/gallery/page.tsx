import fs from "fs/promises"
import path from "path"
import sharp from "sharp"
import MasonryGallery from "@/components/masonry-gallery"
import { CloudinaryImage } from "@/components/ui/cloudinary-image"
import { siteConfig } from "@/content/site"
import { Cinzel, Cormorant_Garamond } from "next/font/google"

const cinzel = Cinzel({
  subsets: ["latin"],
  weight: "400",
})

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
})

// Match Details/Gallery palette
const GALLERY_TEXT = "#9B6A41"
const GALLERY_DECO_FILTER =
  "brightness(0) saturate(100%) invert(32%) sepia(55%) saturate(900%) hue-rotate(355deg) brightness(95%) contrast(90%)"

// Generate on each request so newly added images in public/ appear without a rebuild
export const dynamic = "force-dynamic"

async function getImagesFrom(dir: string) {
  const abs = path.join(process.cwd(), "public", dir)
  try {
    const entries = await fs.readdir(abs, { withFileTypes: true })
    const paths = entries
      .filter((e) => e.isFile())
      .map((e) => `/${dir}/${e.name}`)
      .filter((p) => p.match(/\.(jpe?g|png|webp|gif)$/i))
      .sort((a, b) => {
        // Extract the first number found in the filename for proper numerical sorting
        const numA = parseInt(a.match(/(\d+)/)?.[1] || "0", 10)
        const numB = parseInt(b.match(/(\d+)/)?.[1] || "0", 10)
        return numA - numB
      })

    // Read real dimensions for each image so the grid respects orientation
    const withDimensions = await Promise.all(
      paths.map(async (src) => {
        try {
          const filePath = path.join(process.cwd(), "public", src.replace(/^\//, ""))
          const meta = await sharp(filePath).metadata()
          return { src, width: meta.width ?? 4, height: meta.height ?? 5 }
        } catch {
          return { src, width: 4, height: 5 }
        }
      })
    )
    return withDimensions
  } catch {
    return []
  }
}

export default async function GalleryPage() {
  const [mobileImages, desktopImages] = await Promise.all([
    getImagesFrom("mobile-background"),
    getImagesFrom("desktop-background"),
  ])

  const images = [
    ...mobileImages.map(({ src, width, height }) => ({
      src,
      width,
      height,
      category: "mobile" as const,
      orientation: (height >= width ? "portrait" : "landscape") as "portrait" | "landscape",
    })),
    ...desktopImages.map(({ src, width, height }) => ({
      src,
      width,
      height,
      category: "desktop" as const,
      orientation: (height >= width ? "portrait" : "landscape") as "portrait" | "landscape",
    })),
  ]

  return (
    <main className="min-h-screen relative overflow-hidden bg-white">
      {/* Background */}
      <div className="absolute inset-0 -z-10 bg-white" />
      
      {/* Flower decoration - top left corner */}
      <div className="absolute left-0 top-0 z-0 pointer-events-none">
        <CloudinaryImage
          src="/decoration/flower-decoration-left-bottom-corner2.png"
          alt="Flower decoration"
          width={300}
          height={300}
          className="w-auto h-auto max-w-[140px] sm:max-w-[180px] md:max-w-[220px] lg:max-w-[260px] opacity-25 scale-y-[-1]"
          priority={false}
          style={{ filter: GALLERY_DECO_FILTER }}
        />
      </div>
      
      {/* Flower decoration - top right corner */}
      <div className="absolute right-0 top-0 z-0 pointer-events-none">
        <CloudinaryImage
          src="/decoration/flower-decoration-left-bottom-corner2.png"
          alt="Flower decoration"
          width={300}
          height={300}
          className="w-auto h-auto max-w-[140px] sm:max-w-[180px] md:max-w-[220px] lg:max-w-[260px] opacity-25 scale-x-[-1] scale-y-[-1]"
          priority={false}
          style={{ filter: GALLERY_DECO_FILTER }}
        />
      </div>
      
      {/* Flower decoration - left bottom corner */}
      <div className="absolute left-0 bottom-0 z-0 pointer-events-none">
        <CloudinaryImage
          src="/decoration/flower-decoration-left-bottom-corner2.png"
          alt="Flower decoration"
          width={300}
          height={300}
          className="w-auto h-auto max-w-[140px] sm:max-w-[180px] md:max-w-[220px] lg:max-w-[260px] opacity-25"
          priority={false}
          style={{ filter: GALLERY_DECO_FILTER }}
        />
      </div>
      
      {/* Flower decoration - right bottom corner */}
      <div className="absolute right-0 bottom-0 z-0 pointer-events-none">
        <CloudinaryImage
          src="/decoration/flower-decoration-left-bottom-corner2.png"
          alt="Flower decoration"
          width={300}
          height={300}
          className="w-auto h-auto max-w-[140px] sm:max-w-[180px] md:max-w-[220px] lg:max-w-[260px] opacity-25 scale-x-[-1]"
          priority={false}
          style={{ filter: GALLERY_DECO_FILTER }}
        />
      </div>

      <section className="relative z-10 max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-8 sm:py-16">
        <div className="text-center mb-6 sm:mb-8 md:mb-10 px-3 sm:px-4">
          {/* Decorative element above title - match Details/Gallery */}
          <div className="flex items-center justify-center gap-2 mb-3 sm:mb-4">
            <div
              className="w-8 sm:w-12 md:w-16 h-px bg-gradient-to-r from-transparent to-transparent"
              style={{ background: `linear-gradient(to right, transparent, ${GALLERY_TEXT}40, transparent)` }}
            />
            <div className="w-1.5 h-1.5 rounded-full opacity-80" style={{ backgroundColor: GALLERY_TEXT }} />
            <div className="w-1.5 h-1.5 rounded-full opacity-50" style={{ backgroundColor: GALLERY_TEXT }} />
            <div className="w-1.5 h-1.5 rounded-full opacity-80" style={{ backgroundColor: GALLERY_TEXT }} />
            <div
              className="w-8 sm:w-12 md:w-16 h-px bg-gradient-to-r from-transparent to-transparent"
              style={{ background: `linear-gradient(to right, transparent, ${GALLERY_TEXT}40, transparent)` }}
            />
          </div>

          <h1
            className={`${cinzel.className} text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-normal mb-2 sm:mb-3 md:mb-4`}
            style={{ color: GALLERY_TEXT }}
          >
            Our Love Story Gallery
          </h1>
          <p
            className={`${cormorant.className} text-xs sm:text-sm md:text-base lg:text-lg font-light max-w-xl mx-auto leading-relaxed px-2`}
            style={{ color: GALLERY_TEXT }}
          >
            Every photograph tells a story of {siteConfig.couple.groomNickname} & {siteConfig.couple.brideNickname}'s journey to
            forever
          </p>

          {/* Decorative element below subtitle */}
          <div className="flex items-center justify-center gap-2 mt-3 sm:mt-4">
            <div className="w-1.5 h-1.5 rounded-full opacity-80" style={{ backgroundColor: GALLERY_TEXT }} />
            <div className="w-1.5 h-1.5 rounded-full opacity-50" style={{ backgroundColor: GALLERY_TEXT }} />
            <div className="w-1.5 h-1.5 rounded-full opacity-80" style={{ backgroundColor: GALLERY_TEXT }} />
          </div>
        </div>

        {images.length === 0 ? (
          <div className={`${cormorant.className} text-center`} style={{ color: `${GALLERY_TEXT}e6` }}>
            <p className="font-light">
              No images found. Add files to{" "}
              <code
                className="px-2 py-1 rounded border"
                style={{ backgroundColor: `${GALLERY_TEXT}10`, borderColor: `${GALLERY_TEXT}40`, color: GALLERY_TEXT }}
              >
                public/mobile-background
              </code>{" "}
              or{" "}
              <code
                className="px-2 py-1 rounded border"
                style={{ backgroundColor: `${GALLERY_TEXT}10`, borderColor: `${GALLERY_TEXT}40`, color: GALLERY_TEXT }}
              >
                public/desktop-background
              </code>
              .
            </p>
          </div>
        ) : (
          <MasonryGallery images={images} />
        )}


      </section>
    </main>
  )
}