import { useEffect, useState, ReactNode } from "react";
import { useLocation } from "react-router-dom";

const PageTransition = ({ children }: { children: ReactNode }) => {
  const location = useLocation();
  const [show, setShow] = useState(false);

  useEffect(() => {
    setShow(false);
    const timer = requestAnimationFrame(() => {
      requestAnimationFrame(() => setShow(true));
    });
    return () => cancelAnimationFrame(timer);
  }, [location.pathname]);

  return (
    <div
      className={`transition-all duration-300 ease-out ${
        show ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
      }`}
    >
      {children}
    </div>
  );
};

export default PageTransition;
