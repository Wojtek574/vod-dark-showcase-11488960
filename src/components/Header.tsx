import { Link, useLocation } from "react-router-dom";
import { Film, Search } from "lucide-react";
import { useState } from "react";

interface HeaderProps {
  onSearchOpen?: () => void;
}

const Header = ({ onSearchOpen }: HeaderProps) => {
  const location = useLocation();

  const navItems = [
    { label: "Strona główna", path: "/" },
    { label: "Filmy", path: "/filmy" },
    { label: "Seriale", path: "/seriale" },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/90 backdrop-blur-md">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <Film className="h-7 w-7 text-primary" />
          <span className="font-display text-2xl tracking-wider text-foreground">
            FILMKLIK<span className="text-primary">.PL</span>
          </span>
        </Link>
        <nav className="flex items-center gap-4 md:gap-6">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`hidden sm:block text-sm font-medium transition-colors hover:text-primary ${
                location.pathname === item.path
                  ? "text-primary"
                  : "text-muted-foreground"
              }`}
            >
              {item.label}
            </Link>
          ))}
          {onSearchOpen && (
            <button
              onClick={onSearchOpen}
              className="flex items-center gap-1.5 rounded-lg border border-border bg-secondary/50 px-3 py-1.5 text-sm text-muted-foreground transition-all hover:border-primary/40 hover:text-foreground"
            >
              <Search className="h-4 w-4" />
              <span className="hidden sm:inline">Szukaj</span>
            </button>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;