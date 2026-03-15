import { useParams, Link, useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import MediaRow from "@/components/MediaRow";
import { mediaItems } from "@/data/movies";
import {
  ArrowLeft, Play, Pause, Volume2, VolumeX, Maximize, Minimize,
  SkipBack, SkipForward, Star, Clock, Film,
  Users, Shield, ThumbsUp, MessageCircle, Crown, Zap,
  Plus, Share2, ChevronDown, User
} from "lucide-react";
import { useState, useRef, useEffect, useCallback, useMemo } from "react";

const Player = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const movie = mediaItems.find((m) => m.slug === slug);
  const videoRef = useRef<HTMLVideoElement>(null);
  const introVideoRef = useRef<HTMLVideoElement>(null);
  const playerContainerRef = useRef<HTMLDivElement>(null);
  const controlsTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showControls, setShowControls] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [descExpanded, setDescExpanded] = useState(false);
  const [phase, setPhase] = useState<"intro" | "playing">("intro");
  const [introEnded, setIntroEnded] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const popupTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const FAKE_DURATION = 7592;

  // Detect mobile
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const similarItems = useMemo(() => {
    if (!movie) return [];
    return mediaItems.filter((m) => m.id !== movie.id).slice(0, 10);
  }, [movie]);

  // 10s popup timer
  useEffect(() => {
    if (isPlaying && !showPopup && phase === "playing") {
      popupTimerRef.current = setTimeout(() => {
        setShowPopup(true);
        videoRef.current?.pause();
        setIsPlaying(false);
      }, 10000);
    }
    return () => {
      if (popupTimerRef.current) clearTimeout(popupTimerRef.current);
    };
  }, [isPlaying, showPopup, phase]);

  useEffect(() => {
    const handler = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", handler);
    return () => document.removeEventListener("fullscreenchange", handler);
  }, []);

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);
    if (h > 0) return `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
    return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  };

  const progress = duration > 0 ? (currentTime / FAKE_DURATION) * 100 : 0;

  const handleIntroEnd = () => {
    setIntroEnded(true);
    setPhase("playing");
  };

  const togglePlay = useCallback(() => {
    if (phase === "intro") {
      if (introVideoRef.current) {
        if (introVideoRef.current.paused) {
          introVideoRef.current.play();
          setIsPlaying(true);
        } else {
          introVideoRef.current.pause();
          setIsPlaying(false);
        }
      }
      return;
    }
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play();
      setIsPlaying(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  }, [phase]);

  const handleMouseMove = () => {
    setShowControls(true);
    if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    if (isPlaying) {
      controlsTimeoutRef.current = setTimeout(() => setShowControls(false), 3000);
    }
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!videoRef.current || !duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    videoRef.current.currentTime = percent * duration;
  };

  const toggleFullscreen = async () => {
    if (!playerContainerRef.current) return;
    try {
      if (!document.fullscreenElement) await playerContainerRef.current.requestFullscreen();
      else await document.exitFullscreen();
    } catch {}
  };

  const skip = (seconds: number) => {
    if (!videoRef.current) return;
    videoRef.current.currentTime = Math.max(0, Math.min(duration, videoRef.current.currentTime + seconds));
  };

  const startPlayback = () => {
    setPhase("intro");
    setIntroEnded(false);
    setIsPlaying(true);
    setTimeout(() => {
      introVideoRef.current?.play();
    }, 100);
  };

  if (!movie) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="flex flex-col items-center justify-center py-32 px-6">
          <h1 className="font-display text-5xl text-foreground">404</h1>
          <p className="mt-2 text-muted-foreground">Nie znaleziono filmu</p>
          <Link to="/" className="mt-6 text-sm text-primary hover:underline">
            Wróć na stronę główną
          </Link>
        </main>
      </div>
    );
  }

  const genres = movie.genre.split(" / ");

  const castBySlug: Record<string, { name: string; role: string; avatar: string }[]> = {
    "panna-mloda": [
      { name: "Jessie Buckley", role: "Panna Młoda", avatar: "JB" },
      { name: "Christian Bale", role: "Potwór", avatar: "CB" },
      { name: "Annette Bening", role: "Dr. Euphronious", avatar: "AB" },
      { name: "Penélope Cruz", role: "Eva", avatar: "PC" },
      { name: "Peter Sarsgaard", role: "Igor", avatar: "PS" },
      { name: "Jeannie Berlin", role: "Mrs. Klein", avatar: "JB" },
    ],
    "dobry-chlopiec": [
      { name: "Stephen Graham", role: "Chris", avatar: "SG" },
      { name: "Toni Collette", role: "Kathryn", avatar: "TC" },
      { name: "Samson Kayo", role: "Tommy", avatar: "SK" },
      { name: "Andrea Riseborough", role: "Sarah", avatar: "AR" },
      { name: "John Heffernan", role: "Detektyw", avatar: "JH" },
      { name: "Stella Sheridan", role: "Molly", avatar: "SS" },
    ],
    "bez-wyjscia": [
      { name: "Choi Min-sik", role: "Man-su", avatar: "CM" },
      { name: "Yoo Hae-jin", role: "Dong-hyuk", avatar: "YH" },
      { name: "Im Si-wan", role: "Ji-hoon", avatar: "IS" },
      { name: "Jeon Do-yeon", role: "Soo-jung", avatar: "JD" },
      { name: "Lee Jung-jae", role: "CEO Park", avatar: "LJ" },
      { name: "Song Kang-ho", role: "Detektyw Kim", avatar: "SK" },
    ],
    "odyseja": [
      { name: "Matt Damon", role: "Odyseusz", avatar: "MD" },
      { name: "Anne Hathaway", role: "Penelopa", avatar: "AH" },
      { name: "Zendaya", role: "Atena", avatar: "ZE" },
      { name: "Tom Holland", role: "Telemach", avatar: "TH" },
      { name: "Robert Pattinson", role: "Antinous", avatar: "RP" },
      { name: "Charlize Theron", role: "Kirke", avatar: "CT" },
    ],
  };

  const commentsBySlug: Record<string, { user: string; avatar: string; rating: number; text: string; time: string; likes: number }[]> = {
    "panna-mloda": [
      { user: "Kinomaniak92", avatar: "K", rating: 5, text: "Absolutnie genialny film! Jessie Buckley daje niesamowity występ.", time: "2 godziny temu", likes: 34 },
      { user: "FilmowyKrytyk", avatar: "F", rating: 4, text: "Świetna reinterpretacja klasycznej historii. Scenografia jest zapierająca dech.", time: "5 godzin temu", likes: 21 },
      { user: "CinemaFan_PL", avatar: "C", rating: 5, text: "Jeden z najlepszych horrorów ostatnich lat!", time: "1 dzień temu", likes: 47 },
    ],
    "dobry-chlopiec": [
      { user: "TomaszK", avatar: "T", rating: 5, text: "Jan Komasa znów pokazał klasę! Stephen Graham jest fenomenalny.", time: "3 godziny temu", likes: 42 },
      { user: "KinoManiacPL", avatar: "K", rating: 4, text: "Mocny thriller psychologiczny. Napięcie nie puszcza do ostatniej minuty.", time: "8 godzin temu", likes: 28 },
      { user: "DarkCinema", avatar: "D", rating: 5, text: "Brutalnie szczery film o resocjalizacji.", time: "1 dzień temu", likes: 53 },
    ],
    "bez-wyjscia": [
      { user: "AzjatyckaKlasyka", avatar: "A", rating: 5, text: "Park Chan-wook w szczytowej formie! Mistrzowskie połączenie.", time: "1 godzinę temu", likes: 67 },
      { user: "SeoulCinema", avatar: "S", rating: 5, text: "Choi Min-sik daje występ życia jako Man-su.", time: "4 godziny temu", likes: 45 },
      { user: "FilmNerd99", avatar: "F", rating: 4, text: "Genialny scenariusz, pełen zwrotów akcji.", time: "1 dzień temu", likes: 38 },
    ],
    "odyseja": [
      { user: "NolanFanPL", avatar: "N", rating: 5, text: "Nolan po raz kolejny udowadnia, że jest mistrzem kina epickiego.", time: "2 godziny temu", likes: 89 },
      { user: "EpicCinema", avatar: "E", rating: 5, text: "Zdjęcia kręcone w IMAX zapierają dech. Arcydzieło wizualne.", time: "6 godzin temu", likes: 72 },
      { user: "HistoriaFilmu", avatar: "H", rating: 4, text: "Zendaya jako Atena to rewelacja — majestatyczna i potężna.", time: "1 dzień temu", likes: 56 },
    ],
  };

  const cast = castBySlug[movie.slug] || castBySlug["panna-mloda"];
  const comments = commentsBySlug[movie.slug] || commentsBySlug["panna-mloda"];

  const introSrc = isMobile ? "/intros/intro-mobile.mp4" : "/intros/intro-desktop.mp4";

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero section with movie poster background - e-kinofil style */}
      <section className="relative w-full overflow-hidden" style={{ minHeight: "400px", maxHeight: "650px", height: "65vh" }}>
        <div className="absolute inset-0">
          <img
            src={movie.image}
            alt=""
            className="h-full w-full object-cover object-top"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/85 to-background/30" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background/40" />
        </div>

        <div className="relative flex h-full items-end pb-8 md:pb-12">
          <div className="px-4 md:px-8 max-w-screen-xl mx-auto w-full">
            <div className="max-w-2xl">
              {/* Star rating */}
              <div className="flex items-center gap-2 mb-3">
                <div className="flex items-center gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`h-5 w-5 ${i < 4 ? "fill-primary text-primary" : "fill-primary/40 text-primary/40"}`}
                    />
                  ))}
                </div>
                <span className="text-sm text-foreground font-medium">Ocena: 4.5 / 5</span>
              </div>

              <h1 className="font-display text-4xl md:text-6xl lg:text-7xl tracking-wider text-foreground leading-none">
                {movie.title}
              </h1>

              {/* Meta tags in orange-bordered pills */}
              <div className="mt-4 flex flex-wrap gap-2">
                <span className="inline-flex items-center rounded border border-primary/30 bg-primary/5 px-3 py-1.5 text-xs text-foreground">
                  Rok: {movie.year}
                </span>
                <span className="inline-flex items-center rounded border border-primary/30 bg-primary/5 px-3 py-1.5 text-xs text-foreground">
                  Gatunek: {movie.genre}
                </span>
                {movie.duration && (
                  <span className="inline-flex items-center rounded border border-primary/30 bg-primary/5 px-3 py-1.5 text-xs text-foreground">
                    Czas trwania: {movie.duration}
                  </span>
                )}
              </div>

              {/* Description */}
              {movie.description && (
                <div className="mt-4">
                  <p className={`text-sm leading-relaxed text-foreground/70 max-w-xl ${descExpanded ? "" : "line-clamp-3"}`}>
                    {movie.description}
                  </p>
                  {movie.description.length > 150 && (
                    <button
                      onClick={() => setDescExpanded(!descExpanded)}
                      className="mt-1 text-xs text-primary hover:text-primary/80 flex items-center gap-1"
                    >
                      {descExpanded ? "Zwiń" : "Pokaż więcej"}
                      <ChevronDown className={`h-3 w-3 transition-transform ${descExpanded ? "rotate-180" : ""}`} />
                    </button>
                  )}
                </div>
              )}

              {/* CTA - login required banner */}
              <div className="mt-5 rounded border border-primary/30 bg-primary/5 p-3 flex flex-col sm:flex-row items-start sm:items-center gap-3">
                <p className="text-xs text-foreground/70 flex-1">
                  Rozpocznij korzystanie z pełnej biblioteki — wymagane aktywne konto
                </p>
                <button className="inline-flex items-center gap-2 rounded bg-primary px-4 py-2 text-sm font-bold text-primary-foreground transition-all hover:bg-primary/90 shrink-0">
                  <User className="h-4 w-4" />
                  Rozpocznij teraz
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Video Player ─── */}
      <div className="px-4 md:px-8 max-w-screen-xl mx-auto -mt-4 mb-8">
        <div
          ref={playerContainerRef}
          className="relative w-full rounded-lg overflow-hidden border border-border bg-card"
          style={{
            aspectRatio: isFullscreen ? undefined : "16/9",
            height: isFullscreen ? "100vh" : undefined,
          }}
          onClick={togglePlay}
          onMouseMove={handleMouseMove}
        >
          {/* Intro video */}
          {phase === "intro" && !introEnded && (
            <video
              ref={introVideoRef}
              src={introSrc}
              className="absolute inset-0 h-full w-full object-contain bg-background"
              muted={isMuted}
              onEnded={handleIntroEnd}
              playsInline
            />
          )}

          {/* Main trailer video */}
          <video
            ref={videoRef}
            src="/trailers/panna-mloda-trailer.mp4"
            className={`absolute inset-0 h-full w-full object-contain bg-background ${phase === "intro" && !introEnded ? "opacity-0" : "opacity-100"}`}
            muted={isMuted}
            onTimeUpdate={() => setCurrentTime(videoRef.current?.currentTime || 0)}
            onLoadedMetadata={() => setDuration(videoRef.current?.duration || 0)}
            onEnded={() => setIsPlaying(false)}
            playsInline
          />

          {/* Play button overlay */}
          {!isPlaying && !showPopup && (
            <div className="absolute inset-0 flex items-center justify-center z-10 bg-background/40">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (!introEnded && phase === "intro") {
                    startPlayback();
                  } else {
                    togglePlay();
                  }
                }}
                className="flex h-16 w-16 md:h-20 md:w-20 items-center justify-center rounded-full bg-primary text-primary-foreground transition-all hover:scale-110 hover:shadow-lg hover:shadow-primary/30"
              >
                <Play className="h-7 w-7 md:h-9 md:w-9 fill-current ml-1" />
              </button>
            </div>
          )}

          {/* Registration popup */}
          {showPopup && (
            <div
              className="absolute inset-0 z-40 flex items-center justify-center bg-background/85 backdrop-blur-sm"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="mx-4 max-w-md w-full rounded-lg border border-primary/30 bg-card p-6 md:p-8 text-center">
                <Crown className="h-10 w-10 text-primary mx-auto mb-4" />
                <h3 className="font-display text-2xl md:text-3xl tracking-wider text-foreground">
                  Kontynuuj oglądanie
                </h3>
                <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
                  Utwórz konto, aby obejrzeć pełną wersję{" "}
                  <span className="text-primary font-medium">"{movie.title}"</span>.
                </p>
                <div className="mt-4 flex items-center justify-center gap-4 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Users className="h-3.5 w-3.5 text-primary" /> 12,847 widzów
                  </span>
                  <span className="flex items-center gap-1">
                    <Shield className="h-3.5 w-3.5 text-primary" /> Bezpiecznie
                  </span>
                </div>
                <div className="mt-6 flex flex-col gap-3">
                  <button className="w-full rounded bg-primary px-4 py-3 text-sm font-bold text-primary-foreground transition-all hover:bg-primary/90 flex items-center justify-center gap-2">
                    <Zap className="h-4 w-4" /> Utwórz konto i oglądaj
                  </button>
                  <button className="w-full rounded border border-border px-4 py-2.5 text-sm text-muted-foreground transition-colors hover:text-foreground hover:border-primary/30">
                    Mam konto — Zaloguj się
                  </button>
                  <button
                    onClick={() => {
                      setShowPopup(false);
                      setPhase("intro");
                      setIntroEnded(false);
                      if (videoRef.current) videoRef.current.currentTime = 0;
                    }}
                    className="text-xs text-muted-foreground/50 hover:text-primary mt-1"
                  >
                    Obejrzyj zwiastun ponownie
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Controls */}
          {phase === "playing" && (
            <div
              className={`absolute bottom-0 left-0 right-0 z-30 bg-gradient-to-t from-background/90 via-background/50 to-transparent px-4 md:px-6 pb-3 pt-16 transition-opacity duration-300 ${
                showControls || !isPlaying ? "opacity-100" : "opacity-0"
              }`}
              onClick={(e) => e.stopPropagation()}
            >
              <div
                className="group mb-3 h-1 w-full cursor-pointer rounded-full bg-foreground/20 transition-all hover:h-1.5"
                onClick={handleProgressClick}
              >
                <div
                  className="relative h-full rounded-full bg-primary transition-all"
                  style={{ width: `${progress}%` }}
                >
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 h-3.5 w-3.5 rounded-full bg-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 md:gap-2">
                  <button onClick={togglePlay} className="rounded-sm p-1.5 text-foreground/90 hover:text-foreground transition-colors">
                    {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5 fill-current" />}
                  </button>
                  <button onClick={() => skip(-10)} className="rounded-sm p-1.5 text-foreground/60 hover:text-foreground transition-colors">
                    <SkipBack className="h-4 w-4" />
                  </button>
                  <button onClick={() => skip(10)} className="rounded-sm p-1.5 text-foreground/60 hover:text-foreground transition-colors">
                    <SkipForward className="h-4 w-4" />
                  </button>
                  <button onClick={() => setIsMuted(!isMuted)} className="rounded-sm p-1.5 text-foreground/60 hover:text-foreground transition-colors">
                    {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                  </button>
                  <span className="ml-1 text-xs tabular-nums text-foreground/50 hidden sm:inline">
                    {formatTime(currentTime)} / {movie.duration || "2:06:32"}
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-medium text-foreground/70 mr-2 hidden md:inline">
                    {movie.title}
                  </span>
                  <button onClick={toggleFullscreen} className="rounded-sm p-1.5 text-foreground/60 hover:text-foreground transition-colors">
                    {isFullscreen ? <Minimize className="h-4 w-4" /> : <Maximize className="h-4 w-4" />}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ─── Cast (e-kinofil style) ─── */}
      <section className="px-4 md:px-8 max-w-screen-xl mx-auto mb-8">
        <div className="flex items-center gap-2 mb-4">
          <Star className="h-5 w-5 text-primary fill-primary" />
          <h2 className="font-display text-xl md:text-2xl tracking-wider text-foreground">
            Aktorzy
          </h2>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
          {cast.map((person) => (
            <div
              key={person.name}
              className="rounded border border-border bg-card px-4 py-2.5 text-center transition-colors hover:border-primary/30"
            >
              <p className="text-sm font-medium text-foreground truncate">{person.name}</p>
              <p className="text-[11px] text-muted-foreground truncate">{person.role}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ─── Comments ─── */}
      <section className="px-4 md:px-8 max-w-screen-xl mx-auto mb-8">
        <h2 className="font-display text-xl md:text-2xl tracking-wider text-foreground mb-4">
          Komentarze
          <span className="text-sm font-normal text-muted-foreground ml-2">({comments.length})</span>
        </h2>

        <div className="space-y-2">
          {comments.map((comment, i) => (
            <div
              key={i}
              className="rounded border border-border bg-card p-4 transition-colors hover:border-primary/20"
            >
              <div className="flex items-start gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-secondary text-foreground font-display text-xs border border-border">
                  {comment.avatar}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-medium text-foreground">{comment.user}</span>
                    <div className="flex items-center gap-0.5">
                      {Array.from({ length: 5 }).map((_, j) => (
                        <Star key={j} className={`h-2.5 w-2.5 ${j < comment.rating ? "fill-primary text-primary" : "text-muted/30"}`} />
                      ))}
                    </div>
                    <span className="text-[11px] text-muted-foreground">{comment.time}</span>
                  </div>
                  <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed">{comment.text}</p>
                  <div className="mt-2 flex items-center gap-4">
                    <button className="flex items-center gap-1 text-xs text-muted-foreground hover:text-primary transition-colors">
                      <ThumbsUp className="h-3 w-3" /> {comment.likes}
                    </button>
                    <button className="text-xs text-muted-foreground hover:text-foreground transition-colors">
                      Odpowiedz
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── Similar content ─── */}
      <div className="mb-8">
        <MediaRow title="Podobne tytuły" items={similarItems} />
      </div>

      {/* Back link */}
      <div className="px-4 md:px-8 max-w-screen-xl mx-auto pb-12">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
        >
          <ArrowLeft className="h-4 w-4" /> Wróć do katalogu
        </Link>
      </div>
    </div>
  );
};

export default Player;
