"use client";

import { useState } from "react";

type LoanLead = {
  id: string;
  appId: string;
  name: string;
  initials: string;
  branch: string;
  amount: number;
  loanType: string;
  cibilScore: number;
  status: "pending" | "approved" | "rejected" | "reviewing";
  submittedAt: string;
};

const mockLeads: LoanLead[] = [
  { id: "1", appId: "APP-9928-24", name: "Raghavan Velayudhan", initials: "RV", branch: "Mayyanad Central", amount: 850000, loanType: "Housing Loan", cibilScore: 785, status: "reviewing", submittedAt: "2024-10-24T14:20:00" },
  { id: "2", appId: "APP-9931-24", name: "Anjali Madhavan", initials: "AM", branch: "Kollam West", amount: 200000, loanType: "Personal Gold Loan", cibilScore: 712, status: "pending", submittedAt: "2024-10-23T09:15:00" },
  { id: "3", appId: "APP-9935-24", name: "Suresh Babu P.K.", initials: "SB", branch: "Paravur East", amount: 1250000, loanType: "Business Expansion", cibilScore: 810, status: "approved", submittedAt: "2024-10-22T11:00:00" },
  { id: "4", appId: "APP-9940-24", name: "Priya Nair", initials: "PN", branch: "Mayyanad Central", amount: 500000, loanType: "Vehicle Loan", cibilScore: 690, status: "pending", submittedAt: "2024-10-22T16:30:00" },
  { id: "5", appId: "APP-9942-24", name: "Vijayan K.", initials: "VK", branch: "Kollam West", amount: 100000, loanType: "Personal Gold Loan", cibilScore: 745, status: "reviewing", submittedAt: "2024-10-21T10:00:00" },
  { id: "6", appId: "APP-9945-24", name: "Lakshmi Devi", initials: "LD", branch: "Paravur East", amount: 300000, loanType: "Agriculture Loan", cibilScore: 650, status: "rejected", submittedAt: "2024-10-20T14:00:00" },
];

export default function LoansPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");

  const filtered = mockLeads.filter((lead) => {
    const matchesSearch = !searchQuery ||
      lead.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.appId.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterStatus === "all" || lead.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const totalActive = mockLeads.filter((l) => l.status !== "rejected").length;
  const pendingApprovals = mockLeads.filter((l) => ["pending", "reviewing"].includes(l.status)).length;

  return (
    <div className="max-w-[1400px] mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-headline font-extrabold text-3xl lg:text-4xl text-primary">
          Loan Leads
        </h1>
        <p className="text-sm text-outline mt-1">
          Regional Processing Queue · <span className="malayalam-text">വായ്പ അപേക്ഷകൾ</span>
        </p>
      </div>

      {/* Stats — Two large cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
        {/* Total Active Leads */}
        <div className="heritage-gradient rounded-2xl p-6 md:p-8 relative overflow-hidden">
          <div className="absolute right-6 top-6 opacity-10">
            <span className="material-symbols-outlined text-white text-[80px]">request_quote</span>
          </div>
          <p className="text-[11px] font-bold text-white/60 uppercase tracking-widest mb-3">
            Total Active Leads
          </p>
          <p className="font-headline font-extrabold text-6xl text-white mb-6">
            {totalActive}
          </p>
          <div className="flex items-center gap-6">
            <div className="bg-white/10 rounded-xl px-4 py-2.5">
              <p className="text-[10px] text-white/50 uppercase tracking-wider">Approval Rate</p>
              <p className="font-headline font-bold text-lg text-white">94.2%</p>
            </div>
            <div className="bg-white/10 rounded-xl px-4 py-2.5">
              <p className="text-[10px] text-white/50 uppercase tracking-wider">Avg TAT</p>
              <p className="font-headline font-bold text-lg text-white">3.2 Days</p>
            </div>
          </div>
        </div>

        {/* Pending Approvals */}
        <div className="bg-secondary-container rounded-2xl p-6 md:p-8 relative overflow-hidden">
          <div className="absolute right-6 top-6">
            <span className="material-symbols-outlined text-on-secondary-container/20 text-[60px]">assignment_late</span>
          </div>
          <p className="text-[11px] font-bold text-on-secondary-container/70 uppercase tracking-widest mb-3">
            Pending Approvals
          </p>
          <p className="font-headline font-extrabold text-6xl text-on-secondary-container mb-4">
            {pendingApprovals}
          </p>
          <p className="text-sm text-on-secondary-container/60 italic">
            Requiring immediate attention
          </p>
          <p className="text-xs text-on-secondary-container/50 malayalam-text">
            ഉടനടി ശ്രദ്ധ ആവശ്യമാണ്
          </p>
        </div>
      </div>

      {/* Manual Entries Queue */}
      <div className="bg-surface-container-lowest rounded-2xl shadow-[0_2px_16px_rgba(0,45,86,0.04)] overflow-hidden">
        {/* Queue header */}
        <div className="px-6 pt-6 pb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="font-headline font-bold text-xl text-primary">Manual Entries Queue</h2>
            <p className="text-xs text-outline mt-0.5">Last updated 2 mins ago</p>
          </div>
          <div className="flex items-center gap-3">
            {/* Search */}
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-lg">search</span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search loan leads..."
                className="bg-surface-container-high rounded-xl py-2 pl-10 pr-4 text-sm outline-none border-2 border-transparent focus:border-secondary/20 placeholder:text-outline/50 transition-all w-48 lg:w-64"
              />
            </div>
            <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-surface-container-high text-sm font-bold text-primary hover:bg-surface-container-highest transition-colors">
              <span className="material-symbols-outlined text-lg">picture_as_pdf</span>
              <span className="hidden sm:inline">Export PDF</span>
            </button>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="bg-surface-container-high rounded-xl py-2.5 px-4 text-sm font-bold text-primary outline-none border-2 border-transparent focus:border-secondary/20 transition-all appearance-none cursor-pointer"
              style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='20' height='20' viewBox='0 0 24 24' fill='none' stroke='%2373777f' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`, backgroundRepeat: "no-repeat", backgroundPosition: "right 10px center", paddingRight: "36px" }}
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="reviewing">Reviewing</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </div>

        {/* Table header */}
        <div className="hidden md:grid grid-cols-[2fr_1.2fr_1.2fr_0.8fr_auto] gap-4 px-6 py-3 bg-surface-container-low">
          <p className="text-[11px] font-bold text-outline uppercase tracking-widest">Applicant Details</p>
          <p className="text-[11px] font-bold text-outline uppercase tracking-widest">Branch</p>
          <p className="text-[11px] font-bold text-outline uppercase tracking-widest">Proposed Amount</p>
          <p className="text-[11px] font-bold text-outline uppercase tracking-widest">CIBIL Score</p>
          <p className="text-[11px] font-bold text-outline uppercase tracking-widest w-24">Actions</p>
        </div>

        {/* Empty state */}
        {filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-center px-6">
            <span className="material-symbols-outlined text-outline-variant text-5xl mb-4">search_off</span>
            <p className="font-headline font-bold text-lg text-primary mb-1">No loan leads found</p>
            <p className="text-sm text-outline">Try adjusting your search or filter</p>
            <p className="text-xs text-outline malayalam-text mt-1">വായ്പ അപേക്ഷകൾ കണ്ടെത്തിയില്ല</p>
          </div>
        )}

        {/* Rows */}
        {filtered.map((lead) => (
          <div
            key={lead.id}
            className="grid grid-cols-1 md:grid-cols-[2fr_1.2fr_1.2fr_0.8fr_auto] gap-3 md:gap-4 px-6 py-5 hover:bg-surface-container-low/50 transition-colors items-center"
            style={{ borderTop: "1px solid rgba(195,198,208,0.12)" }}
          >
            {/* Applicant */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-surface-container-high flex items-center justify-center text-sm font-bold text-primary flex-shrink-0">
                {lead.initials}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-bold text-primary truncate">{lead.name}</p>
                <p className="text-xs text-outline">ID: {lead.appId}</p>
              </div>
            </div>

            {/* Branch */}
            <div>
              <p className="text-sm text-primary">{lead.branch}</p>
              <p className="text-xs text-outline md:hidden">{lead.loanType}</p>
            </div>

            {/* Amount */}
            <div>
              <p className="text-sm font-bold text-primary">
                ₹ {lead.amount.toLocaleString("en-IN")}
              </p>
              <p className="text-xs text-outline">{lead.loanType}</p>
            </div>

            {/* CIBIL Score */}
            <div>
              <span className={`inline-flex items-center justify-center w-14 h-8 rounded-lg text-xs font-bold ${
                lead.cibilScore >= 750
                  ? "bg-success-container text-success"
                  : lead.cibilScore >= 700
                  ? "bg-secondary-container text-on-secondary-container"
                  : lead.cibilScore >= 650
                  ? "bg-warning-container text-on-surface"
                  : "bg-error-container text-error"
              }`}>
                {lead.cibilScore}
              </span>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-1 w-24">
              <button className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-surface-container-high text-xs font-bold text-primary hover:bg-surface-container-highest transition-colors">
                Review
                <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </button>
              <button className="w-8 h-8 rounded-lg flex items-center justify-center text-outline hover:bg-surface-container-high transition-colors">
                <span className="material-symbols-outlined text-lg">more_vert</span>
              </button>
            </div>
          </div>
        ))}

        {/* Footer */}
        {filtered.length > 0 && (
          <div className="flex items-center justify-between px-6 py-4 bg-surface-container-low">
            <p className="text-xs text-outline">
              Showing 1 to {filtered.length} of {mockLeads.length} leads
            </p>
            <div className="flex items-center gap-1">
              <PageBtn disabled>&lsaquo;</PageBtn>
              <PageBtn active>1</PageBtn>
              <PageBtn>2</PageBtn>
              <PageBtn>3</PageBtn>
              <PageBtn>&rsaquo;</PageBtn>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function PageBtn({ children, active, disabled }: { children: React.ReactNode; active?: boolean; disabled?: boolean }) {
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
