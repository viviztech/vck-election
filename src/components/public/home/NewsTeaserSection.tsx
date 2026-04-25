import Link from "next/link";

type NewsCard = { title: string; category: string; date: string };

const NEWS: NewsCard[] = [
  {
    title: "தொகுதி மறு சீரமைப்பு மசோதா: தமிழ்நாடு உள்ளிட்ட தென் மாநிலங்களை வஞ்சிக்கும் சதி!",
    category: "அறிக்கை",
    date: "18 ஏப்ரல் 2025",
  },
  {
    title: "வி.சி.க கொள்கை அறிக்கை",
    category: "கொள்கை",
    date: "10 ஏப்ரல் 2025",
  },
  {
    title: "விடுதலைச் சிறுத்தைகள் கட்சி புதுச்சேரி மாநிலத்தில் தனித்துப் போட்டி!",
    category: "செய்தி",
    date: "3 ஏப்ரல் 2025",
  },
];

function NewsCard({ item }: { item: NewsCard }) {
  return (
    <article className="bg-white rounded-xl p-6 border border-[#e0d9ce] shadow-sm flex flex-col gap-3">
      <div className="flex items-center gap-3">
        <span className="text-xs font-bold uppercase tracking-wide bg-[#C41E1E] text-white px-2 py-0.5 rounded">
          {item.category}
        </span>
        <time className="text-xs text-gray-400">{item.date}</time>
      </div>
      <p className="font-semibold text-[#0A1628] leading-snug">{item.title}</p>
    </article>
  );
}

export default function NewsTeaserSection() {
  return (
    <section className="bg-[#F5F0E8] py-20 px-6">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-3xl sm:text-4xl font-bold text-[#0A1628] text-center mb-14">
          களத்திலிருந்து
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {NEWS.map((item) => <NewsCard key={item.title} item={item} />)}
        </div>
        <div className="text-center">
          <Link
            href="/news"
            className="inline-block px-8 py-3 bg-[#C41E1E] text-white rounded font-semibold hover:bg-[#a31919] transition-colors"
          >
            அனைத்து செய்திகளும் →
          </Link>
        </div>
      </div>
    </section>
  );
}
