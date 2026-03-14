import { Link, useLocation } from "react-router-dom";
import { Search, Menu, X, User } from "lucide-react";
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
    { label: "Nowości", path: "/" },
    { label: "Filmy", path: "/filmy" },
    { label: "Seriale", path: "/seriale" },
    { label: "TOP IMDb", path: "/filmy" },
  ];

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-background/98 backdrop-blur-md border-b border-border"
          : "bg-background"
      }`}
    >
      <div className="flex h-16 items-center justify-between px-4 md:px-8 max-w-screen-2xl mx-auto">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 shrink-0">
          <div className="flex items-center gap-1">
            <div className="grid grid-cols-2 gap-0.5">
              <div className="w-2 h-2 bg-primary rounded-sm" />
              <div className="w-2 h-2 bg-primary rounded-sm" />
              <div className="w-2 h-2 bg-primary rounded-sm" />
              <div className="w-2 h-2 bg-primary rounded-sm" />
            </div>
            <span className="font-display text-2xl tracking-wider text-foreground ml-1">
              FILMKLIK
            </span>
          </div>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1">
          {navItems.map((item) => (
            <Link
              key={item.label}
              to={item.path}
              className={`px-4 py-2 text-sm font-medium rounded transition-colors ${
                location.pathname === item.path
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-2">
          {onSearchOpen && (
            <button
              onClick={onSearchOpen}
              className="p-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <Search className="h-5 w-5" />
            </button>
          )}
          <button className="hidden md:inline-flex items-center gap-2 rounded-md border border-primary bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary transition-colors hover:bg-primary hover:text-primary-foreground">
            <User className="h-4 w-4" />
            Zaloguj / Zarejestruj się
          </button>
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-background border-t border-border px-4 py-4 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.label}
              to={item.path}
              onClick={() => setMobileOpen(false)}
              className={`block px-3 py-2.5 rounded-md text-sm font-medium transition-colors ${
                location.pathname === item.path
                  ? "text-primary bg-primary/10"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary"
              }`}
            >
              {item.label}
            </Link>
          ))}
          <div className="pt-2 border-t border-border mt-2">
            <button className="w-full flex items-center justify-center gap-2 rounded-md bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground">
              <User className="h-4 w-4" />
              Zaloguj / Zarejestruj się
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
