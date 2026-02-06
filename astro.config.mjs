// @ts-check
import netlify from "@astrojs/netlify"
import { loadEnv } from "vite"

const { SITE } = loadEnv(
	process.env.SITE ?? "",
	process.cwd(),
	""
)

// https://astro.build/config
const config = {
	output: "server",
	adapter: netlify({
		edgeMiddleware: true,
		imageCDN: false
	}),
	site: SITE,
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
		driver: "memory"
	}
}

export default config
