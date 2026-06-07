export default function BusinessLoading() {
  return (
    <div className="space-y-8 animate-pulse">
      
      {/* Header Skeleton */}
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div className="space-y-2">
          <div className="h-8 w-64 rounded-xl bg-slate-200" />
          <div className="h-4 w-96 rounded-lg bg-slate-200" />
        </div>
        <div className="h-10 w-44 rounded-xl bg-slate-200" />
      </div>

      {/* Stats Widgets Grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, idx) => (
          <div key={idx} className="rounded-2xl border border-slate-200 bg-white p-5 space-y-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="h-4 w-28 rounded bg-slate-200" />
              <div className="h-9 w-9 rounded-xl bg-slate-200" />
            </div>
            <div className="h-7 w-20 rounded bg-slate-200" />
            <div className="h-3 w-36 rounded bg-slate-200" />
          </div>
        ))}
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        
        {/* Left Column: Reservation requests */}
        <div className="space-y-5 lg:col-span-2">
          <div className="flex items-center justify-between">
            <div className="h-5 w-48 rounded bg-slate-200" />
            <div className="h-4 w-28 rounded bg-slate-200" />
          </div>

          <div className="space-y-4">
            {Array.from({ length: 2 }).map((_, idx) => (
              <div key={idx} className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-slate-200 shrink-0" />
                  <div className="space-y-2">
                    <div className="h-4 w-32 rounded bg-slate-200" />
                    <div className="h-3 w-48 rounded bg-slate-200" />
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="space-y-1.5 text-right">
                    <div className="h-3 w-10 rounded bg-slate-200 ml-auto" />
                    <div className="h-4 w-16 rounded bg-slate-200" />
                  </div>
                  <div className="flex gap-2">
                    <div className="h-9 w-9 rounded-xl bg-slate-200" />
                    <div className="h-9 w-20 rounded-xl bg-slate-200" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Hotel parameters info card */}
        <div className="space-y-5">
          <div className="h-5 w-36 rounded bg-slate-200" />
          
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-4">
            <div className="h-40 w-full rounded-xl bg-slate-200" />
            <div className="grid grid-cols-2 gap-3">
              <div className="h-14 rounded-xl bg-slate-100" />
              <div className="h-14 rounded-xl bg-slate-100" />
            </div>
            <div className="space-y-3 pt-3 border-t border-slate-100">
              <div className="h-4 w-full rounded bg-slate-200" />
              <div className="h-4 w-2/3 rounded bg-slate-200" />
            </div>
          </div>
        </div>

      </div>

    </div>
  )
}
