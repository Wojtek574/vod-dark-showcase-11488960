import { useMemo, useEffect, useState } from "react";
import { Play, Star, TrendingUp, Users, Zap } from "lucide-react";
import { mediaItems, MediaItem } from "@/data/movies";

const CTA_URL = "https://securedeal.pro/a/rkLGi2AVgsyo3p?ld=1103";

const HeroSection = () => {
  const [scrollY, setScrollY] = useState(0);
  const [viewerCount, setViewerCount] = useState(0);

  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Simulate live viewer count
  useEffect(() => {
    setViewerCount(Math.floor(Math.random() * 800) + 1200);
    const interval = setInterval(() => {
      setViewerCount((prev) => prev + Math.floor(Math.random() * 7) - 3);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const featured: MediaItem = useMemo(() => {
    const items = mediaItems.filter((m) => m.description);
    return items[Math.floor(Math.random() * items.length)];
  }, []);

  if (!featured) return null;

  const stars = 4.5;
  const fullStars = Math.floor(stars);
  const hasHalf = stars % 1 >= 0.5;
  const parallaxOffset = scrollY * 0.35;

  return (
    <section className="relative w-full overflow-hidden" style={{ minHeight: "420px", maxHeight: "650px", height: "65vh" }}>
      {/* Background image with parallax */}
      <div className="absolute inset-0">
        <img
          src={featured.image}
          alt=""
          className="h-[120%] w-full object-cover object-top will-change-transform"
          style={{ transform: `translateY(-${parallaxOffset}px)` }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/90 to-background/30" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background/30" />
      </div>

      {/* Content */}
      <div className="relative flex h-full items-end pb-10 md:pb-14">
        <div className="px-4 md:px-8 max-w-screen-xl mx-auto w-full">
          <div className="max-w-2xl">
            {/* Trending badge */}
            <div className="flex items-center gap-3 mb-3">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/15 border border-primary/30 px-3 py-1 text-xs font-bold text-primary animate-pulse">
                <TrendingUp className="h-3.5 w-3.5" />
                Trending
              </span>
              <span className="inline-flex items-center gap-1.5 text-xs text-foreground/60">
                <Users className="h-3.5 w-3.5 text-primary" />
                <span className="font-medium text-foreground/80">{viewerCount.toLocaleString()}</span> osób teraz ogląda
              </span>
            </div>

            {/* Stars */}
            <div className="flex items-center gap-2 mb-3">
              <div className="flex items-center gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`h-5 w-5 ${
                      i < fullStars
                        ? "fill-primary text-primary"
                        : i === fullStars && hasHalf
                        ? "fill-primary/50 text-primary"
                        : "text-muted-foreground/30"
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm text-foreground font-medium">
                Ocena: {stars} / 5
              </span>
            </div>

            <h1 className="font-display text-4xl md:text-6xl lg:text-7xl tracking-wider text-foreground leading-none">
              {featured.title}
            </h1>

            <div className="mt-4 flex flex-wrap gap-2">
              <span className="inline-flex items-center rounded border border-primary/30 bg-primary/5 px-3 py-1.5 text-xs text-foreground">
                Rok: {featured.year}
              </span>
              <span className="inline-flex items-center rounded border border-primary/30 bg-primary/5 px-3 py-1.5 text-xs text-foreground">
                Gatunek: {featured.genre}
              </span>
              {featured.duration && (
                <span className="inline-flex items-center rounded border border-primary/30 bg-primary/5 px-3 py-1.5 text-xs text-foreground">
                  Czas trwania: {featured.duration}
                </span>
              )}
            </div>

            {featured.description && (
              <p className="mt-4 text-sm leading-relaxed text-foreground/70 line-clamp-3 max-w-xl">
                {featured.description}
              </p>
            )}

            {/* CTA buttons */}
            <div className="mt-6 flex items-center gap-3">
              <a
                href={CTA_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="group/btn relative inline-flex items-center gap-2 rounded bg-primary px-7 py-3.5 text-sm font-bold text-primary-foreground transition-all hover:bg-primary/90 hover:scale-105 hover:shadow-xl hover:shadow-primary/30"
              >
                <span className="absolute inset-0 rounded bg-primary/50 animate-ping opacity-20" />
                <Play className="h-5 w-5 fill-current" />
                Rozpocznij teraz
              </a>
              <a
                href={CTA_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded border border-border px-5 py-3.5 text-sm font-medium text-foreground transition-all hover:border-primary/50 hover:text-primary"
              >
                <Zap className="h-4 w-4" />
                Wyszukaj
              </a>
            </div>

            {/* Trust signals */}
            <div className="mt-4 flex items-center gap-4 text-[11px] text-muted-foreground">
              <span>✓ Ponad 10 000 tytułów</span>
              <span>✓ Wysoka jakość</span>
              <span className="hidden sm:inline">✓ Bez reklam</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
