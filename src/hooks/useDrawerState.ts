import { useCallback, useEffect, useState } from "react"

export function useDrawerState() {
  const [drawerState, setDrawerState] = useState({
    exif: false,
    location: false,
  })

  const toggleDrawer = useCallback((drawer: "exif" | "location") => {
    setDrawerState((prev) => ({ ...prev, [drawer]: !prev[drawer] }))
  }, [])

  useEffect(() => {
    document.body.style.overflow =
      drawerState.exif || drawerState.location ? "hidden" : "unset"
    return () => {
      document.body.style.overflow = "unset"
    }
  }, [drawerState])

  return { drawerState, toggleDrawer }
}
