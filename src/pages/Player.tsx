import { useParams, Link } from "react-router-dom";
import Header from "@/components/Header";
import { mediaItems } from "@/data/movies";
import { ArrowLeft, Play, Pause, Volume2, Maximize, SkipBack, SkipForward } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useRef, useEffect } from "react";

const Player = () => {
  const { slug } = useParams();
  const movie = mediaItems.find((m) => m.slug === slug);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [showControls, setShowControls] = useState(true);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const controlsTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Total duration: 1h 30m 45s = 5445 seconds
  const totalDuration = movie?.duration
    ? movie.duration.split(":").reduce((acc, val, i) => acc + parseInt(val) * [3600, 60, 1][i], 0)
    : 5445;

  useEffect(() => {
    if (isPlaying) {
      intervalRef.current = setInterval(() => {
        setCurrentTime((prev) => {
          if (prev >= totalDuration) {
            setIsPlaying(false);
            return totalDuration;
          }
          return prev + 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isPlaying, totalDuration]);

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);
    return `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  };

  const progress = (currentTime / totalDuration) * 100;

  const handlePlayerClick = () => {
    setIsPlaying(!isPlaying);
    setShowControls(true);
    if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    controlsTimeoutRef.current = setTimeout(() => setShowControls(false), 3000);
  };

  const handleMouseMove = () => {
    setShowControls(true);
    if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    if (isPlaying) {
      controlsTimeoutRef.current = setTimeout(() => setShowControls(false), 3000);
    }
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    setCurrentTime(Math.floor(percent * totalDuration));
  };

  if (!movie) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container py-20 text-center">
          <h1 className="font-display text-4xl text-foreground">Nie znaleziono filmu</h1>
          <Link to="/" className="mt-4 inline-block text-primary hover:underline">
            Wróć na stronę główną
          </Link>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container py-6">
        {/* Back link */}
        <Link
          to="/"
          className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-primary"
        >
          <ArrowLeft className="h-4 w-4" />
          Wróć do katalogu
        </Link>

        {/* Video Player */}
        <div
          className="relative aspect-video w-full overflow-hidden rounded-xl border border-border bg-black cursor-pointer"
          onClick={handlePlayerClick}
          onMouseMove={handleMouseMove}
        >
          {/* Movie poster as background */}
          <img
            src={movie.image}
            alt={movie.title}
            className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${isPlaying ? "opacity-30 blur-sm" : "opacity-60"}`}
          />

          {/* Dark overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/60" />

          {/* Play button center */}
          {!isPlaying && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/90 text-primary-foreground shadow-lg shadow-primary/30 transition-transform hover:scale-110">
                <Play className="h-9 w-9 fill-current ml-1" />
              </div>
            </div>
          )}

          {/* Simulated film content when playing */}
          {isPlaying && (
            <div className="absolute inset-0 flex items-center justify-center">
              <p className="font-display text-2xl tracking-widest text-foreground/40 select-none">
                ▶ ODTWARZANIE
              </p>
            </div>
          )}

          {/* Controls bar */}
          <div
            className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/95 to-transparent p-4 pt-10 transition-opacity duration-300 ${showControls || !isPlaying ? "opacity-100" : "opacity-0"}`}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Progress bar */}
            <div
              className="group mb-3 h-1 w-full cursor-pointer rounded-full bg-muted/30 transition-all hover:h-2"
              onClick={handleProgressClick}
            >
              <div
                className="h-full rounded-full bg-primary transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setCurrentTime(Math.max(0, currentTime - 10))}
                  className="text-foreground/70 transition-colors hover:text-foreground"
                >
                  <SkipBack className="h-5 w-5" />
                </button>
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="text-foreground transition-colors hover:text-primary"
                >
                  {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6 fill-current" />}
                </button>
                <button
                  onClick={() => setCurrentTime(Math.min(totalDuration, currentTime + 10))}
                  className="text-foreground/70 transition-colors hover:text-foreground"
                >
                  <SkipForward className="h-5 w-5" />
                </button>
                <span className="ml-2 text-sm tabular-nums text-foreground/70">
                  {formatTime(currentTime)} / {formatTime(totalDuration)}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Volume2 className="h-5 w-5 text-foreground/70" />
                <Maximize className="h-5 w-5 text-foreground/70" />
              </div>
            </div>
          </div>
        </div>

        {/* Movie info */}
        <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_300px]">
          <div>
            <h1 className="font-display text-4xl tracking-wider text-foreground md:text-5xl">
              {movie.title}
            </h1>
            <div className="mt-3 flex items-center gap-3 text-sm text-muted-foreground">
              <span className="rounded-md border border-primary/30 bg-primary/10 px-2 py-0.5 text-primary">
                {movie.genre}
              </span>
              <span>{movie.year}</span>
              {movie.duration && <span>⏱ {movie.duration}</span>}
            </div>
            {movie.description && (
              <p className="mt-6 max-w-2xl leading-relaxed text-muted-foreground">
                {movie.description}
              </p>
            )}
            <Button
              className="mt-6 gap-2 bg-primary font-semibold text-primary-foreground hover:bg-primary/90"
              onClick={() => {
                setCurrentTime(0);
                setIsPlaying(true);
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
            >
              <Play className="h-4 w-4 fill-current" />
              Oglądaj od początku
            </Button>
          </div>

          {/* Sidebar poster */}
          <div className="hidden lg:block">
            <img
              src={movie.image}
              alt={movie.title}
              className="w-full rounded-lg border border-border shadow-lg"
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Player;
