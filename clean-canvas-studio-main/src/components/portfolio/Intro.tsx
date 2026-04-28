const TargetIcon = () => (
  <svg viewBox="0 0 48 48" className="inline-block w-10 h-10 md:w-14 md:h-14 align-middle mx-1" aria-hidden>
    <circle cx="24" cy="24" r="22" fill="#22c55e" />
    <circle cx="24" cy="24" r="14" fill="#fff" />
    <circle cx="24" cy="24" r="8" fill="#22c55e" />
    <circle cx="24" cy="24" r="3" fill="#fff" />
  </svg>
);

const FlowerIcon = () => (
  <svg viewBox="0 0 48 48" className="inline-block w-10 h-10 md:w-14 md:h-14 align-middle mx-1" aria-hidden>
    {[0, 60, 120, 180, 240, 300].map((deg) => (
      <ellipse
        key={deg}
        cx="24"
        cy="12"
        rx="6"
        ry="10"
        fill="hsl(var(--pink))"
        transform={`rotate(${deg} 24 24)`}
      />
    ))}
    <circle cx="24" cy="24" r="5" fill="#fde047" />
  </svg>
);

const ArrowIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5" aria-hidden>
    <path d="M5 6l6 6-6 6" stroke="hsl(var(--cyan))" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M12 6l6 6-6 6" stroke="hsl(var(--pink))" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const Intro = () => {
  return (
    <section className="px-6 py-20 text-center">
      <h2 className="font-display font-medium text-3xl md:text-5xl tracking-tight max-w-4xl mx-auto leading-tight">
        I design <TargetIcon /> outstanding
        <br />
        digital products <FlowerIcon />.
      </h2>

      <div className="mt-10 flex justify-center">
        <button className="group inline-flex items-center gap-3 glass glass-button rounded-full pl-2 pr-5 py-2 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_14px_30px_-10px_hsl(var(--cyan)/0.6)] active:translate-y-0">
          <span className="glass glass-cyan rounded-full w-9 h-9 inline-flex items-center justify-center">
            <ArrowIcon />
          </span>
          <span className="text-sm font-bold tracking-widest">CONTACT ME</span>
        </button>
      </div>
    </section>
  );
};

export default Intro;
