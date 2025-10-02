interface PhotoHoverOverlayProps {
  title?: string
  description?: string
  isPortrait: boolean
}

export function PhotoHoverOverlay({
  title,
  description,
  isPortrait,
}: PhotoHoverOverlayProps) {
  return (
    <div className='absolute inset-0 overflow-hidden rounded-lg'>
      <div className='absolute inset-x-0 bottom-0 h-0 bg-gradient-to-t from-0% from-black/80 via-30% via-black/20 to-50% to-transparent transition-all duration-500 ease-out group-hover:h-full'>
        <div
          className={`absolute inset-x-0 bottom-0 p-6 text-white ${isPortrait ? 'flex flex-col justify-end' : ''}`}
        >
          {title && (
            <h3 className='mb-2 translate-y-8 transform font-semibold text-xl opacity-0 transition-all delay-200 duration-500 ease-out group-hover:translate-y-0 group-hover:opacity-100'>
              {title}
            </h3>
          )}
          {description && (
            <p className='translate-y-8 transform text-gray-200 text-sm leading-relaxed opacity-0 transition-all delay-200 duration-500 ease-out group-hover:translate-y-0 group-hover:opacity-100'>
              {description}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
