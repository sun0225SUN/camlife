"use client"

import clsx from "clsx"
import { GalleryThumbnails, LayoutGrid, LayoutPanelLeft } from "lucide-react"
import { useView } from "~/store/useView"

export function ViewSwitch() {
  const { view, setView } = useView()

  return (
    <div className="flex items-center gap-4">
      <button
        onClick={() => setView("feed")}
        className={clsx(
          view === "feed"
            ? "text-black dark:text-white"
            : "text-gray-500 hover:text-black dark:hover:text-white",
        )}
      >
        <GalleryThumbnails size={22} strokeWidth={2.25} absoluteStrokeWidth />
      </button>
      <button
        onClick={() => setView("waterfall")}
        className={clsx(
          view === "waterfall"
            ? "text-black dark:text-white"
            : "text-gray-500 hover:text-black dark:hover:text-white",
        )}
      >
        <LayoutPanelLeft size={22} strokeWidth={2.25} absoluteStrokeWidth />
      </button>
      <button
        onClick={() => setView("grid")}
        className={clsx(
          view === "grid"
            ? "text-black dark:text-white"
            : "text-gray-500 hover:text-black dark:hover:text-white",
        )}
      >
        <LayoutGrid size={22} strokeWidth={2.25} absoluteStrokeWidth />
      </button>
    </div>
  )
}
