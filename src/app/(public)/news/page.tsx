"use client";

import * as Tabs from "@radix-ui/react-tabs";

type NewsItem = {
  id: number;
  title: string;
  category: string;
  date: string;
};

const newsItems: NewsItem[] = [
  { id: 1, title: "சனாதன தர்மத்திற்கு எதிராக விசி மாநில அளவில் போராட்டம்", category: "செய்திக் குறிப்பு", date: "15 ஏப்ரல் 2026" },
  { id: 2, title: "தலித் அட்டூழியங்கள் குறித்து தோல். திருமாவளவன் நாடாளுமன்றத்தில் உரையாற்றினார்", category: "சமீபத்திய செய்திகள்", date: "10 ஏப்ரல் 2026" },
  { id: 3, title: "சென்னையில் விசி மகளிர் அணி பேரணி — ஆயிரக்கணக்கானோர் கலந்துகொண்டனர்", category: "நிகழ்வுகள்", date: "5 ஏப்ரல் 2026" },
  { id: 4, title: "சிறப்பு நேர்காணல்: மாநிலக் கட்சி அங்கீகாரத்தின் பின்னணி", category: "நேர்காணல்கள்", date: "1 ஏப்ரல் 2026" },
  { id: 5, title: "களத்தில் சிறுத்தைகள் — ஏப்ரல் 2026 இதழ்", category: "Kalaththil Siruthaigal", date: "1 ஏப்ரல் 2026" },
  { id: 6, title: "கல்லூரிகளில் சாதி எதிர்ப்பு விழிப்புணர்வு பிரச்சாரம் — விசி இளைஞர் அணி", category: "சமீபத்திய செய்திகள்", date: "28 மார்ச் 2026" },
];

const tabs = ["அனைத்தும்", "செய்திக் குறிப்பு", "சமீபத்திய செய்திகள்", "நிகழ்வுகள்", "நேர்காணல்கள்", "Kalaththil Siruthaigal"] as const;

function NewsCard({ item }: { item: NewsItem }) {
  const isKalaththil = item.category === "Kalaththil Siruthaigal";
  return (
    <div className={`rounded-lg overflow-hidden shadow-sm flex flex-col ${isKalaththil ? "bg-[#0A1628] text-white" : "bg-white"}`}>
      <div className={`h-40 ${isKalaththil ? "bg-white/10" : "bg-[#E8E0D0]"}`} aria-hidden="true" />
      <div className="p-5 flex flex-col flex-1">
        <span className="inline-block bg-[#C41E1E] text-white text-xs font-semibold px-2 py-1 rounded mb-3 self-start">
          {item.category}
        </span>
        <h3 className={`font-semibold text-base leading-snug mb-3 flex-1 ${isKalaththil ? "text-white" : "text-[#0A1628]"}`}>
          {item.title}
        </h3>
        <div className="flex items-center justify-between mt-auto pt-3">
          <span className={`text-xs ${isKalaththil ? "text-white/50" : "text-[#1A1A1A]/50"}`}>{item.date}</span>
          <a href="#" className={`text-xs font-semibold ${isKalaththil ? "text-white/70 hover:text-white" : "text-[#C41E1E] hover:underline"}`}>
            மேலும் படியுங்கள் →
          </a>
        </div>
      </div>
    </div>
  );
}

function NewsGrid({ items }: { items: NewsItem[] }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {items.map((item) => (
        <NewsCard key={item.id} item={item} />
      ))}
    </div>
  );
}

export default function NewsPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative flex items-center justify-center min-h-[40vh] bg-[#0A1628] overflow-hidden px-6">
        <div className="absolute top-0 left-0 w-1 h-full bg-[#C41E1E] opacity-60" aria-hidden="true" />
        <div className="relative z-10 text-center max-w-3xl mx-auto">
          <p className="text-[#C41E1E] font-semibold tracking-widest uppercase text-sm mb-4">
            ஊடகம் &amp; புதுப்பிப்புகள்
          </p>
          <h1 className="font-serif text-5xl sm:text-6xl text-white leading-tight mb-6">
            களத்திலிருந்து
          </h1>
          <p className="text-lg text-white/60">
            விடுதலைச் சிறுத்தைகள் கட்சியின் செய்திகள், அறிக்கைகள் மற்றும் நிகழ்வுகள்
          </p>
        </div>
      </section>

      {/* Tabs + content */}
      <div className="bg-[#F5F0E8] min-h-screen">
        <Tabs.Root defaultValue="அனைத்தும்">
          {/* Sticky tab bar */}
          <div className="bg-white sticky top-16 z-20 shadow-sm">
            <div className="max-w-6xl mx-auto px-6">
              <Tabs.List className="flex overflow-x-auto gap-0 -mb-px" aria-label="News categories">
                {tabs.map((tab) => (
                  <Tabs.Trigger
                    key={tab}
                    value={tab}
                    className="shrink-0 px-4 py-4 text-sm font-medium text-[#1A1A1A]/70 border-b-2 border-transparent whitespace-nowrap cursor-pointer hover:text-[#1A1A1A] data-[state=active]:border-[#C41E1E] data-[state=active]:text-[#C41E1E] transition-colors"
                  >
                    {tab}
                  </Tabs.Trigger>
                ))}
              </Tabs.List>
            </div>
          </div>

          {/* Tab panels */}
          <div className="max-w-6xl mx-auto px-6 py-12">
            <Tabs.Content value="அனைத்தும்">
              <NewsGrid items={newsItems} />
            </Tabs.Content>
            {tabs.slice(1).map((tab) => (
              <Tabs.Content key={tab} value={tab}>
                <NewsGrid items={newsItems.filter((n) => n.category === tab)} />
              </Tabs.Content>
            ))}
          </div>
        </Tabs.Root>
      </div>
    </>
  );
}
