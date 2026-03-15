import { useEffect, useState } from "react";

type PlayerIntroProps = {
  phase: "idle" | "intro" | "playing";
  introOpacity: number;
  movieTitle: string;
  onIntroEnd: () => void;
};

const PlayerIntro = ({ phase, introOpacity, movieTitle, onIntroEnd }: PlayerIntroProps) => {
  const [textPhase, setTextPhase] = useState(0);
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    if (phase !== "intro") {
      setTextPhase(0);
      setShowPopup(false);
      return;
    }

    const t1 = setTimeout(() => setTextPhase(1), 300);
    const t2 = setTimeout(() => setTextPhase(2), 1500);
    const t3 = setTimeout(() => setTextPhase(3), 3000);
    const t4 = setTimeout(() => {
      setShowPopup(true);
    }, 5000);

    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); clearTimeout(t4); };
  }, [phase]);

  if (phase !== "intro" && !showPopup) return null;

  return (
    <>
      {phase === "intro" && !showPopup && (
        <div
          className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black transition-opacity duration-700"
          style={{ opacity: introOpacity }}
        >
          {/* Animated cinematic bars */}
          <div className="absolute top-0 left-0 right-0 h-16 bg-gradient-to-b from-black to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-black to-transparent" />

          {/* Film reel icon */}
          <div className={`mb-6 transition-all duration-1000 ${textPhase >= 1 ? "opacity-100 scale-100" : "opacity-0 scale-75"}`}>
            <div className="relative h-20 w-20 rounded-full border-2 border-primary/60 flex items-center justify-center">
              <div className="h-8 w-8 rounded-full border-2 border-primary/40" />
              {[0, 60, 120, 180, 240, 300].map((deg) => (
                <div
                  key={deg}
                  className="absolute w-2 h-2 rounded-full bg-primary/50"
                  style={{
                    transform: `rotate(${deg}deg) translateY(-30px)`,
                  }}
                />
              ))}
            </div>
          </div>

          {/* Movie title */}
          <h2
            className={`font-display text-2xl md:text-4xl tracking-[0.2em] uppercase text-foreground transition-all duration-1000 ${textPhase >= 2 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
          >
            {movieTitle}
          </h2>

          {/* Subtitle */}
          <p
            className={`mt-3 text-sm tracking-[0.3em] uppercase text-muted-foreground transition-all duration-700 ${textPhase >= 3 ? "opacity-60 translate-y-0" : "opacity-0 translate-y-4"}`}
          >
            Rozpoczynamy odtwarzanie…
          </p>

          {/* Progress bar */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 w-48">
            <div className="h-0.5 w-full rounded-full bg-muted/20 overflow-hidden">
              <div
                className="h-full bg-primary rounded-full transition-none"
                style={{
                  animation: phase === "intro" ? "introProgress 5s linear forwards" : "none",
                }}
              />
            </div>
          </div>

          <style>{`
            @keyframes introProgress {
              from { width: 0%; }
              to { width: 100%; }
            }
          `}</style>
        </div>
      )}

      {/* Popup - account required */}
      {showPopup && (
        <div className="absolute inset-0 z-40 flex items-center justify-center bg-black/80 backdrop-blur-sm">
          <div className="mx-4 max-w-md w-full rounded-xl border border-border bg-card p-8 text-center shadow-2xl">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/15 border border-primary/30">
              <svg className="h-7 w-7 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
              </svg>
            </div>
            <h3 className="font-display text-xl tracking-wider text-foreground">
              Wymagane konto
            </h3>
            <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
              Aby kontynuować, musisz posiadać konto. Rozpocznij korzystanie z pełnej biblioteki filmów i seriali.
            </p>
            <div className="mt-6 flex flex-col gap-3">
              <button className="w-full rounded-md bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90">
                Rozpocznij teraz
              </button>
              <button
                onClick={() => { setShowPopup(false); onIntroEnd(); }}
                className="w-full rounded-md border border-border px-4 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground hover:border-foreground/30"
              >
                Zamknij
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PlayerIntro;
