const ArrowIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5" aria-hidden>
    <path d="M5 6l6 6-6 6" stroke="#ffffff" strokeOpacity="0.6" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M12 6l6 6-6 6" stroke="#ffffff" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const Footer = () => (
  <footer
    id="contact"
    className="relative px-6 pt-24 pb-12 border-t border-border"
  >
    <div className="max-w-4xl mx-auto text-center">
      <div className="font-script text-2xl md:text-3xl text-muted-foreground">
        let's build something together
      </div>
      <h2 className="mt-4 font-display font-bold text-5xl md:text-7xl tracking-tighter title-gradient">
        CONTACT ME
      </h2>
      <p className="mt-6 text-base md:text-lg text-muted-foreground max-w-xl mx-auto">
        Have a project in mind, a question, or just want to say kamusta? My inbox is always open.
      </p>

      <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
        <a
          href="https://www.linkedin.com/in/kienserapio"
          target="_blank"
          className="group inline-flex items-center gap-3 glass glass-button rounded-full pl-2 pr-6 py-2 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_14px_30px_-10px_hsl(var(--foreground)/0.45)]"
        >
          <span className="rounded-full w-9 h-9 inline-flex items-center justify-center bg-white/10 border border-white/20">
            <ArrowIcon />
          </span>
          <span className="text-sm font-bold tracking-widest">SAY HELLO</span>
        </a>

        <a
          href="/[CV] Kien Serapio.pdf"
          target="_blank"
          className="inline-flex items-center text-xs font-bold tracking-widest px-6 py-3 rounded-full glass glass-pill text-foreground hover:-translate-y-0.5 transition-all"
        >
          DOWNLOAD CV
        </a>
      </div>

      <div className="mt-16 pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-muted-foreground">
        <div className="font-script text-base">Welcome to My Portfolio!</div>
        <div className="tracking-widest">© {new Date().getFullYear()} KIEN SERAPIO</div>
      </div>
    </div>
  </footer>
);

export default Footer;
