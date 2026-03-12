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
  },
  {
    id: 10,
    title: "Dobry Chłopiec",
    slug: "dobry-chlopiec",
    genre: "Thriller",
    year: "2025",
    image: coverDobryChlopiec,
    type: "film",
    description: "Dziewiętnastoletni przestępca Tommy zostaje porwany. Jest zmuszany do resocjalizacji przez dysfunkcyjn\u0105 par\u0119 Chrisa i Kathryn, kt\u00f3rzy pr\u00f3buj\u0105 zrobi\u0107 z niego 'dobrego ch\u0142opca'. Tommy usi\u0142uje znale\u017a\u0107 spos\u00f3b ucieczki. Re\u017cyseria: Jan Komasa. W obsadzie: Stephen Graham, Samson Kayo, Andrea Riseborough, Toni Collette.",
    duration: "1:50:00",
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
  },
  { id: 1, title: "Cybershadow", slug: "cybershadow", genre: "Sci-Fi", year: "2026", image: cover1, type: "film" },
  { id: 2, title: "Noir District", slug: "noir-district", genre: "Thriller", year: "2025", image: cover2, type: "film" },
  { id: 3, title: "Smocze Królestwo", slug: "smocze-krolestwo", genre: "Fantasy", year: "2026", image: cover3, type: "film" },
  { id: 4, title: "Widmowa Rezydencja", slug: "widmowa-rezydencja", genre: "Horror", year: "2025", image: cover4, type: "film" },
  { id: 5, title: "Cisza Przed Burzą", slug: "cisza-przed-burza", genre: "Kryminał", year: "2026", image: cover5, type: "serial" },
  { id: 6, title: "Ostatni Ocaleni", slug: "ostatni-ocaleni", genre: "Dramat", year: "2025", image: cover6, type: "serial" },
  { id: 7, title: "Gwiezdny Horyzont", slug: "gwiezdny-horyzont", genre: "Sci-Fi", year: "2026", image: cover7, type: "serial" },
  { id: 8, title: "Złote Wybrzeże", slug: "zlote-wybrzeze", genre: "Romans", year: "2025", image: cover8, type: "serial" },
];
