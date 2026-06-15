import { useState } from "react";
import { Check } from "lucide-react";
import { cn } from "../../lib/utils";

const WHATSAPP_URL = "https://wa.me/573027451752?text=%C2%A1Hola!%20Quiero%20información%20sobre%20las%20membresías%20de%20Felinas";

type Tab = "combo" | "twerk" | "urbano";

interface PlanCardProps {
  name: string;
  price: string;
  period?: string;
  features: string[];
  popular?: boolean;
}

const PlanCard = ({ name, price, period = "/mes", features, popular }: PlanCardProps) => (
  <div className={cn(
    "relative rounded-2xl p-6 md:p-8 transition-all duration-300 hover:-translate-y-1",
    popular
      ? "bg-gradient-felinas text-white shadow-2xl scale-[1.02] border-2 border-felina-dorado"
      : "bg-card border border-border hover:shadow-xl"
  )}>
    {popular && (
      <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-felina-dorado text-secondary font-display font-bold px-4 py-1 rounded-full text-xs">
        MÁS POPULAR
      </span>
    )}
    <h3 className={cn("font-display font-bold text-lg mb-1", popular ? "text-white" : "text-secondary")}>{name}</h3>
    <div className="mb-6">
      <span className={cn("font-display font-black text-3xl md:text-4xl", popular ? "text-white" : "text-secondary")}>{price}</span>
      <span className={cn("text-sm", popular ? "text-white/70" : "text-muted-foreground")}>{period}</span>
    </div>
    <ul className="space-y-3 mb-8">
      {features.map((f) => (
        <li key={f} className="flex items-start gap-2 text-sm">
          <Check size={16} className={cn("mt-0.5 shrink-0", popular ? "text-felina-dorado" : "text-primary")} />
          <span className={popular ? "text-white/90" : "text-muted-foreground"}>{f}</span>
        </li>
      ))}
    </ul>
    <a
      href={WHATSAPP_URL}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "block w-full text-center rounded-full font-display font-bold py-3 text-sm transition-colors",
        popular
          ? "bg-white text-secondary hover:bg-white/90"
          : "bg-primary text-white hover:bg-felina-rosa-glow"
      )}
    >
      Elegir este plan
    </a>
  </div>
);

const MembershipSection = () => {
  const [activeTab, setActiveTab] = useState<Tab>("combo");

  const tabs: { id: Tab; label: string }[] = [
    { id: "combo", label: "TWERK + URBANO" },
    { id: "twerk", label: "TWERK" },
    { id: "urbano", label: "URBANO" },
  ];

  return (
    <section id="membresias" className="py-20 md:py-28 bg-muted">
      <div className="container px-4">
        <div className="text-center mb-14">
          <p className="font-display font-semibold text-primary text-sm tracking-[0.2em] uppercase mb-3">Membresías</p>
          <h2 className="font-display font-black text-3xl md:text-4xl lg:text-5xl text-secondary mb-4">
            ELIGE TU PLAN Y{" "}
            <span className="text-gradient-pink">EMPIEZA A RUGIR</span>
          </h2>
          <p className="text-muted-foreground max-w-lg mx-auto">
            Clases grupales con capacidad máxima de 6 felinas. Todos los planes incluyen invitaciones a eventos y compartir de la comunidad
          </p>
        </div>

        <div className="max-w-5xl mx-auto">
          <div className="flex mb-10 bg-secondary/10 rounded-full p-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "flex-1 rounded-full font-display font-semibold text-xs sm:text-sm py-2.5 transition-colors",
                  activeTab === tab.id
                    ? "bg-primary text-white"
                    : "text-secondary/70 hover:text-secondary"
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {activeTab === "combo" && (
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <PlanCard name="Despierta" price="$120.000" features={["4 clases al mes", "Twerk + Urbano", "Acceso a eventos"]} />
              <PlanCard name="Instinto" price="$165.000" features={["6 clases al mes", "Twerk + Urbano", "Acceso a eventos"]} />
              <PlanCard name="Alfa" price="$210.000" features={["8 clases al mes", "Twerk + Urbano", "Acceso a eventos", "Mejor relación calidad-precio"]} popular />
              <PlanCard name="Ruge y Fluye" price="$260.000" features={["12 clases al mes", "Twerk + Urbano", "Acceso a eventos", "Máxima frecuencia"]} />
            </div>
          )}

          {activeTab === "twerk" && (
            <>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <PlanCard name="Plan Shake" price="$200.000" period=" (P1)" features={["Personalizado individual", "Plan a tu medida", "Horarios flexibles"]} />
                <PlanCard name="Plan Tic Toc" price="$135.000" features={["6 clases al mes", "Formato grupal", "Ideal para iniciar"]} popular />
                <PlanCard name="Plan Jiggle" price="$360.000" period=" (P1)" features={["Paquete intensivo", "Personalizado individual", "Progreso acelerado"]} />
              </div>
              <p className="text-center text-muted-foreground text-sm mt-6">
                Clase individual: $30.000 · Planes dúo (P2) y clan (P6) disponibles. ¡Consulta por WhatsApp!
              </p>
            </>
          )}

          {activeTab === "urbano" && (
            <>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <PlanCard name="Base" price="$130.000" features={["4 clases al mes", "Hip Hop o Breaking", "Acceso a eventos"]} />
                <PlanCard name="Intermedio" price="$180.000" features={["6 clases al mes", "Hip Hop o Breaking", "Acceso a eventos"]} popular />
                <PlanCard name="Plus" price="$225.000" features={["8 clases al mes", "Hip Hop o Breaking", "Acceso a eventos", "Máxima frecuencia"]} />
              </div>
              <p className="text-center text-muted-foreground text-sm mt-6">Clase individual: $35.000</p>
            </>
          )}
        </div>
      </div>
    </section>
  );
};

export default MembershipSection;
