import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export { gsap, ScrollTrigger };

/** Scroll-reveal para todos los [data-reveal] de la página (reemplaza el IntersectionObserver + transition CSS). */
export function initReveals(selector = "[data-reveal]") {
  gsap.utils.toArray<HTMLElement>(selector).forEach((el) => {
    gsap.fromTo(
      el,
      { autoAlpha: 0, y: 28 },
      {
        autoAlpha: 1,
        y: 0,
        duration: 0.7,
        ease: "power2.out",
        scrollTrigger: { trigger: el, start: "top 88%", once: true },
      }
    );
  });
}

/** Contadores animados para [data-counter] (reemplaza los setInterval de React). */
export function initCounters(selector = "[data-counter]") {
  document.querySelectorAll<HTMLElement>(selector).forEach((el) => {
    const target = Number(el.dataset.counter ?? 0);
    const suffix = el.dataset.suffix ?? "";
    const state = { v: 0 };
    el.textContent = `0${suffix}`;
    gsap.to(state, {
      v: target,
      duration: 1.5,
      ease: "power1.out",
      scrollTrigger: { trigger: el, start: "top 85%", once: true },
      onUpdate: () => {
        el.textContent = `${Math.floor(state.v)}${suffix}`;
      },
    });
  });
}

/** Entrada escalonada tipo hero para los [data-hero-fade] (reemplaza animate-fade-up con animation-delay). */
export function initHeroIntro(scope?: HTMLElement | null) {
  const root = scope ?? document;
  const els = root.querySelectorAll<HTMLElement>("[data-hero-fade]");
  if (!els.length) return;
  gsap.fromTo(
    els,
    { autoAlpha: 0, y: 30 },
    { autoAlpha: 1, y: 0, duration: 0.6, ease: "power2.out", stagger: 0.08, delay: 0.05 }
  );
}

/** Desvanece y elimina la pantalla de carga. */
export function hideLoader(id = "loading-screen", duration = 0.5) {
  const loader = document.getElementById(id);
  if (!loader) return;
  gsap.to(loader, {
    autoAlpha: 0,
    duration,
    ease: "power1.out",
    onComplete: () => loader.remove(),
  });
}
