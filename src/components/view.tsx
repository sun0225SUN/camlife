"use client"

import { SlideshowLightbox, initLightboxJS } from "lightbox.js-react"
import "lightbox.js-react/dist/index.css"
import { useTheme } from "next-themes"
import Image from "next/image"
import { useEffect, useMemo, useState } from "react"
import { ThreeDot } from "react-loading-indicators"
import { PhotoInfo } from "~/components/photo-info"
import { CardBody, CardContainer, CardItem } from "~/components/ui/3d-card"
import { useTab } from "~/store/useTab"
import { useView } from "~/store/useView"
import { api } from "~/trpc/react"

const styles = {
  container: {
    grid: "grid grid-cols-3 lg:grid-cols-4",
    waterfall: "columns-2 md:columns-3 xl:columns-4 md:gap-6 gap-0",
    default: "flex flex-col items-center",
  },
  image: {
    grid: "h-[100px] md:h-[200px] object-cover transition-transform duration-300 ease-in-out hover:scale-105",
    waterfall: "md:rounded-xl hover:shadow-xl",
    default: "xl:rounded-xl xl:shadow-xl xl:shadow-outline",
  },
}

const getAdjustedDimensions = (width: number, height: number) =>
  height > width
    ? { width: Math.floor(800 * (width / height)), height: 800 }
    : { width, height }

export function View() {
  const { view } = useView()
  const { resolvedTheme } = useTheme()
  const { tab } = useTab()
  const [loadingColor, setLoadingColor] = useState<string>()
  const [userLocation, setUserLocation] =
    useState<GeolocationCoordinates | null>(null)
  const [locationStatus, setLocationStatus] = useState<
    "pending" | "granted" | "denied" | null
  >(null)

  useEffect(() => {
    setLoadingColor(resolvedTheme === "dark" ? "#ffffff" : "#000000")
  }, [resolvedTheme])

  useEffect(() => {
    initLightboxJS("6CDB-34FD-F513-A6FC", "individual")
  }, [])

  useEffect(() => {
    if (tab !== "nearby" && tab !== "faraway") return

    setLocationStatus("pending")
    if (!("geolocation" in navigator)) {
      console.error("Geolocation is not supported by this browser")
      setLocationStatus("denied")
      return
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation(position.coords)
        setLocationStatus("granted")
      },
      (error) => {
        console.error("Failed to get geolocation:", error.message)
        setLocationStatus("denied")
      },
    )
  }, [tab])

  const {
    data: photos,
    isLoading,
    isFetching,
  } = api.photos.getAllPhotos.useQuery(
    {
      tab,
      ...((tab === "nearby" || tab === "faraway") &&
        userLocation && {
          location: `${userLocation.latitude},${userLocation.longitude}`,
        }),
    },
    {
      refetchOnWindowFocus: false,
      staleTime: tab === "shuffle" ? 0 : 5 * 60 * 1000,
      enabled:
        (tab !== "nearby" && tab !== "faraway") || locationStatus === "granted",
    },
  )

  const isLoadingOrFetching =
    isLoading ||
    (isFetching && tab === "shuffle") ||
    locationStatus === "pending"

  const lightboxTheme = resolvedTheme === "dark" ? "night" : "day"

  const lightboxImages = useMemo(
    () => photos?.map(({ url, title }) => ({ src: url, alt: title ?? "照片" })),
    [photos],
  )

  if (isLoadingOrFetching) {
    return (
      <div className="flex h-[60vh] w-full items-center justify-center">
        <ThreeDot variant="pulsate" color={loadingColor} size="medium" />
      </div>
    )
  }

  if ((tab === "nearby" || tab === "faraway") && locationStatus === "denied") {
    return (
      <div className="flex h-[60vh] w-full items-center justify-center">
        <p>Location access denied. Unable to display relevant photos.</p>
      </div>
    )
  }

  if (!photos || photos.length === 0) {
    return (
      <div className="flex h-[60vh] w-full items-center justify-center">
        <p>No photos found.</p>
      </div>
    )
  }

  return (
    <div className="min-w-full max-w-[100vw] xl:px-48">
      <SlideshowLightbox
        key={view}
        theme={lightboxTheme}
        images={lightboxImages}
        lightboxIdentifier="lightbox"
        framework="next"
        modalClose="clickOutside"
        imgAnimation="imgDrag"
        showControls={false}
        fullScreen
        className={
          styles.container[view as keyof typeof styles.container] ||
          styles.container.default
        }
      >
        {photos?.map((photo) => {
          const { width, height } = getAdjustedDimensions(
            photo.width,
            photo.height,
          )
          const imageProps = {
            className:
              styles.image[view as keyof typeof styles.image] ||
              styles.image.default,
            src: photo.url,
            width,
            height,
            placeholder: "blur",
            blurDataURL: photo.blurData ?? "",
            loading: "lazy",
            style:
              view === "grid" ? { objectFit: "cover" as const } : undefined,
            "data-lightboxjs": "lightbox",
          }

          return view === "waterfall" ? (
            <CardContainer containerClassName="py-0 md:mb-6" key={photo.id}>
              <CardBody className="h-auto w-auto">
                <CardItem translateZ="50">
                  {/* @ts-expect-error eslint-disable-line*/}
                  <Image {...imageProps} alt={photo.title ?? ""} />
                </CardItem>
              </CardBody>
            </CardContainer>
          ) : (
            <div key={photo.id} className="flex flex-col items-center">
              {/* @ts-expect-error eslint-disable-line*/}
              <Image {...imageProps} alt={photo.title ?? ""} />
              {view === "feed" && <PhotoInfo {...photo} />}
            </div>
          )
        })}
      </SlideshowLightbox>
    </div>
  )
}
