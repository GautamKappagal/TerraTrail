const PLACES_KEY = 'terratrail.places.v1'
const THEME_KEY = 'terratrail.theme.v1'

export function loadPlaces() {
  try {
    const raw = localStorage.getItem(PLACES_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

export function savePlaces(places) {
  try {
    localStorage.setItem(PLACES_KEY, JSON.stringify(places))
  } catch {
    // ignore write failures (private mode / quota)
  }
}

export function loadTheme() {
  try {
    const raw = localStorage.getItem(THEME_KEY)
    return raw === 'light' || raw === 'dark' ? raw : null
  } catch {
    return null
  }
}

export function saveTheme(theme) {
  try {
    localStorage.setItem(THEME_KEY, theme)
  } catch {
    // ignore
  }
}

