// @ts-check
import { defineConfig, fontProviders } from "astro/config";

import react from "@astrojs/react";

// https://astro.build/config
export default defineConfig({
  integrations: [react()],
  fonts: [
    {
      provider: fontProviders.google(),
      name: "Montserrat",
      cssVariable: "--font-montserrat",
      fallbacks: ["sans-serif"],
    },
    {
      provider: fontProviders.google(),
      name: "Playfair Display",
      cssVariable: "--font-playfair-display",
      fallbacks: ["serif"],
    },
  ],
  site: "https://ranmerc.github.io",
});
