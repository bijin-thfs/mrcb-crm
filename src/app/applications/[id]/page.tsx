"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase";

type AppDetail = {
  id: string;
  reference_number: string;
  account_type: string;
  status: string;
  source: string;
  account_variant: string;
  cheque_book: boolean;
  initial_deposit: number;
  nominee_name: string | null;
  nominee_relationship: string | null;
  vkyc_status: string;
  submitted_at: string;
  rejection_reason: string | null;
  customers: {
    id: string;
    full_name: string;
    name_malayalam: string | null;
    date_of_birth: string | null;
    gender: string | null;
    father_spouse_name: string | null;
    mobile: string;
    email: string | null;
    occupation: string | null;
    annual_income: string | null;
    address_line1: string | null;
    address_line2: string | null;
    city: string | null;
    district: string | null;
    state: string | null;
    pincode: string | null;
    aadhaar_number: string | null;
    pan_number: string | null;
    kyc_status: string;
  } | null;
  application_documents: {
    id: string;
    doc_type: string;
    file_path: string;
    verified: boolean;
  }[];
  verification_checks: {
    id: string;
    check_type: string;
    checked: boolean;
  }[];
};

const checkLabels: Record<string, { label: string; icon: string }> = {
  aadhaar: { label: "Aadhaar Verified", icon: "badge" },
  pan: { label: "PAN Verified", icon: "credit_card" },
  photo: { label: "Photo Matches Applicant", icon: "photo_camera" },
  address: { label: "Address Proof Verified", icon: "location_on" },
  vkyc: { label: "VKYC Completed", icon: "videocam" },
  deposit: { label: "Initial Deposit Received", icon: "payments" },
};

const statusConfig: Record<string, { label: string; bg: string; text: string }> = {
  new: { label: "New", bg: "bg-primary-container/15", text: "text-primary-container" },
  reviewing: { label: "Reviewing", bg: "bg-secondary-container", text: "text-on-secondary-container" },
  vkyc_pending: { label: "VKYC Pending", bg: "bg-warning-container", text: "text-on-surface" },
  docs_missing: { label: "Docs Missing", bg: "bg-error-container", text: "text-error" },
  approved: { label: "Approved", bg: "bg-success-container", text: "text-success" },
  rejected: { label: "Rejected", bg: "bg-error-container", text: "text-error" },
};

export default function ApplicationDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const [app, setApp] = useState<AppDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [checks, setChecks] = useState<Record<string, boolean>>({});
  const [noteText, setNoteText] = useState("");
  const [notes, setNotes] = useState<{ content: string; created_at: string }[]>([]);
  const [storageFiles, setStorageFiles] = useState<{ name: string; path: string }[]>([]);

  useEffect(() => {
    fetchApplication();
    fetchNotes();
  }, [id]);

  async function fetchApplication() {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("applications")
      .select(`
        *,
        customers (*),
        application_documents (*),
        verification_checks (*)
      `)
      .eq("id", id)
      .single();

    if (!error && data) {
      const d = data as unknown as AppDetail;
      setApp(d);
      const checkMap: Record<string, boolean> = {};
      for (const c of d.verification_checks || []) {
        checkMap[c.check_type] = c.checked;
      }

      // If no document records in DB, list files directly from Storage
      if (!d.application_documents || d.application_documents.length === 0) {
        const { data: files } = await supabase.storage.from("kyc-documents").list(d.id);
        if (files && files.length > 0) {
          setStorageFiles(files.map((f) => ({ name: f.name, path: `${d.id}/${f.name}` })));
        }
      }
      setChecks(checkMap);
    }
    setLoading(false);
  }

  async function fetchNotes() {
    const supabase = createClient();
    const { data } = await supabase
      .from("notes")
      .select("content, created_at")
      .eq("application_id", id)
      .order("created_at", { ascending: false });
    if (data) setNotes(data);
  }

  async function toggleCheck(checkType: string) {
    const supabase = createClient();
    const newVal = !checks[checkType];
    setChecks((prev) => ({ ...prev, [checkType]: newVal }));
    await supabase.from("verification_checks").upsert(
      { application_id: id, check_type: checkType, checked: newVal, checked_at: new Date().toISOString() },
      { onConflict: "application_id,check_type" }
    );
  }

  async function addNote() {
    if (!noteText.trim()) return;
    const supabase = createClient();
    await supabase.from("notes").insert({ application_id: id, content: noteText, staff_id: null });
    setNoteText("");
    fetchNotes();
  }

  async function updateStatus(newStatus: string) {
    const supabase = createClient();
    await supabase.from("applications").update({ status: newStatus, reviewed_at: new Date().toISOString() }).eq("id", id);
    setApp((prev) => prev ? { ...prev, status: newStatus } : prev);
  }

  function getDocUrl(path: string) {
    const supabase = createClient();
    const { data } = supabase.storage.from("kyc-documents").getPublicUrl(path);
    return data.publicUrl;
  }

  const checkedCount = Object.values(checks).filter(Boolean).length;
  const totalChecks = Object.keys(checkLabels).length;
  const allChecked = checkedCount === totalChecks;
  const status = statusConfig[app?.status || "new"] || statusConfig.new;

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <span className="material-symbols-outlined text-outline text-4xl animate-spin">progress_activity</span>
      </div>
    );
  }

  if (!app) {
    return (
      <div className="flex flex-col items-center justify-center py-32 text-center">
        <span className="material-symbols-outlined text-outline-variant text-5xl mb-4">search_off</span>
        <p className="font-headline font-bold text-lg text-primary">Application not found</p>
        <button onClick={() => router.push("/applications")} className="mt-4 text-sm font-bold text-secondary hover:underline">
          Back to Applications
        </button>
      </div>
    );
  }

  const c = app.customers;

  return (
    <div className="max-w-[1400px] mx-auto">
      {/* Back + Header */}
      <button onClick={() => router.push("/applications")} className="flex items-center gap-2 text-outline hover:text-primary transition-colors mb-6">
        <span className="material-symbols-outlined text-xl">arrow_back</span>
        <span className="text-sm font-medium">Back to Applications</span>
      </button>

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="font-headline font-extrabold text-2xl lg:text-3xl text-primary">
              {app.reference_number}
            </h1>
            <span className={`text-xs font-bold px-3 py-1 rounded-full ${status.bg} ${status.text}`}>
              {status.label}
            </span>
          </div>
          <p className="text-sm text-outline">
            Submitted {new Date(app.submitted_at).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
            {" · "}
            <span className="capitalize">{app.source.replace("_", " ")}</span>
            {" · "}
            <span className="capitalize">{app.account_type} Account</span>
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* ─── Left Column ─── */}
        <div className="lg:col-span-3 space-y-6">
          {/* Personal Details */}
          <Card title="Personal Details" malayalam="വ്യക്തിഗത വിവരങ്ങൾ" icon="person">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4">
              <DetailRow label="Full Name" value={c?.full_name} />
              <DetailRow label="Malayalam Name" value={c?.name_malayalam} />
              <DetailRow label="Date of Birth" value={c?.date_of_birth ? new Date(c.date_of_birth).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) : null} />
              <DetailRow label="Gender" value={c?.gender ? c.gender.charAt(0).toUpperCase() + c.gender.slice(1) : null} />
              <DetailRow label="Father / Spouse" value={c?.father_spouse_name} />
              <DetailRow label="Mobile" value={c?.mobile} />
              <DetailRow label="Email" value={c?.email} />
              <DetailRow label="Occupation" value={c?.occupation ? c.occupation.charAt(0).toUpperCase() + c.occupation.slice(1) : null} />
              <DetailRow label="Annual Income" value={c?.annual_income} />
            </div>
          </Card>

          {/* Address */}
          <Card title="Address" malayalam="വിലാസം" icon="location_on">
            <p className="text-sm font-medium text-primary leading-relaxed">
              {[c?.address_line1, c?.address_line2, c?.city, c?.district].filter(Boolean).join(", ")}
              {c?.state && <><br />{c.state}{c?.pincode ? ` - ${c.pincode}` : ""}</>}
            </p>
            {!c?.address_line1 && <p className="text-sm text-outline">No address provided</p>}
          </Card>

          {/* KYC Documents */}
          <Card title="KYC Documents" malayalam="കെ.വൈ.സി രേഖകൾ" icon="folder_open">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4 mb-5">
              <DetailRow label="Aadhaar Number" value={c?.aadhaar_number} />
              <DetailRow label="PAN Number" value={c?.pan_number} />
            </div>

            {(() => {
              // Use DB records if available, otherwise fall back to storage files
              const docs = app.application_documents.length > 0
                ? app.application_documents.map((doc) => ({
                    key: doc.id,
                    label: doc.doc_type,
                    path: doc.file_path,
                    fileName: doc.file_path.split("/").pop() || doc.doc_type,
                  }))
                : storageFiles.map((f) => ({
                    key: f.path,
                    label: f.name.split(".")[0],
                    path: f.path,
                    fileName: f.name,
                  }));

              if (docs.length === 0) {
                return <p className="text-sm text-outline">No documents uploaded</p>;
              }

              return (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {docs.map((doc) => {
                    const url = getDocUrl(doc.path);
                    const isImage = /\.(jpg|jpeg|png|webp)$/i.test(doc.fileName);
                    return (
                      <a
                        key={doc.key}
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex flex-col rounded-xl bg-surface-container-high hover:bg-surface-container-highest transition-colors overflow-hidden"
                      >
                        {isImage && (
                          <div className="h-32 bg-surface-container-highest flex items-center justify-center overflow-hidden">
                            <img src={url} alt={doc.label} className="w-full h-full object-cover" />
                          </div>
                        )}
                        <div className="flex items-center gap-3 p-4">
                          <span className="material-symbols-outlined text-primary-container text-xl">
                            {doc.label === "photo" ? "photo_camera" : doc.label === "aadhaar" ? "badge" : "credit_card"}
                          </span>
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-bold text-primary capitalize">{doc.label}</p>
                            <p className="text-[11px] text-outline truncate">{doc.fileName}</p>
                          </div>
                          <span className="material-symbols-outlined text-outline text-lg">open_in_new</span>
                        </div>
                      </a>
                    );
                  })}
                </div>
              );
            })()}
          </Card>

          {/* VKYC Status */}
          <Card title="Video KYC" malayalam="വീഡിയോ KYC" icon="videocam">
            <div className="flex items-center gap-3">
              <span className={`text-xs font-bold px-3 py-1.5 rounded-full ${
                app.vkyc_status === "completed" ? "bg-success-container text-success"
                : app.vkyc_status === "scheduled" ? "bg-secondary-container text-on-secondary-container"
                : "bg-surface-container-high text-outline"
              }`}>
                {app.vkyc_status === "completed" ? "Completed" : app.vkyc_status === "scheduled" ? "Scheduled" : "Not Started"}
              </span>
            </div>
          </Card>

          {/* Account Preferences */}
          <Card title="Account Preferences" malayalam="അക്കൗണ്ട് മുൻഗണനകൾ" icon="settings">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4">
              <DetailRow label="Account Type" value={app.account_variant === "zero-balance" ? "Zero Balance" : "Regular Savings"} />
              <DetailRow label="Cheque Book" value={app.cheque_book ? "Yes" : "No"} />
              <DetailRow label="Initial Deposit" value={app.initial_deposit ? `₹ ${Number(app.initial_deposit).toLocaleString("en-IN")}` : "₹ 0"} />
              <DetailRow label="Nominee" value={app.nominee_name ? `${app.nominee_name} (${app.nominee_relationship || "—"})` : null} />
            </div>
          </Card>
        </div>

        {/* ─── Right Column ─── */}
        <div className="lg:col-span-2 space-y-6">
          {/* Verification Checklist */}
          <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-[0_2px_16px_rgba(0,45,86,0.04)]">
            <h3 className="font-headline font-bold text-base text-primary mb-1">Verification Checklist</h3>
            <p className="text-xs text-outline malayalam-text mb-4">പരിശോധനാ പട്ടിക</p>

            {/* Progress bar */}
            <div className="mb-5">
              <div className="flex justify-between text-xs mb-1.5">
                <span className="text-outline">{checkedCount}/{totalChecks} completed</span>
                <span className="font-bold text-primary">{Math.round((checkedCount / totalChecks) * 100)}%</span>
              </div>
              <div className="h-2 bg-surface-container-high rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${allChecked ? "bg-success" : "bg-secondary"}`}
                  style={{ width: `${(checkedCount / totalChecks) * 100}%` }}
                />
              </div>
            </div>

            <div className="space-y-2">
              {Object.entries(checkLabels).map(([key, { label, icon }]) => (
                <button
                  key={key}
                  onClick={() => toggleCheck(key)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-left ${
                    checks[key]
                      ? "bg-success-container/15"
                      : "bg-surface-container-high hover:bg-surface-container-highest"
                  }`}
                >
                  <span className={`material-symbols-outlined text-lg ${checks[key] ? "text-success" : "text-outline"}`}
                    style={checks[key] ? { fontVariationSettings: "'FILL' 1" } : undefined}
                  >
                    {checks[key] ? "check_circle" : "radio_button_unchecked"}
                  </span>
                  <span className={`text-sm font-medium ${checks[key] ? "text-success" : "text-primary"}`}>{label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Internal Notes */}
          <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-[0_2px_16px_rgba(0,45,86,0.04)]">
            <h3 className="font-headline font-bold text-base text-primary mb-1">Internal Notes</h3>
            <p className="text-xs text-outline malayalam-text mb-4">ആന്തരിക കുറിപ്പുകൾ</p>

            <div className="flex gap-2 mb-4">
              <input
                type="text"
                value={noteText}
                onChange={(e) => setNoteText(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") addNote(); }}
                placeholder="Add a note..."
                className="flex-1 bg-surface-container-high rounded-xl py-3 px-4 text-sm outline-none border-2 border-transparent focus:border-secondary/20 placeholder:text-outline/50 transition-all"
              />
              <button
                onClick={addNote}
                disabled={!noteText.trim()}
                className="px-4 rounded-xl bg-primary-container text-on-primary text-sm font-bold hover:bg-primary-container/80 active:scale-95 transition-all disabled:opacity-40"
              >
                Add
              </button>
            </div>

            {notes.length > 0 ? (
              <div className="space-y-3 max-h-60 overflow-y-auto">
                {notes.map((n, i) => (
                  <div key={i} className="p-3 bg-surface-container-low rounded-xl">
                    <p className="text-sm text-primary">{n.content}</p>
                    <p className="text-[10px] text-outline mt-1">
                      {new Date(n.created_at).toLocaleString("en-IN", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-outline text-center py-4">No notes yet</p>
            )}
          </div>

          {/* Actions */}
          <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-[0_2px_16px_rgba(0,45,86,0.04)]">
            <h3 className="font-headline font-bold text-base text-primary mb-4">Actions</h3>

            <div className="space-y-3">
              <button
                onClick={() => updateStatus("approved")}
                disabled={!allChecked || app.status === "approved"}
                className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-success text-white font-bold text-sm hover:bg-success/90 active:scale-[0.98] transition-all disabled:opacity-40 disabled:pointer-events-none"
              >
                <span className="material-symbols-outlined text-lg">check_circle</span>
                Approve & Create Account
              </button>

              <button
                onClick={() => updateStatus("docs_missing")}
                disabled={app.status === "approved"}
                className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-secondary text-on-secondary font-bold text-sm hover:bg-secondary/90 active:scale-[0.98] transition-all disabled:opacity-40"
              >
                <span className="material-symbols-outlined text-lg">info</span>
                Request More Info
              </button>

              <button
                onClick={() => updateStatus("rejected")}
                disabled={app.status === "approved"}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-error font-bold text-sm hover:bg-error-container/20 active:scale-[0.98] transition-all disabled:opacity-40"
              >
                <span className="material-symbols-outlined text-lg">cancel</span>
                Reject Application
              </button>

              {!allChecked && app.status !== "approved" && (
                <p className="text-[11px] text-outline text-center pt-1">
                  Complete all verification checks to enable approval
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Sub-components ─── */

function Card({ title, malayalam, icon, children }: {
  title: string;
  malayalam: string;
  icon: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-[0_2px_16px_rgba(0,45,86,0.04)]">
      <div className="flex items-center gap-3 mb-5">
        <span className="material-symbols-outlined text-primary-container text-xl">{icon}</span>
        <div>
          <h3 className="font-headline font-bold text-base text-primary">{title}</h3>
          <p className="text-[11px] text-outline malayalam-text">{malayalam}</p>
        </div>
      </div>
      {children}
    </div>
  );
}

function DetailRow({ label, value }: { label: string; value: string | null | undefined }) {
  return (
    <div>
      <p className="text-[11px] font-bold text-outline uppercase tracking-widest mb-0.5">{label}</p>
      <p className={`text-sm ${value ? "font-medium text-primary" : "text-outline"}`}>{value || "—"}</p>
    </div>
  );
}
