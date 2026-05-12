import { useMemo } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
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
  const isMobile = typeof window !== 'undefined' ? window.matchMedia?.('(max-width: 768px)').matches : false
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

  const stats = useMemo(() => {
    const years = new Set()
    let favorites = 0
    let totalRating = 0
    let ratedCount = 0
    for (const p of places) {
      if (p?.date?.length >= 4) years.add(p.date.slice(0, 4))
      if ((p.tags || []).includes('Favorite')) favorites += 1
      if (typeof p.rating === 'number') {
        totalRating += p.rating
        ratedCount += 1
      }
    }
    return {
      years: years.size,
      favorites,
      avgRating: ratedCount ? (totalRating / ratedCount).toFixed(1) : '—',
    }
  }, [places])

  return (
    <aside className="relative z-[650] w-full md:fixed md:inset-y-4 md:left-4 md:w-[380px] md:max-w-[380px]">
      <div className="flex items-center justify-between gap-3 border-b border-white/10 bg-slate-950/40 px-4 py-4 backdrop-blur-xl md:hidden">
        <div className="min-w-0">
          <div className="text-base font-semibold tracking-tight text-slate-50">TerraTrail</div>
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

      <AnimatePresence initial={false}>
        {(open || !isMobile) && (
          <motion.div
            key="panel"
            initial={{ x: -28, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -28, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 280, damping: 30 }}
            className={[
              'md:static md:flex md:h-full md:w-full md:translate-x-0 md:flex-col md:opacity-100 md:rounded-3xl md:border md:border-white/10 md:bg-slate-950/45 md:shadow-glass md:backdrop-blur-xl md:overflow-hidden',
              'fixed left-0 top-0 h-full w-[92%] max-w-[420px] border-r border-white/10 bg-slate-950/60 backdrop-blur-xl',
            ].join(' ')}
          >
            <div className="hidden border-b border-white/10 px-4 py-5 md:block">
              <div className="text-3xl font-black tracking-tight text-slate-50">TerraTrail</div>
              <div className="mt-1 text-xs text-slate-300">
                {places.length ? `${places.length} saved places` : 'Pin your first destination'}
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[11px] text-slate-200">
                  {places.length} places
                </span>
                <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[11px] text-slate-200">
                  {stats.favorites} favorites
                </span>
                <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[11px] text-slate-200">
                  avg {stats.avgRating}★
                </span>
                <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[11px] text-slate-200">
                  {stats.years} years
                </span>
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
              <button
                type="button"
                onClick={onAddClick}
                className="mt-3 w-full rounded-2xl bg-gradient-to-r from-fuchsia-500 to-cyan-400 px-4 py-2.5 text-sm font-semibold text-slate-950 shadow-sm transition hover:brightness-110"
              >
                <span className="inline-flex items-center justify-center gap-2">
                  <FiPlus /> Add destination
                </span>
              </button>
            </div>

            <motion.div
              className="flex-1 space-y-3 overflow-y-auto px-4 pt-3 pb-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.25 }}
            >
              {filtered.length ? (
                filtered.map((place, idx) => (
                  <motion.div
                    key={place.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: Math.min(idx * 0.03, 0.18), duration: 0.22 }}
                  >
                    <PlaceCard
                      place={place}
                      active={place.id === selectedId}
                      onSelect={(id) => {
                        onSelect?.(id)
                        if (isMobile) onToggle?.()
                      }}
                      onDelete={onDelete}
                    />
                  </motion.div>
                ))
              ) : (
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-slate-200">
                  <div className="font-semibold text-slate-50">No matches</div>
                  <div className="mt-1 text-slate-300">Try a different search.</div>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

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
