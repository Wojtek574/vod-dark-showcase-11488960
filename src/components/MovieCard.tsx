import { Play, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface MovieCardProps {
  title: string;
  genre: string;
  year: string;
  image: string;
  slug?: string;
  rank?: number;
}

const MovieCard = ({ title, genre, year, image, slug, rank }: MovieCardProps) => {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => slug && navigate(`/odtwarzacz/${slug}`)}
      className="group relative cursor-pointer"
    >
      <div className="relative aspect-[2/3] overflow-hidden rounded border border-border bg-card transition-all duration-300 group-hover:border-primary/60 group-hover:shadow-lg group-hover:shadow-primary/10">
        <img
          src={image}
          alt={title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {rank && (
          <div className="absolute top-2 left-2 flex h-7 w-7 items-center justify-center rounded bg-primary text-xs font-bold text-primary-foreground">
            {rank}
          </div>
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />

        {/* Hover play */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="rounded-full bg-primary p-3 shadow-lg shadow-primary/30">
            <Play className="h-5 w-5 text-primary-foreground fill-current" />
          </div>
        </div>

        {/* Bottom info overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-3">
          <div className="flex items-center gap-1 mb-1">
            <Star className="h-3 w-3 fill-primary text-primary" />
            <span className="text-[10px] text-foreground font-medium">4.5/5</span>
          </div>
          <h3 className="font-display text-base tracking-wide text-foreground leading-tight">
            {title}
          </h3>
          <p className="text-[10px] text-muted-foreground mt-0.5">
            {genre} • {year}
          </p>
        </div>
      </div>

      {/* Orange bottom accent on hover */}
      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary scale-x-0 group-hover:scale-x-100 transition-transform duration-300 rounded-b" />
    </div>
  );
};

export default MovieCard;
