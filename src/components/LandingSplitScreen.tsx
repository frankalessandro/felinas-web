import { useState, useEffect } from "react";

const LandingSplitScreen = () => {
  const [hovered, setHovered] = useState<"academia" | "show" | null>(null);
  const [tapped, setTapped] = useState<"academia" | "show" | null>(null);
  const [transitionsReady, setTransitionsReady] = useState(false);
  const [ready, setReady] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const srcs = ["/assets/Andrea_NoBg_11zon.webp", "/assets/Mae_NoBg_11zon.webp", "/assets/PanteraFelinasLogo.svg"];
    Promise.all(srcs.map(src => { const img = new Image(); img.src = src; return img.decode().catch(() => {}); }))
      .then(() => requestAnimationFrame(() => requestAnimationFrame(() => { setTransitionsReady(true); setReady(true); })));

    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
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

  const active = isMobile ? tapped : hovered;

  const tx = transitionsReady ? "transition-all duration-700 ease-in-out" : "";
  const txOp = transitionsReady ? "transition-opacity duration-700" : "";
  const tx5 = transitionsReady ? "transition-all duration-500" : "";
  const txOp5 = transitionsReady ? "transition-opacity duration-500" : "";

  const handleAcademiaClick = (e: React.MouseEvent) => {
    if (!isMobile) return;
    if (tapped !== "academia") {
      e.preventDefault();
      setTapped("academia");
    }
  };

  const handleShowClick = (e: React.MouseEvent) => {
    if (!isMobile) return;
    if (tapped !== "show") {
      e.preventDefault();
      setTapped("show");
    }
  };

  return (
    <div
      className={`h-screen w-screen overflow-hidden flex relative select-none ${isMobile ? "flex-col" : "flex-row cursor-default"}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ opacity: ready ? 1 : 0, transition: "opacity 0.3s ease" }}
    >
      {/* Logo — desktop: top center; mobile: floats at the divider between sections */}
      <div
        className={`absolute z-30 pointer-events-none ${tx}`}
        style={isMobile ? {
          top: active === "academia" ? "62%" : active === "show" ? "38%" : "50%",
          left: "50%",
          transform: "translateX(-50%) translateY(-50%)",
          willChange: "top",
        } : {
          top: "3rem",
          left: "50%",
          transform:
            hovered === "academia" ? "translateX(calc(-50% - 7vw))"
            : hovered === "show" ? "translateX(calc(-50% + 7vw))"
            : "translateX(-50%)",
          willChange: "transform",
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
        onClick={handleAcademiaClick}
        style={{
          flex: active === "academia" ? "0 0 62%" : active === "show" ? "0 0 38%" : "0 0 50%",
          ...(isMobile && { width: "100%" }),
          backgroundColor: "#AA145D",
        }}
      >
        <div
          className="absolute inset-0 z-[3] pointer-events-none"
          style={{ background: isMobile ? "linear-gradient(to bottom, rgba(0,0,0,0.25) 0%, transparent 45%)" : "linear-gradient(to right, rgba(0,0,0,0.15) 0%, transparent 40%)" }}
        />
        <div className={`absolute inset-0 bg-black z-[4] ${txOp} pointer-events-none`} style={{ opacity: active === "show" ? 0.36 : 0, willChange: "opacity" }} />

        {/* Text */}
        <div className={`absolute z-[1] pointer-events-none ${isMobile ? "top-1/2 -translate-y-1/2 left-6" : "top-1/2 -translate-y-1/2 left-5 md:left-9 xl:left-14"}`}>
          <p
            className={`text-white tracking-[0.45em] uppercase font-semibold ${txOp5} ${isMobile ? "text-[10px] mb-1" : "text-[11px] md:text-[13px] mb-1 md:mb-2"}`}
            style={{ opacity: active === "show" ? 0.2 : 0.85, textShadow: "0 2px 12px rgba(0,0,0,0.5)" }}
          >
            Visita la
          </p>
          <h2
            className={`font-display font-black uppercase leading-none ${tx}`}
            style={{
              fontSize: isMobile ? "clamp(2.8rem, 13vw, 4.5rem)" : "clamp(2.5rem, 5.5vw, 7rem)",
              color: "white",
              opacity: active === "show" ? 0.28 : 1,
              textShadow: "3px 3px 0 rgba(0,0,0,0.18), 0 8px 40px rgba(0,0,0,0.4)",
            }}
          >
            ACADEMIA
          </h2>
        </div>

        {/* Desktop bottom reveal */}
        {!isMobile && (
          <div
            className={`absolute left-5 md:left-9 xl:left-14 z-[20] pointer-events-none overflow-hidden ${tx5}`}
            style={{ bottom: "clamp(1.5rem, 5vh, 3.5rem)", maxHeight: active === "academia" ? "80px" : "0px", opacity: active === "academia" ? 1 : 0 }}
          >
            <p className="text-white/90 text-xs md:text-sm font-medium" style={{ textShadow: "0 2px 10px rgba(0,0,0,0.7)" }}>Twerk · Hip Hop · Breaking</p>
            <span className="inline-block mt-2 text-[10px] md:text-xs text-white font-bold tracking-[0.35em] uppercase border-b border-white/60 pb-0.5" style={{ textShadow: "0 2px 10px rgba(0,0,0,0.7)" }}>Entrar →</span>
          </div>
        )}

        {/* Mobile bottom area */}
        {isMobile && (
          <div className={`absolute bottom-5 left-6 z-[20] ${tx5}`}>
            {active === "academia" ? (
              <div style={{ opacity: 1 }}>
                <p className="text-white/90 text-sm font-medium mb-2" style={{ textShadow: "0 2px 10px rgba(0,0,0,0.7)" }}>Twerk · Hip Hop · Breaking</p>
                <button
                  className="text-[11px] text-white font-bold tracking-[0.35em] uppercase border-b border-white/60 pb-0.5"
                  onClick={(e) => { e.stopPropagation(); window.location.href = "/academia"; }}
                  style={{ textShadow: "0 2px 10px rgba(0,0,0,0.7)" }}
                >
                  Entrar →
                </button>
              </div>
            ) : (
              <span className={`animate-pulse text-white/55 text-[10px] tracking-[0.4em] uppercase font-semibold ${txOp5}`} style={{ opacity: active === "show" ? 0.2 : 1 }}>
                Toca para explorar
              </span>
            )}
          </div>
        )}

        {/* Character image */}
        <div
          className={`absolute z-[2] pointer-events-none ${tx}`}
          style={isMobile ? {
            right: "-4%", bottom: 0, width: "74%", height: "95%",
            opacity: active === "academia" ? 1 : active === "show" ? 0.04 : 0.22,
            transform: active === "academia" ? "translateY(0)" : "translateY(8%)",
            willChange: "opacity, transform",
          } : {
            right: 0, bottom: "4rem", width: "65%", height: "105vh",
            opacity: active === "academia" ? 1 : 0.001,
            transform: active === "academia" ? "translateY(0)" : "translateY(16%)",
            willChange: "opacity, transform",
          }}
        >
          <img src="/assets/Andrea_NoBg_11zon.webp" alt="Andrea — Academia" className="w-full h-full object-contain object-bottom" style={{ filter: "drop-shadow(0 -12px 60px rgba(0,0,0,0.65)) brightness(1.04)", transform: "scaleX(-1)" }} />
        </div>
      </a>

      {/* SHOW GROUP — bottom on mobile, right on desktop */}
      <a
        href="/show"
        className={`relative overflow-hidden cursor-pointer ${tx}`}
        onClick={handleShowClick}
        style={{
          flex: active === "show" ? "0 0 62%" : active === "academia" ? "0 0 38%" : "0 0 50%",
          ...(isMobile && { width: "100%", flexShrink: 0 }),
          backgroundColor: "#7C0475",
        }}
      >
        <div
          className="absolute inset-0 z-[3] pointer-events-none"
          style={{ background: isMobile ? "linear-gradient(to top, rgba(0,0,0,0.25) 0%, transparent 45%)" : "linear-gradient(to left, rgba(0,0,0,0.15) 0%, transparent 40%)" }}
        />
        <div className={`absolute inset-0 bg-black z-[4] ${txOp} pointer-events-none`} style={{ opacity: active === "academia" ? 0.36 : 0, willChange: "opacity" }} />

        {/* Text */}
        <div className={`absolute z-[1] pointer-events-none ${isMobile ? "top-1/2 -translate-y-1/2 right-6 text-right" : "top-1/2 -translate-y-1/2 right-5 md:right-9 xl:right-14 text-right"}`}>
          <p
            className={`text-white tracking-[0.45em] uppercase font-semibold ${txOp5} ${isMobile ? "text-[10px] mb-1" : "text-[11px] md:text-[13px] mb-1 md:mb-2"}`}
            style={{ opacity: active === "academia" ? 0.2 : 0.85, textShadow: "0 2px 12px rgba(0,0,0,0.5)" }}
          >
            Conoce el
          </p>
          <h2
            className={`font-display font-black uppercase leading-[0.88] ${tx}`}
            style={{
              fontSize: isMobile ? "clamp(2.8rem, 13vw, 4.5rem)" : "clamp(2.5rem, 5.5vw, 7rem)",
              color: "white",
              opacity: active === "academia" ? 0.28 : 1,
              textShadow: "3px 3px 0 rgba(0,0,0,0.18), 0 8px 40px rgba(0,0,0,0.4)",
            }}
          >
            F<br />Productions
          </h2>
        </div>

        {/* Desktop bottom reveal */}
        {!isMobile && (
          <div
            className={`absolute right-5 md:right-9 xl:right-14 text-right z-[20] pointer-events-none overflow-hidden ${tx5}`}
            style={{ bottom: "clamp(1.5rem, 5vh, 3.5rem)", maxHeight: active === "show" ? "80px" : "0px", opacity: active === "show" ? 1 : 0 }}
          >
            <p className="text-white/90 text-xs md:text-sm font-medium" style={{ textShadow: "0 2px 10px rgba(0,0,0,0.7)" }}>Shows en vivo · Contrataciones VIP</p>
            <span className="inline-block mt-2 text-[10px] md:text-xs text-white font-bold tracking-[0.35em] uppercase border-b border-white/60 pb-0.5" style={{ textShadow: "0 2px 10px rgba(0,0,0,0.7)" }}>Entrar →</span>
          </div>
        )}

        {/* Mobile bottom area */}
        {isMobile && (
          <div className={`absolute bottom-5 right-6 text-right z-[20] ${tx5}`}>
            {active === "show" ? (
              <div style={{ opacity: 1 }}>
                <p className="text-white/90 text-sm font-medium mb-2" style={{ textShadow: "0 2px 10px rgba(0,0,0,0.7)" }}>Shows en vivo · Contrataciones VIP</p>
                <button
                  className="text-[11px] text-white font-bold tracking-[0.35em] uppercase border-b border-white/60 pb-0.5"
                  onClick={(e) => { e.stopPropagation(); window.location.href = "/show"; }}
                  style={{ textShadow: "0 2px 10px rgba(0,0,0,0.7)" }}
                >
                  Entrar →
                </button>
              </div>
            ) : (
              <span className={`animate-pulse text-white/55 text-[10px] tracking-[0.4em] uppercase font-semibold ${txOp5}`} style={{ opacity: active === "academia" ? 0.2 : 1 }}>
                Toca para explorar
              </span>
            )}
          </div>
        )}

        {/* Character image */}
        <div
          className={`absolute z-[2] pointer-events-none ${tx}`}
          style={isMobile ? {
            left: "-4%", bottom: 0, width: "74%", height: "95%",
            opacity: active === "show" ? 1 : active === "academia" ? 0.04 : 0.22,
            transform: active === "show" ? "translateY(0)" : "translateY(8%)",
            willChange: "opacity, transform",
          } : {
            bottom: 0, left: 0, width: "68%", height: "92vh",
            opacity: active === "show" ? 1 : 0.001,
            transform: active === "show" ? "translateY(0)" : "translateY(16%)",
            willChange: "opacity, transform",
          }}
        >
          <img src="/assets/Mae_NoBg_11zon.webp" alt="Mae — Show Group" className="w-full h-full object-contain object-bottom" style={{ filter: "drop-shadow(0 -12px 60px rgba(0,0,0,0.65)) brightness(1.04)", transform: "scaleX(-1)" }} />
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

      {/* Elige tu lado */}
      <div className={`absolute bottom-5 left-1/2 -translate-x-1/2 z-30 pointer-events-none ${txOp5}`} style={{ opacity: active ? 0 : 1 }}>
        <p className="text-white/70 text-[11px] md:text-[12px] tracking-[0.5em] uppercase font-semibold" style={{ textShadow: "0 2px 12px rgba(0,0,0,0.6)" }}>
          Elige tu lado
        </p>
      </div>
    </div>
  );
};

export default LandingSplitScreen;
