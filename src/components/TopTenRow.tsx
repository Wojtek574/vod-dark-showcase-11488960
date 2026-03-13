import { useNavigate } from "react-router-dom";
import { MediaItem } from "@/data/movies";
import { useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

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
      <div className="mb-2 px-6 md:px-12">
        <h2 className="font-display text-xl md:text-2xl tracking-wider text-foreground">
          {title}
        </h2>
      </div>

      <div className="relative">
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
          className="flex gap-3 md:gap-4 overflow-x-auto px-6 md:px-12 pb-2"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {top.map((item, i) => (
            <div
              key={item.id}
              onClick={() => navigate(`/odtwarzacz/${item.slug}`)}
              className="group relative flex-shrink-0 flex items-end cursor-pointer"
            >
              {/* Big number */}
              <span className="font-display text-[120px] md:text-[150px] leading-none text-foreground/10 select-none -mr-4 z-0">
                {i + 1}
              </span>
              {/* Poster */}
              <div className="relative w-[100px] md:w-[120px] aspect-[2/3] rounded-md overflow-hidden z-10">
                <img
                  src={item.image}
                  alt={item.title}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TopTenRow;
