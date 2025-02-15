// @ts-check
import vercel from "@astrojs/vercel"
import { defineConfig } from "astro/config"
import { loadEnv } from "vite"

const { SITE_URL } = loadEnv(
	process.env.SITE_URL ?? "",
	process.cwd(),
	""
)

// https://astro.build/config
export default defineConfig({
	output: "server",
	adapter: vercel({
		edgeMiddleware: true
	}),
	site: SITE_URL,
	vite: {
		server: {
			allowedHosts: [".share.zrok.io"]
		}
	},
	image: {
		domains: ["bsky.app"]
	},
	experimental: {
		session: {
			driver: process.env.VERCEL ? "vercel-kv" : "fs"
		}
	}
})
