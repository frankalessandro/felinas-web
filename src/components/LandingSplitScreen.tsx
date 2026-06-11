import { useState, useEffect } from "react";

const LandingSplitScreen = () => {
  const [hovered, setHovered] = useState<"academia" | "show" | null>(null);
  const [transitionsReady, setTransitionsReady] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const srcs = ["/assets/Andrea_NoBg_11zon.webp", "/assets/Mae_NoBg_11zon.webp", "/assets/PanteraFelinasLogo.svg"];
    Promise.all(srcs.map(src => { const img = new Image(); img.src = src; return img.decode().catch(() => {}); }))
      .then(() => requestAnimationFrame(() => requestAnimationFrame(() => { setTransitionsReady(true); setReady(true); })));
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const x = e.clientX / window.innerWidth;
    if (x < 0.35) {
      if (hovered !== "academia") setHovered("academia");
    } else if (x > 0.65) {
      if (hovered !== "show") setHovered("show");
    } else {
      if (hovered !== null) setHovered(null);
    }
  };

  const handleMouseLeave = () => setHovered(null);

  const tx = transitionsReady ? "transition-all duration-700 ease-in-out" : "";
  const txOp = transitionsReady ? "transition-opacity duration-700" : "";
  const tx5 = transitionsReady ? "transition-all duration-500" : "";
  const txOp5 = transitionsReady ? "transition-opacity duration-500" : "";

  return (
    <div className="h-screen w-screen overflow-hidden flex relative select-none cursor-default" onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave} style={{ opacity: ready ? 1 : 0, transition: "opacity 0.3s ease" }}>
      {/* Logo */}
      <div
        className={`absolute top-12 z-30 pointer-events-none ${tx}`}
        style={{
          left: "50%",
          transform:
            hovered === "academia" ? "translateX(calc(-50% - 7vw))"
            : hovered === "show" ? "translateX(calc(-50% + 7vw))"
            : "translateX(-50%)",
          willChange: "transform",
        }}
      >
        <img src="/assets/PanteraFelinasLogo.svg" alt="Felinas" className="w-52 h-52 drop-shadow-[0_0_30px_rgba(255,255,255,0.6)]" />
      </div>

      {/* ACADEMIA — Left */}
      <a
        href="/academia"
        className={`relative overflow-hidden flex-shrink-0 cursor-pointer ${tx}`}
        style={{
          flex: hovered === "academia" ? "0 0 62%" : hovered === "show" ? "0 0 38%" : "0 0 50%",
          backgroundColor: "#AA145D",
        }}
      >
        <div className="absolute inset-0 z-[3] pointer-events-none" style={{ background: "linear-gradient(to right, rgba(0,0,0,0.15) 0%, transparent 40%)" }} />
        <div className={`absolute inset-0 bg-black z-[4] ${txOp} pointer-events-none`} style={{ opacity: hovered === "show" ? 0.36 : 0, willChange: "opacity" }} />

        <div className="absolute top-1/2 -translate-y-1/2 left-5 md:left-9 xl:left-14 z-[1] pointer-events-none">
          <p className={`text-white text-[11px] md:text-[13px] tracking-[0.45em] uppercase mb-1 md:mb-2 ${txOp5} font-semibold`} style={{ opacity: hovered === "show" ? 0.2 : 0.85, textShadow: "0 2px 12px rgba(0,0,0,0.5)" }}>
            Visita la
          </p>
          <h2 className={`font-display font-black uppercase leading-none ${tx}`} style={{ fontSize: "clamp(3rem, 7vw, 7rem)", color: "white", opacity: hovered === "show" ? 0.28 : 1, textShadow: "3px 3px 0 rgba(0,0,0,0.18), 0 8px 40px rgba(0,0,0,0.4)" }}>
            ACADEMIA
          </h2>
        </div>

        <div className={`absolute left-5 md:left-9 xl:left-14 z-[20] pointer-events-none overflow-hidden ${tx5}`} style={{ bottom: "clamp(1.5rem, 5vh, 3.5rem)", maxHeight: hovered === "academia" ? "80px" : "0px", opacity: hovered === "academia" ? 1 : 0 }}>
          <p className="text-white/90 text-xs md:text-sm font-medium" style={{ textShadow: "0 2px 10px rgba(0,0,0,0.7)" }}>Twerk · Hip Hop · Breaking</p>
          <span className="inline-block mt-2 text-[10px] md:text-xs text-white font-bold tracking-[0.35em] uppercase border-b border-white/60 pb-0.5" style={{ textShadow: "0 2px 10px rgba(0,0,0,0.7)" }}>Entrar →</span>
        </div>

        <div className={`absolute right-0 z-[2] pointer-events-none bottom-16 ${tx}`} style={{ width: "65%", height: "105vh", opacity: hovered === "academia" ? 1 : 0.001, transform: hovered === "academia" ? "translateY(0)" : "translateY(16%)", willChange: "opacity, transform" }}>
          <img src="/assets/Andrea_NoBg_11zon.webp" alt="Andrea — Academia" className="w-full h-full object-contain object-bottom" style={{ filter: "drop-shadow(0 -12px 60px rgba(0,0,0,0.65)) brightness(1.04)", transform: "scaleX(-1)" }} />
        </div>
      </a>

      {/* SHOW GROUP — Right */}
      <a
        href="/show"
        className={`relative overflow-hidden cursor-pointer ${tx}`}
        style={{
          flex: hovered === "show" ? "0 0 62%" : hovered === "academia" ? "0 0 38%" : "0 0 50%",
          backgroundColor: "#7C0475",
        }}
      >
        <div className="absolute inset-0 z-[3] pointer-events-none" style={{ background: "linear-gradient(to left, rgba(0,0,0,0.15) 0%, transparent 40%)" }} />
        <div className={`absolute inset-0 bg-black z-[4] ${txOp} pointer-events-none`} style={{ opacity: hovered === "academia" ? 0.36 : 0, willChange: "opacity" }} />

        <div className="absolute top-1/2 -translate-y-1/2 right-5 md:right-9 xl:right-14 text-right z-[1] pointer-events-none">
          <p className={`text-white text-[11px] md:text-[13px] tracking-[0.45em] uppercase mb-1 md:mb-2 ${txOp5} font-semibold`} style={{ opacity: hovered === "academia" ? 0.2 : 0.85, textShadow: "0 2px 12px rgba(0,0,0,0.5)" }}>
            Conoce el
          </p>
          <h2 className={`font-display font-black uppercase leading-[0.88] ${tx}`} style={{ fontSize: "clamp(3rem, 7vw, 7rem)", color: "white", opacity: hovered === "academia" ? 0.28 : 1, textShadow: "3px 3px 0 rgba(0,0,0,0.18), 0 8px 40px rgba(0,0,0,0.4)" }}>
            F<br />Productions
          </h2>
        </div>

        <div className={`absolute right-5 md:right-9 xl:right-14 text-right z-[20] pointer-events-none overflow-hidden ${tx5}`} style={{ bottom: "clamp(1.5rem, 5vh, 3.5rem)", maxHeight: hovered === "show" ? "80px" : "0px", opacity: hovered === "show" ? 1 : 0 }}>
          <p className="text-white/90 text-xs md:text-sm font-medium" style={{ textShadow: "0 2px 10px rgba(0,0,0,0.7)" }}>Shows en vivo · Contrataciones VIP</p>
          <span className="inline-block mt-2 text-[10px] md:text-xs text-white font-bold tracking-[0.35em] uppercase border-b border-white/60 pb-0.5" style={{ textShadow: "0 2px 10px rgba(0,0,0,0.7)" }}>Entrar →</span>
        </div>

        <div className={`absolute bottom-0 left-0 z-[2] pointer-events-none ${tx}`} style={{ width: "68%", height: "92vh", opacity: hovered === "show" ? 1 : 0.001, transform: hovered === "show" ? "translateY(0)" : "translateY(16%)", willChange: "opacity, transform" }}>
          <img src="/assets/Mae_NoBg_11zon.webp" alt="Mae — Show Group" className="w-full h-full object-contain object-bottom" style={{ filter: "drop-shadow(0 -12px 60px rgba(0,0,0,0.65)) brightness(1.04)", transform: "scaleX(-1)" }} />
        </div>
      </a>

      {/* Blend central */}
      <div
        className={`absolute inset-y-0 pointer-events-none ${tx}`}
        style={{
          left: hovered === "academia" ? "48%" : hovered === "show" ? "24%" : "36%",
          width: "28%",
          opacity: hovered ? 0 : 1,
          background: "linear-gradient(to right, #AA145D 0%, #931469 45%, #7C0475 100%)",
        }}
      />

      {/* Dead zone — bloquea cursor pointer y clicks accidentales en la zona central */}
      <div className="absolute inset-y-0 z-[10] cursor-default" style={{ left: "35%", width: "30%" }} />

      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-30 pointer-events-none">
        <p className="text-white/70 text-[11px] md:text-[12px] tracking-[0.5em] uppercase font-semibold" style={{ textShadow: "0 2px 12px rgba(0,0,0,0.6)" }}>
          Elige tu lado
        </p>
      </div>
    </div>
  );
};

export default LandingSplitScreen;
