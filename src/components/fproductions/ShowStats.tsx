import { useEffect, useRef, useState } from "react";

const stats = [
  { value: 200, suffix: "+", label: "Shows realizados" },
  { value: 50, suffix: "+", label: "Marcas y eventos" },
  { value: 8, suffix: "", label: "Años en escena" },
  { value: 100, suffix: "%", label: "A tu medida" },
];

const Counter = ({ target, suffix }: { target: number; suffix: string }) => {
  const [count, setCount] = useState(0);
  const [started, setStarted] = useState(false);
  const ref = useRef<HTMLParagraphElement>(null);

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
    const steps = 45;
    const increment = target / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) { setCount(target); clearInterval(timer); }
      else setCount(Math.floor(current));
    }, 1400 / steps);
    return () => clearInterval(timer);
  }, [started, target]);

  return (
    <p
      ref={ref}
      className="font-display font-black text-5xl md:text-7xl lg:text-[6.5rem] leading-none text-transparent bg-clip-text bg-gradient-to-b from-white to-felina-morado"
    >
      {count}{suffix}
    </p>
  );
};

const ShowStats = () => (
  <section className="relative py-20 md:py-28 bg-[#07030b] border-y border-white/5 overflow-hidden">
    <div className="absolute top-1/2 left-1/4 w-96 h-96 bg-felina-morado/10 rounded-full blur-[120px] -translate-y-1/2" />
    <div className="container px-4 md:px-8 relative z-10">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-y-12 gap-x-6">
        {stats.map((s) => (
          <div key={s.label} className="flex flex-col items-center text-center group">
            <Counter target={s.value} suffix={s.suffix} />
            <div className="w-8 h-0.5 bg-felina-morado/60 my-4 group-hover:w-16 transition-all duration-500" />
            <p className="text-xs md:text-sm text-white/50 font-semibold uppercase tracking-[0.15em]">
              {s.label}
            </p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default ShowStats;
