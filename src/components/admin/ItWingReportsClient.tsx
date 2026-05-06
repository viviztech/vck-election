"use client";

import { useEffect, useState } from "react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
  PieChart, Pie, Cell, Legend,
} from "recharts";

interface ReportData {
  total: number;
  byDistrict: { district: string; count: number }[];
  byConstituency: { constituency: string; district: string; count: number }[];
  byGender: { gender: string; count: number }[];
  byAvailability: { availability: string; count: number }[];
  byDevice: { device: string; count: number }[];
  byVckMember: { vckMember: boolean | null; count: number }[];
  byCanTravel: { canTravel: boolean | null; count: number }[];
  itKnowledgeCount: number;
  videoCreationCount: number;
  imageCreationCount: number;
  byOccupation: { occupation: string; count: number }[];
  byHearAboutUs: { source: string; count: number }[];
  byState: { state: string; count: number }[];
  bySkill: { skill: string; count: number }[];
  byLanguage: { language: string; count: number }[];
  byMonth: { month: string; count: number }[];
}

const AVAILABILITY_LABELS: Record<string, string> = {
  full_time: "முழு நேரம்",
  part_time: "பகுதி நேரம்",
  weekends: "வார இறுதி",
  campaigns: "தேர்தல் காலம்",
  "Not specified": "குறிப்பிடவில்லை",
};

const DEVICE_LABELS: Record<string, string> = {
  mobile: "மொபைல் மட்டும்",
  laptop: "Laptop / PC",
  both: "இரண்டும்",
  "Not specified": "குறிப்பிடவில்லை",
};

const GENDER_LABELS: Record<string, string> = {
  MALE: "ஆண்",
  FEMALE: "பெண்",
  OTHER: "பிற",
  Unknown: "தெரியவில்லை",
};

const PIE_COLORS = ["#1e3a5f", "#2d6a9f", "#3b9edd", "#7cc4f0", "#b3ddf8", "#dceffe"];
const BAR_COLOR = "#1e3a5f";
const BAR_COLOR_2 = "#2d6a9f";

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-base font-bold text-gray-800 border-b border-gray-200 pb-2 mb-4">{children}</h2>
  );
}

function StatCard({ label, value, sub }: { label: string; value: number | string; sub?: string }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 flex flex-col gap-1">
      <p className="text-2xl font-bold text-slate-800">{typeof value === "number" ? value.toLocaleString() : value}</p>
      <p className="text-sm font-medium text-gray-600">{label}</p>
      {sub && <p className="text-xs text-gray-400">{sub}</p>}
    </div>
  );
}

function SkeletonBlock({ h = "h-64" }: { h?: string }) {
  return <div className={`${h} bg-gray-100 rounded-xl animate-pulse`} />;
}

function RankTable({ rows, keyLabel, valueLabel, districtCol = false }: {
  rows: { key: string; value: number; sub?: string }[];
  keyLabel: string;
  valueLabel: string;
  districtCol?: boolean;
}) {
  const [showAll, setShowAll] = useState(false);
  const visible = showAll ? rows : rows.slice(0, 15);
  return (
    <div>
      <div className="overflow-x-auto rounded-xl border border-gray-200">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200 text-left">
              <th className="px-4 py-2.5 font-semibold text-gray-600 w-10">#</th>
              <th className="px-4 py-2.5 font-semibold text-gray-600">{keyLabel}</th>
              {districtCol && <th className="px-4 py-2.5 font-semibold text-gray-600">மாவட்டம்</th>}
              <th className="px-4 py-2.5 font-semibold text-gray-600 text-right">{valueLabel}</th>
              <th className="px-4 py-2.5 font-semibold text-gray-600 text-right w-24">%</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {visible.map((row, i) => {
              const total = rows.reduce((s, r) => s + r.value, 0);
              const pct = total > 0 ? ((row.value / total) * 100).toFixed(1) : "0.0";
              return (
                <tr key={row.key} className="hover:bg-gray-50">
                  <td className="px-4 py-2.5 text-gray-400 text-xs">{i + 1}</td>
                  <td className="px-4 py-2.5 text-gray-800 font-medium">
                    {row.key}
                    {row.sub && <span className="ml-1.5 text-xs text-gray-400">{row.sub}</span>}
                  </td>
                  {districtCol && <td className="px-4 py-2.5 text-gray-500 text-xs">{row.sub}</td>}
                  <td className="px-4 py-2.5 text-right font-semibold text-slate-700">{row.value.toLocaleString()}</td>
                  <td className="px-4 py-2.5 text-right text-gray-400 text-xs">{pct}%</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {rows.length > 15 && (
        <button
          onClick={() => setShowAll((v) => !v)}
          className="mt-2 text-xs text-slate-600 hover:underline"
        >
          {showAll ? "குறைவாக காட்டு ▲" : `மேலும் ${rows.length - 15} காட்டு ▼`}
        </button>
      )}
    </div>
  );
}

function SmallPie({ data, labelFn }: { data: { name: string; value: number }[]; labelFn?: (k: string) => string }) {
  const labeled = data.map((d) => ({ ...d, name: labelFn ? (labelFn(d.name) ?? d.name) : d.name }));
  return (
    <ResponsiveContainer width="100%" height={220}>
      <PieChart>
        <Pie data={labeled} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label={false} labelLine={false} fontSize={11}>
          {labeled.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
        </Pie>
        <Tooltip />
        <Legend iconSize={10} wrapperStyle={{ fontSize: 11 }} />
      </PieChart>
    </ResponsiveContainer>
  );
}

export function ItWingReportsClient() {
  const [data, setData] = useState<ReportData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"overview" | "location" | "skills" | "demographics">("overview");

  useEffect(() => {
    fetch("/api/admin/it-wing-volunteers/reports")
      .then((r) => r.json())
      .then(setData)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => <SkeletonBlock key={i} h="h-20" />)}
        </div>
        <SkeletonBlock h="h-64" />
        <SkeletonBlock h="h-64" />
      </div>
    );
  }

  if (!data) return <p className="text-gray-400 text-sm">தரவு ஏற்றுவதில் பிழை.</p>;

  const tabs = [
    { id: "overview", label: "📊 கண்ணோட்டம்" },
    { id: "location", label: "📍 இடம்" },
    { id: "skills", label: "💻 IT திறன்கள்" },
    { id: "demographics", label: "👥 புள்ளிவிவரம்" },
  ] as const;

  const itPct = data.total > 0 ? ((data.itKnowledgeCount / data.total) * 100).toFixed(1) : "0";
  const videoPct = data.total > 0 ? ((data.videoCreationCount / data.total) * 100).toFixed(1) : "0";
  const imagePct = data.total > 0 ? ((data.imageCreationCount / data.total) * 100).toFixed(1) : "0";

  const vckYes = data.byVckMember.find((r) => r.vckMember === true)?.count ?? 0;
  const travelYes = data.byCanTravel.find((r) => r.canTravel === true)?.count ?? 0;

  const genderPieData = data.byGender.map((r) => ({ name: r.gender, value: r.count }));
  const availPieData = data.byAvailability.map((r) => ({ name: r.availability, value: r.count }));
  const devicePieData = data.byDevice.map((r) => ({ name: r.device, value: r.count }));

  return (
    <div className="space-y-5">
      {/* Tabs */}
      <div className="flex gap-1 flex-wrap bg-gray-100 p-1 rounded-xl w-fit">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
              activeTab === t.id ? "bg-white text-slate-900 shadow-sm" : "text-gray-500 hover:text-gray-700"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* OVERVIEW TAB */}
      {activeTab === "overview" && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard label="மொத்த தன்னார்வலர்கள்" value={data.total} />
            <StatCard label="IT அறிவு உள்ளவர்கள்" value={data.itKnowledgeCount} sub={`${itPct}%`} />
            <StatCard label="வீடியோ உருவாக்குபவர்கள்" value={data.videoCreationCount} sub={`${videoPct}%`} />
            <StatCard label="படம் உருவாக்குபவர்கள்" value={data.imageCreationCount} sub={`${imagePct}%`} />
            <StatCard label="VCK உறுப்பினர்கள்" value={vckYes} sub={data.total > 0 ? `${((vckYes / data.total) * 100).toFixed(1)}%` : ""} />
            <StatCard label="பயணிக்க தயார்" value={travelYes} sub={data.total > 0 ? `${((travelYes / data.total) * 100).toFixed(1)}%` : ""} />
            <StatCard label="மாவட்டங்கள் பிரதிநிதித்துவம்" value={data.byDistrict.length} />
            <StatCard label="தொகுதிகள் பிரதிநிதித்துவம்" value={data.byConstituency.length} />
          </div>

          {/* Registration trend */}
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <SectionTitle>மாதாந்திர பதிவு போக்கு (கடந்த 12 மாதங்கள்)</SectionTitle>
            {data.byMonth.length === 0 ? (
              <p className="text-gray-400 text-sm text-center py-8">தரவு இல்லை</p>
            ) : (
              <ResponsiveContainer width="100%" height={240}>
                <BarChart data={data.byMonth} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#6b7280" }} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: "#6b7280" }} tickLine={false} axisLine={false} />
                  <Tooltip contentStyle={{ borderRadius: "8px", border: "1px solid #e5e7eb", fontSize: "12px" }} />
                  <Bar dataKey="count" fill={BAR_COLOR} radius={[4, 4, 0, 0]} name="பதிவுகள்" />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>

          {/* Top districts quick view */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <SectionTitle>மாவட்டம் வாரியாக (Top 10)</SectionTitle>
              <ResponsiveContainer width="100%" height={260}>
                <BarChart
                  data={data.byDistrict.slice(0, 10).map((r) => ({ name: r.district, count: r.count }))}
                  layout="vertical"
                  margin={{ top: 0, right: 20, left: 10, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" horizontal={false} />
                  <XAxis type="number" tick={{ fontSize: 10, fill: "#6b7280" }} tickLine={false} axisLine={false} />
                  <YAxis type="category" dataKey="name" tick={{ fontSize: 11, fill: "#374151" }} tickLine={false} width={100} />
                  <Tooltip contentStyle={{ borderRadius: "8px", border: "1px solid #e5e7eb", fontSize: "12px" }} />
                  <Bar dataKey="count" fill={BAR_COLOR} radius={[0, 4, 4, 0]} name="தன்னார்வலர்கள்" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <SectionTitle>பாலினம் & கிடைக்கும் நேரம்</SectionTitle>
              <div className="space-y-4">
                <SmallPie data={genderPieData} labelFn={(k) => GENDER_LABELS[k] ?? k} />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* LOCATION TAB */}
      {activeTab === "location" && (
        <div className="space-y-6">
          {/* State */}
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <SectionTitle>மாநிலம் வாரியான எண்ணிக்கை</SectionTitle>
            <RankTable
              rows={data.byState.map((r) => ({ key: r.state, value: r.count }))}
              keyLabel="மாநிலம்"
              valueLabel="தன்னார்வலர்கள்"
            />
          </div>

          {/* District */}
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <SectionTitle>மாவட்டம் வாரியான விண்ணப்ப எண்ணிக்கை</SectionTitle>
            <div className="mb-5">
              <ResponsiveContainer width="100%" height={280}>
                <BarChart
                  data={data.byDistrict.slice(0, 15).map((r) => ({ name: r.district, count: r.count }))}
                  margin={{ top: 5, right: 10, left: -10, bottom: 60 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="name" tick={{ fontSize: 10, fill: "#6b7280", angle: -40, textAnchor: "end" }} tickLine={false} interval={0} />
                  <YAxis tick={{ fontSize: 11, fill: "#6b7280" }} tickLine={false} axisLine={false} />
                  <Tooltip contentStyle={{ borderRadius: "8px", border: "1px solid #e5e7eb", fontSize: "12px" }} />
                  <Bar dataKey="count" fill={BAR_COLOR} radius={[4, 4, 0, 0]} name="தன்னார்வலர்கள்" />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <RankTable
              rows={data.byDistrict.map((r) => ({ key: r.district, value: r.count }))}
              keyLabel="மாவட்டம்"
              valueLabel="தன்னார்வலர்கள்"
            />
          </div>

          {/* Constituency */}
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <SectionTitle>சட்டமன்றத் தொகுதி வாரியான விண்ணப்ப எண்ணிக்கை</SectionTitle>
            <div className="mb-5">
              <ResponsiveContainer width="100%" height={280}>
                <BarChart
                  data={data.byConstituency.slice(0, 15).map((r) => ({ name: r.constituency, count: r.count }))}
                  margin={{ top: 5, right: 10, left: -10, bottom: 60 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="name" tick={{ fontSize: 10, fill: "#6b7280", angle: -40, textAnchor: "end" }} tickLine={false} interval={0} />
                  <YAxis tick={{ fontSize: 11, fill: "#6b7280" }} tickLine={false} axisLine={false} />
                  <Tooltip contentStyle={{ borderRadius: "8px", border: "1px solid #e5e7eb", fontSize: "12px" }} />
                  <Bar dataKey="count" fill={BAR_COLOR_2} radius={[4, 4, 0, 0]} name="தன்னார்வலர்கள்" />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <RankTable
              rows={data.byConstituency.map((r) => ({ key: r.constituency, value: r.count, sub: r.district }))}
              keyLabel="தொகுதி"
              valueLabel="தன்னார்வலர்கள்"
              districtCol
            />
          </div>
        </div>
      )}

      {/* SKILLS TAB */}
      {activeTab === "skills" && (
        <div className="space-y-6">
          {/* Skill capabilities */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white rounded-xl border border-gray-200 p-4 text-center">
              <p className="text-3xl font-bold text-slate-800">{data.itKnowledgeCount.toLocaleString()}</p>
              <p className="text-sm text-gray-600 mt-1">IT அறிவு உள்ளவர்கள்</p>
              <div className="mt-3 bg-gray-100 rounded-full h-2">
                <div className="bg-slate-700 h-2 rounded-full" style={{ width: `${itPct}%` }} />
              </div>
              <p className="text-xs text-gray-400 mt-1">{itPct}% of total</p>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-4 text-center">
              <p className="text-3xl font-bold text-blue-700">{data.videoCreationCount.toLocaleString()}</p>
              <p className="text-sm text-gray-600 mt-1">வீடியோ உருவாக்குபவர்கள்</p>
              <div className="mt-3 bg-gray-100 rounded-full h-2">
                <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${videoPct}%` }} />
              </div>
              <p className="text-xs text-gray-400 mt-1">{videoPct}% of total</p>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-4 text-center">
              <p className="text-3xl font-bold text-indigo-700">{data.imageCreationCount.toLocaleString()}</p>
              <p className="text-sm text-gray-600 mt-1">படம் உருவாக்குபவர்கள்</p>
              <div className="mt-3 bg-gray-100 rounded-full h-2">
                <div className="bg-indigo-500 h-2 rounded-full" style={{ width: `${imagePct}%` }} />
              </div>
              <p className="text-xs text-gray-400 mt-1">{imagePct}% of total</p>
            </div>
          </div>

          {/* Specific IT skills */}
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <SectionTitle>IT திறன்கள் (குறிப்பிட்ட)</SectionTitle>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart
                data={data.bySkill.map((r) => ({ name: r.skill, count: r.count }))}
                layout="vertical"
                margin={{ top: 0, right: 30, left: 10, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" horizontal={false} />
                <XAxis type="number" tick={{ fontSize: 10, fill: "#6b7280" }} tickLine={false} axisLine={false} />
                <YAxis type="category" dataKey="name" tick={{ fontSize: 11, fill: "#374151" }} tickLine={false} width={160} />
                <Tooltip contentStyle={{ borderRadius: "8px", border: "1px solid #e5e7eb", fontSize: "12px" }} />
                <Bar dataKey="count" fill={BAR_COLOR} radius={[0, 4, 4, 0]} name="தன்னார்வலர்கள்" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Device & Availability */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <SectionTitle>முதன்மை சாதனம்</SectionTitle>
              <SmallPie data={devicePieData} labelFn={(k) => DEVICE_LABELS[k] ?? k} />
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <SectionTitle>கிடைக்கும் நேரம்</SectionTitle>
              <SmallPie data={availPieData} labelFn={(k) => AVAILABILITY_LABELS[k] ?? k} />
            </div>
          </div>

          {/* Languages */}
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <SectionTitle>மொழி திறன்கள்</SectionTitle>
            <RankTable
              rows={data.byLanguage.map((r) => ({ key: r.language, value: r.count }))}
              keyLabel="மொழி"
              valueLabel="தன்னார்வலர்கள்"
            />
          </div>
        </div>
      )}

      {/* DEMOGRAPHICS TAB */}
      {activeTab === "demographics" && (
        <div className="space-y-6">
          {/* Gender */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <SectionTitle>பாலினம்</SectionTitle>
              <SmallPie data={genderPieData} labelFn={(k) => GENDER_LABELS[k] ?? k} />
            </div>

            {/* VCK & Travel */}
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <SectionTitle>VCK உறுப்பினர் & பயணம்</SectionTitle>
              <div className="space-y-4">
                {[
                  {
                    label: "VCK உறுப்பினர்",
                    yes: data.byVckMember.find((r) => r.vckMember === true)?.count ?? 0,
                    no: data.byVckMember.find((r) => r.vckMember === false)?.count ?? 0,
                  },
                  {
                    label: "பயணிக்க தயார்",
                    yes: data.byCanTravel.find((r) => r.canTravel === true)?.count ?? 0,
                    no: data.byCanTravel.find((r) => r.canTravel === false)?.count ?? 0,
                  },
                ].map(({ label, yes, no }) => {
                  const total = yes + no;
                  const yesPct = total > 0 ? Math.round((yes / total) * 100) : 0;
                  return (
                    <div key={label}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="font-medium text-gray-700">{label}</span>
                        <span className="text-gray-400 text-xs">ஆம்: {yes.toLocaleString()} / இல்லை: {no.toLocaleString()}</span>
                      </div>
                      <div className="flex h-5 rounded-full overflow-hidden bg-gray-100">
                        <div className="bg-green-500 h-full transition-all" style={{ width: `${yesPct}%` }} />
                        <div className="bg-red-300 h-full transition-all" style={{ width: `${100 - yesPct}%` }} />
                      </div>
                      <p className="text-xs text-gray-400 mt-0.5">{yesPct}% ஆம்</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Occupation */}
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <SectionTitle>தொழில் வாரியான விவரம்</SectionTitle>
            <RankTable
              rows={data.byOccupation.filter((r) => r.occupation).map((r) => ({ key: r.occupation, value: r.count }))}
              keyLabel="தொழில்"
              valueLabel="தன்னார்வலர்கள்"
            />
          </div>

          {/* How they heard */}
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <SectionTitle>எப்படி அறிந்தீர்கள்?</SectionTitle>
            <RankTable
              rows={data.byHearAboutUs.filter((r) => r.source).map((r) => ({ key: r.source, value: r.count }))}
              keyLabel="மூலம்"
              valueLabel="தன்னார்வலர்கள்"
            />
          </div>
        </div>
      )}
    </div>
  );
}
