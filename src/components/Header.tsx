import { Link, useLocation } from "react-router-dom";
import { Film, Search, Menu, X } from "lucide-react";
import { useState, useEffect } from "react";

interface HeaderProps {
  onSearchOpen?: () => void;
}

const Header = ({ onSearchOpen }: HeaderProps) => {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const navItems = [
    { label: "Strona główna", path: "/" },
    { label: "Filmy", path: "/filmy" },
    { label: "Seriale", path: "/seriale" },
  ];

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-background/95 backdrop-blur-md border-b border-border shadow-lg shadow-background/50"
          : "bg-gradient-to-b from-background/80 to-transparent"
      }`}
    >
      <div className="flex h-16 items-center justify-between px-6 md:px-12 max-w-screen-2xl mx-auto">
        <div className="flex items-center gap-8">
          <Link to="/" className="flex items-center gap-2">
            <Film className="h-6 w-6 text-primary" />
            <span className="font-display text-2xl tracking-wider text-foreground">
              FILMKLIK<span className="text-primary">.PL</span>
            </span>
          </Link>
          <nav className="hidden md:flex items-center gap-6">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`text-sm font-medium transition-colors hover:text-foreground ${
                  location.pathname === item.path
                    ? "text-foreground"
                    : "text-muted-foreground"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-3">
          {onSearchOpen && (
            <button
              onClick={onSearchOpen}
              className="flex items-center justify-center rounded-full p-2 text-muted-foreground transition-colors hover:text-foreground"
            >
              <Search className="h-5 w-5" />
            </button>
          )}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden flex items-center justify-center rounded-full p-2 text-muted-foreground transition-colors hover:text-foreground"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-background/95 backdrop-blur-md border-t border-border px-6 py-4 space-y-3">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setMobileOpen(false)}
              className={`block text-sm font-medium transition-colors ${
                location.pathname === item.path
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
};

export default Header;
