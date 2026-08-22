/**
 * Attempts a real Axios call first. If it fails (no backend yet, network error,
 * 404, etc.) it resolves with local dummy data after a short simulated delay
 * instead — so pages never need to know whether the API is live.
 *
 * Once the Express/Mongo backend exists, requests will simply start succeeding
 * and this fallback path stops being used, with zero changes needed in pages.
 */
export async function withFallback(axiosCall, fallbackFactory, delay = 400) {
  try {
    const response = await axiosCall()
    return response.data
  } catch {
    return new Promise((resolve) => {
      setTimeout(() => resolve(fallbackFactory()), delay)
    })
  }
}
