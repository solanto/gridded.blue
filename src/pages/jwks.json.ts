import client from "../utilities/client"
import type { APIRoute } from "astro"
import { createHash } from "node:crypto"

const etag = createHash("SHA256")
	.update(JSON.stringify(client.jwks))
	.digest("base64")

const lastModified = new Date().toUTCString()

export const GET: APIRoute = async () =>
	Response.json(client.jwks, {
		status: 200,
		headers: {
			ETag: etag,
			"Last-Modified": lastModified
		}
	})
