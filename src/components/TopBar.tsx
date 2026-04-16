"use client";

export default function TopBar() {
  return (
    <header className="sticky top-0 z-40 bg-surface/80 backdrop-blur-xl h-16 flex items-center justify-between px-6 lg:px-8 shadow-[0_1px_8px_rgba(0,45,86,0.04)]">
      {/* Search */}
      <div className="relative flex-1 max-w-lg">
        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-xl">
          search
        </span>
        <input
          type="text"
          placeholder="Search members, accounts, or loan IDs..."
          className="w-full bg-surface-container-high rounded-xl py-2.5 pl-10 pr-4 text-sm text-primary outline-none border-2 border-transparent focus:border-secondary/20 focus:shadow-[0_0_0_4px_rgba(119,90,25,0.06)] placeholder:text-outline/50 transition-all"
        />
      </div>

      {/* Right side */}
      <div className="flex items-center gap-2 ml-4">
        {/* Notifications */}
        <button className="relative w-10 h-10 rounded-xl flex items-center justify-center text-outline hover:bg-surface-container-high hover:text-primary transition-colors">
          <span className="material-symbols-outlined text-xl">notifications</span>
          <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-error rounded-full border-2 border-surface" />
        </button>

        {/* Help */}
        <button className="w-10 h-10 rounded-xl flex items-center justify-center text-outline hover:bg-surface-container-high hover:text-primary transition-colors">
          <span className="material-symbols-outlined text-xl">help</span>
        </button>

        {/* Badge */}
        <div className="hidden sm:flex items-center gap-2 ml-2 px-3 py-1.5 rounded-lg bg-secondary-container/40 text-xs font-medium text-on-secondary-container">
          <span className="material-symbols-outlined text-sm text-secondary" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
          Mayyanad Bank CRM
        </div>

        {/* User avatar */}
        <button className="w-10 h-10 rounded-full heritage-gradient flex items-center justify-center text-white font-bold text-sm ml-2">
          EC
        </button>
      </div>
    </header>
  );
}
