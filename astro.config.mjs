// @ts-check
import netlify from "@astrojs/netlify"
import { loadEnv } from "vite"

const { SITE_URL } = loadEnv(
	process.env.SITE_URL ?? "",
	process.cwd(),
	""
)

// https://astro.build/config
const config = {
	output: "server",
	adapter: netlify({
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
		driver: process.env.NETLIFY ? "netlify-blobs" : "fs"
	}
}

export default config
