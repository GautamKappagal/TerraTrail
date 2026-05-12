import { useEffect, useMemo, useState } from 'react'
import { FiMoon, FiPlus, FiSun } from 'react-icons/fi'
import AddPlaceModal from './components/AddPlaceModal.jsx'
import MapView from './components/MapView.jsx'
import Sidebar from './components/Sidebar.jsx'
import { loadPlaces, loadTheme, savePlaces, saveTheme } from './data/storage.js'

function applyTheme(theme) {
  const root = document.documentElement
  root.classList.toggle('dark', theme === 'dark')
}

export default function App() {
  const [places, setPlaces] = useState(() => loadPlaces())
  const [selectedId, setSelectedId] = useState(null)
  const [pendingLatLng, setPendingLatLng] = useState(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [theme, setTheme] = useState(() => loadTheme() || 'dark')

  useEffect(() => {
    applyTheme(theme)
    saveTheme(theme)
  }, [theme])

  useEffect(() => {
    savePlaces(places)
  }, [places])

  useEffect(() => {
    if (!selectedId && places.length) setSelectedId(places[0].id)
  }, [places, selectedId])

  const selectedPlace = useMemo(() => {
    if (!selectedId) return null
    return places.find((p) => p.id === selectedId) || null
  }, [places, selectedId])

  const openAddModalFor = (latlng) => {
    setPendingLatLng(latlng)
    setModalOpen(true)
  }

  const handleAdd = (payload) => {
    const id = crypto.randomUUID()
    const next = {
      id,
      name: payload.name,
      date: payload.date,
      notes: payload.notes,
      imageUrl: payload.imageUrl,
      rating: typeof payload.rating === 'number' ? payload.rating : 4,
      tags: Array.isArray(payload.tags) ? payload.tags : ['Visited'],
      lat: payload.lat,
      lng: payload.lng,
      createdAt: new Date().toISOString(),
    }
    setPlaces((prev) => [next, ...prev])
    setSelectedId(id)
    setModalOpen(false)
    setPendingLatLng(null)
  }

  const handleDelete = (id) => {
    setPlaces((prev) => {
      const next = prev.filter((p) => p.id !== id)
      setSelectedId((curr) => (curr === id ? next[0]?.id || null : curr))
      return next
    })
  }

  return (
    <div className="h-svh w-full overflow-hidden">
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -left-20 -top-32 h-[420px] w-[420px] rounded-full bg-fuchsia-500/25 blur-3xl"/>
        <div className="absolute -bottom-28 -right-20 h-[520px] w-[520px] rounded-full bg-cyan-400/20 blur-3xl"/>
      </div>

      <main className="relative h-full w-full">
        <MapView
          places={places}
          selectedId={selectedId}
          onSelect={setSelectedId}
          onMapClick={(latlng) => openAddModalFor(latlng)}
          theme={theme}
        />

        <Sidebar
          open={sidebarOpen}
          onToggle={() => setSidebarOpen((v) => !v)}
          places={places}
          selectedId={selectedId}
          onSelect={setSelectedId}
          onDelete={handleDelete}
          search={search}
          onSearchChange={setSearch}
          onAddClick={() => {
            setSidebarOpen(false)
            openAddModalFor(pendingLatLng || { lat: 20, lng: 0 })
          }}
        />

        <div className="absolute right-4 top-4 z-[600] hidden items-center gap-2 md:flex">
          <button
            type="button"
            onClick={() => setTheme((t) => (t === 'dark' ? 'light' : 'dark'))}
            className="rounded-2xl border border-white/10 bg-slate-950/40 px-3 py-2 text-sm font-medium text-slate-100 shadow-glass backdrop-blur-xl transition hover:bg-slate-950/55"
            aria-label="Toggle theme"
            title="Toggle theme"
          >
            <span className="inline-flex items-center gap-2">
              {theme === 'dark' ? <FiSun /> : <FiMoon />}
              <span className="hidden lg:inline">{theme === 'dark' ? 'Light' : 'Dark'}</span>
            </span>
          </button>
          <button
            type="button"
            onClick={() =>
              openAddModalFor(
                selectedPlace ? { lat: selectedPlace.lat, lng: selectedPlace.lng } : { lat: 20, lng: 0 },
              )
            }
            className="rounded-2xl bg-gradient-to-r from-fuchsia-500 to-cyan-400 px-4 py-2 text-sm font-semibold text-slate-950 shadow-glass transition hover:brightness-110 hover:shadow-[0_18px_50px_rgba(34,211,238,0.18)] active:scale-[0.99]"
          >
            <span className="inline-flex items-center gap-2">
              <FiPlus /> Add
            </span>
          </button>
        </div>
      </main>

      <AddPlaceModal
        open={modalOpen}
        latLng={pendingLatLng}
        onClose={() => {
          setModalOpen(false)
          setPendingLatLng(null)
        }}
        onSave={handleAdd}
      />
    </div>
  )
}