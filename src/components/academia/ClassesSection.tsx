import { useState } from "react";
import { X, PlayCircle, ExternalLink, MessageCircle, Sparkles } from "lucide-react";
import twerkRecreativoPortada from "../../assets/academia/TwerkRecreativoPortada.webp";
import hipHopPortada from "../../assets/academia/HipHopPortada.webp";
import breakingPortada from "../../assets/academia/BreakingPortada.webp";
import flexPortada from "../../assets/academia/FlexPortada.webp";
import twerkAvanzadoPortada from "../../assets/academia/TwerkAvanzadoPortada.webp";

const WHATSAPP_NUMBER = "573203426558";
const classBookingUrl = (title: string) =>
  `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(`¡Hola! Quiero agendar la clase de ${title} en Felinas`)}`;

type ClassInfo = {
  title: string;
  description: string;
  modalDescription: string;
  level: string;
  gradient: string;
  number: string;
  trailerUrl?: string;
  portada: string;
  teacher: { name: string; role: string; social: string; image: string };
};

const classes: ClassInfo[] = [
  {
    title: "Twerk Recreativo",
    description: "Una clase grupal para todos los niveles, pensada para venir a disfrutar, soltar el cuerpo y divertirte sin una formación estructurada.",
    modalDescription: "Clase grupal abierta a todos los niveles, para quienes quieren disfrutar del twerk sin comprometerse con una formación técnica. Trabajamos ritmo, control de cadera y coreografías en un ambiente relajado, donde lo importante es pasarla bien y ganar confianza con tu cuerpo. Si buscas aprender twerk desde cero de forma estructurada, tenemos clases personalizadas 1 a 1.",
    level: "Grupal · Todos los niveles",
    gradient: "from-pink-500 to-rose-600",
    number: "01",
    trailerUrl: "https://www.youtube.com/embed/p-4LGl15AIk",
    portada: twerkRecreativoPortada.src,
    teacher: { name: "Mae", role: "Instructora de Twerk Recreativo", social: "https://www.instagram.com/mae.aleja", image: twerkRecreativoPortada.src },
  },
  {
    title: "Hip Hop",
    description: "En estas clases descubre tu identidad, desarrolla tu estilo y prueba nuevas formas de expresarte a través de una de las danzas urbanas más influyentes del mundo.",
    modalDescription: "Un espacio para conectar con la esencia del hip hop: groove, musicalidad y actitud. Aprenderás pasos base, footwork y combinaciones que te ayudarán a construir tu propio estilo dentro de esta cultura urbana.",
    level: "Grupal · Sin experiencia",
    gradient: "from-amber-500 to-yellow-500",
    number: "02",
    trailerUrl: "https://www.youtube.com/embed/HiPuniltcn4",
    portada: hipHopPortada.src,
    teacher: { name: "Angélica", role: "Instructora de Hip Hop", social: "https://www.instagram.com/angee.ortizg", image: hipHopPortada.src },
  },
  {
    title: "Breaking",
    description: "En estas clases desafía tus límites, fortalece tu cuerpo y explora el movimiento desde la creatividad, la disciplina y la cultura urbana.",
    modalDescription: "Clases enfocadas en los fundamentos del breaking: toprock, footwork, freezes y power moves. Un trabajo físico y mental que combina fuerza, equilibrio y creatividad, respetando siempre la base cultural del breaking.",
    level: "Grupal · Sin experiencia",
    gradient: "from-gray-800 to-amber-600",
    number: "03",
    trailerUrl: "https://www.youtube.com/embed/HpC0wH0wZog",
    portada: breakingPortada.src,
    teacher: { name: "Jahn Evels", role: "Instructor de Breaking", social: "https://www.instagram.com/bboyevelss", image: breakingPortada.src },
  },
  {
    title: "Flex, Yoga y Gimnasia",
    description: "En estas clases desarrolla fuerza, flexibilidad, movilidad y conciencia corporal a través de prácticas que complementan tu formación en danza, mejorando el control del movimiento, el equilibrio y el bienestar físico.",
    modalDescription: "Una clase complementaria para fortalecer el cuerpo desde otra perspectiva. Combina estiramientos, posturas de yoga y ejercicios de gimnasia para mejorar tu flexibilidad, movilidad articular y conciencia corporal, base esencial para cualquier bailarín.",
    level: "Grupal · Sin experiencia",
    gradient: "from-purple-700 to-fuchsia-600",
    number: "04",
    trailerUrl: "https://www.youtube.com/embed/i2OxxlCMFiI",
    portada: flexPortada.src,
    teacher: { name: "Andrea Altamirano", role: "Instructora de Flex, Yoga y Gimnasia", social: "https://www.instagram.com/andrealtamirano_", image: flexPortada.src },
  },
  {
    title: "Twerk Avanzado",
    description: "En estas clases encontrarás enfoque en técnica, exploración, musicalidad, acrobacias, control corporal y freestyle. Ideal para llevar tu experiencia a otro nivel.",
    modalDescription: "Para quienes ya tienen bases en twerk y buscan llevar su nivel más allá. Se trabaja técnica avanzada, musicalidad, control corporal, acrobacias y freestyle, con retos que pulen tu ejecución y expresividad sobre la pista.",
    level: "Grupal · Con experiencia",
    gradient: "from-rose-600 to-fuchsia-700",
    number: "05",
    trailerUrl: "https://www.youtube.com/embed/PWJwZYkTZmw",
    portada: twerkAvanzadoPortada.src,
    teacher: { name: "Mae", role: "Instructora de Twerk Avanzado", social: "https://www.instagram.com/mae.aleja", image: twerkAvanzadoPortada.src },
  },
];

const ClassesSection = () => {
  const [selected, setSelected] = useState<ClassInfo | null>(null);

  if (typeof document !== "undefined") {
    document.body.style.overflow = selected ? "hidden" : "auto";
  }

  return (
    <>
      <section id="clases" className="py-24 md:py-32 bg-background relative overflow-hidden">
        <div className="absolute top-40 -left-20 opacity-5 pointer-events-none select-none rotate-90 origin-left">
          <h2 className="font-display font-black text-[12rem] whitespace-nowrap text-transparent text-stroke-primary text-stroke-2">OUR CLASSES</h2>
        </div>

        <div className="container px-4 relative z-10">
          <div className="mb-20 md:mb-32">
            <p className="font-display font-semibold text-primary text-sm tracking-[0.4em] uppercase mb-4 border-l-2 border-primary pl-4">Nuestros estilos</p>
            <h2 className="font-display font-black text-5xl md:text-7xl text-foreground">
              NUESTRAS <span className="text-transparent text-stroke-secondary text-stroke-2">CLASES</span>
            </h2>
          </div>

          <div className="flex flex-col gap-24 md:gap-32">
            {classes.map((c, i) => {
              const isEven = i % 2 !== 0;
              return (
                <div key={c.title} className={`flex flex-col md:flex-row items-center gap-8 md:gap-16 lg:gap-24 relative ${isEven ? "md:flex-row-reverse" : ""}`}>
                  <div className={`w-full md:w-1/2 flex flex-col ${isEven ? "md:items-end md:text-right" : "md:items-start md:text-left"} z-10 relative`}>
                    <div className={`absolute top-0 -translate-y-1/2 ${isEven ? "right-0 lg:-right-4" : "left-0 lg:-left-4"} -z-10 opacity-20 pointer-events-none`}>
                      <span className="font-display font-black text-[8rem] sm:text-[10rem] md:text-[12rem] text-transparent text-stroke-primary text-stroke-2 select-none">{c.number}</span>
                    </div>
                    <div className="inline-block border border-primary/30 text-primary text-xs font-bold tracking-widest px-4 py-1 rounded-full mb-6 mt-8 md:mt-12 bg-background/50 backdrop-blur-sm">
                      {c.level}
                    </div>
                    <h3 className="font-display font-black text-4xl md:text-5xl lg:text-6xl text-foreground mb-6 uppercase relative z-10 drop-shadow-md">{c.title}</h3>
                    <p className="text-muted-foreground text-lg leading-relaxed max-w-md relative z-10 bg-background/50 backdrop-blur-sm rounded-lg py-2">{c.description}</p>
                    <div className={`mt-8 flex flex-wrap items-center gap-3 relative z-10 ${isEven ? "md:justify-end" : "md:justify-start"}`}>
                      <button
                        onClick={() => setSelected(c)}
                        className="font-display font-bold text-sm uppercase tracking-widest text-white flex items-center gap-3 group bg-primary hover:bg-felina-rosa-glow pl-6 pr-2 py-2 rounded-full shadow-lg shadow-primary/30 hover:shadow-primary/50 hover:-translate-y-0.5 transition-all duration-300"
                      >
                        {c.trailerUrl ? "Ver trailer" : "Saber más"}
                        <span className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                          {c.trailerUrl ? <PlayCircle size={18} /> : <ExternalLink size={16} />}
                        </span>
                      </button>
                      <a
                        href={classBookingUrl(c.title)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-display font-bold text-sm uppercase tracking-widest text-primary flex items-center gap-2 group border border-primary/40 hover:bg-primary hover:text-white pl-5 pr-5 py-2.5 rounded-full transition-all duration-300 hover:-translate-y-0.5"
                      >
                        <MessageCircle size={16} className="group-hover:scale-110 transition-transform" />
                        Reserva tu cupo
                      </a>
                    </div>
                  </div>

                  <div className="w-full md:w-1/2 relative h-[400px] md:h-[500px] z-20">
                    <button
                      onClick={() => setSelected(c)}
                      aria-label={`Ver clase de ${c.title}`}
                      className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] aspect-[4/5] bg-secondary rounded-3xl border border-border shadow-2xl overflow-hidden ${isEven ? "rotate-6" : "-rotate-6"} hover:rotate-0 hover:scale-[1.03] transition-all duration-500 cursor-pointer text-left`}
                    >
                      <img src={c.portada} alt={c.title} loading="lazy" className="absolute inset-0 w-full h-full object-cover" />
                      <div className={`absolute inset-0 bg-gradient-to-br ${c.gradient} opacity-20 mix-blend-overlay`} />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/5 to-transparent" />
                    </button>
                    <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] aspect-[4/5] border border-primary/20 rounded-3xl pointer-events-none ${isEven ? "-rotate-3" : "rotate-3"} scale-[1.05]`} />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Mención sutil: twerk personalizado desde cero (no es una clase más) */}
          <div className="mt-16 md:mt-52 max-w-3xl mx-auto">
            <div className="relative flex flex-col sm:flex-row items-center gap-5 sm:gap-6 rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/[0.07] to-transparent px-6 py-6 sm:px-8 sm:py-7 text-center sm:text-left">
              <div className="w-12 h-12 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
                <Sparkles size={22} className="text-primary" />
              </div>
              <div className="flex-1">
                <p className="font-display font-bold text-lg md:text-xl text-foreground">¿Prefieres aprender a tu ritmo?</p>
                <p className="text-muted-foreground text-sm md:text-base mt-1">
                  También ofrecemos clases <span className="text-foreground font-semibold">personalizadas de Twerk desde cero</span>, 1 a 1 y adaptadas por completo a ti.
                </p>
              </div>
              <a
                href={classBookingUrl("Twerk personalizado desde cero")}
                target="_blank"
                rel="noopener noreferrer"
                className="shrink-0 font-display font-bold text-sm uppercase tracking-widest text-primary flex items-center gap-2 group border border-primary/40 hover:bg-primary hover:text-white px-5 py-2.5 rounded-full transition-all duration-300 hover:-translate-y-0.5"
              >
                <MessageCircle size={16} className="group-hover:scale-110 transition-transform" />
                Consultar
              </a>
            </div>
          </div>
        </div>
      </section>

      {selected && (
        <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4 md:p-8">
          <div className="absolute inset-0 bg-secondary/90 backdrop-blur-md" onClick={() => setSelected(null)} />

          <div className="relative w-full max-w-4xl z-10 flex flex-col md:flex-row bg-card border border-border rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden max-h-[92vh] sm:max-h-[90vh] md:h-[85vh] md:max-h-[640px]">
            <button
              onClick={() => setSelected(null)}
              aria-label="Cerrar"
              className="absolute top-3 right-3 md:top-4 md:right-4 z-30 p-2 bg-black/50 hover:bg-primary text-white rounded-full backdrop-blur-md transition-colors"
            >
              <X size={20} />
            </button>

            {/* Trailer panel — vertical 9:16 */}
            <div className="relative shrink-0 bg-black flex items-center justify-center overflow-hidden group w-full h-[38vh] max-h-[360px] md:w-[38%] md:h-full md:max-h-none border-b md:border-b-0 md:border-r border-border">
              {selected.trailerUrl ? (
                <iframe
                  className="h-full aspect-[9/16] max-w-full"
                  src={`${selected.trailerUrl}?autoplay=0&rel=0`}
                  title={`Trailer ${selected.title}`}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <>
                  <div className={`absolute inset-0 bg-gradient-to-br ${selected.gradient} opacity-30`} />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40 pointer-events-none" />
                  <div className="relative z-10 flex flex-col items-center justify-center text-center gap-5 px-6">
                    <button className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-primary/20 hover:bg-primary text-white flex items-center justify-center backdrop-blur-md border border-white/20 transition-all duration-300 hover:scale-110">
                      <PlayCircle size={36} className="ml-1" />
                    </button>
                    <div>
                      <span className="font-display font-black tracking-[0.2em] text-white uppercase text-lg md:text-xl drop-shadow-md block mb-2">Ver Trailer</span>
                      <p className="text-white/60 text-[11px] font-medium bg-black/40 px-3 py-1 rounded-full backdrop-blur-md inline-block">Formato Vertical (9:16)</p>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Info panel */}
            <div className="flex-1 min-h-0 flex flex-col bg-background">
              {/* Scrollable content */}
              <div className="flex-1 min-h-0 overflow-y-auto hidden-scroll p-6 md:p-8">
                <div className="flex items-center gap-2.5 mb-5 md:mb-6">
                  <span className={`inline-block w-2.5 h-2.5 rounded-full bg-gradient-to-r ${selected.gradient} shadow`} />
                  <span className="text-primary font-bold tracking-widest text-[11px] uppercase px-3 py-1 rounded-full border border-primary/20 bg-primary/5">{selected.level}</span>
                </div>

                <h2 className="font-display font-black text-3xl sm:text-4xl lg:text-5xl text-foreground uppercase leading-[0.95] mb-6 md:mb-8">
                  {selected.title}
                </h2>

                <div className="space-y-3 md:space-y-4">
                  <p className="text-[11px] font-semibold text-foreground/60 uppercase tracking-[0.2em] flex items-center gap-3">
                    Acerca de la clase
                    <span className="h-px flex-1 bg-border" />
                  </p>
                  <p className="text-sm md:text-base text-muted-foreground leading-relaxed">{selected.modalDescription}</p>
                </div>

                <a
                  href={classBookingUrl(selected.title)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-6 md:mt-8 inline-flex items-center gap-3 font-display font-bold text-sm uppercase tracking-widest text-white bg-primary hover:bg-felina-rosa-glow pl-6 pr-2 py-2 rounded-full shadow-lg shadow-primary/30 hover:shadow-primary/50 transition-all duration-300 group"
                >
                  Agendar esta clase
                  <span className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <MessageCircle size={16} />
                  </span>
                </a>
              </div>

              {/* Instructor — fixed at bottom */}
              <a
                href={selected.teacher.social}
                target="_blank"
                rel="noopener noreferrer"
                className="shrink-0 border-t border-border px-6 md:px-8 py-4 flex items-center gap-4 hover:bg-muted/40 transition-colors group"
              >
                <div className={`w-12 h-12 md:w-14 md:h-14 rounded-xl overflow-hidden shrink-0 bg-muted ring-2 ring-transparent group-hover:ring-primary/40 transition`}>
                  <img src={selected.teacher.image} alt={selected.teacher.name} loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-bold mb-1">Tu Profesor</p>
                  <p className="font-display font-black text-base md:text-lg leading-none truncate">{selected.teacher.name}</p>
                  <p className="text-primary text-[11px] font-bold tracking-widest uppercase mt-1 truncate">{selected.teacher.role}</p>
                </div>
                <ExternalLink size={16} className="shrink-0 text-muted-foreground group-hover:text-primary transition-colors" />
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ClassesSection;
