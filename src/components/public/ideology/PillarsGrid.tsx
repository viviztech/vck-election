"use client";

import * as Accordion from "@radix-ui/react-accordion";

type Pillar = { icon: React.ReactNode; title: string; desc: string };

const PILLARS: Pillar[] = [
  {
    icon: <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="9"/><line x1="12" y1="3" x2="12" y2="21"/><line x1="3" y1="12" x2="21" y2="12"/></svg>,
    title: "சாதி ஒழிப்பு",
    desc: "டாக்டர் பி.ஆர். அம்பேத்கரின் 'படி, போராடு, ஒழுங்கமை' என்ற புரட்சிகர தத்துவத்தை பின்பற்றி சாதி பாகுபாட்டின் அனைத்து வடிவங்களையும் வேரோடு பிடுங்க வேண்டும்.",
  },
  {
    icon: <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>,
    title: "சமூக நீதி மற்றும் சமத்துவம்",
    desc: "தலித்துகள், பழங்குடியினர், பிற்படுத்தப்பட்டோர் மற்றும் சிறுபான்மையினர் உட்பட அனைத்து ஒடுக்கப்பட்ட மக்களின் சமூக, பொருளாதார மற்றும் அரசியல் உரிமைகளுக்காக போராடுகிறோம்.",
  },
  {
    icon: <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2 L20 20 L12 16 L4 20 Z"/></svg>,
    title: "பகுத்தறிவு மற்றும் சுயமரியாதை",
    desc: "தந்தை பெரியாரின் பகுத்தறிவு கொள்கைகளை பின்பற்றி, சுயமரியாதையில் வேரூன்றிய அறிவார்ந்த சமூகத்தை உருவாக்க முயற்சிக்கிறோம்.",
  },
  {
    icon: <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="9" y1="21" x2="9" y2="9"/></svg>,
    title: "தலித்தியம்",
    desc: "சாதி, மொழி, மதம், பாலினம் மற்றும் பிற சமூக பிரிவினைகளால் ஒடுக்கப்பட்ட தொழிலாளர்களின் முழுமையான விடுதலைக்காக பாடுபடுகிறோம்.",
  },
  {
    icon: <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 12 L8 7 L13 12 L18 7 L21 10"/><line x1="3" y1="17" x2="21" y2="17"/></svg>,
    title: "மண்ணுரிமை மற்றும் தொழிலாளர் நலன்",
    desc: "சாதி அடிப்படையிலான நிலப்பிரபுத்துவ ஆதிக்கத்தை எதிர்க்கிறோம்; ஒழுங்கமைக்கப்படாத தொழிலாளர்களுக்கு நியாயமான ஊதியம், அடிப்படை உரிமைகள் மற்றும் சமூக பாதுகாப்பை பெற போராடுகிறோம்.",
  },
  {
    icon: <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="8" r="4"/><path d="M6 20v-2a6 6 0 0 1 12 0v2"/></svg>,
    title: "பெண் விடுதலை",
    desc: "பெண்களின் கல்வி, பொருளாதார சுதந்திரம் மற்றும் சமூக உரிமைகளை நிலைநாட்டுகிறோம்; அனைத்து வகையான ஒடுக்குமுறை மற்றும் வன்முறைகளை எதிர்க்கிறோம்.",
  },
  {
    icon: <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="9"/><path d="M12 3 C7 8 7 16 12 21"/><path d="M12 3 C17 8 17 16 12 21"/><line x1="3" y1="12" x2="21" y2="12"/></svg>,
    title: "மதச்சார்பின்மை",
    desc: "வகுப்புவாத மற்றும் மத பெரும்பான்மை அரசியலை உறுதியாக எதிர்க்கிறோம்; இந்திய அரசியலமைப்பில் பொதிந்த மதச்சார்பற்ற கொள்கைகளை நிலைநாட்டுகிறோம்.",
  },
  {
    icon: <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/><line x1="12" y1="12" x2="12" y2="16"/><line x1="10" y1="14" x2="14" y2="14"/></svg>,
    title: "சனநாயகப் பாதுகாப்பு",
    desc: "சுதந்திரமான, நியாயமான மற்றும் வெளிப்படையான தேர்தல்கள் மூலம் மக்களின் ஆணையால் அரசுகள் அமைக்கப்படுவதை உறுதி செய்கிறோம்.",
  },
  {
    icon: <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2 C8 5 3 8 3 13 C3 18 7 21 12 22 C17 21 21 18 21 13 C21 8 16 5 12 2Z"/></svg>,
    title: "தமிழ்த் தேசியம்",
    desc: "தமிழ் மக்களின் மொழி, கலாச்சாரம், பாரம்பரியம் மற்றும் தாயகத்தை பாதுகாத்து மேம்படுத்துகிறோம்.",
  },
];

export default function PillarsGrid() {
  return (
    <section className="bg-[#1B3A6B] text-white py-20 px-6">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl sm:text-4xl font-bold text-white mb-12 text-center">
          கொள்கைத் தூண்கள்
        </h2>
        <Accordion.Root type="single" collapsible className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {PILLARS.map((pillar, i) => (
            <Accordion.Item
              key={i}
              value={`pillar-${i}`}
              className="bg-white/10 border border-white/20 rounded-xl overflow-hidden"
            >
              <Accordion.Header>
                <Accordion.Trigger className="w-full flex items-center gap-3 px-5 py-4 text-left hover:bg-white/10 transition-colors group">
                  <span className="text-[#C41E1E] shrink-0">{pillar.icon}</span>
                  <span className="font-semibold text-sm sm:text-base flex-1">{pillar.title}</span>
                  <svg viewBox="0 0 24 24" className="w-4 h-4 shrink-0 transition-transform duration-200 group-data-[state=open]:rotate-180" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 9l6 6 6-6"/></svg>
                </Accordion.Trigger>
              </Accordion.Header>
              <Accordion.Content className="px-5 pb-5 text-white/75 text-sm leading-relaxed data-[state=open]:animate-[slideDown_200ms_ease] data-[state=closed]:animate-[slideUp_200ms_ease] overflow-hidden">
                {pillar.desc}
              </Accordion.Content>
            </Accordion.Item>
          ))}
        </Accordion.Root>
      </div>
    </section>
  );
}
