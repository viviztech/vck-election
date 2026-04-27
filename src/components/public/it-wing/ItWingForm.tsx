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

type YesNo = "yes" | "no" | "";

export default function ItWingForm() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [districts, setDistricts] = useState<District[]>([]);
  const [constituencies, setConstituencies] = useState<Constituency[]>([]);

  const [form, setForm] = useState({
    name: "",
    age: "",
    phone: "",
    education: "",
    districtId: "",
    districtName: "",
    constituencyId: "",
    constituencyName: "",
    joinReason: "",
  });

  const [itKnowledge, setItKnowledge] = useState<YesNo>("");
  const [videoCreation, setVideoCreation] = useState<YesNo>("");
  const [imageCreation, setImageCreation] = useState<YesNo>("");

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

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");

    if (!itKnowledge || !videoCreation || !imageCreation) {
      setError("அனைத்து கேள்விகளுக்கும் ஆம் அல்லது இல்லை தேர்ந்தெடுக்கவும்.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/public/it-wing-volunteer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name || undefined,
          age: form.age ? parseInt(form.age, 10) : undefined,
          phone: form.phone,
          education: form.education,
          district: form.districtName || form.districtId,
          constituency: form.constituencyName || form.constituencyId,
          itKnowledge: itKnowledge === "yes",
          videoCreation: videoCreation === "yes",
          imageCreation: imageCreation === "yes",
          joinReason: form.joinReason,
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
          {/* Name */}
          <div>
            <label htmlFor="name" className={labelClass}>
              பெயர்
            </label>
            <input
              id="name"
              name="name"
              type="text"
              value={form.name}
              onChange={handleChange}
              className={inputClass}
              placeholder="உங்கள் முழு பெயர்"
            />
          </div>

          {/* Age */}
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
              placeholder="உங்கள் வயது"
            />
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

          {/* IT Knowledge */}
          <div>
            <p className={labelClass}>
              IT knowledge {requiredStar}
            </p>
            <div className="flex gap-4 mt-1">
              {(["yes", "no"] as const).map((val) => (
                <label
                  key={val}
                  className={`flex items-center gap-2 cursor-pointer px-5 py-3 rounded-lg border-2 transition-colors flex-1 justify-center font-semibold ${
                    itKnowledge === val
                      ? "border-[#C41E1E] bg-[#C41E1E]/5 text-[#C41E1E]"
                      : "border-[#E8E0D0] text-gray-600 hover:border-[#C41E1E]/40"
                  }`}
                >
                  <input
                    type="radio"
                    name="itKnowledge"
                    value={val}
                    checked={itKnowledge === val}
                    onChange={() => setItKnowledge(val)}
                    className="sr-only"
                  />
                  {val === "yes" ? "ஆம்" : "இல்லை"}
                </label>
              ))}
            </div>
          </div>

          {/* Video Creation */}
          <div>
            <p className={labelClass}>
              Video creation {requiredStar}
            </p>
            <div className="flex gap-4 mt-1">
              {(["yes", "no"] as const).map((val) => (
                <label
                  key={val}
                  className={`flex items-center gap-2 cursor-pointer px-5 py-3 rounded-lg border-2 transition-colors flex-1 justify-center font-semibold ${
                    videoCreation === val
                      ? "border-[#C41E1E] bg-[#C41E1E]/5 text-[#C41E1E]"
                      : "border-[#E8E0D0] text-gray-600 hover:border-[#C41E1E]/40"
                  }`}
                >
                  <input
                    type="radio"
                    name="videoCreation"
                    value={val}
                    checked={videoCreation === val}
                    onChange={() => setVideoCreation(val)}
                    className="sr-only"
                  />
                  {val === "yes" ? "ஆம்" : "இல்லை"}
                </label>
              ))}
            </div>
          </div>

          {/* Image Creation */}
          <div>
            <p className={labelClass}>
              Image creation {requiredStar}
            </p>
            <div className="flex gap-4 mt-1">
              {(["yes", "no"] as const).map((val) => (
                <label
                  key={val}
                  className={`flex items-center gap-2 cursor-pointer px-5 py-3 rounded-lg border-2 transition-colors flex-1 justify-center font-semibold ${
                    imageCreation === val
                      ? "border-[#C41E1E] bg-[#C41E1E]/5 text-[#C41E1E]"
                      : "border-[#E8E0D0] text-gray-600 hover:border-[#C41E1E]/40"
                  }`}
                >
                  <input
                    type="radio"
                    name="imageCreation"
                    value={val}
                    checked={imageCreation === val}
                    onChange={() => setImageCreation(val)}
                    className="sr-only"
                  />
                  {val === "yes" ? "ஆம்" : "இல்லை"}
                </label>
              ))}
            </div>
          </div>

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
