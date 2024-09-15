import { useCallback, useEffect, useState } from "react"

export function useDrawerState() {
  const [drawerState, setDrawerState] = useState({
    exif: false,
    location: false,
    all: false,
  })

  const toggleDrawer = useCallback((drawer: keyof typeof drawerState) => {
    setDrawerState((prev) => ({ ...prev, [drawer]: !prev[drawer] }))
  }, [])

  const setOverflowUnset = useCallback(() => {
    document.body.style.overflow = "unset"
  }, [])

  useEffect(() => {
    const handleResize = () => {
      setOverflowUnset()
      setDrawerState({ exif: false, location: false, all: false })
    }

    window.addEventListener("resize", handleResize)

    return () => {
      window.removeEventListener("resize", handleResize)
      setOverflowUnset()
    }
  }, [setOverflowUnset])

  useEffect(() => {
    document.body.style.overflow = Object.values(drawerState).some(Boolean)
      ? "hidden"
      : "unset"
  }, [drawerState])

  return { drawerState, toggleDrawer }
}
