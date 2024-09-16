import clsx from "clsx"
import React from "react"

interface InfoItemProps {
  title?: string
  children: React.ReactNode
  className?: string
  onClick?: () => void
}

export const InfoItem = ({
  title,
  children,
  onClick,
  className,
}: InfoItemProps) => (
  <div
    className={clsx(
      "flex cursor-pointer flex-col items-center justify-center gap-2 rounded-md px-4 py-2 hover:bg-gray-100 dark:hover:bg-[rgba(36,36,36,0.6)]/60",
      className,
    )}
    onClick={onClick}
  >
    <div className="text-xs md:text-sm">{title}</div>
    <div className="text-sm md:text-base">{children}</div>
  </div>
)
