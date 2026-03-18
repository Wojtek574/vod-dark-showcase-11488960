import { useParams, Link, useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import MediaRow from "@/components/MediaRow";
import { mediaItems } from "@/data/movies";
import {
  ArrowLeft, Play, Pause, Volume2, VolumeX, Maximize, Minimize,
  SkipBack, SkipForward, Star, Clock, Film, Calendar,
  Users, Shield, ThumbsUp, MessageCircle, Crown, Zap,
  Plus, Share2, ChevronDown, User, Search
} from "lucide-react";
import { useState, useRef, useEffect, useCallback, useMemo } from "react";

const Player = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
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
  const [descExpanded, setDescExpanded] = useState(false);
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

  // 10s popup timer from play start
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

  const startPlayback = () => {
    setIsPlaying(true);
    setTimeout(() => {
      videoRef.current?.play();
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
    "projekt-hail-mary": [
      { name: "Ryan Gosling", role: "Ryland Grace", avatar: "RG" },
      { name: "Sandra Hüller", role: "Eva Stratt", avatar: "SH" },
      { name: "Awkwafina", role: "Dr. Lokken", avatar: "AW" },
      { name: "Kumail Nanjiani", role: "Rocky (głos)", avatar: "KN" },
    ],
    "lup": [
      { name: "Matt Damon", role: "Sgt. Walker", avatar: "MD" },
      { name: "Ben Affleck", role: "Det. Torres", avatar: "BA" },
      { name: "Steven Yeun", role: "Danny", avatar: "SY" },
      { name: "Teyana Taylor", role: "Agent Cruz", avatar: "TT" },
      { name: "Kyle Chandler", role: "Kapitan Briggs", avatar: "KC" },
    ],
    "peaky-blinders-niesmiertelny": [
      { name: "Cillian Murphy", role: "Tommy Shelby", avatar: "CM" },
      { name: "Stephen Graham", role: "Hayden Stagg", avatar: "SG" },
      { name: "Rebecca Ferguson", role: "Lady Diana", avatar: "RF" },
      { name: "Tim Roth", role: "Dr. Holford", avatar: "TR" },
      { name: "Barry Keoghan", role: "Duke Shelby", avatar: "BK" },
    ],
    "narnia": [
      { name: "Emma Mackey", role: "Biała Czarownica", avatar: "EM" },
      { name: "Meryl Streep", role: "Aslan (głos)", avatar: "MS" },
      { name: "Daniel Craig", role: "Wuj Andrew", avatar: "DC" },
      { name: "Carey Mulligan", role: "Polly", avatar: "CM" },
    ],
    "apex": [
      { name: "Charlize Theron", role: "Kate", avatar: "CT" },
      { name: "Taron Egerton", role: "Viktor", avatar: "TE" },
      { name: "Eric Bana", role: "Ranger Jim", avatar: "EB" },
    ],
    "hopnieci": [
      { name: "Piper Curda", role: "Lily (głos)", avatar: "PC" },
      { name: "Jon Hamm", role: "Kapitan (głos)", avatar: "JH" },
    ],
    "krol-dopalaczy": [
      { name: "Tomasz Włosok", role: "Kamil", avatar: "TW" },
      { name: "Vanessa Aleksander", role: "Ola", avatar: "VA" },
    ],
    "reminders-of-him": [
      { name: "Maika Monroe", role: "Kenna Rowan", avatar: "MM" },
      { name: "Tyriq Withers", role: "Ledger Ward", avatar: "TW" },
    ],
    "enola-holmes-3": [
      { name: "Millie Bobby Brown", role: "Enola Holmes", avatar: "MB" },
      { name: "Henry Cavill", role: "Sherlock Holmes", avatar: "HC" },
    ],
    "adventures-of-cliff-booth": [
      { name: "Brad Pitt", role: "Cliff Booth", avatar: "BP" },
      { name: "Elizabeth Debicki", role: "Veronica", avatar: "ED" },
      { name: "Yahya Abdul-Mateen II", role: "Jerome", avatar: "YA" },
      { name: "Timothy Olyphant", role: "Rick Dalton Jr.", avatar: "TO" },
    ],
    "here-comes-the-flood": [
      { name: "Denzel Washington", role: "Marcus", avatar: "DW" },
      { name: "Robert Pattinson", role: "Leo", avatar: "RP" },
      { name: "Daisy Edgar-Jones", role: "Ana", avatar: "DE" },
    ],
    "nie-ma-duchow": [
      { name: "Zuzanna Puławska", role: "Hania", avatar: "ZP" },
      { name: "Jakub Gierszał", role: "Maciek", avatar: "JG" },
      { name: "Maria Sobocińska", role: "Zosia", avatar: "MS" },
      { name: "Jan Wieteska", role: "Bartek", avatar: "JW" },
    ],
    "testament-ann-lee": [
      { name: "Joaquin Phoenix", role: "Elder Joseph", avatar: "JP" },
      { name: "Florence Pugh", role: "Ann Lee", avatar: "FP" },
      { name: "Mark Rylance", role: "Reverend", avatar: "MR" },
    ],
    "najbogatsza-kobieta-swiata": [
      { name: "Léa Seydoux", role: "Liliane", avatar: "LS" },
      { name: "Vincent Cassel", role: "François", avatar: "VC" },
      { name: "Isabelle Huppert", role: "Madame Bettencourt", avatar: "IH" },
    ],
    "wierzymy-ci": [
      { name: "Veerle Baetens", role: "Alice", avatar: "VB" },
      { name: "Arieh Worthalter", role: "Marc", avatar: "AW" },
    ],
    "angels-egg": [
      { name: "Mako Hyōdō", role: "Dziewczyna (głos)", avatar: "MH" },
      { name: "Jinpachi Nezu", role: "Chłopak (głos)", avatar: "JN" },
    ],
    "baw-sie-dobrze": [
      { name: "Josh Brolin", role: "Rex", avatar: "JB" },
      { name: "Daisy Ridley", role: "Zara", avatar: "DR" },
      { name: "Pedro Pascal", role: "Vince", avatar: "PP" },
      { name: "Awkwafina", role: "Mei", avatar: "AW" },
    ],
    "zmartwychwstanie": [
      { name: "Tang Wei", role: "Kobieta", avatar: "TW" },
      { name: "Lee Kang-sheng", role: "Stworzenie", avatar: "LK" },
      { name: "Sylvia Chang", role: "Starsza kobieta", avatar: "SC" },
    ],
    "wielka-mala-koza": [
      { name: "Dwayne Johnson", role: "Coach (głos)", avatar: "DJ" },
      { name: "Zendaya", role: "Koza Gigi (głos)", avatar: "ZE" },
      { name: "Jack Black", role: "Byk (głos)", avatar: "JB" },
    ],
    "wartosc-sentymentalna": [
      { name: "Renate Reinsve", role: "Nora", avatar: "RR" },
      { name: "Anders Danielsen Lie", role: "Ojciec", avatar: "AD" },
      { name: "Elle Fanning", role: "Liv", avatar: "EF" },
    ],
    "to-byl-zwykly-przypadek": [
      { name: "Jafar Panahi", role: "Reżyser / Aktor", avatar: "JP" },
      { name: "Mina Kavani", role: "Sara", avatar: "MK" },
      { name: "Bakhtiar Panjeei", role: "Ali", avatar: "BP" },
    ],
    "kopnelabym-cie": [
      { name: "Rose Byrne", role: "Linda", avatar: "RB" },
      { name: "A24 Ensemble", role: "Obsada", avatar: "A2" },
    ],
    "muppet-show": [
      { name: "Sabrina Carpenter", role: "Gość specjalny", avatar: "SC" },
      { name: "Matt Vogel", role: "Kermit (głos)", avatar: "MV" },
      { name: "Eric Jacobson", role: "Miss Piggy (głos)", avatar: "EJ" },
    ],
    "orzelek-iggy": [
      { name: "Głosy polskie", role: "Obsada polska", avatar: "GP" },
      { name: "Bartosz Kędzierski", role: "Reżyser", avatar: "BK" },
    ],
    "dalej-jazda-2": [
      { name: "Antoni Królikowski", role: "Józiek", avatar: "AK" },
      { name: "Olga Bołądź", role: "Ela", avatar: "OB" },
      { name: "Tomasz Karolak", role: "Wujek", avatar: "TK" },
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
    "projekt-hail-mary": [
      { user: "SciFiFan", avatar: "S", rating: 5, text: "Ryan Gosling idealnie pasuje do roli samotnego astronauty!", time: "3 godziny temu", likes: 72 },
      { user: "KosmicznyPodróżnik", avatar: "K", rating: 5, text: "Adaptacja książki Andyego Weira na najwyższym poziomie.", time: "6 godzin temu", likes: 58 },
    ],
    "lup": [
      { user: "ActionFanPL", avatar: "A", rating: 5, text: "Damon i Affleck znów razem — czego chcieć więcej?", time: "2 godziny temu", likes: 91 },
      { user: "ThrillerManiak", avatar: "T", rating: 4, text: "Napięcie rośnie z każdą minutą. Świetny heist movie.", time: "8 godzin temu", likes: 44 },
    ],
    "peaky-blinders-niesmiertelny": [
      { user: "ShelbyFan", avatar: "S", rating: 5, text: "Tommy Shelby powraca i jest lepszy niż kiedykolwiek!", time: "1 godzinę temu", likes: 112 },
      { user: "BirminghamBoy", avatar: "B", rating: 5, text: "Barry Keoghan kradnie każdą scenę. Fenomenalny film.", time: "4 godziny temu", likes: 87 },
    ],
    "narnia": [
      { user: "FantasyLover", avatar: "F", rating: 5, text: "Greta Gerwig stworzyła magiczny, piękny świat Narnii.", time: "5 godzin temu", likes: 63 },
      { user: "BookWorm", avatar: "B", rating: 4, text: "Wierna adaptacja. Meryl Streep jako głos Aslana to strzał w dziesiątkę.", time: "1 dzień temu", likes: 41 },
    ],
    "apex": [
      { user: "MountainClimber", avatar: "M", rating: 5, text: "Charlize Theron w roli survivalowej — idealna obsada!", time: "3 godziny temu", likes: 55 },
      { user: "AdventureSeeker", avatar: "A", rating: 4, text: "Trzyma w napięciu od początku do końca.", time: "12 godzin temu", likes: 33 },
    ],
    "krol-dopalaczy": [
      { user: "PolskieKino", avatar: "P", rating: 4, text: "Mocny polski film akcji. Włosok gra fenomenalnie.", time: "2 godziny temu", likes: 38 },
      { user: "Krytyk_PL", avatar: "K", rating: 4, text: "Brutalne, ale potrzebne kino o problemie dopalaczy w Polsce.", time: "8 godzin temu", likes: 29 },
    ],
    "adventures-of-cliff-booth": [
      { user: "TarantinoFan", avatar: "T", rating: 5, text: "Fincher + scenariusz Tarantino = arcydzieło!", time: "1 godzinę temu", likes: 134 },
      { user: "HollywoodNights", avatar: "H", rating: 5, text: "Brad Pitt znów pokazuje, dlaczego dostał Oscara za tę rolę.", time: "5 godzin temu", likes: 98 },
    ],
    "here-comes-the-flood": [
      { user: "HeistMovieFan", avatar: "H", rating: 5, text: "Denzel Washington i Robert Pattinson razem? Niesamowite!", time: "4 godziny temu", likes: 76 },
      { user: "CinematicArt", avatar: "C", rating: 4, text: "Meirelles udowadnia, że potrafi kręcić trzymające w napięciu kino.", time: "1 dzień temu", likes: 52 },
    ],
    "hopnieci": [
      { user: "AnimacjaFan", avatar: "A", rating: 5, text: "Pixar znów w formie! Koncept hopnozy jest genialny i oryginalny.", time: "1 godzinę temu", likes: 83 },
      { user: "RodzinneKino", avatar: "R", rating: 5, text: "Dzieci były zachwycone, a dorośli wzruszeni. Idealny film familijny!", time: "4 godziny temu", likes: 61 },
      { user: "BóbrMechaniczny", avatar: "B", rating: 4, text: "Animacja na najwyższym poziomie. Sceny z bobrami to coś pięknego.", time: "1 dzień temu", likes: 47 },
    ],
    "reminders-of-him": [
      { user: "BookToFilm", avatar: "B", rating: 5, text: "Wierna adaptacja Colleen Hoover. Maika Monroe łamie serce w każdej scenie.", time: "2 godziny temu", likes: 74 },
      { user: "DramaQueen", avatar: "D", rating: 5, text: "Płakałam trzy razy. Piękna historia o drugich szansach i przebaczeniu.", time: "6 godzin temu", likes: 92 },
      { user: "CineLove", avatar: "C", rating: 4, text: "Tyriq Withers to odkrycie roku. Chemia między aktorami jest niesamowita.", time: "1 dzień temu", likes: 55 },
    ],
    "enola-holmes-3": [
      { user: "SherlockFan", avatar: "S", rating: 5, text: "Millie Bobby Brown dojrzała w tej roli. Najlepsza część trylogii!", time: "3 godziny temu", likes: 68 },
      { user: "MysteryLover", avatar: "M", rating: 4, text: "Mroczniejszy ton idealnie pasuje. Zagadka kryminalna trzyma do końca.", time: "8 godzin temu", likes: 41 },
      { user: "BakerStreet", avatar: "B", rating: 5, text: "Philip Barantini dodał serialowi świeżości. Chcę czwartą część!", time: "1 dzień temu", likes: 53 },
    ],
    "zielona-mila": [
      { user: "KlasykaKina", avatar: "K", rating: 5, text: "Arcydzieło. Tom Hanks i Michael Clarke Duncan tworzą niezapomniany duet.", time: "1 godzinę temu", likes: 156 },
      { user: "StephenKingFan", avatar: "S", rating: 5, text: "Najlepsza adaptacja Kinga obok Shawshank. Płaczę za każdym razem.", time: "3 godziny temu", likes: 134 },
      { user: "RetroFilm", avatar: "R", rating: 5, text: "Film, który powinien wygrać Oscara. Ponadczasowa historia o ludzkości i cudach.", time: "1 dzień temu", likes: 112 },
    ],
    "skazani-na-shawshank": [
      { user: "TopIMDB", avatar: "T", rating: 5, text: "Numer jeden na liście najlepszych filmów wszech czasów nie bez powodu.", time: "2 godziny temu", likes: 203 },
      { user: "MorganFreemanFan", avatar: "M", rating: 5, text: "Narracja Reda to czysta poezja. Freeman w życiowej roli.", time: "5 godzin temu", likes: 178 },
      { user: "FilmoweKlasyki", avatar: "F", rating: 5, text: "Końcówka na plaży to jedna z najpiękniejszych scen w historii kina.", time: "1 dzień temu", likes: 145 },
    ],
    "forrest-gump": [
      { user: "RunForrestRun", avatar: "R", rating: 5, text: "Życie jest jak pudełko czekoladek — i ten film też. Pełen niespodzianek.", time: "1 godzinę temu", likes: 189 },
      { user: "90sKids", avatar: "9", rating: 5, text: "Tom Hanks zasłużenie dostał Oscara. Forrest to postać, którą się kocha.", time: "4 godziny temu", likes: 167 },
      { user: "HistoriaUSA", avatar: "H", rating: 5, text: "Genialny sposób opowiedzenia historii Ameryki przez pryzmat jednego człowieka.", time: "1 dzień temu", likes: 131 },
    ],
    "za-duzy-na-bajki-3": [
      { user: "PolskaRodzina", avatar: "P", rating: 4, text: "Ważny temat hejtu w internecie podany w przystępny sposób dla młodszych widzów.", time: "2 godziny temu", likes: 45 },
      { user: "MamaWKinie", avatar: "M", rating: 5, text: "Najlepsza część serii! Waldek dorasta i problemy rosną razem z nim.", time: "6 godzin temu", likes: 38 },
      { user: "FamilijneKino", avatar: "F", rating: 4, text: "Kristoffer Rus znów trafił w sedno. Film, który warto obejrzeć z dziećmi.", time: "1 dzień temu", likes: 29 },
    ],
    "cybershadow": [
      { user: "NeonRunner", avatar: "N", rating: 4, text: "Klimat cyberpunka oddany perfekcyjnie. Świetna ścieżka dźwiękowa!", time: "3 godziny temu", likes: 32 },
      { user: "SciFiGeek", avatar: "S", rating: 4, text: "Solidne sci-fi z ciekawym światem i nieszablonową fabułą.", time: "8 godzin temu", likes: 24 },
    ],
    "noir-district": [
      { user: "NoirLover", avatar: "N", rating: 5, text: "Mroczny klimat, świetna gra cieni i napięcie do ostatniej sceny.", time: "2 godziny temu", likes: 41 },
      { user: "ThrillerExpert", avatar: "T", rating: 4, text: "Klasyczny noir w nowoczesnym wydaniu. Twist na końcu zaskakuje.", time: "1 dzień temu", likes: 33 },
    ],
    "smocze-krolestwo": [
      { user: "FantasyWorld", avatar: "F", rating: 5, text: "Smoki wyglądają niesamowicie! Epicka przygoda dla całej rodziny.", time: "4 godziny temu", likes: 57 },
      { user: "DragonSlayer", avatar: "D", rating: 4, text: "Piękny świat fantasy z głęboką historią. Czekam na kontynuację!", time: "1 dzień temu", likes: 43 },
    ],
    "widmowa-rezydencja": [
      { user: "HorrorNight", avatar: "H", rating: 5, text: "Naprawdę straszny! Dawno nie miałem takiego dreszczu w kinie.", time: "1 godzinę temu", likes: 62 },
      { user: "GhostHunter", avatar: "G", rating: 4, text: "Atmosfera jest gęsta jak mgła. Świetne efekty praktyczne.", time: "6 godzin temu", likes: 38 },
    ],
    "cisza-przed-burza": [
      { user: "SerialManiak", avatar: "S", rating: 5, text: "Jeden z najlepszych polskich seriali kryminalnych. Każdy odcinek zaskakuje.", time: "3 godziny temu", likes: 48 },
      { user: "DetektywPL", avatar: "D", rating: 4, text: "Powolne budowanie napięcia, które eksploduje w finale sezonu.", time: "1 dzień temu", likes: 35 },
    ],
    "ostatni-ocaleni": [
      { user: "DramaturgPL", avatar: "D", rating: 5, text: "Poruszający dramat o przetrwaniu. Aktorstwo na światowym poziomie.", time: "2 godziny temu", likes: 44 },
      { user: "EmocjeWKinie", avatar: "E", rating: 5, text: "Serial, który zostaje z tobą na długo po obejrzeniu.", time: "8 godzin temu", likes: 39 },
    ],
    "gwiezdny-horyzont": [
      { user: "StarTrekker", avatar: "S", rating: 5, text: "Kosmiczna opera z duszą! Efekty specjalne na poziomie Hollywood.", time: "1 godzinę temu", likes: 51 },
      { user: "GalaxySurfer", avatar: "G", rating: 4, text: "Świetnie napisane postacie i fascynujący świat. Serial roku!", time: "5 godzin temu", likes: 37 },
    ],
    "zlote-wybrzeze": [
      { user: "RomansLover", avatar: "R", rating: 5, text: "Piękne zdjęcia, wzruszająca historia miłosna. Idealne na wieczór we dwoje.", time: "4 godziny temu", likes: 46 },
      { user: "SunsetVibes", avatar: "S", rating: 4, text: "Lekki, ciepły serial z fantastyczną chemią między głównymi aktorami.", time: "1 dzień temu", likes: 31 },
    ],
    "nie-ma-duchow": [
      { user: "PolskiDramat", avatar: "P", rating: 5, text: "Emi Buchwald stworzyła intymny portret rodzeństwa na progu dorosłości. Dusiołek to genialna metafora!", time: "2 godziny temu", likes: 52 },
      { user: "WarszawskieKino", avatar: "W", rating: 5, text: "Zasłużone Orły! Czworo aktorów gra tak naturalnie, jakby naprawdę byli rodziną.", time: "6 godzin temu", likes: 41 },
      { user: "DebiutRoku", avatar: "D", rating: 4, text: "Świeży głos w polskim kinie. Scenariusz pełen ciepła i humoru mimo trudnych tematów.", time: "1 dzień temu", likes: 33 },
    ],
    "testament-ann-lee": [
      { user: "HistoriaKina", avatar: "H", rating: 5, text: "Fascynujący portret kobiety, która zmieniła historię religii w Ameryce. Muzyka jest hipnotyzująca.", time: "3 godziny temu", likes: 47 },
      { user: "MusicalFan", avatar: "M", rating: 4, text: "Mona Fastvold łączy dramat z musicalem w sposób, który nigdy wcześniej nie był tak poruszający.", time: "8 godzin temu", likes: 35 },
      { user: "IndieSpirit", avatar: "I", rating: 5, text: "Nagroda Independent Spirit w pełni zasłużona. Brady Corbet znów współtworzył coś wyjątkowego.", time: "1 dzień temu", likes: 58 },
    ],
    "najbogatsza-kobieta-swiata": [
      { user: "FrancuskieKino", avatar: "F", rating: 4, text: "Elegancki dramat o władzy, pięknie i obsesji. Zdjęcia jak z magazynu mody.", time: "2 godziny temu", likes: 38 },
      { user: "CezarFan", avatar: "C", rating: 4, text: "Nagrodzony Cezarem nie bez powodu. Aktorstwo na najwyższym poziomie.", time: "5 godzin temu", likes: 29 },
      { user: "ArtHouse", avatar: "A", rating: 5, text: "Thierry Klifa stworzył hipnotyzujący portret miłości i ambicji w świecie luksusu.", time: "1 dzień temu", likes: 44 },
    ],
    "wierzymy-ci": [
      { user: "DokumentFan", avatar: "D", rating: 5, text: "Brutalnie szczery film o walce matki o swoje dzieci. Ściska za serce.", time: "1 godzinę temu", likes: 56 },
      { user: "BelgijskieKino", avatar: "B", rating: 5, text: "Zaledwie 78 minut, a każda sekunda jest naładowana emocjami. Rewelacyjna rola główna.", time: "4 godziny temu", likes: 42 },
      { user: "PrawdziweHistorie", avatar: "P", rating: 4, text: "Film, który zmusza do myślenia o systemie sądowniczym. Dufeys i Devillers — duet do zapamiętania.", time: "1 dzień temu", likes: 31 },
    ],
    "angels-egg": [
      { user: "AnimeKlasyk", avatar: "A", rating: 5, text: "Mamoru Oshii stworzył arcydzieło surrealizmu. Każda klatka to dzieło sztuki.", time: "1 godzinę temu", likes: 89 },
      { user: "OshiiFan", avatar: "O", rating: 5, text: "40 lat i ani chwila nie straciła na aktualności. Symbolika jajka i krzyża jest ponadczasowa.", time: "5 godzin temu", likes: 72 },
      { user: "ArtAnimation", avatar: "A", rating: 5, text: "Wreszcie na wielkim ekranie w Polsce! Cisza tego filmu mówi więcej niż tysiąc dialogów.", time: "1 dzień temu", likes: 64 },
    ],
    "baw-sie-dobrze": [
      { user: "VerbiskiFan", avatar: "V", rating: 4, text: "Gore Verbinski wraca do formy! Szalona mieszanka sci-fi i komedii w barze pełnym dziwacznych postaci.", time: "3 godziny temu", likes: 51 },
      { user: "SciFiAction", avatar: "S", rating: 4, text: "Koncept podróżnika z przyszłości rekrutującego bywalców knajpy jest genialny i absurdalny zarazem.", time: "6 godzin temu", likes: 38 },
      { user: "PopcornMovie", avatar: "P", rating: 5, text: "Czysta rozrywka! Zbuntowana AI, barowi bohaterowie i jedna szalona noc w LA.", time: "1 dzień temu", likes: 45 },
    ],
    "zmartwychwstanie": [
      { user: "ZłotaPalma", avatar: "Z", rating: 5, text: "Gan Bi stworzył wizualną poezję. Każda scena snów wygląda jak obraz olejny ożywiony światłem.", time: "1 godzinę temu", likes: 87 },
      { user: "SennyWidz", avatar: "S", rating: 5, text: "Film, który ogląda się jak medytację. 2 godziny 40 minut i ani sekundy nudy — czysta hipnoza.", time: "5 godzin temu", likes: 63 },
      { user: "ArtKino", avatar: "A", rating: 4, text: "Cannes nagrodziło słusznie. To kino dla cierpliwych, ale nagroda jest ogromna.", time: "1 dzień temu", likes: 49 },
    ],
    "wielka-mala-koza": [
      { user: "AnimacjaRządzi", avatar: "A", rating: 5, text: "Disney znów trafił w serce! Mała koza z wielkimi marzeniami — moje dzieci chcą ją na pluszaka.", time: "2 godziny temu", likes: 94 },
      { user: "SportowyFan", avatar: "S", rating: 4, text: "Rykokosz to najlepszy wymyślony sport od quidditcha. Areny wyglądają obłędnie!", time: "6 godzin temu", likes: 71 },
      { user: "FamilijneKino2", avatar: "F", rating: 5, text: "Śmialiśmy się, płakaliśmy, kibicowaliśmy. Film idealny na rodzinny weekend.", time: "1 dzień temu", likes: 58 },
    ],
    "wartosc-sentymentalna": [
      { user: "OscarWatch", avatar: "O", rating: 5, text: "Joachim Trier dotknął czegoś uniwersalnego. Relacja sióstr z ojcem pokazana z chirurgiczną precyzją i ciepłem.", time: "1 godzinę temu", likes: 102 },
      { user: "NordicCinema", avatar: "N", rating: 5, text: "Renate Reinsve po 'Najgorszym człowieku na świecie' znów zachwyca. Nagroda w pełni zasłużona.", time: "4 godziny temu", likes: 78 },
      { user: "EmocjePL", avatar: "E", rating: 4, text: "Film, który zostaje pod skórą. Prosty temat — ojciec wraca — a emocje jak tsunami.", time: "1 dzień temu", likes: 61 },
    ],
    "to-byl-zwykly-przypadek": [
      { user: "PanahiFan", avatar: "P", rating: 5, text: "Mistrz irańskiego kina pokazuje, jak z małego zdarzenia stworzyć wielkie kino. Złota Palma zasłużona!", time: "2 godziny temu", likes: 76 },
      { user: "FestiwaloweFenomeny", avatar: "F", rating: 5, text: "Panahi kręci z zakazem kręcenia i nadal robi lepsze filmy niż 90% Hollywood.", time: "6 godzin temu", likes: 64 },
      { user: "KinoAutorskie", avatar: "K", rating: 4, text: "Minimalizm formy, maksymalizm treści. 1:45 czystej prawdy o ludzkich konsekwencjach.", time: "1 dzień temu", likes: 48 },
    ],
    "kopnelabym-cie": [
      { user: "A24Maniak", avatar: "A", rating: 5, text: "Rose Byrne w roli życia! Czarna komedia, która śmieszy i jednocześnie mrozi krew w żyłach.", time: "1 godzinę temu", likes: 83 },
      { user: "ZłotyGlob", avatar: "Z", rating: 5, text: "Nagroda Złotego Globu w pełni zasłużona. Mary Bronstein debiutuje z hukiem.", time: "5 godzin temu", likes: 67 },
      { user: "DarkHumor", avatar: "D", rating: 4, text: "Nie wiem czy się śmiałam czy płakałam. Sceny z terapeutą to czyste złoto.", time: "1 dzień temu", likes: 52 },
    ],
    "muppet-show": [
      { user: "MuppetFan", avatar: "M", rating: 5, text: "Kermit i spółka wracają i jest dokładnie tak, jak powinno być — ciepło, śmiesznie i z duszą!", time: "2 godziny temu", likes: 73 },
      { user: "DisneyPlusPL", avatar: "D", rating: 5, text: "Sabrina Carpenter jako gość specjalny to strzał w dziesiątkę. Muzyczne numery są fantastyczne.", time: "6 godzin temu", likes: 61 },
      { user: "NostalgiaTV", avatar: "N", rating: 4, text: "30 minut czystej radości. Muppety udowadniają, że są ponadczasowe.", time: "1 dzień temu", likes: 47 },
    ],
    "orzelek-iggy": [
      { user: "PolskaAnimacja", avatar: "P", rating: 5, text: "Polska animacja na światowym poziomie! Iggy to bohater, jakiego potrzebowaliśmy — marzy, walczy, lata.", time: "1 godzinę temu", likes: 68 },
      { user: "EkranFree", avatar: "E", rating: 4, text: "Świetny przekaz o odłożeniu telefonu i spojrzeniu w niebo. Dzieci były zachwycone.", time: "4 godziny temu", likes: 52 },
      { user: "AnimacjaPL", avatar: "A", rating: 5, text: "Kędzierski stworzył coś wyjątkowego. FRUUUstracja Iggy'ego jest tak urocza, że chce się go przytulić.", time: "1 dzień temu", likes: 41 },
    ],
    "dalej-jazda-2": [
      { user: "PolskaKomedia", avatar: "P", rating: 4, text: "Lepsza niż jedynka! Ślubne perypetie Józka i Eli to komedia pomyłek w najlepszym stylu.", time: "2 godziny temu", likes: 56 },
      { user: "KinoweŚmiechy", avatar: "K", rating: 4, text: "Królikowski i Bołądź mają świetną chemię. Sala kinowa ryczała ze śmiechu.", time: "5 godzin temu", likes: 43 },
      { user: "WeekendoweKino", avatar: "W", rating: 5, text: "Idealny film na luźny wieczór. Zero pretensji, sto procent zabawy!", time: "1 dzień temu", likes: 37 },
    ],
  };

  const cast = castBySlug[movie.slug] || castBySlug["panna-mloda"];
  const comments = commentsBySlug[movie.slug] || commentsBySlug["panna-mloda"];

  const introSrc = "/intros/intro.mp4";

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
                {movie.premiereDate && (
                  <span className="inline-flex items-center gap-1.5 rounded border border-primary/50 bg-primary/10 px-3 py-1.5 text-xs font-bold text-primary">
                    <Calendar className="h-3.5 w-3.5" />
                    Premiera: {new Date(movie.premiereDate).toLocaleDateString("pl-PL", { day: "numeric", month: "long", year: "numeric" })}
                  </span>
                )}
                {movie.platform && (
                  <span className="inline-flex items-center rounded border border-primary/30 bg-primary/5 px-3 py-1.5 text-xs text-foreground">
                    📺 {movie.platform}
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
                <a href="https://securedeal.pro/a/rkLGi2AVgsyo3p?ld=1103" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded bg-primary px-4 py-2 text-sm font-bold text-primary-foreground transition-all hover:bg-primary/90 shrink-0">
                   <User className="h-4 w-4" />
                   Rozpocznij teraz
                 </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Video Player ─── */}
      <div className="px-2 md:px-8 max-w-screen-xl mx-auto -mt-4 mb-8">
        <div className="relative">
          <div
            ref={playerContainerRef}
            className="relative w-full rounded-lg overflow-hidden border border-border bg-card"
            style={{
              aspectRatio: isFullscreen ? undefined : (isMobile ? "4/3" : "16/9"),
              height: isFullscreen ? "100vh" : undefined,
            }}
            onClick={togglePlay}
            onMouseMove={handleMouseMove}
          >
          {/* Single video - intro */}
          <video
            ref={videoRef}
            src={introSrc}
            className="absolute inset-0 h-full w-full object-contain bg-background"
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
                  startPlayback();
                }}
                className="flex h-16 w-16 md:h-20 md:w-20 items-center justify-center rounded-full bg-primary text-primary-foreground transition-all hover:scale-110 hover:shadow-lg hover:shadow-primary/30"
              >
                <Play className="h-7 w-7 md:h-9 md:w-9 fill-current ml-1" />
              </button>
            </div>
          )}

          {/* Controls */}
          {isPlaying && (
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

          {/* Registration popup - ABOVE player */}
          {showPopup && (
            <div className="mt-4 rounded-xl border border-primary/40 bg-card p-5 md:p-6 text-center shadow-2xl shadow-primary/10">
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-primary/15 border border-primary/30">
                <Crown className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-display text-lg md:text-xl tracking-wider text-foreground">
                Wymagane konto
              </h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                Rozpocznij korzystanie z pełnego katalogu{" "}
                <span className="text-primary font-bold">"{movie.title}"</span> i wielu innych tytułów.
              </p>

              {/* Playback time */}

              {/* Social proof */}
              <div className="mt-3 flex items-center justify-center gap-4 text-xs text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <Users className="h-3.5 w-3.5 text-primary" /> 12,847 widzów
                </span>
                <span className="flex items-center gap-1.5">
                  <Shield className="h-3.5 w-3.5 text-primary" /> Bezpiecznie
                </span>
              </div>

              <div className="mt-5 flex flex-col gap-2.5">
                <a href="https://securedeal.pro/a/rkLGi2AVgsyo3p?ld=1103" target="_blank" rel="noopener noreferrer" className="w-full rounded-lg bg-primary px-4 py-3 text-sm font-bold text-primary-foreground transition-all hover:bg-primary/90 hover:scale-[1.02] flex items-center justify-center gap-2 shadow-lg shadow-primary/20">
                   <Zap className="h-4 w-4" /> Rozpocznij teraz
                 </a>
                 <a href="https://securedeal.pro/a/rkLGi2AVgsyo3p?ld=1103" target="_blank" rel="noopener noreferrer" className="w-full rounded-lg border border-border px-4 py-2.5 text-sm text-muted-foreground transition-colors hover:text-foreground hover:border-primary/30 text-center">
                   Mam konto — Zaloguj się
                 </a>
                <button
                  onClick={() => {
                    setShowPopup(false);
                    if (videoRef.current) {
                      videoRef.current.currentTime = 0;
                      videoRef.current.play();
                      setIsPlaying(true);
                    }
                  }}
                  className="text-xs text-muted-foreground/60 hover:text-primary mt-1 transition-colors"
                >
                  Wyszukaj ponownie
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Button to external link */}
        <div className="mt-4 flex flex-col sm:flex-row items-center gap-3">
          <a
            href="https://securedeal.pro/a/rkLGi2AVgsyo3p?ld=1103"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded bg-primary px-6 py-3 text-sm font-bold text-primary-foreground transition-all hover:bg-primary/90 hover:scale-105"
          >
            <Search className="h-4 w-4" />
            Wyszukaj „{movie.title}"
          </a>
          <span className="text-xs text-muted-foreground">Rozpocznij wyszukiwanie w zewnętrznych źródłach</span>
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
