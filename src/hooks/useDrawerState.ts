import { useCallback, useEffect, useState } from "react"

export function useDrawerState() {
  const [drawerState, setDrawerState] = useState({
    exif: false,
    location: false,
    all: false,
  })

  const toggleDrawer = useCallback((drawer: keyof typeof drawerState) => {
    setDrawerState((prev) => {
      const newState = { ...prev, [drawer]: !prev[drawer] }
      if (newState[drawer]) {
        Object.keys(newState).forEach((key) => {
          if (key !== drawer) {
            newState[key as keyof typeof drawerState] = false
          }
        })
      }
      return newState
    })
  }, [])

  const closeAllDrawers = useCallback(() => {
    setDrawerState({ exif: false, location: false, all: false })
  }, [])

  const setOverflowUnset = useCallback(() => {
    document.body.style.removeProperty("overflow")
  }, [])

  useEffect(() => {
    if (Object.values(drawerState).some(Boolean)) {
      document.body.style.overflow = "hidden"
    } else {
      setOverflowUnset()
    }
  }, [drawerState, setOverflowUnset])

  return { drawerState, toggleDrawer, closeAllDrawers }
}
