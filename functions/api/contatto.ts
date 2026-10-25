import type { PagesFunction } from "@cloudflare/workers-types";
import { gestisciContatto, type EnvContatto } from "../_lib/gestore-contatto";

export type Env = EnvContatto;

/** Cloudflare Pages Function: tutta la logica è in _lib/gestore-contatto.ts. */
export const onRequestPost: PagesFunction<Env> = async ({ request, env }) =>
  gestisciContatto(
    request,
    env,
    request.headers.get("cf-connecting-ip") ?? "0.0.0.0",
  );
