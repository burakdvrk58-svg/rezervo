export default function CustomerLoading() {
  return (
    <div className="space-y-8 animate-pulse">
      
      {/* Header Skeleton */}
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div className="space-y-2">
          <div className="h-8 w-60 rounded-xl bg-slate-200" />
          <div className="h-4 w-96 rounded-lg bg-slate-200" />
        </div>
        <div className="h-10 w-40 rounded-xl bg-slate-200" />
      </div>

      {/* Stats Widgets Grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, idx) => (
          <div key={idx} className="rounded-2xl border border-slate-200 bg-white p-5 space-y-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="h-4 w-24 rounded bg-slate-200" />
              <div className="h-9 w-9 rounded-xl bg-slate-200" />
            </div>
            <div className="h-7 w-16 rounded bg-slate-200" />
            <div className="h-3 w-32 rounded bg-slate-200" />
          </div>
        ))}
      </div>

      {/* Core Content Grid */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        
        {/* Left Column (2 cols): Bookings list */}
        <div className="space-y-5 lg:col-span-2">
          <div className="flex items-center justify-between">
            <div className="h-5 w-44 rounded bg-slate-200" />
            <div className="h-4 w-20 rounded bg-slate-200" />
          </div>

          <div className="space-y-4">
            {Array.from({ length: 2 }).map((_, idx) => (
              <div key={idx} className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center">
                <div className="h-20 w-full rounded-xl bg-slate-200 sm:w-28 shrink-0" />
                <div className="flex-1 space-y-2.5">
                  <div className="flex justify-between items-center">
                    <div className="h-4.5 w-48 rounded bg-slate-200" />
                    <div className="h-5 w-20 rounded-full bg-slate-200" />
                  </div>
                  <div className="h-3.5 w-32 rounded bg-slate-200" />
                  <div className="h-3 w-40 rounded bg-slate-200" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column (1 col): Recent activities */}
        <div className="space-y-5">
          <div className="h-5 w-36 rounded bg-slate-200" />
          
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-6">
            {Array.from({ length: 3 }).map((_, idx) => (
              <div key={idx} className="flex gap-3">
                <div className="h-9 w-9 rounded-xl bg-slate-200 shrink-0" />
                <div className="flex-1 space-y-2 pt-1">
                  <div className="h-3.5 w-full rounded bg-slate-200" />
                  <div className="h-3 w-2/3 rounded bg-slate-200" />
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  )
}
