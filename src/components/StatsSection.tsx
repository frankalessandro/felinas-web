import { useEffect, useRef, useState } from "react";

const stats = [
  { value: 9, suffix: "+", label: "Años de experiencia" },
  { value: 80, suffix: "%", label: "Enfoque personalizado" },
  { value: 5, suffix: "", label: "Estilos de danza" },
  { value: 5, suffix: "", label: "Clases semanales" },
];

const Counter = ({ target, suffix }: { target: number; suffix: string }) => {
  const [count, setCount] = useState(0);
  const [started, setStarted] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting && !started) setStarted(true); },
      { threshold: 0.5 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [started]);

  useEffect(() => {
    if (!started) return;
    const steps = 40;
    const increment = target / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) { setCount(target); clearInterval(timer); }
      else setCount(Math.floor(current));
    }, 1500 / steps);
    return () => clearInterval(timer);
  }, [started, target]);

  return (
    <div ref={ref} className="relative inline-block">
      <p className="font-display font-black text-6xl md:text-8xl lg:text-[8rem] text-transparent text-stroke-primary text-stroke-2 leading-none">
        {count}{suffix}
      </p>
    </div>
  );
};

const StatsSection = () => (
  <section className="py-20 md:py-32 bg-background border-y border-border overflow-hidden relative">
    <div className="absolute top-1/2 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-[100px] -translate-y-1/2 -z-10"></div>
    <div className="container px-4">
      <div className="flex flex-col md:flex-row flex-wrap justify-between items-center gap-16 md:gap-8">
        {stats.map((s) => (
          <div key={s.label} className="flex flex-col items-center md:items-start relative group">
            <Counter target={s.value} suffix={s.suffix} />
            <div className="absolute -bottom-4 left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-500 hidden md:block" />
            <p className="mt-4 text-base md:text-lg text-foreground font-medium uppercase tracking-widest pl-2 border-l-2 border-primary/50">
              {s.label}
            </p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default StatsSection;
