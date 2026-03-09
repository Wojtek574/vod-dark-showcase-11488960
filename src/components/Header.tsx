import { Link, useLocation } from "react-router-dom";
import { Play } from "lucide-react";

const Header = () => {
  const location = useLocation();

  const navItems = [
    { label: "Strona główna", path: "/" },
    { label: "Najlepsze filmy", path: "/filmy" },
    { label: "Najlepsze seriale", path: "/seriale" },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/90 backdrop-blur-md">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <Play className="h-7 w-7 fill-primary text-primary" />
          <span className="font-display text-2xl tracking-wider text-foreground">
            STREAMFLIX
          </span>
        </Link>
        <nav className="flex items-center gap-6">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`text-sm font-medium transition-colors hover:text-primary ${
                location.pathname === item.path
                  ? "text-primary"
                  : "text-muted-foreground"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
};

export default Header;
