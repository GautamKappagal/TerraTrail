import { useEffect, useMemo, useRef } from 'react'
import { MapContainer, Marker, Popup, TileLayer, useMap, useMapEvents } from 'react-leaflet'
import { FiCalendar, FiMapPin } from 'react-icons/fi'

function MapClickHandler({ onMapClick }) {
  useMapEvents({
    click(e) {
      onMapClick?.(e.latlng)
    },
  })
  return null
}

function MapController({ selectedPlace, markerRefs }) {
  const map = useMap()

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

export default function MapView({ places, selectedId, onMapClick, onSelect }) {
  const markerRefs = useRef(new Map())

  const selectedPlace = useMemo(() => {
    return places.find((p) => p.id === selectedId) || null
  }, [places, selectedId])

  return (
    <div className="relative h-full w-full">
      <div className="pointer-events-none absolute inset-0 z-10">
        <div className="absolute left-4 top-4 hidden rounded-2xl border border-white/10 bg-slate-950/40 px-4 py-3 text-sm text-slate-200 shadow-glass backdrop-blur-xl md:block">
          <div className="font-semibold text-slate-50">Click to drop a pin</div>
          <div className="mt-0.5 text-xs text-slate-300">Save a destination with notes + photo.</div>
        </div>
      </div>

      <MapContainer center={[20, 0]} zoom={2} scrollWheelZoom className="h-full w-full">
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <MapClickHandler onMapClick={onMapClick} />
        <MapController selectedPlace={selectedPlace} markerRefs={markerRefs} />

        {places.map((place) => (
          <Marker
            key={place.id}
            position={[place.lat, place.lng]}
            eventHandlers={{ click: () => onSelect?.(place.id) }}
            ref={(marker) => {
              if (!marker) return
              markerRefs.current.set(place.id, marker)
            }}
          >
            <Popup>
              <div className="w-[260px]">
                <div className="aspect-[4/3] overflow-hidden rounded-xl bg-slate-900">
                  <img src={place.imageUrl} alt="" className="h-full w-full object-cover" loading="lazy" />
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
      </MapContainer>
    </div>
  )
}
