import { useNavigate } from "@tanstack/react-router";
import { ArrowLeft, Check, ChevronDown, Search, X } from "lucide-react";
import { useEffect, useId, useLayoutEffect, useMemo, useRef, useState } from "react";
import { ambitionRepo, contactRepo, serviceRepo } from "@/content/repository";
import { clearBest, detectMode, rank, type SearchMode } from "@/lib/search";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import { ContactCard, ServiceCard, CardGrid } from "./ui-kit";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

const LABEL: Record<SearchMode, string> = { ambition: "Ambitie", service: "Dienst" };
const PLACEHOLDER: Record<SearchMode, string> = {
  ambition: "Wat wil de klant bereiken?",
  service: "Welke dienst zoekt de klant?",
};

type Item = { id: string; title: string; slug: string };

// FLIP: positie van de zoekbalk die zojuist is verdwenen, zodat de volgende balk
// (de andere variant) vanaf die plek naar zijn eigen plek kan glijden.
let lastBar: { rect: DOMRect; compact: boolean; t: number } | null = null;

export function SearchExperience({
  compact = false,
  initialMode = "ambition",
  onExpandedChange,
}: {
  compact?: boolean;
  initialMode?: SearchMode;
  onExpandedChange?: (expanded: boolean) => void;
}) {
  const navigate = useNavigate();
  const ambitions = ambitionRepo.all();
  const services = serviceRepo.all();
  const [query, setQuery] = useState("");
  const [mode, setMode] = useState<SearchMode>(initialMode);
  const [active, setActive] = useState(-1);
  const [submitted, setSubmitted] = useState(false);
  const [notice, setNotice] = useState("");
  const [focused, setFocused] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [intro, setIntro] = useState(!compact);
  const [expandedSuggestions, setExpandedSuggestions] = useState(false);
  const manualLock = useRef<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const listId = useId();

  const isExpanded = focused || query.trim().length > 0 || dropdownOpen;

  const isCompactCollapsed = compact && !isExpanded;
  const placeholderFull = PLACEHOLDER[mode];
  // Mobiel: korte tekst in ingeklapte compact-balk. Desktop: altijd de volledige tekst.
  const placeholderShort = isCompactCollapsed ? "Zoek" : placeholderFull;

  // FLIP: bij mount glijden vanaf de positie van de vorige balk (als dat de andere
  // variant was); bij unmount de eigen positie bewaren voor de volgende balk.
  useLayoutEffect(() => {
    const el = barRef.current;
    if (!el) return;

    const prev = lastBar;
    lastBar = null;

    if (
      prev &&
      prev.compact !== compact &&
      performance.now() - prev.t < 1000 &&
      !window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      const to = el.getBoundingClientRect();
      const from = prev.rect;
      const dx = from.left - to.left;
      const dy = from.top - to.top;
      const easing = "cubic-bezier(0.22, 1, 0.36, 1)";

      if (window.matchMedia("(max-width: 767px)").matches) {
        // Mobiel: alleen positie + fade. Geen width-animatie, dus geen layout per frame.
        el.animate(
          [
            { transform: `translate(${dx}px, ${dy}px)`, opacity: 0 },
            { transform: "translate(0, 0)", opacity: 1 },
          ],
          { duration: 400, easing },
        );
      } else {
        // Desktop: glijden én van breedte veranderen.
        el.animate(
          [
            {
              transform: `translate(${dx}px, ${dy}px)`,
              width: `${from.width}px`,
              maxWidth: `${from.width}px`,
            },
            {
              transform: "translate(0, 0)",
              width: `${to.width}px`,
              maxWidth: `${to.width}px`,
            },
          ],
          { duration: 450, easing },
        );
      }
    }

    return () => {
      lastBar = { rect: el.getBoundingClientRect(), compact, t: performance.now() };
    };
    // Alleen bij mount/unmount, niet bij elke render.
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    onExpandedChange?.(isExpanded);
  }, [isExpanded, onExpandedChange]);

  useEffect(() => {
    if (!intro) return;
    // Na de laatste chip de class weghalen, zodat latere wijzigingen niet animeren.
    const t = setTimeout(() => setIntro(false), 1500);
    return () => clearTimeout(t);
  }, [intro]);

  useEffect(() => {
    setExpandedSuggestions(false);
  }, [mode, query]);

  // Debounced auto-detection of content type.
  useEffect(() => {
    if (!query.trim()) return;
    const t = setTimeout(() => {
      if (manualLock.current === query) return;
      const out = detectMode(query, mode, ambitions, services);
      if (out.mode !== mode) {
        setMode(out.mode);
        setNotice(`Overgeschakeld naar ${LABEL[out.mode]}`);
      }
    }, 280);
    return () => clearTimeout(t);
  }, [query]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!notice) return;
    const t = setTimeout(() => setNotice(""), 2200);
    return () => clearTimeout(t);
  }, [notice]);

  const results = useMemo(() => {
    const list: Item[] = mode === "ambition" ? ambitions : services;
    if (!query.trim()) return list.map((item) => ({ item, score: 0 }));
    return mode === "ambition" ? rank(query, ambitions) : rank(query, services);
  }, [query, mode, ambitions, services]);

  const items = results.map((r) => r.item);
  const noResults = query.trim().length > 0 && items.length === 0;

  function go(item: Item, m: SearchMode = mode) {
    if (m === "ambition") navigate({ to: "/ambitie/$slug", params: { slug: item.slug } });
    else navigate({ to: "/dienst/$slug", params: { slug: item.slug } });
  }

  function switchMode(m: SearchMode) {
    setMode(m);
    setActive(-1);
    manualLock.current = query;
    inputRef.current?.focus();
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "ArrowDown" && items.length) {
      e.preventDefault();
      setActive((i) => {
        const next = (i + 1) % items.length;
        if (next >= 2) setExpandedSuggestions(true);
        return next;
      });
    } else if (e.key === "ArrowUp" && items.length) {
      e.preventDefault();
      setActive((i) => {
        const next = i <= 0 ? items.length - 1 : i - 1;
        if (next >= 2) setExpandedSuggestions(true);
        return next;
      });
    } else if (e.key === "Escape") {
      if (active >= 0) setActive(-1);
      else {
        setQuery("");
        setSubmitted(false);
      }
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (active >= 0 && items[active]) return go(items[active]);
      if (!query.trim()) return;
      const out = detectMode(query, mode, ambitions, services);
      const pool = out.mode === "ambition" ? out.ambitions : out.services;
      const best = clearBest<Item>(pool);
      if (best) return go(best, out.mode);
      if (out.mode !== mode) setMode(out.mode);
      setSubmitted(true);
    }
  }

  const fallbackServices = noResults
    ? rank(query, services, 10)
        .slice(0, 3)
        .map((r) => r.item)
    : [];
  const fallbackContact = contactRepo.fallback();

  return (
    <div className={cn(compact ? "compact-search" : "home-search", isExpanded && "is-expanded")}>
      {!compact && (
        <h1 className="home-heading">
          Wat wil je weten over
          <br />
          NOBEARS Amersfoort?
        </h1>
      )}
      <div
        ref={barRef}
        className="search-bar focus-within:ring-1 focus-within:ring-ring cursor-text"
        onClick={(e) => {
          if (!(e.target as HTMLElement).closest("button")) {
            inputRef.current?.focus();
          }
        }}
      >
        <label htmlFor={`${listId}-q`} className="sr-only">
          Zoeken in {LABEL[mode] === "Ambitie" ? "ambities" : "diensten"}
        </label>
        <div className="flex min-w-0 flex-1 items-center">
          {/* Terugknop: alleen mobiel (<900px) en alleen als de balk actief is */}
          {compact && isExpanded && (
            <Button
              variant="ghost"
              type="button"
              aria-label="Zoeken sluiten"
              onClick={(e) => {
                e.stopPropagation();
                setFocused(false);
                setQuery("");
                setDropdownOpen(false);
                inputRef.current?.blur();
              }}
              className="grid size-7 shrink-0 place-items-center rounded-full text-muted-foreground hover:bg-surface-raised hover:text-foreground -ml-1 mr-1 min-[900px]:hidden"
            >
              <ArrowLeft className="size-4" />
            </Button>
          )}

          {/* Zoekicoon: altijd zichtbaar, behalve op mobiel wanneer de terugknop het overneemt */}
          <Search
            className={cn(
              "shrink-0 text-muted-foreground pointer-events-none transition-colors",
              compact
                ? "size-3 min-[900px]:size-3.5 ml-0.5 mr-2"
                : "size-3.5 md:size-4 ml-1.5 mr-2.5",
              focused && "text-foreground",
              compact && isExpanded && "hidden min-[900px]:block",
            )}
            aria-hidden="true"
          />

          {/* Input + shimmer-overlay. De echte placeholder is transparant,
              de overlay-tekst eroverheen krijgt het shimmer-effect.
              Op de homepage staat de shimmer op volle sterkte; in de compacte
              balk (vervolgpagina's) wordt hij rustiger (zie .placeholder-shimmer--calm in de CSS). */}
          <div className="relative flex min-w-0 flex-1 items-center">
            <input
              ref={inputRef}
              id={`${listId}-q`}
              role="combobox"
              aria-expanded={items.length > 0}
              aria-controls={listId}
              aria-autocomplete="list"
              aria-activedescendant={active >= 0 ? `${listId}-${active}` : undefined}
              autoComplete="off"
              value={query}
              onFocus={() => setFocused(true)}
              onBlur={() => {
                setTimeout(() => setFocused(false), 200);
              }}
              onChange={(e) => {
                setQuery(e.target.value);
                setActive(-1);
                setSubmitted(false);
                manualLock.current = null;
              }}
              onKeyDown={onKeyDown}
              placeholder={placeholderFull}
              className={cn(
                "search-input w-full placeholder:!text-transparent",
                compact && "compact-input",
              )}
            />
            {!query && (
              <span
                aria-hidden="true"
                className={cn(
                  "search-input pointer-events-none absolute inset-0 flex items-center",
                  compact && "compact-input",
                )}
              >
                <span
                  className={cn(
                    "placeholder-shimmer truncate min-[900px]:hidden",
                    compact && "placeholder-shimmer--calm",
                  )}
                >
                  {placeholderShort}
                </span>
                <span
                  className={cn(
                    "placeholder-shimmer hidden truncate min-[900px]:inline",
                    compact && "placeholder-shimmer--calm",
                  )}
                >
                  {placeholderFull}
                </span>
              </span>
            )}
          </div>

          {query && (
            <Button
              variant="ghost"
              type="button"
              aria-label="Zoekopdracht wissen"
              onClick={() => {
                setQuery("");
                inputRef.current?.focus();
              }}
              className="grid size-7 shrink-0 place-items-center rounded-full text-muted-foreground hover:bg-surface-raised hover:text-foreground mr-1"
            >
              <X className="size-3.5" />
            </Button>
          )}
        </div>

        {/* Desktop: toggle (pill buttons).
            De wrapper heeft geen eigen CSS-klasse, zodat `hidden` niet overschreven
            wordt door `display: grid` van .mode-switch. */}
        <div className={cn("shrink-0", compact ? "hidden min-[900px]:block" : "hidden md:block")}>
          <div role="radiogroup" aria-label="Zoekmodus" className="mode-switch">
            {(["ambition", "service"] as const).map((m) => (
              <Button
                variant="ghost"
                key={m}
                type="button"
                role="radio"
                aria-checked={mode === m}
                onClick={() => switchMode(m)}
                className="mode-option"
              >
                {LABEL[m]}
              </Button>
            ))}
          </div>
        </div>

        {/* Mobiel: dropdown, exact op de plek van de toggle.
            modal={false} voorkomt dat Radix de body-scroll vergrendelt en daar
            padding/margin voor toevoegt (waardoor de zoekbalk smaller werd). */}
        <div className={cn("shrink-0", compact ? "min-[900px]:hidden" : "md:hidden mr-1.5")}>
          <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen} modal={false}>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                type="button"
                aria-label="Kies zoekmodus"
                className={cn(
                  "h-7 px-2.5 rounded-full bg-surface-raised hover:bg-surface-raised/80 text-xs font-medium text-foreground flex items-center gap-1.5 shrink-0 transition-all border border-border/50",
                  dropdownOpen && "border-[#F65C46]/50 bg-[#F65C46]/10 text-white",
                )}
              >
                {/* Beide labels in dezelfde cel: de knop is altijd zo breed als het langste label */}
                <span className="grid">
                  {(["ambition", "service"] as const).map((m) => (
                    <span
                      key={m}
                      aria-hidden={m !== mode}
                      className={cn("col-start-1 row-start-1 text-left", m !== mode && "invisible")}
                    >
                      {LABEL[m]}
                    </span>
                  ))}
                </span>
                <ChevronDown
                  className={cn(
                    "size-3 text-muted-foreground transition-transform duration-200",
                    dropdownOpen && "rotate-180 text-foreground",
                  )}
                />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              sideOffset={8}
              className="w-44 rounded-2xl border border-border bg-background/95 p-1.5 shadow-2xl backdrop-blur-md z-50"
            >
              <DropdownMenuItem
                onClick={() => switchMode("ambition")}
                className="flex items-center justify-between rounded-xl px-3 py-2 text-sm font-medium cursor-pointer transition-colors hover:bg-surface-raised focus:bg-surface-raised"
              >
                <div className="flex items-center gap-2">
                  <span
                    className={cn(
                      "size-2 rounded-full",
                      mode === "ambition" ? "bg-[#F65C46]" : "bg-muted-foreground/30",
                    )}
                  />
                  <span>Ambitie</span>
                </div>
                {mode === "ambition" && <Check className="size-4 text-[#F65C46]" />}
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => switchMode("service")}
                className="flex items-center justify-between rounded-xl px-3 py-2 text-sm font-medium cursor-pointer transition-colors hover:bg-surface-raised focus:bg-surface-raised"
              >
                <div className="flex items-center gap-2">
                  <span
                    className={cn(
                      "size-2 rounded-full",
                      mode === "service" ? "bg-[#F65C46]" : "bg-muted-foreground/30",
                    )}
                  />
                  <span>Dienst</span>
                </div>
                {mode === "service" && <Check className="size-4 text-[#F65C46]" />}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <span aria-live="polite" className="sr-only">
        {notice}
      </span>

      {(!compact || query) && !noResults && (
        <section
          className={cn(
            "mt-5 text-left",
            compact &&
              "absolute top-full left-0 right-0 mt-2 max-h-[80vh] overflow-y-auto rounded-lg border border-border bg-background/95 p-4 shadow-2xl backdrop-blur-md z-50",
          )}
        >
          <h2 className="text-xs text-muted-foreground">
            {submitted
              ? "Meerdere resultaten — kies wat je bedoelt"
              : `Voorgestelde ${mode === "ambition" ? "ambities" : "diensten"}`}
          </h2>
          <ul
            id={listId}
            role="listbox"
            aria-label="Suggesties"
            className="mt-3 flex flex-wrap gap-x-2 gap-y-1.5"
          >
            {(expandedSuggestions ? items : items.slice(0, 2)).map((item, i) => (
              <li
                key={item.id}
                id={`${listId}-${i}`}
                role="option"
                aria-selected={i === active}
                className={cn("min-w-0", intro && "chip-intro")}
                style={intro ? { animationDelay: `${Math.min(i, 14) * 40}ms` } : undefined}
              >
                <Button
                  variant="ghost"
                  type="button"
                  tabIndex={0}
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => go(item)}
                  className={cn(
                    "suggestion-chip transition-all duration-200 hover:border-[#F65C46] hover:bg-[#F65C46]/15 hover:text-white",
                    i === active &&
                      "border-[#F65C46] bg-[#F65C46]/20 text-white ring-2 ring-[#F65C46]/40",
                  )}
                >
                  {item.title}
                </Button>
              </li>
            ))}

            {!expandedSuggestions && items.length > 2 && (
              <li className={cn("min-w-0", intro && "chip-intro")}>
                <Button
                  variant="ghost"
                  type="button"
                  tabIndex={0}
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => setExpandedSuggestions(true)}
                  className="suggestion-chip px-3.5 font-medium text-foreground/90 transition-all duration-200 hover:border-[#F65C46] hover:bg-[#F65C46]/15 hover:text-white cursor-pointer"
                  aria-label={`Toon nog ${items.length - 2} voorgestelde resultaten`}
                >
                  +{items.length - 2}
                </Button>
              </li>
            )}

            {expandedSuggestions && items.length > 2 && (
              <li className="min-w-0">
                <Button
                  variant="ghost"
                  type="button"
                  tabIndex={0}
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => setExpandedSuggestions(false)}
                  className="suggestion-chip px-3 text-xs opacity-70 hover:opacity-100 transition-all duration-200 hover:border-[#F65C46] hover:bg-[#F65C46]/15 hover:text-white cursor-pointer"
                  aria-label="Minder suggesties tonen"
                >
                  Minder tonen
                </Button>
              </li>
            )}
          </ul>
          <p className="sr-only">
            Gebruik pijltjestoetsen om een suggestie te kiezen en Enter om te openen.
          </p>
        </section>
      )}

      {(!compact || query) && noResults && (
        <section
          aria-live="polite"
          className={cn(
            "mt-8 text-left",
            compact &&
              "absolute top-full left-0 right-0 mt-2 max-h-[80vh] overflow-y-auto rounded-lg border border-border bg-background/95 p-4 shadow-2xl backdrop-blur-md z-50",
          )}
        >
          <h2 className="text-2xl font-medium">We herkennen je zoekopdracht niet.</h2>
          {fallbackServices.length > 0 ? (
            <>
              <p className="mt-2 text-muted-foreground">Bedoel je soms…</p>
              <div className="mt-6">
                <CardGrid>
                  {fallbackServices.map((s) => (
                    <ServiceCard key={s.id} service={s} />
                  ))}
                </CardGrid>
              </div>
            </>
          ) : (
            <p className="mt-2 text-muted-foreground">
              Probeer een andere omschrijving, of wis je zoekopdracht om alle{" "}
              {mode === "ambition" ? "ambities" : "diensten"} te zien.
            </p>
          )}
          <div className="mt-8 max-w-md">
            {fallbackContact ? (
              <ContactCard
                person={fallbackContact}
                heading={`Niet gevonden wat je zoekt? Neem contact op met ${fallbackContact.name.split(" ")[0]}.`}
              />
            ) : (
              <p className="text-xs text-muted-foreground">
                Niet gevonden wat je zoekt? Vraag het je teamleider.
              </p>
            )}
          </div>
        </section>
      )}
    </div>
  );
}
