import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export { gsap, ScrollTrigger };

const reduceMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

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

/** Entrada lateral para [data-reveal-x="left|right"] (imágenes/paneles que entran desde un costado). */
export function initSlideReveals(selector = "[data-reveal-x]") {
  gsap.utils.toArray<HTMLElement>(selector).forEach((el) => {
    const dir = el.dataset.revealX === "right" ? 1 : -1;
    gsap.fromTo(
      el,
      { autoAlpha: 0, x: 60 * dir },
      {
        autoAlpha: 1,
        x: 0,
        duration: 0.8,
        ease: "power2.out",
        scrollTrigger: { trigger: el, start: "top 85%", once: true },
      }
    );
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

/** Evento que emite el loader al terminar; la landing lo usa para encadenar su intro. */
export const LOADER_DONE = "felinas:loader-done";

/**
 * Desvanece y elimina la pantalla de carga.
 * El halo neón crece un poco al salir para que el corte con el fondo negro de la página no se note.
 */
export function hideLoader(id = "loading-screen", duration = 0.5) {
  const loader = document.getElementById(id);
  const done = () => window.dispatchEvent(new CustomEvent(LOADER_DONE));
  if (!loader) {
    done();
    return;
  }

  const halo = loader.querySelector<HTMLElement>(".ls-halo");
  const stack = loader.querySelector<HTMLElement>(".ls-stack");
  const logo = loader.querySelector<HTMLElement>(".ls-logo");
  // Una animación CSS gana sobre el transform inline: hay que apagarla antes de que GSAP tome el relevo.
  [halo, logo].forEach((el) => el && (el.style.animation = "none"));

  const tl = gsap.timeline({
    onComplete: () => {
      loader.remove();
      done();
    },
  });

  if (!reduceMotion()) {
    if (halo) tl.to(halo, { scale: 1.6, opacity: 0, duration: duration * 1.4, ease: "power2.in" }, 0);
    if (stack) tl.to(stack, { scale: 0.94, y: -8, duration: duration * 1.2, ease: "power2.in" }, 0);
  }

  tl.to(loader, { autoAlpha: 0, duration, ease: "power1.out" }, duration * 0.25);
}

/** Parallax horizontal: mueve el elemento en X a medida que se hace scroll vertical. Uso: data-parallax-x="valor px". */
export function initParallaxX(selector = "[data-parallax-x]") {
  if (reduceMotion()) return;
  gsap.utils.toArray<HTMLElement>(selector).forEach((el) => {
    const distance = Number(el.dataset.parallaxX ?? 120);
    gsap.to(el, {
      x: distance,
      ease: "none",
      scrollTrigger: {
        trigger: el.parentElement ?? el,
        start: "top bottom",
        end: "bottom top",
        scrub: 1,
      },
    });
  });
}

/**
 * Sección con scroll vertical que se convierte en desplazamiento horizontal (pin + scrub).
 * Uso: contenedor [data-horizontal-scroll] > track [data-horizontal-track] con hijos más anchos que el viewport.
 */
export function initHorizontalScrollSections(selector = "[data-horizontal-scroll]") {
  if (reduceMotion()) return;
  gsap.utils.toArray<HTMLElement>(selector).forEach((section) => {
    const track = section.querySelector<HTMLElement>("[data-horizontal-track]");
    if (!track) return;

    const getDistance = () => track.scrollWidth - section.clientWidth;

    gsap.to(track, {
      x: () => -getDistance(),
      ease: "none",
      scrollTrigger: {
        trigger: section,
        start: "top top",
        end: () => `+=${getDistance()}`,
        scrub: 0.8,
        pin: true,
        anticipatePin: 1,
        invalidateOnRefresh: true,
      },
    });
  });
}

/** Tilt 3D atrevido: la imagen sigue el mouse dentro de su contenedor. Uso: data-tilt="grados max" en el <img>, perspective en el padre. */
export function initTilt(selector = "[data-tilt]") {
  if (reduceMotion()) return;
  gsap.utils.toArray<HTMLElement>(selector).forEach((el) => {
    const max = Number(el.dataset.tilt) || 12;
    const parent = el.parentElement ?? el;
    const rotateX = gsap.quickTo(el, "rotateX", { duration: 0.5, ease: "power3" });
    const rotateY = gsap.quickTo(el, "rotateY", { duration: 0.5, ease: "power3" });
    const scale = gsap.quickTo(el, "scale", { duration: 0.5, ease: "power3" });

    parent.addEventListener("mousemove", (e) => {
      const evt = e as MouseEvent;
      const rect = parent.getBoundingClientRect();
      const px = (evt.clientX - rect.left) / rect.width - 0.5;
      const py = (evt.clientY - rect.top) / rect.height - 0.5;
      rotateX(-py * max);
      rotateY(px * max);
      scale(1.04);
    });
    parent.addEventListener("mouseleave", () => {
      rotateX(0);
      rotateY(0);
      scale(1);
    });
  });
}

/**
 * Efecto "cartucho de revólver": pinnea la sección y va rotando una carta 3D a la vez
 * (como el tambor de un revólver) a medida que se hace scroll, mostrando el siguiente
 * integrante del equipo en cada paso.
 * Uso: contenedor [data-revolver] > cartas [data-revolver-card] (una por integrante).
 */
export function initRevolverSection(selector = "[data-revolver]") {
  gsap.utils.toArray<HTMLElement>(selector).forEach((section) => {
    const cards = gsap.utils.toArray<HTMLElement>("[data-revolver-card]", section);
    const dots = gsap.utils.toArray<HTMLElement>("[data-revolver-dot]", section);
    if (cards.length < 2) return;

    if (reduceMotion()) {
      gsap.set(cards[0], { autoAlpha: 1 });
      dots[0]?.classList.add("is-active");
      return;
    }

    gsap.set(cards, { autoAlpha: 0, rotateY: 90, transformOrigin: "50% 50%" });
    gsap.set(cards[0], { autoAlpha: 1, rotateY: 0 });
    dots[0]?.classList.add("is-active");

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: "top top",
        end: () => `+=${(cards.length - 1) * window.innerHeight}`,
        scrub: 0.7,
        pin: true,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          const active = Math.min(cards.length - 1, Math.round(self.progress * (cards.length - 1)));
          dots.forEach((d, i) => d.classList.toggle("is-active", i === active));
        },
      },
    });

    cards.forEach((card, i) => {
      if (i === 0) return;
      tl.to(cards[i - 1], { rotateY: -90, autoAlpha: 0, duration: 1, ease: "power1.inOut" }, i - 1).to(
        card,
        { rotateY: 0, autoAlpha: 1, duration: 1, ease: "power1.inOut" },
        i - 1
      );
    });
  });
}

