import type { APIRoute } from "astro"
import client from "../../utilities/client"

export const GET: APIRoute = async ({
	url: { searchParams },
	session,
	redirect
}) => {
	const callback = await client.callback(searchParams)

	// console.log(
	// 	"authorize() was called with state:",
	// 	callback.state ?
	// 		JSON.parse(callback.state)
	// 	:	undefined
	// )
	// console.log(
	// 	"User authenticated as:",
	// 	callback.session.did
	// )

	session?.set("did", callback.session.did)

	if (callback.state)
		return redirect(
			"/profile?" +
				new URLSearchParams(
					JSON.parse(callback.state)
				),
			307
		)
	else return redirect("/profile", 307)
}
