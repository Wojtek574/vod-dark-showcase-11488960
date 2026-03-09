import cover1 from "@/assets/cover1.jpg";
import cover2 from "@/assets/cover2.jpg";
import cover3 from "@/assets/cover3.jpg";
import cover4 from "@/assets/cover4.jpg";
import cover5 from "@/assets/cover5.jpg";
import cover6 from "@/assets/cover6.jpg";
import cover7 from "@/assets/cover7.jpg";
import cover8 from "@/assets/cover8.jpg";

export interface MediaItem {
  id: number;
  title: string;
  genre: string;
  year: string;
  image: string;
  type: "film" | "serial";
}

export const mediaItems: MediaItem[] = [
  { id: 1, title: "Cybershadow", genre: "Sci-Fi", year: "2026", image: cover1, type: "film" },
  { id: 2, title: "Noir District", genre: "Thriller", year: "2025", image: cover2, type: "film" },
  { id: 3, title: "Smocze Królestwo", genre: "Fantasy", year: "2026", image: cover3, type: "film" },
  { id: 4, title: "Widmowa Rezydencja", genre: "Horror", year: "2025", image: cover4, type: "film" },
  { id: 5, title: "Cisza Przed Burzą", genre: "Kryminał", year: "2026", image: cover5, type: "serial" },
  { id: 6, title: "Ostatni Ocaleni", genre: "Dramat", year: "2025", image: cover6, type: "serial" },
  { id: 7, title: "Gwiezdny Horyzont", genre: "Sci-Fi", year: "2026", image: cover7, type: "serial" },
  { id: 8, title: "Złote Wybrzeże", genre: "Romans", year: "2025", image: cover8, type: "serial" },
];
