import Link from "next/link";

interface NewsItem {
  title: string;
  category: string;
  date: string;
}

const NEWS: NewsItem[] = [
  {
    title:
      "தொகுதி மறு சீரமைப்பு மசோதா: தமிழ்நாடு உள்ளிட்ட தென் மாநிலங்களை வஞ்சிக்கும் சதி!",
    category: "அறிக்கை",
    date: "18 ஏப்ரல் 2026",
  },
  {
    title: "வி.சி.க கொள்கை அறிக்கை",
    category: "கொள்கை",
    date: "10 ஏப்ரல் 2026",
  },
  {
    title: "விடுதலைச் சிறுத்தைகள் கட்சி புதுச்சேரி மாநிலத்தில் தனித்துப் போட்டி!",
    category: "செய்தி",
    date: "3 ஏப்ரல் 2026",
  },
];

export default function NewsTeaserSection() {
  const [featured, ...rest] = NEWS;

  return (
    <section className="bg-[#F5F0E8] py-24 px-6">
      <div className="max-w-5xl mx-auto">
        {/* Top row */}
        <div className="flex justify-between items-end mb-10">
          <div>
            <p className="text-[#C41E1E] text-xs font-semibold uppercase tracking-widest mb-2">
              களத்திலிருந்து
            </p>
            <h2
              className="font-black text-4xl text-[#0A1628]"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              களத்திலிருந்து
            </h2>
          </div>
          <Link
            href="/news"
            className="text-[#C41E1E] text-sm font-semibold hover:underline shrink-0"
          >
            அனைத்து செய்திகளும் →
          </Link>
        </div>

        {/* Featured card */}
        <article className="bg-white rounded-2xl p-7 flex flex-col sm:flex-row gap-6 items-start mb-4 shadow-sm">
          <div className="flex-1">
            <span className="inline-block bg-[#C41E1E] text-white text-xs px-3 py-1 rounded-full font-bold">
              {featured.category}
            </span>
            <h3
              className="font-black text-xl text-[#0A1628] mt-3 leading-snug"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              {featured.title}
            </h3>
            <time
              className="block text-gray-400 text-xs mt-2"
              style={{ fontFamily: "var(--font-body)" }}
            >
              {featured.date}
            </time>
            <Link
              href="/news"
              className="inline-block text-[#C41E1E] text-sm font-semibold mt-4 hover:underline"
            >
              மேலும் படியுங்கள் →
            </Link>
          </div>
          {/* Placeholder image */}
          <div className="w-full sm:w-44 h-28 sm:h-auto shrink-0 bg-[#E8E0D0] rounded-xl" aria-hidden="true" />
        </article>

        {/* Two smaller cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {rest.map((item) => (
            <article
              key={item.title}
              className="bg-white rounded-2xl p-6 border border-[#E8E0D0]"
            >
              <span className="inline-block bg-[#C41E1E] text-white text-xs px-3 py-1 rounded-full font-bold">
                {item.category}
              </span>
              <h3
                className="font-bold text-[#0A1628] text-base mt-2 leading-snug"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                {item.title}
              </h3>
              <time
                className="block text-gray-400 text-xs mt-1"
                style={{ fontFamily: "var(--font-body)" }}
              >
                {item.date}
              </time>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
