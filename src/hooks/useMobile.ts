import { useMediaQuery } from "@uidotdev/usehooks"

export function useIsMobile() {
  const isMobileQuery = useMediaQuery("only screen and (max-width : 768px)")
  return isMobileQuery
}
