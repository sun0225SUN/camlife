export const MAP_CONFIG = {
  INITIAL_VIEW: {
    longitude: 116.38,
    latitude: 39.9,
    zoom: 2,
  },
  ROTATION: {
    ZOOM_THRESHOLD: 5,
    LONGITUDE_STEP: 6,
    DURATION: 1000,
  },
  PROJECTION_TRANSITION: {
    DURATION: 600,
    DELAY: 300,
    MERCATOR_DURATION: 400,
  },
  CONTROLS_MARGIN: {
    BOTTOM: '80px',
    RIGHT_WITH_CONTROLS: '50px',
    RIGHT_WITHOUT_CONTROLS: '20px',
  },
  POPUP_OFFSET: [0, -15] as [number, number],
}

export const MAP_STYLES = {
  light: 'mapbox://styles/sunguoqi/cm1xkfhra014901qr0td1a0mz',
  dark: 'mapbox://styles/sunguoqi/cm1xkp4hc000i01nthigphlmh',
}
