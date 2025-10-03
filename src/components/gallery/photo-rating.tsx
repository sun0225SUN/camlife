import '@smastrom/react-rating/style.css'
import { Rating } from '@smastrom/react-rating'
import { useTheme } from 'next-themes'
import { useIsClient } from '@/hooks/use-is-client'

interface PhotoRatingProps {
  rating: number
  setRating: (rating: number) => void
}

export function PhotoRating({ rating, setRating }: PhotoRatingProps) {
  const { resolvedTheme } = useTheme()
  const isClient = useIsClient()

  const isDark = isClient ? resolvedTheme === 'dark' : false

  return (
    <Rating
      style={{ maxWidth: 150, width: '100%', minWidth: 120 }}
      value={rating}
      onChange={(value: number) => {
        setRating(value)
      }}
      items={5}
      spaceBetween='medium'
      className='flex-shrink-0'
      itemStyles={{
        itemShapes: (
          <path d='M62.799,23.737c-0.47-1.399-1.681-2.419-3.139-2.642l-16.969-2.593L35.069,2.265 C34.419,0.881,33.03,0,31.504,0c-1.527,0-2.915,0.881-3.565,2.265l-7.623,16.238L3.347,21.096c-1.458,0.223-2.669,1.242-3.138,2.642 c-0.469,1.4-0.115,2.942,0.916,4l12.392,12.707l-2.935,17.977c-0.242,1.488,0.389,2.984,1.62,3.854 c1.23,0.87,2.854,0.958,4.177,0.228l15.126-8.365l15.126,8.365c0.597,0.33,1.254,0.492,1.908,0.492c0.796,0,1.592-0.242,2.269-0.72 c1.231-0.869,1.861-2.365,1.619-3.854l-2.935-17.977l12.393-12.707C62.914,26.68,63.268,25.138,62.799,23.737z'></path>
        ),
        activeFillColor: isDark ? '#ffd700' : '#ff9500',
        inactiveFillColor: isDark ? '#3f3f46' : '#d4d4d8',
      }}
    />
  )
}
