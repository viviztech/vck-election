"use client";

import { useEffect, useState } from "react";

interface District {
  id: string;
  nameTamil: string;
  nameEnglish: string;
}

interface Constituency {
  id: string;
  nameTamil: string;
  nameEnglish: string;
}

const inputClass =
  "bg-white border border-[#E8E0D0] rounded-lg px-4 py-3 w-full focus:ring-2 focus:ring-[#C41E1E] outline-none text-[#0A1628]";

const labelClass = "block text-sm font-semibold text-[#0A1628] mb-1";

const requiredStar = <span className="text-[#C41E1E] ml-0.5">*</span>;

const sectionHeadingClass =
  "text-base font-bold text-[#C41E1E] border-b border-[#E8E0D0] pb-2 mb-4 mt-2";

type YesNo = "yes" | "no" | "";

const IT_SKILLS_OPTIONS = [
  "Graphic Design",
  "Video Editing",
  "Content Writing",
  "Web Development",
  "Data Entry",
  "Social Media Management",
  "WhatsApp Campaign",
  "Audio Editing",
  "Photography",
  "Live Streaming",
];

const LANGUAGE_OPTIONS = ["தமிழ்", "English", "Hindi", "Telugu", "Malayalam", "Kannada"];

const AVAILABILITY_OPTIONS = [
  { value: "full_time", label: "முழு நேரம் (Full-time)" },
  { value: "part_time", label: "பகுதி நேரம் (Part-time)" },
  { value: "weekends", label: "வார இறுதி மட்டும் (Weekends only)" },
  { value: "campaigns", label: "தேர்தல் காலம் மட்டும் (Campaign periods only)" },
];

const OCCUPATION_OPTIONS = [
  "மாணவர் (Student)",
  "தனியார் பணியாளர் (Private Employee)",
  "அரசு பணியாளர் (Govt Employee)",
  "சுய தொழில் (Self-employed)",
  "வேலையில்லாதவர் (Unemployed)",
  "பிற (Other)",
];

const HEAR_OPTIONS = [
  "சமூக ஊடகம் (Social Media)",
  "கட்சி கூட்டம் (Party Meeting)",
  "நண்பர் / உறவினர் (Friend/Relative)",
  "VCK இணையதளம் (VCK Website)",
  "பிற (Other)",
];

const DEVICE_OPTIONS = [
  { value: "mobile", label: "மொபைல் மட்டும் (Mobile only)" },
  { value: "laptop", label: "Laptop / PC" },
  { value: "both", label: "இரண்டும் (Both)" },
];

export default function ItWingForm() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [districts, setDistricts] = useState<District[]>([]);
  const [constituencies, setConstituencies] = useState<Constituency[]>([]);

  const [form, setForm] = useState({
    // Identity
    name: "",
    age: "",
    dob: "",
    gender: "",
    phone: "",
    whatsapp: "",
    email: "",
    voterId: "",
    // Location
    town: "",
    pincode: "",
    address: "",
    // Education & Occupation
    education: "",
    occupation: "",
    districtId: "",
    districtName: "",
    constituencyId: "",
    constituencyName: "",
    // IT Skills detailed
    softwareTools: "",
    yearsExp: "",
    primaryDevice: "",
    // Social Media
    facebook: "",
    youtube: "",
    instagram: "",
    twitterX: "",
    followers: "",
    // Availability & Party
    availability: "",
    hearAboutUs: "",
    priorExperience: "",
    joinReason: "",
    // Emergency
    emergencyName: "",
    emergencyPhone: "",
  });

  // Multi-select state
  const [itSkills, setItSkills] = useState<string[]>([]);
  const [languages, setLanguages] = useState<string[]>([]);

  // Radio state
  const [itKnowledge, setItKnowledge] = useState<YesNo>("");
  const [videoCreation, setVideoCreation] = useState<YesNo>("");
  const [imageCreation, setImageCreation] = useState<YesNo>("");
  const [canTravel, setCanTravel] = useState<YesNo>("");
  const [vckMember, setVckMember] = useState<YesNo>("");

  useEffect(() => {
    fetch("/api/reference/districts")
      .then((r) => r.json())
      .then(setDistricts)
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (!form.districtId) {
      setConstituencies([]);
      return;
    }
    fetch(`/api/reference/constituencies?districtId=${form.districtId}`)
      .then((r) => r.json())
      .then(setConstituencies)
      .catch(() => {});
  }, [form.districtId]);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleDistrictChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const selected = districts.find((d) => d.id === e.target.value);
    setForm({
      ...form,
      districtId: e.target.value,
      districtName: selected?.nameTamil ?? "",
      constituencyId: "",
      constituencyName: "",
    });
  }

  function handleConstituencyChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const selected = constituencies.find((c) => c.id === e.target.value);
    setForm({
      ...form,
      constituencyId: e.target.value,
      constituencyName: selected?.nameTamil ?? "",
    });
  }

  function toggleSkill(skill: string) {
    setItSkills((prev) =>
      prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]
    );
  }

  function toggleLanguage(lang: string) {
    setLanguages((prev) =>
      prev.includes(lang) ? prev.filter((l) => l !== lang) : [...prev, lang]
    );
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");

    if (!itKnowledge || !videoCreation || !imageCreation) {
      setError("IT, Video, Image கேள்விகளுக்கு ஆம் அல்லது இல்லை தேர்ந்தெடுக்கவும்.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/public/it-wing-volunteer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          age: form.age ? parseInt(form.age, 10) : undefined,
          dob: form.dob || undefined,
          gender: form.gender || undefined,
          phone: form.phone,
          whatsapp: form.whatsapp || undefined,
          email: form.email || undefined,
          voterId: form.voterId || undefined,
          town: form.town || undefined,
          pincode: form.pincode || undefined,
          address: form.address || undefined,
          education: form.education,
          occupation: form.occupation || undefined,
          district: form.districtName || form.districtId,
          constituency: form.constituencyName || form.constituencyId,
          itKnowledge: itKnowledge === "yes",
          videoCreation: videoCreation === "yes",
          imageCreation: imageCreation === "yes",
          itSkills,
          softwareTools: form.softwareTools || undefined,
          yearsExp: form.yearsExp ? parseInt(form.yearsExp, 10) : undefined,
          primaryDevice: form.primaryDevice || undefined,
          facebook: form.facebook || undefined,
          youtube: form.youtube || undefined,
          instagram: form.instagram || undefined,
          twitterX: form.twitterX || undefined,
          followers: form.followers || undefined,
          availability: form.availability || undefined,
          languages,
          canTravel: canTravel !== "" ? canTravel === "yes" : undefined,
          vckMember: vckMember !== "" ? vckMember === "yes" : undefined,
          priorExperience: form.priorExperience || undefined,
          hearAboutUs: form.hearAboutUs || undefined,
          joinReason: form.joinReason,
          emergencyName: form.emergencyName || undefined,
          emergencyPhone: form.emergencyPhone || undefined,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error ?? "பதிவு தோல்வியடைந்தது. மீண்டும் முயற்சிக்கவும்.");
        return;
      }

      setSubmitted(true);
    } catch {
      setError("இணைய பிழை. மீண்டும் முயற்சிக்கவும்.");
    } finally {
      setLoading(false);
    }
  }

  if (submitted) {
    return (
      <section className="bg-[#F5F0E8] py-16 px-8">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-2xl p-10 text-center shadow-sm border border-[#E8E0D0]">
            <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-[#0A1628] mb-2">
              பதிவு வெற்றிகரமாக முடிந்தது!
            </h2>
            <p className="text-gray-600">
              நன்றி! உங்கள் விண்ணப்பம் பெறப்பட்டது. விரைவில் தொடர்பு கொள்வோம்.
            </p>
          </div>
        </div>
      </section>
    );
  }

  const yesNoField = (
    label: string,
    value: YesNo,
    setter: (v: YesNo) => void,
    required = false,
    name?: string
  ) => (
    <div>
      <p className={labelClass}>
        {label} {required && requiredStar}
      </p>
      <div className="flex gap-4 mt-1">
        {(["yes", "no"] as const).map((val) => (
          <label
            key={val}
            className={`flex items-center gap-2 cursor-pointer px-5 py-3 rounded-lg border-2 transition-colors flex-1 justify-center font-semibold ${
              value === val
                ? "border-[#C41E1E] bg-[#C41E1E]/5 text-[#C41E1E]"
                : "border-[#E8E0D0] text-gray-600 hover:border-[#C41E1E]/40"
            }`}
          >
            <input
              type="radio"
              name={name ?? label}
              value={val}
              checked={value === val}
              onChange={() => setter(val)}
              className="sr-only"
            />
            {val === "yes" ? "ஆம்" : "இல்லை"}
          </label>
        ))}
      </div>
    </div>
  );

  return (
    <section className="bg-[#F5F0E8] py-16 px-8">
      <div className="max-w-2xl mx-auto">
        <h2 className="text-3xl font-bold text-[#0A1628] mb-2 text-center">
          தன்னார்வலர் விண்ணப்பம்
        </h2>
        <p className="text-center text-gray-500 mb-8 text-sm">
          <span className="text-[#C41E1E]">*</span> கட்டாய தகவல்
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6 bg-white rounded-2xl p-8 shadow-sm border border-[#E8E0D0]">

          {/* ── Section 1: Identity ── */}
          <p className={sectionHeadingClass}>அடையாளம் மற்றும் தொடர்பு</p>

          {/* Name — now required */}
          <div>
            <label htmlFor="name" className={labelClass}>
              பெயர் {requiredStar}
            </label>
            <input
              id="name"
              name="name"
              type="text"
              required
              value={form.name}
              onChange={handleChange}
              className={inputClass}
              placeholder="உங்கள் முழு பெயர்"
            />
          </div>

          {/* Gender */}
          <div>
            <label htmlFor="gender" className={labelClass}>
              பாலினம் (Gender) {requiredStar}
            </label>
            <select
              id="gender"
              name="gender"
              required
              value={form.gender}
              onChange={handleChange}
              className={inputClass}
            >
              <option value="">-- பாலினம் தேர்ந்தெடுக்கவும் --</option>
              <option value="MALE">ஆண் (Male)</option>
              <option value="FEMALE">பெண் (Female)</option>
              <option value="OTHER">பிற (Other)</option>
            </select>
          </div>

          {/* Age + DOB on same row */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="dob" className={labelClass}>
                பிறந்த தேதி
              </label>
              <input
                id="dob"
                name="dob"
                type="date"
                value={form.dob}
                onChange={handleChange}
                className={inputClass}
              />
            </div>
            <div>
              <label htmlFor="age" className={labelClass}>
                வயது
              </label>
              <input
                id="age"
                name="age"
                type="number"
                min={1}
                max={120}
                value={form.age}
                onChange={handleChange}
                className={inputClass}
                placeholder="வயது"
              />
            </div>
          </div>

          {/* Phone */}
          <div>
            <label htmlFor="phone" className={labelClass}>
              தொலைபேசி எண் {requiredStar}
            </label>
            <input
              id="phone"
              name="phone"
              type="tel"
              required
              value={form.phone}
              onChange={handleChange}
              className={inputClass}
              placeholder="+91 00000 00000"
            />
          </div>

          {/* WhatsApp */}
          <div>
            <label htmlFor="whatsapp" className={labelClass}>
              வாட்ஸ்அப் எண் (WhatsApp)
            </label>
            <input
              id="whatsapp"
              name="whatsapp"
              type="tel"
              value={form.whatsapp}
              onChange={handleChange}
              className={inputClass}
              placeholder="தொலைபேசி வேறாக இருந்தால் மட்டும்"
            />
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className={labelClass}>
              மின்னஞ்சல் (Email)
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              className={inputClass}
              placeholder="example@email.com"
            />
          </div>

          {/* Voter ID */}
          <div>
            <label htmlFor="voterId" className={labelClass}>
              வாக்காளர் அடையாள எண் (Voter ID / EPIC)
            </label>
            <input
              id="voterId"
              name="voterId"
              type="text"
              value={form.voterId}
              onChange={handleChange}
              className={inputClass}
              placeholder="உ.தா: ABC1234567"
            />
          </div>

          {/* ── Section 2: Location ── */}
          <p className={sectionHeadingClass}>இடம் / முகவரி</p>

          {/* District */}
          <div>
            <label htmlFor="districtId" className={labelClass}>
              மாவட்டம் {requiredStar}
            </label>
            <select
              id="districtId"
              name="districtId"
              required
              value={form.districtId}
              onChange={handleDistrictChange}
              className={inputClass}
            >
              <option value="">-- மாவட்டத்தை தேர்ந்தெடுக்கவும் --</option>
              {districts.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.nameTamil} ({d.nameEnglish})
                </option>
              ))}
            </select>
          </div>

          {/* Constituency */}
          <div>
            <label htmlFor="constituencyId" className={labelClass}>
              சட்டமன்றத் தொகுதி {requiredStar}
            </label>
            <select
              id="constituencyId"
              name="constituencyId"
              required
              value={form.constituencyId}
              onChange={handleConstituencyChange}
              className={inputClass}
              disabled={!form.districtId}
            >
              <option value="">
                {form.districtId
                  ? "-- தொகுதியை தேர்ந்தெடுக்கவும் --"
                  : "-- முதலில் மாவட்டம் தேர்ந்தெடுக்கவும் --"}
              </option>
              {constituencies.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.nameTamil} ({c.nameEnglish})
                </option>
              ))}
            </select>
          </div>

          {/* Town */}
          <div>
            <label htmlFor="town" className={labelClass}>
              ஊர் / நகர் (Town / Village) {requiredStar}
            </label>
            <input
              id="town"
              name="town"
              type="text"
              required
              value={form.town}
              onChange={handleChange}
              className={inputClass}
              placeholder="உங்கள் ஊர் அல்லது நகர் பெயர்"
            />
          </div>

          {/* Pincode */}
          <div>
            <label htmlFor="pincode" className={labelClass}>
              அஞ்சல் குறியீடு (Pincode)
            </label>
            <input
              id="pincode"
              name="pincode"
              type="text"
              maxLength={6}
              value={form.pincode}
              onChange={handleChange}
              className={inputClass}
              placeholder="600001"
            />
          </div>

          {/* Address */}
          <div>
            <label htmlFor="address" className={labelClass}>
              முழு முகவரி (Address)
            </label>
            <textarea
              id="address"
              name="address"
              rows={3}
              value={form.address}
              onChange={handleChange}
              className={inputClass}
              placeholder="வீட்டு எண், தெரு, நகர்..."
            />
          </div>

          {/* ── Section 3: Education & Occupation ── */}
          <p className={sectionHeadingClass}>கல்வி மற்றும் தொழில்</p>

          {/* Education */}
          <div>
            <label htmlFor="education" className={labelClass}>
              கல்வித்தகுதி {requiredStar}
            </label>
            <input
              id="education"
              name="education"
              type="text"
              required
              value={form.education}
              onChange={handleChange}
              className={inputClass}
              placeholder="உ.தா: பி.டெக், எம்.ஏ, +2"
            />
          </div>

          {/* Occupation */}
          <div>
            <label htmlFor="occupation" className={labelClass}>
              தொழில் (Occupation) {requiredStar}
            </label>
            <select
              id="occupation"
              name="occupation"
              required
              value={form.occupation}
              onChange={handleChange}
              className={inputClass}
            >
              <option value="">-- தொழிலை தேர்ந்தெடுக்கவும் --</option>
              {OCCUPATION_OPTIONS.map((o) => (
                <option key={o} value={o}>{o}</option>
              ))}
            </select>
          </div>

          {/* ── Section 4: IT Skills ── */}
          <p className={sectionHeadingClass}>IT திறன்கள்</p>

          {yesNoField("IT knowledge (கணினி / இணைய அறிவு)", itKnowledge, setItKnowledge, true, "itKnowledge")}
          {yesNoField("Video creation (வீடியோ உருவாக்கம்)", videoCreation, setVideoCreation, true, "videoCreation")}
          {yesNoField("Image creation (படம் உருவாக்கம்)", imageCreation, setImageCreation, true, "imageCreation")}

          {/* IT Skills multi-select */}
          <div>
            <p className={labelClass}>IT திறன்கள் — பொருந்தியவற்றை தேர்ந்தெடுக்கவும்</p>
            <div className="flex flex-wrap gap-2 mt-1">
              {IT_SKILLS_OPTIONS.map((skill) => (
                <button
                  key={skill}
                  type="button"
                  onClick={() => toggleSkill(skill)}
                  className={`px-3 py-1.5 rounded-full text-sm border-2 font-medium transition-colors ${
                    itSkills.includes(skill)
                      ? "border-[#C41E1E] bg-[#C41E1E] text-white"
                      : "border-[#E8E0D0] text-gray-600 hover:border-[#C41E1E]/40"
                  }`}
                >
                  {skill}
                </button>
              ))}
            </div>
          </div>

          {/* Software Tools */}
          <div>
            <label htmlFor="softwareTools" className={labelClass}>
              மென்பொருள் கருவிகள் (Software / Tools known)
            </label>
            <input
              id="softwareTools"
              name="softwareTools"
              type="text"
              value={form.softwareTools}
              onChange={handleChange}
              className={inputClass}
              placeholder="உ.தா: Photoshop, CapCut, Canva, MS Office, Python"
            />
          </div>

          {/* Years of Experience + Primary Device */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="yearsExp" className={labelClass}>
                IT அனுபவம் (ஆண்டுகள்)
              </label>
              <input
                id="yearsExp"
                name="yearsExp"
                type="number"
                min={0}
                max={50}
                value={form.yearsExp}
                onChange={handleChange}
                className={inputClass}
                placeholder="0"
              />
            </div>
            <div>
              <label htmlFor="primaryDevice" className={labelClass}>
                முதன்மை சாதனம்
              </label>
              <select
                id="primaryDevice"
                name="primaryDevice"
                value={form.primaryDevice}
                onChange={handleChange}
                className={inputClass}
              >
                <option value="">-- தேர்ந்தெடுக்கவும் --</option>
                {DEVICE_OPTIONS.map((d) => (
                  <option key={d.value} value={d.value}>{d.label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* ── Section 5: Social Media ── */}
          <p className={sectionHeadingClass}>சமூக ஊடகம் (Social Media)</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="facebook" className={labelClass}>Facebook</label>
              <input
                id="facebook"
                name="facebook"
                type="text"
                value={form.facebook}
                onChange={handleChange}
                className={inputClass}
                placeholder="Profile URL அல்லது பெயர்"
              />
            </div>
            <div>
              <label htmlFor="youtube" className={labelClass}>YouTube</label>
              <input
                id="youtube"
                name="youtube"
                type="text"
                value={form.youtube}
                onChange={handleChange}
                className={inputClass}
                placeholder="Channel URL அல்லது பெயர்"
              />
            </div>
            <div>
              <label htmlFor="instagram" className={labelClass}>Instagram</label>
              <input
                id="instagram"
                name="instagram"
                type="text"
                value={form.instagram}
                onChange={handleChange}
                className={inputClass}
                placeholder="@username"
              />
            </div>
            <div>
              <label htmlFor="twitterX" className={labelClass}>Twitter / X</label>
              <input
                id="twitterX"
                name="twitterX"
                type="text"
                value={form.twitterX}
                onChange={handleChange}
                className={inputClass}
                placeholder="@username"
              />
            </div>
          </div>

          {/* Followers */}
          <div>
            <label htmlFor="followers" className={labelClass}>
              மொத்த பின்தொடர்பவர்கள் எண்ணிக்கை (Total Followers)
            </label>
            <input
              id="followers"
              name="followers"
              type="text"
              value={form.followers}
              onChange={handleChange}
              className={inputClass}
              placeholder="உ.தா: 5000, 10K, 1 lakh"
            />
          </div>

          {/* ── Section 6: Availability & Party ── */}
          <p className={sectionHeadingClass}>கிடைக்கும் நேரம் மற்றும் கட்சி தகவல்</p>

          {/* Availability */}
          <div>
            <label htmlFor="availability" className={labelClass}>
              கிடைக்கும் நேரம் (Availability) {requiredStar}
            </label>
            <select
              id="availability"
              name="availability"
              required
              value={form.availability}
              onChange={handleChange}
              className={inputClass}
            >
              <option value="">-- தேர்ந்தெடுக்கவும் --</option>
              {AVAILABILITY_OPTIONS.map((a) => (
                <option key={a.value} value={a.value}>{a.label}</option>
              ))}
            </select>
          </div>

          {/* Languages */}
          <div>
            <p className={labelClass}>தெரிந்த மொழிகள் (Languages known)</p>
            <div className="flex flex-wrap gap-2 mt-1">
              {LANGUAGE_OPTIONS.map((lang) => (
                <button
                  key={lang}
                  type="button"
                  onClick={() => toggleLanguage(lang)}
                  className={`px-3 py-1.5 rounded-full text-sm border-2 font-medium transition-colors ${
                    languages.includes(lang)
                      ? "border-[#C41E1E] bg-[#C41E1E] text-white"
                      : "border-[#E8E0D0] text-gray-600 hover:border-[#C41E1E]/40"
                  }`}
                >
                  {lang}
                </button>
              ))}
            </div>
          </div>

          {yesNoField("தொகுதிக்குள் பயணிக்க முடியுமா? (Can travel within constituency?)", canTravel, setCanTravel, false, "canTravel")}
          {yesNoField("VCK கட்சி உறுப்பினரா? (VCK Party member?)", vckMember, setVckMember, false, "vckMember")}

          {/* Prior Experience */}
          <div>
            <label htmlFor="priorExperience" className={labelClass}>
              முன்னர் தன்னார்வ / தேர்தல் அனுபவம் (Prior volunteering experience)
            </label>
            <textarea
              id="priorExperience"
              name="priorExperience"
              rows={3}
              value={form.priorExperience}
              onChange={handleChange}
              className={inputClass}
              placeholder="ஏதேனும் தேர்தல், நிகழ்வு, அல்லது IT பணி அனுபவம் இருந்தால் விவரிக்கவும்..."
            />
          </div>

          {/* How did you hear */}
          <div>
            <label htmlFor="hearAboutUs" className={labelClass}>
              VCK IT Wing பற்றி எப்படி அறிந்தீர்கள்?
            </label>
            <select
              id="hearAboutUs"
              name="hearAboutUs"
              value={form.hearAboutUs}
              onChange={handleChange}
              className={inputClass}
            >
              <option value="">-- தேர்ந்தெடுக்கவும் --</option>
              {HEAR_OPTIONS.map((h) => (
                <option key={h} value={h}>{h}</option>
              ))}
            </select>
          </div>

          {/* ── Section 7: Motivation ── */}
          <p className={sectionHeadingClass}>இணைய காரணம்</p>

          {/* Join Reason */}
          <div>
            <label htmlFor="joinReason" className={labelClass}>
              VCK IT Wing தன்னார்வலர்களில் நீங்கள் இணைய காரணம் {requiredStar}
            </label>
            <textarea
              id="joinReason"
              name="joinReason"
              required
              rows={4}
              value={form.joinReason}
              onChange={handleChange}
              className={inputClass}
              placeholder="உங்கள் காரணத்தை விவரமாக எழுதுங்கள்..."
            />
          </div>

          {/* ── Section 8: Emergency Contact ── */}
          <p className={sectionHeadingClass}>அவசர தொடர்பு (Emergency Contact)</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="emergencyName" className={labelClass}>
                பெயர் (Name)
              </label>
              <input
                id="emergencyName"
                name="emergencyName"
                type="text"
                value={form.emergencyName}
                onChange={handleChange}
                className={inputClass}
                placeholder="நெருங்கிய உறவினர் / நண்பர் பெயர்"
              />
            </div>
            <div>
              <label htmlFor="emergencyPhone" className={labelClass}>
                தொலைபேசி எண் (Phone)
              </label>
              <input
                id="emergencyPhone"
                name="emergencyPhone"
                type="tel"
                value={form.emergencyPhone}
                onChange={handleChange}
                className={inputClass}
                placeholder="+91 00000 00000"
              />
            </div>
          </div>

          {error && (
            <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-3">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="self-stretch bg-[#C41E1E] text-white px-8 py-4 rounded-lg hover:bg-red-800 transition-colors font-bold text-lg disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? "பதிவு செய்கிறோம்..." : "விண்ணப்பிக்கவும்"}
          </button>
        </form>
      </div>
    </section>
  );
}
