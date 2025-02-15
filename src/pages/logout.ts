import type { APIRoute } from "astro"
import client from "../utilities/client"
import * as SessionGetter from "../utilities/session-getter"

export const GET: APIRoute = async ({
	session,
	redirect
}) => {
	const did = await SessionGetter.did(session)
	if (did) client.revoke(did)

	session?.destroy()

	return redirect("/")
}
