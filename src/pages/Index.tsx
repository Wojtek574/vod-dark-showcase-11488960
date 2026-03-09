import Header from "@/components/Header";
import MovieCard from "@/components/MovieCard";
import { mediaItems } from "@/data/movies";

const Index = () => {
  const films = mediaItems.filter((m) => m.type === "film");
  const serials = mediaItems.filter((m) => m.type === "serial");

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container py-10">
        <section>
          <h1 className="font-display text-4xl tracking-wider text-foreground md:text-5xl">
            Oglądaj najnowsze hity
          </h1>
          <p className="mt-2 text-muted-foreground">
            Najlepsze filmy i seriale w jednym miejscu. Rozpocznij streaming już teraz.
          </p>
        </section>

        <section className="mt-10">
          <h2 className="font-display text-2xl tracking-wider text-foreground">
            🎬 Najlepsze filmy
          </h2>
          <div className="mt-5 grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
            {films.map((item) => (
              <MovieCard key={item.id} title={item.title} genre={item.genre} year={item.year} image={item.image} slug={item.slug} />
            ))}
          </div>
        </section>

        <section className="mt-14">
          <h2 className="font-display text-2xl tracking-wider text-foreground">
            📺 Najlepsze seriale
          </h2>
          <div className="mt-5 grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
            {serials.map((item) => (
              <MovieCard key={item.id} title={item.title} genre={item.genre} year={item.year} image={item.image} />
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

export default Index;
