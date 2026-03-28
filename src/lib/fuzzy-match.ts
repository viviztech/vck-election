import { distance } from "fastest-levenshtein";
import type { District, Constituency } from "@prisma/client";

const MATCH_THRESHOLD = 4;

export function matchDistrict(
  ocrText: string,
  districts: District[]
): District | null {
  if (!ocrText?.trim()) return null;

  const scored = districts.map((d) => ({
    district: d,
    score: Math.min(
      distance(ocrText.trim(), d.nameTamil),
      distance(ocrText.trim().toLowerCase(), d.nameEnglish.toLowerCase())
    ),
  }));

  scored.sort((a, b) => a.score - b.score);
  return scored[0]?.score <= MATCH_THRESHOLD ? scored[0].district : null;
}

export function matchConstituency(
  ocrText: string,
  constituencies: Constituency[]
): Constituency | null {
  if (!ocrText?.trim()) return null;

  const scored = constituencies.map((c) => ({
    constituency: c,
    score: Math.min(
      distance(ocrText.trim(), c.nameTamil),
      distance(ocrText.trim().toLowerCase(), c.nameEnglish.toLowerCase())
    ),
  }));

  scored.sort((a, b) => a.score - b.score);
  return scored[0]?.score <= MATCH_THRESHOLD ? scored[0].constituency : null;
}
