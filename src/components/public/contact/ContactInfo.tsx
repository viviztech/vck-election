export default function ContactInfo() {
  return (
    <section className="bg-[#1B3A6B] text-white py-16">
      <div className="max-w-5xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-16">
          {/* Phone */}
          <div className="flex flex-col items-center text-center gap-3">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-8 h-8 text-[#C41E1E]"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.8}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z"
              />
            </svg>
            <div>
              <p className="text-sm font-semibold uppercase tracking-widest text-gray-300 mb-1">
                எங்களை அழைக்கவும்
              </p>
              <p className="text-lg font-medium">+91 90920 73388</p>
            </div>
          </div>

          {/* Email */}
          <div className="flex flex-col items-center text-center gap-3">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-8 h-8 text-[#C41E1E]"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.8}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0l-9.75 6.75L2.25 6.75"
              />
            </svg>
            <div>
              <p className="text-sm font-semibold uppercase tracking-widest text-gray-300 mb-1">
                மின்னஞ்சல்
              </p>
              <p className="text-base font-medium break-all">
                info@viduthalaichiruthaigalkatchi.com
              </p>
            </div>
          </div>

          {/* Address */}
          <div className="flex flex-col items-center text-center gap-3">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-8 h-8 text-[#C41E1E]"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.8}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"
              />
            </svg>
            <div>
              <p className="text-sm font-semibold uppercase tracking-widest text-gray-300 mb-1">
                அலுவலக முகவரி
              </p>
              <p className="text-lg font-medium">அம்பேத்கர் திடல், A4A 100 அடி சாலை, அசோக் நகர், சென்னை - 600 083</p>
            </div>
          </div>
        </div>

        {/* Join VCK */}
        <div className="text-center border-t border-white/20 pt-12">
          <p className="text-xl font-semibold mb-4">
            விசிக-வில் இணைய வேண்டுமா?
          </p>
          <a
            href="/join"
            className="inline-block bg-[#C41E1E] text-white px-8 py-3 rounded-lg hover:bg-red-800 transition-colors font-semibold"
          >
            விசிக-வில் இணைய
          </a>
        </div>
      </div>
    </section>
  );
}
