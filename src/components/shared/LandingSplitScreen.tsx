import { useState, useEffect } from "react";

interface Props {
  andreaSrc: string;
  maeSrc: string;
}

const LandingSplitScreen = ({ andreaSrc, maeSrc }: Props) => {
  const [hovered, setHovered] = useState<"academia" | "show" | null>(null);
  const [transitionsReady, setTransitionsReady] = useState(false);
  const [ready, setReady] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const srcs = [andreaSrc, maeSrc, "/assets/PanteraFelinasLogo.svg"];
    Promise.all(srcs.map(src => { const img = new Image(); img.src = src; return img.decode().catch(() => {}); }))
      .then(() => requestAnimationFrame(() => requestAnimationFrame(() => { setTransitionsReady(true); setReady(true); })));

    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => {
      window.removeEventListener("resize", checkMobile);
    };
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isMobile) return;
    const x = e.clientX / window.innerWidth;
    if (x < 0.35) {
      if (hovered !== "academia") setHovered("academia");
    } else if (x > 0.65) {
      if (hovered !== "show") setHovered("show");
    } else {
      if (hovered !== null) setHovered(null);
    }
  };

  const handleMouseLeave = () => { if (!isMobile) setHovered(null); };

  const active = isMobile ? null : hovered;

  const tx = transitionsReady ? "transition-[flex-basis,opacity,transform,left] duration-700 ease-in-out" : "";
  const txOp = transitionsReady ? "transition-opacity duration-700" : "";
  const tx5 = transitionsReady ? "transition-[max-height,opacity] duration-500" : "";
  const txOp5 = transitionsReady ? "transition-opacity duration-500" : "";

  return (
    <div
      className={`h-screen w-screen overflow-hidden flex relative select-none ${isMobile ? "flex-col" : "flex-row cursor-default"}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ opacity: ready ? 1 : 0, transition: "opacity 0.3s ease" }}
    >
      {/* Logo — desktop: top center; mobile: center */}
      <div
        className={`absolute z-30 pointer-events-none ${tx}`}
        style={isMobile ? {
          top: "50%",
          left: "50%",
          transform: "translateX(-50%) translateY(-50%)",
        } : {
          top: "3rem",
          left: "50%",
          transform:
            hovered === "academia" ? "translateX(calc(-50% - 7vw))"
            : hovered === "show" ? "translateX(calc(-50% + 7vw))"
            : "translateX(-50%)",
          willChange: hovered !== null ? "transform" : "auto",
        }}
      >
        <img
          src="/assets/PanteraFelinasLogo.svg"
          alt="Felinas"
          className={`drop-shadow-[0_0_30px_rgba(255,255,255,0.6)] ${isMobile ? "w-14 h-14" : "w-52 h-52"}`}
        />
      </div>

      {/* ACADEMIA — top on mobile, left on desktop */}
      <a
        href="/academia"
        className={`relative overflow-hidden flex-shrink-0 cursor-pointer ${tx}`}
        style={{
          flexGrow: 0,
          flexShrink: 0,
          flexBasis: active === "academia" ? "62%" : active === "show" ? "38%" : "50%",
          ...(isMobile && { width: "100%" }),
          backgroundColor: "#AA145D",
        }}
      >
        <div
          className="absolute inset-0 z-[3] pointer-events-none"
          style={{ background: isMobile ? "linear-gradient(to bottom, rgba(0,0,0,0.25) 0%, transparent 45%)" : "linear-gradient(to right, rgba(0,0,0,0.15) 0%, transparent 40%)" }}
        />
        <div className={`absolute inset-0 bg-black z-[4] ${txOp} pointer-events-none`} style={{ opacity: active === "show" ? 0.36 : 0, willChange: active !== null ? "opacity" : "auto" }} />

        {/* Text */}
        <div className={`absolute z-[1] pointer-events-none ${isMobile ? "top-1/2 -translate-y-1/2 left-6" : "top-1/2 -translate-y-1/2 left-5 md:left-9 xl:left-14"}`}>
          <p
            className={`text-white tracking-[0.45em] uppercase font-semibold ${txOp5} ${isMobile ? "text-[10px] mb-1" : "text-[11px] md:text-[13px] mb-1 md:mb-2"}`}
            style={{ opacity: active === "show" ? 0.2 : 0.85, textShadow: "0 2px 12px rgba(0,0,0,0.5)" }}
          >
            Visita la
          </p>
          <h2
            className="font-display font-black uppercase leading-none"
            style={{
              fontSize: isMobile ? "clamp(2.8rem, 13vw, 4.5rem)" : "clamp(2.5rem, 5.5vw, 7rem)",
              color: "white",
              opacity: active === "show" ? 0.28 : 1,
              textShadow: (!isMobile && active === "academia")
                ? "3px 3px 0 rgba(0,0,0,0.18), 0 8px 40px rgba(0,0,0,0.4), 0 0 60px rgba(255,255,255,0.22)"
                : "3px 3px 0 rgba(0,0,0,0.18), 0 8px 40px rgba(0,0,0,0.4)",
              transform: (!isMobile && active === "academia") ? "scale(1.04) translateY(-4px)" : "none",
              transition: transitionsReady
                ? "opacity 500ms ease-in-out, transform 350ms ease-out, text-shadow 350ms ease-out"
                : "none",
            }}
          >
            ACADEMIA
          </h2>
        </div>

        {/* Desktop bottom reveal */}
        {!isMobile && (
          <div
            className={`absolute left-5 md:left-9 xl:left-14 z-[20] pointer-events-none overflow-hidden ${tx5}`}
            style={{ bottom: "clamp(1.5rem, 5vh, 3.5rem)", maxHeight: "80px", opacity: active === "show" ? 0.2 : 1 }}
          >
            <p className={`text-white/90 text-xs md:text-sm font-medium ${txOp5}`} style={{ textShadow: "0 2px 10px rgba(0,0,0,0.7)", opacity: active === "academia" ? 1 : 0.6 }}>Twerk · Hip Hop · Breaking</p>
            <span className="inline-block mt-2 text-[10px] md:text-xs text-white font-bold tracking-[0.35em] uppercase border-b border-white/60 pb-0.5" style={{ textShadow: "0 2px 10px rgba(0,0,0,0.7)" }}>Entrar →</span>
          </div>
        )}

        {/* Mobile bottom area — always visible */}
        {isMobile && (
          <div className="absolute bottom-5 left-6 z-[20] pointer-events-none">
            <p className="text-white/90 text-sm font-medium mb-2" style={{ textShadow: "0 2px 10px rgba(0,0,0,0.7)" }}>Twerk · Hip Hop · Breaking</p>
            <span className="text-[11px] text-white font-bold tracking-[0.35em] uppercase border-b border-white/60 pb-0.5" style={{ textShadow: "0 2px 10px rgba(0,0,0,0.7)" }}>
              Entrar →
            </span>
          </div>
        )}

        {/* Character image */}
        <div
          className={`absolute z-[2] pointer-events-none ${!isMobile ? tx : ""}`}
          style={isMobile ? {
            right: "-4%", bottom: 0, width: "74%", height: "95%",
            opacity: 1,
          } : {
            right: 0, bottom: "4rem", width: "65%", height: "105vh",
            opacity: active === "academia" ? 1 : 0.001,
            transform: active === "academia" ? "translateY(0)" : "translateY(16%)",
            willChange: active !== null ? "opacity, transform" : "auto",
          }}
        >
          <img src={andreaSrc} alt="Andrea — Academia" className="w-full h-full object-contain object-bottom" style={{ filter: "drop-shadow(0 -12px 60px rgba(0,0,0,0.65)) brightness(1.04)", transform: "scaleX(-1)" }} />
        </div>
      </a>

      {/* SHOW GROUP — bottom on mobile, right on desktop */}
      <a
        href="/show"
        className={`relative overflow-hidden cursor-pointer ${tx}`}
        style={{
          flexGrow: 0,
          flexShrink: 0,
          flexBasis: active === "show" ? "62%" : active === "academia" ? "38%" : "50%",
          ...(isMobile && { width: "100%" }),
          backgroundColor: "#7C0475",
        }}
      >
        <div
          className="absolute inset-0 z-[3] pointer-events-none"
          style={{ background: isMobile ? "linear-gradient(to bottom, rgba(0,0,0,0.25) 0%, transparent 45%)" : "linear-gradient(to left, rgba(0,0,0,0.15) 0%, transparent 40%)" }}
        />
        <div className={`absolute inset-0 bg-black z-[4] ${txOp} pointer-events-none`} style={{ opacity: active === "academia" ? 0.36 : 0, willChange: active !== null ? "opacity" : "auto" }} />

        {/* Text */}
        <div className={`absolute z-[1] pointer-events-none ${isMobile ? "top-1/2 -translate-y-1/2 left-6" : "top-1/2 -translate-y-1/2 right-5 md:right-9 xl:right-14 text-right"}`}>
          <p
            className={`text-white tracking-[0.45em] uppercase font-semibold ${txOp5} ${isMobile ? "text-[10px] mb-1" : "text-[11px] md:text-[13px] mb-1 md:mb-2"}`}
            style={{ opacity: active === "academia" ? 0.2 : 0.85, textShadow: "0 2px 12px rgba(0,0,0,0.5)" }}
          >
            Conoce el
          </p>
          <h2
            className="font-display font-black uppercase leading-[0.88]"
            style={{
              fontSize: isMobile ? "clamp(1.8rem, 8.5vw, 3rem)" : "clamp(2.5rem, 5.5vw, 7rem)",
              color: "white",
              opacity: active === "academia" ? 0.28 : 1,
              textShadow: (!isMobile && active === "show")
                ? "3px 3px 0 rgba(0,0,0,0.18), 0 8px 40px rgba(0,0,0,0.4), 0 0 60px rgba(255,255,255,0.22)"
                : "3px 3px 0 rgba(0,0,0,0.18), 0 8px 40px rgba(0,0,0,0.4)",
              transform: (!isMobile && active === "show") ? "scale(1.04) translateY(-4px)" : "none",
              transition: transitionsReady
                ? "opacity 500ms ease-in-out, transform 350ms ease-out, text-shadow 350ms ease-out"
                : "none",
            }}
          >
            F<br />Productions
          </h2>
        </div>

        {/* Desktop bottom reveal */}
        {!isMobile && (
          <div
            className={`absolute right-5 md:right-9 xl:right-14 text-right z-[20] pointer-events-none overflow-hidden ${tx5}`}
            style={{ bottom: "clamp(1.5rem, 5vh, 3.5rem)", maxHeight: "80px", opacity: active === "academia" ? 0.2 : 1 }}
          >
            <p className={`text-white/90 text-xs md:text-sm font-medium ${txOp5}`} style={{ textShadow: "0 2px 10px rgba(0,0,0,0.7)", opacity: active === "show" ? 1 : 0.6 }}>Shows en vivo · Contrataciones VIP</p>
            <span className="inline-block mt-2 text-[10px] md:text-xs text-white font-bold tracking-[0.35em] uppercase border-b border-white/60 pb-0.5" style={{ textShadow: "0 2px 10px rgba(0,0,0,0.7)" }}>Entrar →</span>
          </div>
        )}

        {/* Mobile bottom area — always visible */}
        {isMobile && (
          <div className="absolute bottom-5 left-6 z-[20] pointer-events-none">
            <p className="text-white/90 text-sm font-medium mb-2" style={{ textShadow: "0 2px 10px rgba(0,0,0,0.7)" }}>Shows en vivo · Contrataciones VIP</p>
            <span className="text-[11px] text-white font-bold tracking-[0.35em] uppercase border-b border-white/60 pb-0.5" style={{ textShadow: "0 2px 10px rgba(0,0,0,0.7)" }}>
              Entrar →
            </span>
          </div>
        )}

        {/* Character image */}
        <div
          className={`absolute z-[2] pointer-events-none ${!isMobile ? tx : ""}`}
          style={isMobile ? {
            right: "-4%", bottom: 0, top: "12%", width: "74%", height: "95%",
            opacity: 1,
          } : {
            bottom: 0, left: 0, width: "68%", height: "92vh",
            opacity: active === "show" ? 1 : 0.001,
            transform: active === "show" ? "translateY(0)" : "translateY(16%)",
            willChange: active !== null ? "opacity, transform" : "auto",
          }}
        >
          <img src={maeSrc} alt="Mae — Show Group" className="w-full h-full object-contain object-bottom" style={{ filter: "drop-shadow(0 -12px 60px rgba(0,0,0,0.65)) brightness(1.04)", transform: isMobile ? "scaleX(1)" : "scaleX(-1)" }} />
        </div>
      </a>

      {/* Desktop only: blend central + dead zone */}
      {!isMobile && (
        <>
          <div
            className={`absolute inset-y-0 pointer-events-none ${tx}`}
            style={{
              left: active === "academia" ? "48%" : active === "show" ? "24%" : "36%",
              width: "28%",
              opacity: active ? 0 : 1,
              background: "linear-gradient(to right, #AA145D 0%, #931469 45%, #7C0475 100%)",
            }}
          />
          <div className="absolute inset-y-0 z-[10] cursor-default" style={{ left: "35%", width: "30%" }} />
        </>
      )}

      {/* Elige tu lado (hidden on mobile) */}
      {!isMobile && (
        <div className={`absolute bottom-5 left-1/2 -translate-x-1/2 z-30 pointer-events-none ${txOp5}`} style={{ opacity: active ? 0 : 1 }}>
          <p className="text-white/70 lg:text-[11px] md:text-[12px] sm:text-xs tracking-[0.5em] uppercase font-semibold" style={{ textShadow: "0 2px 12px rgba(0,0,0,0.6)" }}>
            Elige tu lado
          </p>
        </div>
      )}
    </div>
  );
};

export default LandingSplitScreen;
