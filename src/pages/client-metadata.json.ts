import type { APIRoute } from "astro"
import client from "../utilities/client"

export const GET: APIRoute = async () =>
	Response.json(client.clientMetadata)
