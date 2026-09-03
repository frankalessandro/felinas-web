import { gsap, reduceMotion } from "./gsap";
// ScrollTrigger solo hace falta para el modo móvil del escenario. Se importa desde
// animations.ts, que es donde se registra el plugin una única vez.
import { ScrollTrigger } from "./animations";

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

  // En móvil el autoplay no es fiable (el navegador pausa los decoders fuera de
  // vista, Low Power Mode lo bloquea del todo) y el clip se ve congelado. Ahí la
  // reproducción pasa a ser manual con un botón; el observer de abajo solo se usa
  // para pausar al salir de pantalla.
  const isMobile = window.matchMedia("(max-width: 767px)").matches;

  // prefers-reduced-motion apaga el autoplay, NO el botón: un tap es una acción
  // explícita del usuario y siempre tiene que responder. Antes se salía de la
  // función entera acá y el botón quedaba visible pero muerto en cualquier
  // teléfono con "reducir movimiento" activado.
  const autoplay = !isMobile && !reduceMotion();

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
          // Sin autoplay manda el botón: acá no se reproduce nada solo.
          if (!autoplay) continue;
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
    // Sin autoplay el umbral es mínimo: el observer solo tiene que detectar que el
    // tile salió del todo para pausar lo que el usuario haya puesto a correr.
    { threshold: autoplay ? 0.35 : 0.01 },
  );

  loops.forEach((tile) => {
    preloader.observe(tile);
    player.observe(tile);
    // Marca "esto no arranca solo": el CSS usa el flag para mostrar el botón de
    // play también donde normalmente está oculto (desktop con reducir movimiento),
    // que si no se queda con un poster fijo y ninguna forma de reproducirlo.
    if (!autoplay) tile.dataset.manual = "true";
  });

  // Botón de play/pausa manual, cableado SIEMPRE. Quién lo ve lo decide el CSS
  // (`md:hidden`), no este script: atarlo al breakpoint medido al montar dejaba
  // el botón muerto si la ventana cruzaba a ancho de móvil después de cargar
  // —responsive en devtools, rotar una tablet, abrir el navegador angosto—.
  // En desktop el botón está en display:none, así que escucharlo no cuesta nada.
  const toggles: Array<{ btn: HTMLElement; onClick: (e: Event) => void }> = [];
  loops.forEach((tile) => {
    const btn = tile.querySelector<HTMLElement>("[data-reel-loop-toggle]");
    const video = tile.querySelector<HTMLVideoElement>("video");
    if (!btn || !video) return;

    const onClick = (e: Event) => {
      // El botón ocupa la tarjeta entera; si la tarjeta vive dentro de algo
      // clickeable, el tap es para el video y no para lo de abajo.
      e.preventDefault();
      e.stopPropagation();
      hydrateVideo(video);
      if (video.paused) {
        void video.play().then(
          () => tile.setAttribute("data-playing", "true"),
          () => {},
        );
      } else {
        video.pause();
        tile.setAttribute("data-playing", "false");
      }
    };

    btn.addEventListener("click", onClick);
    toggles.push({ btn, onClick });
  });

  return () => {
    preloader.disconnect();
    player.disconnect();
    toggles.forEach(({ btn, onClick }) => btn.removeEventListener("click", onClick));
    loops.forEach((tile) => tile.querySelector("video")?.pause());
  };
}

/**
 * Escenario: el índice de la izquierda manda sobre la vista previa de la derecha.
 *
 * No hay movimiento automático a propósito. La sección se mueve cuando el usuario
 * la mueve — apuntar una fila cambia el escenario, hacer click abre el reel. Lo
 * único animado es la transición entre reels, que reusa el desregistro de placas
 * del retrato del hero: se separan de golpe y vuelven a su sitio.
 */
function initStage(root: ParentNode): Teardown {
  const stage = root.querySelector<HTMLElement>("[data-reel-stage]");
  if (!stage) return () => {};

  const rows = Array.from(stage.querySelectorAll<HTMLElement>("[data-reel-row]"));
  const posters = Array.from(stage.querySelectorAll<HTMLElement>("[data-stage-poster]"));
  const title = stage.querySelector<HTMLElement>("[data-stage-title]");
  const dots = Array.from(stage.querySelectorAll<HTMLElement>("[data-stage-dot]"));
  const counter = stage.querySelector<HTMLElement>("[data-stage-counter]");
  const hint = stage.querySelector<HTMLElement>("[data-stage-hint]");
  const plateA = stage.querySelector<HTMLElement>('[data-stage-plate="a"]');
  const plateB = stage.querySelector<HTMLElement>('[data-stage-plate="b"]');
  const playBtn = stage.querySelector<HTMLElement>("[data-reel-stage-play]");
  if (!rows.length || !posters.length) return () => {};

  // El desplazamiento base de las placas crece en desktop, donde el escenario es
  // más grande y un offset chico se perdería.
  const wide = window.matchMedia("(min-width: 1024px)");
  const base = () => (wide.matches ? 14 : 9);

  const placePlates = () => {
    if (!plateA || !plateB) return;
    const o = base();
    gsap.set(plateA, { x: -o, y: -o });
    gsap.set(plateB, { x: o, y: o });
  };
  placePlates();
  wide.addEventListener("change", placePlates);

  let current = 0;

  const select = (i: number) => {
    if (i === current || !rows[i]) return;
    current = i;

    rows.forEach((row, r) => row.setAttribute("aria-current", r === i ? "true" : "false"));

    // Indicadores de móvil: el punto activo se alarga, como una barra de progreso
    // por pasos en vez de cinco puntos iguales.
    dots.forEach((dot, d) => {
      dot.classList.toggle("w-8", d === i);
      dot.classList.toggle("bg-[#ff006a]", d === i);
      dot.classList.toggle("w-3", d !== i);
      dot.classList.toggle("bg-white/25", d !== i);
    });
    if (counter) counter.textContent = `0${i + 1} / 0${rows.length}`;

    if (reduceMotion()) {
      posters.forEach((p, r) => gsap.set(p, { autoAlpha: r === i ? 1 : 0 }));
      if (title) title.textContent = rows[i].dataset.caption ?? "";
      return;
    }

    posters.forEach((p, r) => gsap.to(p, { autoAlpha: r === i ? 1 : 0, duration: 0.45, ease: "power2.out" }));

    // Golpe de desregistro: las placas saltan hacia afuera y vuelven.
    const o = base();
    if (plateA) gsap.fromTo(plateA, { x: -o * 2.6, y: -o * 2.6 }, { x: -o, y: -o, duration: 0.5, ease: "power3.out" });
    if (plateB) gsap.fromTo(plateB, { x: o * 2.6, y: o * 2.6 }, { x: o, y: o, duration: 0.5, ease: "power3.out" });

    if (title) {
      title.textContent = rows[i].dataset.caption ?? "";
      gsap.fromTo(title, { autoAlpha: 0, y: 10 }, { autoAlpha: 1, y: 0, duration: 0.4, ease: "power2.out" });
    }
  };

  // Apuntar una fila (mouse o teclado) cambia el escenario; el click lo abre y
  // de eso ya se encarga el lightbox, que lee los mismos [data-reel-hero].
  const handlers = rows.map((row, i) => {
    const onEnter = () => select(i);
    row.addEventListener("pointerenter", onEnter);
    row.addEventListener("focus", onEnter);
    return { row, onEnter };
  });

  // El botón del escenario abre el reel que se está mostrando.
  const onPlay = () => rows[current]?.click();
  playBtn?.addEventListener("click", onPlay);

  /**
   * Móvil: el escenario se pinnea y el scroll avanza de reel, igual que el revólver
   * de TeamSection. Ahí no cabe el índice numerado, así que el scroll pasa a ser la
   * navegación y el título vive sobre el propio botón.
   *
   * Va dentro de matchMedia y no de un media query suelto para que ScrollTrigger
   * cree y destruya el pin al cruzar el breakpoint: un pin que sobrevive al pasar a
   * desktop deja la sección trabada.
   */
  const mm = gsap.matchMedia();

  mm.add("(max-width: 1023px)", () => {
    // Sin animación no hay pin: el usuario quedaría atrapado en una sección que
    // solo avanza con un scroll que no se le anima. En su lugar se muestra el
    // índice completo, que es navegable con un tap.
    if (reduceMotion()) {
      const list = stage.querySelector<HTMLElement>("ul");
      list?.classList.remove("hidden");
      list?.classList.add("flex");
      if (hint) gsap.set(hint, { autoAlpha: 0 });
      return;
    }

    const steps = rows.length - 1;
    if (steps < 1) return;

    const trigger = ScrollTrigger.create({
      trigger: stage,
      start: "top top",
      // Una pantalla de scroll por reel: suficiente para que el cambio se sienta
      // deliberado y no un parpadeo al rozar la sección.
      end: () => `+=${steps * window.innerHeight * 0.9}`,
      scrub: 0.5,
      pin: true,
      anticipatePin: 1,
      invalidateOnRefresh: true,
      onUpdate: (self) => {
        select(Math.min(steps, Math.round(self.progress * steps)));
        if (hint) {
          gsap.to(hint, { autoAlpha: self.progress > 0.02 ? 0 : 1, duration: 0.3, overwrite: true });
        }
      },
    });

    return () => trigger.kill();
  });

  return () => {
    handlers.forEach(({ row, onEnter }) => {
      row.removeEventListener("pointerenter", onEnter);
      row.removeEventListener("focus", onEnter);
    });
    playBtn?.removeEventListener("click", onPlay);
    wide.removeEventListener("change", placePlates);
    mm.revert();
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
  const counter = overlay.querySelector<HTMLElement>("[data-reel-lightbox-counter]");
  const prevBtn = overlay.querySelector<HTMLElement>("[data-reel-prev]");
  const nextBtn = overlay.querySelector<HTMLElement>("[data-reel-next]");
  if (!video || !panel) return () => {};

  // La cinta duplica las tarjetas para poder hacer el bucle; la lista de reproducción
  // se arma solo con los originales, para que prev/next no recorra cada reel dos veces.
  const playlist = heroes.filter((t) => t.getAttribute("aria-hidden") !== "true");

  let lastFocused: HTMLElement | null = null;
  let current = 0;

  /** Carga el reel `i` en el reproductor ya abierto. */
  const load = (i: number) => {
    const tile = playlist[i];
    if (!tile?.dataset.src) return;

    current = i;
    video.src = tile.dataset.src;
    video.currentTime = 0;
    if (caption) caption.textContent = tile.dataset.caption ?? "";
    if (counter) counter.textContent = `${i + 1} / ${playlist.length}`;
    void video.play().catch(() => {});
  };

  const step = (delta: number) => {
    if (!playlist.length) return;
    load((current + delta + playlist.length) % playlist.length);
  };

  const show = (tile: HTMLElement) => {
    if (!tile.dataset.src) return;

    // Si el click vino de un clon de la cinta, no está en la lista: se resuelve
    // por su data-index, que apunta al reel original.
    const found = playlist.indexOf(tile);
    const i = found >= 0 ? found : Number(tile.dataset.index ?? 0);
    if (!playlist[i]) return;

    lastFocused = tile;
    load(i);

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
    if (overlay.hidden) return;
    if (event.key === "Escape") hide();
    // Las flechas navegan entre reels; sin esto habría que cerrar y volver a elegir.
    if (event.key === "ArrowRight") step(1);
    if (event.key === "ArrowLeft") step(-1);
  };

  const onPrev = () => step(-1);
  const onNext = () => step(1);

  const onOverlayClick = (event: MouseEvent) => {
    const target = event.target as HTMLElement;
    // Cierra al hacer click en el fondo, pero no sobre el panel ni sobre los
    // controles: prev/next viven fuera del panel y sin esta guarda cerrarían.
    if (panel.contains(target)) return;
    if (target.closest("[data-reel-prev],[data-reel-next],[data-reel-close]")) return;
    hide();
  };

  heroes.forEach((tile) => tile.addEventListener("click", onTileActivate));
  closeBtn?.addEventListener("click", hide);
  prevBtn?.addEventListener("click", onPrev);
  nextBtn?.addEventListener("click", onNext);
  overlay.addEventListener("click", onOverlayClick);
  document.addEventListener("keydown", onKeydown);

  return () => {
    heroes.forEach((tile) => tile.removeEventListener("click", onTileActivate));
    closeBtn?.removeEventListener("click", hide);
    prevBtn?.removeEventListener("click", onPrev);
    nextBtn?.removeEventListener("click", onNext);
    overlay.removeEventListener("click", onOverlayClick);
    document.removeEventListener("keydown", onKeydown);
    document.body.style.overflow = "";
    video.pause();
  };
}

/** Punto de entrada único de la sección de reels. */
export function initReels(root: ParentNode = document) {
  teardowns.push(initLoops(root), initStage(root), initLightbox(root));
}

/** Limpieza para View Transitions: evita listeners y videos huérfanos entre navegaciones. */
export function destroyReels() {
  while (teardowns.length) teardowns.pop()?.();
}

if (typeof document !== "undefined") {
  document.addEventListener("astro:before-swap", destroyReels);
}
