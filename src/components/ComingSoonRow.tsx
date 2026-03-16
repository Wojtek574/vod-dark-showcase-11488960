import { useNavigate } from "react-router-dom";
import { MediaItem } from "@/data/movies";
import { useRef, useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Play, Clock, Calendar } from "lucide-react";

interface ComingSoonRowProps {
  title: string;
  items: MediaItem[];
}

const getCountdown = (dateStr: string) => {
  const now = new Date().getTime();
  const target = new Date(dateStr).getTime();
  const diff = target - now;
  if (diff <= 0) return null;
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  return { days, hours };
};

const formatPremiereDate = (dateStr: string) => {
  const months = ["stycznia", "lutego", "marca", "kwietnia", "maja", "czerwca", "lipca", "sierpnia", "września", "października", "listopada", "grudnia"];
  const d = new Date(dateStr);
  return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
};

const ComingSoonRow = ({ title, items }: ComingSoonRowProps) => {
  const navigate = useNavigate();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [, setTick] = useState(0);

  // Update countdown every minute
  useEffect(() => {
    const interval = setInterval(() => setTick((t) => t + 1), 60000);
    return () => clearInterval(interval);
  }, []);

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

  // Touch swipe
  const touchStartX = useRef(0);
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const handleTouchEnd = (e: React.TouchEvent) => {
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) {
      scroll(diff > 0 ? "right" : "left");
    }
  };

  return (
    <section className="relative group/row">
      <div className="flex items-center gap-2 mb-3 px-4 md:px-8">
        <Clock className="h-5 w-5 text-primary" />
        <h2 className="font-display text-xl md:text-2xl tracking-wider text-foreground">
          {title}
        </h2>
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
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          className="flex gap-4 overflow-x-auto px-4 md:px-8 pb-2"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {items.map((item) => {
            const countdown = item.premiereDate ? getCountdown(item.premiereDate) : null;
            return (
              <div
                key={item.id}
                onClick={() => navigate(`/odtwarzacz/${item.slug}`)}
                className="group relative flex-shrink-0 cursor-pointer w-[220px] sm:w-[260px] md:w-[280px]"
              >
                <div className="relative aspect-video overflow-hidden rounded-lg border border-border bg-card transition-all duration-300 group-hover:border-primary/60 group-hover:shadow-lg group-hover:shadow-primary/10">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />

                  {/* Play button */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="rounded-full bg-primary p-3 shadow-lg shadow-primary/30">
                      <Play className="h-5 w-5 text-primary-foreground fill-current" />
                    </div>
                  </div>

                  {/* Countdown badge */}
                  {countdown && (
                    <div className="absolute top-2 right-2 flex items-center gap-1.5 rounded-md bg-primary/90 px-2.5 py-1 text-[11px] font-bold text-primary-foreground backdrop-blur-sm">
                      <Clock className="h-3 w-3" />
                      za {countdown.days}d {countdown.hours}h
                    </div>
                  )}

                  {/* Title overlay */}
                  <div className="absolute bottom-0 left-0 right-0 p-3">
                    <h3 className="text-sm font-semibold text-foreground truncate">
                      {item.title}
                    </h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[10px] text-muted-foreground">{item.genre}</span>
                      {item.premiereDate && (
                        <span className="flex items-center gap-1 text-[10px] text-primary font-medium">
                          <Calendar className="h-2.5 w-2.5" />
                          {formatPremiereDate(item.premiereDate)}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ComingSoonRow;
