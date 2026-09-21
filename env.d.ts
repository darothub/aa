/**
 * Minimal shape of Cloudflare's native Rate Limiting binding — declared by
 * hand rather than pulled from @cloudflare/workers-types, which this project
 * doesn't depend on.
 */
interface RateLimiter {
  limit(options: { key: string }): Promise<{ success: boolean }>;
}

/**
 * Secrets are set with `wrangler secret put`, so they never appear in
 * wrangler.toml and `wrangler types` cannot see them. Declaring them here
 * merges with the generated CloudflareEnv interface, which keeps them
 * type-checked without committing their values.
 *
 * Optional on purpose: a Worker with a secret missing should fail the one
 * request that needs it, not the build.
 */
interface CloudflareEnv {
  GUEST_PASSCODE?: string;
  COUPLE_PASSCODE?: string;
  SESSION_SECRET?: string;
  ANTHROPIC_API_KEY?: string;
  TRAVEL_CHAT_RATE_LIMITER?: RateLimiter;
}
