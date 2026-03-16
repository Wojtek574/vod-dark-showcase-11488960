import { Link, useLocation } from "react-router-dom";
import { Home, Film, Tv, Search } from "lucide-react";

interface MobileBottomNavProps {
  onSearchOpen?: () => void;
}

const MobileBottomNav = ({ onSearchOpen }: MobileBottomNavProps) => {
  const location = useLocation();

  const items = [
    { icon: Home, label: "Główna", path: "/" },
    { icon: Film, label: "Filmy", path: "/filmy" },
    { icon: Tv, label: "Seriale", path: "/seriale" },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden border-t border-border bg-background/95 backdrop-blur-md">
      <div className="flex items-center justify-around h-14">
        {items.map((item) => {
          const active = location.pathname === item.path;
          return (
            <Link
              key={item.label}
              to={item.path}
              className={`flex flex-col items-center justify-center gap-0.5 flex-1 h-full transition-colors ${
                active ? "text-primary" : "text-muted-foreground"
              }`}
            >
              <item.icon className="h-5 w-5" />
              <span className="text-[10px] font-medium">{item.label}</span>
            </Link>
          );
        })}
        <button
          onClick={onSearchOpen}
          className="flex flex-col items-center justify-center gap-0.5 flex-1 h-full text-muted-foreground transition-colors"
        >
          <Search className="h-5 w-5" />
          <span className="text-[10px] font-medium">Szukaj</span>
        </button>
      </div>
    </nav>
  );
};

export default MobileBottomNav;
