import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

// Official district order from EC PS LIST (PSLIST_19122025)
const DISTRICT_ORDER: Record<string, number> = {
  TVL: 1, CHN: 2, KAN: 3, VEL: 4, KRI: 5, DHR: 6, TVN: 7, VIL: 8,
  SLM: 9, NMK: 10, EDE: 11, NLR: 12, CBE: 13, DIN: 14, KAR: 15,
  TIR: 16, PER: 17, CUD: 18, NAG: 19, TVR: 20, THA: 21, PUD: 22,
  SIV: 23, MDU: 24, THN: 25, VRT: 26, RMN: 27, TPN: 28, TNV: 29,
  KKN: 30, ARY: 31, TRV: 32, KAL: 33, TEN: 34, CGT: 35, TPR: 36,
  RAN: 37, MAY: 38,
};

export default async function ConstituenciesPage() {
  const districts = await prisma.district.findMany({
    include: {
      constituencies: {
        orderBy: { code: "asc" },
      },
    },
  });

  // Sort districts by official EC order
  const sorted = [...districts].sort(
    (a, b) => (DISTRICT_ORDER[a.code] ?? 99) - (DISTRICT_ORDER[b.code] ?? 99)
  );

  const totalConstituencies = sorted.reduce((sum, d) => sum + d.constituencies.length, 0);

  return (
    <div className="p-4 md:p-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">தொகுதிகள் (Constituencies)</h1>
        <p className="text-sm text-gray-500 mt-1">
          {sorted.length} மாவட்டங்கள் &middot; {totalConstituencies} தொகுதிகள் &middot; Source: EC PS LIST 19-12-2025
        </p>
      </div>

      <div className="space-y-6">
        {sorted.map((district) => {
          const distNo = DISTRICT_ORDER[district.code];
          return (
            <div key={district.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
              {/* District header */}
              <div className="flex items-center justify-between px-5 py-3 bg-slate-800 text-white">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-mono bg-white/20 px-2 py-0.5 rounded shrink-0">
                    Dist {distNo}
                  </span>
                  <div>
                    <span className="font-bold text-base tamil-text">{district.nameTamil}</span>
                    <span className="text-slate-300 text-sm ml-2">({district.nameEnglish})</span>
                  </div>
                </div>
                <span className="text-xs bg-white/20 px-2.5 py-1 rounded-full font-semibold shrink-0">
                  {district.constituencies.length} தொகுதிகள்
                </span>
              </div>

              {/* Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200 text-xs text-gray-500 uppercase tracking-wide">
                      <th className="px-4 py-2 text-left w-20">AC No</th>
                      <th className="px-4 py-2 text-left">தமிழ் பெயர்</th>
                      <th className="px-4 py-2 text-left">English Name</th>
                    </tr>
                  </thead>
                  <tbody>
                    {district.constituencies.map((c, idx) => (
                      <tr
                        key={c.id}
                        className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}
                      >
                        <td className="px-4 py-2 font-mono text-xs text-gray-400 whitespace-nowrap">
                          {parseInt(c.code.replace("AC", ""), 10)}
                        </td>
                        <td className="px-4 py-2 font-medium text-gray-800 tamil-text">
                          {c.nameTamil}
                        </td>
                        <td className="px-4 py-2 text-gray-600">
                          {c.nameEnglish}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
