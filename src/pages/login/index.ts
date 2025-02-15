import type { APIRoute } from "astro"
import client from "../../utilities/client"

export const GET: APIRoute = async ({
	url: { searchParams },
	session
}) => {
	session?.regenerate()

	const identity = "https://bsky.social"

	return Response.redirect(
		await client.authorize(identity, {
			state: JSON.stringify(
				Object.fromEntries(searchParams)
			)
		}),
		307
	)
}
