"use client";

import { useState } from "react";

const inputClass =
  "bg-white border border-[#E8E0D0] rounded-lg px-4 py-3 w-full focus:ring-2 focus:ring-[#C41E1E] outline-none text-[#0A1628]";

const labelClass = "block text-sm font-semibold text-[#0A1628] mb-1";

const requiredStar = <span className="text-[#C41E1E] ml-0.5">*</span>;

const sectionHeadingClass =
  "text-base font-bold text-[#C41E1E] border-b border-[#E8E0D0] pb-2 mb-4 mt-2";

const HEAR_OPTIONS = [
  "Poster",
  "Social Media",
  "Friend",
  "College",
  "Other",
];

export default function StudentRegistrationForm() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    // Personal
    name: "",
    fatherName: "",
    dob: "",
    age: "",
    gender: "",
    phone: "",
    whatsapp: "",
    email: "",

    // Educational
    currentClass: "",
    department: "",
    schoolName: "",
    rollNumber: "",

    marks10th: "",
    max10th: "",
    percent10th: "",
    marks12th: "",
    max12th: "",
    percent12th: "",
    marksCurrent: "",
    maxCurrent: "",
    percentCurrent: "",

    // Address
    doorNo: "",
    village: "",
    taluk: "",
    district: "",
    pincode: "",

    // Additional
    studentWingMember: "" as "yes" | "no" | "",
    studentWingName: "",
    hearAboutUs: "",
    remarks: "",
  });

  function set(key: keyof typeof form, value: string) {
    setForm((p) => ({ ...p, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!form.name.trim()) { setError("பெயர் அவசியம்"); return; }
    if (!form.phone.trim()) { setError("தொலைபேசி எண் அவசியம்"); return; }
    if (!form.schoolName.trim()) { setError("பள்ளி / கல்லூரி பெயர் அவசியம்"); return; }
    if (!form.district.trim()) { setError("மாவட்டம் அவசியம்"); return; }

    setLoading(true);
    try {
      const res = await fetch("/api/public/student-registration", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          age: form.age ? parseInt(form.age) : undefined,
          gender: form.gender || undefined,
          studentWingMember:
            form.studentWingMember === "yes"
              ? true
              : form.studentWingMember === "no"
              ? false
              : undefined,
        }),
      });
      if (res.ok) {
        setSubmitted(true);
      } else {
        const data = await res.json();
        setError(data.error ?? "பதிவு தோல்வியடைந்தது. மீண்டும் முயற்சிக்கவும்.");
      }
    } catch {
      setError("இணைய பிழை. மீண்டும் முயற்சிக்கவும்.");
    } finally {
      setLoading(false);
    }
  }

  if (submitted) {
    return (
      <section className="max-w-2xl mx-auto px-6 py-20 text-center">
        <div className="text-6xl mb-6">🎉</div>
        <h2 className="text-2xl font-bold text-[#0A1628] mb-3">பதிவு வெற்றிகரமாக நிறைவேறியது!</h2>
        <p className="text-gray-600 mb-6">
          உங்கள் பதிவு வெற்றிகரமாக சமர்ப்பிக்கப்பட்டது. விரைவில் தொடர்பு கொள்ளப்படுவீர்கள்.
        </p>
        <p className="text-sm text-gray-400">Your registration has been successfully submitted.</p>
      </section>
    );
  }

  return (
    <section className="max-w-3xl mx-auto px-4 py-10">
      <form onSubmit={handleSubmit} className="space-y-8">

        {/* Section 1: Personal Details */}
        <div>
          <h2 className={sectionHeadingClass}>1. தனிப்பட்ட விவரங்கள் (Personal Details)</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className={labelClass}>முழுப் பெயர் (Full Name) {requiredStar}</label>
              <input
                type="text"
                className={inputClass}
                value={form.name}
                onChange={(e) => set("name", e.target.value)}
                placeholder="உங்கள் முழுப் பெயரை உள்ளிடவும்"
              />
            </div>

            <div className="sm:col-span-2">
              <label className={labelClass}>தந்தை / பாதுகாவலர் பெயர் (Father&apos;s / Guardian&apos;s Name)</label>
              <input
                type="text"
                className={inputClass}
                value={form.fatherName}
                onChange={(e) => set("fatherName", e.target.value)}
                placeholder="தந்தை அல்லது பாதுகாவலர் பெயர்"
              />
            </div>

            <div>
              <label className={labelClass}>பிறந்த தேதி (Date of Birth)</label>
              <input
                type="date"
                className={inputClass}
                value={form.dob}
                onChange={(e) => set("dob", e.target.value)}
              />
            </div>

            <div>
              <label className={labelClass}>வயது (Age)</label>
              <input
                type="number"
                min="5"
                max="35"
                className={inputClass}
                value={form.age}
                onChange={(e) => set("age", e.target.value)}
                placeholder="வயது"
              />
            </div>

            <div className="sm:col-span-2">
              <label className={labelClass}>பாலினம் (Gender)</label>
              <div className="flex gap-6 mt-1">
                {[
                  { value: "MALE", label: "ஆண் (Male)" },
                  { value: "FEMALE", label: "பெண் (Female)" },
                  { value: "OTHER", label: "பிற (Others)" },
                ].map((opt) => (
                  <label key={opt.value} className="flex items-center gap-2 cursor-pointer text-sm text-[#0A1628]">
                    <input
                      type="radio"
                      name="gender"
                      value={opt.value}
                      checked={form.gender === opt.value}
                      onChange={() => set("gender", opt.value)}
                      className="accent-[#C41E1E]"
                    />
                    {opt.label}
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className={labelClass}>கைபேசி எண் (Mobile Number) {requiredStar}</label>
              <input
                type="tel"
                className={inputClass}
                value={form.phone}
                onChange={(e) => set("phone", e.target.value)}
                placeholder="10 இலக்க எண்"
                maxLength={15}
              />
            </div>

            <div>
              <label className={labelClass}>வாட்ஸ்அப் எண் (WhatsApp Number)</label>
              <input
                type="tel"
                className={inputClass}
                value={form.whatsapp}
                onChange={(e) => set("whatsapp", e.target.value)}
                placeholder="WhatsApp எண்"
                maxLength={15}
              />
            </div>

            <div className="sm:col-span-2">
              <label className={labelClass}>மின்னஞ்சல் (Email ID)</label>
              <input
                type="email"
                className={inputClass}
                value={form.email}
                onChange={(e) => set("email", e.target.value)}
                placeholder="example@email.com"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Educational Details */}
        <div>
          <h2 className={sectionHeadingClass}>2. கல்வி விவரங்கள் & மதிப்பெண்கள் (Educational Details & Marks)</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>படிக்கும் வகுப்பு / ஆண்டு (Current Class / Year)</label>
              <input
                type="text"
                className={inputClass}
                value={form.currentClass}
                onChange={(e) => set("currentClass", e.target.value)}
                placeholder="எ.கா: 12th, 2nd Year B.Sc"
              />
            </div>

            <div>
              <label className={labelClass}>துறை / பிரிவு (Department / Group)</label>
              <input
                type="text"
                className={inputClass}
                value={form.department}
                onChange={(e) => set("department", e.target.value)}
                placeholder="எ.கா: Science, Commerce, B.E CSE"
              />
            </div>

            <div className="sm:col-span-2">
              <label className={labelClass}>பள்ளி / கல்லூரி பெயர் (School / College Name) {requiredStar}</label>
              <input
                type="text"
                className={inputClass}
                value={form.schoolName}
                onChange={(e) => set("schoolName", e.target.value)}
                placeholder="பள்ளி அல்லது கல்லூரி பெயர்"
              />
            </div>

            <div className="sm:col-span-2">
              <label className={labelClass}>சேர்க்கை / பதிவு எண் (Roll Number / Register Number)</label>
              <input
                type="text"
                className={inputClass}
                value={form.rollNumber}
                onChange={(e) => set("rollNumber", e.target.value)}
                placeholder="Roll Number அல்லது Register Number"
              />
            </div>

            {/* Marks Table */}
            <div className="sm:col-span-2">
              <p className="text-sm font-semibold text-[#0A1628] mb-3">மதிப்பெண்கள் (Marks)</p>
              <div className="overflow-x-auto rounded-lg border border-[#E8E0D0]">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-[#F5F0E8]">
                      <th className="text-left px-4 py-3 font-semibold text-[#0A1628] min-w-[140px]">தேர்வு (Exam)</th>
                      <th className="text-left px-4 py-3 font-semibold text-[#0A1628]">மதிப்பெண் (Marks)</th>
                      <th className="text-left px-4 py-3 font-semibold text-[#0A1628]">மொத்த மதிப்பெண் (Max)</th>
                      <th className="text-left px-4 py-3 font-semibold text-[#0A1628]">சதவீதம் / Cutoff</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E8E0D0]">
                    <tr>
                      <td className="px-4 py-3 font-medium text-[#0A1628]">10th Std</td>
                      <td className="px-4 py-3">
                        <input type="text" className="border border-[#E8E0D0] rounded px-2 py-1.5 w-full focus:ring-2 focus:ring-[#C41E1E] outline-none text-sm" value={form.marks10th} onChange={(e) => set("marks10th", e.target.value)} placeholder="மதிப்பெண்" />
                      </td>
                      <td className="px-4 py-3">
                        <input type="text" className="border border-[#E8E0D0] rounded px-2 py-1.5 w-full focus:ring-2 focus:ring-[#C41E1E] outline-none text-sm" value={form.max10th} onChange={(e) => set("max10th", e.target.value)} placeholder="மொத்தம்" />
                      </td>
                      <td className="px-4 py-3">
                        <input type="text" className="border border-[#E8E0D0] rounded px-2 py-1.5 w-full focus:ring-2 focus:ring-[#C41E1E] outline-none text-sm" value={form.percent10th} onChange={(e) => set("percent10th", e.target.value)} placeholder="%" />
                      </td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 font-medium text-[#0A1628]">12th Std</td>
                      <td className="px-4 py-3">
                        <input type="text" className="border border-[#E8E0D0] rounded px-2 py-1.5 w-full focus:ring-2 focus:ring-[#C41E1E] outline-none text-sm" value={form.marks12th} onChange={(e) => set("marks12th", e.target.value)} placeholder="மதிப்பெண்" />
                      </td>
                      <td className="px-4 py-3">
                        <input type="text" className="border border-[#E8E0D0] rounded px-2 py-1.5 w-full focus:ring-2 focus:ring-[#C41E1E] outline-none text-sm" value={form.max12th} onChange={(e) => set("max12th", e.target.value)} placeholder="மொத்தம்" />
                      </td>
                      <td className="px-4 py-3">
                        <input type="text" className="border border-[#E8E0D0] rounded px-2 py-1.5 w-full focus:ring-2 focus:ring-[#C41E1E] outline-none text-sm" value={form.percent12th} onChange={(e) => set("percent12th", e.target.value)} placeholder="%" />
                      </td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 font-medium text-[#0A1628]">தற்போதைய பருவம் (Current Semester)</td>
                      <td className="px-4 py-3">
                        <input type="text" className="border border-[#E8E0D0] rounded px-2 py-1.5 w-full focus:ring-2 focus:ring-[#C41E1E] outline-none text-sm" value={form.marksCurrent} onChange={(e) => set("marksCurrent", e.target.value)} placeholder="மதிப்பெண்" />
                      </td>
                      <td className="px-4 py-3">
                        <input type="text" className="border border-[#E8E0D0] rounded px-2 py-1.5 w-full focus:ring-2 focus:ring-[#C41E1E] outline-none text-sm" value={form.maxCurrent} onChange={(e) => set("maxCurrent", e.target.value)} placeholder="மொத்தம்" />
                      </td>
                      <td className="px-4 py-3">
                        <input type="text" className="border border-[#E8E0D0] rounded px-2 py-1.5 w-full focus:ring-2 focus:ring-[#C41E1E] outline-none text-sm" value={form.percentCurrent} onChange={(e) => set("percentCurrent", e.target.value)} placeholder="%" />
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        {/* Section 3: Address Details */}
        <div>
          <h2 className={sectionHeadingClass}>3. முகவரி விவரங்கள் (Address Details)</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className={labelClass}>கதவு எண் / தெரு (Door No / Street)</label>
              <input
                type="text"
                className={inputClass}
                value={form.doorNo}
                onChange={(e) => set("doorNo", e.target.value)}
                placeholder="கதவு எண், தெரு பெயர்"
              />
            </div>

            <div className="sm:col-span-2">
              <label className={labelClass}>கிராமம் / பகுதி (Village / Area)</label>
              <input
                type="text"
                className={inputClass}
                value={form.village}
                onChange={(e) => set("village", e.target.value)}
                placeholder="கிராமம் அல்லது பகுதி பெயர்"
              />
            </div>

            <div>
              <label className={labelClass}>வட்டம் (Taluk)</label>
              <input
                type="text"
                className={inputClass}
                value={form.taluk}
                onChange={(e) => set("taluk", e.target.value)}
                placeholder="வட்டம்"
              />
            </div>

            <div>
              <label className={labelClass}>மாவட்டம் (District) {requiredStar}</label>
              <input
                type="text"
                className={inputClass}
                value={form.district}
                onChange={(e) => set("district", e.target.value)}
                placeholder="மாவட்டம்"
              />
            </div>

            <div>
              <label className={labelClass}>அஞ்சல் குறியீடு (Pin Code)</label>
              <input
                type="text"
                className={inputClass}
                value={form.pincode}
                onChange={(e) => set("pincode", e.target.value)}
                placeholder="6 இலக்க பின்கோடு"
                maxLength={6}
              />
            </div>
          </div>
        </div>

        {/* Section 4: Additional Information */}
        <div>
          <h2 className={sectionHeadingClass}>4. கூடுதல் தகவல்கள் (Additional Information)</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className={labelClass}>ஏதேனும் மாணவர் அமைப்பில் உறுப்பினரா? (Member of any student wing?)</label>
              <div className="flex gap-6 mt-1">
                {[
                  { value: "yes", label: "ஆம் (Yes)" },
                  { value: "no", label: "இல்லை (No)" },
                ].map((opt) => (
                  <label key={opt.value} className="flex items-center gap-2 cursor-pointer text-sm text-[#0A1628]">
                    <input
                      type="radio"
                      name="studentWingMember"
                      value={opt.value}
                      checked={form.studentWingMember === opt.value}
                      onChange={() => set("studentWingMember", opt.value)}
                      className="accent-[#C41E1E]"
                    />
                    {opt.label}
                  </label>
                ))}
              </div>
            </div>

            {form.studentWingMember === "yes" && (
              <div className="sm:col-span-2">
                <label className={labelClass}>அமைப்பின் பெயர் (If Yes, Name)</label>
                <input
                  type="text"
                  className={inputClass}
                  value={form.studentWingName}
                  onChange={(e) => set("studentWingName", e.target.value)}
                  placeholder="மாணவர் அமைப்பின் பெயர்"
                />
              </div>
            )}

            <div className="sm:col-span-2">
              <label className={labelClass}>இந்த கூட்டம் பற்றி எவ்வாறு அறிந்தீர்கள்? (How did you come to know about this meeting?)</label>
              <div className="flex flex-wrap gap-4 mt-1">
                {HEAR_OPTIONS.map((opt) => (
                  <label key={opt} className="flex items-center gap-2 cursor-pointer text-sm text-[#0A1628]">
                    <input
                      type="radio"
                      name="hearAboutUs"
                      value={opt}
                      checked={form.hearAboutUs === opt}
                      onChange={() => set("hearAboutUs", opt)}
                      className="accent-[#C41E1E]"
                    />
                    {opt}
                  </label>
                ))}
              </div>
            </div>

            <div className="sm:col-span-2">
              <label className={labelClass}>சிறப்பு தேவைகள் / கருத்துக்கள் (Any special requirements / Remarks)</label>
              <textarea
                rows={3}
                className={inputClass}
                value={form.remarks}
                onChange={(e) => set("remarks", e.target.value)}
                placeholder="உங்கள் கருத்துக்கள் அல்லது சிறப்பு தேவைகள்..."
              />
            </div>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#C41E1E] hover:bg-[#A01818] disabled:opacity-60 text-white font-bold py-4 rounded-xl text-lg transition-colors"
        >
          {loading ? "பதிவு செய்கிறோம்..." : "பதிவு செய்க (Register)"}
        </button>
      </form>
    </section>
  );
}
