export function getCurrentPosition(options = {}) {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by your browser.'))
      return
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        })
      },
      (error) => {
        if (error.code === error.PERMISSION_DENIED) {
          reject(new Error('Location permission denied. Please allow access to use nearby filtering.'))
        } else if (error.code === error.POSITION_UNAVAILABLE) {
          reject(new Error('Unable to determine your location. Please try again.'))
        } else if (error.code === error.TIMEOUT) {
          reject(new Error('Location request timed out. Please try again.'))
        } else {
          reject(new Error('Unable to access your location.'))
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000,
        ...options,
      }
    )
  })
}

export function formatDistance(km) {
  if (km == null) return null
  if (km < 1) return `${Math.round(km * 1000)} m away`
  return `${km} km away`
}
