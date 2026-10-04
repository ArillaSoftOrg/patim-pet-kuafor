import { readFile } from "node:fs/promises";
import { join } from "node:path";

// Shared by src/app/opengraph-image.tsx and src/app/twitter-image.tsx so
// there's one image definition, not two copies to keep in sync. Colors are
// the literal values from src/app/globals.css (--background, --foreground,
// --primary) — this renders through Satori, which can't read the app's
// CSS custom properties. Intentionally skips Open Sauce One (not shipped
// in the repo yet) and uses Satori's default sans rather than trying to
// load a font file that doesn't exist.
export const socialImageSize = { width: 1200, height: 630 };
export const socialImageAlt = "Patim Pet Kuaför — Dog Grooming Salon";

export async function renderSocialImageElement() {
  const logoBuffer = await readFile(join(process.cwd(), "public/brand/logo.png"));
  const logoSrc = `data:image/png;base64,${logoBuffer.toString("base64")}`;

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#fdf8f2",
      }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element -- decorative
          mark in a generated image; "Patim Pet Kuaför" is rendered as real
          text right below it */}
      <img
        src={logoSrc}
        alt=""
        width={140}
        height={140}
        style={{ borderRadius: 9999, border: "6px solid #3c1704" }}
      />
      <div
        style={{
          marginTop: 40,
          fontSize: 84,
          fontWeight: 700,
          color: "#2b2016",
        }}
      >
        Patim Pet Kuaför
      </div>
      <div
        style={{
          marginTop: 20,
          fontSize: 38,
          color: "#3c1704",
        }}
      >
        Dog Grooming Salon
      </div>
    </div>
  );
}
