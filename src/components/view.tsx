"use client"

import { SlideshowLightbox } from "lightbox.js-react"
import "lightbox.js-react/dist/index.css"
import { useTheme } from "next-themes"
import Image from "next/image"
import { useMemo } from "react"
import { CardBody, CardContainer, CardItem } from "~/components/ui/3d-card"
import { useView } from "~/store/useView"
import { api } from "~/trpc/react"
import { type ViewType } from "~/types/view"

const getContainerStyle = (view: ViewType): string => {
  switch (view) {
    case "grid":
      return "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
    case "waterfall":
      return "columns-1 sm:columns-2 md:columns-3 xl:columns-4 md:gap-6"
    default:
      return "flex flex-col"
  }
}

const getImageStyle = (view: ViewType): string => {
  switch (view) {
    case "grid":
      return "w-[600px] h-[200px] object-cover transition-transform duration-300 ease-in-out hover:scale-105"
    case "waterfall":
      return "md:mb-6 break-inside-avoid md:rounded-xl hover:shadow-xl"
    default:
      return "w-full md:mb-8 md:rounded-xl"
  }
}

export function View() {
  const { view } = useView()
  const { theme } = useTheme()
  const { data: photos, isLoading } = api.photos.getAllPhotos.useQuery()

  const lightboxTheme = theme === "dark" ? "night" : "day"

  const lightboxImages = useMemo(
    () =>
      photos?.map((photo) => ({
        src: photo.url,
        alt: photo.title,
      })),
    [photos],
  )

  if (isLoading) return <div>加载中...</div>

  return (
    <div className="md:px-32">
      <SlideshowLightbox
        key={view}
        theme={lightboxTheme}
        lightboxIdentifier="lightbox"
        framework="next"
        imgAnimation="fade"
        modalClose="clickOutside"
        showThumbnails={true}
        showControls={false}
        images={lightboxImages}
      >
        <div className={getContainerStyle(view)}>
          {photos?.map((photo) =>
            view === "waterfall" ? (
              <CardContainer containerClassName="py-0" key={photo.id}>
                <CardBody className="h-auto w-auto">
                  <CardItem translateZ="50">
                    <Image
                      data-lightboxjs="lightbox"
                      src={photo.url}
                      alt={photo.title ?? "照片"}
                      width={photo.width}
                      height={photo.height}
                      className={getImageStyle(view)}
                      placeholder="blur"
                      blurDataURL={photo.blurData ?? ""}
                      loading="lazy"
                    />
                  </CardItem>
                </CardBody>
              </CardContainer>
            ) : (
              <Image
                key={photo.id}
                data-lightboxjs="lightbox"
                className={getImageStyle(view)}
                src={photo.url}
                alt={photo.title ?? "照片"}
                width={view === "grid" ? 400 : photo.width}
                height={view === "grid" ? 200 : photo.height}
                style={view === "grid" ? { objectFit: "cover" } : undefined}
                placeholder="blur"
                blurDataURL={photo.blurData ?? ""}
                loading="lazy"
              />
            ),
          )}
        </div>
      </SlideshowLightbox>
    </div>
  )
}
