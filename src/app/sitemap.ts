import type { MetadataRoute } from "next";

const BASE = "https://vckitwing.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticPages: MetadataRoute.Sitemap = [
    { url: `${BASE}/`,                          lastModified: now, changeFrequency: "daily",   priority: 1.0 },
    { url: `${BASE}/elections/results`,         lastModified: now, changeFrequency: "hourly",  priority: 1.0 },
    { url: `${BASE}/leadership`,                lastModified: now, changeFrequency: "weekly",  priority: 0.9 },
    { url: `${BASE}/elected-members/mp`,        lastModified: now, changeFrequency: "weekly",  priority: 0.9 },
    { url: `${BASE}/elected-members/mla`,       lastModified: now, changeFrequency: "weekly",  priority: 0.9 },
    { url: `${BASE}/elected-members/local`,     lastModified: now, changeFrequency: "weekly",  priority: 0.8 },
    { url: `${BASE}/history`,                   lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE}/ideology`,                  lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE}/party-wings`,               lastModified: now, changeFrequency: "weekly",  priority: 0.7 },
    { url: `${BASE}/state-admin`,               lastModified: now, changeFrequency: "weekly",  priority: 0.7 },
    { url: `${BASE}/district-admin`,            lastModified: now, changeFrequency: "weekly",  priority: 0.7 },
    { url: `${BASE}/conferences`,               lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE}/flag`,                      lastModified: now, changeFrequency: "yearly",  priority: 0.6 },
    { url: `${BASE}/news`,                      lastModified: now, changeFrequency: "daily",   priority: 0.8 },
    { url: `${BASE}/contact`,                   lastModified: now, changeFrequency: "yearly",  priority: 0.6 },
    { url: `${BASE}/join`,                      lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${BASE}/donate`,                    lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${BASE}/it-wing-volunteer`,         lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${BASE}/publications/photos`,       lastModified: now, changeFrequency: "weekly",  priority: 0.5 },
    { url: `${BASE}/publications/tamilmann`,    lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: `${BASE}/publications/songs`,        lastModified: now, changeFrequency: "yearly",  priority: 0.5 },
  ];

  return staticPages;
}
