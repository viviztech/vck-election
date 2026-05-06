"use client";

import { useCallback, useEffect, useState } from "react";

interface Volunteer {
  id: string;
  name: string;
  age: number | null;
  dob: string | null;
  gender: string | null;
  phone: string;
  whatsapp: string | null;
  email: string | null;
  voterId: string | null;
  town: string | null;
  pincode: string | null;
  address: string | null;
  education: string;
  occupation: string | null;
  state: string;
  district: string;
  constituency: string;
  itKnowledge: boolean;
  videoCreation: boolean;
  imageCreation: boolean;
  itSkills: string[];
  softwareTools: string | null;
  yearsExp: number | null;
  primaryDevice: string | null;
  facebook: string | null;
  youtube: string | null;
  instagram: string | null;
  twitterX: string | null;
  followers: string | null;
  availability: string | null;
  languages: string[];
  canTravel: boolean | null;
  vckMember: boolean | null;
  priorExperience: string | null;
  hearAboutUs: string | null;
  joinReason: string;
  emergencyName: string | null;
  emergencyPhone: string | null;
  createdAt: string;
}

interface DbDistrict { id: string; nameTamil: string; nameEnglish: string }
interface DbConstituency { id: string; nameTamil: string; nameEnglish: string; districtId: string }

interface Filters {
  search: string;
  state: string;
  districtName: string;
  constituencyName: string;
  gender: string;
  availability: string;
  itKnowledge: string;
  videoCreation: string;
  imageCreation: string;
  vckMember: string;
  canTravel: boolean | null;
  dateFrom: string;
  dateTo: string;
  occupation: string;
  primaryDevice: string;
  itSkill: string;
  language: string;
  hearAboutUs: string;
  yearsExpMin: string;
  yearsExpMax: string;
}

const INDIAN_STATES = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
  "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka",
  "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram",
  "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu",
  "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal",
  "Andaman and Nicobar Islands", "Chandigarh", "Dadra and Nagar Haveli and Daman and Diu",
  "Delhi", "Jammu and Kashmir", "Ladakh", "Lakshadweep", "Puducherry",
];

const EMPTY_FILTERS: Filters = {
  search: "",
  state: "",
  districtName: "",
  constituencyName: "",
  gender: "",
  availability: "",
  itKnowledge: "",
  videoCreation: "",
  imageCreation: "",
  vckMember: "",
  canTravel: null,
  dateFrom: "",
  dateTo: "",
  occupation: "",
  primaryDevice: "",
  itSkill: "",
  language: "",
  hearAboutUs: "",
  yearsExpMin: "",
  yearsExpMax: "",
};

const PAGE_SIZE = 20;

const IT_SKILLS = [
  "Graphic Design", "Video Editing", "Content Writing", "Web Development",
  "Data Entry", "Social Media Management", "WhatsApp Campaign",
  "Audio Editing", "Photography", "Live Streaming",
];

const LANGUAGE_OPTIONS = ["தமிழ்", "English", "Hindi", "Telugu", "Malayalam", "Kannada"];

const OCCUPATION_OPTIONS = [
  "மாணவர் (Student)",
  "தனியார் பணியாளர் (Private Employee)",
  "அரசு பணியாளர் (Govt Employee)",
  "சுய தொழில் (Self-employed)",
  "வேலையில்லாதவர் (Unemployed)",
  "பிற (Other)",
];

const HEAR_OPTIONS = [
  "சமூக ஊடகம் (Social Media)",
  "கட்சி கூட்டம் (Party Meeting)",
  "நண்பர் / உறவினர் (Friend/Relative)",
  "VCK இணையதளம் (VCK Website)",
  "பிற (Other)",
];

const DEVICE_OPTIONS = [
  { value: "mobile", label: "மொபைல் மட்டும்" },
  { value: "laptop", label: "Laptop / PC" },
  { value: "both", label: "இரண்டும்" },
];

const AVAILABILITY_OPTIONS = [
  { value: "full_time", label: "முழு நேரம்" },
  { value: "part_time", label: "பகுதி நேரம்" },
  { value: "weekends", label: "வார இறுதி" },
  { value: "campaigns", label: "தேர்தல் காலம்" },
];

const availabilityLabel: Record<string, string> = {
  full_time: "முழு நேரம்",
  part_time: "பகுதி நேரம்",
  weekends: "வார இறுதி மட்டும்",
  campaigns: "தேர்தல் காலம் மட்டும்",
};

const BOOL_OPTIONS = [
  { value: "true", label: "ஆம்" },
  { value: "false", label: "இல்லை" },
];

function countActiveFilters(f: Filters): number {
  return Object.entries(f).filter(([, v]) => v !== "" && v !== null).length;
}

function Badge({ yes }: { yes: boolean }) {
  return (
    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${yes ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
      {yes ? "ஆம்" : "இல்லை"}
    </span>
  );
}

function NullBadge({ value }: { value: boolean | null }) {
  if (value === null) return <span className="text-gray-300 text-xs">—</span>;
  return <Badge yes={value} />;
}

function SkeletonRow() {
  return (
    <tr className="animate-pulse">
      {Array.from({ length: 10 }).map((_, i) => (
        <td key={i} className="px-4 py-3"><div className="h-4 bg-gray-200 rounded w-full" /></td>
      ))}
    </tr>
  );
}

function DetailItem({ label, value }: { label: string; value?: string | null | React.ReactNode }) {
  if (!value && value !== false) return null;
  return (
    <div>
      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-0.5">{label}</p>
      <p className="text-sm text-gray-800">{value}</p>
    </div>
  );
}

function FilterLabel({ children }: { children: React.ReactNode }) {
  return <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">{children}</label>;
}

function FilterChip({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-slate-100 text-slate-700 text-xs rounded-full font-medium">
      {label}
      <button type="button" onClick={onRemove} className="hover:text-red-500 transition-colors ml-0.5 font-bold leading-none">×</button>
    </span>
  );
}

export function ItWingVolunteersClient() {
  const [volunteers, setVolunteers] = useState<Volunteer[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [applied, setApplied] = useState<Filters>(EMPTY_FILTERS);
  const [draft, setDraft] = useState<Filters>(EMPTY_FILTERS);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  // District / constituency from DB
  const [districts, setDistricts] = useState<DbDistrict[]>([]);
  const [constituencies, setConstituencies] = useState<DbConstituency[]>([]);
  const [loadingConstituencies, setLoadingConstituencies] = useState(false);

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const activeCount = countActiveFilters(applied);

  // Load districts once
  useEffect(() => {
    fetch("/api/reference/districts")
      .then((r) => r.json())
      .then(setDistricts)
      .catch(() => {});
  }, []);

  // Load constituencies when draft district changes
  useEffect(() => {
    const selected = districts.find((d) => d.nameTamil === draft.districtName || d.nameEnglish === draft.districtName);
    if (!selected) {
      setConstituencies([]);
      setDraft((p) => ({ ...p, constituencyName: "" }));
      return;
    }
    setLoadingConstituencies(true);
    fetch(`/api/reference/constituencies?districtId=${selected.id}`)
      .then((r) => r.json())
      .then((data) => { setConstituencies(data); setLoadingConstituencies(false); })
      .catch(() => setLoadingConstituencies(false));
  }, [draft.districtName, districts]);

  const load = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams({ page: String(page) });
    if (applied.search) params.set("search", applied.search);
    if (applied.state) params.set("state", applied.state);
    if (applied.districtName) params.set("district", applied.districtName);
    if (applied.constituencyName) params.set("constituency", applied.constituencyName);
    if (applied.gender) params.set("gender", applied.gender);
    if (applied.availability) params.set("availability", applied.availability);
    if (applied.itKnowledge) params.set("itKnowledge", applied.itKnowledge);
    if (applied.videoCreation) params.set("videoCreation", applied.videoCreation);
    if (applied.imageCreation) params.set("imageCreation", applied.imageCreation);
    if (applied.vckMember) params.set("vckMember", applied.vckMember);
    if (applied.canTravel !== null) params.set("canTravel", String(applied.canTravel));
    if (applied.dateFrom) params.set("dateFrom", applied.dateFrom);
    if (applied.dateTo) params.set("dateTo", applied.dateTo);
    if (applied.occupation) params.set("occupation", applied.occupation);
    if (applied.primaryDevice) params.set("primaryDevice", applied.primaryDevice);
    if (applied.itSkill) params.set("itSkill", applied.itSkill);
    if (applied.language) params.set("language", applied.language);
    if (applied.hearAboutUs) params.set("hearAboutUs", applied.hearAboutUs);
    if (applied.yearsExpMin) params.set("yearsExpMin", applied.yearsExpMin);
    if (applied.yearsExpMax) params.set("yearsExpMax", applied.yearsExpMax);

    const res = await fetch(`/api/admin/it-wing-volunteers?${params}`);
    if (res.ok) {
      const data = await res.json();
      setVolunteers(data.volunteers);
      setTotal(data.total);
    }
    setLoading(false);
  }, [page, applied]);

  useEffect(() => { load(); }, [load]);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    setPage(1);
    setApplied(draft);
  }

  function handleReset() {
    setDraft(EMPTY_FILTERS);
    setApplied(EMPTY_FILTERS);
    setPage(1);
    setConstituencies([]);
  }

  function handleExport() {
    const params = new URLSearchParams({ format: "csv" });
    if (applied.search) params.set("search", applied.search);
    if (applied.state) params.set("state", applied.state);
    if (applied.districtName) params.set("district", applied.districtName);
    if (applied.constituencyName) params.set("constituency", applied.constituencyName);
    if (applied.gender) params.set("gender", applied.gender);
    if (applied.availability) params.set("availability", applied.availability);
    if (applied.itKnowledge) params.set("itKnowledge", applied.itKnowledge);
    if (applied.videoCreation) params.set("videoCreation", applied.videoCreation);
    if (applied.imageCreation) params.set("imageCreation", applied.imageCreation);
    if (applied.vckMember) params.set("vckMember", applied.vckMember);
    if (applied.canTravel !== null) params.set("canTravel", String(applied.canTravel));
    if (applied.dateFrom) params.set("dateFrom", applied.dateFrom);
    if (applied.dateTo) params.set("dateTo", applied.dateTo);
    if (applied.occupation) params.set("occupation", applied.occupation);
    if (applied.primaryDevice) params.set("primaryDevice", applied.primaryDevice);
    if (applied.itSkill) params.set("itSkill", applied.itSkill);
    if (applied.language) params.set("language", applied.language);
    if (applied.hearAboutUs) params.set("hearAboutUs", applied.hearAboutUs);
    if (applied.yearsExpMin) params.set("yearsExpMin", applied.yearsExpMin);
    if (applied.yearsExpMax) params.set("yearsExpMax", applied.yearsExpMax);
    window.location.href = `/api/admin/it-wing-volunteers?${params}`;
  }

  function setF<K extends keyof Filters>(key: K, value: Filters[K]) {
    setDraft((p) => ({ ...p, [key]: value }));
  }

  // Active filter chip removal helper
  function removeApplied<K extends keyof Filters>(key: K, emptyVal: Filters[K]) {
    setF(key, emptyVal);
    setApplied((p) => ({ ...p, [key]: emptyVal }));
  }

  return (
    <div className="space-y-4">
      <form onSubmit={handleSearch}>
        {/* Top toolbar */}
        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
          <div className="flex gap-2 flex-wrap items-center">
            <input
              type="text"
              value={draft.search}
              onChange={(e) => setF("search", e.target.value)}
              placeholder="பெயர், தொலைபேசி, மின்னஞ்சல்..."
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-400 w-64"
            />
            <button
              type="button"
              onClick={() => setShowFilters((v) => !v)}
              className={`px-4 py-2 border rounded-lg text-sm font-medium transition flex items-center gap-2 ${
                showFilters || activeCount > 0
                  ? "border-slate-600 bg-slate-800 text-white"
                  : "border-gray-300 text-gray-700 hover:bg-gray-50"
              }`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707L13 13.414V19a1 1 0 01-.553.894l-4 2A1 1 0 017 21v-7.586L3.293 6.707A1 1 0 013 6V4z" />
              </svg>
              வடிப்பான்கள்
              {activeCount > 0 && (
                <span className="bg-white text-slate-800 text-xs font-bold px-1.5 py-0.5 rounded-full leading-none">{activeCount}</span>
              )}
            </button>
            <button type="submit" className="px-4 py-2 bg-slate-800 text-white rounded-lg text-sm font-medium hover:bg-slate-700 transition">
              தேடு
            </button>
            {activeCount > 0 && (
              <button type="button" onClick={handleReset} className="px-3 py-2 border border-red-200 text-red-600 rounded-lg text-sm hover:bg-red-50 transition">
                அழி
              </button>
            )}
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <span className="text-sm text-gray-500">மொத்தம்: <strong>{total}</strong></span>
            <button type="button" onClick={handleExport} className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition flex items-center gap-2">
              ⬇ CSV
            </button>
          </div>
        </div>

        {/* Advanced filter panel */}
        {showFilters && (
          <div className="mt-3 p-4 bg-gray-50 border border-gray-200 rounded-xl space-y-4">
            <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">மேம்பட்ட வடிப்பு</p>

            {/* Row 1: Location */}
            <div>
              <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest mb-2">இடம்</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                {/* State */}
                <div className="flex flex-col gap-1">
                  <FilterLabel>மாநிலம்</FilterLabel>
                  <select
                    value={draft.state}
                    onChange={(e) => {
                      const isTN = e.target.value === "Tamil Nadu" || e.target.value === "";
                      setDraft((p) => ({
                        ...p,
                        state: e.target.value,
                        districtName: isTN ? p.districtName : "",
                        constituencyName: isTN ? p.constituencyName : "",
                      }));
                      if (!isTN) setConstituencies([]);
                    }}
                    className="px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-slate-400"
                  >
                    <option value="">அனைத்தும்</option>
                    {INDIAN_STATES.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>

                {/* District */}
                <div className="flex flex-col gap-1">
                  <FilterLabel>மாவட்டம்</FilterLabel>
                  <select
                    value={draft.districtName}
                    onChange={(e) => {
                      const d = districts.find(d => d.nameTamil === e.target.value || d.nameEnglish === e.target.value);
                      setDraft((p) => ({ ...p, districtName: e.target.value, constituencyName: "" }));
                      if (!d) setConstituencies([]);
                    }}
                    disabled={!!draft.state && draft.state !== "Tamil Nadu"}
                    className="px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-slate-400 disabled:opacity-50"
                  >
                    <option value="">அனைத்தும்</option>
                    {districts.map((d) => (
                      <option key={d.id} value={d.nameTamil}>{d.nameTamil}</option>
                    ))}
                  </select>
                </div>

                {/* Constituency (AC) */}
                <div className="flex flex-col gap-1">
                  <FilterLabel>சட்டமன்றத் தொகுதி (AC)</FilterLabel>
                  <select
                    value={draft.constituencyName}
                    onChange={(e) => setF("constituencyName", e.target.value)}
                    disabled={!draft.districtName || loadingConstituencies}
                    className="px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-slate-400 disabled:opacity-50"
                  >
                    <option value="">{loadingConstituencies ? "ஏற்றுகிறது..." : "அனைத்தும்"}</option>
                    {constituencies.map((c) => (
                      <option key={c.id} value={c.nameTamil}>{c.nameTamil}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Row 2: Personal */}
            <div>
              <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest mb-2">தனிப்பட்ட விவரங்கள்</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
                {/* Gender */}
                <div className="flex flex-col gap-1">
                  <FilterLabel>பாலினம்</FilterLabel>
                  <select value={draft.gender} onChange={(e) => setF("gender", e.target.value)} className="px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-slate-400">
                    <option value="">அனைத்தும்</option>
                    <option value="MALE">ஆண்</option>
                    <option value="FEMALE">பெண்</option>
                    <option value="OTHER">பிற</option>
                  </select>
                </div>

                {/* Occupation */}
                <div className="flex flex-col gap-1">
                  <FilterLabel>தொழில்</FilterLabel>
                  <select value={draft.occupation} onChange={(e) => setF("occupation", e.target.value)} className="px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-slate-400">
                    <option value="">அனைத்தும்</option>
                    {OCCUPATION_OPTIONS.map((o) => <option key={o} value={o}>{o}</option>)}
                  </select>
                </div>

                {/* VCK Member */}
                <div className="flex flex-col gap-1">
                  <FilterLabel>VCK உறுப்பினர்</FilterLabel>
                  <select value={draft.vckMember ?? ""} onChange={(e) => setF("vckMember", e.target.value)} className="px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-slate-400">
                    <option value="">அனைத்தும்</option>
                    {BOOL_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                  </select>
                </div>

                {/* Can Travel */}
                <div className="flex flex-col gap-1">
                  <FilterLabel>பயணிக்க முடியுமா?</FilterLabel>
                  <select
                    value={draft.canTravel === null ? "" : String(draft.canTravel)}
                    onChange={(e) => setF("canTravel", e.target.value === "" ? null : e.target.value === "true")}
                    className="px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-slate-400"
                  >
                    <option value="">அனைத்தும்</option>
                    {BOOL_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                  </select>
                </div>

                {/* Language */}
                <div className="flex flex-col gap-1">
                  <FilterLabel>மொழி</FilterLabel>
                  <select value={draft.language} onChange={(e) => setF("language", e.target.value)} className="px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-slate-400">
                    <option value="">அனைத்தும்</option>
                    {LANGUAGE_OPTIONS.map((l) => <option key={l} value={l}>{l}</option>)}
                  </select>
                </div>
              </div>
            </div>

            {/* Row 3: IT Skills */}
            <div>
              <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest mb-2">IT திறன்கள் & கிடைக்கும் தன்மை</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
                {/* IT Knowledge */}
                <div className="flex flex-col gap-1">
                  <FilterLabel>IT அறிவு</FilterLabel>
                  <select value={draft.itKnowledge} onChange={(e) => setF("itKnowledge", e.target.value)} className="px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-slate-400">
                    <option value="">அனைத்தும்</option>
                    {BOOL_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                  </select>
                </div>

                {/* Video Creation */}
                <div className="flex flex-col gap-1">
                  <FilterLabel>வீடியோ உருவாக்கம்</FilterLabel>
                  <select value={draft.videoCreation} onChange={(e) => setF("videoCreation", e.target.value)} className="px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-slate-400">
                    <option value="">அனைத்தும்</option>
                    {BOOL_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                  </select>
                </div>

                {/* Image Creation */}
                <div className="flex flex-col gap-1">
                  <FilterLabel>படம் உருவாக்கம்</FilterLabel>
                  <select value={draft.imageCreation} onChange={(e) => setF("imageCreation", e.target.value)} className="px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-slate-400">
                    <option value="">அனைத்தும்</option>
                    {BOOL_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                  </select>
                </div>

                {/* IT Skill */}
                <div className="flex flex-col gap-1">
                  <FilterLabel>IT திறன் (குறிப்பிட்ட)</FilterLabel>
                  <select value={draft.itSkill} onChange={(e) => setF("itSkill", e.target.value)} className="px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-slate-400">
                    <option value="">அனைத்தும்</option>
                    {IT_SKILLS.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>

                {/* Primary Device */}
                <div className="flex flex-col gap-1">
                  <FilterLabel>முதன்மை சாதனம்</FilterLabel>
                  <select value={draft.primaryDevice} onChange={(e) => setF("primaryDevice", e.target.value)} className="px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-slate-400">
                    <option value="">அனைத்தும்</option>
                    {DEVICE_OPTIONS.map((d) => <option key={d.value} value={d.value}>{d.label}</option>)}
                  </select>
                </div>

                {/* Availability */}
                <div className="flex flex-col gap-1">
                  <FilterLabel>கிடைக்கும் நேரம்</FilterLabel>
                  <select value={draft.availability} onChange={(e) => setF("availability", e.target.value)} className="px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-slate-400">
                    <option value="">அனைத்தும்</option>
                    {AVAILABILITY_OPTIONS.map((a) => <option key={a.value} value={a.value}>{a.label}</option>)}
                  </select>
                </div>

                {/* Years Exp Min */}
                <div className="flex flex-col gap-1">
                  <FilterLabel>அனுபவம் (குறைந்தபட்சம் ஆண்டுகள்)</FilterLabel>
                  <input
                    type="number" min="0" max="50"
                    value={draft.yearsExpMin}
                    onChange={(e) => setF("yearsExpMin", e.target.value)}
                    placeholder="எ.கா: 2"
                    className="px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-slate-400"
                  />
                </div>

                {/* Years Exp Max */}
                <div className="flex flex-col gap-1">
                  <FilterLabel>அனுபவம் (அதிகபட்சம் ஆண்டுகள்)</FilterLabel>
                  <input
                    type="number" min="0" max="50"
                    value={draft.yearsExpMax}
                    onChange={(e) => setF("yearsExpMax", e.target.value)}
                    placeholder="எ.கா: 10"
                    className="px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-slate-400"
                  />
                </div>
              </div>
            </div>

            {/* Row 4: Registration date & Source */}
            <div>
              <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest mb-2">பதிவு & மூலம்</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                <div className="flex flex-col gap-1">
                  <FilterLabel>பதிவு தேதி (இருந்து)</FilterLabel>
                  <input type="date" value={draft.dateFrom} onChange={(e) => setF("dateFrom", e.target.value)} className="px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-slate-400" />
                </div>
                <div className="flex flex-col gap-1">
                  <FilterLabel>பதிவு தேதி (வரை)</FilterLabel>
                  <input type="date" value={draft.dateTo} onChange={(e) => setF("dateTo", e.target.value)} className="px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-slate-400" />
                </div>
                <div className="flex flex-col gap-1">
                  <FilterLabel>எப்படி அறிந்தீர்கள்</FilterLabel>
                  <select value={draft.hearAboutUs} onChange={(e) => setF("hearAboutUs", e.target.value)} className="px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-slate-400">
                    <option value="">அனைத்தும்</option>
                    {HEAR_OPTIONS.map((h) => <option key={h} value={h}>{h}</option>)}
                  </select>
                </div>
              </div>
            </div>

            {/* Active chips */}
            {activeCount > 0 && (
              <div className="flex flex-wrap gap-2 pt-3 border-t border-gray-200">
                {applied.search && <FilterChip label={`தேடல்: "${applied.search}"`} onRemove={() => removeApplied("search", "")} />}
                {applied.state && <FilterChip label={`மாநிலம்: ${applied.state}`} onRemove={() => { removeApplied("state", ""); removeApplied("districtName", ""); removeApplied("constituencyName", ""); setConstituencies([]); }} />}
                {applied.districtName && <FilterChip label={`மாவட்டம்: ${applied.districtName}`} onRemove={() => { removeApplied("districtName", ""); removeApplied("constituencyName", ""); setConstituencies([]); }} />}
                {applied.constituencyName && <FilterChip label={`தொகுதி: ${applied.constituencyName}`} onRemove={() => removeApplied("constituencyName", "")} />}
                {applied.gender && <FilterChip label={`பாலினம்: ${applied.gender === "MALE" ? "ஆண்" : applied.gender === "FEMALE" ? "பெண்" : "பிற"}`} onRemove={() => removeApplied("gender", "")} />}
                {applied.occupation && <FilterChip label={`தொழில்: ${applied.occupation}`} onRemove={() => removeApplied("occupation", "")} />}
                {applied.vckMember && <FilterChip label={`VCK: ${applied.vckMember === "true" ? "ஆம்" : "இல்லை"}`} onRemove={() => removeApplied("vckMember", "")} />}
                {applied.canTravel !== null && <FilterChip label={`பயணம்: ${applied.canTravel ? "ஆம்" : "இல்லை"}`} onRemove={() => removeApplied("canTravel", null)} />}
                {applied.language && <FilterChip label={`மொழி: ${applied.language}`} onRemove={() => removeApplied("language", "")} />}
                {applied.itKnowledge && <FilterChip label={`IT அறிவு: ${applied.itKnowledge === "true" ? "ஆம்" : "இல்லை"}`} onRemove={() => removeApplied("itKnowledge", "")} />}
                {applied.videoCreation && <FilterChip label={`வீடியோ: ${applied.videoCreation === "true" ? "ஆம்" : "இல்லை"}`} onRemove={() => removeApplied("videoCreation", "")} />}
                {applied.imageCreation && <FilterChip label={`படம்: ${applied.imageCreation === "true" ? "ஆம்" : "இல்லை"}`} onRemove={() => removeApplied("imageCreation", "")} />}
                {applied.itSkill && <FilterChip label={`திறன்: ${applied.itSkill}`} onRemove={() => removeApplied("itSkill", "")} />}
                {applied.primaryDevice && <FilterChip label={`சாதனம்: ${DEVICE_OPTIONS.find(d => d.value === applied.primaryDevice)?.label ?? applied.primaryDevice}`} onRemove={() => removeApplied("primaryDevice", "")} />}
                {applied.availability && <FilterChip label={`நேரம்: ${availabilityLabel[applied.availability] ?? applied.availability}`} onRemove={() => removeApplied("availability", "")} />}
                {applied.yearsExpMin && <FilterChip label={`அனுபவம் ≥ ${applied.yearsExpMin} ஆண்டுகள்`} onRemove={() => removeApplied("yearsExpMin", "")} />}
                {applied.yearsExpMax && <FilterChip label={`அனுபவம் ≤ ${applied.yearsExpMax} ஆண்டுகள்`} onRemove={() => removeApplied("yearsExpMax", "")} />}
                {applied.dateFrom && <FilterChip label={`இருந்து: ${applied.dateFrom}`} onRemove={() => removeApplied("dateFrom", "")} />}
                {applied.dateTo && <FilterChip label={`வரை: ${applied.dateTo}`} onRemove={() => removeApplied("dateTo", "")} />}
                {applied.hearAboutUs && <FilterChip label={`மூலம்: ${applied.hearAboutUs}`} onRemove={() => removeApplied("hearAboutUs", "")} />}
              </div>
            )}
          </div>
        )}
      </form>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 text-left">
                <th className="px-4 py-3 font-semibold text-gray-600">#</th>
                <th className="px-4 py-3 font-semibold text-gray-600">பெயர்</th>
                <th className="px-4 py-3 font-semibold text-gray-600">தொலைபேசி</th>
                <th className="px-4 py-3 font-semibold text-gray-600">மாநிலம்</th>
                <th className="px-4 py-3 font-semibold text-gray-600">மாவட்டம்</th>
                <th className="px-4 py-3 font-semibold text-gray-600">தொகுதி</th>
                <th className="px-4 py-3 font-semibold text-gray-600">IT</th>
                <th className="px-4 py-3 font-semibold text-gray-600">Video</th>
                <th className="px-4 py-3 font-semibold text-gray-600">Image</th>
                <th className="px-4 py-3 font-semibold text-gray-600">தேதி</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                Array.from({ length: 8 }).map((_, i) => <SkeletonRow key={i} />)
              ) : volunteers.length === 0 ? (
                <tr>
                  <td colSpan={10} className="px-4 py-12 text-center text-gray-400">தன்னார்வலர்கள் இல்லை</td>
                </tr>
              ) : (
                volunteers.map((v, idx) => (
                  <>
                    <tr
                      key={v.id}
                      className="hover:bg-gray-50 cursor-pointer transition-colors"
                      onClick={() => setExpanded(expanded === v.id ? null : v.id)}
                    >
                      <td className="px-4 py-3 text-gray-400">{(page - 1) * PAGE_SIZE + idx + 1}</td>
                      <td className="px-4 py-3 font-medium text-gray-900">
                        <div>{v.name}</div>
                        <div className="text-xs text-gray-400 space-x-1">
                          {v.gender && <span>{v.gender === "MALE" ? "ஆண்" : v.gender === "FEMALE" ? "பெண்" : "பிற"}</span>}
                          {v.age && <span>• வயது {v.age}</span>}
                          {v.town && <span>• {v.town}</span>}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-gray-700">
                        <div>{v.phone}</div>
                        {v.whatsapp && <div className="text-xs text-gray-400">WA: {v.whatsapp}</div>}
                      </td>
                      <td className="px-4 py-3 text-gray-700 text-xs">{v.state === "Tamil Nadu" ? "TN" : v.state}</td>
                      <td className="px-4 py-3 text-gray-700">{v.district}</td>
                      <td className="px-4 py-3 text-gray-700">{v.constituency}</td>
                      <td className="px-4 py-3"><Badge yes={v.itKnowledge} /></td>
                      <td className="px-4 py-3"><Badge yes={v.videoCreation} /></td>
                      <td className="px-4 py-3"><Badge yes={v.imageCreation} /></td>
                      <td className="px-4 py-3 text-gray-400 text-xs whitespace-nowrap">
                        {new Date(v.createdAt).toLocaleDateString("ta-IN")}
                      </td>
                    </tr>

                    {expanded === v.id && (
                      <tr key={`${v.id}-detail`} className="bg-blue-50">
                        <td colSpan={10} className="px-6 py-5">
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            <DetailItem label="மின்னஞ்சல்" value={v.email} />
                            <DetailItem label="வாட்ஸ்அப்" value={v.whatsapp} />
                            <DetailItem label="வாக்காளர் அடையாள எண்" value={v.voterId} />
                            <DetailItem label="மாநிலம்" value={v.state} />
                            <DetailItem label="ஊர்" value={v.town} />
                            <DetailItem label="பின்கோடு" value={v.pincode} />
                            <DetailItem label="முகவரி" value={v.address} />
                            <DetailItem label="கல்வித்தகுதி" value={v.education} />
                            <DetailItem label="தொழில்" value={v.occupation} />
                            <DetailItem label="பிறந்த தேதி" value={v.dob} />
                            {v.itSkills.length > 0 && (
                              <div className="sm:col-span-2">
                                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">IT திறன்கள்</p>
                                <div className="flex flex-wrap gap-1">
                                  {v.itSkills.map((s) => (
                                    <span key={s} className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">{s}</span>
                                  ))}
                                </div>
                              </div>
                            )}
                            <DetailItem label="மென்பொருள் கருவிகள்" value={v.softwareTools} />
                            <DetailItem label="IT அனுபவம்" value={v.yearsExp !== null ? `${v.yearsExp} ஆண்டுகள்` : null} />
                            <DetailItem label="முதன்மை சாதனம்" value={v.primaryDevice} />
                            <DetailItem label="Facebook" value={v.facebook} />
                            <DetailItem label="YouTube" value={v.youtube} />
                            <DetailItem label="Instagram" value={v.instagram} />
                            <DetailItem label="Twitter / X" value={v.twitterX} />
                            <DetailItem label="பின்தொடர்பவர்கள்" value={v.followers} />
                            <DetailItem label="கிடைக்கும் நேரம்" value={v.availability ? (availabilityLabel[v.availability] ?? v.availability) : null} />
                            {v.languages.length > 0 && (
                              <div>
                                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">மொழிகள்</p>
                                <p className="text-sm text-gray-800">{v.languages.join(", ")}</p>
                              </div>
                            )}
                            <div>
                              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">பயணிக்க முடியுமா?</p>
                              <NullBadge value={v.canTravel} />
                            </div>
                            <div>
                              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">VCK உறுப்பினரா?</p>
                              <NullBadge value={v.vckMember} />
                            </div>
                            <DetailItem label="எப்படி அறிந்தீர்கள்" value={v.hearAboutUs} />
                            {v.priorExperience && (
                              <div className="sm:col-span-2 lg:col-span-3">
                                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">முன்னர் தன்னார்வ அனுபவம்</p>
                                <p className="text-sm text-gray-800 whitespace-pre-wrap">{v.priorExperience}</p>
                              </div>
                            )}
                            <div className="sm:col-span-2 lg:col-span-3">
                              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">இணைய காரணம்</p>
                              <p className="text-sm text-gray-800 whitespace-pre-wrap">{v.joinReason}</p>
                            </div>
                            {(v.emergencyName || v.emergencyPhone) && (
                              <div className="sm:col-span-2 lg:col-span-3">
                                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">அவசர தொடர்பு</p>
                                <p className="text-sm text-gray-800">{[v.emergencyName, v.emergencyPhone].filter(Boolean).join(" — ")}</p>
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                    )}
                  </>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <button disabled={page <= 1} onClick={() => setPage((p) => p - 1)} className="px-4 py-2 border border-gray-300 rounded-lg text-sm disabled:opacity-40 hover:bg-gray-50">
            ← முந்தைய
          </button>
          <span className="text-sm text-gray-500">{page} / {totalPages}</span>
          <button disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)} className="px-4 py-2 border border-gray-300 rounded-lg text-sm disabled:opacity-40 hover:bg-gray-50">
            அடுத்த →
          </button>
        </div>
      )}
    </div>
  );
}
