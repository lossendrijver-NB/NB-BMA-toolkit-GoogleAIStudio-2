import type { Ambition, Case, ContactPerson, Service } from "./types";

export type ContentSnapshot = {
  ambitions: Ambition[];
  services: Omit<Service, "ambitionIds" | "caseIds">[];
  cases: Case[];
  contacts: ContactPerson[];
};
export type ImportPreview = {
  source: "NB-BMA-Toolkit";
  additions: ContentSnapshot;
  conflicts: { collection: keyof ContentSnapshot; id: string; reason: string }[];
};

/** Future Notion adapter supplies normalized records here; this function never writes or mutates content. */
export async function previewNotionAdditions(
  existing: ContentSnapshot,
  incoming: ContentSnapshot,
): Promise<ImportPreview> {
  const additions: ContentSnapshot = { ambitions: [], services: [], cases: [], contacts: [] };
  const conflicts: ImportPreview["conflicts"] = [];
  function collect<K extends keyof ContentSnapshot>(collection: K) {
    const ids = new Set(existing[collection].map((row) => row.id));
    const slugs = new Set(existing[collection].flatMap((row) => ("slug" in row ? [row.slug] : [])));
    for (const row of incoming[collection]) {
      const slug = "slug" in row ? row.slug : undefined;
      if (ids.has(row.id) || (slug && slugs.has(slug))) {
        conflicts.push({
          collection,
          id: row.id,
          reason: "Bestaand ID of bestaande slug; inhoud blijft ongewijzigd.",
        });
        continue;
      }
      ids.add(row.id);
      if (slug) slugs.add(slug);
      // Collection-specific array type is preserved by the caller's generic key.
      (additions[collection] as Array<ContentSnapshot[K][number]>).push(structuredClone(row));
    }
  }
  collect("ambitions");
  collect("services");
  collect("cases");
  collect("contacts");
  const available = {
    services: new Set([...existing.services, ...additions.services].map((row) => row.id)),
    contacts: new Set([...existing.contacts, ...additions.contacts].map((row) => row.id)),
  };
  for (const row of [...additions.ambitions, ...additions.cases]) {
    for (const id of row.serviceIds) {
      if (!available.services.has(id))
        conflicts.push({
          collection:
            "ambitions" in row
              ? "ambitions"
              : additions.ambitions.some((a) => a.id === row.id)
                ? "ambitions"
                : "cases",
          id: row.id,
          reason: `Onbekende dienstrelatie: ${id}`,
        });
    }
  }
  for (const row of [...additions.ambitions, ...additions.services]) {
    if (row.contactPersonId && !available.contacts.has(row.contactPersonId))
      conflicts.push({
        collection: additions.ambitions.some((a) => a.id === row.id) ? "ambitions" : "services",
        id: row.id,
        reason: `Onbekende contactpersoon: ${row.contactPersonId}`,
      });
  }
  return { source: "NB-BMA-Toolkit", additions, conflicts };
}
