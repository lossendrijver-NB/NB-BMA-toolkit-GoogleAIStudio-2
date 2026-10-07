import { describe, expect, it } from "vitest";
import { clearBest, detectMode, rank } from "@/lib/search";
import { ambitions, services, cases, contacts } from "@/content/data";
import { serviceRepo, caseRepo } from "@/content/repository";
import { previewNotionAdditions } from "@/content/import-preview";

describe("NOBEARS knowledge system", () => {
  it("keeps all source records and explicit relations", () => {
    expect([ambitions.length, services.length, cases.length, contacts.length]).toEqual([
      12, 11, 6, 3,
    ]);
    for (const ambition of ambitions)
      expect(serviceRepo.forAmbition(ambition).map((s) => s.id)).toEqual(ambition.serviceIds);
    for (const service of serviceRepo.all())
      expect(caseRepo.forService(service).map((c) => c.id)).toEqual(
        cases.filter((c) => c.serviceIds.includes(service.id)).map((c) => c.id),
      );
  });
  it("matches typos, synonyms and smart modes without random navigation", () => {
    expect(rank("huisstijll", services)[0]?.item.slug).toBe("huisstijl");
    expect(rank("logo", services)[0]?.item.slug).toBe("huisstijl");
    expect(rank("propositie", ambitions)[0]?.item.slug).toBe("een-sterk-merk-neerzetten");
    expect(detectMode("Huisstijl", "ambition", ambitions, services).mode).toBe("service");
    expect(detectMode("Een sterk merk neerzetten", "service", ambitions, services).mode).toBe(
      "ambition",
    );
    expect(clearBest(rank("zzzzqqqq", services))).toBeUndefined();
    expect(clearBest(rank("content", services))).toBeUndefined();
  });
  it("previews additions without overwriting or mutating data", async () => {
    const existing = { ambitions, services, cases, contacts };
    const before = JSON.stringify(existing);
    const original = ambitions[0]!;
    const added = { ...original, id: "a-new", slug: "new-ambition" };
    const result = await previewNotionAdditions(existing, {
      ambitions: [original, added],
      services: [],
      cases: [],
      contacts: [],
    });
    expect(result.additions.ambitions.map((a) => a.id)).toEqual(["a-new"]);
    expect(result.conflicts).toHaveLength(1);
    expect(JSON.stringify(existing)).toBe(before);
  });
});
