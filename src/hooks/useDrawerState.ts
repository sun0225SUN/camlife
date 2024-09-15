import { useCallback, useEffect, useState } from "react"

export function useDrawerState() {
  const [drawerState, setDrawerState] = useState({
    exif: false,
    location: false,
  })

  const toggleDrawer = useCallback((drawer: "exif" | "location") => {
    setDrawerState((prev) => ({ ...prev, [drawer]: !prev[drawer] }))
  }, [])

  const setOverflowUnset = useCallback(() => {
    document.body.style.overflow = "unset"
  }, [])

  useEffect(() => {
    const handleResize = () => {
      setOverflowUnset()
      setDrawerState({ exif: false, location: false })
    }

    window.addEventListener("resize", handleResize)

    return () => {
      window.removeEventListener("resize", handleResize)
      setOverflowUnset()
    }
  }, [setOverflowUnset])

  useEffect(() => {
    document.body.style.overflow =
      drawerState.exif || drawerState.location ? "hidden" : "unset"
  }, [drawerState])

  return { drawerState, toggleDrawer }
}
