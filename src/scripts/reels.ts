import { gsap, reduceMotion } from "./gsap";

/**
 * Lógica de los reels de F Productions. Vive fuera de animations.ts porque no es
 * ScrollTrigger: es control de reproducción + un lightbox, y la sección se monta
 * en páginas que ya cargan ScrollTrigger por otras razones.
 *
 * Dos tipos de tile:
 *  - [data-reel-loop]  → clip mudo, arranca solo al entrar en viewport y se pausa al salir.
 *  - [data-reel-hero]  → clip con audio, se abre en lightbox al click.
 *
 * El <video> de los loops nace con preload="none" y sin src: el src real vive en
 * data-src y solo se asigna cuando el tile se acerca al viewport. Así la sección
 * no descarga un solo byte de video hasta que hace falta.
 */

type Teardown = () => void;
const teardowns: Teardown[] = [];

/** Asigna el src diferido una única vez. */
function hydrateVideo(video: HTMLVideoElement) {
  if (video.dataset.hydrated === "true") return;
  const src = video.dataset.src;
  if (!src) return;
  video.src = src;
  video.dataset.hydrated = "true";
}

/**
 * Autoplay de los loops mudos según visibilidad.
 * Se precargan con un margen generoso (300px) para que el clip ya esté listo
 * cuando el tile entra de verdad en pantalla, y se pausan al salir para no
 * gastar CPU/batería decodificando fuera de vista.
 */
function initLoops(root: ParentNode): Teardown {
  const loops = Array.from(root.querySelectorAll<HTMLElement>("[data-reel-loop]"));
  if (!loops.length) return () => {};

  // Con prefers-reduced-motion no se autoreproduce nada: queda el poster fijo.
  if (reduceMotion()) return () => {};

  const preloader = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        const video = entry.target.querySelector<HTMLVideoElement>("video");
        if (video) hydrateVideo(video);
        preloader.unobserve(entry.target);
      }
    },
    { rootMargin: "300px 0px" },
  );

  const player = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        const tile = entry.target as HTMLElement;
        const video = tile.querySelector<HTMLVideoElement>("video");
        if (!video) continue;

        if (entry.isIntersecting) {
          hydrateVideo(video);
          // play() rechaza si el navegador bloquea el autoplay; el poster se queda y ya.
          void video.play().then(
            () => tile.setAttribute("data-playing", "true"),
            () => {},
          );
        } else {
          video.pause();
          tile.setAttribute("data-playing", "false");
        }
      }
    },
    { threshold: 0.35 },
  );

  loops.forEach((tile) => {
    preloader.observe(tile);
    player.observe(tile);
  });

  return () => {
    preloader.disconnect();
    player.disconnect();
    loops.forEach((tile) => tile.querySelector("video")?.pause());
  };
}

/**
 * Lightbox para los reels con audio. Un único overlay reutilizado por todos los
 * tiles (crear/destruir un <video> por apertura obliga al navegador a rearmar el
 * decoder cada vez). El clip se descarga recién al abrir.
 */
function initLightbox(root: ParentNode): Teardown {
  const heroes = Array.from(root.querySelectorAll<HTMLElement>("[data-reel-hero]"));
  const overlay = document.querySelector<HTMLElement>("[data-reel-lightbox]");
  if (!heroes.length || !overlay) return () => {};

  const video = overlay.querySelector<HTMLVideoElement>("video");
  const panel = overlay.querySelector<HTMLElement>("[data-reel-lightbox-panel]");
  const caption = overlay.querySelector<HTMLElement>("[data-reel-lightbox-caption]");
  const closeBtn = overlay.querySelector<HTMLElement>("[data-reel-close]");
  if (!video || !panel) return () => {};

  let lastFocused: HTMLElement | null = null;

  const show = (tile: HTMLElement) => {
    const src = tile.dataset.src;
    if (!src) return;

    lastFocused = tile;
    video.src = src;
    video.currentTime = 0;
    if (caption) caption.textContent = tile.dataset.caption ?? "";

    overlay.hidden = false;
    overlay.setAttribute("aria-hidden", "false");
    // Bloquea el scroll de fondo mientras el lightbox está abierto.
    document.body.style.overflow = "hidden";

    closeBtn?.focus();
    void video.play().catch(() => {});

    if (!reduceMotion()) {
      gsap.fromTo(overlay, { opacity: 0 }, { opacity: 1, duration: 0.25, ease: "power2.out" });
      gsap.fromTo(panel, { scale: 0.92, y: 24 }, { scale: 1, y: 0, duration: 0.45, ease: "power3.out" });
    }
  };

  const hide = () => {
    // El estado real es el atributo `hidden`, no una bandera aparte: si el overlay
    // llega visible por cualquier motivo, cerrar tiene que funcionar igual.
    if (overlay.hidden) return;

    const finish = () => {
      overlay.hidden = true;
      overlay.setAttribute("aria-hidden", "true");
      video.pause();
      // Suelta el buffer: sin esto el clip sigue en memoria tras cerrar.
      video.removeAttribute("src");
      video.load();
      document.body.style.overflow = "";
      lastFocused?.focus();
    };

    if (reduceMotion()) {
      finish();
    } else {
      gsap.to(overlay, { opacity: 0, duration: 0.2, ease: "power2.in", onComplete: finish });
    }
  };

  const onTileActivate = (event: Event) => {
    event.preventDefault();
    show(event.currentTarget as HTMLElement);
  };

  const onKeydown = (event: KeyboardEvent) => {
    if (event.key === "Escape") hide();
  };

  const onOverlayClick = (event: MouseEvent) => {
    // Solo cierra al hacer click fuera del panel, no sobre el video.
    if (!panel.contains(event.target as Node)) hide();
  };

  heroes.forEach((tile) => tile.addEventListener("click", onTileActivate));
  closeBtn?.addEventListener("click", hide);
  overlay.addEventListener("click", onOverlayClick);
  document.addEventListener("keydown", onKeydown);

  return () => {
    heroes.forEach((tile) => tile.removeEventListener("click", onTileActivate));
    closeBtn?.removeEventListener("click", hide);
    overlay.removeEventListener("click", onOverlayClick);
    document.removeEventListener("keydown", onKeydown);
    document.body.style.overflow = "";
    video.pause();
  };
}

/** Punto de entrada único de la sección de reels. */
export function initReels(root: ParentNode = document) {
  teardowns.push(initLoops(root), initLightbox(root));
}

/** Limpieza para View Transitions: evita listeners y videos huérfanos entre navegaciones. */
export function destroyReels() {
  while (teardowns.length) teardowns.pop()?.();
}

if (typeof document !== "undefined") {
  document.addEventListener("astro:before-swap", destroyReels);
}
