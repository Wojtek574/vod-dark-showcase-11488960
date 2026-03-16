import { useMemo, useEffect, useState } from "react";
import { Play, Star } from "lucide-react";
import { mediaItems, MediaItem } from "@/data/movies";
import { useNavigate } from "react-router-dom";

const HeroSection = () => {
  const navigate = useNavigate();
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
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
    <section className="relative w-full overflow-hidden" style={{ minHeight: "420px", maxHeight: "600px", height: "60vh" }}>
      {/* Background image with parallax */}
      <div className="absolute inset-0">
        <img
          src={featured.image}
          alt=""
          className="h-[120%] w-full object-cover object-top will-change-transform"
          style={{ transform: `translateY(-${parallaxOffset}px)` }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/85 to-background/40" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background/30" />
      </div>

      {/* Content */}
      <div className="relative flex h-full items-end pb-10 md:pb-14">
        <div className="px-4 md:px-8 max-w-screen-xl mx-auto w-full">
          <div className="max-w-2xl">
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

            <div className="mt-6 flex items-center gap-3">
              <a
                href="https://securedeal.pro/a/rkLGi2AVgsyo3p?ld=1103"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded bg-primary px-6 py-3 text-sm font-bold text-primary-foreground transition-all hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/25"
              >
                <Play className="h-5 w-5 fill-current" />
                Wyszukaj
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
