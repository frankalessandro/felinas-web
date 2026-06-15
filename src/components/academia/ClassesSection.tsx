import { useState } from "react";
import { X, PlayCircle, User } from "lucide-react";

type ClassInfo = {
  title: string;
  description: string;
  level: string;
  gradient: string;
  number: string;
  teacher: { name: string; role: string; bio: string; image: string };
};

const classes: ClassInfo[] = [
  {
    title: "Twerk Recreativo",
    description: "Clases para disfrutar el twerk desde el baile y la diversión. Coreografías, fusiones y conexión con el cuerpo sin presión técnica.",
    level: "Todos los niveles",
    gradient: "from-pink-500 to-rose-600",
    number: "01",
    teacher: { name: "Valeria Gómez", role: "Instructora de Twerk Inicial", bio: "Apasionada por el movimiento libre. Valeria se enfoca en que cada alumna encuentre su ritmo y confianza a través del baile recreativo.", image: "https://images.unsplash.com/photo-1543807535-eceef0bc6599?auto=format&fit=crop&q=80&w=200&h=200" },
  },
  {
    title: "Twerk Formativo",
    description: "Enfocado en técnica, musicalidad, control corporal y freestyle. Ideal para profundizar tu proceso en el twerk.",
    level: "Intermedio",
    gradient: "from-rose-600 to-fuchsia-700",
    number: "02",
    teacher: { name: "Carolina Silva", role: "Coreógrafa & Coach Técnica", bio: "Con más de 8 años de experiencia, Carolina te guiará paso a paso en el desarrollo de fuerza y control avanzado.", image: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&q=80&w=200&h=200" },
  },
  {
    title: "Hip Hop",
    description: "Encuentra tu flow, goce e identidad propia en el baile urbano.",
    level: "Todos los niveles",
    gradient: "from-amber-500 to-yellow-500",
    number: "03",
    teacher: { name: "Marcos 'Flow' Ruiz", role: "Instructor de Hip Hop", bio: "Referente en la escena urbana local. Marcos transmite la cultura Hip Hop enfocada en el freestyle y la musicalidad.", image: "https://images.unsplash.com/photo-1504506894056-b8db25345719?auto=format&fit=crop&q=80&w=200&h=200" },
  },
  {
    title: "Breaking",
    description: "Fortalécete, gana agilidad y domina el suelo con seguridad.",
    level: "Todos los niveles",
    gradient: "from-gray-800 to-amber-600",
    number: "04",
    teacher: { name: "B-boy Jota", role: "Instructor de Breaking", bio: "Fuerza y técnica son su sello. Jota te enseñará desde los movimientos fundacionales hasta power moves avanzados.", image: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&q=80&w=200&h=200" },
  },
  {
    title: "Flex y Yoga",
    description: "Expande tu capacidad corporal y aumenta la conciencia de tus movimientos.",
    level: "Todos los niveles",
    gradient: "from-purple-700 to-fuchsia-600",
    number: "05",
    teacher: { name: "Sofia Luna", role: "Especialista en Flexibilidad & Yoga", bio: "Enfocada en el bienestar integral, Sofia ayuda a las bailarinas a cuidar su cuerpo y maximizar su rango de movimiento.", image: "https://images.unsplash.com/photo-1542282811-943ef1a6770f?auto=format&fit=crop&q=80&w=200&h=200" },
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
              OUR <span className="text-transparent text-stroke-secondary text-stroke-2">CLASS</span>
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
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 pb-20 sm:pb-6">
          <div className="absolute inset-0 bg-secondary/90 backdrop-blur-md" onClick={() => setSelected(null)} />
          <div className="relative w-full max-w-5xl max-h-[90vh] bg-card border border-border rounded-3xl shadow-2xl z-10 flex flex-col md:flex-row overflow-hidden">
            <button onClick={() => setSelected(null)} className="absolute top-4 right-4 z-20 p-2 bg-background/80 hover:bg-primary hover:text-white rounded-full backdrop-blur-md transition-colors">
              <X size={20} />
            </button>

            <div className="w-full md:w-2/5 relative bg-black flex-shrink-0 flex flex-col justify-center min-h-[45vh] md:min-h-0 border-b md:border-b-0 md:border-r border-border overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/80 z-10 pointer-events-none" />
              <img src={selected.teacher.image} className="absolute inset-0 w-full h-full object-cover opacity-50 blur-sm scale-110 group-hover:scale-105 transition-transform duration-1000" alt="" />
              <div className="relative z-20 flex flex-col items-center justify-center p-6 text-center h-full">
                <button className="w-16 h-16 rounded-full bg-primary/20 hover:bg-primary text-white flex items-center justify-center backdrop-blur-md transition-all duration-300 hover:scale-110 mb-6 border border-white/20">
                  <PlayCircle size={32} className="ml-1" />
                </button>
                <span className="font-display font-black tracking-[0.2em] text-white uppercase text-lg mb-2 drop-shadow-md">Ver Trailer</span>
                <p className="text-white/70 text-xs font-medium bg-black/40 px-3 py-1 rounded-full backdrop-blur-md">Formato Vertical (9:16)</p>
              </div>
            </div>

            <div className="w-full md:w-3/5 flex flex-col overflow-y-auto hidden-scroll bg-background">
              <div className="p-8 pb-6 border-b border-border">
                <div className="flex items-center gap-3 mb-4">
                  <span className={`inline-block w-3 h-3 rounded-full bg-gradient-to-r ${selected.gradient} shadow-lg`} />
                  <span className="text-primary font-bold tracking-widest text-xs uppercase px-3 py-1 rounded-full border border-primary/20 bg-primary/5">{selected.level}</span>
                </div>
                <h2 className="font-display font-black text-4xl md:text-5xl text-foreground uppercase leading-none mb-6">{selected.title}</h2>
                <div className="space-y-4 text-muted-foreground leading-relaxed">
                  <p className="text-lg font-medium text-foreground/80">Acerca de la clase</p>
                  <p>{selected.description}</p>
                  <p>Descubre tu potencial, conecta con la música y sé parte de una comunidad que te impulsa a crecer. No requieres experiencia previa, solo ganas de aprender y disfrutar el proceso.</p>
                </div>
              </div>

              <div className="p-8 flex-1 bg-muted/30 flex flex-col justify-center">
                <h3 className="font-display font-bold text-2xl relative inline-block mb-8">
                  Tu Instructor
                  <span className="absolute -bottom-2 left-0 w-12 h-1 bg-primary rounded-full"></span>
                </h3>
                <div className="bg-card border border-border/50 rounded-3xl p-6 shadow-sm flex flex-col sm:flex-row gap-6 items-center sm:items-start hover:border-primary/20 group">
                  <div className="shrink-0 relative">
                    <div className="w-28 h-28 rounded-full overflow-hidden border-[3px] border-background shadow-xl relative z-10 bg-muted">
                      <img src={selected.teacher.image} alt={selected.teacher.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                    </div>
                    <div className="absolute -inset-1 bg-gradient-to-br from-primary to-purple-400 rounded-full blur opacity-40 group-hover:opacity-60 transition-opacity" />
                    <div className="absolute -bottom-2 -right-2 bg-primary text-white p-2 rounded-full shadow-lg z-20">
                      <User size={16} />
                    </div>
                  </div>
                  <div className="flex-1 text-center sm:text-left pt-2">
                    <h4 className="font-display font-black text-2xl mb-1">{selected.teacher.name}</h4>
                    <p className="text-primary text-xs font-bold tracking-[0.2em] uppercase mb-4">{selected.teacher.role}</p>
                    <p className="text-sm text-muted-foreground leading-relaxed">{selected.teacher.bio}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ClassesSection;
