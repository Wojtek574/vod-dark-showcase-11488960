import { Play, Star, Calendar } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { MediaItem } from "@/data/movies";

interface MediaCardProps {
  item: MediaItem;
  rank?: number;
  showPremiereDate?: boolean;
}

const formatPremiereDate = (dateStr: string) => {
  const months = ["sty", "lut", "mar", "kwi", "maj", "cze", "lip", "sie", "wrz", "paź", "lis", "gru"];
  const d = new Date(dateStr);
  return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
};

const MediaCard = ({ item, rank, showPremiereDate }: MediaCardProps) => {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/odtwarzacz/${item.slug}`)}
      className="group relative flex-shrink-0 cursor-pointer"
    >
      <div className="relative aspect-[2/3] overflow-hidden rounded border border-border bg-card transition-all duration-300 group-hover:border-primary/60 group-hover:shadow-lg group-hover:shadow-primary/10">
        <img
          src={item.image}
          alt={item.title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        
        {/* Rank number */}
        {rank && (
          <div className="absolute top-2 left-2 flex h-7 w-7 items-center justify-center rounded bg-primary text-xs font-bold text-primary-foreground">
            {rank}
          </div>
        )}

        {/* Platform badge */}
        {item.platform && (
          <div className="absolute top-2 right-2 rounded bg-background/80 px-1.5 py-0.5 text-[9px] font-bold text-primary backdrop-blur-sm border border-primary/20">
            {item.platform}
          </div>
        )}

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Play button overlay */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
          <div className="rounded-full bg-primary p-3 shadow-lg shadow-primary/30">
            <Play className="h-5 w-5 text-primary-foreground fill-current" />
          </div>
        </div>

        {/* Rating */}
        <div className="absolute bottom-2 right-2 flex items-center gap-1 rounded bg-background/80 px-1.5 py-0.5 text-[10px] backdrop-blur-sm">
          <Star className="h-3 w-3 fill-primary text-primary" />
          <span className="text-foreground font-medium">4.5</span>
        </div>
      </div>

      <div className="mt-2 px-0.5">
        <h3 className="text-sm font-medium text-foreground truncate group-hover:text-primary transition-colors">
          {item.title}
        </h3>
        <p className="text-[11px] text-muted-foreground">
          {item.genre} • {item.year}
        </p>
        {showPremiereDate && item.premiereDate && (
          <p className="text-[10px] text-primary flex items-center gap-1 mt-0.5">
            <Calendar className="h-3 w-3" />
            {formatPremiereDate(item.premiereDate)}
          </p>
        )}
      </div>
    </div>
  );
};

export default MediaCard;
