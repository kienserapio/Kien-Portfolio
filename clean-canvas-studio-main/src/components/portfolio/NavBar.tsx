import { Link, useLocation, useNavigate } from "react-router-dom";

const NavBar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    const [path, hash] = href.split("#");
    const targetPath = path || "/";
    const targetHash = hash ? `#${hash}` : "";

    // If navigating to the same page we are currently on, handle smooth scroll manually.
    if (location.pathname === targetPath) {
      e.preventDefault();
      
      // Navigate to update the URL hash in react-router state
      navigate(href);

      if (targetHash) {
        const element = document.getElementById(hash);
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
        }
      } else {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    }
  };

  const links = [
    { label: "Home", href: "/" },
    { label: "About", href: "/about" },
    { label: "Projects", href: "/#projects" },
  ];

  return (
    <header className="sticky top-4 z-50 px-4">
      <nav className="max-w-6xl mx-auto glass rounded-full px-4 md:px-6 py-2.5 flex items-center justify-between">
        <Link 
          to="/" 
          onClick={(e) => handleNavClick(e, "/")}
          className="font-display font-bold tracking-tight text-sm md:text-base"
        >
          Kien Serapio
        </Link>

        <ul className="hidden md:flex items-center gap-1 absolute left-1/2 -translate-x-1/2">
          {links.map((l) => (
            <li key={l.label}>
              {l.href.startsWith("/") ? (
                <Link
                  to={l.href}
                  onClick={(e) => handleNavClick(e, l.href)}
                  className="px-4 py-1.5 rounded-full text-sm font-medium text-foreground/70 hover:text-foreground hover:bg-foreground/5 transition-colors"
                >
                  {l.label}
                </Link>
              ) : (
                <a
                  href={l.href}
                  onClick={(e) => handleNavClick(e, l.href)}
                  className="px-4 py-1.5 rounded-full text-sm font-medium text-foreground/70 hover:text-foreground hover:bg-foreground/5 transition-colors"
                >
                  {l.label}
                </a>
              )}
            </li>
          ))}
        </ul>

        <Link
          to="/#contact"
          onClick={(e) => handleNavClick(e, "/#contact")}
          className="glass glass-button rounded-full px-4 md:px-5 py-2 text-xs md:text-sm font-bold tracking-wide hover:-translate-y-0.5 transition-transform"
        >
          Get In Touch
        </Link>
      </nav>
    </header>
  );
};

export default NavBar;
