import { useEffect, useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiMapPin, FiStar, FiTag, FiX } from 'react-icons/fi'

const DEFAULT_IMG =
  'https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=1200&q=60'

export default function AddPlaceModal({ open, latLng, onClose, onSave }) {
  const [name, setName] = useState('')
  const [date, setDate] = useState('')
  const [notes, setNotes] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [rating, setRating] = useState(4)
  const [tags, setTags] = useState(['Visited'])
  const [tagInput, setTagInput] = useState('')

  const coordsLabel = useMemo(() => {
    if (!latLng) return ''
    return `${latLng.lat.toFixed(5)}, ${latLng.lng.toFixed(5)}`
  }, [latLng])

  useEffect(() => {
    if (!open) return
    setName('')
    setDate('')
    setNotes('')
    setImageUrl('')
    setRating(4)
    setTags(['Visited'])
    setTagInput('')
  }, [open])

  useEffect(() => {
    if (!open) return
    const onKeyDown = (e) => {
      if (e.key === 'Escape') onClose?.()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [open, onClose])

  const toggleTag = (tag) => {
    setTags((prev) => (prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]))
  }

  const addCustomTag = () => {
    const next = tagInput.trim()
    if (!next) return
    setTags((prev) => (prev.includes(next) ? prev : [...prev, next]))
    setTagInput('')
  }

  const canSave = name.trim().length > 0 && !!latLng

  const handleSave = () => {
    if (!canSave) return
    onSave?.({
      name: name.trim(),
      date: date || new Date().toISOString().slice(0, 10),
      notes: notes.trim(),
      imageUrl: (imageUrl.trim() || DEFAULT_IMG).trim(),
      rating,
      tags,
      lat: latLng.lat,
      lng: latLng.lng,
    })
  }

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          className="fixed inset-0 z-[1000] flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.button
            type="button"
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            aria-label="Close modal"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          <motion.div
            className="relative w-full max-w-2xl overflow-hidden rounded-2xl border border-white/10 bg-slate-950/60 shadow-glass backdrop-blur-xl"
            initial={{ y: 18, opacity: 0, scale: 0.98 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 14, opacity: 0, scale: 0.98 }}
            transition={{ type: 'spring', stiffness: 260, damping: 26 }}
          >
            <div className="flex items-start justify-between gap-4 border-b border-white/10 px-5 py-4">
              <div className="min-w-0">
                <div className="flex items-center gap-2 text-sm text-slate-300">
                  <FiMapPin className="shrink-0" />
                  <span className="truncate">Pin: {coordsLabel}</span>
                </div>
                <h2 className="mt-1 text-xl font-semibold tracking-tight text-slate-50">
                  Add destination
                </h2>
                <p className="mt-1 text-sm text-slate-300">
                  Start your travel journal — pin places and attach memories.
                </p>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="rounded-xl border border-white/10 bg-white/5 p-2 text-slate-200 transition hover:bg-white/10"
                aria-label="Close"
              >
                <FiX />
              </button>
            </div>

            <div className="grid gap-4 px-5 py-4 md:grid-cols-5">
              <div className="md:col-span-3">
                <label className="block text-sm text-slate-200">
                  Place <span className="text-fuchsia-300">*</span>
                </label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g., Singapore"
                  className="mt-1 w-full rounded-xl border border-white/10 bg-slate-950/40 px-3 py-2.5 text-slate-50 outline-none ring-fuchsia-400/30 transition placeholder:text-slate-400 focus:border-fuchsia-300/40 focus:ring-4"
                  autoFocus
                />

                <div className="mt-3 grid gap-3 sm:grid-cols-2">
                  <div>
                    <label className="block text-sm text-slate-200">Date</label>
                    <input
                      type="date"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="mt-1 w-full rounded-xl border border-white/10 bg-slate-950/40 px-3 py-2.5 text-slate-50 outline-none ring-fuchsia-400/30 transition focus:border-fuchsia-300/40 focus:ring-4"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-slate-200">Photo URL</label>
                    <input
                      value={imageUrl}
                      onChange={(e) => setImageUrl(e.target.value)}
                      placeholder="https://..."
                      className="mt-1 w-full rounded-xl border border-white/10 bg-slate-950/40 px-3 py-2.5 text-slate-50 outline-none ring-fuchsia-400/30 transition placeholder:text-slate-400 focus:border-fuchsia-300/40 focus:ring-4"
                    />
                  </div>
                </div>

                <div className="mt-3">
                  <label className="block text-sm text-slate-200">Rating</label>
                  <div className="mt-1 flex items-center gap-2">
                    {Array.from({ length: 5 }).map((_, idx) => {
                      const v = idx + 1
                      const active = v <= rating
                      return (
                        <button
                          key={v}
                          type="button"
                          onClick={() => setRating(v)}
                          className={[
                            'rounded-xl border px-3 py-2 text-sm transition',
                            active
                              ? 'border-fuchsia-300/30 bg-fuchsia-500/15 text-slate-50'
                              : 'border-white/10 bg-white/5 text-slate-300 hover:bg-white/10',
                          ].join(' ')}
                          aria-label={`Rate ${v} star`}
                        >
                          <span className="inline-flex items-center gap-2">
                            <FiStar className={active ? 'text-fuchsia-300' : ''} />
                            {v}
                          </span>
                        </button>
                      )
                    })}
                  </div>
                </div>

                <div className="mt-3">
                  <label className="block text-sm text-slate-200">Tags</label>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {['Visited', 'Favorite', '2024 Trip'].map((t) => {
                      const active = tags.includes(t)
                      return (
                        <button
                          key={t}
                          type="button"
                          onClick={() => toggleTag(t)}
                          className={[
                            'rounded-full border px-3 py-1.5 text-xs font-medium transition',
                            active
                              ? 'border-cyan-300/30 bg-cyan-400/15 text-slate-50'
                              : 'border-white/10 bg-white/5 text-slate-300 hover:bg-white/10',
                          ].join(' ')}
                        >
                          {t}
                        </button>
                      )
                    })}
                  </div>
                  <div className="mt-2 flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-3 py-2">
                    <FiTag className="text-slate-300" />
                    <input
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault()
                          addCustomTag()
                        }
                      }}
                      placeholder="Add a tag (Enter)…"
                      className="w-full bg-transparent text-sm text-slate-100 outline-none placeholder:text-slate-400"
                    />
                    <button
                      type="button"
                      onClick={addCustomTag}
                      className="rounded-xl border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-semibold text-slate-100 transition hover:bg-white/10"
                    >
                      Add
                    </button>
                  </div>
                </div>

                <div className="mt-3">
                  <label className="block text-sm text-slate-200">Notes</label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={3}
                    placeholder="What made this place special?"
                    className="mt-1 w-full resize-none rounded-xl border border-white/10 bg-slate-950/40 px-3 py-2.5 text-slate-50 outline-none ring-fuchsia-400/30 transition placeholder:text-slate-400 focus:border-fuchsia-300/40 focus:ring-4"
                  />
                </div>
              </div>

              <div className="md:col-span-2">
                <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
                  <div className="aspect-[4/3] overflow-hidden rounded-xl bg-slate-900">
                    <img
                      src={(imageUrl.trim() || DEFAULT_IMG).trim()}
                      alt=""
                      className="h-full w-full object-cover"
                      loading="lazy"
                      onError={(e) => {
                        e.currentTarget.src = DEFAULT_IMG
                      }}
                    />
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {tags.map((t) => (
                      <span
                        key={t}
                        className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[11px] text-slate-200"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                  <p className="mt-3 text-xs text-slate-300">
                    Tip: use a landscape image for the cleanest cards.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-col-reverse items-stretch justify-end gap-2 border-t border-white/10 px-5 py-4 sm:flex-row sm:items-center">
              <button
                type="button"
                onClick={onClose}
                className="rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-medium text-slate-100 transition hover:bg-white/10"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSave}
                disabled={!canSave}
                className="rounded-xl bg-gradient-to-r from-fuchsia-500 to-cyan-400 px-4 py-2.5 text-sm font-semibold text-slate-950 shadow-sm transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Save destination
              </button>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}
