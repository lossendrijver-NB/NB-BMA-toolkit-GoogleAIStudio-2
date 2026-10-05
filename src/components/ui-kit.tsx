import { Link, type LinkProps } from "@tanstack/react-router";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { cloneElement, isValidElement, useState, type ReactElement, type ReactNode } from "react";
import type { Case, ContactPerson, Service } from "@/content/types";
import { NobearsLogo } from "./NobearsLogo";
import { SearchExperience } from "./SearchExperience";
import { Button } from "./ui/button";

export function AmbientBackground() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute inset-0 bg-dots" />
      <div className="absolute inset-x-0 top-0 h-screen bg-glow" />
    </div>
  );
}
export function AppShell({
  children,
  detail = false,
  headerRight,
}: {
  children: ReactNode;
  detail?: boolean;
  headerRight?: ReactNode;
}) {
  return (
    <div className={`relative isolate min-h-screen ${detail ? "detail-shell" : ""}`}>
      <AmbientBackground />
      <header className={`app-header ${detail ? "detail-header" : "home-header"}`}>
        <div className="header-inner">
          <div className="header-logo-slot">
            <NobearsLogo />
          </div>
          {headerRight && <div className="header-search-container">{headerRight}</div>}
        </div>
      </header>
      <main className="app-main">{children}</main>
    </div>
  );
}
export function BackButton({ label = "Terug", ...rest }: LinkProps & { label?: string }) {
  return (
    <Button
      asChild
      variant="outline"
      className="h-9 rounded-full bg-chip px-3.5 font-normal transition-all hover:border-[#F65C46] hover:bg-[#F65C46]/10 hover:text-white"
    >
      <Link {...rest}>
        <ArrowLeft className="size-4" aria-hidden />
        {label}
      </Link>
    </Button>
  );
}
export function DetailLayout({
  back,
  title,
  intro,
  body,
  aside,
  sectionTitle,
  children,
}: {
  back: ReactNode;
  title: string;
  intro: string;
  body: string[];
  aside?: ReactNode;
  sectionTitle: string;
  children: ReactNode;
}) {
  return (
    <div className="detail-layout">
      <div className="detail-intro">
        {back}
        <h1 className="detail-title">{title}</h1>
        <p className="detail-copy mt-6">{intro}</p>
        <div className="detail-copy mt-6 space-y-4">
          {body.map((text, i) => (
            <p key={i}>{text}</p>
          ))}
        </div>
        {aside && <div className="mt-16 lg:mt-28">{aside}</div>}
      </div>
      <section className="detail-content" aria-label={sectionTitle}>
        <h2>{sectionTitle}</h2>
        {children}
      </section>
    </div>
  );
}
export function CardGrid({ children, cases = false }: { children: ReactNode; cases?: boolean }) {
  return (
    <ul className={cases ? "case-feed" : "grid gap-x-[18px] gap-y-7 sm:grid-cols-2"}>{children}</ul>
  );
}
export function ServiceCard({ service, from }: { service: Service; from?: string }) {
  return (
    <li className="min-w-0">
      <Link
        to="/dienst/$slug"
        params={{ slug: service.slug }}
        search={from ? { from } : {}}
        className="group flex h-full flex-col rounded-lg border border-border bg-surface p-[15px] transition-colors hover:border-primary/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        <div className="aspect-[369/204] overflow-hidden rounded">
          <img
            src={service.image}
            alt=""
            loading="lazy"
            width={1088}
            height={608}
            className="size-full object-cover"
          />
        </div>
        <h3 className="mt-6 text-lg font-medium leading-tight">{service.title}</h3>
        <p className="mt-2 flex-1 text-base leading-snug text-muted-foreground">
          {service.shortDescription}
        </p>
        <span className="mt-8 inline-flex items-center gap-2 text-base">
          Ontdek meer
          <ArrowUpRight className="size-4 text-primary" aria-hidden />
        </span>
      </Link>
    </li>
  );
}
export function CaseCard({ item }: { item: Case }) {
  return (
    <li>
      <article>
        <div className="case-media aspect-[16/7] overflow-hidden rounded-lg">
          <img
            src={item.image}
            alt={`${item.clientName} — ${item.title}`}
            loading="lazy"
            width={1200}
            height={525}
            className="size-full object-cover"
          />
        </div>
        <h3 className="mt-4 text-base font-normal">
          {item.clientName}
          <span className="mx-2">·</span>
          {item.title}
        </h3>
        <p className="mt-2 text-base leading-relaxed text-muted-foreground">
          {item.shortDescription}
        </p>
      </article>
    </li>
  );
}
export function ContactCard({
  person,
  heading = "Vragen? Neem contact op",
}: {
  person: ContactPerson;
  heading?: string;
}) {
  const initials = person.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2);
  return (
    <aside aria-label="Contactpersoon" className="rounded-lg bg-contact p-[22px]">
      <h2 className="text-base font-medium">{heading}</h2>
      <p className="mt-5 break-words text-base leading-snug text-muted-foreground">
        Mail {person.name} op{" "}
        <a
          href={`mailto:${person.email}`}
          className="underline underline-offset-2 hover:text-foreground"
        >
          {person.email}
        </a>
        {person.phone && (
          <>
            {" "}
            of bel ons op{" "}
            <a
              href={`tel:${person.phone.replace(/\s/g, "")}`}
              className="underline underline-offset-2 hover:text-foreground"
            >
              {person.phone}
            </a>
          </>
        )}
        .
      </p>
      <div className="mt-5 grid grid-cols-[58px_minmax(0,1fr)] items-center gap-4">
        {person.photo ? (
          <img
            src={person.photo}
            alt={person.name}
            width={58}
            height={58}
            className="size-[58px] rounded-sm object-cover"
          />
        ) : (
          <div
            aria-hidden
            className="grid size-[58px] place-items-center rounded-sm bg-surface-raised"
          >
            {initials}
          </div>
        )}
        <div className="min-w-0">
          <p className="font-medium">{person.name}</p>
          <p className="text-sm text-muted-foreground">{person.role}</p>
        </div>
      </div>
      {person.note && <p className="mt-3 text-xs text-muted-foreground">{person.note}</p>}
    </aside>
  );
}
