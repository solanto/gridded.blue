// @ts-check
import vercel from "@astrojs/vercel"
import { loadEnv } from "vite"

const { SITE_URL } = loadEnv(
	process.env.SITE_URL ?? "",
	process.cwd(),
	""
)

// https://astro.build/config
const config = {
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
		session: true
	},
	session: {
		driver: process.env.VERCEL ? "vercel-kv" : "fs"
	}
}

export default config
