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
export const socialImageAlt = "KulaPAWS — Mobile Dog & Cat Grooming";

export async function renderSocialImageElement() {
  const logoBuffer = await readFile(join(process.cwd(), "public/brand/logo.jpg"));
  const logoSrc = `data:image/jpeg;base64,${logoBuffer.toString("base64")}`;

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#fff9f4",
      }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element -- decorative
          mark in a generated image; "KulaPAWS" is rendered as real text
          right below it */}
      <img
        src={logoSrc}
        alt=""
        width={140}
        height={140}
        style={{ borderRadius: 9999, border: "6px solid #a83e68" }}
      />
      <div
        style={{
          marginTop: 40,
          fontSize: 84,
          fontWeight: 700,
          color: "#292526",
        }}
      >
        KulaPAWS
      </div>
      <div
        style={{
          marginTop: 20,
          fontSize: 38,
          color: "#a83e68",
        }}
      >
        Mobile Dog & Cat Grooming
      </div>
    </div>
  );
}
