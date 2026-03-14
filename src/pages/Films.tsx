import Header from "@/components/Header";
import MovieCard from "@/components/MovieCard";
import { mediaItems } from "@/data/movies";
import { useState } from "react";

const GENRES = ["Wszystkie", "Sci-Fi", "Thriller", "Fantasy", "Horror", "Kryminał", "Dramat", "Romans"];

const Films = () => {
  const films = mediaItems.filter((m) => m.type === "film");
  const [selectedGenre, setSelectedGenre] = useState("Wszystkie");

  const filtered = selectedGenre === "Wszystkie"
    ? films
    : films.filter((m) => m.genre.toLowerCase().includes(selectedGenre.toLowerCase()));

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="px-4 md:px-8 max-w-screen-xl mx-auto py-8">
        <h1 className="font-display text-3xl md:text-5xl tracking-wider text-foreground">
          Filmy
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Wybierz film i rozpocznij oglądanie
        </p>

        {/* Genre filter */}
        <div className="mt-6 flex flex-wrap gap-2">
          {GENRES.map((g) => (
            <button
              key={g}
              onClick={() => setSelectedGenre(g)}
              className={`rounded border px-3 py-1.5 text-xs font-medium transition-all ${
                selectedGenre === g
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border text-muted-foreground hover:text-foreground hover:border-foreground/30"
              }`}
            >
              {g}
            </button>
          ))}
        </div>

        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {filtered.map((item, i) => (
            <MovieCard
              key={item.id}
              title={item.title}
              genre={item.genre}
              year={item.year}
              image={item.image}
              slug={item.slug}
              rank={i + 1}
            />
          ))}
        </div>

        {filtered.length === 0 && (
          <p className="mt-12 text-center text-muted-foreground">
            Brak filmów w tej kategorii
          </p>
        )}
      </main>
    </div>
  );
};

export default Films;
