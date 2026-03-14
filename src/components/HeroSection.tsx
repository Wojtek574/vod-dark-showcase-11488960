import { useMemo } from "react";
import { Play, Star } from "lucide-react";
import { mediaItems, MediaItem } from "@/data/movies";
import { useNavigate } from "react-router-dom";

const HeroSection = () => {
  const navigate = useNavigate();

  const featured: MediaItem = useMemo(() => {
    const items = mediaItems.filter((m) => m.description);
    return items[Math.floor(Math.random() * items.length)];
  }, []);

  if (!featured) return null;

  const stars = 4.5;
  const fullStars = Math.floor(stars);
  const hasHalf = stars % 1 >= 0.5;

  return (
    <section className="relative w-full overflow-hidden" style={{ minHeight: "420px", maxHeight: "600px", height: "60vh" }}>
      {/* Background image */}
      <div className="absolute inset-0">
        <img
          src={featured.image}
          alt=""
          className="h-full w-full object-cover object-top"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/85 to-background/40" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background/30" />
      </div>

      {/* Content */}
      <div className="relative flex h-full items-end pb-10 md:pb-14">
        <div className="px-4 md:px-8 max-w-screen-xl mx-auto w-full">
          <div className="max-w-2xl">
            {/* Rating */}
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

            {/* Title */}
            <h1 className="font-display text-4xl md:text-6xl lg:text-7xl tracking-wider text-foreground leading-none">
              {featured.title}
            </h1>

            {/* Meta tags */}
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

            {/* Description */}
            {featured.description && (
              <p className="mt-4 text-sm leading-relaxed text-foreground/70 line-clamp-3 max-w-xl">
                {featured.description}
              </p>
            )}

            {/* CTA */}
            <div className="mt-6 flex items-center gap-3">
              <button
                onClick={() => navigate(`/odtwarzacz/${featured.slug}`)}
                className="inline-flex items-center gap-2 rounded bg-primary px-6 py-3 text-sm font-bold text-primary-foreground transition-all hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/25"
              >
                <Play className="h-5 w-5 fill-current" />
                Wyszukaj
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
