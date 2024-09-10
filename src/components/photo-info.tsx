interface PhotoInfoProps {
  make?: string | null
  model?: string | null
  lensModel?: string | null
}

export const PhotoInfo = ({ make, model, lensModel }: PhotoInfoProps) => {
  return (
    <div className="text-md my-10 flex w-full justify-center gap-4 font-bold">
      <div>{make}</div>
      <div>{model}</div>
      <div>{lensModel}</div>
    </div>
  )
}
