const PLACES_KEY = 'terratrail.places.v1'
const THEME_KEY = 'terratrail.theme.v1'

export function loadPlaces() {
  try {
    const raw = localStorage.getItem(PLACES_KEY)
    if (!raw) return seedPlaces()
    const parsed = JSON.parse(raw)
    if (Array.isArray(parsed) && parsed.length) return parsed
    return seedPlaces()
  } catch {
    return seedPlaces()
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

function seedPlaces() {
  const now = new Date().toISOString()
  return [
    {
      id: 'seed-singapore',
      name: 'Singapore 🇸🇬',
      date: '2024-02-10',
      notes: 'Neon nights, hawker stalls, and skyline views from Marina Bay.',
      imageUrl:
        'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?auto=format&fit=crop&w=1200&q=60',
      rating: 5,
      tags: ['Visited', 'Favorite', '2024 Trip'],
      lat: 1.3521,
      lng: 103.8198,
      createdAt: now,
    },
    {
      id: 'seed-tokyo',
      name: 'Tokyo 🇯🇵',
      date: '2024-03-22',
      notes: 'Late-night ramen, Shibuya crossings, and quiet shrines in the city.',
      imageUrl:
        'https://images.unsplash.com/photo-1549692520-acc6669e2f0c?auto=format&fit=crop&w=1200&q=60',
      rating: 5,
      tags: ['Visited', '2024 Trip'],
      lat: 35.6762,
      lng: 139.6503,
      createdAt: now,
    },
    {
      id: 'seed-paris',
      name: 'Paris 🇫🇷',
      date: '2023-09-05',
      notes: 'Cafés, museums, and golden-hour walks along the Seine.',
      imageUrl:
        'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1200&q=60',
      rating: 4,
      tags: ['Visited'],
      lat: 48.8566,
      lng: 2.3522,
      createdAt: now,
    },
    {
      id: 'seed-iceland',
      name: 'Iceland 🇮🇸',
      date: '2022-11-14',
      notes: 'Northern lights, black sand beaches, and waterfall chasing.',
      imageUrl:
        'https://images.unsplash.com/photo-1441829266145-6d4bfbd38eb4?auto=format&fit=crop&w=1200&q=60',
      rating: 5,
      tags: ['Visited', 'Favorite'],
      lat: 64.9631,
      lng: -19.0208,
      createdAt: now,
    },
  ]
}
