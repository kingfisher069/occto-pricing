"use client";
import { useEffect, useRef, useState } from "react";
import { Check } from "lucide-react";

interface PricingFeature {
  label: string;
  value: string;
}

interface PricingPlan {
  id: string;
  name: string;
  concept: string;
  monthlyPrice: number; // in EUR
  setup: string;        // e.g. "490 €" or "ab 1.490 €"
  features: PricingFeature[];
  cta: string;
  highlighted?: boolean;
  badge?: string;
}

interface PricingCardsProps {
  heading?: string;
  description?: string;
  kicker?: string;
  plans?: PricingPlan[];
  contactEmail?: string;
  /** yearly = monthly × yearMultiplier. Default 11 → 1 month free. */
  yearMultiplier?: number;
}

const defaultPlans: PricingPlan[] = [
  {
    id: "starter",
    name: "Starter",
    concept: "Der digitale Onepager",
    monthlyPrice: 97,
    setup: "490 €",
    features: [
      { label: "Umfang",    value: "1 Seite (Onepager)" },
      { label: "Design",    value: "Modern & Mobil-optimiert" },
      { label: "Marketing", value: "Basis-Sichtbarkeit" },
      { label: "Service",   value: "Technik- & Sicherheits-Updates" },
    ],
    cta: "Starter wählen",
  },
  {
    id: "business",
    name: "Business",
    concept: "Die komplette Firmen-Website",
    monthlyPrice: 147,
    setup: "790 €",
    features: [
      { label: "Umfang",    value: "3 – 5 Unterseiten" },
      { label: "Design",    value: "Individuelles Marken-Design" },
      { label: "Marketing", value: "SEO Light Paket" },
      { label: "Service",   value: "Inhalts-Pflege (1 h / Monat)" },
    ],
    cta: "Business wählen",
    highlighted: true,
    badge: "Empfehlung",
  },
  {
    id: "enterprise",
    name: "Enterprise",
    concept: "Marken-Präsenz & Kundenbindung",
    monthlyPrice: 297,
    setup: "ab 1.490 €",
    features: [
      { label: "Umfang",    value: "Ab 10 Unterseiten / Portfolios" },
      { label: "Design",    value: "Exklusives High-End Design" },
      { label: "Marketing", value: "Newsletter-System (Technik)" },
      { label: "Service",   value: "Strategie-Gespräch (Quartal)" },
    ],
    cta: "Enterprise anfragen",
  },
];

const fmtEUR = (n: number) =>
  new Intl.NumberFormat("de-DE", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(n);

const PricingCards = ({
  kicker = "Pricing",
  heading = "Pakete & Preise",
  description = "Wähle das Paket, das zu deinem Auftritt und deinem Wachstum passt.",
  plans = defaultPlans,
  contactEmail = "hello@occto.com",
  yearMultiplier = 11, // 1 month free
}: PricingCardsProps) => {
  const [isYearly, setIsYearly] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const id = requestAnimationFrame(() => setReady(true));
    return () => cancelAnimationFrame(id);
  }, []);

  // Particles
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const setSize = () => {
      const rect = canvas.parentElement?.getBoundingClientRect();
      const w = Math.max(1, Math.floor(rect?.width ?? window.innerWidth));
      const h = Math.max(1, Math.floor(rect?.height ?? window.innerHeight));
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    setSize();

    type P = { x: number; y: number; v: number; o: number };
    let parts: P[] = [];
    let raf = 0;
    const make = (): P => ({
      x: Math.random() * (canvas.width / (window.devicePixelRatio || 1)),
      y: Math.random() * (canvas.height / (window.devicePixelRatio || 1)),
      v: Math.random() * 0.25 + 0.05,
      o: Math.random() * 0.35 + 0.15,
    });
    const init = () => {
      parts = [];
      const w = canvas.width / (window.devicePixelRatio || 1);
      const h = canvas.height / (window.devicePixelRatio || 1);
      const count = Math.floor((w * h) / 12000);
      for (let i = 0; i < count; i++) parts.push(make());
    };
    const draw = () => {
      const w = canvas.width / (window.devicePixelRatio || 1);
      const h = canvas.height / (window.devicePixelRatio || 1);
      ctx.clearRect(0, 0, w, h);
      parts.forEach((p) => {
        p.y -= p.v;
        if (p.y < 0) {
          p.x = Math.random() * w;
          p.y = h + Math.random() * 40;
          p.v = Math.random() * 0.25 + 0.05;
          p.o = Math.random() * 0.35 + 0.15;
        }
        ctx.fillStyle = `rgba(240,240,242,${p.o})`;
        ctx.fillRect(p.x, p.y, 0.7, 2.2);
      });
      raf = requestAnimationFrame(draw);
    };
    const onResize = () => { setSize(); init(); };
    const ro = new ResizeObserver(onResize);
    ro.observe(canvas.parentElement || document.body);
    init();
    raf = requestAnimationFrame(draw);
    return () => { ro.disconnect(); cancelAnimationFrame(raf); };
  }, []);

  return (
    <section
      data-locked
      className={`relative w-full min-h-screen overflow-hidden bg-zinc-950 text-zinc-50 ${ready ? "is-ready" : ""}`}
    >
      <style>{`
        :where(html, body, #__next){
          margin:0; min-height:100%;
          background:#0b0b0c; color:#f6f7f8; color-scheme:dark;
          overflow-x:hidden; scrollbar-gutter:stable both-edges;
        }
        section[data-locked]{color:#f6f7f8;color-scheme:dark}

        .accent-lines{position:absolute;inset:0;pointer-events:none;opacity:.7}
        .accent-lines .hline,.accent-lines .vline{position:absolute;background:#27272a;animation-fill-mode:forwards}
        .accent-lines .hline{left:0;right:0;height:1px;transform:scaleX(0);transform-origin:50% 50%}
        .accent-lines .vline{top:0;bottom:0;width:1px;transform:scaleY(0);transform-origin:50% 0%}
        .is-ready .accent-lines .hline:nth-of-type(1){top:18%;animation:drawX .6s ease .08s forwards}
        .is-ready .accent-lines .hline:nth-of-type(2){top:50%;animation:drawX .6s ease .16s forwards}
        .is-ready .accent-lines .hline:nth-of-type(3){top:82%;animation:drawX .6s ease .24s forwards}
        .is-ready .accent-lines .vline:nth-of-type(1){left:18%;animation:drawY .7s ease .20s forwards}
        .is-ready .accent-lines .vline:nth-of-type(2){left:50%;animation:drawY .7s ease .28s forwards}
        .is-ready .accent-lines .vline:nth-of-type(3){left:82%;animation:drawY .7s ease .36s forwards}
        @keyframes drawX{to{transform:scaleX(1)}}
        @keyframes drawY{to{transform:scaleY(1)}}

        .kicker,.title,.subtitle,.toggle-wrap{opacity:0;transform:translateY(8px)}
        .is-ready .kicker{animation:kIn .5s ease .08s forwards;letter-spacing:.22em}
        .is-ready .title{animation:tIn .6s cubic-bezier(.22,1,.36,1) .16s forwards}
        .is-ready .subtitle{animation:sIn .6s ease .26s forwards}
        .is-ready .toggle-wrap{animation:sIn .6s ease .32s forwards}
        @keyframes kIn{to{opacity:.9;transform:none;letter-spacing:.14em}}
        @keyframes tIn{to{opacity:1;transform:none}}
        @keyframes sIn{to{opacity:1;transform:none}}

        .pcard{opacity:0;transform:translateY(12px)}
        .is-ready .pcard{animation:fadeUp .6s ease forwards}
        .is-ready .pcard.pop{animation:fadeUpPop .6s ease forwards}
        @keyframes fadeUp{to{opacity:1;transform:translateY(0)}}
        @keyframes fadeUpPop{to{opacity:1;transform:translateY(0) scale(1.02)}}

        .pulse-dot{animation:pulse 1.6s infinite}
        @keyframes pulse{50%{opacity:.4}}
      `}</style>

      {/* Vignette */}
      <div className="pointer-events-none absolute inset-0 [background:radial-gradient(80%_60%_at_50%_12%,rgba(255,255,255,0.06),transparent_60%)]" />

      {/* Animated accent lines */}
      <div aria-hidden className="accent-lines">
        <div className="hline" /><div className="hline" /><div className="hline" />
        <div className="vline" /><div className="vline" /><div className="vline" />
      </div>

      {/* Particles */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full opacity-50 pointer-events-none" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 md:py-28">
        {/* Header */}
        <div className="text-center mx-auto mb-12 max-w-3xl">
          <div className="kicker mb-2 text-xs uppercase tracking-[0.14em] text-zinc-400">{kicker}</div>
          <h2 className="title mb-4 text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">{heading}</h2>
          <p className="subtitle mb-6 text-lg text-zinc-400">{description}</p>

          <div className="toggle-wrap inline-flex flex-col items-center gap-2.5">
            <div className="inline-flex items-center rounded-full p-1 bg-white/[0.03]">
              <button
                type="button"
                aria-pressed={!isYearly}
                onClick={() => setIsYearly(false)}
                className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-colors ${
                  !isYearly ? "bg-white/[0.06] text-zinc-50" : "text-zinc-400"
                }`}
              >
                Monatlich
              </button>
              <button
                type="button"
                aria-pressed={isYearly}
                onClick={() => setIsYearly(true)}
                className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-colors inline-flex items-center gap-2 ${
                  isYearly ? "bg-white/[0.06] text-zinc-50" : "text-zinc-400"
                }`}
              >
                Jährlich
                <span
                  className="inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-bold tracking-wide text-zinc-900 bg-zinc-100"
                  style={{ boxShadow: "0 0 0 3px rgba(255,255,255,0.08)" }}
                >
                  – 1 Monat gratis
                </span>
              </button>
            </div>
            <div className="text-sm text-zinc-400 min-h-[20px]">
              {isYearly ? (
                <>Bei jährlicher Zahlung: <b className="text-zinc-50">1 Monat gratis</b> in jedem Paket inklusive</>
              ) : (
                <>&nbsp;</>
              )}
            </div>
          </div>
        </div>

        {/* Cards */}
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 md:grid-cols-3">
          {plans.map((plan, index) => {
            const yearly = plan.monthlyPrice * yearMultiplier;
            const price = isYearly ? yearly : plan.monthlyPrice;
            const unit = isYearly ? "/ Jahr" : "/ Monat";
            return (
              <div
                key={plan.id}
                className={`pcard relative flex flex-col rounded-2xl border border-zinc-800 p-7 ${
                  plan.highlighted ? "pop bg-[#15161a] shadow-[0_10px_30px_rgba(0,0,0,0.35)] backdrop-blur" : "bg-[#111214]"
                }`}
                style={{ animationDelay: `${0.32 + index * 0.08}s` }}
              >
                {plan.badge && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                    <div className="relative">
                      <div className="absolute inset-0 rounded-full bg-white/10 blur-[2px]" />
                      <div className="relative inline-flex items-center gap-1.5 rounded-full border border-zinc-800 bg-[rgba(20,20,24,0.7)] px-3.5 py-1.5 backdrop-blur">
                        <span className="pulse-dot inline-block h-1 w-1 rounded-full bg-white/70" />
                        <span className="text-xs font-semibold text-zinc-100">{plan.badge}</span>
                      </div>
                    </div>
                  </div>
                )}

                <h3 className="text-xl font-semibold mb-1.5">{plan.name}</h3>
                <p className="text-sm text-zinc-400 mb-6 min-h-[18px]">{plan.concept}</p>

                <div className="flex items-baseline gap-2 flex-wrap">
                  <span className="text-[42px] font-bold leading-none tracking-tight">{fmtEUR(price)}</span>
                  <span className="text-sm text-zinc-400">{unit}</span>
                </div>

                <div className="h-[18px] mt-2">
                  {isYearly && (
                    <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-200">
                      ★ Du sparst {fmtEUR(plan.monthlyPrice)} pro Jahr
                    </div>
                  )}
                </div>

                <div className="mt-3 text-sm text-zinc-300">
                  Setup einmalig: <span className="font-semibold text-zinc-50">{plan.setup}</span>
                </div>

                <div className="my-6 h-px bg-zinc-800" />

                <ul className="space-y-[18px] mb-7">
                  {plan.features.map((f, i) => (
                    <li key={i} className="grid grid-cols-[22px_1fr] gap-3 items-start">
                      <span
                        className="w-[22px] h-[22px] rounded-full inline-flex items-center justify-center mt-0.5 border border-white/10"
                        style={{ background: "rgba(255,255,255,0.06)", color: "#f6f7f8" }}
                      >
                        <Check className="size-[13px]" strokeWidth={3} />
                      </span>
                      <span>
                        <span className="block text-[11px] font-semibold uppercase tracking-[0.14em] text-zinc-500 mb-[3px]">
                          {f.label}
                        </span>
                        <span className="block text-[15px] leading-[1.45] font-medium text-zinc-100">
                          {f.value}
                        </span>
                      </span>
                    </li>
                  ))}
                </ul>

                <a
                  href={`mailto:${contactEmail}?subject=${encodeURIComponent(`Anfrage Paket ${plan.name}`)}`}
                  className={`mt-auto flex items-center justify-center w-full rounded-xl px-4 py-3 text-sm font-semibold transition ${
                    plan.highlighted
                      ? "bg-zinc-100 text-zinc-900 hover:bg-zinc-200"
                      : "border border-zinc-800 text-zinc-50 hover:bg-white/[0.04]"
                  }`}
                >
                  {plan.cta}
                </a>
              </div>
            );
          })}
        </div>

        {/* Add-on panel */}
        <div className="mx-auto max-w-7xl mt-16">
          <div
            className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-5 rounded-[20px] border border-zinc-800 px-8 py-7 text-center md:text-left"
            style={{ background: "linear-gradient(180deg, rgba(255,255,255,0.03), rgba(255,255,255,0))" }}
          >
            <div>
              <div className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.18em] text-zinc-400 font-semibold mb-2.5">
                <span
                  className="inline-block w-1.5 h-1.5 rounded-full pulse-dot"
                  style={{ background: "rgba(255,255,255,0.85)", boxShadow: "0 0 0 4px rgba(255,255,255,0.10)" }}
                />
                Optionales Zusatz-Modul
              </div>
              <h3 className="text-[22px] font-semibold tracking-tight text-zinc-50 m-0 mb-1">
                Newsletter-Modul
              </h3>
              <p className="text-sm text-zinc-400 m-0 max-w-[520px]">
                Verfügbar für Starter & Business — direkt in deine Website integriert.
              </p>
            </div>
            <div
              className="inline-flex items-baseline gap-2 rounded-[14px] border border-zinc-800 px-5 py-3.5 self-center md:self-auto"
              style={{ background: "rgba(17,18,20,0.7)" }}
            >
              <span className="text-[28px] font-bold tracking-tight text-zinc-50">+39 €</span>
              <span className="text-sm text-zinc-400">/ Monat</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export { PricingCards };
export default PricingCards;
