/**
 * Design System Showcase Page
 * Phase 2 — Visual verification of all design tokens
 * Route: /design-system (remove after Phase 3)
 */
export default function DesignSystemPage() {
  return (
    <div className="min-h-screen bg-background p-8 lg:p-12">
      <div className="mx-auto max-w-5xl space-y-16">

        {/* ── Header ── */}
        <div>
          <h1 className="gradient-text text-5xl font-bold">Rezervo Design System</h1>
          <p className="mt-3 text-lg text-muted-foreground">Phase 2 — Design Tokens & Visual Language</p>
        </div>

        {/* ── Color Palette ── */}
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold">Color Palette</h2>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {[
              { label: 'Primary', cls: 'bg-primary', text: 'text-primary-foreground' },
              { label: 'Secondary', cls: 'bg-secondary', text: 'text-secondary-foreground' },
              { label: 'Accent', cls: 'bg-accent', text: 'text-accent-foreground' },
              { label: 'Muted', cls: 'bg-muted', text: 'text-muted-foreground' },
              { label: 'Destructive', cls: 'bg-destructive', text: 'text-white' },
              { label: 'Success', cls: 'bg-success', text: 'text-success-foreground' },
              { label: 'Warning', cls: 'bg-warning', text: 'text-warning-foreground' },
              { label: 'Card', cls: 'bg-card border border-border', text: 'text-card-foreground' },
            ].map(({ label, cls, text }) => (
              <div
                key={label}
                className={`${cls} ${text} flex h-20 items-center justify-center rounded-xl font-medium`}
              >
                {label}
              </div>
            ))}
          </div>
        </section>

        {/* ── Brand Scale ── */}
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold">Brand Blue Scale</h2>
          <div className="flex overflow-hidden rounded-2xl">
            {['brand-50','brand-100','brand-200','brand-300','brand-400','brand-500','brand-600','brand-700','brand-800','brand-900'].map((shade, i) => (
              <div
                key={shade}
                className={`bg-${shade} flex flex-1 flex-col items-center justify-end py-3`}
                style={{ minHeight: '80px' }}
              >
                <span className={`text-xs font-medium ${i < 5 ? 'text-brand-900' : 'text-brand-50'}`}>
                  {shade.split('-')[1]}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* ── Typography ── */}
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold">Typography Scale</h2>
          <div className="space-y-4 rounded-2xl border border-border bg-card p-8">
            <p className="text-5xl font-bold tracking-tight">Display — 3rem</p>
            <p className="text-4xl font-bold tracking-tight">Heading 1 — 2.25rem</p>
            <p className="text-3xl font-semibold">Heading 2 — 1.875rem</p>
            <p className="text-2xl font-semibold">Heading 3 — 1.5rem</p>
            <p className="text-xl font-medium">Heading 4 — 1.25rem</p>
            <p className="text-lg">Body Large — 1.125rem</p>
            <p className="text-base">Body Default — 1rem</p>
            <p className="text-sm text-muted-foreground">Body Small — 0.875rem</p>
            <p className="text-xs text-muted-foreground">Caption — 0.75rem</p>
          </div>
        </section>

        {/* ── Cards & Surfaces ── */}
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold">Cards & Surfaces</h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">

            {/* Plain Card */}
            <div className="card-shadow card-shadow-hover rounded-2xl bg-card p-6">
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                <div className="h-5 w-5 rounded bg-primary" />
              </div>
              <h3 className="font-semibold">Standard Card</h3>
              <p className="mt-1 text-sm text-muted-foreground">Soft shadow, hover lift effect.</p>
            </div>

            {/* Glass Card */}
            <div className="glass card-shadow-hover rounded-2xl p-6">
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-primary/15">
                <div className="h-5 w-5 rounded bg-primary" />
              </div>
              <h3 className="font-semibold">Glass Card</h3>
              <p className="mt-1 text-sm text-muted-foreground">Glassmorphism effect.</p>
            </div>

            {/* Gradient Card */}
            <div className="gradient-brand card-shadow-hover rounded-2xl p-6 text-white">
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-white/20">
                <div className="h-5 w-5 rounded bg-white" />
              </div>
              <h3 className="font-semibold text-white">Gradient Card</h3>
              <p className="mt-1 text-sm text-white/80">Brand gradient surface.</p>
            </div>

          </div>
        </section>

        {/* ── Status Badges ── */}
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold">Status Indicators</h2>
          <div className="flex flex-wrap gap-3">
            <span className="status-pending rounded-full px-3 py-1 text-sm font-medium">Bekliyor</span>
            <span className="status-confirmed rounded-full px-3 py-1 text-sm font-medium">Onaylandı</span>
            <span className="status-cancelled rounded-full px-3 py-1 text-sm font-medium">İptal</span>
            <span className="status-completed rounded-full px-3 py-1 text-sm font-medium">Tamamlandı</span>
          </div>
        </section>

        {/* ── Shadows ── */}
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold">Shadow Scale</h2>
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
            {['xs', 'sm', 'md', 'lg'].map((size) => (
              <div
                key={size}
                className="flex h-24 items-center justify-center rounded-xl bg-card"
                style={{ boxShadow: `var(--shadow-${size}-val)` }}
              >
                <span className="text-sm font-medium text-muted-foreground">shadow-{size}</span>
              </div>
            ))}
          </div>
        </section>

        {/* ── Skeleton ── */}
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold">Skeleton Loader</h2>
          <div className="space-y-3 rounded-2xl border border-border bg-card p-6">
            <div className="skeleton h-5 w-3/4" />
            <div className="skeleton h-4 w-full" />
            <div className="skeleton h-4 w-5/6" />
            <div className="skeleton h-4 w-2/3" />
          </div>
        </section>

        {/* ── Dark Mode Hint ── */}
        <section className="gradient-brand-soft rounded-2xl p-6">
          <h2 className="text-xl font-semibold">🌙 Dark Mode</h2>
          <p className="mt-2 text-muted-foreground">
            Tüm token'lar otomatik dark mode destekliyor. Tarayıcı sistem temasını değiştir veya
            ThemeToggle bileşeni ile test et.
          </p>
        </section>

      </div>
    </div>
  )
}
