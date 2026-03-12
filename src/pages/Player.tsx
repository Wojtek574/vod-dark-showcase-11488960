import { useParams, Link } from "react-router-dom";
import Header from "@/components/Header";
import { mediaItems } from "@/data/movies";
import {
  ArrowLeft, Play, Pause, Volume2, VolumeX, Maximize, Minimize,
  SkipBack, SkipForward, Star, Calendar, Clock, Film,
  Users, Shield, Eye, ThumbsUp, MessageCircle, Crown, Zap
} from "lucide-react";
import { useState, useRef, useEffect, useCallback } from "react";

const Player = () => {
  const { slug } = useParams();
  const movie = mediaItems.find((m) => m.slug === slug);
  const videoRef = useRef<HTMLVideoElement>(null);
  const playerContainerRef = useRef<HTMLDivElement>(null);
  const controlsTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showControls, setShowControls] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const popupTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const FAKE_DURATION = 7592; // 2:06:32

  // Start 10s popup timer when video plays
  useEffect(() => {
    if (isPlaying && !showPopup) {
      popupTimerRef.current = setTimeout(() => {
        setShowPopup(true);
        videoRef.current?.pause();
        setIsPlaying(false);
      }, 10000);
    }
    return () => {
      if (popupTimerRef.current) clearTimeout(popupTimerRef.current);
    };
  }, [isPlaying, showPopup]);

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

  const togglePlay = useCallback(() => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play();
      setIsPlaying(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  }, []);

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

  if (!movie) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container py-20 text-center">
          <h1 className="font-display text-4xl text-foreground">Nie znaleziono filmu</h1>
          <Link to="/" className="mt-4 inline-block text-primary hover:underline">Wróć na stronę główną</Link>
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
      { user: "Kinomaniak92", avatar: "K", rating: 5, text: "Absolutnie genialny film! Jessie Buckley daje niesamowity występ. Obowiązkowa pozycja na ten rok.", time: "2 godziny temu", likes: 34 },
      { user: "FilmowyKrytyk", avatar: "F", rating: 4, text: "Świetna reinterpretacja klasycznej historii. Scenografia i zdjęcia są zapierające dech w piersiach.", time: "5 godzin temu", likes: 21 },
      { user: "CinemaFan_PL", avatar: "C", rating: 5, text: "Jeden z najlepszych horrorów ostatnich lat. Christian Bale jak zawsze na najwyższym poziomie!", time: "1 dzień temu", likes: 47 },
      { user: "AnnaW", avatar: "A", rating: 4, text: "Pięknie nakręcony, z świetną muzyką. Trochę za długi w środku, ale końcówka wynagrodzi wszystko.", time: "2 dni temu", likes: 15 },
    ],
    "dobry-chlopiec": [
      { user: "TomaszK", avatar: "T", rating: 5, text: "Jan Komasa znów pokazał klasę! Stephen Graham jest fenomenalny jako Chris — niepokojący i fascynujący jednocześnie.", time: "3 godziny temu", likes: 42 },
      { user: "KinoManiacPL", avatar: "K", rating: 4, text: "Mocny thriller psychologiczny. Toni Collette kradnie każdą scenę. Napięcie nie puszcza do ostatniej minuty.", time: "8 godzin temu", likes: 28 },
      { user: "DarkCinema", avatar: "D", rating: 5, text: "Brutalnie szczery film o resocjalizacji. Samson Kayo świetnie oddaje wewnętrzny konflikt Tommy'ego.", time: "1 dzień temu", likes: 53 },
      { user: "MagdaFilm", avatar: "M", rating: 4, text: "Komasa w angielskojęzycznym debiucie nie zawodzi. Klimat duszny i intensywny, aktorstwo na światowym poziomie.", time: "3 dni temu", likes: 19 },
    ],
    "bez-wyjscia": [
      { user: "AzjatyckaKlasyka", avatar: "A", rating: 5, text: "Park Chan-wook w szczytowej formie! Mistrzowskie połączenie czarnej komedii z thrillerem. Każdy kadr to dzieło sztuki.", time: "1 godzinę temu", likes: 67 },
      { user: "SeoulCinema", avatar: "S", rating: 5, text: "Choi Min-sik daje występ życia jako Man-su. Scena w biurze to czyste kino — napięcie sięga zenitu.", time: "4 godziny temu", likes: 45 },
      { user: "FilmNerd99", avatar: "F", rating: 4, text: "Genialny scenariusz, pełen zwrotów akcji. Park znów udowadnia, że jest jednym z najlepszych reżyserów na świecie.", time: "1 dzień temu", likes: 38 },
      { user: "KrytykFilmowy", avatar: "K", rating: 5, text: "2h 19min czystej adrenaliny. Koreańskie kino po raz kolejny pokazuje Hollywood, jak robi się prawdziwe thrillery.", time: "2 dni temu", likes: 51 },
    ],
    "odyseja": [
      { user: "NolanFanPL", avatar: "N", rating: 5, text: "Nolan po raz kolejny udowadnia, że jest mistrzem kina epickiego. Matt Damon jako Odyseusz to strzał w dziesiątkę!", time: "2 godziny temu", likes: 89 },
      { user: "EpicCinema", avatar: "E", rating: 5, text: "Zdjęcia kręcone w IMAX zapierają dech. Sceny morskie są tak realistyczne, że czujesz fale. Arcydzieło wizualne.", time: "6 godzin temu", likes: 72 },
      { user: "HistoriaFilmu", avatar: "H", rating: 4, text: "Zendaya jako Atena to rewelacja — majestatyczna i potężna. Tom Holland świetnie oddaje młodzieńczą determinację Telemacha.", time: "1 dzień temu", likes: 56 },
      { user: "CinephilePL", avatar: "C", rating: 5, text: "Nolan + Homer = absolutna perfekcja. Hans Zimmer stworzył ścieżkę dźwiękową, która zostaje w głowie na długo po seansie.", time: "3 dni temu", likes: 64 },
    ],
  };

  const cast = castBySlug[movie.slug] || castBySlug["panna-mloda"];
  const comments = commentsBySlug[movie.slug] || commentsBySlug["panna-mloda"];

  return (
    <div className="min-h-screen" style={{ background: "linear-gradient(180deg, hsl(220 20% 7%) 0%, hsl(220 25% 10%) 40%, hsl(225 20% 12%) 70%, hsl(220 20% 7%) 100%)" }}>
      <Header />

      {/* Video Player */}
      <div
        ref={playerContainerRef}
        className={`relative w-full cursor-pointer bg-black ${isFullscreen ? "" : "border-b border-border"}`}
        style={{ aspectRatio: isFullscreen ? undefined : "16/9", height: isFullscreen ? "100vh" : undefined, maxHeight: isFullscreen ? undefined : "70vh" }}
        onClick={togglePlay}
        onMouseMove={handleMouseMove}
      >
        <video
          ref={videoRef}
          src="/trailers/panna-mloda-trailer.mp4"
          className="absolute inset-0 h-full w-full object-contain bg-black"
          muted={isMuted}
          onTimeUpdate={() => setCurrentTime(videoRef.current?.currentTime || 0)}
          onLoadedMetadata={() => setDuration(videoRef.current?.duration || 0)}
          onEnded={() => setIsPlaying(false)}
          playsInline
        />

        {/* Play overlay when paused */}
        {!isPlaying && !showPopup && (
          <div className="absolute inset-0 flex items-center justify-center z-10 bg-black/30">
            <div className="group flex h-20 w-20 items-center justify-center rounded-full border-2 border-primary/50 bg-primary/20 text-primary backdrop-blur-sm transition-all hover:scale-110 hover:bg-primary/30 hover:border-primary">
              <Play className="h-9 w-9 fill-current ml-1 transition-transform group-hover:scale-110" />
            </div>
          </div>
        )}

        {/* Popup - registration required */}
        {showPopup && (
          <div className="absolute inset-0 z-40 flex items-center justify-center bg-black/85 backdrop-blur-sm" onClick={(e) => e.stopPropagation()}>
            <div className="mx-4 max-w-md w-full rounded-2xl border border-border bg-card p-8 text-center shadow-2xl animate-in fade-in zoom-in-95 duration-300">
              <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-primary/15 border border-primary/30">
                <Crown className="h-8 w-8 text-primary" />
              </div>
              <h3 className="font-display text-2xl tracking-wider text-foreground">
                Kontynuuj oglądanie
              </h3>
              <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
                Aby obejrzeć pełną wersję <span className="text-foreground font-medium">"{movie.title}"</span>, utwórz konto. 
                Zajmie to mniej niż 30 sekund — odblokuj dostęp do całej biblioteki filmów i seriali w najwyższej jakości.
              </p>

              {/* Social proof */}
              <div className="mt-4 flex items-center justify-center gap-4 text-xs text-muted-foreground">
                <span className="flex items-center gap-1"><Users className="h-3.5 w-3.5 text-primary" /> 12,847 użytkowników</span>
                <span className="flex items-center gap-1"><Shield className="h-3.5 w-3.5 text-primary" /> Bezpieczna rejestracja</span>
              </div>

              {/* Urgency */}
              <div className="mt-4 rounded-lg bg-primary/10 border border-primary/20 px-3 py-2 text-xs text-primary">
                🔥 Trending — ten film ogląda teraz 348 osób
              </div>

              <div className="mt-6 flex flex-col gap-3">
                <button className="w-full rounded-lg bg-primary px-4 py-3 text-sm font-bold text-primary-foreground transition-all hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/25 flex items-center justify-center gap-2">
                  <Zap className="h-4 w-4" />
                  Utwórz konto i oglądaj
                </button>
                <button className="w-full rounded-lg border border-border px-4 py-2.5 text-sm text-muted-foreground transition-colors hover:text-foreground hover:border-foreground/30">
                  Mam już konto — Zaloguj się
                </button>
                <button
                  onClick={() => {
                    setShowPopup(false);
                    if (videoRef.current) {
                      videoRef.current.currentTime = 0;
                    }
                  }}
                  className="text-xs text-muted-foreground/50 transition-colors hover:text-muted-foreground mt-1"
                >
                  Obejrzyj zwiastun ponownie
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Controls bar */}
        <div
          className={`absolute bottom-0 left-0 right-0 z-30 bg-gradient-to-t from-black/95 via-black/60 to-transparent px-4 pb-3 pt-12 transition-opacity duration-300 ${showControls || !isPlaying ? "opacity-100" : "opacity-0"}`}
          onClick={(e) => e.stopPropagation()}
        >
          <div
            className="group mb-2 h-1 w-full cursor-pointer rounded-full bg-muted/20 transition-all hover:h-1.5"
            onClick={handleProgressClick}
          >
            <div className="relative h-full rounded-full bg-primary transition-all" style={{ width: `${progress}%` }}>
              <div className="absolute right-0 top-1/2 -translate-y-1/2 h-3 w-3 rounded-full bg-primary opacity-0 group-hover:opacity-100 transition-opacity shadow-lg shadow-primary/50" />
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <button onClick={togglePlay} className="rounded-sm p-1 text-foreground/90 transition-colors hover:text-foreground">
                {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5 fill-current" />}
              </button>
              <button onClick={() => skip(-10)} className="rounded-sm p-1 text-foreground/60 transition-colors hover:text-foreground"><SkipBack className="h-4 w-4" /></button>
              <button onClick={() => skip(10)} className="rounded-sm p-1 text-foreground/60 transition-colors hover:text-foreground"><SkipForward className="h-4 w-4" /></button>
              <span className="ml-2 text-xs tabular-nums text-foreground/60">{formatTime(currentTime)} / 2:06:32</span>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => setIsMuted(!isMuted)} className="rounded-sm p-1 text-foreground/60 transition-colors hover:text-foreground">
                {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
              </button>
              <button onClick={toggleFullscreen} className="rounded-sm p-1 text-foreground/60 transition-colors hover:text-foreground">
                {isFullscreen ? <Minimize className="h-4 w-4" /> : <Maximize className="h-4 w-4" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Movie Info */}
      <main className="container py-10">
        <div className="flex flex-col gap-6 md:flex-row md:gap-10">
          {/* Poster */}
          <div className="shrink-0">
            <img src={movie.image} alt={movie.title} className="w-40 rounded-xl border border-border shadow-2xl md:w-52 transition-transform hover:scale-[1.02]" />
            {/* Quick stats under poster */}
            <div className="mt-4 space-y-2 text-xs text-muted-foreground">
              <div className="flex items-center gap-2"><Eye className="h-3.5 w-3.5 text-primary" /> 24,531 wyświetleń</div>
              <div className="flex items-center gap-2"><ThumbsUp className="h-3.5 w-3.5 text-primary" /> 98% pozytywnych</div>
              <div className="flex items-center gap-2"><MessageCircle className="h-3.5 w-3.5 text-primary" /> 142 komentarze</div>
            </div>
          </div>

          {/* Info */}
          <div className="flex-1">
            <h1 className="font-display text-3xl tracking-wider text-foreground md:text-4xl lg:text-5xl">
              {movie.title}
              <span className="ml-3 text-muted-foreground text-2xl md:text-3xl">({movie.year})</span>
            </h1>

            <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
              <span className="flex items-center gap-1"><Calendar className="h-3.5 w-3.5" />{movie.year}</span>
              {movie.duration && (
                <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" />{movie.duration.replace(":", "h ").replace(":", "m ")}s</span>
              )}
              <span className="flex items-center gap-1"><Film className="h-3.5 w-3.5" />Warner Bros. Pictures</span>
            </div>

            {/* Rating */}
            <div className="mt-5 flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary/15 border border-primary/30">
                <span className="font-display text-xl text-primary">9.2</span>
              </div>
              <div>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star key={i} className={`h-4 w-4 ${i <= 4 ? "fill-primary text-primary" : "fill-primary/30 text-primary/30"}`} />
                  ))}
                </div>
                <span className="text-xs text-muted-foreground mt-1 block">Na podstawie 1,247 ocen</span>
              </div>
            </div>

            {/* Genres */}
            <div className="mt-5 flex flex-wrap gap-2">
              {genres.map((genre) => (
                <span key={genre} className="rounded-lg border border-border bg-secondary/50 px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary cursor-pointer">
                  {genre.trim()}
                </span>
              ))}
            </div>

            {/* Description */}
            {movie.description && (
              <div className="mt-6">
                <h2 className="font-display text-lg tracking-wider text-foreground mb-2">Opis</h2>
                <p className="max-w-3xl leading-relaxed text-muted-foreground text-sm">{movie.description}</p>
              </div>
            )}

            {/* CTA buttons */}
            <div className="mt-8 flex flex-wrap gap-3">
              <button
                className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-bold text-primary-foreground transition-all hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/25"
                onClick={() => {
                  if (videoRef.current) {
                    videoRef.current.currentTime = 0;
                    videoRef.current.play();
                    setIsPlaying(true);
                    setShowPopup(false);
                  }
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
              >
                <Play className="h-4 w-4 fill-current" />
                Oglądaj zwiastun
              </button>
              <button className="inline-flex items-center gap-2 rounded-lg border border-primary/30 bg-primary/10 px-6 py-3 text-sm font-semibold text-primary transition-all hover:bg-primary/20">
                <Crown className="h-4 w-4" />
                Oglądaj cały film
              </button>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="my-10 h-px bg-border" />

        {/* Cast Section */}
        <section>
          <h2 className="font-display text-2xl tracking-wider text-foreground mb-6 flex items-center gap-2">
            <Users className="h-5 w-5 text-primary" /> Obsada
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
            {cast.map((person) => (
              <div key={person.name} className="group flex flex-col items-center rounded-xl border border-border bg-card/50 p-4 transition-all hover:border-primary/30 hover:bg-card">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-secondary text-foreground font-display text-lg mb-3 border border-border group-hover:border-primary/30 transition-colors">
                  {person.avatar}
                </div>
                <span className="text-sm font-medium text-foreground text-center">{person.name}</span>
                <span className="text-xs text-muted-foreground mt-0.5">{person.role}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Divider */}
        <div className="my-10 h-px bg-border" />

        {/* Comments Section */}
        <section>
          <h2 className="font-display text-2xl tracking-wider text-foreground mb-6 flex items-center gap-2">
            <MessageCircle className="h-5 w-5 text-primary" /> Komentarze
            <span className="text-sm font-normal text-muted-foreground ml-2">({comments.length})</span>
          </h2>

          {/* Add comment CTA */}
          <div className="mb-6 rounded-xl border border-border bg-card/50 p-5">
            <p className="text-sm text-muted-foreground mb-3">Chcesz dodać komentarz? Utwórz konto w kilka sekund.</p>
            <button className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-all hover:bg-primary/90">
              <Zap className="h-3.5 w-3.5" />
              Utwórz konto i komentuj
            </button>
          </div>

          <div className="space-y-4">
            {comments.map((comment, i) => (
              <div key={i} className="rounded-xl border border-border bg-card/30 p-5 transition-colors hover:bg-card/50">
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-secondary text-foreground font-display text-sm border border-border">
                    {comment.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 flex-wrap">
                      <span className="text-sm font-semibold text-foreground">{comment.user}</span>
                      <div className="flex items-center gap-0.5">
                        {Array.from({ length: 5 }).map((_, j) => (
                          <Star key={j} className={`h-3 w-3 ${j < comment.rating ? "fill-primary text-primary" : "text-muted/30"}`} />
                        ))}
                      </div>
                      <span className="text-xs text-muted-foreground">{comment.time}</span>
                    </div>
                    <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{comment.text}</p>
                    <div className="mt-3 flex items-center gap-4">
                      <button className="flex items-center gap-1.5 text-xs text-muted-foreground transition-colors hover:text-primary">
                        <ThumbsUp className="h-3.5 w-3.5" /> {comment.likes}
                      </button>
                      <button className="flex items-center gap-1.5 text-xs text-muted-foreground transition-colors hover:text-foreground">
                        Odpowiedz
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Bottom CTA Banner */}
        <div className="my-10 rounded-2xl border border-primary/20 bg-gradient-to-r from-primary/10 via-primary/5 to-transparent p-8 text-center md:text-left md:flex md:items-center md:justify-between">
          <div>
            <h3 className="font-display text-xl tracking-wider text-foreground">Nie przegap żadnego filmu</h3>
            <p className="mt-1 text-sm text-muted-foreground">Dołącz do 12,847 widzów i oglądaj w najwyższej jakości.</p>
          </div>
          <div className="mt-4 md:mt-0 flex flex-col sm:flex-row gap-3">
            <button className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-bold text-primary-foreground transition-all hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/25">
              <Zap className="h-4 w-4" />
              Utwórz konto
            </button>
            <button className="inline-flex items-center gap-2 rounded-lg border border-border px-6 py-3 text-sm font-medium text-muted-foreground transition-all hover:text-foreground hover:border-foreground/30">
              Zaloguj się
            </button>
          </div>
        </div>

        {/* Back link */}
        <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-primary">
          <ArrowLeft className="h-4 w-4" /> Wróć do katalogu
        </Link>
      </main>
    </div>
  );
};

export default Player;
