import { useParams, Link } from "react-router-dom";
import Header from "@/components/Header";
import { mediaItems } from "@/data/movies";
import { ArrowLeft, Play, Pause, Volume2, Maximize, Minimize, SkipBack, SkipForward } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useRef, useEffect, useCallback } from "react";

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
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const controlsTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const playerContainerRef = useRef<HTMLDivElement>(null);

  const isPlaying = phase === "playing";

  const totalDuration = movie?.duration
    ? movie.duration.split(":").reduce((acc, val, i) => acc + parseInt(val) * [3600, 60, 1][i], 0)
    : 5445;

  // Warner Bros intro sequence
  const startIntro = useCallback(() => {
    setPhase("intro");
    setIntroOpacity(0);
    setIntroTextVisible(false);

    // Fade in
    setTimeout(() => setIntroOpacity(1), 100);
    // Show text
    setTimeout(() => setIntroTextVisible(true), 800);
    // Fade out and start movie
    setTimeout(() => {
      setIntroOpacity(0);
      setTimeout(() => {
        setPhase("playing");
        setCurrentTime(0);
      }, 800);
    }, 4000);
  }, []);

  // Timer for playing
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

  // Fullscreen change listener
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
          ref={playerContainerRef}
          className={`relative w-full overflow-hidden rounded-xl border border-border bg-black cursor-pointer ${isFullscreen ? "rounded-none border-none" : ""}`}
          style={{ aspectRatio: isFullscreen ? undefined : "16/9", height: isFullscreen ? "100vh" : undefined }}
          onClick={handlePlayerClick}
          onMouseMove={handleMouseMove}
        >
          {/* Movie poster as background */}
          <img
            src={movie.image}
            alt={movie.title}
            className={`absolute inset-0 h-full w-full object-cover transition-all duration-700 ${phase !== "idle" ? "opacity-30 blur-sm scale-105" : "opacity-60"}`}
          />

          {/* Dark overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/60" />

          {/* Warner Bros Intro */}
          {phase === "intro" && (
            <div
              className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black transition-opacity duration-700"
              style={{ opacity: introOpacity }}
            >
              {/* WB Shield */}
              <div className="relative flex flex-col items-center">
                <div className="relative mb-4">
                  <svg width="120" height="120" viewBox="0 0 120 120" className="drop-shadow-[0_0_40px_hsl(var(--primary)/0.5)]">
                    {/* Shield shape */}
                    <path
                      d="M60 8 L108 30 L108 70 Q108 100 60 115 Q12 100 12 70 L12 30 Z"
                      fill="none"
                      stroke="hsl(45, 80%, 55%)"
                      strokeWidth="3"
                      className={`transition-all duration-1000 ${introTextVisible ? "opacity-100" : "opacity-0"}`}
                    />
                    {/* WB Letters */}
                    <text
                      x="60"
                      y="72"
                      textAnchor="middle"
                      className={`transition-all duration-700 ${introTextVisible ? "opacity-100" : "opacity-0"}`}
                      style={{
                        fontSize: "42px",
                        fontFamily: "serif",
                        fontWeight: "bold",
                        fill: "hsl(45, 80%, 55%)",
                        letterSpacing: "2px",
                      }}
                    >
                      WB
                    </text>
                  </svg>
                </div>

                <p
                  className={`font-display text-lg tracking-[0.4em] uppercase transition-all duration-700 ${introTextVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
                  style={{ color: "hsl(45, 80%, 55%)" }}
                >
                  Warner Bros.
                </p>
                <p
                  className={`mt-1 text-xs tracking-[0.3em] uppercase transition-all duration-700 delay-300 ${introTextVisible ? "opacity-60 translate-y-0" : "opacity-0 translate-y-4"}`}
                  style={{ color: "hsl(45, 60%, 60%)" }}
                >
                  Pictures
                </p>
              </div>

              {/* Subtle particles / stars */}
              <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {[...Array(20)].map((_, i) => (
                  <div
                    key={i}
                    className="absolute rounded-full animate-pulse"
                    style={{
                      width: `${Math.random() * 3 + 1}px`,
                      height: `${Math.random() * 3 + 1}px`,
                      left: `${Math.random() * 100}%`,
                      top: `${Math.random() * 100}%`,
                      backgroundColor: "hsl(45, 80%, 55%)",
                      opacity: Math.random() * 0.3,
                      animationDelay: `${Math.random() * 2}s`,
                      animationDuration: `${Math.random() * 3 + 2}s`,
                    }}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Play button center */}
          {phase === "idle" && (
            <div className="absolute inset-0 flex items-center justify-center z-10">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/90 text-primary-foreground shadow-lg shadow-primary/30 transition-transform hover:scale-110">
                <Play className="h-9 w-9 fill-current ml-1" />
              </div>
            </div>
          )}

          {/* Playing indicator */}
          {phase === "playing" && (
            <div className="absolute inset-0 flex items-center justify-center z-10">
              <p className="font-display text-2xl tracking-widest text-foreground/40 select-none">
                ▶ ODTWARZANIE
              </p>
            </div>
          )}

          {/* Controls bar */}
          <div
            className={`absolute bottom-0 left-0 right-0 z-30 bg-gradient-to-t from-black/95 to-transparent p-4 pt-10 transition-opacity duration-300 ${showControls || phase === "idle" ? "opacity-100" : "opacity-0"}`}
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
                  onClick={handlePlayPause}
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
                <button
                  onClick={toggleFullscreen}
                  className="text-foreground/70 transition-colors hover:text-foreground"
                >
                  {isFullscreen ? <Minimize className="h-5 w-5" /> : <Maximize className="h-5 w-5" />}
                </button>
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
              <span className="rounded-md border border-border bg-muted/20 px-2 py-0.5 text-muted-foreground text-xs">
                Warner Bros. Pictures
              </span>
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
                startIntro();
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
