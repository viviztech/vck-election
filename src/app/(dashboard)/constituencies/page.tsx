import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function ConstituenciesPage() {
  const districts = await prisma.district.findMany({
    orderBy: { nameEnglish: "asc" },
    include: {
      constituencies: {
        orderBy: { nameEnglish: "asc" },
      },
    },
  });

  const totalConstituencies = districts.reduce((sum, d) => sum + d.constituencies.length, 0);

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">தொகுதிகள் (Constituencies)</h1>
        <p className="text-sm text-gray-500 mt-1">
          {districts.length} மாவட்டங்கள் · {totalConstituencies} தொகுதிகள்
        </p>
      </div>

      <div className="space-y-4">
        {districts.map((district) => (
          <div key={district.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            {/* District header */}
            <div className="flex items-center justify-between px-5 py-3 bg-slate-800 text-white">
              <div>
                <span className="font-semibold text-base tamil-text">{district.nameTamil}</span>
                <span className="text-slate-300 text-sm ml-2">({district.nameEnglish})</span>
              </div>
              <span className="text-xs bg-white/20 px-2.5 py-1 rounded-full font-semibold">
                {district.constituencies.length} தொகுதிகள்
              </span>
            </div>

            {/* Constituencies grid */}
            <div className="p-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
              {district.constituencies.map((c, idx) => (
                <div
                  key={c.id}
                  className="flex items-start gap-2 px-3 py-2 rounded-lg bg-gray-50 border border-gray-100"
                >
                  <span className="text-xs text-gray-400 font-mono mt-0.5 shrink-0">{idx + 1}.</span>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-gray-800 leading-snug tamil-text truncate">{c.nameTamil}</p>
                    <p className="text-xs text-gray-400 truncate">{c.nameEnglish}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
