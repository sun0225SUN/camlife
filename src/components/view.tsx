"use client"

import clsx from "clsx"
import { SlideshowLightbox, initLightboxJS } from "lightbox.js-react"
import "lightbox.js-react/dist/index.css"
import { useTheme } from "next-themes"
import Image from "next/image"
import { useCallback, useEffect, useMemo, useState } from "react"
import { useInView } from "react-intersection-observer"
import { Loading } from "~/components/loading"
import { PhotoInfo } from "~/components/photo-info"
import { CardBody, CardContainer, CardItem } from "~/components/ui/3d-card"
import { useTab } from "~/store/useTab"
import { useView } from "~/store/useView"
import { api } from "~/trpc/react"
import { type TabType } from "~/types/tabs"

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
  const { tab } = useTab() as { tab: TabType }
  const [userLocation, setUserLocation] =
    useState<GeolocationCoordinates | null>(null)
  const [locationStatus, setLocationStatus] = useState<
    "pending" | "granted" | "denied" | null
  >(null)
  const { ref, inView } = useInView()

  useEffect(() => {
    initLightboxJS("6CDB-34FD-F513-A6FC", "individual")
  }, [])

  const getLocation = useCallback(() => {
    if (tab !== "nearby" && tab !== "faraway") return

    setLocationStatus("pending")
    if (!("geolocation" in navigator)) {
      console.error("This browser does not support geolocation")
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

  useEffect(() => {
    getLocation()
  }, [getLocation])

  const getLimitByView = useCallback((view: string) => {
    const limits: Record<string, number> = { grid: 20, waterfall: 10, feed: 5 }
    return limits[view] ?? 10
  }, [])

  const { data, fetchNextPage, hasNextPage, isLoading, isFetchingNextPage } =
    api.photos.getAllPhotos.useInfiniteQuery(
      {
        tab,
        ...((tab === "nearby" || tab === "faraway") &&
          userLocation && {
            location: `${userLocation.latitude},${userLocation.longitude}`,
          }),
        limit: getLimitByView(view),
      },
      {
        getNextPageParam: (lastPage) => lastPage.nextCursor,
        refetchOnWindowFocus: false,
        staleTime: tab === "shuffle" ? 0 : 5 * 60 * 1000,
        enabled:
          (tab !== "nearby" && tab !== "faraway") ||
          locationStatus === "granted",
      },
    )

  useEffect(() => {
    if (inView && hasNextPage) {
      void fetchNextPage()
    }
  }, [inView, hasNextPage, fetchNextPage])

  const photos = useMemo(
    () => data?.pages.flatMap((page) => page.items) ?? [],
    [data],
  )

  const isLoadingOrFetching =
    isLoading ||
    (isFetchingNextPage && tab === "shuffle") ||
    locationStatus === "pending"

  const lightboxTheme = resolvedTheme === "dark" ? "night" : "day"

  const lightboxImages = useMemo(
    () => photos?.map(({ url }) => ({ src: url })),
    [photos],
  )

  if (isLoadingOrFetching) {
    return (
      <div className="flex h-[60vh] w-full items-center justify-center">
        <Loading />
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
    <div className="max-w-[100vw] xl:px-48">
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
        {photos.map((photo) => {
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
            <CardContainer containerClassName="py-0 md:mb-6" key={photo.uuid}>
              <CardBody className="h-auto w-auto">
                <CardItem translateZ="50">
                  {/* @ts-expect-error eslint-disable-line*/}
                  <Image {...imageProps} alt={photo.uuid} />
                </CardItem>
              </CardBody>
            </CardContainer>
          ) : (
            <div key={photo.uuid} className="flex flex-col items-center">
              {/* @ts-expect-error eslint-disable-line*/}
              <Image {...imageProps} alt={photo.uuid} />
              {view === "feed" && <PhotoInfo {...photo} />}
            </div>
          )
        })}
      </SlideshowLightbox>
      {isFetchingNextPage && (
        <div
          className={clsx(
            "mb-5 flex justify-center",
            view !== "feed" && "mt-5 md:mt-10",
          )}
        >
          <Loading />
        </div>
      )}
      <div ref={ref} className="h-1 w-full" />
    </div>
  )
}
