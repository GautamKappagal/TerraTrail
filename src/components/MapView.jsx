import { useEffect, useMemo, useRef } from 'react'
import { MapContainer, Marker, Popup, TileLayer, useMap, useMapEvents } from 'react-leaflet'
import { FiCalendar, FiMapPin } from 'react-icons/fi'
import MarkerClusterGroup from 'react-leaflet-cluster'
import { motion, AnimatePresence } from 'framer-motion'
import L from 'leaflet'

function makePinIcon({ active, rating }) {
  const score = typeof rating === 'number' ? rating : 4
  const cls = active ? 'tt-pin tt-pin--active' : 'tt-pin'
  return L.divIcon({
    className: 'tt-pin-wrap',
    iconSize: [34, 34],
    iconAnchor: [17, 30],
    popupAnchor: [0, -22],
    html: `
      <div class="${cls}">
        <div class="tt-pin__ring"></div>
        <div class="tt-pin__core">
          <span class="tt-pin__score">${score}</span>
        </div>
        <div class="tt-pin__stem"></div>
      </div>
    `,
  })
}

function MapClickHandler({ onMapClick }) {
  useMapEvents({
    click(e) {
      onMapClick?.(e.latlng)
    },
  })
  return null
}

function MapController({ selectedPlace, places, markerRefs }) {
  const map = useMap()

  useEffect(() => {
    if (!map) return
    if (selectedPlace) return
    if (!places.length) return
    const bounds = L.latLngBounds(places.map((p) => [p.lat, p.lng]))
    map.fitBounds(bounds.pad(0.25), { animate: true, duration: 0.8 })
  }, [map, selectedPlace, places])

  useEffect(() => {
    if (!selectedPlace) return
    map.flyTo([selectedPlace.lat, selectedPlace.lng], Math.max(map.getZoom(), 6), { duration: 0.8 })
  }, [map, selectedPlace])

  useEffect(() => {
    if (!selectedPlace) return
    const marker = markerRefs.current.get(selectedPlace.id)
    if (!marker) return
    const t = window.setTimeout(() => {
      try {
        marker.openPopup()
      } catch {
        // ignore
      }
    }, 220)
    return () => window.clearTimeout(t)
  }, [selectedPlace, markerRefs])

  return null
}

export default function MapView({ places, selectedId, onMapClick, onSelect, theme }) {
  const markerRefs = useRef(new Map())

  const selectedPlace = useMemo(() => {
    return places.find((p) => p.id === selectedId) || null
  }, [places, selectedId])

  const iconsById = useMemo(() => {
    const map = new Map()
    for (const p of places) {
      map.set(p.id, makePinIcon({ active: p.id === selectedId, rating: p.rating }))
    }
    return map
  }, [places, selectedId])

  return (
    <div className="relative h-full w-full">
      <div className="pointer-events-none absolute inset-0 z-10">
        <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-black/40 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-black/45 to-transparent" />
      </div>
      <div className="pointer-events-none absolute inset-0 z-10">
        <div className="absolute left-4 top-4 hidden rounded-2xl border border-white/10 bg-slate-950/40 px-4 py-3 text-sm text-slate-200 shadow-glass backdrop-blur-xl md:block">
          <div className="font-semibold text-slate-50">Click to drop a pin</div>
          <div className="mt-0.5 text-xs text-slate-300">Save a destination with notes + photo.</div>
        </div>
      </div>

      <MapContainer center={[20, 0]} zoom={2} scrollWheelZoom className="h-full w-full">
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          className={theme === 'dark' ? 'tt-dark-tiles' : ''}
        />
        <MapClickHandler onMapClick={onMapClick} />
        <MapController selectedPlace={selectedPlace} places={places} markerRefs={markerRefs} />

        <MarkerClusterGroup chunkedLoading showCoverageOnHover={false}>
          {places.map((place) => (
            <Marker
              key={place.id}
              position={[place.lat, place.lng]}
              icon={iconsById.get(place.id)}
              eventHandlers={{ click: () => onSelect?.(place.id) }}
              ref={(marker) => {
                if (!marker) return
                markerRefs.current.set(place.id, marker)
              }}
            >
              <Popup>
                <div className="w-[260px]">
                  <div className="aspect-[4/3] overflow-hidden rounded-xl bg-slate-900">
                    <img
                      src={place.imageUrl}
                      alt=""
                      className="h-full w-full object-cover"
                      loading="lazy"
                    />
                  </div>
                  <div className="mt-3">
                    <div className="flex items-center gap-2 text-sm font-semibold text-slate-50">
                      <FiMapPin className="text-fuchsia-300" />
                      <span className="line-clamp-2">{place.name}</span>
                    </div>
                    <div className="mt-1 flex items-center gap-2 text-xs text-slate-300">
                      <FiCalendar />
                      <span>{place.date}</span>
                    </div>
                    {place.tags?.length ? (
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {place.tags.slice(0, 3).map((t) => (
                          <span
                            key={t}
                            className="rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-[11px] text-slate-200"
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    ) : null}
                    {place.notes ? (
                      <p className="mt-2 text-sm leading-relaxed text-slate-200/90">{place.notes}</p>
                    ) : (
                      <p className="mt-2 text-sm text-slate-400">No notes yet.</p>
                    )}
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}
        </MarkerClusterGroup>
      </MapContainer>

      <AnimatePresence>
        {!places.length ? (
          <motion.div
            className="pointer-events-none absolute inset-0 z-20 grid place-items-center p-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="relative w-full max-w-xl">
              <motion.div
                className="absolute -inset-8 rounded-full bg-fuchsia-500/10 blur-3xl"
                animate={{ opacity: [0.35, 0.65, 0.35], scale: [0.98, 1.02, 0.98] }}
                transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut' }}
              />
              <div className="relative rounded-3xl border border-white/10 bg-slate-950/55 p-6 shadow-glass backdrop-blur-xl">
                <div className="flex items-start gap-4">
                  <div className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-fuchsia-500/25 to-cyan-400/20 text-xl">
                    🗺️
                  </div>
                  <div className="min-w-0">
                    <div className="text-lg font-semibold tracking-tight text-slate-50">
                      Start your travel journal
                    </div>
                    <div className="mt-1 text-sm leading-relaxed text-slate-300">
                      Click anywhere to drop a pin. Add a photo, notes, rating, and tags — then revisit your memories by
                      tapping markers or the sidebar.
                    </div>
                    <div className="mt-4 text-xs text-slate-300">
                      Pro tip: try “Favorite” + a landscape photo for a premium look.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  )
}
