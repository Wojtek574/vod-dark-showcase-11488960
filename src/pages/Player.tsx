import { useParams, Link } from "react-router-dom";
import Header from "@/components/Header";
import { mediaItems } from "@/data/movies";
import { ArrowLeft, Play, Pause, Volume2, VolumeX, Maximize, Minimize, SkipBack, SkipForward, Star, Calendar, Clock, Film } from "lucide-react";
import { useState, useRef, useEffect, useCallback } from "react";
import PlayerIntro from "@/components/player/PlayerIntro";

type PlayerPhase = "idle" | "intro" | "playing";

const Player = () => {
  const { slug } = useParams();
  const movie = mediaItems.find((m) => m.slug === slug);
  const [phase, setPhase] = useState<PlayerPhase>("idle");
  const [currentTime, setCurrentTime] = useState(0);
  const [showControls, setShowControls] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [introOpacity, setIntroOpacity] = useState(0);
  const [introTextVisible, setIntroTextVisible] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const controlsTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const playerContainerRef = useRef<HTMLDivElement>(null);

  const isPlaying = phase === "playing";

  const totalDuration = movie?.duration
    ? movie.duration.split(":").reduce((acc, val, i) => acc + parseInt(val) * [3600, 60, 1][i], 0)
    : 5445;

  const startIntro = useCallback(() => {
    setPhase("intro");
    setIntroOpacity(0);
    setTimeout(() => setIntroOpacity(1), 100);
  }, []);

  const handleIntroEnd = useCallback(() => {
    setIntroOpacity(0);
    setTimeout(() => {
      setPhase("idle");
      setCurrentTime(0);
    }, 500);
  }, []);

  useEffect(() => {
    if (phase === "playing") {
      intervalRef.current = setInterval(() => {
        setCurrentTime((prev) => {
          if (prev >= totalDuration) {
            setPhase("idle");
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
  }, [phase, totalDuration]);

  useEffect(() => {
    const handler = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", handler);
    return () => document.removeEventListener("fullscreenchange", handler);
  }, []);

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);
    return `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  };

  const progress = (currentTime / totalDuration) * 100;

  const handlePlayerClick = () => {
    if (phase === "intro") return;
    if (phase === "idle") {
      startIntro();
    } else {
      setPhase("idle");
    }
    setShowControls(true);
    if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    controlsTimeoutRef.current = setTimeout(() => setShowControls(false), 3000);
  };

  const handlePlayPause = () => {
    if (phase === "intro") return;
    if (phase === "idle" && currentTime === 0) {
      startIntro();
    } else if (phase === "idle") {
      setPhase("playing");
    } else {
      setPhase("idle");
    }
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
    if (phase === "idle") setPhase("playing");
  };

  const toggleFullscreen = async () => {
    if (!playerContainerRef.current) return;
    try {
      if (!document.fullscreenElement) {
        await playerContainerRef.current.requestFullscreen();
      } else {
        await document.exitFullscreen();
      }
    } catch (err) {
      console.log("Fullscreen not supported", err);
    }
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

  const genres = movie.genre.split(" / ");

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Full-width Video Player */}
      <div
        ref={playerContainerRef}
        className={`relative w-full cursor-pointer bg-black ${isFullscreen ? "" : "border-b border-border"}`}
        style={{ aspectRatio: isFullscreen ? undefined : "16/9", height: isFullscreen ? "100vh" : undefined, maxHeight: isFullscreen ? undefined : "70vh" }}
        onClick={handlePlayerClick}
        onMouseMove={handleMouseMove}
      >
        {/* Movie poster as background */}
        <img
          src={movie.image}
          alt={movie.title}
          className={`absolute inset-0 h-full w-full object-cover transition-all duration-700 ${phase !== "idle" ? "opacity-20 blur-md scale-110" : "opacity-50"}`}
        />

        {/* Dark overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-black/70" />

        {/* Warner Bros Intro */}
        <PlayerIntro
          phase={phase}
          introOpacity={introOpacity}
          introTextVisible={introTextVisible}
        />

        {/* Play button center */}
        {phase === "idle" && (
          <div className="absolute inset-0 flex items-center justify-center z-10">
            <div className="group flex h-20 w-20 items-center justify-center rounded-full border-2 border-primary/50 bg-primary/20 text-primary backdrop-blur-sm transition-all hover:scale-110 hover:bg-primary/30 hover:border-primary">
              <Play className="h-9 w-9 fill-current ml-1 transition-transform group-hover:scale-110" />
            </div>
          </div>
        )}

        {/* Playing indicator */}
        {phase === "playing" && (
          <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
            <p className="font-display text-xl tracking-[0.3em] text-foreground/20 select-none uppercase">
              ▶ Odtwarzanie
            </p>
          </div>
        )}

        {/* CTA banner (like the reference site) */}
        {phase === "idle" && (
          <div className="absolute bottom-20 left-0 right-0 z-20 flex justify-center pointer-events-none">
            <p className="text-sm text-muted-foreground">
              Obejrzyj zwiastun i{" "}
              <span className="text-primary font-medium">zarejestruj się</span>
              , by uzyskać dostęp do pełnej biblioteki filmów i seriali.
            </p>
          </div>
        )}

        {/* Controls bar */}
        <div
          className={`absolute bottom-0 left-0 right-0 z-30 bg-gradient-to-t from-black/95 via-black/60 to-transparent px-4 pb-3 pt-12 transition-opacity duration-300 ${showControls || phase === "idle" ? "opacity-100" : "opacity-0"}`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Progress bar */}
          <div
            className="group mb-2 h-1 w-full cursor-pointer rounded-full bg-muted/20 transition-all hover:h-1.5"
            onClick={handleProgressClick}
          >
            <div
              className="relative h-full rounded-full bg-primary transition-all"
              style={{ width: `${progress}%` }}
            >
              <div className="absolute right-0 top-1/2 -translate-y-1/2 h-3 w-3 rounded-full bg-primary opacity-0 group-hover:opacity-100 transition-opacity shadow-lg shadow-primary/50" />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <button
                onClick={handlePlayPause}
                className="rounded-sm p-1 text-foreground/90 transition-colors hover:text-foreground"
              >
                {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5 fill-current" />}
              </button>
              <button
                onClick={() => setCurrentTime(Math.max(0, currentTime - 10))}
                className="rounded-sm p-1 text-foreground/60 transition-colors hover:text-foreground"
              >
                <SkipBack className="h-4 w-4" />
              </button>
              <button
                onClick={() => setCurrentTime(Math.min(totalDuration, currentTime + 10))}
                className="rounded-sm p-1 text-foreground/60 transition-colors hover:text-foreground"
              >
                <SkipForward className="h-4 w-4" />
              </button>
              <span className="ml-2 text-xs tabular-nums text-foreground/60">
                {formatTime(currentTime)} / {formatTime(totalDuration)}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsMuted(!isMuted)}
                className="rounded-sm p-1 text-foreground/60 transition-colors hover:text-foreground"
              >
                {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
              </button>
              <button
                onClick={toggleFullscreen}
                className="rounded-sm p-1 text-foreground/60 transition-colors hover:text-foreground"
              >
                {isFullscreen ? <Minimize className="h-4 w-4" /> : <Maximize className="h-4 w-4" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Movie Info Section - like nowefilmyonline.pl */}
      <main className="container py-8">
        <div className="flex flex-col gap-6 md:flex-row md:gap-8">
          {/* Poster */}
          <div className="shrink-0">
            <img
              src={movie.image}
              alt={movie.title}
              className="w-40 rounded-lg border border-border shadow-xl md:w-48"
            />
          </div>

          {/* Info */}
          <div className="flex-1">
            <h1 className="font-display text-3xl tracking-wider text-foreground md:text-4xl">
              {movie.title} ({movie.year})
            </h1>

            {/* Meta row */}
            <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5" />
                {movie.year}
              </span>
              {movie.duration && (
                <span className="flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5" />
                  {movie.duration.replace(":", "h ").replace(":", "m ")}s
                </span>
              )}
              <span className="flex items-center gap-1">
                <Film className="h-3.5 w-3.5" />
                Warner Bros. Pictures
              </span>
            </div>

            {/* Rating */}
            <div className="mt-4 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-md bg-primary/15 border border-primary/30">
                <span className="font-display text-lg text-primary">9.2</span>
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star
                      key={i}
                      className={`h-3.5 w-3.5 ${i <= 4 ? "fill-primary text-primary" : "fill-primary/30 text-primary/30"}`}
                    />
                  ))}
                </div>
                <span className="text-xs text-muted-foreground mt-0.5">6 ocen(y)</span>
              </div>
            </div>

            {/* Genre tags */}
            <div className="mt-4 flex flex-wrap gap-2">
              {genres.map((genre) => (
                <span
                  key={genre}
                  className="rounded-md border border-border bg-muted/30 px-3 py-1 text-xs text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary cursor-pointer"
                >
                  {genre.trim()}
                </span>
              ))}
            </div>

            {/* Description */}
            {movie.description && (
              <div className="mt-6">
                <h2 className="font-display text-lg tracking-wider text-foreground mb-2">Opis</h2>
                <p className="max-w-3xl leading-relaxed text-muted-foreground text-sm">
                  {movie.description}
                </p>
              </div>
            )}

            {/* Action button */}
            <button
              className="mt-6 inline-flex items-center gap-2 rounded-md bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
              onClick={() => {
                setCurrentTime(0);
                startIntro();
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
            >
              <Play className="h-4 w-4 fill-current" />
              Oglądaj od początku
            </button>
          </div>
        </div>

        {/* Back link */}
        <Link
          to="/"
          className="mt-10 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-primary"
        >
          <ArrowLeft className="h-4 w-4" />
          Wróć do katalogu
        </Link>
      </main>
    </div>
  );
};

export default Player;
