import { Vibrant } from "node-vibrant/node";
import { fileURLToPath } from "node:url";
import { writeFile } from "node:fs/promises";

import { generateRadixColors } from "./generate-radix-colors.ts";

const imagePath = fileURLToPath(new URL("../theme.jpg", import.meta.url));

async function main() {
  console.log("Extracting colors from theme image...");

  const palette = await Vibrant.from(imagePath).getPalette();

  if (!palette.Vibrant) {
    throw new Error("Node-Vibrant failed to extract Vibrant");
  }

  if (!palette.Muted) {
    throw new Error("Node-Vibrant failed to extract Muted");
  }

  if (!palette.LightMuted) {
    throw new Error("Node-Vibrant failed to extract LightMuted");
  }

  if (!palette.DarkMuted) {
    throw new Error("Node-Vibrant failed to extract DarkMuted");
  }

  /*
   * Node-Vibrant colors are used as reference colors.
   *
   * Vibrant     → accent
   * Muted       → gray reference
   * LightMuted  → light-mode background
   * DarkMuted   → dark-mode background
   */
  const accent = palette.Vibrant.hex;
  const gray = palette.Muted.hex;

  const lightBackground = "#ffffff";
  const darkBackground = "#000000";

  const light = generateRadixColors({
    appearance: "light",
    accent,
    gray,
    background: lightBackground,
  });

  const dark = generateRadixColors({
    appearance: "dark",
    accent,
    gray,
    background: darkBackground,
  });

  const css = `
/*
 * THIS FILE IS GENERATED.
 * Do not edit manually.
 *
 * Generated from: src/assets/theme.jpg
 */

:root {
${generateScale("accent", light.accentScale)}
${generateScale("accent-a", light.accentScaleAlpha)}
${generateScale("gray", light.grayScale)}
${generateScale("gray-a", light.grayScaleAlpha)}

  --accent-contrast: ${light.accentContrast};
  --accent-surface: ${light.accentSurface};
  --gray-surface: ${light.graySurface};
  --background: ${light.background};
}

@media (prefers-color-scheme: dark) {
  :root {
${generateScale("accent", dark.accentScale)}
${generateScale("accent-a", dark.accentScaleAlpha)}
${generateScale("gray", dark.grayScale)}
${generateScale("gray-a", dark.grayScaleAlpha)}

    --accent-contrast: ${dark.accentContrast};
    --accent-surface: ${dark.accentSurface};
    --gray-surface: ${dark.graySurface};
    --background: ${dark.background};
  }
}
`.trimStart();

  const outputPath = fileURLToPath(
    new URL("../styles/colors.css", import.meta.url),
  );

  await writeFile(outputPath, css);

  console.log(`Colors written to ${outputPath}`);
}

function generateScale(name: string, scale: string[]): string {
  return scale
    .map((color, index) => `  --${name}-${index + 1}: ${color};`)
    .join("\n");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
