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
		isr: true,
		edgeMiddleware: true,
		imageService: true,
		imagesConfig: {
			domains: ["bsky.app"],
			sizes: [1400, 500, 200]
		}
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
