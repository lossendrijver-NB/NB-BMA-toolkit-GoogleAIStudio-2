import { createFileRoute, notFound } from "@tanstack/react-router";

import { z } from "zod";
import { ambitionRepo, caseRepo, contactRepo, serviceRepo } from "@/content/repository";
import {
  AppShell,
  BackButton,
  CardGrid,
  CaseCard,
  ContactCard,
  DetailLayout,
} from "@/components/ui-kit";
import { SearchExperience } from "@/components/SearchExperience";

export const Route = createFileRoute("/dienst/$slug")({
  // `from` = slug of the ambition the user came from; drives the back button.
  validateSearch: (input: Record<string, unknown>) =>
    z.object({ from: z.string().optional().catch(undefined) }).parse(input),
  loader: ({ params }) => {
    const service = serviceRepo.bySlug(params.slug);
    if (!service) throw notFound();
    return { service };
  },
  head: ({ loaderData }) => {
    if (!loaderData)
      return {
        meta: [{ title: "Dienst niet gevonden — NOBEARS" }, { name: "robots", content: "noindex" }],
      };
    const s = loaderData.service;
    return {
      meta: [
        { property: "og:type", content: "website" },
        { name: "twitter:card", content: "summary_large_image" },
        { title: `${s.title} — NOBEARS Kennisbank` },
        { name: "description", content: s.shortDescription },
        { property: "og:title", content: s.title },
        { property: "og:description", content: s.shortDescription },
      ],
    };
  },
  component: ServicePage,
});

function ServicePage() {
  const { service } = Route.useLoaderData();
  const { from } = Route.useSearch();
  const origin = from ? ambitionRepo.bySlug(from) : undefined;
  const linked = origin && origin.serviceIds.includes(service.id) ? origin : undefined;
  const cases = caseRepo.forService(service);
  const contact = contactRepo.byId(service.contactPersonId);
  return (
    <AppShell detail headerRight={<SearchExperience compact initialMode="service" />}>
      <DetailLayout
        back={
          linked ? (
            <BackButton
              to="/ambitie/$slug"
              params={{ slug: linked.slug }}
              label={`Terug naar ${linked.title}`}
            />
          ) : (
            <BackButton to="/" />
          )
        }
        title={service.title}
        intro={service.korteIntro || service.shortIntro || service.shortDescription}
        body={service.description}
        aside={contact && <ContactCard person={contact} />}
        sectionTitle="Cases"
      >
        {cases.length ? (
          <CardGrid cases>
            {cases.map((c) => (
              <CaseCard key={c.id} item={c} />
            ))}
          </CardGrid>
        ) : (
          <p className="text-muted-foreground">Er zijn nog geen cases aan deze dienst gekoppeld.</p>
        )}
      </DetailLayout>
    </AppShell>
  );
}
