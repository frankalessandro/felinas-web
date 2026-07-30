/**
 * Animaciones ligadas al scroll. Importar desde acá arrastra ScrollTrigger;
 * si solo hace falta GSAP core (landing, loader), importar desde `./gsap`.
 */
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { gsap, reduceMotion } from "./gsap";

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

/**
 * Simula :hover con el scroll: cuando un [data-scroll-active] entra en la banda central
 * del viewport se le marca data-active="true" (leído por variantes Tailwind
 * `group-data-[active=true]:` o `data-[active=true]:`). Así los mismos estilos que antes
 * solo se veían con el mouse se disparan solos al pasar por pantalla — imprescindible en
 * móvil, donde no existe hover, y da vida al scroll también en desktop.
 */
export function initScrollActive(selector = "[data-scroll-active]") {
  gsap.utils.toArray<HTMLElement>(selector).forEach((el) => {
    ScrollTrigger.create({
      trigger: el,
      start: "top 75%",
      end: "bottom 25%",
      onToggle: (self) => {
        el.dataset.active = self.isActive ? "true" : "false";
      },
    });
  });
}

/**
 * Variante exclusiva de initScrollActive: dentro de un contenedor, solo el elemento más
 * cercano al centro del viewport queda activo (data-spot="true"), nunca dos a la vez.
 * Existe porque una banda ancha (initScrollActive) permite que dos filas grandes y vecinas
 * queden encendidas al mismo tiempo — bien para acentos sutiles, mal para efectos fuertes
 * como un flood de color que invierte el texto: ahí dos activos a la vez se ve roto.
 */
export function initScrollSpotlight(containerSelector: string, itemSelector = "[data-spotlight-item]") {
  document.querySelectorAll<HTMLElement>(containerSelector).forEach((container) => {
    const items = Array.from(container.querySelectorAll<HTMLElement>(itemSelector));
    if (!items.length) return;

    const mark = () => {
      const centerY = window.innerHeight / 2;
      let closest: HTMLElement | null = null;
      let minDist = Infinity;
      for (const item of items) {
        const rect = item.getBoundingClientRect();
        const dist = Math.abs(rect.top + rect.height / 2 - centerY);
        if (dist < minDist) {
          minDist = dist;
          closest = item;
        }
      }
      items.forEach((it) => (it.dataset.spot = it === closest ? "true" : "false"));
    };

    ScrollTrigger.create({ trigger: container, start: "top bottom", end: "bottom top", onUpdate: mark, onRefresh: mark });
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

/**
 * Animaciones ambientales en bucle (glows flotantes, latidos, rebotes) que antes eran
 * @keyframes de CSS. En GSAP se pueden pausar cuando el elemento sale del viewport,
 * cosa que una animación CSS no permite: un glow con blur de 110px animándose fuera de
 * pantalla sigue costando composición en cada frame.
 *
 * Uso: data-ambient="float | glow | bounce | pulse" y, opcional, data-ambient-duration.
 */
export function initAmbient(selector = "[data-ambient]") {
  if (reduceMotion()) return;

  gsap.utils.toArray<HTMLElement>(selector).forEach((el) => {
    const kind = el.dataset.ambient;
    const duration = Number(el.dataset.ambientDuration) || undefined;
    const base = { repeat: -1, yoyo: true, ease: "sine.inOut", paused: true };

    let tween: gsap.core.Tween;
    switch (kind) {
      case "float":
        tween = gsap.to(el, { ...base, duration: duration ?? 8, y: -20, scale: 1.05, opacity: 0.8 });
        gsap.set(el, { opacity: 0.5 });
        break;
      case "glow":
        tween = gsap.to(el, {
          ...base,
          duration: duration ?? 2,
          boxShadow: "0 0 40px hsl(340 82% 52% / 0.6)",
        });
        gsap.set(el, { boxShadow: "0 0 20px hsl(340 82% 52% / 0.3)" });
        break;
      case "bounce":
        tween = gsap.to(el, { ...base, duration: duration ?? 2, y: -8 });
        break;
      case "pulse":
        tween = gsap.to(el, { ...base, duration: duration ?? 1, opacity: 0.35 });
        break;
      default:
        return;
    }

    if (el.dataset.ambientReverse !== undefined) tween.progress(0.5);

    ScrollTrigger.create({
      trigger: el,
      start: "top bottom",
      end: "bottom top",
      onToggle: (self) => (self.isActive ? tween.play() : tween.pause()),
    });
  });
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

    // Tarjetas marcadas [data-scroll-active]: mientras el filmstrip se desplaza,
    // la más cercana al centro de pantalla queda "activa" (mismo mecanismo que
    // initScrollActive, aplicado aquí porque el scroll es horizontal, no vertical).
    const cards = Array.from(track.querySelectorAll<HTMLElement>("[data-scroll-active]"));
    const markActiveCard = () => {
      if (!cards.length) return;
      const centerX = window.innerWidth / 2;
      let closest: HTMLElement | null = null;
      let minDist = Infinity;
      for (const card of cards) {
        const rect = card.getBoundingClientRect();
        const dist = Math.abs(rect.left + rect.width / 2 - centerX);
        if (dist < minDist) {
          minDist = dist;
          closest = card;
        }
      }
      cards.forEach((c) => (c.dataset.active = c === closest ? "true" : "false"));
    };

    // La barra de progreso se alimenta del mismo trigger que mueve el track: un
    // segundo ScrollTrigger sobre la misma sección se desincronizaría con el pin.
    const progress = section.querySelector<HTMLElement>("[data-horizontal-progress]");

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
        onUpdate: (self) => {
          markActiveCard();
          if (progress) gsap.set(progress, { scaleX: self.progress });
        },
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
    const hint = section.querySelector<HTMLElement>("[data-revolver-hint]");
    if (cards.length < 2) return;

    if (reduceMotion()) {
      gsap.set(cards[0], { autoAlpha: 1 });
      dots[0]?.classList.add("is-active");
      if (hint) gsap.set(hint, { autoAlpha: 0 });
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
          // El hint solo orienta al llegar a la sección; se retira apenas el usuario empieza a scrollear.
          if (hint) gsap.to(hint, { autoAlpha: self.progress > 0.03 ? 0 : 1, duration: 0.3, overwrite: true });
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

