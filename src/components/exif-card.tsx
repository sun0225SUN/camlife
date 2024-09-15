interface Props {
  title: string
  value: string | number
  icon: React.ReactNode
}

export function ExifCard({ title, value, icon }: Props) {
  return (
    <div className="flex justify-center">
      <div className="flex h-36 flex-1 flex-col justify-between rounded-2xl border border-gray-200 bg-white p-2 text-sm dark:border-gray-800 dark:bg-black md:w-36">
        <div className="flex flex-col items-start gap-2 p-2">
          <div>{title}</div>
          <div className="text-2xl font-medium">{value}</div>
        </div>
        <div className="flex items-center justify-between p-2">{icon}</div>
      </div>
    </div>
  )
}
