import { useMemo } from "react";
import { Play, Info, Star } from "lucide-react";
import { mediaItems, MediaItem } from "@/data/movies";
import { useNavigate } from "react-router-dom";

const HeroSection = () => {
  const navigate = useNavigate();

  const featured: MediaItem = useMemo(() => {
    const items = mediaItems.filter((m) => m.description);
    return items[Math.floor(Math.random() * items.length)];
  }, []);

  if (!featured) return null;

  return (
    <section className="relative h-[70vh] min-h-[480px] max-h-[800px] w-full overflow-hidden">
      {/* Background image */}
      <div className="absolute inset-0">
        <img
          src={featured.image}
          alt=""
          className="h-full w-full object-cover object-top"
        />
        {/* Gradient overlays for readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
      </div>

      {/* Content */}
      <div className="relative flex h-full items-end pb-16 md:pb-20">
        <div className="container max-w-screen-xl mx-auto px-6 md:px-12">
          <div className="max-w-xl">
            <div className="mb-3 flex items-center gap-2">
              <span className="inline-flex items-center gap-1 rounded bg-primary px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-primary-foreground">
                Trending
              </span>
              <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                <Star className="h-3 w-3 fill-primary text-primary" /> 9.2
              </span>
              <span className="text-xs text-muted-foreground">
                {featured.genre} • {featured.year}
              </span>
            </div>

            <h1 className="font-display text-5xl md:text-7xl lg:text-8xl tracking-wider text-foreground leading-none">
              {featured.title}
            </h1>

            {featured.description && (
              <p className="mt-4 text-sm md:text-base leading-relaxed text-foreground/70 line-clamp-3">
                {featured.description}
              </p>
            )}

            <div className="mt-6 flex items-center gap-3">
              <button
                onClick={() => navigate(`/odtwarzacz/${featured.slug}`)}
                className="inline-flex items-center gap-2 rounded-md bg-foreground px-6 py-3 text-sm font-bold text-background transition-all hover:bg-foreground/90"
              >
                <Play className="h-5 w-5 fill-current" />
                Odtwórz
              </button>
              <button
                onClick={() => navigate(`/odtwarzacz/${featured.slug}`)}
                className="inline-flex items-center gap-2 rounded-md bg-muted/80 px-6 py-3 text-sm font-medium text-foreground backdrop-blur-sm transition-all hover:bg-muted"
              >
                <Info className="h-5 w-5" />
                Więcej informacji
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
