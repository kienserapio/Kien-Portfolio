const NavBar = () => {
  const links = [
    { label: "Home", href: "#home" },
    { label: "Projects", href: "#projects" },
  ];

  return (
    <header className="sticky top-4 z-50 px-4">
      <nav className="max-w-6xl mx-auto glass rounded-full px-4 md:px-6 py-2.5 flex items-center justify-between">
        <a href="#home" className="font-display font-bold tracking-tight text-sm md:text-base">
          Kien Serapio
        </a>

        <ul className="hidden md:flex items-center gap-1 absolute left-1/2 -translate-x-1/2">
          {links.map((l) => (
            <li key={l.label}>
              <a
                href={l.href}
                className="px-4 py-1.5 rounded-full text-sm font-medium text-foreground/70 hover:text-foreground hover:bg-foreground/5 transition-colors"
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>

        <a
          href="#contact"
          className="glass glass-button rounded-full px-4 md:px-5 py-2 text-xs md:text-sm font-bold tracking-wide hover:-translate-y-0.5 transition-transform"
        >
          Get In Touch
        </a>
      </nav>
    </header>
  );
};

export default NavBar;
