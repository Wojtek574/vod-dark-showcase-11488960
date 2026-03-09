import { Button } from "@/components/ui/button";
import { Play } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface MovieCardProps {
  title: string;
  genre: string;
  year: string;
  image: string;
  slug?: string;
}

const MovieCard = ({ title, genre, year, image, slug }: MovieCardProps) => {
  const navigate = useNavigate();

  return (
    <div className="group relative overflow-hidden rounded-lg border border-border bg-card transition-all duration-300 hover:border-primary/40 hover:shadow-[0_0_30px_-5px_hsl(var(--primary)/0.3)]">
      <div className="aspect-[2/3] overflow-hidden">
        <img
          src={image}
          alt={title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
      </div>
      <div className="absolute bottom-0 left-0 right-0 p-4">
        <p className="text-xs font-medium uppercase tracking-wider text-primary">
          {genre} • {year}
        </p>
        <h3 className="mt-1 font-display text-xl tracking-wide text-foreground">
          {title}
        </h3>
        <Button
          size="sm"
          className="mt-3 w-full gap-2 bg-primary font-semibold text-primary-foreground hover:bg-primary/90"
          onClick={() => slug ? navigate(`/odtwarzacz/${slug}`) : undefined}
        >
          <Play className="h-4 w-4 fill-current" />
          Rozpocznij
        </Button>
      </div>
    </div>
  );
};

export default MovieCard;
