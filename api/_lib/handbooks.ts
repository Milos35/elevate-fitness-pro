export const HANDBOOK_IDS = ["eat-nutrition", "fuel-supplements", "muscle-handbook", "busy-strong-7day"] as const;

export type HandbookId = (typeof HANDBOOK_IDS)[number];

type HandbookMeta = {
  id: HandbookId;
  /** Filename inside `public/handbooks/` */
  filename: string;
  /** Attachment filename in email */
  attachmentName: string;
  emailTitle: string;
};

export const HANDBOOKS: HandbookMeta[] = [
  {
    id: "eat-nutrition",
    filename: "EAT_Nutrition_Guide.pdf",
    attachmentName: "EAT_Nutrition_Guide.pdf",
    emailTitle: "EAT Nutrition Guide",
  },
  {
    id: "fuel-supplements",
    filename: "FUEL_Supplement_Guide.pdf",
    attachmentName: "FUEL_Supplement_Guide.pdf",
    emailTitle: "FUEL Supplement Guide",
  },
  {
    id: "muscle-handbook",
    filename: "Muscle_Handbook_Milos_Ilic.pdf",
    attachmentName: "Muscle_Handbook_by_Milos_Ilic.pdf",
    emailTitle: "Muscle Handbook by Milos Ilic",
  },
  {
    id: "busy-strong-7day",
    filename: "Busy_Strong_7Day_CoachMilos.pdf",
    attachmentName: "Busy_Strong_7Day_CoachMilos.pdf",
    emailTitle: "Busy Strong 7-Day Starter",
  },
];

const byId = new Map(HANDBOOKS.map((h) => [h.id, h]));

export function isHandbookId(value: string): value is HandbookId {
  return byId.has(value as HandbookId);
}

export function handbookMeta(id: HandbookId): HandbookMeta {
  const meta = byId.get(id);
  if (!meta) throw new Error(`Unknown handbook: ${id}`);
  return meta;
}

/** Load handbook PDF from static `/handbooks/` on this deployment (no fs). */
export async function readHandbookPdf(id: HandbookId): Promise<Buffer> {
  const meta = handbookMeta(id);
  const origin = process.env.SITE_URL?.trim().replace(/\/$/, "") || "https://busystrong90.com";
  const url = `${origin}/handbooks/${encodeURIComponent(meta.filename)}`;
  const r = await fetch(url);
  if (!r.ok) {
    throw new Error(`Handbook file missing on server: ${meta.filename} (${r.status})`);
  }
  return Buffer.from(await r.arrayBuffer());
}
