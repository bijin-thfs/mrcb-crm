"use client";

import { useState } from "react";

export default function SettingsPage() {
  const [loanAlerts, setLoanAlerts] = useState(true);
  const [complianceUpdates, setComplianceUpdates] = useState(true);
  const [breachAlerts, setBreachAlerts] = useState(true);
  const [twoFactor, setTwoFactor] = useState(true);

  return (
    <div className="max-w-[1400px] mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-8">
        <div>
          <h1 className="font-headline font-extrabold text-3xl lg:text-4xl text-primary">
            Staff Settings
          </h1>
          <p className="text-sm text-outline mt-1">
            Manage your bank profile and institutional preferences
          </p>
          <p className="text-xs text-outline malayalam-text">
            സ്റ്റാഫ് ക്രമീകരണങ്ങളും ബാങ്ക് മുൻഗണനകളും
          </p>
        </div>
        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-success-container text-success text-xs font-bold">
          <span className="w-2 h-2 rounded-full bg-success" />
          Active - 24/7
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column — Profile + Notifications */}
        <div className="lg:col-span-2 space-y-6">
          {/* Profile Information */}
          <div className="bg-surface-container-lowest rounded-2xl p-6 md:p-8 shadow-[0_2px_16px_rgba(0,45,86,0.04)]">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="font-headline font-bold text-lg text-primary">Profile Information</h2>
                <p className="text-xs text-outline">UpgradeID: c/b-internal</p>
              </div>
              <button className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-surface-container-high text-xs font-bold text-primary hover:bg-surface-container-highest transition-colors">
                <span className="material-symbols-outlined text-base">edit</span>
                Edit Details
              </button>
            </div>

            <div className="flex flex-col sm:flex-row gap-6">
              {/* Avatar */}
              <div className="flex flex-col items-center gap-3">
                <div className="w-20 h-20 rounded-2xl heritage-gradient flex items-center justify-center">
                  <span className="material-symbols-outlined text-white text-4xl">person</span>
                </div>
              </div>

              {/* Info grid */}
              <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4">
                <ProfileField label="Full Name" value="Staff Name" />
                <ProfileField label="Designation" value="Senior Credit Officer" icon="badge" />
                <ProfileField label="Staff ID" value="MRCB-2024-8842" />
                <ProfileField label="Email" value="e.concierge@mayyanadbank.in" icon="mail" />
              </div>
            </div>
          </div>

          {/* Notification Controls */}
          <div className="bg-surface-container-lowest rounded-2xl p-6 md:p-8 shadow-[0_2px_16px_rgba(0,45,86,0.04)]">
            <h2 className="font-headline font-bold text-lg text-primary mb-1">Notification Controls</h2>
            <p className="text-xs text-outline malayalam-text mb-6">അറിയിപ്പ് ക്രമീകരണങ്ങൾ</p>

            <div className="space-y-2">
              <NotificationRow
                icon="notifications_active"
                label="Loan Application Alerts"
                description="Real-time updates on new submissions"
                malayalam="വായ്പ അപേക്ഷ അറിയിപ്പുകൾ"
                enabled={loanAlerts}
                onToggle={() => setLoanAlerts(!loanAlerts)}
              />
              <NotificationRow
                icon="security"
                label="System Compliance Updates"
                description="Mandatory policy changes and updates"
                malayalam="സിസ്റ്റം അനുസരണ അപ്ഡേറ്റുകൾ"
                enabled={complianceUpdates}
                onToggle={() => setComplianceUpdates(!complianceUpdates)}
              />
              <NotificationRow
                icon="warning"
                label="Security Breach Attempts"
                description="Immediate alerts for suspicious activity"
                malayalam="സുരക്ഷാ ഭീഷണി അറിയിപ്പുകൾ"
                enabled={breachAlerts}
                onToggle={() => setBreachAlerts(!breachAlerts)}
                critical
              />
            </div>
          </div>

          {/* Security Footer */}
          <div className="bg-surface-container-lowest rounded-2xl p-6 md:p-8 shadow-[0_2px_16px_rgba(0,45,86,0.04)]">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-success-container/30 flex items-center justify-center flex-shrink-0">
                <span className="material-symbols-outlined text-success text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>verified_user</span>
              </div>
              <div className="flex-1">
                <h3 className="font-headline font-bold text-lg text-primary mb-1">
                  Your Banking Dashboard is secured.
                </h3>
                <p className="text-sm text-outline leading-relaxed">
                  Staff activities are monitored to ensure highest concierge service
                  delivery and regulatory compliance. Last login detection from
                  Mayyanad Branch Terminal 04.
                </p>
                <p className="text-xs text-outline malayalam-text mt-2">
                  സ്റ്റാഫ് പ്രവർത്തനങ്ങൾ നിരീക്ഷിക്കപ്പെടുന്നു. അവസാന ലോഗിൻ: മയ്യനാട് ബ്രാഞ്ച് ടെർമിനൽ 04.
                </p>
                <div className="flex items-center gap-4 mt-4">
                  <span className="text-xs text-outline">IP: 192.168.1.42</span>
                  <span className="text-xs text-outline">OS: MRCB-95 v4.2</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right column — Branch Info + Security */}
        <div className="space-y-6">
          {/* Branch Info */}
          <div className="bg-surface-container-lowest rounded-2xl overflow-hidden shadow-[0_2px_16px_rgba(0,45,86,0.04)]">
            <div className="heritage-gradient p-5">
              <h3 className="font-headline font-bold text-base text-white mb-0.5">Branch Info</h3>
              <p className="text-xs text-white/50 malayalam-text">ശാഖ വിവരങ്ങൾ</p>
            </div>
            <div className="p-5 space-y-4">
              <BranchField icon="location_on" label="Location" value="Mayyanad Main Square" />
              <BranchField icon="call" label="Phone" value="0474-2555265" />
              <BranchField icon="mail" label="Email" value="e.concierge@mayyanadbank.in" />
              <div className="pt-2">
                <div className="bg-surface-container-high rounded-xl p-3 text-center">
                  <p className="text-[10px] text-outline uppercase tracking-widest mb-1">Branch Code</p>
                  <p className="font-headline font-extrabold text-lg text-primary tracking-widest">MAIR00990042</p>
                </div>
              </div>
            </div>
          </div>

          {/* Security Settings */}
          <div className="bg-surface-container-lowest rounded-2xl p-5 shadow-[0_2px_16px_rgba(0,45,86,0.04)]">
            <h3 className="font-headline font-bold text-base text-primary mb-1">Security Settings</h3>
            <p className="text-xs text-outline malayalam-text mb-5">സുരക്ഷാ ക്രമീകരണങ്ങൾ</p>

            <div className="space-y-4">
              <SecurityRow
                label="Two-Factor Authentication"
                status={twoFactor ? "Enabled" : "Disabled"}
                statusColor={twoFactor ? "text-success" : "text-error"}
                action={
                  <Toggle enabled={twoFactor} onToggle={() => setTwoFactor(!twoFactor)} />
                }
              />
              <SecurityRow
                label="Password Last Changed"
                status="12 days ago"
                statusColor="text-outline"
                action={
                  <button className="text-xs font-bold text-secondary hover:underline">Change</button>
                }
              />
              <SecurityRow
                label="Session Management"
                status="Active"
                statusColor="text-success"
                action={
                  <button className="text-xs font-bold text-secondary hover:underline">View</button>
                }
              />
            </div>

            {/* Compliance note */}
            <div className="mt-5 p-4 bg-error-container/20 rounded-xl">
              <p className="text-xs font-bold text-error mb-0.5">അടിയന്തര സുരക്ഷാ അറിയിപ്പ്</p>
              <p className="text-xs text-on-surface-variant">
                പാസ്‌വേഡ് കാലാവധി: 8/30 ദിവസം ശേഷിക്കുന്നു.
              </p>
              <p className="text-[11px] text-outline mt-1">
                Password expiry: 8/30 days remaining.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-8 text-center text-xs text-outline py-4">
        © 2024 Mayyanad Regional Co-operative Bank. Elite CRM Staff Portal. All Rights Reserved.
      </div>
    </div>
  );
}

/* ─── Sub-components ─── */

function ProfileField({ label, value, icon }: { label: string; value: string; icon?: string }) {
  return (
    <div>
      <p className="text-[10px] font-bold text-outline uppercase tracking-widest mb-1">{label}</p>
      <div className="flex items-center gap-2">
        {icon && <span className="material-symbols-outlined text-base text-outline">{icon}</span>}
        <p className="text-sm font-medium text-primary">{value}</p>
      </div>
    </div>
  );
}

function NotificationRow({ icon, label, description, malayalam, enabled, onToggle, critical }: {
  icon: string;
  label: string;
  description: string;
  malayalam: string;
  enabled: boolean;
  onToggle: () => void;
  critical?: boolean;
}) {
  return (
    <div className={`flex items-center gap-4 px-4 py-4 rounded-xl transition-colors ${
      critical ? "bg-error-container/10" : "hover:bg-surface-container-low"
    }`}>
      <span className={`material-symbols-outlined text-xl flex-shrink-0 ${
        critical ? "text-error" : "text-primary-container"
      }`}>
        {icon}
      </span>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-primary">{label}</p>
        <p className="text-xs text-outline">{description}</p>
        <p className="text-[10px] text-outline malayalam-text">{malayalam}</p>
      </div>
      <Toggle enabled={enabled} onToggle={onToggle} />
    </div>
  );
}

function Toggle({ enabled, onToggle }: { enabled: boolean; onToggle: () => void }) {
  return (
    <button
      onClick={onToggle}
      className={`w-12 h-7 rounded-full flex items-center px-1 transition-colors duration-200 flex-shrink-0 ${
        enabled ? "bg-secondary" : "bg-outline-variant"
      }`}
    >
      <div className={`w-5 h-5 bg-white rounded-full shadow-md transition-transform duration-200 ${
        enabled ? "translate-x-5" : "translate-x-0"
      }`} />
    </button>
  );
}

function BranchField({ icon, label, value }: { icon: string; label: string; value: string }) {
  return (
    <div className="flex items-start gap-3">
      <span className="material-symbols-outlined text-outline text-lg mt-0.5">{icon}</span>
      <div>
        <p className="text-[10px] text-outline uppercase tracking-widest">{label}</p>
        <p className="text-sm font-medium text-primary">{value}</p>
      </div>
    </div>
  );
}

function SecurityRow({ label, status, statusColor, action }: {
  label: string;
  status: string;
  statusColor: string;
  action: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between py-2.5" style={{ borderBottom: "1px solid rgba(195,198,208,0.12)" }}>
      <div>
        <p className="text-sm font-medium text-primary">{label}</p>
        <p className={`text-xs ${statusColor}`}>{status}</p>
      </div>
      {action}
    </div>
  );
}
