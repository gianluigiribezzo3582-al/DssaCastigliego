import type { ImageMetadata } from "astro";

// Foto delle sezioni: src/assets/foto/<id-sezione>.<estensione>, es.
// src/assets/foto/mi-presento.jpg. Se il file manca, fotoPer() restituisce
// undefined e chi la usa mostra un'alternativa (riquadro "Foto in arrivo" in
// home, nessuna og:image nei metadati).
const fotoDisponibili = import.meta.glob<{ default: ImageMetadata }>(
  "../assets/foto/*.{jpg,jpeg,png,webp,avif,JPG,JPEG,PNG,WEBP}",
  { eager: true },
);

export function fotoPer(id: string): ImageMetadata | undefined {
  const percorso = Object.keys(fotoDisponibili).find(
    (p) =>
      p
        .split("/")
        .pop()!
        .replace(/\.[^.]+$/, "") === id,
  );
  return percorso ? fotoDisponibili[percorso].default : undefined;
}
