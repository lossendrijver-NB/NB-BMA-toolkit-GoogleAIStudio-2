import { createFileRoute, notFound } from "@tanstack/react-router";
import { ambitionRepo, contactRepo, serviceRepo } from "@/content/repository";
import {
  AppShell,
  BackButton,
  CardGrid,
  ContactCard,
  DetailLayout,
  ServiceCard,
} from "@/components/ui-kit";
import { SearchExperience } from "@/components/SearchExperience";

export const Route = createFileRoute("/ambitie/$slug")({
  loader: ({ params }) => {
    const ambition = ambitionRepo.bySlug(params.slug);
    if (!ambition) throw notFound();
    return { ambition };
  },
  head: ({ loaderData }) => {
    if (!loaderData)
      return {
        meta: [
          { title: "Ambitie niet gevonden — NOBEARS" },
          { name: "robots", content: "noindex" },
        ],
      };
    const a = loaderData.ambition;
    return {
      meta: [
        { property: "og:type", content: "website" },
        { name: "twitter:card", content: "summary_large_image" },
        { title: `${a.title} — NOBEARS Kennisbank` },
        { name: "description", content: a.shortDescription },
        { property: "og:title", content: a.title },
        { property: "og:description", content: a.shortDescription },
      ],
    };
  },
  component: AmbitionPage,
});

function AmbitionPage() {
  const { ambition } = Route.useLoaderData();
  const services = serviceRepo.forAmbition(ambition);
  const contact = contactRepo.byId(ambition.contactPersonId);
  return (
    <AppShell detail headerRight={<SearchExperience compact initialMode="ambition" />}>
      <DetailLayout
        back={<BackButton to="/" />}
        title={ambition.title}
        intro={ambition.shortDescription}
        body={ambition.description}
        aside={contact && <ContactCard person={contact} />}
        sectionTitle="Onze diensten die op deze ambitie aansluiten"
      >
        {services.length ? (
          <CardGrid>
            {services.map((s) => (
              <ServiceCard key={s.id} service={s} from={ambition.slug} />
            ))}
          </CardGrid>
        ) : (
          <p className="text-muted-foreground">
            Er zijn nog geen diensten aan deze ambitie gekoppeld.
          </p>
        )}
      </DetailLayout>
    </AppShell>
  );
}
