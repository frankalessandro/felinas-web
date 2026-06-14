import { useEffect, useRef, useState } from "react";

const BG_1 = "/assets/MaeHero_birefnet.webp";
const BG_2 = "/assets/PanterHero_inspyrenet.webp";
const SPOTLIGHT_R = 260;
const CELL = 48;
const WA =
  "https://wa.me/573027451752?text=%C2%A1Hola!%20Quiero%20agendar%20mi%20clase%20gratis%20en%20Felinas";
const OFFSCREEN = -SPOTLIGHT_R * 4;

export default function HeroSpotlight() {
  const sectionRef = useRef<HTMLElement>(null);
  const imageAreaRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const revealRef = useRef<HTMLDivElement>(null);
  const mouse = useRef({ x: OFFSCREEN, y: OFFSCREEN });
  const smooth = useRef({ x: OFFSCREEN, y: OFFSCREEN });
  const gridOff = useRef({ x: 0, y: 0 });
  const [grid, setGrid] = useState({ x: 0, y: 0 });
  const isTouch = useRef(
    typeof window !== "undefined" && window.matchMedia("(hover: none)").matches
  );

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    mouse.current = { x: e.clientX, y: e.clientY };
  };
  const handleMouseLeave = () => {
    mouse.current = { x: OFFSCREEN, y: OFFSCREEN };
  };

  useEffect(() => {
    let raf: number;

    const resizeCanvas = () => {
      const area = imageAreaRef.current;
      const canvas = canvasRef.current;
      if (area && canvas) {
        const r = area.getBoundingClientRect();
        canvas.width = r.width;
        canvas.height = r.height;
      }
    };

    const tick = () => {
      const touch = isTouch.current;
      const reveal = revealRef.current;
      const area = imageAreaRef.current;

      if (touch) {
        // Mobile: spotlight position driven by scroll progress through section
        if (reveal && area && sectionRef.current) {
          const rect = sectionRef.current.getBoundingClientRect();
          // 0 = section top at viewport top, 1 = section has fully scrolled off
          const progress = Math.max(0, Math.min(1, -rect.top / rect.height));
          const w = area.offsetWidth;
          const h = area.offsetHeight;
          // 1.6x compresses the sweep so Pantera peaks at ~30% scroll instead of 50%
          const p = Math.min(progress * 1.6, 1);
          const spotX = -SPOTLIGHT_R + p * (w + SPOTLIGHT_R * 2);
          const spotY = h * 0.38;
          const mask = `radial-gradient(circle ${SPOTLIGHT_R}px at ${spotX}px ${spotY}px, white 35%, rgba(255,255,255,0.5) 60%, transparent 100%)`;
          reveal.style.webkitMaskImage = mask;
          reveal.style.maskImage = mask;
        }
      } else {
        // Desktop: cursor-driven smooth spotlight via canvas
        const s = smooth.current;
        const m = mouse.current;
        s.x += (m.x - s.x) * 0.2;
        s.y += (m.y - s.y) * 0.2;

        // Grid parallax relative to section
        if (sectionRef.current) {
          const r = sectionRef.current.getBoundingClientRect();
          const cx = (s.x - r.left) / r.width - 0.5;
          const cy = (s.y - r.top) / r.height - 0.5;
          gridOff.current.x += (cx * 14 - gridOff.current.x) * 0.07;
          gridOff.current.y += (cy * 14 - gridOff.current.y) * 0.07;
          setGrid({ x: gridOff.current.x, y: gridOff.current.y });
        }

        const canvas = canvasRef.current;
        if (canvas && reveal && area) {
          const areaRect = area.getBoundingClientRect();
          const lx = s.x - areaRect.left;
          const ly = s.y - areaRect.top;
          const ctx = canvas.getContext("2d");
          if (ctx) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            const g = ctx.createRadialGradient(lx, ly, 0, lx, ly, SPOTLIGHT_R);
            g.addColorStop(0, "rgba(255,255,255,1)");
            g.addColorStop(0.4, "rgba(255,255,255,1)");
            g.addColorStop(0.6, "rgba(255,255,255,0.75)");
            g.addColorStop(0.75, "rgba(255,255,255,0.4)");
            g.addColorStop(0.88, "rgba(255,255,255,0.12)");
            g.addColorStop(1, "rgba(255,255,255,0)");
            ctx.fillStyle = g;
            ctx.beginPath();
            ctx.arc(lx, ly, SPOTLIGHT_R, 0, 2 * Math.PI);
            ctx.fill();
            const url = canvas.toDataURL();
            reveal.style.webkitMaskImage = `url(${url})`;
            reveal.style.maskImage = `url(${url})`;
            reveal.style.webkitMaskSize = "100% 100%";
            reveal.style.maskSize = "100% 100%";
          }
        }
      }

      raf = requestAnimationFrame(tick);
    };

    // Size canvas after first paint so getBoundingClientRect is accurate
    requestAnimationFrame(() => {
      resizeCanvas();
      tick();
    });

    window.addEventListener("resize", resizeCanvas);
    return () => {
      window.removeEventListener("resize", resizeCanvas);
      cancelAnimationFrame(raf);
    };
  }, []);

  const imgStyle: React.CSSProperties = {
    position: "absolute",
    bottom: 0,
    left: "50%",
    transform: "translateX(-50%)",
    height: "100%",
    width: "auto",
    maxWidth: "none",
    pointerEvents: "none",
    objectFit: "contain",
    objectPosition: "bottom center",
    filter: [
      "drop-shadow(0 24px 60px rgba(0,0,0,0.14))",
      "drop-shadow(-8px 0 30px rgba(0,0,0,0.06))",
      "drop-shadow(8px 0 30px rgba(0,0,0,0.06))",
      "drop-shadow(0 0 50px rgba(233,30,140,0.18))",
    ].join(" "),
  };

  return (
    <section
      id="inicio"
      ref={sectionRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative min-h-screen flex items-center overflow-hidden bg-background"
    >
      {/* Grid parallax */}
      <div
        className="absolute inset-0 z-[1] pointer-events-none"
        style={{ opacity: 0.13 }}
      >
        <svg width="100%" height="100%">
          <defs>
            <pattern
              id="hgrid"
              width={CELL}
              height={CELL}
              patternUnits="userSpaceOnUse"
              x={grid.x}
              y={grid.y}
            >
              <path
                d={`M ${CELL} 0 L 0 0 0 ${CELL}`}
                fill="none"
                stroke="#e91e8c"
                strokeWidth="0.7"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#hgrid)" />
        </svg>
      </div>

      {/* Ambient glows — matching original positions */}
      <div
        className="absolute top-0 right-0 w-[800px] h-[800px] rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none z-[1]"
        style={{ background: "hsl(340 82% 52% / 0.10)", filter: "blur(120px)" }}
      />
      <div
        className="absolute bottom-0 left-0 w-[600px] h-[600px] rounded-full translate-y-1/2 -translate-x-1/3 pointer-events-none z-[1]"
        style={{
          background: "hsl(300 100% 27% / 0.08)",
          filter: "blur(100px)",
        }}
      />

      {/* DANCE ghost text — same position as original */}
      <div className="absolute top-1/4 -right-20 md:right-10 opacity-[0.09] pointer-events-none select-none z-[2] overflow-hidden">
        <h2
          className="font-display font-black leading-[0.8]"
          style={{
            fontSize: "clamp(10rem, 20vw, 25rem)",
            color: "transparent",
            WebkitTextStroke: "2px hsl(340 82% 52%)",
          }}
        >
          DANCE
        </h2>
      </div>

      {/* Container — same as original */}
      <div className="container relative z-[10] px-4 py-20 lg:py-0 w-full">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-8">
          {/* Left column — text content */}
          <div className="w-full lg:w-1/2 pt-10 lg:pt-0">
            <p className="font-display font-semibold text-primary text-sm md:text-base tracking-[0.4em] uppercase mb-6 animate-fade-up border-l-2 border-primary pl-4">
              Academia de Danza Urbana
            </p>

            <h1
              className="font-display font-black tracking-tight leading-[0.9] mb-8 animate-fade-up flex flex-col"
              style={{
                fontSize: "clamp(3.5rem, 8vw, 6.5rem)",
                animationDelay: "0.1s",
              }}
            >
              <span className="uppercase text-foreground">Libera</span>
              <span
                className="uppercase text-transparent"
                style={{ WebkitTextStroke: "2px hsl(0 0% 4%)" }}
              >
                TU LADO
              </span>
              <span className="text-gradient-pink italic pr-4">FELINA</span>
            </h1>

            <p
              className="text-lg md:text-xl max-w-md mb-10 animate-fade-up font-light border-l-2 border-primary/30 pl-4"
              style={{
                color: "hsl(var(--muted-foreground))",
                animationDelay: "0.2s",
              }}
            >
              Encuentra tu empoderamiento a través de la danza. Twerk, hip hop,
              breaking y mucho más.
            </p>

            <div
              className="flex flex-col sm:flex-row gap-6 animate-fade-up"
              style={{ animationDelay: "0.3s" }}
            >
              <a
                href={WA}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 bg-primary hover:bg-felina-rosa-glow text-white font-display font-bold rounded-full px-8 py-4 text-base transition-all hover:scale-105 hover:shadow-[0_0_28px_hsl(340_82%_52%/0.5)] group"
              >
                AGENDA CLASE GRATIS
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="group-hover:translate-x-1 transition-transform"
                >
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </a>
            </div>
          </div>

          {/* Right column — spotlight image area */}
          <div
            ref={imageAreaRef}
            className="w-full lg:w-1/2 relative h-[500px] md:h-[600px] lg:h-[700px] animate-fade-in overflow-hidden"
            style={{ animationDelay: "0.4s" }}
          >
            {/* Image wrapper — mask fades all edges */}
            <div
              className="absolute inset-0"
              style={{
                WebkitMaskImage: [
                  "linear-gradient(to right, transparent 0%, black 12%, black 85%, transparent 100%)",
                  "linear-gradient(to bottom, transparent 0%, black 12%, black 82%, transparent 100%)",
                ].join(", "),
                maskImage: [
                  "linear-gradient(to right, transparent 0%, black 12%, black 85%, transparent 100%)",
                  "linear-gradient(to bottom, transparent 0%, black 12%, black 82%, transparent 100%)",
                ].join(", "),
                WebkitMaskComposite: "destination-in",
                maskComposite: "intersect",
              }}
            >
              {/* Base image (MaeHero) */}
              <img src={BG_1} alt="" style={imgStyle} />

              {/* Spotlight reveal (PanterHero) */}
              <canvas ref={canvasRef} className="hidden" />
              <div
                ref={revealRef}
                className="absolute inset-0 pointer-events-none"
              >
                <img src={BG_2} alt="" style={imgStyle} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator — same position as original */}
      <div className="absolute bottom-10 left-8 md:left-14 z-50 animate-bounce-subtle flex flex-col items-center gap-2">
        <span
          className="text-[10px] uppercase font-bold tracking-widest font-display"
          style={{
            color: "hsl(var(--muted-foreground))",
            writingMode: "vertical-rl",
          }}
        >
          SCROLL
        </span>
        <button
          onClick={() =>
            document
              .getElementById("comunidad-section")
              ?.scrollIntoView({ behavior: "smooth" })
          }
          aria-label="Scroll down"
          className="w-8 h-8 rounded-full border flex items-center justify-center transition-colors hover:bg-pink-500/10 hover:border-pink-500/50"
          style={{
            borderColor: "hsl(var(--border))",
            background: "rgba(255,255,255,0.7)",
            backdropFilter: "blur(8px)",
            color: "hsl(var(--muted-foreground))",
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </button>
      </div>
    </section>
  );
}
