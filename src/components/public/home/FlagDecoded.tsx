"use client";

const ANNOTATIONS = [
  { color: "#1B3A6B", label: "நீலம்", meaning: "ஒடுக்கப்பட்டோரின் உரிமைக் குரலை குறிக்கிறது" },
  { color: "#C41E1E", label: "சிவப்பு", meaning: "உழைக்கும் மக்களின் விடுதலையை வென்றெடுப்பதற்கான புரட்சிகர பாதையை குறிக்கிறது" },
  { color: "#FFD700", label: "ஐந்து முனை நட்சத்திரம்", meaning: "சமத்துவம், வறுமை ஒழிப்பு, பெண் விடுதலை, தமிழ் தேசியம், வல்லாதிக்க எதிர்ப்பு" },
  { color: "#F5F0E8", label: "சிறுத்தை", meaning: "வீரம் மற்றும் அஞ்சாத எதிர்ப்பு" },
  { color: "#8B6914", label: "பானை", meaning: "மனித குலத்தின் நாகரிக வளர்ச்சியின் அடையாளம்" },
];

function FlagSVG() {
  return (
    <svg viewBox="0 0 240 160" className="w-full max-w-xs mx-auto rounded shadow-lg" aria-label="VCK Flag">
      <rect x="0" y="0" width="120" height="160" fill="#1B3A6B" />
      <rect x="120" y="0" width="120" height="160" fill="#C41E1E" />
      {/* Star */}
      <polygon points="120,30 125,45 141,45 128,54 133,70 120,61 107,70 112,54 99,45 115,45"
        fill="#FFD700" />
      {/* Simple panther silhouette */}
      <ellipse cx="120" cy="100" rx="22" ry="14" fill="white" opacity="0.9" />
      <ellipse cx="138" cy="95" rx="10" ry="8" fill="white" opacity="0.9" />
      <circle cx="143" cy="91" r="3" fill="white" opacity="0.9" />
      <line x1="143" y1="91" x2="155" y2="87" stroke="white" strokeWidth="2" />
      <line x1="143" y1="91" x2="154" y2="91" stroke="white" strokeWidth="2" />
      {/* Pot */}
      <ellipse cx="120" cy="138" rx="12" ry="6" fill="white" opacity="0.7" />
      <path d="M108 138 Q108 150 120 150 Q132 150 132 138" fill="white" opacity="0.7" />
      <line x1="114" y1="132" x2="126" y2="132" stroke="white" strokeWidth="2" opacity="0.7" />
    </svg>
  );
}

export default function FlagDecoded() {
  return (
    <section className="bg-[#1B3A6B] text-white py-20 px-6">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-3xl sm:text-4xl font-bold text-center mb-14">நம் கொடி — பொருள் விளக்கம்</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <FlagSVG />
          <ul className="space-y-6">
            {ANNOTATIONS.map((a) => (
              <li key={a.label} className="flex gap-4 items-start">
                <span
                  className="mt-1 shrink-0 w-4 h-4 rounded-full border-2 border-white/40"
                  style={{ background: a.color }}
                />
                <div>
                  <span className="font-bold text-white">{a.label}: </span>
                  <span className="text-white/80 text-sm">{a.meaning}</span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
