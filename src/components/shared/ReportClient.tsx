"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";

interface District {
  id: string;
  nameEnglish: string;
  nameTamil: string;
}

interface Constituency {
  id: string;
  nameEnglish: string;
  nameTamil: string;
  districtId: string;
  district: { nameTamil: string; nameEnglish: string };
}

interface Entry {
  id: string;
  serialNumber?: string | null;
  name?: string | null;
  parentName?: string | null;
  partyPosition?: string | null;
  contactNumber?: string | null;
  forThalaivar?: boolean | null;
  paymentMode?: string | null;
  constituency?: { nameTamil: string; nameEnglish: string } | null;
  district?: { nameTamil: string; nameEnglish: string } | null;
}

interface Props {
  entries: Entry[];
  districts: District[];
  constituencies: Constituency[];
  selectedConstituencyId: string;
  selectedDistrictId: string;
}

export function ReportClient({
  entries,
  districts,
  constituencies,
  selectedConstituencyId,
  selectedDistrictId,
}: Props) {
  const router = useRouter();
  const [districtId, setDistrictId] = useState(selectedDistrictId);
  const [constituencyId, setConstituencyId] = useState(selectedConstituencyId);

  const filteredConstituencies = districtId
    ? constituencies.filter((c) => c.districtId === districtId)
    : constituencies;

  function applyFilter() {
    const params = new URLSearchParams();
    if (constituencyId) params.set("constituencyId", constituencyId);
    else if (districtId) params.set("districtId", districtId);
    router.push(`/report?${params.toString()}`);
  }

  const grouped = entries.reduce<Record<string, { label: string; districtLabel: string; rows: Entry[] }>>((acc, e) => {
    const key = e.constituency?.nameTamil ?? "தொகுதி தெரியவில்லை";
    if (!acc[key]) acc[key] = { label: key, districtLabel: e.district?.nameTamil ?? "", rows: [] };
    acc[key].rows.push(e);
    return acc;
  }, {});

  const groupKeys = Object.keys(grouped);
  const selectedConstituency = constituencies.find((c) => c.id === selectedConstituencyId);
  const selectedDistrict = districts.find((d) => d.id === districtId);
  const printDate = new Date().toLocaleDateString("ta-IN", { day: "numeric", month: "long", year: "numeric" });

  return (
    <>
      {/* ── SCREEN UI ── */}
      <div className="print:hidden">
        <div className="bg-white border-b border-gray-200 px-6 py-3.5 flex items-center justify-between">
          <Link href="/dashboard" className="text-sm text-gray-400 hover:text-gray-700">← Back</Link>
          <h1 className="text-base font-semibold text-gray-900 tamil-text">அறிக்கை (Report)</h1>
          {entries.length > 0 ? (
            <button
              onClick={() => window.print()}
              className="px-4 py-2 bg-blue-900 text-white rounded-lg text-sm font-medium hover:bg-blue-800 transition flex items-center gap-2"
            >
              <span>🖨️</span> PDF பதிவிறக்கு
            </button>
          ) : <div />}
        </div>

        <div className="p-6 max-w-2xl mx-auto">
          <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
            <h2 className="text-lg font-bold text-gray-900 tamil-text">தொகுதி தேர்வு செய்யவும்</h2>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 tamil-text">மாவட்டம் (District)</label>
              <select
                value={districtId}
                onChange={(e) => { setDistrictId(e.target.value); setConstituencyId(""); }}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">அனைத்து மாவட்டங்கள்</option>
                {districts.map((d) => (
                  <option key={d.id} value={d.id}>{d.nameTamil} ({d.nameEnglish})</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 tamil-text">தொகுதி (Constituency)</label>
              <select
                value={constituencyId}
                onChange={(e) => setConstituencyId(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">-- தொகுதி தேர்வு --</option>
                {filteredConstituencies.map((c) => (
                  <option key={c.id} value={c.id}>{c.nameTamil} ({c.nameEnglish})</option>
                ))}
              </select>
            </div>
            <button
              onClick={applyFilter}
              disabled={!districtId && !constituencyId}
              className="w-full py-2.5 bg-slate-900 text-white rounded-lg font-medium hover:bg-slate-800 disabled:opacity-40 transition"
            >
              அறிக்கை காட்டு
            </button>
          </div>

          {entries.length > 0 && (
            <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg px-4 py-3 flex items-center justify-between">
              <span className="text-sm text-blue-800 tamil-text font-medium">
                {selectedConstituency
                  ? `${selectedConstituency.nameTamil} — ${entries.length} பதிவுகள்`
                  : selectedDistrict
                  ? `${selectedDistrict.nameTamil} — ${entries.length} பதிவுகள்`
                  : `${entries.length} பதிவுகள்`}
              </span>
              <button
                onClick={() => window.print()}
                className="text-sm px-4 py-1.5 bg-blue-900 text-white rounded-lg font-medium hover:bg-blue-800 flex items-center gap-1"
              >
                🖨️ PDF பதிவிறக்கு
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ── PRINT VIEW ── */}
      {entries.length > 0 && (
        <div className="hidden print:block print-report">
          {groupKeys.map((key, groupIdx) => {
            const group = grouped[key];
            return (
              <div key={key} className="page-group">

                {/* Decorative top border strip */}
                <div className="top-strip" />

                {/* Header */}
                <div className="report-header">
                  <img src="/logo.png" alt="VCK" className="report-logo" />
                  <div className="report-header-center">
                    <p className="report-party-name">விடுதலைச் சிறுத்தைகள் கட்சி</p>
                    <h1 className="report-main-title">2026 சட்டமன்ற பொதுத் தேர்தல்</h1>
                    <h2 className="report-main-title-2">விண்ணப்ப மனு அளித்தவர்கள் விவரம்</h2>
                    <div className="report-divider" />
                    <div className="report-meta-row">
                      {group.districtLabel && (
                        <span className="report-meta-badge report-district-badge">
                          மாவட்டம்: {group.districtLabel}
                        </span>
                      )}
                      <span className="report-meta-badge report-constituency-badge">
                        தொகுதி: {key}
                      </span>
                    </div>
                  </div>
                  <img src="/logo.png" alt="VCK" className="report-logo" />
                </div>

                {/* Summary bar */}
                <div className="report-summary-bar">
                  <span>மொத்த விண்ணப்பங்கள்: <strong>{group.rows.length}</strong></span>
                  <span>தலைவருக்காக: <strong>{group.rows.filter(r => r.forThalaivar).length}</strong></span>
                  <span>அச்சிட்ட நாள்: <strong>{printDate}</strong></span>
                </div>

                {/* Table */}
                <table className="report-table">
                  <thead>
                    <tr>
                      <th className="col-sno">வ.எண்</th>
                      <th className="col-name">பெயர்</th>
                      <th className="col-parent">தந்தை பெயர்</th>
                      <th className="col-position">பொறுப்பு நிலை</th>
                      <th className="col-contact">தொடர்பு எண்</th>
                      <th className="col-payment">கட்டண முறை</th>
                      <th className="col-thalaivar">தலைவருக்காக</th>
                    </tr>
                  </thead>
                  <tbody>
                    {group.rows.map((entry, idx) => (
                      <tr key={entry.id} className={idx % 2 === 0 ? "row-even" : "row-odd"}>
                        <td className="col-sno">{idx + 1}</td>
                        <td className="col-name">{entry.name ?? "—"}</td>
                        <td className="col-parent">{entry.parentName ?? "—"}</td>
                        <td className="col-position">{entry.partyPosition ?? "—"}</td>
                        <td className="col-contact">{entry.contactNumber ?? "—"}</td>
                        <td className="col-payment">{entry.paymentMode ?? "—"}</td>
                        <td className="col-thalaivar">{entry.forThalaivar ? "✔" : ""}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {/* Footer */}
                <div className="report-footer">
                  <div className="footer-left">
                    <span className="footer-party">விடுதலைச் சிறுத்தைகள் கட்சி</span>
                    <span className="footer-sep">•</span>
                    <span>2026 சட்டமன்ற பொதுத் தேர்தல்</span>
                  </div>
                  <div className="footer-right">
                    <span>பக்கம் {groupIdx + 1} / {groupKeys.length}</span>
                  </div>
                </div>

                {/* Bottom strip */}
                <div className="bottom-strip" />
              </div>
            );
          })}
        </div>
      )}

      <style>{`
        @media print {
          @page { size: A4 portrait; margin: 0; }
          body * { visibility: hidden; }
          .print-report, .print-report * { visibility: visible; }
          .print-report { position: absolute; top: 0; left: 0; width: 100%; }
        }

        .print-report {
          font-family: 'Noto Sans Tamil', 'Latha', 'Arial Unicode MS', Arial, sans-serif;
          color: #111827;
        }

        .page-group {
          page-break-after: always;
          min-height: 277mm;
          padding: 0;
          display: flex;
          flex-direction: column;
          position: relative;
        }
        .page-group:last-child { page-break-after: avoid; }

        /* Top colour strip */
        .top-strip {
          height: 8px;
          background: linear-gradient(90deg, #1e3a5f 0%, #c2410c 50%, #1e3a5f 100%);
        }
        .bottom-strip {
          height: 5px;
          background: linear-gradient(90deg, #1e3a5f 0%, #c2410c 50%, #1e3a5f 100%);
          margin-top: auto;
        }

        /* Header */
        .report-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          padding: 14px 20px 10px 20px;
          background: #f8fafc;
          border-bottom: 2px solid #1e3a5f;
        }
        .report-logo {
          width: 72px;
          height: 72px;
          object-fit: contain;
          flex-shrink: 0;
        }
        .report-header-center {
          flex: 1;
          text-align: center;
        }
        .report-party-name {
          font-size: 11pt;
          font-weight: 700;
          color: #6b7280;
          letter-spacing: 0.5px;
          margin: 0 0 3px 0;
          text-transform: uppercase;
        }
        .report-main-title {
          font-size: 17pt;
          font-weight: 800;
          color: #1e3a5f;
          margin: 0 0 2px 0;
          line-height: 1.2;
        }
        .report-main-title-2 {
          font-size: 13pt;
          font-weight: 700;
          color: #c2410c;
          margin: 0 0 8px 0;
          line-height: 1.3;
        }
        .report-divider {
          height: 2px;
          background: linear-gradient(90deg, transparent, #c2410c, transparent);
          margin: 6px auto;
          width: 60%;
        }
        .report-meta-row {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          margin-top: 6px;
        }
        .report-meta-badge {
          display: inline-block;
          padding: 3px 12px;
          border-radius: 20px;
          font-size: 10pt;
          font-weight: 700;
        }
        .report-district-badge {
          background: #eff6ff;
          color: #1e40af;
          border: 1px solid #bfdbfe;
        }
        .report-constituency-badge {
          background: #fff7ed;
          color: #c2410c;
          border: 1px solid #fed7aa;
          font-size: 11pt;
        }

        /* Summary bar */
        .report-summary-bar {
          display: flex;
          justify-content: space-around;
          background: #1e3a5f;
          color: #e2e8f0;
          padding: 6px 20px;
          font-size: 8.5pt;
        }
        .report-summary-bar strong { color: #ffffff; }

        /* Table */
        .report-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 9pt;
          margin: 0;
        }
        .report-table thead tr {
          background: #1e3a5f;
        }
        .report-table th {
          color: #ffffff;
          padding: 7px 8px;
          text-align: left;
          font-weight: 700;
          font-size: 9pt;
          border-right: 1px solid #2d4f7c;
          letter-spacing: 0.2px;
        }
        .report-table th:last-child { border-right: none; }
        .row-even td { background: #ffffff; }
        .row-odd td { background: #f1f5f9; }
        .report-table td {
          padding: 6px 8px;
          border-bottom: 1px solid #e2e8f0;
          border-right: 1px solid #e2e8f0;
          vertical-align: middle;
          font-size: 9pt;
        }
        .report-table td:last-child { border-right: none; }
        .report-table tbody tr:last-child td { border-bottom: 2px solid #1e3a5f; }

        .col-sno   { width: 5%;  text-align: center; font-weight: 600; color: #6b7280; }
        .col-name  { width: 22%; font-weight: 600; }
        .col-parent { width: 18%; }
        .col-position { width: 16%; }
        .col-contact { width: 15%; font-family: monospace; }
        .col-payment { width: 10%; text-align: center; }
        .col-thalaivar { width: 9%; text-align: center; font-size: 11pt; color: #15803d; font-weight: 700; }

        /* Footer */
        .report-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 6px 20px;
          background: #f8fafc;
          border-top: 1px solid #e2e8f0;
          font-size: 8pt;
          color: #6b7280;
        }
        .footer-left { display: flex; align-items: center; gap: 6px; }
        .footer-party { font-weight: 700; color: #1e3a5f; }
        .footer-sep { color: #d1d5db; }
        .footer-right { font-weight: 600; color: #374151; }
      `}</style>
    </>
  );
}
