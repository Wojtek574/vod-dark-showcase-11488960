import Header from "@/components/Header";
import MovieCard from "@/components/MovieCard";
import { mediaItems } from "@/data/movies";
import { useState, useMemo, useRef, useEffect } from "react";
import {
  Search, X, TrendingUp, Star, Users, Shield, Zap,
  Play, Crown, Eye, ChevronRight, Flame
} from "lucide-react";

const Index = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const films = mediaItems.filter((m) => m.type === "film");
  const serials = mediaItems.filter((m) => m.type === "serial");
  const featured = mediaItems.find((m) => m.slug === "panna-mloda");

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
    <div className="min-h-screen bg-background">
      <Header onSearchOpen={() => setSearchOpen(true)} />

      {/* Search overlay */}
      {searchOpen && (
        <div className="fixed inset-0 z-[60] bg-background/95 backdrop-blur-md" onClick={() => setSearchOpen(false)}>
          <div className="container pt-24" onClick={(e) => e.stopPropagation()}>
            <div className="mx-auto max-w-2xl">
              <div className="flex items-center gap-3 rounded-xl border border-border bg-card px-4 py-3 shadow-2xl">
                <Search className="h-5 w-5 text-muted-foreground shrink-0" />
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Szukaj filmów i seriali..."
                  className="flex-1 bg-transparent text-lg text-foreground placeholder:text-muted-foreground outline-none"
                />
                {searchQuery && (
                  <button onClick={() => setSearchQuery("")} className="text-muted-foreground hover:text-foreground">
                    <X className="h-5 w-5" />
                  </button>
                )}
                <kbd className="hidden sm:inline-flex items-center rounded border border-border bg-secondary px-2 py-0.5 text-xs text-muted-foreground">ESC</kbd>
              </div>

              {filtered && (
                <div className="mt-4 rounded-xl border border-border bg-card p-4 shadow-2xl max-h-[60vh] overflow-y-auto">
                  {filtered.length === 0 ? (
                    <p className="text-center text-muted-foreground py-8">Nie znaleziono wyników dla „{searchQuery}"</p>
                  ) : (
                    <div className="space-y-2">
                      {filtered.map((item) => (
                        <a
                          key={item.id}
                          href={`/odtwarzacz/${item.slug}`}
                          className="flex items-center gap-4 rounded-lg p-3 transition-colors hover:bg-secondary/50"
                          onClick={() => setSearchOpen(false)}
                        >
                          <img src={item.image} alt={item.title} className="h-16 w-11 rounded object-cover border border-border" />
                          <div className="flex-1 min-w-0">
                            <h4 className="text-sm font-medium text-foreground truncate">{item.title}</h4>
                            <p className="text-xs text-muted-foreground">{item.genre} • {item.year}</p>
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
        </div>
      )}

      <main>
        {/* Hero section with featured movie */}
        {featured && (
          <section className="relative overflow-hidden border-b border-border">
            <div className="absolute inset-0">
              <img src={featured.image} alt="" className="h-full w-full object-cover opacity-20 blur-sm scale-110" />
              <div className="absolute inset-0 bg-gradient-to-r from-background via-background/95 to-background/70" />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background/50" />
            </div>
            <div className="container relative py-12 md:py-20">
              <div className="flex flex-col gap-8 md:flex-row md:items-center md:gap-12">
                <div className="shrink-0 order-2 md:order-1">
                  <a href={`/odtwarzacz/${featured.slug}`}>
                    <img
                      src={featured.image}
                      alt={featured.title}
                      className="w-36 md:w-48 rounded-xl border border-border shadow-2xl transition-transform hover:scale-[1.03]"
                    />
                  </a>
                </div>
                <div className="flex-1 order-1 md:order-2">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="inline-flex items-center gap-1 rounded-md bg-primary/15 border border-primary/30 px-2.5 py-1 text-xs font-semibold text-primary">
                      <Flame className="h-3 w-3" /> TRENDING
                    </span>
                    <span className="inline-flex items-center gap-1 rounded-md bg-secondary border border-border px-2.5 py-1 text-xs text-muted-foreground">
                      <Star className="h-3 w-3 fill-primary text-primary" /> 9.2
                    </span>
                  </div>
                  <h1 className="font-display text-4xl md:text-6xl tracking-wider text-foreground">
                    {featured.title}
                  </h1>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {featured.genre} • {featured.year} {featured.duration && `• ${featured.duration}`}
                  </p>
                  {featured.description && (
                    <p className="mt-4 max-w-xl text-sm leading-relaxed text-muted-foreground line-clamp-3">
                      {featured.description}
                    </p>
                  )}
                  <div className="mt-6 flex flex-wrap gap-3">
                    <a
                      href={`/odtwarzacz/${featured.slug}`}
                      className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-bold text-primary-foreground transition-all hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/25"
                    >
                      <Play className="h-4 w-4 fill-current" /> Oglądaj teraz
                    </a>
                    <a
                      href={`/odtwarzacz/${featured.slug}`}
                      className="inline-flex items-center gap-2 rounded-lg border border-border bg-secondary/50 px-6 py-3 text-sm font-medium text-foreground transition-all hover:border-primary/30 hover:bg-secondary"
                    >
                      Więcej informacji <ChevronRight className="h-4 w-4" />
                    </a>
                  </div>

                  {/* Social proof under hero CTA */}
                  <div className="mt-6 flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1"><Eye className="h-3.5 w-3.5 text-primary" /> 24,531 wyświetleń</span>
                    <span className="flex items-center gap-1"><Users className="h-3.5 w-3.5 text-primary" /> 348 osób ogląda teraz</span>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Trust bar */}
        <section className="border-b border-border bg-card/30">
          <div className="container flex flex-wrap items-center justify-center gap-6 md:gap-10 py-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5"><Shield className="h-4 w-4 text-primary" /> Bezpieczna platforma</span>
            <span className="flex items-center gap-1.5"><Crown className="h-4 w-4 text-primary" /> Jakość HD & 4K</span>
            <span className="flex items-center gap-1.5"><Zap className="h-4 w-4 text-primary" /> Błyskawiczny streaming</span>
            <span className="flex items-center gap-1.5"><Users className="h-4 w-4 text-primary" /> 50,000+ użytkowników</span>
          </div>
        </section>

        <div className="container py-10">
          {/* Trending Films */}
          <section>
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display text-2xl tracking-wider text-foreground flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" /> Popularne filmy
              </h2>
              <a href="/filmy" className="text-sm text-primary hover:underline flex items-center gap-1">
                Wszystkie <ChevronRight className="h-3.5 w-3.5" />
              </a>
            </div>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
              {films.map((item) => (
                <MovieCard key={item.id} title={item.title} genre={item.genre} year={item.year} image={item.image} slug={item.slug} />
              ))}
            </div>
          </section>

          {/* CTA banner */}
          <section className="my-12 rounded-2xl border border-primary/20 bg-gradient-to-r from-primary/10 via-primary/5 to-transparent p-8 md:p-10 text-center md:text-left md:flex md:items-center md:justify-between">
            <div>
              <h3 className="font-display text-2xl md:text-3xl tracking-wider text-foreground">
                Odkryj pełną bibliotekę
              </h3>
              <p className="mt-2 text-sm text-muted-foreground max-w-lg">
                Setki filmów i seriali w najwyższej jakości. Utwórz konto i uzyskaj natychmiastowy dostęp do wszystkich tytułów.
              </p>
            </div>
            <div className="mt-6 md:mt-0 shrink-0">
              <button className="inline-flex items-center gap-2 rounded-lg bg-primary px-8 py-3.5 text-sm font-bold text-primary-foreground transition-all hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/25">
                <Zap className="h-4 w-4" /> Utwórz konto
              </button>
            </div>
          </section>

          {/* Serials */}
          <section>
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display text-2xl tracking-wider text-foreground flex items-center gap-2">
                <Star className="h-5 w-5 text-primary" /> Popularne seriale
              </h2>
              <a href="/seriale" className="text-sm text-primary hover:underline flex items-center gap-1">
                Wszystkie <ChevronRight className="h-3.5 w-3.5" />
              </a>
            </div>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {serials.map((item) => (
                <MovieCard key={item.id} title={item.title} genre={item.genre} year={item.year} image={item.image} slug={item.slug} />
              ))}
            </div>
          </section>

          {/* Bottom CTA */}
          <section className="mt-14 text-center py-12 border-t border-border">
            <Crown className="h-10 w-10 text-primary mx-auto mb-4" />
            <h3 className="font-display text-3xl tracking-wider text-foreground">
              Dołącz do Filmklik.pl
            </h3>
            <p className="mt-3 text-sm text-muted-foreground max-w-md mx-auto">
              Rejestracja zajmuje mniej niż 30 sekund. Odblokuj dostęp do setek filmów i seriali w jakości HD.
            </p>
            <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
              <button className="inline-flex items-center gap-2 rounded-lg bg-primary px-8 py-3.5 text-sm font-bold text-primary-foreground transition-all hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/25">
                <Zap className="h-4 w-4" /> Utwórz konto
              </button>
              <button className="inline-flex items-center gap-2 rounded-lg border border-border px-6 py-3 text-sm text-muted-foreground transition-colors hover:text-foreground hover:border-foreground/30">
                Mam już konto — Zaloguj się
              </button>
            </div>
            <p className="mt-4 text-xs text-muted-foreground flex items-center justify-center gap-1.5">
              <Shield className="h-3.5 w-3.5 text-primary" /> Bezpieczna rejestracja • Bez zobowiązań
            </p>
          </section>
        </div>
      </main>
    </div>
  );
};

export default Index;