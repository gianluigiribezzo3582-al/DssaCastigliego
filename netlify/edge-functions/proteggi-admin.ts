// Netlify Edge Function: protegge /admin con una password (HTTP Basic Auth), come
// fa functions/_middleware.ts su Cloudflare. Attiva solo se su Netlify sono
// impostate ADMIN_BASIC_AUTH_USER e ADMIN_BASIC_AUTH_PASS. Vedi /docs/DEPLOY.md.
import { controllaAccessoAdmin } from "../../functions/_lib/accesso-admin.ts";

declare const Netlify: { env: { get(nome: string): string | undefined } };

export default async (
  request: Request,
  context: { next: () => Promise<Response> },
): Promise<Response> =>
  controllaAccessoAdmin(
    request,
    Netlify.env.get("ADMIN_BASIC_AUTH_USER"),
    Netlify.env.get("ADMIN_BASIC_AUTH_PASS"),
  ) ?? context.next();

export const config = {
  path: ["/admin", "/admin/*"],
};
