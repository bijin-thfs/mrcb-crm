"use client";

import { useState } from "react";

type InquiryResult = {
  id: string;
  name: string;
  score: number;
  checkedAt: string;
};

const recentInquiries: InquiryResult[] = [
  { id: "#8291", name: "Ramesh Krishnan", score: 782, checkedAt: "2 hours ago" },
  { id: "#8288", name: "Anjali Menon", score: 645, checkedAt: "Yesterday" },
  { id: "#8285", name: "Suresh Kumar", score: 810, checkedAt: "Yesterday" },
  { id: "#8280", name: "Priya Nair", score: 720, checkedAt: "2 days ago" },
];

export default function CreditScorePage() {
  const [fullName, setFullName] = useState("");
  const [dob, setDob] = useState("");
  const [pan, setPan] = useState("");
  const [mobile, setMobile] = useState("");
  const [checking, setChecking] = useState(false);
  const [result, setResult] = useState<{ score: number; status: string } | null>(null);

  const handleCheck = () => {
    if (!fullName || !pan || !mobile) return;
    setChecking(true);
    setResult(null);
    // Simulate API call
    setTimeout(() => {
      const score = Math.floor(Math.random() * (850 - 550) + 550);
      setResult({
        score,
        status: score >= 750 ? "Excellent" : score >= 700 ? "Good" : score >= 650 ? "Fair" : "Poor",
      });
      setChecking(false);
    }, 2000);
  };

  const canSubmit = fullName && pan.length === 10 && mobile.length >= 10;

  return (
    <div className="max-w-[1400px] mx-auto">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-outline mb-2">
        <span>Credit Bureau</span>
        <span className="material-symbols-outlined text-sm">chevron_right</span>
        <span className="font-bold text-primary">Credit Inquiry</span>
      </div>

      {/* Header */}
      <div className="mb-8">
        <h1 className="font-headline font-extrabold text-3xl lg:text-4xl text-primary">
          Credit Inquiry
        </h1>
        <p className="text-sm text-outline mt-1">
          Retrieve real-time credit score and institutional history for member verification.
        </p>
        <p className="text-xs text-outline malayalam-text">
          അംഗ പരിശോധനയ്ക്കായി തത്സമയ ക്രെഡിറ്റ് സ്കോർ ലഭ്യമാക്കുക.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* Inquiry Form — Left */}
        <div className="lg:col-span-3">
          <div className="bg-surface-container-lowest rounded-2xl p-6 md:p-8 shadow-[0_2px_16px_rgba(0,45,86,0.04)]">
            <h2 className="font-headline font-bold text-xl text-primary mb-6">Inquiry Details</h2>

            <div className="space-y-6">
              {/* Full Name */}
              <div>
                <label className="text-[11px] font-bold text-outline uppercase tracking-wider">
                  Full Name (as per PAN)
                </label>
                <p className="text-[10px] text-outline malayalam-text mb-2">പൂർണ്ണ നാമം (PAN പ്രകാരം)</p>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Enter full name"
                  className="w-full bg-surface-container-high rounded-xl py-3.5 px-4 text-sm text-primary font-medium outline-none border-2 border-transparent focus:border-secondary/20 focus:shadow-[0_0_0_4px_rgba(119,90,25,0.06)] placeholder:text-outline/50 transition-all"
                />
              </div>

              {/* DOB + PAN */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="text-[11px] font-bold text-outline uppercase tracking-wider">
                    Date of Birth
                  </label>
                  <p className="text-[10px] text-outline malayalam-text mb-2">ജനന തീയതി</p>
                  <input
                    type="date"
                    value={dob}
                    onChange={(e) => setDob(e.target.value)}
                    className="w-full bg-surface-container-high rounded-xl py-3.5 px-4 text-sm text-primary font-medium outline-none border-2 border-transparent focus:border-secondary/20 focus:shadow-[0_0_0_4px_rgba(119,90,25,0.06)] transition-all"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-outline uppercase tracking-wider">
                    PAN Number
                  </label>
                  <p className="text-[10px] text-outline malayalam-text mb-2">പാൻ നമ്പർ</p>
                  <input
                    type="text"
                    maxLength={10}
                    value={pan}
                    onChange={(e) => setPan(e.target.value.toUpperCase())}
                    placeholder="ABCDE1234F"
                    className="w-full bg-surface-container-high rounded-xl py-3.5 px-4 text-sm text-primary font-medium outline-none border-2 border-transparent focus:border-secondary/20 focus:shadow-[0_0_0_4px_rgba(119,90,25,0.06)] placeholder:text-outline/50 transition-all uppercase"
                  />
                </div>
              </div>

              {/* Mobile */}
              <div>
                <label className="text-[11px] font-bold text-outline uppercase tracking-wider">
                  Mobile Number
                </label>
                <p className="text-[10px] text-outline malayalam-text mb-2">മൊബൈൽ നമ്പർ</p>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-bold text-outline border-r border-outline/20 pr-3">
                    +91
                  </span>
                  <input
                    type="text"
                    inputMode="numeric"
                    maxLength={10}
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value.replace(/\D/g, ""))}
                    placeholder="9876543210"
                    className="w-full bg-surface-container-high rounded-xl py-3.5 pl-16 pr-4 text-sm text-primary font-medium outline-none border-2 border-transparent focus:border-secondary/20 focus:shadow-[0_0_0_4px_rgba(119,90,25,0.06)] placeholder:text-outline/50 transition-all"
                  />
                </div>
              </div>

              {/* Submit */}
              <button
                onClick={handleCheck}
                disabled={!canSubmit || checking}
                className="w-full flex items-center justify-center gap-3 py-4 rounded-xl bg-secondary text-on-secondary font-headline font-bold text-base shadow-lg shadow-secondary/20 hover:scale-[1.01] active:scale-[0.98] transition-all disabled:opacity-50 disabled:pointer-events-none"
              >
                {checking ? (
                  <span className="material-symbols-outlined animate-spin text-xl">progress_activity</span>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-xl">credit_score</span>
                    Check Credit Score
                  </>
                )}
              </button>
              <p className="text-xs text-outline text-center">
                Verification fee of ₹250 will be debited from staff portal balance.
              </p>
              <p className="text-[11px] text-outline text-center malayalam-text">
                പരിശോധന ഫീസ് ₹250 സ്റ്റാഫ് പോർട്ടൽ ബാലൻസിൽ നിന്ന് ഈടാക്കും.
              </p>
            </div>

            {/* Result */}
            {result && (
              <div className="mt-8 p-6 rounded-2xl bg-surface-container-low animate-[fadeIn_0.3s_ease-out]">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-headline font-bold text-lg text-primary">Score Result</h3>
                  <span className={`text-xs font-bold px-3 py-1 rounded-full ${
                    result.score >= 750 ? "bg-success-container text-success"
                    : result.score >= 700 ? "bg-secondary-container text-on-secondary-container"
                    : result.score >= 650 ? "bg-warning-container text-on-surface"
                    : "bg-error-container text-error"
                  }`}>
                    {result.status}
                  </span>
                </div>
                <div className="flex items-end gap-4">
                  <p className="font-headline font-extrabold text-5xl text-primary">{result.score}</p>
                  <div className="flex-1 mb-2">
                    <div className="h-3 bg-surface-container-high rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-1000 ${
                          result.score >= 750 ? "bg-success" : result.score >= 700 ? "bg-secondary" : result.score >= 650 ? "bg-warning" : "bg-error"
                        }`}
                        style={{ width: `${((result.score - 300) / 600) * 100}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-[10px] text-outline mt-1">
                      <span>300</span>
                      <span>550</span>
                      <span>700</span>
                      <span>900</span>
                    </div>
                  </div>
                </div>
                <p className="text-xs text-outline mt-3">
                  Score for <span className="font-bold text-primary">{fullName}</span> · PAN: {pan}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Staff Guidelines — Right */}
        <div className="lg:col-span-2 space-y-6">
          {/* Guidelines badge */}
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-secondary-container/40 w-fit">
            <span className="material-symbols-outlined text-secondary text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>shield</span>
            <span className="text-xs font-bold text-on-secondary-container">Staff Guidelines</span>
          </div>

          {/* Identity Verification */}
          <div>
            <h3 className="font-headline font-bold text-base text-primary flex items-center gap-2 mb-3">
              <span className="material-symbols-outlined text-lg text-primary-container">fingerprint</span>
              Identity Verification
            </h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-primary-container mt-2 flex-shrink-0" />
                <p className="text-sm text-on-surface-variant">
                  Ensure the PAN number belongs to the physical card presented by the member.
                </p>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-secondary mt-2 flex-shrink-0" />
                <p className="text-sm text-on-surface-variant malayalam-text">
                  അപേക്ഷകന്റെ പാൻ കാർഡിലെ പേരും ജനനത്തീയതിയും സിറ്റിയുടെ സിസ്റ്റത്തിൽ നൽകിയിരിക്കുന്നതുമായി ഒത്തുനോക്കുക.
                </p>
              </li>
            </ul>
          </div>

          {/* Legal Compliance */}
          <div>
            <h3 className="font-headline font-bold text-base text-primary flex items-center gap-2 mb-3">
              <span className="material-symbols-outlined text-lg text-primary-container">gavel</span>
              Legal Compliance
            </h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-primary-container mt-2 flex-shrink-0" />
                <p className="text-sm text-on-surface-variant">
                  Mandatory signed consent form required before initiating any credit bureau check.
                </p>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-secondary mt-2 flex-shrink-0" />
                <p className="text-sm text-on-surface-variant malayalam-text">
                  ക്രെഡിറ്റ് ബ്യൂറോ പരിശോധന ആരംഭിക്കുന്നതിന് മുമ്പ് അംഗത്തിന്റെ രേഖാമൂലമുള്ള സമ്മതം വാങ്ങിയിരിക്കണം.
                </p>
              </li>
            </ul>
          </div>

          {/* Need Assistance */}
          <div className="bg-surface-container-low rounded-2xl p-5">
            <div className="flex items-start gap-3">
              <span className="material-symbols-outlined text-primary-container text-xl mt-0.5">help</span>
              <div>
                <p className="text-sm font-bold text-primary">Need Assistance?</p>
                <p className="text-xs text-outline mt-1">
                  Contact the Head Office IT Desk for failed inquiries or billing disputes.
                </p>
                <p className="text-[11px] text-outline malayalam-text mt-1">
                  പരാജയപ്പെട്ട അന്വേഷണങ്ങൾക്ക് ഹെഡ് ഓഫീസ് IT ഡെസ്കിൽ ബന്ധപ്പെടുക.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Branch Inquiries */}
      <div className="mt-10">
        <h2 className="font-headline font-bold text-xl text-primary mb-5">Recent Branch Inquiries</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {recentInquiries.map((inq) => (
            <div key={inq.id} className="bg-surface-container-lowest rounded-2xl p-5 shadow-[0_2px_16px_rgba(0,45,86,0.04)]">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs text-outline">Inquiry ID: {inq.id}</span>
                <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                  inq.score >= 750 ? "bg-success-container text-success"
                  : inq.score >= 700 ? "bg-secondary-container text-on-secondary-container"
                  : inq.score >= 650 ? "bg-warning-container text-on-surface"
                  : "bg-error-container text-error"
                }`}>
                  {inq.score} Score
                </span>
              </div>
              <p className="text-sm font-bold text-primary">{inq.name}</p>
              <div className="flex items-center justify-between mt-3">
                <span className="text-[11px] text-outline">{inq.checkedAt}</span>
                <button className="flex items-center gap-1 text-xs font-bold text-secondary hover:underline">
                  View Report
                  <span className="material-symbols-outlined text-sm">open_in_new</span>
                </button>
              </div>
            </div>
          ))}

          {/* Monthly Quota */}
          <div className="bg-secondary-container rounded-2xl p-5 flex flex-col justify-center sm:col-span-2 lg:col-span-1 hidden lg:flex">
            <p className="text-[10px] font-bold text-on-secondary-container/60 uppercase tracking-widest mb-1">Monthly Quota</p>
            <p className="font-headline font-extrabold text-3xl text-on-secondary-container">142 / 500</p>
            <p className="text-xs text-on-secondary-container/60 mt-1">Inquiries remaining this billing cycle</p>
          </div>
        </div>
      </div>
    </div>
  );
}
