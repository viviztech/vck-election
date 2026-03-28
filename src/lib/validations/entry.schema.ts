import { z } from "zod";

const nullableString = z.string().optional().transform((v) => (v === "" ? null : v));

export const UpdateEntrySchema = z.object({
  serialNumber: nullableString,
  feeReceiptNumber: nullableString,
  name: nullableString,
  parentName: nullableString,
  parentType: z.enum(["FATHER", "MOTHER"]).optional().nullable(),
  address: nullableString,
  contactNumber: nullableString,
  yearJoinedParty: z.number().int().min(1900).max(2100).optional().nullable(),
  partyPosition: nullableString,
  entryDate: nullableString,
  entryPlace: nullableString,
  applicationGivenBy: nullableString,
  applicationGivenTo: nullableString,
  forThalaivar: nullableString,
  districtId: nullableString,
  constituencyId: nullableString,
  rawDistrictText: nullableString,
  rawConstituencyText: nullableString,
  isVerified: z.boolean().optional(),
});

export type UpdateEntryInput = z.infer<typeof UpdateEntrySchema>;
