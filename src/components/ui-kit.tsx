import { Link, type LinkProps } from "@tanstack/react-router";
import {
  ArrowLeft,
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
  PanelLeftClose,
  PanelLeftOpen,
  Play,
  Video,
} from "lucide-react";
import {
  cloneElement,
  isValidElement,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactElement,
  type ReactNode,
} from "react";
import type { Case, CaseMediaItem, ContactPerson, Service } from "@/content/types";
import { cn } from "@/lib/utils";
import { NobearsLogo } from "./NobearsLogo";
import { Button } from "./ui/button";

// Cache for automatically retrieved video thumbnails across components
const videoThumbnailCache = new Map<string, string>();

export function useVideoThumbnail(url: string | undefined, fallbackPoster?: string) {
  const [thumbnail, setThumbnail] = useState<string | null>(() => {
    if (!url) return fallbackPoster || null;
    return videoThumbnailCache.get(url) || null;
  });

  useEffect(() => {
    if (!url) {
      setThumbnail(fallbackPoster || null);
      return;
    }

    if (videoThumbnailCache.has(url)) {
      setThumbnail(videoThumbnailCache.get(url)!);
      return;
    }

    let isMounted = true;

    // 1. Check for Vimeo URL
    const vimeoMatch = url.match(/(?:vimeo\.com\/|player\.vimeo\.com\/video\/)(\d+)/);
    if (vimeoMatch && vimeoMatch[1]) {
      const vimeoId = vimeoMatch[1];
      fetch(`https://vimeo.com/api/oembed.json?url=https%3A//vimeo.com/${vimeoId}`)
        .then((res) => (res.ok ? res.json() : null))
        .then((data) => {
          if (data?.thumbnail_url && isMounted) {
            videoThumbnailCache.set(url, data.thumbnail_url);
            setThumbnail(data.thumbnail_url);
          }
        })
        .catch(() => {});
      return () => {
        isMounted = false;
      };
    }

    // 2. Direct MP4 / WebM / Bunny CDN video: capture representative frame via HTML5 video + canvas
    if (
      /\.(mp4|webm|ogg|mov)(\?.*)?$/i.test(url) ||
      url.includes("b-cdn.net") ||
      url.includes("bunnycdn.com")
    ) {
      if (typeof document === "undefined") return;

      const video = document.createElement("video");
      video.crossOrigin = "anonymous";
      video.src = url;
      video.preload = "metadata";
      video.muted = true;
      video.playsInline = true;

      const handleSeeked = () => {
        try {
          const canvas = document.createElement("canvas");
          canvas.width = video.videoWidth || 1920;
          canvas.height = video.videoHeight || 1080;
          const ctx = canvas.getContext("2d");
          if (ctx) {
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
            const dataUrl = canvas.toDataURL("image/jpeg", 0.9);
            if (isMounted && dataUrl && dataUrl.length > 200) {
              videoThumbnailCache.set(url, dataUrl);
              setThumbnail(dataUrl);
            }
          }
        } catch {
          // If cross-origin restrictions apply, native video preview element handles it
        } finally {
          cleanup();
        }
      };

      const handleLoadedMetadata = () => {
        // Seek to 1 second into the video to avoid initial black frames
        video.currentTime = Math.min(1.0, (video.duration || 2) / 2);
      };

      const cleanup = () => {
        video.removeEventListener("loadedmetadata", handleLoadedMetadata);
        video.removeEventListener("seeked", handleSeeked);
        video.src = "";
      };

      video.addEventListener("loadedmetadata", handleLoadedMetadata);
      video.addEventListener("seeked", handleSeeked);
      video.load();

      return () => {
        isMounted = false;
        cleanup();
      };
    }
  }, [url, fallbackPoster]);

  return thumbnail || fallbackPoster;
}

export function AmbientBackground({ detail = false }: { detail?: boolean }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (detail) return; // Detail pages remain calm and focused

    if (
      typeof window === "undefined" ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }

    let rafId: number;
    let targetX = 0;
    let targetY = 0;
    let targetScale = 1;
    let targetIntensity = 0.65;

    let currentX = 0;
    let currentY = 0;
    let currentScale = 1;
    let currentIntensity = 0.65;

    const handlePointerMove = (e: PointerEvent) => {
      const width = window.innerWidth;
      const height = window.innerHeight;

      // The ambient gradient focal center sits in the upper-center of the homepage
      const glowCenterX = width * 0.5;
      const glowCenterY = Math.min(height * 0.3, 280);

      const dx = e.clientX - glowCenterX;
      const dy = e.clientY - glowCenterY;
      const distance = Math.sqrt(dx * dx + dy * dy);

      // Proximity threshold: only react when the cursor approaches the glow neighborhood
      const threshold = Math.max(width * 0.45, 460);

      if (distance <= threshold) {
        // Non-linear proximity falloff
        const norm = 1 - distance / threshold;
        const proximity = Math.pow(norm, 1.6);

        // Fluid spring pull towards cursor (organic momentum, gentle swell)
        targetX = dx * 0.18 * proximity;
        targetY = dy * 0.18 * proximity;
        targetScale = 1 + 0.1 * proximity;
        targetIntensity = 0.65 + 0.2 * proximity;
      } else {
        // Far away: mouse has ZERO effect, resumes natural breathing rhythm
        targetX = 0;
        targetY = 0;
        targetScale = 1;
        targetIntensity = 0.65;
      }
    };

    const handlePointerLeave = () => {
      targetX = 0;
      targetY = 0;
      targetScale = 1;
      targetIntensity = 0.65;
    };

    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    window.addEventListener("pointerleave", handlePointerLeave, { passive: true });

    const animate = () => {
      // Smooth lerp damping (0.07) for organic fluid momentum
      currentX += (targetX - currentX) * 0.07;
      currentY += (targetY - currentY) * 0.07;
      currentScale += (targetScale - currentScale) * 0.07;
      currentIntensity += (targetIntensity - currentIntensity) * 0.07;

      if (containerRef.current) {
        containerRef.current.style.setProperty("--interactive-x", `${currentX.toFixed(2)}px`);
        containerRef.current.style.setProperty("--interactive-y", `${currentY.toFixed(2)}px`);
        containerRef.current.style.setProperty("--interactive-scale", currentScale.toFixed(3));
        containerRef.current.style.setProperty(
          "--interactive-intensity",
          currentIntensity.toFixed(3),
        );
      }

      rafId = requestAnimationFrame(animate);
    };

    rafId = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerleave", handlePointerLeave);
      cancelAnimationFrame(rafId);
    };
  }, [detail]);

  return (
    <div
      ref={containerRef}
      aria-hidden
      className={cn(
        "pointer-events-none fixed inset-0 -z-10 overflow-hidden",
        detail ? "detail-ambient" : "home-ambient",
      )}
      style={{
        // Default initial values
        // @ts-expect-error CSS custom variable
        "--interactive-x": "0px",
        "--interactive-y": "0px",
        "--interactive-scale": "1",
        "--interactive-intensity": "0.65",
      }}
    >
      <div className="absolute inset-0 bg-dots opacity-80" />

      {detail ? (
        <div className="absolute inset-x-0 top-0 h-screen bg-glow" />
      ) : (
        /* Signature NOBEARS #F65C46 lively ambient glow with breathing + mouse proximity */
        <div
          className="absolute inset-x-0 top-0 h-screen home-glow-interactive"
          style={{
            transform:
              "translate3d(var(--interactive-x), var(--interactive-y), 0) scale(var(--interactive-scale))",
            opacity: "var(--interactive-intensity)",
            transition: "opacity 0.25s ease-out",
          }}
        >
          {/* Autonomous organic core breathing layer */}
          <div className="absolute inset-0 home-glow-core ambient-breathe" />
          {/* Pulsating focal bloom layer */}
          <div className="absolute inset-0 home-glow-pulse ambient-pulse" />
          {/* Flowing liquid wave layer */}
          <div className="absolute inset-0 home-glow-wave ambient-wave" />
          {/* Wide ambient aura drift layer */}
          <div className="absolute inset-0 home-glow-aura ambient-drift" />
        </div>
      )}

      {/* Tactile film noise / grain overlay on top of background and interactive gradient */}
      <div className="noise-overlay" aria-hidden="true" />
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
    <div className={`relative isolate min-h-screen ${detail ? "detail-shell" : "home-shell"}`}>
      <AmbientBackground detail={detail} />
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
export function BackButton({
  label = "Terug",
  iconOnly = false,
  ...rest
}: LinkProps & { label?: string; iconOnly?: boolean }) {
  return (
    <Button
      asChild
      variant={iconOnly ? "ghost" : "outline"}
      className={cn(
        "rounded-full font-normal transition-all",
        iconOnly
          ? "size-9 p-0 inline-flex items-center justify-center shrink-0 border-0 bg-transparent text-white hover:bg-surface-raised hover:text-white shadow-none focus-visible:ring-1 focus-visible:ring-ring"
          : "h-9 px-3.5 bg-chip hover:border-[#F65C46] hover:bg-[#F65C46]/10 hover:text-white",
      )}
      title={label}
    >
      <Link {...rest}>
        <ArrowLeft className="size-4 shrink-0 text-white" aria-hidden />
        {!iconOnly && <span>{label}</span>}
        {iconOnly && <span className="sr-only">{label}</span>}
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
  const [panelCollapsed, setPanelCollapsed] = useState(false);

  return (
    <div className={cn("detail-layout", panelCollapsed && "panel-collapsed")}>
      {!panelCollapsed && (
        <div className="detail-intro">
          <div className="flex items-center justify-between gap-3">
            {back}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setPanelCollapsed(true)}
              className="hidden lg:inline-flex size-9 p-0 items-center justify-center rounded-full text-muted-foreground hover:text-foreground hover:bg-surface-raised cursor-pointer transition-colors"
              aria-label="Verberg paneel"
              title="Verberg paneel"
            >
              <PanelLeftClose className="size-4" />
            </Button>
          </div>
          <h1 className="detail-title">{title}</h1>
          <p className="detail-copy mt-6 font-medium text-foreground/90">{intro}</p>
          <div className="detail-copy mt-4 space-y-4">
            {body.map((text, i) => (
              <p key={i}>{text}</p>
            ))}
          </div>
          {aside && <div className="mt-16 lg:mt-28">{aside}</div>}
        </div>
      )}

      <section className="detail-content" aria-label={sectionTitle}>
        {panelCollapsed && (
          <div className="mb-8 pb-6 border-b border-border/40">
            <div className="flex items-center gap-3">
              {isValidElement(back)
                ? cloneElement(back as ReactElement<{ iconOnly?: boolean }>, {
                    iconOnly: true,
                  })
                : back}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setPanelCollapsed(false)}
                className="size-9 p-0 inline-flex items-center justify-center rounded-full hover:bg-surface-raised cursor-pointer transition-colors text-white"
                aria-label="Toon toelichting en contact"
                title="Toon toelichting en contact"
              >
                <PanelLeftOpen className="size-4 text-white" />
              </Button>
            </div>
            <h1 className="mt-4 text-[26px] sm:text-[30px] font-semibold font-heading tracking-tight text-foreground leading-tight">
              {title}
            </h1>
          </div>
        )}
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
          {service.korteIntro || service.shortIntro || service.shortDescription}
        </p>
        <span className="mt-8 inline-flex items-center gap-2 text-base">
          Ontdek meer
          <ArrowUpRight className="size-4 text-primary" aria-hidden />
        </span>
      </Link>
    </li>
  );
}

export function getVideoEmbed(url: string): { embedUrl: string; isIframe: boolean } {
  if (!url) return { embedUrl: "", isIframe: false };

  // Vimeo match
  const vimeoMatch = url.match(/(?:vimeo\.com\/|player\.vimeo\.com\/video\/)(\d+)/);
  if (vimeoMatch && vimeoMatch[1]) {
    return {
      embedUrl: `https://player.vimeo.com/video/${vimeoMatch[1]}?autoplay=1&dnt=1`,
      isIframe: true,
    };
  }

  // Bunny CDN stream / iframe
  if (
    url.includes("mediadelivery.net") ||
    url.includes("bunnycdn.com") ||
    url.includes("b-cdn.net")
  ) {
    if (url.includes("iframe.mediadelivery.net") || url.includes("/embed/")) {
      const sep = url.includes("?") ? "&" : "?";
      return { embedUrl: `${url}${sep}autoplay=true`, isIframe: true };
    }
    if (url.endsWith(".mp4") || url.endsWith(".webm") || url.endsWith(".m3u8")) {
      return { embedUrl: url, isIframe: false };
    }
    return { embedUrl: url, isIframe: true };
  }

  // Direct video file (.mp4, .webm)
  if (/\.(mp4|webm|ogg|mov)(\?.*)?$/i.test(url)) {
    return { embedUrl: url, isIframe: false };
  }

  // If already an embed or iframe URL
  if (url.includes("embed") || url.includes("player")) {
    return { embedUrl: url, isIframe: true };
  }

  return { embedUrl: url, isIframe: true };
}

function CaseSlideItem({
  slide,
  item,
  onPlay,
}: {
  slide: CaseMediaItem;
  item: Case;
  onPlay: () => void;
}) {
  const autoThumbnail = useVideoThumbnail(
    slide.type === "video" ? slide.url : undefined,
    slide.poster || item.image,
  );

  if (slide.type === "video") {
    return (
      <div className="relative size-full">
        {autoThumbnail ? (
          <img
            src={autoThumbnail}
            alt={slide.title || `${item.clientName} — ${item.title}`}
            loading="lazy"
            width={1920}
            height={1080}
            className="size-full object-cover transition-transform duration-300 group-hover/case:scale-[1.01]"
          />
        ) : (
          <video
            src={`${slide.url}#t=1`}
            preload="metadata"
            muted
            playsInline
            className="size-full object-cover pointer-events-none transition-transform duration-300 group-hover/case:scale-[1.01]"
          />
        )}

        {/* Play button overlay (no autoplay, plays on click) */}
        <div
          onClick={onPlay}
          className="absolute inset-0 flex flex-col items-center justify-center bg-black/35 hover:bg-black/25 transition-colors cursor-pointer group/play"
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              onPlay();
            }
          }}
          aria-label={`Speel video af voor ${item.clientName}`}
        >
          <div className="size-16 rounded-full bg-primary/95 text-white flex items-center justify-center shadow-xl shadow-primary/30 transition-transform group-hover/play:scale-110">
            <Play className="size-7 ml-1 fill-current" />
          </div>
          <span className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/60 text-xs font-medium text-white backdrop-blur-sm">
            <Video className="size-3.5 text-primary" />
            <span>Bekijk video</span>
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="relative size-full">
      <img
        src={slide.url || item.image}
        alt={slide.title || `${item.clientName} — ${item.title}`}
        loading="lazy"
        width={1920}
        height={1080}
        className="size-full object-cover transition-transform duration-300 group-hover/case:scale-[1.01]"
      />
    </div>
  );
}

export function CaseCard({ item }: { item: Case }) {
  const slides = useMemo(() => {
    const list: CaseMediaItem[] = [];
    if (item.media && item.media.length > 0) {
      list.push(...item.media);
    }

    // Video links from any property
    const videoSources = [
      ...(item.videos || []),
      ...(item.videolink ? [item.videolink] : []),
      ...(item.videoUrl ? [item.videoUrl] : []),
    ];
    for (const vUrl of videoSources) {
      if (!list.some((m) => m.url === vUrl)) {
        list.push({
          type: "video",
          url: vUrl,
          poster: item.image,
          title: `${item.clientName} video`,
        });
      }
    }

    // Image links from any property
    const imageSources = [
      ...(item.afbeeldingen || []),
      ...(item.images || []),
      ...(item.image ? [item.image] : []),
    ];
    for (const imgUrl of imageSources) {
      if (!list.some((m) => m.url === imgUrl)) {
        list.push({
          type: "image",
          url: imgUrl,
          title: `${item.clientName} visual`,
        });
      }
    }

    // Rule: "Als er een videolink is (Bunny CDN of Vimeo), dan moet de video als eerste getoond worden."
    const videos = list.filter((m) => m.type === "video");
    const nonVideos = list.filter((m) => m.type !== "video");
    const combined = [...videos, ...nonVideos];
    return combined.length > 0
      ? combined
      : [{ type: "image" as const, url: item.image, title: item.title }];
  }, [item]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);

  const activeSlide = slides[currentIndex] || slides[0];

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsPlaying(false);
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : slides.length - 1));
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsPlaying(false);
    setCurrentIndex((prev) => (prev < slides.length - 1 ? prev + 1 : 0));
  };

  const onTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    touchStartRef.current = { x: touch.clientX, y: touch.clientY };
  };

  const onTouchEnd = (e: React.TouchEvent) => {
    if (!touchStartRef.current) return;
    const touch = e.changedTouches[0];
    const dx = touch.clientX - touchStartRef.current.x;
    const dy = touch.clientY - touchStartRef.current.y;
    touchStartRef.current = null;

    // Detect horizontal swipe if deltaX is significant and primarily horizontal
    // This leaves vertical scrolling completely smooth and unaffected!
    if (Math.abs(dx) > 35 && Math.abs(dx) > Math.abs(dy) * 1.25) {
      if (dx < 0) {
        setIsPlaying(false);
        setCurrentIndex((prev) => (prev < slides.length - 1 ? prev + 1 : 0));
      } else {
        setIsPlaying(false);
        setCurrentIndex((prev) => (prev > 0 ? prev - 1 : slides.length - 1));
      }
    }
  };

  const embedInfo = activeSlide?.type === "video" ? getVideoEmbed(activeSlide.url) : null;

  return (
    <li>
      <article className="group/case">
        {/* Case media container: strictly 1920x1080 (16:9 ratio) */}
        <div
          className="case-media relative aspect-video overflow-hidden rounded-lg bg-surface border border-border/50 select-none"
          style={{ touchAction: "pan-y" }}
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
        >
          {activeSlide?.type === "video" && isPlaying && embedInfo ? (
            embedInfo.isIframe ? (
              <iframe
                src={embedInfo.embedUrl}
                title={activeSlide.title || `${item.clientName} video`}
                className="size-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            ) : (
              <video
                src={embedInfo.embedUrl}
                poster={activeSlide.poster || item.image}
                controls
                autoPlay
                playsInline
                className="size-full object-cover"
              />
            )
          ) : (
            <CaseSlideItem slide={activeSlide} item={item} onPlay={() => setIsPlaying(true)} />
          )}

          {/* Slider navigation arrows if multiple slides */}
          {slides.length > 1 && (
            <>
              <button
                type="button"
                onClick={handlePrev}
                className="absolute left-3 top-1/2 -translate-y-1/2 size-9 rounded-full bg-black/60 hover:bg-black/85 text-white flex items-center justify-center backdrop-blur-sm opacity-90 transition-opacity focus:outline-none focus-visible:ring-2 focus-visible:ring-primary cursor-pointer"
                aria-label="Vorige afbeelding"
              >
                <ChevronLeft className="size-5" />
              </button>
              <button
                type="button"
                onClick={handleNext}
                className="absolute right-3 top-1/2 -translate-y-1/2 size-9 rounded-full bg-black/60 hover:bg-black/85 text-white flex items-center justify-center backdrop-blur-sm opacity-90 transition-opacity focus:outline-none focus-visible:ring-2 focus-visible:ring-primary cursor-pointer"
                aria-label="Volgende afbeelding"
              >
                <ChevronRight className="size-5" />
              </button>

              {/* Slide indicators / pagination dots */}
              <div className="absolute bottom-3 inset-x-0 flex items-center justify-center gap-1.5 pointer-events-none">
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-sm pointer-events-auto">
                  {slides.map((s, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsPlaying(false);
                        setCurrentIndex(idx);
                      }}
                      className={cn(
                        "size-2 rounded-full transition-all focus:outline-none cursor-pointer",
                        idx === currentIndex ? "bg-primary w-4.5" : "bg-white/50 hover:bg-white/80",
                      )}
                      aria-label={`Ga naar slide ${idx + 1}`}
                    />
                  ))}
                  <span className="text-[10px] text-white/80 font-medium ml-1">
                    {currentIndex + 1}/{slides.length}
                  </span>
                </div>
              </div>
            </>
          )}
        </div>

        <h3 className="mt-4 text-base font-normal">
          <span className="font-medium text-foreground">{item.clientName}</span>
          <span className="mx-2 text-muted-foreground/60">·</span>
          <span className="text-muted-foreground">{item.subtitle || item.title}</span>
        </h3>
        <p className="mt-2 text-base leading-relaxed text-muted-foreground">
          {item.korteIntro || item.shortIntro || item.shortDescription}
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
