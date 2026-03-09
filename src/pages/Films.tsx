import Header from "@/components/Header";
import MovieCard from "@/components/MovieCard";
import { mediaItems } from "@/data/movies";

const Films = () => {
  const films = mediaItems.filter((m) => m.type === "film");

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container py-10">
        <h1 className="font-display text-4xl tracking-wider text-foreground md:text-5xl">
          Najlepsze filmy
        </h1>
        <p className="mt-2 text-muted-foreground">
          Wybierz film i rozpocznij oglądanie.
        </p>
        <div className="mt-8 grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
          {films.map((item) => (
            <MovieCard key={item.id} title={item.title} genre={item.genre} year={item.year} image={item.image} slug={item.slug} />
          ))}
        </div>
      </main>
    </div>
  );
};

export default Films;
