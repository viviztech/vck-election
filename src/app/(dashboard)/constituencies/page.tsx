import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function ConstituenciesPage() {
  const districts = await prisma.district.findMany({
    orderBy: { nameEnglish: "asc" },
    include: {
      constituencies: {
        orderBy: { code: "asc" },
      },
    },
  });

  const totalConstituencies = districts.reduce((sum, d) => sum + d.constituencies.length, 0);

  return (
    <div className="p-4 md:p-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">தொகுதிகள் (Constituencies)</h1>
        <p className="text-sm text-gray-500 mt-1">
          {districts.length} மாவட்டங்கள் &middot; {totalConstituencies} தொகுதிகள்
        </p>
      </div>

      <div className="space-y-6">
        {districts.map((district) => (
          <div key={district.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
            {/* District header */}
            <div className="flex items-center justify-between px-5 py-3 bg-slate-800 text-white">
              <div>
                <span className="font-bold text-base tamil-text">{district.nameTamil}</span>
                <span className="text-slate-300 text-sm ml-2">({district.nameEnglish})</span>
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
                    <th className="px-4 py-2 text-left w-16">AC No</th>
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
                        {c.code.replace("AC", "")}
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
        ))}
      </div>
    </div>
  );
}
