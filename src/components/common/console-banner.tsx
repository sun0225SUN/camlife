'use client'

import { useEffect } from 'react'

export function ConsoleBanner() {
  useEffect(() => {
    const banner = `
   ██████╗ █████╗ ███╗   ███╗██╗     ██╗███████╗███████╗
  ██╔════╝██╔══██╗████╗ ████║██║     ██║██╔════╝██╔════╝
  ██║     ███████║██╔████╔██║██║     ██║█████╗  █████╗
  ██║     ██╔══██║██║╚██╔╝██║██║     ██║██╔══╝  ██╔══╝
  ╚██████╗██║  ██║██║ ╚═╝ ██║███████╗██║██║     ███████╗
   ╚═════╝╚═╝  ╚═╝╚═╝     ╚═╝╚══════╝╚═╝╚═╝     ╚══════╝
    `

    console.log(
      `%c${banner}`,
      'color: #00d2ff; font-weight: bold; font-family: monospace; font-size: 12px;',
    )
  }, [])

  return null
}
