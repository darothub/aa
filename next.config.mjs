import { initOpenNextCloudflareForDev } from '@opennextjs/cloudflare';

/** @type {import('next').NextConfig} */
const nextConfig = {};

export default nextConfig;

// Makes Cloudflare bindings and `.dev.vars` values visible to `next dev`.
initOpenNextCloudflareForDev();
