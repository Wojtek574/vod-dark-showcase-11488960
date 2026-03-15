import { Link } from "react-router-dom";
import { ChevronRight, Star } from "lucide-react";
import { MediaItem } from "@/data/movies";
import MediaCard from "./MediaCard";
import { useRef, useState } from "react";
import { ChevronLeft } from "lucide-react";

interface MediaRowProps {
  title: string;
  items: MediaItem[];
  linkTo?: string;
  showPremiereDate?: boolean;
}

const MediaRow = ({ title, items, linkTo, showPremiereDate }: MediaRowProps) => {
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

  return (
    <section className="relative group/row">
      <div className="flex items-center justify-between mb-3 px-4 md:px-8">
        <h2 className="font-display text-xl md:text-2xl tracking-wider text-foreground">
          {title}
        </h2>
        {linkTo && (
          <Link
            to={linkTo}
            className="flex items-center gap-1 text-xs text-primary hover:text-primary/80 transition-colors font-medium"
          >
            Zobacz wszystko <ChevronRight className="h-3.5 w-3.5" />
          </Link>
        )}
      </div>

      <div className="relative">
        {canScrollLeft && (
          <button
            onClick={() => scroll("left")}
            className="absolute left-0 top-0 bottom-8 z-10 w-10 flex items-center justify-center bg-gradient-to-r from-background to-transparent opacity-0 group-hover/row:opacity-100 transition-opacity"
          >
            <ChevronLeft className="h-7 w-7 text-foreground" />
          </button>
        )}
        {canScrollRight && (
          <button
            onClick={() => scroll("right")}
            className="absolute right-0 top-0 bottom-8 z-10 w-10 flex items-center justify-center bg-gradient-to-l from-background to-transparent opacity-0 group-hover/row:opacity-100 transition-opacity"
          >
            <ChevronRight className="h-7 w-7 text-foreground" />
          </button>
        )}

        <div
          ref={scrollRef}
          onScroll={checkScroll}
          className="flex gap-3 overflow-x-auto px-4 md:px-8 pb-2"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {items.map((item) => (
            <div key={item.id} className="flex-shrink-0 w-[130px] sm:w-[150px] md:w-[170px] lg:w-[185px]">
              <MediaCard item={item} showPremiereDate={showPremiereDate} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default MediaRow;
