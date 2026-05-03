import { ElectionResultsClient } from "./ElectionResultsClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "தேர்தல் முடிவுகள் 2026 | விடுதலைச் சிறுத்தைகள் கட்சி",
  description: "VCK 2026 Tamil Nadu State Assembly Election Results — live updates",
};

// Static shell — client fetches data from the API route directly
export default function ElectionResultsPage() {
  return (
    <>
      <div className="h-14" aria-hidden="true" />
      <ElectionResultsClient />
    </>
  );
}
