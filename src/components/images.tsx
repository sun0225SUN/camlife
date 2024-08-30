"use client"

import { SlideshowLightbox } from "lightbox.js-react"
import "lightbox.js-react/dist/index.css"
import { useTheme } from "next-themes"
import Image from "next/image"
import { api } from "~/trpc/react"

export function Images() {
  const { theme } = useTheme()

  const lightboxTheme = theme === "dark" ? "night" : "day"

  const { data: photos, isLoading } = api.photos.getAllPost.useQuery()

  if (isLoading) return <div>Loading...</div>

  return (
    <div className="md:px-32">
      <SlideshowLightbox
        theme={lightboxTheme}
        lightboxIdentifier="lightbox"
        framework="next"
        imgAnimation="fade"
        modalClose="clickOutside"
        showThumbnails={true}
        showControls={false}
        images={photos?.map((photo) => ({
          src: photo.url,
          alt: photo.title,
        }))}
      >
        {photos?.map((photo) => (
          <div className="md:my-10" key={photo.id}>
            <Image
              className="md:rounded-lg"
              src={photo.url}
              alt="photos"
              width={0}
              height={0}
              sizes="100vw"
              style={{ width: "100%", height: "auto" }}
              data-lightboxjs="lightbox"
            />
          </div>
        ))}
      </SlideshowLightbox>
    </div>
  )
}
