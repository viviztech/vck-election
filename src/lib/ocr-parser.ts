export interface ParsedFormData {
  serialNumber?: string;
  rawDistrictText?: string;
  rawConstituencyText?: string;
  name?: string;
  parentName?: string;
  parentType?: "FATHER" | "MOTHER";
  address?: string;
  contactNumber?: string;
  yearJoinedParty?: number;
  partyPosition?: string;
  feeReceiptNumber?: string;
  entryDate?: string;
  entryPlace?: string;
}

// Tamil label anchors mapped to field names
const FIELD_ANCHORS: Record<string, string[]> = {
  serialNumber: ["வரிசை எண்", "வ.எண்", "வரிசை எண"],
  district: ["வருவாய் மாவட்டம்", "மாவட்டம்"],
  constituency: ["விரும்பும் தொகுதி", "தொகுதி"],
  name: ["பெயர்", "பெயர"],
  parentName: ["த.பெ", "க.பெ", "தந்தை பெயர்", "காப்பாளர் பெயர்"],
  address: ["முகவரி"],
  yearJoined: ["கட்சியில் சேர்ந்த ஆண்டு", "சேர்ந்த ஆண்டு"],
  contactNumber: ["தொடர்பு எண்", "தொடர்பு எண", "தொ.எண்"],
  partyPosition: ["கட்சியில் பொறுப்பு நிலை", "பொறுப்பு நிலை"],
  feeReceiptNumber: ["கட்டண ரசீது எண்", "ரசீது எண்", "கட்டண ரசீது எண"],
  date: ["நாள்"],
  place: ["இடம்"],
};

/** Normalize a single line: collapse whitespace but preserve content */
function normalizeLine(line: string): string {
  return line.replace(/\s+/g, " ").trim();
}

/** Split text into clean lines, preserving structure */
function toLines(rawText: string): string[] {
  return rawText
    .split(/\r?\n/)
    .map(normalizeLine)
    .filter((l) => l.length > 0 && !l.match(/^#+\s*/)); // strip markdown headers
}

function isLabelLine(text: string): boolean {
  for (const anchors of Object.values(FIELD_ANCHORS)) {
    for (const anchor of anchors) {
      if (text.includes(anchor)) return true;
    }
  }
  return false;
}

/**
 * Extract the value for a field from a single line.
 * The line contains "LABEL : VALUE" or "LABEL:VALUE".
 * We split on the first colon after the label.
 */
function extractValueOnLine(line: string, label: string): string {
  const labelIdx = line.indexOf(label);
  if (labelIdx === -1) return "";
  const afterLabel = line.slice(labelIdx + label.length);
  // Strip leading colon, slash, spaces
  return afterLabel.replace(/^[\s:/]+/, "").trim();
}

/**
 * Find the first line containing one of the anchors and extract its value.
 * If the value is empty (label-only line), look at the next line.
 */
function findField(
  lines: string[],
  anchors: string[]
): { value: string; lineIndex: number } | null {
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    for (const anchor of anchors) {
      if (line.includes(anchor)) {
        let value = extractValueOnLine(line, anchor);

        // Some fields have the value on the next line (e.g. party position)
        if (!value && i + 1 < lines.length) {
          const next = lines[i + 1].trim();
          if (next && !isLabelLine(next)) {
            value = next;
          }
        }

        if (value) return { value, lineIndex: i };
      }
    }
  }
  return null;
}

/**
 * For fields where label and value may be on the same line separated by colon,
 * but the value portion may contain further inline fields (e.g. "1995 தொடர்பு எண்: 9500434337").
 * We extract only up to the next Tamil label keyword.
 */
function trimToNextLabel(value: string): string {
  // Find position of any known label anchor inside the value
  let cutAt = value.length;
  for (const anchors of Object.values(FIELD_ANCHORS)) {
    for (const anchor of anchors) {
      const idx = value.indexOf(anchor);
      if (idx > 0 && idx < cutAt) {
        cutAt = idx;
      }
    }
  }
  return value.slice(0, cutAt).trim();
}

function extractPhoneNumber(text: string): string | undefined {
  const match = text.match(/[6-9]\d{9}/);
  return match ? match[0] : undefined;
}

function extractYear(text: string): number | undefined {
  const match = text.match(/\b(19|20)\d{2}\b/);
  return match ? parseInt(match[0]) : undefined;
}

export function parseOcrTextToFields(rawText: string): ParsedFormData {
  const lines = toLines(rawText);
  const result: ParsedFormData = {};

  // Serial Number
  const serial = findField(lines, FIELD_ANCHORS.serialNumber);
  if (serial?.value) {
    const trimmed = trimToNextLabel(serial.value);
    result.serialNumber = trimmed.replace(/[^0-9]/g, "").slice(0, 10) || trimmed;
  }

  // District
  const district = findField(lines, FIELD_ANCHORS.district);
  if (district?.value) {
    result.rawDistrictText = trimToNextLabel(district.value);
  }

  // Constituency — keep full name, strip trailing boilerplate suffix
  const constituency = findField(lines, FIELD_ANCHORS.constituency);
  if (constituency?.value) {
    result.rawConstituencyText = trimToNextLabel(constituency.value)
      .replace(/\s*சட்டமன்ற தொகுதி\s*$/g, "")
      .trim();
  }

  // Name
  const name = findField(lines, FIELD_ANCHORS.name);
  if (name?.value) {
    result.name = trimToNextLabel(name.value);
  }

  // Parent Name — detect FATHER (த.பெ) vs MOTHER (க.பெ)
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const isFather = line.includes("த.பெ") || line.includes("தந்தை");
    const isMother = line.includes("க.பெ") || line.includes("காப்பாளர்");
    if (isFather || isMother) {
      // Handle combined label "த.பெ/க.பெ" — extract after the full combined label
      let anchor: string;
      if (line.includes("த.பெ/க.பெ")) {
        anchor = "த.பெ/க.பெ";
      } else if (isFather) {
        anchor = line.includes("த.பெ") ? "த.பெ" : "தந்தை";
      } else {
        anchor = line.includes("க.பெ") ? "க.பெ" : "காப்பாளர்";
      }
      let value = extractValueOnLine(line, anchor);
      if (!value && i + 1 < lines.length && !isLabelLine(lines[i + 1])) {
        value = lines[i + 1];
      }
      if (value) {
        result.parentName = trimToNextLabel(value);
        result.parentType = isFather ? "FATHER" : "MOTHER";
        break;
      }
    }
  }

  // Address — may span multiple lines
  const addressIdx = lines.findIndex((l) => l.includes("முகவரி"));
  if (addressIdx >= 0) {
    const firstLine = extractValueOnLine(lines[addressIdx], "முகவரி");
    const addressLines = firstLine ? [trimToNextLabel(firstLine)] : [];
    for (let i = addressIdx + 1; i < Math.min(addressIdx + 5, lines.length); i++) {
      if (!isLabelLine(lines[i])) {
        addressLines.push(lines[i]);
      } else {
        break;
      }
    }
    result.address = addressLines.filter(Boolean).join(", ");
  }

  // Contact Number — may be on same line as year joined
  const contactResult = findField(lines, FIELD_ANCHORS.contactNumber);
  if (contactResult?.value) {
    result.contactNumber = extractPhoneNumber(contactResult.value) ?? trimToNextLabel(contactResult.value);
  } else {
    result.contactNumber = extractPhoneNumber(rawText);
  }

  // Year Joined
  const yearResult = findField(lines, FIELD_ANCHORS.yearJoined);
  if (yearResult?.value) {
    result.yearJoinedParty = extractYear(yearResult.value);
  }

  // Party Position
  const position = findField(lines, FIELD_ANCHORS.partyPosition);
  if (position?.value) {
    result.partyPosition = trimToNextLabel(position.value);
  }

  // Fee Receipt Number
  const receipt = findField(lines, FIELD_ANCHORS.feeReceiptNumber);
  if (receipt?.value) {
    result.feeReceiptNumber = trimToNextLabel(receipt.value).replace(/\s/g, "");
  }

  // Date
  const dateResult = findField(lines, FIELD_ANCHORS.date);
  if (dateResult?.value) {
    result.entryDate = trimToNextLabel(dateResult.value);
  }

  // Place
  const place = findField(lines, FIELD_ANCHORS.place);
  if (place?.value) {
    result.entryPlace = trimToNextLabel(place.value);
  }

  return result;
}
