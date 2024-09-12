interface PhotoInfoProps {
  make?: string | null
  model?: string | null
  lensModel?: string | null
}

export function PhotoInfo({ make, model, lensModel }: PhotoInfoProps) {
  return (
    <div className="my-10 flex w-full justify-center gap-4 px-4 text-xs font-bold md:text-xl">
      <div>{make}</div>
      <div>{model}</div>
      <div>{lensModel}</div>
    </div>
  )
}
