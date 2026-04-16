"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase";
import Link from "next/link";

type Application = {
  id: string;
  reference_number: string;
  account_type: string;
  status: string;
  source: string;
  vkyc_status: string;
  submitted_at: string;
  customers: {
    full_name: string;
    mobile: string;
    email: string;
  } | null;
};

const tabs = [
  { key: "all", label: "All Applications" },
  { key: "new", label: "New" },
  { key: "reviewing", label: "Reviewing" },
  { key: "vkyc_pending", label: "VKYC Pending" },
  { key: "approved", label: "Successful" },
  { key: "rejected", label: "Rejected" },
];

const accountTypeBadge: Record<string, { label: string; bg: string; text: string }> = {
  savings: { label: "SAVINGS GOLD", bg: "bg-secondary-container", text: "text-on-secondary-container" },
  current: { label: "CURRENT ACCOUNT", bg: "bg-primary-container", text: "text-on-primary" },
  fd: { label: "FIXED DEPOSIT", bg: "bg-surface-container-highest", text: "text-primary" },
  rd: { label: "RECURRING DEPOSIT", bg: "bg-warning-container", text: "text-on-surface" },
};

const statusConfig: Record<string, { label: string; color: string; dot: string }> = {
  new: { label: "New", color: "text-primary-container", dot: "bg-primary-container" },
  reviewing: { label: "Reviewing", color: "text-secondary", dot: "bg-secondary" },
  vkyc_pending: { label: "VKYC Pending", color: "text-warning", dot: "bg-warning" },
  docs_missing: { label: "Docs Missing", color: "text-error", dot: "bg-error" },
  approved: { label: "Success", color: "text-success", dot: "bg-success" },
  rejected: { label: "Failed", color: "text-error", dot: "bg-error" },
};

export default function ApplicationsPage() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchApplications();
  }, []);

  async function fetchApplications() {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("applications")
      .select(`
        id,
        reference_number,
        account_type,
        status,
        source,
        vkyc_status,
        submitted_at,
        customers (
          full_name,
          mobile,
          email
        )
      `)
      .order("submitted_at", { ascending: false });

    if (!error && data) {
      setApplications(data as unknown as Application[]);
    }
    setLoading(false);
  }

  const filtered = applications.filter((app) => {
    const matchesTab = activeTab === "all" || app.status === activeTab;
    const matchesSearch =
      !searchQuery ||
      app.customers?.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.reference_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.customers?.email?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const counts = {
    total: applications.length,
    pending: applications.filter((a) => ["new", "reviewing", "vkyc_pending", "docs_missing"].includes(a.status)).length,
    approved: applications.filter((a) => a.status === "approved").length,
    today: applications.filter((a) => {
      const d = new Date(a.submitted_at);
      const now = new Date();
      return d.toDateString() === now.toDateString();
    }).length,
  };

  const successRate = counts.total > 0 ? ((counts.approved / counts.total) * 100).toFixed(1) : "0";

  return (
    <div className="max-w-[1400px] mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6 mb-8">
        <div>
          <p className="text-xs font-bold text-secondary uppercase tracking-widest mb-1">
            Administrative Portal
          </p>
          <h1 className="font-headline font-extrabold text-3xl lg:text-4xl text-primary">
            Account Applications
          </h1>
          <p className="font-headline font-medium text-outline text-sm malayalam-text mt-1">
            മാനേജ്മെന്റ് സ്ക്രീൻ · Manage and review high-priority member applications
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Tabs */}
          <div className="flex items-center bg-surface-container-high rounded-xl p-1">
            {tabs.slice(0, 3).map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                  activeTab === tab.key
                    ? "bg-surface-container-lowest text-primary shadow-sm"
                    : "text-outline hover:text-primary"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
          <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl heritage-gradient text-white text-sm font-bold hover:scale-[1.02] active:scale-95 transition-all">
            <span className="material-symbols-outlined text-lg">tune</span>
            Detailed Filter
          </button>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-surface-container-lowest rounded-2xl p-5 shadow-[0_2px_16px_rgba(0,45,86,0.04)]">
          <p className="text-[11px] font-bold text-outline uppercase tracking-widest">Total Applications</p>
          <p className="text-[10px] text-outline malayalam-text">ആകെ അപേക്ഷകൾ</p>
          <div className="flex items-end gap-2 mt-2">
            <p className="font-headline font-extrabold text-3xl text-primary">{loading ? "—" : counts.total.toLocaleString()}</p>
            <span className="text-xs font-bold text-success mb-1">+12%</span>
          </div>
        </div>

        <div className="heritage-gradient rounded-2xl p-5">
          <p className="text-[11px] font-bold text-white/60 uppercase tracking-widest">Review Pending</p>
          <p className="text-[10px] text-white/40 malayalam-text">അവലോകനം ബാക്കി</p>
          <p className="font-headline font-extrabold text-3xl text-white mt-2">{loading ? "—" : counts.pending}</p>
          <p className="text-xs text-white/50 mt-0.5">Priority</p>
        </div>

        <div className="bg-surface-container-lowest rounded-2xl p-5 shadow-[0_2px_16px_rgba(0,45,86,0.04)]">
          <p className="text-[11px] font-bold text-outline uppercase tracking-widest">Success Rate</p>
          <p className="text-[10px] text-outline malayalam-text">വിജയ നിരക്ക്</p>
          <p className="font-headline font-extrabold text-3xl text-primary mt-2">{loading ? "—" : `${successRate}%`}</p>
          <p className="text-xs text-outline mt-0.5">Benchmark 90%</p>
        </div>

        <div className="bg-secondary-container rounded-2xl p-5">
          <p className="text-[11px] font-bold text-on-secondary-container uppercase tracking-widest">Today&apos;s Applications</p>
          <p className="text-[10px] text-on-secondary-container/60 malayalam-text">ഇന്നത്തെ അപേക്ഷകൾ</p>
          <p className="font-headline font-extrabold text-3xl text-on-secondary-container mt-2">{loading ? "—" : counts.today}</p>
          <p className="text-xs text-on-secondary-container/70 mt-0.5">New</p>
        </div>
      </div>

      {/* Filter tabs (full set, mobile) */}
      <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-2 lg:hidden">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-2 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
              activeTab === tab.key
                ? "bg-primary text-on-primary"
                : "bg-surface-container-high text-outline hover:text-primary"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="flex items-center gap-4 mb-6">
        <div className="relative flex-1 max-w-md">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-lg">search</span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, email, or reference..."
            className="w-full bg-surface-container-high rounded-xl py-2.5 pl-10 pr-4 text-sm outline-none border-2 border-transparent focus:border-secondary/20 placeholder:text-outline/50 transition-all"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-surface-container-lowest rounded-2xl shadow-[0_2px_16px_rgba(0,45,86,0.04)] overflow-hidden">
        {/* Table header */}
        <div className="hidden md:grid grid-cols-[2fr_1.2fr_1fr_1fr_1fr_auto] gap-4 px-6 py-4 bg-surface-container-low">
          <p className="text-[11px] font-bold text-outline uppercase tracking-widest">Applicant Details</p>
          <p className="text-[11px] font-bold text-outline uppercase tracking-widest">Account Type</p>
          <p className="text-[11px] font-bold text-outline uppercase tracking-widest">Source</p>
          <p className="text-[11px] font-bold text-outline uppercase tracking-widest">Status</p>
          <p className="text-[11px] font-bold text-outline uppercase tracking-widest">Date</p>
          <p className="text-[11px] font-bold text-outline uppercase tracking-widest w-8"></p>
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex items-center justify-center py-20">
            <span className="material-symbols-outlined text-outline text-3xl animate-spin">progress_activity</span>
          </div>
        )}

        {/* Empty state */}
        {!loading && filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-center px-6">
            <span className="material-symbols-outlined text-outline-variant text-5xl mb-4">inbox</span>
            <p className="font-headline font-bold text-lg text-primary mb-1">No applications found</p>
            <p className="text-sm text-outline">
              {searchQuery ? "Try a different search term" : "No applications match this filter"}
            </p>
            <p className="text-xs text-outline malayalam-text mt-1">അപേക്ഷകൾ ഒന്നും കണ്ടെത്തിയില്ല</p>
          </div>
        )}

        {/* Rows */}
        {!loading && filtered.map((app) => {
          const type = accountTypeBadge[app.account_type] || accountTypeBadge.savings;
          const status = statusConfig[app.status] || statusConfig.new;
          const initials = app.customers?.full_name
            ?.split(" ")
            .map((n) => n[0])
            .join("")
            .slice(0, 2)
            .toUpperCase() || "??";
          const submitted = new Date(app.submitted_at);
          const timeAgo = getTimeAgo(submitted);

          return (
            <div
              key={app.id}
              className="grid grid-cols-1 md:grid-cols-[2fr_1.2fr_1fr_1fr_1fr_auto] gap-3 md:gap-4 px-6 py-5 hover:bg-surface-container-low/50 transition-colors items-center"
              style={{ borderTop: "1px solid rgba(195,198,208,0.12)" }}
            >
              {/* Applicant */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-surface-container-high flex items-center justify-center text-sm font-bold text-primary flex-shrink-0">
                  {initials}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-bold text-primary truncate">{app.customers?.full_name || "Unknown"}</p>
                  <p className="text-xs text-outline truncate">{app.customers?.email || app.customers?.mobile || "—"}</p>
                </div>
              </div>

              {/* Account type */}
              <div>
                <span className={`inline-block px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider ${type.bg} ${type.text}`}>
                  {type.label}
                </span>
              </div>

              {/* Source */}
              <div className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-sm text-outline">
                  {app.source === "online_portal" ? "language" : "edit_note"}
                </span>
                <span className="text-xs text-primary">
                  {app.source === "online_portal" ? "Online Portal" : "Manual Entry"}
                </span>
              </div>

              {/* Status */}
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${status.dot}`} />
                <span className={`text-xs font-medium ${status.color}`}>{status.label}</span>
              </div>

              {/* Date */}
              <div>
                <p className="text-xs font-medium text-primary">
                  {submitted.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                </p>
                <p className="text-[10px] text-outline">{timeAgo}</p>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-1">
                <Link
                  href={`/applications/${app.id}`}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-surface-container-high text-xs font-bold text-primary hover:bg-surface-container-highest transition-colors"
                >
                  Review
                  <span className="material-symbols-outlined text-sm">arrow_forward</span>
                </Link>
                <button className="w-8 h-8 rounded-lg flex items-center justify-center text-outline hover:bg-surface-container-high transition-colors">
                  <span className="material-symbols-outlined text-lg">more_vert</span>
                </button>
              </div>
            </div>
          );
        })}

        {/* Footer */}
        {!loading && filtered.length > 0 && (
          <div className="flex items-center justify-between px-6 py-4 bg-surface-container-low">
            <p className="text-xs text-outline">
              Showing 1 to {filtered.length} of {applications.length} entries
            </p>
            <div className="flex items-center gap-1">
              <PaginationBtn disabled>&lsaquo;</PaginationBtn>
              <PaginationBtn active>1</PaginationBtn>
              <PaginationBtn>2</PaginationBtn>
              <PaginationBtn>3</PaginationBtn>
              <PaginationBtn>&rsaquo;</PaginationBtn>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function PaginationBtn({ children, active, disabled }: { children: React.ReactNode; active?: boolean; disabled?: boolean }) {
  return (
    <button
      disabled={disabled}
      className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold transition-colors ${
        active
          ? "bg-primary-container text-on-primary"
          : disabled
          ? "text-outline/30 cursor-not-allowed"
          : "text-outline hover:bg-surface-container-high"
      }`}
    >
      {children}
    </button>
  );
}

function getTimeAgo(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  if (diffMins < 60) return `${diffMins}m ago`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays === 1) return "Yesterday";
  return `${diffDays}d ago`;
}
