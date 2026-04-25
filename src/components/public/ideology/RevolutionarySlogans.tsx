const SLOGANS = [
  "அடங்க மறுப்போம்! அத்து மீறுவோம்! திமிறி எழுவோம்! திருப்பி அடிப்போம்!",
  "அமைப்பாய்த் திரள்வோம்! அங்கீகாரம் பெறுவோம்! அதிகாரம் வெல்வோம்!",
  "நெருக்கடிகள் சூழ்ந்த போதும் - கொள்கை நெறிப்படியே வாழ்தல் வீரம்!",
];

export default function RevolutionarySlogans() {
  return (
    <section className="bg-[#0A1628] text-white py-20 px-6">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl sm:text-4xl font-bold text-white mb-12">
          புரட்சிகர முழக்கங்கள்
        </h2>
        <div className="flex flex-col gap-8">
          {SLOGANS.map((slogan, i) => (
            <div
              key={i}
              className="border-l-4 border-[#C41E1E] pl-6 py-2"
            >
              <p className="text-2xl md:text-4xl font-bold leading-snug text-white">
                {slogan}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
