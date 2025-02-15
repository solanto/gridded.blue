export default function (
	searchParams: URLSearchParams,
	profile: string | undefined = undefined
): URLSearchParams {
	const newParams = new URLSearchParams(searchParams)

	if (profile) newParams.set("profile", profile)

	return newParams
}
