import type { APIRoute } from "astro"
import * as SessionGetter from "../utilities/session-getter"

export const GET: APIRoute = async ({
	url: { searchParams },
	redirect,
	session
}) => {
	const profile = searchParams.get("profile")

	if (!profile) {
		const identity =
			await SessionGetter.identity(session)

		if (identity)
			return redirect(
				`/view?profile=${identity.profile.handle}${searchParams ? "&" + searchParams : ""}`,
				303
			)
		else return redirect(`/view${searchParams ? "?" + searchParams : ""}`, 307)
	}

	return redirect(`/view?profile=${profile}${searchParams ? "&" + searchParams : ""}`, 307)
}
