import { useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { MediaItem } from "@/data/movies";
import MediaCard from "./MediaCard";

interface MediaRowProps {
  title: string;
  items: MediaItem[];
  linkTo?: string;
}

const MediaRow = ({ title, items, linkTo }: MediaRowProps) => {
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
      <div className="flex items-center justify-between mb-2 px-6 md:px-12">
        <h2 className="font-display text-xl md:text-2xl tracking-wider text-foreground">
          {title}
        </h2>
        {linkTo && (
          <a
            href={linkTo}
            className="text-xs text-muted-foreground hover:text-primary transition-colors"
          >
            Pokaż wszystko
          </a>
        )}
      </div>

      <div className="relative">
        {/* Scroll buttons */}
        {canScrollLeft && (
          <button
            onClick={() => scroll("left")}
            className="absolute left-0 top-0 bottom-0 z-10 w-12 flex items-center justify-center bg-gradient-to-r from-background to-transparent opacity-0 group-hover/row:opacity-100 transition-opacity"
          >
            <ChevronLeft className="h-8 w-8 text-foreground" />
          </button>
        )}
        {canScrollRight && (
          <button
            onClick={() => scroll("right")}
            className="absolute right-0 top-0 bottom-0 z-10 w-12 flex items-center justify-center bg-gradient-to-l from-background to-transparent opacity-0 group-hover/row:opacity-100 transition-opacity"
          >
            <ChevronRight className="h-8 w-8 text-foreground" />
          </button>
        )}

        <div
          ref={scrollRef}
          onScroll={checkScroll}
          className="flex gap-2 md:gap-3 overflow-x-auto scrollbar-hide px-6 md:px-12 pb-2"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {items.map((item) => (
            <MediaCard key={item.id} item={item} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default MediaRow;
