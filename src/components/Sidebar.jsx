import { useMemo } from 'react'
import { FiMenu, FiPlus, FiSearch, FiX } from 'react-icons/fi'
import PlaceCard from './PlaceCard.jsx'

export default function Sidebar({
  open,
  onToggle,
  places,
  selectedId,
  onSelect,
  onDelete,
  search,
  onSearchChange,
  onAddClick,
}) {
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return places
    return places.filter((p) => {
      return (
        p.name.toLowerCase().includes(q) ||
        (p.notes || '').toLowerCase().includes(q) ||
        (p.date || '').toLowerCase().includes(q)
      )
    })
  }, [places, search])

  return (
    <aside className="relative z-30 w-full md:h-full md:w-[380px] md:max-w-[380px]">
      <div className="flex items-center justify-between gap-3 border-b border-white/10 bg-slate-950/40 px-4 py-4 backdrop-blur-xl md:hidden">
        <div className="min-w-0">
          <div className="text-sm font-semibold tracking-tight text-slate-50">TerraTrail</div>
          <div className="text-xs text-slate-300">
            {places.length ? `${places.length} saved places` : 'Click the map to start'}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onAddClick}
            className="rounded-xl bg-gradient-to-r from-fuchsia-500 to-cyan-400 px-3 py-2 text-sm font-semibold text-slate-950"
          >
            <span className="inline-flex items-center gap-2">
              <FiPlus /> Add
            </span>
          </button>
          <button
            type="button"
            onClick={onToggle}
            className="rounded-xl border border-white/10 bg-white/5 p-2 text-slate-100 transition hover:bg-white/10"
            aria-label={open ? 'Close sidebar' : 'Open sidebar'}
          >
            {open ? <FiX /> : <FiMenu />}
          </button>
        </div>
      </div>

      <div
        className={[
          'md:static md:flex md:h-full md:translate-x-0 md:flex-col md:opacity-100',
          'md:border-r md:border-white/10 md:bg-slate-950/30 md:backdrop-blur-xl',
          'fixed left-0 top-0 h-full w-[92%] max-w-[420px] border-r border-white/10 bg-slate-950/60 backdrop-blur-xl transition',
          open ? 'translate-x-0 opacity-100' : '-translate-x-[105%] opacity-0 md:opacity-100',
        ].join(' ')}
      >
        <div className="hidden border-b border-white/10 px-4 py-5 md:block">
          <div className="text-sm font-semibold tracking-tight text-slate-50">TerraTrail</div>
          <div className="mt-1 text-xs text-slate-300">
            {places.length ? `${places.length} saved places` : 'Click the map to start'}
          </div>
        </div>

        <div className="px-4 py-4">
          <div className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-3 py-2.5">
            <FiSearch className="text-slate-300" />
            <input
              value={search}
              onChange={(e) => onSearchChange?.(e.target.value)}
              placeholder="Search destinations…"
              className="w-full bg-transparent text-sm text-slate-100 outline-none placeholder:text-slate-400"
            />
          </div>
        </div>

        <div className="flex-1 space-y-3 overflow-y-auto px-4 pb-6">
          {filtered.length ? (
            filtered.map((place) => (
              <PlaceCard
                key={place.id}
                place={place}
                active={place.id === selectedId}
                onSelect={(id) => {
                  onSelect?.(id)
                  if (window.matchMedia?.('(max-width: 768px)').matches) onToggle?.()
                }}
                onDelete={onDelete}
              />
            ))
          ) : (
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-slate-200">
              <div className="font-semibold text-slate-50">No matches</div>
              <div className="mt-1 text-slate-300">Try a different search.</div>
            </div>
          )}
        </div>
      </div>

      <button
        type="button"
        aria-label="Close sidebar"
        onClick={onToggle}
        className={[
          'fixed inset-0 z-20 bg-black/50 backdrop-blur-sm transition md:hidden',
          open ? 'opacity-100' : 'pointer-events-none opacity-0',
        ].join(' ')}
      />
    </aside>
  )
}

