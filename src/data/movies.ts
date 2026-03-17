import cover1 from "@/assets/cover1.jpg";
import cover2 from "@/assets/cover2.jpg";
import cover3 from "@/assets/cover3.jpg";
import cover4 from "@/assets/cover4.jpg";
import cover5 from "@/assets/cover5.jpg";
import cover6 from "@/assets/cover6.jpg";
import cover7 from "@/assets/cover7.jpg";
import cover8 from "@/assets/cover8.jpg";
import coverPannaMloda from "@/assets/cover-panna-mloda.webp";
import coverDobryChlopiec from "@/assets/cover-dobry-chlopiec.webp";
import coverBezWyjscia from "@/assets/cover-bez-wyjscia.webp";
import coverOdyseja from "@/assets/cover-odyseja.webp";
import coverProjektHailMary from "@/assets/cover-projekt-hail-mary.webp";
import coverLup from "@/assets/cover-lup.webp";
import coverPeakyBlinders from "@/assets/cover-peaky-blinders.webp";
import coverNarnia from "@/assets/cover-narnia.webp";
import coverApex from "@/assets/cover-apex.webp";
import coverHopnieci from "@/assets/cover-hopnieci.webp";
import coverKrolDopalaczy from "@/assets/cover-krol-dopalaczy.webp";
import coverRemindersOfHim from "@/assets/cover-reminders-of-him.webp";
import coverEnolaHolmes3 from "@/assets/cover-enola-holmes-3.webp";
import coverCliffBooth from "@/assets/cover-cliff-booth.webp";
import coverHereComesTheFlood from "@/assets/cover-here-comes-the-flood.webp";
import coverZielonaMila from "@/assets/cover-zielona-mila.webp";
import coverSkazaniNaShawshank from "@/assets/cover-skazani-na-shawshank.webp";
import coverForrestGump from "@/assets/cover-forrest-gump.webp";
import coverZaDuzyNaBajki3 from "@/assets/cover-za-duzy-na-bajki-3.webp";
import coverNieMaDuchow from "@/assets/cover-nie-ma-duchow.webp";
import coverTestamentAnnLee from "@/assets/cover-testament-ann-lee.webp";
import coverNajbogatszaKobieta from "@/assets/cover-najbogatsza-kobieta.webp";
import coverWierzymyCi from "@/assets/cover-wierzymy-ci.webp";
import coverAngelsEgg from "@/assets/cover-angels-egg.webp";
import coverBawSieDobrze from "@/assets/cover-baw-sie-dobrze.webp";

export interface MediaItem {
  id: number;
  title: string;
  slug: string;
  genre: string;
  year: string;
  image: string;
  type: "film" | "serial";
  description?: string;
  duration?: string;
  premiereDate?: string;
  platform?: string;
}

export const mediaItems: MediaItem[] = [
  {
    id: 9,
    title: "Panna Młoda",
    slug: "panna-mloda",
    genre: "Horror / Dramat",
    year: "2025",
    image: coverPannaMloda,
    type: "film",
    description: "Samotny potwór Frankensteina (Bale) udaje się w latach 30. XX wieku do Chicago. Tam prosi dokonującą przełomowych odkryć badaczkę, doktor Euphronious (pięciokrotnie nominowana do Oscara Annette Bening), o stworzenie mu towarzyszki. Wspólnie ożywiają zamordowaną młodą kobietę i tak oto rodzi się panna młoda (Buckley). Następstw tego czynu żadne z nich nie mogło przewidzieć. Są to morderstwa, zaborczość, nieokiełznany i radykalny ruch kulturowy oraz dziki i szalony romans dwójki wyrzutków!",
    duration: "2:06:32",
    premiereDate: "2026-03-06",
    platform: "Kino",
  },
  {
    id: 10,
    title: "Dobry Chłopiec",
    slug: "dobry-chlopiec",
    genre: "Thriller",
    year: "2025",
    image: coverDobryChlopiec,
    type: "film",
    description: "Dziewiętnastoletni przestępca Tommy zostaje porwany. Jest zmuszany do resocjalizacji przez dysfunkcyjną parę Chrisa i Kathryn, którzy próbują zrobić z niego 'dobrego chłopca'. Tommy usiłuje znaleźć sposób ucieczki. Reżyseria: Jan Komasa. W obsadzie: Stephen Graham, Samson Kayo, Andrea Riseborough, Toni Collette.",
    duration: "1:50:00",
    premiereDate: "2026-03-06",
    platform: "Kino",
  },
  {
    id: 11,
    title: "Bez Wyjścia",
    slug: "bez-wyjscia",
    genre: "Thriller / Czarna komedia",
    year: "2025",
    image: coverBezWyjscia,
    type: "film",
    description: "Po tym, jak Man-su zostaje zwolniony z firmy, w której pracował 25 lat, musi zmierzyć się z trudnościami. Nowy thriller w reżyserii Park Chan-wooka. Produkcja południowokoreańska, nagrodzona 5 nagrodami i 43 nominacjami.",
    duration: "2:19:00",
    premiereDate: "2026-03-13",
    platform: "Kino",
  },
  {
    id: 12,
    title: "Odyseja",
    slug: "odyseja",
    genre: "Dramat / Historyczny",
    year: "2026",
    image: coverOdyseja,
    type: "film",
    description: "Historia Odyseusza i jego niebezpiecznej podróży do domu po wojnie trojańskiej. Nowy film Christophera Nolana z gwiazdorską obsadą, w tym Mattem Damonem, Anne Hathaway, Zendayą i Tomem Hollandem. Produkcja USA / Wielka Brytania, premiera kinowa 17 lipca 2026.",
    duration: "2:30:00",
    premiereDate: "2026-07-17",
    platform: "Kino",
  },
  {
    id: 13,
    title: "Projekt Hail Mary",
    slug: "projekt-hail-mary",
    genre: "Sci-Fi",
    year: "2026",
    image: coverProjektHailMary,
    type: "film",
    description: "Samotny astronauta Ryland Grace budzi się na statku kosmicznym miliony kilometrów od Ziemi. Nie pamięta kim jest ani jaka jest jego misja. Musi rozwiązać największą zagadkę w historii ludzkości, aby ocalić Ziemię. W roli głównej Ryan Gosling. Reżyseria: Phil Lord i Christopher Miller.",
    duration: "2:36:00",
    premiereDate: "2026-03-20",
    platform: "Kino",
  },
  {
    id: 14,
    title: "Łup",
    slug: "lup",
    genre: "Thriller / Akcja",
    year: "2026",
    image: coverLup,
    type: "film",
    description: "Grupa policjantów z Miami podczas rutynowej akcji w zapuszczonej melinie odkrywa fortunę. Widok milionów dolarów błyskawicznie niszczy solidarność zespołu. Nie wiadomo, kto jest po czyjej stronie. W rolach głównych: Matt Damon, Ben Affleck, Steven Yeun. Reżyseria: Joe Carnahan.",
    duration: "2:14:00",
    premiereDate: "2026-01-14",
    platform: "Netflix",
  },
  {
    id: 15,
    title: "Peaky Blinders: Nieśmiertelny",
    slug: "peaky-blinders-niesmiertelny",
    genre: "Thriller / Dramat",
    year: "2026",
    image: coverPeakyBlinders,
    type: "film",
    description: "Filmowa kontynuacja kultowego serialu. Tommy Shelby (Cillian Murphy) powraca z gangiem w nowej, mrocznej historii. W obsadzie: Stephen Graham, Rebecca Ferguson, Tim Roth, Barry Keoghan, Jay Lycurgo. Reżyseria: Tom Harper.",
    duration: "2:20:00",
    premiereDate: "2026-03-26",
    platform: "Netflix",
  },
  {
    id: 16,
    title: "Narnia: Siostrzeniec Czarodzieja",
    slug: "narnia",
    genre: "Fantasy / Przygodowy",
    year: "2026",
    image: coverNarnia,
    type: "film",
    description: "Powrót do magicznego świata Narnii w reżyserii Grety Gerwig. Film oparty na książce 'Siostrzeniec czarodzieja'. Emma Mackey jako Biała Czarownica, Meryl Streep głosem Aslana, w obsadzie także Daniel Craig i Carey Mulligan. Premiera w kinach IMAX, potem na Netfliksie.",
    duration: "2:25:00",
    premiereDate: "2026-12-25",
    platform: "Netflix",
  },
  {
    id: 17,
    title: "Apex",
    slug: "apex",
    genre: "Thriller / Akcja",
    year: "2026",
    image: coverApex,
    type: "film",
    description: "Pasjonatka wspinaczki na samotnej wyprawie odkrywa, że ściga ją psychopata. Charlize Theron w roli głównej, Taron Egerton jako antagonista. W obsadzie także Eric Bana. Reżyseria: Baltasar Kormákur.",
    duration: "1:58:00",
    premiereDate: "2026-04-24",
    platform: "Netflix",
  },
  {
    id: 18,
    title: "Hopnięci",
    slug: "hopnieci",
    genre: "Animacja / Komedia",
    year: "2026",
    image: coverHopnieci,
    type: "film",
    description: "19-letnia miłośniczka zwierząt wykorzystuje hopnozę – technologię przeszczepiania ludzkiej świadomości do ciała robotycznego bobra, by odkrywać tajemnice świata natury. Nowy film Disneya i Pixara. Reżyseria: Daniel Chong. Scenariusz: Jesse Andrews, Daniel Chong.",
    duration: "1:45:00",
    premiereDate: "2026-03-06",
    platform: "Kino",
  },
  {
    id: 19,
    title: "Król Dopalaczy",
    slug: "krol-dopalaczy",
    genre: "Akcja / Kryminał",
    year: "2026",
    image: coverKrolDopalaczy,
    type: "film",
    description: "Polska produkcja akcji oparta na prawdziwych wydarzeniach o świecie dopalaczy. Tomasz Włosok i Vanessa Aleksander w rolach głównych. Reżyseria: Pat Howl. Brutalna, dynamiczna historia z podziemia.",
    duration: "1:52:00",
    premiereDate: "2026-03-13",
    platform: "Kino",
  },
  {
    id: 20,
    title: "Reminders of Him",
    slug: "reminders-of-him",
    genre: "Melodramat / Romans",
    year: "2026",
    image: coverRemindersOfHim,
    type: "film",
    description: "Adaptacja bestsellerowej powieści Colleen Hoover. Kenna Rowan wychodzi z więzienia i próbuje odbudować relację z córką. Napotyka opór społeczności, ale niespodziewanie znajduje wsparcie. Maika Monroe i Tyriq Withers w rolach głównych.",
    duration: "1:54:00",
    premiereDate: "2026-03-13",
    platform: "Kino",
  },
  {
    id: 21,
    title: "Enola Holmes 3",
    slug: "enola-holmes-3",
    genre: "Kryminał / Przygodowy",
    year: "2026",
    image: coverEnolaHolmes3,
    type: "film",
    description: "Millie Bobby Brown po raz trzeci wciela się w Enolę Holmes — siostrzyczkę słynnego Sherlocka. Trzecia część ma być mroczniejsza od poprzednich odsłon. Reżyseria: Philip Barantini.",
    duration: "2:05:00",
    premiereDate: "2026-09-01",
    platform: "Netflix",
  },
  {
    id: 22,
    title: "The Adventures of Cliff Booth",
    slug: "adventures-of-cliff-booth",
    genre: "Kryminał / Dramat",
    year: "2026",
    image: coverCliffBooth,
    type: "film",
    description: "Kontynuacja 'Pewnego razu... w Hollywood'. Brad Pitt powraca w nagrodzonej Oscarem roli Cliffa Bootha. Scenariusz Quentina Tarantino, reżyseria Davida Finchera. W obsadzie: Elizabeth Debicki, Yahya Abdul-Mateen II, Timothy Olyphant.",
    duration: "2:35:00",
    premiereDate: "2026-10-01",
    platform: "Netflix",
  },
  {
    id: 23,
    title: "Here Comes the Flood",
    slug: "here-comes-the-flood",
    genre: "Thriller / Kryminał",
    year: "2026",
    image: coverHereComesTheFlood,
    type: "film",
    description: "Heist movie Fernando Meirellesa, w którym splotą się losy trzech postaci uwikłanych w napad na bank. Denzel Washington, Robert Pattinson i Daisy Edgar-Jones w rolach głównych.",
    duration: "2:10:00",
    premiereDate: "2026-08-01",
    platform: "Netflix",
  },
  {
    id: 24,
    title: "Zielona Mila",
    slug: "zielona-mila",
    genre: "Dramat",
    year: "1999",
    image: coverZielonaMila,
    type: "film",
    description: "Emerytowany strażnik więzienny opowiada przyjaciółce o niezwykłym mężczyźnie, którego skazano na śmierć za zabójstwo dwóch 9-letnich dziewczynek. Adaptacja powieści Stephena Kinga w reżyserii Franka Darabonta. W rolach głównych: Tom Hanks, Michael Clarke Duncan, David Morse.",
    duration: "3:08:00",
  },
  {
    id: 25,
    title: "Skazani na Shawshank",
    slug: "skazani-na-shawshank",
    genre: "Dramat",
    year: "1994",
    image: coverSkazaniNaShawshank,
    type: "film",
    description: "Adaptacja opowiadania Stephena Kinga. Niesłusznie skazany na dożywocie bankier Andy Dufresne stara się przetrwać w brutalnym, więziennym świecie. Reżyseria: Frank Darabont. W rolach głównych: Tim Robbins, Morgan Freeman.",
    duration: "2:22:00",
  },
  {
    id: 26,
    title: "Forrest Gump",
    slug: "forrest-gump",
    genre: "Komedia / Dramat",
    year: "1994",
    image: coverForrestGump,
    type: "film",
    description: "Historia życia Forresta, chłopca o niskim ilorazie inteligencji z niedowładem kończyn, który staje się miliarderem i bohaterem wojny w Wietnamie. Reżyseria: Robert Zemeckis. W rolach głównych: Tom Hanks, Robin Wright, Gary Sinise.",
    duration: "2:22:00",
  },
  {
    id: 27,
    title: "Za Duży na Bajki 3",
    slug: "za-duzy-na-bajki-3",
    genre: "Familijny",
    year: "2026",
    image: coverZaDuzyNaBajki3,
    type: "film",
    description: "Napisany przez Waldka komentarz w Internecie powoduje lawinę hejtu, która dotyka jedną z najbliższych mu osób. Trzecia część popularnej polskiej serii familijnej. Reżyseria: Kristoffer Rus. Scenariusz: Agnieszka Dąbrowska. Produkcja polska.",
    duration: "1:30:00",
    premiereDate: "2026-03-06",
    platform: "Kino",
  },
  // ── Oryginalne placeholder filmy/seriale ──
  { id: 1, title: "Cybershadow", slug: "cybershadow", genre: "Sci-Fi", year: "2026", image: cover1, type: "film" },
  { id: 2, title: "Noir District", slug: "noir-district", genre: "Thriller", year: "2025", image: cover2, type: "film" },
  { id: 3, title: "Smocze Królestwo", slug: "smocze-krolestwo", genre: "Fantasy", year: "2026", image: cover3, type: "film" },
  { id: 4, title: "Widmowa Rezydencja", slug: "widmowa-rezydencja", genre: "Horror", year: "2025", image: cover4, type: "film" },
  { id: 5, title: "Cisza Przed Burzą", slug: "cisza-przed-burza", genre: "Kryminał", year: "2026", image: cover5, type: "serial" },
  { id: 6, title: "Ostatni Ocaleni", slug: "ostatni-ocaleni", genre: "Dramat", year: "2025", image: cover6, type: "serial" },
  { id: 7, title: "Gwiezdny Horyzont", slug: "gwiezdny-horyzont", genre: "Sci-Fi", year: "2026", image: cover7, type: "serial" },
  { id: 8, title: "Złote Wybrzeże", slug: "zlote-wybrzeze", genre: "Romans", year: "2025", image: cover8, type: "serial" },
];

/** Filmy z datą premiery 2026 */
export const premieres2026 = mediaItems
  .filter((m) => m.premiereDate && m.premiereDate.startsWith("2026"))
  .sort((a, b) => (a.premiereDate! > b.premiereDate! ? 1 : -1));
