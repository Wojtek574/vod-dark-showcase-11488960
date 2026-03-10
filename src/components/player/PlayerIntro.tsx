type PlayerIntroProps = {
  phase: "idle" | "intro" | "playing";
  introOpacity: number;
  introTextVisible: boolean;
};

const PlayerIntro = ({ phase, introOpacity, introTextVisible }: PlayerIntroProps) => {
  if (phase !== "intro") return null;

  return (
    <div
      className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black transition-opacity duration-700"
      style={{ opacity: introOpacity }}
    >
      <div className="relative flex flex-col items-center">
        <div className="relative mb-4">
          <svg width="120" height="120" viewBox="0 0 120 120" className="drop-shadow-[0_0_40px_hsl(var(--primary)/0.5)]">
            <path
              d="M60 8 L108 30 L108 70 Q108 100 60 115 Q12 100 12 70 L12 30 Z"
              fill="none"
              stroke="hsl(45, 80%, 55%)"
              strokeWidth="3"
              className={`transition-all duration-1000 ${introTextVisible ? "opacity-100" : "opacity-0"}`}
            />
            <text
              x="60"
              y="72"
              textAnchor="middle"
              className={`transition-all duration-700 ${introTextVisible ? "opacity-100" : "opacity-0"}`}
              style={{
                fontSize: "42px",
                fontFamily: "serif",
                fontWeight: "bold",
                fill: "hsl(45, 80%, 55%)",
                letterSpacing: "2px",
              }}
            >
              WB
            </text>
          </svg>
        </div>
        <p
          className={`font-display text-lg tracking-[0.4em] uppercase transition-all duration-700 ${introTextVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
          style={{ color: "hsl(45, 80%, 55%)" }}
        >
          Warner Bros.
        </p>
        <p
          className={`mt-1 text-xs tracking-[0.3em] uppercase transition-all duration-700 delay-300 ${introTextVisible ? "opacity-60 translate-y-0" : "opacity-0 translate-y-4"}`}
          style={{ color: "hsl(45, 60%, 60%)" }}
        >
          Pictures
        </p>
      </div>

      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full animate-pulse"
            style={{
              width: `${Math.random() * 3 + 1}px`,
              height: `${Math.random() * 3 + 1}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              backgroundColor: "hsl(45, 80%, 55%)",
              opacity: Math.random() * 0.3,
              animationDelay: `${Math.random() * 2}s`,
              animationDuration: `${Math.random() * 3 + 2}s`,
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default PlayerIntro;
