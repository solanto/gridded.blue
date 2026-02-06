import type { APIRoute } from "astro"
import client from "../../utilities/client"

export const GET: APIRoute = async ({
	url: { searchParams },
	session
}) => {
	session?.destroy()

	return Response.redirect(
		await client.authorize("https://bsky.social", {
			state: JSON.stringify(
				Object.fromEntries(searchParams)
			)
		}),
		307
	)
}
