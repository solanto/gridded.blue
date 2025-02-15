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
				`/${identity.profile.handle}?${searchParams}`,
				303
			)
		else return redirect(`/?${searchParams}`, 307)
	}

	searchParams.delete("profile")

	return redirect(`/${profile}?${searchParams}`, 307)
}
