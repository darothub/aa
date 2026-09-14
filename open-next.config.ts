import { defineCloudflareConfig } from '@opennextjs/cloudflare';

// No incremental cache is configured: this site has no ISR or `revalidate`
// routes, so the default (no cache override) is what we want. If a page later
// needs ISR, add an `incrementalCache` here backed by R2 or KV.
export default defineCloudflareConfig();
