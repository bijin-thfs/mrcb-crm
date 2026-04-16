"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/", icon: "dashboard", label: "Dashboard" },
  { href: "/applications", icon: "description", label: "Account Applications", badge: 3 },
  { href: "/loans", icon: "request_quote", label: "Loan Applications" },
  { href: "/creditscore", icon: "credit_score", label: "Credit Check" },
  { href: "/settings", icon: "settings", label: "Settings" },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 bottom-0 w-[72px] lg:w-[260px] bg-primary flex flex-col z-50 transition-all duration-300">
      {/* Logo */}
      <div className="px-4 lg:px-6 py-5 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center flex-shrink-0">
          <span className="material-symbols-outlined text-secondary text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>
            account_balance
          </span>
        </div>
        <div className="hidden lg:block">
          <p className="font-headline font-bold text-white text-sm leading-tight">MRCB Staff</p>
          <p className="text-on-primary-container text-[11px]">സ്റ്റാഫ് പോർട്ടൽ</p>
        </div>
      </div>

      {/* Staff profile */}
      <div className="px-3 lg:px-5 py-4 mx-3 lg:mx-4 rounded-xl bg-white/5 mb-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-secondary/30 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
            EC
          </div>
          <div className="hidden lg:block min-w-0">
            <p className="text-white text-xs font-bold truncate">Elite Concierge</p>
            <p className="text-on-primary-container text-[10px]">MRCB Staff</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 lg:px-4 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 group relative ${
                isActive
                  ? "bg-white/15 text-white"
                  : "text-on-primary-container hover:bg-white/8 hover:text-white"
              }`}
            >
              <span
                className="material-symbols-outlined text-xl flex-shrink-0"
                style={isActive ? { fontVariationSettings: "'FILL' 1" } : undefined}
              >
                {item.icon}
              </span>
              <span className="hidden lg:inline text-sm font-medium truncate">{item.label}</span>
              {item.badge && (
                <span className="absolute right-2 top-1/2 -translate-y-1/2 bg-secondary text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center lg:static lg:ml-auto">
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* New Application button */}
      <div className="px-3 lg:px-4 pb-5">
        <button className="w-full flex items-center justify-center lg:justify-start gap-2 px-3 py-3 rounded-xl bg-secondary text-on-secondary font-bold text-sm hover:bg-secondary/90 active:scale-[0.98] transition-all">
          <span className="material-symbols-outlined text-lg">add</span>
          <span className="hidden lg:inline">New Application</span>
        </button>
      </div>
    </aside>
  );
}
