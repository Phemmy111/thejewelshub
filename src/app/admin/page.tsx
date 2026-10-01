export default function AdminOverviewPage() {
  return (
    <div>
      <h1 className="font-display text-3xl font-bold text-[var(--color-foreground)] mb-2">
        Overview
      </h1>
      <p className="text-[var(--color-muted)] text-sm mb-8">
        Analytics and dashboard built in Phase 7.
      </p>

      {/* Placeholder stat cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Today's Revenue", value: '—' },
          { label: 'Orders Today', value: '—' },
          { label: 'Total Products', value: '—' },
          { label: 'Low Stock', value: '—' },
        ].map((stat) => (
          <div
            key={stat.label}
            className="bg-white rounded-xl p-5 border border-[var(--color-border)] shadow-sm"
          >
            <p className="text-xs text-[var(--color-muted)] font-medium">{stat.label}</p>
            <p className="text-2xl font-bold text-[var(--color-foreground)] mt-1">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-[var(--color-border)] p-8 text-center">
        <p className="text-[var(--color-muted)]">
          Admin dashboard is being built phase by phase. Products, orders, and analytics come next.
        </p>
      </div>
    </div>
  )
}
