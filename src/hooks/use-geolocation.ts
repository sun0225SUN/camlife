'use client'

import { useTranslations } from 'next-intl'
import { useCallback, useEffect, useRef, useState } from 'react'

interface GeolocationState {
  latitude: number | null
  longitude: number | null
  accuracy: number | null
  error: string | null
  loading: boolean
}

interface GeolocationOptions {
  enableHighAccuracy?: boolean
  timeout?: number
  maximumAge?: number
}

const defaultOptions: GeolocationOptions = {
  enableHighAccuracy: true,
  timeout: 10000,
  maximumAge: 300000, // 5 minutes
}

export function useGeolocation(options: GeolocationOptions = {}) {
  const t = useTranslations('common')
  const [state, setState] = useState<GeolocationState>({
    latitude: null,
    longitude: null,
    accuracy: null,
    error: null,
    loading: false,
  })

  const optionsRef = useRef(options)
  optionsRef.current = options

  const getCurrentPosition = useCallback(() => {
    if (!navigator.geolocation) {
      setState((prev) => ({
        ...prev,
        error: t('geolocation-not-supported'),
        loading: false,
      }))
      return
    }

    setState((prev) => ({ ...prev, loading: true, error: null }))

    const opts = { ...defaultOptions, ...optionsRef.current }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setState({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
          error: null,
          loading: false,
        })
      },
      (error) => {
        let errorMessage = t('unknown-error-occurred')

        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = t('user-denied-geolocation')
            break
          case error.POSITION_UNAVAILABLE:
            errorMessage = t('location-information-unavailable')
            break
          case error.TIMEOUT:
            errorMessage = t('location-request-timed-out')
            break
        }

        setState({
          latitude: null,
          longitude: null,
          accuracy: null,
          error: errorMessage,
          loading: false,
        })
      },
      opts,
    )
  }, [t])

  useEffect(() => {
    getCurrentPosition()
  }, [getCurrentPosition])

  return {
    ...state,
    getCurrentPosition,
  }
}
