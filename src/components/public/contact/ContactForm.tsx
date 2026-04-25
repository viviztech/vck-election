"use client";

import { useState } from "react";

export default function ContactForm() {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitted(true);
  }

  const inputClass =
    "bg-white border border-[#E8E0D0] rounded-lg px-4 py-3 w-full focus:ring-2 focus:ring-[#C41E1E] outline-none";

  return (
    <section className="bg-[#F5F0E8] py-16 px-8">
      <div className="max-w-2xl mx-auto">
        <h2 className="text-3xl font-bold text-[#0A1628] mb-8 text-center">
          செய்தி அனுப்புங்கள்
        </h2>

        {submitted ? (
          <div className="bg-white rounded-xl p-8 text-center shadow-sm">
            <p className="text-lg font-semibold text-[#1B3A6B]">
              நன்றி! நாங்கள் விரைவில் தொடர்பு கொள்வோம்.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-semibold text-[#0A1628] mb-1"
              >
                பெயர்
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

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-semibold text-[#0A1628] mb-1"
              >
                மின்னஞ்சல்
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={form.email}
                onChange={handleChange}
                className={inputClass}
                placeholder="உங்கள்@மின்னஞ்சல்.com"
              />
            </div>

            <div>
              <label
                htmlFor="phone"
                className="block text-sm font-semibold text-[#0A1628] mb-1"
              >
                தொலைபேசி{" "}
                <span className="font-normal text-gray-500">(விருப்பத்தேர்வு)</span>
              </label>
              <input
                id="phone"
                name="phone"
                type="tel"
                value={form.phone}
                onChange={handleChange}
                className={inputClass}
                placeholder="+91 00000 00000"
              />
            </div>

            <div>
              <label
                htmlFor="message"
                className="block text-sm font-semibold text-[#0A1628] mb-1"
              >
                செய்தி
              </label>
              <textarea
                id="message"
                name="message"
                required
                rows={5}
                value={form.message}
                onChange={handleChange}
                className={inputClass}
                placeholder="உங்கள் செய்தியை இங்கே எழுதுங்கள்..."
              />
            </div>

            <button
              type="submit"
              className="self-start bg-[#C41E1E] text-white px-8 py-3 rounded-lg hover:bg-red-800 transition-colors font-semibold"
            >
              செய்தி அனுப்பு
            </button>
          </form>
        )}
      </div>
    </section>
  );
}
