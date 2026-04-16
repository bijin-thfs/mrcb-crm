import Link from "next/link";

const recentActivity = [
  { icon: "check_circle", color: "text-success", label: "Gold Loan Approval", detail: "A. Krishan (#1442)", time: "3 hours ago" },
  { icon: "refresh", color: "text-secondary", label: "KYC Re-verification", detail: "S. Menon (#1023)", time: "5 hours ago" },
  { icon: "person_add", color: "text-primary-container", label: "New Member Added", detail: "R. Vijay (#1722)", time: "Today" },
  { icon: "cancel", color: "text-error", label: "Document Reject", detail: "P. Sudheer (#1190)", time: "Today" },
];

const weeklyData = [
  { day: "MON", values: [65, 20, 15] },
  { day: "TUE", values: [45, 35, 20] },
  { day: "WED", values: [55, 25, 30] },
  { day: "THU", values: [70, 15, 25] },
  { day: "FRI", values: [50, 30, 20] },
];

const maxTotal = Math.max(...weeklyData.map((d) => d.values.reduce((a, b) => a + b, 0)));

export default function DashboardPage() {
  return (
    <div className="max-w-[1400px] mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6 mb-8">
        <div>
          <p className="text-xs font-bold text-secondary uppercase tracking-widest mb-1">
            Operational Overview
          </p>
          <h1 className="font-headline font-extrabold text-3xl lg:text-4xl text-primary">
            Welcome back, Staff Portal
          </h1>
          <p className="font-headline font-medium text-outline text-sm malayalam-text mt-1">
            സ്റ്റാഫ് പോർട്ടലിലേക്ക് സ്വാഗതം
          </p>
        </div>
        <div className="flex items-center gap-3">
          <QuickAction icon="person_search" label="Member Lookup" />
          <QuickAction icon="verified_user" label="KYC Update" />
          <QuickAction icon="priority_high" label="Urgent Reviews" variant="warning" />
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard
          label="Approval Rate"
          malayalam="അംഗീകാര നിരക്ക്"
          value="94.2%"
          trend="+2.1%"
          trendUp
          variant="navy"
        />
        <StatCard
          label="Pending"
          malayalam="തീർപ്പാക്കാത്ത"
          value="08"
          sub="Review required"
          variant="navy"
        />
        <StatCard
          label="Total Value"
          malayalam="ആകെ മൂല്യം"
          value="₹12.4M"
          sub="This quarter"
          variant="default"
        />
        <StatCard
          label="Disbursements"
          malayalam="വിതരണം"
          value="₹3.2M"
          sub="This month"
          variant="default"
          icon="payments"
        />
      </div>

      {/* Middle Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Weekly Chart */}
        <div className="lg:col-span-2 bg-surface-container-lowest rounded-2xl p-6 shadow-[0_2px_16px_rgba(0,45,86,0.04)]">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="font-headline font-bold text-lg text-primary">Weekly Volume Distribution</h2>
              <p className="text-xs text-outline mt-0.5">Processing activity across major loan categories</p>
            </div>
          </div>
          <div className="flex items-end gap-6 h-44">
            {weeklyData.map((day) => {
              const total = day.values.reduce((a, b) => a + b, 0);
              const heightPct = (total / maxTotal) * 100;
              return (
                <div key={day.day} className="flex-1 flex flex-col items-center gap-2">
                  <div className="w-full flex flex-col-reverse gap-0.5 rounded-lg overflow-hidden" style={{ height: `${heightPct}%` }}>
                    <div className="bg-primary-container rounded-b-lg" style={{ flex: day.values[0] }} />
                    <div className="bg-secondary" style={{ flex: day.values[1] }} />
                    <div className="bg-outline-variant" style={{ flex: day.values[2] }} />
                  </div>
                  <span className="text-[11px] font-semibold text-outline">{day.day}</span>
                </div>
              );
            })}
          </div>
          <div className="flex items-center gap-6 mt-5 pt-4">
            <Legend color="bg-primary-container" label="Accounts" />
            <Legend color="bg-secondary" label="Loans" />
            <Legend color="bg-outline-variant" label="Others" />
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-[0_2px_16px_rgba(0,45,86,0.04)]">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-headline font-bold text-base text-primary">Recent Activity</h2>
            <button className="text-xs font-bold text-secondary hover:underline">VIEW ALL</button>
          </div>
          <div className="space-y-4">
            {recentActivity.map((item, i) => (
              <div key={i} className="flex items-start gap-3">
                <span className={`material-symbols-outlined text-lg mt-0.5 ${item.color}`} style={{ fontVariationSettings: "'FILL' 1" }}>
                  {item.icon}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-primary">{item.label}</p>
                  <p className="text-xs text-outline">{item.detail}</p>
                </div>
                <span className="text-[10px] text-outline whitespace-nowrap">{item.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <BottomCard
          icon="draw"
          label="Pending Signatures"
          malayalam="ഒപ്പിടാനുള്ളവ"
          value="12 Files"
          action="Review"
          href="/applications"
        />
        <BottomCard
          icon="event"
          label="Today's Appointments"
          malayalam="ഇന്നത്തെ കൂടിക്കാഴ്ചകൾ"
          value="04 Members"
          action="View"
          href="/applications"
        />
        <div className="bg-secondary-container rounded-2xl p-6 shadow-[0_2px_16px_rgba(0,45,86,0.04)]">
          <p className="text-xs font-bold text-on-secondary-container uppercase tracking-widest mb-2">
            Staff Milestone
          </p>
          <p className="font-headline font-extrabold text-xl text-on-secondary-container mb-1">
            Quarterly Top Processor
          </p>
          <div className="flex items-center gap-2 mt-3">
            <span className="material-symbols-outlined text-secondary text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>
              emoji_events
            </span>
            <span className="text-sm font-medium text-on-secondary-container">
              Outstanding performance
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Sub-components ─── */

function QuickAction({ icon, label, variant }: { icon: string; label: string; variant?: "warning" }) {
  return (
    <button className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all active:scale-95 ${
      variant === "warning"
        ? "bg-warning-container text-on-surface hover:bg-warning-container/80"
        : "bg-surface-container-lowest text-primary hover:bg-surface-container-high shadow-[0_1px_4px_rgba(0,45,86,0.06)]"
    }`}>
      <span className="material-symbols-outlined text-lg">{icon}</span>
      <span className="hidden sm:inline">{label}</span>
    </button>
  );
}

function StatCard({ label, malayalam, value, trend, trendUp, sub, variant, icon }: {
  label: string;
  malayalam: string;
  value: string;
  trend?: string;
  trendUp?: boolean;
  sub?: string;
  variant: "navy" | "default";
  icon?: string;
}) {
  const isNavy = variant === "navy";
  return (
    <div className={`rounded-2xl p-5 lg:p-6 ${
      isNavy ? "heritage-gradient text-white" : "bg-surface-container-lowest shadow-[0_2px_16px_rgba(0,45,86,0.04)]"
    }`}>
      <div className="flex items-start justify-between mb-3">
        <div>
          <p className={`text-[11px] font-bold uppercase tracking-widest ${isNavy ? "text-white/60" : "text-outline"}`}>
            {label}
          </p>
          <p className={`text-[10px] malayalam-text ${isNavy ? "text-white/40" : "text-outline/60"}`}>
            {malayalam}
          </p>
        </div>
        {icon && (
          <span className="material-symbols-outlined text-xl text-outline">{icon}</span>
        )}
      </div>
      <p className={`font-headline font-extrabold text-3xl ${isNavy ? "text-white" : "text-primary"}`}>
        {value}
      </p>
      {trend && (
        <p className={`text-xs font-bold mt-1 ${trendUp ? "text-success-container" : "text-error"}`}>
          {trendUp ? "↑" : "↓"} {trend}
        </p>
      )}
      {sub && (
        <p className={`text-xs mt-1 ${isNavy ? "text-white/50" : "text-outline"}`}>{sub}</p>
      )}
    </div>
  );
}

function Legend({ color, label }: { color: string; label: string }) {
  return (
    <div className="flex items-center gap-2">
      <div className={`w-3 h-3 rounded-sm ${color}`} />
      <span className="text-xs text-outline">{label}</span>
    </div>
  );
}

function BottomCard({ icon, label, malayalam, value, action, href }: {
  icon: string;
  label: string;
  malayalam: string;
  value: string;
  action: string;
  href: string;
}) {
  return (
    <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-[0_2px_16px_rgba(0,45,86,0.04)] flex flex-col">
      <span className="material-symbols-outlined text-primary-container text-2xl mb-4">{icon}</span>
      <p className="text-xs font-bold text-outline uppercase tracking-widest">{label}</p>
      <p className="text-[10px] text-outline malayalam-text">{malayalam}</p>
      <p className="font-headline font-extrabold text-2xl text-primary mt-2 mb-4">{value}</p>
      <Link
        href={href}
        className="mt-auto flex items-center gap-1 text-sm font-bold text-secondary hover:underline"
      >
        {action}
        <span className="material-symbols-outlined text-base">arrow_forward</span>
      </Link>
    </div>
  );
}
