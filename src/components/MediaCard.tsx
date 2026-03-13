import { Play } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { MediaItem } from "@/data/movies";

interface MediaCardProps {
  item: MediaItem;
}

const MediaCard = ({ item }: MediaCardProps) => {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/odtwarzacz/${item.slug}`)}
      className="group relative flex-shrink-0 w-[140px] sm:w-[160px] md:w-[185px] lg:w-[200px] cursor-pointer"
    >
      <div className="aspect-[2/3] overflow-hidden rounded-md bg-card">
        <img
          src={item.image}
          alt={item.title}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
        />
        {/* Hover overlay */}
        <div className="absolute inset-0 rounded-md bg-background/0 group-hover:bg-background/40 transition-all duration-300 flex items-center justify-center">
          <div className="rounded-full bg-primary/90 p-3 opacity-0 scale-75 group-hover:opacity-100 group-hover:scale-100 transition-all duration-300">
            <Play className="h-5 w-5 text-primary-foreground fill-current" />
          </div>
        </div>
      </div>
      <div className="mt-2">
        <h3 className="text-sm font-medium text-foreground truncate group-hover:text-primary transition-colors">
          {item.title}
        </h3>
        <p className="text-[11px] text-muted-foreground">
          {item.year} • {item.genre}
        </p>
      </div>
    </div>
  );
};

export default MediaCard;
