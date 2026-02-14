// @ts-check
import netlify from "@astrojs/netlify"
import { defineConfig, passthroughImageService } from "astro/config"
import { loadEnv } from "vite"

const { SITE } = loadEnv(
	process.env.SITE ?? "",
	process.cwd(),
	""
)

// https://astro.build/config
export default defineConfig({
	output: "server",
	adapter: netlify({
		edgeMiddleware: false,
		imageCDN: false
	}),
	site: SITE,
	vite: {
		server: {
			allowedHosts: [".share.zrok.io"]
		}
	},
	image: {
		service: passthroughImageService()
	}
})