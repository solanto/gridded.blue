// @ts-check
import vercel from "@astrojs/vercel"
import { loadEnv } from "vite"

const { SITE } = loadEnv(
	process.env.SITE ?? "",
	process.cwd(),
	""
)

// https://astro.build/config
const config = {
	output: "server",
	adapter: vercel({
		edgeMiddleware: true
		// imageCDN: false
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
