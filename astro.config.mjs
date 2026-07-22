// @ts-check
import { defineConfig } from 'astro/config';

export default defineConfig({
  // La landing es un menú de dos opciones: al apuntar una banda se precarga esa página,
  // así la navegación posterior al wipe es instantánea.
  prefetch: {
    prefetchAll: true,
    defaultStrategy: 'hover',
  },
});
