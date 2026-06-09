export default function AdminLoading() {
  return (
    <div className="space-y-8 animate-pulse">
      
      {/* Header Skeleton */}
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div className="space-y-2">
          <div className="h-8 w-60 rounded-xl bg-slate-200" />
          <div className="h-4 w-96 rounded-lg bg-slate-200" />
        </div>
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

      {/* Main Grid */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        
        {/* Left Column: Applications and Logs */}
        <div className="space-y-6 lg:col-span-2">
          
          {/* Applications skeleton */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div className="h-5 w-48 rounded bg-slate-200" />
              <div className="h-4 w-24 rounded bg-slate-200" />
            </div>
            
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {Array.from({ length: 2 }).map((_, idx) => (
                <div key={idx} className="rounded-2xl border border-slate-200 bg-white p-5 space-y-4 shadow-sm">
                  <div className="space-y-2">
                    <div className="h-4.5 w-36 rounded bg-slate-200" />
                    <div className="h-3.5 w-24 rounded bg-slate-200" />
                    <div className="h-3 w-40 rounded bg-slate-200" />
                  </div>
                  <div className="flex items-center justify-between border-t border-slate-100 pt-3">
                    <div className="h-5 w-16 bg-slate-100 rounded-full" />
                    <div className="h-8 w-16 bg-slate-200 rounded-xl" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Logs feed skeleton */}
          <div className="space-y-4">
            <div className="h-5 w-40 rounded bg-slate-200" />
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-4">
              {Array.from({ length: 3 }).map((_, idx) => (
                <div key={idx} className="flex gap-3">
                  <div className="h-7 w-7 rounded-lg bg-slate-200 shrink-0" />
                  <div className="flex-1 space-y-2">
                    <div className="flex justify-between items-center">
                      <div className="h-3.5 w-40 rounded bg-slate-200" />
                      <div className="h-3 w-16 rounded bg-slate-200" />
                    </div>
                    <div className="h-3 w-2/3 rounded bg-slate-200" />
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right Column: Server specs */}
        <div className="space-y-5">
          <div className="h-5 w-36 rounded bg-slate-200" />
          
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-4">
            {Array.from({ length: 3 }).map((_, idx) => (
              <div key={idx} className="space-y-2">
                <div className="flex justify-between items-center">
                  <div className="h-3.5 w-20 rounded bg-slate-200" />
                  <div className="h-3.5 w-8 rounded bg-slate-200" />
                </div>
                <div className="h-2 w-full rounded-full bg-slate-100" />
              </div>
            ))}
            <div className="space-y-2 pt-4 border-t border-slate-100">
              <div className="h-4 w-full rounded bg-slate-200" />
              <div className="h-4 w-2/3 rounded bg-slate-200" />
            </div>
          </div>
        </div>

      </div>

    </div>
  )
}
