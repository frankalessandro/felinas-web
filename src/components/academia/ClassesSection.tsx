import { useState } from "react";
import { X, PlayCircle, ExternalLink } from "lucide-react";

type ClassInfo = {
  title: string;
  description: string;
  modalDescription: string;
  level: string;
  gradient: string;
  number: string;
  teacher: { name: string; role: string; social: string; image: string };
};

const classes: ClassInfo[] = [
  {
    title: "Twerk Recreativo",
    description: "En estas clases vivirás la experiencia de aprendizaje desde diferentes dinámicas, ejercicios, coreografías y conexión con tu cuerpo.",
    modalDescription: "Clases pensadas para quienes se inician en el twerk. Trabajarás aislamientos, ritmo y control de cadera a través de ejercicios progresivos y coreografías grupales, en un ambiente relajado donde lo importante es disfrutar el proceso y ganar confianza con tu cuerpo.",
    level: "Todos los niveles",
    gradient: "from-pink-500 to-rose-600",
    number: "01",
    teacher: { name: "Mae", role: "Instructora de Twerk Recreativo", social: "#", image: "https://images.unsplash.com/photo-1543807535-eceef0bc6599?auto=format&fit=crop&q=80&w=200&h=200" },
  },
  {
    title: "Hip Hop",
    description: "En estas clases descubre tu identidad, desarrolla tu estilo y prueba nuevas formas de expresarte a través de una de las danzas urbanas más influyentes del mundo.",
    modalDescription: "Un espacio para conectar con la esencia del hip hop: groove, musicalidad y actitud. Aprenderás pasos base, footwork y combinaciones que te ayudarán a construir tu propio estilo dentro de esta cultura urbana.",
    level: "Todos los niveles",
    gradient: "from-amber-500 to-yellow-500",
    number: "02",
    teacher: { name: "Angélica", role: "Instructora de Hip Hop", social: "#", image: "https://images.unsplash.com/photo-1504506894056-b8db25345719?auto=format&fit=crop&q=80&w=200&h=200" },
  },
  {
    title: "Breaking",
    description: "En estas clases desafía tus límites, fortalece tu cuerpo y explora el movimiento desde la creatividad, la disciplina y la cultura urbana.",
    modalDescription: "Clases enfocadas en los fundamentos del breaking: toprock, footwork, freezes y power moves. Un trabajo físico y mental que combina fuerza, equilibrio y creatividad, respetando siempre la base cultural del breaking.",
    level: "Todos los niveles",
    gradient: "from-gray-800 to-amber-600",
    number: "03",
    teacher: { name: "Jahn Evels", role: "Instructor de Breaking", social: "#", image: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&q=80&w=200&h=200" },
  },
  {
    title: "Flex, Yoga y Gimnasia",
    description: "En estas clases desarrolla fuerza, flexibilidad, movilidad y conciencia corporal a través de prácticas que complementan tu formación en danza, mejorando el control del movimiento, el equilibrio y el bienestar físico.",
    modalDescription: "Una clase complementaria para fortalecer el cuerpo desde otra perspectiva. Combina estiramientos, posturas de yoga y ejercicios de gimnasia para mejorar tu flexibilidad, movilidad articular y conciencia corporal, base esencial para cualquier bailarín.",
    level: "Todos los niveles",
    gradient: "from-purple-700 to-fuchsia-600",
    number: "04",
    teacher: { name: "Andrea Altamirano", role: "Instructora de Flex, Yoga y Gimnasia", social: "#", image: "https://images.unsplash.com/photo-1542282811-943ef1a6770f?auto=format&fit=crop&q=80&w=200&h=200" },
  },
  {
    title: "Twerk Avanzado",
    description: "En estas clases encontrarás enfoque en técnica, exploración, musicalidad, acrobacias, control corporal y freestyle. Ideal para llevar tu experiencia a otro nivel.",
    modalDescription: "Para quienes ya tienen bases en twerk y buscan llevar su nivel más allá. Se trabaja técnica avanzada, musicalidad, control corporal, acrobacias y freestyle, con retos que pulen tu ejecución y expresividad sobre la pista.",
    level: "Intermedio / Avanzado",
    gradient: "from-rose-600 to-fuchsia-700",
    number: "05",
    teacher: { name: "Mae", role: "Instructora de Twerk Avanzado", social: "#", image: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&q=80&w=200&h=200" },
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
                    <button onClick={() => setSelected(c)} className="mt-8 font-display font-bold text-sm uppercase tracking-widest text-primary flex items-center gap-2 group relative z-10">
                      <span className="w-12 h-px bg-primary group-hover:w-20 transition-all duration-300" />
                      Saber más
                    </button>
                  </div>

                  <div className="w-full md:w-1/2 relative h-[400px] md:h-[500px] z-20">
                    <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] aspect-[4/5] bg-secondary rounded-3xl border border-border shadow-2xl overflow-hidden ${isEven ? "rotate-6" : "-rotate-6"} hover:rotate-0 transition-transform duration-500`}>
                      <div className={`absolute inset-0 bg-gradient-to-br ${c.gradient} opacity-20`} />
                      <div className="absolute inset-0 flex items-center justify-center p-8 text-center bg-secondary/80 backdrop-blur-sm">
                        <div className="border-2 border-dashed border-primary/30 rounded-xl w-full h-full flex items-center justify-center flex-col gap-4">
                          <span className="font-display font-bold text-white/30 text-lg uppercase tracking-widest">{c.title}</span>
                          <span className="text-xs text-muted-foreground">Espacio para fotografía</span>
                        </div>
                      </div>
                    </div>
                    <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] aspect-[4/5] border border-primary/20 rounded-3xl pointer-events-none ${isEven ? "-rotate-3" : "rotate-3"} scale-[1.05]`} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {selected && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8">
          <div className="absolute inset-0 bg-secondary/90 backdrop-blur-md" onClick={() => setSelected(null)} />
          <div className="relative w-full max-w-4xl max-h-[85vh] bg-card border border-border rounded-3xl shadow-2xl z-10 flex flex-col md:flex-row overflow-hidden">
            <button onClick={() => setSelected(null)} className="absolute top-4 right-4 z-20 p-2 bg-background/80 hover:bg-primary hover:text-white rounded-full backdrop-blur-md transition-colors">
              <X size={20} />
            </button>

            {/* Trailer panel — 9:16 ratio feel on desktop */}
            <div className="w-full md:w-[40%] lg:w-[38%] relative bg-black flex-shrink-0 flex flex-col justify-center min-h-[40vh] md:min-h-0 border-b md:border-b-0 md:border-r border-border overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/80 z-10 pointer-events-none" />
              <div className={`absolute inset-0 bg-gradient-to-br ${selected.gradient} opacity-25`} />
              <div className="relative z-20 flex flex-col items-center justify-center p-8 text-center h-full gap-6">
                <button className="w-20 h-20 rounded-full bg-primary/20 hover:bg-primary text-white flex items-center justify-center backdrop-blur-md transition-all duration-300 hover:scale-110 border border-white/20">
                  <PlayCircle size={40} className="ml-1" />
                </button>
                <div>
                  <span className="font-display font-black tracking-[0.2em] text-white uppercase text-xl drop-shadow-md block mb-2">Ver Trailer</span>
                  <p className="text-white/60 text-xs font-medium bg-black/40 px-3 py-1 rounded-full backdrop-blur-md inline-block">Formato Vertical (9:16)</p>
                </div>
              </div>
            </div>

            {/* Info panel */}
            <div className="flex-1 flex flex-col bg-background overflow-hidden">
              {/* Scrollable content */}
              <div className="flex-1 overflow-y-auto hidden-scroll p-8">
                <div className="flex items-center gap-3 mb-6">
                  <span className={`inline-block w-3 h-3 rounded-full bg-gradient-to-r ${selected.gradient} shadow-lg`} />
                  <span className="text-primary font-bold tracking-widest text-xs uppercase px-3 py-1 rounded-full border border-primary/20 bg-primary/5">{selected.level}</span>
                </div>
                <h2 className="font-display font-black text-4xl md:text-5xl lg:text-6xl text-foreground uppercase leading-none mb-8">{selected.title}</h2>
                <div className="space-y-4 text-muted-foreground leading-relaxed">
                  <p className="text-xs font-semibold text-foreground/70 uppercase tracking-widest">Acerca de la clase</p>
                  <p className="text-lg">{selected.modalDescription}</p>
                </div>
              </div>

              {/* Instructor — fixed at bottom, no bubble */}
              <a
                href={selected.teacher.social}
                target="_blank"
                rel="noopener noreferrer"
                className="shrink-0 border-t border-border px-8 py-4 flex items-center gap-4 hover:bg-muted/30 transition-colors group"
              >
                <div className="w-14 h-14 rounded-xl overflow-hidden shrink-0 bg-muted">
                  <img src={selected.teacher.image} alt={selected.teacher.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs uppercase tracking-[0.15em] text-muted-foreground font-bold mb-1">Tu Profesor</p>
                  <p className="font-display font-black text-lg leading-none truncate">{selected.teacher.name}</p>
                  <p className="text-primary text-xs font-bold tracking-widest uppercase mt-1 truncate">{selected.teacher.role}</p>
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
