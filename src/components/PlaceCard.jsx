import { FiCalendar, FiMapPin, FiTrash2 } from 'react-icons/fi'

export default function PlaceCard({ place, active, onSelect, onDelete }) {
  return (
    <button
      type="button"
      onClick={() => onSelect?.(place.id)}
      className={[
        'group w-full rounded-2xl border p-3 text-left transition',
        'bg-white/5 hover:bg-white/8 border-white/10 hover:border-white/15',
        active ? 'ring-2 ring-fuchsia-400/40 border-fuchsia-300/20 bg-white/10' : '',
      ].join(' ')}
    >
      <div className="flex gap-3">
        <div className="h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-slate-900">
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
                <span className="truncate">{place.name}</span>
              </div>
              <div className="mt-1 flex items-center gap-1.5 text-xs text-slate-400">
                <FiCalendar className="shrink-0" />
                <span>{place.date}</span>
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

          {place.notes ? (
            <p className="mt-2 line-clamp-2 text-sm text-slate-200/90">{place.notes}</p>
          ) : (
            <p className="mt-2 text-sm text-slate-400">No notes yet.</p>
          )}
        </div>
      </div>
    </button>
  )
}

