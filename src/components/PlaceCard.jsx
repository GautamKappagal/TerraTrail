import { motion } from 'framer-motion'
import { FiCalendar, FiMapPin, FiStar, FiTrash2 } from 'react-icons/fi'

export default function PlaceCard({ place, active, onSelect, onDelete }) {
  return (
    <motion.button
      type="button"
      onClick={() => onSelect?.(place.id)}
      whileHover={{ y: -2, scale: 1.005 }}
      whileTap={{ scale: 0.995 }}
      transition={{ type: 'spring', stiffness: 500, damping: 34 }}
      className={[
        'group w-full rounded-3xl border p-3 text-left transition',
        'bg-white/5 hover:bg-white/10 border-white/10 hover:border-white/20',
        active ? 'ring-1 ring-[#D1AE7A] border-[#D1AE7A] bg-[#D1AE7A]/[0.06]' : 'hover:border-white/20',
      ].join(' ')}
    >
      <div className="flex gap-3">
        <div className="h-20 w-20 shrink-0 overflow-hidden rounded-2xl bg-slate-900">
          <img
            src={place.imageUrl}
            alt=""
            className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.03]"
            loading="lazy"
          />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 text-xs text-slate-300">
                <FiMapPin className="shrink-0" />
                <span className="truncate text-[13px] font-semibold text-slate-50">{place.name}</span>
              </div>
              <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-300/90">
                <FiCalendar className="shrink-0" />
                <span>{place.date}</span>
                <span className="inline-flex items-center gap-1.5">
                  <FiStar className="text-[#D1AE7A]" />
                  <span className="font-medium">{place.rating ?? 4}</span>
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                onDelete?.(place.id)
              }}
              className="rounded-lg border border-white/10 bg-white/5 p-2 text-slate-200 opacity-0 transition hover:bg-white/10 group-hover:opacity-100"
              aria-label={`Delete ${place.name}`}
              title="Delete"
            >
              <FiTrash2 />
            </button>
          </div>

          {place.tags?.length ? (
            <div className="mt-2 flex flex-wrap gap-1.5">
              {place.tags.slice(0, 3).map((t) => (
                <span
                  key={t}
                  className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[11px] text-slate-200"
                >
                  {t}
                </span>
              ))}
            </div>
          ) : null}

          {place.notes ? (
            <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-slate-200/90">{place.notes}</p>
          ) : (
            <p className="mt-2 text-sm text-slate-400">No notes yet.</p>
          )}
        </div>
      </div>
    </motion.button>
  )
}