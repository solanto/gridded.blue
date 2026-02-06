import type { APIRoute } from "astro"
import client from "../../utilities/client"

export const GET: APIRoute = async ({
	url: { searchParams },
	session
}) => {
	return Response.redirect(
		await client.authorize("https://bsky.social", {
			state: JSON.stringify(
				Object.fromEntries(searchParams)
			)
		}),
		307
	)
}
