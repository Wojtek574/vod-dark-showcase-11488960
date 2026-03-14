import { useNavigate } from "react-router-dom";
import { MediaItem } from "@/data/movies";
import { useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Star, Play } from "lucide-react";

interface TopTenRowProps {
  title: string;
  items: MediaItem[];
}

const TopTenRow = ({ title, items }: TopTenRowProps) => {
  const navigate = useNavigate();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = () => {
    if (!scrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    setCanScrollLeft(scrollLeft > 10);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
  };

  const scroll = (dir: "left" | "right") => {
    if (!scrollRef.current) return;
    const amount = scrollRef.current.clientWidth * 0.75;
    scrollRef.current.scrollBy({
      left: dir === "left" ? -amount : amount,
      behavior: "smooth",
    });
  };

  const top = items.slice(0, 10);

  return (
    <section className="relative group/row">
      <div className="flex items-center gap-2 mb-3 px-4 md:px-8">
        <Star className="h-5 w-5 text-primary fill-primary" />
        <h2 className="font-display text-xl md:text-2xl tracking-wider text-foreground">
          {title}
        </h2>
      </div>

      <div className="relative">
        {canScrollLeft && (
          <button
            onClick={() => scroll("left")}
            className="absolute left-0 top-0 bottom-0 z-10 w-10 flex items-center justify-center bg-gradient-to-r from-background to-transparent opacity-0 group-hover/row:opacity-100 transition-opacity"
          >
            <ChevronLeft className="h-7 w-7 text-foreground" />
          </button>
        )}
        {canScrollRight && (
          <button
            onClick={() => scroll("right")}
            className="absolute right-0 top-0 bottom-0 z-10 w-10 flex items-center justify-center bg-gradient-to-l from-background to-transparent opacity-0 group-hover/row:opacity-100 transition-opacity"
          >
            <ChevronRight className="h-7 w-7 text-foreground" />
          </button>
        )}

        <div
          ref={scrollRef}
          onScroll={checkScroll}
          className="flex gap-4 overflow-x-auto px-4 md:px-8 pb-2"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {top.map((item, i) => (
            <div
              key={item.id}
              onClick={() => navigate(`/odtwarzacz/${item.slug}`)}
              className="group relative flex-shrink-0 cursor-pointer"
            >
              {/* Card with rank */}
              <div className="relative w-[130px] sm:w-[150px] md:w-[170px] lg:w-[185px]">
                <div className="relative aspect-[2/3] overflow-hidden rounded border border-border bg-card transition-all duration-300 group-hover:border-primary/60">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  
                  {/* Rank badge */}
                  <div className="absolute top-2 left-2 flex h-8 w-8 items-center justify-center rounded bg-primary text-sm font-bold text-primary-foreground shadow-lg">
                    {i + 1}
                  </div>

                  {/* Hover play */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="rounded-full bg-primary p-3 shadow-lg shadow-primary/30">
                      <Play className="h-5 w-5 text-primary-foreground fill-current" />
                    </div>
                  </div>

                  {/* Rating */}
                  <div className="absolute bottom-2 right-2 flex items-center gap-1 rounded bg-background/80 px-1.5 py-0.5 text-[10px] backdrop-blur-sm">
                    <Star className="h-3 w-3 fill-primary text-primary" />
                    <span className="text-foreground font-medium">4.{9 - i}/5</span>
                  </div>
                </div>

                <div className="mt-2 px-0.5">
                  <h3 className="text-sm font-medium text-foreground truncate group-hover:text-primary transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-[11px] text-muted-foreground">
                    {item.genre} • {item.year}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TopTenRow;
