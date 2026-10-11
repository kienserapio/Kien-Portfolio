import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight, Check, Copy } from "lucide-react";
import { Reveal, SplitWords } from "@/components/fx/Reveal";
import { Cta } from "@/components/kit/Cta";
import { openCv } from "@/components/CvModal";
import { EMAIL, LINKS } from "@/data/profile";
import { sfx } from "@/lib/sound";

const ELSEWHERE = [
  ["LinkedIn", LINKS.linkedin],
  ["GitHub", LINKS.github],
  ["Facebook", LINKS.facebook],
  ["Medium", LINKS.medium],
  ["Wika PH", LINKS.wika],
] as const;

const PAGES = [
  ["About", "/about"],
  ["Work", "/work"],
  ["Events & speaking", "/events"],
  ["Awards", "/awards"],
  ["Writing", "/writing"],
] as const;

const Contact = () => {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(EMAIL);
      sfx("success");
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      window.location.href = `mailto:${EMAIL}`;
    }
  };

  return (
    <footer id="contact" className="relative z-10 overflow-hidden pb-36 pt-24 md:pb-40 md:pt-36">
      <div className="mx-auto max-w-[1400px] px-6 sm:px-10">
        <SplitWords
          text="Let’s build something worth speaking about."
          className="max-w-5xl text-[clamp(2.75rem,8vw,7.5rem)] font-medium leading-[0.92] tracking-[-0.045em]"
        />

        <Reveal className="mt-12 flex flex-wrap items-center gap-3" delay={0.15}>
          <Cta onClick={copy} aria-label={`Copy ${EMAIL}`}>
            {copied ? <Check size={17} strokeWidth={1.8} /> : <Copy size={17} strokeWidth={1.8} />}
            {copied ? "Copied" : EMAIL}
          </Cta>
          <Cta onClick={openCv} variant="secondary">
            View resume
          </Cta>
          <Cta to="/events" variant="secondary">
            Invite me to speak
          </Cta>
        </Reveal>

        <Reveal className="mt-24 grid gap-10 border-t border-ink/10 pt-10 text-sm sm:grid-cols-3" delay={0.1}>
          <div>
            <div className="eyebrow mb-3">Elsewhere</div>
            <ul className="space-y-1.5">
              {ELSEWHERE.map(([label, href]) => (
                <li key={label}>
                  <a href={href} target="_blank" rel="noreferrer" data-sfx="tap" className="group inline-flex items-center gap-1 transition-opacity duration-300 hover-dim">
                    {label}
                    <ArrowUpRight size={14} strokeWidth={1.8} className="opacity-50" />
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <div className="eyebrow mb-3">Pages</div>
            <ul className="space-y-1.5">
              {PAGES.map(([label, to]) => (
                <li key={to}>
                  <Link to={to} data-sfx="navigate" className="inline-block transition-opacity duration-300 hover-dim">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="sm:text-right">
            <div className="eyebrow mb-3">Based in</div>
            <div>Quezon City, Philippines</div>
            <div className="mt-1 text-ink/50">Working with teams worldwide</div>
            <div className="mt-6 text-ink/40">© {new Date().getFullYear()} Kien Serapio</div>
          </div>
        </Reveal>
      </div>
    </footer>
  );
};

export default Contact;
