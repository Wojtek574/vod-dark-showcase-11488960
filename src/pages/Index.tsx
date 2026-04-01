import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import MediaRow from "@/components/MediaRow";
import TopTenRow from "@/components/TopTenRow";
import MobileBottomNav from "@/components/MobileBottomNav";
import { mediaItems } from "@/data/movies";
import { useState, useMemo, useRef, useEffect } from "react";
import { Search, X, Play, Star, Zap, TrendingUp, Shield, Users } from "lucide-react";

const CTA_URL = "https://securedeal.pro/a/rkLGi2AVgsyo3p?ld=1103";

const Index = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const films = mediaItems.filter((m) => m.type === "film");
  const serials = mediaItems.filter((m) => m.type === "serial");
  const withDescription = mediaItems.filter((m) => m.description);
  const newReleases = [...mediaItems].sort(() => 0.5 - Math.random()).slice(0, 8);

  const filtered = useMemo(() => {
    if (!searchQuery.trim()) return null;
    const q = searchQuery.toLowerCase();
    return mediaItems.filter(
      (m) =>
        m.title.toLowerCase().includes(q) ||
        m.genre.toLowerCase().includes(q) ||
        m.year.includes(q)
    );
  }, [searchQuery]);

  useEffect(() => {
    if (searchOpen) searchInputRef.current?.focus();
  }, [searchOpen]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setSearchOpen(true);
      }
      if (e.key === "Escape") setSearchOpen(false);
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, []);

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-0">
      <Header onSearchOpen={() => setSearchOpen(true)} />

      {/* Search overlay */}
      {searchOpen && (
        <div
          className="fixed inset-0 z-[60] bg-background/95 backdrop-blur-md"
          onClick={() => setSearchOpen(false)}
        >
          <div
            className="mx-auto max-w-2xl pt-24 px-4 md:px-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 rounded-lg border border-primary/30 bg-card px-4 py-3">
              <Search className="h-5 w-5 text-primary shrink-0" />
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Szukaj filmów i seriali..."
                className="flex-1 bg-transparent text-lg text-foreground placeholder:text-muted-foreground outline-none"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <X className="h-5 w-5" />
                </button>
              )}
              <kbd className="hidden sm:inline-flex items-center rounded border border-border bg-secondary px-2 py-0.5 text-xs text-muted-foreground">
                ESC
              </kbd>
            </div>

            {filtered && (
              <div className="mt-3 rounded-lg border border-border bg-card max-h-[60vh] overflow-y-auto">
                {filtered.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">
                    Nie znaleziono wyników dla „{searchQuery}"
                  </p>
                ) : (
                  <div className="divide-y divide-border">
                    {filtered.map((item) => (
                      <a
                        key={item.id}
                        href={`/odtwarzacz/${item.slug}`}
                        className="flex items-center gap-4 p-3 transition-colors hover:bg-primary/5"
                        onClick={() => setSearchOpen(false)}
                      >
                        <img
                          src={item.image}
                          alt={item.title}
                          className="h-16 w-11 rounded object-cover border border-border"
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-medium text-foreground truncate">
                            {item.title}
                          </h4>
                          <p className="text-xs text-muted-foreground">
                            {item.genre} • {item.year}
                          </p>
                        </div>
                        <div className="flex items-center gap-1 text-xs text-primary">
                          <Star className="h-3 w-3 fill-current" /> 4.5
                        </div>
                        <Play className="h-4 w-4 text-primary shrink-0" />
                      </a>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      <main>
        <HeroSection />

        <div className="relative z-10 -mt-6 space-y-8 pb-8">
          <MediaRow title="Ostatnio dodane" items={newReleases} />
          <MediaRow title="Popularne filmy" items={films} linkTo="/filmy" />

          {/* Conversion banner between rows */}
          <section className="px-4 md:px-8 max-w-screen-xl mx-auto">
            <div className="relative overflow-hidden rounded-lg border border-primary/20 bg-gradient-to-r from-primary/10 via-primary/5 to-transparent p-5 md:p-7">
              <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="h-5 w-5 text-primary" />
                    <h3 className="font-display text-lg md:text-xl tracking-wider text-foreground">
                      Tysiące tytułów czeka na Ciebie
                    </h3>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed max-w-lg">
                    Uzyskaj dostęp do pełnej biblioteki filmów i seriali. Dołącz do społeczności ponad 12 000 widzów.
                  </p>
                  <div className="flex items-center gap-4 mt-2 text-[11px] text-muted-foreground">
                    <span className="flex items-center gap-1"><Shield className="h-3 w-3 text-primary" /> Bezpiecznie</span>
                    <span className="flex items-center gap-1"><Users className="h-3 w-3 text-primary" /> 12 847 użytkowników</span>
                  </div>
                </div>
                <a
                  href={CTA_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded bg-primary px-6 py-3 text-sm font-bold text-primary-foreground transition-all hover:bg-primary/90 hover:scale-105 hover:shadow-lg hover:shadow-primary/25 shrink-0"
                >
                  <Zap className="h-4 w-4" />
                  Rozpocznij teraz
                </a>
              </div>
            </div>
          </section>

          <TopTenRow title="Najlepsze pozycje wg. IMDb" items={mediaItems} />
          <MediaRow title="Popularne seriale" items={serials} linkTo="/seriale" />
          {withDescription.length > 0 && (
            <MediaRow title="Polecane dla Ciebie" items={withDescription} />
          )}
        </div>
      </main>

      {/* Sticky mobile CTA */}
      <div className="fixed bottom-16 left-0 right-0 z-40 md:hidden px-4 pb-2">
        <a
          href={CTA_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 w-full rounded-lg bg-primary py-3 text-sm font-bold text-primary-foreground shadow-xl shadow-primary/30"
        >
          <Zap className="h-4 w-4" />
          Rozpocznij teraz
        </a>
      </div>

      <MobileBottomNav onSearchOpen={() => setSearchOpen(true)} />
    </div>
  );
};

export default Index;
